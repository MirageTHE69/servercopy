const
    router = require('express').Router(),

    paymentController = require('../controllers/paymentController');


router.post('/', paymentController.createOrder);
router.get('/', paymentController.getcartprice);



module.exports = router;