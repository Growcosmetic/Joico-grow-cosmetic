// Utility functions cho hệ thống gợi ý sản phẩm JOICO thông minh

// Mapping vấn đề tóc với sản phẩm phù hợp
export const PROBLEM_TO_PRODUCTS = {
  damage: {
    primary: ['kpak-shampoo', 'kpak-reconstructor'],
    secondary: ['kpak-leave-in', 'defy-damage-shampoo'],
    severity: {
      mild: ['defy-damage-shampoo', 'kpak-leave-in'],
      moderate: ['kpak-shampoo', 'kpak-reconstructor'],
      severe: ['kpak-reconstructor', 'kpak-shampoo', 'kpak-leave-in']
    }
  },
  dryness: {
    primary: ['moisture-recovery-shampoo', 'moisture-recovery-mask'],
    secondary: ['kpak-leave-in'],
    severity: {
      mild: ['moisture-recovery-shampoo'],
      moderate: ['moisture-recovery-shampoo', 'moisture-recovery-mask'],
      severe: ['moisture-recovery-mask', 'moisture-recovery-shampoo', 'kpak-leave-in']
    }
  },
  weakness: {
    primary: ['kpak-shampoo', 'kpak-reconstructor'],
    secondary: ['kpak-leave-in', 'defy-damage-shampoo'],
    severity: {
      mild: ['kpak-shampoo', 'kpak-leave-in'],
      moderate: ['kpak-shampoo', 'kpak-reconstructor'],
      severe: ['kpak-reconstructor', 'kpak-shampoo', 'kpak-leave-in']
    }
  },
  color_fade: {
    primary: ['color-intensity-shampoo', 'defy-damage-shampoo'],
    secondary: ['kpak-leave-in'],
    severity: {
      mild: ['color-intensity-shampoo'],
      moderate: ['color-intensity-shampoo', 'defy-damage-shampoo'],
      severe: ['color-intensity-shampoo', 'defy-damage-shampoo', 'kpak-leave-in']
    }
  },
  blonde_issues: {
    primary: ['blonde-life-shampoo'],
    secondary: ['kpak-leave-in', 'moisture-recovery-mask'],
    severity: {
      mild: ['blonde-life-shampoo'],
      moderate: ['blonde-life-shampoo', 'kpak-leave-in'],
      severe: ['blonde-life-shampoo', 'moisture-recovery-mask', 'kpak-leave-in']
    }
  }
};

// Hair type mapping
export const HAIR_TYPE_MAPPING = {
  'Tóc khô, xơ rối': 'dryness',
  'Tóc hư tổn, chẻ ngọn': 'damage',
  'Tóc yếu, dễ gãy': 'weakness',
  'Tóc nhuộm phai màu': 'color_fade',
  'Tóc vàng không đều': 'blonde_issues'
};

// Scoring system cho recommendations
export const RECOMMENDATION_WEIGHTS = {
  quizMatch: 0.4,        // 40% - Khớp với kết quả quiz
  hairPassportScore: 0.3, // 30% - Điểm số Hair Passport
  professionalTests: 0.2, // 20% - Kết quả professional tests
  userPreference: 0.1     // 10% - Sở thích người dùng
};

