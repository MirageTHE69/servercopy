// Importing modules
const
    Product = require('../models/productModel'),
    handlerFactory = require('./handlerFactory');

// Controllers
exports.createProduct = handlerFactory.createOne(Product);
exports.getAllProducts = handlerFactory.getAll(Product);
exports.getProduct = handlerFactory.getOne(Product);
exports.updateProduct = handlerFactory.updateOne(Product);
exports.deleteProduct = handlerFactory.deleteOne(Product);