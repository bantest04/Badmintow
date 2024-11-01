const calculateTotalPrice = (court, duration) => {
  if (!court || !duration) return 0;
  const hours = duration / 60; // Chuyển đổi từ phút sang giờ
  return Math.round(court.pricePerHour * hours);
};

const formatBookingTime = (date, time) => {
  return new Date(`${date}T${time}`).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
  });
};

const getBookingStatus = (status) => {
  const statusMap = {
      pending: { label: 'Chờ xác nhận', color: 'yellow' },
      confirmed: { label: 'Đã xác nhận', color: 'green' },
      cancelled: { label: 'Đã hủy', color: 'red' },
      completed: { label: 'Hoàn thành', color: 'blue' }
  };
  return statusMap[status] || { label: status, color: 'gray' };
};

const validateBookingData = (bookingData) => {
  const errors = {};

  if (!bookingData.courtID) {
      errors.courtId = 'Vui lòng chọn sân';
  }

  if (!bookingData.bookingDate) {
      errors.bookingDate = 'Vui lòng chọn ngày đặt sân';
  }

  if (!bookingData.customerInfo?.fullName) {
      errors.fullName = 'Vui lòng nhập họ tên';
  }

  if (!bookingData.customerInfo?.phoneNumber) {
      errors.phoneNumber = 'Vui lòng nhập số điện thoại';
  } else if (!/^[0-9]{10}$/.test(bookingData.customerInfo.phoneNumber)) {
      errors.phoneNumber = 'Số điện thoại không hợp lệ';
  }

  if (!bookingData.customerInfo?.email) {
      errors.email = 'Vui lòng nhập email';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bookingData.customerInfo.email)) {
      errors.email = 'Email không hợp lệ';
  }

  return {
      isValid: Object.keys(errors).length === 0,
      errors
  };
};

module.exports = {
  calculateTotalPrice,
  formatBookingTime,
  getBookingStatus,
  validateBookingData
};
