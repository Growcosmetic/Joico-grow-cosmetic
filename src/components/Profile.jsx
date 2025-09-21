import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  Edit, 
  Save,
  Camera,
  Key,
  Activity
} from 'lucide-react';

const Profile = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: user?.displayName || 'Admin',
    email: user?.email || 'admin@chitam.salon',
    phone: '0938 987 733',
    role: 'Quản lý salon',
    joinDate: '2025-01-01',
    lastLogin: new Date().toISOString(),
    permissions: ['Quản lý khách hàng', 'Tư vấn', 'Báo cáo', 'Hệ thống'],
    avatar: null
  });
  const [originalData, setOriginalData] = useState({});

  useEffect(() => {
    // Load profile from localStorage
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setProfileData({ ...profileData, ...parsed });
    }
    setOriginalData(profileData);
  }, []);

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem('userProfile', JSON.stringify(profileData));
    setOriginalData(profileData);
    setIsEditing(false);
    alert('Cập nhật hồ sơ thành công!');
  };

  const handleCancel = () => {
    setProfileData(originalData);
    setIsEditing(false);
  };

  const handleChangePassword = () => {
    alert('Tính năng đổi mật khẩu sẽ được tích hợp với Firebase Auth!');
  };

  const handleAvatarChange = () => {
    alert('Tính năng thay đổi avatar sẽ được phát triển!');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-burgundy-700">Quản lý hồ sơ</h2>
          <p className="text-gray-600">Xem và chỉnh sửa thông tin cá nhân</p>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-burgundy-500 hover:bg-burgundy-600"
            >
              <Edit size={16} className="mr-2" />
              Chỉnh sửa
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={handleCancel}
                className="border-gray-300"
              >
                Hủy
              </Button>
              <Button
                onClick={handleSave}
                className="bg-burgundy-500 hover:bg-burgundy-600"
              >
                <Save size={16} className="mr-2" />
                Lưu
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cá nhân</CardTitle>
              <CardDescription>
                Quản lý thông tin tài khoản của bạn
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative">
                    <div className="w-20 h-20 bg-burgundy-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {profileData.displayName?.charAt(0) || 'A'}
                    </div>
                    <button
                      onClick={handleAvatarChange}
                      className="absolute -bottom-1 -right-1 w-7 h-7 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                      <Camera size={12} className="text-gray-600" />
                    </button>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{profileData.displayName}</h3>
                    <p className="text-gray-600">{profileData.role}</p>
                    <Badge className="bg-green-100 text-green-800 mt-1">Đang hoạt động</Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="displayName">Họ và tên</Label>
                    {isEditing ? (
                      <Input
                        id="displayName"
                        value={profileData.displayName}
                        onChange={(e) => handleInputChange('displayName', e.target.value)}
                      />
                    ) : (
                      <p className="text-gray-700 mt-1">{profileData.displayName}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <p className="text-gray-700 mt-1 flex items-center gap-2">
                      <Mail size={16} />
                      {profileData.email}
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="phone">Số điện thoại</Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                      />
                    ) : (
                      <p className="text-gray-700 mt-1">{profileData.phone}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="role">Vai trò</Label>
                    {isEditing ? (
                      <select
                        id="role"
                        value={profileData.role}
                        onChange={(e) => handleInputChange('role', e.target.value)}
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
                      >
                        <option value="Quản lý salon">Quản lý salon</option>
                        <option value="Nhân viên tư vấn">Nhân viên tư vấn</option>
                        <option value="Nhân viên kỹ thuật">Nhân viên kỹ thuật</option>
                        <option value="Thu ngân">Thu ngân</option>
                      </select>
                    ) : (
                      <p className="text-gray-700 mt-1">{profileData.role}</p>
                    )}
                  </div>

                  <div>
                    <Label>Ngày tham gia</Label>
                    <p className="text-gray-700 mt-1 flex items-center gap-2">
                      <Calendar size={16} />
                      {formatDate(profileData.joinDate)}
                    </p>
                  </div>

                  <div>
                    <Label>Đăng nhập cuối</Label>
                    <p className="text-gray-700 mt-1 flex items-center gap-2">
                      <Activity size={16} />
                      {formatDateTime(profileData.lastLogin)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Permissions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quyền hạn</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {profileData.permissions.map((permission, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Shield size={14} className="text-green-500" />
                    <span className="text-sm">{permission}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Bảo mật</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleChangePassword}
                  className="w-full justify-start"
                >
                  <Key size={14} className="mr-2" />
                  Đổi mật khẩu
                </Button>
                
                <div className="text-sm text-gray-600">
                  <p className="font-medium mb-1">Bảo mật tài khoản:</p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Mật khẩu mạnh</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>Chưa bật xác thực 2 bước</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Hoạt động</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Lần đăng nhập:</span>
                  <span className="font-medium">
                    {JSON.parse(localStorage.getItem('loginHistory') || '[]').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Khách hàng tư vấn:</span>
                  <span className="font-medium">
                    {JSON.parse(localStorage.getItem('customers') || '[]').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Trạng thái:</span>
                  <Badge className="bg-green-100 text-green-800">Online</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
