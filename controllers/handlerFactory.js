// Importing modules
const
    catchAsync = require('../utils/catchAsync'),
    AppError = require('../utils/appError');

// Create
exports.createOne = Model => catchAsync(async (req, res, next) => {
    console.log('REQ.BODY in SERVICE CREATE');
    console.log(req.body);
    const data = await Model.create(req.body);

    // 201 = created
    res.status(201).json({
        status: 'success',
        data: {
            [Model.collection.collectionName.slice(0, -1)]: data
        }
    });
});

// Read all
exports.getAll = Model => catchAsync(async (req, res, next) => {
    const data = await Model.find();

    res.json({
        status: 'success',
        results: data.length,
        data: {
            [Model.collection.collectionName]: data
        }
    });
});

// Read one
exports.getOne = Model => catchAsync(async (req, res, next) => {
    const data = await Model.findById(req.params.id);

    if (!data)
        return next(new AppError('No document found with that ID', 404));

    res.json({
        status: 'success',
        data: {
            [Model.collection.collectionName.slice(0, -1)]: data
        }
    });
});

// Update
exports.updateOne = Model => catchAsync(async (req, res, next) => {
    const data = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if (!data)
        return next(new AppError('No document found with that ID', 404));

    res.json({
        status: 'success',
        data: {
            [Model.collection.collectionName.slice(0, -1)]: data
        }
    });
});

// Delete
exports.deleteOne = Model => catchAsync(async (req, res, next) => {
    const data = await Model.findByIdAndDelete(req.params.id);

    if (!data)
        return next(new AppError('No document found with that ID', 404));

    // 204 = no content
    res.status(204).json({
        status: 'success',
        data: null
    });
});