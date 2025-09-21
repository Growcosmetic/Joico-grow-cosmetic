import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Eye, 
  Edit, 
  Check, 
  X,
  Phone,
  User,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    customerName: '',
    phone: '',
    service: '',
    date: '',
    time: '',
    notes: '',
    status: 'scheduled'
  });

  // Load appointments from localStorage
  useEffect(() => {
    const savedAppointments = localStorage.getItem('appointments');
    if (savedAppointments) {
      setAppointments(JSON.parse(savedAppointments));
    } else {
      // Sample data
      const sampleAppointments = [
        {
          id: 1,
          customerName: 'Nguyễn Thị Lan',
          phone: '0901234567',
          service: 'DEFY DAMAGE Treatment',
          date: '2025-01-20',
          time: '09:00',
          status: 'scheduled',
          notes: 'Khách hàng VIP, cần tư vấn kỹ'
        },
        {
          id: 2,
          customerName: 'Trần Văn Minh',
          phone: '0912345678',
          service: 'Keratin Treatment',
          date: '2025-01-20',
          time: '14:00',
          status: 'confirmed',
          notes: 'Đã xác nhận qua điện thoại'
        },
        {
          id: 3,
          customerName: 'Lê Thị Hoa',
          phone: '0923456789',
          service: 'Amino Treatment',
          date: '2025-01-21',
          time: '10:30',
          status: 'completed',
          notes: 'Hoàn thành tốt, khách hàng hài lòng'
        }
      ];
      setAppointments(sampleAppointments);
      localStorage.setItem('appointments', JSON.stringify(sampleAppointments));
    }
  }, []);

  // Get appointments for selected date
  const getAppointmentsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return appointments.filter(apt => apt.date === dateStr);
  };

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'scheduled':
        return <Badge className="bg-blue-100 text-blue-800">Đã đặt</Badge>;
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800">Đã xác nhận</Badge>;
      case 'completed':
        return <Badge className="bg-purple-100 text-purple-800">Hoàn thành</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Đã hủy</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Không xác định</Badge>;
    }
  };

  // Update appointment status
  const updateAppointmentStatus = (id, newStatus) => {
    const updatedAppointments = appointments.map(apt =>
      apt.id === id ? { ...apt, status: newStatus } : apt
    );
    setAppointments(updatedAppointments);
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
  };

  // Add new appointment
  const handleAddAppointment = () => {
    if (!newAppointment.customerName || !newAppointment.date || !newAppointment.time) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    const appointment = {
      id: Date.now(),
      ...newAppointment
    };

    const updatedAppointments = [...appointments, appointment];
    setAppointments(updatedAppointments);
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));

    // Reset form
    setNewAppointment({
      customerName: '',
      phone: '',
      service: '',
      date: '',
      time: '',
      notes: '',
      status: 'scheduled'
    });
    setShowAddForm(false);
  };

  // Calendar navigation
  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const currentDateObj = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      const dayAppointments = getAppointmentsForDate(currentDateObj);
      days.push({
        date: new Date(currentDateObj),
        isCurrentMonth: currentDateObj.getMonth() === month,
        appointmentCount: dayAppointments.length,
        hasAppointments: dayAppointments.length > 0
      });
      currentDateObj.setDate(currentDateObj.getDate() + 1);
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const todayAppointments = getAppointmentsForDate(selectedDate);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-burgundy-700">Quản lý lịch hẹn</h2>
          <p className="text-gray-600">Theo dõi và quản lý lịch hẹn khách hàng</p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-burgundy-500 hover:bg-burgundy-600"
        >
          <Plus size={16} className="mr-2" />
          Thêm lịch hẹn
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-500">
              {appointments.filter(a => a.status === 'scheduled').length}
            </div>
            <div className="text-sm text-gray-600">Đã đặt</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-500">
              {appointments.filter(a => a.status === 'confirmed').length}
            </div>
            <div className="text-sm text-gray-600">Đã xác nhận</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-500">
              {appointments.filter(a => a.status === 'completed').length}
            </div>
            <div className="text-sm text-gray-600">Hoàn thành</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-burgundy-500">
              {todayAppointments.length}
            </div>
            <div className="text-sm text-gray-600">Hôm nay</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Lịch</CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateMonth(-1)}
                >
                  <ChevronLeft size={16} />
                </Button>
                <span className="font-semibold min-w-[120px] text-center">
                  {currentDate.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateMonth(1)}
                >
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 mb-4">
              {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(day => (
                <div key={day} className="text-center text-sm font-semibold text-gray-600 p-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedDate(day.date)}
                  className={`
                    p-2 text-sm rounded-lg transition-colors relative
                    ${day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                    ${day.date.toDateString() === selectedDate.toDateString() 
                      ? 'bg-burgundy-500 text-white' 
                      : 'hover:bg-burgundy-50'
                    }
                    ${day.date.toDateString() === new Date().toDateString() 
                      ? 'ring-2 ring-burgundy-300' 
                      : ''
                    }
                  `}
                >
                  {day.date.getDate()}
                  {day.hasAppointments && (
                    <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Today's Appointments */}
        <Card>
          <CardHeader>
            <CardTitle>
              Lịch hẹn ngày {selectedDate.toLocaleDateString('vi-VN')}
            </CardTitle>
            <CardDescription>
              {todayAppointments.length} lịch hẹn
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayAppointments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Calendar size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Không có lịch hẹn nào</p>
                </div>
              ) : (
                todayAppointments
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .map((appointment) => (
                    <div
                      key={appointment.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-burgundy-300 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold">{appointment.customerName}</h4>
                          <p className="text-sm text-gray-600">{appointment.service}</p>
                        </div>
                        {getStatusBadge(appointment.status)}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          {appointment.time}
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone size={14} />
                          {appointment.phone}
                        </div>
                      </div>

                      {appointment.notes && (
                        <p className="text-sm text-gray-600 mb-3">{appointment.notes}</p>
                      )}

                      <div className="flex gap-2">
                        {appointment.status === 'scheduled' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                            className="border-green-500 text-green-600 hover:bg-green-50"
                          >
                            <Check size={14} className="mr-1" />
                            Xác nhận
                          </Button>
                        )}
                        {appointment.status === 'confirmed' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                            className="border-purple-500 text-purple-600 hover:bg-purple-50"
                          >
                            <Check size={14} className="mr-1" />
                            Hoàn thành
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                          className="border-red-500 text-red-600 hover:bg-red-50"
                        >
                          <X size={14} className="mr-1" />
                          Hủy
                        </Button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Appointment Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-burgundy-700">Thêm lịch hẹn mới</h3>
              <Button
                variant="ghost"
                onClick={() => setShowAddForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="customerName">Tên khách hàng *</Label>
                <Input
                  id="customerName"
                  value={newAppointment.customerName}
                  onChange={(e) => setNewAppointment({
                    ...newAppointment,
                    customerName: e.target.value
                  })}
                  placeholder="Nhập tên khách hàng"
                />
              </div>

              <div>
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  value={newAppointment.phone}
                  onChange={(e) => setNewAppointment({
                    ...newAppointment,
                    phone: e.target.value
                  })}
                  placeholder="Nhập số điện thoại"
                />
              </div>

              <div>
                <Label htmlFor="service">Dịch vụ</Label>
                <Input
                  id="service"
                  value={newAppointment.service}
                  onChange={(e) => setNewAppointment({
                    ...newAppointment,
                    service: e.target.value
                  })}
                  placeholder="Nhập dịch vụ"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Ngày *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newAppointment.date}
                    onChange={(e) => setNewAppointment({
                      ...newAppointment,
                      date: e.target.value
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="time">Giờ *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newAppointment.time}
                    onChange={(e) => setNewAppointment({
                      ...newAppointment,
                      time: e.target.value
                    })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Ghi chú</Label>
                <Textarea
                  id="notes"
                  value={newAppointment.notes}
                  onChange={(e) => setNewAppointment({
                    ...newAppointment,
                    notes: e.target.value
                  })}
                  placeholder="Ghi chú thêm..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowAddForm(false)}
                className="border-burgundy-500 text-burgundy-500 hover:bg-burgundy-50"
              >
                Hủy
              </Button>
              <Button
                onClick={handleAddAppointment}
                className="bg-burgundy-500 hover:bg-burgundy-600"
              >
                Thêm lịch hẹn
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentManagement;
