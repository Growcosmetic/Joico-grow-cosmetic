# 📧 Hướng dẫn Setup EmailJS cho CHÍ TÂM Hair Salon

## 🎯 Mục tiêu:
Gửi email tự động cho khách hàng sau khi hoàn thành tư vấn.

## 📋 Các bước setup:

### 1. Đăng ký EmailJS
1. Truy cập: https://www.emailjs.com/
2. Click "Sign Up" và tạo tài khoản free
3. Verify email của bạn

### 2. Tạo Email Service
1. Vào Dashboard → "Email Services"
2. Click "Add New Service"
3. Chọn "Gmail" (hoặc email provider bạn dùng)
4. Nhập thông tin email salon (ví dụ: chitam.salon@gmail.com)
5. Copy **Service ID** (ví dụ: service_abc123)

### 3. Tạo Email Template
1. Vào "Email Templates"
2. Click "Create New Template"
3. **Template cho khách hàng:**

```html
Subject: Cảm ơn {{customer_name}} - CHÍ TÂM Hair Salon

Kính chào {{customer_name}},

Cảm ơn bạn đã đến tư vấn tại CHÍ TÂM Hair Salon ngày {{consultation_date}}.

📋 Thông tin tư vấn:
👤 Họ tên: {{customer_name}}
📞 SĐT: {{customer_phone}}
📅 Ngày tư vấn: {{consultation_date}}

Chúng tôi sẽ liên hệ sớm để hẹn lịch điều trị phù hợp với tình trạng tóc của bạn.

Trân trọng,
CHÍ TÂM Hair Salon
📞 0938 987 733
📍 14-16-18 Lê Thị Riêng, P.Bến Thành, TP.HCM
🌐 Powered by JOICO DEFY DAMAGE Technology
```

4. Save template và copy **Template ID** (ví dụ: template_xyz789)

### 4. Lấy Public Key
1. Vào "Account" → "General"
2. Copy **Public Key** (ví dụ: user_abc123def456)

### 5. Cập nhật Code
Sửa file `src/components/ConsultationForm.jsx` dòng 200:

```javascript
// Thay thế dòng này:
// await emailjs.send('service_id', 'template_id', emailData, 'public_key');

// Bằng thông tin thật của bạn:
await emailjs.send('service_abc123', 'template_xyz789', emailData, 'user_abc123def456');
```

### 6. Test Email
1. Điền form tư vấn với email thật
2. Bấm "Lưu & Gửi Email"
3. Kiểm tra hộp thư của khách hàng

## 🎯 Kết quả:
- ✅ Khách hàng nhận email cảm ơn với thông tin tư vấn
- ✅ Salon có record email đã gửi
- ✅ Tăng tính chuyên nghiệp

## 💰 Chi phí:
- **Free tier**: 200 emails/tháng
- **Paid plans**: Từ $15/tháng cho unlimited

## 🔧 Lưu ý:
- Setup một lần, sử dụng mãi mãi
- Email template có thể tùy chỉnh
- Có thể gửi email cho cả khách hàng và salon
