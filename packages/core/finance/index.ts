import type { Assumptions, MonthlyKPI } from "../types";
import { createSeededRng, triangularFrom } from "../random";
import { estimatePricingPerPatient, emptyServed, triMode } from "./pricing";
export * from "./pricing";
export * from "./ledger";

export type FinanceMonth = {
    revenue: number;
    cash: number;
    operatingCost: number;
    capex: number;
};

export * from "./pricing";

export function computeMonthlyCashflows(a: Assumptions, monthIdx: number, served: ReturnType<typeof emptyServed>): FinanceMonth & { revenueByPackage: Record<string, number> } {
    const rng = createSeededRng(a.seed + 3000 + monthIdx);
    let revenue = 0;
    let cash = 0;
    let operatingCost = 0;
    let capex = 0;
    const revenueByPackage: Record<string, number> = {};

    // Chair capex handled externally (not in this v0)

    // Revenue + cash: model downpayment now, financed remainder distributed (approximate) across next months
    for (const key of Object.keys(served) as (keyof ReturnType<typeof emptyServed>)[]) {
        let pkgRevenue = 0;
        for (let i = 0; i < served[key]; i++) {
            const price = estimatePricingPerPatient(a, rng, key);
            const down = price * a.financing.downpaymentPct;
            const remainder = price - down;

            // recognize revenue fully at booking; cash only downpayment now
            revenue += price;
            pkgRevenue += price;
            cash += down * (1 - a.financing.providerFeePct);

            operatingCost += price * 0.35; // placeholder COGS/staff share
        }
        revenueByPackage[key] = pkgRevenue;
    }

    // Monthly staff fixed costs
    operatingCost += triangularFrom(a.staff.nurseAssistantMonthly, rng) + triangularFrom(a.staff.receptionistMonthly, rng);

    return { revenue, cash, operatingCost, capex, revenueByPackage };
}

// Deterministic mode helpers


export type VariableCostBreakdown = {
    immediate: number;
    deferred: { monthOffset: number; amount: number }[];
};

export function calculatePatientVariableCosts(a: Assumptions, key: string, price: number): VariableCostBreakdown {
    let immediate = 0;
    let deferred: { monthOffset: number; amount: number }[] = [];

    const materials = materialsForKey(a, key, price);
    immediate += materials;

    // Hospitality threshold logic: Only cover hotel/food if price >= $9,000
    if (price >= 9000) {
        const { hotelNight, foodDay } = a.variableCosts.perClient || {};
        const hospPerDay = (hotelNight || 0) + (foodDay || 0);

        switch (key) {
            case "smileDesignNonInvasive":
                immediate += 2 * hospPerDay;
                break;
            case "smileDesignInvasive": {
                const nights = Math.round(a.durations.smileDesign.invasiveSpanDays.mode);
                immediate += nights * hospPerDay;
                break;
            }
            case "allIn4One":
            case "allIn4Two": {
                // Initial visit: 14 days
                immediate += 14 * hospPerDay;
                // Return visit: 10 days, 3-4 months later (mode 3)
                const returnOffset = Math.round(a.durations.allIn4.returnAfterMonths.mode);
                deferred.push({
                    monthOffset: returnOffset,
                    amount: 10 * hospPerDay
                });
                break;
            }
            // Implants typically don't include hotel in this model unless high enough, 
            // but we'll follow the $9k rule strictly.
        }
    }

    return { immediate, deferred };
}