// Product database với thông tin chi tiết
export const JOICO_PRODUCT_DATABASE = {
  'kpak-shampoo': {
    id: 'kpak-shampoo',
    name: 'K-PAK Reconstructing Shampoo',
    line: 'K-PAK',
    category: 'shampoo',
    targetProblems: ['damage', 'weakness', 'chemically_treated'],
    severity: ['moderate', 'severe'],
    ingredients: {
      key: ['Keratin', 'Arginine', 'Peptides'],
      benefits: {
        'Keratin': 'Phục hồi cấu trúc protein tóc',
        'Arginine': 'Tăng cường độ bền và đàn hồi',
        'Peptides': 'Nuôi dưỡng và bảo vệ sợi tóc'
      }
    },
    usage: {
      frequency: 'Hàng ngày hoặc 3-4 lần/tuần',
      method: 'Massage nhẹ nhàng, để 2-3 phút rồi xả sạch',
      combination: ['kpak-reconstructor', 'kpak-leave-in']
    },
    price: 450000,
    size: '300ml',
    rating: 4.8,
    reviews: 1250,
    professional: true,
    bestseller: true
  },

  'kpak-reconstructor': {
    id: 'kpak-reconstructor',
    name: 'K-PAK Deep Penetrating Reconstructor',
    line: 'K-PAK',
    category: 'treatment',
    targetProblems: ['damage', 'weakness', 'brittle'],
    severity: ['severe', 'extreme'],
    ingredients: {
      key: ['Quadramine Complex', 'Keratin', 'Amino Acids'],
      benefits: {
        'Quadramine Complex': 'Phục hồi sâu cấu trúc tóc hư tổn',
        'Keratin': 'Tái tạo protein thiếu hụt',
        'Amino Acids': 'Nuôi dưỡng và tăng cường sức khỏe tóc'
      }
    },
    usage: {
      frequency: '1-2 lần/tuần',
      method: 'Thoa đều lên tóc ẩm, để 5-10 phút, xả sạch',
      combination: ['kpak-shampoo', 'kpak-leave-in']
    },
    price: 680000,
    size: '150ml',
    rating: 4.9,
    reviews: 890,
    professional: true,
    award: 'Best Treatment 2024'
  },

  'moisture-recovery-shampoo': {
    id: 'moisture-recovery-shampoo',
    name: 'Moisture Recovery Shampoo',
    line: 'Moisture Recovery',
    category: 'shampoo',
    targetProblems: ['dryness', 'coarse', 'frizzy'],
    severity: ['mild', 'moderate'],
    ingredients: {
      key: ['Hydramine Sea Complex', 'Murumuru Butter', 'Sea Kelp'],
      benefits: {
        'Hydramine Sea Complex': 'Cấp ẩm sâu và lâu dài',
        'Murumuru Butter': 'Làm mềm và nuôi dưỡng tóc',
        'Sea Kelp': 'Cung cấp khoáng chất thiết yếu'
      }
    },
    usage: {
      frequency: 'Hàng ngày',
      method: 'Massage nhẹ nhàng, tạo bọt, xả sạch',
      combination: ['moisture-recovery-mask']
    },
    price: 420000,
    size: '300ml',
    rating: 4.7,
    reviews: 1100,
    trending: true
  },

  'defy-damage-shampoo': {
    id: 'defy-damage-shampoo',
    name: 'Defy Damage Protective Shampoo',
    line: 'Defy Damage',
    category: 'shampoo',
    targetProblems: ['prevention', 'color_treated', 'heat_styled'],
    severity: ['prevention', 'mild'],
    ingredients: {
      key: ['Moringa Oil', 'Arginine', 'Antioxidants'],
      benefits: {
        'Moringa Oil': 'Bảo vệ khỏi tổn thương môi trường',
        'Arginine': 'Tăng cường cấu trúc tóc',
        'Antioxidants': 'Chống oxy hóa và lão hóa'
      }
    },
    usage: {
      frequency: 'Hàng ngày',
      method: 'Sử dụng như dầu gội thông thường',
      combination: ['kpak-leave-in']
    },
    price: 480000,
    size: '300ml',
    rating: 4.6,
    reviews: 950,
    newProduct: true
  },

  'kpak-leave-in': {
    id: 'kpak-leave-in',
    name: 'K-PAK Leave-In Protectant',
    line: 'K-PAK',
    category: 'leave_in',
    targetProblems: ['heat_damage', 'daily_protection', 'styling'],
    severity: ['mild', 'moderate', 'severe'],
    ingredients: {
      key: ['Keratin', 'Thermal Protection', 'Conditioning Agents'],
      benefits: {
        'Keratin': 'Phục hồi tức thì',
        'Thermal Protection': 'Bảo vệ nhiệt đến 230°C',
        'Conditioning Agents': 'Làm mềm không làm nặng tóc'
      }
    },
    usage: {
      frequency: 'Hàng ngày',
      method: 'Xịt đều lên tóc ẩm trước khi sấy/tạo kiểu',
      combination: ['kpak-shampoo', 'kpak-reconstructor']
    },
    price: 520000,
    size: '200ml',
    rating: 4.7,
    reviews: 650,
    essential: true
  }
};

