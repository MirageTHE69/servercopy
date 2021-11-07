const
    { promisify } = require('util'),
    jwt = require('jsonwebtoken'),
    axios = require('axios'),
    User = require('../models/userModel'),
    catchAsync = require('../utils/catchAsync'),
    AppError = require('../utils/appError');

exports.login = catchAsync(async (req, res, next) => {
    console.log('REQ.BODY in exports.LOGIN');
    console.log(req.body);
    // Get phone number from req.body
    const { phone } = req.body;
    if (!phone)
        return next(new AppError('Please provide your phone number to login'));

    // Check if a user with that phone number exists
    let user = await User.findOne({ phone });
    if (!user)
        user = await User.create({ phone });

    // Send OTP using SMS API
    const response = await axios.get(process.env.OTP_GENERATE_URL.replace('{api_key}', process.env.OTP_API_KEY).replace('{phone_number}', phone));

    // Check if OTP was sent successfully
    if (response.data.Status !== 'Success')
        return next(new AppError('Something went wrong while sending the OTP'));

    // Store the sessionID given by SMS API
    req.session.otpSessionId = response.data.Details;
    req.session.user = user;

    // Send response to the client that OTP was sent
    res.json({
        status: 'success',
        message: `An OTP has been sent to ${phone}`
    });
});

exports.verifyLogin = catchAsync(async (req, res, next) => {
    // Check if user has first generated an OTP before verifying one
    if (!req.session.otpSessionId)
        return next(new AppError('Please let us generate an OTP before verficication'));

    const { user } = req.session;

    try {
        // Verify OTP using SMS API
        await axios.get(
            process.env.OTP_VERIFY_URL
                .replace('{api_key}', process.env.OTP_API_KEY)
                .replace('{session_id}', req.session.otpSessionId)
                .replace('{otp_input}', req.body.otp)
        );

        // Send token to the client
        const token = await promisify(jwt.sign)({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

        res.json({
            status: 'success',
            data: {
                token,
                user
            }
        });
    }
    catch (err) {
        // Throw error when client sends wrong OTP
        next(new AppError(err.response.data.Details));
    }
});

exports.protect = catchAsync(async (req, res, next) => {
    console.log('REQ.BODY in AUTHCONTROLLER');
    console.log(req.body);
    // Get token from request headers
    const token = req.headers.authorization?.split(' ')[1];
    console.log(token);
    if (!token) {
        return next(new AppError('Please login to get access to this route', 401));
    }
    // Decode token to get user id
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    if (!decoded)
        return next(new AppError('Invalid credentials', 403));

    // Fetch user based on user id
    const user = await User.findById(decoded.id);
    console.log('AUTH CONTROLLER USER FOUND');
    console.log(user);

    if (!user)
        return next(new AppError('The user belonging to given token no longer exists'));

    // Set the user on req object which will remain the same in middlewares that will execute after this one
    req.user = user;
    next();
});

exports.restrictTo = (...roles) => (req, res, next) => {
    if (roles.includes(req.user.role))
        return next();

    next(new AppError('You are not allowed to access this route', 403));
};