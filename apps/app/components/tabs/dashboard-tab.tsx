"use client";
import { useSimStore } from "@/lib/store";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo } from "react";
import { download, toMonthlyCsv } from "@/lib/export/csv";
import { SimulationTable } from "@/components/simulation-table";

export function DashboardTab() {
    const { lastResult } = useSimStore();

    const chartData = useMemo(() => {
        if (!lastResult) return [];
        return lastResult.byMonthMean.map((m, i) => ({
            name: `M${i + 1}`,
            meanCash: Math.round(m.cashOnHand),
            p5Cash: Math.round(lastResult.percentiles.p5[i]?.cashOnHand ?? 0),
            p95Cash: Math.round(lastResult.percentiles.p95[i]?.cashOnHand ?? 0),
            backlog: Math.round(m.backlogTotal ?? 0),
            utilization: Math.round(m.utilizationPct * 100),
        }));
    }, [lastResult]);

    const kpis = useMemo(() => {
        if (!lastResult) return null;
        const finalMonth = lastResult.byMonthMean.at(-1)!;
        const totalRev = lastResult.ytd.revenue;
        const totalProfit = lastResult.ytd.netCashflow; // Simplification
        return {
            cashAtEnd: finalMonth.cashOnHand,
            totalRev,
            totalProfit,
            finalBacklog: finalMonth.backlogTotal ?? 0
        };
    }, [lastResult]);

    if (!lastResult) {
        return (
            <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed text-zinc-400">
                <p>No simulation results yet.</p>
                <p className="text-sm">Configure parameters and click "Run Simulation".</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-sm font-medium text-zinc-500">Cash on Hand (End)</div>
                        <div className="text-2xl font-bold text-zinc-900">${kpis?.cashAtEnd.toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-sm font-medium text-zinc-500">Total Revenue (YTD)</div>
                        <div className="text-2xl font-bold text-zinc-900">${kpis?.totalRev.toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-sm font-medium text-zinc-500">Total Net Cashflow</div>
                        <div className={cn("text-2xl font-bold", (kpis?.totalProfit ?? 0) >= 0 ? "text-green-600" : "text-red-600")}>
                            ${kpis?.totalProfit.toLocaleString()}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-sm font-medium text-zinc-500">Waitlist (End)</div>
                        <div className="text-2xl font-bold text-zinc-900">{kpis?.finalBacklog.toFixed(1)} Patients</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="h-[400px]">
                    <CardHeader className="pb-0">
                        <CardTitle>Cash Flow Projection</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[320px] w-full pt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="name" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis
                                    stroke="#6B7280"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `$${value / 1000}k`}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                                />
                                <Legend />
                                <Line type="monotone" name="Mean Cash" dataKey="meanCash" stroke="#18181B" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                                <Line type="monotone" name="Opt. (95%)" dataKey="p95Cash" stroke="#10B981" strokeWidth={1} strokeDasharray="4 4" dot={false} />
                                <Line type="monotone" name="Cons. (5%)" dataKey="p5Cash" stroke="#EF4444" strokeWidth={1} strokeDasharray="4 4" dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="h-[400px]">
                    <CardHeader className="pb-0">
                        <CardTitle>Capacity & Waitlist</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[320px] w-full pt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="name" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis yAxisId="left" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis yAxisId="right" orientation="right" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} unit="%" />
                                <Tooltip
                                    contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                                />
                                <Legend />
                                <Line yAxisId="left" type="monotone" name="Waitlist (Patients)" dataKey="backlog" stroke="#F59E0B" strokeWidth={2} dot={false} />
                                <Line yAxisId="right" type="monotone" name="Utilization" dataKey="utilization" stroke="#3B82F6" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            <SimulationTable />
        </div>
    );
}
// Helper for tailwind class merging since we used it in the template
import { cn } from "@/lib/utils";
