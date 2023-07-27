/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./app/config/passport.js":
/*!********************************!*\
  !*** ./app/config/passport.js ***!
  \********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const LocalStrategy = (__webpack_require__(/*! passport-local */ \"passport-local\").Strategy);\nconst User = __webpack_require__(/*! ../models/user */ \"./app/models/user.js\");\nconst bcrypt = __webpack_require__(/*! bcrypt */ \"bcrypt\");\nfunction init(passport) {\n  passport.use(new LocalStrategy({\n    usernameField: 'email'\n  }, async (email, password, done) => {\n    //Login\n    //Check if email exists\n    const user = await User.findOne({\n      email: email\n    });\n    if (!user) {\n      return done(null, false, {\n        message: 'No user with this email'\n      });\n    }\n    bcrypt.compare(password, user.password).then(match => {\n      if (match) {\n        return done(null, user, {\n          message: 'Logged In Successfully'\n        });\n      }\n      return done(null, false, {\n        message: 'Wrong username or password'\n      });\n    }).catch(err => {\n      return done(null, false, {\n        message: 'Something went wrong'\n      });\n    });\n  }));\n  passport.serializeUser((user, done) => {\n    done(null, user._id);\n  });\n  passport.deserializeUser((id, done) => {\n    User.findById(id, (err, user) => {\n      done(err, user);\n    });\n  });\n}\nmodule.exports = init;\n\n//# sourceURL=webpack://pizza_delivery/./app/config/passport.js?");

/***/ }),

/***/ "./app/http/controllers/admin/orderController.js":
/*!*******************************************************!*\
  !*** ./app/http/controllers/admin/orderController.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const order = __webpack_require__(/*! ../../../models/order */ \"./app/models/order.js\");\n\n//const Order = require('../../../models/order')\n\nfunction orderController() {\n  return {\n    index(req, res) {\n      order.find({\n        status: {\n          $ne: 'completed'\n        }\n      }, null, {\n        sort: {\n          'createdAt': -1\n        }\n      }).populate('customerId', '-password').exec((err, orders) => {\n        if (req.xhr) {\n          return res.json(orders);\n        } else {\n          return res.render('admin/orders');\n        }\n      });\n    }\n  };\n}\nmodule.exports = orderController;\n\n//# sourceURL=webpack://pizza_delivery/./app/http/controllers/admin/orderController.js?");

/***/ }),

/***/ "./app/http/controllers/admin/statusController.js":
/*!********************************************************!*\
  !*** ./app/http/controllers/admin/statusController.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const Order = __webpack_require__(/*! ../../../models/order */ \"./app/models/order.js\");\nfunction statusController() {\n  return {\n    update(req, res) {\n      Order.updateOne({\n        _id: req.body.orderId\n      }, {\n        status: req.body.status\n      }, (err, data) => {\n        if (err) {\n          return res.redirect('/admin/orders');\n        }\n        // Emit event \n        const eventEmitter = req.app.get('eventEmitter');\n        eventEmitter.emit('orderUpdated', {\n          id: req.body.orderId,\n          status: req.body.status\n        });\n        return res.redirect('/admin/orders');\n      });\n    }\n  };\n}\nmodule.exports = statusController;\n\n//# sourceURL=webpack://pizza_delivery/./app/http/controllers/admin/statusController.js?");

/***/ }),

