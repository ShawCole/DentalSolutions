# Double-Entry Accounting System

This module implements a complete **double-entry bookkeeping system** with accrual-based accounting for the DentalSolutions business simulation.

## Core Principles

### 1. **Double-Entry Bookkeeping**
Every transaction creates **equal debits and credits**:
- **Assets** and **Expenses** have **debit** normal balances (increase with debits)
- **Liabilities**, **Equity**, and **Revenue** have **credit** normal balances (increase with credits)

### 2. **Accounting Equation**
```
Assets = Liabilities + Equity
```

This equation **must always balance** after every transaction.

### 3. **Accrual Accounting**
- **Revenue** is recognized when **earned** (service delivered), not when cash is received
- **Expenses** are recognized when **incurred**, not when cash is paid
- This creates **Accounts Receivable** (money owed to us) and **Deferred Revenue** (money we owe services for)

## Chart of Accounts

### Assets (1000-1999)
- **1000** - Cash
- **1100** - Accounts Receivable
- **1110** - AR - Financing Installments
- **1200** - Prepaid Expenses
- **1300** - Equipment
- **1350** - Accumulated Depreciation

### Liabilities (2000-2999)
- **2000** - Accounts Payable
- **2100** - Accrued Expenses
- **2200** - Deferred Revenue (Booking Deposits)
- **2300** - Notes Payable (Equipment Financing)
- **2400** - Loan Payable

### Equity (3000-3999)
- **3000** - Owner's Equity
- **3100** - Retained Earnings

### Revenue (4000-4999)
- **4000** - Service Revenue
- **4010** - Revenue - Smile Design
- **4020** - Revenue - Implants
- **4030** - Revenue - All-in-4

### Expenses (5000-5999)
- **5000** - Advertising Expense
- **5100** - Commission Expense
- **5200** - Salary Expense
- **5300** - Materials Expense (COGS)
- **5400** - Rent Expense
- **5500** - Utilities Expense
- **5600** - Depreciation Expense
- **5700** - Financing Fee Expense

## Transaction Examples

### Example 1: Patient Books Service with Financing
**Scenario:** Patient books $10,000 Smile Design, pays $3,000 down, finances $7,000

**Journal Entry:**
```
DR: Cash                    $3,000  (Asset increases)
DR: AR - Financing          $7,000  (Asset increases - money owed to us)
    CR: Service Revenue            $10,000  (Revenue increases)
```

**Result:**
- Cash increases by $3,000
- We have $7,000 receivable (to be collected over time)
- Revenue of $10,000 is recognized immediately (accrual accounting)

### Example 2: Receive Installment Payment
**Scenario:** Patient pays $583 monthly installment

**Journal Entry:**
```
DR: Cash                    $583  (Asset increases)
    CR: AR - Financing            $583  (Asset decreases - receivable collected)
```

**Result:**
- Cash increases
- Receivable decreases
- **No revenue** (already recognized when service was delivered)

### Example 3: Booking Deposit
**Scenario:** Patient pays $500 booking deposit

**Journal Entry:**
```
DR: Cash                    $500  (Asset increases)
    CR: Deferred Revenue          $500  (Liability increases - we owe them service)
```

**Result:**
- Cash increases
- Deferred Revenue (liability) increases
- **No revenue yet** (service not delivered)

### Example 4: Equipment Purchase with Financing
**Scenario:** Buy $70,000 tomography machine, pay $35,000 down, finance $35,000

**Journal Entry:**
```
DR: Equipment              $70,000  (Asset increases)
    CR: Cash                      $35,000  (Asset decreases)
    CR: Notes Payable             $35,000  (Liability increases)
```

**Result:**
- Equipment asset increases by full $70,000
- Cash decreases by downpayment
- Notes Payable liability increases by financed amount

## Financial Statements

### 1. Balance Sheet
Shows **financial position** at a point in time:
```
ASSETS
  Current Assets
    Cash
    Accounts Receivable
    AR - Financing
  Fixed Assets
    Equipment
    (Accumulated Depreciation)
  
LIABILITIES
  Current Liabilities
    Deferred Revenue
  Long-term Liabilities
    Notes Payable
    
EQUITY
  Owner's Equity
  Retained Earnings
```

### 2. Income Statement
Shows **profitability** over a period:
```
REVENUE
  Service Revenue
  
EXPENSES
  Advertising
  Commissions
  Salaries
  Materials (COGS)
  Rent
  Utilities
  Depreciation
  Financing Fees
  
NET INCOME = Revenue - Expenses
```

### 3. Cash Flow Statement
Shows **cash movements** over a period:
```
OPERATING ACTIVITIES
  Net Income
  + Depreciation
  - Increase in AR
  + Increase in Deferred Revenue
  
INVESTING ACTIVITIES
  - Equipment Purchases
  
FINANCING ACTIVITIES
  + Loan Proceeds
  - Loan Payments
  
NET CASH FLOW
```

## Usage

```typescript
import { 
  createGeneralLedger, 
  postJournalEntry,
  recordDownpayment,
  recordInstallmentPayment,
  generateBalanceSheet,
  generateIncomeStatement,
  verifyAccountingEquation
} from "@/lib/accounting";

// Initialize ledger with starting cash
const ledger = createGeneralLedger(50000);

// Record a patient service
const entry = recordDownpayment(
  "2025-11-01",
  10000,  // total revenue
  3000,   // downpayment
  7000,   // financing amount
  "smileDesign",
  "patient-123"
);

postJournalEntry(ledger.accounts, entry);
ledger.entries.push(entry);

// Generate financial statements
const balanceSheet = generateBalanceSheet(ledger, "2025-11-30");
const incomeStatement = generateIncomeStatement(ledger, "2025-11-01", "2025-11-30");

// Verify books balance
const check = verifyAccountingEquation(ledger);
console.log(`Books balanced: ${check.balanced}`);
```

## Integration with Simulation

The accounting system will be integrated into `runSimulation.ts` to:
1. Create journal entries for every business event
2. Maintain a general ledger throughout the simulation
3. Generate monthly financial statements
4. Verify accounting equation after each month
5. Provide accurate accrual-based revenue and cash-based cash flow

This ensures the simulation follows **GAAP (Generally Accepted Accounting Principles)** and provides accurate financial reporting.
