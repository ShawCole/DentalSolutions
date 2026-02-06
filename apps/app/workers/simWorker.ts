/* eslint-disable no-restricted-globals */
import type { Assumptions, MonteCarloResult, MonthlyKPI, SimulationResult } from "@dentalsolutions/core";
import { runSingleSimulation, createSeededRng } from "@dentalsolutions/core";

type RequestMsg = { type: "run"; runs: number; assumptions: Assumptions };
type ResponseMsg = { type: "progress"; completed: number; total: number } | { type: "done"; result: MonteCarloResult };

function percentile(values: number[], p: number) {
    if (values.length === 0) return 0;
    const idx = Math.min(values.length - 1, Math.max(0, Math.floor((p / 100) * values.length)));
    const sorted = [...values].sort((a, b) => a - b);
    return sorted[idx];
}

self.onmessage = function (e: MessageEvent<RequestMsg>) {
    const { type } = e.data;
    try {
        if (type !== "run") return;
        const { runs, assumptions } = e.data;

        const results: SimulationResult[] = [];
        const seedRng = createSeededRng(assumptions.seed);

        for (let i = 0; i < runs; i++) {
            const a = { ...assumptions, seed: Math.floor(seedRng() * 1e9) };
            const res = runSingleSimulation(a, i === 0);
            results.push(res);
            if (i % 10 === 0) {
                const msg: ResponseMsg = { type: "progress", completed: i + 1, total: runs };
                // @ts-ignore
                self.postMessage(msg);
            }
        }

        // Aggregate by month
        const months = assumptions.capacity.months;
        const byMonthMean: MonthlyKPI[] = [];
        const p5: MonthlyKPI[] = [];
        const p50: MonthlyKPI[] = [];
        const p95: MonthlyKPI[] = [];

        for (let m = 0; m < months; m++) {
            const revs = results.map((r) => r.monthly[m]?.revenue ?? 0);
            const cash = results.map((r) => r.monthly[m]?.cashOnHand ?? 0);
            const util = results.map((r) => r.monthly[m]?.utilizationPct ?? 0);
            const hours = results.map((r) => r.monthly[m]?.chairHoursUsed ?? 0);
            const avail = results.map((r) => r.monthly[m]?.chairHoursAvailable ?? 0);
            const ads = results.map((r) => r.monthly[m]?.adSpend ?? 0);
            const comms = results.map((r) => r.monthly[m]?.commissions ?? 0);
            const sals = results.map((r) => r.monthly[m]?.salaries ?? 0);
            const caps = results.map((r) => r.monthly[m]?.capex ?? 0);
            const net = results.map((r) => r.monthly[m]?.netCashflow ?? 0);

            // New Metric Aggregations
            const pats = results.map((r) => r.monthly[m]?.patientsTotal ?? 0);
            const revCash = results.map((r) => r.monthly[m]?.revenueCash ?? 0);
            const totDown = results.map((r) => r.monthly[m]?.totalDownpaymentCash ?? 0);
            const finDown = results.map((r) => r.monthly[m]?.financedDownpaymentCash ?? 0);
            const nonFinRev = results.map((r) => r.monthly[m]?.nonFinancedRevenue ?? 0);
            const installs = results.map((r) => r.monthly[m]?.installmentsCash ?? 0);
            const totExp = results.map((r) => r.monthly[m]?.totalExpenses ?? 0);
            const owner = results.map((r) => r.monthly[m]?.ownerPay ?? 0);

            // Critical Fix: Aggregate Cash Start and Cash After Overhead
            const cStarts = results.map((r) => r.monthly[m]?.cashStart ?? 0);
            const cAfter = results.map((r) => r.monthly[m]?.cashAfterOverhead ?? 0);

            const mean = (xs: number[]) => (xs.length ? xs.reduce((s, v) => s + v, 0) / xs.length : 0);
            const mk = (template: MonthlyKPI, overrides: Partial<MonthlyKPI>): MonthlyKPI => ({ ...template, ...overrides });

            const backlogs = results.map((r) => r.monthly[m]?.backlogTotal ?? 0);

            const base: MonthlyKPI = {
                monthIdx: m,
                revenue: 0,
                cashStart: mean(cStarts),
                adSpend: mean(ads),
                commissions: mean(comms),
                salaries: mean(sals),
                cashAfterOverhead: mean(cAfter),
                downpaymentCash: 0, // Deprecated/Legacy
                installmentsCash: mean(installs),
                capex: mean(caps),
                netCashflow: mean(net),
                cashOnHand: 0,
                chairHoursAvailable: mean(avail),
                chairHoursUsed: mean(hours),
                utilizationPct: mean(util),
                patientsByPackage: {},
                patientsTotal: mean(pats),
                backlogTotal: 0,

                // New Fields
                revenueCash: mean(revCash),
                totalDownpaymentCash: mean(totDown),
                financedDownpaymentCash: mean(finDown),
                nonFinancedRevenue: mean(nonFinRev),
                totalExpenses: mean(totExp),
                ownerPay: mean(owner),
                fixedCosts: mean(results.map(r => r.monthly[m]?.fixedCosts ?? 0)),
                variableCosts: mean(results.map(r => r.monthly[m]?.variableCosts ?? 0)),
                closerCommissions: mean(results.map(r => r.monthly[m]?.closerCommissions ?? 0)),
                commissionsByDoctor: results.length > 0 && results[0]?.monthly[m]
                    ? (results[0].monthly[m].commissionsByDoctor || []).map((_, i) =>
                        mean(results.map(r => r.monthly[m]?.commissionsByDoctor?.[i] ?? 0))
                    )
                    : []
            };

            const finalMean = mk(base, {
                revenue: mean(revs),
                cashOnHand: mean(cash),
                backlogTotal: mean(backlogs),
            });

            byMonthMean.push(finalMean);
            p5.push(mk(base, { revenue: percentile(revs, 5), cashOnHand: percentile(cash, 5), backlogTotal: percentile(backlogs, 5) }));
            p50.push(mk(base, { revenue: percentile(revs, 50), cashOnHand: percentile(cash, 50), backlogTotal: percentile(backlogs, 50) }));
            p95.push(mk(base, { revenue: percentile(revs, 95), cashOnHand: percentile(cash, 95), backlogTotal: percentile(backlogs, 95) }));
        }

        const mean = (xs: number[]) => (xs.length ? xs.reduce((s, v) => s + v, 0) / xs.length : 0);

        const result: MonteCarloResult = {
            runs,
            byMonthMean,
            percentiles: { p5, p50, p95 },
            ytd: {
                revenue: mean(results.map(r => r.ytd.revenue)),
                netCashflow: mean(results.map(r => r.ytd.netCashflow)),
            },
            clientLog: results[0]?.clientLog || [],
            ledgerEvents: results[0]?.ledgerEvents || []
        };
        console.log(`[simWorker] Returning final result with ${result.ledgerEvents?.length || 0} ledger events`);

        const done: ResponseMsg = { type: "done", result };
        // @ts-ignore
        self.postMessage(done);

    } catch (err: any) {
        console.error("Worker Error:", err);
        // @ts-ignore
        self.postMessage({ type: "error", error: err.message || String(err) });
    }
};
