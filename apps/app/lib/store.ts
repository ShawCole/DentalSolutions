import { create } from "zustand";
import type { Assumptions, Financing, Pricing, OperationDurations, CapacityPlan, StaffAndCommissions, FunnelAssumptions, MonteCarloResult, MarketingAssumptions, ConversionAssumptions, MixAssumptions, VariableCosts, FixedCosts, BusinessCalendar } from "@dentalsolutions/core";

function defaultPricing(): Pricing {
    return {
        smileDesign: {
            invasive: { cubicZirconia: 12000, porcelain: 8000, porcelainPure: 10000 },
            nonInvasive: { cubicZirconia: 4000, porcelain: 3500, nanotech: 2500 },
        },
        implants: { min: 1500, mode: 2000, max: 2500 },
        allIn4: { oneArc: 12500, twoArcs: 25000 },
    };
}

function defaultDurations(): OperationDurations {
    return {
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
    };
}

function defaultCapacity(): CapacityPlan {
    return {
        startMonthISO: "2025-11",
        months: 12,
        chairsByMonth: Array.from({ length: 12 }, () => 2),
        doctorsByMonth: Array.from({ length: 12 }, () => 2),
        clinicHoursPerDay: 12,
        daysOpenPerMonth: 26,
        chairCapexPerAdd: 13000,
        chairPurchaseMonths: [],
        utilization: { openHour: 9, closeHour: 18, maxDoctorsPerDay: 2 },
        xray: { enabledMonthIdx: 3, capex: 5000 },
        tomography: {
            enabledMonthIdx: null, // Not enabled by default
            totalCost: 70000,
            downpaymentPct: 0.50, // 50% down
            financingMonths: 12 // 1 year financing
        },
        scalingRules: { utilizationThreshold: 0.95, maxChairs: 4 },
    };
}

function defaultStaff(): StaffAndCommissions {
    return {
        doctorCommissionPct: { min: 0.2, mode: 0.2, max: 0.2 }, // Fixed 20%
        closerCommissionPct: { min: 0.1, mode: 0.1, max: 0.1 }, // Fixed 10%
        ownerAsDoctorMonths: 12,
        nurseAssistantMonthly: { min: 1000, mode: 1250, max: 1500 },
        nurseHourlyRate: 25,
        nurseHoursPerMonth: 160,
        nurseStartMonthIdx: 0,
        receptionistMonthly: { min: 1000, mode: 1250, max: 1500 },
        receptionistStartMonthIdx: 0,
        commissionStructure: { upfrontPct: 0.5, deferralMonths: 1 },
    };
}

function defaultFinancing(): Financing {
    return {
        downpaymentPct: 0.30, // Updated 30%
        termMonthsMix: [
            { months: 12, weight: 1 },
        ],
        cadence: "monthly",
        providerFeePct: 0.03, // Updated 3%
        fundingLagBusinessDays: 2,
        collectionEfficacy: 0.99,
        financingTakeRatePct: 0.70, // Updated 70%
        monthsToPay: 12,
        bookingDeposit: 500,
        bookingLeadTimeDays: { min: 7, mode: 14, max: 28 },
        holdDepositUntilFirstAppt: true,
    };
}

function defaultFunnel(): FunnelAssumptions {
    return {
        campaigns: [
            {
                id: "1", name: "US Broad", region: "US",
                funnel: {
                    adSpend: 20000, cpm: 12,
                    impressionsToReachRatio: 1.3,
                    clickToFormRatePct: 3,
                    formCompletionRatePct: 60,
                    contactSubmitRatePct: 80,
                    exitPathSplit: { messagingPct: 70, landingPagePct: 30 },
                    messageResponseRatePct: 40,
                    landingPageConversionPct: 15,
                },
                startMonthIdx: 0, durationMonths: null,
            },
            {
                id: "2", name: "US High Intent", region: "US",
                funnel: {
                    adSpend: 10000, cpm: 25,
                    impressionsToReachRatio: 1.4,
                    clickToFormRatePct: 5,
                    formCompletionRatePct: 70,
                    contactSubmitRatePct: 85,
                    exitPathSplit: { messagingPct: 60, landingPagePct: 40 },
                    messageResponseRatePct: 50,
                    landingPageConversionPct: 20,
                },
                startMonthIdx: 0, durationMonths: null,
            },
            {
                id: "3", name: "US Retargeting", region: "US",
                funnel: {
                    adSpend: 7000, cpm: 10,
                    impressionsToReachRatio: 2.5,
                    clickToFormRatePct: 8,
                    formCompletionRatePct: 75,
                    contactSubmitRatePct: 90,
                    exitPathSplit: { messagingPct: 80, landingPagePct: 20 },
                    messageResponseRatePct: 60,
                    landingPageConversionPct: 25,
                },
                startMonthIdx: 0, durationMonths: null,
            },
            {
                id: "4", name: "MEX Local", region: "MEX",
                funnel: {
                    adSpend: 15000, cpm: 8,
                    impressionsToReachRatio: 1.2,
                    clickToFormRatePct: 4,
                    formCompletionRatePct: 55,
                    contactSubmitRatePct: 75,
                    exitPathSplit: { messagingPct: 65, landingPagePct: 35 },
                    messageResponseRatePct: 35,
                    landingPageConversionPct: 12,
                },
                startMonthIdx: 0, durationMonths: null,
            },
            {
                id: "5", name: "MEX Search", region: "MEX",
                funnel: {
                    adSpend: 5000, cpm: 20,
                    impressionsToReachRatio: 1.5,
                    clickToFormRatePct: 6,
                    formCompletionRatePct: 65,
                    contactSubmitRatePct: 82,
                    exitPathSplit: { messagingPct: 55, landingPagePct: 45 },
                    messageResponseRatePct: 45,
                    landingPageConversionPct: 18,
                },
                startMonthIdx: 0, durationMonths: null,
            },
        ],
        savedCampaigns: [
            {
                id: "2", name: "US High Intent (US)", region: "US",
                funnel: {
                    adSpend: 3000, cpm: 21,
                    impressionsToReachRatio: 1.4,
                    clickToFormRatePct: 5,
                    formCompletionRatePct: 70,
                    contactSubmitRatePct: 85,
                    exitPathSplit: { messagingPct: 60, landingPagePct: 40 },
                    messageResponseRatePct: 50,
                    landingPageConversionPct: 20,
                },
                startMonthIdx: 0, durationMonths: null,
                timestamp: Date.now()
            }
        ],
        rampUpWeeks: 4,
    };
}


