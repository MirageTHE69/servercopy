// Importing modules
const
    Package = require('../models/packageModel'),
    factory = require('./handlerFactory');

// Controllers
exports.createPackage = factory.createOne(Package);
exports.getAllPackages = factory.getAll(Package);
exports.getPackage = factory.getOne(Package);
exports.updatePackage = factory.updateOne(Package);
exports.deletePackage = factory.deleteOne(Package);
