"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useSimStore } from "@/lib/store";
import { buildDailySchedule, buildLedger } from "@dentalsolutions/core";

export default function CalendarPage() {
    const { assumptions } = useSimStore();
    const [monthIdx, setMonthIdx] = useState(0);
    const [metric, setMetric] = useState<"revenue" | "costs" | "net">("revenue");

    const days = useMemo(() => buildDailySchedule(assumptions, monthIdx), [assumptions, monthIdx]);
    const monthMeta = useMemo(() => {
        const y = Number(assumptions.capacity.startMonthISO.split("-")[0]);
        const m0 = Number(assumptions.capacity.startMonthISO.split("-")[1]);
        const start = new Date(Date.UTC(y, (m0 - 1) + monthIdx, 1));
        const end = new Date(Date.UTC(y, (m0 - 1) + monthIdx + 1, 0));
        const startDow = start.getUTCDay(); // 0=Sun .. 6=Sat
        const daysAll: Date[] = [];
        for (let d = new Date(start); d <= end; d = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1))) {
            daysAll.push(new Date(d));
        }
        const dayMap = new Map<string, (typeof days.summaries)[0]>();
        for (const d of days.summaries) {
            dayMap.set(d.date.toISOString().slice(0, 10), d);
        }
        const trailing = (7 - ((startDow + daysAll.length) % 7)) % 7;
        const monthLabel = start.toLocaleString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
        return { start, end, startDow, trailing, daysAll, dayMap, monthLabel };
    }, [assumptions, monthIdx, days]);

    const calendarDays = useMemo(() => {
        return monthMeta.daysAll.map((date) => {
            const key = date.toISOString().slice(0, 10);
            const dEntry = monthMeta.dayMap.get(key);
            const open = date.getUTCDay() !== 0; // Mon-Sat open, Sun closed
            const entries = dEntry?.entries ?? [];
            const hoursUsed = dEntry?.hoursUsed || 0;
            return { key, date, open, entries, hoursUsed };
        });
    }, [monthMeta]);

    const toOrdinal = (n: number) => {
        const s = ["th", "st", "nd", "rd"] as const;
        const v = n % 100;
        // @ts-ignore
        const suf = s[(v - 20) % 10] || s[v] || s[0];
        return `${n}${suf}`;
    };
    const dayCapacityHours = useMemo(() => {
        const chairs = assumptions.capacity.chairsByMonth[monthIdx] ?? assumptions.capacity.chairsByMonth.at(-1)!;
        const doctors = assumptions.capacity.doctorsByMonth[monthIdx] ?? assumptions.capacity.doctorsByMonth.at(-1)!;
        return Math.min(chairs * assumptions.capacity.clinicHoursPerDay, doctors * 8);
    }, [assumptions, monthIdx]);

    // Ledger-based daily figures for this month
    const dailyFinance = useMemo(() => {
        const evs = buildLedger(assumptions);
        const map = new Map<string, { revenue: number; revenueCash: number; installments: number; costs: number; firstCount: number; completionCount: number }>();
        const y = Number(assumptions.capacity.startMonthISO.split("-")[0]);
        const m0 = Number(assumptions.capacity.startMonthISO.split("-")[1]);
        const monthStart = new Date(Date.UTC(y, (m0 - 1) + monthIdx, 1));
        const monthEnd = new Date(Date.UTC(y, (m0 - 1) + monthIdx + 1, 0));
        for (const ev of evs) {
            if (ev.date < monthStart || ev.date > monthEnd) continue;
            const key = ev.date.toISOString().slice(0, 10);
            if (!map.has(key)) map.set(key, { revenue: 0, revenueCash: 0, installments: 0, costs: 0, firstCount: 0, completionCount: 0 });
            const agg = map.get(key)!;
            // Revenue recognized only from service revenue events
            if (ev.kind === "ServiceRevenue") {
                agg.revenue += ev.amount;
                agg.firstCount += 1;
            }
            // Cash collected related to revenue: downpayment release/no-hold and installments only (positive inflows)
            if (ev.kind === "HeldDepositRelease" || (ev.kind === "BookingDownpaymentHeld" && ev.cash)) {
                if (ev.amount > 0) agg.revenueCash += ev.amount;
            }
            if (ev.kind === "InstallmentCashReceived") {
                if (ev.amount > 0) {
                    agg.revenueCash += ev.amount;
                    agg.installments += ev.amount;
                }
            }
            // Costs
            if (ev.cost) agg.costs += Math.abs(ev.amount);
            // Completion proxy (2nd/last appt commissions)
            if (ev.kind === "CommissionSecondHalf") agg.completionCount += 1;
        }
        return map;
    }, [assumptions, monthIdx]);

    // Active clients per day ("still here" between first and completion spans)
    const activeByDay = useMemo(() => {
        const map = new Map<string, number>();
        const labelFor = (k: string) => String(k);
        const addMonthsSameDay = (d: Date, months: number) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + months, d.getUTCDate()));
        const spanFor = (pkgKey: string, firstDate: Date): { spans: { start: Date; end: Date }[] } => {
            switch (pkgKey) {
                case "smileDesignNonInvasive": {
                    // Active only on the treatment day for 1-n-done metrics
                    const end = new Date(Date.UTC(firstDate.getUTCFullYear(), firstDate.getUTCMonth(), firstDate.getUTCDate() + 1));
                    return { spans: [{ start: firstDate, end }] };
                }
                case "smileDesignInvasive": {
                    const daysSpan = Math.round(assumptions.durations.smileDesign.invasiveSpanDays.mode);
                    const end = new Date(Date.UTC(firstDate.getUTCFullYear(), firstDate.getUTCMonth(), firstDate.getUTCDate() + daysSpan));
                    return { spans: [{ start: firstDate, end }] };
                }
                case "implants1":
                case "implants2": {
                    const end = new Date(Date.UTC(firstDate.getUTCFullYear(), firstDate.getUTCMonth(), firstDate.getUTCDate() + 1));
                    return { spans: [{ start: firstDate, end }] };
                }
                case "implants3": {
                    const end = new Date(Date.UTC(firstDate.getUTCFullYear(), firstDate.getUTCMonth(), firstDate.getUTCDate() + 2));
                    return { spans: [{ start: firstDate, end }] };
                }
                case "allIn4One": {
                    const firstTripEnd = new Date(Date.UTC(firstDate.getUTCFullYear(), firstDate.getUTCMonth(), firstDate.getUTCDate() + 14));
                    const returnMonths = Math.round(assumptions.durations.allIn4.returnAfterMonths.mode);
                    const returnStart = addMonthsSameDay(firstDate, returnMonths);
                    const returnEnd = new Date(Date.UTC(returnStart.getUTCFullYear(), returnStart.getUTCMonth(), returnStart.getUTCDate() + 10));
                    return { spans: [{ start: firstDate, end: firstTripEnd }, { start: returnStart, end: returnEnd }] };
                }
                case "allIn4Two": {
                    const firstTripEnd = new Date(Date.UTC(firstDate.getUTCFullYear(), firstDate.getUTCMonth(), firstDate.getUTCDate() + 14));
                    const returnMonths = Math.round(assumptions.durations.allIn4.returnAfterMonths.mode);
                    const returnStart = addMonthsSameDay(firstDate, returnMonths);
                    const returnEnd = new Date(Date.UTC(returnStart.getUTCFullYear(), returnStart.getUTCMonth(), returnStart.getUTCDate() + 10));
                    return { spans: [{ start: firstDate, end: firstTripEnd }, { start: returnStart, end: returnEnd }] };
                }
                default:
                    return { spans: [{ start: firstDate, end: firstDate }] };
            }
        };

        // Initialize map keys for current month days
        for (const d of days.summaries) {
            map.set(d.date.toISOString().slice(0, 10), 0);
        }
        // Build spans from first-visit entries (per day entries)
        for (const d of days.summaries) {
            const firstDate = d.date;
            for (const e of d.entries) {
                const { spans } = spanFor(String(e.packageKey), firstDate);
                for (const sp of spans) {
                    // Count active if span overlaps a month day
                    for (const day of days.summaries) {
                        const key = day.date.toISOString().slice(0, 10);
                        if (day.date >= sp.start && day.date < sp.end) {
                            map.set(key, (map.get(key) || 0) + 1);
                        }
                    }
                }
            }
        }
        return map;
    }, [assumptions, days]);

    // Per-day cost breakdown for tooltips
    const dailyCostBreakdown = useMemo(() => {
        const evs = buildLedger(assumptions);
        const map = new Map<string, { materials: number; hotel: number; food: number; commissions: number; utilities: number; payroll: number; fixed: number; capex: number }>();
        const y = Number(assumptions.capacity.startMonthISO.split("-")[0]);
        const m0 = Number(assumptions.capacity.startMonthISO.split("-")[1]);
        const monthStart = new Date(Date.UTC(y, (m0 - 1) + monthIdx, 1));
        const monthEnd = new Date(Date.UTC(y, (m0 - 1) + monthIdx + 1, 0));
        for (const ev of evs) {
            if (ev.date < monthStart || ev.date > monthEnd) continue;
            const key = ev.date.toISOString().slice(0, 10);
            if (!map.has(key)) map.set(key, { materials: 0, hotel: 0, food: 0, commissions: 0, utilities: 0, payroll: 0, fixed: 0, capex: 0 });
            const agg = map.get(key)!;
            const amt = Math.abs(ev.amount);
            switch (ev.kind) {
                case "MaterialsCost": agg.materials += amt; break;
                case "HotelCost": agg.hotel += amt; break;
                case "FoodCost": agg.food += amt; break;
                case "CommissionFirstHalf":
                case "CommissionSecondHalf": agg.commissions += amt; break;
                case "UtilityBill": agg.utilities += amt; break;
                case "PayrollRun": agg.payroll += amt; break;
                case "FixedCost": agg.fixed += amt; break;
                case "Capex": agg.capex += amt; break;
                default: break;
            }
        }
        return map;
    }, [assumptions, monthIdx]);

    return (
        <div className="min-h-screen w-full bg-white text-zinc-900">
            <div className="mx-auto max-w-6xl px-6 py-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Calendar</h1>
                    <Link href="/" className="rounded border px-3 py-1 text-sm hover:bg-zinc-50">Back</Link>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                        <div className="text-sm">Month</div>
                        <input type="range" min={0} max={assumptions.capacity.months - 1} step={1} className="w-full"
                            value={monthIdx}
                            onChange={(e) => setMonthIdx(Number(e.target.value))}
                        />
                        <div className="text-xs">M{monthIdx + 1}</div>
                    </div>
                    <div>
                        <div className="text-sm">Metric</div>
                        <select className="mt-1 w-full rounded border px-2 py-1" value={metric} onChange={(e) => setMetric(e.target.value as "revenue" | "costs" | "net")}>
                            <option value="revenue">Revenue (cash in parens)</option>
                            <option value="costs">Costs</option>
                            <option value="net">Net (cash − costs)</option>
                        </select>
                    </div>
                </div>

                {/* Month title */}
                <div className="mt-4 text-sm font-medium">{monthMeta.monthLabel}</div>

                {/* Grid Sun–Sat rows */}
                <div className="mt-6 grid grid-cols-7 gap-2">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                        <div key={d} className="text-xs font-medium text-zinc-600">{d}</div>
                    ))}
                    {Array.from({ length: monthMeta.startDow }).map((_, i) => (
                        <div key={`blank-start-${i}`} className="rounded border p-2 bg-zinc-50" />
                    ))}
                    {calendarDays.map(({ key, date, open, entries, hoursUsed }) => (
                        <div key={key} className={`relative rounded border p-2 ${!open ? "bg-zinc-50" : ""}`}>
                            <div className="flex items-center justify-between text-xs text-zinc-600">
                                <span><span className="font-semibold">{toOrdinal(date.getUTCDate())}</span> ({Math.round(hoursUsed)}/{dayCapacityHours}h)</span>
                                <span>
                                    {(() => {
                                        const f = dailyFinance.get(key) || { revenue: 0, revenueCash: 0, installments: 0, costs: 0, firstCount: 0, completionCount: 0 };
                                        if (metric === "revenue") {
                                            const rev = Math.round(f.revenue);
                                            const cash = Math.round(f.revenueCash);
                                            return `$${rev.toLocaleString()} ($${cash.toLocaleString()})`;
                                        } else if (metric === "costs") {
                                            const c = Math.round(f.costs);
                                            return `-$${c.toLocaleString()}`;
                                        } else {
                                            const net = Math.round((f.revenueCash || 0) - (f.costs || 0));
                                            const sign = net < 0 ? "-" : "";
                                            return `${sign}$${Math.abs(net).toLocaleString()}`;
                                        }
                                    })()}
                                </span>
                                {/* Active pill top-right */}
                                <span className="absolute right-1 top-1 rounded-full border px-2 py-[1px] text-[10px] text-zinc-700 bg-white/80">
                                    {`${activeByDay.get(key) ?? 0}`}
                                </span>
                            </div>
                            {/* details list */}
                            <div className="mt-2 space-y-1">
                                {metric === "revenue" && entries.length > 0 && (() => {
                                    const group = new Map<string, { sum: number; count: number }>();
                                    const label = (k: string) => {
                                        switch (k) {
                                            case "smileDesignNonInvasive": return "Smile NI";
                                            case "smileDesignInvasive": return "Smile Invasive";
                                            case "implants1": return "Implants (1)";
                                            case "implants2": return "Implants (2)";
                                            case "implants3": return "Implants (3)";
                                            case "allIn4One": return "All-in-4 (1 arc)";
                                            case "allIn4Two": return "All-in-4 (both)";
                                            default: return k;
                                        }
                                    };
                                    for (const e of entries) {
                                        const key = label(String(e.packageKey));
                                        const cur = group.get(key) || { sum: 0, count: 0 };
                                        cur.sum += e.revenue;
                                        cur.count += 1;
                                        group.set(key, cur);
                                    }
                                    const rows = Array.from(group.entries()).sort((a, b) => b[1].sum - a[1].sum).slice(0, 5);
                                    return (
                                        <>
                                            {rows.map(([name, agg]) => (
                                                <div key={name} className="flex justify-between text-xs">
                                                    <span className="truncate mr-2">{agg.count}× {name}</span>
                                                    <span>${Math.round(agg.sum).toLocaleString()}</span>
                                                </div>
                                            ))}
                                            {/* stage summaries using appointment indices */}
                                            {(() => {
                                                // count one-and-done completions today
                                                const oneDone = entries.filter((e) => (String(e.packageKey) === "smileDesignNonInvasive" || String(e.packageKey) === "implants1" || String(e.packageKey) === "implants2") && e.apptIndex === e.apptTotal).length;
                                                // multi-visit stage lines
                                                const byClient = new Map<string, (typeof entries)[0]>();
                                                entries.forEach((e) => { if (e.apptTotal && e.apptTotal > 1) byClient.set(e.clientId || "", e); });
                                                const stageLines: string[] = [];
                                                // find next appointment date for client in current month
                                                const nextDateFor = (clientId: string) => {
                                                    const future = calendarDays.find(d2 => d2.date > date && (d2.entries as any)?.some((x: any) => x.clientId === clientId));
                                                    return future?.date;
                                                };
                                                for (const [, e] of byClient) {
                                                    const next = nextDateFor(e.clientId);
                                                    const stageName = e.apptIndex === 1 ? "1st" : e.apptIndex === 2 ? "2nd" : e.apptIndex === 3 ? "3rd" : `${e.apptIndex}th`;
                                                    const base = `${e.apptIndex} – ${stageName} of ${e.apptTotal}`;
                                                    stageLines.push(next ? `${base} (next: ${next.toISOString().slice(0, 10)})` : `${base} (complete)`);
                                                }
                                                if (oneDone === 0 && stageLines.length === 0) return null;
                                                return (
                                                    <div className="pt-1 text-[10px] text-zinc-500 space-y-0.5">
                                                        {oneDone > 0 && (<div>{oneDone} – 1‑n‑Dones</div>)}
                                                        {stageLines.map((t, i) => (<div key={i}>{t}</div>))}
                                                    </div>
                                                );
                                            })()}
                                            {/* New Smiles (first appts for Smile Design only) */}
                                            {(() => {
                                                const count = entries.filter((e) => (String(e.packageKey) === "smileDesignNonInvasive" || String(e.packageKey) === "smileDesignInvasive") && e.apptIndex === e.apptTotal).length;
                                                if (count <= 0) return null;
                                                return (
                                                    <span className="absolute bottom-1 right-1 rounded px-1 text-[10px] text-zinc-600 bg-white/80 border">{count} – New Smiles</span>
                                                );
                                            })()}
                                            {/* installment income line */}
                                            {(() => {
                                                const k = date.toISOString().slice(0, 10);
                                                const f = dailyFinance.get(k);
                                                if (!f || f.installments <= 0) return null;
                                                return (
                                                    <div className="flex justify-between text-[10px] text-zinc-500">
                                                        <span>Installments</span>
                                                        <span>$ {Math.round(f.installments).toLocaleString()}</span>
                                                    </div>
                                                );
                                            })()}
                                            {group.size > 5 && (
                                                <div className="text-[10px] text-zinc-500">+{group.size - 5} more</div>
                                            )}
                                        </>
                                    );
                                })()}
                                {/* cost breakdown when costs or net metric selected */}
                                {(() => {
                                    const k2 = date.toISOString().slice(0, 10);
                                    const b = dailyCostBreakdown.get(k2);
                                    if (!b || (metric !== "costs" && metric !== "net")) return null;
                                    const rows = (
                                        [
                                            ["Materials", b.materials] as [string, number],
                                            ["Hotel", b.hotel] as [string, number],
                                            ["Food", b.food] as [string, number],
                                            ["Commissions", b.commissions] as [string, number],
                                            ["Utilities", b.utilities] as [string, number],
                                            ["Payroll", b.payroll] as [string, number],
                                            ["Fixed", b.fixed] as [string, number],
                                            ["CapEx", b.capex] as [string, number],
                                        ] as [string, number][]
                                    ).filter(([, v]) => v > 0);
                                    if (!rows.length) return null;
                                    return (
                                        <div className="pt-2 text-[10px] text-zinc-500">
                                            {rows.map(([label, v]) => (
                                                <div key={label} className="flex justify-between">
                                                    <span>{label}</span>
                                                    <span>-$ {Math.round(v).toLocaleString()}</span>
                                                </div>
                                            ))}
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                    ))}
                    {Array.from({ length: monthMeta.trailing }).map((_, i) => (
                        <div key={`blank-end-${i}`} className="rounded border p-2 bg-zinc-50" />
                    ))}
                </div>
            </div>
        </div>
    );
}


