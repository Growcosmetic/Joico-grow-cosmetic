// Dữ liệu sản phẩm Joico theo bảng so sánh
export const joicoProducts = {
  // Nhóm sản phẩm chăm sóc tóc
  hairCare: [
    {
      id: 'youthlock',
      name: 'YouthLock™',
      category: 'Tóc lão hóa',
      description: 'Tóc lão hóa',
      color: 'orange',
      image: '/images/youthlock.jpg', // Cần thêm hình ảnh
      benefits: [
        'Thân tóc trẻ hóa & phục hồi độ đàn hồi',
        'Giảm tóc dễ gãy, dễ giòn, khô cứng, dưỡng ẩm',
        'Phục hồi hư tổn',
        'Ngăn ngừa hư tổn',
        'Giảm gãy rụng tóc, phục hồi cấu trúc tóc, tạo độ dẻo',
        'Dưỡng ẩm / cấp nước / nuôi dưỡng',
        'Tăng độ bóng',
        'Giảm xơ rối',
        'Tăng độ mềm mại'
      ],
      prices: {
        salon300ml: 360000,
        retail300ml: 620000,
        salon1000ml: 900000,
        retail1000ml: 1550000
      }
    },
    {
      id: 'defy-damage',
      name: 'Defy Damage®',
      category: 'Tóc dễ hư tổn',
      description: 'Tóc dễ hư tổn',
      color: 'purple',
      image: '/images/defy-damage.jpg',
      benefits: [
        'Thân tóc trẻ hóa & phục hồi độ đàn hồi',
        'Giảm tóc dễ gãy, dễ giòn, khô cứng, dưỡng ẩm',
        'Phục hồi hư tổn',
        'Ngăn ngừa hư tổn',
        'Giảm gãy rụng tóc, phục hồi cấu trúc tóc, tạo độ dẻo',
        'Bảo vệ màu nhuộm / tông màu tóc',
        'Dưỡng ẩm / cấp nước / nuôi dưỡng',
        'Tăng độ bóng',
        'Giảm xơ rối',
        'Tăng độ mềm mại'
      ],
      prices: {
        salon300ml: 360000,
        retail300ml: 620000,
        salon1000ml: 900000,
        retail1000ml: 1550000
      }
    },
    {
      id: 'k-pak',
      name: 'K-PAK®',
      category: 'Tóc hư tổn',
      description: 'Tóc hư tổn',
      color: 'gold',
      image: '/images/k-pak.jpg',
      benefits: [
        'Giảm tóc dễ gãy, dễ giòn, khô cứng, dưỡng ẩm',
        'Phục hồi hư tổn',
        'Ngăn ngừa hư tổn',
        'Giảm gãy rụng tóc, phục hồi cấu trúc tóc, tạo độ dẻo',
        'Dưỡng ẩm / cấp nước / nuôi dưỡng',
        'Tăng độ bóng',
        'Giảm xơ rối',
        'Tăng độ mềm mại'
      ],
      prices: {
        salon300ml: 330000,
        retail300ml: 620000,
        salon1000ml: 850000,
        retail1000ml: 1550000
      }
    },
    {
      id: 'k-pak-color',
      name: 'K-PAK® Color Therapy',
      category: 'Tóc đã nhuộm',
      description: 'Tóc đã nhuộm',
      color: 'burgundy',
      image: '/images/k-pak-color.jpg',
      benefits: [
        'Giảm tóc dễ gãy, dễ giòn, khô cứng, dưỡng ẩm',
        'Phục hồi hư tổn',
        'Ngăn ngừa hư tổn',
        'Giảm gãy rụng tóc, phục hồi cấu trúc tóc, tạo độ dẻo',
        'Bảo vệ màu nhuộm / tông màu tóc',
        'Dưỡng ẩm / cấp nước / nuôi dưỡng',
        'Tăng độ bóng',
        'Giảm xơ rối',
        'Tăng độ mềm mại'
      ],
      prices: {
        salon300ml: 330000,
        retail300ml: 620000,
        salon1000ml: 850000,
        retail1000ml: 1550000
      }
    },
    {
      id: 'joifull',
      name: 'JoiFull',
      category: 'Tóc mỏng / trung bình',
      description: 'Tóc mỏng / trung bình',
      color: 'teal',
      image: '/images/joifull.jpg',
      benefits: [
        'Giảm rụng tóc',
        'Dưỡng ẩm / cấp nước / nuôi dưỡng',
        'Tăng độ phồng',
        'Tăng độ bóng',
        'Giảm xơ rối',
        'Tăng độ mềm mại'
      ],
      prices: {
        salon300ml: 330000,
        retail300ml: 620000,
        salon1000ml: 850000,
        retail1000ml: 1550000
      }
    },
    {
      id: 'hydrasplash',
      name: 'HydraSplash®',
      category: 'Tóc khô, mỏng / trung bình',
      description: 'Tóc khô, mỏng / trung bình',
      color: 'light-blue',
      image: '/images/hydrasplash.jpg',
      benefits: [
        'Dưỡng ẩm / cấp nước / nuôi dưỡng',
        'Tăng độ bóng',
        'Giảm xơ rối',
        'Tăng độ mềm mại'
      ],
      prices: {
        salon300ml: 330000,
        retail300ml: 620000,
        salon1000ml: 850000,
        retail1000ml: 1550000
      }
    },
    {
      id: 'moisture-recovery',
      name: 'Moisture Recovery',
      category: 'Tóc khô, dày / sợi to',
      description: 'Tóc khô, dày / sợi to',
      color: 'dark-blue',
      image: '/images/moisture-recovery.jpg',
      benefits: [
        'Dưỡng ẩm / cấp nước / nuôi dưỡng',
        'Tăng độ bóng',
        'Giảm xơ rối',
        'Tăng độ mềm mại'
      ],
      prices: {
        salon300ml: 330000,
        retail300ml: 620000,
        salon1000ml: 850000,
        retail1000ml: 1550000
      }
    }
  ],

  // Nhóm sản phẩm màu tóc
  colorCare: [
    {
      id: 'blonde-life',
      name: 'Blonde Life®',
      category: 'Tóc vàng blonde',
      description: 'Tóc vàng blonde',
      color: 'beige',
      image: '/images/blonde-life.jpg',
      benefits: [
        'Giảm tóc dễ gãy, dễ giòn, khô cứng, dưỡng ẩm',
        'Giảm gãy rụng tóc, phục hồi cấu trúc tóc, tạo độ dẻo',
        'Bảo vệ màu nhuộm/ tông màu tóc',
        'Dưỡng ẩm/ cấp nước/ nuôi dưỡng',
        'Trung hòa sắc vàng / cam gắt',
        'Duy trì độ tươi sáng của màu nhuộm',
        'Làm sáng trông tóc blonde vàng',
        'Làm mới lại màu tóc nhuộm',
        'Tăng độ bóng',
        'Giảm xơ rối',
        'Tăng độ mềm mại, dẻo'
      ],
      prices: {
        salon300ml: 350000,
        retail300ml: 620000,
        salon1000ml: 900000,
        retail1000ml: 1550000
      }
    },
    {
      id: 'blonde-life-violet',
      name: 'Blonde Life® Violet',
      category: 'Tóc vàng blonde lạnh',
      description: 'Tóc vàng blonde lạnh',
      color: 'lavender',
      image: '/images/blonde-life-violet.jpg',
      benefits: [
        'Giảm tóc dễ gãy, dễ giòn, khô cứng, dưỡng ẩm',
        'Giảm gãy rụng tóc, phục hồi cấu trúc tóc, tạo độ dẻo',
        'Bảo vệ màu nhuộm/ tông màu tóc',
        'Dưỡng ẩm/ cấp nước/ nuôi dưỡng',
        'Trung hòa sắc vàng / cam gắt',
        'Duy trì độ tươi sáng của màu nhuộm',
        'Làm sáng trông tóc blonde vàng',
        'Làm mới lại màu tóc nhuộm',
        'Tăng độ bóng',
        'Giảm xơ rối',
        'Tăng độ mềm mại, dẻo'
      ],
      prices: {
        salon300ml: 350000,
        retail300ml: 620000,
        salon1000ml: 900000,
        retail1000ml: 1550000
      }
    },
    {
      id: 'colorful',
      name: 'Colorful',
      category: 'Tóc đã nhuộm',
      description: 'Tóc đã nhuộm',
      color: 'pink',
      image: '/images/colorful.jpg',
      benefits: [
        'Giảm tóc dễ gãy, dễ giòn, khô cứng, dưỡng ẩm',
        'Giảm gãy rụng tóc, phục hồi cấu trúc tóc, tạo độ dẻo',
        'Bảo vệ màu nhuộm/ tông màu tóc',
        'Dưỡng ẩm/ cấp nước/ nuôi dưỡng',
        'Duy trì độ tươi sáng của màu nhuộm',
        'Làm mới lại màu tóc nhuộm',
        'Tăng độ bóng',
        'Giảm xơ rối',
        'Tăng độ mềm mại, dẻo'
      ],
      prices: {
        salon300ml: 350000,
        retail300ml: 620000,
        salon1000ml: 900000,
        retail1000ml: 1550000
      }
    },
    {
      id: 'color-infuse-red',
      name: 'Color Infuse® Red',
      category: 'Tóc nhuộm đỏ',
      description: 'Tóc nhuộm đỏ',
      color: 'red',
      image: '/images/color-infuse-red.jpg',
      benefits: [
        'Giảm tóc dễ gãy, dễ giòn, khô cứng, dưỡng ẩm',
        'Giảm gãy rụng tóc, phục hồi cấu trúc tóc, tạo độ dẻo',
        'Bảo vệ màu nhuộm/ tông màu tóc',
        'Dưỡng ẩm/ cấp nước/ nuôi dưỡng',
        'Duy trì độ tươi sáng của màu nhuộm',
        'Làm mới lại màu tóc nhuộm',
        'Tăng độ bóng',
        'Giảm xơ rối',
        'Tăng độ mềm mại, dẻo'
      ],
      prices: {
        salon300ml: 350000,
        retail300ml: 620000,
        salon1000ml: 900000,
        retail1000ml: 1550000
      }
    },
    {
      id: 'color-balance-blue',
      name: 'Color Balance® Blue',
      category: 'Tóc nhuộm nâu lạnh hoặc xám xanh rêu',
      description: 'Tóc nhuộm nâu lạnh hoặc xám xanh rêu',
      color: 'blue',
      image: '/images/color-balance-blue.jpg',
      benefits: [
        'Giảm tóc dễ gãy, dễ giòn, khô cứng, dưỡng ẩm',
        'Giảm gãy rụng tóc, phục hồi cấu trúc tóc, tạo độ dẻo',
        'Bảo vệ màu nhuộm/ tông màu tóc',
        'Dưỡng ẩm/ cấp nước/ nuôi dưỡng',
        'Trung hòa sắc vàng / cam gắt',
        'Duy trì độ tươi sáng của màu nhuộm',
        'Làm mới lại màu tóc nhuộm',
        'Tăng độ bóng',
        'Giảm xơ rối',
        'Tăng độ mềm mại, dẻo'
      ],
      prices: {
        salon300ml: 350000,
        retail300ml: 620000,
        salon1000ml: 900000,
        retail1000ml: 1550000
      }
    },
    {
      id: 'color-balance-purple',
      name: 'Color Balance® Purple',
      category: 'Tóc vàng ánh xám hoặc xám',
      description: 'Tóc vàng ánh xám hoặc xám',
      color: 'purple',
      image: '/images/color-balance-purple.jpg',
      benefits: [
        'Giảm tóc dễ gãy, dễ giòn, khô cứng, dưỡng ẩm',
        'Giảm gãy rụng tóc, phục hồi cấu trúc tóc, tạo độ dẻo',
        'Bảo vệ màu nhuộm/ tông màu tóc',
        'Dưỡng ẩm/ cấp nước/ nuôi dưỡng',
        'Trung hòa sắc vàng / cam gắt',
        'Duy trì độ tươi sáng của màu nhuộm',
        'Làm mới lại màu tóc nhuộm',
        'Tăng độ bóng',
        'Giảm xơ rối',
        'Tăng độ mềm mại, dẻo'
      ],
      prices: {
        salon300ml: 350000,
        retail300ml: 620000,
        salon1000ml: 900000,
        retail1000ml: 1550000
      }
    }
  ]
};

// Hàm lấy sản phẩm theo danh mục
export const getProductsByCategory = (category) => {
  if (category === 'hairCare') return joicoProducts.hairCare;
  if (category === 'colorCare') return joicoProducts.colorCare;
  return [...joicoProducts.hairCare, ...joicoProducts.colorCare];
};

// Hàm lấy sản phẩm theo ID
export const getProductById = (id) => {
  const allProducts = [...joicoProducts.hairCare, ...joicoProducts.colorCare];
  return allProducts.find(product => product.id === id);
};
