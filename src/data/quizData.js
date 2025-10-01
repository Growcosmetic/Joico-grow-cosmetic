// Dữ liệu Quiz chẩn đoán tóc - 5 câu hỏi chính
export const quizQuestions = [
  {
    id: 1,
    question: "Tần suất sử dụng nhiệt (máy sấy, máy duỗi, máy kẹp) của bạn như thế nào?",
    type: "single",
    options: [
      { id: "heat_daily", text: "Hàng ngày", score: { damage: 3, dryness: 2, weakness: 2 } },
      { id: "heat_weekly", text: "2-3 lần/tuần", score: { damage: 2, dryness: 1, weakness: 1 } },
      { id: "heat_monthly", text: "Vài lần/tháng", score: { damage: 1, dryness: 0, weakness: 0 } },
      { id: "heat_never", text: "Không bao giờ", score: { damage: 0, dryness: 0, weakness: 0 } }
    ]
  },
  {
    id: 2,
    question: "Tình trạng tóc hiện tại của bạn?",
    type: "multiple",
    options: [
      { id: "dry_hair", text: "Tóc khô, xơ rối", score: { damage: 2, dryness: 3, weakness: 1 } },
      { id: "split_ends", text: "Chẻ ngọn, gãy rụng", score: { damage: 3, dryness: 1, weakness: 3 } },
      { id: "dull_hair", text: "Tóc mất độ bóng", score: { damage: 2, dryness: 2, weakness: 1 } },
      { id: "tangled_hair", text: "Tóc rối, khó chải", score: { damage: 1, dryness: 2, weakness: 2 } },
      { id: "thin_hair", text: "Tóc mỏng, yếu", score: { damage: 1, dryness: 1, weakness: 3 } },
      { id: "healthy_hair", text: "Tóc khỏe mạnh", score: { damage: 0, dryness: 0, weakness: 0 } }
    ]
  },
  {
    id: 3,
    question: "Bạn có thường xuyên nhuộm, uốn, duỗi tóc không?",
    type: "single",
    options: [
      { id: "chemical_frequent", text: "Thường xuyên (1-2 tháng/lần)", score: { damage: 3, dryness: 2, weakness: 2 } },
      { id: "chemical_sometimes", text: "Thỉnh thoảng (3-6 tháng/lần)", score: { damage: 2, dryness: 1, weakness: 1 } },
      { id: "chemical_rarely", text: "Hiếm khi (1 năm/lần)", score: { damage: 1, dryness: 0, weakness: 0 } },
      { id: "chemical_never", text: "Không bao giờ", score: { damage: 0, dryness: 0, weakness: 0 } }
    ]
  },
  {
    id: 4,
    question: "Sản phẩm chăm sóc tóc bạn đang sử dụng tại nhà?",
    type: "multiple",
    options: [
      { id: "drugstore_shampoo", text: "Dầu gội thông thường", score: { damage: 1, dryness: 1, weakness: 1 } },
      { id: "professional_shampoo", text: "Dầu gội chuyên nghiệp", score: { damage: -1, dryness: -1, weakness: -1 } },
      { id: "hair_mask", text: "Kem ủ tóc/Hair mask", score: { damage: -1, dryness: -2, weakness: -1 } },
      { id: "hair_oil", text: "Tinh dầu dưỡng tóc", score: { damage: -1, dryness: -2, weakness: 0 } },
      { id: "heat_protectant", text: "Sản phẩm chống nhiệt", score: { damage: -2, dryness: -1, weakness: -1 } },
      { id: "no_products", text: "Không sử dụng gì đặc biệt", score: { damage: 1, dryness: 1, weakness: 1 } }
    ]
  },
  {
    id: 5,
    question: "Tình trạng da đầu của bạn hiện tại?",
    type: "multiple",
    options: [
      { id: "oily_scalp", text: "Da đầu nhờn, dễ bết", score: { scalp: 2, damage: 1, dryness: 0, weakness: 0 } },
      { id: "dry_scalp", text: "Da đầu khô, ngứa", score: { scalp: 2, damage: 0, dryness: 2, weakness: 0 } },
      { id: "dandruff", text: "Có gàu, bong tróc", score: { scalp: 3, damage: 0, dryness: 1, weakness: 1 } },
      { id: "sensitive_scalp", text: "Da đầu nhạy cảm, dễ kích ứng", score: { scalp: 2, damage: 0, dryness: 1, weakness: 1 } },
      { id: "hair_loss", text: "Rụng tóc nhiều", score: { scalp: 2, damage: 0, dryness: 0, weakness: 3 } },
      { id: "healthy_scalp", text: "Da đầu khỏe mạnh", score: { scalp: 0, damage: 0, dryness: 0, weakness: 0 } }
    ]
  },
  {
    id: 6,
    question: "Mục tiêu chăm sóc tóc của bạn là gì?",
    type: "single",
    options: [
      { id: "repair_damage", text: "Phục hồi tóc hư tổn", score: { damage: 0, dryness: 0, weakness: 0 }, priority: "damage" },
      { id: "add_moisture", text: "Cấp ẩm cho tóc khô", score: { damage: 0, dryness: 0, weakness: 0 }, priority: "dryness" },
      { id: "strengthen_hair", text: "Tăng cường độ chắc khỏe", score: { damage: 0, dryness: 0, weakness: 0 }, priority: "weakness" },
      { id: "scalp_health", text: "Cải thiện sức khỏe da đầu", score: { scalp: 0, damage: 0, dryness: 0, weakness: 0 }, priority: "scalp" },
      { id: "maintain_health", text: "Duy trì tóc khỏe mạnh", score: { damage: 0, dryness: 0, weakness: 0 }, priority: "maintenance" }
    ]
  }
];

