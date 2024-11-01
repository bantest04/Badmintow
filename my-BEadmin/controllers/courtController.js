const Court = require('../models/court');
const BookingTimeslot = require('../models/bookingtimeslot');

class CourtController {
  async createCourt(req, res) {
    try {
      const court = new Court(req.body);
      await court.save();
      res.status(201).json(court);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getCourts(req, res) {
    try {
      const courts = await Court.find();
      res.json(courts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getCourtById(req, res) {
    try {
      const court = await Court.findOne({ courtID: req.params.id });
      if (!court) {
        return res.status(404).json({ error: 'Court not found' });
      }
      res.json(court);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateCourt(req, res) {
    try {
      const court = await Court.findOneAndUpdate(
        { courtID: req.params.id },
        req.body,
        { new: true }
      );
      if (!court) {
        return res.status(404).json({ error: 'Court not found' });
      }
      res.json(court);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteCourt(req, res) {
    try {
      const hasBookings = await BookingTimeslot.findOne({ 
        courtID: req.params.id,
        bookingDate: { $gte: new Date() }
      });

      if (hasBookings) {
        return res.status(400).json({ 
          error: 'Cannot delete court with active bookings' 
        });
      }

      const court = await Court.findOneAndDelete({ courtID: req.params.id });
      if (!court) {
        return res.status(404).json({ error: 'Court not found' });
      }
      res.json({ message: 'Court deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async checkAvailability(req, res) {
    try {
      const { date, startTime, endTime } = req.query;
      const courtID = req.params.id;

      const bookings = await BookingTimeslot.find({
        courtID,
        bookingDate: date,
        $or: [
          { startTime: { $lt: endTime, $gte: startTime } },
          { endTime: { $gt: startTime, $lte: endTime } }
        ]
      });

      res.json({
        available: bookings.length === 0,
        existingBookings: bookings
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new CourtController();