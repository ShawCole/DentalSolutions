import { runSingleSimulation } from "./packages/core/sim/runSimulation";
// import { useSimStore } from "./web/lib/store"; // We'll mock this or just defaultAssumptions
import { Assumptions, MonthlyKPI } from "./packages/core/types";

// 1. Recreate the Default Assumptions locally to avoid React hook issues
// Copied from web/lib/store.ts
const defaultAssumptions: Assumptions = {
    pricing: {
        smileDesign: {
            invasive: { cubicZirconia: 12000, porcelain: 8000, porcelainPure: 10000 },
            nonInvasive: { cubicZirconia: 3000, porcelain: 3000, nanotech: 3000 }, // User says $3k
        },
        implants: { min: 1500, mode: 2000, max: 2500 },
        allIn4: { oneArc: 12500, twoArcs: 25000 },
    },
    durations: {
        sanitizationBufferHours: { min: 0.25, mode: 0.33, max: 0.5 },
        smileDesign: {
            nonInvasiveFirstApptHours: { min: 3, mode: 4, max: 5 },
            nonInvasiveSecondDayMins: { min: 10, mode: 20, max: 30 },
            invasiveApptsCount: { min: 3, mode: 3.5, max: 4 },
            invasiveApptHours: { min: 2, mode: 2.5, max: 3 },
            invasiveSpanDays: { min: 7, mode: 8.5, max: 10 },
        },
        implants: {
            oneOrTwoImplantsApptHours: { min: 3, mode: 4, max: 5 },
            threeImplantsAppts: 2,
        },
        allIn4: {
            initialApptHours: { min: 3, mode: 4, max: 5 },
            returnAfterMonths: { min: 3, mode: 3.5, max: 4 },
        },
    },
    capacity: {
        startMonthISO: "2025-11",
        months: 12,
        chairsByMonth: Array.from({ length: 12 }, () => 2),
        doctorsByMonth: Array.from({ length: 12 }, () => 2),
        clinicHoursPerDay: 12,
        daysOpenPerMonth: 26,
        chairCapexPerAdd: 13000,
        chairPurchaseMonths: [],
        xray: { enabledMonthIdx: 3, capex: 5000 },
        tomography: { enabledMonthIdx: null, totalCost: 70000, downpaymentPct: 0.50, financingMonths: 12 },
        scalingRules: { utilizationThreshold: 0.95, maxChairs: 4 },
    },
    staff: {
        doctorCommissionPct: { min: 0.2, mode: 0.2, max: 0.2 },
        closerCommissionPct: { min: 0.1, mode: 0.1, max: 0.1 },
        ownerAsDoctorMonths: 3, // Default
        nurseAssistantMonthly: { min: 500, mode: 650, max: 800 },
        receptionistMonthly: { min: 1000, mode: 1250, max: 1500 },
        commissionStructure: { upfrontPct: 0.5, deferralMonths: 1 },
    },
    financing: {
        downpaymentPct: 1.0, // PAID IN FULL
        termMonthsMix: [{ months: 12, weight: 1 }],
        cadence: "monthly",
        providerFeePct: 0.0,
        fundingLagBusinessDays: 0,
        collectionEfficacy: 1.0,
        financingTakeRatePct: 0.0, // 0% financed
        monthsToPay: 12,
        bookingDeposit: 0,
        bookingLeadTimeDays: { min: 7, mode: 14, max: 28 },
        holdDepositUntilFirstAppt: true,
    },
    funnel: {
        campaigns: [],
        savedCampaigns: [
            {
                id: "1", name: "Simulated Campaign", region: "US",
                funnel: {
                    adSpend: 1500, // User says expenses ~2k, maybe ad spend is part?
                    cpm: 12, impressionsToReachRatio: 1.3, clickToFormRatePct: 3,
                    formCompletionRatePct: 60, contactSubmitRatePct: 80,
                    exitPathSplit: { messagingPct: 70, landingPagePct: 30 },
                    messageResponseRatePct: 40, landingPageConversionPct: 15,
                },
                receivedPicturesRatePct: 100, qualifiedRatePct: 100,
                bookedConsultRatePct: 100, showRatePct: 100, approvalRatePct: 100,
                flightBookedRatePct: 100, arrivalRatePct: 100, // Force high conversion
                packageBias: { smileDesignNonInvasive: 1.0 },
                startMonthIdx: 0, durationMonths: null,
            }
        ],
        rampUpWeeks: 0,
    },
    randomness: { demand: false, durations: false, pricing: false, financing: false, staffing: false },
    seed: 12345,
    mix: {
        master: { smile: 100, implants: 0, allIn4: 0 },
        smileSplit: { nonInvasive: 100, invasive: 0 },
        implantsSplit: { one: 0, two: 0, three: 0 },
        allIn4Split: { oneArc: 0, twoArcs: 0 },
    },
    startingCash: 10000,
    variableCosts: {
        perService: {
            smileNonInvasive: { nanotech: 2000, porcelain: 2000, cubicZirconia: 2000 }, // User says expense 2k
            smileInvasive: { porcelain: 2000, porcelainPure: 2000, cubicZirconia: 2000 },
            implants: { perImplant: 200 },
            allIn4: { oneArc: 1000, twoArcs: 2000 },
        },
        perClient: { hotelNight: 0, foodDay: 0 }, // Disable hospitality to isolate
    },
    fixedCosts: {
        items: [
            { id: "rent", name: "Rent", amountPerMonth: 0 }, // Disable fixed to isolate
            { id: "utils", name: "Utilities", amountPerMonth: 0 },
        ]
    },
    calendar: { timezone: "America/Cancun", openDays: [1, 2, 3, 4, 5, 6] },
    mixSwitchMonthIdx: null,
    secondaryMix: null,
};

