import { Account, AccountCode, AccountType, GeneralLedger, JournalEntry, JournalLine } from "./types";

/**
 * Initialize the Chart of Accounts with all accounts at zero balance
 */
export function initializeChartOfAccounts(): Map<AccountCode, Account> {
    const accounts = new Map<AccountCode, Account>();

    // Helper to add account
    const addAccount = (code: AccountCode, name: string, type: AccountType) => {
        const normalBalance =
            type === AccountType.ASSET || type === AccountType.EXPENSE ? "DEBIT" : "CREDIT";
        accounts.set(code, { code, name, type, normalBalance, balance: 0 });
    };

    // ASSETS
    addAccount(AccountCode.CASH, "Cash", AccountType.ASSET);
    addAccount(AccountCode.ACCOUNTS_RECEIVABLE, "Accounts Receivable", AccountType.ASSET);
    addAccount(AccountCode.ACCOUNTS_RECEIVABLE_FINANCING, "AR - Financing Installments", AccountType.ASSET);
    addAccount(AccountCode.PREPAID_EXPENSES, "Prepaid Expenses", AccountType.ASSET);
    addAccount(AccountCode.EQUIPMENT, "Equipment", AccountType.ASSET);
    addAccount(AccountCode.ACCUMULATED_DEPRECIATION, "Accumulated Depreciation", AccountType.ASSET);

    // LIABILITIES
    addAccount(AccountCode.ACCOUNTS_PAYABLE, "Accounts Payable", AccountType.LIABILITY);
    addAccount(AccountCode.ACCRUED_EXPENSES, "Accrued Expenses", AccountType.LIABILITY);
    addAccount(AccountCode.DEFERRED_REVENUE, "Deferred Revenue (Deposits)", AccountType.LIABILITY);
    addAccount(AccountCode.NOTES_PAYABLE, "Notes Payable (Equipment)", AccountType.LIABILITY);
    addAccount(AccountCode.LOAN_PAYABLE, "Loan Payable", AccountType.LIABILITY);

    // EQUITY
    addAccount(AccountCode.OWNERS_EQUITY, "Owner's Equity", AccountType.EQUITY);
    addAccount(AccountCode.RETAINED_EARNINGS, "Retained Earnings", AccountType.EQUITY);

    // REVENUE
    addAccount(AccountCode.SERVICE_REVENUE, "Service Revenue", AccountType.REVENUE);
    addAccount(AccountCode.SERVICE_REVENUE_SMILE_DESIGN, "Revenue - Smile Design", AccountType.REVENUE);
    addAccount(AccountCode.SERVICE_REVENUE_IMPLANTS, "Revenue - Implants", AccountType.REVENUE);
    addAccount(AccountCode.SERVICE_REVENUE_ALL_IN_4, "Revenue - All-in-4", AccountType.REVENUE);

    // EXPENSES
    addAccount(AccountCode.ADVERTISING_EXPENSE, "Advertising Expense", AccountType.EXPENSE);
    addAccount(AccountCode.COMMISSION_EXPENSE, "Commission Expense", AccountType.EXPENSE);
    addAccount(AccountCode.SALARY_EXPENSE, "Salary Expense", AccountType.EXPENSE);
    addAccount(AccountCode.MATERIALS_EXPENSE, "Materials Expense (COGS)", AccountType.EXPENSE);
    addAccount(AccountCode.RENT_EXPENSE, "Rent Expense", AccountType.EXPENSE);
    addAccount(AccountCode.UTILITIES_EXPENSE, "Utilities Expense", AccountType.EXPENSE);
    addAccount(AccountCode.DEPRECIATION_EXPENSE, "Depreciation Expense", AccountType.EXPENSE);
    addAccount(AccountCode.FINANCING_FEE_EXPENSE, "Financing Fee Expense", AccountType.EXPENSE);

    return accounts;
}

/**
 * Create a new General Ledger
 */
export function createGeneralLedger(startingCash: number): GeneralLedger {
    const accounts = initializeChartOfAccounts();
    const entries: JournalEntry[] = [];

    // Initial capital contribution
    if (startingCash > 0) {
        const entry: JournalEntry = {
            id: "INIT-001",
            date: new Date().toISOString(),
            description: "Initial capital contribution",
            lines: [
                { accountCode: AccountCode.CASH, debit: startingCash, credit: 0 },
                { accountCode: AccountCode.OWNERS_EQUITY, debit: 0, credit: startingCash },
            ],
        };
        postJournalEntry(accounts, entry);
        entries.push(entry);
    }

    return { accounts, entries };
}

/**
 * Validate that a journal entry is balanced (debits = credits)
 */
export function validateJournalEntry(entry: JournalEntry): { valid: boolean; error?: string } {
    const totalDebits = entry.lines.reduce((sum, line) => sum + line.debit, 0);
    const totalCredits = entry.lines.reduce((sum, line) => sum + line.credit, 0);

    if (Math.abs(totalDebits - totalCredits) > 0.01) {
        return {
            valid: false,
            error: `Entry not balanced: Debits=${totalDebits}, Credits=${totalCredits}`,
        };
    }

    return { valid: true };
}

/**
 * Post a journal entry to the general ledger
 */
export function postJournalEntry(accounts: Map<AccountCode, Account>, entry: JournalEntry): void {
    const validation = validateJournalEntry(entry);
    if (!validation.valid) {
        throw new Error(`Invalid journal entry: ${validation.error}`);
    }

    for (const line of entry.lines) {
        const account = accounts.get(line.accountCode);
        if (!account) {
            throw new Error(`Account not found: ${line.accountCode}`);
        }

        // Update balance based on normal balance
        if (account.normalBalance === "DEBIT") {
            account.balance += line.debit - line.credit;
        } else {
            account.balance += line.credit - line.debit;
        }
    }
}

/**
 * Get account balance
 */
export function getAccountBalance(accounts: Map<AccountCode, Account>, code: AccountCode): number {
    return accounts.get(code)?.balance ?? 0;
}

/**
 * Get all accounts of a specific type
 */
export function getAccountsByType(accounts: Map<AccountCode, Account>, type: AccountType): Account[] {
    return Array.from(accounts.values()).filter(acc => acc.type === type);
}
