"use client";
import { useSimStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useMemo } from "react";

export function SalesTab() {
    const { assumptions, setAssumptions } = useSimStore();

    const totalLeads = useMemo(() => {
        let totalVolumeOverSim = 0;
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
            totalVolumeOverSim += monthlyLeads;
        }
        return totalVolumeOverSim / simMonths;
    }, [assumptions.funnel.savedCampaigns, assumptions.capacity.months]);

    const metrics = useMemo(() => {
        const s = assumptions.salesRates;
        const hasPics = totalLeads * (s.receivedPicturesRatePct / 100);
        const qualified = hasPics * (s.qualifiedRatePct / 100);
        const consultations = qualified * (s.bookedConsultRatePct / 100);
        const attended = consultations * (s.showRatePct / 100);
        const approved = attended * (s.approvalRatePct / 100);
        const flights = approved * (s.flightBookedRatePct / 100);
        const arrivals = Math.floor(flights * (s.arrivalRatePct / 100));

        return { hasPics, qualified, consultations, attended, approved, flights, arrivals };
    }, [totalLeads, assumptions.salesRates]);

    const updateRate = (field: keyof typeof assumptions.salesRates, value: number) => {
        setAssumptions({
            salesRates: { ...assumptions.salesRates, [field]: value }
        });
    };

    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Card className="md:col-span-2">
                <CardHeader>
                    <CardTitle>Global Sales Funnel</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="bg-zinc-900 text-white p-4 rounded-lg flex items-center justify-between mb-4">
                        <div>
                            <p className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Total Simulation Leads</p>
                            <p className="text-2xl font-bold">{Math.round(totalLeads).toLocaleString()} <span className="text-sm font-normal text-zinc-500">leads/mo</span></p>
                        </div>
                        <div className="text-right text-zinc-400 text-[10px] uppercase font-bold tracking-widest">
                            Monthly Average
                        </div>
                    </div>

                    <Slider
                        label="Received Pictures"
                        valueDisplay={`${assumptions.salesRates.receivedPicturesRatePct}% (${Math.round(metrics.hasPics).toLocaleString()} Sent Pics)`}
                        min={0} max={100} step={1}
                        value={assumptions.salesRates.receivedPicturesRatePct}
                        onChange={(e) => updateRate('receivedPicturesRatePct', Number(e.target.value))}
                    />
                    <Slider
                        label="Qualified Rate"
                        valueDisplay={`${assumptions.salesRates.qualifiedRatePct}% (${Math.round(metrics.qualified).toLocaleString()} Qualified)`}
                        min={0} max={100} step={1}
                        value={assumptions.salesRates.qualifiedRatePct}
                        onChange={(e) => updateRate('qualifiedRatePct', Number(e.target.value))}
                    />
                    <Slider
                        label="Booked Consult Rate"
                        valueDisplay={`${assumptions.salesRates.bookedConsultRatePct}% (${Math.round(metrics.consultations).toLocaleString()} Consults)`}
                        min={0} max={100} step={1}
                        value={assumptions.salesRates.bookedConsultRatePct}
                        onChange={(e) => updateRate('bookedConsultRatePct', Number(e.target.value))}
                    />
                    <Slider
                        label="Show Rate"
                        valueDisplay={`${assumptions.salesRates.showRatePct}% (${Math.round(metrics.attended).toLocaleString()} Showed)`}
                        min={0} max={100} step={1}
                        value={assumptions.salesRates.showRatePct}
                        onChange={(e) => updateRate('showRatePct', Number(e.target.value))}
                    />
                    <Slider
                        label="Approval Rate"
                        valueDisplay={`${assumptions.salesRates.approvalRatePct}% (${Math.round(metrics.approved).toLocaleString()} Appr.)`}
                        min={0} max={100} step={1}
                        value={assumptions.salesRates.approvalRatePct}
                        onChange={(e) => updateRate('approvalRatePct', Number(e.target.value))}
                    />
                    <Slider
                        label="Arrival Rate"
                        valueDisplay={`${assumptions.salesRates.arrivalRatePct}% (${Math.round(metrics.arrivals).toLocaleString()} Arrivals)`}
                        min={0} max={100} step={1}
                        value={assumptions.salesRates.arrivalRatePct}
                        onChange={(e) => updateRate('arrivalRatePct', Number(e.target.value))}
                    />

                    <div className="bg-zinc-900 text-white p-6 rounded-lg flex items-center justify-between mt-8">
                        <div>
                            <p className="text-zinc-400 text-sm font-medium uppercase tracking-wider">Est. Monthly Arrivals</p>
                            <h3 className="text-3xl font-bold mt-1">
                                {metrics.arrivals.toLocaleString()} <span className="text-lg font-normal text-zinc-500">arrivals/mo</span>
                            </h3>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
