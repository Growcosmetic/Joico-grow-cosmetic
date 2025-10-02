# Hướng Dẫn Quản Lý Sản Phẩm Bằng Excel

## 📋 Tổng Quan

Tính năng Excel giúp bạn quản lý sản phẩm hàng loạt một cách nhanh chóng và hiệu quả:
- **Template Excel**: Tải file mẫu để biết định dạng
- **Xuất Excel**: Backup toàn bộ sản phẩm hiện có
- **Nhập Excel**: Thêm nhiều sản phẩm cùng lúc

## 🚀 Cách Sử Dụng

### 1. Tạo Template Excel
1. Vào **Quản lý hệ thống** → **Quản lý sản phẩm**
2. Nhấn **"Template Excel"**
3. File `template_san_pham_joico.xlsx` sẽ được tải về
4. Mở file và chỉnh sửa theo nhu cầu

### 2. Xuất Sản Phẩm Ra Excel
1. Nhấn **"Xuất Excel"**
2. File `san_pham_joico_[ngày].xlsx` sẽ được tải về
3. Chứa toàn bộ sản phẩm hiện có trong hệ thống

### 3. Nhập Sản Phẩm Từ Excel
1. Nhấn **"Nhập Excel"**
2. Chọn file Excel (.xlsx hoặc .xls)
3. Hệ thống sẽ tự động import và báo kết quả

## 📊 Định Dạng File Excel

### Các Cột Bắt Buộc
| Cột | Mô tả | Ví dụ | Bắt buộc |
|-----|-------|-------|----------|
| Tên sản phẩm | Tên đầy đủ sản phẩm | K-PAK Reconstructing Shampoo | ✅ |
| Giá (VNĐ) | Giá bán bằng VNĐ | 450000 | ✅ |

### Các Cột Tùy Chọn
| Cột | Mô tả | Ví dụ | Ghi chú |
|-----|-------|-------|---------|
| Dòng sản phẩm | Dòng/thương hiệu | K-PAK, Defy Damage | |
| Danh mục | Chăm sóc tóc/Chăm sóc màu | Chăm sóc tóc | |
| Dung tích | Kích thước sản phẩm | 300ml, 150ml | |
| Mô tả | Mô tả chi tiết | Dầu gội phục hồi cấu trúc... | |
| Lợi ích | Lợi ích sản phẩm | Phục hồi tóc hư tổn; Tăng cường độ bền | Phân cách bằng dấu `;` |
| Loại tóc phù hợp | Các loại tóc phù hợp | damaged, chemically_treated, weak | Phân cách bằng dấu `,` |
| Đánh giá | Điểm đánh giá (1-5) | 4.8 | |
| Số đánh giá | Số lượng đánh giá | 1250 | |
| Hình ảnh | URL hình ảnh | https://example.com/image.jpg | |

### Các Cột Nhãn Sản Phẩm
Tất cả sử dụng **"Có"** hoặc **"Không"**:
- Còn hàng
- Bán chạy
- Sản phẩm mới
- Xu hướng
- Yêu thích
- Cần thiết
- Chuyên biệt
- Chuyên nghiệp
- Sắp ra mắt

## 📝 Ví Dụ File Excel

```
Tên sản phẩm          | Dòng sản phẩm | Danh mục      | Giá (VNĐ) | Dung tích | Còn hàng | Bán chạy
K-PAK Shampoo         | K-PAK        | Chăm sóc tóc  | 450000    | 300ml     | Có       | Có
Defy Damage Shampoo   | Defy Damage  | Chăm sóc tóc  | 480000    | 300ml     | Có       | Không
Blonde Life Shampoo   | Blonde Life  | Chăm sóc màu  | 490000    | 300ml     | Có       | Không
```

## ⚠️ Lưu Ý Quan Trọng

### Định Dạng Dữ Liệu
- **Giá**: Chỉ nhập số (VD: 450000, không có dấu phẩy)
- **Danh mục**: Chỉ "Chăm sóc tóc" hoặc "Chăm sóc màu"
- **Nhãn sản phẩm**: Chỉ "Có" hoặc "Không"
- **Lợi ích**: Phân cách bằng dấu `;` (VD: "Lợi ích 1; Lợi ích 2")
- **Loại tóc**: Phân cách bằng dấu `,` (VD: "damaged, dry, weak")

### Loại Tóc Phù Hợp
Sử dụng các giá trị sau:
- `all` - Phù hợp với mọi loại tóc
- `damaged` - Tóc hư tổn
- `dry` - Tóc khô
- `color_treated` - Tóc đã nhuộm
- `chemically_treated` - Tóc qua hóa chất
- `blonde` - Tóc vàng
- `weak` - Tóc yếu
- `coarse` - Tóc thô
- `frizzy` - Tóc xơ rối
- `curly` - Tóc xoăn
- `thin` - Tóc mỏng
- `thick` - Tóc dày

## 🔄 Xử Lý Trùng Lặp

Khi import, nếu có sản phẩm trùng tên:
- Hệ thống sẽ hỏi có muốn cập nhật không
- Chọn **"OK"** để cập nhật thông tin mới
- Chọn **"Cancel"** để bỏ qua

## 📊 Báo Cáo Import

Sau khi import thành công, bạn sẽ thấy:
```
Đã import 15 sản phẩm thành công!
- Sản phẩm mới: 12
- Sản phẩm cập nhật: 3
```

## 🛠️ Xử Lý Sự Cố

### Lỗi Thường Gặp

**"Thiếu tên sản phẩm"**
- Kiểm tra cột "Tên sản phẩm" có trống không
- Đảm bảo tên sản phẩm không bắt đầu bằng dấu cách

**"Giá không hợp lệ"**
- Kiểm tra cột "Giá (VNĐ)" có phải là số không
- Loại bỏ ký tự đặc biệt (dấu phẩy, dấu chấm)

**"File Excel trống"**
- Đảm bảo file có ít nhất 1 dòng dữ liệu (không tính header)
- Kiểm tra sheet đầu tiên có dữ liệu không

### Tips Thành Công

1. **Sử dụng Template**: Luôn tải template trước khi tạo file mới
2. **Kiểm tra dữ liệu**: Đảm bảo tất cả cột bắt buộc đã điền
3. **Backup trước**: Xuất Excel trước khi import để backup
4. **Test với ít dữ liệu**: Thử với 2-3 sản phẩm trước khi import hàng loạt
5. **Định dạng chuẩn**: Sử dụng đúng định dạng "Có/Không" cho các nhãn

## 📈 Quy Trình Khuyến Nghị

### Cho Người Mới
1. Tải **Template Excel**
2. Điền thông tin 2-3 sản phẩm mẫu
3. **Nhập Excel** để test
4. Nếu thành công, tiếp tục với nhiều sản phẩm hơn

### Cho Người Dùng Thường Xuyên
1. **Xuất Excel** để backup dữ liệu hiện tại
2. Chỉnh sửa file Excel (thêm/sửa/xóa)
3. **Nhập Excel** để cập nhật hệ thống
4. Kiểm tra kết quả trên website

## 🎯 Lợi Ích

- ⚡ **Nhanh chóng**: Thêm 100+ sản phẩm trong vài phút
- 📊 **Chính xác**: Giảm lỗi nhập liệu thủ công
- 💾 **Backup**: Dễ dàng sao lưu và khôi phục
- 🔄 **Cập nhật hàng loạt**: Sửa nhiều sản phẩm cùng lúc
- 📈 **Quản lý hiệu quả**: Tối ưu thời gian quản lý

---
*Cập nhật lần cuối: Tháng 1/2025*
