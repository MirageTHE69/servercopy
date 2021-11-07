// Importing modules
const
    Category = require('../models/categoryModel'),
    factory = require('./handlerFactory');

// Controllers
exports.createCategory = factory.createOne(Category);
exports.getAllCategories = factory.getAll(Category);
exports.getCategory = factory.getOne(Category);
exports.updateCategory = factory.updateOne(Category);
exports.deleteCategory = factory.deleteOne(Category);