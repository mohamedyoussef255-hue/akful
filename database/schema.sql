-- ============================================================================
-- EKFEL (أكفَل) — Production PostgreSQL 14 Schema
-- Peer-to-Peer Regional Islamic Social Solidarity & Direct Sponsorship Platform
-- Target Regions: Egypt (EG) & Saudi Arabia (SA)
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. ENUM TYPES
-- ----------------------------------------------------------------------------
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('SPONSOR', 'CARE_HOME', 'BENEFICIARY', 'ADMIN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE sponsorship_category AS ENUM ('Orphans', 'Students', 'Patients', 'Elderly');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE invoice_status AS ENUM ('UNPAID', 'PAID', 'OVERDUE', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE case_status AS ENUM ('ACTIVE', 'COMPLETED', 'SUSPENDED', 'UNDER_REVIEW');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ----------------------------------------------------------------------------
-- 2. USERS TABLE (Multi-Role Authentication)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'SPONSOR',
    country VARCHAR(2) NOT NULL CHECK (country IN ('EG', 'SA')),
    phone_number VARCHAR(30),
    avatar_url TEXT,
    -- Beneficiary explicit verification fields
    national_id VARCHAR(30),
    national_id_verified BOOLEAN DEFAULT FALSE,
    -- Care Home explicit regulatory verification fields
    license_number VARCHAR(100),
    regulatory_authority VARCHAR(255),
    license_document_url TEXT,
    license_verified BOOLEAN DEFAULT FALSE,
    -- Audit & Security timestamps
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_national_id ON users(national_id) WHERE national_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_license_number ON users(license_number) WHERE license_number IS NOT NULL;

-- ----------------------------------------------------------------------------
-- 3. CARE HOMES & BENEFICIARIES SPECIFIC ENTITIES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS care_homes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    organization_name VARCHAR(255) NOT NULL,
    official_license_id VARCHAR(100) UNIQUE NOT NULL,
    supervising_ministry VARCHAR(255) NOT NULL, -- e.g., Ministry of Social Solidarity (EG) or Ministry of Human Resources (SA)
    capacity INTEGER NOT NULL DEFAULT 50,
    current_occupancy INTEGER NOT NULL DEFAULT 0,
    address_line TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(2) NOT NULL CHECK (country IN ('EG', 'SA')),
    bank_name VARCHAR(150),
    iban VARCHAR(50),
    vodafone_cash_number VARCHAR(30),
    instapay_handle VARCHAR(100),
    fawry_merchant_code VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS beneficiaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    care_home_id UUID REFERENCES care_homes(id) ON DELETE SET NULL,
    category sponsorship_category NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    national_id VARCHAR(30) UNIQUE NOT NULL,
    age INTEGER,
    gender VARCHAR(10),
    city VARCHAR(100) NOT NULL,
    country VARCHAR(2) NOT NULL CHECK (country IN ('EG', 'SA')),
    monthly_financial_need NUMERIC(12, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'EGP',
    health_condition_notes TEXT,
    academic_stage VARCHAR(100),
    direct_payment_method VARCHAR(50), -- 'Vodafone Cash', 'InstaPay', 'Bank Account'
    payment_identifier VARCHAR(100), -- Phone number, IBAN or InstaPay IPA
    is_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 4. SPONSORSHIP CASES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sponsorship_cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    beneficiary_id UUID REFERENCES beneficiaries(id) ON DELETE CASCADE,
    care_home_id UUID REFERENCES care_homes(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    category sponsorship_category NOT NULL,
    description TEXT NOT NULL,
    target_amount NUMERIC(12, 2) NOT NULL,
    current_received NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(3) NOT NULL DEFAULT 'EGP',
    status case_status NOT NULL DEFAULT 'ACTIVE',
    urgency_level VARCHAR(20) DEFAULT 'MEDIUM', -- LOW, MEDIUM, CRITICAL
    city VARCHAR(100) NOT NULL,
    country VARCHAR(2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 5. DYNAMIC CATEGORY SERVICE FEES (Sustainability Engine)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS category_custom_fees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category sponsorship_category UNIQUE NOT NULL,
    fee_percentage NUMERIC(5, 2) NOT NULL, -- e.g. 2.00%, 2.50%, 3.00%
    min_fee_amount NUMERIC(8, 2) NOT NULL DEFAULT 5.00,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    updated_by VARCHAR(255),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed Default Category Custom Fees
INSERT INTO category_custom_fees (category, fee_percentage, min_fee_amount, description)
VALUES 
    ('Orphans', 2.00, 10.00, 'Orphan direct support operational sustainability fee'),
    ('Students', 2.50, 15.00, 'Education & tuition support fee'),
    ('Patients', 3.00, 20.00, 'Medical treatment, surgical & prescription support fee'),
    ('Elderly', 2.50, 15.00, 'Geriatric care and elderly medical sustenance fee')
ON CONFLICT (category) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 6. AUTOMATED PAYMENT PROOFS (Anti-Fraud Crosscheck Table)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS automated_payment_proofs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sponsor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    case_id UUID NOT NULL REFERENCES sponsorship_cases(id) ON DELETE CASCADE,
    entity_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- Care Home or Beneficiary User
    reference_number VARCHAR(128) UNIQUE NOT NULL, -- STRICT UNIQUE CONSTRAINT FOR ANTI-FRAUD
    amount NUMERIC(12, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'EGP',
    confidence NUMERIC(4, 3) NOT NULL, -- e.g., 0.985
    payment_channel VARCHAR(50) NOT NULL, -- Vodafone Cash, InstaPay, Fawry/Aman, Bank Transfer
    raw_receipt_url TEXT,
    ai_raw_response JSONB,
    verification_status VARCHAR(50) DEFAULT 'VERIFIED',
    verified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Critical Anti-Fraud Index for atomic duplicate lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_payment_proofs_reference_number 
ON automated_payment_proofs(reference_number);

-- ----------------------------------------------------------------------------
-- 7. PLATFORM INVOICES (Automated Billing Network)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS platform_invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    proof_id UUID NOT NULL REFERENCES automated_payment_proofs(id) ON DELETE CASCADE,
    entity_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- Responsible Care Home or Beneficiary
    category sponsorship_category NOT NULL,
    verified_transfer_amount NUMERIC(12, 2) NOT NULL,
    fee_percentage NUMERIC(5, 2) NOT NULL,
    fee_amount NUMERIC(12, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'EGP',
    status invoice_status NOT NULL DEFAULT 'UNPAID',
    payment_token VARCHAR(100) UNIQUE NOT NULL, -- Mirrored Fawry/Aman external token (e.g. FAWRY-892102)
    biller_network VARCHAR(50) NOT NULL DEFAULT 'Fawry/Aman Digital Network',
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_platform_invoices_status ON platform_invoices(status);
CREATE INDEX IF NOT EXISTS idx_platform_invoices_entity ON platform_invoices(entity_id);
CREATE INDEX IF NOT EXISTS idx_platform_invoices_token ON platform_invoices(payment_token);

-- ----------------------------------------------------------------------------
-- 8. REAL-TIME CHAT & MESSAGING
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS chat_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID REFERENCES sponsorship_cases(id) ON DELETE SET NULL,
    participant_one UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    participant_two UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_participants UNIQUE (participant_one, participant_two)
);

CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recipient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_conv ON chat_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created ON chat_messages(created_at);

-- ----------------------------------------------------------------------------
-- 9. INVISIBLE SUPER ADMIN CONFIGURATION TABLES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS platform_feature_flags (
    key VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    category VARCHAR(100) DEFAULT 'CORE',
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO platform_feature_flags (key, name, is_enabled, category, description)
VALUES 
    ('chat_module_enabled', 'Real-time Authenticated Chat', TRUE, 'COMMUNICATION', 'Controls live peer-to-peer websocket messaging'),
    ('auto_verification_enabled', 'Gemini AI Auto-Verify Microservice', TRUE, 'FINTECH', 'Automated receipt verification & anti-fraud crosscheck'),
    ('fawry_invoicing_enabled', 'Fawry/Aman Invoicing Network', TRUE, 'BILLING', 'Simulated utility payment network for sustainability fees'),
    ('strict_anti_fraud_mode', 'Strict Zero-Trust Duplicate Filter', TRUE, 'SECURITY', 'Enforces atomic 422 rejections on reference numbers'),
    ('registration_open', 'Open Beneficiary Registration', TRUE, 'ONBOARDING', 'Allows new beneficiaries to register national ID')
ON CONFLICT (key) DO NOTHING;

CREATE TABLE IF NOT EXISTS subscription_tiers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tier_name VARCHAR(50) UNIQUE NOT NULL, -- SILVER, GOLD, PLATINUM
    monthly_base_rate NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'EGP',
    features TEXT[] NOT NULL DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO subscription_tiers (tier_name, monthly_base_rate, currency, features)
VALUES 
    ('SILVER', 0.00, 'EGP', ARRAY[
        'Standard P2P Direct Sponsorship Matching',
        'Direct Mobile Wallet Integration (Vodafone Cash / InstaPay)',
        'Standard Email & In-App Support',
        'Bi-Monthly Beneficiary Status Updates'
    ]),
    ('GOLD', 149.00, 'EGP', ARRAY[
        'Priority Direct Sponsorship Case Routing',
        'Verified Care Home Official Trust Badge',
        'Automated Monthly PDF Impact Reports',
        'Direct Video Call Verification Coordination',
        'Reduced 0.5% Category Processing Platform Discount'
    ]),
    ('PLATINUM', 349.00, 'EGP', ARRAY[
        'VIP Institutional Sponsorship Concierge',
        'Dedicated Human Field Auditor & Caseworker',
        'Instant Real-Time Bank Swift / IBAN Direct Routing',
        'Zero Categorical Platform Liability Surcharge',
        'Quarterly Audited Financial Statements for Zakat Deductions',
        '24/7 Priority Emergency Medical Hotline'
    ])
ON CONFLICT (tier_name) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 10. SYSTEM AUDIT & PUSH NOTIFICATION LOGS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS notification_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'VERIFICATION_SUCCESS', 'INVOICE_ISSUED', 'SECURITY_ALERT'
    payload JSONB,
    is_delivered BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed Eng. Mohamed Youssef Super Admin Record
INSERT INTO users (
    email, 
    password_hash, 
    full_name, 
    role, 
    country, 
    phone_number,
    is_active
)
VALUES (
    'mohamedyoussef255@gmail.com',
    -- SHA256 hashed 'mohamed2072'
    crypt('mohamed2072', gen_salt('bf')),
    'Eng. Mohamed Youssef',
    'ADMIN',
    'EG',
    '+201000000000',
    TRUE
)
ON CONFLICT (email) DO UPDATE SET 
    role = 'ADMIN',
    full_name = 'Eng. Mohamed Youssef';
