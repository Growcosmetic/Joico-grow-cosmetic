import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import * as XLSX from 'xlsx';
import { customerService, appointmentService, consultationService } from '../firebase/firestore';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  DollarSign,
  Download,
  Filter,
  Eye
} from 'lucide-react';

const ReportsAnalytics = () => {
  const [customers, setCustomers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [consultations, setConsultations] = useState([]);

  useEffect(() => {
    // Load data from Firestore
    const loadData = async () => {
      try {
        const [customersData, appointmentsData, consultationsData] = await Promise.all([
          customerService.getAll(),
          appointmentService.getAll(),
          consultationService.getAll()
        ]);
        
        setCustomers(customersData);
        setAppointments(appointmentsData);
        setConsultations(consultationsData);
      } catch (error) {
        console.error('Error loading data for reports:', error);
      }
    };

    loadData();
  }, []);

  // Sample data for charts
  const monthlyRevenue = [
    { month: 'T1', revenue: 15000000, appointments: 45 },
    { month: 'T2', revenue: 18000000, appointments: 52 },
    { month: 'T3', revenue: 22000000, appointments: 61 },
    { month: 'T4', revenue: 19000000, appointments: 48 },
    { month: 'T5', revenue: 25000000, appointments: 67 },
    { month: 'T6', revenue: 28000000, appointments: 72 }
  ];

  const serviceDistribution = [
    { name: 'DEFY DAMAGE', value: 35, color: '#722F37' },
    { name: 'Keratin', value: 25, color: '#8B4B5C' },
    { name: 'Amino', value: 20, color: '#A66B7A' },
    { name: 'Color Care', value: 15, color: '#C18B9B' },
    { name: 'Khác', value: 5, color: '#DCABBC' }
  ];

  const customerGrowth = [
    { month: 'T1', newCustomers: 12, totalCustomers: 45 },
    { month: 'T2', newCustomers: 15, totalCustomers: 60 },
    { month: 'T3', newCustomers: 18, totalCustomers: 78 },
    { month: 'T4', newCustomers: 10, totalCustomers: 88 },
    { month: 'T5', newCustomers: 22, totalCustomers: 110 },
    { month: 'T6', newCustomers: 25, totalCustomers: 135 }
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value);
  };

  const exportReportToExcel = () => {
    const wb = XLSX.utils.book_new();
    
    // Sheet 1: Tổng quan
    const summaryData = [
      ['Chỉ số', 'Giá trị'],
      ['Tổng số khách hàng', customers.length],
      ['Khách hàng đang hoạt động', customers.filter(c => c.status === 'active').length],
      ['Tổng số lịch hẹn', appointments.length],
      ['Lịch hẹn hoàn thành', appointments.filter(a => a.status === 'completed').length],
      ['Tỷ lệ khách hàng hoạt động', `${((customers.filter(c => c.status === 'active').length / customers.length) * 100 || 0).toFixed(1)}%`],
      ['Doanh thu tháng này', formatCurrency(monthlyRevenue[monthlyRevenue.length - 1]?.revenue || 0)]
    ];
    const summaryWS = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, summaryWS, 'Tổng quan');

    // Sheet 2: Doanh thu theo tháng
    const revenueData = [
      ['Tháng', 'Doanh thu (VNĐ)', 'Số lịch hẹn'],
      ...monthlyRevenue.map(item => [
        item.month,
        item.revenue,
        item.appointments
      ])
    ];
    const revenueWS = XLSX.utils.aoa_to_sheet(revenueData);
    XLSX.utils.book_append_sheet(wb, revenueWS, 'Doanh thu');

    // Sheet 3: Phân bố dịch vụ
    const serviceData = [
      ['Dịch vụ', 'Số lượng', 'Tỷ lệ (%)'],
      ...serviceDistribution.map(item => [
        item.name,
        item.value,
        `${((item.value / serviceDistribution.reduce((sum, s) => sum + s.value, 0)) * 100).toFixed(1)}%`
      ])
    ];
    const serviceWS = XLSX.utils.aoa_to_sheet(serviceData);
    XLSX.utils.book_append_sheet(wb, serviceWS, 'Dịch vụ');

    // Sheet 4: Danh sách khách hàng
    const customerData = [
      ['Họ tên', 'Số điện thoại', 'Email', 'Ngày sinh', 'Giới tính', 'Trạng thái', 'Tổng lần đến', 'Lần cuối'],
      ...customers.map(c => [
        c.name,
        c.phone,
        c.email || '',
        c.birthday ? new Date(c.birthday).toLocaleDateString('vi-VN') : '',
        c.gender === 'male' ? 'Nam' : c.gender === 'female' ? 'Nữ' : c.gender || '',
        c.status === 'active' ? 'Hoạt động' : 'Không hoạt động',
        c.totalVisits,
        c.lastVisit
      ])
    ];
    const customerWS = XLSX.utils.aoa_to_sheet(customerData);
    XLSX.utils.book_append_sheet(wb, customerWS, 'Khách hàng');

    // Set column widths for better formatting
    summaryWS['!cols'] = [{ wch: 25 }, { wch: 20 }];
    revenueWS['!cols'] = [{ wch: 10 }, { wch: 15 }, { wch: 12 }];
    serviceWS['!cols'] = [{ wch: 20 }, { wch: 12 }, { wch: 12 }];
    customerWS['!cols'] = [{ wch: 20 }, { wch: 15 }, { wch: 25 }, { wch: 12 }, { wch: 10 }, { wch: 12 }, { wch: 12 }, { wch: 12 }];

    // Save file
    XLSX.writeFile(wb, `Bao_cao_salon_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-burgundy-700">Báo cáo & Thống kê</h2>
          <p className="text-gray-600">Phân tích hiệu quả kinh doanh và xu hướng khách hàng</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-burgundy-500 text-burgundy-500 hover:bg-burgundy-50"
          >
            <Filter size={16} className="mr-2" />
            Lọc dữ liệu
          </Button>
          <Button
            onClick={exportReportToExcel}
            className="bg-burgundy-500 hover:bg-burgundy-600"
          >
            <Download size={16} className="mr-2" />
            Xuất Excel
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng khách hàng</p>
                <p className="text-2xl font-bold text-burgundy-600">{customers.length}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp size={12} className="mr-1" />
                  +12% so với tháng trước
                </p>
              </div>
              <div className="w-12 h-12 bg-burgundy-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-burgundy-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Lịch hẹn tháng này</p>
                <p className="text-2xl font-bold text-blue-600">{appointments.length}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp size={12} className="mr-1" />
                  +8% so với tháng trước
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Doanh thu tháng này</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(28000000)}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp size={12} className="mr-1" />
                  +15% so với tháng trước
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tỷ lệ hài lòng</p>
                <p className="text-2xl font-bold text-purple-600">95%</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp size={12} className="mr-1" />
                  +2% so với tháng trước
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Doanh thu theo tháng</CardTitle>
            <CardDescription>Theo dõi xu hướng doanh thu và số lượng lịch hẹn</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" orientation="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'revenue' ? formatCurrency(value) : value,
                    name === 'revenue' ? 'Doanh thu' : 'Lịch hẹn'
                  ]}
                />
                <Bar yAxisId="left" dataKey="revenue" fill="#722F37" name="revenue" />
                <Bar yAxisId="right" dataKey="appointments" fill="#A66B7A" name="appointments" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Service Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Phân bố dịch vụ</CardTitle>
            <CardDescription>Tỷ lệ sử dụng các dịch vụ khác nhau</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={serviceDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {serviceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Growth */}
        <Card>
          <CardHeader>
            <CardTitle>Tăng trưởng khách hàng</CardTitle>
            <CardDescription>Khách hàng mới và tổng số khách hàng theo tháng</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={customerGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="newCustomers" 
                  stroke="#722F37" 
                  strokeWidth={2}
                  name="Khách hàng mới"
                />
                <Line 
                  type="monotone" 
                  dataKey="totalCustomers" 
                  stroke="#A66B7A" 
                  strokeWidth={2}
                  name="Tổng khách hàng"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Services */}
        <Card>
          <CardHeader>
            <CardTitle>Dịch vụ phổ biến</CardTitle>
            <CardDescription>Top 5 dịch vụ được sử dụng nhiều nhất</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {serviceDistribution.map((service, index) => (
                <div key={service.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-burgundy-100 text-burgundy-700 font-semibold text-sm">
                      {index + 1}
                    </div>
                    <span className="font-medium">{service.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full" 
                        style={{ 
                          width: `${service.value}%`, 
                          backgroundColor: service.color 
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold w-12 text-right">{service.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Hoạt động gần đây</CardTitle>
          <CardDescription>Các hoạt động và giao dịch mới nhất</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Lịch hẹn mới</p>
                  <p className="text-sm text-gray-600">Nguyễn Thị Lan đặt lịch DEFY DAMAGE</p>
                </div>
              </div>
              <div className="text-right">
                <Badge className="bg-green-100 text-green-800">Hoàn thành</Badge>
                <p className="text-sm text-gray-500 mt-1">2 giờ trước</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Khách hàng mới</p>
                  <p className="text-sm text-gray-600">Trần Văn Minh đăng ký tư vấn</p>
                </div>
              </div>
              <div className="text-right">
                <Badge className="bg-blue-100 text-blue-800">Mới</Badge>
                <p className="text-sm text-gray-500 mt-1">5 giờ trước</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Thanh toán</p>
                  <p className="text-sm text-gray-600">Lê Thị Hoa thanh toán dịch vụ Amino</p>
                </div>
              </div>
              <div className="text-right">
                <Badge className="bg-purple-100 text-purple-800">Đã thanh toán</Badge>
                <p className="text-sm text-gray-500 mt-1">1 ngày trước</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsAnalytics;
