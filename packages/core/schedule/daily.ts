import type { Assumptions, ClientLogEntry } from "../types";
import { createSeededRng } from "../random";
import { estimatePricingPerPatient } from "../finance/pricing";
import { getRandomName } from "../names";

export type DailyEntry = {
    packageKey: keyof ReturnType<typeof emptyCounts>;
    hours: number;
    revenue: number;
    clientId: string;
    firstName: string;
    lastName: string;
    apptIndex: number; // 1-based
    apptTotal: number;
    doctorIndex: number;
};

export type DaySummary = {
    date: Date;
    dayIndex: number;
    entries: DailyEntry[];
    hoursUsed: number;
    revenue: number;
};

export type ScheduleResult = {
    summaries: DaySummary[];
    clientLog: ClientLogEntry[];
    served: ReturnType<typeof emptyCounts>;
    backlog: ReturnType<typeof emptyCounts>;
    hoursUsed: number;
    hoursAvailable: number;
    totalRevenue: number;
    revenueByPackage: Record<string, number>;
    followUps: { monthIdx: number; hours: number }[];
};

function emptyCounts() {
    return {
        smileDesignInvasive: 0,
        smileDesignNonInvasive: 0,
        implants1: 0,
        implants2: 0,
        implants3: 0,
        allIn4One: 0,
        allIn4Two: 0,
    };
}

function hoursForKey(a: Assumptions, key: keyof ReturnType<typeof emptyCounts>): number {
    const buf = a.durations.sanitizationBufferHours.mode;
    switch (key) {
        case "smileDesignNonInvasive": {
            const h = a.durations.smileDesign.nonInvasiveFirstApptHours.mode;
            return h + buf;
        }
        case "smileDesignInvasive": {
            const n = Math.round(a.durations.smileDesign.invasiveApptsCount.mode);
            const h = a.durations.smileDesign.invasiveApptHours.mode;
            return n * (h + buf);
        }
        case "implants1":
        case "implants2": {
            const h = a.durations.implants.oneOrTwoImplantsApptHours.mode;
            return h + buf;
        }
        case "implants3": {
            const h = a.durations.implants.oneOrTwoImplantsApptHours.mode;
            return 2 * (h + buf);
        }
        case "allIn4One": {
            const h = a.durations.allIn4.initialApptHours.mode;
            return h + buf;
        }
        case "allIn4Two": {
            const h = a.durations.allIn4.initialApptHours.mode;
            return 2 * (h + buf);
        }
    }
}

function listMonthOpenDays(a: Assumptions, monthIdx: number): Date[] {
    const [y, m] = a.capacity.startMonthISO.split("-").map(Number);
    const start = new Date(Date.UTC(y, (m - 1) + monthIdx, 1));
    const end = new Date(Date.UTC(y, (m - 1) + monthIdx + 1, 0));
    const days: Date[] = [];
    for (let d = new Date(start); d <= end; d = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1))) {
        const dow = d.getUTCDay();
        if (dow >= 1 && dow <= 6) days.push(new Date(d));
    }
    return days;
}

export function generateCountsForMonth(a: Assumptions, monthIdx: number): ReturnType<typeof emptyCounts> {
    const demandCounts = emptyCounts();
    const currentMix = a.secondaryMix && a.mixSwitchMonthIdx !== null && monthIdx >= a.mixSwitchMonthIdx
        ? a.secondaryMix
        : a.mix;

    const rampMultiplier = Math.min(1, ((monthIdx + 0.5) * 4) / Math.max(1, a.funnel.rampUpWeeks));

    // 1. Calculate Total Leads from ALL active campaigns
    let totalLeads = 0;
    a.funnel.savedCampaigns.forEach(camp => {
        const start = camp.startMonthIdx || 0;
        const dur = camp.durationMonths;
        const isActive = monthIdx >= start && (dur === null || monthIdx < start + dur);

        if (isActive) {
            const f = camp.funnel;
            const imp = (f.adSpend / Math.max(1, f.cpm)) * 1000;
            const clicks = imp * (f.clickToFormRatePct / 100);
            const completed = clicks * (f.formCompletionRatePct / 100);
            const submitted = completed * (f.contactSubmitRatePct / 100);
            const msgLeads = submitted * (f.exitPathSplit.messagingPct / 100) * (f.messageResponseRatePct / 100);
            const landingPageLeads = submitted * (f.exitPathSplit.landingPagePct / 100) * (f.landingPageConversionPct / 100);
            totalLeads += (msgLeads + landingPageLeads);
        }
    });

    // 2. Apply GLOBAL Sales Rates
    const s = a.salesRates;
    const conversion =
        (s.receivedPicturesRatePct / 100) *
        (s.qualifiedRatePct / 100) *
        (s.bookedConsultRatePct / 100) *
        (s.showRatePct / 100) *
        (s.approvalRatePct / 100) *
        (s.flightBookedRatePct / 100) *
        (s.arrivalRatePct / 100);

    const arrivals = Math.round(totalLeads * conversion * rampMultiplier);

    // 3. Apply GLOBAL Treatment Mix
    const unlocked = a.capacity.xray.enabledMonthIdx !== null && monthIdx >= (a.capacity.xray.enabledMonthIdx ?? 999);
    const master = currentMix.master;
    const smileShare = master.smile / 100;
    const implantsShare = master.implants / 100;
    const allIn4Share = unlocked ? master.allIn4 / 100 : 0;
    const renorm = smileShare + implantsShare + allIn4Share || 1;

    const sP = (arrivals * smileShare) / renorm;
    const iP = (arrivals * implantsShare) / renorm;
    const aP = (arrivals * allIn4Share) / renorm;

    demandCounts.smileDesignNonInvasive += Math.round(sP * (currentMix.smileSplit.nonInvasive / 100));
    demandCounts.smileDesignInvasive += Math.round(sP * (currentMix.smileSplit.invasive / 100));
    demandCounts.implants1 += Math.round(iP * (currentMix.implantsSplit.one / 100));
    demandCounts.implants2 += Math.round(iP * (currentMix.implantsSplit.two / 100));
    demandCounts.implants3 += Math.round(iP * (currentMix.implantsSplit.three / 100));
    if (unlocked) {
        demandCounts.allIn4One += Math.round(aP * (currentMix.allIn4Split.oneArc / 100));
        demandCounts.allIn4Two += Math.round(aP * (currentMix.allIn4Split.twoArcs / 100));
    }

    return demandCounts;
}

