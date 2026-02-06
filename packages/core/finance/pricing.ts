import type { Assumptions, Triangular } from "../types";
import { triangularFrom } from "../random";

export function estimatePricingPerPatient(a: Assumptions, rng: () => number, kind: keyof ReturnType<typeof emptyServed>) {
    const hospitalityCost = (a.variableCosts.perClient?.hotelNight ?? 0) + (a.variableCosts.perClient?.foodDay ?? 0);

    switch (kind) {
        case "smileDesignNonInvasive": {
            const q = [a.pricing.smileDesign.nonInvasive.nanotech, a.pricing.smileDesign.nonInvasive.porcelain, a.pricing.smileDesign.nonInvasive.cubicZirconia];
            return q[Math.floor(rng() * q.length)]!;
        }
        case "smileDesignInvasive": {
            const q = [a.pricing.smileDesign.invasive.porcelain, a.pricing.smileDesign.invasive.porcelainPure, a.pricing.smileDesign.invasive.cubicZirconia];
            const basePrice = q[Math.floor(rng() * q.length)]!;
            // Pass-through: add hotel/food revenue
            const days = triMode(a.durations.smileDesign.invasiveSpanDays);
            return basePrice + (days * hospitalityCost);
        }
        case "implants1":
        case "implants2":
        case "implants3": {
            const per = triangularFrom(a.pricing.implants, rng);
            const count = kind === "implants1" ? 1 : kind === "implants2" ? 2 : 3;
            return per * count;
        }
        case "allIn4One": return a.pricing.allIn4.oneArc;
        case "allIn4Two": return a.pricing.allIn4.twoArcs;
    }
}

export function emptyServed() {
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

// Deterministic mode helpers
export const triMode = (t: { min: number; mode: number; max: number }) => t.mode;
