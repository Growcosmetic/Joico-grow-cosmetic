import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import HomePage from './components/HomePage';
import ConsultationForm from './components/ConsultationForm';
import CustomerManagement from './components/CustomerManagement';
import AppointmentManagement from './components/AppointmentManagement';
import ReportsAnalytics from './components/ReportsAnalytics';
import Login from './components/Login';
import SystemManagement from './components/SystemManagement';
import Profile from './components/Profile';
import UserManagement from './components/UserManagement';
import { auth } from './firebase/config';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import './App.css';

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setActiveSection('home');
      alert('Đăng xuất thành công!');
    } catch (error) {
      console.error('Logout error:', error);
      alert('Có lỗi khi đăng xuất!');
    }
  };

  // Show loading while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-burgundy-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  // Temporary: Skip login for testing (remove this when Firebase Auth is ready)
  // Show login if not authenticated
  // if (!user) {
  //   return <Login onLoginSuccess={setUser} />;
  // }

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
      case 'system':
        return <SystemManagement />;
      case 'profile':
        return <Profile user={user || { email: 'admin@chitam.salon', displayName: 'Admin' }} />;
      case 'users':
        return <UserManagement currentUser={user || { email: 'admin@chitam.salon', displayName: 'Admin' }} />;
      default:
        return <HomePage setActiveSection={setActiveSection} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header setActiveSection={setActiveSection} />
      <Navigation 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        user={user || { email: 'admin@chitam.salon', displayName: 'Admin' }}
        onLogout={handleLogout}
      />
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
