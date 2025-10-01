// Utility functions cho hệ thống nhắc lịch tự động

// Các loại nhắc lịch theo quy trình JOICO
export const REMINDER_TYPES = {
  HOURS_48: '48_hours',
  DAYS_7: '7_days', 
  DAYS_28: '28_days',
  FOLLOW_UP: 'follow_up'
};

// Cấu hình thời gian cho từng loại nhắc lịch
export const REMINDER_TIMING = {
  [REMINDER_TYPES.HOURS_48]: {
    hours: 48,
    name: '48 Giờ Đầu',
    priority: 'high'
  },
  [REMINDER_TYPES.DAYS_7]: {
    days: 7,
    name: 'Kiểm Tra 7 Ngày',
    priority: 'medium'
  },
  [REMINDER_TYPES.DAYS_28]: {
    days: 28,
    name: 'Tái Đánh Giá 28 Ngày',
    priority: 'high'
  },
  [REMINDER_TYPES.FOLLOW_UP]: {
    name: 'Theo Dõi Tùy Chỉnh',
    priority: 'low'
  }
};

// Templates tin nhắn mặc định
export const MESSAGE_TEMPLATES = {
  [REMINDER_TYPES.HOURS_48]: {
    subject: '🌟 Hướng dẫn chăm sóc 48 giờ đầu - Chí Tâm Hair Salon',
    email: `
Chào {{customerName}},

Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ tại Chí Tâm Hair Salon! 

Để đảm bảo hiệu quả tối ưu của liệu trình JOICO DEFY DAMAGE, vui lòng tuân thủ các hướng dẫn sau trong 48 giờ đầu:

🚫 **TRÁNH:**
• Gội đầu trong 24 giờ đầu
• Sử dụng máy sấy, máy duỗi ở nhiệt độ cao
• Buộc tóc quá chặt hoặc sử dụng dây buộc kim loại
• Tiếp xúc với nước biển, nước hồ bơi có clo

✅ **NÊN:**
• Sử dụng sản phẩm JOICO được khuyến nghị
• Ngủ trên gối lụa hoặc satin
• Uống nhiều nước để cung cấp độ ẩm từ bên trong
• Chụp ảnh tóc để theo dõi tiến độ

📱 **Liên hệ ngay nếu có thắc mắc:**
• Hotline: {{salonPhone}}
• Địa chỉ: {{salonAddress}}

Chúng tôi sẽ liên hệ lại sau 7 ngày để theo dõi tình trạng tóc của bạn.

Trân trọng,
Đội ngũ Chí Tâm Hair Salon
    `,
    sms: 'Chào {{customerName}}! Nhắc nhở: Tránh gội đầu trong 24h đầu sau điều trị JOICO. Sử dụng sản phẩm được khuyến nghị. Liên hệ {{salonPhone}} nếu có thắc mắc. - Chí Tâm Hair Salon'
  },

  [REMINDER_TYPES.DAYS_7]: {
    subject: '📸 Kiểm tra tiến độ 7 ngày - Chí Tâm Hair Salon',
    email: `
Chào {{customerName}},

Đã 1 tuần kể từ khi bạn thực hiện liệu trình JOICO DEFY DAMAGE tại salon! 

Để theo dõi hiệu quả điều trị, chúng tôi mong bạn:

📸 **Chụp ảnh tóc hiện tại:**
• Chụp ở ánh sáng tự nhiên
• Góc chụp tương tự ảnh trước điều trị
• Gửi ảnh qua Zalo: {{salonZalo}} hoặc email này

💭 **Chia sẻ cảm nhận:**
• Tóc có mềm mượt hơn không?
• Có giảm tình trạng chẻ ngọn không?
• Màu tóc có bền màu hơn không?

🎁 **Ưu đãi đặc biệt:**
Khách hàng gửi ảnh feedback sẽ được giảm 10% cho lần điều trị tiếp theo!

Chúng tôi sẽ phân tích ảnh và đưa ra lời khuyên cụ thể cho bạn.

Hẹn gặp lại bạn,
Chí Tâm Hair Salon
    `,
    sms: 'Chào {{customerName}}! Đã 1 tuần sau điều trị JOICO. Hãy chụp ảnh tóc hiện tại gửi về {{salonZalo}} để nhận tư vấn + ưu đãi 10%! - Chí Tâm Hair Salon'
  },

  [REMINDER_TYPES.DAYS_28]: {
    subject: '🎯 Tái đánh giá 28 ngày - Đặt lịch hẹn tiếp theo',
    email: `
Chào {{customerName}},

Chúc mừng! Bạn đã hoàn thành 1 tháng chăm sóc tóc với liệu trình JOICO DEFY DAMAGE! 

Đã đến lúc tái đánh giá và lên kế hoạch tiếp theo:

📊 **Đánh giá lại Hair Passport:**
• Đo lại điểm số sức khỏe tóc
• So sánh với kết quả ban đầu
• Cập nhật kế hoạch điều trị

🗓️ **Đặt lịch hẹn ngay:**
• Nhận ưu đãi 15% cho khách hàng thân thiết
• Tư vấn miễn phí với chuyên gia
• Cập nhật Hair Passport mới

📞 **Liên hệ đặt lịch:**
• Hotline: {{salonPhone}}
• Zalo: {{salonZalo}}
• Website: {{salonWebsite}}

⏰ **Khung giờ ưu đãi:**
• Thứ 2-6: 9:00-17:00 (giảm 20%)
• Cuối tuần: 8:00-20:00 (giảm 15%)

Cảm ơn bạn đã tin tưởng đồng hành cùng Chí Tâm Hair Salon!

Trân trọng,
Team Chí Tâm Hair Salon
    `,
    sms: 'Chào {{customerName}}! Đã 1 tháng sau liệu trình JOICO. Đặt lịch tái đánh giá ngay để nhận ưu đãi 15%! Gọi {{salonPhone}} hoặc nhắn {{salonZalo}}. - Chí Tâm Hair Salon'
  },

  [REMINDER_TYPES.FOLLOW_UP]: {
    subject: '💌 Lời nhắc từ Chí Tâm Hair Salon',
    email: `
Chào {{customerName}},

Đây là lời nhắc từ Chí Tâm Hair Salon.

{{customMessage}}

Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ:
• Hotline: {{salonPhone}}
• Địa chỉ: {{salonAddress}}

Trân trọng,
Chí Tâm Hair Salon
    `,
    sms: 'Chào {{customerName}}! {{customMessage}} Liên hệ {{salonPhone}} nếu cần hỗ trợ. - Chí Tâm Hair Salon'
  }
};