// Logic phân loại 4 nhóm vấn đề chính (thêm da đầu)
export const problemCategories = {
  damage: {
    name: "Tóc Hư Tổn",
    description: "Tóc bị hư hại do nhiệt độ, hóa chất hoặc tác động môi trường",
    symptoms: ["Chẻ ngọn", "Gãy rụng", "Mất độ bóng", "Xơ rối"],
    severity: {
      mild: { min: 0, max: 3, level: "Nhẹ" },
      moderate: { min: 4, max: 7, level: "Trung bình" },
      severe: { min: 8, max: 15, level: "Nặng" }
    },
    recommendedServices: {
      mild: ["DEFY DAMAGE Treatment", "Protein Reconstruction"],
      moderate: ["Intensive Repair Treatment", "K-PAK Deep Penetrating Reconstructor"],
      severe: ["Emergency Recovery Treatment", "Multi-step Reconstruction Protocol"]
    },
    joicoProducts: {
      mild: ["DEFY DAMAGE Protective Shampoo", "DEFY DAMAGE Protective Conditioner"],
      moderate: ["K-PAK Reconstructing Shampoo", "K-PAK Deep Penetrating Reconstructor"],
      severe: ["K-PAK Intense Hydrator", "DEFY DAMAGE Sleepover Treatment"]
    }
  },
  dryness: {
    name: "Tóc Khô Thiếu Ẩm",
    description: "Tóc thiếu độ ẩm tự nhiên, cảm giác khô cứng và khó chải",
    symptoms: ["Khô cứng", "Khó chải", "Không mềm mại", "Thiếu độ bóng"],
    severity: {
      mild: { min: 0, max: 3, level: "Nhẹ" },
      moderate: { min: 4, max: 7, level: "Trung bình" },
      severe: { min: 8, max: 15, level: "Nặng" }
    },
    recommendedServices: {
      mild: ["Moisture Recovery Treatment", "Hydrating Hair Mask"],
      moderate: ["Deep Moisture Infusion", "Intensive Hydrating Treatment"],
      severe: ["Emergency Moisture Recovery", "Multi-layer Hydration Protocol"]
    },
    joicoProducts: {
      mild: ["MOISTURE RECOVERY Shampoo", "MOISTURE RECOVERY Conditioner"],
      moderate: ["MOISTURE RECOVERY Treatment Balm", "HydraSplash Hydrating Shampoo"],
      severe: ["MOISTURE RECOVERY Intensive Treatment", "HydraSplash Replenishing Leave-in"]
    }
  },
  weakness: {
    name: "Tóc Yếu Thiếu Sức Sống",
    description: "Tóc mỏng yếu, dễ gãy, thiếu độ đàn hồi và sức sống",
    symptoms: ["Tóc mỏng", "Dễ gãy", "Thiếu đàn hồi", "Rụng nhiều"],
    severity: {
      mild: { min: 0, max: 3, level: "Nhẹ" },
      moderate: { min: 4, max: 7, level: "Trung bình" },
      severe: { min: 8, max: 15, level: "Nặng" }
    },
    recommendedServices: {
      mild: ["Strengthening Treatment", "Protein Boost Therapy"],
      moderate: ["Intensive Strengthening Protocol", "Fiber Reconstruction Treatment"],
      severe: ["Emergency Strength Recovery", "Complete Fiber Rebuilding Program"]
    },
    joicoProducts: {
      mild: ["K-PAK Clarifying Shampoo", "K-PAK Conditioner"],
      moderate: ["K-PAK RevitaLuxe Treatment", "DEFY DAMAGE Protective Treatment"],
      severe: ["K-PAK Intense Hydrator Treatment", "CLINICURE Balancing Scalp Nourish"]
    }
  },
  scalp: {
    name: "Da Đầu Không Khỏe",
    description: "Da đầu có vấn đề về độ ẩm, gàu, nhạy cảm hoặc rụng tóc",
    symptoms: ["Da đầu nhờn/khô", "Gàu", "Ngứa", "Rụng tóc", "Nhạy cảm"],
    severity: {
      mild: { min: 0, max: 3, level: "Nhẹ" },
      moderate: { min: 4, max: 7, level: "Trung bình" },
      severe: { min: 8, max: 15, level: "Nặng" }
    },
    recommendedServices: {
      mild: ["Scalp Balancing Treatment", "Gentle Cleansing Protocol"],
      moderate: ["Intensive Scalp Therapy", "Anti-Dandruff Treatment"],
      severe: ["Medical Scalp Treatment", "Complete Scalp Recovery Program"]
    },
    joicoProducts: {
      mild: ["CLINICURE Balancing Scalp Nourish", "CLINICURE Balancing Scalp Shampoo"],
      moderate: ["CLINICURE Balancing Scalp Treatment", "CLINICURE Balancing Scalp Conditioner"],
      severe: ["CLINICURE Balancing Scalp Intensive Treatment", "CLINICURE Balancing Scalp Recovery"]
    }
  }
};

