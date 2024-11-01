const { v4: uuidv4 } = require('uuid');

// Hàm tạo Payment ID duy nhất
exports.generatePaymentID = () => {
    return `PAY-${uuidv4()}`;
};