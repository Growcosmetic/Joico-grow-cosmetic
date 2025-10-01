import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Bell, 
  Clock, 
  Mail, 
  Phone, 
  Calendar,
  Camera,
  CheckCircle,
  AlertCircle,
  Settings,
  User,
  MessageCircle,
  Smartphone,
  Send,
  History,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';

const ReminderSystem = () => {
  const [reminders, setReminders] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [settings, setSettings] = useState({
    emailEnabled: true,
    smsEnabled: false,
    pushEnabled: true,
    autoSchedule: true
  });
  const [newReminder, setNewReminder] = useState({
    customerId: '',
    customerName: '',
    type: '48_hours',
    scheduledDate: '',
    message: '',
    method: 'email'
  });
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Các loại nhắc lịch theo quy trình JOICO
  const reminderTypes = {
    '48_hours': {
      name: '48 Giờ Đầu',
      description: 'Hướng dẫn chăm sóc sau điều trị',
      icon: <AlertCircle className="w-5 h-5 text-orange-500" />,
      defaultMessage: 'Chào bạn! Đây là lời nhắc quan trọng về việc chăm sóc tóc trong 48 giờ đầu sau điều trị tại Chí Tâm Hair Salon...',
      timing: '48 giờ sau điều trị'
    },
    '7_days': {
      name: 'Kiểm Tra 7 Ngày',
      description: 'Chụp ảnh theo dõi tiến độ',
      icon: <Camera className="w-5 h-5 text-blue-500" />,
      defaultMessage: 'Xin chào! Đã 1 tuần kể từ khi bạn điều trị tại salon. Hãy chụp ảnh tóc hiện tại để chúng tôi theo dõi tiến độ...',
      timing: '7 ngày sau điều trị'
    },
    '28_days': {
      name: 'Tái Đánh Giá 28 Ngày',
      description: 'Đo lại điểm số và đặt lịch hẹn',
      icon: <CheckCircle className="w-5 h-5 text-green-500" />,
      defaultMessage: 'Chúc mừng! Đã gần 1 tháng kể từ liệu trình điều trị. Đã đến lúc tái đánh giá và lên kế hoạch tiếp theo...',
      timing: '28-30 ngày sau điều trị'
    },
    'follow_up': {
      name: 'Theo Dõi Tùy Chỉnh',
      description: 'Nhắc lịch theo yêu cầu',
      icon: <Bell className="w-5 h-5 text-purple-500" />,
      defaultMessage: 'Xin chào! Đây là lời nhắc từ Chí Tâm Hair Salon...',
      timing: 'Tùy chỉnh'
    }
  };

  // Load dữ liệu từ localStorage khi component mount
  useEffect(() => {
    loadReminders();
    loadTemplates();
    loadSettings();
  }, []);

  const loadReminders = () => {
    const savedReminders = localStorage.getItem('reminderSystem');
    if (savedReminders) {
      setReminders(JSON.parse(savedReminders));
    } else {
      // Tạo dữ liệu mẫu
      const sampleReminders = [
        {
          id: 1,
          customerId: 'KH001',
          customerName: 'Nguyễn Thị Mai',
          type: '48_hours',
          scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'scheduled',
          method: 'email',
          message: reminderTypes['48_hours'].defaultMessage,
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          customerId: 'KH002',
          customerName: 'Trần Văn Nam',
          type: '7_days',
          scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'scheduled',
          method: 'email',
          message: reminderTypes['7_days'].defaultMessage,
          createdAt: new Date().toISOString()
        },
        {
          id: 3,
          customerId: 'KH003',
          customerName: 'Lê Thị Hoa',
          type: '28_days',
          scheduledDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'sent',
          method: 'email',
          message: reminderTypes['28_days'].defaultMessage,
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          sentAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      setReminders(sampleReminders);
      localStorage.setItem('reminderSystem', JSON.stringify(sampleReminders));
    }
  };

  const loadTemplates = () => {
    const savedTemplates = localStorage.getItem('reminderTemplates');
    if (savedTemplates) {
      setTemplates(JSON.parse(savedTemplates));
    } else {
      // Tạo templates mặc định
      const defaultTemplates = Object.entries(reminderTypes).map(([key, type]) => ({
        id: key,
        name: type.name,
        subject: `${type.name} - Chí Tâm Hair Salon`,
        message: type.defaultMessage,
        type: key
      }));
      setTemplates(defaultTemplates);
      localStorage.setItem('reminderTemplates', JSON.stringify(defaultTemplates));
    }
  };

  const loadSettings = () => {
    const savedSettings = localStorage.getItem('reminderSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  };

  const saveSettings = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem('reminderSettings', JSON.stringify(newSettings));
  };

  const createReminder = () => {
    if (!newReminder.customerName || !newReminder.scheduledDate) {
      alert('Vui lòng điền đầy đủ thông tin khách hàng và ngày nhắc lịch');
      return;
    }

    const reminder = {
      id: Date.now(),
      ...newReminder,
      status: 'scheduled',
      createdAt: new Date().toISOString(),
      message: newReminder.message || reminderTypes[newReminder.type].defaultMessage
    };

    const updatedReminders = [...reminders, reminder];
    setReminders(updatedReminders);
    localStorage.setItem('reminderSystem', JSON.stringify(updatedReminders));

    // Reset form
    setNewReminder({
      customerId: '',
      customerName: '',
      type: '48_hours',
      scheduledDate: '',
      message: '',
      method: 'email'
    });
    setShowCreateForm(false);
    alert('Đã tạo nhắc lịch thành công!');
  };

  const deleteReminder = (id) => {
    if (confirm('Bạn có chắc muốn xóa nhắc lịch này?')) {
      const updatedReminders = reminders.filter(r => r.id !== id);
      setReminders(updatedReminders);
      localStorage.setItem('reminderSystem', JSON.stringify(updatedReminders));
    }
  };

  const sendReminder = (id) => {
    const reminder = reminders.find(r => r.id === id);
    if (!reminder) return;

    // Simulate sending reminder
    const updatedReminders = reminders.map(r => 
      r.id === id 
        ? { ...r, status: 'sent', sentAt: new Date().toISOString() }
        : r
    );
    setReminders(updatedReminders);
    localStorage.setItem('reminderSystem', JSON.stringify(updatedReminders));
    alert(`Đã gửi nhắc lịch cho ${reminder.customerName} qua ${reminder.method}`);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'scheduled':
        return <Badge className="bg-blue-100 text-blue-600">Đã lên lịch</Badge>;
      case 'sent':
        return <Badge className="bg-green-100 text-green-600">Đã gửi</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-600">Thất bại</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-600">Không xác định</Badge>;
    }
  };

  const getMethodIcon = (method) => {
    switch (method) {
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'sms':
        return <MessageCircle className="w-4 h-4" />;
      case 'push':
        return <Smartphone className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isOverdue = (scheduledDate, status) => {
    return status === 'scheduled' && new Date(scheduledDate) < new Date();
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-burgundy-700">
            Hệ Thống Nhắc Lịch Tự Động
          </h1>
          <p className="text-gray-600 mt-2">
            Quản lý và theo dõi lịch nhắc khách hàng theo quy trình JOICO
          </p>
        </div>
        <Button 
          onClick={() => setShowCreateForm(true)}
          className="bg-burgundy-500 hover:bg-burgundy-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tạo nhắc lịch mới
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Đã lên lịch</p>
                <p className="text-2xl font-bold text-blue-600">
                  {reminders.filter(r => r.status === 'scheduled').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Đã gửi</p>
                <p className="text-2xl font-bold text-green-600">
                  {reminders.filter(r => r.status === 'sent').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Quá hạn</p>
                <p className="text-2xl font-bold text-red-600">
                  {reminders.filter(r => isOverdue(r.scheduledDate, r.status)).length}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng cộng</p>
                <p className="text-2xl font-bold text-burgundy-600">
                  {reminders.length}
                </p>
              </div>
              <Bell className="w-8 h-8 text-burgundy-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Reminder Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Tạo Nhắc Lịch Mới</CardTitle>
            <CardDescription>
              Thiết lập nhắc lịch tự động cho khách hàng
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Tên khách hàng</label>
                <Input
                  value={newReminder.customerName}
                  onChange={(e) => setNewReminder({...newReminder, customerName: e.target.value})}
                  placeholder="Nhập tên khách hàng"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Mã khách hàng</label>
                <Input
                  value={newReminder.customerId}
                  onChange={(e) => setNewReminder({...newReminder, customerId: e.target.value})}
                  placeholder="Nhập mã khách hàng (tùy chọn)"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Loại nhắc lịch</label>
                <select
                  value={newReminder.type}
                  onChange={(e) => setNewReminder({...newReminder, type: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  {Object.entries(reminderTypes).map(([key, type]) => (
                    <option key={key} value={key}>{type.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phương thức gửi</label>
                <select
                  value={newReminder.method}
                  onChange={(e) => setNewReminder({...newReminder, method: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                  <option value="push">Push Notification</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Ngày giờ gửi</label>
              <Input
                type="datetime-local"
                value={newReminder.scheduledDate}
                onChange={(e) => setNewReminder({...newReminder, scheduledDate: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Nội dung tin nhắn</label>
              <Textarea
                value={newReminder.message}
                onChange={(e) => setNewReminder({...newReminder, message: e.target.value})}
                placeholder={reminderTypes[newReminder.type]?.defaultMessage}
                rows={4}
              />
            </div>

            <div className="flex gap-3">
              <Button onClick={createReminder} className="bg-burgundy-500 hover:bg-burgundy-600">
                Tạo nhắc lịch
              </Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Hủy
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reminders List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh Sách Nhắc Lịch</CardTitle>
          <CardDescription>
            Quản lý tất cả các nhắc lịch đã tạo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reminders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Chưa có nhắc lịch nào được tạo</p>
              </div>
            ) : (
              reminders.map((reminder) => (
                <div 
                  key={reminder.id} 
                  className={`p-4 border rounded-lg ${
                    isOverdue(reminder.scheduledDate, reminder.status) 
                      ? 'border-red-200 bg-red-50' 
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {reminderTypes[reminder.type]?.icon}
                        <h3 className="font-semibold text-gray-800">
                          {reminderTypes[reminder.type]?.name}
                        </h3>
                        {getStatusBadge(reminder.status)}
                        {isOverdue(reminder.scheduledDate, reminder.status) && (
                          <Badge className="bg-red-100 text-red-600">Quá hạn</Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>{reminder.customerName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(reminder.scheduledDate)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {getMethodIcon(reminder.method)}
                          <span className="capitalize">{reminder.method}</span>
                        </div>
                      </div>

                      {reminder.sentAt && (
                        <div className="mt-2 text-sm text-green-600">
                          Đã gửi: {formatDate(reminder.sentAt)}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {reminder.status === 'scheduled' && (
                        <Button
                          size="sm"
                          onClick={() => sendReminder(reminder.id)}
                          className="bg-green-500 hover:bg-green-600"
                        >
                          <Send className="w-4 h-4 mr-1" />
                          Gửi ngay
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteReminder(reminder.id)}
                        className="text-red-500 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Cài Đặt Hệ Thống
          </CardTitle>
          <CardDescription>
            Cấu hình các tùy chọn cho hệ thống nhắc lịch
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800">Phương thức gửi</h4>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-500" />
                  <span>Email</span>
                </div>
                <Switch
                  checked={settings.emailEnabled}
                  onCheckedChange={(checked) => 
                    saveSettings({...settings, emailEnabled: checked})
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-green-500" />
                  <span>SMS</span>
                </div>
                <Switch
                  checked={settings.smsEnabled}
                  onCheckedChange={(checked) => 
                    saveSettings({...settings, smsEnabled: checked})
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-purple-500" />
                  <span>Push Notification</span>
                </div>
                <Switch
                  checked={settings.pushEnabled}
                  onCheckedChange={(checked) => 
                    saveSettings({...settings, pushEnabled: checked})
                  }
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800">Tự động hóa</h4>
              
              <div className="flex items-center justify-between">
                <div>
                  <span>Tự động tạo nhắc lịch</span>
                  <p className="text-sm text-gray-500">
                    Tự động tạo nhắc lịch khi khách hàng hoàn thành điều trị
                  </p>
                </div>
                <Switch
                  checked={settings.autoSchedule}
                  onCheckedChange={(checked) => 
                    saveSettings({...settings, autoSchedule: checked})
                  }
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReminderSystem;
