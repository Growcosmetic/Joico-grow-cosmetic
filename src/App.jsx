import React, { useState } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import HomePage from './components/HomePage';
import ConsultationForm from './components/ConsultationForm';
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
      case 'consultation':
        return <ConsultationForm />;
      case 'customers':
        return <CustomerManagement />;
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
        <p className="text-sm opacity-80 mt-2">14-16-18 Lê Thị Riêng, P.Bến Thành, TP.HCM | Hotline: 0938 987 733</p>
        <p className="text-sm opacity-80 mt-1">Powered by JOICO DEFY DAMAGE Technology</p>
      </footer>
    </div>
  );
}

export default App;
