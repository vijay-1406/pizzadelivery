const express = require('express')
const app = express()
const path = require('path')
const ejs = require("ejs")
const expressLayout = require("express-ejs-layouts")

//app.use(expressLayout)
app.use(express.static(path.join(__dirname, 'public')));
app.set('views',path.join(__dirname,'/resources/views'))
app.set('view engine','ejs')

const PORT = process.env.PORT || 3000

app.get('/', (req,res)=>{
    res.render('home')
})

app.listen(PORT, ()=>{
    console.log(`App listening on port ${PORT}`)
}) 
