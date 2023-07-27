const { update } = require("../../../models/menu")
const menu = require('../../../models/menu')
// var fs = require('fs-extra');
// var path = require('path');
// const multer  = require('multer')
// var storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, './public/uploads/img/')
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.fieldname + '-' + Date.now())
//     }
// });
// const upload = multer({ storage : storage })



function cartController(){
    return{
        index(req,res){
            res.render('customers/cart')
        },
        addtocart(req,res){
            // let cart = {
            //     items: {
            //         pizzaId : {item : pizzaObject, qty : 0}
            //     },
            //     totalQty : 0,
            //     totalPrice : 0
            // }
            //console.log(req.body)
            
            //req.body.image = base64String
            

            if(!req.session.cart){
                req.session.cart ={
                    items : {},
                    totalQty : 0,
                    totalPrice : 0

                }
            }
            let cart = req.session.cart
            
            if(!cart.items[req.body._id]){
                cart.items[req.body._id] = {
                    item : req.body,
                    qty : 1
                }
                cart.totalQty = cart.totalQty + 1
                cart.totalPrice = cart.totalPrice + req.body.price
            } else{
                cart.items[req.body._id].qty = cart.items[req.body._id].qty + 1
                cart.totalQty = cart.totalQty + 1
                cart.totalPrice = cart.totalPrice + req.body.price
            }

            const buffer = Buffer.from(cart.items[req.body._id].item.image);

            const base64String = buffer.toString('base64');
            cart.items[req.body._id].item.image = base64String
            //console.log(cart.items[req.body._id].item.image)
            
            return res.json({totalQty : req.session.cart.totalQty})
        },

        
        deletefromCart(req,res){
            let cart = req.session.cart
            
           
            if(cart.items[req.body._id]){
                cart.items[req.body._id].qty = cart.items[req.body._id].qty - 1
                if( cart.items[req.body._id].qty == 0){
                    delete cart.items[req.body._id]
                }
                cart.totalQty = cart.totalQty - 1
                cart.totalPrice = cart.totalPrice - req.body.price
            }
            
            //return res.json({data : "all is ok"})
            
            return res.json({totalQty : req.session.cart.totalQty})
        }
    }
}

module.exports = cartController