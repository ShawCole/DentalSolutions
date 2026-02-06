import type { Assumptions, MonthlyKPI, SimulationResult, ClientLogEntry } from "../types";
import { createSeededRng } from "../random";
import { buildCashRow, calculateDeferredCommissions } from "../finance";
import { buildLedger } from "../finance/ledger";
import { buildDailySchedule } from "../schedule/daily";
import { createGeneralLedger, postJournalEntry } from "../accounting/ledger";
import * as Transactions from "../accounting/transactions";
import { generateBalanceSheet, generateIncomeStatement, generateCashFlowStatement, verifyAccountingEquation } from "../accounting/statements";
import type { BalanceSheet, IncomeStatement, CashFlowStatement, GeneralLedger } from "../accounting/types";


type DemandCounts = {
    smileDesignInvasive: number;
    smileDesignNonInvasive: number;
    implants1: number;
    implants2: number;
    implants3: number;
    allIn4One: number;
    allIn4Two: number;
};

function emptyCounts(): DemandCounts {
    return {
        smileDesignInvasive: 0,
        smileDesignNonInvasive: 0,
        implants1: 0,
        implants2: 0,
        implants3: 0,
        allIn4One: 0,
        allIn4Two: 0,
    };
}

export function runSingleSimulation(a: Assumptions, includeLog: boolean = false): SimulationResult {
    console.log("[Simulation] Starting with Assumptions:", JSON.stringify(a, null, 2));
    const rng = createSeededRng(a.seed);
    const months = a.capacity.months;
    const monthly: MonthlyKPI[] = [];
    const clientLog: ClientLogEntry[] = [];
    const allSchedules: import("../schedule/daily").ScheduleResult[] = [];
    const loanEnabled = !!(a.loan && a.loan.enabled);
    let cash = (a.startingCash ?? 0) + (loanEnabled ? (a.loan?.principal || 0) : 0);

    // Initialize double-entry accounting ledger
    const ledger: GeneralLedger = createGeneralLedger(a.startingCash ?? 0);
    const monthlyBalanceSheets: BalanceSheet[] = [];
    const monthlyIncomeStatements: IncomeStatement[] = [];
    const monthlyCashFlowStatements: CashFlowStatement[] = [];
    let previousMonthLedger: GeneralLedger | null = null;

    // Record startup loan proceeds ONLY if enabled
    if (loanEnabled && a.loan!.principal > 0) {
        const entry = Transactions.recordStartupLoanProceeds("INIT-LOAN", a.loan!.principal);
        postJournalEntry(ledger.accounts, entry);
        ledger.entries.push(entry);
    }

    let carryOver: DemandCounts = { ...emptyCounts() } as any;
    const installmentsSchedule = Array.from({ length: months }, () => 0);
    const loanMonthlyRepayment = (() => {
        if (!a.loan || !a.loan.enabled) return 0;
        const { principal, interestRate, termMonths } = a.loan;
        const monthlyRate = interestRate / 12;
        const denominator = Math.pow(1 + monthlyRate, termMonths) - 1;
        return principal * (monthlyRate + (monthlyRate / (denominator || 1)));
    })();
    const chairsSchedule = [...a.capacity.chairsByMonth];

    // State Queues
    const followUpQueue = Array.from({ length: 240 }, () => 0);
    const commissionQueue: number[][] = Array.from({ length: 240 }, () => []);
    const costQueue = Array.from({ length: 240 }, () => 0);

    for (let m = 0; m < months; m++) {
        const totalAdSpend = a.funnel.savedCampaigns.reduce((sum, camp) => {
            const start = camp.startMonthIdx || 0;
            const dur = camp.durationMonths;
            if (m < start) return sum;
            if (dur !== null && m >= start + dur) return sum;
            return sum + camp.funnel.adSpend;
        }, 0);

        // Loan Repayment
        let loanRepayment = 0;
        if (a.loan && a.loan.enabled && m >= a.loan.repaymentStartMonth && m < (a.loan.repaymentStartMonth + a.loan.termMonths)) {
            loanRepayment = loanMonthlyRepayment;
        }

        // SCHEDULE (High-Fidelity)
        const monthResult = buildDailySchedule(a, m, undefined, carryOver as any);
        allSchedules.push(monthResult);
        const scheduled = monthResult;

        if (includeLog) {
            clientLog.push(...monthResult.clientLog);
        }

        // FINANCE
        // Calculate generated revenue per doctor this month
        const doctorsCount = a.capacity.doctorsByMonth[m] ?? a.capacity.doctorsByMonth.at(-1)!;
        const revenueByDoctor = Array(doctorsCount).fill(0);
        scheduled.summaries.forEach(s => {
            s.entries.forEach(e => {
                const docIdx = (e as any).doctorIndex;
                const isFirstAppt = (e as any).apptIndex === 1;
                if (docIdx !== undefined && docIdx < doctorsCount && isFirstAppt) {
                    revenueByDoctor[docIdx] += e.revenue;
                }
            });
        });

        const deferredCommissionsDue = commissionQueue[m] || [];
        const deferredCostsDue = costQueue[m] ?? 0;
        const cashRow = buildCashRow(
            a, m, scheduled.served as any, cash,
            installmentsSchedule[m] ?? 0,
            deferredCommissionsDue,
            deferredCostsDue,
            totalAdSpend,
            revenueByDoctor,
            scheduled.totalRevenue,
            scheduled.revenueByPackage
        );

        // Subtract loan repayment from cash
        cashRow.cashOnHand -= loanRepayment;
        cashRow.netCashflow -= loanRepayment;

        const deferredCosts = cashRow.deferredCosts as { monthOffset: number; amount: number }[];
        if (deferredCosts) {
            deferredCosts.forEach(dc => {
                const targetIdx = m + dc.monthOffset;
                if (targetIdx < costQueue.length) {
                    costQueue[targetIdx] += dc.amount;
                }
            });
        }

        const deferredByDoctor = calculateDeferredCommissions(a, m, revenueByDoctor);
        const delay = Math.max(1, Math.round(a.staff.commissionStructure.deferralMonths));
        if (m + delay < commissionQueue.length) {
            // Merge deferred arrays if multiple doctors exist, ensuring we don't overwrite
            const target = commissionQueue[m + delay];
            deferredByDoctor.forEach((amt, idx) => {
                target[idx] = (target[idx] || 0) + amt;
            });
        }

        const financed = a.financing.financingTakeRatePct;
        const downPct = a.financing.downpaymentPct;
        const financedRevenue = cashRow.revenue * financed;
        const remaining = financedRevenue * (1 - downPct);

        const mix = a.financing.termMonthsMix.length > 0 ? a.financing.termMonthsMix : [{ months: a.financing.monthsToPay, weight: 1 }];
        const totalWeight = mix.reduce((sum, t) => sum + t.weight, 0) || 1;
        mix.forEach(term => {
            if (term.weight <= 0) return;
            const portion = remaining * (term.weight / totalWeight);
            const perMonth = portion / term.months;
            for (let t = 1; t <= term.months; t++) {
                const idx = m + t;
                if (idx < months) installmentsSchedule[idx] += perMonth;
            }
        });

        // --- DOUBLE-ENTRY ACCOUNTING INTEGRATION ---

        // 1. Record Revenue & Downpayments (Aggregated by service for performance)
        Object.entries(scheduled.served).forEach(([pkg, count]) => {
            const countNum = Number(count);
            if (countNum > 0) {
                const totalRev = cashRow.revenueByPackage?.[pkg] ?? 0;

                // Estimate split based on global assumption
                const financedAmount = totalRev * financed * (1 - downPct);
                const downpayment = totalRev - financedAmount;

                // Map package to service type
                const pkgName = pkg as string;
                let serviceType: "smileDesign" | "implants" | "allIn4" = "allIn4";
                if (pkgName.includes('smile')) serviceType = "smileDesign";
                else if (pkgName.includes('implants')) serviceType = "implants";

                const entry = Transactions.recordDownpayment(
                    `M${m + 1}-Revenue`,
                    totalRev,
                    downpayment,
                    financedAmount,
                    serviceType,
                    `Aggregated-${countNum}-Patients`
                );
                postJournalEntry(ledger.accounts, entry);
                ledger.entries.push(entry);
            }
        });

        // 2. Record Installment Payments Collected
        if (installmentsSchedule[m] > 0) {
            const entry = Transactions.recordInstallmentPayment(
                `M${m + 1}-Installments`,
                installmentsSchedule[m],
                "Aggregated-Patients"
            );
            postJournalEntry(ledger.accounts, entry);
            ledger.entries.push(entry);
        }

        // 3. Record Operating Expenses

        // Ad Spend
        if (totalAdSpend > 0) {
            const entry = Transactions.recordAdSpend(`M${m + 1}-Ads`, totalAdSpend, "Monthly-Campaigns");
            postJournalEntry(ledger.accounts, entry);
            ledger.entries.push(entry);
        }

        // Commissions
        if (cashRow.commissions > 0) {
            const entry = Transactions.recordCommission(`M${m + 1}-Comms`, cashRow.commissions, "Sales-Staff");
            postJournalEntry(ledger.accounts, entry);
            ledger.entries.push(entry);
        }

        // Salaries
        if (cashRow.salaries > 0) {
            const entry = Transactions.recordSalary(`M${m + 1}-Salaries`, cashRow.salaries, "Staff");
            postJournalEntry(ledger.accounts, entry);
            ledger.entries.push(entry);
        }

        // Materials (COGS)
        const opExInfo = cashRow.cashStart - cashRow.cashAfterOverhead;
        const impliedMat = opExInfo - cashRow.adSpend - cashRow.commissions - cashRow.salaries;
        const fixedCostSum = a.fixedCosts.items.reduce((sum, item) => sum + item.amountPerMonth, 0);
        const materialsOnly = Math.max(0, impliedMat - fixedCostSum);

        if (materialsOnly > 0) {
            const entry = Transactions.recordMaterialsCost(`M${m + 1}-Materials`, materialsOnly, "allIn4", "Aggregated");
            postJournalEntry(ledger.accounts, entry);
            ledger.entries.push(entry);
        }

        // Fixed Costs
        a.fixedCosts.items.forEach(fc => {
            if (fc.amountPerMonth > 0) {
                // Determine type
                const type = fc.name.toLowerCase().includes('rent') ? 'rent' :
                    fc.name.toLowerCase().includes('utilities') ? 'utilities' : 'other';

                const entry = Transactions.recordFixedCost(`M${m + 1}-Fixed`, fc.amountPerMonth, type, fc.name);
                postJournalEntry(ledger.accounts, entry);
                ledger.entries.push(entry);
            }
        });

        // Startup Loan Repayment
        if (loanRepayment > 0) {
            const entry = Transactions.recordStartupLoanRepayment(`M${m + 1}-LoanPay`, loanRepayment);
            postJournalEntry(ledger.accounts, entry);
            ledger.entries.push(entry);
        }

        // 4. Record CapEx
        // X-Ray (Cash)
        if (a.capacity.xray.enabledMonthIdx === m) {
            const entry = Transactions.recordEquipmentPurchase(
                `M${m + 1}-CapEx-Xray`,
                a.capacity.xray.capex,
                "X-Ray Machine"
            );
            postJournalEntry(ledger.accounts, entry);
            ledger.entries.push(entry);
        }

        // Tomography (Financed)
        if (a.capacity.tomography) {
            const tomo = a.capacity.tomography;
            // Purchase
            if (tomo.enabledMonthIdx === m) {
                const down = tomo.totalCost * tomo.downpaymentPct;
                const entry = Transactions.recordEquipmentPurchaseFinanced(
                    `M${m + 1}-CapEx-Tomo`,
                    tomo.totalCost,
                    down,
                    "Tomography Machine"
                );
                postJournalEntry(ledger.accounts, entry);
                ledger.entries.push(entry);
            }
            // Monthly Payments
            else if (
                tomo.enabledMonthIdx !== null &&
                m > tomo.enabledMonthIdx &&
                m <= tomo.enabledMonthIdx + tomo.financingMonths
            ) {
                const financingPrincipal = tomo.totalCost * (1 - tomo.downpaymentPct);
                const payment = financingPrincipal / tomo.financingMonths;
                const entry = Transactions.recordEquipmentPayment(`M${m + 1}-Loan-Tomo`, payment);
                postJournalEntry(ledger.accounts, entry);
                ledger.entries.push(entry);
            }
        }

        // 5. Generate Monthly Financial Statements
        const monthStr = `M${m + 1}`;
        // Verify before generating (optional logging)
        // const verify = verifyAccountingEquation(ledger);

        monthlyBalanceSheets.push(generateBalanceSheet(ledger, monthStr));
        monthlyIncomeStatements.push(generateIncomeStatement(ledger, `M${m + 1}-Start`, monthStr));
        monthlyCashFlowStatements.push(generateCashFlowStatement(
            ledger,
            previousMonthLedger,
            `M${m + 1}-Start`,
            monthStr
        ));

        // Snapshot ledger for next month's cash flow calc
        const prevAccounts = new Map();
        ledger.accounts.forEach((v, k) => prevAccounts.set(k, { ...v }));
        previousMonthLedger = { accounts: prevAccounts, entries: [] };

        // --- END ACCOUNTING INTEGRATION ---

        cash = cashRow.cashOnHand;
        const currentUtilization = scheduled.hoursAvailable > 0 ? scheduled.hoursUsed / scheduled.hoursAvailable : 0;
        monthly.push({
            monthIdx: m,
            revenue: cashRow.revenue,
            cashStart: cashRow.cashStart,
            adSpend: cashRow.adSpend,
            commissions: cashRow.commissions,
            commissionsByDoctor: cashRow.commissionsByDoctor,
            closerCommissions: cashRow.closerCommissions,
            salaries: cashRow.salaries,
            fixedCosts: cashRow.fixedCosts,
            variableCosts: cashRow.variableCosts,
            cashAfterOverhead: cashRow.cashAfterOverhead,
            downpaymentCash: cashRow.downpaymentCash,
            totalDownpaymentCash: cashRow.totalDownpaymentCash || 0,
            revenueCash: cashRow.revenueCash,
            nonFinancedRevenue: cashRow.nonFinancedRevenue,
            financedDownpaymentCash: cashRow.financedDownpaymentCash,
            installmentsCash: cashRow.installmentsCash,
            totalExpenses: cashRow.totalExpenses,
            ownerPay: cashRow.ownerPay,
            capex: cashRow.capex,
            netCashflow: cashRow.netCashflow,
            cashOnHand: cashRow.cashOnHand,
            chairHoursAvailable: scheduled.hoursAvailable,
            chairHoursUsed: scheduled.hoursUsed,
            utilizationPct: currentUtilization,
            patientsByPackage: scheduled.served,
            patientsTotal: cashRow.patientsTotal, // Use the count from finance engine to ensure consistency with Revenue
            backlogByPackage: scheduled.backlog,
            backlogTotal: Object.values(scheduled.backlog).reduce((sum, val) => sum + Number(val), 0),
        });

        carryOver = scheduled.backlog as any;

        // Dynamic Scaling Trigger
        if (currentUtilization >= a.capacity.scalingRules.utilizationThreshold && m + 1 < months) {
            const currentChairs = chairsSchedule[m];
            if (currentChairs < a.capacity.scalingRules.maxChairs) {
                for (let future = m + 1; future < months; future++) {
                    chairsSchedule[future] = Math.max(chairsSchedule[future], currentChairs + 1);
                }
            }
        }

        // Update assumptions for next month's iteration to use the potentially updated chairsSchedule
        if (m + 1 < months) {
            a.capacity.chairsByMonth[m + 1] = chairsSchedule[m + 1];
        }
    }

    const ytd = monthly.reduce(
        (acc, m) => {
            acc.revenue += m.revenue;
            acc.operatingCost += (m.adSpend ?? 0) + (m.commissions ?? 0) + (m.salaries ?? 0);
            acc.capex += m.capex;
            acc.netCashflow += m.netCashflow;
            acc.cashEnding = m.cashOnHand;
            return acc;
        },
        { revenue: 0, operatingCost: 0, capex: 0, netCashflow: 0, cashEnding: 0 }
    );

    const ledgerEvents = buildLedger(a, allSchedules, clientLog);
    console.log(`[runSingleSimulation] Generated ${ledgerEvents?.length || 0} ledger events`);

    return {
        monthly,
        clientLog,
        ytd,
        accounting: {
            ledger,
            balanceSheets: monthlyBalanceSheets,
            incomeStatements: monthlyIncomeStatements,
            cashFlowStatements: monthlyCashFlowStatements,
        },
        ledgerEvents
    };
}


