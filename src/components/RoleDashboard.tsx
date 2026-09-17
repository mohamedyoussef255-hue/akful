import React from 'react';
import { useApp } from '../context/AppContext';
import {
  HeartHandshake,
  Building2,
  GraduationCap,
  ShieldCheck,
  Zap,
  Receipt,
  MessageSquare,
  Users,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  CreditCard,
} from 'lucide-react';

export const RoleDashboard: React.FC = () => {
  const {
    currentUser,
    cases,
    invoices,
    setActiveTab,
    setIsVaultOpen,
    themeConfig,
    t,
  } = useApp();

  if (!currentUser) return null;

  // 1. SPONSOR DASHBOARD
  if (currentUser.role === 'SPONSOR') {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-neutral-900">{currentUser.full_name}</h2>
              <p className="text-xs text-neutral-500">لوحة الكفيل المباشر • {currentUser.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('bot')}
              className={`px-4 py-2 rounded-xl text-white font-bold text-xs shadow-xs flex items-center gap-1.5 ${themeConfig.primary} ${themeConfig.primaryHover}`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>توثيق تحويل جديد</span>
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className="px-3 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-xs flex items-center gap-1"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>محادثة الدار</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-neutral-200">
            <span className="text-[11px] font-bold text-neutral-400 block mb-1">إجمالي الكفالات المحولة</span>
            <span className="text-2xl font-black text-emerald-800 font-mono">14,500 ج.م</span>
            <p className="text-[10px] text-neutral-500 mt-1">تحويلات مباشرة موثقة عبر انستاباي</p>
          </div>
          <div className="bg-white p-5 rounded-3xl border border-neutral-200">
            <span className="text-[11px] font-bold text-neutral-400 block mb-1">الحالات المكفولة نشطة</span>
            <span className="text-2xl font-black text-neutral-900 font-mono">3 حالات</span>
            <p className="text-[10px] text-neutral-500 mt-1">أيتام، طالبة هندسة، ورعاية مسن</p>
          </div>
          <div className="bg-white p-5 rounded-3xl border border-neutral-200">
            <span className="text-[11px] font-bold text-neutral-400 block mb-1">حالة التوثيق الذكي</span>
            <span className="text-sm font-bold text-emerald-700 flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>معتمد عبر Gemini OCR</span>
            </span>
            <p className="text-[10px] text-neutral-500 mt-1">صفر وساطة مالية، تحويل P2P خالص</p>
          </div>
        </div>

        {/* Active Cases Preview */}
        <div className="bg-white rounded-3xl p-6 border border-neutral-200 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-neutral-900">الحالات التي تساهم في كفالتها حالياً</h3>
            <button
              onClick={() => setActiveTab('cases')}
              className="text-xs font-bold text-emerald-700 hover:underline"
            >
              استعراض كافة الحالات
            </button>
          </div>

          <div className="space-y-3">
            {cases.slice(0, 2).map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-neutral-900">{c.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                      {c.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-0.5">{c.beneficiary_name} • {c.city}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('bot')}
                    className="px-3 py-1.5 rounded-xl bg-white border border-neutral-200 text-xs font-bold text-neutral-700 hover:bg-neutral-100"
                  >
                    رفع إيصال الشهر
                  </button>
                  <button
                    onClick={() => setActiveTab('chat')}
                    className="p-2 rounded-xl bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-100"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 2. CARE HOME DASHBOARD
  if (currentUser.role === 'CARE_HOME') {
    const unpaidInvoices = invoices.filter((i) => i.status === 'UNPAID');
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-neutral-900">{currentUser.full_name}</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200">
                  ترخيص موثق
                </span>
              </div>
              <p className="text-xs text-neutral-500 font-mono">
                رقم الترخيص: {currentUser.license_number || 'EGY-MOSS-8829-2021'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('invoices')}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs shadow-xs flex items-center gap-1.5"
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>سداد فواتير فوري ({unpaidInvoices.length})</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-neutral-200">
            <span className="text-[11px] font-bold text-neutral-400 block mb-1">الحالات المسجلة بالدار</span>
            <span className="text-2xl font-black text-neutral-900 font-mono">42 نزيلاً</span>
            <p className="text-[10px] text-neutral-500 mt-1">سعة الدار الرسمية: 50 نزيلاً</p>
          </div>
          <div className="bg-white p-5 rounded-3xl border border-neutral-200">
            <span className="text-[11px] font-bold text-neutral-400 block mb-1">التحويلات المباشرة المستلمة</span>
            <span className="text-2xl font-black text-emerald-800 font-mono">28,000 ج.م</span>
            <p className="text-[10px] text-neutral-500 mt-1">محافظ انستاباي وفودافون كاش</p>
          </div>
          <div className="bg-white p-5 rounded-3xl border border-neutral-200">
            <span className="text-[11px] font-bold text-neutral-400 block mb-1">رسوم الاستدامة المستحقة</span>
            <span className="text-2xl font-black text-amber-700 font-mono">
              {unpaidInvoices.reduce((acc, i) => acc + i.fee_amount, 0)} ج.م
            </span>
            <p className="text-[10px] text-neutral-500 mt-1">تسدد عبر فوري/أمان لتغطية تكاليف التدقيق</p>
          </div>
        </div>
      </div>
    );
  }

  // 3. BENEFICIARY DASHBOARD
  if (currentUser.role === 'BENEFICIARY') {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-800 flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-neutral-900">{currentUser.full_name}</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                  هوية وطنية موثقة
                </span>
              </div>
              <p className="text-xs text-neutral-500 font-mono">
                الرقم القومي: {currentUser.national_id || '29910150102948'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2 rounded-xl text-white font-bold text-xs shadow-xs flex items-center gap-1.5 ${themeConfig.primary} ${themeConfig.primaryHover}`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>مراسلة الكفيل المباشر</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-neutral-200 space-y-2">
            <span className="text-xs font-bold text-neutral-400">حالة الكفالة الشهرية</span>
            <div className="text-xl font-black text-emerald-700 font-mono">1,500 ج.م / 1,500 ج.م</div>
            <p className="text-xs text-neutral-600">تم اكتمال كفالة هذا الشهر، المصروفات الدراسية مسددة.</p>
          </div>
          <div className="bg-white p-5 rounded-3xl border border-neutral-200 space-y-2">
            <span className="text-xs font-bold text-neutral-400">محفظة الاستلام المباشر</span>
            <div className="text-sm font-bold font-mono text-neutral-800">InstaPay: mariam_eng2026@instapay</div>
            <p className="text-xs text-neutral-500">الأموال تصل فورياً إلى حسابك البنكي/المحفظة دون مرورها بالمنصة.</p>
          </div>
        </div>
      </div>
    );
  }

  // 4. ADMIN DASHBOARD
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-neutral-900">لوحة الإشراف الفني ومكافحة الاحتيال</h2>
            <p className="text-xs text-neutral-500">إشراف المهندس محمد يوسف • إدارة المنصة المركزية</p>
          </div>
        </div>

        <button
          onClick={() => setIsVaultOpen(true)}
          className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-black text-amber-400 font-bold text-xs shadow-md flex items-center gap-1.5"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>فتح الخزنة الخفية (Root Console)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-neutral-200">
          <span className="text-[11px] font-bold text-neutral-400 block mb-1">العمليات الموثقة بالذكاء الاصطناعي</span>
          <span className="text-2xl font-black text-neutral-900 font-mono">1,420 معاملة</span>
          <p className="text-[10px] text-neutral-500 mt-1">نسبة الثقة المتوسطة: 98.6%</p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-neutral-200">
          <span className="text-[11px] font-bold text-neutral-400 block mb-1">محاولات الاحتيال المعترضة (422)</span>
          <span className="text-2xl font-black text-red-600 font-mono">18 محاولة</span>
          <p className="text-[10px] text-neutral-500 mt-1">تكرار رقم مرجعي محظور ذرياً</p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-neutral-200">
          <span className="text-[11px] font-bold text-neutral-400 block mb-1">عوائد الاستدامة المحصلة</span>
          <span className="text-2xl font-black text-emerald-800 font-mono">64,200 ج.م</span>
          <p className="text-[10px] text-neutral-500 mt-1">رسوم الفئات (Orphans, Students, Patients)</p>
        </div>
      </div>
    </div>
  );
};