// Adjust assumptions to produce ~12 patients
// If everything is 100% conversion...
// We just need enough Ad Spend or mock the schedule.
// But 'runSingleSimulation' calls 'buildDailySchedule'.
// To guarantee 12 patients, we need to ensure demand > capacity (12) or tune ad spend.
// Let's just run it and see what "Ad Spend" vs "Commissions" does.

const results = runSingleSimulation(defaultAssumptions, true);

console.log("\n--- SIMULATION RESULTS (Smile Design NI, Paid In Full) ---");
console.log("Expected: 12 patients/mo (after ramp), Price $3k, Cost $2k\n");

console.log("Month | Pts | Rev | OpEx  | AdSpd | Comm  | Sal   | Var($) | DefCost | Fxd | Notes");
results.monthly.slice(0, 12).forEach((m, idx) => {
    // Reconstruct Variable Cost from OpEx components:
    // OpEx = Ad + Comm + Sal + Fixed + Var + DeferredCost
    // Var + DefCost = OpEx - (Ad + Comm + Sal + Fixed)
    const knownFixed = m.adSpend + m.commissions + m.salaries + 0; // Fixed is 0
    const variableImplied = m.cashStart - m.cashAfterOverhead - knownFixed;

    console.log(
        `M${m.monthIdx + 1}    | ` +
        `${m.patientsTotal?.toString().padEnd(3)} | ` +
        `${m.revenue.toFixed(0).padEnd(5)} | ` +
        `${(m.cashStart - m.cashAfterOverhead).toFixed(0).padEnd(5)} | ` +
        `${m.adSpend.toFixed(0).padEnd(5)} | ` +
        `${m.commissions.toFixed(0).padEnd(5)} | ` +
        `${m.salaries.toFixed(0).padEnd(5)} | ` +
        `${variableImplied.toFixed(0).padEnd(6)} | ` +
        `?       | ` +
        `0   | ` +
        (idx === 3 ? "<- OwnerAsDoctor ends?" : "")
    );
});

console.log("\n--- ACCOUNTING STATEMENTS VERIFICATION (M1) ---");
if (results.accounting) {
    const m1Income = results.accounting.incomeStatements[0];
    const m1CashFlow = results.accounting.cashFlowStatements[0];

    console.log(`M1 Net Income: ${m1Income.netIncome.toFixed(2)}`);
    // @ts-ignore
    console.log(`M1 EBITDA:     ${m1Income.ebitda?.toFixed(2)} (Expect > Net Income)`);
    // @ts-ignore
    console.log(`M1 EBIT:       ${m1Income.ebit?.toFixed(2)}`);

    console.log(`M1 OCF:        ${m1CashFlow.operating.total.toFixed(2)}`);
    console.log(`   Adjustments:`, m1CashFlow.operating.adjustments);
} else {
    console.log("No accounting data generated.");
}
