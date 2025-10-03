import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Search, Edit, Trash2, Phone, Mail, Calendar, Star, Award, Download, Upload, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    position: '',
    specializations: [],
    experience: '',
    rating: 5,
    bio: '',
    isActive: true,
    isConsultant: false,
    isStylist: false,
    workingHours: '',
    commission: 0
  });

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = () => {
    const savedStaff = localStorage.getItem('salonStaff');
    if (savedStaff) {
      setStaff(JSON.parse(savedStaff));
    } else {
      // Load default staff
      const defaultStaff = [
        {
          id: '1',
          name: 'Nguyễn Thị Lan Anh',
          phone: '0901234567',
          email: 'lananh@salon.com',
          position: 'Stylist Senior',
          specializations: ['Cắt tóc nữ', 'Nhuộm tóc', 'Uốn tóc'],
          experience: '8 năm',
          rating: 4.8,
          bio: 'Chuyên gia về tóc nữ với 8 năm kinh nghiệm',
          isActive: true,
          isConsultant: true,
          isStylist: true,
          workingHours: '9:00 - 18:00',
          commission: 15,
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Trần Văn Minh',
          phone: '0907654321',
          email: 'minh@salon.com',
          position: 'Stylist',
          specializations: ['Cắt tóc nam', 'Styling'],
          experience: '5 năm',
          rating: 4.5,
          bio: 'Chuyên gia cắt tóc nam hiện đại',
          isActive: true,
          isConsultant: false,
          isStylist: true,
          workingHours: '10:00 - 19:00',
          commission: 12,
          createdAt: new Date().toISOString()
        },
        {
          id: '3',
          name: 'Lê Thị Hương',
          phone: '0909876543',
          email: 'huong@salon.com',
          position: 'Consultant',
          specializations: ['Tư vấn tóc', 'Điều trị tóc'],
          experience: '6 năm',
          rating: 4.7,
          bio: 'Chuyên gia tư vấn và điều trị tóc hư tổn',
          isActive: true,
          isConsultant: true,
          isStylist: false,
          workingHours: '9:00 - 17:00',
          commission: 10,
          createdAt: new Date().toISOString()
        }
      ];
      setStaff(defaultStaff);
      saveStaff(defaultStaff);
    }
  };

  const saveStaff = (staffToSave) => {
    localStorage.setItem('salonStaff', JSON.stringify(staffToSave));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.position) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }

    const newStaff = {
      id: editingStaff ? editingStaff.id : Date.now().toString(),
      ...formData,
      rating: parseFloat(formData.rating),
      commission: parseFloat(formData.commission),
      createdAt: editingStaff ? editingStaff.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (editingStaff) {
      const updatedStaff = staff.map(s => 
        s.id === editingStaff.id ? newStaff : s
      );
      setStaff(updatedStaff);
      saveStaff(updatedStaff);
      setEditingStaff(null);
    } else {
      const updatedStaff = [...staff, newStaff];
      setStaff(updatedStaff);
      saveStaff(updatedStaff);
    }

    resetForm();
    setShowAddForm(false);
  };

  const handleEdit = (staffMember) => {
    setFormData({
      name: staffMember.name || '',
      phone: staffMember.phone || '',
      email: staffMember.email || '',
      position: staffMember.position || '',
      specializations: staffMember.specializations || [],
      experience: staffMember.experience || '',
      rating: staffMember.rating || 5,
      bio: staffMember.bio || '',
      isActive: staffMember.isActive !== false,
      isConsultant: staffMember.isConsultant || false,
      isStylist: staffMember.isStylist || false,
      workingHours: staffMember.workingHours || '',
      commission: staffMember.commission || 0
    });
    setEditingStaff(staffMember);
    setShowAddForm(true);
  };

  const handleDelete = (staffId) => {
    if (confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
      const updatedStaff = staff.filter(s => s.id !== staffId);
      setStaff(updatedStaff);
      saveStaff(updatedStaff);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      position: '',
      specializations: [],
      experience: '',
      rating: 5,
      bio: '',
      isActive: true,
      isConsultant: false,
      isStylist: false,
      workingHours: '',
      commission: 0
    });
  };

  // Excel functions
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(staff.map(staffMember => ({
      'Họ và tên': staffMember.name,
      'Số điện thoại': staffMember.phone,
      'Email': staffMember.email || '',
      'Chức vụ': staffMember.position || '',
      'Chuyên môn': staffMember.specializations?.join(', ') || '',
      'Kinh nghiệm': staffMember.experience || '',
      'Đánh giá': staffMember.rating || 5,
      'Giới thiệu': staffMember.bio || '',
      'Giờ làm việc': staffMember.workingHours || '',
      'Hoa hồng (%)': staffMember.commission || 0,
      'Đang làm việc': staffMember.isActive ? 'Có' : 'Không',
      'Nhân viên tư vấn': staffMember.isConsultant ? 'Có' : 'Không',
      'Stylist': staffMember.isStylist ? 'Có' : 'Không'
    })));
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Nhân viên');
    
    const fileName = `danh_sach_nhan_vien_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const createExcelTemplate = () => {
    const templateData = [{
      'Họ và tên': 'Nguyễn Thị Lan Anh',
      'Số điện thoại': '0901234567',
      'Email': 'lananh@salon.com',
      'Chức vụ': 'Stylist Senior',
      'Chuyên môn': 'Cắt tóc nữ, Nhuộm tóc, Uốn tóc',
      'Kinh nghiệm': '8 năm',
      'Đánh giá': '4.8',
      'Giới thiệu': 'Chuyên gia về tóc nữ với 8 năm kinh nghiệm',
      'Giờ làm việc': '9:00 - 18:00',
      'Hoa hồng (%)': '15',
      'Đang làm việc': 'Có',
      'Nhân viên tư vấn': 'Có',
      'Stylist': 'Có'
    }];
    
    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');
    
    XLSX.writeFile(workbook, 'template_nhan_vien.xlsx');
  };

  const importFromExcel = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const importedStaff = jsonData.map((row, index) => ({
          id: `imported_${Date.now()}_${index}`,
          name: row['Họ và tên'] || '',
          phone: row['Số điện thoại'] || '',
          email: row['Email'] || '',
          position: row['Chức vụ'] || '',
          specializations: row['Chuyên môn']?.split(', ').filter(Boolean) || [],
          experience: row['Kinh nghiệm'] || '',
          rating: parseFloat(row['Đánh giá']) || 5,
          bio: row['Giới thiệu'] || '',
          workingHours: row['Giờ làm việc'] || '',
          commission: parseFloat(row['Hoa hồng (%)']) || 0,
          isActive: row['Đang làm việc'] === 'Có',
          isConsultant: row['Nhân viên tư vấn'] === 'Có',
          isStylist: row['Stylist'] === 'Có',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }));

        // Merge with existing staff
        const existingStaff = staff.filter(s => 
          !importedStaff.some(is => is.phone === s.phone)
        );
        const updatedStaff = [...existingStaff, ...importedStaff];
        
        setStaff(updatedStaff);
        saveStaff(updatedStaff);
        
        alert(`Đã import thành công ${importedStaff.length} nhân viên!`);
      } catch (error) {
        console.error('Error importing Excel:', error);
        alert('Có lỗi khi import file Excel. Vui lòng kiểm tra định dạng file!');
      } finally {
        setLoading(false);
        event.target.value = ''; // Reset file input
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const filteredStaff = staff.filter(staffMember => 
    staffMember.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staffMember.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staffMember.specializations?.some(spec => 
      spec.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const positions = [
    'Stylist Senior', 'Stylist', 'Consultant', 'Manager', 
    'Trainee', 'Colorist', 'Barber'
  ];

  const specializations = [
    'Cắt tóc nam', 'Cắt tóc nữ', 'Nhuộm tóc', 'Uốn tóc',
    'Styling', 'Tư vấn tóc', 'Điều trị tóc', 'Massage da đầu',
    'Làm móng', 'Chăm sóc da'
  ];

  const handleSpecializationChange = (specialization, checked) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        specializations: [...prev.specializations, specialization]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        specializations: prev.specializations.filter(spec => spec !== specialization)
      }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-burgundy-700 flex items-center gap-2">
            <Users className="w-6 h-6" />
            Quản lý nhân viên
          </h2>
          <p className="text-gray-600">Quản lý đội ngũ nhân viên salon</p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-burgundy-500 hover:bg-burgundy-600"
        >
          <Plus size={16} className="mr-2" />
          Thêm nhân viên
        </Button>
      </div>

      {/* Excel Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5" />
            Quản lý Excel
          </CardTitle>
          <CardDescription>
            Import/Export danh sách nhân viên bằng file Excel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button
              onClick={createExcelTemplate}
              variant="outline"
              className="border-blue-500 text-blue-500 hover:bg-blue-50"
            >
              <FileSpreadsheet size={16} className="mr-2" />
              Template Excel
            </Button>
            
            <Button
              onClick={exportToExcel}
              variant="outline"
              className="border-green-500 text-green-500 hover:bg-green-50"
            >
              <Download size={16} className="mr-2" />
              Xuất Excel
            </Button>
            
            <div className="relative">
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={importFromExcel}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={loading}
              />
              <Button
                variant="outline"
                className="border-purple-500 text-purple-500 hover:bg-purple-50 w-full"
                disabled={loading}
              >
                <Upload size={16} className="mr-2" />
                {loading ? 'Đang import...' : 'Nhập Excel'}
              </Button>
            </div>
            
            <Button
              onClick={loadStaff}
              variant="outline"
              className="border-gray-500 text-gray-500 hover:bg-gray-50"
            >
              <Users size={16} className="mr-2" />
              Làm mới
            </Button>
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start gap-2">
              <FileSpreadsheet className="w-5 h-5 text-blue-500 mt-0.5" />
              <div className="text-sm text-blue-700">
                <p className="font-medium">Hướng dẫn sử dụng Excel:</p>
                <ul className="mt-1 space-y-1 text-xs">
                  <li>• Tải Template Excel để xem định dạng chuẩn</li>
                  <li>• Điền dữ liệu nhân viên vào file Excel theo template</li>
                  <li>• Sử dụng "Nhập Excel" để import nhiều nhân viên cùng lúc</li>
                  <li>• Sử dụng "Xuất Excel" để backup dữ liệu hiện có</li>
                  <li>• Các cột bắt buộc: Họ và tên, Số điện thoại</li>
                  <li>• Các cột tùy chọn: Email, Chức vụ, Chuyên môn, Kinh nghiệm, v.v.</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Tìm kiếm nhân viên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingStaff ? 'Sửa thông tin nhân viên' : 'Thêm nhân viên mới'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Họ và tên *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Số điện thoại *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="position">Chức vụ *</Label>
                  <select
                    id="position"
                    value={formData.position}
                    onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
                    required
                  >
                    <option value="">Chọn chức vụ</option>
                    {positions.map(position => (
                      <option key={position} value={position}>{position}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="experience">Kinh nghiệm</Label>
                  <Input
                    id="experience"
                    value={formData.experience}
                    onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                    placeholder="VD: 5 năm"
                  />
                </div>
                <div>
                  <Label htmlFor="rating">Đánh giá</Label>
                  <Input
                    id="rating"
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    value={formData.rating}
                    onChange={(e) => setFormData(prev => ({ ...prev, rating: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="workingHours">Giờ làm việc</Label>
                  <Input
                    id="workingHours"
                    value={formData.workingHours}
                    onChange={(e) => setFormData(prev => ({ ...prev, workingHours: e.target.value }))}
                    placeholder="VD: 9:00 - 18:00"
                  />
                </div>
                <div>
                  <Label htmlFor="commission">Hoa hồng (%)</Label>
                  <Input
                    id="commission"
                    type="number"
                    min="0"
                    max="50"
                    value={formData.commission}
                    onChange={(e) => setFormData(prev => ({ ...prev, commission: e.target.value }))}
                  />
                </div>
              </div>
              
              <div>
                <Label>Chuyên môn</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {specializations.map(specialization => (
                    <div key={specialization} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={specialization}
                        checked={formData.specializations.includes(specialization)}
                        onChange={(e) => handleSpecializationChange(specialization, e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor={specialization} className="text-sm">{specialization}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <Label htmlFor="bio">Giới thiệu</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  rows={3}
                />
              </div>
              
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="isActive">Đang làm việc</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isConsultant"
                    checked={formData.isConsultant}
                    onChange={(e) => setFormData(prev => ({ ...prev, isConsultant: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="isConsultant">Nhân viên tư vấn</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isStylist"
                    checked={formData.isStylist}
                    onChange={(e) => setFormData(prev => ({ ...prev, isStylist: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="isStylist">Stylist</Label>
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="bg-burgundy-500 hover:bg-burgundy-600">
                  {editingStaff ? 'Cập nhật' : 'Thêm nhân viên'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingStaff(null);
                    resetForm();
                  }}
                >
                  Hủy
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Staff List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStaff.map((staffMember) => (
          <Card key={staffMember.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">{staffMember.name}</h3>
                    <p className="text-sm text-gray-600">{staffMember.position}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(staffMember)}
                    >
                      <Edit size={14} />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(staffMember.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-blue-500" />
                    <span>{staffMember.phone}</span>
                  </div>
                  {staffMember.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-green-500" />
                      <span>{staffMember.email}</span>
                    </div>
                  )}
                  {staffMember.workingHours && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-purple-500" />
                      <span>{staffMember.workingHours}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="font-medium">{staffMember.rating}</span>
                  <span className="text-sm text-gray-600">({staffMember.experience})</span>
                </div>
                
                {staffMember.specializations?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {staffMember.specializations.slice(0, 2).map((spec, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                    {staffMember.specializations.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{staffMember.specializations.length - 2}
                      </Badge>
                    )}
                  </div>
                )}
                
                <div className="flex gap-2">
                  {staffMember.isConsultant && (
                    <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      Tư vấn
                    </Badge>
                  )}
                  {staffMember.isStylist && (
                    <Badge className="bg-green-100 text-green-800">
                      Stylist
                    </Badge>
                  )}
                  {!staffMember.isActive && (
                    <Badge variant="destructive">Nghỉ việc</Badge>
                  )}
                </div>
                
                {staffMember.bio && (
                  <p className="text-sm text-gray-600 line-clamp-2">{staffMember.bio}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStaff.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'Không tìm thấy nhân viên' : 'Chưa có nhân viên nào'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ? 'Hãy thử thay đổi từ khóa tìm kiếm' : 'Hãy thêm nhân viên đầu tiên của bạn'}
            </p>
            {!searchTerm && (
              <Button
                onClick={() => setShowAddForm(true)}
                className="bg-burgundy-500 hover:bg-burgundy-600"
              >
                <Plus size={16} className="mr-2" />
                Thêm nhân viên đầu tiên
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Statistics */}
      {staff.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Thống kê nhân viên</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{staff.length}</div>
                <div className="text-sm text-gray-600">Tổng nhân viên</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {staff.filter(s => s.isActive).length}
                </div>
                <div className="text-sm text-gray-600">Đang làm việc</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {staff.filter(s => s.isConsultant).length}
                </div>
                <div className="text-sm text-gray-600">Nhân viên tư vấn</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {staff.filter(s => s.isStylist).length}
                </div>
                <div className="text-sm text-gray-600">Stylist</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StaffManagement;