function materialsForKey(a: Assumptions, key: any, price: number): number {
    switch (key) {
        case "smileDesignNonInvasive":
            return nearest([a.pricing.smileDesign.nonInvasive.nanotech, a.pricing.smileDesign.nonInvasive.porcelain, a.pricing.smileDesign.nonInvasive.cubicZirconia], [a.variableCosts.perService.smileNonInvasive.nanotech, a.variableCosts.perService.smileNonInvasive.porcelain, a.variableCosts.perService.smileNonInvasive.cubicZirconia], price);
        case "smileDesignInvasive":
            return nearest([a.pricing.smileDesign.invasive.porcelain, a.pricing.smileDesign.invasive.porcelainPure, a.pricing.smileDesign.invasive.cubicZirconia], [a.variableCosts.perService.smileInvasive.porcelain, a.variableCosts.perService.smileInvasive.porcelainPure, a.variableCosts.perService.smileInvasive.cubicZirconia], price);
        case "implants1":
        case "implants2":
        case "implants3": {
            const count = key === "implants1" ? 1 : key === "implants2" ? 2 : 3;
            return (a.variableCosts.perService.implants.perImplant || 0) * count;
        }
        case "allIn4One":
            return a.variableCosts.perService.allIn4.oneArc || 0;
        case "allIn4Two":
            return a.variableCosts.perService.allIn4.twoArcs || 0;
    }
    return 0;
}

function nearest(priceOptions: number[], costOptions: number[], price: number): number {
    let bestIdx = 0;
    let bestDiff = Math.abs(price - priceOptions[0]!);
    for (let i = 1; i < priceOptions.length; i++) {
        const diff = Math.abs(price - priceOptions[i]!);
        if (diff < bestDiff) {
            bestDiff = diff;
            bestIdx = i;
        }
    }
    return costOptions[bestIdx] || 0;
}

