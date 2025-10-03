import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { joicoProducts, getProductsByCategory } from '../data/joicoProducts';
import { 
  Check, 
  Package, 
  Palette, 
  ShoppingCart,
  Info,
  X,
  RefreshCw
} from 'lucide-react';

const TreatmentPlan = ({ onSave, initialSelectedProducts = [] }) => {
  const [selectedProducts, setSelectedProducts] = useState(initialSelectedProducts);
  const [activeCategory, setActiveCategory] = useState('hairCare');
  const [showProductDetails, setShowProductDetails] = useState(null);
  const [managedProducts, setManagedProducts] = useState([]);

  // Load products from localStorage (managed products)
  useEffect(() => {
    const loadManagedProducts = () => {
      const savedProducts = localStorage.getItem('managedProducts');
      if (savedProducts) {
        setManagedProducts(JSON.parse(savedProducts));
      } else {
        // Fallback to default products if no managed products
        const allProducts = [...joicoProducts.hairCare, ...joicoProducts.colorCare];
        setManagedProducts(allProducts);
      }
    };
    
    loadManagedProducts();
  }, []);

  // Get products by category from managed products
  const getManagedProductsByCategory = (category) => {
    return managedProducts.filter(product => {
      if (category === 'hairCare') {
        return product.category === 'Hair Care' || product.line?.toLowerCase().includes('hair');
      } else if (category === 'colorCare') {
        return product.category === 'Color Care' || product.line?.toLowerCase().includes('color');
      }
      return true;
    });
  };

  // Refresh products from localStorage
  const refreshProducts = () => {
    const savedProducts = localStorage.getItem('managedProducts');
    if (savedProducts) {
      setManagedProducts(JSON.parse(savedProducts));
    }
  };

  // Toggle product selection
  const toggleProduct = (productId) => {
    setSelectedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  // Get selected products data
  const getSelectedProductsData = () => {
    return selectedProducts.map(id => managedProducts.find(product => product.id === id));
  };

  // Calculate total price
  const calculateTotalPrice = () => {
    const selectedData = getSelectedProductsData();
    return selectedData.reduce((total, product) => {
      return total + (product.price || 0);
    }, 0);
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  // Render product card
  const renderProductCard = (product) => {
    const isSelected = selectedProducts.includes(product.id);
    
    return (
      <Card 
        key={product.id} 
        className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
          isSelected ? 'ring-2 ring-burgundy-500 bg-burgundy-50' : 'hover:shadow-md'
        }`}
        onClick={() => toggleProduct(product.id)}
      >
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Checkbox 
                checked={isSelected}
                onChange={() => toggleProduct(product.id)}
                className="absolute -top-2 -left-2 z-10"
              />
              <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center">
                {product.image ? (
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                ) : (
                  <Package className="w-8 h-8 text-gray-600" />
                )}
              </div>
            </div>
            
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">{product.name}</h4>
              <p className="text-sm text-gray-600">{product.category || product.line}</p>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {formatPrice(product.price)}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowProductDetails(product);
                  }}
                  className="h-6 px-2 text-xs"
                >
                  <Info className="w-3 h-3 mr-1" />
                  Chi tiết
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Render product details modal
  const renderProductDetails = () => {
    if (!showProductDetails) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">{showProductDetails.name}</CardTitle>
                <CardDescription>{showProductDetails.category}</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowProductDetails(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {showProductDetails.benefits && showProductDetails.benefits.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Lợi ích sản phẩm:</h4>
                  <ul className="space-y-1">
                    {showProductDetails.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {showProductDetails.description && (
                <div>
                  <h4 className="font-semibold mb-2">Mô tả sản phẩm:</h4>
                  <p className="text-sm text-gray-600">{showProductDetails.description}</p>
                </div>
              )}
              
              <div>
                <h4 className="font-semibold mb-2">Thông tin sản phẩm:</h4>
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-medium">Giá bán</p>
                    <p className="text-lg font-bold text-burgundy-600">
                      {formatPrice(showProductDetails.price)}
                    </p>
                  </div>
                  {showProductDetails.volume && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm font-medium">Dung tích</p>
                      <p className="text-lg font-bold text-gray-700">
                        {showProductDetails.volume}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-4 mb-2">
          <h2 className="text-2xl font-bold text-gray-900">Kế hoạch điều trị</h2>
          <Button
            onClick={refreshProducts}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Làm mới
          </Button>
        </div>
        <p className="text-gray-600">
          Chọn sản phẩm phù hợp cho khách hàng 
          <span className="text-burgundy-600 font-medium ml-2">
            ({getManagedProductsByCategory(activeCategory).length} sản phẩm)
          </span>
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex space-x-2 justify-center">
        <Button
          variant={activeCategory === 'hairCare' ? 'default' : 'outline'}
          onClick={() => setActiveCategory('hairCare')}
          className="flex items-center space-x-2"
        >
          <Package className="w-4 h-4" />
          <span>Chăm sóc tóc</span>
        </Button>
        <Button
          variant={activeCategory === 'colorCare' ? 'default' : 'outline'}
          onClick={() => setActiveCategory('colorCare')}
          className="flex items-center space-x-2"
        >
          <Palette className="w-4 h-4" />
          <span>Chăm sóc màu</span>
        </Button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {getManagedProductsByCategory(activeCategory).map(renderProductCard)}
      </div>

      {/* Selected Products Summary */}
      {selectedProducts.length > 0 && (
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center space-x-2">
              <ShoppingCart className="w-5 h-5" />
              <span>Sản phẩm đã chọn ({selectedProducts.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {getSelectedProductsData().map(product => (
                <div key={product.id} className="flex justify-between items-center bg-white p-2 rounded">
                  <span className="font-medium">{product.name}</span>
                  <span className="text-burgundy-600 font-bold">
                    {formatPrice(product.price)}
                  </span>
                </div>
              ))}
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Tổng cộng:</span>
                  <span className="text-burgundy-600">
                    {formatPrice(calculateTotalPrice())}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-2">
        <Button
          variant="outline"
          onClick={() => setSelectedProducts([])}
          disabled={selectedProducts.length === 0}
        >
          Xóa tất cả
        </Button>
        <Button
          onClick={() => onSave(selectedProducts)}
          className="bg-burgundy-500 hover:bg-burgundy-600"
        >
          Lưu kế hoạch điều trị
        </Button>
      </div>

      {/* Product Details Modal */}
      {renderProductDetails()}
    </div>
  );
};

export default TreatmentPlan;
