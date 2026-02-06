import { Account, AccountCode, AccountType, BalanceSheet, CashFlowStatement, GeneralLedger, IncomeStatement } from "./types";
import { getAccountBalance, getAccountsByType } from "./ledger";

/**
 * Generate Balance Sheet
 */
export function generateBalanceSheet(ledger: GeneralLedger, date: string): BalanceSheet {
    const { accounts } = ledger;

    // Assets
    const cash = getAccountBalance(accounts, AccountCode.CASH);
    const ar = getAccountBalance(accounts, AccountCode.ACCOUNTS_RECEIVABLE);
    const arFinancing = getAccountBalance(accounts, AccountCode.ACCOUNTS_RECEIVABLE_FINANCING);
    const prepaid = getAccountBalance(accounts, AccountCode.PREPAID_EXPENSES);
    const equipment = getAccountBalance(accounts, AccountCode.EQUIPMENT);
    const accDepreciation = getAccountBalance(accounts, AccountCode.ACCUMULATED_DEPRECIATION);

    const currentAssets = cash + ar + arFinancing + prepaid;
    const fixedAssets = equipment - accDepreciation;
    const totalAssets = currentAssets + fixedAssets;

    // Liabilities
    const ap = getAccountBalance(accounts, AccountCode.ACCOUNTS_PAYABLE);
    const accrued = getAccountBalance(accounts, AccountCode.ACCRUED_EXPENSES);
    const deferred = getAccountBalance(accounts, AccountCode.DEFERRED_REVENUE);
    const notesPayable = getAccountBalance(accounts, AccountCode.NOTES_PAYABLE);
    const loanPayable = getAccountBalance(accounts, AccountCode.LOAN_PAYABLE);

    const currentLiabilities = ap + accrued + deferred;
    const longTermLiabilities = notesPayable + loanPayable;
    const totalLiabilities = currentLiabilities + longTermLiabilities;

    // Equity
    const ownersEquity = getAccountBalance(accounts, AccountCode.OWNERS_EQUITY);
    const retainedEarnings = getAccountBalance(accounts, AccountCode.RETAINED_EARNINGS);
    const totalEquity = ownersEquity + retainedEarnings;

    return {
        date,
        assets: {
            current: {
                "Cash": cash,
                "Accounts Receivable": ar,
                "AR - Financing": arFinancing,
                "Prepaid Expenses": prepaid,
            },
            fixed: {
                "Equipment": equipment,
                "Accumulated Depreciation": -accDepreciation,
            },
            total: totalAssets,
        },
        liabilities: {
            current: {
                "Accounts Payable": ap,
                "Accrued Expenses": accrued,
                "Deferred Revenue": deferred,
            },
            longTerm: {
                "Notes Payable": notesPayable,
                "Loan Payable": loanPayable,
            },
            total: totalLiabilities,
        },
        equity: {
            "Owner's Equity": ownersEquity,
            "Retained Earnings": retainedEarnings,
            total: totalEquity,
        },
    };
}

/**
 * Generate Income Statement
 */
