import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, ArrowRight, Save, FileText, Mail, Brain, Star, Camera, Package } from 'lucide-react';
import { consultationService, customerService } from '../firebase/firestore';
import emailjs from '@emailjs/browser';
import HairQuiz from './HairQuiz';
import HairPassportSimple from './HairPassportSimple';
import TreatmentPlan from './TreatmentPlan';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ConsultationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [quizResults, setQuizResults] = useState(null);
  const [professionalTests, setProfessionalTests] = useState(null);
  const [beforePhoto, setBeforePhoto] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedQuizResults = localStorage.getItem('quizAnalysis');
    const savedProfessionalTests = localStorage.getItem('professionalTests');
    const savedBeforePhoto = localStorage.getItem('beforePhoto');
    
    if (savedQuizResults) {
      setQuizResults(JSON.parse(savedQuizResults));
    }
    if (savedProfessionalTests) {
      setProfessionalTests(JSON.parse(savedProfessionalTests));
    }
    if (savedBeforePhoto) {
      setBeforePhoto(savedBeforePhoto);
    }
  }, []);
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
    { id: 1, title: 'Thông tin khách hàng', subtitle: 'Thu thập thông tin cơ bản', icon: FileText },
    { id: 2, title: 'Quiz chẩn đoán', subtitle: '6 câu hỏi thông minh', icon: Brain },
    { id: 3, title: 'Chẩn đoán chuyên nghiệp', subtitle: '4 phép đo chuyên sâu', icon: Camera },
    { id: 4, title: 'Kế hoạch điều trị', subtitle: 'Chọn sản phẩm Joico', icon: Package },
    { id: 5, title: 'Tư vấn & Điều trị', subtitle: 'Lập kế hoạch điều trị', icon: FileText },
    { id: 6, title: 'Hair Passport', subtitle: 'Tổng kết và xuất PDF', icon: Star }
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

  // Export PDF function
  const exportToPDF = async () => {
    try {
      const element = document.getElementById('hair-passport-content');
      if (!element) {
        alert('Không tìm thấy nội dung để xuất PDF');
        return;
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const fileName = `Hair_Passport_${formData.customerInfo.name || 'Customer'}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
      alert('PDF đã được xuất thành công!');
    } catch (error) {
      console.error('Lỗi xuất PDF:', error);
      alert('Có lỗi xảy ra khi xuất PDF');
    }
  };

  // Function để phân tích kết quả chẩn đoán
  const generateSummary = () => {
    const { diagnosis } = formData;
    let hairCondition = "Tốt";
    let priority = "Thấp";
    
    // Phân tích tổng thể
    const weakCount = [diagnosis.elasticity, diagnosis.porosityTest, diagnosis.strength].filter(x => x === 'weak').length;
    const averageCount = [diagnosis.elasticity, diagnosis.porosityTest, diagnosis.strength].filter(x => x === 'average').length;
    
    if (weakCount >= 2) {
      hairCondition = "Hư tổn nặng";
      priority = "Cao";
    } else if (weakCount === 1 || averageCount >= 2) {
      hairCondition = "Trung bình";
      priority = "Trung bình";
    }

    return {
      hairCondition,
      priority,
      summary: {
        elasticity: diagnosis.elasticity || 'Chưa đánh giá',
        porosity: diagnosis.porosityTest || 'Chưa đánh giá', 
        strength: diagnosis.strength || 'Chưa đánh giá'
      }
    };
  };

          // Function gửi email với EmailJS
          const sendEmails = async (customerData) => {
            if (!customerData.email) {
              return { success: false, message: 'Khách hàng chưa có email' };
            }

            try {
              // EmailJS configuration
              const emailData = {
                customer_name: customerData.name,
                customer_phone: customerData.phone,
                consultation_date: new Date().toLocaleDateString('vi-VN'),
                salon_name: 'CHÍ TÂM Hair Salon',
                salon_phone: '0938 987 733',
                salon_address: '14-16-18 Lê Thị Riêng, P.Bến Thành, TP.HCM',
                to_email: customerData.email
              };

              console.log('📧 Sending email with data:', emailData);
              console.log('📧 EmailJS config:', {
                serviceId: 'Chitam-service',
                templateId: 'template_yaz8cmo',
                publicKey: 'LEZjGYiu_RWn76QP6'
              });
              
              // Gửi email thực tế với EmailJS
              const result = await emailjs.send(
                'Chitam-service',            // Service ID
                'template_yaz8cmo',         // Template ID
                emailData,                   // Template data
                'LEZjGYiu_RWn76QP6'         // Public Key
              );
              
              console.log('✅ Email sent successfully:', result);
              return { success: true, message: 'Email đã được gửi thành công!' };
            } catch (error) {
              console.error('❌ Email error details:', {
                error: error,
                message: error.message,
                status: error.status,
                text: error.text,
                stack: error.stack
              });
              return { success: false, message: 'Lỗi gửi email: ' + (error.message || error.text || error.toString() || 'Không xác định') };
            }
          };

  const saveForm = async () => {
    console.log('🔥 Save form clicked!', formData); // Debug log
    
    try {
      // Validate required fields
      if (!formData.customerInfo.name || !formData.customerInfo.phone) {
        alert('❌ Vui lòng nhập đầy đủ Họ tên và Số điện thoại!');
        return;
      }

      console.log('💾 Saving consultation to localStorage (Firestore backup)...'); // Debug log
      
      // Save to localStorage as backup (since Firestore has connection issues)
      const consultationData = {
        ...formData,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        customerName: formData.customerInfo.name,
        customerPhone: formData.customerInfo.phone,
        quizResults: quizResults,
        professionalTests: professionalTests,
        beforePhoto: beforePhoto
      };
      
      // Get existing consultations
      const existingConsultations = JSON.parse(localStorage.getItem('consultations') || '[]');
      existingConsultations.push(consultationData);
      localStorage.setItem('consultations', JSON.stringify(existingConsultations));
      
      console.log('✅ Consultation saved to localStorage successfully'); // Debug log

      // Try Firestore as secondary option
      try {
        await consultationService.add(consultationData);
        console.log('✅ Also saved to Firestore successfully'); // Debug log
      } catch (firestoreError) {
        console.warn('⚠️ Firestore save failed, but localStorage succeeded:', firestoreError);
      }
      
        // Save customer to localStorage too
      const customerData = {
        id: Date.now().toString() + '_customer',
        name: formData.customerInfo.name,
        phone: formData.customerInfo.phone,
        email: formData.customerInfo.email || '',
        birthday: formData.customerInfo.birthday || '',
        gender: formData.customerInfo.gender || '',
        lastVisit: new Date().toISOString().split('T')[0],
        totalVisits: 1,
        status: 'active',
        hairCondition: formData.customerInfo.currentIssues?.join(', ') || '',
        treatments: formData.customerInfo.previousTreatments || [],
        selectedProducts: selectedProducts,
        nextAppointment: formData.passport?.nextAppointment || null,
        notes: `Tư vấn ngày ${new Date().toLocaleDateString('vi-VN')}`
      };
      
      // Check for duplicate customers before saving
      const existingCustomers = JSON.parse(localStorage.getItem('customers') || '[]');
      const duplicates = existingCustomers.filter(existingCustomer => {
        // Check by phone number (primary)
        if (existingCustomer.phone === customerData.phone) {
          return true;
        }
        
        // Check by email if provided
        if (customerData.email && existingCustomer.email === customerData.email) {
          return true;
        }
        
        return false;
      });
      
      if (duplicates.length > 0) {
        // Update existing customer instead of creating new one
        const existingCustomer = duplicates[0];
        const updatedCustomer = {
          ...existingCustomer,
          lastVisit: customerData.lastVisit,
          totalVisits: existingCustomer.totalVisits + 1,
          hairCondition: customerData.hairCondition || existingCustomer.hairCondition,
          treatments: [...new Set([...existingCustomer.treatments, ...customerData.treatments])],
          nextAppointment: customerData.nextAppointment || existingCustomer.nextAppointment,
          notes: existingCustomer.notes + `\nTư vấn ngày ${new Date().toLocaleDateString('vi-VN')}`
        };
        
        // Update in localStorage
        const updatedCustomers = existingCustomers.map(customer => 
          customer.id === existingCustomer.id ? updatedCustomer : customer
        );
        localStorage.setItem('customers', JSON.stringify(updatedCustomers));
        
        console.log('✅ Updated existing customer in localStorage');
      } else {
        // Add new customer
        existingCustomers.push(customerData);
        localStorage.setItem('customers', JSON.stringify(existingCustomers));
        console.log('✅ Added new customer to localStorage');
      }
      
      console.log('✅ Customer saved to localStorage successfully');

      // Try Firestore for customer as secondary
      try {
        await customerService.add(customerData);
        console.log('✅ Customer also saved to Firestore');
      } catch (firestoreError) {
        console.warn('⚠️ Customer Firestore save failed:', firestoreError);
      }
      
              // Gửi email nếu có email khách hàng
              let emailStatus = '';
              if (customerData.email) {
                console.log('📧 Attempting to send email...');
                const emailResult = await sendEmails(customerData);
                if (emailResult.success) {
                  emailStatus = '\n📧 Email thông báo đã được gửi thành công cho khách hàng!';
                } else {
                  emailStatus = '\n⚠️ ' + emailResult.message;
                }
              } else {
                emailStatus = '\n💡 Tip: Nhập email khách hàng để gửi thông báo tự động';
              }

      // Success message
      alert('✅ DỮ LIỆU TƯ VẤN ĐÃ ĐƯỢC LƯU THÀNH CÔNG!\n\n👤 Khách hàng: ' + customerData.name + '\n📞 SĐT: ' + customerData.phone + '\n📅 Ngày tư vấn: ' + new Date().toLocaleDateString('vi-VN') + emailStatus + '\n\n💾 Dữ liệu đã được lưu trữ an toàn!');
      
      // Reset form after successful save
      console.log('Resetting form...'); // Debug log
      setCurrentStep(1);
      setFormData({
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
        treatment: {
          priority: [],
          longTerm: []
        },
        passport: {
          servicesUsed: [],
          improvementPercentage: '',
          homeCarePlan: [],
          nextAppointment: ''
        }
      });
      
    } catch (error) {
      console.error('Error saving consultation:', error);
      alert('❌ Có lỗi khi lưu dữ liệu tư vấn. Vui lòng thử lại!\n\nLỗi: ' + error.message);
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

  const renderStep3 = () => {
    const analysis = generateSummary();
    
    return (
      <div className="space-y-6">
        {/* TÓM TẮT CHẨN ĐOÁN */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-burgundy-700 flex items-center gap-2">
              <span className="text-xl">📊</span>
              TÓM TẮT KẾT QUẢ CHẨN ĐOÁN
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-white rounded-lg border">
                <div className="text-sm text-gray-600">Độ đàn hồi</div>
                <div className="text-lg font-bold text-burgundy-600">
                  {analysis.summary.elasticity === 'good' ? 'TỐT' :
                   analysis.summary.elasticity === 'average' ? 'TRUNG BÌNH' :
                   analysis.summary.elasticity === 'weak' ? 'YẾU' : 'Chưa đánh giá'}
                </div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border">
                <div className="text-sm text-gray-600">Độ ẩm (Porosity)</div>
                <div className="text-lg font-bold text-burgundy-600">
                  {analysis.summary.porosity === 'good' ? 'TỐT' :
                   analysis.summary.porosity === 'average' ? 'TRUNG BÌNH' :
                   analysis.summary.porosity === 'weak' ? 'YẾU' : 'Chưa đánh giá'}
                </div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border">
                <div className="text-sm text-gray-600">Độ chắc (Strength)</div>
                <div className="text-lg font-bold text-burgundy-600">
                  {analysis.summary.strength === 'good' ? 'TỐT' :
                   analysis.summary.strength === 'average' ? 'TRUNG BÌNH' :
                   analysis.summary.strength === 'weak' ? 'YẾU' : 'Chưa đánh giá'}
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-sm text-gray-600">Tình trạng tóc: </span>
                  <span className="font-bold text-burgundy-600">{analysis.hairCondition}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Độ ưu tiên: </span>
                  <span className="font-bold px-2 py-1 rounded text-xs bg-burgundy-100 text-burgundy-700">{analysis.priority}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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
  };

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
                        <span className="text-sm">Vấn đề còn lại</span>
                        <textarea 
                          className="flex-1 h-8 border-none border-b border-dotted border-gray-400 bg-transparent resize-none focus:outline-none focus:border-burgundy-500"
                          placeholder="Ghi chú vấn đề còn lại..."
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-medium">40%</span>
                        <input type="checkbox" className="w-4 h-4 text-burgundy-500 focus:ring-burgundy-500 border-gray-300 rounded" />
                        <span className="text-sm">Vấn đề còn lại</span>
                        <textarea 
                          className="flex-1 h-8 border-none border-b border-dotted border-gray-400 bg-transparent resize-none focus:outline-none focus:border-burgundy-500"
                          placeholder="Ghi chú vấn đề còn lại..."
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-medium">70%</span>
                        <input type="checkbox" className="w-4 h-4 text-burgundy-500 focus:ring-burgundy-500 border-gray-300 rounded" />
                        <span className="text-sm">Vấn đề còn lại</span>
                        <textarea 
                          className="flex-1 h-8 border-none border-b border-dotted border-gray-400 bg-transparent resize-none focus:outline-none focus:border-burgundy-500"
                          placeholder="Ghi chú vấn đề còn lại..."
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-medium">100%</span>
                        <input type="checkbox" className="w-4 h-4 text-burgundy-500 focus:ring-burgundy-500 border-gray-300 rounded" />
                        <span className="text-sm">Vấn đề còn lại</span>
                        <textarea 
                          className="flex-1 h-8 border-none border-b border-dotted border-gray-400 bg-transparent resize-none focus:outline-none focus:border-burgundy-500"
                          placeholder="Ghi chú vấn đề còn lại..."
                        />
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

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return (
          <HairQuiz 
            onComplete={(analysis) => {
              setQuizResults(analysis);
              setBeforePhoto(analysis.beforePhoto);
              // Lưu kết quả quiz vào localStorage để đồng bộ
              localStorage.setItem('quizAnalysis', JSON.stringify(analysis));
              nextStep();
            }} 
          />
        );
      case 3:
        return renderStep2();
      case 4:
        return (
          <TreatmentPlan 
            onSave={(products) => {
              setSelectedProducts(products);
              nextStep();
            }}
            initialSelectedProducts={selectedProducts}
          />
        );
      case 5:
        return renderStep3();
      case 6:
        return (
          <div>
            <HairPassportSimple 
              customerInfo={formData.customerInfo}
              quizResults={quizResults || JSON.parse(localStorage.getItem('quizAnalysis') || 'null')}
              professionalTests={professionalTests || JSON.parse(localStorage.getItem('professionalTests') || 'null')}
              beforePhoto={beforePhoto || localStorage.getItem('beforePhoto')}
              onSave={(passportData) => {
                setFormData(prev => ({
                  ...prev,
                  passport: passportData
                }));
                // Lưu passport data vào localStorage
                localStorage.setItem('hairPassport', JSON.stringify(passportData));
              }}
              onScheduleFollowUp={(appointmentData) => {
                console.log('Đặt lịch hẹn:', appointmentData);
                // Lưu appointment data
                localStorage.setItem('nextAppointment', JSON.stringify(appointmentData));
              }}
            />
            <div className="mt-6 flex justify-center gap-4">
              <Button
                onClick={exportToPDF}
                className="bg-red-500 hover:bg-red-600"
              >
                <FileText size={16} className="mr-2" />
                Xuất PDF
              </Button>
            </div>
          </div>
        );
      default:
        return renderStep1();
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.id} className="flex items-center">
                <div className={`flex flex-col items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                    currentStep >= step.id 
                      ? 'bg-burgundy-500 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {Icon ? <Icon size={16} /> : step.id}
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
            );
          })}
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
          {renderStepContent()}
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
          {currentStep < 5 && (
            <Button
              variant="outline"
              onClick={saveForm}
              className="border-burgundy-500 text-burgundy-500 hover:bg-burgundy-50"
            >
              <Save size={16} className="mr-2" />
              Lưu tạm
            </Button>
          )}

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
              className="bg-green-500 hover:bg-green-600"
            >
              <FileText size={16} className="mr-2" />
              Lưu & Gửi Email
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsultationForm;
