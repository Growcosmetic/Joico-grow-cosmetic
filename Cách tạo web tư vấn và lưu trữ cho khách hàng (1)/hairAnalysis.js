// Utility functions cho phân tích tóc chuyên nghiệp

// Tính toán điểm số tổng hợp từ Quiz + Professional Tests
export const calculateCombinedScore = (quizResults, professionalTests) => {
  if (!quizResults || !professionalTests) return null;

  // Điểm từ Quiz (chuyển đổi sang thang 10)
  const quizScore = {
    damage: Math.max(0, 10 - quizResults.scores.damage),
    dryness: Math.max(0, 10 - quizResults.scores.dryness), 
    weakness: Math.max(0, 10 - quizResults.scores.weakness)
  };
  const avgQuizScore = (quizScore.damage + quizScore.dryness + quizScore.weakness) / 3;

  // Điểm từ Professional Tests
  const professionalScore = Object.values(professionalTests).reduce((sum, test) => sum + test.score, 0) / 4;

  // Trọng số: Quiz 40%, Professional Tests 60%
  const combinedScore = (avgQuizScore * 0.4) + (professionalScore * 0.6);

  return {
    quizScore: avgQuizScore,
    professionalScore,
    combinedScore,
    breakdown: {
      quiz: quizScore,
      professional: professionalTests
    }
  };
};

// Phân loại mức độ sức khỏe tóc
export const getHairHealthLevel = (score) => {
  if (score >= 8.5) {
    return {
      level: 'Xuất sắc',
      color: 'text-green-600 bg-green-100',
      description: 'Tóc rất khỏe mạnh, chỉ cần duy trì chăm sóc cơ bản',
      icon: '🌟'
    };
  }
  if (score >= 7) {
    return {
      level: 'Tốt',
      color: 'text-blue-600 bg-blue-100', 
      description: 'Tóc khỏe mạnh với một vài vấn đề nhỏ cần chú ý',
      icon: '✨'
    };
  }
  if (score >= 5) {
    return {
      level: 'Trung bình',
      color: 'text-yellow-600 bg-yellow-100',
      description: 'Tóc có một số vấn đề cần điều trị và chăm sóc đặc biệt',
      icon: '⚠️'
    };
  }
  if (score >= 3) {
    return {
      level: 'Kém',
      color: 'text-orange-600 bg-orange-100',
      description: 'Tóc có nhiều vấn đề nghiêm trọng cần điều trị tích cực',
      icon: '🚨'
    };
  }
  return {
    level: 'Rất kém',
    color: 'text-red-600 bg-red-100',
    description: 'Tóc hư hại nặng, cần điều trị khẩn cấp và toàn diện',
    icon: '🆘'
  };
};

// Tạo gợi ý điều trị tổng hợp
export const generateComprehensiveRecommendations = (combinedAnalysis) => {
  const { quizResults, professionalTests, combinedScore } = combinedAnalysis;
  
  const recommendations = {
    priority: 'high', // high, medium, low
    immediate: [],
    salon: [],
    homecare: [],
    timeline: {},
    products: {
      essential: [],
      recommended: [],
      optional: []
    },
    followUp: []
  };

  // Xác định mức độ ưu tiên
  if (combinedScore < 4) {
    recommendations.priority = 'high';
  } else if (combinedScore < 7) {
    recommendations.priority = 'medium';
  } else {
    recommendations.priority = 'low';
  }

  // Phân tích từ Professional Tests
  Object.entries(professionalTests).forEach(([testId, result]) => {
    if (result.score <= 3) {
      switch (testId) {
        case 'elasticity':
          recommendations.immediate.push('Điều trị protein khẩn cấp');
          recommendations.salon.push('K-PAK Intense Hydrator Treatment');
          recommendations.products.essential.push('K-PAK Deep Penetrating Reconstructor');
          break;
        case 'porosity':
          recommendations.immediate.push('Cân bằng độ pH và độ xốp');
          recommendations.salon.push('Porosity Equalizing Treatment');
          recommendations.products.essential.push('pH Balancing Shampoo');
          break;
        case 'splitEnds':
          recommendations.immediate.push('Cắt tỉa đầu tóc ngay lập tức');
          recommendations.salon.push('Precision Cut + Split End Treatment');
          recommendations.products.recommended.push('Leave-in Split End Sealer');
          break;
        case 'scalp':
          recommendations.immediate.push('Điều trị da đầu chuyên sâu');
          recommendations.salon.push('Scalp Detox + Therapy Treatment');
          recommendations.products.essential.push('Scalp Nourishing Serum');
          break;
      }
    } else if (result.score <= 6) {
      // Điều trị trung bình
      switch (testId) {
        case 'elasticity':
          recommendations.salon.push('Protein Reconstruction Treatment');
          recommendations.products.recommended.push('Weekly Protein Mask');
          break;
        case 'porosity':
          recommendations.salon.push('Moisture Balance Treatment');
          recommendations.products.recommended.push('Hydrating Leave-in Conditioner');
          break;
        case 'splitEnds':
          recommendations.salon.push('Trim + Protective Treatment');
          recommendations.products.recommended.push('Heat Protection Spray');
          break;
        case 'scalp':
          recommendations.salon.push('Scalp Massage + Nourishing Treatment');
          recommendations.products.recommended.push('Gentle Scalp Cleanser');
          break;
      }
    }
  });

  // Kết hợp với gợi ý từ Quiz
  if (quizResults && quizResults.recommendations) {
    recommendations.products.essential.push(...quizResults.recommendations.primaryTreatment.products);
    recommendations.salon.push(...quizResults.recommendations.primaryTreatment.services);
  }

  // Tạo timeline dựa trên mức độ ưu tiên
  switch (recommendations.priority) {
    case 'high':
      recommendations.timeline = {
        week1: 'Điều trị khẩn cấp tại salon + bắt đầu homecare',
        week2: 'Tiếp tục homecare + đánh giá tiến độ',
        week4: 'Điều trị tại salon lần 2 + điều chỉnh homecare',
        week8: 'Tái đánh giá toàn diện + lập kế hoạch dài hạn'
      };
      break;
    case 'medium':
      recommendations.timeline = {
        week1: 'Bắt đầu homecare routine',
        week2: 'Điều trị tại salon + chụp ảnh theo dõi',
        week6: 'Điều trị tại salon lần 2',
        week12: 'Tái đánh giá và điều chỉnh'
      };
      break;
    case 'low':
      recommendations.timeline = {
        week2: 'Điều trị duy trì tại salon',
        week8: 'Kiểm tra định kỳ',
        week16: 'Tái đánh giá tổng thể'
      };
      break;
  }

  // Follow-up recommendations
  recommendations.followUp = [
    'Chụp ảnh theo dõi tiến độ hàng tuần',
    'Đánh giá lại sau mỗi liệu trình điều trị',
    'Điều chỉnh sản phẩm homecare theo phản hồi của tóc',
    'Tư vấn định kỳ với chuyên gia mỗi 3 tháng'
  ];

  return recommendations;
};

