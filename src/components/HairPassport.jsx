import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Download,
  Share2,
  Calendar,
  User,
  Phone,
  Mail,
  Camera,
  Star,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  Heart,
  Shield,
  Droplets,
  Sparkles,
  Scissors,
  Target
} from 'lucide-react';
import { 
  calculateCombinedScore, 
  generateHairPassportScore, 
  generateComprehensiveRecommendations,
  getHairHealthLevel 
} from '../utils/hairAnalysis';

const HairPassport = ({ 
  customerInfo, 
  quizResults, 
  professionalTests, 
  beforePhoto,
  onSave,
  onScheduleFollowUp 
}) => {
  const [showFullReport, setShowFullReport] = useState(false);
  const passportRef = useRef(null);

  // Tính toán điểm số tổng hợp
  const combinedAnalysis = calculateCombinedScore(quizResults, professionalTests);
  const passportScore = generateHairPassportScore({ 
    ...combinedAnalysis, 
    breakdown: { 
      quiz: quizResults?.scores || {}, 
      professional: professionalTests || {} 
    } 
  });
  const recommendations = generateComprehensiveRecommendations({
    quizResults,
    professionalTests,
    combinedScore: combinedAnalysis?.combinedScore || 5
  });

  // Thông tin khách hàng mặc định nếu không có
  const customer = customerInfo || {
    name: 'Khách hàng',
    phone: '',
    email: '',
    visitDate: new Date().toLocaleDateString('vi-VN')
  };

  // Tạo ID duy nhất cho Hair Passport
  const passportId = `HP${Date.now().toString().slice(-6)}`;

  // Lấy icon cho từng category
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'structure': return <Sparkles className="w-4 h-4" />;
      case 'moisture': return <Droplets className="w-4 h-4" />;
      case 'damage': return <Shield className="w-4 h-4" />;
      case 'scalp': return <Camera className="w-4 h-4" />;
      case 'strength': return <Heart className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  // Lấy màu cho điểm số
  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-600 bg-green-100';
    if (score >= 6) return 'text-blue-600 bg-blue-100';
    if (score >= 4) return 'text-yellow-600 bg-yellow-100';
    if (score >= 2) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  // Xuất PDF Hair Passport
  const exportToPDF = () => {
    // Sẽ implement sau với thư viện PDF
    alert('Tính năng xuất PDF sẽ được phát triển trong phiên bản tiếp theo');
  };

  // Chia sẻ Hair Passport
  const sharePassport = () => {
    if (navigator.share) {
      navigator.share({
        title: `Hair Passport - ${customer.name}`,
        text: `Kết quả chẩn đoán tóc chuyên nghiệp từ Chí Tâm Hair Salon`,
        url: window.location.href
      });
    } else {
      // Fallback: copy link
      navigator.clipboard.writeText(window.location.href);
      alert('Link đã được copy vào clipboard');
    }
  };

  // Lên lịch hẹn tiếp theo
  const scheduleNextAppointment = () => {
    if (onScheduleFollowUp) {
      onScheduleFollowUp({
        customerId: customer.id,
        recommendedDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 tuần sau
        treatmentType: recommendations.priority === 'high' ? 'urgent' : 'maintenance',
        notes: `Follow-up cho Hair Passport ${passportId}`
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
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
              <p className="font-semibold">{customer.phone || 'Chưa cập nhật'}</p>
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
                {passportScore?.overallScore || 0}/10
              </div>
              <Badge className={passportScore?.healthLevel?.color || 'bg-gray-100'}>
                {passportScore?.healthLevel?.level || 'Chưa đánh giá'}
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">
                {passportScore?.healthLevel?.icon || '📊'}
              </div>
              <p className="text-sm text-gray-600 max-w-xs">
                {passportScore?.healthLevel?.description || 'Đang phân tích...'}
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
            {passportScore?.categoryScores && Object.entries(passportScore.categoryScores).map(([category, score]) => {
              const categoryNames = {
                structure: 'Cấu Trúc',
                moisture: 'Độ Ẩm', 
                damage: 'Hư Tổn',
                scalp: 'Da Đầu',
                strength: 'Sức Mạnh'
              };
              
              return (
                <div key={category} className="text-center p-4 border rounded-lg">
                  <div className="flex justify-center mb-2">
                    {getCategoryIcon(category)}
                  </div>
                  <h4 className="font-semibold text-sm mb-2">
                    {categoryNames[category]}
                  </h4>
                  <div className="text-2xl font-bold mb-2">
                    {score}/10
                  </div>
                  <Progress value={score * 10} className="h-2" />
                  <Badge className={`mt-2 text-xs ${getScoreColor(score)}`}>
                    {score >= 8 ? 'Tốt' : score >= 6 ? 'Khá' : score >= 4 ? 'TB' : 'Kém'}
                  </Badge>
                </div>
              );
            })}
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

      {/* Kế hoạch điều trị */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Kế Hoạch Điều Trị
          </CardTitle>
          <CardDescription>
            Lộ trình chăm sóc được cá nhân hóa
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Mức độ ưu tiên */}
          <div className="flex items-center gap-2 mb-4">
            <Badge className={
              recommendations.priority === 'high' ? 'bg-red-500 text-white' :
              recommendations.priority === 'medium' ? 'bg-yellow-500 text-white' :
              'bg-green-500 text-white'
            }>
              {recommendations.priority === 'high' ? 'Ưu tiên cao' :
               recommendations.priority === 'medium' ? 'Ưu tiên trung bình' :
               'Duy trì'}
            </Badge>
            {recommendations.priority === 'high' && (
              <AlertCircle className="w-4 h-4 text-red-500" />
            )}
          </div>

          {/* Điều trị tức thì */}
          {recommendations.immediate.length > 0 && (
            <div>
              <h4 className="font-semibold text-red-600 mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Cần điều trị ngay
              </h4>
              <ul className="list-disc list-inside text-sm space-y-1">
                {recommendations.immediate.map((item, index) => (
                  <li key={index} className="text-gray-700">{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Điều trị tại salon */}
          <div>
            <h4 className="font-semibold text-burgundy-600 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Điều trị tại salon
            </h4>
            <ul className="list-disc list-inside text-sm space-y-1">
              {recommendations.salon.slice(0, 5).map((item, index) => (
                <li key={index} className="text-gray-700">{item}</li>
              ))}
            </ul>
          </div>

          {/* Chăm sóc tại nhà */}
          <div>
            <h4 className="font-semibold text-blue-600 mb-2 flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Chăm sóc tại nhà
            </h4>
            <div className="space-y-2">
              <div>
                <p className="text-sm font-medium text-gray-700">Sản phẩm cần thiết:</p>
                <ul className="list-disc list-inside text-sm ml-4">
                  {recommendations.products.essential.slice(0, 3).map((item, index) => (
                    <li key={index} className="text-gray-600">{item}</li>
                  ))}
                </ul>
              </div>
              {recommendations.products.recommended.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700">Được khuyến nghị:</p>
                  <ul className="list-disc list-inside text-sm ml-4">
                    {recommendations.products.recommended.slice(0, 2).map((item, index) => (
                      <li key={index} className="text-gray-600">{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h4 className="font-semibold text-green-600 mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Lộ trình thời gian
            </h4>
            <div className="space-y-2">
              {Object.entries(recommendations.timeline).map(([period, activity]) => (
                <div key={period} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {period.replace('week', 'Tuần ')}:
                    </p>
                    <p className="text-sm text-gray-600">{activity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tiềm năng cải thiện */}
      {passportScore?.improvementPotential && (
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <TrendingUp className="w-5 h-5" />
              Tiềm Năng Cải Thiện
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Điểm hiện tại</p>
                <p className="text-2xl font-bold text-gray-800">
                  {passportScore.improvementPotential.currentScore}/10
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Tiềm năng tối đa</p>
                <p className="text-2xl font-bold text-green-600">
                  {passportScore.improvementPotential.maxPotential}/10
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Thời gian dự kiến</p>
                <p className="text-lg font-semibold text-blue-600">
                  {passportScore.improvementPotential.timeframe}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <Progress 
                value={(passportScore.improvementPotential.currentScore / passportScore.improvementPotential.maxPotential) * 100}
                className="h-3"
              />
              <p className="text-center text-sm text-gray-600 mt-2">
                Có thể cải thiện thêm {passportScore.improvementPotential.improvementRange} điểm
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hướng dẫn 48 giờ đầu */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-700">
            <Info className="w-5 h-5" />
            Hướng Dẫn 48 Giờ Đầu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-800">Tránh gội đầu trong 24 giờ đầu</p>
                <p className="text-sm text-gray-600">Để dưỡng chất thẩm thấu hoàn toàn</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-800">Sử dụng sản phẩm được khuyến nghị</p>
                <p className="text-sm text-gray-600">Chỉ dùng sản phẩm JOICO chuyên nghiệp</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-800">Tránh nhiệt độ cao</p>
                <p className="text-sm text-gray-600">Hạn chế sử dụng máy sấy, máy duỗi trong 48 giờ</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-800">Chụp ảnh theo dõi</p>
                <p className="text-sm text-gray-600">Chụp ảnh sau 1 tuần để so sánh tiến độ</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Nút hành động */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          onClick={scheduleNextAppointment}
          className="bg-burgundy-500 hover:bg-burgundy-600 flex-1"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Đặt lịch hẹn tiếp theo
        </Button>
        <Button 
          variant="outline"
          onClick={exportToPDF}
          className="border-burgundy-500 text-burgundy-500 hover:bg-burgundy-50"
        >
          <Download className="w-4 h-4 mr-2" />
          Xuất PDF
        </Button>
        <Button 
          variant="outline"
          onClick={sharePassport}
          className="border-burgundy-500 text-burgundy-500 hover:bg-burgundy-50"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Chia sẻ
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

export default HairPassport;