/***/ "./app/http/controllers/authController.js":
/*!************************************************!*\
  !*** ./app/http/controllers/authController.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const User = __webpack_require__(/*! ../../models/user */ \"./app/models/user.js\");\nconst bcrypt = __webpack_require__(/*! bcrypt */ \"bcrypt\");\nconst passport = __webpack_require__(/*! passport */ \"passport\");\nfunction authController() {\n  const _getRedirectUrl = req => {\n    return req.user.role === 'admin' ? '/admin/orders' : '/';\n  };\n  return {\n    login(req, res) {\n      res.render('auth/login');\n    },\n    postLogin(req, res, next) {\n      const {\n        email,\n        password\n      } = req.body;\n      //Validate request\n      if (!email || !password) {\n        req.flash('error', 'All fields are required');\n        return res.redirect('/login');\n      }\n      passport.authenticate('local', (err, user, info) => {\n        if (err) {\n          req.flash('error', info.message);\n          return next(err);\n        }\n        if (!user) {\n          req.flash('error', info.message);\n          return res.redirect('/login');\n        }\n        req.logIn(user, err => {\n          if (err) {\n            req.flash('error', info.message);\n            return next(err);\n          }\n          return res.redirect(_getRedirectUrl(req));\n        });\n      })(req, res, next);\n    },\n    register(req, res) {\n      res.render('auth/register');\n    },\n    async postRegister(req, res) {\n      const {\n        name,\n        email,\n        password\n      } = req.body;\n      //Validate request\n      if (!name || !email || !password) {\n        req.flash('error', 'All fields are required');\n        req.flash('name', name);\n        req.flash('email', email);\n        return res.redirect('/register');\n      }\n\n      //Check if email already exists\n      User.exists({\n        email: email\n      }, (err, result) => {\n        if (result) {\n          req.flash('error', 'User email already exists');\n          req.flash('name', name);\n          req.flash('email', email);\n          return res.redirect('/register');\n        }\n      });\n\n      //Hash password\n      const hasshedPassword = await bcrypt.hash(password, 10);\n\n      //Create a user in database\n      const user = new User({\n        name,\n        email,\n        password: hasshedPassword\n      });\n      user.save().then(user => {\n        //Login\n\n        return res.redirect('/');\n      }).catch(err => {\n        req.flash('error', 'Something went wrong');\n        return res.redirect('/register');\n      });\n    },\n    logout(req, res, next) {\n      req.logout(function (err) {\n        if (err) {\n          return next(err);\n        }\n        res.redirect('/login');\n      });\n    }\n  };\n}\nmodule.exports = authController;\n\n//# sourceURL=webpack://pizza_delivery/./app/http/controllers/authController.js?");

/***/ }),

/***/ "./app/http/controllers/customers/cartController.js":
/*!**********************************************************!*\
  !*** ./app/http/controllers/customers/cartController.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const {\n  update\n} = __webpack_require__(/*! ../../../models/menu */ \"./app/models/menu.js\");\nconst menu = __webpack_require__(/*! ../../../models/menu */ \"./app/models/menu.js\");\n// var fs = require('fs-extra');\n// var path = require('path');\n// const multer  = require('multer')\n// var storage = multer.diskStorage({\n//     destination: (req, file, cb) => {\n//         cb(null, './public/uploads/img/')\n//     },\n//     filename: (req, file, cb) => {\n//         cb(null, file.fieldname + '-' + Date.now())\n//     }\n// });\n// const upload = multer({ storage : storage })\n\nfunction cartController() {\n  return {\n    index(req, res) {\n      res.render('customers/cart');\n    },\n    addtocart(req, res) {\n      // let cart = {\n      //     items: {\n      //         pizzaId : {item : pizzaObject, qty : 0}\n      //     },\n      //     totalQty : 0,\n      //     totalPrice : 0\n      // }\n      //console.log(req.body)\n\n      //req.body.image = base64String\n\n      if (!req.session.cart) {\n        req.session.cart = {\n          items: {},\n          totalQty: 0,\n          totalPrice: 0\n        };\n      }\n      let cart = req.session.cart;\n      if (!cart.items[req.body._id]) {\n        cart.items[req.body._id] = {\n          item: req.body,\n          qty: 1\n        };\n        cart.totalQty = cart.totalQty + 1;\n        cart.totalPrice = cart.totalPrice + req.body.price;\n      } else {\n        cart.items[req.body._id].qty = cart.items[req.body._id].qty + 1;\n        cart.totalQty = cart.totalQty + 1;\n        cart.totalPrice = cart.totalPrice + req.body.price;\n      }\n      const buffer = Buffer.from(cart.items[req.body._id].item.image);\n      const base64String = buffer.toString('base64');\n      cart.items[req.body._id].item.image = base64String;\n      //console.log(cart.items[req.body._id].item.image)\n\n      return res.json({\n        totalQty: req.session.cart.totalQty\n      });\n    },\n    deletefromCart(req, res) {\n      let cart = req.session.cart;\n      if (cart.items[req.body._id]) {\n        cart.items[req.body._id].qty = cart.items[req.body._id].qty - 1;\n        if (cart.items[req.body._id].qty == 0) {\n          delete cart.items[req.body._id];\n        }\n        cart.totalQty = cart.totalQty - 1;\n        cart.totalPrice = cart.totalPrice - req.body.price;\n      }\n\n      //return res.json({data : \"all is ok\"})\n\n      return res.json({\n        totalQty: req.session.cart.totalQty\n      });\n    }\n  };\n}\nmodule.exports = cartController;\n\n//# sourceURL=webpack://pizza_delivery/./app/http/controllers/customers/cartController.js?");

