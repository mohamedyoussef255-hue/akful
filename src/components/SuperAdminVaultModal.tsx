import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldAlert,
  KeyRound,
  Sliders,
  Layers,
  Percent,
  Receipt,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  X,
  AlertTriangle,
  Lock,
} from 'lucide-react';

export const SuperAdminVaultModal: React.FC = () => {
  const {
    isVaultOpen,
    setIsVaultOpen,
    t,
    locale,
    featureFlags,
    toggleFeatureFlag,
    subscriptionTiers,
    updateTier,
    categoryFees,
    updateCategoryFee,
    invoices,
  } = useApp();

  // Authentication State
  const [email, setEmail] = useState('mohamedyoussef255@gmail.com');
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeVaultTab, setActiveVaultTab] = useState<'features' | 'tiers' | 'fees' | 'invoices'>('features');

  // Tier feature editing temporary state
  const [newFeatureText, setNewFeatureText] = useState<Record<string, string>>({});

  if (!isVaultOpen) return null;

  const handleVaultAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Strict Hardcoded Authentication Verification
    const REQUIRED_EMAIL = 'mohamedyoussef255@gmail.com';
    const REQUIRED_PASS = 'mohamed2072';

    try {
      // Call backend route
      const res = await fetch('/api/v1/admin/vault-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (res.ok && data.authorized) {
        setIsAuthorized(true);
        setErrorMessage('');
      } else {
        // Double-check hardcoded rule
        if (email.trim().toLowerCase() === REQUIRED_EMAIL && password === REQUIRED_PASS) {
          setIsAuthorized(true);
          setErrorMessage('');
        } else {
          setErrorMessage(t('vault_wrong_credentials'));
        }
      }
    } catch (err) {
      // Fallback verification
      if (email.trim().toLowerCase() === REQUIRED_EMAIL && password === REQUIRED_PASS) {
        setIsAuthorized(true);
        setErrorMessage('');
      } else {
        setErrorMessage(t('vault_wrong_credentials'));
      }
    }
  };

  const handleAddFeatureToTier = (tierId: string, currentFeatures: string[]) => {
    const text = newFeatureText[tierId]?.trim();
    if (!text) return;
    const updated = [...currentFeatures, text];
    const targetTier = subscriptionTiers.find((t) => t.id === tierId);
    if (targetTier) {
      updateTier(tierId, targetTier.monthly_base_rate, updated);
      setNewFeatureText((prev) => ({ ...prev, [tierId]: '' }));
    }
  };

  const handleRemoveFeatureFromTier = (tierId: string, currentFeatures: string[], indexToRemove: number) => {
    const updated = currentFeatures.filter((_, idx) => idx !== indexToRemove);
    const targetTier = subscriptionTiers.find((t) => t.id === tierId);
    if (targetTier) {
      updateTier(tierId, targetTier.monthly_base_rate, updated);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl w-full max-w-4xl text-white overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Top Vault Header */}
        <div className="bg-neutral-950 px-6 py-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-tight">{t('vault_title')}</h2>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-red-950/80 text-red-400 border border-red-800">
                  ROOT ACCESS (5-CLICKS)
                </span>
              </div>
              <p className="text-xs text-neutral-400">{t('vault_eng_name')}</p>
            </div>
          </div>

          <button
            onClick={() => {
              setIsVaultOpen(false);
              setIsAuthorized(false);
              setPassword('');
            }}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Vault Body: Either Security Gate or Dashboard */}
        {!isAuthorized ? (
          <div className="p-8 max-w-md mx-auto text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold mb-1">التحقق من هوية الإدارة العليا المركزية</h3>
            <p className="text-xs text-neutral-400 mb-6">
              تم تفعيل الخزنة عبر 5 نقرات متتالية على الشعار. أدخل بيانات الاعتماد الحصرية للمهندس محمد يوسف للمتابعة.
            </p>

            <form onSubmit={handleVaultAuthSubmit} className="space-y-4 text-right rtl:text-right ltr:text-left">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  {t('vault_email_label')}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-800/90 border border-neutral-700 text-white text-sm focus:outline-none focus:border-amber-500 font-mono"
                  placeholder="mohamedyoussef255@gmail.com"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  {t('vault_pass_label')}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-800/90 border border-neutral-700 text-white text-sm focus:outline-none focus:border-amber-500 font-mono"
                  placeholder="••••••••"
                />
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 font-black text-sm transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <KeyRound className="w-4 h-4" />
                <span>{t('vault_login_btn')}</span>
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-neutral-800 text-[11px] text-neutral-500 font-mono">
              CREDENTIALS GATE: mohamedyoussef255@gmail.com / mohamed2072
            </div>
          </div>
        ) : (
          <div>
            {/* Navigation Tabs */}
            <div className="flex border-b border-neutral-800 bg-neutral-950/60 px-6 gap-2 overflow-x-auto text-xs font-semibold">
              <button
                onClick={() => setActiveVaultTab('features')}
                className={`py-3 px-4 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
                  activeVaultTab === 'features'
                    ? 'border-amber-500 text-amber-400'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                <Sliders className="w-4 h-4" />
                <span>{t('vault_features_tab')}</span>
              </button>

              <button
                onClick={() => setActiveVaultTab('tiers')}
                className={`py-3 px-4 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
                  activeVaultTab === 'tiers'
                    ? 'border-amber-500 text-amber-400'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>{t('vault_tiers_tab')}</span>
              </button>

              <button
                onClick={() => setActiveVaultTab('fees')}
                className={`py-3 px-4 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
                  activeVaultTab === 'fees'
                    ? 'border-amber-500 text-amber-400'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                <Percent className="w-4 h-4" />
                <span>{t('vault_fees_tab')}</span>
              </button>

              <button
                onClick={() => setActiveVaultTab('invoices')}
                className={`py-3 px-4 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
                  activeVaultTab === 'invoices'
                    ? 'border-amber-500 text-amber-400'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                <Receipt className="w-4 h-4" />
                <span>{t('vault_invoices_tab')}</span>
              </button>
            </div>

            {/* Tab 1: Global Feature Flags CRUD */}
            {activeVaultTab === 'features' && (
              <div className="p-6 space-y-4">
                <div className="text-xs text-neutral-400 mb-2">
                  تحكم لحظي في تفعيل أو إيقاف المكونات الأساسية للنظام دون الحاجة لإعادة نشر الكود.
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {featureFlags.map((flag) => (
                    <div
                      key={flag.key}
                      className="p-4 rounded-xl bg-neutral-800/80 border border-neutral-700/80 flex items-start justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">{flag.name}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-700 text-neutral-300">
                            {flag.category}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-400 mt-1 leading-relaxed">{flag.description}</p>
                        <code className="text-[10px] text-amber-400/80 font-mono mt-1 block">{flag.key}</code>
                      </div>

                      <button
                        onClick={() => toggleFeatureFlag(flag.key, !flag.is_enabled)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 flex items-center gap-1.5 ${
                          flag.is_enabled
                            ? 'bg-emerald-600/90 text-white hover:bg-emerald-700'
                            : 'bg-neutral-700 text-neutral-400 hover:bg-neutral-600'
                        }`}
                      >
                        {flag.is_enabled ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        <span>{flag.is_enabled ? 'مفعل' : 'معطل'}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 2: Subscription Tiers (CRUD - Silver, Gold, Platinum) */}
            {activeVaultTab === 'tiers' && (
              <div className="p-6 space-y-6">
                <div className="text-xs text-neutral-400 mb-2">
                  تعديل باقات الاشتراك (Silver, Gold, Platinum): تحديث الاشتراكات الشهرية، وإضافة أو حذف ميزات الباقة فورياً.
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {subscriptionTiers.map((tier) => (
                    <div
                      key={tier.id}
                      className="p-5 rounded-xl bg-neutral-800/80 border border-neutral-700 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-base font-black text-amber-400 font-mono">{tier.tier_name}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-700 text-neutral-300">
                            {tier.currency}
                          </span>
                        </div>

                        {/* Monthly Base Rate Editing */}
                        <div className="mb-4">
                          <label className="block text-xs text-neutral-400 mb-1">{t('vault_monthly_rate')}</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={tier.monthly_base_rate}
                              onChange={(e) =>
                                updateTier(tier.id, Number(e.target.value) || 0, tier.features)
                              }
                              className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-white text-sm font-bold font-mono"
                            />
                            <span className="text-xs text-neutral-400">{tier.currency}</span>
                          </div>
                        </div>

                        {/* Features Array Strings List */}
                        <div className="space-y-2 mb-4">
                          <label className="block text-xs text-neutral-400">قائمة ميزات الباقة:</label>
                          {tier.features.map((feat, idx) => (
                            <div
                              key={idx}
                              className="p-2 rounded-lg bg-neutral-900/90 border border-neutral-700/60 text-xs flex items-center justify-between gap-2"
                            >
                              <span className="text-neutral-200 leading-snug">{feat}</span>
                              <button
                                onClick={() => handleRemoveFeatureFromTier(tier.id, tier.features, idx)}
                                className="text-neutral-500 hover:text-red-400 p-1 shrink-0"
                                title="حذف الميزة"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Add New Feature Input */}
                      <div className="pt-3 border-t border-neutral-700">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder={t('vault_add_feature')}
                            value={newFeatureText[tier.id] || ''}
                            onChange={(e) =>
                              setNewFeatureText({ ...newFeatureText, [tier.id]: e.target.value })
                            }
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleAddFeatureToTier(tier.id, tier.features);
                              }
                            }}
                            className="flex-1 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-xs text-white"
                          />
                          <button
                            onClick={() => handleAddFeatureToTier(tier.id, tier.features)}
                            className="p-2 rounded-lg bg-amber-500 text-neutral-950 font-bold hover:bg-amber-600 transition-colors"
                            title="إضافة"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Dynamic Category Service Fees */}
            {activeVaultTab === 'fees' && (
              <div className="p-6 space-y-4">
                <div className="text-xs text-neutral-400 mb-2">
                  تعديل نسب رسوم الاستدامة التشغيلية للخدمة لكل فئة (Orphans 2.0%, Students 2.5%, Patients 3.0%, Elderly 2.5%).
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries(categoryFees).map(([category, feeDataRaw]) => {
                    const feeData = feeDataRaw as { percentage: number; minFee: number; description: string };
                    return (
                    <div
                      key={category}
                      className="p-4 rounded-xl bg-neutral-800/80 border border-neutral-700 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-amber-400">{category}</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-neutral-700 font-mono">
                          {feeData.percentage}%
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 leading-snug">{feeData.description}</p>

                      <div>
                        <label className="block text-[11px] text-neutral-400 mb-1">النسبة المئوية (%)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={feeData.percentage}
                          onChange={(e) =>
                            updateCategoryFee(category, Number(e.target.value) || 0, feeData.minFee)
                          }
                          className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-white font-mono text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-neutral-400 mb-1">الحد الأدنى للرسم (ج.م)</label>
                        <input
                          type="number"
                          value={feeData.minFee}
                          onChange={(e) =>
                            updateCategoryFee(category, feeData.percentage, Number(e.target.value) || 0)
                          }
                          className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-white font-mono text-sm"
                        />
                      </div>
                    </div>
                  );
                  })}
                </div>
              </div>
            )}

            {/* Tab 4: Platform Invoices & Anti-Fraud Liabilities Audit */}
            {activeVaultTab === 'invoices' && (
              <div className="p-6 space-y-4">
                <div className="text-xs text-neutral-400 mb-2">
                  سجل الفواتير الصادرة آلياً لدور الرعاية والمستفيدين لسداد رسوم الاستدامة عبر شبكة فوري وأمان.
                </div>
                {invoices.length === 0 ? (
                  <div className="text-center py-8 text-neutral-500 text-xs">
                    لا توجد فواتير منشأة حالياً. قم برفع إيصال تحويل تجريبي عبر روبوت التحقق لإنشاء فاتورة فورياً.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-right rtl:text-right ltr:text-left">
                      <thead className="bg-neutral-800 text-neutral-400">
                        <tr>
                          <th className="p-2.5">رقم الفاتورة</th>
                          <th className="p-2.5">الفئة</th>
                          <th className="p-2.5">قيمة التحويل الموثق</th>
                          <th className="p-2.5">رسم المنصة</th>
                          <th className="p-2.5">رمز سداد فوري/أمان</th>
                          <th className="p-2.5">الحالة</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-800">
                        {invoices.map((inv) => (
                          <tr key={inv.id} className="hover:bg-neutral-800/40 font-mono">
                            <td className="p-2.5 text-neutral-300">{inv.id}</td>
                            <td className="p-2.5 text-white font-sans">{inv.category}</td>
                            <td className="p-2.5 font-bold text-white">{inv.verified_transfer_amount} ج.م</td>
                            <td className="p-2.5 text-amber-400 font-bold">{inv.fee_amount} ج.م ({inv.fee_percentage}%)</td>
                            <td className="p-2.5 text-emerald-400 font-bold">{inv.payment_token}</td>
                            <td className="p-2.5">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-sans font-bold ${
                                  inv.status === 'PAID'
                                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                    : 'bg-amber-950 text-amber-300 border border-amber-800'
                                }`}
                              >
                                {inv.status === 'PAID' ? 'مسددة' : 'UNPAID'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="bg-neutral-950 px-6 py-3 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-500 font-mono">
          <span>AUTHORIZED SESSION: Eng. Mohamed Youssef</span>
          <button
            onClick={() => setIsVaultOpen(false)}
            className="px-4 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-semibold transition-colors"
          >
            {t('vault_close')}
          </button>
        </div>
      </div>
    </div>
  );
};
