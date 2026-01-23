export interface SystemSettings {
  general: GeneralSettings;
  notifications: NotificationSettings;
  security: SecuritySettings;
}

export interface GeneralSettings {
  systemName: string;
  systemEmail: string;
  systemPhone: string;
  defaultLanguage: string;
  timezone: string;
  dateFormat: string;
  currency: string;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  taskReminders: boolean;
  projectUpdates: boolean;
  systemAlerts: boolean;
}

export interface SecuritySettings {
  sessionTimeout: number;
  passwordExpiration: number;
  maxLoginAttempts: number;
  twoFactorAuth: boolean;
}

export const languageOptions = [
  { value: 'es', label: 'Español' },
  { value: 'en', label: 'English' },
  { value: 'pt', label: 'Português' },
];

export const timezoneOptions = [
  { value: 'America/Argentina/Buenos_Aires', label: 'Buenos Aires (GMT-3)' },
  { value: 'America/Sao_Paulo', label: 'São Paulo (GMT-3)' },
  { value: 'America/Santiago', label: 'Santiago (GMT-3)' },
  { value: 'America/Mexico_City', label: 'Ciudad de México (GMT-6)' },
  { value: 'America/New_York', label: 'Nueva York (GMT-5)' },
];

export const dateFormatOptions = [
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
];

export const currencyOptions = [
  { value: 'ARS', label: 'Peso Argentino (ARS)' },
  { value: 'USD', label: 'Dólar Estadounidense (USD)' },
  { value: 'BRL', label: 'Real Brasileño (BRL)' },
  { value: 'CLP', label: 'Peso Chileno (CLP)' },
  { value: 'MXN', label: 'Peso Mexicano (MXN)' },
];