export type SimState = {
    assumptions: Assumptions;
    setAssumptions: (p: Partial<Assumptions>) => void;
    lastResult: MonteCarloResult | null;
    setResult: (r: MonteCarloResult | null) => void;
    runs: number;
    setRuns: (n: number) => void;
};

export const useSimStore = create<SimState>((set) => ({
    assumptions: {
        pricing: defaultPricing(),
        durations: defaultDurations(),
        capacity: defaultCapacity(),
        staff: defaultStaff(),
        financing: defaultFinancing(),
        funnel: defaultFunnel(),
        randomness: { demand: true, durations: true, pricing: false, financing: false, staffing: true },
        seed: 12345,
        mix: defaultMix(),
        salesRates: {
            receivedPicturesRatePct: 64,
            qualifiedRatePct: 85,
            bookedConsultRatePct: 18,
            showRatePct: 50,
            approvalRatePct: 90,
            flightBookedRatePct: 100,
            arrivalRatePct: 100,
        },
        startingCash: 10000,
        variableCosts: defaultVariableCosts(),
        fixedCosts: defaultFixedCosts(),
        calendar: defaultBusinessCalendar(),
        mixSwitchMonthIdx: null,
        secondaryMix: null,
        loan: {
            enabled: true,
            principal: 27800,
            interestRate: 0.10,
            termMonths: 6,
            repaymentStartMonth: 1,
            monthlyMarketingReinvestment: 0,
        },
    },
    setAssumptions: (p) => set((s) => ({ assumptions: { ...s.assumptions, ...p } })),
    lastResult: null,
    setResult: (r) => set({ lastResult: r }),
    runs: 200,
    setRuns: (n) => set({ runs: Math.max(1, Math.floor(n)) }),
}));

// DEPRECATED: Replaced by Campaign within defaultFunnel
function defaultMarketing() { return {}; }
function defaultConversions() { return {}; }

function defaultMix(): MixAssumptions {
    return {
        master: { smile: 60, implants: 40, allIn4: 0 },
        smileSplit: { nonInvasive: 60, invasive: 40 },
        implantsSplit: { one: 45, two: 45, three: 10 },
        allIn4Split: { oneArc: 70, twoArcs: 30 },
    };
}

function defaultVariableCosts(): VariableCosts {
    return {
        perService: {
            smileNonInvasive: {
                nanotech: 0.2 * 2500,
                porcelain: 0.2 * 3500,
                cubicZirconia: 0.2 * 4000,
            },
            smileInvasive: {
                porcelain: 0.2 * 8000,
                porcelainPure: 0.2 * 10000,
                cubicZirconia: 0.2 * 12000,
            },
            implants: { perImplant: 200 },
            allIn4: { oneArc: 1000, twoArcs: 2000 },
        },
        perClient: { hotelNight: 175, foodDay: 75 }, // Updated from prompt
    };
}

function defaultFixedCosts(): FixedCosts {
    return {
        items: [
            { id: "rent", name: "Rent", amountPerMonth: 2300 },
            { id: "utilities", name: "Utilities", amountPerMonth: 600 },
            { id: "valet", name: "Valet", amountPerMonth: 200 },
        ],
    };
}

function defaultBusinessCalendar(): BusinessCalendar {
    return { timezone: "America/Cancun", openDays: [1, 2, 3, 4, 5, 6] };
}


