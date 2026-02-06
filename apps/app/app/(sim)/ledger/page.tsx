"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useSimStore } from "@/lib/store";
import { buildLedger, type LedgerEvent } from "@dentalsolutions/core";

function monthKey(d: Date) {
    return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

export default function LedgerPage() {
    const { assumptions } = useSimStore();
    const [filterMonth, setFilterMonth] = useState<string | "all">("all");
    const events = useMemo(() => buildLedger(assumptions), [assumptions]);

    const grouped = useMemo(() => {
        const m = new Map<string, LedgerEvent[]>();
        for (const ev of events) {
            const k = monthKey(ev.date);
            if (!m.has(k)) m.set(k, []);
            m.get(k)!.push(ev);
        }
        return Array.from(m.entries()).sort((a, b) => a[0].localeCompare(b[0]));
    }, [events]);

    const monthsOptions = grouped.map(([k]) => k);
    const shown = filterMonth === "all" ? grouped : grouped.filter(([k]) => k === filterMonth);

    return (
        <div className="min-h-screen w-full bg-white text-zinc-900">
            <div className="mx-auto max-w-6xl px-6 py-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Ledger</h1>
                    <Link href="/" className="rounded border px-3 py-1 text-sm hover:bg-zinc-50">Back</Link>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                        <div className="text-sm">Month Filter</div>
                        <select className="mt-1 w-full rounded border px-2 py-1" value={filterMonth}
                            onChange={(e) => setFilterMonth(e.target.value)}
                        >
                            <option value="all">All</option>
                            {monthsOptions.map((k) => <option key={k} value={k}>{k}</option>)}
                        </select>
                    </div>
                </div>

                {shown.map(([k, evs]) => (
                    <div key={k} className="mt-6 rounded border">
                        <div className="flex items-center justify-between border-b px-3 py-2 text-sm font-medium">
                            <div>{k}</div>
                            <MonthTotals events={evs} />
                        </div>
                        <div className="max-h-96 overflow-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b text-left">
                                        <th className="sticky top-0 z-10 bg-zinc-50 py-1 pl-2 pr-2">Date</th>
                                        <th className="sticky top-0 z-10 bg-zinc-50 py-1 pr-2">Kind</th>
                                        <th className="sticky top-0 z-10 bg-zinc-50 py-1 pr-2">Service</th>
                                        <th className="sticky top-0 z-10 bg-zinc-50 py-1 pr-2">ClientID</th>
                                        <th className="sticky top-0 z-10 bg-zinc-50 py-1 pr-2">Amount</th>
                                        <th className="sticky top-0 z-10 bg-zinc-50 py-1 pr-2">Cash</th>
                                        <th className="sticky top-0 z-10 bg-zinc-50 py-1 pr-2">Revenue</th>
                                        <th className="sticky top-0 z-10 bg-zinc-50 py-1 pr-2">Cost</th>
                                        <th className="sticky top-0 z-10 bg-zinc-50 py-1 pr-2">Note</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {evs.map((ev, i) => (
                                        <tr key={i} className="border-b">
                                            <td className="py-1 pl-2 pr-2">{ev.date.toISOString().slice(0, 10)}</td>
                                            <td className="py-1 pr-2">{ev.kind}</td>
                                            <td className="py-1 pr-2">{ev.service ?? ""}</td>
                                            <td className="py-1 pr-2">{ev.clientId ?? ""}</td>
                                            <td className="py-1 pr-2">{(ev.amount >= 0 ? "$" : "-$")}{Math.abs(Math.round(ev.amount)).toLocaleString()}</td>
                                            <td className="py-1 pr-2">{ev.cash ? "Y" : ""}</td>
                                            <td className="py-1 pr-2">{ev.revenue ? "Y" : ""}</td>
                                            <td className="py-1 pr-2">{ev.cost ? "Y" : ""}</td>
                                            <td className="py-1 pr-2">{ev.note ?? ""}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function MonthTotals({ events }: { events: LedgerEvent[] }) {
    const cashIn = events.filter(e => e.cash && e.amount > 0).reduce((s, e) => s + e.amount, 0);
    const cashOut = events.filter(e => e.cash && e.amount < 0).reduce((s, e) => s + e.amount, 0);
    const revenue = events.filter(e => e.revenue).reduce((s, e) => s + e.amount, 0);
    const costs = events.filter(e => e.cost).reduce((s, e) => s + Math.abs(e.amount), 0);
    const netCash = cashIn + cashOut;
    return (
        <div className="flex items-center gap-4 text-xs text-zinc-700">
            <div>Cash In ${Math.round(cashIn).toLocaleString()}</div>
            <div>Cash Out ${Math.round(Math.abs(cashOut)).toLocaleString()}</div>
            <div>Net Cash ${Math.round(netCash).toLocaleString()}</div>
            <div>Revenue ${Math.round(revenue).toLocaleString()}</div>
            <div>Costs ${Math.round(costs).toLocaleString()}</div>
        </div>
    );
}


