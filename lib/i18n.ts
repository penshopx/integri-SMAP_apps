// lib/i18n.ts
export type Language = 'id' | 'en';

export interface Translations {
  [key: string]: {
    [language in Language]: string;
  };
}

const translations: Translations = {
  // Auth
  'login.title': {
    id: 'Masuk ke IntegriGuide',
    en: 'Login to IntegriGuide',
  },
  'login.email': {
    id: 'Email',
    en: 'Email',
  },
  'login.password': {
    id: 'Kata Sandi',
    en: 'Password',
  },
  'login.button': {
    id: 'Masuk',
    en: 'Login',
  },
  'login.error': {
    id: 'Email atau kata sandi tidak valid',
    en: 'Invalid email or password',
  },
  
  // Dashboard
  'dashboard.title': {
    id: 'Dashboard',
    en: 'Dashboard',
  },
  'dashboard.welcome': {
    id: 'Selamat datang,',
    en: 'Welcome,',
  },
  'dashboard.summary': {
    id: 'Ringkasan',
    en: 'Summary',
  },
  'dashboard.documents': {
    id: 'Dokumen',
    en: 'Documents',
  },
  'dashboard.assessments': {
    id: 'Assessment',
    en: 'Assessments',
  },
  'dashboard.audits': {
    id: 'Audit',
    en: 'Audits',
  },
  
  // Documents
  'documents.title': {
    id: 'Dokumen',
    en: 'Documents',
  },
  'documents.create': {
    id: 'Buat Dokumen',
    en: 'Create Document',
  },
  'documents.search': {
    id: 'Cari dokumen...',
    en: 'Search documents...',
  },
  'documents.type': {
    id: 'Tipe',
    en: 'Type',
  },
  'documents.status': {
    id: 'Status',
    en: 'Status',
  },
  'documents.version': {
    id: 'Versi',
    en: 'Version',
  },
  'documents.lastUpdated': {
    id: 'Terakhir Diperbarui',
    en: 'Last Updated',
  },
  'documents.actions': {
    id: 'Tindakan',
    en: 'Actions',
  },
  
  // ... Tambahkan terjemahan lainnya di sini
};

class I18nService {
  private language: Language = 'id';
  
  setLanguage(lang: Language): void {
    this.language = lang;
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
    }
  }
  
  getLanguage(): Language {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('language') as Language;
      if (savedLang && (savedLang === 'id' || savedLang === 'en')) {
        this.language = savedLang;
      }
    }
    
    return this.language;
  }
  
  translate(key: string, args?: Record<string, string>): string {
    const translation = translations[key]?.[this.language] || key;
    
    if (args) {
      return Object.entries(args).reduce((result, [argKey, argValue]) => {
        return result.replace(new RegExp(`{${argKey}}`, 'g'), argValue);
      }, translation);
    }
    
    return translation;
  }
  
  getAvailableLanguages(): { code: Language; name: string }[] {
    return [
      { code: 'id', name: 'Bahasa Indonesia' },
      { code: 'en', name: 'English' },
    ];
  }
}

const i18nService = new I18nService();
export default i18nService;