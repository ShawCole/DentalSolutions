export type Triangular = {
    min: number;
    mode: number;
    max: number;
    apptIndex?: number; // 1-based
    apptTotal?: number;
    doctorIndex?: number;
};

export type MaterialQuality = "cubicZirconia" | "porcelain" | "porcelainPure" | "nanotech";

export type SmileDesignVariant = "invasive" | "nonInvasive";

export type PackageType =
    | { kind: "smileDesign"; variant: SmileDesignVariant; quality: MaterialQuality }
    | { kind: "implants"; count: 1 | 2 | 3 }
    | { kind: "allIn4"; arcs: 1 | 2 };

export type Pricing = {
    smileDesign: {
        invasive: {
            // full-mouth (20 veneers), price includes hotel+food as pass-through in revenue
            cubicZirconia: number; // e.g., 12000
            porcelain: number; // e.g., 8000
            porcelainPure: number; // e.g., 10000
        };
        nonInvasive: {
            cubicZirconia: number; // e.g., 5400
            porcelain: number; // e.g., 4900
            nanotech: number; // e.g., 4400
        };
    };
    implants: Triangular; // price per implant triangular 1500-2000-2500
    allIn4: { oneArc: number; twoArcs: number }; // 12500 / 25000
};

export type OperationDurations = {
    sanitizationBufferHours: Triangular; // e.g., 0.25-0.33-0.5
    smileDesign: {
        nonInvasiveFirstApptHours: Triangular; // 3-5 hours
        nonInvasiveSecondDayMins: Triangular; // 10-30 minutes
        invasiveApptsCount: Triangular; // 3-4 appointments
        invasiveApptHours: Triangular; // 2-3 hours each
        invasiveSpanDays: Triangular; // 7-10 days window
    };
    implants: {
        oneOrTwoImplantsApptHours: Triangular; // 3-5 hours
        threeImplantsAppts: 2; // const: two appointments
    };
    allIn4: {
        initialApptHours: Triangular; // 3-5 hours
        returnAfterMonths: Triangular; // 3-4 months
    };
};

export type CapacityPlan = {
    startMonthISO: string; // e.g., "2025-11"
    months: 12 | 24;
    chairsByMonth: number[]; // length = months
    doctorsByMonth: number[]; // 1-3 per month
    doctorStartMonths?: number[]; // indices
    clinicHoursPerDay: number; // 12 (9-21)
    daysOpenPerMonth: number; // e.g., 26
    chairCapexPerAdd: number; // 13000
    chairPurchaseMonths?: number[]; // month indices when additional chairs are purchased
    utilization: {
        openHour: number; // 0-24, default 9
        closeHour: number; // 0-24, default 18
        maxDoctorsPerDay: number; // Slider 1-5, defaults to total doctors if lower
    };
    xray: { enabledMonthIdx: number | null; capex: number }; // enables All-in-4 after month
    tomography?: {
        enabledMonthIdx: number | null;
        totalCost: number;
        downpaymentPct: number; // e.g., 0.5 for 50%
        financingMonths: number; // e.g., 12 or 24
    };
    scalingRules: {
        utilizationThreshold: number; // e.g., 0.95
        maxChairs: number;           // e.g., 4
    };
};

export type StaffAndCommissions = {
    doctorCommissionPct: Triangular; // 0.2-0.25-0.3 (non-owner)
    closerCommissionPct: Triangular; // e.g., 0.1 (10%)
    ownerAsDoctorMonths: number; // owner works first N months (no commission)
    nurseAssistantMonthly: Triangular; // 500-650-800 per month
    nurseHourlyRate: number;
    nurseHoursPerMonth: number;
    nurseStartMonthIdx: number;
    receptionistMonthly: Triangular; // 1000-1250-1500 per month
    receptionistStartMonthIdx: number;
    commissionStructure: {
        upfrontPct: number; // e.g. 0.5 for 50%
        deferralMonths: number; // e.g. 1
    };
};

