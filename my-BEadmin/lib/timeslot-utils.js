// Hàm kiểm tra xem timeslot có bị xung đột không
exports.checkConflict = async (startTime, endTime, courtID, dayOfWeek, timeslotID = null) => {
    const query = {
        courtID,
        dayOfWeek,
        $or: [
            { startTime: { $lt: endTime, $gte: startTime } },
            { endTime: { $gt: startTime, $lte: endTime } }
        ]
    };

    // Nếu cập nhật, bỏ qua timeslot hiện tại trong kiểm tra xung đột
    if (timeslotID) {
        query.timeslotID = { $ne: timeslotID };
    }

    const conflictingTimeslot = await BookingTimeslot.findOne(query);
    return !!conflictingTimeslot;
};

// Hàm tạo danh sách các timeslot có thể đặt trong một ngày
exports.generateTimeslots = () => {
    const timeslots = [];
    const startHour = 8; // Giờ bắt đầu mở sân
    const endHour = 20; // Giờ kết thúc mở sân
    const duration = 60; // Thời lượng mỗi timeslot (phút)

    for (let hour = startHour; hour < endHour; hour++) {
        timeslots.push({
            startTime: `${hour}:00`,
            endTime: `${hour + 1}:00`,
            duration
        });
    }

    return timeslots;
};

// Hàm kiểm tra xem timeslot đã được đặt chưa
exports.isTimeslotBooked = (timeslot, bookedTimeslots) => {
    return bookedTimeslots.some(booked =>
        timeslot.startTime === booked.startTime && timeslot.endTime === booked.endTime
    );
};