export function generateIncomeStatement(
    ledger: GeneralLedger,
    startDate: string,
    endDate: string
): IncomeStatement {
    const { accounts } = ledger;

    // Revenue
    const serviceRevenue = getAccountBalance(accounts, AccountCode.SERVICE_REVENUE);
    const smileRevenue = getAccountBalance(accounts, AccountCode.SERVICE_REVENUE_SMILE_DESIGN);
    const implantsRevenue = getAccountBalance(accounts, AccountCode.SERVICE_REVENUE_IMPLANTS);
    const allIn4Revenue = getAccountBalance(accounts, AccountCode.SERVICE_REVENUE_ALL_IN_4);

    const totalRevenue = serviceRevenue + smileRevenue + implantsRevenue + allIn4Revenue;

    // Expenses
    const adExpense = getAccountBalance(accounts, AccountCode.ADVERTISING_EXPENSE);
    const commissionExpense = getAccountBalance(accounts, AccountCode.COMMISSION_EXPENSE);
    const salaryExpense = getAccountBalance(accounts, AccountCode.SALARY_EXPENSE);
    const materialsExpense = getAccountBalance(accounts, AccountCode.MATERIALS_EXPENSE);
    const rentExpense = getAccountBalance(accounts, AccountCode.RENT_EXPENSE);
    const utilitiesExpense = getAccountBalance(accounts, AccountCode.UTILITIES_EXPENSE);
    const depreciationExpense = getAccountBalance(accounts, AccountCode.DEPRECIATION_EXPENSE);
    const financingFeeExpense = getAccountBalance(accounts, AccountCode.FINANCING_FEE_EXPENSE);

    const totalExpenses =
        adExpense + commissionExpense + salaryExpense + materialsExpense +
        rentExpense + utilitiesExpense + depreciationExpense + financingFeeExpense;

    const netIncome = totalRevenue - totalExpenses;
    const ebit = netIncome + financingFeeExpense; // Earnings Before Interest (and Taxes, assuming 0 tax for now)
    const ebitda = ebit + depreciationExpense; // Earnings Before Interest, Taxes, Depreciation, and Amortization

    return {
        startDate,
        endDate,
        revenue: {
            "Service Revenue": serviceRevenue,
            "Smile Design Revenue": smileRevenue,
            "Implants Revenue": implantsRevenue,
            "All-in-4 Revenue": allIn4Revenue,
            total: totalRevenue,
        },
        expenses: {
            "Advertising": adExpense,
            "Commissions": commissionExpense,
            "Salaries": salaryExpense,
            "Materials (COGS)": materialsExpense,
            "Rent": rentExpense,
            "Utilities": utilitiesExpense,
            "Depreciation": depreciationExpense,
            "Financing Fees": financingFeeExpense,
            total: totalExpenses,
        },
        netIncome,
        ebitda,
        ebit,
    };
}

/**
 * Generate Cash Flow Statement (Indirect Method)
 */