// Tạo gợi ý sản phẩm thông minh dựa trên Quiz results
export const generateSmartRecommendations = (quizResults, hairPassport = null, professionalTests = null) => {
  if (!quizResults) return [];

  const recommendations = [];
  const { primaryProblem, severity, hairTypes, specificConcerns } = quizResults;

  // 1. Gợi ý dựa trên vấn đề chính
  const problemMapping = PROBLEM_TO_PRODUCTS[primaryProblem];
  if (problemMapping) {
    // Lấy sản phẩm primary
    problemMapping.primary.forEach(productId => {
      const product = JOICO_PRODUCT_DATABASE[productId];
      if (product) {
        recommendations.push({
          ...product,
          recommendationScore: calculateRecommendationScore(product, quizResults, hairPassport, professionalTests),
          reason: `Phù hợp với vấn đề ${primaryProblem}`,
          priority: 'high'
        });
      }
    });

    // Lấy sản phẩm theo mức độ nghiêm trọng
    if (problemMapping.severity[severity]) {
      problemMapping.severity[severity].forEach(productId => {
        const product = JOICO_PRODUCT_DATABASE[productId];
        if (product && !recommendations.find(r => r.id === productId)) {
          recommendations.push({
            ...product,
            recommendationScore: calculateRecommendationScore(product, quizResults, hairPassport, professionalTests),
            reason: `Phù hợp với mức độ ${severity}`,
            priority: 'medium'
          });
        }
      });
    }
  }

  // 2. Gợi ý dựa trên Hair Passport scores
  if (hairPassport && hairPassport.detailedScores) {
    const { structure, moisture, damage, scalp, strength } = hairPassport.detailedScores;
    
    // Nếu điểm độ ẩm thấp
    if (moisture < 6) {
      const moistureProducts = ['moisture-recovery-shampoo', 'moisture-recovery-mask'];
      moistureProducts.forEach(productId => {
        const product = JOICO_PRODUCT_DATABASE[productId];
        if (product && !recommendations.find(r => r.id === productId)) {
          recommendations.push({
            ...product,
            recommendationScore: calculateRecommendationScore(product, quizResults, hairPassport, professionalTests),
            reason: `Điểm độ ẩm thấp (${moisture}/10)`,
            priority: 'high'
          });
        }
      });
    }

    // Nếu điểm cấu trúc thấp
    if (structure < 7) {
      const structureProducts = ['kpak-reconstructor', 'kpak-shampoo'];
      structureProducts.forEach(productId => {
        const product = JOICO_PRODUCT_DATABASE[productId];
        if (product && !recommendations.find(r => r.id === productId)) {
          recommendations.push({
            ...product,
            recommendationScore: calculateRecommendationScore(product, quizResults, hairPassport, professionalTests),
            reason: `Điểm cấu trúc thấp (${structure}/10)`,
            priority: 'high'
          });
        }
      });
    }
  }

  // 3. Sản phẩm bảo vệ chung (luôn khuyến nghị)
  const protectionProducts = ['defy-damage-shampoo', 'kpak-leave-in'];
  protectionProducts.forEach(productId => {
    const product = JOICO_PRODUCT_DATABASE[productId];
    if (product && !recommendations.find(r => r.id === productId)) {
      recommendations.push({
        ...product,
        recommendationScore: calculateRecommendationScore(product, quizResults, hairPassport, professionalTests),
        reason: 'Bảo vệ và duy trì sức khỏe tóc',
        priority: 'medium'
      });
    }
  });

  // Sắp xếp theo điểm số và priority
  return recommendations
    .sort((a, b) => {
      if (a.priority !== b.priority) {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return b.recommendationScore - a.recommendationScore;
    })
    .slice(0, 6); // Giới hạn 6 sản phẩm
};

// Tính điểm số gợi ý cho từng sản phẩm
export const calculateRecommendationScore = (product, quizResults, hairPassport = null, professionalTests = null) => {
  let score = 0;

  // 1. Quiz match score (40%)
  const quizScore = calculateQuizMatchScore(product, quizResults);
  score += quizScore * RECOMMENDATION_WEIGHTS.quizMatch;

  // 2. Hair Passport score (30%)
  if (hairPassport) {
    const passportScore = calculatePassportMatchScore(product, hairPassport);
    score += passportScore * RECOMMENDATION_WEIGHTS.hairPassportScore;
  }

  // 3. Professional tests score (20%)
  if (professionalTests) {
    const testsScore = calculateTestsMatchScore(product, professionalTests);
    score += testsScore * RECOMMENDATION_WEIGHTS.professionalTests;
  }

  // 4. User preference score (10%) - có thể mở rộng sau
  const preferenceScore = 0.5; // Default neutral
  score += preferenceScore * RECOMMENDATION_WEIGHTS.userPreference;

  return Math.round(score * 100) / 100; // Round to 2 decimal places
};

// Tính điểm khớp với Quiz
const calculateQuizMatchScore = (product, quizResults) => {
  let score = 0;
  const { primaryProblem, severity, hairTypes } = quizResults;

  // Check if product targets the primary problem
  if (product.targetProblems.includes(primaryProblem)) {
    score += 0.6;
  }

  // Check severity match
  if (product.severity.includes(severity)) {
    score += 0.3;
  }

  // Check hair type match
  const hairTypeMatch = hairTypes.some(type => 
    product.targetProblems.includes(HAIR_TYPE_MAPPING[type])
  );
  if (hairTypeMatch) {
    score += 0.1;
  }

  return Math.min(score, 1); // Cap at 1
};

// Tính điểm khớp với Hair Passport
const calculatePassportMatchScore = (product, hairPassport) => {
  let score = 0;
  const { overallScore, detailedScores } = hairPassport;

  // Base score from overall health
  if (overallScore < 6) {
    // Cần sản phẩm phục hồi mạnh
    if (product.line === 'K-PAK' && product.category === 'treatment') {
      score += 0.5;
    }
  } else if (overallScore < 8) {
    // Cần sản phẩm duy trì và cải thiện
    if (product.line === 'K-PAK' || product.line === 'Defy Damage') {
      score += 0.4;
    }
  } else {
    // Tóc khỏe, cần sản phẩm bảo vệ
    if (product.line === 'Defy Damage') {
      score += 0.3;
    }
  }

  // Detailed scores matching
  if (detailedScores) {
    if (detailedScores.moisture < 6 && product.targetProblems.includes('dryness')) {
      score += 0.3;
    }
    if (detailedScores.structure < 7 && product.targetProblems.includes('damage')) {
      score += 0.3;
    }
  }

  return Math.min(score, 1);
};

// Tính điểm khớp với Professional Tests
const calculateTestsMatchScore = (product, professionalTests) => {
  let score = 0;

  // Elasticity test
  if (professionalTests.elasticity < 6 && product.targetProblems.includes('weakness')) {
    score += 0.25;
  }

  // Porosity test
  if (professionalTests.porosity < 6 && product.targetProblems.includes('dryness')) {
    score += 0.25;
  }

  // Split ends
  if (professionalTests.splitEnds < 6 && product.targetProblems.includes('damage')) {
    score += 0.25;
  }

  // Scalp health
  if (professionalTests.scalpHealth < 6 && product.category === 'shampoo') {
    score += 0.25;
  }

  return Math.min(score, 1);
};

// Tạo routine chăm sóc tóc hoàn chỉnh
export const generateHairCareRoutine = (recommendedProducts) => {
  const routine = {
    daily: [],
    weekly: [],
    monthly: [],
    asNeeded: []
  };

  recommendedProducts.forEach(product => {
    const usage = product.usage;
    
    if (usage.frequency.includes('Hàng ngày')) {
      routine.daily.push({
        product: product,
        step: getRoutineStep(product.category),
        instructions: usage.method
      });
    } else if (usage.frequency.includes('tuần')) {
      routine.weekly.push({
        product: product,
        step: getRoutineStep(product.category),
        instructions: usage.method
      });
    } else if (usage.frequency.includes('tháng')) {
      routine.monthly.push({
        product: product,
        step: getRoutineStep(product.category),
        instructions: usage.method
      });
    } else {
      routine.asNeeded.push({
        product: product,
        step: getRoutineStep(product.category),
        instructions: usage.method
      });
    }
  });

  return routine;
};

// Xác định bước trong routine
const getRoutineStep = (category) => {
  const stepMapping = {
    'shampoo': 1,
    'treatment': 2,
    'leave_in': 3,
    'styling': 4
  };
  return stepMapping[category] || 5;
};

// Tính tổng chi phí routine
export const calculateRoutineCost = (recommendedProducts, period = 'monthly') => {
  const periodMultiplier = {
    'monthly': 1,
    'quarterly': 3,
    'yearly': 12
  };

  const totalCost = recommendedProducts.reduce((sum, product) => {
    // Estimate usage per month based on product size and frequency
    let monthlyUsage = 1;
    if (product.category === 'shampoo') {
      monthlyUsage = 1; // 1 bottle per month
    } else if (product.category === 'treatment') {
      monthlyUsage = 0.5; // 0.5 bottle per month
    } else if (product.category === 'leave_in') {
      monthlyUsage = 0.7; // 0.7 bottle per month
    }

    return sum + (product.price * monthlyUsage);
  }, 0);

  return totalCost * (periodMultiplier[period] || 1);
};

// Export all functions
export default {
  PROBLEM_TO_PRODUCTS,
  HAIR_TYPE_MAPPING,
  RECOMMENDATION_WEIGHTS,
  JOICO_PRODUCT_DATABASE,
  generateSmartRecommendations,
  calculateRecommendationScore,
  generateHairCareRoutine,
  calculateRoutineCost
};
