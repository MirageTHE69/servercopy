const
    router = require('express').Router(),
    bookingController = require('../controllers/bookingController'),
    authController = require('../controllers/authController');

router.post('/online-service-pay', authController.protect, (req, res) => {
    console.log('REQ.BODY online-service-pay');
    console.log(req.body);
    res.send('Yo');
});

router.post('/book-service', authController.protect, bookingController.bookSerivce);  // protect book service run first ??

router
    .route('/')
    .get(bookingController.getAllBookings)
    .post(bookingController.createBooking);

router
    .route('/:id')
    .get(bookingController.getBooking)
    .patch(bookingController.updateBooking)
    .delete(bookingController.deleteBooking);


module.exports = router;