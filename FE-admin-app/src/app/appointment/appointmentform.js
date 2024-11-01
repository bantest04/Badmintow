'use client'

import { useState, useEffect } from 'react'
import { format, parse, addMinutes } from 'date-fns'
import { Calendar as CalendarIcon, Plus, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const colorOptions = [
  { value: 'bg-red-100', label: 'Red' },
  { value: 'bg-blue-100', label: 'Blue' },
  { value: 'bg-green-100', label: 'Green' },
  { value: 'bg-yellow-100', label: 'Yellow' },
  { value: 'bg-purple-100', label: 'Purple' },
]

const availableServices = [
  { id: 1, name: 'Thuê sân (vãng lai) (VL)', price: 70000 },
  { id: 2, name: 'Thuê sân (cố định) (CĐ)', price: 65000 },
]

const durationOptions = Array.from({ length: 10 }, (_, i) => (i + 1) * 30)

export default function NewAppointmentForm({ isOpen, onClose, onAppointmentCreated, initialTime, courtId }) {
  const [formData, setFormData] = useState({
    customerName: '',
    phoneNumber: '',
    courtDesignation: false,
    prepayment: '',
    notes: '',
    email: '',
    color: 'bg-blue-100',
    time: '',
    duration: 60,
    courtId: null,
  })

  const [selectedServices, setSelectedServices] = useState([])

  useEffect(() => {
    if (initialTime) {
      setFormData(prev => ({ ...prev, time: initialTime, courtId }))
    }
  }, [initialTime, courtId])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked) => {
    setFormData(prev => ({ ...prev, courtDesignation: checked }))
  }

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAddService = (serviceId) => {
    const serviceToAdd = availableServices.find(service => service.id === parseInt(serviceId))
    if (serviceToAdd) {
      setSelectedServices(prev => [...prev, { ...serviceToAdd, court: `Sân số ${formData.courtId + 1}` }])
    }
  }

  const handleRemoveService = (index) => {
    setSelectedServices(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const [datePart, timePart] = formData.time.split(' ');
    const startTime = parse(`${datePart} ${timePart}`, 'yyyy-MM-dd HH:mm', new Date());
    const endTime = addMinutes(startTime, formData.duration);
  
    const newAppointment = {
      customerName: formData.customerName,
      phoneNumber: formData.phoneNumber,
      courtId: formData.courtId,
      startTime,
      endTime,
      service: selectedServices.map(service => service.name).join(', '),
      paid: false, // mặc định chưa thanh toán
    };
  
    onAppointmentCreated(newAppointment);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>TẠO LỊCH ĐẶT SÂN</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customerName">Khách hàng</Label>
              <Input id="customerName" name="customerName" value={formData.customerName} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="phoneNumber">SĐT</Label>
              <Input id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="time">Thời gian</Label>
              <Input id="time" name="time" value={formData.time} onChange={handleInputChange} readOnly />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" value={formData.email} onChange={handleInputChange} />
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="courtDesignation">Chỉ định  sân</Label>
              <Switch
                id="courtDesignation"
                checked={formData.courtDesignation}
                onCheckedChange={handleSwitchChange}
              />
            </div>
            <div>
              <Label htmlFor="color">Màu</Label>
              <Select name="color" onValueChange={(value) => handleSelectChange('color', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn màu..." />
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded-full mr-2 ${color.value}`}></div>
                        {color.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="prepayment">Trả trước (VND)</Label>
              <Input id="prepayment" name="prepayment" value={formData.prepayment} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="duration">Thời lượng (phút)</Label>
              <Select name="duration" onValueChange={(value) => handleSelectChange('duration', parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn thời lượng..." />
                </SelectTrigger>
                <SelectContent>
                  {durationOptions.map((duration) => (
                    <SelectItem key={duration} value={duration.toString()}>
                      {duration} phút
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="notes">Ghi chú</Label>
            <Input id="notes" name="notes" value={formData.notes} onChange={handleInputChange} />
          </div>
          <div>
            <Label htmlFor="service">Chọn dịch vụ</Label>
            <Select name="service" onValueChange={handleAddService}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn..." />
              </SelectTrigger>
              <SelectContent>
                {availableServices.map((service) => (
                  <SelectItem key={service.id} value={service.id.toString()}>
                    {service.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Tên</TableHead>
                <TableHead>Sân</TableHead>
                <TableHead>Giá (VND)</TableHead>
                <TableHead>Thời lượng (phút)</TableHead>
                <TableHead>HĐ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedServices.map((service, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{service.name}</TableCell>
                  <TableCell>{service.court}</TableCell>
                  <TableCell>{service.price.toLocaleString()}</TableCell>
                  <TableCell>{formData.duration}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveService(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-end space-x-2">
            <Button type="submit">Tạo mới</Button>
            <Button type="button" onClick={onClose}>Đóng</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}