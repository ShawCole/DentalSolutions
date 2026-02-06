
// Helper to calc arrivals
function calcArrivals(c: any, leads: number) {
    const r = c.receivedPicturesRatePct / 100;
    const q = c.qualifiedRatePct / 100;
    const b = c.bookedConsultRatePct / 100;
    const s = c.showRatePct / 100;
    const a = c.approvalRatePct / 100;
    const f = c.flightBookedRatePct / 100;
    const ar = c.arrivalRatePct / 100;
    return leads * r * q * b * s * a * f * ar;
}

const usBroad = {
    receivedPicturesRatePct: 64, qualifiedRatePct: 85, bookedConsultRatePct: 18,
    showRatePct: 50, approvalRatePct: 90, flightBookedRatePct: 100, arrivalRatePct: 100
};
// 145 Leads for US Broad
const usArrivals = calcArrivals(usBroad, 145);
console.log(`US Broad (145 leads): ${usArrivals.toFixed(2)} Arrivals`);

const mexLocal = {
    receivedPicturesRatePct: 30, qualifiedRatePct: 25, bookedConsultRatePct: 40,
    showRatePct: 65, approvalRatePct: 45, flightBookedRatePct: 80, arrivalRatePct: 100
};
// 145 Leads for MEX Local (assuming similar leads for comparison, though actual ad spend differs)
const mexArrivals = calcArrivals(mexLocal, 145);
console.log(`MEX Local (145 leads): ${mexArrivals.toFixed(2)} Arrivals`);

// Actual MEX Local from JSON (Spend 300, CPM 8 => 37.5k imp => 1.3k clicks (3.5%) => 721 forms (55%) => 541 contacts (75%) -> 145 leads)
console.log("---");
console.log(`MEX Local is the ONLY active campaign in simulation.`);
console.log(`Yielding ~1.0 arrival per month.`);
