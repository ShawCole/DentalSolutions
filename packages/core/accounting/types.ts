// Double-Entry Accounting System Types

export enum AccountType {
    // Assets (Debit normal balance)
    ASSET = "ASSET",
    // Liabilities (Credit normal balance)
    LIABILITY = "LIABILITY",
    // Equity (Credit normal balance)
    EQUITY = "EQUITY",
    // Revenue (Credit normal balance)
    REVENUE = "REVENUE",
    // Expenses (Debit normal balance)
    EXPENSE = "EXPENSE",
}

export enum AccountCode {
    // ASSETS (1000-1999)
    CASH = "1000",
    ACCOUNTS_RECEIVABLE = "1100",
    ACCOUNTS_RECEIVABLE_FINANCING = "1110", // Installments owed
    PREPAID_EXPENSES = "1200",
    EQUIPMENT = "1300",
    ACCUMULATED_DEPRECIATION = "1350",

    // LIABILITIES (2000-2999)
    ACCOUNTS_PAYABLE = "2000",
    ACCRUED_EXPENSES = "2100",
    DEFERRED_REVENUE = "2200", // Booking deposits not yet earned
    NOTES_PAYABLE = "2300", // Equipment financing
    LOAN_PAYABLE = "2400",

    // EQUITY (3000-3999)
    OWNERS_EQUITY = "3000",
    RETAINED_EARNINGS = "3100",

    // REVENUE (4000-4999)
    SERVICE_REVENUE = "4000",
    SERVICE_REVENUE_SMILE_DESIGN = "4010",
    SERVICE_REVENUE_IMPLANTS = "4020",
    SERVICE_REVENUE_ALL_IN_4 = "4030",

    // EXPENSES (5000-5999)
    ADVERTISING_EXPENSE = "5000",
    COMMISSION_EXPENSE = "5100",
    SALARY_EXPENSE = "5200",
    MATERIALS_EXPENSE = "5300", // COGS
    RENT_EXPENSE = "5400",
    UTILITIES_EXPENSE = "5500",
    DEPRECIATION_EXPENSE = "5600",
    FINANCING_FEE_EXPENSE = "5700", // Provider fees
}

export type Account = {
    code: AccountCode;
    name: string;
    type: AccountType;
    normalBalance: "DEBIT" | "CREDIT";
    balance: number; // Running balance
};

export type JournalEntry = {
    id: string;
    date: string; // ISO date
    description: string;
    lines: JournalLine[];
    metadata?: {
        patientId?: string;
        campaignId?: string;
        monthIdx?: number;
        [key: string]: any;
    };
};

export type JournalLine = {
    accountCode: AccountCode;
    debit: number;
    credit: number;
    memo?: string;
};

export type GeneralLedger = {
    accounts: Map<AccountCode, Account>;
    entries: JournalEntry[];
};

export type BalanceSheet = {
    date: string;
    assets: {
        current: { [key: string]: number };
        fixed: { [key: string]: number };
        total: number;
    };
    liabilities: {
        current: { [key: string]: number };
        longTerm: { [key: string]: number };
        total: number;
    };
    equity: {
        [key: string]: number;
        total: number;
    };
};

export type IncomeStatement = {
    startDate: string;
    endDate: string;
    revenue: {
        [key: string]: number;
        total: number;
    };
    expenses: {
        [key: string]: number;
        total: number;
    };
    netIncome: number;
    ebitda: number;
    ebit: number;
};

export type CashFlowStatement = {
    startDate: string;
    endDate: string;
    operating: {
        netIncome: number;
        adjustments: { [key: string]: number };
        total: number;
    };
    investing: {
        [key: string]: number;
        total: number;
    };
    financing: {
        [key: string]: number;
        total: number;
    };
    netCashFlow: number;
    cashStart: number;
    cashEnd: number;
};
