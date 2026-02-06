"use client";
import { useMemo, useState } from "react";
import { useSimStore } from "@/lib/store";
import { buildLedger, LedgerEvent } from "@dentalsolutions/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { clsx } from "clsx";

export function LedgerTab() {
    const { assumptions, lastResult } = useSimStore();
    const [searchTerm, setSearchTerm] = useState("");
    const [filterKind, setFilterKind] = useState<string>("All");
    const [filterCategory, setFilterCategory] = useState<string>("All");

    const ledger = useMemo(() => lastResult?.ledgerEvents || [], [lastResult]);

    const filteredLedger = useMemo(() => {
        return ledger.filter(ev => {
            const matchesSearch =
                (ev.note || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                (ev.service || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                (ev.patientFirstName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                (ev.patientLastName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                (ev.clientId || "").toLowerCase().includes(searchTerm.toLowerCase());

            const matchesKind = filterKind === "All" || ev.kind === filterKind;

            let matchesCategory = true;
            if (filterCategory === "Revenue") matchesCategory = !!ev.revenue;
            else if (filterCategory === "Expense") matchesCategory = !!ev.cost;
            else if (filterCategory === "Other") matchesCategory = !ev.revenue && !ev.cost;

            return matchesSearch && matchesKind && matchesCategory;
        });
    }, [ledger, searchTerm, filterKind, filterCategory]);

    const kinds = useMemo(() => {
        const k = new Set<string>(["All"]);
        ledger.forEach(ev => k.add(ev.kind));
        return Array.from(k);
    }, [ledger]);

    const stats = useMemo(() => {
        let inflow = 0;
        let outflow = 0;
        filteredLedger.forEach(ev => {
            if (ev.cash) {
                if (ev.amount > 0) inflow += ev.amount;
                else outflow += Math.abs(ev.amount);
            }
        });
        return { inflow, outflow, net: inflow - outflow };
    }, [filteredLedger]);

    // Calculate running balance for the filtered view (optional, but requested implicitly)
    const ledgerWithBalance = useMemo(() => {
        let runningBalance = 0;
        // Balance should ideally be calculated on the FULL ledger first to be accurate at any point
        // Ensure we handle serialized dates (strings) from the worker
        const fullLedger = ledger.map(ev => {
            const dateObj = ev.date instanceof Date ? ev.date : new Date(ev.date);
            if (ev.cash) runningBalance += ev.amount;
            return { ...ev, dateObj, balance: runningBalance };
        });

        // Then re-filter for display
        return fullLedger.filter(ev => {
            const matchesSearch =
                (ev.note || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                (ev.service || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                (ev.patientFirstName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                (ev.patientLastName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                (ev.clientId || "").toLowerCase().includes(searchTerm.toLowerCase());

            const matchesKind = filterKind === "All" || ev.kind === filterKind;

            let matchesCategory = true;
            if (filterCategory === "Revenue") matchesCategory = !!ev.revenue;
            else if (filterCategory === "Expense") matchesCategory = !!ev.cost;
            else if (filterCategory === "Other") matchesCategory = !ev.revenue && !ev.cost;

            return matchesSearch && matchesKind && matchesCategory;
        });
    }, [ledger, searchTerm, filterKind, filterCategory, assumptions.startingCash]);

    if (!lastResult) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-zinc-500 bg-white rounded-xl border border-dashed border-zinc-200">
                <p>Run simulation to generate ledger</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="py-3 px-4">
                        <CardTitle className="text-xs font-medium text-zinc-500 uppercase">Total Inflow</CardTitle>
                    </CardHeader>
                    <CardContent className="py-3 px-4 pt-0">
                        <div className="text-2xl font-bold text-green-600">${Math.round(stats.inflow).toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="py-3 px-4">
                        <CardTitle className="text-xs font-medium text-zinc-500 uppercase">Total Outflow</CardTitle>
                    </CardHeader>
                    <CardContent className="py-3 px-4 pt-0">
                        <div className="text-2xl font-bold text-red-600">-${Math.round(stats.outflow).toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="py-3 px-4">
                        <CardTitle className="text-xs font-medium text-zinc-500 uppercase">Net Segment Cash</CardTitle>
                    </CardHeader>
                    <CardContent className="py-3 px-4 pt-0">
                        <div className={clsx("text-2xl font-bold", stats.net >= 0 ? "text-green-600" : "text-red-600")}>
                            {stats.net >= 0 ? "+" : ""}${Math.round(stats.net).toLocaleString()}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <input
                    type="text"
                    placeholder="Search ledger (patient, service, note)..."
                    className="flex-1 rounded-md border border-zinc-200 px-3 py-2 text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                    className="rounded-md border border-zinc-200 px-3 py-2 text-sm bg-white"
                    value={filterKind}
                    onChange={(e) => setFilterKind(e.target.value)}
                >
                    {kinds.map(k => (
                        <option key={k} value={k}>{k.replace(/([A-Z])/g, ' $1')}</option>
                    ))}
                </select>
                <select
                    className="rounded-md border border-zinc-200 px-3 py-2 text-sm bg-white"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                >
                    <option value="All">All Categories</option>
                    <option value="Revenue">Revenue</option>
                    <option value="Expense">Expenses</option>
                    <option value="Other">Other</option>
                </select>
            </div>

            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead>
                                <tr className="border-b border-zinc-100 text-zinc-500 font-medium bg-zinc-50/50">
                                    <th className="py-3 px-4">Date</th>
                                    <th className="py-3 px-4">Description</th>
                                    <th className="py-3 px-4">Patient</th>
                                    <th className="py-3 px-4">Category</th>
                                    <th className="py-3 px-4 text-right">Amount</th>
                                    <th className="py-3 px-4 text-right">Cash Balance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ledgerWithBalance.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-zinc-400 italic">No transactions found.</td>
                                    </tr>
                                ) : (
                                    ledgerWithBalance.map((ev, i) => (
                                        <tr key={i} className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors">
                                            <td className="py-3 px-4 text-zinc-500 font-mono text-xs whitespace-nowrap">
                                                {ev.dateObj.toISOString().slice(0, 10)}
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="font-medium">{ev.service || ev.kind.replace(/([A-Z])/g, ' $1')}</div>
                                                {ev.note && <div className="text-[10px] text-zinc-400">{ev.note}</div>}
                                            </td>
                                            <td className="py-3 px-4 whitespace-nowrap">
                                                {ev.patientFirstName ? `${ev.patientFirstName} ${ev.patientLastName}` : <span className="text-zinc-300">—</span>}
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={clsx(
                                                    "px-1.5 py-0.5 rounded text-[10px] font-bold uppercase",
                                                    ev.revenue ? "bg-green-100 text-green-700" :
                                                        ev.cost ? "bg-red-100 text-red-700" :
                                                            "bg-blue-100 text-blue-700"
                                                )}>
                                                    {ev.kind.replace(/([A-Z])/g, ' $1')}
                                                </span>
                                            </td>
                                            <td className={clsx(
                                                "py-3 px-4 text-right font-semibold",
                                                !ev.cash ? "text-zinc-300 line-through" :
                                                    ev.amount >= 0 ? "text-green-600" : "text-red-600"
                                            )}>
                                                {ev.amount >= 0 ? "+" : ""}${Math.round(ev.amount).toLocaleString()}
                                            </td>
                                            <td className="py-3 px-4 text-right font-mono text-zinc-600">
                                                ${Math.round(ev.balance).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
