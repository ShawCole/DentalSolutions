import { AccountCode, JournalEntry, JournalLine } from "./types";

let entryCounter = 1000;

/**
 * Generate unique entry ID
 */
function generateEntryId(prefix: string): string {
    return `${prefix}-${entryCounter++}`;
}

/**
 * Record booking deposit received (liability until service delivered)
 * DR: Cash
 * CR: Deferred Revenue
 */
export function recordBookingDeposit(
    date: string,
    amount: number,
    patientId: string
): JournalEntry {
    return {
        id: generateEntryId("DEP"),
        date,
        description: `Booking deposit received from patient ${patientId}`,
        lines: [
            { accountCode: AccountCode.CASH, debit: amount, credit: 0 },
            { accountCode: AccountCode.DEFERRED_REVENUE, debit: 0, credit: amount },
        ],
        metadata: { patientId },
    };
}

/**
 * Record downpayment received (part of revenue recognition)
 * DR: Cash
 * CR: Service Revenue
 * CR: AR - Financing (if financing)
 */
export function recordDownpayment(
    date: string,
    totalRevenue: number,
    downpayment: number,
    financingAmount: number,
    serviceType: "smileDesign" | "implants" | "allIn4",
    patientId: string
): JournalEntry {
    const revenueAccount =
        serviceType === "smileDesign" ? AccountCode.SERVICE_REVENUE_SMILE_DESIGN :
            serviceType === "implants" ? AccountCode.SERVICE_REVENUE_IMPLANTS :
                AccountCode.SERVICE_REVENUE_ALL_IN_4;

    const lines: JournalLine[] = [
        { accountCode: AccountCode.CASH, debit: downpayment, credit: 0, memo: "Downpayment" },
        { accountCode: revenueAccount, debit: 0, credit: totalRevenue, memo: "Service revenue" },
    ];

    if (financingAmount > 0) {
        lines.push({
            accountCode: AccountCode.ACCOUNTS_RECEIVABLE_FINANCING,
            debit: financingAmount,
            credit: 0,
            memo: "Financing installments receivable",
        });
    }

    return {
        id: generateEntryId("REV"),
        date,
        description: `Service revenue and downpayment for ${serviceType}`,
        lines,
        metadata: { patientId, serviceType, totalRevenue, downpayment, financingAmount },
    };
}

/**
 * Record installment payment received
 * DR: Cash
 * CR: AR - Financing
 */
export function recordInstallmentPayment(
    date: string,
    amount: number,
    patientId: string
): JournalEntry {
    return {
        id: generateEntryId("INST"),
        date,
        description: `Installment payment received from patient ${patientId}`,
        lines: [
            { accountCode: AccountCode.CASH, debit: amount, credit: 0 },
            { accountCode: AccountCode.ACCOUNTS_RECEIVABLE_FINANCING, debit: 0, credit: amount },
        ],
        metadata: { patientId },
    };
}

/**
 * Record financing provider fee
 * DR: Financing Fee Expense
 * CR: Cash
 */
export function recordFinancingFee(
    date: string,
    amount: number
): JournalEntry {
    return {
        id: generateEntryId("FEE"),
        date,
        description: "Financing provider fee",
        lines: [
            { accountCode: AccountCode.FINANCING_FEE_EXPENSE, debit: amount, credit: 0 },
            { accountCode: AccountCode.CASH, debit: 0, credit: amount },
        ],
    };
}

/**
 * Record advertising expense
 * DR: Advertising Expense
 * CR: Cash
 */
export function recordAdSpend(
    date: string,
    amount: number,
    campaignId: string
): JournalEntry {
    return {
        id: generateEntryId("AD"),
        date,
        description: `Advertising spend for campaign ${campaignId}`,
        lines: [
            { accountCode: AccountCode.ADVERTISING_EXPENSE, debit: amount, credit: 0 },
            { accountCode: AccountCode.CASH, debit: 0, credit: amount },
        ],
        metadata: { campaignId },
    };
}

/**
 * Record commission payment
 * DR: Commission Expense
 * CR: Cash
 */
export function recordCommission(
    date: string,
    amount: number,
    patientId: string
): JournalEntry {
    return {
        id: generateEntryId("COM"),
        date,
        description: `Sales commission for patient ${patientId}`,
        lines: [
            { accountCode: AccountCode.COMMISSION_EXPENSE, debit: amount, credit: 0 },
            { accountCode: AccountCode.CASH, debit: 0, credit: amount },
        ],
        metadata: { patientId },
    };
}

/**
 * Record salary payment
 * DR: Salary Expense
 * CR: Cash
 */