export function buildCashRow(
    a: Assumptions,
    monthIdx: number,
    served: ReturnType<typeof emptyServed>,
    cashStart: number,
    installmentsDueThisMonth: number,
    doctorCommissionsDue: number[], // Array of deferred amounts per doctor
    deferredCostsDue: number,
    adSpend: number,
    revenueByDoctor: number[], // Actual revenue attributed to each doctor
    revenue: number, // Fixed revenue from scheduler
    revenueByPackage: Record<string, number> // Fixed package revenue from scheduler
): Pick<MonthlyKPI, "revenue" | "cashStart" | "adSpend" | "commissions" | "salaries" | "fixedCosts" | "variableCosts" | "cashAfterOverhead" | "downpaymentCash" | "installmentsCash" | "capex" | "netCashflow" | "cashOnHand" | "patientsTotal" | "nonFinancedRevenue" | "financedDownpaymentCash" | "revenueCash" | "totalExpenses" | "ownerPay" | "commissionsByDoctor" | "closerCommissions"> & { deferredCosts?: { monthOffset: number; amount: number }[], revenueByPackage?: Record<string, number>, totalDownpaymentCash?: number } {
    // Variable Costs (per patient)
    let patientsTotal = 0;
    let variableCostsThisMonth = 0;
    let deferredCosts: { monthOffset: number; amount: number }[] = [];

    (Object.keys(served) as (keyof ReturnType<typeof emptyServed>)[]).forEach((k) => {
        for (let i = 0; i < served[k]; i++) {
            patientsTotal += 1;
            const price = revenueByPackage[k] / Math.max(1, served[k]); // Estimated per patient for variable cost calc
            const { immediate, deferred } = calculatePatientVariableCosts(a, k, price);
            variableCostsThisMonth += immediate;
            deferredCosts.push(...deferred);
        }
    });

    // Overheads
    // Salaries: Dynamic based on start months and hourly/monthly rates
    let salaries = 0;
    if (monthIdx >= a.staff.receptionistStartMonthIdx) {
        salaries += triMode(a.staff.receptionistMonthly);
    }
    if (monthIdx >= a.staff.nurseStartMonthIdx) {
        // Use hourly rate if specified, otherwise fallback to monthly triangular
        const nurseBase = a.staff.nurseHourlyRate > 0
            ? a.staff.nurseHourlyRate * a.staff.nurseHoursPerMonth
            : triMode(a.staff.nurseAssistantMonthly);
        salaries += nurseBase;
    }

    // Fixed Costs from list
    const fixedCostsTotal = a.fixedCosts.items.reduce((sum, item) => sum + item.amountPerMonth, 0);

    // Commissions for Doctors (Non-Owner)
    const doctorsCount = a.capacity.doctorsByMonth[monthIdx] ?? a.capacity.doctorsByMonth.at(-1)!;
    const doctorCommissionsPaid = Array(doctorsCount).fill(0);
    const commPct = triMode(a.staff.doctorCommissionPct);
    const upfrontPct = a.staff.commissionStructure.upfrontPct;

    for (let i = 0; i < doctorsCount; i++) {
        // Owner Check: strictly exclude index 0 if they are the primary owner.
        // If the user wants the owner to NEVER receive commission, we check index 0.
        // We'll use a very high default or explicit check.
        const isOwner = i === 0;
        // If the user specifically wants the owner to get paid after X months, they can set it,
        // but typically the owner (Dr 1) in this model should not receive per-op commission.
        if (isOwner && monthIdx < (a.staff.ownerAsDoctorMonths ?? 999)) {
            doctorCommissionsPaid[i] = 0;
            continue;
        }

        const rev = revenueByDoctor[i] || 0;
        const generated = rev * commPct;
        const deferredDue = doctorCommissionsDue[i] || 0;

        doctorCommissionsPaid[i] = (generated * upfrontPct) + deferredDue;
    }

    const commissionsPaidNowTotal = doctorCommissionsPaid.reduce((sum, val) => sum + val, 0);

    const closerCommissions = 0; // DISABLED: Redundant with doctor commissions
    const totalCommissions = commissionsPaidNowTotal + closerCommissions;

    const outflows = adSpend + totalCommissions + salaries + fixedCostsTotal + variableCostsThisMonth + deferredCostsDue;
    const cashAfterOverhead = cashStart - outflows;

    // Financing cash flows this month
    const financedRate = a.financing.financingTakeRatePct; // e.g., 0.95
    const downPct = a.financing.downpaymentPct;
    const providerFee = a.financing.providerFeePct;
    const collectionEfficacy = a.financing.collectionEfficacy; // 0.99

    const financedRevenue = revenue * financedRate;
    const nonFinancedRevenue = revenue - financedRevenue;

    // Downpayment Cash: The portion of revenue received immediately (non-financed + downpayment on financed)
    // PLUS Booking Deposits for patients coming in the future (lead time window)
    const bookingDeposit = a.financing.bookingDeposit;
    const bookingLeadWeeks = Math.round(a.financing.bookingLeadTimeDays.mode / 7);

    // 1. Financed Downpayment (Immediate)
    const financedDownpaymentCash = Math.max(0, financedRevenue * downPct);

    // 2. Paid In Full (Immediate) => nonFinancedRevenue

    // 3. Current month downpayment total (for legacy)
    // Note: This logic previously subtracted booking deposits. 
    // If we want exact cash flow matching, we should be careful.
    // Let's assume 'downpaymentCash' assumes net of deposits logic, 
    // but for the new columns we want the gross components?
    // Actually, 'downpaymentCash' is usually the *remaining* downpayment due at procedure.
    // If booking deposit was paid previously, it's deducted from "Day of Procedure" cash.
    // Let's keep the existing logic for 'downpaymentCash' (Day of Procedure) but expose the gross components differently?
    // User wants "Paid in Full" (Gross) and "Down" (Gross) + "Cash In" (Total).

    // Let's define the new fields as the GROSS amounts for clarity in the breakdown, 
    // but 'totalDownpaymentCash' must be the ACTUAL cash inflow (Net of prev deposits + New deposits).

    // Total Cash Inflow This Month = 
    // (Paid In Full + Financed Down - Deposits Applied) + (New Deposits for Future) + Installments.

    const depositsApplied = patientsTotal * bookingDeposit;
    const newDeposits = patientsTotal * bookingDeposit; // Simplified: Assuming 1:1 replacement in steady state

    // Actual Cash In (Sales) = (PaidInFull + FinancedDown - DepositsApplied) + NewDeposits
    // = PaidInFull + FinancedDown (since applied approx equals new in steady, but sticking to logic:
    const downpaymentCash = Math.max(0, (financedRevenue * downPct) + nonFinancedRevenue - depositsApplied);

    const totalDownpaymentCash = downpaymentCash + newDeposits;

    // Installments: Apply collection efficacy and provider fees
    const installmentsCash = installmentsDueThisMonth * collectionEfficacy * (1 - providerFee);

    // Revenue (Cash) = Paid in Full + Released Downpayment (Immediate) + Installments
    const revenueCash = nonFinancedRevenue + financedDownpaymentCash + installmentsCash;

    // CapEx (chairs + x-ray + tomography)
    const chairsNow = a.capacity.chairsByMonth[monthIdx] ?? a.capacity.chairsByMonth.at(-1)!;
    const chairsPrev = monthIdx === 0 ? a.capacity.chairsByMonth[0] : a.capacity.chairsByMonth[monthIdx - 1] ?? chairsNow;
    const chairAdds = Math.max(0, chairsNow - chairsPrev);
    const chairCapex = chairAdds * a.capacity.chairCapexPerAdd;
    const xrayCapex = a.capacity.xray.enabledMonthIdx === monthIdx ? a.capacity.xray.capex : 0;

    // Tomography: downpayment in purchase month, installments in subsequent months
    let tomographyCapex = 0;
    if (a.capacity.tomography) {
        const tomo = a.capacity.tomography;
        if (tomo.enabledMonthIdx === monthIdx) {
            // Purchase month: pay downpayment
            tomographyCapex = tomo.totalCost * tomo.downpaymentPct;
        } else if (
            tomo.enabledMonthIdx !== null &&
            monthIdx > tomo.enabledMonthIdx &&
            monthIdx <= tomo.enabledMonthIdx + tomo.financingMonths
        ) {
            // Financing months: pay monthly installment
            const remainingBalance = tomo.totalCost * (1 - tomo.downpaymentPct);
            tomographyCapex = remainingBalance / tomo.financingMonths;
        }
    }

    const capex = chairCapex + xrayCapex + tomographyCapex;
    const totalExpenses = outflows + capex;

    const cashEnd = cashAfterOverhead + totalDownpaymentCash + installmentsCash - capex;
    const netCashflow = cashEnd - cashStart;

    const ownerPay = 0;

    return {
        revenue,
        cashStart,
        adSpend,
        commissions: totalCommissions,
        salaries,
        cashAfterOverhead,
        downpaymentCash,
        totalDownpaymentCash,
        revenueCash,
        nonFinancedRevenue,
        financedDownpaymentCash,
        installmentsCash,
        fixedCosts: fixedCostsTotal,
        variableCosts: variableCostsThisMonth,
        commissionsByDoctor: doctorCommissionsPaid,
        closerCommissions,
        capex,
        totalExpenses,
        ownerPay,
        netCashflow,
        cashOnHand: cashEnd,
        patientsTotal,
        // @ts-ignore
        deferredCosts,
        revenueByPackage
    };
}

export function calculateDeferredCommissions(a: Assumptions, monthIdx: number, revenueByDoctor: number[]): number[] {
    const doctorsCount = a.capacity.doctorsByMonth[monthIdx] ?? a.capacity.doctorsByMonth.at(-1)!;
    const deferredByDoctor = Array(doctorsCount).fill(0);
    const commPct = triMode(a.staff.doctorCommissionPct);
    const deferralPct = 1 - a.staff.commissionStructure.upfrontPct;

    for (let i = 0; i < doctorsCount; i++) {
        const isOwner = i === 0 && monthIdx < (a.staff.ownerAsDoctorMonths ?? 0);
        if (isOwner) continue;

        const rev = revenueByDoctor[i] || 0;
        deferredByDoctor[i] = rev * commPct * deferralPct;
    }

    return deferredByDoctor;
}


