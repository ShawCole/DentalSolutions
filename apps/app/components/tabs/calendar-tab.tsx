"use client";
import { useMemo, useState } from "react";
import { useSimStore } from "@/lib/store";
import { buildDailySchedule, buildLedger } from "@dentalsolutions/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CalendarTab() {
    const { assumptions, lastResult } = useSimStore();
    const [monthIdx, setMonthIdx] = useState(0);
    const [metric, setMetric] = useState<"revenue" | "costs" | "net">("revenue");
    const [selectedDayKey, setSelectedDayKey] = useState<string | null>(null);

    const daysResult = useMemo(() => buildDailySchedule(assumptions, monthIdx), [assumptions, monthIdx]);

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
        const dayMap = new Map<string, any>();
        for (const d of daysResult.summaries) {
            dayMap.set(d.date.toISOString().slice(0, 10), d);
        }
        const trailing = (7 - ((startDow + daysAll.length) % 7)) % 7;
        const monthLabel = start.toLocaleString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
        return { start, end, startDow, trailing, daysAll, dayMap, monthLabel };
    }, [assumptions, monthIdx, daysResult]);

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

    const dayCapacityHours = useMemo(() => {
        const chairs = assumptions.capacity.chairsByMonth[monthIdx] ?? assumptions.capacity.chairsByMonth.at(-1)!;
        const doctors = assumptions.capacity.doctorsByMonth[monthIdx] ?? assumptions.capacity.doctorsByMonth.at(-1)!;
        return Math.min(chairs * assumptions.capacity.clinicHoursPerDay, doctors * 8);
    }, [assumptions, monthIdx]);

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
            if (ev.kind === "ServiceRevenue") { agg.revenue += ev.amount; agg.firstCount += 1; }
            if (ev.kind === "HeldDepositRelease" || (ev.kind === "BookingDownpaymentHeld" && ev.cash)) { if (ev.amount > 0) agg.revenueCash += ev.amount; }
            if (ev.kind === "InstallmentCashReceived") { if (ev.amount > 0) { agg.revenueCash += ev.amount; agg.installments += ev.amount; } }
            if (ev.cost) agg.costs += Math.abs(ev.amount);
            if (ev.kind === "CommissionSecondHalf") agg.completionCount += 1;
        }
        return map;
    }, [assumptions, monthIdx]);

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
            }
        }
        return map;
    }, [assumptions, monthIdx]);

    const monthKPIs = useMemo(() => {
        const finance = Array.from(dailyFinance.values());
        const totalRevenue = finance.reduce((sum, f) => sum + f.revenue, 0);
        const totalCashIn = finance.reduce((sum, f) => sum + f.revenueCash, 0);

        const totalHoursUsed = daysResult.summaries.reduce((sum, d) => sum + d.hoursUsed, 0);
        const totalOpenDays = calendarDays.filter(d => d.open).length || 1;
        const totalHoursAvail = totalOpenDays * dayCapacityHours;
        const avgUtilization = (totalHoursUsed / totalHoursAvail) * 100;
        const efficiency = totalRevenue / (totalHoursUsed || 1);

        return { totalRevenue, totalCashIn, avgUtilization, efficiency };
    }, [dailyFinance, daysResult, calendarDays, dayCapacityHours]);

    const selectedDay = useMemo(() => {
        if (!selectedDayKey) return null;
        return calendarDays.find(d => d.key === selectedDayKey);
    }, [selectedDayKey, calendarDays]);

    if (!lastResult) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-zinc-500 bg-white rounded-xl border border-dashed border-zinc-200">
                <p>Run simulation to view calendar</p>
            </div>
        );
    }

    return (
        <Card className="shadow-lg border-zinc-200">
            <CardHeader className="pb-2 border-b border-zinc-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <CardTitle className="text-xl font-bold text-zinc-800">Calendar View - {monthMeta.monthLabel}</CardTitle>
                    <div className="flex flex-wrap items-center gap-4">
                        <select
                            className="text-sm rounded border px-2 py-1 bg-white shadow-sm ring-zinc-200 focus:ring-2 focus:ring-gold outline-none"
                            value={metric}
                            onChange={(e) => setMetric(e.target.value as any)}
                        >
                            <option value="revenue">Appointments & Revenue</option>
                            <option value="costs">Expenses Breakdown</option>
                            <option value="net">Net Cashflow</option>
                        </select>
                        <div className="flex items-center gap-2 bg-zinc-100 p-1 rounded-lg">
                            <button
                                className="px-3 py-1 bg-white border border-zinc-200 rounded text-xs hover:bg-zinc-50 disabled:opacity-50 transition-colors shadow-sm"
                                disabled={monthIdx === 0}
                                onClick={() => { setMonthIdx(m => m - 1); setSelectedDayKey(null); }}
                            >
                                ←
                            </button>
                            <span className="text-xs font-bold w-10 text-center text-zinc-600">M{monthIdx + 1}</span>
                            <button
                                className="px-3 py-1 bg-white border border-zinc-200 rounded text-xs hover:bg-zinc-50 disabled:opacity-50 transition-colors shadow-sm"
                                disabled={monthIdx === assumptions.capacity.months - 1}
                                onClick={() => { setMonthIdx(m => m + 1); setSelectedDayKey(null); }}
                            >
                                →
                            </button>
                        </div>
                    </div>
                </div>

                {/* Monthly KPI Roll-up */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <div className="bg-blue-50/30 p-4 rounded-xl border border-blue-100/50">
                        <p className="text-[10px] text-blue-600 uppercase font-bold tracking-wider mb-1">Revenue (Rec.)</p>
                        <p className="text-2xl font-bold text-blue-900">${Math.round(monthKPIs.totalRevenue).toLocaleString()}</p>
                    </div>
                    <div className="bg-green-50/30 p-4 rounded-xl border border-green-100/50">
                        <p className="text-[10px] text-green-600 uppercase font-bold tracking-wider mb-1">Cash Inflow</p>
                        <p className="text-2xl font-bold text-green-700">${Math.round(monthKPIs.totalCashIn).toLocaleString()}</p>
                    </div>
                    <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                        <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-1">Utilization</p>
                        <div className="flex items-center gap-3">
                            <p className="text-2xl font-bold text-zinc-900">{Math.round(monthKPIs.avgUtilization)}%</p>
                            <div className="flex-1 h-1.5 bg-zinc-200 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-600 rounded-full" style={{ width: `${Math.min(100, monthKPIs.avgUtilization)}%` }} />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gold/5 p-4 rounded-xl border border-gold/10">
                        <p className="text-[10px] text-gold uppercase font-bold tracking-wider mb-1">Efficiency</p>
                        <p className="text-2xl font-bold text-gold-darker">${Math.round(monthKPIs.efficiency)}<span className="text-xs font-normal text-zinc-400">/hr</span></p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="relative flex flex-col lg:flex-row gap-6 p-6">
                <div className="flex-1">
                    <div className="grid grid-cols-7 gap-2">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                            <div key={d} className="text-[10px] md:text-xs font-bold text-center text-zinc-400 py-2 uppercase tracking-tighter">{d}</div>
                        ))}
                        {Array.from({ length: monthMeta.startDow }).map((_, i) => (
                            <div key={`blank-start-${i}`} className="min-h-[100px] md:min-h-[140px] rounded-xl border border-zinc-50 bg-zinc-50/30" />
                        ))}
                        {calendarDays.map(({ key, date, open, entries, hoursUsed }) => (
                            <div
                                key={key}
                                onClick={() => setSelectedDayKey(key)}
                                className={`min-h-[100px] md:min-h-[140px] relative rounded-xl border p-2 cursor-pointer transition-all duration-200 hover:border-gold hover:shadow-xl group ${!open ? "bg-zinc-50/50" : "bg-white"} ${selectedDayKey === key ? "border-gold ring-4 ring-gold/10 shadow-lg" : "border-zinc-100 shadow-sm"}`}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className={`text-sm font-black ${selectedDayKey === key ? "text-gold" : "text-zinc-400"}`}>{date.getUTCDate()}</span>
                                    {open && (
                                        <span className={`text-[9px] font-bold ${hoursUsed > dayCapacityHours * 0.9 ? "text-red-600" : "text-zinc-500"}`}>
                                            {Math.round(hoursUsed)}h
                                        </span>
                                    )}
                                </div>

                                <div className="space-y-0.5 max-h-[70px] overflow-hidden">
                                    {entries.slice(0, 6).map((ent: any, idx: number) => {
                                        const color = `hsl(${(ent.clientId.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0) * 137) % 360}, 70%, 50%)`;
                                        return (
                                            <div
                                                key={idx}
                                                className="h-1.5 w-full rounded-full opacity-80"
                                                style={{ backgroundColor: color }}
                                                title={`${ent.firstName} ${ent.lastName} - ${ent.packageKey}`}
                                            />
                                        );
                                    })}
                                    {entries.length > 6 && (
                                        <div className="text-[8px] text-zinc-400 font-bold">+{entries.length - 6} more</div>
                                    )}
                                </div>

                                <div className="mt-2">
                                    {(() => {
                                        const f = dailyFinance.get(key) || { revenue: 0, revenueCash: 0, installments: 0, costs: 0, firstCount: 0, completionCount: 0 };
                                        if (metric === "revenue" && f.revenue > 0) {
                                            return <div className="text-[10px] font-black text-zinc-900">${Math.round(f.revenue).toLocaleString()}</div>;
                                        } else if (metric === "costs" && f.costs > 0) {
                                            return <div className="text-[10px] font-black text-red-600">-${Math.round(f.costs).toLocaleString()}</div>;
                                        } else if (metric === "net") {
                                            const net = Math.round(f.revenueCash - f.costs);
                                            return <div className={`text-[10px] font-black ${net >= 0 ? "text-green-700" : "text-red-700"}`}>
                                                {net >= 0 ? "+" : ""}${net.toLocaleString()}
                                            </div>;
                                        }
                                        return null;
                                    })()}
                                </div>
                            </div>
                        ))}
                        {Array.from({ length: monthMeta.trailing }).map((_, i) => (
                            <div key={`blank-end-${i}`} className="min-h-[100px] md:min-h-[140px] rounded-xl border border-zinc-50 bg-zinc-50/30" />
                        ))}
                    </div>
                </div>

                {/* Day Detail Side Panel */}
                {selectedDay && (
                    <div className="w-full lg:w-96 shrink-0 animate-in slide-in-from-right duration-300">
                        <div className="lg:sticky lg:top-6 space-y-4">
                            <Card className="border-gold bg-gold/5 shadow-2xl ring-1 ring-gold/20 overflow-hidden">
                                <CardHeader className="bg-white/80 backdrop-blur-sm border-b border-gold/10 p-5">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] font-bold text-gold uppercase tracking-widest mb-1">Details for</p>
                                            <CardTitle className="text-2xl font-black text-zinc-900 border-none">
                                                {selectedDay.date.toLocaleString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })}
                                            </CardTitle>
                                        </div>
                                        <button onClick={() => setSelectedDayKey(null)} className="h-8 w-8 flex items-center justify-center rounded-full bg-zinc-100 text-zinc-500 hover:bg-gold hover:text-white transition-all shadow-inner">
                                            ✕
                                        </button>
                                    </div>
                                    <div className="mt-4 grid grid-cols-2 gap-3">
                                        <div className="bg-white p-3 rounded-xl border border-gold/10 shadow-sm">
                                            <p className="text-[10px] text-zinc-500 uppercase font-black mb-1">Total Appts</p>
                                            <p className="text-2xl font-black text-zinc-900">{selectedDay.entries.length}</p>
                                        </div>
                                        <div className="bg-white p-3 rounded-xl border border-gold/10 shadow-sm">
                                            <p className="text-[10px] text-zinc-500 uppercase font-black mb-1">Utilization</p>
                                            <p className="text-2xl font-black text-blue-600">{Math.round((selectedDay.hoursUsed / dayCapacityHours) * 100)}%</p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-5 space-y-6 bg-white/40">
                                    <div className="space-y-3">
                                        <h4 className="flex items-center gap-2 text-xs font-black text-zinc-800 uppercase tracking-widest">
                                            <span className="h-1 w-4 bg-gold rounded-full"></span>
                                            Today's Patients
                                        </h4>
                                        <div className="space-y-2">
                                            {selectedDay.entries.length === 0 ? (
                                                <div className="text-center py-8 px-4 bg-white/50 rounded-2xl border border-zinc-100 italic text-zinc-400 text-sm">
                                                    No patients scheduled today
                                                </div>
                                            ) : (
                                                selectedDay.entries.map((ent: any, idx: number) => {
                                                    const color = `hsl(${(ent.clientId.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0) * 137) % 360}, 70%, 50%)`;
                                                    return (
                                                        <div key={idx} className="bg-white p-4 rounded-2xl border border-gold/10 shadow-sm hover:shadow-md transition-all border-l-4" style={{ borderLeftColor: color }}>
                                                            <div className="flex items-center justify-between mb-2">
                                                                <span className="font-black text-zinc-900">{ent.firstName} {ent.lastName}</span>
                                                                <span className="text-[10px] bg-gold/10 text-gold-darker px-2 py-1 rounded-full font-black uppercase tracking-tighter">Visit {ent.apptIndex} of {ent.apptTotal}</span>
                                                            </div>
                                                            <div className="flex items-center justify-between text-xs font-bold">
                                                                <span className="text-zinc-500">{ent.packageKey.replace(/([A-Z])/g, ' $1').trim()}</span>
                                                                <span className="text-blue-600">{ent.hours}h Block</span>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-3 pt-6 border-t border-gold/10">
                                        <h4 className="flex items-center gap-2 text-xs font-black text-zinc-800 uppercase tracking-widest">
                                            <span className="h-1 w-4 bg-green-500 rounded-full"></span>
                                            Financial Ledger
                                        </h4>
                                        <div className="space-y-1 bg-white p-3 rounded-2xl border border-zinc-100 shadow-inner">
                                            {(() => {
                                                const dayEvs = buildLedger(assumptions).filter(ev =>
                                                    ev.date.toISOString().slice(0, 10) === selectedDay.key
                                                );
                                                if (dayEvs.length === 0) return <p className="text-center py-4 text-xs text-zinc-400 font-medium italic">No transactions recorded</p>;
                                                return dayEvs.map((ev, idx) => (
                                                    <div key={idx} className="flex items-center justify-between text-[11px] py-2 border-b border-zinc-50 last:border-none px-1">
                                                        <div className="flex flex-col max-w-[70%]">
                                                            <span className="font-black text-zinc-900 uppercase tracking-tight text-[9px]">{ev.kind.replace(/([A-Z])/g, ' $1').trim()}</span>
                                                            <span className="text-[9px] text-zinc-400 font-medium truncate">{ev.note || ev.service}</span>
                                                        </div>
                                                        <span className={`font-black tabular-nums ${ev.amount >= 0 ? "text-green-600" : "text-red-500"}`}>
                                                            {ev.amount >= 0 ? "+" : ""}${Math.round(Math.abs(ev.amount)).toLocaleString()}
                                                        </span>
                                                    </div>
                                                ));
                                            })()}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