export type Financing = {
    downpaymentPct: number; // e.g., 0.35
    termMonthsMix: { months: 3 | 6 | 9 | 12 | 15 | 18; weight: number }[];
    cadence: "monthly" | "biweekly" | "weekly";
    providerFeePct: number; // 0.04
    fundingLagBusinessDays: number; // 2
    collectionEfficacy: number; // 0.99
    financingTakeRatePct: number; // e.g., 0.95 finance, 0.05 pay-in-full
    monthsToPay: 3 | 6 | 9 | 12 | 15 | 18; // default 12
    bookingDeposit: number; // e.g. 500
    bookingLeadTimeDays: Triangular; // e.g., 7-14-28
    holdDepositUntilFirstAppt: boolean; // default true
};

// Unified Ad Funnel - reflects actual Meta/Facebook lead ad flow
export type UnifiedAdFunnel = {
    adSpend: number;
    cpm: number;
    impressionsToReachRatio: number;  // e.g., 1.2 means 120 impressions per 100 unique people
    // Stage 1: Ad → Form
    clickToFormRatePct: number;       // User clicks ad, form opens
    // Stage 2: Form completion
    formCompletionRatePct: number;    // User answers all questions
    // Stage 3: Contact confirmation
    contactSubmitRatePct: number;     // User confirms their contact info
    // Stage 4: Exit path split
    exitPathSplit: {
        messagingPct: number;         // % that choose "Send Message" (WhatsApp)
        landingPagePct: number;       // % that choose "Go to Landing Page"
    };
    // Stage 5: Quality metrics per path
    messageResponseRatePct: number;   // % of messaging leads that respond
    landingPageConversionPct: number; // % of landing page visitors that convert
};


export type Campaign = {
    id: string;
    name: string;
    // Unified Ad Funnel (replaces separate messaging/leadForms)
    funnel: UnifiedAdFunnel;
    // Sales Funnel (after lead is captured)
    // Targeting
    region: "US" | "MEX";
    // Scheduling
    startMonthIdx: number;       // Month when campaign starts (0-indexed)
    durationMonths: number | null; // How many months it runs (null = permanent)
};


export type ClientLogEntry = {
    id: string;
    firstName: string;
    lastName: string;
    monthIdx: number;
    campaignName: string;
    tags: string[]; // e.g. ["US", "Msgr"], ["MEX", "Form"]
    packageKey: string;
    revenue: number;
    appointmentDate?: string;
    completionDate?: string;
    downpayment?: number;
    installmentCount?: number;
    status: "Scheduled" | "Completed" | "Cancelled";
    doctorIndex?: number;
};

export type FunnelAssumptions = {
    campaigns: Campaign[];
    savedCampaigns: (Campaign & { timestamp: number })[];
    rampUpWeeks: number;
};

export type RandomnessToggles = {
    demand: boolean;
    durations: boolean;
    pricing: boolean;
    financing: boolean;
    staffing: boolean;
};

export type Assumptions = {
    pricing: Pricing;
    durations: OperationDurations;
    capacity: CapacityPlan;
    staff: StaffAndCommissions;
    financing: Financing;
    funnel: FunnelAssumptions;
    randomness: RandomnessToggles;
    seed: number;
    mix: MixAssumptions;
    salesRates: {
        receivedPicturesRatePct: number;
        qualifiedRatePct: number;
        bookedConsultRatePct: number;
        showRatePct: number;
        approvalRatePct: number;
        flightBookedRatePct: number;
        arrivalRatePct: number;
    };
    startingCash: number;
    variableCosts: VariableCosts;
    fixedCosts: FixedCosts;
    calendar: BusinessCalendar;
    mixSwitchMonthIdx: number | null; // Month when secondary mix starts
    secondaryMix: MixAssumptions | null;
    loan?: {
        enabled: boolean;
        principal: number;   // e.g., 500000 pesos
        interestRate: number; // e.g., 0.10
        termMonths: number;   // e.g., 6 months
        repaymentStartMonth: number;
        monthlyMarketingReinvestment: number; // e.g., $3,000
    };
};

export type AppointmentBlock = {
    package: PackageType;
    hours: number; // scheduled hours incl. buffer added separately
    monthIdx: number; // target month
};

