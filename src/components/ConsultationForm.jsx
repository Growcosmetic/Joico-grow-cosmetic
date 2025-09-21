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
    if (currentStep < 5) {
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
          {heatUsageOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <input
                type="radio"
                id={`heat-${option.value}`}
                name="heatUsage"
                value={option.value}
                checked={formData.customerInfo.heatUsageFrequency === option.value}
                onChange={(e) => handleInputChange('customerInfo', 'heatUsageFrequency', e.target.value)}
                className="h-4 w-4 border-gray-300 text-burgundy-500 focus:ring-burgundy-500 focus:ring-2 focus:ring-offset-2 cursor-pointer"
              />
              <Label htmlFor={`heat-${option.value}`} className="cursor-pointer">{option.label}</Label>
            </div>
          ))}
        </div>
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

      {/* Home Care Table */}
      <div>
        <Label className="text-base font-semibold">HOME CARE (SẢN PHẨM CHĂM SÓC TẠI NHÀ)</Label>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-burgundy-500 text-white">
                <th className="border border-gray-300 p-3 text-left font-semibold">SẢN PHẨM</th>
                <th className="border border-gray-300 p-3 text-center font-semibold">DẦU GỘI</th>
                <th className="border border-gray-300 p-3 text-center font-semibold">GỘI XẢ</th>
                <th className="border border-gray-300 p-3 text-center font-semibold">DƯỠNG</th>
                <th className="border border-gray-300 p-3 text-center font-semibold">THÊM</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4].map((row) => (
                <tr key={row} className={row % 2 === 0 ? 'bg-burgundy-50' : 'bg-white'}>
                  <td className="border border-gray-300 p-3 font-medium">
                    <textarea 
                      className="w-full h-16 border-none resize-none bg-transparent focus:outline-none"
                      placeholder=""
                    />
                  </td>
                  <td className="border border-gray-300 p-3 text-center">
                    <input type="checkbox" className="w-4 h-4 text-burgundy-500 focus:ring-burgundy-500 border-gray-300 rounded" />
                  </td>
                  <td className="border border-gray-300 p-3 text-center">
                    <input type="checkbox" className="w-4 h-4 text-burgundy-500 focus:ring-burgundy-500 border-gray-300 rounded" />
                  </td>
                  <td className="border border-gray-300 p-3 text-center">
                    <input type="checkbox" className="w-4 h-4 text-burgundy-500 focus:ring-burgundy-500 border-gray-300 rounded" />
                  </td>
                  <td className="border border-gray-300 p-3 text-center">
                    <input type="checkbox" className="w-4 h-4 text-burgundy-500 focus:ring-burgundy-500 border-gray-300 rounded" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <Label className="text-base font-semibold">VẤN ĐỀ THẤY/CẢM NHẬN TỪ KHÁCH HÀNG</Label>
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
      {/* KIỂM TRA ĐỘ ĐÀN HỒI CỦA TÓC */}
      <div>
        <Label className="text-base font-semibold">- KIỂM TRA ĐỘ ĐÀN HỒI CỦA TÓC</Label>
        <div className="mt-4 border-t border-gray-300 pt-4">
          <div className="flex gap-8">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="elasticity-good"
                name="elasticity"
                value="good"
                checked={formData.diagnosis.elasticity === 'good'}
                onChange={(e) => handleInputChange('diagnosis', 'elasticity', e.target.value)}
                className="h-4 w-4 border-gray-300 text-burgundy-500 focus:ring-burgundy-500 focus:ring-2 focus:ring-offset-2 cursor-pointer"
              />
              <Label htmlFor="elasticity-good" className="font-medium cursor-pointer">TỐT</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="elasticity-average"
                name="elasticity"
                value="average"
                checked={formData.diagnosis.elasticity === 'average'}
                onChange={(e) => handleInputChange('diagnosis', 'elasticity', e.target.value)}
                className="h-4 w-4 border-gray-300 text-burgundy-500 focus:ring-burgundy-500 focus:ring-2 focus:ring-offset-2 cursor-pointer"
              />
              <Label htmlFor="elasticity-average" className="font-medium cursor-pointer">TRUNG BÌNH</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="elasticity-weak"
                name="elasticity"
                value="weak"
                checked={formData.diagnosis.elasticity === 'weak'}
                onChange={(e) => handleInputChange('diagnosis', 'elasticity', e.target.value)}
                className="h-4 w-4 border-gray-300 text-burgundy-500 focus:ring-burgundy-500 focus:ring-2 focus:ring-offset-2 cursor-pointer"
              />
              <Label htmlFor="elasticity-weak" className="font-medium cursor-pointer">YẾU</Label>
            </div>
          </div>
        </div>
      </div>

      {/* QUAN SÁT BẰNG MẮT */}
      <div>
        <Label className="text-base font-semibold">- QUAN SÁT BẰNG MẮT</Label>
        <div className="mt-4 border-t border-gray-300 pt-4">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-burgundy-500 text-white">
                  <th className="border border-gray-300 p-3"></th>
                  <th className="border border-gray-300 p-3 text-center font-semibold">CAO</th>
                  <th className="border border-gray-300 p-3 text-center font-semibold">TRUNG BÌNH</th>
                  <th className="border border-gray-300 p-3 text-center font-semibold">KÉM</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white">
                  <td className="border border-gray-300 p-3 font-medium bg-burgundy-100">XƠ RỐI</td>
                  <td className="border border-gray-300 p-3 text-center">
                    <input type="checkbox" className="w-4 h-4 text-burgundy-500 focus:ring-burgundy-500 border-gray-300 rounded" />
                  </td>
                  <td className="border border-gray-300 p-3 text-center">
                    <input type="checkbox" className="w-4 h-4 text-burgundy-500 focus:ring-burgundy-500 border-gray-300 rounded" />
                  </td>
                  <td className="border border-gray-300 p-3 text-center">
                    <input type="checkbox" className="w-4 h-4 text-burgundy-500 focus:ring-burgundy-500 border-gray-300 rounded" />
                  </td>
                </tr>
                <tr className="bg-burgundy-50">
                  <td className="border border-gray-300 p-3 font-medium bg-burgundy-100">BÓNG</td>
                  <td className="border border-gray-300 p-3 text-center">
                    <input type="checkbox" className="w-4 h-4 text-burgundy-500 focus:ring-burgundy-500 border-gray-300 rounded" />
                  </td>
                  <td className="border border-gray-300 p-3 text-center">
                    <input type="checkbox" className="w-4 h-4 text-burgundy-500 focus:ring-burgundy-500 border-gray-300 rounded" />
                  </td>
                  <td className="border border-gray-300 p-3 text-center">
                    <input type="checkbox" className="w-4 h-4 text-burgundy-500 focus:ring-burgundy-500 border-gray-300 rounded" />
                  </td>
                </tr>
                <tr className="bg-white">
                  <td className="border border-gray-300 p-3 font-medium bg-burgundy-100">BỀ MẶT BIỂU BÌ</td>
                  <td className="border border-gray-300 p-3 text-center">
                    <input type="checkbox" className="w-4 h-4 text-burgundy-500 focus:ring-burgundy-500 border-gray-300 rounded" />
                  </td>
                  <td className="border border-gray-300 p-3 text-center">
                    <input type="checkbox" className="w-4 h-4 text-burgundy-500 focus:ring-burgundy-500 border-gray-300 rounded" />
                  </td>
                  <td className="border border-gray-300 p-3 text-center">
                    <input type="checkbox" className="w-4 h-4 text-burgundy-500 focus:ring-burgundy-500 border-gray-300 rounded" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* POROSITY TEST */}
      <div>
        <Label className="text-base font-semibold">- POROSITY TEST, ĐỘ ẨM (THẢ TÓC VÀO NƯỚC)</Label>
        <div className="mt-4 border-t border-gray-300 pt-4">
          <div className="flex gap-8">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="porosity-good"
                name="porosityTest"
                value="good"
                checked={formData.diagnosis.porosityTest === 'good'}
                onChange={(e) => handleInputChange('diagnosis', 'porosityTest', e.target.value)}
                className="h-4 w-4 border-gray-300 text-burgundy-500 focus:ring-burgundy-500 focus:ring-2 focus:ring-offset-2 cursor-pointer"
              />
              <Label htmlFor="porosity-good" className="font-medium cursor-pointer">TỐT</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="porosity-average"
                name="porosityTest"
                value="average"
                checked={formData.diagnosis.porosityTest === 'average'}
                onChange={(e) => handleInputChange('diagnosis', 'porosityTest', e.target.value)}
                className="h-4 w-4 border-gray-300 text-burgundy-500 focus:ring-burgundy-500 focus:ring-2 focus:ring-offset-2 cursor-pointer"
              />
              <Label htmlFor="porosity-average" className="font-medium cursor-pointer">TRUNG BÌNH</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="porosity-weak"
                name="porosityTest"
                value="weak"
                checked={formData.diagnosis.porosityTest === 'weak'}
                onChange={(e) => handleInputChange('diagnosis', 'porosityTest', e.target.value)}
                className="h-4 w-4 border-gray-300 text-burgundy-500 focus:ring-burgundy-500 focus:ring-2 focus:ring-offset-2 cursor-pointer"
              />
              <Label htmlFor="porosity-weak" className="font-medium cursor-pointer">YẾU</Label>
            </div>
          </div>
          <div className="mt-3 text-sm text-gray-600">
            <p>• Tóc nổi → tóc khỏe, ít hư tổn.</p>
            <p>• Tóc chìm từ từ → tóc trung bình, cần dưỡng.</p>
            <p>• Tóc chìm nhanh → tóc hư tổn, lớp biểu bì hở.</p>
          </div>
        </div>
      </div>

      {/* STRENGTH */}
      <div>
        <Label className="text-base font-semibold">- STRENGTH, ĐỘ CHẮC (XOẮN MỘT VÀI SỢI TÓC QUANH NGÓN TAY)</Label>
        <div className="mt-4 border-t border-gray-300 pt-4">
          <div className="flex gap-8">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="strength-good"
                name="strength"
                value="good"
                checked={formData.diagnosis.strength === 'good'}
                onChange={(e) => handleInputChange('diagnosis', 'strength', e.target.value)}
                className="h-4 w-4 border-gray-300 text-burgundy-500 focus:ring-burgundy-500 focus:ring-2 focus:ring-offset-2 cursor-pointer"
              />
              <Label htmlFor="strength-good" className="font-medium cursor-pointer">TỐT</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="strength-average"
                name="strength"
                value="average"
                checked={formData.diagnosis.strength === 'average'}
                onChange={(e) => handleInputChange('diagnosis', 'strength', e.target.value)}
                className="h-4 w-4 border-gray-300 text-burgundy-500 focus:ring-burgundy-500 focus:ring-2 focus:ring-offset-2 cursor-pointer"
              />
              <Label htmlFor="strength-average" className="font-medium cursor-pointer">TRUNG BÌNH</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="strength-weak"
                name="strength"
                value="weak"
                checked={formData.diagnosis.strength === 'weak'}
                onChange={(e) => handleInputChange('diagnosis', 'strength', e.target.value)}
                className="h-4 w-4 border-gray-300 text-burgundy-500 focus:ring-burgundy-500 focus:ring-2 focus:ring-offset-2 cursor-pointer"
              />
              <Label htmlFor="strength-weak" className="font-medium cursor-pointer">YẾU</Label>
            </div>
          </div>
          <div className="mt-3 text-sm text-gray-600">
            <p>• Nếu dễ gãy, sợi mảnh → tóc thiếu protein.</p>
            <p>• Nếu dẻo, nhão, mất độ bóng bệnh → tóc thiếu cân bằng ẩm.</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      {/* ƯU TIÊN */}
      <div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-burgundy-500 text-white">
                <th className="border border-gray-300 p-3 text-left font-semibold">VẤN ĐỀ CẦN GIẢI QUYẾT</th>
                <th className="border border-gray-300 p-3 text-center font-semibold">DƯỠNG CHẤT CẦN BỔ SUNG</th>
                <th className="border border-gray-300 p-3 text-center font-semibold">DỊCH VỤ PHÙ HỢP</th>
                <th className="border border-gray-300 p-3 text-center font-semibold">GIÁ</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white">
                <td className="border border-gray-300 p-3 font-medium bg-burgundy-100">
                  <div className="font-semibold text-burgundy-700">ƯU TIÊN</div>
                  <div>1</div>
                </td>
                <td className="border border-gray-300 p-3">
                  <textarea 
                    className="w-full h-20 border-none resize-none bg-transparent focus:outline-none"
                    placeholder="Nhập dưỡng chất cần bổ sung..."
                  />
                </td>
                <td className="border border-gray-300 p-3">
                  <textarea 
                    className="w-full h-20 border-none resize-none bg-transparent focus:outline-none"
                    placeholder="Nhập dịch vụ phù hợp..."
                  />
                </td>
                <td className="border border-gray-300 p-3">
                  <textarea 
                    className="w-full h-20 border-none resize-none bg-transparent focus:outline-none"
                    placeholder="Nhập giá..."
                  />
                </td>
              </tr>
              <tr className="bg-burgundy-50">
                <td className="border border-gray-300 p-3 font-medium">2</td>
                <td className="border border-gray-300 p-3">
                  <textarea 
                    className="w-full h-20 border-none resize-none bg-transparent focus:outline-none"
                    placeholder="Nhập dưỡng chất cần bổ sung..."
                  />
                </td>
                <td className="border border-gray-300 p-3">
                  <textarea 
                    className="w-full h-20 border-none resize-none bg-transparent focus:outline-none"
                    placeholder="Nhập dịch vụ phù hợp..."
                  />
                </td>
                <td className="border border-gray-300 p-3">
                  <textarea 
                    className="w-full h-20 border-none resize-none bg-transparent focus:outline-none"
                    placeholder="Nhập giá..."
                  />
                </td>
              </tr>
              <tr className="bg-white">
                <td className="border border-gray-300 p-3 font-medium">3</td>
                <td className="border border-gray-300 p-3">
                  <textarea 
                    className="w-full h-20 border-none resize-none bg-transparent focus:outline-none"
                    placeholder="Nhập dưỡng chất cần bổ sung..."
                  />
                </td>
                <td className="border border-gray-300 p-3">
                  <textarea 
                    className="w-full h-20 border-none resize-none bg-transparent focus:outline-none"
                    placeholder="Nhập dịch vụ phù hợp..."
                  />
                </td>
                <td className="border border-gray-300 p-3">
                  <textarea 
                    className="w-full h-20 border-none resize-none bg-transparent focus:outline-none"
                    placeholder="Nhập giá..."
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* DÀI HẠN */}
      <div className="mt-8">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <tbody>
              <tr className="bg-white">
                <td className="border border-gray-300 p-3 font-medium bg-burgundy-100">
                  <div className="font-semibold text-burgundy-700">DÀI HẠN</div>
                  <div>1</div>
                </td>
                <td className="border border-gray-300 p-3">
                  <textarea 
                    className="w-full h-20 border-none resize-none bg-transparent focus:outline-none"
                    placeholder="Nhập dưỡng chất cần bổ sung..."
                  />
                </td>
                <td className="border border-gray-300 p-3">
                  <textarea 
                    className="w-full h-20 border-none resize-none bg-transparent focus:outline-none"
                    placeholder="Nhập dịch vụ phù hợp..."
                  />
                </td>
                <td className="border border-gray-300 p-3">
                  <textarea 
                    className="w-full h-20 border-none resize-none bg-transparent focus:outline-none"
                    placeholder="Nhập giá..."
                  />
                </td>
              </tr>
              <tr className="bg-burgundy-50">
                <td className="border border-gray-300 p-3 font-medium">2</td>
                <td className="border border-gray-300 p-3">
                  <textarea 
                    className="w-full h-20 border-none resize-none bg-transparent focus:outline-none"
                    placeholder="Nhập dưỡng chất cần bổ sung..."
                  />
                </td>
                <td className="border border-gray-300 p-3">
                  <textarea 
                    className="w-full h-20 border-none resize-none bg-transparent focus:outline-none"
                    placeholder="Nhập dịch vụ phù hợp..."
                  />
                </td>
                <td className="border border-gray-300 p-3">
                  <textarea 
                    className="w-full h-20 border-none resize-none bg-transparent focus:outline-none"
                    placeholder="Nhập giá..."
                  />
                </td>
              </tr>
              <tr className="bg-white">
                <td className="border border-gray-300 p-3 font-medium">3</td>
                <td className="border border-gray-300 p-3">
                  <textarea 
                    className="w-full h-20 border-none resize-none bg-transparent focus:outline-none"
                    placeholder="Nhập dưỡng chất cần bổ sung..."
                  />
                </td>
                <td className="border border-gray-300 p-3">
                  <textarea 
                    className="w-full h-20 border-none resize-none bg-transparent focus:outline-none"
                    placeholder="Nhập dịch vụ phù hợp..."
                  />
                </td>
                <td className="border border-gray-300 p-3">
                  <textarea 
                    className="w-full h-20 border-none resize-none bg-transparent focus:outline-none"
                    placeholder="Nhập giá..."
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      {/* DỊCH VỤ SỬ DỤNG */}
      <div>
        <Label className="text-base font-semibold">DỊCH VỤ SỬ DỤNG:</Label>
        <div className="mt-4 border-t border-gray-300 pt-4">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-burgundy-500 text-white">
                  <th className="border border-gray-300 p-3 text-left font-semibold w-1/4">KẾT QUẢ SAU DỊCH VỤ TẠI SALON</th>
                  <th className="border border-gray-300 p-3 text-center font-semibold">MỨC ĐỘ CẢI THIỆN SAU DỊCH VỤ</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white">
                  <td className="border border-gray-300 p-3 font-medium">
                    <textarea 
                      className="w-full h-16 border-none resize-none bg-transparent focus:outline-none"
                      placeholder="Nhập kết quả sau dịch vụ..."
                    />
                  </td>
                  <td className="border border-gray-300 p-3">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="font-medium">20%</span>
                        <input type="checkbox" className="w-4 h-4 text-burgundy-500 focus:ring-burgundy-500 border-gray-300 rounded" />
                        <span className="text-sm">Vẫn đề còn lại</span>
                        <div className="flex-1 border-b border-dotted border-gray-400"></div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-medium">40%</span>
                        <input type="checkbox" className="w-4 h-4 text-burgundy-500 focus:ring-burgundy-500 border-gray-300 rounded" />
                        <span className="text-sm">Vẫn đề còn lại</span>
                        <div className="flex-1 border-b border-dotted border-gray-400"></div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-medium">70%</span>
                        <input type="checkbox" className="w-4 h-4 text-burgundy-500 focus:ring-burgundy-500 border-gray-300 rounded" />
                        <span className="text-sm">Vẫn đề còn lại</span>
                        <div className="flex-1 border-b border-dotted border-gray-400"></div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-medium">100%</span>
                        <input type="checkbox" className="w-4 h-4 text-burgundy-500 focus:ring-burgundy-500 border-gray-300 rounded" />
                        <span className="text-sm">Vẫn đề còn lại</span>
                        <div className="flex-1 border-b border-dotted border-gray-400"></div>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* PHÁT ĐỒ ĐIỀU TRỊ / CHĂM SÓC TẠI NHÀ */}
      <div>
        <Label className="text-base font-semibold">PHÁT ĐỒ ĐIỀU TRỊ / CHĂM SÓC TẠI NHÀ</Label>
        <div className="mt-4">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-burgundy-500 text-white">
                  <th className="border border-gray-300 p-3 text-center font-semibold">SẢN PHẨM</th>
                  <th className="border border-gray-300 p-3 text-center font-semibold">CÔNG DỤNG</th>
                  <th className="border border-gray-300 p-3 text-center font-semibold">MỤC ĐÍCH CẢI THIỆN</th>
                  <th className="border border-gray-300 p-3 text-center font-semibold">CÁCH DÙNG</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4].map((row) => (
                  <tr key={row} className={row % 2 === 0 ? 'bg-burgundy-50' : 'bg-white'}>
                    <td className="border border-gray-300 p-3">
                      <textarea 
                        className="w-full h-16 border-none resize-none bg-transparent focus:outline-none"
                        placeholder=""
                      />
                    </td>
                    <td className="border border-gray-300 p-3">
                      <textarea 
                        className="w-full h-16 border-none resize-none bg-transparent focus:outline-none"
                        placeholder="Nhập công dụng..."
                      />
                    </td>
                    <td className="border border-gray-300 p-3">
                      <textarea 
                        className="w-full h-16 border-none resize-none bg-transparent focus:outline-none"
                        placeholder="Nhập mục đích..."
                      />
                    </td>
                    <td className="border border-gray-300 p-3">
                      <textarea 
                        className="w-full h-16 border-none resize-none bg-transparent focus:outline-none"
                        placeholder="Nhập cách dùng..."
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* LỊCH HẸN KẾ TIẾP */}
      <div>
        <Label className="text-base font-semibold">LỊCH HẸN KẾ TIẾP:</Label>
        <div className="mt-4 space-y-4">
          <div className="border-b border-dotted border-gray-400 pb-2">
            <textarea 
              className="w-full h-16 border-none resize-none bg-transparent focus:outline-none"
              placeholder="Ghi chú về lịch hẹn kế tiếp..."
              value={formData.passport.nextAppointment}
              onChange={(e) => handleInputChange('passport', 'nextAppointment', e.target.value)}
            />
          </div>
          <div className="border-b border-dotted border-gray-400 pb-2">
            <textarea 
              className="w-full h-16 border-none resize-none bg-transparent focus:outline-none"
              placeholder="Thêm ghi chú..."
            />
          </div>
          <div className="border-b border-dotted border-gray-400 pb-2">
            <textarea 
              className="w-full h-16 border-none resize-none bg-transparent focus:outline-none"
              placeholder="Thêm ghi chú..."
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      {/* LỊCH HẸN KẾ TIẾP */}
      <div>
        <Label className="text-base font-semibold">5/ LỊCH HẸN KẾ TIẾP:</Label>
        <div className="mt-4 space-y-4">
          <div className="border-b border-dotted border-gray-400 pb-2">
            <textarea 
              className="w-full h-16 border-none resize-none bg-transparent focus:outline-none"
              placeholder="Ghi chú về lịch hẹn kế tiếp..."
            />
          </div>
          <div className="border-b border-dotted border-gray-400 pb-2">
            <textarea 
              className="w-full h-16 border-none resize-none bg-transparent focus:outline-none"
              placeholder="Thêm ghi chú..."
            />
          </div>
          <div className="border-b border-dotted border-gray-400 pb-2">
            <textarea 
              className="w-full h-16 border-none resize-none bg-transparent focus:outline-none"
              placeholder="Thêm ghi chú..."
            />
          </div>
          <div className="border-b border-dotted border-gray-400 pb-2">
            <textarea 
              className="w-full h-16 border-none resize-none bg-transparent focus:outline-none"
              placeholder="Thêm ghi chú..."
            />
          </div>
        </div>
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
          {currentStep === 5 && renderStep5()}
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

          {currentStep < 5 ? (
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