// Hàm tính điểm và phân loại vấn đề
export const calculateHairAnalysis = (answers) => {
  const scores = { damage: 0, dryness: 0, weakness: 0, scalp: 0 };
  let priority = null;

  // Tính điểm từ các câu trả lời
  answers.forEach(answer => {
    const question = quizQuestions.find(q => q.id === answer.questionId);
    if (!question) return;

    if (question.type === 'single') {
      const option = question.options.find(opt => opt.id === answer.selectedOptions[0]);
      if (option) {
        scores.damage += option.score.damage || 0;
        scores.dryness += option.score.dryness || 0;
        scores.weakness += option.score.weakness || 0;
        scores.scalp += option.score.scalp || 0;
        
        // Lưu priority từ câu hỏi mục tiêu
        if (option.priority) {
          priority = option.priority;
        }
      }
    } else if (question.type === 'multiple') {
      answer.selectedOptions.forEach(optionId => {
        const option = question.options.find(opt => opt.id === optionId);
        if (option) {
          scores.damage += option.score.damage || 0;
          scores.dryness += option.score.dryness || 0;
          scores.weakness += option.score.weakness || 0;
          scores.scalp += option.score.scalp || 0;
        }
      });
    }
  });

  // Đảm bảo điểm không âm
  Object.keys(scores).forEach(key => {
    scores[key] = Math.max(0, scores[key]);
  });

  // Xác định vấn đề chính
  const primaryProblem = priority || Object.keys(scores).reduce((a, b) => 
    scores[a] > scores[b] ? a : b
  );

  // Phân loại mức độ nghiêm trọng
  const analysis = {};
  Object.keys(problemCategories).forEach(category => {
    const score = scores[category];
    const categoryData = problemCategories[category];
    
    let severity = 'mild';
    if (score >= categoryData.severity.severe.min) {
      severity = 'severe';
    } else if (score >= categoryData.severity.moderate.min) {
      severity = 'moderate';
    }

    analysis[category] = {
      score,
      severity,
      level: categoryData.severity[severity].level,
      isPrimary: category === primaryProblem
    };
  });

  // Tính điểm tổng và điểm từng danh mục
  const totalScore = Math.max(0, 10 - Math.round((scores.damage + scores.dryness + scores.weakness + scores.scalp) / 4));
  const categoryScores = {
    structure: Math.max(0, 10 - scores.damage),
    moisture: Math.max(0, 10 - scores.dryness),
    damage: Math.max(0, 10 - scores.damage),
    scalp: Math.max(0, 10 - scores.scalp),
    strength: Math.max(0, 10 - scores.weakness)
  };

  return {
    totalScore,
    categoryScores,
    scores,
    primaryProblem,
    analysis,
    recommendations: generateRecommendations(primaryProblem, analysis)
  };
};

