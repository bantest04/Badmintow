const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Định nghĩa Schema cho người dùng
const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'], // Các role khác có thể được thêm vào sau
    default: 'user'
  }
});

// Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    return next(error);
  }
});

// So sánh mật khẩu trong quá trình đăng nhập
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Export Model
module.exports = mongoose.model('User', UserSchema);
