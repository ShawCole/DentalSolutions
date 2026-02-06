// Deterministic seeded PRNG (Mulberry32)
export function createSeededRng(seed: number) {
    let s = seed >>> 0;
    return function rng() {
        s += 0x6d2b79f5;
        let t = Math.imul(s ^ (s >>> 15), 1 | s);
        t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

// Triangular distribution
export function triangular(rng: () => number, min: number, mode: number, max: number) {
    if (!(min <= mode && mode <= max)) throw new Error("triangular: require min <= mode <= max");
    const u = rng();
    const c = (mode - min) / (max - min);
    if (u < c) {
        return min + Math.sqrt(u * (max - min) * (mode - min));
    }
    return max - Math.sqrt((1 - u) * (max - min) * (max - mode));
}

export function triangularFrom({ min, mode, max }: { min: number; mode: number; max: number }, rng: () => number) {
    return triangular(rng, min, mode, max);
}

export function pickWeighted<T>(rng: () => number, items: { value: T; weight: number }[]): T {
    const total = items.reduce((s, it) => s + Math.max(0, it.weight), 0);
    if (total <= 0) return items[0]!.value;
    let r = rng() * total;
    for (const it of items) {
        r -= Math.max(0, it.weight);
        if (r <= 0) return it.value;
    }
    return items[items.length - 1]!.value;
}