// Thông tin salon để thay thế trong template
export const SALON_INFO = {
  name: 'Chí Tâm Hair Salon',
  phone: '0123 456 789',
  zalo: '0123456789',
  address: '123 Đường ABC, Quận 1, TP.HCM',
  website: 'https://chitam-hair-salon.com',
  email: 'info@chitam-hair-salon.com'
};

// Tự động tạo nhắc lịch sau khi khách hàng hoàn thành điều trị
export const createAutoReminders = (customerInfo, treatmentDate) => {
  const reminders = [];
  const baseDate = new Date(treatmentDate);

  // 48 giờ sau điều trị
  const reminder48h = {
    id: `${customerInfo.id}_48h_${Date.now()}`,
    customerId: customerInfo.id,
    customerName: customerInfo.name,
    customerPhone: customerInfo.phone,
    customerEmail: customerInfo.email,
    type: REMINDER_TYPES.HOURS_48,
    scheduledDate: new Date(baseDate.getTime() + 48 * 60 * 60 * 1000),
    status: 'scheduled',
    method: 'email',
    priority: 'high',
    createdAt: new Date(),
    treatmentDate: baseDate
  };

  // 7 ngày sau điều trị
  const reminder7d = {
    id: `${customerInfo.id}_7d_${Date.now()}`,
    customerId: customerInfo.id,
    customerName: customerInfo.name,
    customerPhone: customerInfo.phone,
    customerEmail: customerInfo.email,
    type: REMINDER_TYPES.DAYS_7,
    scheduledDate: new Date(baseDate.getTime() + 7 * 24 * 60 * 60 * 1000),
    status: 'scheduled',
    method: 'email',
    priority: 'medium',
    createdAt: new Date(),
    treatmentDate: baseDate
  };

  // 28 ngày sau điều trị
  const reminder28d = {
    id: `${customerInfo.id}_28d_${Date.now()}`,
    customerId: customerInfo.id,
    customerName: customerInfo.name,
    customerPhone: customerInfo.phone,
    customerEmail: customerInfo.email,
    type: REMINDER_TYPES.DAYS_28,
    scheduledDate: new Date(baseDate.getTime() + 28 * 24 * 60 * 60 * 1000),
    status: 'scheduled',
    method: 'email',
    priority: 'high',
    createdAt: new Date(),
    treatmentDate: baseDate
  };

  reminders.push(reminder48h, reminder7d, reminder28d);
  return reminders;
};

