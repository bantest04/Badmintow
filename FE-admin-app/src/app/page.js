 'use client'

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { format, parse, addMinutes, setHours, setMinutes, isWithinInterval, isSameDay, differenceInMinutes, isValid } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Plus, X,Edit, Play, Archive, UserX, Trash2 } from 'lucide-react';
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import NewAppointmentForm from './appointment/appointmentform'; // Assuming this is the form component you provided

const CourtSchedule = () => {
  const [schedule, setSchedule] = useState({});
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isAppointmentContextMenuOpen, setIsAppointmentContextMenuOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const timeSlots = [];
  for (let i = 5; i < 24; i++) {
    for (let j = 0; j < 60; j += 30) {
      const time = setMinutes(setHours(new Date(), i), j);
      timeSlots.push(format(time, 'HH:mm'));
    }
  }
  
  const courts = ['Sân A', 'Sân B', 'Sân C', 'Sân D'];

  // Hàm tải danh sách booking từ database
  const fetchBookings = async () => {
    try {
      const response = await axios.get('/api/bookings');
      const fetchedBookings = response.data;

      const newSchedule = {};
      fetchedBookings.forEach(booking => {
        const dateKey = format(new Date(booking.startTime), 'yyyy-MM-dd');
        const timeKey = `${format(new Date(booking.startTime), 'HH:mm')}-${booking.courtId}`;

        if (!newSchedule[dateKey]) {
          newSchedule[dateKey] = {};
        }

        newSchedule[dateKey][timeKey] = {
          ...booking,
          startTime: new Date(booking.startTime),
          endTime: new Date(booking.endTime),
        };
      });
      setSchedule(newSchedule);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách đặt sân:', error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const formatPhoneNumber = (phoneNumber) => {
    return phoneNumber.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
  };
  const formatDate = (date, formatString) => {
    if (date && isValid(new Date(date))) {
      return format(new Date(date), formatString);
    }
    return 'Không có thông tin';
  };

  const handleCellRightClick = useCallback((e, time, court) => {
    e.preventDefault();
    const selectedDateTime = parse(`${format(currentDate, 'yyyy-MM-dd')} ${time}`, 'yyyy-MM-dd HH:mm', new Date());
    setSelectedTime(format(selectedDateTime, "yyyy-MM-dd HH:mm"));
    setSelectedCourt(courts.indexOf(court));
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setIsContextMenuOpen(true);
  }, [currentDate, courts]);

  const handleCellLeftClick = useCallback(() => {
    setIsContextMenuOpen(false);
    setIsAppointmentContextMenuOpen(false);
  }, []);

  const handleNewAppointment = useCallback(() => {
    setIsNewAppointmentOpen(true);
    setIsContextMenuOpen(false);
  }, []);

  const handleAppointmentRightClick = useCallback((e, appointment) => {
    e.preventDefault();
    setSelectedAppointment(appointment);
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setIsAppointmentContextMenuOpen(true);
  }, []);
  const handleEditAppointment = useCallback(() => {
    // Implement edit appointment logic here
    setIsAppointmentContextMenuOpen(false);
  }, []);
  
  const handleStartMatch = useCallback(() => {
    // Implement start match logic here
    setIsAppointmentContextMenuOpen(false);
  }, []);
  
  const handleMoveToTempMemory = useCallback(() => {
    // Implement move to temporary memory logic here
    setIsAppointmentContextMenuOpen(false);
  }, []);
  
  const handleCustomerNoShow = useCallback(() => {
    // Implement customer no-show logic here
    setIsAppointmentContextMenuOpen(false);
  }, []);
  
  const handleCancelAppointment = useCallback(() => {
    // Implement cancel appointment logic here
    setIsAppointmentContextMenuOpen(false);
  }, []);

  const handleTemporaryClosure = useCallback(() => {
    setSchedule(prev => ({
      ...prev,
      [format(currentDate, 'yyyy-MM-dd')]: {
        ...prev[format(currentDate, 'yyyy-MM-dd')],
        [`${format(parse(selectedTime, "yyyy-MM-dd HH:mm", new Date()), 'HH:mm')}-${selectedCourt}`]: {
          type: 'closure',
          color: 'bg-gray-300',
          startTime: parse(selectedTime, "yyyy-MM-dd HH:mm", new Date()),
          endTime: addMinutes(parse(selectedTime, "yyyy-MM-dd HH:mm", new Date()), 30)
        }
      }
    }));
    setIsContextMenuOpen(false);
  }, [currentDate, selectedTime, selectedCourt]);

   const handleAppointmentCreated = useCallback(async (newAppointment) => {
    try {
      // Gửi dữ liệu lịch mới đến backend để lưu vào database
      const response = await axios.post('/api/bookings', newAppointment);
      const savedAppointment = response.data;

      // Cập nhật giao diện với dữ liệu mới lưu
      const startTime = new Date(savedAppointment.startTime);
      const endTime = new Date(savedAppointment.endTime);
      const dateKey = format(startTime, 'yyyy-MM-dd');
      const timeKey = `${format(startTime, 'HH:mm')}-${savedAppointment.courtId}`;

      setSchedule(prev => ({
        ...prev,
        [dateKey]: {
          ...prev[dateKey],
          [timeKey]: {
            ...savedAppointment,
            startTime,
            endTime,
          }
        }
      }));

      setIsNewAppointmentOpen(false);
    } catch (error) {
      console.error('Lỗi khi tạo lịch mới:', error);
    }
  }, []);

  const isAppointmentCell = useCallback((date, time, courtIndex) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const appointments = schedule[dateKey] || {};
    
    for (const key in appointments) {
      const appointment = appointments[key];
      if (appointment.courtId === courtIndex) {
        const cellTime = parse(`${dateKey} ${time}`, 'yyyy-MM-dd HH:mm', new Date());
        if (isWithinInterval(cellTime, { start: appointment.startTime, end: appointment.endTime })) {
          return appointment;
        }
      }
    }
    return false;
  }, [schedule]);

  const renderAppointmentCell = useCallback((appointment, time, courtIndex) => {
    const startTime = parse(time, 'HH:mm', new Date());
    const endTime = addMinutes(startTime, 30);
    const isStart = format(appointment.startTime, 'HH:mm') === time;
    const duration = differenceInMinutes(appointment.endTime, appointment.startTime);
    const rowSpan = Math.ceil(duration / 30);

    if (isStart) {
      const fontSize = rowSpan > 2 ? 'text-sm' : 'text-xs';
      const contentClass = rowSpan > 2 ? 'flex-col' : 'flex-row';

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <TableCell
                key={`${time}-${courtIndex}`}
                className={`relative bg-[#fbf6ca] hover:bg-[#f5eeb5] transition-colors duration-200`}
                rowSpan={rowSpan}
              >
                <div className={`absolute inset-0 flex ${contentClass} items-end justify-end p-1 ${fontSize}`}
                    onContextMenu={(e) => handleAppointmentRightClick(e, appointment)}
                >
                  <div className="text-le">
                    <div className="font-semibold">{appointment.service}</div>
                    <div className="font-bold text-blue-600">{appointment.customerName}</div>
                    <div>{formatPhoneNumber(appointment.phoneNumber)}</div>
                  </div>
                </div>
              </TableCell>
            </TooltipTrigger>
            <TooltipContent>
              <div className="p-2">
                <p><strong>Dịch vụ:</strong> {appointment.service}</p>
                <p><strong>Trạng thái:</strong> <span className={appointment.paid ? "text-green-600" : "text-red-600 font-bold"}>
                  {appointment.paid ? "Đã thanh toán" : "Đang chờ"}
                </span></p>
                <p><strong>Khách hàng:</strong> {appointment.customerName}</p>
                <p><strong>Số điện thoại:</strong> {formatPhoneNumber(appointment.phoneNumber)}</p>
                <p><strong>Thời gian:</strong> {`${formatDate(appointment.startTime, 'HH:mm')} - ${formatDate(appointment.endTime, 'HH:mm')}`}</p>
                <p><strong>Thời gian tạo:</strong> {formatDate(appointment.createdAt, 'dd/MM/yyyy HH:mm')}</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    return null;
  }, []);

  const getCurrentTimePosition = useCallback(() => {
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    
    if (currentHour < 5 || currentHour >= 23) return null;
    
    const hourIndex = (currentHour - 5) * 2;
    const minuteOffset = currentMinute / 30;
    
    return (hourIndex + minuteOffset) * 100 / 38; // 38 is the total number of 30-minute slots
  }, [currentTime]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('/api/bookings');
        setBookings(response.data); // Lưu danh sách bookings vào state
      } catch (error) {
        console.error('Lỗi khi lấy danh sách đặt sân:', error);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="container mx-auto p-4" onClick={handleCellLeftClick}>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">
          Lịch đặt sân cầu lông
        </h1>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(currentDate, 'dd/MM/yyyy')}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={currentDate}
              onSelect={(date) => setCurrentDate(date || new Date())}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="relative">
        <Table className="border-collapse">
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/5 border-r">Giờ</TableHead>
              {courts.map((court, index) => (
                <TableHead key={court} className={index < courts.length - 1 ? 'border-r' : ''}>{court}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {timeSlots.map(time => (
              <TableRow key={time}>
                <TableCell className="font-medium border-r">{time}</TableCell>
                {courts.map((court, courtIndex) => {
                  const appointment = isAppointmentCell(currentDate, time, courtIndex);
                  if (appointment) {
                    return renderAppointmentCell(appointment, time, courtIndex);
                  }
                  return (
                    <TableCell 
                      key={`${time}-${court}`}
                      className={`relative ${courtIndex < courts.length - 1 ? 'border-r' : ''}`}
                      onContextMenu={(e) => handleCellRightClick(e, time, court)}
                    >
                      {appointment && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-xs">
                          <span>{appointment.service}</span>
                          <span className="font-bold">{appointment.customerName}</span>
                          <span>{appointment.phoneNumber}</span>
                          <span>{`${format(appointment.startTime, 'HH:mm')} - ${format(appointment.endTime, 'HH:mm')}`}</span>
                        </div>
                      )}
                      {appointment?.type === 'closure' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-300">
                          Tạm đóng
                        </div>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {isSameDay(currentDate, new Date()) && (
          <div 
            className="absolute left-0 right-0 border-t-2 border-red-500 pointer-events-none" 
            style={{ top: `${getCurrentTimePosition()}%` }}
          />
        )}
      </div>
      {isContextMenuOpen && (
        <div 
          style={{
            position: 'fixed',
            top: contextMenuPosition.y,
            left: contextMenuPosition.x,
            zIndex: 1000,
          }}
          className="bg-white border rounded shadow-lg"
        >
          <Button onClick={handleNewAppointment} className="block w-full text-left px-4 py-2 text-black bg-white hover:bg-gray-100">
            <Plus className="inline-block mr-2 h-4 w-4" />
            Lịch hẹn mới
          </Button>
          <Button onClick={handleTemporaryClosure} className="block w-full text-left px-4 py-2 text-black bg-white hover:bg-gray-100">
            <X className="inline-block mr-2 h-4 w-4" />
            Sân tạm đóng
          </Button>
        </div>
      )}
      
        {isAppointmentContextMenuOpen && selectedAppointment && (
      <div 
        style={{
          position: 'fixed',
          top: contextMenuPosition.y,
          left: contextMenuPosition.x,
          zIndex: 1000
        }}
        className="bg-white border rounded shadow-lg"
      >
        <Button onClick={handleEditAppointment} className="block w-full text-left px-4 py-2 bg-white text-black hover:bg-gray-100">
          <Edit className="inline-block mr-2 h-4 w-4" />
          Chỉnh sửa lịch hẹn
        </Button>
        <Button onClick={handleStartMatch} className="block w-full text-left px-4 py-2 bg-white text-black hover:bg-gray-100">
          <Play className="inline-block mr-2 h-4 w-4" />
          Bắt đầu thi đấu
        </Button>
        <Button onClick={handleMoveToTempMemory} className="block w-full text-left px-4 py-2 bg-white text-black hover:bg-gray-100">
          <Archive className="inline-block mr-2 h-4 w-4" />
          Chuyển sang bộ nhớ tạm
        </Button>
        <Button onClick={handleCustomerNoShow} className="block w-full text-left px-4 py-2 bg-white text-black hover:bg-gray-100">
          <UserX className="inline-block mr-2 h-4 w-4" />
          Khách không đến
        </Button>
        <Button onClick={handleCancelAppointment} className="block w-full text-left px-4 py-2 bg-white text-black hover:bg-gray-100 text-red-600">
          <Trash2 className="inline-block mr-2 h-4 w-4" />
          Hủy
        </Button>
      </div>
      )}

      {isNewAppointmentOpen && (
        <div 
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={() => setIsNewAppointmentOpen(false)}
        >
          <div 
            className="bg-white rounded-lg shadow-xl p-4" 
            style={{ width: '75%', maxWidth: '800px' }} 
            onClick={(e) => e.stopPropagation()}
          >
            <NewAppointmentForm
              isOpen={isNewAppointmentOpen}
              onClose={() => setIsNewAppointmentOpen(false)}
              onAppointmentCreated={handleAppointmentCreated}
              initialTime={selectedTime}
              courtId={selectedCourt}
            />
          </div>
        </div>
      )}
  </div>
  );
};

export default CourtSchedule;