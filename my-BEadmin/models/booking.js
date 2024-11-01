const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    bookingID: { type: String, required: true, unique: true },
    customerID: { type: String, required: true, ref: 'Customer' },
    courtID: { type: String, required: true, ref: 'Court' },
    bookingDate: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled'], default: 'Pending' }
  });
  
  module.exports = mongoose.model('Booking', bookingSchema);