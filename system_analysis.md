# Phân Tích Yêu Cầu Hệ Thống - Chí Tâm Hair Salon

## Thông Tin Dự Án
- **Tên salon**: Chí Tâm Hair Salon
- **Sản phẩm chính**: JOICO DEFY DAMAGE
- **Màu sắc chủ đạo**: Tím burgundy (#722F37)
- **Mục tiêu**: Tạo trang web tư vấn và lưu trữ thông tin khách hàng

## Phân Tích Biểu Mẫu

### 1. Questionnaire (Hiểu Vấn Đề Của Khách Hàng)
**Thông tin cơ bản:**
- Tóc đã trải qua các dịch vụ (uốn, duỗi, nhuộm, tẩy, nối tóc...)
- Tần suất sử dụng nhiệt (máy sấy, máy duỗi, máy kẹp): 4 lần, 3 lần, 2 lần, 0
- Mục tiêu sau khi dưỡng/tái tạo tóc: Bóng mượt, Chắc khỏe, Giữ màu nhuộm lâu, Dễ vào nếp, Phục hồi hư tổn

**Home Care (Sản phẩm chăm sóc tại nhà):**
- Bảng theo dõi sử dụng sản phẩm: Dầu gội, Gội xả, Dưỡng, Thêm

**Vấn đề thấy/cảm nhận từ khách hàng:**
- Khô xơ vs Mất độ bóng vs Nhanh phai
- Chẻ ngọn vs Rụng tóc vs Đứt

**Mong muốn của khách:**
- Hôm nay
- Sau 2 tuần
- Sau 1 tháng

### 2. Hair Diagnosis (Chẩn Đoán)
- Kiểm tra độ đàn hồi của tóc: Tốt, Trung bình, Yếu
- Quan sát bằng mắt: Xơ rối, Bóng, Bề mặt biểu bì (Cao, Trung bình, Kém)
- Porosity Test (độ ẩm): Tốt, Trung bình, Yếu
- Strength (độ chắc): Tốt, Trung bình, Yếu

### 3. Salon Treatment (Phương Pháp Điều Trị)
- Bảng ưu tiên điều trị với 3 mức độ
- Bảng dài hạn với 3 mức độ
- Các cột: Vấn đề cần giải quyết, Dưỡng chất cần bổ sung, Dịch vụ phù hợp, Giá

### 4. Hair Passport (Hộ Chiếu Tóc)
- Dịch vụ sử dụng
- Kết quả sau dịch vụ tại salon (20%, 40%, 70%, 100%)
- Phát đồ điều trị/chăm sóc tại nhà
- Lịch hẹn kế tiếp

## Yêu Cầu Chức Năng

### Frontend
1. **Trang chủ**: Giới thiệu salon, dịch vụ
2. **Form tư vấn**: 4 bước như trong biểu mẫu
3. **Quản lý khách hàng**: Xem lịch sử, cập nhật thông tin
4. **Đặt lịch hẹn**: Tích hợp calendar
5. **Responsive design**: Tương thích mobile

### Backend
1. **Database**: Lưu trữ thông tin khách hàng, lịch sử điều trị
2. **API**: CRUD operations cho khách hàng và dịch vụ
3. **Authentication**: Đăng nhập cho staff
4. **Export**: Xuất báo cáo PDF

### Thiết Kế
1. **Màu sắc**: Tím burgundy (#722F37) làm chủ đạo
2. **Typography**: Font hiện đại, dễ đọc
3. **Layout**: Clean, professional
4. **Branding**: Logo JOICO, tên salon

## Công Nghệ Sử Dụng
- **Frontend**: React.js với responsive design
- **Backend**: Flask (Python)
- **Database**: SQLite (có thể nâng cấp PostgreSQL)
- **Styling**: CSS3 với Flexbox/Grid
- **Deployment**: Vercel/Netlify cho frontend, Railway/Heroku cho backend
