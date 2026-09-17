import { Locale } from './types';

export const TRANSLATIONS: Record<Locale, Record<string, string>> = {
  ar: {
    app_title: 'أكفَل',
    app_tagline: 'منصة التكافل الاجتماعي والرعاية المباشرة (P2P)',
    app_subtitle: 'ربط مباشر بين الكفلاء ودور الرعاية والمستفيدين في مصر والسعودية بدون وسطاء أموال',
    
    // Roles
    role_sponsor: 'كفيل / متبرع',
    role_care_home: 'دار رعاية معتمدة',
    role_beneficiary: 'مستفيد مباشر',
    role_admin: 'الإدارة العامة',
    
    // Navigation
    nav_cases: 'حالات الكفالة',
    nav_verify_bot: 'روبوت التحقق الذكي',
    nav_chat: 'المحادثات الموثقة',
    nav_invoices: 'فواتير الاستدامة',
    nav_dashboard: 'لوحة التحكم',
    nav_switch_role: 'تبديل الحساب التجريبي',
    nav_logout: 'تسجيل خروج',
    nav_login_register: 'دخول / تسجيل',

    // Themes
    theme_palette_changer: 'لوحة ألوان بانتون',
    theme_royal_green: 'الأخضر الملكي',
    theme_deep_sapphire: 'الياقوت الأزرق',
    theme_teal: 'التركواز النقي',
    theme_elegant_maroon: 'العنابي الأنيق',

    // Categories
    cat_orphans: 'أيتام',
    cat_students: 'طلاب علم',
    cat_patients: 'مرضى وحالات حرجة',
    cat_elderly: 'مسنّون وكبار السن',

    // Hidden Admin Portal
    vault_title: 'بوابة الإدارة العليا الخفية',
    vault_eng_name: 'المهندس محمد يوسف (Super Admin)',
    vault_badge: 'حماية مقيدة بـ 5 نقرات متتالية',
    vault_email_label: 'البريد الإلكتروني للإدارة العليا',
    vault_pass_label: 'كلمة المرور الأمنية',
    vault_login_btn: 'الولوج إلى الخزنة المركزية',
    vault_wrong_credentials: 'بيانات غير مصرح بها. الوصول مخصص حصرياً للمهندس محمد يوسف.',
    vault_features_tab: 'مفاتيح التحكم العامة (Feature Flags)',
    vault_tiers_tab: 'باقات الاشتراك (Tiers CRUD)',
    vault_fees_tab: 'رسوم الاستدامة حسب الفئات (Category Fees)',
    vault_invoices_tab: 'مراقبة فواتير المنصة والالتزامات',
    vault_monthly_rate: 'الاشتراك الشهري الأساسي',
    vault_add_feature: 'إضافة ميزة جديدة للباقة',
    vault_close: 'إغلاق الخزنة',

    // Multi-role Auth
    auth_title: 'منظومة الدخول والتسجيل المتعددة',
    auth_login_tab: 'تسجيل الدخول',
    auth_register_tab: 'إنشاء حساب جديد موثق',
    auth_field_fullname: 'الاسم الكامل / اسم المنشأة',
    auth_field_email: 'البريد الإلكتروني',
    auth_field_password: 'كلمة المرور',
    auth_field_phone: 'رقم الهاتف / محفظة الهاتف',
    auth_field_country: 'الدولة (مصر / السعودية)',
    auth_field_national_id: 'الرقم القومي (للمستفيدين)',
    auth_field_license: 'رقم الترخيص الحكومي الرسمي (لدور الرعاية)',
    auth_field_authority: 'الجهة الوزارية المشرفة (وزارة التضامن / الموارد البشرية)',
    auth_google_sim: 'تسجيل سريع عبر حساب Google OAuth (محاكاة آمنة)',
    auth_quick_demo_users: 'دخول سريع بحسابات جاهزة للاختبار:',

    // Verification Bot
    bot_badge: 'روبوت التوثيق الآلي والفوترة بدون وسطاء',
    bot_heading: 'التحقق الذكي من إيصالات التحويل عبر Gemini',
    bot_desc: 'يقوم الذكاء الاصطناعي بفحص صور الإيصالات (فودافون كاش، انستاباي، فوري، بنك) فورياً واستخراج الرقم المرجعي والمبلغ لمنع الاحتيال واحتساب رسوم الاستدامة وإصدار فاتورة فوري/أمان للمستفيد.',
    bot_select_case: 'اختر الحالة المكفولة',
    bot_payment_channel: 'وسيلة التحويل المستخدمة',
    bot_upload_receipt: 'ارفع صورة الإيصال (PNG, JPG, WebP)',
    bot_or_choose_preset: 'أو اختر إيصالاً نموذجياً للاختبار السريع:',
    bot_preset_vodafone: 'إيصال فودافون كاش (1,500 ج.م)',
    bot_preset_instapay: 'إيصال انستاباي (3,500 ج.م)',
    bot_preset_fawry: 'إيصال فوري كاش (850 ج.م)',
    bot_preset_alrajhi: 'إيصال تحويل مصرف الراجحي (2,000 ر.س)',
    bot_action_verify: 'تحليل الإيصال عبر Gemini والتوثيق',
    bot_action_duplicate_attack: '🚨 محاكاة هجوم احتيال بإيصال مكرر (Duplicate Attack)',
    bot_verifying: 'جارٍ فحص الإيصال عبر نموذج Gemini ومطابقة الرقم المرجعي...',
    bot_ocr_ref: 'الرقم المرجعي المستخرج',
    bot_ocr_amount: 'المبلغ المستخرج',
    bot_ocr_conf: 'نسبة الثقة في القراءة',
    bot_cat_fee_calc: 'نسبة رسوم المنصة المستحقة',
    bot_fee_liability: 'قيمة فاتورة الاستدامة الصادرة',
    bot_fawry_token: 'رمز سداد الفاتورة (فوري / أمان)',
    bot_push_broadcast: 'بث إشعارات الويب سوكت اللحظية (Push Alerts)',

    // Chat
    chat_title: 'المحادثة اللحظية المشفرة والموثقة',
    chat_with: 'محادثة مباشرة مع',
    chat_placeholder: 'اكتب رسالتك المباشرة هنا...',
    chat_send: 'إرسال',

    // Invoices
    inv_title: 'فواتير الاستدامة والرسوم الرقمية',
    inv_desc: 'لا تحتفظ المنصة بأموال التبرعات، بل تصدر رموز سداد شهرية (فوري/أمان) لدور الرعاية لسداد رسوم الاستدامة التقنية.',
    inv_status_unpaid: 'غير مسددة (مستحقة)',
    inv_status_paid: 'مسددة بالكامل',
    inv_action_pay: 'سداد عبر فوري / أمان',

    // Actions
    btn_sponsor_now: 'اكفل الحالة الآن',
    btn_save: 'حفظ التعديلات',
    btn_cancel: 'إلغاء',
  },
  en: {
    app_title: 'EKFEL',
    app_tagline: 'Peer-to-Peer Islamic Social Solidarity & Direct Sponsorship',
    app_subtitle: 'Direct bridge connecting sponsors to care homes & beneficiaries in Egypt & Saudi Arabia without pooling funds',
    
    // Roles
    role_sponsor: 'Sponsor / Donor',
    role_care_home: 'Verified Care Home',
    role_beneficiary: 'Direct Beneficiary',
    role_admin: 'General Administration',
    
    // Navigation
    nav_cases: 'Sponsorship Cases',
    nav_verify_bot: 'AI Verification Bot',
    nav_chat: 'Verified Chat',
    nav_invoices: 'Sustainability Invoices',
    nav_dashboard: 'Dashboard',
    nav_switch_role: 'Switch Demo Persona',
    nav_logout: 'Log Out',
    nav_login_register: 'Sign In / Register',

    // Themes
    theme_palette_changer: 'Bantone Palette Changer',
    theme_royal_green: 'Royal Green',
    theme_deep_sapphire: 'Deep Sapphire',
    theme_teal: 'Pure Teal',
    theme_elegant_maroon: 'Elegant Maroon',

    // Categories
    cat_orphans: 'Orphans',
    cat_students: 'Students',
    cat_patients: 'Critical Patients',
    cat_elderly: 'Elderly & Geriatric',

    // Hidden Admin Portal
    vault_title: 'Invisible Super Admin Vault',
    vault_eng_name: 'Eng. Mohamed Youssef (Super Admin)',
    vault_badge: 'Protected by 5 consecutive clicks trigger',
    vault_email_label: 'Super Admin Email',
    vault_pass_label: 'Security Access Password',
    vault_login_btn: 'Unlock Root Vault Console',
    vault_wrong_credentials: 'Unauthorized. Access is strictly granted ONLY to Eng. Mohamed Youssef.',
    vault_features_tab: 'Global Feature Flags',
    vault_tiers_tab: 'Subscription Tiers (CRUD)',
    vault_fees_tab: 'Category Service Fees (Dynamic)',
    vault_invoices_tab: 'Platform Invoices & Liabilities',
    vault_monthly_rate: 'Base Monthly Rate',
    vault_add_feature: 'Add New Tier Feature',
    vault_close: 'Close Vault',

    // Multi-role Auth
    auth_title: 'Multi-Role Identity & Access Management',
    auth_login_tab: 'Sign In',
    auth_register_tab: 'Register New Account',
    auth_field_fullname: 'Full Name / Entity Name',
    auth_field_email: 'Email Address',
    auth_field_password: 'Password',
    auth_field_phone: 'Phone / Mobile Wallet Number',
    auth_field_country: 'Country (Egypt / Saudi Arabia)',
    auth_field_national_id: 'National ID (Beneficiary Verification)',
    auth_field_license: 'Official Regulatory License (Care Home)',
    auth_field_authority: 'Supervising Ministry Authority',
    auth_google_sim: 'Quick Sign In with Google OAuth (Secure Simulation)',
    auth_quick_demo_users: 'Instant Demo Personas for Evaluation:',

    // Verification Bot
    bot_badge: 'Zero-Admin Automated FinTech Bot & Anti-Fraud',
    bot_heading: 'Gemini-Powered Receipt Verification & Invoicing',
    bot_desc: 'AI microservice parses transfer slips (Vodafone Cash, InstaPay, Fawry, Bank) in real time, preventing duplicate fraud and generating Fawry/Aman sustainability invoices.',
    bot_select_case: 'Select Target Sponsorship Case',
    bot_payment_channel: 'Transfer Channel Used',
    bot_upload_receipt: 'Upload Receipt Slip (PNG, JPG, WebP)',
    bot_or_choose_preset: 'Or Select a Preset Realistic Receipt for Instant Testing:',
    bot_preset_vodafone: 'Vodafone Cash Slip (1,500 EGP)',
    bot_preset_instapay: 'InstaPay Slip (3,500 EGP)',
    bot_preset_fawry: 'Fawry Cash Slip (850 EGP)',
    bot_preset_alrajhi: 'Al-Rajhi Bank Slip (2,000 SAR)',
    bot_action_verify: 'Verify Receipt via Gemini & Auto-Bill',
    bot_action_duplicate_attack: '🚨 Simulate Duplicate-Spending Attack (422)',
    bot_verifying: 'Processing receipt with Gemini model and checking anti-fraud registry...',
    bot_ocr_ref: 'Extracted Reference Number',
    bot_ocr_amount: 'Extracted Amount',
    bot_ocr_conf: 'OCR Confidence Score',
    bot_cat_fee_calc: 'Category Platform Service Fee',
    bot_fee_liability: 'Generated Invoice Liability',
    bot_fawry_token: 'Fawry/Aman Payment Token Reference',
    bot_push_broadcast: 'WebSocket Push Alerts Broadcasting',

    // Chat
    chat_title: 'Encrypted Real-Time Authenticated Chat',
    chat_with: 'Direct Dialogue with',
    chat_placeholder: 'Type your secure message here...',
    chat_send: 'Send',

    // Invoices
    inv_title: 'Platform Sustainability Invoices',
    inv_desc: 'The platform never pools donation funds; instead, automated Fawry/Aman invoices are billed to care homes for technology sustainability.',
    inv_status_unpaid: 'UNPAID (Active Liability)',
    inv_status_paid: 'PAID & Settled',
    inv_action_pay: 'Simulate Payment via Fawry/Aman',

    // Actions
    btn_sponsor_now: 'Sponsor Case Directly',
    btn_save: 'Save Changes',
    btn_cancel: 'Cancel',
  },
};
