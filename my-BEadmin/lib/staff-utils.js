// lib/staff-utils.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Hàm mã hóa mật khẩu
exports.hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

// Hàm so sánh mật khẩu đã mã hóa
exports.comparePassword = async (enteredPassword, hashedPassword) => {
    return await bcrypt.compare(enteredPassword, hashedPassword);
};

// Hàm tạo JSON Web Token
exports.generateToken = (staffID, role) => {
    return jwt.sign({ id: staffID, role }, process.env.JWT_SECRET, { expiresIn: '1d' });
};
