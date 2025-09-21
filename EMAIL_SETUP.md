# 📧 Hướng dẫn setup Email tự động cho CHÍ TÂM Hair Salon

## 🚀 Tính năng Email
Sau khi hoàn thành tư vấn khách hàng, hệ thống sẽ tự động gửi:
- **Email cho khách hàng**: Cảm ơn và tóm tắt kết quả tư vấn
- **Email cho salon**: Thông tin chi tiết khách hàng mới và kết quả tư vấn

## 📋 Bước 1: Đăng ký EmailJS
1. Truy cập [https://www.emailjs.com/](https://www.emailjs.com/)
2. Đăng ký tài khoản miễn phí
3. Verify email và đăng nhập

## ⚙️ Bước 2: Tạo Email Service
1. Vào **Email Services** → **Add New Service**
2. Chọn **Gmail** (hoặc email provider bạn muốn)
3. Đăng nhập Gmail của salon
4. Copy **Service ID** (ví dụ: `service_abc123`)

## 📝 Bước 3: Tạo Email Templates

### Template 1: Cho khách hàng
**Template ID**: `template_customer`

**Subject**: `Cảm ơn {{customer_name}} - Kết quả tư vấn từ CHÍ TÂM Hair Salon`

**Content**:
```
Kính chào {{customer_name}},

Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ tư vấn tại CHÍ TÂM Hair Salon!

📋 THÔNG TIN TƯ VẤN ({{consultation_date}})
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 Thông tin khách hàng:
- Họ tên: {{customer_name}}
- Điện thoại: {{customer_phone}}
- Email: {{customer_email}}

🎯 Mục tiêu chăm sóc tóc:
{{hair_goals}}

🔍 Tình trạng tóc hiện tại:
{{hair_condition}}

💡 Kỳ vọng của bạn:
- Hôm nay: {{expectations_today}}
- Sau 2 tuần: {{expectations_two_weeks}}  
- Sau 1 tháng: {{expectations_one_month}}

🗓️ Lịch hẹn tiếp theo: {{next_appointment}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 CHÍ TÂM Hair Salon
📞 Hotline: {{salon_phone}}
🏠 Địa chỉ: {{salon_address}}

💜 Powered by JOICO DEFY DAMAGE Technology

Trân trọng,
Đội ngũ CHÍ TÂM Hair Salon
```

### Template 2: Cho salon
**Template ID**: `template_salon`

**Subject**: `🔔 Khách hàng mới: {{customer_name}} - {{consultation_date}}`

**Content**:
```
THÔNG BÁO KHÁCH HÀNG MỚI

📋 THÔNG TIN KHÁCH HÀNG
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 Họ tên: {{customer_name}}
📞 Điện thoại: {{customer_phone}}
📧 Email: {{customer_email}}
🎂 Ngày sinh: {{customer_birthday}}
⚥ Giới tính: {{customer_gender}}
🕐 Thời gian tư vấn: {{consultation_date}} {{consultation_time}}

🔍 CHẨN ĐOÁN TÓC
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Độ đàn hồi: {{hair_elasticity}}
• Độ xốp: {{hair_porosity}}
• Độ bền: {{hair_strength}}

💭 THÔNG TIN TƯ VẤN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 Mục tiêu: {{hair_goals}}
⚡ Sử dụng nhiệt: {{heat_usage}}
🔍 Vấn đề hiện tại: {{current_issues}}
📋 Liệu trình đã làm: {{previous_treatments}}

📈 KỲ VỌNG KHÁCH HÀNG
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Hôm nay: {{expectations_today}}
• Sau 2 tuần: {{expectations_two_weeks}}
• Sau 1 tháng: {{expectations_one_month}}

💊 LIỆU TRÌNH ĐỀ XUẤT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔥 Ưu tiên: {{priority_treatments}}
📅 Dài hạn: {{longterm_treatments}}

📊 HỘ CHIẾU TÓC
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Dịch vụ đã sử dụng: {{services_used}}
📈 % Cải thiện: {{improvement_percentage}}
🏠 Chăm sóc tại nhà: {{home_care_plan}}
📅 Lịch hẹn tiếp theo: {{next_appointment}}

Vui lòng liên hệ khách hàng để xác nhận lịch hẹn!
```

## 🔑 Bước 4: Lấy thông tin cấu hình
1. Vào **Account** → **General** → Copy **Public Key**
2. Vào **Email Templates** → Copy **Template ID** của 2 templates

## 📝 Bước 5: Cập nhật cấu hình
Cập nhật file `src/services/emailService.js`:
```javascript
const EMAILJS_CONFIG = {
  SERVICE_ID: 'your_service_id_here',
  TEMPLATE_ID_CUSTOMER: 'template_customer',
  TEMPLATE_ID_SALON: 'template_salon', 
  PUBLIC_KEY: 'your_public_key_here'
};
```

## ✅ Tính năng hoàn chỉnh
- Tự động gửi email sau khi lưu tư vấn
- Template email đẹp với đầy đủ thông tin
- Gửi cho cả khách hàng và salon
- Thông báo trạng thái gửi email
- Hoạt động ngay cả khi không có email khách hàng
