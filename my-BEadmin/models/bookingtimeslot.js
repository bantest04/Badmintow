const mongoose = require('mongoose');

const bookingTimeslotSchema = new mongoose.Schema({
    timeslotID: { type: String, required: true, unique: true },
    bookingID: { type: String, required: true, ref: 'Booking' },
    dayOfWeek: { type: String, required: true },
    monthly: { type: Boolean, default: false },
    duration: { type: Number, required: true } // in hours
  });
  
  module.exports = mongoose.model('BookingTimeslot', bookingTimeslotSchema);