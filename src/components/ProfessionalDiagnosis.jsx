import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { 
  Camera,
  Droplets, 
  Scissors,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Info,
  ArrowRight,
  ArrowLeft,
  Upload
} from 'lucide-react';

const ProfessionalDiagnosis = ({ quizResults, onComplete }) => {
  const [currentTest, setCurrentTest] = useState(0);
  const [testResults, setTestResults] = useState({
    elasticity: { score: 0, notes: '' },
    porosity: { score: 0, notes: '' },
    splitEnds: { score: 0, notes: '' },
    scalp: { score: 0, notes: '' }
  });
  const [beforePhoto, setBeforePhoto] = useState(null);
  const [showResults, setShowResults] = useState(false);

  // Định nghĩa 4 phép đo chuyên nghiệp
  const diagnosticTests = [
    {
      id: 'elasticity',
      name: 'Test Độ Đàn Hồi',
      icon: <Sparkles className="w-6 h-6" />,
      description: 'Đánh giá khả năng co giãn và phục hồi của sợi tóc',
      instructions: [
        'Lấy một sợi tóc ướt dài khoảng 10cm',
        'Kéo nhẹ nhàng từ hai đầu cho đến khi tóc căng',
        'Quan sát khả năng co giãn và phục hồi',
        'Đánh giá theo thang điểm từ 1-10'
      ],
      scoring: {
        1: 'Rất kém - Tóc gãy ngay khi kéo nhẹ',
        3: 'Kém - Tóc co giãn rất ít, dễ gãy',
        5: 'Trung bình - Co giãn vừa phải',
        7: 'Tốt - Co giãn tốt và phục hồi nhanh',
        10: 'Xuất sắc - Co giãn mạnh và phục hồi hoàn toàn'
      }
    },
    {
      id: 'porosity',
      name: 'Test Độ Xốp',
      icon: <Droplets className="w-6 h-6" />,
      description: 'Đánh giá khả năng hấp thụ và giữ ẩm của tóc',
      instructions: [
        'Lấy vài sợi tóc sạch và khô',
        'Thả vào cốc nước trong suốt',
        'Quan sát trong 2-4 phút',
        'Đánh giá dựa trên tốc độ chìm của tóc'
      ],
      scoring: {
        1: 'Độ xốp rất cao - Tóc chìm ngay lập tức',
        3: 'Độ xốp cao - Tóc chìm trong 1 phút',
        5: 'Độ xốp trung bình - Tóc chìm từ từ',
        7: 'Độ xốp thấp - Tóc nổi một thời gian',
        10: 'Độ xốp rất thấp - Tóc nổi hoàn toàn'
      }
    },
    {
      id: 'splitEnds',
      name: 'Phân Tích Chẻ Ngọn',
      icon: <Scissors className="w-6 h-6" />,
      description: 'Đánh giá mức độ hư hại ở đầu tóc và sợi tóc',
      instructions: [
        'Quan sát đầu tóc dưới ánh sáng tốt',
        'Kiểm tra 20-30 sợi tóc ngẫu nhiên',
        'Đếm số lượng sợi tóc bị chẻ ngọn',
        'Đánh giá mức độ nghiêm trọng'
      ],
      scoring: {
        1: 'Rất nghiêm trọng - >80% sợi tóc chẻ ngọn',
        3: 'Nghiêm trọng - 60-80% sợi tóc chẻ ngọn',
        5: 'Trung bình - 40-60% sợi tóc chẻ ngọn',
        7: 'Nhẹ - 20-40% sợi tóc chẻ ngọn',
        10: 'Rất tốt - <20% sợi tóc chẻ ngọn'
      }
    },
    {
      id: 'scalp',
      name: 'Phân Tích Da Đầu',
      icon: <Camera className="w-6 h-6" />,
      description: 'Đánh giá tình trạng da đầu và môi trường tăng trưởng tóc',
      instructions: [
        'Quan sát da đầu ở nhiều vùng khác nhau',
        'Kiểm tra độ ẩm, dầu và tình trạng viêm',
        'Đánh giá mức độ gàu và kích ứng',
        'Kiểm tra độ căng và đàn hồi của da đầu'
      ],
      scoring: {
        1: 'Rất kém - Da đầu khô, viêm, nhiều gàu',
        3: 'Kém - Da đầu có vấn đề rõ rệt',
        5: 'Trung bình - Da đầu bình thường',
        7: 'Tốt - Da đầu khỏe mạnh, ít vấn đề',
        10: 'Xuất sắc - Da đầu hoàn hảo'
      }
    }
  ];

  const currentTestData = diagnosticTests[currentTest];
  const progress = ((currentTest + 1) / diagnosticTests.length) * 100;

  // Xử lý cập nhật điểm số test
  const handleScoreChange = (score) => {
    setTestResults(prev => ({
      ...prev,
      [currentTestData.id]: {
        ...prev[currentTestData.id],
        score: score[0]
      }
    }));
  };

  // Xử lý cập nhật ghi chú
  const handleNotesChange = (notes) => {
    setTestResults(prev => ({
      ...prev,
      [currentTestData.id]: {
        ...prev[currentTestData.id],
        notes
      }
    }));
  };

  // Chuyển test tiếp theo
  const handleNext = () => {
    if (currentTest < diagnosticTests.length - 1) {
      setCurrentTest(prev => prev + 1);
    } else {
      // Hoàn thành tất cả test, tính toán kết quả
      calculateFinalResults();
    }
  };

  // Quay lại test trước
  const handlePrevious = () => {
    if (currentTest > 0) {
      setCurrentTest(prev => prev - 1);
    }
  };

  // Tính toán kết quả cuối cùng
  const calculateFinalResults = () => {
    const totalScore = Object.values(testResults).reduce((sum, test) => sum + test.score, 0);
    const averageScore = totalScore / 4;
    
    // Kết hợp với kết quả quiz nếu có
    let combinedAnalysis = {
      professionalTests: testResults,
      averageScore,
      overallHealth: getOverallHealthRating(averageScore),
      recommendations: generateProfessionalRecommendations(testResults, quizResults)
    };

    if (quizResults) {
      combinedAnalysis.quizResults = quizResults;
      combinedAnalysis.combinedScore = (averageScore + (quizResults.scores.damage + quizResults.scores.dryness + quizResults.scores.weakness) / 3) / 2;
    }

    setShowResults(true);
    if (onComplete) {
      onComplete(combinedAnalysis);
    }
  };

  // Đánh giá sức khỏe tổng thể
  const getOverallHealthRating = (score) => {
    if (score >= 8) return { level: 'Xuất sắc', color: 'text-green-600 bg-green-100' };
    if (score >= 6) return { level: 'Tốt', color: 'text-blue-600 bg-blue-100' };
    if (score >= 4) return { level: 'Trung bình', color: 'text-yellow-600 bg-yellow-100' };
    if (score >= 2) return { level: 'Kém', color: 'text-orange-600 bg-orange-100' };
    return { level: 'Rất kém', color: 'text-red-600 bg-red-100' };
  };

  // Tạo gợi ý chuyên nghiệp
  const generateProfessionalRecommendations = (tests, quiz) => {
    const recommendations = {
      immediate: [],
      treatments: [],
      products: [],
      followUp: []
    };

    // Phân tích từng test
    Object.entries(tests).forEach(([testId, result]) => {
      if (result.score <= 3) {
        switch (testId) {
          case 'elasticity':
            recommendations.immediate.push('Điều trị protein khẩn cấp');
            recommendations.treatments.push('K-PAK Intense Hydrator Treatment');
            break;
          case 'porosity':
            recommendations.immediate.push('Cân bằng độ xốp tóc');
            recommendations.treatments.push('Porosity Equalizing Treatment');
            break;
          case 'splitEnds':
            recommendations.immediate.push('Cắt tỉa đầu tóc');
            recommendations.treatments.push('Split End Repair Treatment');
            break;
          case 'scalp':
            recommendations.immediate.push('Điều trị da đầu');
            recommendations.treatments.push('Scalp Therapy Treatment');
            break;
        }
      }
    });

    // Kết hợp với kết quả quiz
    if (quiz) {
      recommendations.products.push(...quiz.recommendations.primaryTreatment.products);
    }

    return recommendations;
  };

  // Xử lý upload ảnh
  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBeforePhoto(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (showResults) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-burgundy-700">
              Kết Quả Chẩn Đoán Chuyên Nghiệp
            </CardTitle>
            <CardDescription>
              Phân tích chi tiết từ 4 phép đo chuyên nghiệp
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Tổng quan kết quả */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {diagnosticTests.map((test) => {
                const result = testResults[test.id];
                const health = getOverallHealthRating(result.score);
                
                return (
                  <Card key={test.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        {test.icon}
                        <CardTitle className="text-sm">{test.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-burgundy-600 mb-2">
                        {result.score}/10
                      </div>
                      <Badge className={health.color}>
                        {health.level}
                      </Badge>
                      <Progress value={result.score * 10} className="mt-2 h-2" />
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Ảnh trước điều trị */}
            {beforePhoto && (
              <Card>
                <CardHeader>
                  <CardTitle>Ảnh Trước Điều Trị</CardTitle>
                </CardHeader>
                <CardContent>
                  <img 
                    src={beforePhoto} 
                    alt="Ảnh trước điều trị" 
                    className="max-w-md mx-auto rounded-lg shadow-md"
                  />
                </CardContent>
              </Card>
            )}

            {/* Gợi ý điều trị */}
            <Card>
              <CardHeader>
                <CardTitle>Gợi Ý Điều Trị Chuyên Nghiệp</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(testResults).map(([testId, result]) => {
                  const test = diagnosticTests.find(t => t.id === testId);
                  return (
                    <div key={testId} className="border-l-4 border-burgundy-300 pl-4">
                      <h4 className="font-semibold text-burgundy-700">
                        {test.name}: {result.score}/10
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {test.scoring[Math.ceil(result.score)]}
                      </p>
                      {result.notes && (
                        <p className="text-sm italic text-gray-500">
                          Ghi chú: {result.notes}
                        </p>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button 
                onClick={() => onComplete && onComplete(testResults)}
                className="bg-burgundy-500 hover:bg-burgundy-600 flex-1"
              >
                Tạo Hair Passport
              </Button>
              <Button 
                variant="outline"
                onClick={() => setShowResults(false)}
                className="border-burgundy-500 text-burgundy-500"
              >
                Làm lại test
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle className="text-xl text-burgundy-700">
                Chẩn Đoán Chuyên Nghiệp
              </CardTitle>
              <CardDescription>
                Test {currentTest + 1} / {diagnosticTests.length}: {currentTestData.name}
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-burgundy-600">
                {Math.round(progress)}%
              </div>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Upload ảnh trước điều trị (chỉ hiện ở test đầu tiên) */}
          {currentTest === 0 && !beforePhoto && (
            <Card className="border-dashed border-2 border-burgundy-300">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Upload className="w-12 h-12 text-burgundy-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-burgundy-700 mb-2">
                    Chụp Ảnh Trước Điều Trị
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Tải lên ảnh tóc hiện tại để so sánh kết quả sau điều trị
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label htmlFor="photo-upload">
                    <Button asChild className="bg-burgundy-500 hover:bg-burgundy-600">
                      <span>Chọn ảnh</span>
                    </Button>
                  </label>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Thông tin test hiện tại */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-burgundy-100 rounded-lg text-burgundy-600">
                {currentTestData.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {currentTestData.name}
                </h3>
                <p className="text-gray-600">
                  {currentTestData.description}
                </p>
              </div>
            </div>

            {/* Hướng dẫn thực hiện */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Info className="w-5 h-5 text-blue-600" />
                  <CardTitle className="text-sm text-blue-800">
                    Hướng Dẫn Thực Hiện
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal list-inside space-y-2 text-sm text-blue-700">
                  {currentTestData.instructions.map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </div>

          {/* Thang điểm */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">
              Đánh Giá Kết Quả (1-10)
            </h4>
            
            <div className="space-y-4">
              <Slider
                value={[testResults[currentTestData.id].score]}
                onValueChange={handleScoreChange}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
              
              <div className="text-center">
                <span className="text-2xl font-bold text-burgundy-600">
                  {testResults[currentTestData.id].score}/10
                </span>
                <p className="text-sm text-gray-600 mt-1">
                  {currentTestData.scoring[testResults[currentTestData.id].score] || 
                   currentTestData.scoring[Math.ceil(testResults[currentTestData.id].score)]}
                </p>
              </div>
            </div>

            {/* Thang điểm tham khảo */}
            <div className="mt-4 space-y-2">
              <h5 className="text-sm font-medium text-gray-700">Thang điểm tham khảo:</h5>
              <div className="grid grid-cols-1 gap-2 text-xs">
                {Object.entries(currentTestData.scoring).map(([score, description]) => (
                  <div key={score} className={`p-2 rounded ${
                    parseInt(score) === testResults[currentTestData.id].score 
                      ? 'bg-burgundy-100 border border-burgundy-300' 
                      : 'bg-gray-50'
                  }`}>
                    <span className="font-medium">{score}/10:</span> {description}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Ghi chú */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">
              Ghi Chú Thêm (Tùy chọn)
            </h4>
            <textarea
              value={testResults[currentTestData.id].notes}
              onChange={(e) => handleNotesChange(e.target.value)}
              placeholder="Nhập ghi chú về tình trạng cụ thể, quan sát đặc biệt..."
              className="w-full p-3 border border-gray-300 rounded-lg resize-none h-20 focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
            />
          </div>

          {/* Nút điều hướng */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentTest === 0}
              className="border-burgundy-500 text-burgundy-500 hover:bg-burgundy-50"
            >
              <ArrowLeft size={16} className="mr-2" />
              Test trước
            </Button>

            <Button
              onClick={handleNext}
              disabled={testResults[currentTestData.id].score === 0}
              className="bg-burgundy-500 hover:bg-burgundy-600"
            >
              {currentTest === diagnosticTests.length - 1 ? 'Hoàn thành' : 'Test tiếp theo'}
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfessionalDiagnosis;
