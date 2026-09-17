import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SponsorshipCase } from '../types';
import {
  Sparkles,
  UploadCloud,
  CheckCircle2,
  AlertOctagon,
  ShieldCheck,
  Receipt,
  FileCheck,
  ArrowRight,
  RefreshCw,
  Zap,
  Building,
  CreditCard,
  Send,
} from 'lucide-react';

export const AutoVerifyFintechBot: React.FC = () => {
  const {
    t,
    themeConfig,
    cases,
    currentUser,
    selectedCaseForSponsorship,
    setSelectedCaseForSponsorship,
    categoryFees,
    refreshData,
  } = useApp();

  const [selectedCaseId, setSelectedCaseId] = useState<string>(
    selectedCaseForSponsorship?.id || cases[0]?.id || 'case_001'
  );
  const [paymentChannel, setPaymentChannel] = useState('انستاباي (InstaPay)');
  const [receiptImageBase64, setReceiptImageBase64] = useState<string>('');
  const [receiptFileName, setReceiptFileName] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [errorDetails, setErrorDetails] = useState<any>(null);
  const [lastRefNumber, setLastRefNumber] = useState<string>('');

  const currentCase = cases.find((c) => c.id === selectedCaseId) || cases[0];

  // Preset realistic receipts for rapid testing
  const PRESET_RECEIPTS = [
    {
      id: 'instapay_3500',
      label: 'إيصال انستاباي (3,500 ج.م)',
      channel: 'انستاباي (InstaPay)',
      amount: 3500,
      ref: 'INSTAPAY-TX-2026-988102',
      badge: 'أكثر شيوعاً بمصر',
    },
    {
      id: 'vodafone_1500',
      label: 'إيصال فودافون كاش (1,500 ج.م)',
      channel: 'فودافون كاش (Vodafone Cash)',
      amount: 1500,
      ref: 'VF-CASH-77192834',
      badge: 'محفظة إلكترونية',
    },
    {
      id: 'fawry_850',
      label: 'إيصال كود فوري (850 ج.م)',
      channel: 'فوري باي / أمان',
      amount: 850,
      ref: 'FAWRY-POS-899120',
      badge: 'نقاط بيع أمان',
    },
    {
      id: 'alrajhi_2000',
      label: 'تحويل سريع مصرف الراجحي (2,000 ر.س)',
      channel: 'تحويل بنكي سريع (سريع / IBAN)',
      amount: 2000,
      ref: 'RAJHI-IBAN-4491028',
      badge: 'السعودية',
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setReceiptFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setReceiptImageBase64(result);
    };
    reader.readAsDataURL(file);
  };

  const handleApplyPreset = (preset: typeof PRESET_RECEIPTS[0]) => {
    setPaymentChannel(preset.channel);
    setReceiptFileName(`نموذج_${preset.ref}.jpg`);
    setReceiptImageBase64(
      `data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==#${preset.ref}#${preset.amount}`
    );
  };

  const runVerificationPipeline = async (simulateDuplicateAttack: boolean = false) => {
    setIsProcessing(true);
    setErrorDetails(null);
    setVerificationResult(null);

    const targetCase = currentCase;
    const cat = targetCase?.category || 'Orphans';

    try {
      const res = await fetch('/api/v1/sponsorship/auto-verify-and-bill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sponsor_id: currentUser?.id || 'user_sponsor_01',
          entity_id: targetCase?.care_home_id || targetCase?.beneficiary_id || 'user_carehome_01',
          case_id: targetCase?.id,
          category: cat,
          receipt_base64: receiptImageBase64 || `preset_tx_${Date.now()}`,
          mime_type: 'image/jpeg',
          payment_channel: paymentChannel,
          simulated_duplicate: simulateDuplicateAttack,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Anti-Fraud or other rejection
        setErrorDetails(data);
      } else {
        setVerificationResult(data);
        if (data.proof?.reference_number) {
          setLastRefNumber(data.proof.reference_number);
        }
        await refreshData();
      }
    } catch (err: any) {
      setErrorDetails({
        error: 'NETWORK_FAILURE',
        message: err.message || 'فشل الاتصال بخدمة التحقق والفوترة',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const catFee = categoryFees[currentCase?.category || 'Orphans'] || { percentage: 2.0, minFee: 10 };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Bot Hero Banner */}
      <div className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-neutral-700/60 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('bot_badge')}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
            {t('bot_heading')}
          </h2>

          <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed mb-6">
            {t('bot_desc')}
          </p>

          <div className="flex flex-wrap gap-2 text-[11px] text-neutral-300 font-mono">
            <span className="px-2 py-1 rounded-md bg-neutral-800/80 border border-neutral-700">
              ⚡ نموذج Gemini 2.5 Flash
            </span>
            <span className="px-2 py-1 rounded-md bg-neutral-800/80 border border-neutral-700">
              🛡️ فحص ذري مضاد للاحتيال (Anti-Fraud 422)
            </span>
            <span className="px-2 py-1 rounded-md bg-neutral-800/80 border border-neutral-700">
              🧾 فوترة آلية عبر فوري وأمان
            </span>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-emerald-600/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-amber-600/20 blur-3xl pointer-events-none" />
      </div>

      {/* Control Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Form: Case Selection & Receipt Uploader */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs space-y-5">
          
          {/* Case Selector */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1.5">
              {t('bot_select_case')}
            </label>
            <select
              value={selectedCaseId}
              onChange={(e) => {
                setSelectedCaseId(e.target.value);
                const c = cases.find((item) => item.id === e.target.value);
                if (c) setSelectedCaseForSponsorship(c);
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {cases.map((c) => (
                <option key={c.id} value={c.id}>
                  [{c.category}] {c.title} — {c.beneficiary_name} ({c.city})
                </option>
              ))}
            </select>
          </div>

          {/* Selected Case Summary Pill */}
          {currentCase && (
            <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-neutral-900">{currentCase.title}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                  {currentCase.category}
                </span>
              </div>
              <div className="text-neutral-600 flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-neutral-400" />
                <span>الجهة المستفيدة: {currentCase.care_home_name || currentCase.beneficiary_name}</span>
              </div>
              <div className="text-neutral-600 flex items-center gap-1 font-mono">
                <CreditCard className="w-3.5 h-3.5 text-neutral-400" />
                <span>بيانات التحويل المباشر: {currentCase.direct_wallet_info.account_number}</span>
              </div>
              <div className="pt-1.5 border-t border-neutral-200 flex items-center justify-between text-[11px] text-neutral-500 font-semibold">
                <span>نسبة رسوم الاستدامة لهذه الفئة:</span>
                <span className="text-emerald-700 font-bold font-mono">{catFee.percentage}% (حد أدنى {catFee.minFee} ج.م)</span>
              </div>
            </div>
          )}

          {/* Payment Channel */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1.5">
              {t('bot_payment_channel')}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {['انستاباي (InstaPay)', 'فودافون كاش', 'فوري كاش', 'تحويل بنكي'].map((ch) => (
                <button
                  key={ch}
                  type="button"
                  onClick={() => setPaymentChannel(ch)}
                  className={`p-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                    paymentChannel === ch
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold shadow-2xs'
                      : 'border-neutral-200 hover:border-neutral-300 text-neutral-600'
                  }`}
                >
                  {ch}
                </button>
              ))}
            </div>
          </div>

          {/* Receipt Upload Box */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1.5">
              {t('bot_upload_receipt')}
            </label>
            <div className="relative border-2 border-dashed border-neutral-300 hover:border-emerald-500 rounded-2xl p-4 text-center transition-colors bg-neutral-50/50">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center justify-center gap-1.5">
                <UploadCloud className="w-7 h-7 text-neutral-400" />
                <span className="text-xs font-bold text-neutral-800">
                  {receiptFileName || 'اسحب وأفلت صورة الإيصال هنا أو انقر للاختيار'}
                </span>
                <span className="text-[10px] text-neutral-400 font-mono">
                  يدعم إيصالات محافظ المحمول وفوري والتحويلات البنكية
                </span>
              </div>
            </div>
          </div>

          {/* Preset Receipts for Instant 1-Click Evaluation */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1.5">
              {t('bot_or_choose_preset')}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PRESET_RECEIPTS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="p-2.5 rounded-xl border border-neutral-200 hover:border-emerald-500 text-right rtl:text-right ltr:text-left transition-all bg-white hover:bg-neutral-50 shadow-2xs group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-900 group-hover:text-emerald-700">
                      {preset.label}
                    </span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-neutral-100 text-neutral-600 font-medium">
                      {preset.badge}
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-neutral-400 mt-0.5">
                    المرجع: {preset.ref}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-neutral-100 flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={() => runVerificationPipeline(false)}
              disabled={isProcessing}
              className={`flex-1 py-3 px-4 rounded-xl text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${themeConfig.primary} ${themeConfig.primaryHover}`}
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{t('bot_verifying')}</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>{t('bot_action_verify')}</span>
                </>
              )}
            </button>

            {/* Anti-fraud attack simulator button */}
            <button
              onClick={() => runVerificationPipeline(true)}
              disabled={isProcessing}
              title="يختبر رفض المعاملة المكررة فورياً بكود 422"
              className="py-3 px-4 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <AlertOctagon className="w-4 h-4 text-red-600" />
              <span>{t('bot_action_duplicate_attack')}</span>
            </button>
          </div>
        </div>

        {/* Right Panel: Real-time OCR Results, Invoicing & Anti-fraud Status */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Anti-Fraud Alert Box (422 Error Display) */}
          {errorDetails && (
            <div className="p-5 rounded-3xl bg-red-950 text-white border border-red-700 shadow-xl space-y-3 animate-in shake">
              <div className="flex items-center gap-2 text-red-300 font-bold text-sm">
                <AlertOctagon className="w-5 h-5 text-red-400" />
                <span>تحذير أمني: تم اعتراض العملية (HTTP {errorDetails.status_code || 422})</span>
              </div>
              <p className="text-xs text-red-200 leading-relaxed">
                {errorDetails.message || 'تم اكتشاف محاولة إنفاق مكرر أو تزييف للإيصال.'}
              </p>
              {errorDetails.reference_number && (
                <div className="p-2.5 rounded-xl bg-red-900/80 border border-red-800 font-mono text-xs">
                  <span className="text-red-400 block text-[10px]">الرقم المرجعي المكرر:</span>
                  <span className="text-white font-bold">{errorDetails.reference_number}</span>
                </div>
              )}
              <div className="text-[10px] text-red-400 font-mono pt-1">
                سياسة الأمان: ZERO_TRUST_ANTI_FRAUD_PREVENTION
              </div>
            </div>
          )}

          {/* Successful Verification & Invoicing Result */}
          {verificationResult ? (
            <div className="p-6 rounded-3xl bg-white border border-emerald-200 shadow-md space-y-4 animate-in fade-in">
              <div className="flex items-center gap-2 text-emerald-800 font-black text-base">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>تم توثيق الإيصال واعتماده بنجاح</span>
              </div>

              {/* OCR Details */}
              <div className="space-y-2 p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">{t('bot_ocr_ref')}:</span>
                  <span className="font-mono font-bold text-neutral-900">
                    {verificationResult.extracted.reference_number}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">{t('bot_ocr_amount')}:</span>
                  <span className="font-mono font-bold text-emerald-700 text-sm">
                    {verificationResult.extracted.amount.toLocaleString()} ج.م
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">{t('bot_ocr_conf')}:</span>
                  <span className="font-mono font-bold text-emerald-600">
                    {(verificationResult.extracted.confidence * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Generated Platform Invoice */}
              <div className="space-y-2.5 p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-900">{t('bot_fee_liability')}</span>
                  <span className="px-2 py-0.5 rounded bg-amber-200/80 text-amber-950 font-bold text-[10px]">
                    {verificationResult.invoice.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-neutral-700">
                  <span>نسبة رسم الاستدامة ({verificationResult.invoice.category}):</span>
                  <span className="font-mono font-bold">{verificationResult.invoice.fee_percentage}%</span>
                </div>
                <div className="flex items-center justify-between text-neutral-700">
                  <span>قيمة الفاتورة المستحقة على الدار:</span>
                  <span className="font-mono font-bold text-amber-900 text-sm">
                    {verificationResult.invoice.fee_amount} ج.م
                  </span>
                </div>

                <div className="pt-2 border-t border-amber-200/80">
                  <span className="text-neutral-500 text-[11px] block mb-1">
                    {t('bot_fawry_token')}
                  </span>
                  <div className="p-2 rounded-xl bg-white border border-amber-300 font-mono font-bold text-neutral-900 text-center tracking-wider text-sm flex items-center justify-center gap-2">
                    <Receipt className="w-4 h-4 text-amber-600" />
                    <span>{verificationResult.invoice.payment_token}</span>
                  </div>
                  <span className="text-[10px] text-neutral-500 text-center block mt-1">
                    صالح للسداد خلال 14 يوماً عبر أي ماكينة فوري أو منافذ أمان
                  </span>
                </div>
              </div>

              {/* Live Push Notification Payload Viewer */}
              <div className="p-3.5 rounded-2xl bg-neutral-900 text-white text-xs space-y-1.5 font-mono">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold text-[11px]">
                  <Send className="w-3.5 h-3.5" />
                  <span>{t('bot_push_broadcast')}</span>
                </div>
                <p className="text-[10px] text-neutral-300 leading-tight">
                  تم إرسال إشعار لحظي للكفيل: "Transaction verified, thank you!"
                </p>
                <p className="text-[10px] text-neutral-300 leading-tight">
                  تم إرسال إشعار لحظي للمستفيد: "Direct funding received, invoice issued"
                </p>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-3xl bg-neutral-50 border border-neutral-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-neutral-200/70 text-neutral-400 flex items-center justify-center mx-auto">
                <FileCheck className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-neutral-800">بانتظار رفع الإيصال للتحليل</h4>
              <p className="text-xs text-neutral-500 leading-relaxed">
                بمجرد رفع الإيصال أو اختيار نموذج تجريبي، سيتم استخراج الرقم المرجعي بواسطة Gemini وإصدار الفاتورة المعتمدة آلياً.
              </p>
            </div>
          )}

          {/* Anti-Fraud Security Guarantee Badge */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-emerald-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>ضمان الامتثال الشرعي والقانوني</span>
            </div>
            <p className="text-[11px] text-emerald-800 leading-relaxed">
              المنصة لا تجمع ولا تخزن أموال التبرعات إطلاقاً، والتحويلات تتم من حساب الكفيل مباشرة إلى حساب المستفيد. فواتير المنصة تغطي فقط تكاليف الاستدامة وتدقيق التقارير.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
