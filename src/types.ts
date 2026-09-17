export type Role = 'SPONSOR' | 'CARE_HOME' | 'BENEFICIARY' | 'ADMIN';
export type Locale = 'ar' | 'en';
export type ThemePalette = 'royal-green' | 'deep-sapphire' | 'teal' | 'elegant-maroon';
export type SponsorshipCategory = 'Orphans' | 'Students' | 'Patients' | 'Elderly';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: Role;
  country: 'EG' | 'SA';
  phone_number: string;
  national_id?: string;
  license_number?: string;
  regulatory_authority?: string;
  created_at: string;
}

export interface SponsorshipCase {
  id: string;
  title: string;
  category: SponsorshipCategory;
  beneficiary_name: string;
  beneficiary_id: string;
  care_home_id?: string;
  care_home_name?: string;
  city: string;
  country: 'EG' | 'SA';
  target_amount: number;
  current_received: number;
  monthly_need: number;
  currency: 'EGP' | 'SAR';
  urgency: 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  direct_wallet_info: {
    type: string;
    account_number: string;
  };
}

export interface AutomatedPaymentProof {
  id: string;
  sponsor_id: string;
  case_id: string;
  entity_id: string;
  reference_number: string;
  amount: number;
  currency: string;
  confidence: number;
  payment_channel: string;
  verified_at: string;
}

export interface PlatformInvoice {
  id: string;
  proof_id: string;
  entity_id: string;
  category: string;
  verified_transfer_amount: number;
  fee_percentage: number;
  fee_amount: number;
  currency: string;
  status: 'UNPAID' | 'PAID';
  payment_token: string;
  biller_network: string;
  due_date: string;
  created_at: string;
}

export interface FeatureFlag {
  key: string;
  name: string;
  is_enabled: boolean;
  category: string;
  description: string;
}

export interface SubscriptionTier {
  id: string;
  tier_name: 'SILVER' | 'GOLD' | 'PLATINUM';
  monthly_base_rate: number;
  currency: string;
  features: string[];
  is_active: boolean;
}

export interface ChatMessage {
  id: string;
  sender_id: string;
  sender_name: string;
  recipient_id: string;
  case_id?: string;
  content: string;
  created_at: string;
}

export interface PushNotification {
  id: string;
  title: string;
  message: string;
  type: 'VERIFICATION_SUCCESS' | 'INVOICE_ISSUED' | 'SECURITY_ALERT' | 'INFO';
  timestamp: string;
  payload?: any;
}

export interface ThemeConfig {
  id: ThemePalette;
  nameAr: string;
  nameEn: string;
  primary: string;
  primaryHover: string;
  primaryLight: string;
  accent: string;
  badge: string;
  ring: string;
}

export const THEME_CONFIGS: Record<ThemePalette, ThemeConfig> = {
  'royal-green': {
    id: 'royal-green',
    nameAr: 'الأخضر الملكي (الافتراضي)',
    nameEn: 'Royal Green (Default)',
    primary: 'bg-emerald-800',
    primaryHover: 'hover:bg-emerald-900',
    primaryLight: 'bg-emerald-50 text-emerald-900 border-emerald-200',
    accent: '#065f46',
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    ring: 'focus:ring-emerald-600',
  },
  'deep-sapphire': {
    id: 'deep-sapphire',
    nameAr: 'الياقوت الأزرق الملكي',
    nameEn: 'Deep Sapphire Blue',
    primary: 'bg-blue-800',
    primaryHover: 'hover:bg-blue-900',
    primaryLight: 'bg-blue-50 text-blue-900 border-blue-200',
    accent: '#1e40af',
    badge: 'bg-blue-100 text-blue-800 border-blue-300',
    ring: 'focus:ring-blue-600',
  },
  'teal': {
    id: 'teal',
    nameAr: 'التركواز النقي',
    nameEn: 'Pure Teal',
    primary: 'bg-teal-800',
    primaryHover: 'hover:bg-teal-900',
    primaryLight: 'bg-teal-50 text-teal-900 border-teal-200',
    accent: '#115e59',
    badge: 'bg-teal-100 text-teal-800 border-teal-300',
    ring: 'focus:ring-teal-600',
  },
  'elegant-maroon': {
    id: 'elegant-maroon',
    nameAr: 'العنابي الأنيق',
    nameEn: 'Elegant Maroon',
    primary: 'bg-rose-900',
    primaryHover: 'hover:bg-rose-950',
    primaryLight: 'bg-rose-50 text-rose-900 border-rose-200',
    accent: '#881337',
    badge: 'bg-rose-100 text-rose-800 border-rose-300',
    ring: 'focus:ring-rose-700',
  },
};
