const
    User = require('../models/userModel'),
    Product = require('../models/productModel'),
    factory = require('./handlerFactory'),
    catchAsync = require('../utils/catchAsync'),
    AppError = require('../utils/appError'),
    Cart = require('../models/cartModel');

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};

exports.updateMe = (req, res, next) => {
    // Remove non-updateable fields
    if (req.body.role || req.body.phone)
        return next(new AppError('Cannot update role or phone number through this route'));

    next();
};

// Cart functionality
exports.addToCart = catchAsync(async (req, res, next) => {
    const cart = new Cart(req.session.cart);
    const productToBeAdded = await Product.findById(req.params.id);

    if (!productToBeAdded)
        return next(new AppError('No product found with that ID'));
      
    cart.addItem(productToBeAdded._id, productToBeAdded.title, productToBeAdded.image, productToBeAdded.price);


    // Store the cart back to session object. Remember that cart.__proto__ will be destroyed. So you need to re create object from Cart constructor
    req.session.cart = cart;

    next();
});

exports.deleteCart = catchAsync(async (req, res, next) => {


    req.session.cart = new Cart();
    next();
});

exports.getCart = catchAsync(async (req, res, next) => {
    const cart = new Cart(req.session.cart);

    res.json({
        status: 'success',
        data: {
            cart
        }
    });
});

exports.removeCartItem = catchAsync (async (req,res,next)=>{

    const cart = new Cart(req.session.cart);
 
 
    const productToBeAdded = await Product.findById(req.params.id);
 
 
 
    if (!productToBeAdded){
 
 
        return next(new AppError('No product found with that ID'));
    }
 
    cart.removeItem(productToBeAdded.id) 
    req.session.cart = cart;

    next();
 
 })