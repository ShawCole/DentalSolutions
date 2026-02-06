"use client";
import { useSimStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useMemo } from "react";

export function ProceduresTab() {
    const { assumptions, setAssumptions } = useSimStore();

    // 1. Calculate total arrivals (Linear Pipeline: Total Leads -> Global Sales Rates)
    const totalArrivals = useMemo(() => {
        let totalLeads = 0;
        const simMonths = assumptions.capacity.months || 12;

        for (let m = 0; m < simMonths; m++) {
            let monthlyLeads = 0;
            assumptions.funnel.savedCampaigns.forEach(c => {
                const start = c.startMonthIdx || 0;
                const dur = c.durationMonths;
                const isActive = m >= start && (dur === null || m < start + dur);

                if (isActive) {
                    const f = c.funnel;
                    const imp = (f.adSpend / Math.max(1, f.cpm)) * 1000;
                    const clicks = imp * (f.clickToFormRatePct / 100);
                    const completed = clicks * (f.formCompletionRatePct / 100);
                    const submitted = completed * (f.contactSubmitRatePct / 100);
                    const msgLeads = submitted * (f.exitPathSplit.messagingPct / 100) * (f.messageResponseRatePct / 100);
                    const landingPageLeads = submitted * (f.exitPathSplit.landingPagePct / 100) * (f.landingPageConversionPct / 100);
                    monthlyLeads += (msgLeads + landingPageLeads);
                }
            });
            totalLeads += monthlyLeads;
        }

        const avgLeads = totalLeads / simMonths;
        const s = assumptions.salesRates;
        const conversion =
            (s.receivedPicturesRatePct / 100) *
            (s.qualifiedRatePct / 100) *
            (s.bookedConsultRatePct / 100) *
            (s.showRatePct / 100) *
            (s.approvalRatePct / 100) *
            (s.flightBookedRatePct / 100) *
            (s.arrivalRatePct / 100);

        return Math.floor(avgLeads * conversion);
    }, [assumptions.funnel.savedCampaigns, assumptions.salesRates, assumptions.capacity.months]);

    // 2. Breakdown per procedure
    const metrics = useMemo(() => {
        const arrivals = totalArrivals;
        const smileShare = assumptions.mix.master.smile / 100;
        const implantsShare = assumptions.mix.master.implants / 100;
        const allIn4Share = assumptions.mix.master.allIn4 / 100;

        const niSplit = assumptions.mix.smileSplit.nonInvasive / 100;
        const smileTotal = arrivals * smileShare;

        return {
            smileNI: Math.round(smileTotal * niSplit),
            smileInvasive: Math.round(smileTotal * (1 - niSplit)),
            implants: Math.round(arrivals * implantsShare),
            allIn4: Math.round(arrivals * allIn4Share)
        };
    }, [totalArrivals, assumptions.mix]);

    return (
        <div className="grid gap-6">
            <div className="bg-zinc-900 text-white p-6 rounded-xl flex items-center justify-between">
                <div>
                    <p className="text-zinc-400 text-sm font-medium uppercase tracking-wider">Input: Monthly Arrivals</p>
                    <h3 className="text-4xl font-bold mt-1">
                        {totalArrivals.toLocaleString()} <span className="text-xl font-normal text-zinc-500">patients/mo</span>
                    </h3>
                </div>
                <div className="text-right">
                    <p className="text-zinc-500 text-xs">Derived from Global Sales pipeline</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Global Treatment Mix (%)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <Slider
                            label="Smile Design (%)"
                            valueDisplay={`${assumptions.mix.master.smile}%`}
                            min={0} max={100} step={1}
                            value={assumptions.mix.master.smile}
                            onChange={(e) => {
                                const smile = Number(e.target.value);
                                const implants = assumptions.mix.master.implants;
                                let allIn4 = Math.max(0, 100 - smile - implants);
                                setAssumptions({ mix: { ...assumptions.mix, master: { smile, implants, allIn4 } } });
                            }}
                        />
                        <Slider
                            label="Implants (%)"
                            valueDisplay={`${assumptions.mix.master.implants}%`}
                            min={0} max={100} step={1}
                            value={assumptions.mix.master.implants}
                            onChange={(e) => {
                                const implants = Number(e.target.value);
                                const smile = assumptions.mix.master.smile;
                                let allIn4 = Math.max(0, 100 - smile - implants);
                                setAssumptions({ mix: { ...assumptions.mix, master: { smile, implants, allIn4 } } });
                            }}
                        />
                        <Slider
                            label="All-in-4 (%)"
                            valueDisplay={`${assumptions.mix.master.allIn4}%`}
                            min={0} max={100} step={1}
                            value={assumptions.mix.master.allIn4}
                            onChange={(e) => {
                                const allIn4 = Number(e.target.value);
                                const others = 100 - allIn4;
                                const prevOthers = assumptions.mix.master.smile + assumptions.mix.master.implants || 1;
                                const smile = Math.round((assumptions.mix.master.smile / prevOthers) * others);
                                const implants = Math.max(0, others - smile);
                                setAssumptions({ mix: { ...assumptions.mix, master: { smile, implants, allIn4 } } });
                            }}
                        />
                        <div className="h-px bg-zinc-100 my-4" />
                        <Slider
                            label="Smile Non-Invasive Split (%)"
                            valueDisplay={`${assumptions.mix.smileSplit.nonInvasive}%`}
                            min={0} max={100} step={1}
                            value={assumptions.mix.smileSplit.nonInvasive}
                            onChange={(e) => setAssumptions({ mix: { ...assumptions.mix, smileSplit: { nonInvasive: Number(e.target.value), invasive: 100 - Number(e.target.value) } } })}
                        />
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <Card className="bg-zinc-50 border-none shadow-sm">
                            <CardContent className="p-6">
                                <p className="text-zinc-500 text-xs font-medium uppercase mb-1">Smile Design NI</p>
                                <p className="text-2xl font-bold">{metrics.smileNI}</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-zinc-50 border-none shadow-sm">
                            <CardContent className="p-6">
                                <p className="text-zinc-500 text-xs font-medium uppercase mb-1">Smile Design Invasive</p>
                                <p className="text-2xl font-bold">{metrics.smileInvasive}</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-zinc-50 border-none shadow-sm">
                            <CardContent className="p-6">
                                <p className="text-zinc-500 text-xs font-medium uppercase mb-1">Implants</p>
                                <p className="text-2xl font-bold">{metrics.implants}</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-zinc-50 border-none shadow-sm">
                            <CardContent className="p-6">
                                <p className="text-zinc-500 text-xs font-medium uppercase mb-1">All-in-4</p>
                                <p className="text-2xl font-bold">{metrics.allIn4}</p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="border-zinc-200">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm">Treatment Mix Shift</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 text-center">
                            {assumptions.mixSwitchMonthIdx === null ? (
                                <p className="text-xs text-zinc-400 italic py-4">
                                    Treatment mix remains constant throughout the simulation.
                                </p>
                            ) : (
                                <p className="text-xs text-zinc-900 font-medium py-4">
                                    Shift enabled.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