export function generateCashFlowStatement(
    ledger: GeneralLedger,
    previousLedger: GeneralLedger | null,
    startDate: string,
    endDate: string
): CashFlowStatement {
    const { accounts } = ledger;
    const prevAccounts = previousLedger?.accounts;

    const cashStart = prevAccounts ? getAccountBalance(prevAccounts, AccountCode.CASH) : 0;
    const cashEnd = getAccountBalance(accounts, AccountCode.CASH);

    // Get net income from income statement
    const incomeStmt = generateIncomeStatement(ledger, startDate, endDate);
    const netIncome = incomeStmt.netIncome;

    // Operating Activities (Indirect Method)
    const depreciation = getAccountBalance(accounts, AccountCode.DEPRECIATION_EXPENSE);
    const arChange = prevAccounts
        ? getAccountBalance(accounts, AccountCode.ACCOUNTS_RECEIVABLE_FINANCING) -
        getAccountBalance(prevAccounts, AccountCode.ACCOUNTS_RECEIVABLE_FINANCING)
        : 0;
    const deferredRevenueChange = prevAccounts
        ? getAccountBalance(accounts, AccountCode.DEFERRED_REVENUE) -
        getAccountBalance(prevAccounts, AccountCode.DEFERRED_REVENUE)
        : 0;

    const operatingCashFlow = netIncome + depreciation - arChange + deferredRevenueChange;

    // Working Capital Adjustments
    const apChange = prevAccounts
        ? getAccountBalance(accounts, AccountCode.ACCOUNTS_PAYABLE) -
        getAccountBalance(prevAccounts, AccountCode.ACCOUNTS_PAYABLE)
        : getAccountBalance(accounts, AccountCode.ACCOUNTS_PAYABLE);

    const accruedChange = prevAccounts
        ? getAccountBalance(accounts, AccountCode.ACCRUED_EXPENSES) -
        getAccountBalance(prevAccounts, AccountCode.ACCRUED_EXPENSES)
        : getAccountBalance(accounts, AccountCode.ACCRUED_EXPENSES);

    const prepaidChange = prevAccounts
        ? getAccountBalance(accounts, AccountCode.PREPAID_EXPENSES) -
        getAccountBalance(prevAccounts, AccountCode.PREPAID_EXPENSES)
        : getAccountBalance(accounts, AccountCode.PREPAID_EXPENSES);

    // OCF = Net Income + Depreciation - ΔAR - ΔPrepaid + ΔAP + ΔAccrued + ΔDeferredRev
    // Note: Increase in Asset (Prepaid) is Cash OUT (-), Increase in Liability (AP/Accrued) is Cash IN (+)
    const finalOperatingCashFlow = netIncome + depreciation - arChange - prepaidChange + deferredRevenueChange + apChange + accruedChange;

    // Investing Activities
    const equipmentChange = prevAccounts
        ? getAccountBalance(accounts, AccountCode.EQUIPMENT) -
        getAccountBalance(prevAccounts, AccountCode.EQUIPMENT)
        : getAccountBalance(accounts, AccountCode.EQUIPMENT);

    const investingCashFlow = -equipmentChange;

    // Financing Activities
    const notesPayableChange = prevAccounts
        ? getAccountBalance(accounts, AccountCode.NOTES_PAYABLE) -
        getAccountBalance(prevAccounts, AccountCode.NOTES_PAYABLE)
        : 0;
    const loanPayableChange = prevAccounts
        ? getAccountBalance(accounts, AccountCode.LOAN_PAYABLE) -
        getAccountBalance(prevAccounts, AccountCode.LOAN_PAYABLE)
        : 0;

    const financingCashFlow = notesPayableChange + loanPayableChange;

    const netCashFlow = finalOperatingCashFlow + investingCashFlow + financingCashFlow;

    return {
        startDate,
        endDate,
        operating: {
            netIncome,
            adjustments: {
                "Depreciation": depreciation,
                "Change in AR": -arChange,
                "Change in Deferred Revenue": deferredRevenueChange,
                "Change in AP": apChange,
                "Change in Accrued": accruedChange,
                "Change in Prepaid": -prepaidChange,
            },
            total: finalOperatingCashFlow,
        },
        investing: {
            "Equipment Purchases": -equipmentChange,
            total: investingCashFlow,
        },
        financing: {
            "Notes Payable": notesPayableChange,
            "Loan Payable": loanPayableChange,
            total: financingCashFlow,
        },
        netCashFlow,
        cashStart,
        cashEnd,
    };
}

/**
 * Verify accounting equation: Assets = Liabilities + Equity
 */
export function verifyAccountingEquation(ledger: GeneralLedger): {
    balanced: boolean;
    assets: number;
    liabilities: number;
    equity: number;
    difference: number;
} {
    const assets = getAccountsByType(ledger.accounts, AccountType.ASSET)
        .reduce((sum, acc) => sum + acc.balance, 0);

    const liabilities = getAccountsByType(ledger.accounts, AccountType.LIABILITY)
        .reduce((sum, acc) => sum + acc.balance, 0);

    const equity = getAccountsByType(ledger.accounts, AccountType.EQUITY)
        .reduce((sum, acc) => sum + acc.balance, 0);

    // Add net income to equity (revenue - expenses)
    const revenue = getAccountsByType(ledger.accounts, AccountType.REVENUE)
        .reduce((sum, acc) => sum + acc.balance, 0);

    const expenses = getAccountsByType(ledger.accounts, AccountType.EXPENSE)
        .reduce((sum, acc) => sum + acc.balance, 0);

    const totalEquity = equity + revenue - expenses;
    const difference = Math.abs(assets - (liabilities + totalEquity));

    return {
        balanced: difference < 0.01,
        assets,
        liabilities,
        equity: totalEquity,
        difference,
    };
}
