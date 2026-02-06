"use client";
import { useSimStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { download, toMonthlyCsv } from "@/lib/export/csv";
import { SimulationTable } from "@/components/simulation-table";

export function FinancialsTab() {
    const { assumptions, setAssumptions } = useSimStore();

    return (
        <div className="space-y-6">
            {/* Global Revenue Control */}
            <Card className="bg-white text-zinc-900 border-2 border-zinc-100 shadow-md">
                <CardHeader>
                    <CardTitle className="text-zinc-900 flex items-center justify-between">
                        <span>Global Payment Mix</span>
                        <span className="text-xs font-normal text-zinc-500">Determines the ratio of patients financing vs. paying in full</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Slider
                        label="Patient Payment Mix"
                        valueDisplay={`${Math.round(assumptions.financing.financingTakeRatePct * 100)}% Finance / ${Math.round((1 - assumptions.financing.financingTakeRatePct) * 100)}% Full`}
                        min={0} max={100} step={1}
                        value={Math.round(assumptions.financing.financingTakeRatePct * 100)}
                        onChange={(e) => setAssumptions({ financing: { ...assumptions.financing, financingTakeRatePct: Number(e.target.value) / 100 } })}
                    />
                    <div className="mt-2 flex justify-between text-[10px] text-zinc-400 font-bold uppercase tracking-widest px-1">
                        <span>Everybody Finances</span>
                        <span>Everybody Pays In Full</span>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Left Column: Revenue Drivers */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Procedure Pricing ($)</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <p className="text-xs font-bold uppercase text-zinc-400 tracking-wider">Smile Design (Non-Invasive)</p>
                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="text-[10px] text-zinc-500 block mb-1">Nanotech</label>
                                        <input type="number" className="w-full rounded border px-2 py-1 text-sm bg-zinc-50"
                                            value={assumptions.pricing.smileDesign.nonInvasive.nanotech}
                                            onChange={(e) => {
                                                const val = Number(e.target.value || 0);
                                                setAssumptions({
                                                    pricing: { ...assumptions.pricing, smileDesign: { ...assumptions.pricing.smileDesign, nonInvasive: { ...assumptions.pricing.smileDesign.nonInvasive, nanotech: val } } }
                                                });
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-zinc-500 block mb-1">Porcelain</label>
                                        <input type="number" className="w-full rounded border px-2 py-1 text-sm bg-zinc-50"
                                            value={assumptions.pricing.smileDesign.nonInvasive.porcelain}
                                            onChange={(e) => {
                                                const val = Number(e.target.value || 0);
                                                setAssumptions({
                                                    pricing: { ...assumptions.pricing, smileDesign: { ...assumptions.pricing.smileDesign, nonInvasive: { ...assumptions.pricing.smileDesign.nonInvasive, porcelain: val } } }
                                                });
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-zinc-500 block mb-1">Cubic Zirconia</label>
                                        <input type="number" className="w-full rounded border px-2 py-1 text-sm bg-zinc-50"
                                            value={assumptions.pricing.smileDesign.nonInvasive.cubicZirconia}
                                            onChange={(e) => {
                                                const val = Number(e.target.value || 0);
                                                setAssumptions({
                                                    pricing: { ...assumptions.pricing, smileDesign: { ...assumptions.pricing.smileDesign, nonInvasive: { ...assumptions.pricing.smileDesign.nonInvasive, cubicZirconia: val } } }
                                                });
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-zinc-100">
                                <p className="text-xs font-bold uppercase text-zinc-400 tracking-wider">Smile Design (Invasive)</p>
                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="text-[10px] text-zinc-500 block mb-1">Porcelain</label>
                                        <input type="number" className="w-full rounded border px-2 py-1 text-sm bg-zinc-50"
                                            value={assumptions.pricing.smileDesign.invasive.porcelain}
                                            onChange={(e) => {
                                                const val = Number(e.target.value || 0);
                                                setAssumptions({
                                                    pricing: { ...assumptions.pricing, smileDesign: { ...assumptions.pricing.smileDesign, invasive: { ...assumptions.pricing.smileDesign.invasive, porcelain: val } } }
                                                });
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-zinc-500 block mb-1">Pure Porcelain</label>
                                        <input type="number" className="w-full rounded border px-2 py-1 text-sm bg-zinc-50"
                                            value={assumptions.pricing.smileDesign.invasive.porcelainPure}
                                            onChange={(e) => {
                                                const val = Number(e.target.value || 0);
                                                setAssumptions({
                                                    pricing: { ...assumptions.pricing, smileDesign: { ...assumptions.pricing.smileDesign, invasive: { ...assumptions.pricing.smileDesign.invasive, porcelainPure: val } } }
                                                });
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-zinc-500 block mb-1">Cubic Zirconia</label>
                                        <input type="number" className="w-full rounded border px-2 py-1 text-sm bg-zinc-50"
                                            value={assumptions.pricing.smileDesign.invasive.cubicZirconia}
                                            onChange={(e) => {
                                                const val = Number(e.target.value || 0);
                                                setAssumptions({
                                                    pricing: { ...assumptions.pricing, smileDesign: { ...assumptions.pricing.smileDesign, invasive: { ...assumptions.pricing.smileDesign.invasive, cubicZirconia: val } } }
                                                });
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-zinc-100">
                                <p className="text-xs font-bold uppercase text-zinc-400 tracking-wider">Other Treatments</p>
                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="text-[10px] text-zinc-500 block mb-1">Implant (Mode)</label>
                                        <input type="number" className="w-full rounded border px-2 py-1 text-sm bg-zinc-50"
                                            value={assumptions.pricing.implants.mode}
                                            onChange={(e) => setAssumptions({ pricing: { ...assumptions.pricing, implants: { ...assumptions.pricing.implants, mode: Number(e.target.value || 0) } } })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-zinc-500 block mb-1">All-in-4 (1 Arc)</label>
                                        <input type="number" className="w-full rounded border px-2 py-1 text-sm bg-zinc-50"
                                            value={assumptions.pricing.allIn4.oneArc}
                                            onChange={(e) => setAssumptions({ pricing: { ...assumptions.pricing, allIn4: { ...assumptions.pricing.allIn4, oneArc: Number(e.target.value || 0) } } })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-zinc-500 block mb-1">All-in-4 (2 Arcs)</label>
                                        <input type="number" className="w-full rounded border px-2 py-1 text-sm bg-zinc-50"
                                            value={assumptions.pricing.allIn4.twoArcs}
                                            onChange={(e) => setAssumptions({ pricing: { ...assumptions.pricing, allIn4: { ...assumptions.pricing.allIn4, twoArcs: Number(e.target.value || 0) } } })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Financing Terms</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <Slider
                                label="Booking Deposit ($)"
                                valueDisplay={`$${assumptions.financing.bookingDeposit.toLocaleString()}`}
                                min={0} max={5000} step={100}
                                value={assumptions.financing.bookingDeposit}
                                onChange={(e) => setAssumptions({ financing: { ...assumptions.financing, bookingDeposit: Number(e.target.value) } })}
                            />
                            <Slider
                                label="Downpayment (%)"
                                valueDisplay={`${Math.round(assumptions.financing.downpaymentPct * 100)}%`}
                                min={20} max={80} step={1}
                                value={Math.round(assumptions.financing.downpaymentPct * 100)}
                                onChange={(e) => setAssumptions({ financing: { ...assumptions.financing, downpaymentPct: Number(e.target.value) / 100 } })}
                            />
                            <Slider
                                label="Term Length (Months)"
                                valueDisplay={`${assumptions.financing.monthsToPay} mo`}
                                min={3} max={24} step={3}
                                value={assumptions.financing.monthsToPay}
                                onChange={(e) => {
                                    const months = Number(e.target.value) as any;
                                    setAssumptions({
                                        financing: {
                                            ...assumptions.financing,
                                            monthsToPay: months,
                                            termMonthsMix: [{ months, weight: 1 }]
                                        }
                                    });
                                }}
                            />
                            <Slider
                                label="Provider Fee (%)"
                                valueDisplay={`${(assumptions.financing.providerFeePct * 100).toFixed(1)}%`}
                                min={0} max={100} step={0.1}
                                value={assumptions.financing.providerFeePct * 100}
                                onChange={(e) => setAssumptions({ financing: { ...assumptions.financing, providerFeePct: Number(e.target.value) / 100 } })}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <CardTitle>Loan Management</CardTitle>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={assumptions.loan?.enabled || false}
                                    onChange={(e) => setAssumptions({
                                        loan: { ...assumptions.loan!, enabled: e.target.checked }
                                    })}
                                    className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                                />
                                <span className="text-sm font-medium text-zinc-600">Take Loan</span>
                            </label>
                        </CardHeader>
                        <CardContent className={cn("space-y-6 transition-opacity", !assumptions.loan?.enabled && "opacity-50 pointer-events-none")}>
                            <Slider
                                label="Loan Principal ($)"
                                valueDisplay={`$${(assumptions.loan?.principal || 0).toLocaleString()}`}
                                min={0} max={100000} step={1000}
                                value={assumptions.loan?.principal || 0}
                                onChange={(e) => setAssumptions({
                                    loan: { ...assumptions.loan!, principal: Number(e.target.value) }
                                })}
                            />
                            <Slider
                                label="Interest Rate (%)"
                                valueDisplay={`${((assumptions.loan?.interestRate || 0) * 100).toFixed(1)}%`}
                                min={0} max={30} step={0.5}
                                value={(assumptions.loan?.interestRate || 0) * 100}
                                onChange={(e) => setAssumptions({
                                    loan: { ...assumptions.loan!, interestRate: Number(e.target.value) / 100 }
                                })}
                            />
                            <Slider
                                label="Term Length (Months)"
                                valueDisplay={`${assumptions.loan?.termMonths || 0} mo`}
                                min={3} max={60} step={3}
                                value={assumptions.loan?.termMonths || 0}
                                onChange={(e) => setAssumptions({
                                    loan: { ...assumptions.loan!, termMonths: Number(e.target.value) }
                                })}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Cost Controls */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Material Costs (COGS) ($)</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <p className="text-xs font-bold uppercase text-zinc-400 tracking-wider">Smile Design (Non-Invasive)</p>
                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="text-[10px] text-zinc-500 block mb-1">Nanotech</label>
                                        <input type="number" className="w-full rounded border px-2 py-1 text-sm bg-zinc-50"
                                            value={assumptions.variableCosts.perService.smileNonInvasive.nanotech}
                                            onChange={(e) => setAssumptions({ variableCosts: { ...assumptions.variableCosts, perService: { ...assumptions.variableCosts.perService, smileNonInvasive: { ...assumptions.variableCosts.perService.smileNonInvasive, nanotech: Number(e.target.value || 0) } } } })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-zinc-500 block mb-1">Porcelain</label>
                                        <input type="number" className="w-full rounded border px-2 py-1 text-sm bg-zinc-50"
                                            value={assumptions.variableCosts.perService.smileNonInvasive.porcelain}
                                            onChange={(e) => setAssumptions({ variableCosts: { ...assumptions.variableCosts, perService: { ...assumptions.variableCosts.perService, smileNonInvasive: { ...assumptions.variableCosts.perService.smileNonInvasive, porcelain: Number(e.target.value || 0) } } } })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-zinc-500 block mb-1">Cubic Zirconia</label>
                                        <input type="number" className="w-full rounded border px-2 py-1 text-sm bg-zinc-50"
                                            value={assumptions.variableCosts.perService.smileNonInvasive.cubicZirconia}
                                            onChange={(e) => setAssumptions({ variableCosts: { ...assumptions.variableCosts, perService: { ...assumptions.variableCosts.perService, smileNonInvasive: { ...assumptions.variableCosts.perService.smileNonInvasive, cubicZirconia: Number(e.target.value || 0) } } } })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-zinc-100">
                                <p className="text-xs font-bold uppercase text-zinc-400 tracking-wider">Smile Design (Invasive)</p>
                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="text-[10px] text-zinc-500 block mb-1">Porcelain</label>
                                        <input type="number" className="w-full rounded border px-2 py-1 text-sm bg-zinc-50"
                                            value={assumptions.variableCosts.perService.smileInvasive.porcelain}
                                            onChange={(e) => setAssumptions({ variableCosts: { ...assumptions.variableCosts, perService: { ...assumptions.variableCosts.perService, smileInvasive: { ...assumptions.variableCosts.perService.smileInvasive, porcelain: Number(e.target.value || 0) } } } })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-zinc-500 block mb-1">Pure Porcelain</label>
                                        <input type="number" className="w-full rounded border px-2 py-1 text-sm bg-zinc-50"
                                            value={assumptions.variableCosts.perService.smileInvasive.porcelainPure}
                                            onChange={(e) => setAssumptions({ variableCosts: { ...assumptions.variableCosts, perService: { ...assumptions.variableCosts.perService, smileInvasive: { ...assumptions.variableCosts.perService.smileInvasive, porcelainPure: Number(e.target.value || 0) } } } })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-zinc-500 block mb-1">Cubic Zirconia</label>
                                        <input type="number" className="w-full rounded border px-2 py-1 text-sm bg-zinc-50"
                                            value={assumptions.variableCosts.perService.smileInvasive.cubicZirconia}
                                            onChange={(e) => setAssumptions({ variableCosts: { ...assumptions.variableCosts, perService: { ...assumptions.variableCosts.perService, smileInvasive: { ...assumptions.variableCosts.perService.smileInvasive, cubicZirconia: Number(e.target.value || 0) } } } })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-zinc-100">
                                <p className="text-xs font-bold uppercase text-zinc-400 tracking-wider">Other Treatments</p>
                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="text-[10px] text-zinc-500 block mb-1">Implant (Each)</label>
                                        <input type="number" className="w-full rounded border px-2 py-1 text-sm bg-zinc-50"
                                            value={assumptions.variableCosts.perService.implants.perImplant}
                                            onChange={(e) => setAssumptions({ variableCosts: { ...assumptions.variableCosts, perService: { ...assumptions.variableCosts.perService, implants: { perImplant: Number(e.target.value || 0) } } } })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-zinc-500 block mb-1">All-in-4 (1 Arc)</label>
                                        <input type="number" className="w-full rounded border px-2 py-1 text-sm bg-zinc-50"
                                            value={assumptions.variableCosts.perService.allIn4.oneArc}
                                            onChange={(e) => setAssumptions({ variableCosts: { ...assumptions.variableCosts, perService: { ...assumptions.variableCosts.perService, allIn4: { ...assumptions.variableCosts.perService.allIn4, oneArc: Number(e.target.value || 0) } } } })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-zinc-500 block mb-1">All-in-4 (2 Arcs)</label>
                                        <input type="number" className="w-full rounded border px-2 py-1 text-sm bg-zinc-50"
                                            value={assumptions.variableCosts.perService.allIn4.twoArcs}
                                            onChange={(e) => setAssumptions({ variableCosts: { ...assumptions.variableCosts, perService: { ...assumptions.variableCosts.perService, allIn4: { ...assumptions.variableCosts.perService.allIn4, twoArcs: Number(e.target.value || 0) } } } })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Fixed Costs</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {assumptions.fixedCosts.items.map((it, idx) => (
                                <div key={it.id} className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        className="w-full rounded border px-2 py-1 text-sm bg-zinc-50"
                                        value={it.name}
                                        placeholder="Expense Name"
                                        onChange={(e) => {
                                            const items = assumptions.fixedCosts.items.slice();
                                            items[idx] = { ...items[idx], name: e.target.value };
                                            setAssumptions({ fixedCosts: { items } });
                                        }}
                                    />
                                    <input
                                        type="number"
                                        className="w-32 rounded border px-2 py-1 text-sm text-right"
                                        value={it.amountPerMonth}
                                        onChange={(e) => {
                                            const items = assumptions.fixedCosts.items.slice();
                                            items[idx] = { ...items[idx], amountPerMonth: Number(e.target.value || 0) };
                                            setAssumptions({ fixedCosts: { items } });
                                        }}
                                    />
                                    <button
                                        className="text-zinc-400 hover:text-red-500"
                                        onClick={() => {
                                            const items = assumptions.fixedCosts.items.filter((_, i) => i !== idx);
                                            setAssumptions({ fixedCosts: { items } });
                                        }}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                            <button
                                className="w-full py-2 text-sm text-zinc-500 border border-dashed rounded hover:bg-zinc-50"
                                onClick={() => {
                                    const items = assumptions.fixedCosts.items.concat({ id: `item-${Date.now()}`, name: "", amountPerMonth: 0 });
                                    setAssumptions({ fixedCosts: { items } });
                                }}
                            >
                                + Add Fixed Cost
                            </button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Variable Costs</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-medium text-zinc-500">Hotel ($/night)</label>
                                    <input type="number" className="mt-1 w-full rounded border px-2 py-1"
                                        value={assumptions.variableCosts.perClient?.hotelNight ?? 0}
                                        onChange={(e) => setAssumptions({ variableCosts: { ...assumptions.variableCosts, perClient: { ...(assumptions.variableCosts.perClient || {}), hotelNight: Number(e.target.value || 0) } } })}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-zinc-500">Food ($/day)</label>
                                    <input type="number" className="mt-1 w-full rounded border px-2 py-1"
                                        value={assumptions.variableCosts.perClient?.foodDay ?? 0}
                                        onChange={(e) => setAssumptions({ variableCosts: { ...assumptions.variableCosts, perClient: { ...(assumptions.variableCosts.perClient || {}), foodDay: Number(e.target.value || 0) } } })}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Starting Liquidity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Slider
                                label="Starting Cash ($)"
                                valueDisplay={`$${(assumptions.startingCash || 0).toLocaleString()}`}
                                min={0} max={100000} step={100}
                                value={assumptions.startingCash || 0}
                                onChange={(e) => setAssumptions({ startingCash: Number(e.target.value) })}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Monthly Breakdown: Spans both columns */}
                <SimulationTable />
            </div>
        </div>
    );
}
