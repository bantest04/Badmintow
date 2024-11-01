const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');


router.post('/', bookingController.createBooking);


router.get('/:id', bookingController.getBooking);


router.put('/:id', bookingController.updateBooking);


router.delete('/:id', bookingController.deleteBooking);


router.get('/', bookingController.getBookings);

module.exports = router;