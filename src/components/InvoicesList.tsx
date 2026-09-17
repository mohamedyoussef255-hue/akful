import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Receipt,
  CheckCircle2,
  Clock,
  Building,
  CreditCard,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export const InvoicesList: React.FC = () => {
  const { invoices, payInvoice, t, themeConfig } = useApp();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-neutral-900">{t('inv_title')}</h2>
            <p className="text-xs text-neutral-500">{t('inv_desc')}</p>
          </div>
        </div>
      </div>

      {/* Invoices List */}
      {invoices.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-neutral-200 space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
            <Receipt className="w-7 h-7" />
          </div>
          <h4 className="text-base font-bold text-neutral-800">لا توجد فواتير استدامة حالياً</h4>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            تنشأ الفواتير آلياً عند توثيق أي تحويل مالي بواسطة روبوت التحقق الذكي، وتستحق السداد شهرياً عبر فوري وأمان.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {invoices.map((inv) => (
            <div
              key={inv.id}
              className="bg-white rounded-3xl p-5 border border-neutral-200 shadow-2xs hover:shadow-xs transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-neutral-900">{inv.payment_token}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      inv.status === 'PAID'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}
                  >
                    {inv.status === 'PAID' ? t('inv_status_paid') : t('inv_status_unpaid')}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 font-semibold">
                    {inv.category}
                  </span>
                </div>

                <p className="text-xs text-neutral-600">
                  تحويل مباشر موثق بمبلغ: <strong className="text-neutral-900 font-mono">{inv.verified_transfer_amount} ج.م</strong>
                </p>

                <div className="flex items-center gap-3 text-[11px] text-neutral-400 font-mono">
                  <span>الرسم: {inv.fee_amount} ج.م ({inv.fee_percentage}%)</span>
                  <span>•</span>
                  <span>الاستحقاق: {new Date(inv.due_date).toLocaleDateString('ar-EG')}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-neutral-100">
                <div className="text-left rtl:text-left ltr:text-right font-mono">
                  <span className="text-[10px] text-neutral-400 block">قيمة المطالبة</span>
                  <span className="text-base font-black text-amber-700">{inv.fee_amount} ج.م</span>
                </div>

                {inv.status === 'UNPAID' ? (
                  <button
                    onClick={() => payInvoice(inv.id)}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>{t('inv_action_pay')}</span>
                  </button>
                ) : (
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>تمت التسوية</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
