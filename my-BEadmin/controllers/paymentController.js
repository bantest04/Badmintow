const Payment = require('../models/payment');
const Booking = require('../models/booking');
const { generatePaymentID } = require('../lib/payment-utils');

class PaymentController {
  // Create payment
  async createPayment(req, res) {
    try {
      const booking = await Booking.findOne({ bookingID: req.body.bookingID });
      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      const payment = new Payment({
        ...req.body,
        paymentID: await generatePaymentID(),
        paymentDate: new Date()
      });

      await payment.save();

      if (payment.status === 'Completed') {
        booking.status = 'Confirmed';
        await booking.save();
      }

      res.status(201).json(payment);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Get all payments
  async getPayments(req, res) {
    try {
      const payments = await Payment.find().populate('bookingID');
      res.json(payments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get payment by ID
  async getPaymentById(req, res) {
    try {
      const payment = await Payment.findOne({ paymentID: req.params.id })
        .populate('bookingID');
      if (!payment) {
        return res.status(404).json({ error: 'Payment not found' });
      }
      res.json(payment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Update payment
  async updatePayment(req, res) {
    try {
      const payment = await Payment.findOneAndUpdate(
        { paymentID: req.params.id },
        req.body,
        { new: true }
      );
      if (!payment) {
        return res.status(404).json({ error: 'Payment not found' });
      }

      // Update booking status if payment is completed
      if (payment.status === 'Completed') {
        const booking = await Booking.findOne({ bookingID: payment.bookingID });
        if (booking) {
          booking.status = 'Confirmed';
          await booking.save();
        }
      }

      res.json(payment);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Get payments by booking
  async getPaymentsByBooking(req, res) {
    try {
      const payments = await Payment.find({ bookingID: req.params.bookingId })
        .sort({ paymentDate: -1 });
      res.json(payments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new PaymentController();