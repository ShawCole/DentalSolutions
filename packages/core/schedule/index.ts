import type { Assumptions } from "../types";
import { triangularFrom, createSeededRng } from "../random";

export type ScheduleOutcome = {
    monthIdx: number;
    hoursAvailable: number;
    hoursUsed: number;
    served: ReturnType<typeof emptyServed>;
    backlog: ReturnType<typeof emptyServed>;
    followUps: { monthIdx: number; hours: number }[]; // e.g., All-in-4 returns
};

function emptyServed() {
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

function hoursForPackage(a: Assumptions, rng: () => number, key: keyof ReturnType<typeof emptyServed>) {
    const buf = triangularFrom(a.durations.sanitizationBufferHours, rng);
    switch (key) {
        case "smileDesignNonInvasive": {
            const h = triangularFrom(a.durations.smileDesign.nonInvasiveFirstApptHours, rng);
            return h + buf;
        }
        case "smileDesignInvasive": {
            const n = Math.round(triangularFrom(a.durations.smileDesign.invasiveApptsCount, rng));
            const h = triangularFrom(a.durations.smileDesign.invasiveApptHours, rng);
            return n * (h + buf);
        }
        case "implants1":
        case "implants2": {
            const h = triangularFrom(a.durations.implants.oneOrTwoImplantsApptHours, rng);
            return h + buf;
        }
        case "implants3": {
            const h = triangularFrom(a.durations.implants.oneOrTwoImplantsApptHours, rng);
            return 2 * (h + buf);
        }
        case "allIn4One": {
            const h = triangularFrom(a.durations.allIn4.initialApptHours, rng);
            return h + buf; // initial month only
        }
        case "allIn4Two": {
            const h = triangularFrom(a.durations.allIn4.initialApptHours, rng);
            return 2 * (h + buf); // two consecutive initial appts
        }
    }
}

export function scheduleMonth(
    a: Assumptions,
    monthIdx: number,
    demand: ReturnType<typeof emptyServed>,
    carryOver: ReturnType<typeof emptyServed>,
    reservedHours: number // NEW: hours consumed by follow-ups
): ScheduleOutcome {
    const rng = createSeededRng(a.seed + 2000 + monthIdx);
    const chairs = a.capacity.chairsByMonth[monthIdx] ?? a.capacity.chairsByMonth.at(-1)!;
    const doctors = a.capacity.doctorsByMonth[monthIdx] ?? a.capacity.doctorsByMonth.at(-1)!;

    const totalCapacity = Math.min(
        chairs * a.capacity.clinicHoursPerDay * a.capacity.daysOpenPerMonth,
        doctors * 8 * a.capacity.daysOpenPerMonth
    );

    // Deduct reserved capacity first
    const hoursAvailable = Math.max(0, totalCapacity - reservedHours);

    // We track 'hoursUsed' as the NEWLY scheduled hours PLUS reserved
    let hoursUsed = reservedHours;

    const served = emptyServed();
    const backlog = emptyServed();
    const followUps: { monthIdx: number; hours: number }[] = [];

    const keys = Object.keys(served) as (keyof ReturnType<typeof emptyServed>)[];
    for (const key of keys) {
        const totalNeeded = (demand[key] ?? 0) + (carryOver[key] ?? 0);
        for (let i = 0; i < totalNeeded; i++) {
            const needed = hoursForPackage(a, rng, key);
            // Check if we have space in the *remaining* capacity
            // hoursUsed includes reserved, so check against totalCapacity
            if (hoursUsed + needed <= totalCapacity) {
                hoursUsed += needed;
                served[key]++;
                // enqueue follow-up hours for All-in-4 returns
                if (key === "allIn4One" || key === "allIn4Two") {
                    const mLater = Math.max(1, Math.round(triangularFrom(a.durations.allIn4.returnAfterMonths, rng)));
                    const h = triangularFrom(a.durations.allIn4.initialApptHours, rng) + triangularFrom(a.durations.sanitizationBufferHours, rng);
                    followUps.push({ monthIdx: monthIdx + mLater, hours: h });
                }
            } else {
                backlog[key]++;
            }
        }
    }

    // Return the outcome. 
    // hoursAvailable tells the caller how much capacity was theoretically available

    return { monthIdx, hoursAvailable: totalCapacity, hoursUsed, served, backlog, followUps };
}


