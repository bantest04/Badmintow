const Staff = require('../models/staff');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validateStaffInput } = require('../lib/validation');

class StaffController {
  // Staff registration
  async register(req, res) {
    try {
      const { error } = validateStaffInput(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const { fullName, email, password, position } = req.body;

      // Check if staff already exists
      let staff = await Staff.findOne({ email });
      if (staff) {
        return res.status(400).json({ error: 'Staff already exists' });
      }

      // Create new staff
      staff = new Staff({
        staffID: `STF${Date.now()}`,
        fullName,
        email,
        position,
        hireDate: new Date()
      });

      // Hash password
      const salt = await bcrypt.genSalt(10);
      staff.password = await bcrypt.hash(password, salt);

      await staff.save();

      // Generate token
      const token = jwt.sign(
        { id: staff.staffID, role: staff.position },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      res.status(201).json({ staff, token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Staff login
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Check if staff exists
      const staff = await Staff.findOne({ email });
      if (!staff) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }

      // Validate password
      const isMatch = await bcrypt.compare(password, staff.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }

      // Generate token
      const token = jwt.sign(
        { id: staff.staffID, role: staff.position },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      res.json({ staff, token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get all staff
  async getAllStaff(req, res) {
    try {
      const staff = await Staff.find().select('-password');
      res.json(staff);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get staff by ID
  async getStaffById(req, res) {
    try {
      const staff = await Staff.findOne({ staffID: req.params.id })
        .select('-password');
      if (!staff) {
        return res.status(404).json({ error: 'Staff not found' });
      }
      res.json(staff);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Update staff
  async updateStaff(req, res) {
    try {
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      }

      const staff = await Staff.findOneAndUpdate(
        { staffID: req.params.id },
        req.body,
        { new: true }
      ).select('-password');

      if (!staff) {
        return res.status(404).json({ error: 'Staff not found' });
      }

      res.json(staff);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new StaffController();