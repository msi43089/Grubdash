const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass

function validateName(req, res, next){
    const { data: { name } ={} } = req.body
    if(!name){
        next({status: 400, message: "Dish must incluce a name"})
    }
    else {
        next()
    }
}

function validateDescription(req, res, next){
    const { data: { description } ={} } = req.body
    if(!description){
        next({status: 400, message: "Dish must include a description"})
    }
    else {
        next()
    }
}

function validatePrice(req, res, next){
    const { data: { price } ={} } = req.body
    if(price <= 0 || !Number.isInteger(price)){
        next({status: 400, message: "Dish must have a price that is an integer greater than 0"})
    }
    else if(!price) {
        next({status: 400, message: "Dish must include a price"})
    }
    else {
        next()
    }
}

function validateImg(req, res, next){
    const { data: { image_url } ={} } = req.body
    if(!image_url){
        next({status: 400, message: "Dish must include a image_url"})
    }
    else {
        next()
    }
}


function checkId(req, res, next) {
    const { dishId } = req.params
    const foundDish = dishes.find((dish) => dish.id === Number(dishId));
    if(foundDish){
        res.locals.foundDish = foundDish
        res.locals.dishId = Number(dishId)
        next();
    } else {
        next({status: 404, message: `Dish does not exist: ${dishId}`});
    }
}

function idMatch(req, res, next) {
    const { data: { id } = {} } = req.body
    const dishId = Number(req.params.dishId)
    if(id !== dishId){
        next({status: 404, message: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}`})
    }
    else{
        next()
    }
}

function update (req, res, next) {
    const { data: dish = {} } = req.body
    const dishId = Number(req.params.dishId)
    let foundDish = dishes.find((dish) => dishId === dish.id);
    foundDish = {...dish, id: `${dishId}`}
    res.json({data: foundDish})
}

function list (req, res, next) {
    res.json({data: dishes})
}



module.exports = {
        read: [validateName, checkId],
        update: [validateName, validateDescription, validateImg, validateImg, validatePrice, checkId, update],
        list,
        create: [validateName]
}