// Tạo Hair Passport Score
export const generateHairPassportScore = (combinedAnalysis) => {
  const { combinedScore, breakdown } = combinedAnalysis;
  
  return {
    overallScore: Math.round(combinedScore * 10) / 10,
    categoryScores: {
      structure: Math.round(breakdown.professional.elasticity?.score || 0),
      moisture: Math.round(((breakdown.professional.porosity?.score || 0) + 
                           (10 - (breakdown.quiz?.dryness || 0))) / 2),
      damage: Math.round(((breakdown.professional.splitEnds?.score || 0) + 
                         (10 - (breakdown.quiz?.damage || 0))) / 2),
      scalp: Math.round(breakdown.professional.scalp?.score || 0),
      strength: Math.round(10 - (breakdown.quiz?.weakness || 0))
    },
    healthLevel: getHairHealthLevel(combinedScore),
    improvementPotential: calculateImprovementPotential(combinedAnalysis)
  };
};

// Tính toán tiềm năng cải thiện
const calculateImprovementPotential = (analysis) => {
  const { combinedScore, breakdown } = analysis;
  
  // Điểm số có thể cải thiện dựa trên các yếu tố
  let maxPotential = 10;
  let currentScore = combinedScore;
  
  // Giảm tiềm năng nếu có vấn đề cấu trúc nghiêm trọng
  if (breakdown.professional.elasticity?.score < 3) {
    maxPotential -= 1.5;
  }
  
  // Tăng tiềm năng nếu chỉ có vấn đề về chăm sóc
  if (breakdown.professional.scalp?.score > 7 && breakdown.professional.elasticity?.score > 6) {
    maxPotential = Math.min(9.5, maxPotential + 0.5);
  }
  
  const improvementRange = maxPotential - currentScore;
  
  return {
    currentScore,
    maxPotential: Math.round(maxPotential * 10) / 10,
    improvementRange: Math.round(improvementRange * 10) / 10,
    timeframe: improvementRange > 3 ? '3-6 tháng' : improvementRange > 1.5 ? '6-12 tuần' : '4-8 tuần'
  };
};

// Export các hằng số và cấu hình
export const HAIR_ANALYSIS_CONFIG = {
  SCORING: {
    EXCELLENT: { min: 8.5, max: 10 },
    GOOD: { min: 7, max: 8.4 },
    AVERAGE: { min: 5, max: 6.9 },
    POOR: { min: 3, max: 4.9 },
    VERY_POOR: { min: 0, max: 2.9 }
  },
  WEIGHTS: {
    QUIZ: 0.4,
    PROFESSIONAL: 0.6
  },
  THRESHOLDS: {
    URGENT_TREATMENT: 3,
    MODERATE_TREATMENT: 6,
    MAINTENANCE: 8
  }
};

// Utility function để format điểm số
export const formatScore = (score, decimals = 1) => {
  return Math.round(score * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

// Utility function để so sánh điểm số theo thời gian
export const compareScores = (previousScore, currentScore) => {
  const difference = currentScore - previousScore;
  const percentChange = (difference / previousScore) * 100;
  
  return {
    difference: formatScore(difference),
    percentChange: formatScore(percentChange),
    trend: difference > 0.5 ? 'improving' : difference < -0.5 ? 'declining' : 'stable',
    significance: Math.abs(difference) > 1 ? 'significant' : Math.abs(difference) > 0.5 ? 'moderate' : 'minor'
  };
};
