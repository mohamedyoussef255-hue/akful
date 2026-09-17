import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Role, User } from '../types';
import {
  X,
  HeartHandshake,
  Building2,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Lock,
  Mail,
  User as UserIcon,
  Phone,
  FileText,
} from 'lucide-react';

export const MultiRoleAuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    setCurrentUser,
    setActiveTab,
    t,
    themeConfig,
  } = useApp();

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [selectedRole, setSelectedRole] = useState<Role>('SPONSOR');

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState<'EG' | 'SA'>('EG');
  const [nationalId, setNationalId] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [regulatoryAuthority, setRegulatoryAuthority] = useState('وزارة التضامن الاجتماعي المصرية');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  // Preset demo personas for fast switching & evaluation
  const DEMO_PERSONAS: { role: Role; name: string; email: string; desc: string }[] = [
    {
      role: 'SPONSOR',
      name: 'أحمد بن عبد العزيز المحمود',
      email: 'ahmed.sponsor@ekfel.org',
      desc: 'كفيل ورجل أعمال (المملكة العربية السعودية)',
    },
    {
      role: 'CARE_HOME',
      name: 'دار الأمل للأيتام والرعاية',
      email: 'dar.alamal@ekfel.org',
      desc: 'دار أيتام مرخصة رسمياً برقم ترخيص EGY-MOSS-8829',
    },
    {
      role: 'BENEFICIARY',
      name: 'مريم محمود كمال (طالبة)',
      email: 'mariam.student@ekfel.org',
      desc: 'طالبة هندسة موثقة بالرقم القومي: 29910150102948',
    },
    {
      role: 'ADMIN',
      name: 'م. محمد يوسف (الإدارة العامة)',
      email: 'mohamedyoussef255@gmail.com',
      desc: 'إدارة المنصة والإشراف الفني ومكافحة الاحتيال',
    },
  ];

  const handleSelectDemoPersona = (persona: typeof DEMO_PERSONAS[0]) => {
    const u: User = {
      id: `user_${persona.role.toLowerCase()}_${Date.now()}`,
      email: persona.email,
      full_name: persona.name,
      role: persona.role,
      country: persona.role === 'SPONSOR' ? 'SA' : 'EG',
      phone_number: '+201000000000',
      national_id: persona.role === 'BENEFICIARY' ? '29910150102948' : undefined,
      license_number: persona.role === 'CARE_HOME' ? 'EGY-MOSS-8829-2021' : undefined,
      regulatory_authority: persona.role === 'CARE_HOME' ? 'وزارة التضامن الاجتماعي' : undefined,
      created_at: new Date().toISOString(),
    };
    setCurrentUser(u);
    setIsAuthModalOpen(false);
    setActiveTab('dashboard');
  };

  const handleGoogleOAuthSimulation = () => {
    setIsLoading(true);
    setTimeout(() => {
      const u: User = {
        id: `google_oauth_${Date.now()}`,
        email: 'user.oauth@gmail.com',
        full_name: selectedRole === 'CARE_HOME' ? 'جمعية التكافل الخيرية (Google Verified)' : 'مستخدم موثق (Google ID)',
        role: selectedRole,
        country: 'EG',
        phone_number: '+201012345678',
        national_id: selectedRole === 'BENEFICIARY' ? '29801011234567' : undefined,
        license_number: selectedRole === 'CARE_HOME' ? 'LIC-GOOGLE-88190' : undefined,
        created_at: new Date().toISOString(),
      };
      setCurrentUser(u);
      setIsLoading(false);
      setIsAuthModalOpen(false);
      setActiveTab('dashboard');
    }, 600);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const endpoint = authMode === 'login' ? '/api/v1/auth/login' : '/api/v1/auth/register';
      const payload =
        authMode === 'login'
          ? { email: email.trim(), role: selectedRole }
          : {
              email: email.trim(),
              password,
              full_name: fullName.trim(),
              role: selectedRole,
              country,
              phone_number: phone,
              national_id: selectedRole === 'BENEFICIARY' ? nationalId : undefined,
              license_number: selectedRole === 'CARE_HOME' ? licenseNumber : undefined,
              regulatory_authority: selectedRole === 'CARE_HOME' ? regulatoryAuthority : undefined,
            };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'فشلت عملية المصادقة');
      }

      setCurrentUser(data.user);
      setIsAuthModalOpen(false);
      setActiveTab('dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || 'حدث خطأ في الاتصال بالخادم');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-xl border border-neutral-200 overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-neutral-900">{t('auth_title')}</h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              مصادقة متعددة الأدوار (كفلاء، دور رعاية، مستفيدون، إدارة)
            </p>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1.5 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-role Selector Pills */}
        <div className="px-6 pt-4 pb-2">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'SPONSOR', icon: HeartHandshake, label: t('role_sponsor') },
              { id: 'CARE_HOME', icon: Building2, label: t('role_care_home') },
              { id: 'BENEFICIARY', icon: GraduationCap, label: t('role_beneficiary') },
              { id: 'ADMIN', icon: ShieldCheck, label: t('role_admin') },
            ].map((r) => {
              const Icon = r.icon;
              const isSelected = selectedRole === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setSelectedRole(r.id as Role)}
                  className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-xs'
                      : 'border-neutral-200 hover:border-neutral-300 text-neutral-600'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-700' : 'text-neutral-400'}`} />
                  <span className="text-[11px] leading-tight">{r.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Switcher: Login / Register */}
        <div className="px-6 py-2">
          <div className="flex bg-neutral-100 p-1 rounded-xl">
            <button
              onClick={() => setAuthMode('login')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                authMode === 'login' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500'
              }`}
            >
              {t('auth_login_tab')}
            </button>
            <button
              onClick={() => setAuthMode('register')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                authMode === 'register' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500'
              }`}
            >
              {t('auth_register_tab')}
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-3.5">
          {authMode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                {t('auth_field_fullname')}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={selectedRole === 'CARE_HOME' ? 'مثال: جمعية الإحسان لرعاية الأيتام' : 'الاسم الكامل'}
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <UserIcon className="w-4 h-4 text-neutral-400 absolute ltr:right-3 rtl:left-3 top-2.5 pointer-events-none" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              {t('auth_field_email')}
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full px-3.5 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <Mail className="w-4 h-4 text-neutral-400 absolute ltr:right-3 rtl:left-3 top-2.5 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              {t('auth_field_password')}
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <Lock className="w-4 h-4 text-neutral-400 absolute ltr:right-3 rtl:left-3 top-2.5 pointer-events-none" />
            </div>
          </div>

          {/* Explicit Fields For Beneficiaries (National ID) */}
          {authMode === 'register' && selectedRole === 'BENEFICIARY' && (
            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                <CheckCircle2 className="w-4 h-4 text-amber-600" />
                <span>توثيق الهوية الوطنية للمستفيد</span>
              </div>
              <input
                type="text"
                required
                maxLength={14}
                value={nationalId}
                onChange={(e) => setNationalId(e.target.value)}
                placeholder="الرقم القومي (14 رقم) / رقم الهوية الوطنية"
                className="w-full px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-xs font-mono"
              />
              <p className="text-[10px] text-amber-800">
                مطلوب إلزامياً للتحقق من عدم تكرار الحالة والتأكد من أهلية الدعم المباشر.
              </p>
            </div>
          )}

          {/* Explicit Fields For Care Homes (Regulatory License) */}
          {authMode === 'register' && selectedRole === 'CARE_HOME' && (
            <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>بيانات الترخيص الحكومي الرسمي للدار</span>
              </div>
              <input
                type="text"
                required
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                placeholder="رقم الترخيص الوزاري الرسمي (مثال: EGY-MOSS-8829)"
                className="w-full px-3 py-1.5 rounded-lg bg-white border border-blue-300 text-xs font-mono"
              />
              <input
                type="text"
                value={regulatoryAuthority}
                onChange={(e) => setRegulatoryAuthority(e.target.value)}
                placeholder="الجهة المشرفة (وزارة التضامن / الموارد البشرية)"
                className="w-full px-3 py-1.5 rounded-lg bg-white border border-blue-300 text-xs"
              />
            </div>
          )}

          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2.5 rounded-xl text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${themeConfig.primary} ${themeConfig.primaryHover}`}
          >
            {isLoading ? (
              <span>جارٍ المعالجة...</span>
            ) : (
              <>
                <span>{authMode === 'login' ? t('auth_login_tab') : t('auth_register_tab')}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Google OAuth 2.0 Simulation Button */}
        <div className="px-6 pb-4">
          <div className="relative flex items-center justify-center my-2">
            <div className="border-t border-neutral-200 w-full" />
            <span className="bg-white px-3 text-[11px] text-neutral-400 font-medium">أو عبر المنظومة السريعة</span>
          </div>

          <button
            onClick={handleGoogleOAuthSimulation}
            disabled={isLoading}
            className="w-full py-2 px-4 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-700 font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{t('auth_google_sim')}</span>
          </button>
        </div>

        {/* Instant Demo Personas Quick Picker */}
        <div className="bg-neutral-50 px-6 py-4 border-t border-neutral-100">
          <p className="text-[11px] font-bold text-neutral-500 mb-2">
            {t('auth_quick_demo_users')}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {DEMO_PERSONAS.map((p) => (
              <button
                key={p.role}
                onClick={() => handleSelectDemoPersona(p)}
                className="p-2 rounded-xl bg-white border border-neutral-200 hover:border-emerald-500 text-right rtl:text-right ltr:text-left transition-all shadow-2xs group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-800 group-hover:text-emerald-700">
                    {p.name}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-neutral-100 font-semibold text-neutral-600">
                    {p.role}
                  </span>
                </div>
                <p className="text-[10px] text-neutral-400 mt-0.5 truncate">{p.desc}</p>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
