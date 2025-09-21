import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, ArrowRight, Save, FileText, Mail } from 'lucide-react';
import { consultationService, customerService } from '../firebase/firestore';
import { EmailService } from '../services/emailService';

const ConsultationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Questionnaire
    customerInfo: {
      name: '',
      phone: '',
      email: '',
      birthday: '',
      gender: '',
      previousTreatments: [],
      heatUsageFrequency: '',
      hairGoals: [],
      currentIssues: [],
      expectations: {
        today: '',
        twoWeeks: '',
        oneMonth: ''
      }
    },
    // Step 2: Hair Diagnosis
    diagnosis: {
      elasticity: '',
      visualObservation: {
        tangled: false,
        shiny: false,
        cuticleCondition: ''
      },
      porosityTest: '',
      strength: ''
    },
    // Step 3: Salon Treatment
    treatment: {
      priority: [],
      longTerm: []
    },
    // Step 4: Hair Passport
    passport: {
      servicesUsed: [],
      improvementPercentage: '',
      homeCarePlan: [],
      nextAppointment: ''
    }
  });

  const steps = [
    { id: 1, title: 'Questionnaire', subtitle: 'Hiểu vấn đề của khách hàng' },
    { id: 2, title: 'Hair Diagnosis', subtitle: 'Chẩn đoán' },
    { id: 3, title: 'Salon Treatment', subtitle: 'Phương pháp điều trị' },
    { id: 4, title: 'Hair Passport', subtitle: 'Hộ chiếu tóc' }
  ];

  const previousTreatmentOptions = [
    'Uốn', 'Duỗi', 'Nhuộm', 'Tẩy', 'Nối tóc'
  ];

  const heatUsageOptions = [
    { value: '4', label: '4 lần' },
    { value: '3', label: '3 lần' },
    { value: '2', label: '2 lần' },
    { value: '0', label: '0' }
  ];

  const hairGoalOptions = [
    'Bóng mượt', 'Chắc khỏe', 'Giữ màu nhuộm lâu', 'Dễ vào nếp', 'Phục hồi hư tổn'
  ];

  const currentIssueOptions = [
    'Khô xơ', 'Mất độ bóng', 'Nhanh phai', 'Chẻ ngọn', 'Rụng tóc', 'Đứt'
  ];

  const elasticityOptions = [
    { value: 'good', label: 'Tốt' },
    { value: 'average', label: 'Trung bình' },
    { value: 'weak', label: 'Yếu' }
  ];

  const cuticleOptions = [
    { value: 'high', label: 'Cao' },
    { value: 'average', label: 'Trung bình' },
    { value: 'low', label: 'Kém' }
  ];

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleArrayChange = (section, field, value, checked) => {
    setFormData(prev => {
      const currentArray = prev[section][field] || [];
      if (checked) {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [field]: [...currentArray, value]
          }
        };
      } else {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [field]: currentArray.filter(item => item !== value)
          }
        };
      }
    });
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const saveForm = async () => {
    try {
      // Save consultation data to Firestore
      await consultationService.add(formData);
      
      // Also add/update customer if they don't exist
      let customerData = null;
      if (formData.customerInfo.name && formData.customerInfo.phone) {
        customerData = {
          name: formData.customerInfo.name,
          phone: formData.customerInfo.phone,
          email: formData.customerInfo.email,
          birthday: formData.customerInfo.birthday,
          gender: formData.customerInfo.gender,
          lastVisit: new Date().toISOString().split('T')[0],
          totalVisits: 1,
          status: 'active',
          hairCondition: formData.customerInfo.currentIssues.join(', '),
          treatments: formData.customerInfo.previousTreatments,
          nextAppointment: formData.passport.nextAppointment || null
        };
        
        await customerService.add(customerData);
      }
      
      // Send emails after successful save
      if (customerData) {
        try {
          const emailResults = await EmailService.sendConsultationEmails(customerData, formData);
          
          let emailMessage = 'Dữ liệu tư vấn đã được lưu thành công!\n\n';
          
          if (emailResults.customer.success) {
            emailMessage += '✅ Email đã gửi cho khách hàng\n';
          } else if (customerData.email) {
            emailMessage += '❌ Không thể gửi email cho khách hàng\n';
          }
          
          if (emailResults.salon.success) {
            emailMessage += '✅ Email thông báo đã gửi cho salon\n';
          } else {
            emailMessage += '❌ Không thể gửi email cho salon\n';
          }
          
          alert(emailMessage);
        } catch (emailError) {
          console.error('Email sending error:', emailError);
          alert('Dữ liệu đã lưu thành công!\n⚠️ Chưa cấu hình email. Vui lòng setup EmailJS để gửi email tự động.');
        }
      } else {
        alert('Dữ liệu tư vấn đã được lưu thành công!');
      }
      
    } catch (error) {
      console.error('Error saving consultation:', error);
      alert('Có lỗi khi lưu dữ liệu tư vấn. Vui lòng thử lại!');
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Họ và tên *</Label>
          <Input
            id="name"
            value={formData.customerInfo.name}
            onChange={(e) => handleInputChange('customerInfo', 'name', e.target.value)}
            placeholder="Nhập họ và tên khách hàng"
          />
        </div>
        <div>
          <Label htmlFor="phone">Số điện thoại *</Label>
          <Input
            id="phone"
            value={formData.customerInfo.phone}
            onChange={(e) => handleInputChange('customerInfo', 'phone', e.target.value)}
            placeholder="Nhập số điện thoại"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.customerInfo.email}
            onChange={(e) => handleInputChange('customerInfo', 'email', e.target.value)}
            placeholder="Nhập email (tùy chọn)"
          />
        </div>
        <div>
          <Label htmlFor="birthday">Ngày sinh</Label>
          <Input
            id="birthday"
            type="date"
            value={formData.customerInfo.birthday}
            onChange={(e) => handleInputChange('customerInfo', 'birthday', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="gender">Giới tính</Label>
          <select
            id="gender"
            value={formData.customerInfo.gender}
            onChange={(e) => handleInputChange('customerInfo', 'gender', e.target.value)}
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
          >
            <option value="">Chọn giới tính</option>
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
            <option value="other">Khác</option>
          </select>
        </div>
      </div>

      <div>
        <Label className="text-base font-semibold">Tóc của anh/chị đã từng trải qua các dịch vụ nào?</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
          {previousTreatmentOptions.map((treatment) => (
            <div key={treatment} className="flex items-center space-x-2">
              <Checkbox
                id={treatment}
                checked={formData.customerInfo.previousTreatments.includes(treatment)}
                onCheckedChange={(checked) => 
                  handleArrayChange('customerInfo', 'previousTreatments', treatment, checked)
                }
              />
              <Label htmlFor={treatment}>{treatment}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-base font-semibold">Tần suất sử dụng nhiệt (máy sấy, máy duỗi, máy kẹp) bao nhiêu lần/tuần?</Label>
        <RadioGroup
          value={formData.customerInfo.heatUsageFrequency}
          onValueChange={(value) => handleInputChange('customerInfo', 'heatUsageFrequency', value)}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3"
        >
          {heatUsageOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={option.value} />
              <Label htmlFor={option.value}>{option.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div>
        <Label className="text-base font-semibold">Mục tiêu sau khi dưỡng/tái tạo tóc là gì?</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
          {hairGoalOptions.map((goal) => (
            <div key={goal} className="flex items-center space-x-2">
              <Checkbox
                id={goal}
                checked={formData.customerInfo.hairGoals.includes(goal)}
                onCheckedChange={(checked) => 
                  handleArrayChange('customerInfo', 'hairGoals', goal, checked)
                }
              />
              <Label htmlFor={goal}>{goal}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-base font-semibold">Vấn đề thấy/cảm nhận từ khách hàng</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
          {currentIssueOptions.map((issue) => (
            <div key={issue} className="flex items-center space-x-2">
              <Checkbox
                id={issue}
                checked={formData.customerInfo.currentIssues.includes(issue)}
                onCheckedChange={(checked) => 
                  handleArrayChange('customerInfo', 'currentIssues', issue, checked)
                }
              />
              <Label htmlFor={issue}>{issue}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-base font-semibold">Mong muốn của khách</Label>
        <div className="space-y-4 mt-3">
          <div>
            <Label htmlFor="today">Hôm nay:</Label>
            <Textarea
              id="today"
              value={formData.customerInfo.expectations.today}
              onChange={(e) => handleInputChange('customerInfo', 'expectations', {
                ...formData.customerInfo.expectations,
                today: e.target.value
              })}
              placeholder="Mong muốn của khách hàng hôm nay..."
            />
          </div>
          <div>
            <Label htmlFor="twoWeeks">Sau 2 tuần:</Label>
            <Textarea
              id="twoWeeks"
              value={formData.customerInfo.expectations.twoWeeks}
              onChange={(e) => handleInputChange('customerInfo', 'expectations', {
                ...formData.customerInfo.expectations,
                twoWeeks: e.target.value
              })}
              placeholder="Mong muốn sau 2 tuần..."
            />
          </div>
          <div>
            <Label htmlFor="oneMonth">Sau 1 tháng:</Label>
            <Textarea
              id="oneMonth"
              value={formData.customerInfo.expectations.oneMonth}
              onChange={(e) => handleInputChange('customerInfo', 'expectations', {
                ...formData.customerInfo.expectations,
                oneMonth: e.target.value
              })}
              placeholder="Mong muốn sau 1 tháng..."
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-semibold">Kiểm tra độ đàn hồi của tóc</Label>
        <RadioGroup
          value={formData.diagnosis.elasticity}
          onValueChange={(value) => handleInputChange('diagnosis', 'elasticity', value)}
          className="grid grid-cols-3 gap-4 mt-3"
        >
          {elasticityOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={`elasticity-${option.value}`} />
              <Label htmlFor={`elasticity-${option.value}`}>{option.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div>
        <Label className="text-base font-semibold">Quan sát bằng mắt</Label>
        <div className="space-y-4 mt-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="tangled"
                checked={formData.diagnosis.visualObservation.tangled}
                onCheckedChange={(checked) => 
                  handleInputChange('diagnosis', 'visualObservation', {
                    ...formData.diagnosis.visualObservation,
                    tangled: checked
                  })
                }
              />
              <Label htmlFor="tangled">Xơ rối</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="shiny"
                checked={formData.diagnosis.visualObservation.shiny}
                onCheckedChange={(checked) => 
                  handleInputChange('diagnosis', 'visualObservation', {
                    ...formData.diagnosis.visualObservation,
                    shiny: checked
                  })
                }
              />
              <Label htmlFor="shiny">Bóng</Label>
            </div>
          </div>
          
          <div>
            <Label>Bề mặt biểu bì</Label>
            <RadioGroup
              value={formData.diagnosis.visualObservation.cuticleCondition}
              onValueChange={(value) => 
                handleInputChange('diagnosis', 'visualObservation', {
                  ...formData.diagnosis.visualObservation,
                  cuticleCondition: value
                })
              }
              className="grid grid-cols-3 gap-4 mt-2"
            >
              {cuticleOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`cuticle-${option.value}`} />
                  <Label htmlFor={`cuticle-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
      </div>

      <div>
        <Label className="text-base font-semibold">Porosity Test, độ ẩm (thả tóc vào nước)</Label>
        <RadioGroup
          value={formData.diagnosis.porosityTest}
          onValueChange={(value) => handleInputChange('diagnosis', 'porosityTest', value)}
          className="grid grid-cols-3 gap-4 mt-3"
        >
          {elasticityOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={`porosity-${option.value}`} />
              <Label htmlFor={`porosity-${option.value}`}>{option.label}</Label>
            </div>
          ))}
        </RadioGroup>
        <div className="mt-3 text-sm text-gray-600">
          <p>• Tóc nổi → tóc khỏe, ít hư tổn.</p>
          <p>• Tóc chìm từ từ → tóc trung bình, cần dưỡng.</p>
          <p>• Tóc chìm nhanh → tóc hư tổn, lớp biểu bì hở.</p>
        </div>
      </div>

      <div>
        <Label className="text-base font-semibold">Strength, độ chắc (xoắn một vài sợi tóc quanh ngón tay)</Label>
        <RadioGroup
          value={formData.diagnosis.strength}
          onValueChange={(value) => handleInputChange('diagnosis', 'strength', value)}
          className="grid grid-cols-3 gap-4 mt-3"
        >
          {elasticityOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={`strength-${option.value}`} />
              <Label htmlFor={`strength-${option.value}`}>{option.label}</Label>
            </div>
          ))}
        </RadioGroup>
        <div className="mt-3 text-sm text-gray-600">
          <p>• Nếu dễ gãy, sợi mảnh → tóc thiếu protein.</p>
          <p>• Nếu dẻo, nhão, mất độ bóng bệnh → tóc thiếu cân bằng ẩm.</p>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-semibold">Ưu tiên điều trị</Label>
        <div className="mt-4">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-burgundy-500 text-white">
                <th className="border border-gray-300 p-3">Vấn đề cần giải quyết</th>
                <th className="border border-gray-300 p-3">Dưỡng chất cần bổ sung</th>
                <th className="border border-gray-300 p-3">Dịch vụ phù hợp</th>
                <th className="border border-gray-300 p-3">Giá</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map((row) => (
                <tr key={row} className={row % 2 === 0 ? 'bg-burgundy-50' : 'bg-white'}>
                  <td className="border border-gray-300 p-3">
                    <Input placeholder={`Vấn đề ${row}`} />
                  </td>
                  <td className="border border-gray-300 p-3">
                    <Input placeholder={`Dưỡng chất ${row}`} />
                  </td>
                  <td className="border border-gray-300 p-3">
                    <Input placeholder={`Dịch vụ ${row}`} />
                  </td>
                  <td className="border border-gray-300 p-3">
                    <Input placeholder="Giá" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <Label className="text-base font-semibold">Dài hạn</Label>
        <div className="mt-4">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-burgundy-500 text-white">
                <th className="border border-gray-300 p-3">Vấn đề cần giải quyết</th>
                <th className="border border-gray-300 p-3">Dưỡng chất cần bổ sung</th>
                <th className="border border-gray-300 p-3">Dịch vụ phù hợp</th>
                <th className="border border-gray-300 p-3">Giá</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map((row) => (
                <tr key={row} className={row % 2 === 0 ? 'bg-burgundy-50' : 'bg-white'}>
                  <td className="border border-gray-300 p-3">
                    <Input placeholder={`Vấn đề dài hạn ${row}`} />
                  </td>
                  <td className="border border-gray-300 p-3">
                    <Input placeholder={`Dưỡng chất ${row}`} />
                  </td>
                  <td className="border border-gray-300 p-3">
                    <Input placeholder={`Dịch vụ ${row}`} />
                  </td>
                  <td className="border border-gray-300 p-3">
                    <Input placeholder="Giá" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-semibold">Dịch vụ sử dụng</Label>
        <Textarea
          value={formData.passport.servicesUsed.join(', ')}
          onChange={(e) => handleInputChange('passport', 'servicesUsed', e.target.value.split(', '))}
          placeholder="Nhập các dịch vụ đã sử dụng..."
          className="mt-2"
        />
      </div>

      <div>
        <Label className="text-base font-semibold">Kết quả sau dịch vụ tại salon</Label>
        <div className="mt-4 space-y-4">
          {['20%', '40%', '70%', '100%'].map((percentage) => (
            <div key={percentage} className="flex items-center space-x-4">
              <div className="w-16 text-center font-semibold">{percentage}</div>
              <div className="flex-1">
                <Input placeholder="Vấn đề còn lại..." />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-base font-semibold">Phát đồ điều trị / chăm sóc tại nhà</Label>
        <div className="mt-4">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-burgundy-500 text-white">
                <th className="border border-gray-300 p-3">Sản phẩm</th>
                <th className="border border-gray-300 p-3">Công dụng</th>
                <th className="border border-gray-300 p-3">Mục đích cải thiện</th>
                <th className="border border-gray-300 p-3">Cách dùng</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4].map((row) => (
                <tr key={row} className={row % 2 === 0 ? 'bg-burgundy-50' : 'bg-white'}>
                  <td className="border border-gray-300 p-3">
                    <Input placeholder={`Sản phẩm ${row}`} />
                  </td>
                  <td className="border border-gray-300 p-3">
                    <Input placeholder="Công dụng" />
                  </td>
                  <td className="border border-gray-300 p-3">
                    <Input placeholder="Mục đích" />
                  </td>
                  <td className="border border-gray-300 p-3">
                    <Input placeholder="Cách dùng" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <Label htmlFor="nextAppointment">Lịch hẹn kế tiếp</Label>
        <Textarea
          id="nextAppointment"
          value={formData.passport.nextAppointment}
          onChange={(e) => handleInputChange('passport', 'nextAppointment', e.target.value)}
          placeholder="Ghi chú về lịch hẹn kế tiếp..."
          className="mt-2"
        />
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex flex-col items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                  currentStep >= step.id 
                    ? 'bg-burgundy-500 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step.id}
                </div>
                <div className="text-center mt-2">
                  <div className="text-sm font-semibold">{step.title}</div>
                  <div className="text-xs text-gray-600">{step.subtitle}</div>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-4 ${
                  currentStep > step.id ? 'bg-burgundy-500' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <Card className="border-burgundy-200">
        <CardHeader className="bg-burgundy-50">
          <CardTitle className="text-burgundy-700">
            {steps[currentStep - 1].title}
          </CardTitle>
          <CardDescription>
            {steps[currentStep - 1].subtitle}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
          className="border-burgundy-500 text-burgundy-500 hover:bg-burgundy-50"
        >
          <ArrowLeft size={16} className="mr-2" />
          Quay lại
        </Button>

        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={saveForm}
            className="border-burgundy-500 text-burgundy-500 hover:bg-burgundy-50"
          >
            <Save size={16} className="mr-2" />
            Lưu & Gửi Email
          </Button>

          {currentStep < 4 ? (
            <Button
              onClick={nextStep}
              className="bg-burgundy-500 hover:bg-burgundy-600"
            >
              Tiếp theo
              <ArrowRight size={16} className="ml-2" />
            </Button>
          ) : (
            <Button
              onClick={saveForm}
              className="bg-burgundy-500 hover:bg-burgundy-600"
            >
              <FileText size={16} className="mr-2" />
              Hoàn thành
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsultationForm;
