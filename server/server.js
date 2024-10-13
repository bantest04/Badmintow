const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const Booking = require('./models/Booking');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Route đặt sân
app.post('/bookings', async (req, res) => {
    const { courtName, timeSlot, contactName, contactPhone, contactEmail } = req.body;
    try {
      const newBooking = new Booking({ courtName, timeSlot, contactName, contactPhone, contactEmail });
      await newBooking.save();
      res.status(201).json(newBooking);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
