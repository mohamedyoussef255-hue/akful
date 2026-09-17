import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { CasesCatalog } from './components/CasesCatalog';
import { AutoVerifyFintechBot } from './components/AutoVerifyFintechBot';
import { RealTimeChat } from './components/RealTimeChat';
import { InvoicesList } from './components/InvoicesList';
import { RoleDashboard } from './components/RoleDashboard';
import { SuperAdminVaultModal } from './components/SuperAdminVaultModal';
import { MultiRoleAuthModal } from './components/MultiRoleAuthModal';
import { NotificationToast } from './components/NotificationToast';
import {
  ShieldCheck,
  Zap,
  Receipt,
  Users,
  MessageSquare,
  Sparkles,
  Heart,
  Lock,
} from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeTab, setActiveTab, t, locale, themeConfig, currentUser, setIsVaultOpen } = useApp();

  return (
    <div className={`min-h-screen bg-neutral-50/70 text-neutral-900 font-sans flex flex-col selection:bg-emerald-100 selection:text-emerald-950`}>
      {/* Top Header */}
      <Header />

      {/* Hero Solidarity Banner (Pure P2P Compliance Statement) */}
      <div className="bg-neutral-900 text-white border-b border-neutral-800 py-2.5 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-right rtl:sm:text-right ltr:sm:text-left">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="font-medium text-neutral-200">
              {locale === 'ar'
                ? 'بوابة التكافل المباشر (P2P): المنصة لا تجمع ولا تخزن أموال التبرعات إطلاقاً، والتحويلات مباشرة من حساب الكفيل إلى المستفيد.'
                : 'Direct P2P Solidarity Gateway: EKFEL NEVER pools, stores, or holds donation capitals.'}
            </span>
          </div>
          <div className="flex items-center gap-3 text-neutral-400 font-mono text-[11px]">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>{locale === 'ar' ? 'توثيق Gemini Flash' : 'Gemini Flash Verified'}</span>
            </span>
            <span>•</span>
            <span className="text-amber-300 font-bold">
              {locale === 'ar' ? 'فواتير فوري وأمان' : 'Fawry & Aman Network'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'cases' && <CasesCatalog />}
        {activeTab === 'bot' && <AutoVerifyFintechBot />}
        {activeTab === 'chat' && <RealTimeChat />}
        {activeTab === 'invoices' && <InvoicesList />}
        {activeTab === 'dashboard' && <RoleDashboard />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-neutral-200/80 py-6 px-4 text-xs text-neutral-500 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-lg ${themeConfig.primary} text-white flex items-center justify-center font-bold text-xs`}>
              ك
            </div>
            <span className="font-bold text-neutral-800">
              {t('app_title')} — {locale === 'ar' ? 'منظومة التكافل والكفالة الإقليمية' : 'Regional Islamic Solidarity'}
            </span>
          </div>

          <div className="flex items-center gap-4 text-neutral-400 text-[11px]">
            <span>مصر 🇪🇬 • المملكة العربية السعودية 🇸🇦</span>
            <span>•</span>
            <span>نموذج P2P غير وصائي (Non-Custodial)</span>
          </div>

          <button
            onClick={() => setIsVaultOpen(true)}
            className="text-[11px] text-neutral-400 hover:text-neutral-700 transition-colors flex items-center gap-1 font-mono"
            title="إدارة النظام (5 نقرات على الشعار بالأعلى)"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Root Console Access</span>
          </button>
        </div>
      </footer>

      {/* Modals & Real-Time Alert Toasts */}
      <SuperAdminVaultModal />
      <MultiRoleAuthModal />
      <NotificationToast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
