import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { THEME_CONFIGS, ThemePalette } from '../types';
import {
  Globe,
  Palette,
  Bell,
  ShieldCheck,
  UserCheck,
  LogOut,
  Sparkles,
  ChevronDown,
  Building2,
  HeartHandshake,
  GraduationCap,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    locale,
    setLocale,
    t,
    theme,
    setTheme,
    themeConfig,
    currentUser,
    setCurrentUser,
    setIsVaultOpen,
    setIsAuthModalOpen,
    notifications,
    activeTab,
    setActiveTab,
  } = useApp();

  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [logoClickCount, setLogoClickCount] = useState(0);
  const clickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 5-Clicks Hidden Trigger on "أكفَل" Brand Logo
  const handleLogoClick = () => {
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }

    const nextCount = logoClickCount + 1;
    setLogoClickCount(nextCount);

    if (nextCount >= 5) {
      setLogoClickCount(0);
      setIsVaultOpen(true);
    } else {
      clickTimeoutRef.current = setTimeout(() => {
        setLogoClickCount(0);
      }, 1500); // 1.5 seconds window for consecutive clicks
    }
  };

  const getRoleIcon = (role?: string) => {
    switch (role) {
      case 'ADMIN':
        return <ShieldCheck className="w-4 h-4 text-amber-600" />;
      case 'CARE_HOME':
        return <Building2 className="w-4 h-4 text-emerald-600" />;
      case 'BENEFICIARY':
        return <GraduationCap className="w-4 h-4 text-indigo-600" />;
      default:
        return <HeartHandshake className="w-4 h-4 text-teal-600" />;
    }
  };

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case 'ADMIN':
        return t('role_admin');
      case 'CARE_HOME':
        return t('role_care_home');
      case 'BENEFICIARY':
        return t('role_beneficiary');
      default:
        return t('role_sponsor');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 shadow-xs transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Brand Logo with 5-Clicks Hidden Trigger */}
          <div className="flex items-center gap-3">
            <button
              id="brand-logo-trigger"
              onClick={handleLogoClick}
              title={locale === 'ar' ? 'منصة أكفَل للتكافل الاجتماعي' : 'EKFEL Social Solidarity'}
              className="group relative flex items-center gap-2.5 focus:outline-none select-none transition-transform active:scale-95"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-md transition-all duration-300 ${themeConfig.primary}`}
              >
                <span className="text-xl">ك</span>
              </div>
              <div className="text-right rtl:text-right ltr:text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-2xl font-black tracking-tight text-neutral-900 group-hover:text-neutral-700 transition-colors">
                    {t('app_title')}
                  </span>
                  {logoClickCount > 1 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                      {5 - logoClickCount}
                    </span>
                  )}
                </div>
                <p className="text-[11px] font-medium text-neutral-500 hidden sm:block">
                  {locale === 'ar' ? 'بوابة التكافل المباشر (P2P)' : 'Direct P2P Solidarity'}
                </p>
              </div>
            </button>
          </div>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 bg-neutral-100/80 p-1 rounded-xl border border-neutral-200/60">
            <button
              id="nav-tab-cases"
              onClick={() => setActiveTab('cases')}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'cases'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {t('nav_cases')}
            </button>

            <button
              id="nav-tab-bot"
              onClick={() => setActiveTab('bot')}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'bot'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              {t('nav_verify_bot')}
            </button>

            <button
              id="nav-tab-chat"
              onClick={() => setActiveTab('chat')}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'chat'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {t('nav_chat')}
            </button>

            <button
              id="nav-tab-invoices"
              onClick={() => setActiveTab('invoices')}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'invoices'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {t('nav_invoices')}
            </button>

            <button
              id="nav-tab-dashboard"
              onClick={() => setActiveTab('dashboard')}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {t('nav_dashboard')}
            </button>
          </nav>

          {/* Right Action Controls: Themes, Language, User Badge */}
          <div className="flex items-center gap-2">
            
            {/* Bantone Palette Changer */}
            <div className="relative">
              <button
                id="btn-palette-changer"
                onClick={() => {
                  setThemeDropdownOpen(!themeDropdownOpen);
                  setRoleDropdownOpen(false);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-neutral-100 hover:bg-neutral-200/80 text-neutral-800 border border-neutral-200 transition-colors"
                title={t('theme_palette_changer')}
              >
                <div
                  className="w-3 h-3 rounded-full shadow-inner"
                  style={{ backgroundColor: themeConfig.accent }}
                />
                <Palette className="w-3.5 h-3.5 text-neutral-600" />
                <span className="hidden xl:inline">{themeConfig.nameAr.split(' ')[0]}</span>
                <ChevronDown className="w-3 h-3 text-neutral-400" />
              </button>

              {themeDropdownOpen && (
                <div className="absolute ltr:right-0 rtl:left-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-neutral-200 p-1.5 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-2.5 py-1.5 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                    {t('theme_palette_changer')}
                  </div>
                  {(Object.keys(THEME_CONFIGS) as ThemePalette[]).map((paletteKey) => {
                    const cfg = THEME_CONFIGS[paletteKey];
                    const isSelected = theme === paletteKey;
                    return (
                      <button
                        key={paletteKey}
                        onClick={() => {
                          setTheme(paletteKey);
                          setThemeDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium text-right rtl:text-right ltr:text-left transition-colors ${
                          isSelected
                            ? 'bg-neutral-100 text-neutral-900 font-bold'
                            : 'text-neutral-700 hover:bg-neutral-50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3.5 h-3.5 rounded-full shadow-xs"
                            style={{ backgroundColor: cfg.accent }}
                          />
                          <span>{locale === 'ar' ? cfg.nameAr : cfg.nameEn}</span>
                        </div>
                        {isSelected && <span className="text-emerald-600 text-xs">✓</span>}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Global Language Switcher */}
            <button
              id="btn-language-toggle"
              onClick={() => setLocale(locale === 'ar' ? 'en' : 'ar')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-neutral-100 hover:bg-neutral-200/80 text-neutral-800 border border-neutral-200 transition-colors"
              title="Toggle Language (AR / EN)"
            >
              <Globe className="w-3.5 h-3.5 text-neutral-500" />
              <span>{locale === 'ar' ? 'English' : 'عربي'}</span>
            </button>

            {/* Notification Bell with Badge */}
            <button
              id="btn-notifications"
              onClick={() => setActiveTab('invoices')}
              className="relative p-2 rounded-lg text-neutral-600 hover:bg-neutral-100 transition-colors"
              title="الإشعارات اللحظية"
            >
              <Bell className="w-4 h-4" />
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white animate-ping" />
              )}
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
              )}
            </button>

            {/* Authenticated User / Persona Profile */}
            {currentUser ? (
              <div className="relative">
                <button
                  id="btn-user-profile"
                  onClick={() => {
                    setRoleDropdownOpen(!roleDropdownOpen);
                    setThemeDropdownOpen(false);
                  }}
                  className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-xl bg-neutral-100 hover:bg-neutral-200/70 border border-neutral-200 transition-all text-xs"
                >
                  <div className="w-6 h-6 rounded-lg bg-neutral-200 flex items-center justify-center">
                    {getRoleIcon(currentUser.role)}
                  </div>
                  <div className="hidden sm:block text-right rtl:text-right ltr:text-left">
                    <p className="font-bold text-neutral-900 leading-tight truncate max-w-[120px]">
                      {currentUser.full_name}
                    </p>
                    <p className="text-[10px] text-neutral-500 leading-tight">
                      {getRoleLabel(currentUser.role)}
                    </p>
                  </div>
                  <ChevronDown className="w-3 h-3 text-neutral-400" />
                </button>

                {roleDropdownOpen && (
                  <div className="absolute ltr:right-0 rtl:left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-neutral-200 p-2 z-50 animate-in fade-in">
                    <div className="px-3 py-2 border-b border-neutral-100 mb-1">
                      <div className="flex items-center gap-2">
                        {getRoleIcon(currentUser.role)}
                        <span className="font-bold text-xs text-neutral-900">{currentUser.full_name}</span>
                      </div>
                      <p className="text-[11px] text-neutral-500 mt-0.5">{currentUser.email}</p>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-neutral-100 text-neutral-700 font-semibold">
                          {currentUser.country === 'SA' ? '🇸🇦 السعودية' : '🇪🇬 مصر'}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                          {getRoleLabel(currentUser.role)}
                        </span>
                      </div>
                    </div>

                    <button
                      id="btn-switch-account-modal"
                      onClick={() => {
                        setRoleDropdownOpen(false);
                        setIsAuthModalOpen(true);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-neutral-700 hover:bg-neutral-50 text-right rtl:text-right ltr:text-left transition-colors"
                    >
                      <UserCheck className="w-4 h-4 text-neutral-500" />
                      <span>{t('nav_switch_role')}</span>
                    </button>

                    <button
                      id="btn-logout"
                      onClick={() => {
                        setRoleDropdownOpen(false);
                        setCurrentUser(null);
                        setIsAuthModalOpen(true);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 text-right rtl:text-right ltr:text-left transition-colors"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span>{t('nav_logout')}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                id="btn-open-auth-modal"
                onClick={() => setIsAuthModalOpen(true)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold text-white shadow-xs transition-all ${themeConfig.primary} ${themeConfig.primaryHover}`}
              >
                {t('nav_login_register')}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-neutral-100 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('cases')}
            className={`px-2 py-1 rounded-md font-semibold whitespace-nowrap ${
              activeTab === 'cases' ? 'text-neutral-900 bg-neutral-100' : 'text-neutral-500'
            }`}
          >
            {t('nav_cases')}
          </button>
          <button
            onClick={() => setActiveTab('bot')}
            className={`px-2 py-1 rounded-md font-semibold whitespace-nowrap flex items-center gap-1 ${
              activeTab === 'bot' ? 'text-neutral-900 bg-neutral-100' : 'text-neutral-500'
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-500" />
            {t('nav_verify_bot')}
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-2 py-1 rounded-md font-semibold whitespace-nowrap ${
              activeTab === 'chat' ? 'text-neutral-900 bg-neutral-100' : 'text-neutral-500'
            }`}
          >
            {t('nav_chat')}
          </button>
          <button
            onClick={() => setActiveTab('invoices')}
            className={`px-2 py-1 rounded-md font-semibold whitespace-nowrap ${
              activeTab === 'invoices' ? 'text-neutral-900 bg-neutral-100' : 'text-neutral-500'
            }`}
          >
            {t('nav_invoices')}
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-2 py-1 rounded-md font-semibold whitespace-nowrap ${
              activeTab === 'dashboard' ? 'text-neutral-900 bg-neutral-100' : 'text-neutral-500'
            }`}
          >
            {t('nav_dashboard')}
          </button>
        </div>
      </div>
    </header>
  );
};
