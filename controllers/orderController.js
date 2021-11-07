// Importing modules
const
    Order = require('../models/orderModel'),
    factory = require('./handlerFactory'),
    catchAsync = require('../utils/catchAsync'),
    AppError = require('../utils/appError'),
    
    Cart = require('../models/cartModel');
// Controllers
exports.placeOrder = catchAsync(async (req, res, next) => {


    cart = new Cart(req.session.cart);
    var order;
        try{
 Object.entries(cart.items).forEach(async ([key,item],i )=> {
        console.log(`${item.quantity} item id`);
        order = await Order.create({
            user: req.user._id,
            product: key,
            quantity : item.quantity
        });
         
    });
}catch(err){
    console.log(err);
}

  


 

    res.status(201).json({
        status: 'success',
        message: 'We will contact you in few minutes',
        data: {
            order
        }
    });
});


exports.createOrder = factory.createOne(Order);
exports.getAllOrders = factory.getAll(Order);
exports.getOrder = factory.getOne(Order);
exports.updateOrder = factory.updateOne(Order);
exports.deleteOrder = factory.deleteOne(Order);