export function buildDailySchedule(a: Assumptions, monthIdx: number, demand?: ReturnType<typeof emptyCounts>, carryOver?: ReturnType<typeof emptyCounts>, usedNames?: Set<string>): ScheduleResult {
    const days = listMonthOpenDays(a, monthIdx);
    const rng = createSeededRng(a.seed + 5000 + monthIdx);
    const counts = demand ?? generateCountsForMonth(a, monthIdx);
    const summaries: DaySummary[] = days.map((d, i) => ({ date: d, dayIndex: i, entries: [], hoursUsed: 0, revenue: 0 }));
    const clientLog: ClientLogEntry[] = [];
    const served = emptyCounts();
    const backlog = emptyCounts();
    const followUps: { monthIdx: number; hours: number }[] = [];

    const chairs = a.capacity.chairsByMonth[monthIdx] ?? a.capacity.chairsByMonth.at(-1)!;
    const employedDoctors = a.capacity.doctorsByMonth[monthIdx] ?? a.capacity.doctorsByMonth.at(-1)!;

    const util = a.capacity.utilization || { openHour: 9, closeHour: 18, maxDoctorsPerDay: 2 };
    const hoursPerDay = Math.max(1, util.closeHour - util.openHour);
    const activeDoctors = Math.min(employedDoctors, util.maxDoctorsPerDay);
    const effectiveChairs = Math.min(chairs, activeDoctors);
    const rawCapacity = effectiveChairs * hoursPerDay;
    const dayCapacityHours = Math.max(rawCapacity, (chairs > 0 && employedDoctors > 0) ? 4 : 0);

    function placeAppointment(desiredIdx: number, hours: number): number | null {
        for (let i = Math.max(0, desiredIdx); i < summaries.length; i++) {
            const s = summaries[i];
            if (s.hoursUsed + hours <= dayCapacityHours) {
                return i;
            }
        }
        return null;
    }

    function planFollowups(key: keyof ReturnType<typeof emptyCounts>, firstIdx: number): number[] {
        if (key === "implants3") return [firstIdx, firstIdx + 1];
        if (key === "smileDesignInvasive") {
            const total = Math.max(3, Math.round(a.durations.smileDesign.invasiveApptsCount.mode));
            const span = Math.round(a.durations.smileDesign.invasiveSpanDays.mode);
            const gap = Math.max(1, Math.floor(span / (total - 1)));
            return Array.from({ length: total }, (_, k) => firstIdx + k * gap);
        }
        if (key === "allIn4One") return [firstIdx];
        if (key === "allIn4Two") return [firstIdx, firstIdx + 1];
        return [firstIdx];
    }

    const keys = Object.keys(counts) as (keyof ReturnType<typeof emptyCounts>)[];
    const minDay = monthIdx === 0 ? Math.min(summaries.length - 1, Math.round(a.financing.bookingLeadTimeDays.mode)) : 0;

    for (const key of keys) {
        let backlogCount = carryOver?.[key] || 0;
        while (backlogCount > 0) {
            const hSingle = getHours(key, a);
            const startIdx = placeAppointment(0, hSingle);
            if (startIdx == null) backlog[key]++;
            else scheduleClient(key, startIdx, hSingle, true);
            backlogCount--;
        }

        let demandCount = counts[key];
        while (demandCount > 0) {
            const hSingle = getHours(key, a);
            const startDayLimit = monthIdx === 0 ? minDay : 0;
            const randomStart = startDayLimit + Math.floor(rng() * (summaries.length - startDayLimit));
            const actualStartIdx = placeAppointment(randomStart, hSingle) ?? placeAppointment(startDayLimit, hSingle);

            if (actualStartIdx == null) backlog[key]++;
            else scheduleClient(key, actualStartIdx, hSingle, false);
            demandCount--;
        }
    }

    function getHours(key: keyof ReturnType<typeof emptyCounts>, a: Assumptions) {
        if (key === "implants3") return a.durations.implants.oneOrTwoImplantsApptHours.mode + a.durations.sanitizationBufferHours.mode;
        if (key === "allIn4Two") return a.durations.allIn4.initialApptHours.mode + a.durations.sanitizationBufferHours.mode;
        if (key === "smileDesignInvasive") return a.durations.smileDesign.invasiveApptHours.mode + a.durations.sanitizationBufferHours.mode;
        return hoursForKey(a, key);
    }

    function scheduleClient(key: keyof ReturnType<typeof emptyCounts>, startIdx: number, hSingle: number, isBacklog: boolean) {
        const planIdxs = planFollowups(key, startIdx);
        const clientId = `CL-${key}-${Math.floor(rng() * 1e9)}`;
        let firstName = "", lastName = "", fullName = "", attempts = 0;
        do {
            const res = getRandomName(rng);
            firstName = res.firstName; lastName = res.lastName;
            fullName = `${firstName} ${lastName}`;
            attempts++;
        } while (usedNames && usedNames.has(fullName) && attempts < 10);
        if (usedNames) usedNames.add(fullName);

        const isFinanced = rng() < a.financing.financingTakeRatePct;
        const apptTotal = planIdxs.length;
        const logEntry: ClientLogEntry = {
            id: clientId, firstName, lastName, monthIdx,
            campaignName: isBacklog ? "Backlog" : "New",
            tags: [isFinanced ? "Payment: Financed" : "Payment: PIF"], packageKey: key, revenue: 0, status: "Scheduled"
        };

        logEntry.doctorIndex = Math.floor(rng() * employedDoctors);

        for (let apptIndex = 0; apptIndex < planIdxs.length; apptIndex++) {
            const desired = planIdxs[apptIndex]!;
            const placedIdx = placeAppointment(desired, hSingle);
            if (placedIdx == null) continue;
            const s = summaries[placedIdx]!;
            const revenue = estimatePricingPerPatient(a, rng, key);

            if (apptIndex === 0) {
                s.revenue += revenue;
                logEntry.revenue = revenue;
                logEntry.appointmentDate = s.date.toISOString().split('T')[0];

                if (isFinanced) {
                    const dp = a.financing.downpaymentPct;
                    logEntry.downpayment = revenue * dp;
                    logEntry.installmentCount = a.financing.monthsToPay;
                } else {
                    logEntry.downpayment = revenue;
                    logEntry.installmentCount = 0;
                }
            }
            if (apptIndex === apptTotal - 1) {
                logEntry.completionDate = s.date.toISOString().split('T')[0];
                logEntry.status = "Completed";
            }
            s.entries.push({
                packageKey: key, hours: hSingle, revenue, clientId, firstName, lastName,
                apptIndex: apptIndex + 1, apptTotal, doctorIndex: logEntry.doctorIndex!
            });
            s.hoursUsed += hSingle;
        }
        if (key === "allIn4One" || key === "allIn4Two") {
            const mLater = Math.max(1, Math.round(a.durations.allIn4.returnAfterMonths.mode));
            const h = a.durations.allIn4.initialApptHours.mode + a.durations.sanitizationBufferHours.mode;
            followUps.push({ monthIdx: monthIdx + mLater, hours: h });
        }
        served[key]++;
        clientLog.push(logEntry);
    }

    const hoursUsed = summaries.reduce((s, d) => s + d.hoursUsed, 0);
    const hoursAvailable = summaries.length * dayCapacityHours;
    const totalRevenue = summaries.reduce((s, d) => s + d.revenue, 0);
    const revenueByPackage: Record<string, number> = {};
    summaries.forEach(s => {
        s.entries.forEach(e => {
            if (e.apptIndex === 1) revenueByPackage[e.packageKey] = (revenueByPackage[e.packageKey] || 0) + e.revenue;
        });
    });

    return { summaries, clientLog, served, backlog, hoursUsed, hoursAvailable, totalRevenue, revenueByPackage, followUps };
}
