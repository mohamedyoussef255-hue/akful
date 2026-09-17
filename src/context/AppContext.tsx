import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { io, Socket } from 'socket.io-client';
import {
  User,
  Locale,
  ThemePalette,
  SponsorshipCase,
  PlatformInvoice,
  PushNotification,
  FeatureFlag,
  SubscriptionTier,
  THEME_CONFIGS,
} from '../types';
import { TRANSLATIONS } from '../locales';

interface AppContextType {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
  theme: ThemePalette;
  setTheme: (th: ThemePalette) => void;
  themeConfig: typeof THEME_CONFIGS['royal-green'];
  currentUser: User | null;
  setCurrentUser: (u: User | null) => void;
  activeTab: 'cases' | 'bot' | 'chat' | 'invoices' | 'dashboard';
  setActiveTab: (tab: 'cases' | 'bot' | 'chat' | 'invoices' | 'dashboard') => void;
  selectedCaseForSponsorship: SponsorshipCase | null;
  setSelectedCaseForSponsorship: (c: SponsorshipCase | null) => void;
  cases: SponsorshipCase[];
  invoices: PlatformInvoice[];
  notifications: PushNotification[];
  removeNotification: (id: string) => void;
  featureFlags: FeatureFlag[];
  subscriptionTiers: SubscriptionTier[];
  categoryFees: Record<string, { percentage: number; minFee: number; description: string }>;
  isVaultOpen: boolean;
  setIsVaultOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  socket: Socket | null;
  refreshData: () => Promise<void>;
  toggleFeatureFlag: (key: string, enabled: boolean) => Promise<void>;
  updateTier: (id: string, rate: number, features: string[]) => Promise<void>;
  updateCategoryFee: (cat: string, pct: number, min: number) => Promise<void>;
  payInvoice: (invId: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

const DEFAULT_USER: User = {
  id: 'user_sponsor_01',
  email: 'ahmed.sponsor@ekfel.org',
  full_name: 'أحمد بن عبد العزيز المحمود',
  role: 'SPONSOR',
  country: 'SA',
  phone_number: '+966501234567',
  created_at: new Date().toISOString(),
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>(() => {
    return (localStorage.getItem('ekfel_locale') as Locale) || 'ar';
  });

  const [theme, setThemeState] = useState<ThemePalette>(() => {
    return (localStorage.getItem('ekfel_theme') as ThemePalette) || 'royal-green';
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const cached = localStorage.getItem('ekfel_current_user');
    return cached ? JSON.parse(cached) : DEFAULT_USER;
  });

  const [activeTab, setActiveTab] = useState<'cases' | 'bot' | 'chat' | 'invoices' | 'dashboard'>('cases');
  const [selectedCaseForSponsorship, setSelectedCaseForSponsorship] = useState<SponsorshipCase | null>(null);

  const [cases, setCases] = useState<SponsorshipCase[]>([]);
  const [invoices, setInvoices] = useState<PlatformInvoice[]>([]);
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>([]);
  const [subscriptionTiers, setSubscriptionTiers] = useState<SubscriptionTier[]>([]);
  const [categoryFees, setCategoryFees] = useState<Record<string, { percentage: number; minFee: number; description: string }>>({
    Orphans: { percentage: 2.0, minFee: 10.0, description: 'رسوم الأيتام' },
    Students: { percentage: 2.5, minFee: 15.0, description: 'رسوم الطلاب' },
    Patients: { percentage: 3.0, minFee: 20.0, description: 'رسوم المرضى' },
    Elderly: { percentage: 2.5, minFee: 15.0, description: 'رسوم المسنين' },
  });

  const [notifications, setNotifications] = useState<PushNotification[]>([]);
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    localStorage.setItem('ekfel_locale', l);
    document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = l;
  };

  const setTheme = (th: ThemePalette) => {
    setThemeState(th);
    localStorage.setItem('ekfel_theme', th);
  };

  const t = (key: string): string => {
    return TRANSLATIONS[locale]?.[key] || key;
  };

  const themeConfig = useMemo(() => {
    return THEME_CONFIGS[theme] || THEME_CONFIGS['royal-green'];
  }, [theme]);

  // Sync user to storage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('ekfel_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('ekfel_current_user');
    }
  }, [currentUser]);

  // Initial fetch
  const refreshData = async () => {
    try {
      const [casesRes, invRes, featRes, tiersRes, feesRes] = await Promise.all([
        fetch('/api/v1/sponsorship/cases').then((r) => r.json()),
        fetch('/api/v1/invoices').then((r) => r.json()),
        fetch('/api/v1/admin/features').then((r) => r.json()),
        fetch('/api/v1/admin/tiers').then((r) => r.json()),
        fetch('/api/v1/admin/category-fees').then((r) => r.json()),
      ]);

      if (Array.isArray(casesRes)) setCases(casesRes);
      if (Array.isArray(invRes)) setInvoices(invRes);
      if (Array.isArray(featRes)) setFeatureFlags(featRes);
      if (Array.isArray(tiersRes)) setSubscriptionTiers(tiersRes);
      if (feesRes && typeof feesRes === 'object') setCategoryFees(feesRes);
    } catch (err) {
      console.warn('Initial data load warning (using in-memory):', err);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Socket.io Real-time connection setup
  useEffect(() => {
    const s = io({
      query: currentUser ? { userId: currentUser.id } : {},
      transports: ['websocket', 'polling'],
    });

    s.on('connect', () => {
      console.log('[Socket.io Connected to EKFEL Server]');
      if (currentUser) {
        s.emit('join_user_room', currentUser.id);
      }
    });

    s.on('push_alert', (payload: any) => {
      console.log('[Push Alert Received via WebSocket]', payload);
      const newNotif: PushNotification = {
        id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        title: payload.title || 'إشعار أمان وتوثيق جديد',
        message: payload.message || '',
        type: payload.type || 'INFO',
        timestamp: new Date().toLocaleTimeString(locale === 'ar' ? 'ar-EG' : 'en-US'),
        payload: payload.payload,
      };
      setNotifications((prev) => [newNotif, ...prev]);
      refreshData();
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, [currentUser?.id]);

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const toggleFeatureFlag = async (key: string, enabled: boolean) => {
    try {
      const res = await fetch(`/api/v1/admin/features/${key}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_enabled: enabled }),
      });
      if (res.ok) {
        setFeatureFlags((prev) =>
          prev.map((f) => (f.key === key ? { ...f, is_enabled: enabled } : f))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateTier = async (id: string, rate: number, features: string[]) => {
    try {
      const res = await fetch(`/api/v1/admin/tiers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ monthly_base_rate: rate, features }),
      });
      if (res.ok) {
        setSubscriptionTiers((prev) =>
          prev.map((t) =>
            t.id === id ? { ...t, monthly_base_rate: rate, features } : t
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateCategoryFee = async (cat: string, pct: number, min: number) => {
    try {
      const res = await fetch(`/api/v1/admin/category-fees/${cat}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ percentage: pct, minFee: min }),
      });
      if (res.ok) {
        setCategoryFees((prev) => ({
          ...prev,
          [cat]: { ...prev[cat], percentage: pct, minFee: min },
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const payInvoice = async (invId: string) => {
    try {
      const res = await fetch(`/api/v1/invoices/${invId}/pay`, { method: 'POST' });
      if (res.ok) {
        setInvoices((prev) =>
          prev.map((inv) => (inv.id === invId ? { ...inv, status: 'PAID' } : inv))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AppContext.Provider
      value={{
        locale,
        setLocale,
        t,
        theme,
        setTheme,
        themeConfig,
        currentUser,
        setCurrentUser,
        activeTab,
        setActiveTab,
        selectedCaseForSponsorship,
        setSelectedCaseForSponsorship,
        cases,
        invoices,
        notifications,
        removeNotification,
        featureFlags,
        subscriptionTiers,
        categoryFees,
        isVaultOpen,
        setIsVaultOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        socket,
        refreshData,
        toggleFeatureFlag,
        updateTier,
        updateCategoryFee,
        payInvoice,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
