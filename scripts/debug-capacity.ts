
import { buildDailySchedule } from "../packages/core/schedule/daily";
import type { Assumptions } from "../packages/core/types";

console.log("Starting Utilization Checks...");

// BASE SETUP
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
    capacity: {
        startMonthISO: "2025-11", months: 12,
        chairsByMonth: Array(12).fill(2),
        doctorsByMonth: Array(12).fill(2),
        clinicHoursPerDay: 8, daysOpenPerMonth: 20,
        chairCapexPerAdd: 13000, chairPurchaseMonths: [],
        utilization: { openHour: 9, closeHour: 18, maxDoctorsPerDay: 2 },
        xray: { enabledMonthIdx: 3, capex: 5000 },
        tomography: { enabledMonthIdx: null, totalCost: 70000, downpaymentPct: 0.50, financingMonths: 12 },
        scalingRules: { utilizationThreshold: 0.95, maxChairs: 4 },
    },
    staff: {
        doctorCommissionPct: { min: 0.2, mode: 0.2, max: 0.2 }, closerCommissionPct: { min: 0.1, mode: 0.1, max: 0.1 }, ownerAsDoctorMonths: 12,
        nurseAssistantMonthly: { min: 1000, mode: 1250, max: 1500 }, nurseHourlyRate: 25, nurseHoursPerMonth: 160, nurseStartMonthIdx: 0,
        receptionistMonthly: { min: 1000, mode: 1250, max: 1500 }, receptionistStartMonthIdx: 0, commissionStructure: { upfrontPct: 0.5, deferralMonths: 1 },
    },
    financing: {
        downpaymentPct: 0.30, termMonthsMix: [{ months: 12, weight: 1 }], cadence: "monthly", providerFeePct: 0.03, fundingLagBusinessDays: 2,
        collectionEfficacy: 0.99, financingTakeRatePct: 0.70, monthsToPay: 12, bookingDeposit: 500,
        bookingLeadTimeDays: { min: 0, mode: 0, max: 0 },
        holdDepositUntilFirstAppt: true,
    },
    funnel: { campaigns: [], savedCampaigns: [], rampUpWeeks: 0 } as any,
    randomness: { demand: true, durations: true, pricing: false, financing: false, staffing: true }, seed: 12345,
    mix: { master: { smile: 100, implants: 0, allIn4: 0 }, smileSplit: { nonInvasive: 100, invasive: 0 }, implantsSplit: { one: 45, two: 45, three: 10 }, allIn4Split: { oneArc: 70, twoArcs: 30 } },
    startingCash: 10000, variableCosts: {} as any, fixedCosts: { items: [] }, calendar: { timezone: "America/Cancun", openDays: [1, 2, 3, 4, 5, 6] },
    mixSwitchMonthIdx: null, secondaryMix: null, loan: { principal: 27800, interestRate: 0.10, termMonths: 6, repaymentStartMonth: 1, monthlyMarketingReinvestment: 0 },
};

function runTest(name: string, override: (a: Assumptions) => void) {
    const a = JSON.parse(JSON.stringify(baseAssumptions));
    override(a);

    // High Demand
    const demand = { smileDesignInvasive: 0, smileDesignNonInvasive: 20, implants1: 0, implants2: 0, implants3: 0, allIn4One: 0, allIn4Two: 0 };

    const m0 = buildDailySchedule(a, 0, demand);
    console.log(`\n--- TEST: ${name} ---`);
    console.log(`Capacity Hours: ${m0.hoursAvailable} (Per Day: ${m0.hoursAvailable / 20})`);
    console.log(`Hours Used: ${m0.hoursUsed}`);
    console.log(`Served: ${m0.served.smileDesignNonInvasive}`);
}

// 1. Two Chairs, Two Docs, 9-18 (9 hours) => Capacity = 2 * 9 = 18 hrs/day
runTest("2 Chairs, 2 Docs, 9hrs", (a) => {
    a.capacity.chairsByMonth.fill(2);
    a.capacity.doctorsByMonth.fill(2);
    a.capacity.utilization = { openHour: 9, closeHour: 18, maxDoctorsPerDay: 2 };
});

// 2. Two Chairs, One Active Doc => Capacity = 1 * 9 = 9 hrs/day
runTest("2 Chairs, 1 Active Doc, 9hrs", (a) => {
    a.capacity.chairsByMonth.fill(2);
    a.capacity.doctorsByMonth.fill(2); // Still have 2 employed
    a.capacity.utilization = { openHour: 9, closeHour: 18, maxDoctorsPerDay: 1 }; // But only 1 works today
});

// 3. One Chair, Two Active Docs => Capacity = 1 * 9 = 9 hrs/day
runTest("1 Chair, 2 Active Docs, 9hrs", (a) => {
    a.capacity.chairsByMonth.fill(1);
    a.capacity.doctorsByMonth.fill(2);
    a.capacity.utilization = { openHour: 9, closeHour: 18, maxDoctorsPerDay: 2 };
});

// 4. Extended Hours (9-21) => 12 hrs
runTest("2 Chairs, 2 Docs, 12hrs (9-21)", (a) => {
    a.capacity.chairsByMonth.fill(2);
    a.capacity.doctorsByMonth.fill(2);
    a.capacity.utilization = { openHour: 9, closeHour: 21, maxDoctorsPerDay: 2 };
});
