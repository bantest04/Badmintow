const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected');
const app = express();

dotenv.config();

// Middleware
app.use(express.json());
app.use(cors());

// Tạo tài khoản admin
async function createAdminUser() {
  try {
    const admin = await User.findOne({ username: 'admin' });
    if (admin) {
      console.log('Admin account already exists');
      return;
    }

    // Tạo mật khẩu và mã hóa
    const hashedPassword = await bcrypt.hash('adminpassword', 10);

    // Tạo admin user
    const newAdmin = new User({
      firstName: 'Admin',
      lastName: 'User',
      username: 'admin',
      phone: '0123456789',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin'
    });

    await newAdmin.save();
    console.log('Admin account created successfully');
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI, {
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRoutes);

// Khởi động server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
