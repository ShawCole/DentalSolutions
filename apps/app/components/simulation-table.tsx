"use client";

import { useSimStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { download, toMonthlyCsv } from "@/lib/export/csv";
import { createPortal } from "react-dom";
import { useState, useRef, useEffect } from "react";

function Tooltip({ content, children }: { content: React.ReactNode, children: React.ReactNode }) {
    const [isVisible, setIsVisible] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0 });
    const triggerRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleMouseEnter = () => {
        if (triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            setCoords({
                // Position above the element
                top: rect.top - 8,
                left: rect.left + rect.width / 2
            });
            setIsVisible(true);
        }
    };

    return (
        <>
            <div
                ref={triggerRef}
                className="inline-block"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={() => setIsVisible(false)}
            >
                {children}
            </div>
            {mounted && isVisible && createPortal(
                <div
                    className="fixed z-[9999] pointer-events-none"
                    style={{
                        top: coords.top,
                        left: coords.left,
                        transform: "translate(-50%, -100%)"
                    }}
                >
                    <div className="bg-zinc-900/95 text-white text-[10px] rounded px-3 py-2 shadow-xl border border-zinc-700 whitespace-nowrap backdrop-blur-sm">
                        {content}
                    </div>
                    {/* Arrow */}
                    <div
                        className="w-2 h-2 bg-zinc-900/95 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2 border-r border-b border-zinc-700"
                    ></div>
                </div>,
                document.body
            )}
        </>
    );
}

