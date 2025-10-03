import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Scissors, Plus, Search, Edit, Trash2, Clock, DollarSign } from 'lucide-react';

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [staff, setStaff] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    duration: '',
    category: '',
    description: '',
    assignedStaff: [], // Danh sách nhân viên có thể thực hiện
    isPopular: false,
    isActive: true
  });

  useEffect(() => {
    loadServices();
    loadStaff();
  }, []);

  const loadStaff = () => {
    const savedStaff = localStorage.getItem('salonStaff');
    if (savedStaff) {
      setStaff(JSON.parse(savedStaff));
    }
  };

  const loadServices = () => {
    const savedServices = localStorage.getItem('salonServices');
    if (savedServices) {
      setServices(JSON.parse(savedServices));
    } else {
      const defaultServices = [
        {
          id: '1',
          name: 'Cắt tóc nam',
          price: 150000,
          duration: 45,
          category: 'Cắt tóc',
          description: 'Cắt tóc nam chuyên nghiệp',
          isPopular: true,
          isActive: true,
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Cắt tóc nữ',
          price: 200000,
          duration: 60,
          category: 'Cắt tóc',
          description: 'Cắt tóc nữ thời trang',
          isPopular: true,
          isActive: true,
          createdAt: new Date().toISOString()
        },
        {
          id: '3',
          name: 'Nhuộm tóc',
          price: 500000,
          duration: 120,
          category: 'Nhuộm',
          description: 'Nhuộm tóc chất lượng cao',
          isPopular: false,
          isActive: true,
          createdAt: new Date().toISOString()
        }
      ];
      setServices(defaultServices);
      saveServices(defaultServices);
    }
  };

  const saveServices = (servicesToSave) => {
    localStorage.setItem('salonServices', JSON.stringify(servicesToSave));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.duration) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }

    const newService = {
      id: Date.now().toString(),
      ...formData,
      price: parseFloat(formData.price),
      duration: parseInt(formData.duration),
      createdAt: new Date().toISOString()
    };

    const updatedServices = [...services, newService];
    setServices(updatedServices);
    saveServices(updatedServices);
    
    setFormData({ name: '', price: '', duration: '', category: '', description: '', assignedStaff: [], isPopular: false, isActive: true });
    setShowAddForm(false);
  };

  const handleDelete = (serviceId) => {
    if (confirm('Bạn có chắc chắn muốn xóa dịch vụ này?')) {
      const updatedServices = services.filter(s => s.id !== serviceId);
      setServices(updatedServices);
      saveServices(updatedServices);
    }
  };

  const filteredServices = services.filter(service => 
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-burgundy-700 flex items-center gap-2">
            <Scissors className="w-6 h-6" />
            Quản lý dịch vụ
          </h2>
          <p className="text-gray-600">Quản lý các dịch vụ salon</p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-burgundy-500 hover:bg-burgundy-600"
        >
          <Plus size={16} className="mr-2" />
          Thêm dịch vụ
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Tìm kiếm dịch vụ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Add Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Thêm dịch vụ mới</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Tên dịch vụ *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="price">Giá (VNĐ) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Thời gian (phút) *</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Danh mục</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Mô tả</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              
              <div>
                <Label>Nhân viên thực hiện</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {staff
                    .filter(s => s.isStylist && s.isActive)
                    .map(staffMember => (
                      <div key={staffMember.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`staff-${staffMember.id}`}
                          checked={formData.assignedStaff.includes(staffMember.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData(prev => ({
                                ...prev,
                                assignedStaff: [...prev.assignedStaff, staffMember.id]
                              }));
                            } else {
                              setFormData(prev => ({
                                ...prev,
                                assignedStaff: prev.assignedStaff.filter(id => id !== staffMember.id)
                              }));
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor={`staff-${staffMember.id}`} className="text-sm">
                          {staffMember.name}
                        </Label>
                      </div>
                    ))}
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isPopular"
                    checked={formData.isPopular}
                    onChange={(e) => setFormData(prev => ({ ...prev, isPopular: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="isPopular">Dịch vụ phổ biến</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="isActive">Đang hoạt động</Label>
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="bg-burgundy-500 hover:bg-burgundy-600">
                  Thêm dịch vụ
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                >
                  Hủy
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Services List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredServices.map((service) => (
          <Card key={service.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-gray-900">{service.name}</h3>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(service.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    <span className="text-lg font-bold text-burgundy-500">
                      {service.price?.toLocaleString('vi-VN')} VNĐ
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-gray-600">{service.duration} phút</span>
                  </div>
                </div>
                
                {service.category && (
                  <Badge variant="secondary">{service.category}</Badge>
                )}
                
                {service.description && (
                  <p className="text-sm text-gray-600">{service.description}</p>
                )}
                
                {service.assignedStaff && service.assignedStaff.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {service.assignedStaff.slice(0, 2).map(staffId => {
                      const staffMember = staff.find(s => s.id === staffId);
                      return staffMember ? (
                        <Badge key={staffId} variant="secondary" className="text-xs">
                          {staffMember.name}
                        </Badge>
                      ) : null;
                    })}
                    {service.assignedStaff.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{service.assignedStaff.length - 2}
                      </Badge>
                    )}
                  </div>
                )}
                
                <div className="flex gap-2">
                  {service.isPopular && (
                    <Badge className="bg-yellow-100 text-yellow-800">Phổ biến</Badge>
                  )}
                  {!service.isActive && (
                    <Badge variant="destructive">Ngừng hoạt động</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Scissors className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'Không tìm thấy dịch vụ' : 'Chưa có dịch vụ nào'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ? 'Hãy thử thay đổi từ khóa tìm kiếm' : 'Hãy thêm dịch vụ đầu tiên của bạn'}
            </p>
            {!searchTerm && (
              <Button
                onClick={() => setShowAddForm(true)}
                className="bg-burgundy-500 hover:bg-burgundy-600"
              >
                <Plus size={16} className="mr-2" />
                Thêm dịch vụ đầu tiên
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ServiceManagement;