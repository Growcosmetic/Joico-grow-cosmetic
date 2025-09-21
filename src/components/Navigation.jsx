import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Home, FileText, Users, Calendar, BarChart3, ChevronDown, Settings, LogOut, User } from 'lucide-react';

const Navigation = ({ activeSection, setActiveSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const adminMenuRef = useRef(null);

  // Close admin menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (adminMenuRef.current && !adminMenuRef.current.contains(event.target)) {
        setIsAdminMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const menuItems = [
    { id: 'home', label: 'Trang chủ', icon: Home },
    { id: 'consultation', label: 'Tư vấn khách hàng', icon: FileText },
    { id: 'customers', label: 'Quản lý khách hàng', icon: Users },
    { id: 'appointments', label: 'Lịch hẹn', icon: Calendar },
    { id: 'reports', label: 'Báo cáo', icon: BarChart3 },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuClick = (sectionId) => {
    setActiveSection(sectionId);
    setIsMenuOpen(false);
  };

  const handleAdminAction = (action) => {
    setIsAdminMenuOpen(false);
    switch (action) {
      case 'profile':
        alert('Chức năng quản lý hồ sơ đang được phát triển!');
        break;
      case 'settings':
        alert('Chức năng cài đặt hệ thống đang được phát triển!');
        break;
      case 'logout':
        if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
          alert('Đã đăng xuất thành công!');
          // Có thể redirect hoặc reset state ở đây
        }
        break;
      default:
        break;
    }
  };

  return (
    <nav className="bg-white shadow-md border-b border-burgundy-100">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? "default" : "ghost"}
                  className={`flex items-center gap-2 ${
                    activeSection === item.id 
                      ? 'bg-burgundy-500 text-white hover:bg-burgundy-600' 
                      : 'text-burgundy-500 hover:bg-burgundy-50'
                  }`}
                  onClick={() => handleMenuClick(item.id)}
                >
                  <Icon size={16} />
                  {item.label}
                </Button>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              className="text-burgundy-500"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>

          {/* User Info */}
          <div className="hidden md:flex items-center gap-4 relative" ref={adminMenuRef}>
            <span className="text-sm text-gray-600">Xin chào, Admin</span>
            <div 
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
              onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
            >
              <div className="w-8 h-8 bg-burgundy-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                A
              </div>
              <ChevronDown size={16} className="text-gray-500" />
            </div>
            
            {/* Admin Dropdown Menu */}
            {isAdminMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="py-2">
                  <button
                    onClick={() => handleAdminAction('profile')}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <User size={16} />
                    Quản lý hồ sơ
                  </button>
                  <button
                    onClick={() => handleAdminAction('settings')}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <Settings size={16} />
                    Cài đặt hệ thống
                  </button>
                  <hr className="my-2" />
                  <button
                    onClick={() => handleAdminAction('logout')}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} />
                    Đăng xuất
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={activeSection === item.id ? "default" : "ghost"}
                    className={`flex items-center gap-2 justify-start ${
                      activeSection === item.id 
                        ? 'bg-burgundy-500 text-white' 
                        : 'text-burgundy-500 hover:bg-burgundy-50'
                    }`}
                    onClick={() => handleMenuClick(item.id)}
                  >
                    <Icon size={16} />
                    {item.label}
                  </Button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