/***/ }),

/***/ "./app/http/controllers/customers/orderController.js":
/*!***********************************************************!*\
  !*** ./app/http/controllers/customers/orderController.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const Order = __webpack_require__(/*! ../../../models/order */ \"./app/models/order.js\");\nconst moment = __webpack_require__(/*! moment */ \"moment\");\nconst Stripe = __webpack_require__(/*! stripe */ \"stripe\");\nconst stripe = Stripe('sk_test_51MHREESAIB73QxtIsYM5Ue6XjSjE1Ir4Z7qn9yXO51Sa3TGZBv4iF4LBQYuYRfkYDeqajAzn4AZKl3ijUfGRi8zQ00ZwvLQe8q');\nfunction orderController() {\n  return {\n    store(req, res) {\n      //Validate request\n      const {\n        phone,\n        address,\n        stripeToken,\n        paymentType\n      } = req.body;\n      console.log(req.body);\n      if (!phone || !address) {\n        return res.status(422).json({\n          message: 'All fields are required'\n        });\n      }\n      const order = new Order({\n        customerId: req.user._id,\n        items: req.session.cart.items,\n        phone,\n        address\n      });\n      order.save().then(result => {\n        Order.populate(result, {\n          path: 'customerId'\n        }, (err, placedOrder) => {\n          //req.flash('success','Order placed Successfully')\n\n          //stripe payment\n          if (paymentType === 'card') {\n            stripe.charges.create({\n              amount: req.session.cart.totalPrice * 100,\n              source: stripeToken,\n              currency: 'inr',\n              description: `Pizza order: ${placedOrder._id}`\n            }).then(() => {\n              placedOrder.paymentStatus = true;\n              placedOrder.paymentType = paymentType;\n              placedOrder.save().then(order => {\n                // Emit\n                const eventEmitter = req.app.get('eventEmitter');\n                eventEmitter.emit('orderPlaced', order);\n                delete req.session.cart;\n                return res.json({\n                  message: 'Payment successful, Order placed successfully'\n                });\n              }).catch(err => {\n                console.log(err);\n              });\n            }).catch(err => {\n              delete req.session.cart;\n              return res.json({\n                message: 'OrderPlaced but payment failed, You can pay at delivery time'\n              });\n            });\n          } else {\n            delete req.session.cart;\n            return res.json({\n              message: 'Order placed succesfully'\n            });\n          }\n        });\n      }).catch(err => {\n        return res.status(500).json({\n          message: 'Something went wrong'\n        });\n      });\n    },\n    async index(req, res) {\n      const orders = await Order.find({\n        customerId: req.user._id\n      }, null, {\n        sort: {\n          'createdAt': -1\n        }\n      });\n      res.header('Cache-Control', 'no-store');\n      res.render('customers/orders', {\n        orders: orders,\n        moment: moment\n      });\n    },\n    async show(req, res) {\n      const order = await Order.findById(req.params.id);\n      // Authorize user\n      if (req.user._id.toString() === order.customerId.toString()) {\n        return res.render('customers/singleOrder', {\n          order\n        });\n      }\n      return res.redirect('/');\n    }\n  };\n}\nmodule.exports = orderController;\n\n//# sourceURL=webpack://pizza_delivery/./app/http/controllers/customers/orderController.js?");

