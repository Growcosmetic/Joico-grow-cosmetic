import React, { useState } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import HomePage from './components/HomePage';
import HairQuiz from './components/HairQuiz';
import ConsultationForm from './components/ConsultationForm';
import HairPassportSimple from './components/HairPassportSimple';
import ProductRecommendation from './components/ProductRecommendation';
import ReminderSystem from './components/ReminderSystem';
import CustomerManagement from './components/CustomerManagement';
import AppointmentManagement from './components/AppointmentManagement';
import ReportsAnalytics from './components/ReportsAnalytics';
import './App.css';

function App() {
  const [activeSection, setActiveSection] = useState('home');

  const renderContent = () => {
    switch (activeSection) {
      case 'home':
        return <HomePage setActiveSection={setActiveSection} />;
      case 'quiz':
        return <HairQuiz onComplete={(analysis) => {
          // Lưu kết quả phân tích và chuyển đến trang tư vấn
          localStorage.setItem('quizAnalysis', JSON.stringify(analysis));
          setActiveSection('consultation');
        }} />;
      case 'consultation':
        return <ConsultationForm />;
      case 'passport':
        return <HairPassportSimple 
          customerInfo={{
            name: 'Khách hàng mẫu',
            phone: '0123456789',
            email: 'customer@example.com',
            visitDate: new Date().toLocaleDateString('vi-VN')
          }}
          quizResults={JSON.parse(localStorage.getItem('quizAnalysis') || 'null')}
          professionalTests={JSON.parse(localStorage.getItem('professionalTests') || 'null')}
          beforePhoto={localStorage.getItem('beforePhoto')}
          onSave={(passportData) => {
            localStorage.setItem('hairPassport', JSON.stringify(passportData));
            alert('Hair Passport đã được lưu thành công!');
          }}
          onScheduleFollowUp={(appointmentData) => {
            console.log('Đặt lịch hẹn:', appointmentData);
            setActiveSection('appointments');
          }}
        />;
      case 'customers':
        return <CustomerManagement />;
      case 'products':
        return <ProductRecommendation />;
      case 'reminders':
        return <ReminderSystem />;
      case 'appointments':
        return <AppointmentManagement />;
      case 'reports':
        return <ReportsAnalytics />;
      default:
        return <HomePage setActiveSection={setActiveSection} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
      <footer className="bg-burgundy-500 text-white text-center py-6 mt-12">
        <p>&copy; 2025 Chí Tâm Hair Salon. Tất cả quyền được bảo lưu.</p>
        <p className="text-sm opacity-80 mt-2">Powered by JOICO DEFY DAMAGE Technology</p>
      </footer>
    </div>
  );
}

export default App;
