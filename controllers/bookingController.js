// Importing modules
const
    axios = require('axios'),

    Booking = require('../models/bookingModel'),
    factory = require('./handlerFactory'),
    catchAsync = require('../utils/catchAsync'),
    shortid = require('shortid'),
    razorpay = require('razorpay'),
    AppError = require('../utils/appError');

// Controllers

const razorpayInstance = new razorpay({
    // Replace with your key_id
    key_id: process.env.Razorpay_KeyID,

    // Replace with your key_secret
    key_secret: process.env.Razorpay_SecretKey
});

exports.createServiceOrder = catchAsync(async (req, res, next) => {
    console.log('REQ.BODY in CREATESERVICEORDER');
    console.log(req.body);

    console.log('HEADERS IN CREATESERV');
    console.log(req.headers.authorization);

    const payment_capture = 1
    const { totalAmount = 5000, currency = 'INR' } = req.body;
    console.log('DESTRUCTUED VARS ARE');
    console.log(totalAmount);

    const options = {
        amount: totalAmount,
        currency,
        receipt: shortid.generate(),
        payment_capture
    }

    let razarpay_res;
    try {
        console.log('CREATING RAZOR PAY ORDER\nThe OPTIONS are');
        console.log(options);
        razarpay_res = await razorpayInstance.orders.create(options)

        console.log(razarpay_res)
    } catch (err) {
        console.log(err);
        return next(new AppError(err));


    }

    const booking = await Booking.create({
        user: req.user._id, //current problem   id in undefined 
        service: req.body.service,
        selectedPackages: req.body.selectedPackages

    });

    //  let sms_res
    // try {
    //     sms_res = await axios.post(process.env.SMS_URL.replace('{api_key}', process.env.SMS_API_KEY), {

    //         From: process.env.SMS_SENDER_ID,
    //         To: req.user.phone.slice(3),
    //         TemplateName: 'IndiaohyesTrans',
    //         VAR1: req.user.name
    //     });

    //     console.log(sms_res.data);
    // } catch (err) {
    //     return next(new AppError(err, 500))
    // }


    res.status(201).json({
        status: 'success',
        message: 'We will contact you in few minutes',
        data: {
            booking,
            o_id: razarpay_res.id,
            currency: razarpay_res.currency,
            amount: razarpay_res.amount
        }
    });
});

exports.bookSerivce = (async (req, res, next) => {
    const booking = await Booking.create({
        user: req.user._id,
        service: req.body.service,
        selectedPackages: req.body.selectedPackages,
        instructions: req.body.instructions
    });

    await axios.post(process.env.SMS_URL.replace('{api_key}', process.env.SMS_API_KEY), {
        From: process.env.SMS_SENDER_ID,
        To: req.user.phone.slice(3),
        TemplateName: 'IndiaohyesTrans',
        VAR1: req.user.name
    });

    res.status(201).json({
        status: 'success',
        message: 'We will contact you in few minutes',
        data: {
            booking
        }
    });
});

exports.createBooking = factory.createOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.getBooking = factory.getOne(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);