const Booking = require('../models/booking');
const BookingTimeslot = require('../models/bookingtimeslot');
const Customer = require('../models/customer');
const Court = require('../models/court');
const { calculateTotalPrice, formatBookingTime, getBookingStatus, validateBookingData } = require('../lib/booking-utils');

class BookingController {
  async createBooking(req, res) {
    try {
      const { customerID, courtID, bookingDate, timeslots } = req.body;
      const validation = validateBookingData(req.body);
      if (!validation.isValid) {
        return res.status(400).json({ success: false, errors: validation.errors });
      }
      // Xác thực
      const [customer, court] = await Promise.all([
        Customer.findOne({ customerID }),
        Court.findOne({ courtID })
      ]);

      if (!customer || !court) {
        return res.status(404).json({
          success: false,
          message: 'Customer or Court not found'
        });
      }

      // Tính tổng tiền
      const totalHours = timeslots.reduce((sum, slot) => sum + slot.duration, 0);
      const totalPrice = calculateTotalPrice(court, totalHours * 60); // duration in minutes

      const booking = new Booking({
        bookingID: `BK${Date.now()}`,
        customerID,
        courtID,
        bookingDate,
        totalPrice,
        status: 'Pending'
      });

      await booking.save();

      // Create booking timeslots
      const timeslotPromises = timeslots.map(slot => {
        return new BookingTimeslot({
          timeslotID: `TS${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          bookingID: booking.bookingID,
          dayOfWeek: slot.dayOfWeek,
          monthly: slot.monthly || false,
          duration: slot.duration
        }).save();
      });

      await Promise.all(timeslotPromises);

      res.status(201).json({
        success: true,
        data: booking
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }


  async getBooking(req, res) {
    try {
      const booking = await Booking.findOne({ bookingID: req.params.id })
        .populate('customerID')
        .populate('courtID');

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      const timeslots = await BookingTimeslot.find({ bookingID: booking.bookingID });

      res.json({
        success: true,
        data: { ...booking.toObject(), timeslots }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async updateBooking(req, res) {
    try {
      const booking = await Booking.findOneAndUpdate(
        { bookingID: req.params.id },
        req.body,
        { new: true }
      );

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      res.json({
        success: true,
        data: booking
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }


  async deleteBooking(req, res) {
    try {
      const booking = await Booking.findOneAndDelete({ bookingID: req.params.id });
      
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      await BookingTimeslot.deleteMany({ bookingID: req.params.id });

      res.json({
        success: true,
        message: 'Booking deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  
  async getBookings(req, res) {
    try {
      const { status, startDate, endDate, customerID } = req.query;
      const filter = {};

      if (status) filter.status = status;
      if (customerID) filter.customerID = customerID;
      if (startDate || endDate) {
        filter.bookingDate = {};
        if (startDate) filter.bookingDate.$gte = new Date(startDate);
        if (endDate) filter.bookingDate.$lte = new Date(endDate);
      }

      const bookings = await Booking.find(filter)
        .populate('customerID')
        .populate('courtID')
        .sort({ bookingDate: -1 });

      res.json({
        success: true,
        count: bookings.length,
        data: bookings
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new BookingController();