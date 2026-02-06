
import { runSingleSimulation } from "../packages/core/sim/runSimulation";
import type { Assumptions } from "../packages/core/types";

console.log("Starting Deeper Debug...");

// INLINED DEFAULTS (Same as before)
function defaultCapacity() {
    return {
        startMonthISO: "2025-11", months: 12,
        chairsByMonth: Array.from({ length: 12 }, () => 2),
        doctorsByMonth: Array.from({ length: 12 }, () => 2),
        clinicHoursPerDay: 12, daysOpenPerMonth: 26,
        chairCapexPerAdd: 13000, chairPurchaseMonths: [],
        xray: { enabledMonthIdx: 3, capex: 5000 },
        tomography: { enabledMonthIdx: null, totalCost: 70000, downpaymentPct: 0.50, financingMonths: 12 },
        scalingRules: { utilizationThreshold: 0.95, maxChairs: 4 },
    };
}
function defaultFunnel() {
    return {
        campaigns: [],
        savedCampaigns: [
            {
                id: "1", name: "US Broad", region: "US",
                funnel: {
                    adSpend: 20000, cpm: 12, impressionsToReachRatio: 1.3,
                    clickToFormRatePct: 3, formCompletionRatePct: 60, contactSubmitRatePct: 80,
                    exitPathSplit: { messagingPct: 70, landingPagePct: 30 },
                    messageResponseRatePct: 40, landingPageConversionPct: 15,
                },
                receivedPicturesRatePct: 64, qualifiedRatePct: 85, bookedConsultRatePct: 9,
                showRatePct: 50, approvalRatePct: 90, flightBookedRatePct: 100, arrivalRatePct: 100,
                packageBias: { smileDesignNonInvasive: 1.0 }, // Force 100% Smile NI
                startMonthIdx: 0, durationMonths: null, timestamp: 123
            }
        ],
        rampUpWeeks: 4,
    };
}

const baseAssumptions: Assumptions = {
    pricing: {
        smileDesign: { invasive: { cubicZirconia: 12000, porcelain: 8000, porcelainPure: 10000 }, nonInvasive: { cubicZirconia: 4000, porcelain: 3500, nanotech: 2500 } },
        implants: { min: 1500, mode: 2000, max: 2500 }, allIn4: { oneArc: 12500, twoArcs: 25000 },
    },
    durations: {
        sanitizationBufferHours: { min: 0.25, mode: 0.33, max: 0.5 },
        smileDesign: { nonInvasiveFirstApptHours: { min: 3, mode: 4, max: 5 }, nonInvasiveSecondDayMins: { min: 10, mode: 20, max: 30 }, invasiveApptsCount: { min: 3, mode: 3.5, max: 4 }, invasiveApptHours: { min: 2, mode: 2.5, max: 3 }, invasiveSpanDays: { min: 7, mode: 8.5, max: 10 } },
        implants: { oneOrTwoImplantsApptHours: { min: 3, mode: 4, max: 5 }, threeImplantsAppts: 2 },
        allIn4: { initialApptHours: { min: 3, mode: 4, max: 5 }, returnAfterMonths: { min: 3, mode: 3.5, max: 4 } },
    },
    capacity: defaultCapacity(),
    staff: {
        doctorCommissionPct: { min: 0.2, mode: 0.2, max: 0.2 }, closerCommissionPct: { min: 0.1, mode: 0.1, max: 0.1 }, ownerAsDoctorMonths: 12,
        nurseAssistantMonthly: { min: 1000, mode: 1250, max: 1500 }, nurseHourlyRate: 25, nurseHoursPerMonth: 160, nurseStartMonthIdx: 0,
        receptionistMonthly: { min: 1000, mode: 1250, max: 1500 }, receptionistStartMonthIdx: 0, commissionStructure: { upfrontPct: 0.5, deferralMonths: 1 },
    },
    financing: {
        downpaymentPct: 0.30, termMonthsMix: [{ months: 12, weight: 1 }], cadence: "monthly", providerFeePct: 0.03, fundingLagBusinessDays: 2,
        collectionEfficacy: 0.99, financingTakeRatePct: 0.70, monthsToPay: 12, bookingDeposit: 500, bookingLeadTimeDays: { min: 7, mode: 14, max: 28 }, holdDepositUntilFirstAppt: true,
    },
    funnel: defaultFunnel(),
    randomness: { demand: true, durations: true, pricing: false, financing: false, staffing: true }, seed: 12345,
    mix: { master: { smile: 100, implants: 0, allIn4: 0 }, smileSplit: { nonInvasive: 100, invasive: 0 }, implantsSplit: { one: 45, two: 45, three: 10 }, allIn4Split: { oneArc: 70, twoArcs: 30 } },
    startingCash: 10000, variableCosts: { perService: { smileNonInvasive: { nanotech: 500, porcelain: 700, cubicZirconia: 800 }, smileInvasive: { porcelain: 1600, porcelainPure: 2000, cubicZirconia: 2400 }, implants: { perImplant: 200 }, allIn4: { oneArc: 1000, twoArcs: 2000 } }, perClient: { hotelNight: 175, foodDay: 75 } },
    fixedCosts: { items: [{ id: "rent", name: "Rent", amountPerMonth: 2300 }] }, calendar: { timezone: "America/Cancun", openDays: [1, 2, 3, 4, 5, 6] },
    mixSwitchMonthIdx: null, secondaryMix: null, loan: { principal: 27800, interestRate: 0.10, termMonths: 6, repaymentStartMonth: 1, monthlyMarketingReinvestment: 0 },
};

function runTest(name: string, overrides: (a: Assumptions) => void) {
    const a = JSON.parse(JSON.stringify(baseAssumptions));
    overrides(a);
    const res = runSingleSimulation(a, true);
    const m0 = res.monthly[0];
    const m1 = res.monthly[1];

    console.log(`\n--- TEST: ${name} ---`);
    console.log(`M0 Revenue: $${m0.revenue.toLocaleString()}`);
    console.log(`M0 Served: ${m0.patientsTotal}`);
    console.log(`M0 Backlog: ${m0.backlogTotal}`);
    console.log(`M0 Util: ${(m0.utilizationPct * 100).toFixed(1)}%`);
    console.log(`M0 Hours Avail: ${m0.chairHoursAvailable}`);
    console.log(`M0 Days Open: ${m0.chairHoursAvailable / Math.min(a.capacity.chairsByMonth[0] * a.capacity.clinicHoursPerDay, a.capacity.doctorsByMonth[0] * 8)}`);

    console.log(`M1 Served: ${m1.patientsTotal}`);
    console.log(`M1 Backlog: ${m1.backlogTotal}`);

    // Check Client Log for gaps
    const logs = res.clientLog.filter(l => l.packageKey === "smileDesignNonInvasive").slice(0, 5);
    logs.forEach((l, i) => {
        console.log(`Client ${i + 1}: Date ${l.appointmentDate}`);
    });
}

// 1. Force HIGH Demand to see if throughput limits to 1
runTest("High Demand Check", (a) => {
    // Override a campaign to give 100 leads
    a.funnel.savedCampaigns[0].funnel.adSpend = 300000;
});

// 2. Default but with long lead time
runTest("Long Lead Time (28 days)", (a) => {
    a.financing.bookingLeadTimeDays.mode = 28;
    // Ensure demand is decent
    a.funnel.savedCampaigns[0].funnel.adSpend = 50000;
});
