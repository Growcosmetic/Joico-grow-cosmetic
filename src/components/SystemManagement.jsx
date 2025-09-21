import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Users, 
  Activity, 
  Settings, 
  Database, 
  Shield, 
  Clock,
  Trash2,
  Download,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { auth } from '../firebase/config';

const SystemManagement = () => {
  const [loginHistory, setLoginHistory] = useState([]);
  const [systemStats, setSystemStats] = useState({
    totalUsers: 0,
    totalLogins: 0,
    lastBackup: null,
    systemHealth: 'healthy'
  });

  useEffect(() => {
    // Load login history
    const history = JSON.parse(localStorage.getItem('loginHistory') || '[]');
    setLoginHistory(history);
    
    // Calculate system stats
    setSystemStats({
      totalUsers: 1, // Hiện tại chỉ có admin
      totalLogins: history.length,
      lastBackup: new Date().toISOString(),
      systemHealth: 'healthy'
    });
  }, []);

  const clearLoginHistory = () => {
    if (confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử đăng nhập?')) {
      localStorage.removeItem('loginHistory');
      setLoginHistory([]);
      alert('Đã xóa lịch sử đăng nhập!');
    }
  };

  const exportLoginHistory = () => {
    const dataStr = JSON.stringify(loginHistory, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `login_history_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const performBackup = () => {
    // Simulate backup process
    const backupData = {
      customers: JSON.parse(localStorage.getItem('customers') || '[]'),
      appointments: JSON.parse(localStorage.getItem('appointments') || '[]'),
      consultations: JSON.parse(localStorage.getItem('consultationData') || '[]'),
      loginHistory: loginHistory,
      backupTime: new Date().toISOString()
    };

    const dataStr = JSON.stringify(backupData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `salon_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    alert('Backup hệ thống thành công!');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const getHealthBadge = (health) => {
    switch (health) {
      case 'healthy':
        return <Badge className="bg-green-100 text-green-800">Tốt</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800">Cảnh báo</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Lỗi</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Không xác định</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-burgundy-700">Quản lý hệ thống</h2>
          <p className="text-gray-600">Theo dõi và quản lý hoạt động hệ thống</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={performBackup}
            className="bg-blue-500 hover:bg-blue-600"
          >
            <Database size={16} className="mr-2" />
            Backup hệ thống
          </Button>
        </div>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 text-burgundy-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-burgundy-500">{systemStats.totalUsers}</div>
            <div className="text-sm text-gray-600">Người dùng</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Activity className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-500">{systemStats.totalLogins}</div>
            <div className="text-sm text-gray-600">Lần đăng nhập</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Shield className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-lg font-bold">{getHealthBadge(systemStats.systemHealth)}</div>
            <div className="text-sm text-gray-600">Tình trạng hệ thống</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <div className="text-sm font-bold text-orange-500">
              {systemStats.lastBackup ? formatDate(systemStats.lastBackup) : 'Chưa có'}
            </div>
            <div className="text-sm text-gray-600">Backup cuối</div>
          </CardContent>
        </Card>
      </div>

      {/* Login History */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Lịch sử đăng nhập</CardTitle>
              <CardDescription>
                Theo dõi các lần đăng nhập vào hệ thống
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={exportLoginHistory}
                className="border-blue-500 text-blue-500 hover:bg-blue-50"
              >
                <Download size={14} className="mr-1" />
                Xuất
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearLoginHistory}
                className="border-red-500 text-red-500 hover:bg-red-50"
              >
                <Trash2 size={14} className="mr-1" />
                Xóa
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loginHistory.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Chưa có lịch sử đăng nhập</p>
            </div>
          ) : (
            <div className="space-y-3">
              {loginHistory.slice(0, 10).map((login, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 border border-gray-200 rounded-lg hover:border-burgundy-300 transition-colors"
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{login.email}</div>
                    <div className="text-sm text-gray-500">
                      {formatDate(login.loginTime)}
                    </div>
                  </div>
                  <div className="mt-2 sm:mt-0">
                    <Badge variant="secondary" className="text-xs">
                      ID: {login.userId?.slice(-6) || 'Unknown'}
                    </Badge>
                  </div>
                </div>
              ))}
              
              {loginHistory.length > 10 && (
                <div className="text-center py-2 text-gray-500 text-sm">
                  ... và {loginHistory.length - 10} lần đăng nhập khác
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* System Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Cài đặt hệ thống</CardTitle>
          <CardDescription>
            Cấu hình và bảo trì hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Bảo mật</h4>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => alert('Tính năng đổi mật khẩu sẽ được phát triển!')}
                  className="w-full justify-start"
                >
                  <Shield size={14} className="mr-2" />
                  Đổi mật khẩu
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => alert('Tính năng xác thực 2 bước sẽ được phát triển!')}
                  className="w-full justify-start"
                >
                  <Shield size={14} className="mr-2" />
                  Xác thực 2 bước
                </Button>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Dữ liệu</h4>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={performBackup}
                  className="w-full justify-start"
                >
                  <Database size={14} className="mr-2" />
                  Backup dữ liệu
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => alert('Tính năng khôi phục dữ liệu sẽ được phát triển!')}
                  className="w-full justify-start"
                >
                  <RefreshCw size={14} className="mr-2" />
                  Khôi phục dữ liệu
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600 flex items-center gap-2">
            <AlertTriangle size={20} />
            Vùng nguy hiểm
          </CardTitle>
          <CardDescription>
            Các thao tác này có thể ảnh hưởng nghiêm trọng đến hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Button
              variant="outline"
              onClick={() => {
                if (confirm('Bạn có chắc chắn muốn xóa toàn bộ dữ liệu khách hàng? Hành động này không thể hoàn tác!')) {
                  localStorage.removeItem('customers');
                  alert('Đã xóa toàn bộ dữ liệu khách hàng!');
                  window.location.reload();
                }
              }}
              className="border-red-500 text-red-500 hover:bg-red-50"
            >
              <Trash2 size={16} className="mr-2" />
              Xóa toàn bộ dữ liệu khách hàng
            </Button>
            
            <Button
              variant="outline"
              onClick={() => {
                if (confirm('Bạn có chắc chắn muốn reset toàn bộ hệ thống? Hành động này không thể hoàn tác!')) {
                  localStorage.clear();
                  alert('Đã reset toàn bộ hệ thống!');
                  window.location.reload();
                }
              }}
              className="border-red-500 text-red-500 hover:bg-red-50"
            >
              <RefreshCw size={16} className="mr-2" />
              Reset toàn bộ hệ thống
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemManagement;