/***/ }),

/***/ "./app/http/controllers/homeController.js":
/*!************************************************!*\
  !*** ./app/http/controllers/homeController.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const Menu = __webpack_require__(/*! ../../models/menu */ \"./app/models/menu.js\");\nfunction homeController() {\n  return {\n    async index(req, res) {\n      const pizzas = await Menu.find();\n      //console.log(pizzas)\n      return res.render('home', {\n        pizzas: pizzas\n      });\n    },\n    async menu(req, res) {\n      const pizzas = await Menu.find();\n\n      //console.log(pizzas)\n      return res.render('menu', {\n        pizzas: pizzas\n      });\n    }\n  };\n}\nmodule.exports = homeController;\n\n//# sourceURL=webpack://pizza_delivery/./app/http/controllers/homeController.js?");

/***/ }),

/***/ "./app/http/middleware/admin.js":
/*!**************************************!*\
  !*** ./app/http/middleware/admin.js ***!
  \**************************************/
/***/ ((module) => {

eval("function admin(req, res, next) {\n  if (req.isAuthenticated() && req.user.role === 'admin') {\n    return next();\n  }\n  return res.redirect('/');\n}\nmodule.exports = admin;\n\n//# sourceURL=webpack://pizza_delivery/./app/http/middleware/admin.js?");

/***/ }),

/***/ "./app/http/middleware/auth.js":
/*!*************************************!*\
  !*** ./app/http/middleware/auth.js ***!
  \*************************************/
/***/ ((module) => {

eval("function auth(req, res, next) {\n  if (req.isAuthenticated()) {\n    return next();\n  }\n  return res.redirect('/login');\n}\nmodule.exports = auth;\n\n//# sourceURL=webpack://pizza_delivery/./app/http/middleware/auth.js?");

/***/ }),

/***/ "./app/http/middleware/guest.js":
/*!**************************************!*\
  !*** ./app/http/middleware/guest.js ***!
  \**************************************/
/***/ ((module) => {

eval("function guest(req, res, next) {\n  if (!req.isAuthenticated()) {\n    return next();\n  }\n  return res.redirect('/');\n}\nmodule.exports = guest;\n\n//# sourceURL=webpack://pizza_delivery/./app/http/middleware/guest.js?");

/***/ }),

/***/ "./app/models/menu.js":
/*!****************************!*\
  !*** ./app/models/menu.js ***!
  \****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const mongoose = __webpack_require__(/*! mongoose */ \"mongoose\");\nconst Schema = mongoose.Schema;\nconst menuSchema = new Schema({\n  name: {\n    type: String,\n    required: true\n  },\n  image: {\n    type: Buffer,\n    required: true\n  },\n  price: {\n    type: Number,\n    required: true\n  },\n  size: {\n    type: String,\n    required: true\n  }\n});\nconst Menu = mongoose.model('Menu', menuSchema);\nmodule.exports = Menu;\n\n//# sourceURL=webpack://pizza_delivery/./app/models/menu.js?");

/***/ }),

/***/ "./app/models/order.js":
/*!*****************************!*\
  !*** ./app/models/order.js ***!
  \*****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const mongoose = __webpack_require__(/*! mongoose */ \"mongoose\");\nconst Schema = mongoose.Schema;\nconst orderSchema = new Schema({\n  customerId: {\n    type: mongoose.Schema.Types.ObjectId,\n    ref: 'User',\n    required: true\n  },\n  items: {\n    type: Object,\n    required: true\n  },\n  phone: {\n    type: String,\n    required: true\n  },\n  address: {\n    type: String,\n    required: true\n  },\n  paymentType: {\n    type: String,\n    default: 'COD'\n  },\n  paymentStatus: {\n    type: Boolean,\n    default: false\n  },\n  status: {\n    type: String,\n    default: 'order_placed'\n  }\n}, {\n  timestamps: true\n});\nconst Order = mongoose.model('Order', orderSchema);\nmodule.exports = Order;\n\n//# sourceURL=webpack://pizza_delivery/./app/models/order.js?");

