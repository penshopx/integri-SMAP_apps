// lib/email-service.ts
interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  attachments?: Array<{
    filename: string;
    content: string | Buffer;
    contentType?: string;
  }>;
}

class EmailService {
  private apiKey: string;
  private fromEmail: string;
  
  constructor() {
    this.apiKey = process.env.EMAIL_API_KEY || '';
    this.fromEmail = process.env.FROM_EMAIL || 'noreply@integriguide.com';
  }
  
  async sendEmail(options: EmailOptions): Promise<boolean> {
    // Dalam aplikasi nyata, ini akan menggunakan layanan email seperti SendGrid, Mailgun, dll.
    // Untuk demo, kita akan mensimulasikan pengiriman email
    
    console.log('Mengirim email:');
    console.log('Dari:', this.fromEmail);
    console.log('Ke:', options.to);
    console.log('Subjek:', options.subject);
    console.log('Konten HTML:', options.html);
    
    // Simulasi delay pengiriman
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return true;
  }
  
  async sendDocumentApprovalRequest(document: any, approver: any): Promise<boolean> {
    const options: EmailOptions = {
      to: approver.email,
      subject: `[IntegriGuide] Permintaan Persetujuan Dokumen: ${document.title}`,
      html: `
        <h1>Permintaan Persetujuan Dokumen</h1>
        <p>Halo ${approver.name},</p>
        <p>Anda telah ditugaskan untuk menyetujui dokumen berikut:</p>
        <ul>
          <li><strong>Judul:</strong> ${document.title}</li>
          <li><strong>Nomor Dokumen:</strong> ${document.documentNumber}</li>
          <li><strong>Versi:</strong> ${document.version}</li>
          <li><strong>Tipe:</strong> ${document.type}</li>
        </ul>
        <p>Silakan login ke IntegriGuide untuk meninjau dan menyetujui dokumen ini.</p>
        <p>
          <a href="https://app.integriguide.com/documents/view/${document.id}" style="background-color: #4CAF50; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px;">
            Tinjau Dokumen
          </a>
        </p>
        <p>Terima kasih,<br>Tim IntegriGuide</p>
      `,
    };
    
    return this.sendEmail(options);
  }
  
  async sendAuditNotification(audit: any, recipients: any[]): Promise<boolean> {
    const options: EmailOptions = {
      to: recipients.map(r => r.email),
      subject: `[IntegriGuide] Jadwal Audit: ${audit.title}`,
      html: `
        <h1>Pemberitahuan Jadwal Audit</h1>
        <p>Halo,</p>
        <p>Audit berikut telah dijadwalkan:</p>
        <ul>
          <li><strong>Judul:</strong> ${audit.title}</li>
          <li><strong>Tipe:</strong> ${audit.type}</li>
          <li><strong>Tanggal Mulai:</strong> ${new Date(audit.startDate).toLocaleDateString('id-ID')}</li>
          <li><strong>Tanggal Selesai:</strong> ${new Date(audit.endDate).toLocaleDateString('id-ID')}</li>
          <li><strong>Lead Auditor:</strong> ${audit.leadAuditor}</li>
        </ul>
        <p>Silakan login ke IntegriGuide untuk melihat detail lengkap audit.</p>
        <p>
          <a href="https://app.integriguide.com/audit/view/${audit.id}" style="background-color: #4CAF50; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px;">
            Lihat Detail Audit
          </a>
        </p>
        <p>Terima kasih,<br>Tim IntegriGuide</p>
      `,
    };
    
    return this.sendEmail(options);
  }
  
  async sendAssessmentReminder(assessment: any, user: any): Promise<boolean> {
    const options: EmailOptions = {
      to: user.email,
      subject: `[IntegriGuide] Pengingat Assessment: ${assessment.title}`,
      html: `
        <h1>Pengingat Assessment</h1>
        <p>Halo ${user.name},</p>
        <p>Ini adalah pengingat bahwa assessment berikut perlu diselesaikan:</p>
        <ul>
          <li><strong>Judul:</strong> ${assessment.title}</li>
          <li><strong>Tenggat Waktu:</strong> ${new Date(assessment.dueDate).toLocaleDateString('id-ID')}</li>
        </ul>
        <p>Silakan login ke IntegriGuide untuk menyelesaikan assessment ini.</p>
        <p>
          <a href="https://app.integriguide.com/assessment/conduct/${assessment.id}" style="background-color: #4CAF50; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px;">
            Lakukan Assessment
          </a>
        </p>
        <p>Terima kasih,<br>Tim IntegriGuide</p>
      `,
    };
    
    return this.sendEmail(options);
  }
  
  async sendWeeklyReport(user: any, reportData: any): Promise<boolean> {
    const options: EmailOptions = {
      to: user.email,
      subject: `[IntegriGuide] Laporan Mingguan SMAP`,
      html: `
        <h1>Laporan Mingguan SMAP</h1>
        <p>Halo ${user.name},</p>
        <p>Berikut adalah ringkasan aktivitas SMAP minggu ini:</p>
        
        <h2>Dokumen</h2>
        <ul>
          <li><strong>Dokumen Baru:</strong> ${reportData.documents.new}</li>
          <li><strong>Dokumen Diperbarui:</strong> ${reportData.documents.updated}</li>
          <li><strong>Dokumen Menunggu Persetujuan:</strong> ${reportData.documents.pendingApproval}</li>
        </ul>
        
        <h2>Audit & Assessment</h2>
        <ul>
          <li><strong>Audit Aktif:</strong> ${reportData.audits.active}</li>
          <li><strong>Temuan Terbuka:</strong> ${reportData.audits.openFindings}</li>
          <li><strong>Assessment Selesai:</strong> ${reportData.assessments.completed}</li>
          <li><strong>Skor Rata-rata:</strong> ${reportData.assessments.averageScore}%</li>
        </ul>
        
        <h2>Risiko & Kepatuhan</h2>
        <ul>
          <li><strong>Risiko Tinggi:</strong> ${reportData.risks.high}</li>
          <li><strong>Risiko Menengah:</strong> ${reportData.risks.medium}</li>
          <li><strong>Risiko Rendah:</strong> ${reportData.risks.low}</li>
          <li><strong>Skor Kepatuhan Keseluruhan:</strong> ${reportData.compliance.overallScore}%</li>
        </ul>
        
        <p>Silakan login ke IntegriGuide untuk melihat laporan lengkap.</p>
        <p>
          <a href="https://app.integriguide.com/monitoring/dashboard" style="background-color: #4CAF50; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px;">
            Lihat Dashboard
          </a>
        </p>
        <p>Terima kasih,<br>Tim IntegriGuide</p>
      `,
    };
    
    return this.sendEmail(options);
  }
}

const emailService = new EmailService();
export default emailService;