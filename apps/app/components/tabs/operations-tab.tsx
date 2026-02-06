"use client";
import { useSimStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useMemo } from "react";

export function OperationsTab() {
    const { assumptions, lastResult, setAssumptions } = useSimStore();

    const capexTimeline = useMemo(() => {
        const months = assumptions.capacity.months;
        const rows: { month: string; chairs: number; added: number; chairCapex: number; xrayCapex: number; total: number }[] = [];
        for (let m = 0; m < months; m++) {
            const chairs = assumptions.capacity.chairsByMonth[m] ?? assumptions.capacity.chairsByMonth.at(-1)!;
            const prev = m === 0 ? assumptions.capacity.chairsByMonth[0] : assumptions.capacity.chairsByMonth[m - 1] ?? chairs;
            const added = Math.max(0, chairs - prev);
            const chairCapex = added * assumptions.capacity.chairCapexPerAdd;
            const xrayCapex = assumptions.capacity.xray.enabledMonthIdx === m ? assumptions.capacity.xray.capex : 0;
            const total = chairCapex + xrayCapex;
            rows.push({ month: `M${m + 1}`, chairs, added, chairCapex, xrayCapex, total });
        }
        return rows;
    }, [assumptions]);

    function recalcChairsByPurchases(baseChairs: number, months: number, purchaseMonths: number[] | undefined) {
        const arr = Array.from({ length: months }, () => baseChairs);
        (purchaseMonths ?? []).forEach((pm) => {
            if (typeof pm === "number" && pm >= 0 && pm < months) {
                for (let i = pm; i < months; i++) arr[i] += 1;
            }
        });
        return arr;
    }

    return (
        <div className="grid gap-6">
            <div className="grid gap-6 md:grid-cols-2">
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle>Capacity & Staff</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Base Chairs (M1)</label>
                            <input
                                type="number" className="w-full rounded-md border px-3 py-2 text-sm"
                                value={assumptions.capacity.chairsByMonth[0]}
                                onChange={(e) => {
                                    const base = Number(e.target.value || 0);
                                    const arr = recalcChairsByPurchases(base, assumptions.capacity.months, assumptions.capacity.chairPurchaseMonths);
                                    setAssumptions({ capacity: { ...assumptions.capacity, chairsByMonth: arr } });
                                }}
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-sm font-medium text-zinc-500">Scheduled Doctors</label>
                            {Array.from({ length: assumptions.capacity.doctorsByMonth[0] }).map((_, i) => (
                                <div key={i} className="p-3 border rounded-lg bg-zinc-50/50 space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Doctor {i + 1} {i === 0 && "(Owner/Primary)"}</span>
                                    </div>
                                    <Slider
                                        label="Start Month"
                                        valueDisplay={`M${(assumptions.capacity.doctorStartMonths?.[i] ?? 0) + 1}`}
                                        min={0} max={11} step={1}
                                        value={assumptions.capacity.doctorStartMonths?.[i] ?? 0}
                                        onChange={(e) => {
                                            const startMonths = [...(assumptions.capacity.doctorStartMonths || Array(assumptions.capacity.doctorsByMonth[0]).fill(0))];
                                            startMonths[i] = Number(e.target.value);
                                            setAssumptions({ capacity: { ...assumptions.capacity, doctorStartMonths: startMonths } });
                                        }}
                                    />
                                </div>
                            ))}
                            <div className="pt-2">
                                <label className="text-sm font-medium">Total Doctors Count</label>
                                <input
                                    type="number" className="w-full rounded-md border px-3 py-2 text-sm mt-1"
                                    value={assumptions.capacity.doctorsByMonth[0]}
                                    onChange={(e) => {
                                        const count = Math.max(1, Number(e.target.value || 1));
                                        const newStarts = Array(count).fill(0).map((_, i) => assumptions.capacity.doctorStartMonths?.[i] ?? 0);
                                        setAssumptions({
                                            capacity: {
                                                ...assumptions.capacity,
                                                doctorsByMonth: Array.from({ length: assumptions.capacity.months }, () => count),
                                                doctorStartMonths: newStarts
                                            },
                                        });
                                    }}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Utilization Settings - Top Right */}
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle>Daily Utilization</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-medium">Clinic Hours</label>
                                <span className="text-xs font-mono bg-zinc-100 px-2 py-1 rounded">
                                    {(assumptions.capacity.utilization?.openHour ?? 9)}:00 - {(assumptions.capacity.utilization?.closeHour ?? 18)}:00
                                    <span className="text-zinc-400 ml-1">
                                        ({(assumptions.capacity.utilization?.closeHour ?? 18) - (assumptions.capacity.utilization?.openHour ?? 9)} hrs)
                                    </span>
                                </span>
                            </div>
                            <div className="flex gap-4 items-center">
                                <div className="flex-1 space-y-1">
                                    <span className="text-xs text-zinc-400">Open</span>
                                    <Slider
                                        min={6} max={12} step={1}
                                        value={assumptions.capacity.utilization?.openHour ?? 9}
                                        onChange={(e) => setAssumptions({
                                            capacity: {
                                                ...assumptions.capacity,
                                                utilization: {
                                                    ...(assumptions.capacity.utilization || { closeHour: 18, maxDoctorsPerDay: 2 }),
                                                    openHour: Number(e.target.value)
                                                }
                                            }
                                        })}
                                    />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <span className="text-xs text-zinc-400">Close</span>
                                    <Slider
                                        min={14} max={22} step={1}
                                        value={assumptions.capacity.utilization?.closeHour ?? 18}
                                        onChange={(e) => setAssumptions({
                                            capacity: {
                                                ...assumptions.capacity,
                                                utilization: {
                                                    ...(assumptions.capacity.utilization || { openHour: 9, maxDoctorsPerDay: 2 }),
                                                    closeHour: Number(e.target.value)
                                                }
                                            }
                                        })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Doctors per Day (Concurrency)</label>
                            <Slider
                                valueDisplay={`${assumptions.capacity.utilization?.maxDoctorsPerDay ?? 2} docs`}
                                min={1} max={5} step={1}
                                value={assumptions.capacity.utilization?.maxDoctorsPerDay ?? 2}
                                onChange={(e) => setAssumptions({
                                    capacity: {
                                        ...assumptions.capacity,
                                        utilization: {
                                            ...(assumptions.capacity.utilization || { openHour: 9, closeHour: 18 }),
                                            maxDoctorsPerDay: Number(e.target.value)
                                        }
                                    }
                                })}
                            />
                            <p className="text-xs text-zinc-500 italic">
                                Controls how many doctors work simultaneously. Capacity = Min(Chairs, Daily Docs) × Hours.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle>Staff Management</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Owner Acts as Doctor (Months)</label>
                            <Slider
                                valueDisplay={`${assumptions.staff.ownerAsDoctorMonths} months`}
                                min={0} max={24} step={1}
                                value={assumptions.staff.ownerAsDoctorMonths}
                                onChange={(e) => setAssumptions({ staff: { ...assumptions.staff, ownerAsDoctorMonths: Number(e.target.value) } })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Nurse Start Month</label>
                            <Slider
                                valueDisplay={`M${assumptions.staff.nurseStartMonthIdx + 1}`}
                                min={0} max={11} step={1}
                                value={assumptions.staff.nurseStartMonthIdx}
                                onChange={(e) => setAssumptions({ staff: { ...assumptions.staff, nurseStartMonthIdx: Number(e.target.value) } })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Nurse Hourly Rate</label>
                                <input
                                    type="number" className="w-full rounded-md border px-3 py-2 text-sm"
                                    value={assumptions.staff.nurseHourlyRate}
                                    onChange={(e) => setAssumptions({ staff: { ...assumptions.staff, nurseHourlyRate: Number(e.target.value || 0) } })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Monthly Hours</label>
                                <input
                                    type="number" className="w-full rounded-md border px-3 py-2 text-sm"
                                    value={assumptions.staff.nurseHoursPerMonth}
                                    onChange={(e) => setAssumptions({ staff: { ...assumptions.staff, nurseHoursPerMonth: Number(e.target.value || 0) } })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Receptionist Start Month</label>
                            <Slider
                                valueDisplay={`M${assumptions.staff.receptionistStartMonthIdx + 1}`}
                                min={0} max={11} step={1}
                                value={assumptions.staff.receptionistStartMonthIdx}
                                onChange={(e) => setAssumptions({ staff: { ...assumptions.staff, receptionistStartMonthIdx: Number(e.target.value) } })}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="h-full">
                    <CardHeader>
                        <CardTitle>Commission Structure</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Doctor Commission Rate</label>
                            <Slider
                                valueDisplay={`${(assumptions.staff.doctorCommissionPct.mode * 100).toFixed(0)}%`}
                                min={0} max={0.5} step={0.01}
                                value={assumptions.staff.doctorCommissionPct.mode}
                                onChange={(e) => {
                                    const val = Number(e.target.value);
                                    setAssumptions({ staff: { ...assumptions.staff, doctorCommissionPct: { min: val, mode: val, max: val } } });
                                }}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Upfront Payment % (Remainder Deferred)</label>
                            <Slider
                                valueDisplay={`${(assumptions.staff.commissionStructure.upfrontPct * 100).toFixed(0)}%`}
                                min={0} max={1} step={0.05}
                                value={assumptions.staff.commissionStructure.upfrontPct}
                                onChange={(e) => setAssumptions({
                                    staff: {
                                        ...assumptions.staff,
                                        commissionStructure: { ...assumptions.staff.commissionStructure, upfrontPct: Number(e.target.value) }
                                    }
                                })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Deferred Payment Delay (Months)</label>
                            <Slider
                                valueDisplay={`${assumptions.staff.commissionStructure.deferralMonths} mo`}
                                min={1} max={6} step={1}
                                value={assumptions.staff.commissionStructure.deferralMonths}
                                onChange={(e) => setAssumptions({
                                    staff: {
                                        ...assumptions.staff,
                                        commissionStructure: { ...assumptions.staff.commissionStructure, deferralMonths: Number(e.target.value) }
                                    }
                                })}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>CapEx Timeline (Chairs & X-Ray)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6 md:grid-cols-2 mb-4">
                        <Slider
                            label="X-Ray Purchase Month"
                            valueDisplay={`M${(assumptions.capacity.xray.enabledMonthIdx ?? 0) + 1}`}
                            min={0} max={11} step={1}
                            value={assumptions.capacity.xray.enabledMonthIdx ?? 0}
                            onChange={(e) => setAssumptions({ capacity: { ...assumptions.capacity, xray: { ...assumptions.capacity.xray, enabledMonthIdx: Number(e.target.value) } } })}
                        />
                        <Slider
                            label="Chair Cost"
                            valueDisplay={`$${assumptions.capacity.chairCapexPerAdd}`}
                            min={5000} max={25000} step={500}
                            value={assumptions.capacity.chairCapexPerAdd}
                            onChange={(e) => setAssumptions({ capacity: { ...assumptions.capacity, chairCapexPerAdd: Number(e.target.value) } })}
                        />
                        <Slider
                            label="Chair 1 Purchase (Month)"
                            valueDisplay={`M${(assumptions.capacity.chairPurchaseMonths?.[0] ?? 0) + 1}`}
                            min={0} max={11} step={1}
                            value={(assumptions.capacity.chairPurchaseMonths?.[0] ?? 0)}
                            onChange={(e) => {
                                const pm0 = Number(e.target.value);
                                const pm1 = assumptions.capacity.chairPurchaseMonths?.[1];
                                const pms = [pm0, ...(typeof pm1 === 'number' ? [pm1] : [])];
                                const base = assumptions.capacity.chairsByMonth[0];
                                const arr = recalcChairsByPurchases(base, assumptions.capacity.months, pms);
                                setAssumptions({ capacity: { ...assumptions.capacity, chairPurchaseMonths: pms, chairsByMonth: arr } });
                            }}
                        />
                    </div>
                    <div className="max-h-60 overflow-auto rounded border">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-zinc-50 border-b">
                                <tr>
                                    <th className="p-2 font-medium">Month</th>
                                    <th className="p-2 font-medium">Chairs</th>
                                    <th className="p-2 font-medium">CapEx</th>
                                </tr>
                            </thead>
                            <tbody>
                                {capexTimeline.map((r, i) => (
                                    <tr key={i} className="border-b">
                                        <td className="p-2">{r.month}</td>
                                        <td className="p-2">{r.chairs} (+{r.added})</td>
                                        <td className="p-2 font-mono">${r.total.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
