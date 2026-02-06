"use client";
import { useSimStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo, useState } from "react";
import { clsx } from "clsx";
import { buildLedger } from "@dentalsolutions/core";

export function ClientLogTab() {
    const { lastResult, assumptions } = useSimStore();
    const [filterTag, setFilterTag] = useState<string>("All");
    const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

    const clientLog = lastResult?.clientLog || [];
    const ledger = useMemo(() => buildLedger(assumptions), [assumptions]);

    const tags = useMemo(() => {
        const t = new Set<string>(["All"]);
        clientLog.forEach(entry => entry.tags.forEach(tag => t.add(tag)));
        return Array.from(t);
    }, [clientLog]);

    const filteredLog = useMemo(() => {
        if (filterTag === "All") return clientLog;
        return clientLog.filter(entry => entry.tags.includes(filterTag));
    }, [clientLog, filterTag]);

    if (!lastResult) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-zinc-500 bg-white rounded-xl border border-dashed border-zinc-200">
                <p>Run simulation to generate client log</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {tags.map(tag => (
                    <button
                        key={tag}
                        onClick={() => setFilterTag(tag)}
                        className={clsx(
                            "px-3 py-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap",
                            filterTag === tag
                                ? "bg-zinc-900 text-white"
                                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                        )}
                    >
                        {tag}
                    </button>
                ))}
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Client Log (Sample Run)</CardTitle>
                    <div className="text-xs text-zinc-400">
                        Total Records: {filteredLog.length} / {clientLog.length}
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead>
                                <tr className="border-b border-zinc-100 text-zinc-500 font-medium">
                                    <th className="py-3 px-2">Patient</th>
                                    <th className="py-3 px-2 italic text-zinc-400">Appointment</th>
                                    <th className="py-3 px-2 italic text-zinc-400">Completion</th>
                                    <th className="py-3 px-2">Downpayment</th>
                                    <th className="py-3 px-2 text-blue-600 font-bold">Next Payment</th>
                                    <th className="py-3 px-2">Source</th>
                                    <th className="py-3 px-2">Tags</th>
                                    <th className="py-3 px-2">Package</th>
                                    <th className="py-3 px-2 text-right">Revenue</th>
                                    <th className="py-3 px-2 text-center">Cashflow</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLog.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-8 text-center text-zinc-400 italic">No records found for this filter.</td>
                                    </tr>
                                ) : (
                                    filteredLog.map(entry => {
                                        const isSelected = selectedClientId === entry.id;

                                        // Strictly filter client events by matching name/month as a fallback if IDs don't match 1:1
                                        const clientEvents = ledger.filter(ev =>
                                            ev.clientId && (
                                                ev.clientId === entry.id ||
                                                (ev.patientFirstName === entry.firstName && ev.patientLastName === entry.lastName)
                                            )
                                        ).sort((a, b) => a.date.getTime() - b.date.getTime());

                                        const apptEvent = clientEvents.find(ev => ev.kind === "ServiceRevenue");
                                        const depositEvent = clientEvents.find(ev => ev.kind === "HeldDepositRelease" || ev.kind === "BookingDownpaymentHeld");

                                        // Next payment is the next upcoming installment after Today
                                        const now = new Date();
                                        const nextPaymentEvent = clientEvents
                                            .filter(ev => ev.kind === "InstallmentCashReceived" && ev.date > now)
                                            .sort((a, b) => a.date.getTime() - b.date.getTime())[0];

                                        const formatDate = (d?: Date) => d ? d.toISOString().slice(0, 10) : "—";

                                        return (
                                            <>
                                                <tr
                                                    key={entry.id}
                                                    className={clsx(
                                                        "border-b border-zinc-50 hover:bg-zinc-50 transition-colors cursor-pointer text-xs",
                                                        isSelected && "bg-zinc-50 shadow-inner"
                                                    )}
                                                    onClick={() => setSelectedClientId(isSelected ? null : entry.id)}
                                                >
                                                    <td className="py-3 px-2 font-medium" title={entry.id}>{entry.firstName} {entry.lastName}</td>
                                                    <td className="py-3 px-2 text-zinc-400 font-mono italic">{entry.appointmentDate || "—"}</td>
                                                    <td className="py-3 px-2 text-zinc-400 font-mono italic">{entry.completionDate || "—"}</td>
                                                    <td className="py-3 px-2 text-zinc-500 font-mono">${Math.round(entry.downpayment || 0).toLocaleString()}</td>
                                                    <td className="py-3 px-2">
                                                        {nextPaymentEvent ? (
                                                            <div className="flex flex-col">
                                                                <span className="text-blue-600 font-bold font-mono">{formatDate(nextPaymentEvent.date)}</span>
                                                                <span className="text-[9px] text-zinc-400 uppercase tracking-tighter">Friday</span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-zinc-300">—</span>
                                                        )}
                                                    </td>
                                                    <td className="py-3 px-2 text-zinc-600 truncate max-w-[100px]">{entry.campaignName}</td>
                                                    <td className="py-3 px-2">
                                                        <div className="flex gap-1">
                                                            {entry.tags.map(t => (
                                                                <span key={t} className={clsx(
                                                                    "px-1.5 py-0.5 rounded text-[10px] font-bold uppercase",
                                                                    t === "US" ? "bg-blue-100 text-blue-700" :
                                                                        t === "MEX" ? "bg-green-100 text-green-700" :
                                                                            t === "Msgr" ? "bg-purple-100 text-purple-700" :
                                                                                t === "Form" ? "bg-orange-100 text-orange-700" :
                                                                                    "bg-zinc-100 text-zinc-600"
                                                                )}>
                                                                    {t}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-2 capitalize">{entry.packageKey.replace(/([A-Z])/g, ' $1')}</td>
                                                    <td className="py-3 px-2 text-right font-semibold">${Math.round(entry.revenue).toLocaleString()}</td>
                                                    <td className="py-3 px-2 text-center text-zinc-400">
                                                        {isSelected ? "▲" : "▼"}
                                                    </td>
                                                </tr>
                                                {isSelected && (
                                                    <tr className="bg-zinc-50/50 border-b border-zinc-200">
                                                        <td colSpan={9} className="p-4 pt-0">
                                                            <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
                                                                <table className="w-full text-xs">
                                                                    <thead className="bg-zinc-50 text-zinc-500 font-medium">
                                                                        <tr>
                                                                            <th className="p-2 text-left">Date</th>
                                                                            <th className="p-2 text-left">Event</th>
                                                                            <th className="p-2 text-left">Details</th>
                                                                            <th className="p-2 text-right">In/Out</th>
                                                                            <th className="p-2 text-center">Status</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {clientEvents.length === 0 ? (
                                                                            <tr><td colSpan={5} className="p-4 text-center text-zinc-400">No detailed records found for this patient in the current ledger run.</td></tr>
                                                                        ) : (
                                                                            clientEvents.map((ev, idx) => (
                                                                                <tr key={idx} className="border-t border-zinc-100">
                                                                                    <td className="p-2 text-zinc-500 font-mono">{ev.date.toISOString().slice(0, 10)}</td>
                                                                                    <td className="p-2 font-medium">{ev.kind.replace(/([A-Z])/g, ' $1')}</td>
                                                                                    <td className="p-2 text-zinc-400 italic">{ev.note || "—"}</td>
                                                                                    <td className={clsx(
                                                                                        "p-2 text-right font-bold",
                                                                                        ev.amount >= 0 ? "text-green-600" : "text-red-500"
                                                                                    )}>
                                                                                        {ev.amount >= 0 ? "+" : ""}${Math.round(ev.amount).toLocaleString()}
                                                                                    </td>
                                                                                    <td className="p-2 text-center">
                                                                                        <span className={clsx(
                                                                                            "px-1 rounded text-[8px] font-bold uppercase",
                                                                                            ev.cash ? "bg-green-50 text-green-600" : "bg-zinc-100 text-zinc-400"
                                                                                        )}>
                                                                                            {ev.cash ? "Cash" : "Accrued"}
                                                                                        </span>
                                                                                    </td>
                                                                                </tr>
                                                                            ))
                                                                        )}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
