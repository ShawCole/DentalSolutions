"use client";
import { useSimStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useMemo, useState } from "react";
import clsx from "clsx";
import type { Campaign, UnifiedAdFunnel } from "@dentalsolutions/core";
import { db } from "@/lib/firebase";
import { collection, query, onSnapshot, orderBy, limit, Timestamp } from "firebase/firestore";
import { useEffect } from "react";

export function MarketingTab() {
    const { assumptions, setAssumptions } = useSimStore();
    const [activeCampaignId, setActiveCampaignId] = useState(assumptions.funnel.campaigns[0]?.id || "");
    const [recentLeads, setRecentLeads] = useState<any[]>([]);
    const [isLoadingLeads, setIsLoadingLeads] = useState(true);

    useEffect(() => {
        const firestore = db();
        if (!firestore) {
            setIsLoadingLeads(false);
            return;
        }

        const q = query(collection(firestore, "leads"), orderBy("createdAt", "desc"), limit(100));
        const unsubscribe = onSnapshot(q,
            (snapshot) => {
                const leads = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setRecentLeads(leads);
                setIsLoadingLeads(false);
            },
            (error) => {
                console.error("Error fetching live leads:", error);
                setIsLoadingLeads(false);
            }
        );
        return () => unsubscribe();
    }, []);

    const actualLeads30d = useMemo(() => {
        const now = Date.now();
        const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);
        return recentLeads.filter(l => {
            const createdAt = (l.createdAt as Timestamp)?.toMillis() || 0;
            return createdAt > thirtyDaysAgo;
        });
    }, [recentLeads]);

    const activeCampaign = assumptions.funnel.campaigns.find(c => c.id === activeCampaignId) || assumptions.funnel.campaigns[0];

    // Calculate funnel metrics
    const funnelMetrics = useMemo(() => {
        if (!activeCampaign) return null;
        const f = activeCampaign.funnel;
        const impressions = (f.adSpend / Math.max(1, f.cpm)) * 1000;
        const adClicks = impressions * (f.clickToFormRatePct / 100);
        const formsStarted = adClicks; // Same as clicks - form opens on click
        const formsCompleted = formsStarted * (f.formCompletionRatePct / 100);
        const contactsSubmitted = formsCompleted * (f.contactSubmitRatePct / 100);

        // Exit path split
        const toMessaging = contactsSubmitted * (f.exitPathSplit.messagingPct / 100);
        const toLandingPage = contactsSubmitted * (f.exitPathSplit.landingPagePct / 100);

        // Quality-adjusted leads
        const messagingLeads = toMessaging * (f.messageResponseRatePct / 100);
        const landingPageLeads = toLandingPage * (f.landingPageConversionPct / 100);
        const totalQualifiedLeads = messagingLeads + landingPageLeads;

        return {
            impressions,
            adClicks,
            formsCompleted,
            contactsSubmitted,
            toMessaging,
            toLandingPage,
            messagingLeads,
            landingPageLeads,
            totalQualifiedLeads,
        };
    }, [activeCampaign]);

    const savedCampaigns = assumptions.funnel.savedCampaigns;

    const aggregateSavedMetrics = useMemo(() => {
        let grandTotalLeads = 0;
        let grandTotalSpend = 0;
        let grandMessagingLeads = 0;
        let grandLandingLeads = 0;

        // Sum up the monthly capacity of all saved campaigns (Steady State)
        savedCampaigns.forEach(c => {
            const f = c.funnel;
            const impressions = (f.adSpend / Math.max(1, f.cpm)) * 1000;
            const clicks = impressions * (f.clickToFormRatePct / 100);
            const completed = clicks * (f.formCompletionRatePct / 100);
            const submitted = completed * (f.contactSubmitRatePct / 100);

            const toMsg = submitted * (f.exitPathSplit.messagingPct / 100) * (f.messageResponseRatePct / 100);
            const toLand = submitted * (f.exitPathSplit.landingPagePct / 100) * (f.landingPageConversionPct / 100);

            grandTotalLeads += toMsg + toLand;
            grandTotalSpend += f.adSpend;
            grandMessagingLeads += toMsg;
            grandLandingLeads += toLand;
        });

        return {
            totalLeads: grandTotalLeads,
            totalSpend: grandTotalSpend,
            messagingLeads: grandMessagingLeads,
            landingLeads: grandLandingLeads
        };
    }, [savedCampaigns]);

    const updateCampaign = (id: string, updates: Partial<Campaign>) => {
        // 1. Update Template
        const newCampaigns = assumptions.funnel.campaigns.map(c =>
            c.id === id ? { ...c, ...updates } : c
        );

        // 2. Auto-Sync to Simulation (Saved Campaigns)
        // Match exact ID OR ID-timestamp pattern
        const newSaved = assumptions.funnel.savedCampaigns.map(c =>
            (c.id === id || c.id.startsWith(`${id}-`)) ? { ...c, ...updates } : c
        );

        setAssumptions({ funnel: { ...assumptions.funnel, campaigns: newCampaigns, savedCampaigns: newSaved } });
    };

    const updateFunnel = (id: string, funnelUpdates: Partial<UnifiedAdFunnel>) => {
        const campaign = assumptions.funnel.campaigns.find(c => c.id === id);
        if (!campaign) return;
        updateCampaign(id, {
            funnel: { ...campaign.funnel, ...funnelUpdates }
        });
    };

    const updateExitSplit = (id: string, messagingPct: number) => {
        const campaign = assumptions.funnel.campaigns.find(c => c.id === id);
        if (!campaign) return;
        updateCampaign(id, {
            funnel: {
                ...campaign.funnel,
                exitPathSplit: {
                    messagingPct,
                    landingPagePct: 100 - messagingPct,
                }
            }
        });
    };

    const saveActiveCampaign = () => {
        if (!activeCampaign) return;
        const campaignToSave = {
            ...activeCampaign,
            timestamp: Date.now(),
            id: `${activeCampaign.id}-${Date.now()}`
        };
        const newSaved = [...assumptions.funnel.savedCampaigns, campaignToSave];
        setAssumptions({ funnel: { ...assumptions.funnel, savedCampaigns: newSaved } });
    };

    const deleteSavedCampaign = (timestamp: number) => {
        const newSaved = assumptions.funnel.savedCampaigns.filter(c => c.timestamp !== timestamp);
        setAssumptions({ funnel: { ...assumptions.funnel, savedCampaigns: newSaved } });
    };

    if (!activeCampaign) return <div className="p-8 text-center text-zinc-500">No campaigns defined.</div>;

    return (
        <div className="space-y-6">
            {/* Campaign Selector Dropdown */}
            <div className="flex items-center gap-3 mb-2">
                <label className="text-sm font-medium text-zinc-600">Campaign:</label>
                <select
                    value={activeCampaignId}
                    onChange={(e) => setActiveCampaignId(e.target.value)}
                    className="flex-1 max-w-xs px-3 py-2 rounded-lg border border-zinc-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                >
                    {assumptions.funnel.campaigns.map(camp => (
                        <option key={camp.id} value={camp.id}>
                            {camp.name} ({camp.region})
                        </option>
                    ))}
                </select>
            </div>

            {/* Unified Funnel Card */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-semibold">Ad Funnel: {activeCampaign.name}</CardTitle>
                    <button
                        onClick={saveActiveCampaign}
                        className="bg-zinc-900 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors"
                    >
                        Save to Simulation
                    </button>
                </CardHeader>
                <CardContent className="space-y-8">
                    {/* Scheduling Section */}
                    <div className="grid grid-cols-2 gap-4 bg-zinc-50 border border-zinc-100 rounded-lg p-4 mb-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-600">Start Month</label>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-zinc-400">Month</span>
                                <input
                                    type="number" min={0} max={23}
                                    value={activeCampaign.startMonthIdx}
                                    onChange={(e) => updateCampaign(activeCampaign.id, { startMonthIdx: Number(e.target.value) })}
                                    className="w-20 px-2 py-1 rounded border border-zinc-200 text-sm"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-600">Duration (Months)</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number" min={1} max={24}
                                    value={activeCampaign.durationMonths || ""}
                                    placeholder="Permanent"
                                    onChange={(e) => updateCampaign(activeCampaign.id, { durationMonths: e.target.value ? Number(e.target.value) : null })}
                                    className="w-20 px-2 py-1 rounded border border-zinc-200 text-sm"
                                />
                                <span className="text-xs text-zinc-400">months</span>
                            </div>
                        </div>
                    </div>

                    {/* Stage 1: Ad Spend, CPM, and Frequency */}
                    <div className="space-y-4">
                        <Slider
                            label="Ad Spend ($/month)"
                            valueDisplay={`$${activeCampaign.funnel.adSpend.toLocaleString()}`}
                            min={0} max={50000} step={100}
                            value={activeCampaign.funnel.adSpend}
                            onChange={(e) => updateFunnel(activeCampaign.id, { adSpend: Number(e.target.value) })}
                        />
                        <Slider
                            label="CPM (Cost per 1k impressions)"
                            valueDisplay={`$${activeCampaign.funnel.cpm}`}
                            min={5} max={50} step={1}
                            value={activeCampaign.funnel.cpm}
                            onChange={(e) => updateFunnel(activeCampaign.id, { cpm: Number(e.target.value) })}
                        />
                        <Slider
                            label="Impressions-to-Reach Ratio (Frequency)"
                            valueDisplay={`${activeCampaign.funnel.impressionsToReachRatio.toFixed(1)}x → ${Math.round((funnelMetrics?.impressions || 0) / activeCampaign.funnel.impressionsToReachRatio).toLocaleString()} unique people, ${Math.round(funnelMetrics?.impressions || 0).toLocaleString()} impressions`}
                            min={1.0} max={5.0} step={0.1}
                            value={activeCampaign.funnel.impressionsToReachRatio}
                            onChange={(e) => updateFunnel(activeCampaign.id, { impressionsToReachRatio: Number(e.target.value) })}
                        />
                    </div>

                    {/* Funnel Visualization */}
                    <div className="bg-gradient-to-b from-zinc-50 to-zinc-100 rounded-xl p-6">
                        <h4 className="text-sm font-semibold text-zinc-700 mb-4 text-center">Lead Form Funnel</h4>

                        {/* Stage 2: Click to Form */}
                        <div className="space-y-4">
                            <Slider
                                label="Click-to-Form Rate"
                                valueDisplay={`${activeCampaign.funnel.clickToFormRatePct}% → ${Math.round(funnelMetrics?.adClicks || 0).toLocaleString()} form opens`}
                                min={0.5} max={15} step={0.5}
                                value={activeCampaign.funnel.clickToFormRatePct}
                                onChange={(e) => updateFunnel(activeCampaign.id, { clickToFormRatePct: Number(e.target.value) })}
                            />

                            {/* Stage 3: Form Completion */}
                            <Slider
                                label="Form Completion Rate"
                                valueDisplay={`${activeCampaign.funnel.formCompletionRatePct}% → ${Math.round(funnelMetrics?.formsCompleted || 0).toLocaleString()} completed`}
                                min={20} max={95} step={5}
                                value={activeCampaign.funnel.formCompletionRatePct}
                                onChange={(e) => updateFunnel(activeCampaign.id, { formCompletionRatePct: Number(e.target.value) })}
                            />

                            {/* Stage 4: Contact Submit */}
                            <Slider
                                label="Contact Confirmation Rate"
                                valueDisplay={`${activeCampaign.funnel.contactSubmitRatePct}% → ${Math.round(funnelMetrics?.contactsSubmitted || 0).toLocaleString()} contacts`}
                                min={50} max={100} step={5}
                                value={activeCampaign.funnel.contactSubmitRatePct}
                                onChange={(e) => updateFunnel(activeCampaign.id, { contactSubmitRatePct: Number(e.target.value) })}
                            />
                        </div>
                    </div>

                    {/* Exit Path Split */}
                    <div className="bg-white border border-zinc-200 rounded-xl p-6">
                        <h4 className="text-sm font-semibold text-zinc-700 mb-4">Exit Path Choice</h4>
                        <p className="text-xs text-zinc-500 mb-4">
                            After submitting contact info, users choose their next step:
                        </p>

                        <Slider
                            label="Messaging vs Landing Page Split"
                            valueDisplay={`${activeCampaign.funnel.exitPathSplit.messagingPct}% WhatsApp / ${activeCampaign.funnel.exitPathSplit.landingPagePct}% Landing`}
                            min={0} max={100} step={5}
                            value={activeCampaign.funnel.exitPathSplit.landingPagePct}
                            onChange={(e) => updateExitSplit(activeCampaign.id, 100 - Number(e.target.value))}
                        />

                        <div className="grid grid-cols-2 gap-4 mt-6">
                            {/* Messaging Path */}
                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-lg">💬</span>
                                    <span className="font-medium text-purple-900">WhatsApp Path</span>
                                </div>
                                <div className="text-2xl font-bold text-purple-700 mb-2">
                                    {Math.round(funnelMetrics?.toMessaging || 0).toLocaleString()}
                                </div>
                                <Slider
                                    label="Response Rate"
                                    valueDisplay={`${activeCampaign.funnel.messageResponseRatePct}% → ${Math.round(funnelMetrics?.messagingLeads || 0)} leads`}
                                    min={10} max={80} step={5}
                                    value={activeCampaign.funnel.messageResponseRatePct}
                                    onChange={(e) => updateFunnel(activeCampaign.id, { messageResponseRatePct: Number(e.target.value) })}
                                />
                            </div>

                            {/* Landing Page Path */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-lg">🌐</span>
                                    <span className="font-medium text-blue-900">Landing Page Path</span>
                                </div>
                                <div className="text-2xl font-bold text-blue-700 mb-2">
                                    {Math.round(funnelMetrics?.toLandingPage || 0).toLocaleString()}
                                </div>
                                <Slider
                                    label="Conversion Rate"
                                    valueDisplay={`${activeCampaign.funnel.landingPageConversionPct}% → ${Math.round(funnelMetrics?.landingPageLeads || 0)} leads`}
                                    min={5} max={50} step={5}
                                    value={activeCampaign.funnel.landingPageConversionPct}
                                    onChange={(e) => updateFunnel(activeCampaign.id, { landingPageConversionPct: Number(e.target.value) })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Total Qualified Leads */}
                    <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                        <p className="text-sm text-green-700 font-medium mb-1">Total Qualified Leads (Monthly)</p>
                        <p className="text-4xl font-bold text-green-800">
                            {Math.round(funnelMetrics?.totalQualifiedLeads || 0).toLocaleString()}
                        </p>
                        <p className="text-xs text-green-600 mt-2">
                            Cost per Lead: ${funnelMetrics?.totalQualifiedLeads ? Math.round(activeCampaign.funnel.adSpend / funnelMetrics.totalQualifiedLeads) : 0}
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Saved Campaigns Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Saved Campaigns for Simulation</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead>
                                <tr className="border-b border-zinc-100 text-zinc-500 font-medium">
                                    <th className="py-3 px-2">Campaign</th>
                                    <th className="py-3 px-2 text-center">Schedule</th>
                                    <th className="py-3 px-2 text-right">Ad Spend</th>
                                    <th className="py-3 px-2 text-right">Msg Leads</th>
                                    <th className="py-3 px-2 text-right">Landing Leads</th>
                                    <th className="py-3 px-2 text-right">Total Leads</th>
                                    <th className="py-3 px-2 text-right">CPL</th>
                                    <th className="py-3 px-2 text-center w-10"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {savedCampaigns.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-8 text-center text-zinc-400 italic">
                                            No campaigns saved yet. Configure above and click "Save to Simulation".
                                        </td>
                                    </tr>
                                ) : (
                                    savedCampaigns.map((c, idx) => {
                                        const f = c.funnel;
                                        const imp = (f.adSpend / Math.max(1, f.cpm)) * 1000;
                                        const clicks = imp * (f.clickToFormRatePct / 100);
                                        const completed = clicks * (f.formCompletionRatePct / 100);
                                        const submitted = completed * (f.contactSubmitRatePct / 100);
                                        const msgLeads = submitted * (f.exitPathSplit.messagingPct / 100) * (f.messageResponseRatePct / 100);
                                        const landLeads = submitted * (f.exitPathSplit.landingPagePct / 100) * (f.landingPageConversionPct / 100);
                                        const total = msgLeads + landLeads;
                                        const cpl = total > 0 ? f.adSpend / total : 0;

                                        // Count how many campaigns with the same base name exist before this one
                                        const sameName = savedCampaigns.filter((sc, i) => i <= idx && sc.name === c.name);
                                        const displayName = sameName.length > 1 ? `${c.name} #${sameName.length}` : c.name;

                                        return (
                                            <tr key={c.timestamp} className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors">
                                                <td className="py-3 px-2">
                                                    <div className="font-medium">{displayName}</div>
                                                    <div className="text-[10px] text-zinc-400 uppercase tracking-tighter">{c.region}</div>
                                                </td>
                                                <td className="py-3 px-2 text-center">
                                                    <div className="inline-block bg-blue-50 border border-blue-200 px-2 py-1 rounded text-xs font-medium text-blue-700">
                                                        {c.startMonthIdx === 0 && !c.durationMonths ? "Always Active" : `M${(c.startMonthIdx || 0) + 1}${c.durationMonths ? ` → M${(c.startMonthIdx || 0) + c.durationMonths}` : " onwards"}`}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-2 text-right font-mono">${f.adSpend.toLocaleString()}</td>
                                                <td className="py-3 px-2 text-right text-purple-600">{Math.round(msgLeads)}</td>
                                                <td className="py-3 px-2 text-right text-blue-600">{Math.round(landLeads)}</td>
                                                <td className="py-3 px-2 text-right font-bold text-green-700">{Math.round(total)}</td>
                                                <td className="py-3 px-2 text-right text-zinc-500">${Math.round(cpl)}</td>
                                                <td className="py-3 px-2 text-center">
                                                    <button
                                                        onClick={() => deleteSavedCampaign(c.timestamp)}
                                                        className="text-zinc-400 hover:text-red-500 transition-colors"
                                                    >
                                                        ✕
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Live Performance vs Simulation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-zinc-900 text-white">
                    <CardHeader>
                        <CardTitle className="text-zinc-400 text-xs uppercase tracking-widest">Simulated Performance</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between pb-6">
                        <div>
                            <h3 className="text-3xl font-bold">
                                {Math.round(aggregateSavedMetrics.totalLeads).toLocaleString()} <span className="text-lg font-normal text-zinc-500">leads/mo</span>
                            </h3>
                            <p className="text-zinc-500 text-xs mt-1 italic font-light">Total Monthly Capacity (Steady State)</p>
                        </div>
                        <div className="text-right space-y-1">
                            <p className="text-purple-400 text-xs">💬 Messaging: {Math.round(aggregateSavedMetrics.messagingLeads).toLocaleString()}</p>
                            <p className="text-blue-400 text-xs">🌐 Landing: {Math.round(aggregateSavedMetrics.landingLeads).toLocaleString()}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className={clsx(
                    "border-2 transition-all duration-500",
                    actualLeads30d.length >= aggregateSavedMetrics.totalLeads ? "border-green-500/50 bg-green-50/5" : "border-zinc-200 bg-white"
                )}>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-zinc-500 text-xs uppercase tracking-widest">Actual Lead Flow (Last 30d)</CardTitle>
                        {actualLeads30d.length > 0 && (
                            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        )}
                    </CardHeader>
                    <CardContent className="flex items-center justify-between pb-6">
                        <div>
                            {isLoadingLeads ? (
                                <div className="h-9 w-24 bg-zinc-100 animate-pulse rounded" />
                            ) : (
                                <h3 className="text-3xl font-bold text-zinc-900">
                                    {actualLeads30d.length.toLocaleString()} <span className="text-lg font-normal text-zinc-400">leads</span>
                                </h3>
                            )}
                            <p className="text-zinc-400 text-xs mt-1 font-light">Via GHL Webhooks</p>
                        </div>
                        <div className="text-right">
                            {actualLeads30d.length > 0 ? (
                                <div className={clsx(
                                    "text-sm font-bold px-2 py-1 rounded",
                                    actualLeads30d.length >= aggregateSavedMetrics.totalLeads ? "text-green-600 bg-green-50" : "text-amber-600 bg-amber-50"
                                )}>
                                    {Math.round((actualLeads30d.length / (aggregateSavedMetrics.totalLeads || 1)) * 100)}% of Target
                                </div>
                            ) : (
                                <p className="text-zinc-400 text-xs italic">Waiting for data...</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Leads Feed */}
            {actualLeads30d.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-semibold">Live Traffic Feed</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                            {actualLeads30d.map((lead) => (
                                <div key={lead.id} className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 border border-zinc-100 hover:bg-zinc-100 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-[10px] font-bold">
                                            {lead.firstName[0]}{lead.lastName[0]}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-zinc-900">{lead.firstName} {lead.lastName}</p>
                                            <p className="text-[10px] text-zinc-500 font-mono">{lead.source}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex gap-1 justify-end">
                                            {lead.tags.slice(0, 2).map((tag: string) => (
                                                <span key={tag} className="text-[8px] bg-white border border-zinc-200 px-1.5 py-0.5 rounded text-zinc-400 uppercase font-black tracking-tighter">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <p className="text-[9px] text-zinc-400 mt-1">{(lead.createdAt as Timestamp)?.toDate().toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
