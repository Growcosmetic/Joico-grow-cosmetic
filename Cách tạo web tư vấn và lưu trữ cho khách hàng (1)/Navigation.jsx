import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Home, FileText, Users, Calendar, BarChart3, Brain, Star, Bell, ShoppingCart } from 'lucide-react';

const Navigation = ({ activeSection, setActiveSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { id: 'home', label: 'Trang chủ', icon: Home },
    { id: 'quiz', label: 'Quiz chẩn đoán', icon: Brain },
    { id: 'consultation', label: 'Tư vấn khách hàng', icon: FileText },
    { id: 'passport', label: 'Hair Passport', icon: Star },
    { id: 'products', label: 'Sản phẩm JOICO', icon: ShoppingCart },
    { id: 'reminders', label: 'Nhắc lịch', icon: Bell },
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
          <div className="hidden md:flex items-center gap-4">
            <span className="text-sm text-gray-600">Xin chào, Admin</span>
            <div className="w-8 h-8 bg-burgundy-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
              A
            </div>
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