export type MonthlyKPI = {
    monthIdx: number;
    // Revenue recognized at booking for that month's served patients
    revenue: number;
    // Cash-based details
    cashStart: number;
    adSpend: number;
    commissions: number;
    commissionsByDoctor?: number[];
    closerCommissions?: number;
    salaries: number;
    fixedCosts: number;
    variableCosts: number;
    cashAfterOverhead: number;
    downpaymentCash: number; // Combined (legacy)
    totalDownpaymentCash: number; // Total Cash In (excluding installments)
    revenueCash: number; // New: Immediate cash from sales (Paid in Full + Released Down)
    nonFinancedRevenue: number; // Paid in Full
    financedDownpaymentCash: number; // Downpayments from financing
    installmentsCash: number;
    totalExpenses: number; // OpEx + CapEx
    ownerPay: number; // Distributions
    capex: number; // consolidated (chairs + x-ray)
    netCashflow: number; // cashEnd - cashStart
    cashOnHand: number; // cashEnd
    chairHoursAvailable: number;
    chairHoursUsed: number;
    utilizationPct: number;
    patientsByPackage: Record<string, number>;
    patientsTotal?: number;
    backlogByPackage?: Record<string, number>;
    backlogTotal?: number;
};

export type SimulationResult = {
    monthly: MonthlyKPI[];
    clientLog: ClientLogEntry[];
    ytd: {
        revenue: number;
        operatingCost: number;
        capex: number;
        netCashflow: number;
        cashEnding: number;
    };
    // Double-entry accounting
    accounting?: {
        ledger: import("./accounting/types").GeneralLedger;
        balanceSheets: import("./accounting/types").BalanceSheet[];
        incomeStatements: import("./accounting/types").IncomeStatement[];
        cashFlowStatements: import("./accounting/types").CashFlowStatement[];
    };
    ledgerEvents?: LedgerEvent[];
};

export type LedgerEvent = {
    date: Date;
    kind:
    | "BookingDownpaymentHeld"
    | "HeldDepositRelease"
    | "InstallmentCashReceived"
    | "ServiceRevenue"
    | "MaterialsCost"
    | "HotelCost"
    | "FoodCost"
    | "CommissionFirstHalf"
    | "CommissionSecondHalf"
    | "UtilityBill"
    | "PayrollRun"
    | "FixedCost"
    | "Capex"
    | "LoanRepayment"
    | "InitialCapital"
    | "MarketingExpense";
    amount: number; // positive inflow, negative outflow for cash; revenue/costs flagged below
    cash: boolean;
    revenue: boolean;
    cost: boolean;
    note?: string;
    service?: string;
    clientId?: string;
    patientFirstName?: string;
    patientLastName?: string;
};

export type MonteCarloResult = {
    runs: number;
    byMonthMean: MonthlyKPI[];
    percentiles: {
        p5: MonthlyKPI[];
        p50: MonthlyKPI[];
        p95: MonthlyKPI[];
    };
    ytd: {
        revenue: number;
        netCashflow: number;
    };
    clientLog?: ClientLogEntry[];
    ledgerEvents?: LedgerEvent[];
};

// New UI control types
// DEPRECATED: Replaced by Campaign type
export type MarketingAssumptions = {
    adSpendPerMonth: number;
    cpm: number;
    visitRatePct: number;
    clickRatePct: number;
    whatsappRatePct: number;
};

export type ConversionAssumptions = {
    bookedConsultRatePct: number;
    showRatePct: number;
    approvalRatePct: number;
    flightBookedRatePct: number;
    arrivalRatePct: number;
};

export type MixAssumptions = {
    master: { smile: number; implants: number; allIn4: number }; // sums 100
    smileSplit: { nonInvasive: number; invasive: number }; // sums 100 (inverse)
    implantsSplit: { one: number; two: number; three: number }; // sums 100
    allIn4Split: { oneArc: number; twoArcs: number }; // sums 100
};

export type VariableCosts = {
    perService: {
        smileNonInvasive: { nanotech: number; porcelain: number; cubicZirconia: number };
        smileInvasive: { porcelain: number; porcelainPure: number; cubicZirconia: number };
        implants: { perImplant: number };
        allIn4: { oneArc: number; twoArcs: number };
    };
    perClient?: { hotelNight?: number; foodDay?: number };
};

export type FixedCostItem = { id: string; name: string; amountPerMonth: number };
export type FixedCosts = { items: FixedCostItem[] };

export type BusinessCalendar = {
    timezone: string; // e.g., America/Cancun
    openDays: number[]; // 1-6 = Mon-Sat
};


