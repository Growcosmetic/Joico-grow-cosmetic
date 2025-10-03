import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import initializeJOICOProducts from '../utils/initializeProducts';
import { 
  ShoppingCart, 
  Star, 
  Heart,
  Search,
  Filter,
  Package,
  Sparkles,
  Droplets,
  Shield,
  Zap,
  Award,
  TrendingUp,
  Users,
  CheckCircle,
  Plus,
  Minus,
  Eye,
  Share2,
  RefreshCw
} from 'lucide-react';

const ProductRecommendation = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedHairType, setSelectedHairType] = useState('all');
  const [showCart, setShowCart] = useState(false);

  // Load products from localStorage (managed products)
  useEffect(() => {
    const loadManagedProducts = () => {
      const savedProducts = localStorage.getItem('managedProducts');
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts));
      } else {
        // Khởi tạo danh sách sản phẩm JOICO mặc định
        const defaultProducts = initializeJOICOProducts();
        setProducts(defaultProducts);
      }
    };
    
    loadManagedProducts();
  }, []);

  // Refresh products from localStorage
  const refreshProducts = () => {
    const savedProducts = localStorage.getItem('managedProducts');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(joicoProducts);
    }
  };

  // Database sản phẩm JOICO (fallback)
  const joicoProducts = [
    {
      id: 'kpak-shampoo',
      name: 'K-PAK Reconstructing Shampoo',
      category: 'shampoo',
      line: 'K-PAK',
      price: 450000,
      size: '300ml',
      description: 'Dầu gội phục hồi cấu trúc tóc hư tổn với Keratin và Arginine',
      benefits: ['Phục hồi tóc hư tổn', 'Tăng cường độ bền', 'Làm mềm tóc'],
      hairTypes: ['damaged', 'chemically_treated', 'weak'],
      severity: ['moderate', 'severe'],
      ingredients: ['Keratin', 'Arginine', 'Peptides'],
      rating: 4.8,
      reviews: 1250,
      image: '/images/kpak-shampoo.jpg',
      inStock: true,
      bestseller: true,
      professional: true
    },
    {
      id: 'kpak-reconstructor',
      name: 'K-PAK Deep Penetrating Reconstructor',
      category: 'treatment',
      line: 'K-PAK',
      price: 680000,
      size: '150ml',
      description: 'Kem ủ phục hồi sâu với công nghệ Quadramine Complex',
      benefits: ['Phục hồi sâu', 'Tăng độ đàn hồi', 'Ngăn gãy rụng'],
      hairTypes: ['damaged', 'chemically_treated', 'brittle'],
      severity: ['severe', 'extreme'],
      ingredients: ['Quadramine Complex', 'Keratin', 'Amino Acids'],
      rating: 4.9,
      reviews: 890,
      image: '/images/kpak-reconstructor.jpg',
      inStock: true,
      professional: true,
      award: 'Best Treatment 2024'
    },
    {
      id: 'moisture-recovery-shampoo',
      name: 'Moisture Recovery Shampoo',
      category: 'shampoo',
      line: 'Moisture Recovery',
      price: 420000,
      size: '300ml',
      description: 'Dầu gội cấp ẩm cho tóc khô với Hydramine Sea Complex',
      benefits: ['Cấp ẩm sâu', 'Làm mềm tóc', 'Tăng độ bóng'],
      hairTypes: ['dry', 'coarse', 'frizzy'],
      severity: ['mild', 'moderate'],
      ingredients: ['Hydramine Sea Complex', 'Murumuru Butter', 'Sea Kelp'],
      rating: 4.7,
      reviews: 1100,
      image: '/images/moisture-recovery-shampoo.jpg',
      inStock: true,
      trending: true
    },
    {
      id: 'defy-damage-shampoo',
      name: 'Defy Damage Protective Shampoo',
      category: 'shampoo',
      line: 'Defy Damage',
      price: 480000,
      size: '300ml',
      description: 'Dầu gội bảo vệ khỏi tổn thương với Moringa Oil và Arginine',
      benefits: ['Bảo vệ khỏi tổn thương', 'Chống oxy hóa', 'Tăng cường bảo vệ'],
      hairTypes: ['all', 'color_treated', 'heat_styled'],
      severity: ['prevention', 'mild'],
      ingredients: ['Moringa Oil', 'Arginine', 'Antioxidants'],
      rating: 4.6,
      reviews: 950,
      image: '/images/defy-damage-shampoo.jpg',
      inStock: true,
      newProduct: true
    },
    {
      id: 'color-intensity-shampoo',
      name: 'Color Intensity Care Shampoo',
      category: 'shampoo',
      line: 'Color Intensity',
      price: 460000,
      size: '300ml',
      description: 'Dầu gội bảo vệ màu nhuộm với Multi-Spectrum Defense Complex',
      benefits: ['Bảo vệ màu nhuộm', 'Tăng độ bền màu', 'Làm sáng màu'],
      hairTypes: ['color_treated', 'highlighted', 'bleached'],
      severity: ['mild', 'moderate'],
      ingredients: ['Multi-Spectrum Defense', 'UV Filters', 'Antioxidants'],
      rating: 4.5,
      reviews: 780,
      image: '/images/color-intensity-shampoo.jpg',
      inStock: false,
      comingSoon: true
    },
    {
      id: 'kpak-leave-in',
      name: 'K-PAK Leave-In Protectant',
      category: 'leave_in',
      line: 'K-PAK',
      price: 520000,
      size: '200ml',
      description: 'Xịt dưỡng không cần rửa với bảo vệ nhiệt đến 230°C',
      benefits: ['Bảo vệ nhiệt', 'Phục hồi tức thì', 'Không làm nặng tóc'],
      hairTypes: ['damaged', 'heat_styled', 'chemically_treated'],
      severity: ['mild', 'moderate', 'severe'],
      ingredients: ['Keratin', 'Thermal Protection', 'Conditioning Agents'],
      rating: 4.7,
      reviews: 650,
      image: '/images/kpak-leave-in.jpg',
      inStock: true,
      essential: true
    },
    {
      id: 'moisture-recovery-mask',
      name: 'Moisture Recovery Treatment Balm',
      category: 'treatment',
      line: 'Moisture Recovery',
      price: 590000,
      size: '250ml',
      description: 'Kem ủ cấp ẩm chuyên sâu cho tóc khô và xơ rối',
      benefits: ['Cấp ẩm chuyên sâu', 'Phục hồi độ mềm mại', 'Giảm xơ rối'],
      hairTypes: ['dry', 'coarse', 'frizzy', 'curly'],
      severity: ['moderate', 'severe'],
      ingredients: ['Hydramine Sea Complex', 'Murumuru Butter', 'Coconut Oil'],
      rating: 4.8,
      reviews: 720,
      image: '/images/moisture-recovery-mask.jpg',
      inStock: true,
      customerChoice: true
    },
    {
      id: 'blonde-life-shampoo',
      name: 'Blonde Life Brightening Shampoo',
      category: 'shampoo',
      line: 'Blonde Life',
      price: 490000,
      size: '300ml',
      description: 'Dầu gội làm sáng tóc vàng với Tamanu Oil và Monoi Oil',
      benefits: ['Làm sáng tóc vàng', 'Loại bỏ tông vàng', 'Nuôi dưỡng tóc'],
      hairTypes: ['blonde', 'highlighted', 'gray'],
      severity: ['mild', 'moderate'],
      ingredients: ['Tamanu Oil', 'Monoi Oil', 'Purple Pigments'],
      rating: 4.6,
      reviews: 580,
      image: '/images/blonde-life-shampoo.jpg',
      inStock: true,
      specialized: true
    }
  ];

  // Categories và hair types
  const categories = [
    { id: 'all', name: 'Tất cả', icon: <Package className="w-4 h-4" /> },
    { id: 'shampoo', name: 'Dầu gội', icon: <Droplets className="w-4 h-4" /> },
    { id: 'treatment', name: 'Kem ủ', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'leave_in', name: 'Leave-in', icon: <Shield className="w-4 h-4" /> }
  ];

  const hairTypes = [
    { id: 'all', name: 'Tất cả loại tóc' },
    { id: 'damaged', name: 'Tóc hư tổn' },
    { id: 'dry', name: 'Tóc khô' },
    { id: 'color_treated', name: 'Tóc nhuộm' },
    { id: 'chemically_treated', name: 'Tóc hóa chất' },
    { id: 'blonde', name: 'Tóc vàng' },
    { id: 'weak', name: 'Tóc yếu' }
  ];

  useEffect(() => {
    setProducts(joicoProducts);
    setFilteredProducts(joicoProducts);
    loadCart();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, selectedCategory, selectedHairType, products]);

  const loadCart = () => {
    const savedCart = localStorage.getItem('joicoCart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  };

  const saveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem('joicoCart', JSON.stringify(newCart));
  };

  const filterProducts = () => {
    let filtered = products;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.benefits.some(benefit => 
          benefit.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by hair type
    if (selectedHairType !== 'all') {
      filtered = filtered.filter(product => 
        product.hairTypes.includes(selectedHairType) || 
        product.hairTypes.includes('all')
      );
    }

    setFilteredProducts(filtered);
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    let newCart;

    if (existingItem) {
      newCart = cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      newCart = [...cart, { ...product, quantity: 1 }];
    }

    saveCart(newCart);
    alert(`Đã thêm ${product.name} vào giỏ hàng!`);
  };

  const removeFromCart = (productId) => {
    const newCart = cart.filter(item => item.id !== productId);
    saveCart(newCart);
  };

  const updateQuantity = (productId, change) => {
    const newCart = cart.map(item => {
      if (item.id === productId) {
        const newQuantity = Math.max(0, item.quantity + change);
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
      }
      return item;
    }).filter(Boolean);

    saveCart(newCart);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getRecommendationBadge = (product) => {
    if (product.bestseller) return <Badge className="bg-yellow-100 text-yellow-600">Bán chạy</Badge>;
    if (product.newProduct) return <Badge className="bg-green-100 text-green-600">Mới</Badge>;
    if (product.trending) return <Badge className="bg-blue-100 text-blue-600">Xu hướng</Badge>;
    if (product.customerChoice) return <Badge className="bg-purple-100 text-purple-600">Yêu thích</Badge>;
    if (product.essential) return <Badge className="bg-red-100 text-red-600">Cần thiết</Badge>;
    if (product.specialized) return <Badge className="bg-indigo-100 text-indigo-600">Chuyên biệt</Badge>;
    return null;
  };

  const getSmartRecommendations = () => {
    // Lấy dữ liệu từ Quiz và Hair Passport
    const quizResults = JSON.parse(localStorage.getItem('quizAnalysis') || 'null');
    const hairPassport = JSON.parse(localStorage.getItem('hairPassport') || 'null');

    if (!quizResults) return [];

    const recommendations = [];
    
    // Dựa trên vấn đề chính từ Quiz
    if (quizResults.primaryProblem === 'damage') {
      recommendations.push(
        products.find(p => p.id === 'kpak-shampoo'),
        products.find(p => p.id === 'kpak-reconstructor'),
        products.find(p => p.id === 'kpak-leave-in')
      );
    } else if (quizResults.primaryProblem === 'dryness') {
      recommendations.push(
        products.find(p => p.id === 'moisture-recovery-shampoo'),
        products.find(p => p.id === 'moisture-recovery-mask')
      );
    }

    // Thêm sản phẩm bảo vệ chung
    recommendations.push(products.find(p => p.id === 'defy-damage-shampoo'));

    return recommendations.filter(Boolean);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-burgundy-700">
            Gợi Ý Sản Phẩm JOICO
          </h1>
          <p className="text-gray-600 mt-2">
            Sản phẩm chăm sóc tóc chuyên nghiệp được cá nhân hóa
            <span className="text-burgundy-600 font-medium ml-2">
              ({products.length} sản phẩm)
            </span>
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={refreshProducts}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Làm mới
          </Button>
          <Button 
            onClick={() => setShowCart(!showCart)}
            className="bg-burgundy-500 hover:bg-burgundy-600 relative"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
          Giỏ hàng ({cart.length})
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          )}
        </Button>
      </div>

      {/* Smart Recommendations */}
      {getSmartRecommendations().length > 0 && (
        <Card className="border-2 border-burgundy-200 bg-burgundy-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-burgundy-700">
              <Sparkles className="w-5 h-5" />
              Gợi Ý Dành Riêng Cho Bạn
            </CardTitle>
            <CardDescription>
              Dựa trên kết quả chẩn đoán tóc của bạn
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {getSmartRecommendations().slice(0, 3).map((product) => (
                <div key={product.id} className="bg-white p-4 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-4 h-4 text-burgundy-500" />
                    <span className="font-semibold text-sm">{product.name}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-burgundy-600">
                      {formatPrice(product.price)}
                    </span>
                    <Button 
                      size="sm"
                      onClick={() => addToCart(product)}
                      className="bg-burgundy-500 hover:bg-burgundy-600"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Thêm
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="p-2 border border-gray-300 rounded-md"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            {/* Hair Type Filter */}
            <select
              value={selectedHairType}
              onChange={(e) => setSelectedHairType(e.target.value)}
              className="p-2 border border-gray-300 rounded-md"
            >
              {hairTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <div className="h-48 bg-gradient-to-br from-burgundy-100 to-burgundy-200 flex items-center justify-center">
                <Package className="w-16 h-16 text-burgundy-400" />
              </div>
              
              {/* Badges */}
              <div className="absolute top-2 left-2 space-y-1">
                {getRecommendationBadge(product)}
                {product.professional && (
                  <Badge className="bg-black text-white block">Professional</Badge>
                )}
              </div>

              {/* Stock Status */}
              <div className="absolute top-2 right-2">
                {product.inStock ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <Badge className="bg-red-100 text-red-600">Hết hàng</Badge>
                )}
              </div>
            </div>

            <CardContent className="p-4">
              <div className="mb-2">
                <Badge variant="outline" className="text-xs">
                  {product.line}
                </Badge>
              </div>

              <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                {product.name}
              </h3>

              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {product.description}
              </p>

              {/* Benefits */}
              <div className="mb-3">
                <div className="flex flex-wrap gap-1">
                  {product.benefits.slice(0, 2).map((benefit, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {benefit}
                    </Badge>
                  ))}
                  {product.benefits.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{product.benefits.length - 2}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium ml-1">{product.rating}</span>
                </div>
                <span className="text-sm text-gray-500">
                  ({product.reviews} đánh giá)
                </span>
              </div>

              {/* Price and Actions */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xl font-bold text-burgundy-600">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-sm text-gray-500 ml-2">
                    {product.size}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="p-2"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => addToCart(product)}
                    disabled={!product.inStock}
                    className="bg-burgundy-500 hover:bg-burgundy-600"
                  >
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    Thêm
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Shopping Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Giỏ Hàng</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCart(false)}
                >
                  ×
                </Button>
              </div>
            </div>

            <div className="p-4 flex-1 overflow-y-auto">
              {cart.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Giỏ hàng trống</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="border rounded-lg p-3">
                      <h4 className="font-semibold text-sm mb-2">{item.name}</h4>
                      <div className="flex justify-between items-center">
                        <span className="text-burgundy-600 font-bold">
                          {formatPrice(item.price)}
                        </span>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-6 h-6 p-0"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-6 h-6 p-0"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-4 border-t">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-bold">Tổng cộng:</span>
                  <span className="text-xl font-bold text-burgundy-600">
                    {formatPrice(getTotalPrice())}
                  </span>
                </div>
                <Button className="w-full bg-burgundy-500 hover:bg-burgundy-600">
                  Đặt hàng ngay
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* No Results */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            Không tìm thấy sản phẩm
          </h3>
          <p className="text-gray-500">
            Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
          </p>
        </div>
      )}
      </div>
    </div>
  );
};

export default ProductRecommendation;
