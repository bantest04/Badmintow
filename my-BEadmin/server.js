require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

const app = express();

const bookingRoutes = require('./routes/bookingRoutes');
const courtRoutes = require('./routes/courtRoutes');
const customerRoutes = require('./routes/customerRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const staffRoutes = require('./routes/staffRoutes');
const timeslotRoutes = require('./routes/timeslotRoutes');

connectDB();

app.use(express.json());

app.use('/api/bookings', bookingRoutes);
app.use('/api/courts', courtRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/timeslots', timeslotRoutes);

const PORT = process.env.PORT || 5100;
app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});
