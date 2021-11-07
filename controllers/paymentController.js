const
	catchAsync = require('../utils/catchAsync'),
	Cart = require('../models/cartModel'),
	razorpay = require('razorpay'),
	shortid = require('shortid'),
	AppError = require('../utils/appError');


var cart = new Cart();


exports.getcartprice = catchAsync(async (req, res, next) => {



	cart = new Cart(req.session.cart);
	console.log(res.cart);

	next()

})


const razorpayInstance = new razorpay({

	// Replace with your key_id
	key_id: process.env.Razorpay_KeyID,

	// Replace with your key_secret
	key_secret: process.env.Razorpay_SecretKey
});


console.log(cart)

exports.createOrder = catchAsync(async (req, res, next) => {
	// console.log(req.session);
	// console.log(req.cookies);
	// console.log(cookies);

	const payment_capture = 1
	const amount = (cart.totalPrice + cart.totalPrice / 10) * 100
	const currency = 'INR'




	const options = {
		amount: amount,
		currency,
		receipt: shortid.generate(),
		payment_capture
	}

	let response;
	try {
		response = await razorpayInstance.orders.create(options)

		console.log(response)

		res.json({
			o_id: response.id,
			currency: response.currency,
			amount: response.amount
		})
	} catch (error) {
		console.log(error);
		next(new AppError(error));
	}
});