export function SimulationTable() {
    const { lastResult } = useSimStore();

    if (!lastResult) return null;

    // Use median (p50) for a single realistic simulation run
    const monthlyData = lastResult.percentiles.p50;

    return (
        <Card className="mt-6 md:col-span-2">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Turn-by-Turn Monthly Simulation</CardTitle>
                        <p className="text-xs text-zinc-500 mt-1">Each month shows actual business activity - campaigns running, patients served, cash movements</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            className="text-sm font-medium text-blue-600 hover:text-blue-800"
                            onClick={() => download("simulation_results.csv", toMonthlyCsv(monthlyData))}
                        >
                            Export CSV
                        </button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-zinc-50 border-b-2 border-zinc-300 text-zinc-600">
                            <tr>
                                <th className="p-3 font-semibold sticky left-0 bg-zinc-50 z-10 border-r-2 border-zinc-200">Month</th>

                                {/* Cash Position Start */}
                                <th className="p-3 font-semibold text-right bg-blue-100 border-r-2 border-blue-300">Cash Start</th>

                                {/* Cash In */}

                                {/* Activity */}
                                <th className="p-3 font-semibold text-right bg-purple-50 border-r-2 border-purple-200">Ad Spend</th>
                                <th className="p-3 font-semibold text-right bg-green-50 border-r border-green-200">Patients Served</th>

                                {/* Revenue */}
                                <th className="p-3 font-semibold text-right bg-green-50 border-r-2 border-green-200">Revenue (Accrual)</th>

                                {/* New: Revenue (Cash) */}
                                <th className="p-3 font-semibold text-right bg-green-100 border-r-2 border-green-300">Revenue (Cash)</th>

                                {/* Collections / Revenue Breakdown */}
                                <th className="p-3 font-semibold text-right text-xs bg-green-50/50 text-green-700">Paid in Full</th>
                                <th className="p-3 font-semibold text-right text-xs bg-green-50/50 text-green-700">Financed Down</th>
                                <th className="p-3 font-semibold text-right text-xs bg-green-50/50 text-green-700 border-r-2 border-green-200">Installments</th>

                                {/* Expenses Group */}
                                <th className="p-3 font-semibold text-right bg-red-50 text-red-700 border-r border-red-200">Expenses (Total)</th>
                                <th className="p-3 font-semibold text-right text-xs text-zinc-500 bg-red-50/30">↳ OpEx</th>
                                <th className="p-3 font-semibold text-right text-xs text-zinc-500 bg-red-50/30 border-r-2 border-red-200">↳ CapEx</th>

                                {/* Net Flow */}
                                <th className="p-3 font-semibold text-right bg-blue-50 border-r border-blue-200 font-bold">Net Flow</th>

                                {/* Cash End */}
                                <th className="p-3 font-semibold text-right bg-blue-50 font-bold">Cash End</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {monthlyData.map((m: any, i: number) => {
                                // Calculate cash movements
                                const totalOpEx = m.cashStart - m.cashAfterOverhead;

                                // Total Expense (OpEx + CapEx) - displayed as positive magnitude in red column
                                const totalExpenses = (m.totalExpenses ?? (totalOpEx + m.capex)); // fallback if undefined

                                // Patient count
                                const patientCount = m.patientsTotal || 0;

                                // Revenue (Cash) = PIF + Down + Installments
                                const revenueCash = m.revenueCash ?? ((m.nonFinancedRevenue || 0) + (m.financedDownpaymentCash || 0) + (m.installmentsCash || 0));

                                return (
                                    <tr key={i} className="hover:bg-zinc-50/50">
                                        <td className="p-3 font-bold text-zinc-900 sticky left-0 bg-white z-10 border-r-2 border-zinc-200">
                                            M{i + 1}
                                        </td>

                                        {/* Cash Start */}
                                        <td className="p-3 text-right font-bold text-blue-700 bg-blue-100/40 border-r-2 border-blue-300">
                                            ${m.cashStart.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                        </td>


                                        {/* Campaign Activity */}
                                        <td className="p-3 text-right font-medium text-purple-700 bg-purple-50/30 border-r-2 border-purple-200">
                                            ${m.adSpend.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                        </td>

                                        {/* Patient & Revenue */}
                                        <td className="p-3 text-right font-bold text-green-700 bg-green-50/30 border-r border-green-200">
                                            {patientCount}
                                        </td>
                                        <td className="p-3 text-right font-bold text-green-700 bg-green-50/30 border-r-2 border-green-200">
                                            ${m.revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                        </td>

                                        {/* Revenue (Cash) */}
                                        <td className="p-3 text-right font-bold text-green-800 bg-green-100/50 border-r-2 border-green-300">
                                            ${revenueCash.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                        </td>

                                        {/* Revenue / Collection Breakdown */}
                                        <td className="p-3 text-right text-xs text-green-600 bg-green-50/20">
                                            ${(m.nonFinancedRevenue || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                        </td>
                                        <td className="p-3 text-right text-xs text-green-600 bg-green-50/20">
                                            ${(m.financedDownpaymentCash || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                        </td>
                                        <td className="p-3 text-right text-xs text-green-600 bg-green-50/20 border-r-2 border-green-200">
                                            ${m.installmentsCash.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                        </td>

                                        {/* Expenses */}
                                        <td className="p-3 text-right font-bold text-red-700 bg-red-50/30 border-r border-red-200">
                                            ${totalExpenses.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                        </td>
                                        <td className="p-3 text-right text-xs text-red-600 bg-red-50/10">
                                            <Tooltip content={
                                                <div className="space-y-1">
                                                    <div className="flex justify-between gap-4 font-bold border-b border-zinc-700 pb-1 mb-1">
                                                        <span>Commissions Breakdown</span>
                                                    </div>
                                                    {(m.commissionsByDoctor || []).map((comm: number, idx: number) => (
                                                        <div key={idx} className="flex justify-between gap-4">
                                                            <span className="text-zinc-400">Dr. {idx + 1} {idx === 0 ? "(Owner)" : ""}:</span>
                                                            <span>${Math.round(comm).toLocaleString()}</span>
                                                        </div>
                                                    ))}
                                                    {m.closerCommissions !== undefined && m.closerCommissions !== 0 && (
                                                        <div className="flex justify-between gap-4">
                                                            <span className="text-zinc-400">Closer Comms:</span>
                                                            <span>${Math.round(m.closerCommissions).toLocaleString()}</span>
                                                        </div>
                                                    )}
                                                    <div className="flex justify-between gap-4 pt-1 border-t border-zinc-700 mt-1">
                                                        <span>Total Comms:</span>
                                                        <span>${Math.round(m.commissions).toLocaleString()}</span>
                                                    </div>
                                                    <div className="flex justify-between gap-4"><span>Staff Salaries:</span> <span>${Math.round(m.salaries).toLocaleString()}</span></div>
                                                    <div className="flex justify-between gap-4"><span>Fixed Costs:</span> <span>${Math.round(m.fixedCosts).toLocaleString()}</span></div>
                                                    <div className="flex justify-between gap-4 border-t border-zinc-700 mt-1 pt-1 opacity-60"><span>Lab & Materials (Var.):</span> <span>${Math.round(m.variableCosts).toLocaleString()}</span></div>
                                                    <div className="flex justify-between gap-4 font-bold border-t border-zinc-600 pt-1 text-xs">
                                                        <span>Total OpEx:</span>
                                                        <span>${Math.round(m.commissions + m.salaries + m.fixedCosts + m.variableCosts).toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            }>
                                                <span className="cursor-help border-b border-dotted border-red-300 w-full text-right">
                                                    ${(m.commissions + m.salaries + m.fixedCosts + m.variableCosts).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                                </span>
                                            </Tooltip>
                                        </td>
                                        <td className="p-3 text-right text-xs text-orange-600 bg-red-50/10 border-r-2 border-red-200">
                                            {m.capex > 0 ? `$${m.capex.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : '-'}
                                        </td>

                                        {/* Net Flow */}
                                        <td className={cn("p-3 text-right font-bold bg-blue-50/30 border-r border-blue-200", m.netCashflow >= 0 ? "text-green-700" : "text-red-700")}>
                                            {m.netCashflow >= 0 ? "+" : ""}${m.netCashflow.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                        </td>

                                        {/* Cash End */}
                                        <td className="p-3 text-right font-bold text-blue-700 bg-blue-50/30">
                                            ${m.cashOnHand.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Legend */}
                <div className="mt-4 p-4 bg-zinc-50 rounded-lg border border-zinc-200">
                    <p className="text-xs font-semibold text-zinc-700 mb-2">How to Read This Simulation:</p>
                    <div className="grid grid-cols-3 gap-3 text-xs text-zinc-600">
                        <div><span className="font-medium text-blue-700">Cash Flow:</span> Start + Revenue (Cash) - Expenses = Cash End</div>
                        <div><span className="font-medium text-green-700">Revenue (Accrual):</span> Value of services performed (Sales). Revenue (Cash) lags behind this due to financing.</div>
                        <div><span className="font-medium text-green-800">Revenue (Cash):</span> Total cash received from treatments (Paid in Full + Downpayments + Installments).</div>
                        <div><span className="font-medium text-red-700">Expenses:</span> Total Cash Outflows for OpEx and CapEx.</div>
                        <div><span className="font-medium text-blue-700">Net Flow:</span> Operating Cash Flow (Revenue (Cash) - Expenses).</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
