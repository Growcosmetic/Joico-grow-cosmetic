# Hướng Dẫn Quản Lý Sản Phẩm JOICO

## 🎯 **Tổng Quan**

Tính năng quản lý sản phẩm cho phép bạn tự do thêm, sửa, xóa và quản lý tất cả sản phẩm JOICO trong hệ thống tư vấn salon.

## 🚀 **Cách Truy Cập**

1. **Mở hệ thống**: Truy cập http://localhost:5174/
2. **Vào menu**: Nhấn **"Quản lý hệ thống"** trong menu chính
3. **Chọn tab**: Nhấn tab **"Quản lý sản phẩm"**

## 📋 **Các Tính Năng Chính**

### **1. Thêm Sản Phẩm Mới** ➕

1. **Nhấn nút**: "Thêm sản phẩm" (màu xanh)
2. **Điền thông tin**:
   - **Tên sản phẩm** (bắt buộc)
   - **Giá** (bắt buộc) - nhập số tiền VNĐ
   - **Dòng sản phẩm** (ví dụ: DEFY DAMAGE, K-PAK)
   - **Danh mục** (ví dụ: Dầu gội, Dầu xả, Dưỡng tóc)
   - **Dung tích** (ví dụ: 250ml, 500ml)
   - **Mô tả** - mô tả chi tiết sản phẩm
   - **Lợi ích** - lợi ích của sản phẩm
   - **Loại tóc phù hợp** - ai nên dùng
   - **Đánh giá** - từ 1-5 sao
   - **URL hình ảnh** - link ảnh sản phẩm

3. **Chọn nhãn sản phẩm**:
   - ☑️ Bán chạy
   - ☑️ Sản phẩm mới
   - ☑️ Xu hướng
   - ☑️ Khuyến mãi
   - ☑️ Cao cấp

4. **Nhấn**: "Thêm sản phẩm"

### **2. Sửa Sản Phẩm** ✏️

1. **Tìm sản phẩm**: Sử dụng thanh tìm kiếm hoặc lướt danh sách
2. **Nhấn nút**: "Sửa" trên card sản phẩm
3. **Chỉnh sửa thông tin**: Thay đổi bất kỳ thông tin nào
4. **Nhấn**: "Cập nhật sản phẩm"

### **3. Xóa Sản Phẩm** 🗑️

1. **Nhấn nút**: "Xóa" trên card sản phẩm
2. **Xác nhận**: Nhấn "Có, xóa sản phẩm"
3. **Hoàn tất**: Sản phẩm sẽ bị xóa vĩnh viễn

### **4. Tìm Kiếm & Lọc** 🔍

- **Tìm kiếm**: Nhập tên sản phẩm vào ô tìm kiếm
- **Lọc theo nhãn**: Chọn nhãn sản phẩm để lọc
- **Sắp xếp**: Tự động sắp xếp theo thời gian thêm

## 📊 **Tính Năng Excel Import/Export**

### **1. Tạo Template Excel** 📋

1. **Nhấn nút**: "Template Excel" (màu xanh lá)
2. **Tải file**: File Excel mẫu sẽ được tải về
3. **Mở file**: Mở file Excel bằng Microsoft Excel hoặc Google Sheets
4. **Điền dữ liệu**: Điền thông tin sản phẩm theo mẫu
5. **Lưu file**: Lưu file Excel

### **2. Xuất Excel** 📤

1. **Nhấn nút**: "Xuất Excel" (màu xanh dương)
2. **Tải file**: File Excel chứa tất cả sản phẩm hiện có
3. **Backup**: Sử dụng để sao lưu dữ liệu

### **3. Nhập Excel** 📥

1. **Chuẩn bị file**: Đảm bảo file Excel đúng định dạng
2. **Nhấn nút**: "Nhập Excel" (màu cam)
3. **Chọn file**: Chọn file Excel từ máy tính
4. **Xem kết quả**: Hệ thống sẽ báo cáo kết quả nhập

## 📋 **Định Dạng Excel**

### **Cột Bắt Buộc:**
- **A**: Tên sản phẩm
- **B**: Giá (VNĐ) - chỉ nhập số, không có dấu phẩy

### **Cột Tùy Chọn:**
- **C**: Dòng sản phẩm
- **D**: Danh mục
- **E**: Dung tích
- **F**: Mô tả
- **G**: Lợi ích
- **H**: Loại tóc phù hợp
- **I**: Đánh giá (1-5)
- **J**: URL hình ảnh
- **K**: Bán chạy (Có/Không)
- **L**: Sản phẩm mới (Có/Không)
- **M**: Xu hướng (Có/Không)
- **N**: Khuyến mãi (Có/Không)
- **O**: Cao cấp (Có/Không)

## 💡 **Tips Sử Dụng**

### **Thêm Sản Phẩm Hiệu Quả:**
1. **Chuẩn bị thông tin**: Thu thập đầy đủ thông tin trước khi thêm
2. **Sử dụng Excel**: Thêm nhiều sản phẩm cùng lúc bằng Excel
3. **Kiểm tra hình ảnh**: Đảm bảo URL hình ảnh hoạt động
4. **Phân loại rõ ràng**: Sử dụng danh mục và nhãn phù hợp

### **Quản Lý Dữ Liệu:**
1. **Backup thường xuyên**: Xuất Excel định kỳ để backup
2. **Cập nhật giá**: Thay đổi giá sản phẩm khi cần
3. **Xóa sản phẩm cũ**: Loại bỏ sản phẩm không còn bán
4. **Kiểm tra định kỳ**: Rà soát thông tin sản phẩm

## ⚠️ **Lưu Ý Quan Trọng**

### **Dữ Liệu:**
- ✅ Tất cả dữ liệu được lưu trong localStorage
- ✅ Dữ liệu sẽ mất nếu xóa cache trình duyệt
- ✅ Nên backup thường xuyên bằng Excel

### **Hình Ảnh:**
- ✅ Sử dụng URL hình ảnh từ internet
- ✅ Đảm bảo URL hoạt động và ổn định
- ❌ Không hỗ trợ upload file từ máy tính

### **Excel:**
- ✅ Hỗ trợ file .xlsx và .xls
- ✅ Tối đa 1000 sản phẩm mỗi lần nhập
- ❌ Không hỗ trợ file .csv

## 🚨 **Xử Lý Sự Cố**

### **Lỗi Thường Gặp:**

1. **Không thể thêm sản phẩm**:
   - Kiểm tra tên sản phẩm và giá đã điền
   - Đảm bảo giá là số nguyên

2. **Excel không nhập được**:
   - Kiểm tra định dạng file (.xlsx, .xls)
   - Đảm bảo cột A (Tên) và B (Giá) có dữ liệu
   - Kiểm tra file không bị lỗi

3. **Hình ảnh không hiển thị**:
   - Kiểm tra URL hình ảnh
   - Đảm bảo URL bắt đầu bằng http:// hoặc https://

4. **Dữ liệu bị mất**:
   - Khôi phục từ file Excel backup
   - Kiểm tra localStorage trong Developer Tools

### **Liên Hệ Hỗ Trợ:**
- **Email**: hairsalonchitam@gmail.com
- **Hotline**: 0938 987 733

## 🎉 **Kết Luận**

Tính năng quản lý sản phẩm giúp bạn:
- **Tự chủ hoàn toàn** trong việc quản lý sản phẩm
- **Tiết kiệm thời gian** với Excel import/export
- **Chuyên nghiệp hóa** quy trình quản lý
- **Tăng hiệu quả** tư vấn khách hàng

Chúc bạn sử dụng hiệu quả! 🚀