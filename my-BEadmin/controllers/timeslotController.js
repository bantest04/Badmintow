const BookingTimeslot = require('../models/bookingtimeslot');
const Booking = require('../models/booking');
const { validateTimeslot } = require('../lib/validation');

class TimeslotController {
  // Create timeslot
  async createTimeslot(req, res) {
    try {
      const { error } = validateTimeslot(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      // Check if booking exists
      const booking = await Booking.findOne({ bookingID: req.body.bookingID });
      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      // Check for timeslot conflicts
      const isConflict = await BookingTimeslot.checkConflict(
        req.body.startTime,
        req.body.endTime,
        req.body.courtID,
        req.body.dayOfWeek
      );

      if (isConflict) {
        return res.status(400).json({ error: 'Timeslot conflict exists' });
      }

      const timeslot = new BookingTimeslot(req.body);
      await timeslot.save();

      res.status(201).json(timeslot);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Get all timeslots
  async getTimeslots(req, res) {
    try {
      const timeslots = await BookingTimeslot.find()
        .populate('bookingID')
        .sort({ dayOfWeek: 1, startTime: 1 });
      res.json(timeslots);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get timeslot by ID
  async getTimeslotById(req, res) {
    try {
      const timeslot = await BookingTimeslot.findOne({ 
        timeslotID: req.params.id 
      }).populate('bookingID');
      
      if (!timeslot) {
        return res.status(404).json({ error: 'Timeslot not found' });
      }
      res.json(timeslot);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Update timeslot
  async updateTimeslot(req, res) {
    try {
      if (req.body.startTime || req.body.endTime) {
        const isConflict = await BookingTimeslot.checkConflict(
          req.body.startTime || req.body.currentStartTime,
          req.body.endTime || req.body.currentEndTime,
          req.body.courtID,
          req.body.dayOfWeek,
          req.params.id
        );

        if (isConflict) {
          return res.status(400).json({ error: 'Timeslot conflict exists' });
        }
      }

      const timeslot = await BookingTimeslot.findOneAndUpdate(
        { timeslotID: req.params.id },
        req.body,
        { new: true }
      );

      if (!timeslot) {
        return res.status(404).json({ error: 'Timeslot not found' });
      }

      res.json(timeslot);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Delete timeslot
  async deleteTimeslot(req, res) {
    try {
      const timeslot = await BookingTimeslot.findOneAndDelete({
        timeslotID: req.params.id
      });

      if (!timeslot) {
        return res.status(404).json({ error: 'Timeslot not found' });
      }

      res.json({ message: 'Timeslot deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get available timeslots
  async getAvailableTimeslots(req, res) {
    try {
      const { date, courtID } = req.query;
      const bookedTimeslots = await BookingTimeslot.find({
        courtID,
        bookingDate: date
      });

      // Generate all possible timeslots
      const allTimeslots = generateTimeslots();
      
      // Filter out booked timeslots
      const availableTimeslots = allTimeslots.filter(timeslot => 
        !isTimeslotBooked(timeslot, bookedTimeslots)
      );

      res.json(availableTimeslots);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new TimeslotController();