// Hàm tạo gợi ý điều trị
const generateRecommendations = (primaryProblem, analysis) => {
  const primary = problemCategories[primaryProblem];
  const severity = analysis[primaryProblem].severity;

  return {
    primaryTreatment: {
      category: primary.name,
      severity: primary.severity[severity].level,
      services: primary.recommendedServices[severity],
      products: primary.joicoProducts[severity]
    },
    supportingTreatments: Object.keys(analysis)
      .filter(key => key !== primaryProblem && analysis[key].score > 2)
      .map(key => ({
        category: problemCategories[key].name,
        severity: problemCategories[key].severity[analysis[key].severity].level,
        services: problemCategories[key].recommendedServices[analysis[key].severity].slice(0, 2),
        products: problemCategories[key].joicoProducts[analysis[key].severity].slice(0, 2)
      })),
    homecare: {
      essential: primary.joicoProducts[severity],
      additional: severity === 'severe' ? [
        "DEFY DAMAGE Sleepover Treatment (1-2 lần/tuần)",
        "K-PAK Leave-in Protectant (hàng ngày)"
      ] : [
        "Weekly Deep Treatment",
        "Daily Leave-in Protection"
      ]
    },
    timeline: {
      immediate: "Điều trị tại salon trong 1-2 tuần tới",
      shortTerm: "Sử dụng sản phẩm home care trong 4-6 tuần",
      longTerm: "Tái đánh giá và điều chỉnh sau 2-3 tháng"
    }
  };
};

// Dữ liệu ảnh trước/sau mẫu (sẽ được thay thế bằng ảnh thực tế)
export const beforeAfterImages = {
  damage: {
    mild: {
      before: "/images/damage-mild-before.jpg",
      after: "/images/damage-mild-after.jpg",
      description: "Cải thiện độ bóng và giảm chẻ ngọn sau 4 tuần điều trị"
    },
    moderate: {
      before: "/images/damage-moderate-before.jpg", 
      after: "/images/damage-moderate-after.jpg",
      description: "Phục hồi cấu trúc tóc và tăng độ đàn hồi sau 6 tuần"
    },
    severe: {
      before: "/images/damage-severe-before.jpg",
      after: "/images/damage-severe-after.jpg", 
      description: "Tái tạo hoàn toàn sợi tóc sau 8-10 tuần điều trị chuyên sâu"
    }
  },
  dryness: {
    mild: {
      before: "/images/dryness-mild-before.jpg",
      after: "/images/dryness-mild-after.jpg",
      description: "Tăng độ ẩm và mềm mại sau 3 tuần điều trị"
    },
    moderate: {
      before: "/images/dryness-moderate-before.jpg",
      after: "/images/dryness-moderate-after.jpg", 
      description: "Phục hồi độ ẩm tự nhiên và giảm xơ rối sau 5 tuần"
    },
    severe: {
      before: "/images/dryness-severe-before.jpg",
      after: "/images/dryness-severe-after.jpg",
      description: "Cấp ẩm sâu và tái tạo lớp bảo vệ tự nhiên sau 8 tuần"
    }
  },
  weakness: {
    mild: {
      before: "/images/weakness-mild-before.jpg", 
      after: "/images/weakness-mild-after.jpg",
      description: "Tăng độ dày và sức sống của tóc sau 4 tuần"
    },
    moderate: {
      before: "/images/weakness-moderate-before.jpg",
      after: "/images/weakness-moderate-after.jpg",
      description: "Củng cố sợi tóc và giảm gãy rụng sau 6 tuần"
    },
    severe: {
      before: "/images/weakness-severe-before.jpg",
      after: "/images/weakness-severe-after.jpg", 
      description: "Tái tạo cấu trúc protein và phục hồi sức khỏe tóc sau 10 tuần"
    }
  }
};
