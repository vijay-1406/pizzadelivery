const homeController = require('../app/http/controllers/homeController')
const authController = require('../app/http/controllers/authController')
const cartController = require('../app/http/controllers/customers/cartController.js')
const orderController = require('../app/http/controllers/customers/orderController')
const guest = require( '../app/http/middleware/guest')
const auth = require( '../app/http/middleware/auth')
const admin = require( '../app/http/middleware/admin')
const adminOrderController = require('../app/http/controllers/admin/orderController')
const statusController = require('../app/http/controllers/admin/statusController')
//const addpizzaContoller = require('../app/http/controllers/admin/addpizzaContoller')


function initRoutes(app){

    app.get('/', homeController().index)
    app.get('/menu',homeController().menu)
    app.get('/login',guest, authController().login)
    app.post('/login', authController().postLogin)
    app.get('/register', guest, authController().register)
    app.post('/register', authController().postRegister)
    app.post('/logout', authController().logout)
    app.get('/ordernow', (req,res)=>{
        res.render('ordernow')
    })
    app.get('/cart',cartController().index )
    app.post('/add-to-cart',cartController().addtocart )
    app.post('/delete-from-cart',cartController().deletefromCart )

    //Customers routes
    app.post('/orders',auth,orderController().store)
    app.get('/customers/orders',auth,orderController().index)
    app.get('/customers/orders/:id',auth,orderController().show)

    //Admin routes
    app.get('/admin/orders',admin,adminOrderController().index)
    app.post('/admin/orders/status',admin,statusController().update)
    
    app.get('/admin/addpizzas',(req,res)=>{
        res.render('admin/addpizzas')
    })
    //app.post('/admin/addpizzas',addpizzaContoller().index)
    //var ObjectId = require('mongoose').Types.ObjectId; 
    var fs = require('fs-extra');
    var path = require('path');
    const multer  = require('multer')
    var storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, './public/data/uploads/')
        },
        filename: (req, file, cb) => {
            cb(null, file.fieldname + '-' + Date.now())
        }
    });
    const upload = multer({ storage : storage })
    const Pizza = require('../app/models/menu')
    app.post('/admin/addpizzas', upload.single('image'), function (req, res) {
    // // req.file is the name of your file in the form above, here 'uploaded_file'
    // // req.body will hold the text fields, if there were any
    //console.log(req.file.path) 
            // var newImg = fs.readFileSync(req.file.path);
            // var encImg = newImg.toString('base64');
            //console.log(req.body,req.file)
            const pizza = new Pizza({
                name : req.body.pizzaname,
                size : req.body.pizzasize,
                price : req.body.pizzaprice,
                image : 
                     fs.readFileSync(path.join('/Users/vijaynomula/VSCODES/pizza_delivery' + '/public/data/uploads/' + req.file.filename)),
                    
            })
            //console.log(pizza)
            pizza.save().then(result=>{
                console.log('stored')
            }).catch(err=>{
                console.log(err)
            })
            res.redirect('/')
    });
    
}

module.exports = initRoutes