export function recordSalary(
    date: string,
    amount: number,
    employeeType: string
): JournalEntry {
    return {
        id: generateEntryId("SAL"),
        date,
        description: `Salary payment - ${employeeType}`,
        lines: [
            { accountCode: AccountCode.SALARY_EXPENSE, debit: amount, credit: 0 },
            { accountCode: AccountCode.CASH, debit: 0, credit: amount },
        ],
        metadata: { employeeType },
    };
}

/**
 * Record materials/COGS expense
 * DR: Materials Expense
 * CR: Cash (or Accounts Payable if on credit)
 */
export function recordMaterialsCost(
    date: string,
    amount: number,
    serviceType: string,
    patientId: string
): JournalEntry {
    return {
        id: generateEntryId("MAT"),
        date,
        description: `Materials cost for ${serviceType}`,
        lines: [
            { accountCode: AccountCode.MATERIALS_EXPENSE, debit: amount, credit: 0 },
            { accountCode: AccountCode.CASH, debit: 0, credit: amount },
        ],
        metadata: { serviceType, patientId },
    };
}

/**
 * Record equipment purchase (cash)
 * DR: Equipment
 * CR: Cash
 */
export function recordEquipmentPurchase(
    date: string,
    amount: number,
    description: string
): JournalEntry {
    return {
        id: generateEntryId("CAPEX"),
        date,
        description: `Equipment purchase: ${description}`,
        lines: [
            { accountCode: AccountCode.EQUIPMENT, debit: amount, credit: 0 },
            { accountCode: AccountCode.CASH, debit: 0, credit: amount },
        ],
    };
}

/**
 * Record equipment purchase with financing
 * DR: Equipment
 * CR: Cash (downpayment)
 * CR: Notes Payable (financed amount)
 */
export function recordEquipmentPurchaseFinanced(
    date: string,
    totalCost: number,
    downpayment: number,
    description: string
): JournalEntry {
    const financed = totalCost - downpayment;

    return {
        id: generateEntryId("CAPEX"),
        date,
        description: `Equipment purchase (financed): ${description}`,
        lines: [
            { accountCode: AccountCode.EQUIPMENT, debit: totalCost, credit: 0 },
            { accountCode: AccountCode.CASH, debit: 0, credit: downpayment },
            { accountCode: AccountCode.NOTES_PAYABLE, debit: 0, credit: financed },
        ],
    };
}

/**
 * Record equipment financing payment
 * DR: Notes Payable
 * CR: Cash
 */
export function recordEquipmentPayment(
    date: string,
    amount: number
): JournalEntry {
    return {
        id: generateEntryId("LOAN"),
        date,
        description: "Equipment financing payment",
        lines: [
            { accountCode: AccountCode.NOTES_PAYABLE, debit: amount, credit: 0 },
            { accountCode: AccountCode.CASH, debit: 0, credit: amount },
        ],
    };
}

/**
 * Record fixed cost payment (rent, utilities, etc.)
 * DR: Rent/Utilities Expense
 * CR: Cash
 */
export function recordFixedCost(
    date: string,
    amount: number,
    expenseType: "rent" | "utilities" | "other",
    description: string
): JournalEntry {
    const accountCode =
        expenseType === "rent" ? AccountCode.RENT_EXPENSE :
            expenseType === "utilities" ? AccountCode.UTILITIES_EXPENSE :
                AccountCode.RENT_EXPENSE; // Default to rent for "other"

    return {
        id: generateEntryId("FIXED"),
        date,
        description: `Fixed cost: ${description}`,
        lines: [
            { accountCode, debit: amount, credit: 0 },
            { accountCode: AccountCode.CASH, debit: 0, credit: amount },
        ],
    };
}

/**
 * Record startup loan proceeds
 * DR: Cash
 * CR: Loan Payable
 */
export function recordStartupLoanProceeds(
    date: string,
    amount: number
): JournalEntry {
    return {
        id: generateEntryId("LOAN-INIT"),
        date,
        description: "Startup loan proceeds",
        lines: [
            { accountCode: AccountCode.CASH, debit: amount, credit: 0 },
            { accountCode: AccountCode.LOAN_PAYABLE, debit: 0, credit: amount },
        ],
    };
}

/**
 * Record startup loan repayment
 * DR: Loan Payable
 * CR: Cash
 */
export function recordStartupLoanRepayment(
    date: string,
    amount: number
): JournalEntry {
    return {
        id: generateEntryId("LOAN-PAY"),
        date,
        description: "Startup loan repayment",
        lines: [
            { accountCode: AccountCode.LOAN_PAYABLE, debit: amount, credit: 0 },
            { accountCode: AccountCode.CASH, debit: 0, credit: amount },
        ],
    };
}
