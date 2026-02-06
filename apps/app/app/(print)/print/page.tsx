"use client";
import { useEffect } from "react";
import { useSimStore } from "@/lib/store";

export default function PrintView() {
    const { lastResult } = useSimStore();

    useEffect(() => {
        // Auto-print when opened
        setTimeout(() => window.print(), 300);
    }, []);

    if (!lastResult) return <div className="p-6">No results to print. Run a simulation first.</div>;

    return (
        <div className="p-8 max-w-4xl mx-auto bg-white text-zinc-900 print:p-0">
            <header className="flex justify-between items-start border-b pb-6 mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Financial Projection Report</h1>
                    <p className="text-zinc-500 mt-1">Dental Solutions Calculator • Summary Analysis</p>
                </div>
                <div className="text-right">
                    <p className="text-sm font-medium">Generated On</p>
                    <p className="text-sm text-zinc-500">{new Date().toLocaleDateString()}</p>
                </div>
            </header>

            <section className="grid grid-cols-3 gap-6 mb-10">
                <div className="p-4 bg-zinc-50 rounded-lg border">
                    <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Total Revenue (Mean)</div>
                    <div className="text-xl font-bold">${lastResult.ytd.revenue.toLocaleString()}</div>
                </div>
                <div className="p-4 bg-zinc-50 rounded-lg border">
                    <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Net Cashflow (Mean)</div>
                    <div className="text-xl font-bold">${lastResult.ytd.netCashflow.toLocaleString()}</div>
                </div>
                <div className="p-4 bg-zinc-50 rounded-lg border">
                    <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Projected End Balance</div>
                    <div className="text-xl font-bold">${lastResult.byMonthMean.at(-1)?.cashOnHand.toLocaleString()}</div>
                </div>
            </section>

            <section className="mb-10">
                <h2 className="text-lg font-semibold mb-4 border-l-4 border-zinc-900 pl-3">Full Monthly Breakdown</h2>
                <div className="overflow-hidden border rounded-lg">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-zinc-50 border-b">
                            <tr>
                                <th className="p-3 font-semibold">Month</th>
                                <th className="p-3 font-semibold text-right">Revenue</th>
                                <th className="p-3 font-semibold text-right">Net Flow</th>
                                <th className="p-3 font-semibold text-right">Waitlist</th>
                                <th className="p-3 font-semibold text-right">Cash End</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {lastResult.byMonthMean.map((m, i) => (
                                <tr key={i}>
                                    <td className="p-3 font-medium">Month {i + 1}</td>
                                    <td className="p-3 text-right">${m.revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                                    <td className="p-3 text-right text-green-600">${m.netCashflow.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                                    <td className="p-3 text-right">{m.backlogTotal?.toFixed(1) ?? 0}</td>
                                    <td className="p-3 text-right font-bold">${m.cashOnHand.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <footer className="text-center text-xs text-zinc-400 mt-12 pt-6 border-t">
                Confidence Intervals: 95th Percentile Optimistic / 5th Percentile Conservative.
                This projection is based on simulated parameters and stochastic modeling.
            </footer>
        </div>
    );
}


