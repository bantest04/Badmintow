const Customer = require('../models/customer');
const Booking = require('../models/booking');

class CustomerController {
  async createCustomer(req, res) {
    try {
      const customer = new Customer(req.body);
      await customer.save();
      res.status(201).json(customer);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getCustomers(req, res) {
    try {
      const customers = await Customer.find();
      res.json(customers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getCustomerById(req, res) {
    try {
      const customer = await Customer.findOne({ customerID: req.params.id });
      if (!customer) {
        return res.status(404).json({ error: 'Customer not found' });
      }
      res.json(customer);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateCustomer(req, res) {
    try {
      const customer = await Customer.findOneAndUpdate(
        { customerID: req.params.id },
        req.body,
        { new: true }
      );
      if (!customer) {
        return res.status(404).json({ error: 'Customer not found' });
      }
      res.json(customer);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteCustomer(req, res) {
    try {
      // Check if customer has any active bookings
      const activeBookings = await Booking.findOne({
        customerID: req.params.id,
        status: { $in: ['Pending', 'Confirmed'] }
      });

      if (activeBookings) {
        return res.status(400).json({
          error: 'Cannot delete customer with active bookings'
        });
      }

      const customer = await Customer.findOneAndDelete({ 
        customerID: req.params.id 
      });
      
      if (!customer) {
        return res.status(404).json({ error: 'Customer not found' });
      }
      res.json({ message: 'Customer deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get customer bookings
  async getCustomerBookings(req, res) {
    try {
      const bookings = await Booking.find({ customerID: req.params.id })
        .populate('courtID')
        .sort({ bookingDate: -1 });
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new CustomerController();