/***/ }),

/***/ "./app/models/user.js":
/*!****************************!*\
  !*** ./app/models/user.js ***!
  \****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const mongoose = __webpack_require__(/*! mongoose */ \"mongoose\");\nconst Schema = mongoose.Schema;\nconst userSchema = new Schema({\n  name: {\n    type: String,\n    required: true\n  },\n  email: {\n    type: String,\n    required: true,\n    unique: true\n  },\n  password: {\n    type: String,\n    required: true\n  },\n  role: {\n    type: String,\n    default: 'customer'\n  }\n}, {\n  timestamps: true\n});\nconst User = mongoose.model('User', userSchema);\nmodule.exports = User;\n\n//# sourceURL=webpack://pizza_delivery/./app/models/user.js?");

/***/ }),

/***/ "./routes/web.js":
/*!***********************!*\
  !*** ./routes/web.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const homeController = __webpack_require__(/*! ../app/http/controllers/homeController */ \"./app/http/controllers/homeController.js\");\nconst authController = __webpack_require__(/*! ../app/http/controllers/authController */ \"./app/http/controllers/authController.js\");\nconst cartController = __webpack_require__(/*! ../app/http/controllers/customers/cartController.js */ \"./app/http/controllers/customers/cartController.js\");\nconst orderController = __webpack_require__(/*! ../app/http/controllers/customers/orderController */ \"./app/http/controllers/customers/orderController.js\");\nconst guest = __webpack_require__(/*! ../app/http/middleware/guest */ \"./app/http/middleware/guest.js\");\nconst auth = __webpack_require__(/*! ../app/http/middleware/auth */ \"./app/http/middleware/auth.js\");\nconst admin = __webpack_require__(/*! ../app/http/middleware/admin */ \"./app/http/middleware/admin.js\");\nconst adminOrderController = __webpack_require__(/*! ../app/http/controllers/admin/orderController */ \"./app/http/controllers/admin/orderController.js\");\nconst statusController = __webpack_require__(/*! ../app/http/controllers/admin/statusController */ \"./app/http/controllers/admin/statusController.js\");\n//const addpizzaContoller = require('../app/http/controllers/admin/addpizzaContoller')\n\nfunction initRoutes(app) {\n  app.get('/', homeController().index);\n  app.get('/menu', homeController().menu);\n  app.get('/login', guest, authController().login);\n  app.post('/login', authController().postLogin);\n  app.get('/register', guest, authController().register);\n  app.post('/register', authController().postRegister);\n  app.post('/logout', authController().logout);\n  app.get('/ordernow', (req, res) => {\n    res.render('ordernow');\n  });\n  app.get('/cart', cartController().index);\n  app.post('/add-to-cart', cartController().addtocart);\n  app.post('/delete-from-cart', cartController().deletefromCart);\n\n  //Customers routes\n  app.post('/orders', auth, orderController().store);\n  app.get('/customers/orders', auth, orderController().index);\n  app.get('/customers/orders/:id', auth, orderController().show);\n\n  //Admin routes\n  app.get('/admin/orders', admin, adminOrderController().index);\n  app.post('/admin/orders/status', admin, statusController().update);\n  app.get('/admin/addpizzas', (req, res) => {\n    res.render('admin/addpizzas');\n  });\n  //app.post('/admin/addpizzas',addpizzaContoller().index)\n  //var ObjectId = require('mongoose').Types.ObjectId; \n  var fs = __webpack_require__(/*! fs-extra */ \"fs-extra\");\n  var path = __webpack_require__(/*! path */ \"path\");\n  const multer = __webpack_require__(/*! multer */ \"multer\");\n  var storage = multer.diskStorage({\n    destination: (req, file, cb) => {\n      cb(null, './public/data/uploads/');\n    },\n    filename: (req, file, cb) => {\n      cb(null, file.fieldname + '-' + Date.now());\n    }\n  });\n  const upload = multer({\n    storage: storage\n  });\n  const Pizza = __webpack_require__(/*! ../app/models/menu */ \"./app/models/menu.js\");\n  app.post('/admin/addpizzas', upload.single('image'), function (req, res) {\n    // // req.file is the name of your file in the form above, here 'uploaded_file'\n    // // req.body will hold the text fields, if there were any\n    //console.log(req.file.path) \n    // var newImg = fs.readFileSync(req.file.path);\n    // var encImg = newImg.toString('base64');\n    //console.log(req.body,req.file)\n    const pizza = new Pizza({\n      name: req.body.pizzaname,\n      size: req.body.pizzasize,\n      price: req.body.pizzaprice,\n      image: fs.readFileSync(path.join('/Users/vijaynomula/VSCODES/pizza_delivery' + '/public/data/uploads/' + req.file.filename))\n    });\n    //console.log(pizza)\n    pizza.save().then(result => {\n      console.log('stored');\n    }).catch(err => {\n      console.log(err);\n    });\n    res.redirect('/');\n  });\n}\nmodule.exports = initRoutes;\n\n//# sourceURL=webpack://pizza_delivery/./routes/web.js?");

