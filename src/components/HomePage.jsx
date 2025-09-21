import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Users, Calendar, BarChart3, Sparkles, Shield, Heart } from 'lucide-react';

const HomePage = ({ setActiveSection }) => {
  const features = [
    {
      icon: FileText,
      title: 'Tư vấn chuyên nghiệp',
      description: 'Hệ thống tư vấn 4 bước với công nghệ JOICO DEFY DAMAGE',
      action: () => setActiveSection('consultation')
    },
    {
      icon: Users,
      title: 'Quản lý khách hàng',
      description: 'Lưu trữ và theo dõi lịch sử điều trị của từng khách hàng',
      action: () => setActiveSection('customers')
    },
    {
      icon: Calendar,
      title: 'Đặt lịch hẹn',
      description: 'Quản lý lịch hẹn và nhắc nhở khách hàng tự động',
      action: () => setActiveSection('appointments')
    },
    {
      icon: BarChart3,
      title: 'Báo cáo thống kê',
      description: 'Phân tích dữ liệu và theo dõi hiệu quả điều trị',
      action: () => setActiveSection('reports')
    }
  ];

  const benefits = [
    {
      icon: Sparkles,
      title: 'Công nghệ JOICO',
      description: 'Sử dụng sản phẩm và phương pháp điều trị tiên tiến từ JOICO'
    },
    {
      icon: Shield,
      title: 'Bảo vệ tóc khỏi hư tổn',
      description: 'Hệ thống DEFY DAMAGE giúp phục hồi và bảo vệ tóc hiệu quả'
    },
    {
      icon: Heart,
      title: 'Chăm sóc tận tâm',
      description: 'Đội ngũ chuyên gia tư vấn và theo dõi sức khỏe tóc 24/7'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-burgundy-500 to-burgundy-700 text-white rounded-lg p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Chào mừng đến với Chí Tâm Hair Salon</h2>
        <p className="text-lg mb-6 opacity-90">
          Hệ thống tư vấn và quản lý khách hàng chuyên nghiệp với công nghệ JOICO DEFY DAMAGE
        </p>
        <Button 
          size="lg" 
          variant="secondary"
          className="bg-white text-burgundy-500 hover:bg-burgundy-50"
          onClick={() => setActiveSection('consultation')}
        >
          Bắt đầu tư vấn ngay
        </Button>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card 
              key={index} 
              className="hover:shadow-lg transition-shadow cursor-pointer border-burgundy-100 hover:border-burgundy-300"
              onClick={feature.action}
            >
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-burgundy-100 rounded-full flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-burgundy-500" />
                </div>
                <CardTitle className="text-burgundy-700">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Benefits Section */}
      <div className="bg-burgundy-50 rounded-lg p-8">
        <h3 className="text-2xl font-bold text-burgundy-700 text-center mb-8">
          Tại sao chọn Chí Tâm Hair Salon?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div key={index} className="text-center">
                <div className="mx-auto w-16 h-16 bg-burgundy-500 rounded-full flex items-center justify-center mb-4">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-burgundy-700 mb-2">
                  {benefit.title}
                </h4>
                <p className="text-gray-600">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-burgundy-100 text-center">
          <div className="text-2xl font-bold text-burgundy-500">150+</div>
          <div className="text-sm text-gray-600">Khách hàng đã tư vấn</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-burgundy-100 text-center">
          <div className="text-2xl font-bold text-burgundy-500">95%</div>
          <div className="text-sm text-gray-600">Khách hàng hài lòng</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-burgundy-100 text-center">
          <div className="text-2xl font-bold text-burgundy-500">24/7</div>
          <div className="text-sm text-gray-600">Hỗ trợ khách hàng</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-burgundy-100 text-center">
          <div className="text-2xl font-bold text-burgundy-500">5+</div>
          <div className="text-sm text-gray-600">Năm kinh nghiệm</div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
