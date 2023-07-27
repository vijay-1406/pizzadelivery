const mongoose = require('mongoose')
const Schema = mongoose.Schema

const menuSchema = new Schema({
    name : {type : String, required:true},
    image: {type : Buffer,required:true},
    
    price : {type : Number, required:true},
    size : {type : String, required:true}
})

const Menu = mongoose.model('Menu',menuSchema)

module.exports = Menu