/***/ }),

/***/ "./server.js":
/*!*******************!*\
  !*** ./server.js ***!
  \*******************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("(__webpack_require__(/*! dotenv */ \"dotenv\").config)();\nconst express = __webpack_require__(/*! express */ \"express\");\nconst app = express();\nconst path = __webpack_require__(/*! path */ \"path\");\nconst ejs = __webpack_require__(/*! ejs */ \"ejs\");\nconst expressLayout = __webpack_require__(/*! express-ejs-layouts */ \"express-ejs-layouts\");\nconst {\n  constants\n} = __webpack_require__(/*! buffer */ \"buffer\");\nconst session = __webpack_require__(/*! express-session */ \"express-session\");\nconst flash = __webpack_require__(/*! express-flash */ \"express-flash\");\nconst MongoStore = __webpack_require__(/*! connect-mongo */ \"connect-mongo\");\nconst passport = __webpack_require__(/*! passport */ \"passport\");\nconst Emitter = __webpack_require__(/*! events */ \"events\");\n//var bodyParser = require('body-parser')\nconst multer = __webpack_require__(/*! multer */ \"multer\");\n\n//  Database connection\nconst mongoose = __webpack_require__(/*! mongoose */ \"mongoose\");\nmongoose.set('strictQuery', true);\n\n//var connectionUrl = \"mongodb://localhost:27017/pizza\"\nmongoose.connect(process.env.MONGO_CONNECTION_URL, {\n  useNewUrlParser: true,\n  useUnifiedTopology: true\n}, err => {\n  if (err) throw err;\n  console.log(\"Connected\");\n});\n\n//store image\n\nconst upload = multer({\n  dest: \"uploads/\"\n});\n\n// Event emitter\nconst eventEmitter = new Emitter();\napp.set('eventEmitter', eventEmitter);\n\n//Session config\napp.use(session({\n  secret: process.env[\"SESSION_SECRET\"],\n  resave: false,\n  store: MongoStore.create({\n    mongoUrl: process.env.MONGO_CONNECTION_URL,\n    collection: 'sessions'\n  }),\n  saveUninitialized: false,\n  cookie: {\n    maxAge: 1000 * 60 * 60 * 24\n  }\n}));\n//Passport config \nconst passportInit = __webpack_require__(/*! ./app/config/passport */ \"./app/config/passport.js\");\npassportInit(passport);\napp.use(passport.initialize());\napp.use(passport.session());\napp.use(flash());\n\n//Global middleware\napp.use((req, res, next) => {\n  res.locals.session = req.session;\n  res.locals.user = req.user;\n  next();\n});\n\n// app.use(express.json())\n// app.use(express.urlencoded({extended : false}))\napp.use(express.json({\n  limit: '50mb'\n}));\napp.use(express.urlencoded({\n  limit: '50mb'\n}));\napp.use(expressLayout);\napp.use(express.static('public'));\napp.use(express.static(path.join(__dirname, 'public')));\napp.set('views', path.join(__dirname, '/resources/views'));\napp.set('view engine', 'ejs');\nvar bodyParser = __webpack_require__(/*! body-parser */ \"body-parser\");\napp.use(bodyParser.json({\n  limit: \"50mb\",\n  extended: true\n}));\napp.use(bodyParser.urlencoded({\n  limit: \"50mb\",\n  extended: true,\n  parameterLimit: 50000\n}));\n__webpack_require__(/*! ./routes/web */ \"./routes/web.js\")(app);\napp.use((req, res) => {\n  res.status(404).render('errors/404');\n});\nconst PORT = process.env.PORT || 3000;\nconst server = app.listen(PORT, () => {\n  console.log(`App listening on port ${PORT}`);\n});\nconst io = __webpack_require__(/*! socket.io */ \"socket.io\")(server);\nio.on('connection', socket => {\n  // Join\n  socket.on('join', orderId => {\n    socket.join(orderId);\n  });\n});\neventEmitter.on('orderUpdated', data => {\n  io.to(`order_${data.id}`).emit('orderUpdated', data);\n});\neventEmitter.on('orderPlaced', data => {\n  io.to('adminRoom').emit('orderPlaced', data);\n});\n\n//# sourceURL=webpack://pizza_delivery/./server.js?");

