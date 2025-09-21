import emailjs from '@emailjs/browser';

// EmailJS configuration
const EMAILJS_CONFIG = {
  SERVICE_ID: 'your_service_id', // Cần thay thế bằng Service ID thật từ EmailJS
  TEMPLATE_ID_CUSTOMER: 'template_customer', // Template cho khách hàng
  TEMPLATE_ID_SALON: 'template_salon', // Template cho salon
  PUBLIC_KEY: 'your_public_key' // Public key từ EmailJS
};

// Initialize EmailJS
emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);

export class EmailService {
  // Send email to customer after consultation
  static async sendCustomerEmail(customerData, consultationData) {
    try {
      const templateParams = {
        customer_name: customerData.name,
        customer_email: customerData.email,
        customer_phone: customerData.phone,
        consultation_date: new Date().toLocaleDateString('vi-VN'),
        salon_name: 'CHÍ TÂM Hair Salon',
        salon_phone: '0938 987 733',
        salon_address: '14-16-18 Lê Thị Riêng, P.Bến Thành, TP.HCM',
        hair_condition: consultationData.customerInfo.currentIssues.join(', '),
        recommended_treatments: consultationData.customerInfo.previousTreatments.join(', '),
        next_appointment: consultationData.passport.nextAppointment || 'Sẽ liên hệ sớm',
        // Thêm thông tin chi tiết tư vấn
        hair_goals: consultationData.customerInfo.hairGoals.join(', '),
        expectations_today: consultationData.customerInfo.expectations.today,
        expectations_two_weeks: consultationData.customerInfo.expectations.twoWeeks,
        expectations_one_month: consultationData.customerInfo.expectations.oneMonth
      };

      const response = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID_CUSTOMER,
        templateParams
      );

      console.log('Customer email sent successfully:', response);
      return { success: true, response };
    } catch (error) {
      console.error('Error sending customer email:', error);
      return { success: false, error };
    }
  }

  // Send email to salon staff after consultation
  static async sendSalonEmail(customerData, consultationData) {
    try {
      const templateParams = {
        customer_name: customerData.name,
        customer_phone: customerData.phone,
        customer_email: customerData.email,
        customer_birthday: customerData.birthday ? new Date(customerData.birthday).toLocaleDateString('vi-VN') : 'Chưa có',
        customer_gender: customerData.gender === 'male' ? 'Nam' : customerData.gender === 'female' ? 'Nữ' : 'Chưa có',
        consultation_date: new Date().toLocaleDateString('vi-VN'),
        consultation_time: new Date().toLocaleTimeString('vi-VN'),
        
        // Thông tin tư vấn chi tiết
        previous_treatments: consultationData.customerInfo.previousTreatments.join(', '),
        heat_usage: consultationData.customerInfo.heatUsageFrequency,
        hair_goals: consultationData.customerInfo.hairGoals.join(', '),
        current_issues: consultationData.customerInfo.currentIssues.join(', '),
        
        // Kỳ vọng khách hàng
        expectations_today: consultationData.customerInfo.expectations.today,
        expectations_two_weeks: consultationData.customerInfo.expectations.twoWeeks,
        expectations_one_month: consultationData.customerInfo.expectations.oneMonth,
        
        // Chẩn đoán tóc
        hair_elasticity: consultationData.diagnosis.elasticity,
        hair_porosity: consultationData.diagnosis.porosityTest,
        hair_strength: consultationData.diagnosis.strength,
        
        // Liệu trình đề xuất
        priority_treatments: consultationData.treatment.priority.join(', '),
        longterm_treatments: consultationData.treatment.longTerm.join(', '),
        
        // Hộ chiếu tóc
        services_used: consultationData.passport.servicesUsed.join(', '),
        improvement_percentage: consultationData.passport.improvementPercentage,
        home_care_plan: consultationData.passport.homeCarePlan.join(', '),
        next_appointment: consultationData.passport.nextAppointment
      };

      const response = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID_SALON,
        templateParams
      );

      console.log('Salon email sent successfully:', response);
      return { success: true, response };
    } catch (error) {
      console.error('Error sending salon email:', error);
      return { success: false, error };
    }
  }

  // Send both emails after consultation completion
  static async sendConsultationEmails(customerData, consultationData) {
    const results = {
      customer: { success: false },
      salon: { success: false }
    };

    // Send email to customer (if they have email)
    if (customerData.email) {
      results.customer = await this.sendCustomerEmail(customerData, consultationData);
    }

    // Send email to salon
    results.salon = await this.sendSalonEmail(customerData, consultationData);

    return results;
  }

  // Generate consultation summary for email
  static generateConsultationSummary(consultationData) {
    return {
      customerInfo: consultationData.customerInfo,
      diagnosis: consultationData.diagnosis,
      treatment: consultationData.treatment,
      passport: consultationData.passport,
      completedAt: new Date().toISOString()
    };
  }
}

// Email templates configuration guide
export const EMAIL_SETUP_GUIDE = {
  steps: [
    "1. Đăng ký tài khoản tại https://www.emailjs.com/",
    "2. Tạo Email Service (Gmail, Outlook, etc.)",
    "3. Tạo 2 Email Templates:",
    "   - Template cho khách hàng: Cảm ơn và tóm tắt tư vấn",
    "   - Template cho salon: Thông tin chi tiết khách hàng mới",
    "4. Copy Service ID, Template IDs, và Public Key",
    "5. Cập nhật EMAILJS_CONFIG trong file này",
    "6. Test gửi email"
  ],
  templateVariables: {
    customer: [
      "{{customer_name}}", "{{customer_email}}", "{{customer_phone}}",
      "{{consultation_date}}", "{{salon_name}}", "{{salon_phone}}",
      "{{salon_address}}", "{{hair_condition}}", "{{recommended_treatments}}",
      "{{next_appointment}}", "{{hair_goals}}", "{{expectations_today}}",
      "{{expectations_two_weeks}}", "{{expectations_one_month}}"
    ],
    salon: [
      "{{customer_name}}", "{{customer_phone}}", "{{customer_email}}",
      "{{customer_birthday}}", "{{customer_gender}}", "{{consultation_date}}",
      "{{consultation_time}}", "{{previous_treatments}}", "{{heat_usage}}",
      "{{hair_goals}}", "{{current_issues}}", "{{expectations_today}}",
      "{{expectations_two_weeks}}", "{{expectations_one_month}}",
      "{{hair_elasticity}}", "{{hair_porosity}}", "{{hair_strength}}",
      "{{priority_treatments}}", "{{longterm_treatments}}", "{{services_used}}",
      "{{improvement_percentage}}", "{{home_care_plan}}", "{{next_appointment}}"
    ]
  }
};
