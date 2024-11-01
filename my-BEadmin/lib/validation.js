const Joi = require('joi');

// Xác thực thông tin timeslot
exports.validateTimeslot = (data) => {
    const schema = Joi.object({
        bookingID: Joi.string().required(),
        courtID: Joi.string().required(),
        dayOfWeek: Joi.string().valid('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday').required(),
        startTime: Joi.string().required(),
        endTime: Joi.string().required(),
        duration: Joi.number().integer().min(30).max(120).required(),
    });
    return schema.validate(data);
};

// Xác thực thông tin đăng ký nhân viên
exports.validateStaffInput = (data) => {
    const schema = Joi.object({
        fullName: Joi.string().min(3).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        position: Joi.string().required(),
    });
    return schema.validate(data);
};