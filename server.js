require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const ejs = require("ejs")
const expressLayout = require("express-ejs-layouts")
const { constants } = require('buffer')
const session = require('express-session')
const flash = require('express-flash')
const MongoStore = require('connect-mongo')
const passport = require('passport')
const Emitter = require('events')
//var bodyParser = require('body-parser')
const multer = require('multer')



//  Database connection
const mongoose = require('mongoose')
mongoose.set('strictQuery', true);

//var connectionUrl = "mongodb://localhost:27017/pizza"
mongoose.connect(process.env.MONGO_CONNECTION_URL, {useNewUrlParser: true, useUnifiedTopology: true}, (err)=>{
    if(err) throw err
    console.log("Connected")
})

//store image

const upload = multer({ dest: "uploads/" });


// Event emitter
const eventEmitter = new Emitter()
app.set('eventEmitter', eventEmitter)



//Session config
app.use(session({
    secret : process.env["SESSION_SECRET"],
    resave : false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_CONNECTION_URL,collection:'sessions' }),
    saveUninitialized : false, 
    cookie : {maxAge : 1000*60*60*24}
}))
//Passport config 
const passportInit = require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

//Global middleware
app.use((req,res,next)=>{
    res.locals.session = req.session
    res.locals.user = req.user
    next()
})


// app.use(express.json())
// app.use(express.urlencoded({extended : false}))
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

app.use(expressLayout)
app.use(express.static('public'))
app.use(express.static(path.join(__dirname, 'public')));
app.set('views',path.join(__dirname,'/resources/views'))
app.set('view engine','ejs')

var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: "50mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));

require('./routes/web')(app)
app.use((req,res)=>{
    res.status(404).render('errors/404')
})

const PORT = process.env.PORT || 3000
const server = app.listen(PORT, ()=>{
    console.log(`App listening on port ${PORT}`)
}) 

const io = require('socket.io')(server)
io.on('connection', (socket) => {
      // Join
      socket.on('join', (orderId) => {
        socket.join(orderId)
      })
})


eventEmitter.on('orderUpdated', (data) => {
    io.to(`order_${data.id}`).emit('orderUpdated', data)
})

eventEmitter.on('orderPlaced', (data) => {
    io.to('adminRoom').emit('orderPlaced', data)
})