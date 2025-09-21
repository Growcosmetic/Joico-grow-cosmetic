import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Phone, MapPin } from 'lucide-react';

const Header = ({ setActiveSection }) => {
  return (
    <header className="bg-burgundy-gradient text-white">
      {/* JOICO Brand Header */}
      <div className="joico-header">
        <div className="joico-logo">JOICO</div>
        <div className="joico-tagline">the joi of healthy hair</div>
        <div className="defy-damage-title">DEFY DAMAGE</div>
      </div>
      
      {/* Salon Info */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row justify-between items-center">
          <div className="text-center lg:text-left mb-4 lg:mb-0">
            <h1 className="text-3xl lg:text-4xl font-bold mb-2">Chí Tâm Hair Salon</h1>
            <p className="text-lg opacity-90">Tư vấn chăm sóc tóc chuyên nghiệp với công nghệ JOICO</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              variant="secondary" 
              className="bg-white text-burgundy-500 hover:bg-burgundy-50"
              onClick={() => setActiveSection && setActiveSection('appointments')}
            >
              <Calendar size={16} className="mr-2" />
              Đặt lịch hẹn
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
