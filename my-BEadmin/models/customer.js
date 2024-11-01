const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    customerID: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true }
  });

  module.exports = mongoose.model('Customer', customerSchema);
