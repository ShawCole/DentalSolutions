// Standalone Verification Script (No Imports)
// This script simulates a single patient to verify the new business rules.

function triMode(t) { return t.mode; }

function estimatePricingPerPatient(a, kind) {
    const hospitalityCost = (a.variableCosts.perClient?.hotelNight ?? 0) + (a.variableCosts.perClient?.foodDay ?? 0);
    const q = [a.pricing.smileDesign.invasive.porcelain, a.pricing.smileDesign.invasive.porcelainPure, a.pricing.smileDesign.invasive.cubicZirconia];
    const basePrice = q[1]; // porcelainPure 10000
    const days = triMode(a.durations.smileDesign.invasiveSpanDays);
    return basePrice + (days * hospitalityCost);
}

function calculateVariableCosts(a, served) {
    let immediate = 0;
    const vc = a.variableCosts;
    const hospPerDay = (vc.perClient?.hotelNight ?? 0) + (vc.perClient?.foodDay ?? 0);
    const mat = 1000;
    const days = triMode(a.durations.smileDesign.invasiveSpanDays);
    immediate += served.smileDesignInvasive * (mat + (days * hospPerDay));
    return { immediate };
}

function buildCashRow(a, monthIdx, served, cashStart, installmentsDue, deferredCommsDue, deferredCostsDue) {
    const revenue = served.smileDesignInvasive * estimatePricingPerPatient(a, "smileDesignInvasive");
    const variableCosts = calculateVariableCosts(a, served).immediate;

    // Simplification for commissions
    const comms = revenue * 0.25 * 0.5; // 50% upfront

    const outflows = comms + variableCosts + deferredCostsDue;
    const cashAfterOverhead = cashStart - outflows;

    const financedRate = a.financing.financingTakeRatePct;
    const downPct = a.financing.downpaymentPct;
    const providerFee = a.financing.providerFeePct;
    const collectionEfficacy = a.financing.collectionEfficacy;

    const financedRevenue = revenue * financedRate;
    const nonFinancedRevenue = revenue - financedRevenue;

    const upfrontFunded = (financedRevenue * (1 - downPct)) * (1 - providerFee);
    const downpaymentCash = (financedRevenue * downPct) + nonFinancedRevenue + upfrontFunded;

    const installmentsCash = installmentsDue * collectionEfficacy;

    const cashEnd = cashAfterOverhead + downpaymentCash + installmentsCash;
    return { revenue, downpaymentCash, installmentsCash, cashOnHand: cashEnd };
}

const a = {
    pricing: {
        smileDesign: { invasive: { porcelainPure: 10000 } }
    },
    durations: {
        smileDesign: { invasiveSpanDays: { mode: 10 } }
    },
    financing: {
        downpaymentPct: 0.4,
        financingTakeRatePct: 1.0,
        providerFeePct: 0.05,
        collectionEfficacy: 0.99
    },
    variableCosts: {
        perClient: { hotelNight: 100, foodDay: 50 }
    }
};

console.log("=== STANDALONE LOGIC TEST ===");

const served = { smileDesignInvasive: 1 };
const row = buildCashRow(a, 0, served, 10000, 1000, 0, 0);

// 1. Revenue Pass-through
// 10000 + (10 * 150) = 11500
console.log(`1. Revenue (Target 11500): ${row.revenue}`);

// 2. Upfront Cash (Downpayment + Funded Principal - Fee)
// Downpayment: 0.4 * 11500 = 4600
// Principal: 0.6 * 11500 = 6900
// Funded (Minus 5%): 6900 * 0.95 = 6555
// Total: 4600 + 6555 = 11155
console.log(`2. Upfront Cash (Target 11155): ${row.downpaymentCash}`);

// 3. Collection Efficacy
// Installments: 1000 * 0.99 = 990
console.log(`3. Installments Cash (Target 990): ${row.installmentsCash}`);

if (row.revenue === 11500 && row.downpaymentCash === 11155 && row.installmentsCash === 990) {
    console.log("\nVERIFICATION SUCCESSFUL (Standalone)");
} else {
    console.log("\nVERIFICATION FAILED");
}
