import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import * as XLSX from 'xlsx';
import { customerService } from '../firebase/firestore';
import { 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Phone, 
  Mail, 
  Calendar,
  FileText,
  Download,
  Upload
} from 'lucide-react';

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [showMergeDialog, setShowMergeDialog] = useState(false);
  const [duplicateCustomers, setDuplicateCustomers] = useState([]);
  const [selectedCustomerToMerge, setSelectedCustomerToMerge] = useState(null);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    birthday: '',
    gender: '',
    hairCondition: '',
    treatments: [],
    notes: '' // Thêm trường ghi chú
  });
  const fileInputRef = useRef(null);

  // Load customers from Firestore on component mount
  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const customersData = await customerService.getAll();
        if (customersData.length === 0) {
          // Add sample data if no customers exist
          const sampleCustomers = [
            {
              name: 'Nguyễn Thị Lan',
              phone: '0901234567',
              email: 'lan.nguyen@email.com',
              birthday: '1990-05-15',
              gender: 'female',
              lastVisit: '2025-01-15',
              totalVisits: 5,
              status: 'active',
              hairCondition: 'Tóc khô, hư tổn',
              treatments: ['DEFY DAMAGE', 'Keratin'],
              nextAppointment: '2025-02-15',
              notes: 'Khách hàng VIP, thích sản phẩm cao cấp'
            },
            {
              name: 'Trần Văn Minh',
              phone: '0912345678',
              email: 'minh.tran@email.com',
              birthday: '1985-08-22',
              gender: 'male',
              lastVisit: '2025-01-10',
              totalVisits: 3,
              status: 'active',
              hairCondition: 'Tóc mỏng, rụng nhiều',
              treatments: ['Amino', 'Massage'],
              nextAppointment: '2025-02-10',
              notes: 'Cần chăm sóc đặc biệt cho tóc mỏng'
            },
            {
              name: 'Lê Thị Hoa',
              phone: '0923456789',
              email: 'hoa.le@email.com',
              birthday: '1992-12-03',
              gender: 'female',
              lastVisit: '2024-12-20',
              totalVisits: 8,
              status: 'inactive',
              hairCondition: 'Tóc nhuộm, cần dưỡng',
              treatments: ['DEFY DAMAGE', 'Color Care'],
              nextAppointment: null,
              notes: 'Khách hàng cũ, cần liên hệ lại'
            }
          ];
          
          // Add sample customers to Firestore
          for (const customer of sampleCustomers) {
            await customerService.add(customer);
          }
          
          // Reload customers after adding samples
          const newCustomersData = await customerService.getAll();
          setCustomers(newCustomersData);
        } else {
          setCustomers(customersData);
        }
      } catch (error) {
        console.error('Error loading customers:', error);
        alert('Có lỗi khi tải dữ liệu khách hàng. Vui lòng thử lại!');
      }
    };

    loadCustomers();

    // Setup real-time listener
    const unsubscribe = customerService.onSnapshot((customersData) => {
      setCustomers(customersData);
    });

    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, []);

  // Filter customers based on search term
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Check for duplicate customers
  const checkDuplicateCustomer = (customerData) => {
    const duplicates = customers.filter(existingCustomer => {
      // Check by phone number (primary)
      if (existingCustomer.phone === customerData.phone) {
        return true;
      }
      
      // Check by email if provided
      if (customerData.email && existingCustomer.email === customerData.email) {
        return true;
      }
      
      // Check by name + birthday if both provided
      if (customerData.name && customerData.birthday && 
          existingCustomer.name === customerData.name && 
          existingCustomer.birthday === customerData.birthday) {
        return true;
      }
      
      return false;
    });
    
    return duplicates;
  };

  // Handle adding new customer
  const handleAddCustomer = async () => {
    if (!newCustomer.name || !newCustomer.phone) {
      alert('Vui lòng nhập tên và số điện thoại!');
      return;
    }

    // Check for duplicates
    const duplicates = checkDuplicateCustomer(newCustomer);
    if (duplicates.length > 0) {
      setDuplicateCustomers(duplicates);
      setSelectedCustomerToMerge(newCustomer);
      setShowMergeDialog(true);
      return;
    }

    try {
      const customerToAdd = {
        ...newCustomer,
        lastVisit: new Date().toISOString().split('T')[0],
        totalVisits: 0,
        status: 'active',
        nextAppointment: null
      };

      await customerService.add(customerToAdd);
      
        // Reset form
        setNewCustomer({
          name: '',
          phone: '',
          email: '',
          birthday: '',
          gender: '',
          hairCondition: '',
          treatments: [],
          notes: ''
        });
      setShowAddForm(false);
      alert('Thêm khách hàng thành công!');
    } catch (error) {
      console.error('Error adding customer:', error);
      alert('Có lỗi khi thêm khách hàng. Vui lòng thử lại!');
    }
  };

  // Handle input changes for new customer form
  const handleNewCustomerChange = (field, value) => {
    setNewCustomer(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle input changes for edit customer form
  const handleEditCustomerChange = (field, value) => {
    setEditingCustomer(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle editing customer
  const handleEditCustomer = (customer) => {
    setEditingCustomer({ ...customer });
    setShowEditForm(true);
  };

  // Handle merging customers
  const handleMergeCustomers = async (existingCustomer, newCustomerData) => {
    try {
      const mergedCustomer = {
        ...existingCustomer,
        // Keep existing data but update with new information
        name: newCustomerData.name || existingCustomer.name,
        email: newCustomerData.email || existingCustomer.email,
        birthday: newCustomerData.birthday || existingCustomer.birthday,
        gender: newCustomerData.gender || existingCustomer.gender,
        hairCondition: newCustomerData.hairCondition || existingCustomer.hairCondition,
        treatments: [...new Set([...existingCustomer.treatments, ...newCustomerData.treatments])],
        notes: existingCustomer.notes + (newCustomerData.notes ? `\n${newCustomerData.notes}` : ''),
        lastVisit: new Date().toISOString().split('T')[0],
        totalVisits: existingCustomer.totalVisits + 1
      };

      await customerService.update(existingCustomer.id, mergedCustomer);
      
      // Reset form
      setNewCustomer({
        name: '',
        phone: '',
        email: '',
        birthday: '',
        gender: '',
        hairCondition: '',
        treatments: [],
        notes: ''
      });
      setShowAddForm(false);
      setShowMergeDialog(false);
      alert('Đã gộp thông tin khách hàng thành công!');
    } catch (error) {
      console.error('Error merging customers:', error);
      alert('Có lỗi khi gộp thông tin khách hàng. Vui lòng thử lại!');
    }
  };

  // Handle updating customer
  const handleUpdateCustomer = async () => {
    if (!editingCustomer.name || !editingCustomer.phone) {
      alert('Vui lòng nhập tên và số điện thoại!');
      return;
    }

    try {
      await customerService.update(editingCustomer.id, editingCustomer);
      setShowEditForm(false);
      setEditingCustomer(null);
      alert('Cập nhật thông tin khách hàng thành công!');
    } catch (error) {
      console.error('Error updating customer:', error);
      alert('Có lỗi khi cập nhật thông tin khách hàng. Vui lòng thử lại!');
    }
  };

  // Handle deleting customer
  const handleDeleteCustomer = async (customer) => {
    const confirmDelete = window.confirm(
      `Bạn có chắc chắn muốn xóa khách hàng "${customer.name}"?\n\nHành động này không thể hoàn tác!`
    );

    if (confirmDelete) {
      try {
        await customerService.delete(customer.id);
        alert('Xóa khách hàng thành công!');
      } catch (error) {
        console.error('Error deleting customer:', error);
        alert('Có lỗi khi xóa khách hàng. Vui lòng thử lại!');
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Đang hoạt động</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">Không hoạt động</Badge>;
      default:
        return <Badge className="bg-blue-100 text-blue-800">Mới</Badge>;
    }
  };

  const viewCustomerDetails = (customer) => {
    setSelectedCustomer(customer);
    setShowDetails(true);
  };

  // Export to Excel
  const exportToExcel = () => {
    const exportData = customers.map(customer => ({
      'Họ và tên': customer.name,
      'Số điện thoại': customer.phone,
      'Email': customer.email,
      'Ngày sinh': customer.birthday ? new Date(customer.birthday).toLocaleDateString('vi-VN') : '',
      'Giới tính': customer.gender === 'male' ? 'Nam' : customer.gender === 'female' ? 'Nữ' : customer.gender || '',
      'Tình trạng tóc': customer.hairCondition,
      'Liệu trình': customer.treatments.join(', '),
      'Lần đến cuối': customer.lastVisit,
      'Tổng số lần đến': customer.totalVisits,
      'Trạng thái': customer.status === 'active' ? 'Hoạt động' : 'Không hoạt động',
      'Lịch hẹn tiếp theo': customer.nextAppointment || '',
      'Ghi chú': customer.notes || ''
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Khách hàng');
    
    // Set column widths
    const colWidths = [
      { wch: 20 }, // Họ và tên
      { wch: 15 }, // Số điện thoại
      { wch: 25 }, // Email
      { wch: 12 }, // Ngày sinh
      { wch: 10 }, // Giới tính
      { wch: 30 }, // Tình trạng tóc
      { wch: 25 }, // Liệu trình
      { wch: 12 }, // Lần đến cuối
      { wch: 12 }, // Tổng số lần đến
      { wch: 12 }, // Trạng thái
      { wch: 15 }, // Lịch hẹn tiếp theo
      { wch: 40 }  // Ghi chú
    ];
    ws['!cols'] = colWidths;
    
    XLSX.writeFile(wb, `Danh_sach_khach_hang_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Import from Excel
  const importFromExcel = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const importedCustomers = jsonData.map((row) => ({
          name: row['Họ và tên'] || row['Name'] || '',
          phone: row['Số điện thoại'] || row['Phone'] || '',
          email: row['Email'] || '',
          birthday: row['Ngày sinh'] ? new Date(row['Ngày sinh']).toISOString().split('T')[0] : '',
          gender: row['Giới tính'] === 'Nam' ? 'male' : row['Giới tính'] === 'Nữ' ? 'female' : row['Giới tính'] || '',
          hairCondition: row['Tình trạng tóc'] || row['Hair Condition'] || '',
          treatments: row['Liệu trình'] ? row['Liệu trình'].split(', ') : [],
          lastVisit: new Date().toISOString().split('T')[0],
          totalVisits: parseInt(row['Tổng số lần đến']) || 0,
          status: 'active',
          nextAppointment: row['Lịch hẹn tiếp theo'] || null,
          notes: row['Ghi chú'] || ''
        })).filter(customer => customer.name && customer.phone); // Only import rows with name and phone

        if (importedCustomers.length > 0) {
          // Add customers to Firestore one by one
          let successCount = 0;
          for (const customer of importedCustomers) {
            try {
              await customerService.add(customer);
              successCount++;
            } catch (error) {
              console.error('Error adding customer:', customer.name, error);
            }
          }
          alert(`Đã nhập thành công ${successCount}/${importedCustomers.length} khách hàng từ file Excel!`);
        } else {
          alert('Không tìm thấy dữ liệu hợp lệ trong file Excel. Vui lòng kiểm tra định dạng file.');
        }
      } catch (error) {
        console.error('Error importing Excel:', error);
        alert('Có lỗi xảy ra khi đọc file Excel. Vui lòng kiểm tra định dạng file.');
      }
    };
    reader.readAsArrayBuffer(file);
    
    // Reset file input
    event.target.value = '';
  };

  const CustomerDetailsModal = () => {
    if (!showDetails || !selectedCustomer) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-burgundy-700">Chi tiết khách hàng</h3>
            <Button
              variant="ghost"
              onClick={() => setShowDetails(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </Button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="font-semibold">Họ và tên</Label>
                <p className="text-gray-700">{selectedCustomer.name}</p>
              </div>
              <div>
                <Label className="font-semibold">Số điện thoại</Label>
                <p className="text-gray-700">{selectedCustomer.phone}</p>
              </div>
              <div>
                <Label className="font-semibold">Email</Label>
                <p className="text-gray-700">{selectedCustomer.email}</p>
              </div>
              <div>
                <Label className="font-semibold">Ngày sinh</Label>
                <p className="text-gray-700">
                  {selectedCustomer.birthday ? new Date(selectedCustomer.birthday).toLocaleDateString('vi-VN') : 'Chưa có thông tin'}
                </p>
              </div>
              <div>
                <Label className="font-semibold">Giới tính</Label>
                <p className="text-gray-700">
                  {selectedCustomer.gender === 'male' ? 'Nam' : selectedCustomer.gender === 'female' ? 'Nữ' : 'Chưa có thông tin'}
                </p>
              </div>
              <div>
                <Label className="font-semibold">Trạng thái</Label>
                <div className="mt-1">{getStatusBadge(selectedCustomer.status)}</div>
              </div>
            </div>

            <div>
              <Label className="font-semibold">Tình trạng tóc</Label>
              <p className="text-gray-700">{selectedCustomer.hairCondition}</p>
            </div>

            <div>
              <Label className="font-semibold">Liệu trình đã thực hiện</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {selectedCustomer.treatments.map((treatment, index) => (
                  <Badge key={index} className="bg-burgundy-100 text-burgundy-800">
                    {treatment}
                  </Badge>
                ))}
                    </div>
                  </div>

                  <div>
                    <Label className="font-semibold">Ghi chú</Label>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                      {selectedCustomer.notes || 'Chưa có ghi chú'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="font-semibold">Lần đến cuối</Label>
                <p className="text-gray-700">{selectedCustomer.lastVisit}</p>
              </div>
              <div>
                <Label className="font-semibold">Tổng số lần đến</Label>
                <p className="text-gray-700">{selectedCustomer.totalVisits} lần</p>
              </div>
              <div>
                <Label className="font-semibold">Lịch hẹn tiếp theo</Label>
                <p className="text-gray-700">
                  {selectedCustomer.nextAppointment || 'Chưa có lịch hẹn'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button
              variant="outline"
              onClick={() => setShowDetails(false)}
              className="border-burgundy-500 text-burgundy-500 hover:bg-burgundy-50"
            >
              Đóng
            </Button>
            <Button 
              className="bg-burgundy-500 hover:bg-burgundy-600"
              onClick={() => {
                setShowDetails(false);
                handleEditCustomer(selectedCustomer);
              }}
            >
              <Edit size={16} className="mr-2" />
              Chỉnh sửa
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-burgundy-700">Quản lý khách hàng</h2>
          <p className="text-gray-600">Theo dõi và quản lý thông tin khách hàng</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            onClick={exportToExcel}
            className="border-burgundy-500 text-burgundy-500 hover:bg-burgundy-50"
          >
            <Download size={16} className="mr-2" />
            Xuất Excel
          </Button>
          <Button 
            variant="outline" 
            onClick={() => fileInputRef.current?.click()}
            className="border-green-500 text-green-500 hover:bg-green-50"
          >
            <Upload size={16} className="mr-2" />
            Nhập Excel
          </Button>
          <Button 
            className="bg-burgundy-500 hover:bg-burgundy-600"
            onClick={() => setShowAddForm(true)}
          >
            <Plus size={16} className="mr-2" />
            Thêm khách hàng
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={importFromExcel}
            style={{ display: 'none' }}
          />
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              placeholder="Tìm kiếm theo tên, số điện thoại hoặc email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-burgundy-500">{customers.length}</div>
            <div className="text-sm text-gray-600">Tổng khách hàng</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-500">
              {customers.filter(c => c.status === 'active').length}
            </div>
            <div className="text-sm text-gray-600">Đang hoạt động</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-500">
              {customers.filter(c => c.nextAppointment).length}
            </div>
            <div className="text-sm text-gray-600">Có lịch hẹn</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-500">
              {Math.round(customers.reduce((sum, c) => sum + c.totalVisits, 0) / customers.length) || 0}
            </div>
            <div className="text-sm text-gray-600">Trung bình lần đến</div>
          </CardContent>
        </Card>
      </div>

      {/* Customer List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách khách hàng</CardTitle>
          <CardDescription>
            Hiển thị {filteredCustomers.length} / {customers.length} khách hàng
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCustomers.map((customer) => (
              <div
                key={customer.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-burgundy-300 transition-colors"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{customer.name}</h3>
                      {getStatusBadge(customer.status)}
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Phone size={14} />
                        {customer.phone}
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail size={14} />
                        {customer.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        {customer.birthday ? new Date(customer.birthday).toLocaleDateString('vi-VN') : 'Chưa có'}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs">👤</span>
                        {customer.gender === 'male' ? 'Nam' : customer.gender === 'female' ? 'Nữ' : 'Chưa có'}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        Đến cuối: {customer.lastVisit}
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText size={14} />
                        {customer.totalVisits} lần đến
                      </div>
                    </div>

                    <div className="mt-2">
                      <span className="text-sm text-gray-500">Tình trạng: </span>
                      <span className="text-sm">{customer.hairCondition}</span>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {customer.treatments.map((treatment, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs bg-burgundy-100 text-burgundy-700"
                        >
                          {treatment}
                        </Badge>
                      ))}
                    </div>

                    {customer.notes && (
                      <div className="mt-2">
                        <span className="text-sm text-gray-500">Ghi chú: </span>
                        <span className="text-sm text-gray-700">{customer.notes}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => viewCustomerDetails(customer)}
                      className="border-burgundy-500 text-burgundy-500 hover:bg-burgundy-50"
                    >
                      <Eye size={16} className="mr-1" />
                      Xem
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditCustomer(customer)}
                      className="border-blue-500 text-blue-500 hover:bg-blue-50"
                    >
                      <Edit size={16} className="mr-1" />
                      Sửa
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteCustomer(customer)}
                      className="border-red-500 text-red-500 hover:bg-red-50"
                    >
                      <Trash2 size={16} className="mr-1" />
                      Xóa
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {filteredCustomers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <FileText size={48} className="mx-auto mb-4 opacity-50" />
                <p>Không tìm thấy khách hàng nào</p>
                {searchTerm && (
                  <p className="text-sm">Thử tìm kiếm với từ khóa khác</p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add Customer Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
            <CardHeader>
              <CardTitle>Thêm khách hàng mới</CardTitle>
              <CardDescription>
                Nhập thông tin khách hàng mới vào hệ thống
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="new-name">Họ và tên *</Label>
                    <Input
                      id="new-name"
                      value={newCustomer.name}
                      onChange={(e) => handleNewCustomerChange('name', e.target.value)}
                      placeholder="Nhập họ và tên"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-phone">Số điện thoại *</Label>
                    <Input
                      id="new-phone"
                      value={newCustomer.phone}
                      onChange={(e) => handleNewCustomerChange('phone', e.target.value)}
                      placeholder="Nhập số điện thoại"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-email">Email</Label>
                    <Input
                      id="new-email"
                      type="email"
                      value={newCustomer.email}
                      onChange={(e) => handleNewCustomerChange('email', e.target.value)}
                      placeholder="Nhập email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-birthday">Ngày sinh</Label>
                    <Input
                      id="new-birthday"
                      type="date"
                      value={newCustomer.birthday}
                      onChange={(e) => handleNewCustomerChange('birthday', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-gender">Giới tính</Label>
                    <select
                      id="new-gender"
                      value={newCustomer.gender}
                      onChange={(e) => handleNewCustomerChange('gender', e.target.value)}
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
                          <Label htmlFor="new-hair-condition">Tình trạng tóc</Label>
                          <Input
                            id="new-hair-condition"
                            value={newCustomer.hairCondition}
                            onChange={(e) => handleNewCustomerChange('hairCondition', e.target.value)}
                            placeholder="Mô tả tình trạng tóc hiện tại"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label htmlFor="new-notes">Ghi chú</Label>
                          <textarea
                            id="new-notes"
                            value={newCustomer.notes}
                            onChange={(e) => handleNewCustomerChange('notes', e.target.value)}
                            placeholder="Ghi chú thêm về khách hàng..."
                            rows={3}
                            className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:border-transparent resize-none"
                          />
                        </div>
                      </div>

              <div className="flex justify-end gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Hủy
                </Button>
                <Button 
                  onClick={handleAddCustomer}
                  className="bg-burgundy-500 hover:bg-burgundy-600"
                >
                  Thêm khách hàng
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Customer Form */}
      {showEditForm && editingCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
            <CardHeader>
              <CardTitle>Chỉnh sửa thông tin khách hàng</CardTitle>
              <CardDescription>
                Cập nhật thông tin khách hàng: {editingCustomer.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-name">Họ và tên *</Label>
                    <Input
                      id="edit-name"
                      value={editingCustomer.name}
                      onChange={(e) => handleEditCustomerChange('name', e.target.value)}
                      placeholder="Nhập họ và tên"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-phone">Số điện thoại *</Label>
                    <Input
                      id="edit-phone"
                      value={editingCustomer.phone}
                      onChange={(e) => handleEditCustomerChange('phone', e.target.value)}
                      placeholder="Nhập số điện thoại"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-email">Email</Label>
                    <Input
                      id="edit-email"
                      type="email"
                      value={editingCustomer.email}
                      onChange={(e) => handleEditCustomerChange('email', e.target.value)}
                      placeholder="Nhập email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-birthday">Ngày sinh</Label>
                    <Input
                      id="edit-birthday"
                      type="date"
                      value={editingCustomer.birthday}
                      onChange={(e) => handleEditCustomerChange('birthday', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-gender">Giới tính</Label>
                    <select
                      id="edit-gender"
                      value={editingCustomer.gender}
                      onChange={(e) => handleEditCustomerChange('gender', e.target.value)}
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
                    >
                      <option value="">Chọn giới tính</option>
                      <option value="male">Nam</option>
                      <option value="female">Nữ</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="edit-status">Trạng thái</Label>
                    <select
                      id="edit-status"
                      value={editingCustomer.status}
                      onChange={(e) => handleEditCustomerChange('status', e.target.value)}
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
                    >
                      <option value="active">Đang hoạt động</option>
                      <option value="inactive">Không hoạt động</option>
                    </select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="edit-hair-condition">Tình trạng tóc</Label>
                  <Input
                    id="edit-hair-condition"
                    value={editingCustomer.hairCondition}
                    onChange={(e) => handleEditCustomerChange('hairCondition', e.target.value)}
                    placeholder="Mô tả tình trạng tóc hiện tại"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-treatments">Liệu trình đã thực hiện</Label>
                  <Input
                    id="edit-treatments"
                    value={editingCustomer.treatments.join(', ')}
                    onChange={(e) => handleEditCustomerChange('treatments', e.target.value.split(', ').filter(t => t.trim()))}
                    placeholder="Nhập các liệu trình, cách nhau bởi dấu phẩy"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="edit-notes">Ghi chú</Label>
                  <textarea
                    id="edit-notes"
                    value={editingCustomer.notes}
                    onChange={(e) => handleEditCustomerChange('notes', e.target.value)}
                    placeholder="Ghi chú thêm về khách hàng..."
                    rows={3}
                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:border-transparent resize-none"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-last-visit">Lần đến cuối</Label>
                    <Input
                      id="edit-last-visit"
                      type="date"
                      value={editingCustomer.lastVisit}
                      onChange={(e) => handleEditCustomerChange('lastVisit', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-total-visits">Tổng số lần đến</Label>
                    <Input
                      id="edit-total-visits"
                      type="number"
                      min="0"
                      value={editingCustomer.totalVisits}
                      onChange={(e) => handleEditCustomerChange('totalVisits', parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="edit-next-appointment">Lịch hẹn tiếp theo</Label>
                  <Input
                    id="edit-next-appointment"
                    type="date"
                    value={editingCustomer.nextAppointment || ''}
                    onChange={(e) => handleEditCustomerChange('nextAppointment', e.target.value || null)}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowEditForm(false);
                    setEditingCustomer(null);
                  }}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Hủy
                </Button>
                <Button 
                  onClick={handleUpdateCustomer}
                  className="bg-burgundy-500 hover:bg-burgundy-600"
                >
                  Cập nhật
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Customer Details Modal */}
      <CustomerDetailsModal />

      {/* Merge Customer Dialog */}
      {showMergeDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
            <CardHeader>
              <CardTitle className="text-red-600">⚠️ Phát hiện khách hàng trùng lặp</CardTitle>
              <CardDescription>
                Hệ thống phát hiện khách hàng có thể đã tồn tại. Bạn có thể gộp thông tin hoặc tạo mới.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Khách hàng mới:</h4>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p><strong>Tên:</strong> {selectedCustomerToMerge?.name}</p>
                    <p><strong>SĐT:</strong> {selectedCustomerToMerge?.phone}</p>
                    {selectedCustomerToMerge?.email && <p><strong>Email:</strong> {selectedCustomerToMerge.email}</p>}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Khách hàng trùng lặp:</h4>
                  <div className="space-y-2">
                    {duplicateCustomers.map((customer, index) => (
                      <div key={customer.id} className="bg-yellow-50 p-3 rounded-lg border">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p><strong>Tên:</strong> {customer.name}</p>
                            <p><strong>SĐT:</strong> {customer.phone}</p>
                            {customer.email && <p><strong>Email:</strong> {customer.email}</p>}
                            <p><strong>Lần đến:</strong> {customer.totalVisits}</p>
                            <p><strong>Lần cuối:</strong> {customer.lastVisit}</p>
                          </div>
                          <Button
                            onClick={() => handleMergeCustomers(customer, selectedCustomerToMerge)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Gộp thông tin
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowMergeDialog(false);
                      setDuplicateCustomers([]);
                      setSelectedCustomerToMerge(null);
                    }}
                  >
                    Hủy
                  </Button>
                  <Button
                    onClick={async () => {
                      // Force add new customer
                      try {
                        const customerToAdd = {
                          ...selectedCustomerToMerge,
                          lastVisit: new Date().toISOString().split('T')[0],
                          totalVisits: 0,
                          status: 'active',
                          nextAppointment: null
                        };

                        await customerService.add(customerToAdd);
                        
                        setNewCustomer({
                          name: '',
                          phone: '',
                          email: '',
                          birthday: '',
                          gender: '',
                          hairCondition: '',
                          treatments: [],
                          notes: ''
                        });
                        setShowAddForm(false);
                        setShowMergeDialog(false);
                        alert('Đã thêm khách hàng mới thành công!');
                      } catch (error) {
                        console.error('Error adding customer:', error);
                        alert('Có lỗi khi thêm khách hàng. Vui lòng thử lại!');
                      }
                    }}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Tạo mới
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CustomerManagement;
