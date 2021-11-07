// Importing modules
const AppError = require('../utils/appError');

// Utility error handling procedures
const handleValidationErrorDB = err => new AppError(Object.values(err.errors).map(error => error.properties?.message).join('\n') || 'Invalid ObjectId');
const handleDuplicateErrorDB = err => new AppError(Object.keys(err.keyValue).map(error => error.toUpperCase() + ', ') + 'must always contain unique values');
const handleCastErrorDB = () => new AppError('Invalid ID');
const handleJWTError = () => new AppError('Please login again because of invalid JWT token');

// Final middleware to handle all exceptions in the application
module.exports = (error, req, res, next) => {
    // Creating a shallow copy of error object
    console.log(error)
    let err = { ...error };

    // Log errors to the console while in development
    if (process.env.NODE_ENV === 'development') console.log(JSON.stringify(error, null, 4));

    // Manipulating shallow copy of error to produce a formatted output
    if (error.name === 'JsonWebTokenError') err = handleJWTError();
    if (error.name === 'CastError') err = handleCastErrorDB();
    if (error.name === 'ValidationError') err = handleValidationErrorDB(err);
    if (error.code === 11000) err = handleDuplicateErrorDB(err);

    // Sending the response
    return res.status(err.statusCode || 500).json({
        status: err.status,
        message: err.message
    });
};