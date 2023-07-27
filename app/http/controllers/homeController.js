const Menu = require('../../models/menu')
function homeController(){
    return{
        async index(req,res){
            const pizzas = await Menu.find()
            //console.log(pizzas)
            //res.sendStatus(200)
             res.render('home',{pizzas:pizzas})
             return res.status(200)
        },
        async menu(req,res){
            const pizzas = await Menu.find()
            
            //console.log(pizzas)
                return res.render('menu',{pizzas:pizzas})
        }
    }
}


module.exports = homeController
