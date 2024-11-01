const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');


router.post('/', paymentController.createPayment);


router.get('/', paymentController.getPayments);


router.get('/:id', paymentController.getPaymentById);


router.put('/:id', paymentController.updatePayment);


router.get('/booking/:bookingId', paymentController.getPaymentsByBooking);

module.exports = router;
