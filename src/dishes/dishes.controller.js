const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass

function checkId(req, res, next){
   const { dishId } = req.params;
   const foundDish = dishes.find((dish) => dish.id === dishId);
   if(foundDish){
     res.locals.dishId = dishId
     res.locals.foundDish = foundDish
     next();
   } else {
     next({status: 404, message: `Dish does not exist: ${dishId}`});
   }
}

function matchId(req,res,next){
  const { data: { id } = {} } = req.body;
  if(id && id !== res.locals.dishId){
    next({status: 400, message: `Dish id does not match route id. Dish: ${id}, Route: ${res.locals.dishId}`});
  } else {
    next();
  }
}

function validateName(req, res, next){
    const { data: { name } ={} } = req.body;
    if(!name){
        next({status: 400, message: "Dish must incluce a name"});
    }
    else {
        next();
    }
}

function validateDescription(req, res, next){
    const { data: { description } ={} } = req.body;
    if(!description){
        next({status: 400, message: "Dish must include a description"});
    }
    else {
        next();
    }
}

function validatePrice(req, res, next){
    const { data: { price } ={} } = req.body;
    if(price <= 0 || !Number.isInteger(price)){
        next({status: 400, message: "Dish must have a price that is an integer greater than 0"});
    }
    else if(!price) {
        next({status: 400, message: "Dish must include a price"});
    }
    else {
        next();
    }
}

function validateImg(req, res, next){
    const { data: { image_url } ={} } = req.body;
    if(!image_url){
        next({status: 400, message: "Dish must include a image_url"});
    }
    else {
        next();
    }
}

function create(req, res, next) {
  const { data: dish = {} } = req.body;
  const newId = nextId();
  let newDish = {...dish,
    id: newId   
  }
  dishes.push(newDish);
  res.status(201).json({data: newDish});
}

function read(req, res, next){
    res.json({data: res.locals.foundDish});

}

function update (req, res, next) {
    const { data: dish = {} } = req.body;
    res.locals.foundDish = {...dish, id: `${res.locals.dishId}`}
    res.json({data: res.locals.foundDish});
}

function list (req, res, next) {
    res.json({data: dishes});
}



module.exports = {
        read: [
          checkId, 
          read],
        update: [
          checkId, 
          matchId, 
          validateName, 
          validateDescription, 
          validateImg, 
          validateImg, 
          validatePrice, 
          update],
        list,
        create: [
          validateName, 
          validateDescription, 
          validateImg, 
          validateImg, 
          validatePrice, 
          create ]
}