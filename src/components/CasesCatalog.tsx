import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SponsorshipCase, SponsorshipCategory } from '../types';
import {
  HeartHandshake,
  Building,
  GraduationCap,
  Sparkles,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Search,
} from 'lucide-react';

export const CasesCatalog: React.FC = () => {
  const {
    cases,
    t,
    themeConfig,
    setSelectedCaseForSponsorship,
    setActiveTab,
    categoryFees,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCases = cases.filter((c) => {
    const matchesCat = selectedCategory === 'ALL' || c.category === selectedCategory;
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.beneficiary_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleSponsorCase = (c: SponsorshipCase) => {
    setSelectedCaseForSponsorship(c);
    setActiveTab('bot');
  };

  return (
    <div className="space-y-6">
      
      {/* Category Pills & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'ALL', label: 'كافة الحالات' },
            { id: 'Orphans', label: t('cat_orphans') },
            { id: 'Students', label: t('cat_students') },
            { id: 'Patients', label: t('cat_patients') },
            { id: 'Elderly', label: t('cat_elderly') },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? `${themeConfig.primary} text-white shadow-xs`
                  : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث بالاسم أو المدينة..."
            className="w-full px-3.5 py-2 pl-9 rounded-xl bg-white border border-neutral-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute ltr:left-3 rtl:right-3 top-2.5 pointer-events-none" />
        </div>
      </div>

      {/* Cases Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
        {filteredCases.map((caseItem) => {
          const progressPct = Math.min(
            100,
            Math.round((caseItem.current_received / caseItem.target_amount) * 100)
          );
          const feePct = categoryFees[caseItem.category]?.percentage || 2.5;

          return (
            <div
              key={caseItem.id}
              className="bg-white rounded-3xl border border-neutral-200/90 shadow-2xs hover:shadow-md transition-all p-6 flex flex-col justify-between"
            >
              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {caseItem.category}
                    </span>
                    <span className="text-[11px] font-medium text-neutral-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-neutral-400" />
                      <span>{caseItem.city}</span>
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      caseItem.urgency === 'CRITICAL'
                        ? 'bg-rose-100 text-rose-800'
                        : caseItem.urgency === 'HIGH'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-neutral-100 text-neutral-600'
                    }`}
                  >
                    {caseItem.urgency === 'CRITICAL' ? 'حالة حرجة عاجلة' : 'كفالة دورية'}
                  </span>
                </div>

                <h3 className="text-base font-black text-neutral-900 leading-snug mb-2">
                  {caseItem.title}
                </h3>

                <p className="text-xs text-neutral-600 leading-relaxed mb-4">
                  {caseItem.description}
                </p>

                {/* Direct Wallet Information Note */}
                <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/80 mb-4 text-xs space-y-1">
                  <div className="flex items-center justify-between text-neutral-800 font-bold">
                    <span>{caseItem.beneficiary_name}</span>
                    <span className="text-[10px] text-neutral-400 font-mono">
                      {caseItem.country === 'SA' ? '🇸🇦 السعودية' : '🇪🇬 مصر'}
                    </span>
                  </div>
                  <div className="text-neutral-500 flex items-center gap-1 font-mono text-[11px]">
                    <CreditCard className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span className="truncate">{caseItem.direct_wallet_info.account_number}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5 mb-5">
                  <div className="flex justify-between text-xs font-mono font-bold">
                    <span className="text-emerald-700">{caseItem.current_received.toLocaleString()} ج.م تم توفيرها</span>
                    <span className="text-neutral-400">الهدف: {caseItem.target_amount.toLocaleString()} ج.م</span>
                  </div>
                  <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-3">
                <span className="text-[11px] text-neutral-400 font-medium">
                  رسم استدامة المنصة: <strong className="text-neutral-700 font-mono">{feePct}%</strong>
                </span>
                
                <button
                  onClick={() => handleSponsorCase(caseItem)}
                  className={`px-4 py-2 rounded-xl text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 ${themeConfig.primary} ${themeConfig.primaryHover}`}
                >
                  <span>{t('btn_sponsor_now')}</span>
                  <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
