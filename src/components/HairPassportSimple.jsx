import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, User, Calendar, Download, Camera } from 'lucide-react';

const HairPassportSimple = ({ 
  customerInfo, 
  quizResults, 
  professionalTests, 
  beforePhoto,
  onSave,
  onScheduleFollowUp 
}) => {
  // Thông tin khách hàng mặc định
  const customer = customerInfo || {
    name: 'Khách hàng mẫu',
    phone: '0123456789',
    email: 'customer@example.com',
    visitDate: new Date().toLocaleDateString('vi-VN')
  };

  // Tạo ID duy nhất cho Hair Passport
  const passportId = `HP${Date.now().toString().slice(-6)}`;

  // Tính điểm số dựa trên dữ liệu thực tế
  const calculateScore = () => {
    if (!quizResults) {
      return {
        overallScore: 0,
        healthLevel: {
          level: 'Chưa đánh giá',
          color: 'text-gray-600 bg-gray-100',
          description: 'Chưa có dữ liệu chẩn đoán',
          icon: '❓'
        },
        categoryScores: {
          structure: 0,
          moisture: 0,
          damage: 0,
          scalp: 0,
          strength: 0
        }
      };
    }

    const { totalScore, categoryScores, analysis } = quizResults;
    const overallScore = totalScore || 0;
    
    let healthLevel;
    if (overallScore >= 8) {
      healthLevel = {
        level: 'Xuất sắc',
        color: 'text-green-600 bg-green-100',
        description: 'Tóc rất khỏe mạnh và được chăm sóc tốt',
        icon: '🌟'
      };
    } else if (overallScore >= 6) {
      healthLevel = {
        level: 'Tốt',
        color: 'text-blue-600 bg-blue-100',
        description: 'Tóc khỏe mạnh với một vài vấn đề nhỏ cần chú ý',
        icon: '✨'
      };
    } else if (overallScore >= 4) {
      healthLevel = {
        level: 'Trung bình',
        color: 'text-yellow-600 bg-yellow-100',
        description: 'Tóc cần được chăm sóc và điều trị nhiều hơn',
        icon: '⚠️'
      };
    } else {
      healthLevel = {
        level: 'Cần chăm sóc',
        color: 'text-red-600 bg-red-100',
        description: 'Tóc cần được điều trị chuyên sâu ngay lập tức',
        icon: '🚨'
      };
    }

    return {
      overallScore,
      healthLevel,
      categoryScores: categoryScores || {
        structure: 0,
        moisture: 0,
        damage: 0,
        scalp: 0,
        strength: 0
      }
    };
  };

  const scoreData = calculateScore();

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'structure': return '🔬';
      case 'moisture': return '💧';
      case 'damage': return '🛡️';
      case 'scalp': return '🧴';
      case 'strength': return '💪';
      default: return '⭐';
    }
  };

  const categoryNames = {
    structure: 'Cấu Trúc',
    moisture: 'Độ Ẩm', 
    damage: 'Hư Tổn',
    scalp: 'Da Đầu',
    strength: 'Sức Mạnh'
  };

  return (
    <div id="hair-passport-content" className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-burgundy-100 rounded-full">
            <Star className="w-8 h-8 text-burgundy-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-burgundy-700 mb-2">
          Hair Passport
        </h1>
        <p className="text-gray-600">
          Hộ chiếu tóc chuyên nghiệp - Chí Tâm Hair Salon
        </p>
        <Badge variant="outline" className="mt-2">
          ID: {passportId}
        </Badge>
      </div>

      {/* Thông tin khách hàng */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Thông Tin Khách Hàng
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Họ tên</p>
              <p className="font-semibold">{customer.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Số điện thoại</p>
              <p className="font-semibold">{customer.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Ngày thăm khám</p>
              <p className="font-semibold">{customer.visitDate}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Điểm số tổng thể */}
      <Card className="border-2 border-burgundy-200">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-burgundy-700">
            Điểm Số Sức Khỏe Tóc
          </CardTitle>
          <div className="flex justify-center items-center gap-4 mt-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-burgundy-600 mb-2">
                {scoreData.overallScore}/10
              </div>
              <Badge className={scoreData.healthLevel.color}>
                {scoreData.healthLevel.level}
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">
                {scoreData.healthLevel.icon}
              </div>
              <p className="text-sm text-gray-600 max-w-xs">
                {scoreData.healthLevel.description}
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Phân tích chi tiết theo danh mục */}
      <Card>
        <CardHeader>
          <CardTitle>Phân Tích Chi Tiết</CardTitle>
          <CardDescription>
            Điểm số từng khía cạnh sức khỏe tóc
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(scoreData.categoryScores).map(([category, score]) => (
              <div key={category} className="text-center p-4 border rounded-lg">
                <div className="text-2xl mb-2">
                  {getCategoryIcon(category)}
                </div>
                <h4 className="font-semibold text-sm mb-2">
                  {categoryNames[category]}
                </h4>
                <div className="text-2xl font-bold mb-2">
                  {score}/10
                </div>
                <Badge className={score >= 8 ? 'text-green-600 bg-green-100' : 
                                 score >= 6 ? 'text-blue-600 bg-blue-100' : 
                                 'text-yellow-600 bg-yellow-100'}>
                  {score >= 8 ? 'Tốt' : score >= 6 ? 'Khá' : 'TB'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Ảnh trước điều trị */}
      {beforePhoto && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Ảnh Trước Điều Trị
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <img 
                src={beforePhoto} 
                alt="Ảnh trước điều trị" 
                className="max-w-md rounded-lg shadow-md"
              />
            </div>
            <p className="text-center text-sm text-gray-600 mt-2">
              Chụp ngày: {customer.visitDate}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Kế hoạch điều trị đơn giản */}
      <Card>
        <CardHeader>
          <CardTitle>Kế Hoạch Điều Trị</CardTitle>
          <CardDescription>
            Lộ trình chăm sóc được đề xuất
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-burgundy-600 mb-2">
              Điều trị tại salon
            </h4>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>K-PAK Deep Penetrating Reconstructor Treatment</li>
              <li>Moisture Recovery Treatment</li>
              <li>Scalp Therapy Treatment</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-blue-600 mb-2">
              Chăm sóc tại nhà
            </h4>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>K-PAK Reconstructing Shampoo</li>
              <li>K-PAK Deep Penetrating Reconstructor</li>
              <li>Daily Leave-in Protection</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-green-600 mb-2">
              Lộ trình thời gian
            </h4>
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Tuần 1:</p>
                  <p className="text-sm text-gray-600">Bắt đầu homecare routine</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Tuần 2:</p>
                  <p className="text-sm text-gray-600">Điều trị tại salon + chụp ảnh theo dõi</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Tuần 6:</p>
                  <p className="text-sm text-gray-600">Điều trị tại salon lần 2</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Nút hành động */}
      <div className="flex justify-center">
        <Button 
          onClick={() => onScheduleFollowUp && onScheduleFollowUp({
            customerId: customer.id,
            recommendedDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            treatmentType: 'maintenance',
            notes: `Follow-up cho Hair Passport ${passportId}`
          })}
          className="bg-burgundy-500 hover:bg-burgundy-600"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Đặt lịch hẹn tiếp theo
        </Button>
      </div>

      {/* Footer */}
      <div className="text-center pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          Hair Passport được tạo bởi <span className="font-semibold">Chí Tâm Hair Salon</span>
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Powered by JOICO DEFY DAMAGE Technology
        </p>
      </div>
    </div>
  );
};

export default HairPassportSimple;
