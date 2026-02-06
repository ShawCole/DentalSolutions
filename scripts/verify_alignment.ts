import { runSingleSimulation } from "../web/lib/sim/runSimulation";
import { Assumptions } from "../web/lib/types";

// Mock assumptions based on defaultStore
const a: any = {
    seed: 12345,
    startingCash: 10000,
    capacity: {
        months: 12,
        chairsByMonth: Array(12).fill(2),
        doctorsByMonth: Array(12).fill(2),
        clinicHoursPerDay: 12,
        daysOpenPerMonth: 26,
        chairCapexPerAdd: 13000,
        xray: { enabledMonthIdx: null, capex: 70000 }
    },
    pricing: {
        smileDesign: {
            invasive: { cubicZirconia: 12000, porcelain: 8000, porcelainPure: 10000 },
            nonInvasive: { cubicZirconia: 5400, porcelain: 4900, nanotech: 4400 },
        },
        implants: { min: 2000, mode: 2000, max: 2000 },
        allIn4: { oneArc: 12500, twoArcs: 25000 },
    },
    durations: {
        sanitizationBufferHours: { min: 0.25, mode: 0.33, max: 0.5 },
        smileDesign: {
            nonInvasiveFirstApptHours: { min: 3, mode: 4, max: 5 },
            invasiveApptHours: { min: 2, mode: 2.5, max: 3 },
            invasiveApptsCount: { min: 3, mode: 3, max: 3 },
            invasiveSpanDays: { min: 10, mode: 10, max: 10 },
        },
        implants: { oneOrTwoImplantsApptHours: { min: 4, mode: 4, max: 4 } },
        allIn4: { initialApptHours: { min: 4, mode: 4, max: 4 }, returnAfterMonths: { min: 3, mode: 3, max: 3 } }
    },
    marketing: { adSpendPerMonth: 10000, cpm: 20, visitRatePct: 2, clickRatePct: 30, whatsappRatePct: 35 },
    conversions: { bookedConsultRatePct: 60, showRatePct: 70, approvalRatePct: 100, flightBookedRatePct: 100, arrivalRatePct: 100 },
    mix: {
        master: { smile: 100, implants: 0, allIn4: 0 },
        smileSplit: { nonInvasive: 0, invasive: 100 } // All Invasive
    },
    financing: {
        downpaymentPct: 0.4,
        financingTakeRatePct: 1.0, // all patients finance
        providerFeePct: 0.05,
        collectionEfficacy: 0.99,
        termMonthsMix: [{ months: 12, weight: 1 }],
        monthsToPay: 12
    },
    variableCosts: {
        perService: {
            smileInvasive: { porcelain: 1000, porcelainPure: 1000, cubicZirconia: 1000 },
            smileNonInvasive: { nanotech: 500, porcelain: 500, cubicZirconia: 500 },
            implants: { perImplant: 200 },
            allIn4: { oneArc: 2000, twoArcs: 4000 }
        },
        perClient: { hotelNight: 100, foodDay: 50 } // $150/day
    },
    funnel: { rampUpWeeks: 4 },
    staff: {
        nurseAssistantMonthly: { min: 600, mode: 600, max: 600 },
        receptionistMonthly: { min: 1200, mode: 1200, max: 1200 },
        doctorCommissionPct: { min: 0.25, mode: 0.25, max: 0.25 },
        ownerAsDoctorMonths: 0
    },
    fixedCosts: { items: [] }
};

const result = runSingleSimulation(a);

console.log("=== LOGIC VERIFICATION ===");

// 1. Revenue Pass-through (Invasive Smile Design)
// Base price for invasive porcelain is $8000. 10 days of hospitality is 10 * 150 = 1500. Expected revenue/patient = 9500.
const month1 = result.monthly[0];
const patients = month1.patientsByPackage.smileDesignInvasive;
const avgRevPerPatient = month1.revenue / patients;
console.log(`1. Revenue Pass-through (Target ~$9500): $${avgRevPerPatient.toFixed(2)}`);

// 2. Marketing Ramp-up
// Month 2 should have ~double the patients of Month 1 (assuming linear ramp-up of 4 weeks)
const month2 = result.monthly[1];
const rampRatio = month2.patientsTotal! / month1.patientsTotal!;
console.log(`2. Ramp-up Ratio (M2/M1, Target ~2.0): ${rampRatio.toFixed(2)}`);

// 3. Upfront Provider Fee and Downpayment
// Financed = 0.6 * 9500 = 5700. Downpayment = 0.4 * 9500 = 3800.
// Bank funds 5700 - 5% fee = 5415. Total upfront cash = 3800 + 5415 = 9215.
const avgUpfrontPerPatient = month1.downpaymentCash / patients;
console.log(`3. Avg Upfront Cash per Patient (Target ~$9215): $${avgUpfrontPerPatient.toFixed(2)}`);

// 4. Collection Efficacy
// Month 2 installments should be 99% of scheduled.
// Month 1 deferred from financier = 5700 per patient. Scheduled for M2 = 5700/12 = 475 per patient.
// Actual M2 installments per M1 patient = 475 * 0.99 = 470.25.
const expectedInstallmentsPerM1Patient = (patients * 5700 / 12) * 0.99;
console.log(`4. Month 2 Installments (Actual: $${month2.installmentsCash.toFixed(2)}, Expected: $${expectedInstallmentsPerM1Patient.toFixed(2)})`);

if (Math.abs(avgRevPerPatient - 9500) < 100 && rampRatio > 1.5 && Math.abs(avgUpfrontPerPatient - 9215) < 100) {
    console.log("\nVERIFICATION SUCCESSFUL");
} else {
    console.log("\nVERIFICATION FAILED - Check calculations");
}
