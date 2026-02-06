
import { runSingleSimulation } from "./web/lib/sim/runSimulation";
import { Assumptions } from "./web/lib/types";

const baseAssumptions: Assumptions = {
    pricing: {
        smileDesign: {
            invasive: { cubicZirconia: 12000, porcelain: 8000, porcelainPure: 10000 },
            nonInvasive: { cubicZirconia: 3000, porcelain: 3000, nanotech: 3000 },
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
        implants: { oneOrTwoImplantsApptHours: { min: 3, mode: 4, max: 5 }, threeImplantsAppts: 2 },
        allIn4: { initialApptHours: { min: 3, mode: 4, max: 5 }, returnAfterMonths: { min: 3, mode: 3.5, max: 4 } },
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
        xray: { enabledMonthIdx: null, capex: 5000 },
        tomography: { enabledMonthIdx: null, totalCost: 70000, downpaymentPct: 0.5, financingMonths: 12 },
        scalingRules: { utilizationThreshold: 0.95, maxChairs: 4 },
    },
    staff: {
        doctorCommissionPct: { min: 0, mode: 0, max: 0 },
        closerCommissionPct: { min: 0, mode: 0, max: 0 },
        ownerAsDoctorMonths: 12,
        nurseAssistantMonthly: { min: 0, mode: 0, max: 0 },
        receptionistMonthly: { min: 0, mode: 0, max: 0 },
        commissionStructure: { upfrontPct: 1.0, deferralMonths: 0 },
    },
    financing: {
        downpaymentPct: 0.2,
        termMonthsMix: [], // should use monthsToPay fallback
        cadence: "monthly",
        providerFeePct: 0.0,
        fundingLagBusinessDays: 0,
        collectionEfficacy: 1.0,
        financingTakeRatePct: 1.0, // 100% financed
        monthsToPay: 3,
        bookingDeposit: 0,
        bookingLeadTimeDays: { min: 0, mode: 0, max: 0 },
        holdDepositUntilFirstAppt: false,
    },
    funnel: {
        campaigns: [],
        savedCampaigns: [
            {
                id: "1", name: "Sim", region: "US",
                funnel: {
                    adSpend: 5000, cpm: 10, impressionsToReachRatio: 1, clickToFormRatePct: 10,
                    formCompletionRatePct: 100, contactSubmitRatePct: 100,
                    exitPathSplit: { messagingPct: 0, landingPagePct: 100 },
                    messageResponseRatePct: 100, landingPageConversionPct: 100,
                },
                receivedPicturesRatePct: 100, qualifiedRatePct: 100, bookedConsultRatePct: 100,
                showRatePct: 100, approvalRatePct: 100, flightBookedRatePct: 100, arrivalRatePct: 100,
                packageBias: { smileDesignNonInvasive: 1.0 },
                startMonthIdx: 0, durationMonths: null,
            }
        ],
        rampUpWeeks: 0,
    },
    randomness: { demand: false, durations: false, pricing: false, financing: false, staffing: false },
    seed: 123,
    mix: { master: { smile: 100, implants: 0, allIn4: 0 }, smileSplit: { nonInvasive: 100, invasive: 0 }, implantsSplit: { one: 0, two: 0, three: 0 }, allIn4Split: { oneArc: 0, twoArcs: 0 } },
    startingCash: 100000,
    variableCosts: { perService: { smileNonInvasive: { nanotech: 0, porcelain: 0, cubicZirconia: 0 }, smileInvasive: { porcelain: 0, porcelainPure: 0, cubicZirconia: 0 }, implants: { perImplant: 0 }, allIn4: { oneArc: 0, twoArcs: 0 } }, perClient: { hotelNight: 0, foodDay: 0 } },
    fixedCosts: { items: [] },
    calendar: { timezone: "America/Cancun", openDays: [1, 2, 3, 4, 5, 6] },
    mixSwitchMonthIdx: null,
    secondaryMix: null,
};

console.log("Running 3 Month Term Simulation...");
const a3 = { ...baseAssumptions, financing: { ...baseAssumptions.financing, monthsToPay: 3 as any } };
const res3 = runSingleSimulation(a3);

console.log("Running 24 Month Term Simulation...");
const a24 = { ...baseAssumptions, financing: { ...baseAssumptions.financing, monthsToPay: 24 as any } };
const res24 = runSingleSimulation(a24);

console.log("\n--- Comparison (Installments Cash) ---");
console.log("Month | 3-Mo Term | 24-Mo Term");
for (let i = 0; i < 6; i++) {
    const m3 = res3.monthly[i];
    const m24 = res24.monthly[i];
    console.log(`M${i + 1}    | ${Math.round(m3.installmentsCash).toString().padEnd(9)} | ${Math.round(m24.installmentsCash)}`);
}

const total3 = res3.monthly.reduce((sum, m) => sum + m.installmentsCash, 0);
const total24 = res24.monthly.reduce((sum, m) => sum + m.installmentsCash, 0);
console.log(`\nTotal Installments (12mo): 3-Mo: ${Math.round(total3)}, 24-Mo: ${Math.round(total24)}`);
