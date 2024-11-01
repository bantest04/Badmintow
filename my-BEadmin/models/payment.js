const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    paymentID: { type: String, required: true, unique: true },
    bookingID: { type: String, required: true, ref: 'Booking' },
    paymentDate: { type: Date, required: true },
    paymentMethod: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' }
  });
  
  
  module.exports = mongoose.model('Payment', paymentSchema);