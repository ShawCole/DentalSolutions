"use client";
import { useMemo, useState } from "react";
import { useSimStore } from "@/lib/store";
import { buildLedger, type LedgerEvent } from "@/lib/finance/ledger";
import { buildDailySchedule } from "@/lib/schedule/daily";

type ViewMode = "day" | "week" | "month";

type ClientRow = {
    clientId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfDeposit?: string;
    amountOfDeposit?: number;
    dateOfFirstAppt?: string;
    typeOfService?: string;
    revenueFromService: number;
    status: string;
    paidSoFar: number;
    toPay: number;
    numInstallments: number;
    regularPayment: number;
    paymentFreq: string;
    finalPaymentDate?: string;
};

function fmt(d?: Date) {
    return d ? d.toISOString().slice(0, 10) : undefined;
}

export default function ClientsPage() {
    const { assumptions } = useSimStore();
    const [view, setView] = useState<ViewMode>("month");
    const [monthIdx, setMonthIdx] = useState(0);
    const [anchorDay, setAnchorDay] = useState(1);

    const monthMeta = useMemo(() => {
        const y = Number(assumptions.capacity.startMonthISO.split("-")[0]);
        const m0 = Number(assumptions.capacity.startMonthISO.split("-")[1]);
        const start = new Date(Date.UTC(y, (m0 - 1) + monthIdx, 1));
        const end = new Date(Date.UTC(y, (m0 - 1) + monthIdx + 1, 0));
        return { start, end };
    }, [assumptions, monthIdx]);

    const range = useMemo(() => {
        if (view === "month") return { start: monthMeta.start, end: monthMeta.end };
        const day = new Date(Date.UTC(monthMeta.start.getUTCFullYear(), monthMeta.start.getUTCMonth(), Math.min(anchorDay, monthMeta.end.getUTCDate())));
        if (view === "day") return { start: day, end: day };
        // week: 7 days from anchor
        const end = new Date(Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate() + 6));
        return { start: day, end };
    }, [view, monthMeta, anchorDay]);

    const rows = useMemo<ClientRow[]>(() => {
        const evs = buildLedger(assumptions);
        // group by clientId
        const byClient = new Map<string, LedgerEvent[]>();
        for (const ev of evs) {
            if (!ev.clientId) continue;
            if (!byClient.has(ev.clientId)) byClient.set(ev.clientId, []);
            byClient.get(ev.clientId)!.push(ev);
        }
        const result: ClientRow[] = [];
        const inRange = (d: Date) => d >= range.start && d <= range.end;
        for (const [clientId, events] of byClient) {
            events.sort((a, b) => a.date.getTime() - b.date.getTime());
            const service = events.find(e => e.kind === "ServiceRevenue")?.service;
            const depositEv = events.find(e => e.kind === "BookingDownpaymentHeld");
            const depositDate = depositEv?.date;
            const depositAmt = depositEv?.amount && depositEv.amount > 0 ? depositEv.amount : undefined;
            const firstApptDate = events.find(e => e.kind === "ServiceRevenue")?.date;
            const revenue = events.filter(e => e.kind === "ServiceRevenue").reduce((s, e) => s + e.amount, 0);
            const instEvents = events.filter(e => e.kind === "InstallmentCashReceived");
            const finalInstallment = instEvents.at(-1)?.date;
            const numInstallments = instEvents.length;
            const regularPayment = numInstallments > 0 ? Math.round(instEvents.reduce((s, e) => s + e.amount, 0) / numInstallments) : 0;
            const paidSoFar = events.filter(e => e.cash && inRange(e.date)).reduce((s, e) => s + e.amount, 0);
            const paidTotal = events.filter(e => e.cash).reduce((s, e) => s + e.amount, 0);
            const toPay = Math.max(0, revenue - paidTotal);
            // status in range end day
            const d = range.end;
            let status = "Booked & Paid";
            if (firstApptDate && d < firstApptDate) status = "Booked & Paid";
            else if (firstApptDate && d.getTime() === firstApptDate.getTime()) status = "In Chair, Appt 1";
            else if (finalInstallment && d > firstApptDate! && d < finalInstallment) {
                if (toPay > 0) {
                    const k = instEvents.filter(e => e.date <= d).length;
                    status = `${k} of ${numInstallments} Installments`;
                } else {
                    status = "Resting";
                }
            }
            else if (finalInstallment && d >= finalInstallment && toPay === 0) status = "Finished Paying";

            result.push({
                clientId,
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                dateOfDeposit: fmt(depositDate),
                amountOfDeposit: depositAmt,
                dateOfFirstAppt: fmt(firstApptDate),
                typeOfService: service,
                revenueFromService: revenue,
                status,
                paidSoFar: paidSoFar,
                toPay,
                numInstallments,
                regularPayment,
                paymentFreq: assumptions.financing.cadence,
                finalPaymentDate: fmt(finalInstallment),
            });
        }
        // filter to clients that have any event intersecting range (one row/client/day max; we show one per client for the chosen period)
        return result;
    }, [assumptions, range]);

    return (
        <div className="min-h-screen w-full bg-white text-zinc-900">
            <div className="mx-auto max-w-[1200px] px-6 py-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Client Log</h1>
                    <a href="/" className="rounded border px-3 py-1 text-sm hover:bg-zinc-50">Back</a>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-4">
                    <div>
                        <div className="text-sm">View</div>
                        <select className="mt-1 w-full rounded border px-2 py-1" value={view} onChange={(e) => setView(e.target.value as ViewMode)}>
                            <option value="day">Day</option>
                            <option value="week">Week</option>
                            <option value="month">Month</option>
                        </select>
                    </div>
                    <div>
                        <div className="text-sm">Month</div>
                        <input type="range" min={0} max={assumptions.capacity.months - 1} step={1} className="w-full" value={monthIdx} onChange={(e) => setMonthIdx(Number(e.target.value))} />
                        <div className="text-xs">M{monthIdx + 1}</div>
                    </div>
                    {view !== "month" && (
                        <div>
                            <div className="text-sm">Anchor Day</div>
                            <input type="range" min={1} max={31} step={1} className="w-full" value={anchorDay} onChange={(e) => setAnchorDay(Number(e.target.value))} />
                            <div className="text-xs">{anchorDay}</div>
                        </div>
                    )}
                </div>

                <div className="mt-6 overflow-auto rounded border">
                    <table className="min-w-[1100px] w-full text-sm">
                        <thead>
                            <tr className="border-b bg-zinc-50 text-left">
                                <th className="sticky top-0 z-10 bg-zinc-50 py-1 pl-2 pr-2">ClientID</th>
                                <th className="sticky top-0 z-10 bg-zinc-50 py-1 pr-2">First</th>
                                <th className="sticky top-0 z-10 bg-zinc-50 py-1 pr-2">Last</th>
                                <th className="sticky top-0 z-10 bg-zinc-50 py-1 pr-2">Email</th>
                                <th className="sticky top-0 z-10 bg-zinc-50 py-1 pr-2">Phone</th>
                                <th className="sticky top-0 z-10 bg-zinc-50 py-1 pr-2">Deposit Date</th>
                                <th className="sticky top-0 z-10 bg-zinc-50 py-1 pr-2">Deposit $</th>
                                <th className="sticky top-0 z-10 bg-zinc-50 py-1 pr-2">First Appt</th>
                                <th className="sticky top-0 z-10 bg-zinc-50 py-1 pr-2">Service</th>
                                <th className="sticky top-0 z-10 bg-zinc-50 py-1 pr-2">Revenue</th>
                                <th className="sticky top-0 z-10 bg-zinc-50 py-1 pr-2">Status</th>
                                <th className="sticky top-0 z-10 bg-zinc-50 py-1 pr-2">Paid</th>
                                <th className="sticky top-0 z-10 bg-zinc-50 py-1 pr-2">To Pay</th>
                                <th className="sticky top-0 z-10 bg-zinc-50 py-1 pr-2">#Inst</th>
                                <th className="sticky top-0 z-10 bg-zinc-50 py-1 pr-2">$</th>
                                <th className="sticky top-0 z-10 bg-zinc-50 py-1 pr-2">Freq</th>
                                <th className="sticky top-0 z-10 bg-zinc-50 py-1 pr-2">Final Payment</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((r) => (
                                <tr key={r.clientId} className="border-b">
                                    <td className="py-1 pl-2 pr-2">{r.clientId}</td>
                                    <td className="py-1 pr-2">{r.firstName}</td>
                                    <td className="py-1 pr-2">{r.lastName}</td>
                                    <td className="py-1 pr-2">{r.email}</td>
                                    <td className="py-1 pr-2">{r.phone}</td>
                                    <td className="py-1 pr-2">{r.dateOfDeposit ?? ""}</td>
                                    <td className="py-1 pr-2">{r.amountOfDeposit ? `$${Math.round(r.amountOfDeposit).toLocaleString()}` : ""}</td>
                                    <td className="py-1 pr-2">{r.dateOfFirstAppt ?? ""}</td>
                                    <td className="py-1 pr-2">{r.typeOfService ?? ""}</td>
                                    <td className="py-1 pr-2">${Math.round(r.revenueFromService).toLocaleString()}</td>
                                    <td className="py-1 pr-2">{r.status}</td>
                                    <td className="py-1 pr-2">${Math.round(r.paidSoFar).toLocaleString()}</td>
                                    <td className="py-1 pr-2">${Math.round(r.toPay).toLocaleString()}</td>
                                    <td className="py-1 pr-2">{r.numInstallments}</td>
                                    <td className="py-1 pr-2">{r.regularPayment ? `$${Math.round(r.regularPayment).toLocaleString()}` : ""}</td>
                                    <td className="py-1 pr-2">{r.paymentFreq}</td>
                                    <td className="py-1 pr-2">{r.finalPaymentDate ?? ""}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}


