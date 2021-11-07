const
    router = require('express').Router(),
    orderController = require('../controllers/orderController'),
    authController = require('../controllers/authController');

router.post('/place-order', authController.protect, orderController.placeOrder);

router
    .route('/')
    .get(orderController.getAllOrders)
    .post(orderController.createOrder);

router
    .route('/:id')
    .get(orderController.getOrder)
    .patch(orderController.updateOrder)
    .delete(orderController.deleteOrder);


module.exports = router;