// Thay thế variables trong template
export const replaceTemplateVariables = (template, customerInfo, customMessage = '') => {
  let message = template;
  
  // Thay thế thông tin khách hàng
  message = message.replace(/{{customerName}}/g, customerInfo.name || 'Quý khách');
  message = message.replace(/{{customerPhone}}/g, customerInfo.phone || '');
  message = message.replace(/{{customerEmail}}/g, customerInfo.email || '');
  
  // Thay thế thông tin salon
  message = message.replace(/{{salonName}}/g, SALON_INFO.name);
  message = message.replace(/{{salonPhone}}/g, SALON_INFO.phone);
  message = message.replace(/{{salonZalo}}/g, SALON_INFO.zalo);
  message = message.replace(/{{salonAddress}}/g, SALON_INFO.address);
  message = message.replace(/{{salonWebsite}}/g, SALON_INFO.website);
  message = message.replace(/{{salonEmail}}/g, SALON_INFO.email);
  
  // Thay thế custom message
  message = message.replace(/{{customMessage}}/g, customMessage);
  
  return message;
};

// Lấy template theo loại nhắc lịch
export const getMessageTemplate = (type, method = 'email') => {
  const template = MESSAGE_TEMPLATES[type];
  if (!template) return null;
  
  return {
    subject: template.subject,
    message: template[method] || template.email
  };
};

// Kiểm tra nhắc lịch quá hạn
export const isReminderOverdue = (scheduledDate, status) => {
  return status === 'scheduled' && new Date(scheduledDate) < new Date();
};

// Lấy danh sách nhắc lịch cần gửi
export const getPendingReminders = (reminders) => {
  const now = new Date();
  return reminders.filter(reminder => 
    reminder.status === 'scheduled' && 
    new Date(reminder.scheduledDate) <= now
  );
};

// Sắp xếp nhắc lịch theo độ ưu tiên
export const sortRemindersByPriority = (reminders) => {
  const priorityOrder = { high: 3, medium: 2, low: 1 };
  
  return reminders.sort((a, b) => {
    const aPriority = priorityOrder[a.priority] || 1;
    const bPriority = priorityOrder[b.priority] || 1;
    
    if (aPriority !== bPriority) {
      return bPriority - aPriority; // High priority first
    }
    
    // Nếu cùng priority, sắp xếp theo thời gian
    return new Date(a.scheduledDate) - new Date(b.scheduledDate);
  });
};

// Tạo báo cáo thống kê nhắc lịch
export const generateReminderStats = (reminders) => {
  const total = reminders.length;
  const scheduled = reminders.filter(r => r.status === 'scheduled').length;
  const sent = reminders.filter(r => r.status === 'sent').length;
  const failed = reminders.filter(r => r.status === 'failed').length;
  const overdue = reminders.filter(r => isReminderOverdue(r.scheduledDate, r.status)).length;
  
  // Thống kê theo loại
  const byType = {};
  Object.values(REMINDER_TYPES).forEach(type => {
    byType[type] = reminders.filter(r => r.type === type).length;
  });
  
  // Thống kê theo phương thức
  const byMethod = {
    email: reminders.filter(r => r.method === 'email').length,
    sms: reminders.filter(r => r.method === 'sms').length,
    push: reminders.filter(r => r.method === 'push').length
  };
  
  return {
    total,
    scheduled,
    sent,
    failed,
    overdue,
    byType,
    byMethod,
    successRate: total > 0 ? Math.round((sent / total) * 100) : 0
  };
};

// Validate thông tin nhắc lịch
export const validateReminder = (reminder) => {
  const errors = [];
  
  if (!reminder.customerName?.trim()) {
    errors.push('Tên khách hàng không được để trống');
  }
  
  if (!reminder.scheduledDate) {
    errors.push('Ngày giờ gửi không được để trống');
  } else if (new Date(reminder.scheduledDate) < new Date()) {
    errors.push('Ngày giờ gửi phải trong tương lai');
  }
  
  if (!Object.values(REMINDER_TYPES).includes(reminder.type)) {
    errors.push('Loại nhắc lịch không hợp lệ');
  }
  
  if (!['email', 'sms', 'push'].includes(reminder.method)) {
    errors.push('Phương thức gửi không hợp lệ');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Export tất cả functions
export default {
  REMINDER_TYPES,
  REMINDER_TIMING,
  MESSAGE_TEMPLATES,
  SALON_INFO,
  createAutoReminders,
  replaceTemplateVariables,
  getMessageTemplate,
  isReminderOverdue,
  getPendingReminders,
  sortRemindersByPriority,
  generateReminderStats,
  validateReminder
};
