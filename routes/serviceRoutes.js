const
    router = require('express').Router(),
    serviceController = require('../controllers/serviceController');

router
    .route('/')
    .get(serviceController.getAllServices)
    .post(serviceController.uploadServiceImage, serviceController.resizeServiceImage, serviceController.createService);

router.get('/slug/:slug', serviceController.getServiceBySlug);

router.get('/offers', serviceController.getServicesInOffer);

router
    .route('/:id')
    .get(serviceController.getService)
    .patch(serviceController.uploadServiceImage, serviceController.resizeServiceImage, serviceController.updateService)
    .delete(serviceController.deleteService);

module.exports = router;