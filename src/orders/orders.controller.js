const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /orders handlers needed to make the tests pass

function validateDeliverTo(req,res, next){
  const { data: { deliverTo } = {} } = req.body
  if(deliverTo){
    next()
  } else {
    next({status: 400, message: "Order must include a deliverTo"})
  }
}

function validateMobile(req,res, next){
  const { data: { mobileNumber } = {} } = req.body
  if(mobileNumber){
    next()
  } else {
    next({status: 400, message: "Order must include a mobileNumber"})
  }
}

function validateDish(req, res, next) {
  const{ data:  { dishes } = {} } = req.body
  if(dishes){
    next()
  } else {
    next({status: 400, message: "Order must include a dish"})
  }
}

function validateDishes(req, res, next) {
  const{ data:  { dishes } = {} } = req.body
  if(Array.isArray(dishes) && dishes.length > 0){
    next()
  } else {
    next({status: 400, message: "Order must include at least one dish"})
  }
}

function validateQuantity(req, res, next){
    const{ data:  { dishes } = {} } = req.body
    const index = dishes.findIndex((dish) => {
      return (!dish.quantity || dish.quantity <= 0 || !Number.isInteger(dish.quantity))})
    if(index > -1){
      next({status: 400, message: `Dish ${index} must have a quantity that is an integer greater than 0`})
    } else {
      next()
    }
}

function checkId(req, res, next){
    const { orderId } = req.params;
    const foundOrder = orders.find((order) => order.id === orderId)
    if(foundOrder){
      res.locals.foundUrl = foundOrder
      next();
    } else {
      next({status: 404, message: `Order does not exist: ${orderId}`})
    }
 }

 function matchId(req,res,next){
    const { orderId } = req.params;
    const { data: { id } = {} } = req.body
    if(id && id !== orderId){
      next({status: 400, message: `Order id does not match route id. Order: ${id}, Route: ${orderId}`})
    } else {
      next()
    }
  }

  function validateStatus(req, res, next) {
      const { data: { status } = {} } = req.body;
      if(status === "pending" ||
         status === "delivered" || 
         status === "out-for-delivery" ||
         status === "preparing"){
        next()
      } else {
        next({status: 400, message: `Order must have a status of pending, preparing, out-for-delivery, delivered`})
      }
  }

  function validatePending(req, res, next) {
    const { orderId } = req.params
    const foundOrder = orders.find((order) => order.id === orderId)
    if(foundOrder.status === "pending"){
      next()
    } else {
      next({status: 400, message: `An order cannot be deleted unless it is pending`})
    }
  }

function list (req, res, next) {
    res.json({data: orders})
}

function read(req, res, next) {
  const { orderId } = req.params
  const foundOrder = orders.find((order) => order.id === orderId);
  res.json({data: foundOrder})
}

function update(req, res, next) {
  const { orderId } = req.params
  const { data: order = {} } = req.body
  let foundOrder = orders.find((order) => order.id === orderId);
  foundOrder = {...order, id: orderId}
  res.json({data: foundOrder})
 
}

function destroy(req, res, next) {
  const { orderId } = req.params
  let index = orders.findIndex((order) => order.id === orderId);
  orders.splice(index,1)
  res.sendStatus(204)
}

function create(req, res, next) {
  const { data: order = {} } = req.body
  const newId = nextId()
  const newOrder = {...order, id: newId}
  orders.push(newOrder)
  res.status(201).json({data: newOrder})
}

module.exports = {
  list,
  read: [checkId, read],
  create: [validateDeliverTo,
           validateMobile, 
           validateDish, 
           validateDishes, 
           validateQuantity, 
           create],
  delete: [checkId,
           validatePending,
    destroy],
  update: [
      checkId, 
      validateDeliverTo, 
      validateMobile, 
      validateDish, 
      validateDishes, 
      validateQuantity, 
      validateStatus,
      matchId,  
      update]
}