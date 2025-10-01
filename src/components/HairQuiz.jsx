import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  Circle, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles,
  Heart,
  Shield,
  Droplets,
  Camera
} from 'lucide-react';
import { quizQuestions, calculateHairAnalysis, problemCategories, beforeAfterImages } from '../data/quizData';

const HairQuiz = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [beforeImage, setBeforeImage] = useState(() => {
    // Load ảnh từ localStorage nếu có
    return localStorage.getItem('beforePhoto');
  });

  const question = quizQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  // Xử lý chọn đáp án
  const handleOptionSelect = (optionId) => {
    if (question.type === 'single') {
      setSelectedOptions([optionId]);
    } else {
      setSelectedOptions(prev => 
        prev.includes(optionId) 
          ? prev.filter(id => id !== optionId)
          : [...prev, optionId]
      );
    }
  };

  // Chuyển câu hỏi tiếp theo
  const handleNext = () => {
    if (selectedOptions.length === 0) return;

    const newAnswer = {
      questionId: question.id,
      selectedOptions: [...selectedOptions]
    };

    const updatedAnswers = [...answers];
    const existingIndex = updatedAnswers.findIndex(a => a.questionId === question.id);
    
    if (existingIndex >= 0) {
      updatedAnswers[existingIndex] = newAnswer;
    } else {
      updatedAnswers.push(newAnswer);
    }

    setAnswers(updatedAnswers);

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedOptions([]);
    } else {
      // Hoàn thành quiz, tính toán kết quả
      const result = calculateHairAnalysis(updatedAnswers);
      setAnalysis(result);
      setShowResults(true);
    }
  };

  // Quay lại câu hỏi trước
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      const prevAnswer = answers.find(a => a.questionId === quizQuestions[currentQuestion - 1].id);
      setSelectedOptions(prevAnswer ? prevAnswer.selectedOptions : []);
    }
  };

  // Bắt đầu lại quiz
  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setSelectedOptions([]);
    setShowResults(false);
    setAnalysis(null);
    setBeforeImage(null);
  };

  // Xử lý upload ảnh
  const handleImageUpload = (event, type) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target.result;
        setBeforeImage(imageData);
        
        // Lưu ảnh vào localStorage
        localStorage.setItem('beforePhoto', imageData);
        
        // Lưu thông tin ảnh vào analysis
        if (analysis) {
          const updatedAnalysis = {
            ...analysis,
            beforePhoto: imageData,
            photoUploadDate: new Date().toISOString()
          };
          setAnalysis(updatedAnalysis);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Render kết quả phân tích
  const renderResults = () => {
    if (!analysis) return null;

    const primaryCategory = problemCategories[analysis.primaryProblem];
    const primaryAnalysis = analysis.analysis[analysis.primaryProblem];
    const beforeAfter = beforeAfterImages[analysis.primaryProblem][primaryAnalysis.severity];

    const getCategoryIcon = (category) => {
      switch (category) {
        case 'damage': return <Shield className="w-5 h-5" />;
        case 'dryness': return <Droplets className="w-5 h-5" />;
        case 'weakness': return <Heart className="w-5 h-5" />;
        default: return <Sparkles className="w-5 h-5" />;
      }
    };

    const getCategoryColor = (category) => {
      switch (category) {
        case 'damage': return 'text-red-600 bg-red-100';
        case 'dryness': return 'text-blue-600 bg-blue-100';
        case 'weakness': return 'text-purple-600 bg-purple-100';
        default: return 'text-burgundy-600 bg-burgundy-100';
      }
    };

    return (
      <div className="space-y-6">
        {/* Header kết quả */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className={`p-4 rounded-full ${getCategoryColor(analysis.primaryProblem)}`}>
              {getCategoryIcon(analysis.primaryProblem)}
            </div>
          </div>
          <h3 className="text-2xl font-bold text-burgundy-700 mb-2">
            Kết quả chẩn đoán tóc
          </h3>
          <p className="text-gray-600">
            Vấn đề chính: <span className="font-semibold">{primaryCategory.name}</span>
          </p>
        </div>

        {/* Phân tích chi tiết */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.keys(analysis.analysis).map(category => {
            const categoryData = problemCategories[category];
            const categoryAnalysis = analysis.analysis[category];
            
            return (
              <Card key={category} className={`${categoryAnalysis.isPrimary ? 'ring-2 ring-burgundy-300' : ''}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${getCategoryColor(category)}`}>
                      {getCategoryIcon(category)}
                    </div>
                    <div>
                      <CardTitle className="text-sm">{categoryData.name}</CardTitle>
                      <CardDescription className="text-xs">
                        Điểm: {categoryAnalysis.score} - {categoryAnalysis.level}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Progress 
                    value={(categoryAnalysis.score / 15) * 100} 
                    className="h-2"
                  />
                  {categoryAnalysis.isPrimary && (
                    <Badge className="mt-2 bg-burgundy-500 text-white text-xs">
                      Vấn đề chính
                    </Badge>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Upload ảnh trước/sau điều trị */}
        <Card>
          <CardHeader>
            <CardTitle>Ảnh tóc của bạn</CardTitle>
            <CardDescription>
              Chụp ảnh tóc hiện tại để theo dõi tiến độ điều trị
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Ảnh trước điều trị */}
              <div className="text-center">
                <div className="border-2 border-dashed border-gray-300 rounded-lg h-48 flex flex-col items-center justify-center mb-3 hover:border-burgundy-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'before')}
                    className="hidden"
                    id="before-image"
                  />
                  <label
                    htmlFor="before-image"
                    className="cursor-pointer flex flex-col items-center justify-center h-full w-full"
                  >
                    {beforeImage ? (
                      <img
                        src={beforeImage}
                        alt="Ảnh trước điều trị"
                        className="h-full w-full object-cover rounded-lg"
                      />
                    ) : (
                      <>
                        <Camera className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-gray-500 text-sm">Chụp ảnh trước điều trị</span>
                        <span className="text-xs text-gray-400 mt-1">Click để chọn ảnh</span>
                      </>
                    )}
                  </label>
                </div>
                <p className="text-sm font-medium">Trước điều trị</p>
              </div>

              {/* Ảnh sau điều trị (placeholder) */}
              <div className="text-center">
                <div className="bg-green-50 border-2 border-dashed border-green-200 rounded-lg h-48 flex items-center justify-center mb-3">
                  <div className="text-center">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-green-600 text-sm">📸</span>
                    </div>
                    <span className="text-green-600 text-sm">Ảnh sau điều trị</span>
                    <p className="text-xs text-green-500 mt-1">Sẽ được chụp sau khi điều trị</p>
                  </div>
                </div>
                <p className="text-sm font-medium">Sau điều trị</p>
              </div>
            </div>
            
            {beforeImage && (
              <div className="mt-4 p-3 bg-burgundy-50 rounded-lg">
                <p className="text-sm text-burgundy-700">
                  ✅ Đã lưu ảnh trước điều trị. Ảnh này sẽ được sử dụng để so sánh kết quả sau điều trị.
                </p>
              </div>
            )}
            
            <p className="text-center text-sm text-gray-600 mt-4">
              {beforeAfter.description}
            </p>
          </CardContent>
        </Card>

        {/* Gợi ý điều trị */}
        <Card>
          <CardHeader>
            <CardTitle>Gợi ý điều trị</CardTitle>
            <CardDescription>
              Phương án điều trị phù hợp với tình trạng tóc của bạn
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Điều trị chính */}
            <div>
              <h4 className="font-semibold text-burgundy-700 mb-2">
                Điều trị chính - {analysis.recommendations.primaryTreatment.category}
              </h4>
              <div className="bg-burgundy-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700 mb-3">
                  Mức độ: <span className="font-medium">{analysis.recommendations.primaryTreatment.severity}</span>
                </p>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Dịch vụ tại salon:</p>
                    <ul className="text-sm text-gray-600 ml-4">
                      {analysis.recommendations.primaryTreatment.services.map((service, index) => (
                        <li key={index} className="list-disc">{service}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Sản phẩm JOICO:</p>
                    <ul className="text-sm text-gray-600 ml-4">
                      {analysis.recommendations.primaryTreatment.products.map((product, index) => (
                        <li key={index} className="list-disc">{product}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Điều trị hỗ trợ */}
            {analysis.recommendations.supportingTreatments.length > 0 && (
              <div>
                <h4 className="font-semibold text-burgundy-700 mb-2">Điều trị hỗ trợ</h4>
                <div className="space-y-3">
                  {analysis.recommendations.supportingTreatments.map((treatment, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        {treatment.category} ({treatment.severity})
                      </p>
                      <div className="text-xs text-gray-600">
                        <span className="font-medium">Dịch vụ: </span>
                        {treatment.services.join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Chăm sóc tại nhà */}
            <div>
              <h4 className="font-semibold text-burgundy-700 mb-2">Chăm sóc tại nhà</h4>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Sản phẩm cần thiết:</p>
                    <ul className="text-sm text-gray-600 ml-4">
                      {analysis.recommendations.homecare.essential.map((product, index) => (
                        <li key={index} className="list-disc">{product}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Điều trị bổ sung:</p>
                    <ul className="text-sm text-gray-600 ml-4">
                      {analysis.recommendations.homecare.additional.map((treatment, index) => (
                        <li key={index} className="list-disc">{treatment}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div>
              <h4 className="font-semibold text-burgundy-700 mb-2">Lộ trình điều trị</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm">{analysis.recommendations.timeline.immediate}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">{analysis.recommendations.timeline.shortTerm}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">{analysis.recommendations.timeline.longTerm}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Nút hành động */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={() => {
              const finalAnalysis = {
                ...analysis,
                beforePhoto: beforeImage,
                photoUploadDate: beforeImage ? new Date().toISOString() : null
              };
              onComplete && onComplete(finalAnalysis);
            }}
            className="bg-burgundy-500 hover:bg-burgundy-600 flex-1"
          >
            Đặt lịch tư vấn chi tiết
          </Button>
          <Button 
            variant="outline" 
            onClick={handleRestart}
            className="border-burgundy-500 text-burgundy-500 hover:bg-burgundy-50"
          >
            Làm lại quiz
          </Button>
        </div>
      </div>
    );
  };

  if (showResults) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        {renderResults()}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle className="text-xl text-burgundy-700">
                Quiz chẩn đoán tóc JOICO
              </CardTitle>
              <CardDescription>
                Câu hỏi {currentQuestion + 1} / {quizQuestions.length}
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
          {/* Câu hỏi */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {question.question}
            </h3>
            
            {question.type === 'multiple' && (
              <p className="text-sm text-gray-600 mb-4">
                * Có thể chọn nhiều đáp án
              </p>
            )}

            {/* Các lựa chọn */}
            <div className="space-y-3">
              {question.options.map((option) => {
                const isSelected = selectedOptions.includes(option.id);
                
                return (
                  <button
                    key={option.id}
                    onClick={() => handleOptionSelect(option.id)}
                    className={`
                      w-full p-4 text-left rounded-lg border-2 transition-all
                      ${isSelected 
                        ? 'border-burgundy-500 bg-burgundy-50' 
                        : 'border-gray-200 hover:border-burgundy-300 hover:bg-burgundy-25'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      {isSelected ? (
                        <CheckCircle className="w-5 h-5 text-burgundy-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400" />
                      )}
                      <span className={`${isSelected ? 'text-burgundy-700 font-medium' : 'text-gray-700'}`}>
                        {option.text}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Nút điều hướng */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="border-burgundy-500 text-burgundy-500 hover:bg-burgundy-50"
            >
              <ArrowLeft size={16} className="mr-2" />
              Quay lại
            </Button>

            <Button
              onClick={handleNext}
              disabled={selectedOptions.length === 0}
              className="bg-burgundy-500 hover:bg-burgundy-600"
            >
              {currentQuestion === quizQuestions.length - 1 ? 'Xem kết quả' : 'Tiếp theo'}
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HairQuiz;
