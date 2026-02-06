import { runSingleSimulation } from "@dentalsolutions/core";
import { useSimStore } from "../lib/store";

async function verify() {
    const assumptions = useSimStore.getState().assumptions;

    // Configure for predictable verification
    assumptions.loan = {
        enabled: true,
        principal: 500000,
        interestRate: 0.10,
        termMonths: 6,
        repaymentStartMonth: 0,
        monthlyMarketingReinvestment: 3000,
    };
    assumptions.capacity.scalingRules = {
        utilizationThreshold: 0.5, // Low threshold to trigger expansion easily
        maxChairs: 4,
    };
    assumptions.capacity.chairsByMonth = Array(12).fill(2);

    console.log("--- Starting Verification Run ---");
    const result = runSingleSimulation(assumptions);

    console.log(`Initial Loan Balance: ${assumptions.loan!.principal}`);
    console.log(`Loan Repayment (Total/Mo): ${(assumptions.loan!.principal * 1.1) / 6}`);

    result.monthly.forEach((m, idx) => {
        console.log(`Month ${idx + 1}:`);
        console.log(`  Ad Spend: ${m.adSpend} (Base + Loan Reinvestment if > 0)`);
        console.log(`  Net Cashflow: ${m.netCashflow}`);
        console.log(`  Cash on Hand: ${m.cashOnHand}`);
        console.log(`  Chairs Available: ${m.chairHoursAvailable / (assumptions.capacity.daysOpenPerMonth * assumptions.capacity.clinicHoursPerDay)}`);
        console.log(`  Utilization: ${(m.utilizationPct * 100).toFixed(1)}%`);
    });

    console.log("--- Verification Finished ---");
}

verify().catch(console.error);
