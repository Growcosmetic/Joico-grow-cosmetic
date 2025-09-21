import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';

const Login = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      alert('Vui lòng nhập email và mật khẩu!');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      
      // Log login history
      const loginHistory = {
        userId: user.uid,
        email: user.email,
        loginTime: new Date().toISOString(),
        userAgent: navigator.userAgent,
        ip: 'Unknown' // Có thể tích hợp service lấy IP
      };
      
      // Save to localStorage for now (có thể lưu vào Firestore sau)
      const existingHistory = JSON.parse(localStorage.getItem('loginHistory') || '[]');
      existingHistory.unshift(loginHistory);
      localStorage.setItem('loginHistory', JSON.stringify(existingHistory.slice(0, 50))); // Giữ 50 lần cuối
      
      alert('Đăng nhập thành công!');
      onLoginSuccess(user);
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'Đăng nhập thất bại!';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'Không tìm thấy tài khoản với email này!';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Mật khẩu không chính xác!';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Email không hợp lệ!';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Quá nhiều lần thử. Vui lòng thử lại sau!';
          break;
        default:
          errorMessage = `Lỗi: ${error.message}`;
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password || !formData.fullName) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('Mật khẩu xác nhận không khớp!');
      return;
    }

    if (formData.password.length < 6) {
      alert('Mật khẩu phải có ít nhất 6 ký tự!');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      
      // Update user profile
      await user.updateProfile({
        displayName: formData.fullName
      });
      
      alert('Đăng ký thành công!');
      onLoginSuccess(user);
    } catch (error) {
      console.error('Register error:', error);
      let errorMessage = 'Đăng ký thất bại!';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Email này đã được sử dụng!';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Email không hợp lệ!';
          break;
        case 'auth/weak-password':
          errorMessage = 'Mật khẩu quá yếu. Vui lòng chọn mật khẩu mạnh hơn!';
          break;
        default:
          errorMessage = `Lỗi: ${error.message}`;
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-burgundy-50 to-burgundy-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-burgundy-500 rounded-full flex items-center justify-center mb-4">
            <div className="text-white font-bold text-2xl">CT</div>
          </div>
          <CardTitle className="text-2xl text-burgundy-700">
            {isLogin ? 'Đăng nhập' : 'Đăng ký'}
          </CardTitle>
          <CardDescription>
            CHÍ TÂM Hair Salon - Hệ thống quản lý
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-4">
            {!isLogin && (
              <div>
                <Label htmlFor="fullName">Họ và tên</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="Nhập họ và tên"
                  required={!isLogin}
                />
              </div>
            )}
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Nhập email"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="password">Mật khẩu</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Nhập mật khẩu"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            
            {!isLogin && (
              <div>
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="Nhập lại mật khẩu"
                  required={!isLogin}
                />
              </div>
            )}
            
            <Button
              type="submit"
              className="w-full bg-burgundy-500 hover:bg-burgundy-600"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {isLogin ? 'Đang đăng nhập...' : 'Đang đăng ký...'}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {isLogin ? <LogIn size={16} /> : <UserPlus size={16} />}
                  {isLogin ? 'Đăng nhập' : 'Đăng ký'}
                </div>
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-burgundy-500 hover:text-burgundy-600 text-sm underline"
            >
              {isLogin ? 'Chưa có tài khoản? Đăng ký ngay' : 'Đã có tài khoản? Đăng nhập'}
            </button>
          </div>
          
          {isLogin && (
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => alert('Tính năng quên mật khẩu sẽ được phát triển!')}
                className="text-gray-500 hover:text-gray-700 text-sm underline"
              >
                Quên mật khẩu?
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
