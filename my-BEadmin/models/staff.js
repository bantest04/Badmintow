const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
    staffID: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    position: { type: String, required: true },
    hireDate: { type: Date, required: true }
  });
  
  module.exports = mongoose.model('Staff', staffSchema);