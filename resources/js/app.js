import axios from 'axios'
import Noty from 'noty'
import { initAdmin } from './admin'
const moment = require('moment')
import { initStripe } from './stripe'

let addToCart = document.querySelectorAll('.add-to-cart')
let cartCounter = document.querySelector('#cartCounter')
function movetoCart(pizza){
    axios.post('/add-to-cart',pizza).then(res=>{
        cartCounter.innerText = res.data.totalQty
        new Noty({
            type : 'success',
            timeout : 1000,
            progressBar : false,
            text : 'Item added to cart'
        }).show()
    }).catch(err =>{
        new Noty({
            type : 'error',
            timeout : 1000,
            progressBar : false,
            text : 'Something went wrong'
        })
    })
}

addToCart.forEach((btn)=>{
    btn.addEventListener('click',(e)=>{
        let pizza = JSON.parse(btn.dataset.pizza)
        movetoCart(pizza)
        window.location.reload()
        
    })
})

let deleteFromCart = document.querySelectorAll('.delete-from-cart')

function removefromCart(deletepizza){
    axios.post('/delete-from-cart',deletepizza).then((res)=>{
        cartCounter.innerText = res.data.totalQty
        new Noty({
            type : 'success',
            timeout : 1000,
            progressBar : false,
            text : 'Item deleted from Cart'
        }).show()
    }).catch(err =>{
        new Noty({
            type : 'error',
            timeout : 1000,
            progressBar : false,
            text : 'Something went wrong'
        })
    })
}

deleteFromCart.forEach((btn)=>{
    btn.addEventListener('click',(e)=>{  
        let deletepizza = JSON.parse(btn.dataset.pizza)
        removefromCart(deletepizza)
        window.location.reload()
        

    })
})

const alertMsg = document.querySelector('#success-alert')
if(alertMsg) {
    setTimeout(() => {
        alertMsg.remove()
    }, 2000)
}











// Change order status
let statuses = document.querySelectorAll('.status_line')
let hiddenInput = document.querySelector('#hiddenInput')
let order = hiddenInput ? hiddenInput.value : null
order = JSON.parse(order)
let time = document.createElement('small')

function updateStatus(order) {
    statuses.forEach((status) => {
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })
    let stepCompleted = true;
    statuses.forEach((status) => {
       let dataProp = status.dataset.status
       if(stepCompleted) {
            status.classList.add('step-completed')
       }
       if(dataProp === order.status) {
            stepCompleted = false
            time.innerText = moment(order.updatedAt).format('hh:mm A')
            status.appendChild(time)
           if(status.nextElementSibling) {
            status.nextElementSibling.classList.add('current')
           }
       }
    })

}

updateStatus(order);

initStripe()






//Ajax call
// const paymentForm = document.querySelector('#payment-form')
// if(paymentForm){
//     paymentForm.addEventListener('submit',(e) =>{
//         e.preventDefault()
//         let formData = new FormData(paymentForm)
//         let formObject = {}
//         for(let  [key, value] of formData.entries()){
//             formObject[key] = value  
//         }
//         axios.post('/orders',formObject).then((res)=>{
//             new Noty({
//                 type : 'success',
//                 timeout : 1000,
//                 progressBar : false,
//                 text : res.data.message
//             }).show();
//             setTimeout(() => {
//                 window.location.href = '/customers/orders';
//             }, 1000);
            
//         }).catch((err)=>{
//             new Noty({
//                 type : 'success',
//                 timeout : 1000,
//                 progressBar : false,
//                 text : err.res.data.message
//             }).show()
//         })
//         console.log(formObject)
    
       
//     })
    
    
// }

// Socket
let socket = io()

// Join
if(order) {
    socket.emit('join', `order_${order._id}`)
}
let adminAreaPath = window.location.pathname
if(adminAreaPath.includes('admin')) {
    initAdmin(socket)
    socket.emit('join', 'adminRoom')
}


socket.on('orderUpdated', (data) => {
    const updatedOrder = { ...order }
    updatedOrder.updatedAt = moment().format()
    updatedOrder.status = data.status
    updateStatus(updatedOrder)
    new Noty({
        type: 'success',
        timeout: 1000,
        text: 'Order updated',
        progressBar: false,
    }).show();
})

