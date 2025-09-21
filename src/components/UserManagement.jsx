import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Shield,
  UserPlus,
  Settings,
  Crown,
  User
} from 'lucide-react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';

const UserManagement = ({ currentUser }) => {
  const [users, setUsers] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    displayName: '',
    role: 'staff',
    permissions: [],
    phone: '',
    startDate: new Date().toISOString().split('T')[0]
  });

  // Định nghĩa các vai trò và quyền hạn
  const roles = {
    admin: {
      name: 'Quản lý salon',
      color: 'bg-red-100 text-red-800',
      icon: Crown,
      permissions: ['all']
    },
    manager: {
      name: 'Trưởng phòng',
      color: 'bg-purple-100 text-purple-800',
      icon: Shield,
      permissions: ['customers', 'appointments', 'reports', 'staff_view']
    },
    consultant: {
      name: 'Nhân viên tư vấn',
      color: 'bg-blue-100 text-blue-800',
      icon: User,
      permissions: ['customers', 'consultations', 'appointments']
    },
    staff: {
      name: 'Nhân viên',
      color: 'bg-green-100 text-green-800',
      icon: User,
      permissions: ['customers', 'appointments']
    },
    cashier: {
      name: 'Thu ngân',
      color: 'bg-yellow-100 text-yellow-800',
      icon: User,
      permissions: ['customers', 'reports_view']
    }
  };

  const allPermissions = [
    { id: 'customers', name: 'Quản lý khách hàng' },
    { id: 'consultations', name: 'Tư vấn khách hàng' },
    { id: 'appointments', name: 'Quản lý lịch hẹn' },
    { id: 'reports', name: 'Báo cáo và thống kê' },
    { id: 'reports_view', name: 'Xem báo cáo' },
    { id: 'staff_view', name: 'Xem danh sách nhân viên' },
    { id: 'system', name: 'Quản lý hệ thống' },
    { id: 'user_management', name: 'Quản lý tài khoản' }
  ];

  useEffect(() => {
    // Load users from localStorage
    const savedUsers = localStorage.getItem('systemUsers');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      // Sample admin user
      const adminUser = {
        id: 'admin-001',
        email: 'admin@chitam.salon',
        displayName: 'Admin CHÍ TÂM',
        role: 'admin',
        permissions: ['all'],
        phone: '0938 987 733',
        startDate: '2025-01-01',
        status: 'active',
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };
      setUsers([adminUser]);
      localStorage.setItem('systemUsers', JSON.stringify([adminUser]));
    }
  }, []);

  const handleCreateUser = async () => {
    if (!newUser.email || !newUser.password || !newUser.displayName) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }

    if (newUser.password.length < 6) {
      alert('Mật khẩu phải có ít nhất 6 ký tự!');
      return;
    }

    try {
      // Create user in Firebase Auth (commented out for now due to auth issues)
      // const userCredential = await createUserWithEmailAndPassword(auth, newUser.email, newUser.password);
      
      // For now, create user in localStorage
      const userToAdd = {
        id: `user-${Date.now()}`,
        ...newUser,
        permissions: roles[newUser.role].permissions,
        status: 'active',
        createdAt: new Date().toISOString(),
        createdBy: currentUser?.email || 'admin@chitam.salon'
      };

      const updatedUsers = [...users, userToAdd];
      setUsers(updatedUsers);
      localStorage.setItem('systemUsers', JSON.stringify(updatedUsers));

      // Reset form
      setNewUser({
        email: '',
        password: '',
        displayName: '',
        role: 'staff',
        permissions: [],
        phone: '',
        startDate: new Date().toISOString().split('T')[0]
      });
      setShowCreateForm(false);
      alert('Tạo tài khoản thành công!');
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Có lỗi khi tạo tài khoản: ' + error.message);
    }
  };

  const handleDeleteUser = (userId) => {
    if (userId === 'admin-001') {
      alert('Không thể xóa tài khoản admin chính!');
      return;
    }

    if (confirm('Bạn có chắc chắn muốn xóa tài khoản này?')) {
      const updatedUsers = users.filter(user => user.id !== userId);
      setUsers(updatedUsers);
      localStorage.setItem('systemUsers', JSON.stringify(updatedUsers));
      alert('Đã xóa tài khoản!');
    }
  };

  const handleToggleStatus = (userId) => {
    const updatedUsers = users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    );
    setUsers(updatedUsers);
    localStorage.setItem('systemUsers', JSON.stringify(updatedUsers));
  };

  const handleInputChange = (field, value) => {
    setNewUser(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getRoleBadge = (role) => {
    const roleInfo = roles[role] || roles.staff;
    const Icon = roleInfo.icon;
    return (
      <Badge className={roleInfo.color}>
        <Icon size={12} className="mr-1" />
        {roleInfo.name}
      </Badge>
    );
  };

  const getStatusBadge = (status) => {
    return status === 'active' 
      ? <Badge className="bg-green-100 text-green-800">Hoạt động</Badge>
      : <Badge className="bg-gray-100 text-gray-800">Tạm khóa</Badge>;
  };

  // Check if current user is admin
  const isAdmin = currentUser?.email === 'admin@chitam.salon' || 
                  users.find(u => u.email === currentUser?.email)?.role === 'admin';

  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Không có quyền truy cập</h3>
        <p className="text-gray-500">Chỉ admin mới có thể quản lý tài khoản người dùng.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-burgundy-700">Quản lý tài khoản</h2>
          <p className="text-gray-600">Tạo và quản lý tài khoản nhân viên salon</p>
        </div>
        <Button
          onClick={() => setShowCreateForm(true)}
          className="bg-burgundy-500 hover:bg-burgundy-600"
        >
          <UserPlus size={16} className="mr-2" />
          Tạo tài khoản mới
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 text-burgundy-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-burgundy-500">{users.length}</div>
            <div className="text-sm text-gray-600">Tổng tài khoản</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Shield className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-500">
              {users.filter(u => u.status === 'active').length}
            </div>
            <div className="text-sm text-gray-600">Đang hoạt động</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Crown className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-500">
              {users.filter(u => u.role === 'admin').length}
            </div>
            <div className="text-sm text-gray-600">Admin</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <User className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-500">
              {users.filter(u => u.role !== 'admin').length}
            </div>
            <div className="text-sm text-gray-600">Nhân viên</div>
          </CardContent>
        </Card>
      </div>

      {/* Create User Form */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
            <CardHeader>
              <CardTitle>Tạo tài khoản nhân viên mới</CardTitle>
              <CardDescription>
                Nhập thông tin nhân viên và phân quyền truy cập
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="new-name">Họ và tên *</Label>
                    <Input
                      id="new-name"
                      value={newUser.displayName}
                      onChange={(e) => handleInputChange('displayName', e.target.value)}
                      placeholder="Nhập họ và tên"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-email">Email *</Label>
                    <Input
                      id="new-email"
                      type="email"
                      value={newUser.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Nhập email đăng nhập"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-password">Mật khẩu *</Label>
                    <div className="relative">
                      <Input
                        id="new-password"
                        type={showPassword ? 'text' : 'password'}
                        value={newUser.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        placeholder="Mật khẩu (tối thiểu 6 ký tự)"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="new-phone">Số điện thoại</Label>
                    <Input
                      id="new-phone"
                      value={newUser.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="Nhập số điện thoại"
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-role">Vai trò *</Label>
                    <select
                      id="new-role"
                      value={newUser.role}
                      onChange={(e) => handleInputChange('role', e.target.value)}
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
                    >
                      <option value="staff">Nhân viên</option>
                      <option value="consultant">Nhân viên tư vấn</option>
                      <option value="cashier">Thu ngân</option>
                      <option value="manager">Trưởng phòng</option>
                      <option value="admin">Quản lý salon</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="new-start-date">Ngày bắt đầu làm việc</Label>
                    <Input
                      id="new-start-date"
                      type="date"
                      value={newUser.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                    />
                  </div>
                </div>

                {/* Permissions Preview */}
                <div>
                  <Label>Quyền hạn được cấp</Label>
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                    <div className="flex flex-wrap gap-2">
                      {(roles[newUser.role]?.permissions || []).map((permission) => {
                        if (permission === 'all') {
                          return (
                            <Badge key="all" className="bg-red-100 text-red-800">
                              <Crown size={12} className="mr-1" />
                              Toàn quyền
                            </Badge>
                          );
                        }
                        const permInfo = allPermissions.find(p => p.id === permission);
                        return permInfo ? (
                          <Badge key={permission} variant="secondary">
                            {permInfo.name}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                  className="border-gray-300"
                >
                  Hủy
                </Button>
                <Button
                  onClick={handleCreateUser}
                  className="bg-burgundy-500 hover:bg-burgundy-600"
                >
                  <UserPlus size={16} className="mr-2" />
                  Tạo tài khoản
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách tài khoản</CardTitle>
          <CardDescription>
            Quản lý {users.length} tài khoản trong hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => {
              const RoleIcon = roles[user.role]?.icon || User;
              return (
                <div
                  key={user.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-burgundy-300 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-burgundy-500 rounded-full flex items-center justify-center text-white font-bold">
                        {user.displayName?.charAt(0) || 'U'}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg">{user.displayName}</h3>
                          {getRoleBadge(user.role)}
                          {getStatusBadge(user.status)}
                        </div>
                        
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>📧 {user.email}</p>
                          {user.phone && <p>📞 {user.phone}</p>}
                          <p>📅 Bắt đầu: {formatDate(user.startDate)}</p>
                          {user.lastLogin && <p>🕐 Đăng nhập cuối: {formatDate(user.lastLogin)}</p>}
                        </div>

                        {/* Permissions */}
                        <div className="mt-2">
                          <div className="flex flex-wrap gap-1">
                            {(user.permissions || []).map((permission) => {
                              if (permission === 'all') {
                                return (
                                  <Badge key="all" className="bg-red-100 text-red-800 text-xs">
                                    Toàn quyền
                                  </Badge>
                                );
                              }
                              const permInfo = allPermissions.find(p => p.id === permission);
                              return permInfo ? (
                                <Badge key={permission} variant="secondary" className="text-xs">
                                  {permInfo.name}
                                </Badge>
                              ) : null;
                            })}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleStatus(user.id)}
                        className={user.status === 'active' 
                          ? "border-yellow-500 text-yellow-600 hover:bg-yellow-50" 
                          : "border-green-500 text-green-600 hover:bg-green-50"
                        }
                      >
                        {user.status === 'active' ? 'Tạm khóa' : 'Kích hoạt'}
                      </Button>
                      
                      {user.id !== 'admin-001' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                          className="border-red-500 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={14} />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