/***/ }),

/***/ "bcrypt":
/*!*************************!*\
  !*** external "bcrypt" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("bcrypt");

/***/ }),

/***/ "body-parser":
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("body-parser");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("buffer");

/***/ }),

/***/ "connect-mongo":
/*!********************************!*\
  !*** external "connect-mongo" ***!
  \********************************/
/***/ ((module) => {

"use strict";
module.exports = require("connect-mongo");

/***/ }),

/***/ "dotenv":
/*!*************************!*\
  !*** external "dotenv" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("dotenv");

/***/ }),

/***/ "ejs":
/*!**********************!*\
  !*** external "ejs" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("ejs");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = require("express");

/***/ }),

/***/ "express-ejs-layouts":
/*!**************************************!*\
  !*** external "express-ejs-layouts" ***!
  \**************************************/
/***/ ((module) => {

"use strict";
module.exports = require("express-ejs-layouts");

/***/ }),

/***/ "express-flash":
/*!********************************!*\
  !*** external "express-flash" ***!
  \********************************/
/***/ ((module) => {

"use strict";
module.exports = require("express-flash");

/***/ }),

/***/ "express-session":
/*!**********************************!*\
  !*** external "express-session" ***!
  \**********************************/
/***/ ((module) => {

"use strict";
module.exports = require("express-session");

/***/ }),

/***/ "fs-extra":
/*!***************************!*\
  !*** external "fs-extra" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("fs-extra");

/***/ }),

/***/ "moment":
/*!*************************!*\
  !*** external "moment" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("moment");

/***/ }),

/***/ "mongoose":
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("mongoose");

/***/ }),

/***/ "multer":
/*!*************************!*\
  !*** external "multer" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("multer");

/***/ }),

/***/ "passport":
/*!***************************!*\
  !*** external "passport" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("passport");

/***/ }),

/***/ "passport-local":
/*!*********************************!*\
  !*** external "passport-local" ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = require("passport-local");

/***/ }),

/***/ "socket.io":
/*!****************************!*\
  !*** external "socket.io" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("socket.io");

/***/ }),

/***/ "stripe":
/*!*************************!*\
  !*** external "stripe" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stripe");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./server.js");
/******/ 	
/******/ })()
;