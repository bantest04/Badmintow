const express = require('express');
const { verifyToken, verifyRole } = require('../middleware/auth');
const router = express.Router();

// Route chỉ dành cho admin
router.get('/admin', verifyToken, verifyRole('admin'), (req, res) => {
  res.json({ message: 'Welcome admin!' });
});

// Route cho tất cả người dùng đã đăng nhập
router.get('/user', verifyToken, (req, res) => {
  res.json({ message: `Welcome ${req.user.role}!` });
});

module.exports = router;
