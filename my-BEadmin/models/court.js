const mongoose = require('mongoose');

const courtSchema = new mongoose.Schema({
    courtID: { type: String, required: true, unique: true },
    courtName: { type: String, required: true },
    location: { type: String, required: true },
    pricePerHour: { type: Number, required: true }
  });

  module.exports = mongoose.model('Court', courtSchema);
