import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Package, Plus, Search, Edit, Trash2, Download, Upload, FileSpreadsheet } from 'lucide-react';
import initializeJOICOProducts from '../utils/initializeProducts';
import * as XLSX from 'xlsx';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    inStock: true
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    const savedProducts = localStorage.getItem('managedProducts');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      // Khởi tạo danh sách sản phẩm JOICO mặc định
      const defaultProducts = initializeJOICOProducts();
      setProducts(defaultProducts);
      saveProducts(defaultProducts);
    }
  };

  const saveProducts = (productsToSave) => {
    localStorage.setItem('managedProducts', JSON.stringify(productsToSave));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price) {
      alert('Vui lòng điền tên sản phẩm và giá!');
      return;
    }

    const newProduct = {
      id: Date.now().toString(),
      ...formData,
      price: parseFloat(formData.price),
      createdAt: new Date().toISOString()
    };

    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);
    saveProducts(updatedProducts);
    
    setFormData({ name: '', price: '', category: '', description: '', inStock: true });
    setShowAddForm(false);
  };

  const handleDelete = (productId) => {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      const updatedProducts = products.filter(p => p.id !== productId);
      setProducts(updatedProducts);
      saveProducts(updatedProducts);
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(products.map(product => ({
      'Tên sản phẩm': product.name,
      'Giá (VNĐ)': product.price,
      'Danh mục': product.category || '',
      'Mô tả': product.description || '',
      'Tồn kho': product.inStock ? 'Có' : 'Không'
    })));
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sản phẩm');
    
    const fileName = `san_pham_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const importFromExcel = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const importedProducts = jsonData.map((row, index) => ({
          id: `imported_${Date.now()}_${index}`,
          name: row['Tên sản phẩm'] || '',
          price: parseFloat(row['Giá (VNĐ)']) || 0,
          category: row['Danh mục'] || '',
          description: row['Mô tả'] || '',
          inStock: row['Tồn kho'] === 'Có',
          createdAt: new Date().toISOString()
        }));

        const updatedProducts = [...products, ...importedProducts];
        setProducts(updatedProducts);
        saveProducts(updatedProducts);
        
        alert(`Đã import thành công ${importedProducts.length} sản phẩm!`);
      } catch (error) {
        alert('Có lỗi khi import file Excel!');
      }
      event.target.value = '';
    };
    reader.readAsArrayBuffer(file);
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-burgundy-700 flex items-center gap-2">
            <Package className="w-6 h-6" />
            Quản lý sản phẩm
          </h2>
          <p className="text-gray-600">Quản lý danh mục sản phẩm JOICO</p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-burgundy-500 hover:bg-burgundy-600"
        >
          <Plus size={16} className="mr-2" />
          Thêm sản phẩm
        </Button>
      </div>

      {/* Excel Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5" />
            Quản lý Excel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button
              onClick={exportToExcel}
              variant="outline"
              className="border-green-500 text-green-500 hover:bg-green-50"
            >
              <Download size={16} className="mr-2" />
              Xuất Excel
            </Button>
            
            <div className="relative">
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={importFromExcel}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button
                variant="outline"
                className="border-purple-500 text-purple-500 hover:bg-purple-50"
              >
                <Upload size={16} className="mr-2" />
                Nhập Excel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Add Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Thêm sản phẩm mới</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Tên sản phẩm *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="price">Giá (VNĐ) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Danh mục</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Mô tả</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="bg-burgundy-500 hover:bg-burgundy-600">
                  Thêm sản phẩm
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                >
                  Hủy
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Products List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-gray-900">{product.name}</h3>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(product.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-burgundy-500">
                    {product.price?.toLocaleString('vi-VN')} VNĐ
                  </span>
                  {!product.inStock && (
                    <Badge variant="destructive">Hết hàng</Badge>
                  )}
                </div>
                
                {product.category && (
                  <Badge variant="secondary">{product.category}</Badge>
                )}
                
                {product.description && (
                  <p className="text-sm text-gray-600">{product.description}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'Không tìm thấy sản phẩm' : 'Chưa có sản phẩm nào'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ? 'Hãy thử thay đổi từ khóa tìm kiếm' : 'Hãy thêm sản phẩm đầu tiên của bạn'}
            </p>
            {!searchTerm && (
              <Button
                onClick={() => setShowAddForm(true)}
                className="bg-burgundy-500 hover:bg-burgundy-600"
              >
                <Plus size={16} className="mr-2" />
                Thêm sản phẩm đầu tiên
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProductManagement;