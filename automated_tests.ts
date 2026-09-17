/**
 * EKFEL (أكفَل) — Automated Financial Bot & Anti-Fraud Security Test Suite
 * Validates:
 * 1. Categorical dynamic service fee calculation (Orphans 2.0%, Students 2.5%, Patients 3.0%, Elderly 2.5%)
 * 2. Atomic Anti-Fraud duplicate reference lookup returning HTTP 422
 * 3. Platform invoice liability generation with 'UNPAID' status and Fawry/Aman tokens
 * 4. Super Admin Hidden Vault authentication guard for Eng. Mohamed Youssef
 */

import assert from 'node:assert';

// ---------------------------------------------------------------------------
// 1. Types & Simulated Datastore
// ---------------------------------------------------------------------------
interface CategoryFee {
  category: 'Orphans' | 'Students' | 'Patients' | 'Elderly';
  percentage: number;
  minFee: number;
}

const CATEGORY_FEES: Record<string, CategoryFee> = {
  Orphans: { category: 'Orphans', percentage: 2.0, minFee: 10.0 },
  Students: { category: 'Students', percentage: 2.5, minFee: 15.0 },
  Patients: { category: 'Patients', percentage: 3.0, minFee: 20.0 },
  Elderly: { category: 'Elderly', percentage: 2.5, minFee: 15.0 },
};

interface PaymentProofRecord {
  id: string;
  reference_number: string;
  amount: number;
  confidence: number;
  verified_at: string;
}

interface PlatformInvoice {
  id: string;
  proof_id: string;
  entity_id: string;
  category: string;
  verified_transfer_amount: number;
  fee_percentage: number;
  fee_amount: number;
  status: 'UNPAID' | 'PAID';
  payment_token: string;
  biller_network: string;
}

// In-memory mock database table for automated_payment_proofs
const automated_payment_proofs_db = new Map<string, PaymentProofRecord>();
const platform_invoices_db: PlatformInvoice[] = [];

// ---------------------------------------------------------------------------
// 2. Business Logic Implementations Under Test
// ---------------------------------------------------------------------------

/**
 * Calculates platform sustainability service fee dynamically based on category
 */
export function calculatePlatformFee(category: string, amount: number): { feePercentage: number; feeAmount: number } {
  const config = CATEGORY_FEES[category];
  if (!config) {
    throw new Error(`Unknown category: ${category}`);
  }
  const calculatedFee = (amount * config.percentage) / 100;
  const feeAmount = Math.max(calculatedFee, config.minFee);
  return {
    feePercentage: config.percentage,
    feeAmount: Number(feeAmount.toFixed(2)),
  };
}

/**
 * Super Admin Vault Security Gatekeeper
 */
export function verifySuperAdminVaultAuth(email: string, pass: string): boolean {
  const REQUIRED_EMAIL = 'mohamedyoussef255@gmail.com';
  const REQUIRED_PASS = 'mohamed2072';
  return email.trim().toLowerCase() === REQUIRED_EMAIL && pass === REQUIRED_PASS;
}

/**
 * Automated Verification & Billing Microservice Simulation
 */
export function processAutoVerifyAndBill(input: {
  sponsor_id: string;
  entity_id: string;
  category: 'Orphans' | 'Students' | 'Patients' | 'Elderly';
  extracted: {
    reference_number: string;
    amount: number;
    confidence: number;
  };
}) {
  const { sponsor_id, entity_id, category, extracted } = input;

  // 1. Strict Confidence Threshold Check
  if (extracted.confidence < 0.70) {
    return {
      status: 400,
      error: 'LOW_CONFIDENCE_OCR',
      message: 'Image extraction confidence below required threshold (0.70)',
    };
  }

  // 2. Anti-Fraud Atomic Lookup: Double-Spending Prevention
  if (automated_payment_proofs_db.has(extracted.reference_number)) {
    return {
      status: 422,
      error: 'DUPLICATE_TRANSACTION_DETECTED',
      message: `Anti-fraud alert: Reference number ${extracted.reference_number} already exists. Double-spending attempt blocked.`,
    };
  }

  // 3. Commit Payment Proof
  const proofId = `proof_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const proofRecord: PaymentProofRecord = {
    id: proofId,
    reference_number: extracted.reference_number,
    amount: extracted.amount,
    confidence: extracted.confidence,
    verified_at: new Date().toISOString(),
  };
  automated_payment_proofs_db.set(extracted.reference_number, proofRecord);

  // 4. Revenue & Billing Engine (Category custom fee lookup)
  const { feePercentage, feeAmount } = calculatePlatformFee(category, extracted.amount);

  // 5. Commit Platform Invoice with 'UNPAID' liability status and Fawry/Aman token
  const invoiceId = `inv_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const paymentToken = `FAWRY-${Math.floor(100000 + Math.random() * 900000)}`;

  const invoice: PlatformInvoice = {
    id: invoiceId,
    proof_id: proofId,
    entity_id,
    category,
    verified_transfer_amount: extracted.amount,
    fee_percentage: feePercentage,
    fee_amount: feeAmount,
    status: 'UNPAID',
    payment_token: paymentToken,
    biller_network: 'Fawry/Aman Digital Network',
  };
  platform_invoices_db.push(invoice);

  // 6. Push Notification Payloads
  const pushNotifications = [
    {
      target_user_id: sponsor_id,
      event: 'PUSH_NOTIFICATION',
      title: 'تم التحقق من التحويل',
      message: 'Transaction verified, thank you!',
      amount: extracted.amount,
    },
    {
      target_user_id: entity_id,
      event: 'PUSH_NOTIFICATION',
      title: 'استلام كفالة مباشرة',
      message: 'Direct funding received, invoice issued',
      amount: extracted.amount,
      invoice_token: paymentToken,
      fee_due: feeAmount,
    },
  ];

  return {
    status: 200,
    proof: proofRecord,
    invoice,
    pushNotifications,
  };
}

// ---------------------------------------------------------------------------
// 3. Test Runner
// ---------------------------------------------------------------------------
export function runTestSuite() {
  console.log('🧪 Starting EKFEL Automated FinTech & Anti-Fraud Security Test Suite...\n');

  // Test 1: Category Fee Calculations
  console.log('▶ Test 1: Category Fee Math Validation');
  const orphansFee = calculatePlatformFee('Orphans', 2000); // 2% of 2000 = 40
  assert.strictEqual(orphansFee.feePercentage, 2.0);
  assert.strictEqual(orphansFee.feeAmount, 40.0);

  const studentsFee = calculatePlatformFee('Students', 1000); // 2.5% of 1000 = 25
  assert.strictEqual(studentsFee.feePercentage, 2.5);
  assert.strictEqual(studentsFee.feeAmount, 25.0);

  const patientsFee = calculatePlatformFee('Patients', 5000); // 3% of 5000 = 150
  assert.strictEqual(patientsFee.feePercentage, 3.0);
  assert.strictEqual(patientsFee.feeAmount, 150.0);

  const elderlyFee = calculatePlatformFee('Elderly', 1000); // 2.5% of 1000 = 25
  assert.strictEqual(elderlyFee.feePercentage, 2.5);
  assert.strictEqual(elderlyFee.feeAmount, 25.0);

  // Min fee constraint test
  const smallFee = calculatePlatformFee('Orphans', 100); // 2% of 100 = 2, but min fee is 10
  assert.strictEqual(smallFee.feeAmount, 10.0);
  console.log('  ✅ Category fees calculated with mathematical precision.\n');

  // Test 2: First-time Receipt Verification (Happy Path)
  console.log('▶ Test 2: Initial Receipt Verification & Invoicing Pipeline');
  const testRef = 'INSTAPAY-TX-2026-988102';
  const result1 = processAutoVerifyAndBill({
    sponsor_id: 'sponsor-user-001',
    entity_id: 'care-home-user-042',
    category: 'Orphans',
    extracted: {
      reference_number: testRef,
      amount: 3500,
      confidence: 0.985,
    },
  });

  assert.strictEqual(result1.status, 200, 'Initial transaction must return HTTP 200');
  assert.ok(result1.proof, 'Payment proof must be recorded');
  assert.strictEqual(result1.proof.reference_number, testRef);
  assert.ok(result1.invoice, 'Platform invoice must be created');
  assert.strictEqual(result1.invoice.status, 'UNPAID', 'Initial invoice liability must be UNPAID');
  assert.strictEqual(result1.invoice.fee_amount, 70.0, '2% of 3500 must be 70.00 EGP');
  assert.ok(result1.invoice.payment_token.startsWith('FAWRY-'), 'Token must mirror Fawry network');
  assert.strictEqual(result1.pushNotifications?.length, 2, 'Must push alerts to sponsor and care home');
  console.log('  ✅ Initial transaction approved, verified in DB, and UNPAID invoice committed.\n');

  // Test 3: Anti-Fraud Double-Spending Detection (HTTP 422)
  console.log('▶ Test 3: Anti-Fraud Double-Spending Attack Simulation');
  const duplicateAttempt = processAutoVerifyAndBill({
    sponsor_id: 'malicious-attacker-999',
    entity_id: 'care-home-user-042',
    category: 'Orphans',
    extracted: {
      reference_number: testRef, // REUSING THE EXACT SAME REFERENCE NUMBER
      amount: 3500,
      confidence: 0.99,
    },
  });

  assert.strictEqual(
    duplicateAttempt.status,
    422,
    'Duplicate reference submission MUST return HTTP 422 Unprocessable Entity'
  );
  assert.strictEqual(
    duplicateAttempt.error,
    'DUPLICATE_TRANSACTION_DETECTED',
    'Error code must be DUPLICATE_TRANSACTION_DETECTED'
  );
  console.log(`  ✅ Anti-fraud caught duplicate reference "${testRef}". Successfully blocked with HTTP 422.\n`);

  // Test 4: Super Admin Invisible Vault Access
  console.log('▶ Test 4: Super Admin Vault Authentication Gate');
  const validAdmin = verifySuperAdminVaultAuth('mohamedyoussef255@gmail.com', 'mohamed2072');
  assert.strictEqual(validAdmin, true, 'Eng. Mohamed Youssef credentials must be granted access');

  const invalidPass = verifySuperAdminVaultAuth('mohamedyoussef255@gmail.com', 'wrong_pass');
  assert.strictEqual(invalidPass, false, 'Invalid password must be denied');

  const invalidEmail = verifySuperAdminVaultAuth('hacker@domain.com', 'mohamed2072');
  assert.strictEqual(invalidEmail, false, 'Non-admin email must be denied');
  console.log('  ✅ Super Admin Vault strictly authorizes ONLY Eng. Mohamed Youssef.\n');

  console.log('🎉 ALL AUTOMATED TESTS PASSED SUCCESSFULLY (4/4 test suites green).');
}

// Execute tests if run directly
runTestSuite();
