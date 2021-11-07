// Importing modules
const
    multer = require('multer'),
    sharp = require('sharp'),
    slugify = require('slugify'),
    Service = require('../models/serviceModel'),
    factory = require('./handlerFactory'),
    catchAsync = require('../utils/catchAsync'),
    AppError = require('../utils/appError');

// Configuring multer for service image upload
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image'))
        return cb(null, true);

    cb(new AppError('Not an image! Please upload only images.', 400), false);
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadServiceImage = upload.single('image');

exports.resizeServiceImage = catchAsync(async (req, res, next) => {
    // Remove any predefined image name in req.body
    req.body.image = undefined;

    // Exit this middleware if no file has been uploaded
    if (!req.file)
        return next();

    // Rename for uploaded image
    let serviceSlug;
    if (req.method === 'PATCH')
        serviceSlug = (await Service.findById(req.params.id)).slug;
    else
        serviceSlug = slugify(req.body.title, { replacement: '-', lower: true });

    const filePath = `images/services/${serviceSlug}.png`;

    // Process image
    await sharp(req.file.buffer)
        .resize({ width: 300, height: 300 })
        .toFormat('png')
        .toFile(`public/${filePath}`);

    req.body.image = filePath;

    next();
});

// Controllers
exports.createService = factory.createOne(Service);
exports.getAllServices = factory.getAll(Service);
exports.getService = factory.getOne(Service);
exports.updateService = factory.updateOne(Service);
exports.deleteService = factory.deleteOne(Service);

exports.getServiceBySlug = catchAsync(async (req, res, next) => {
    const service = await Service.findOne({ slug: req.params.slug }).populate('packages');

    if (!service)
        return next(new AppError('No document found with that ID', 404));

    res.json({
        status: 'success',
        data: {
            service
        }
    });
});

exports.getServicesInOffer = catchAsync(async (req, res, next) => {
    const services = await Service.find({ offer: { $exists: true } });

    res.json({
        status: 'success',
        data: {
            services
        }
    });
});