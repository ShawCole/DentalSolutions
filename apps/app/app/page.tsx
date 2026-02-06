"use client";
import { useEffect, useRef, useState } from "react";
import { useSimStore } from "@/lib/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MarketingTab } from "@/components/tabs/marketing-tab";
import { SalesTab } from "@/components/tabs/sales-tab";
import { OperationsTab } from "@/components/tabs/operations-tab";
import { FinancialsTab } from "@/components/tabs/financials-tab";
import { DashboardTab } from "@/components/tabs/dashboard-tab";
import { ClientLogTab } from "@/components/tabs/client-log-tab";
import { CalendarTab } from "@/components/tabs/calendar-tab";
import { LedgerTab } from "@/components/tabs/ledger-tab";
import { ProceduresTab } from "@/components/tabs/procedures-tab";

import { useAuth } from "@/lib/auth/AuthContext";
import { LoginForm } from "@/components/auth/LoginForm";

export default function Home() {
  const { user, profile, loading } = useAuth();
  const { assumptions, setAssumptions, runs, setRuns, setResult } = useSimStore();
  const [progress, setProgress] = useState<{ completed: number; total: number } | null>(null);
  const workerRef = useRef<Worker | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    const w = new Worker(new URL("../workers/simWorker.ts", import.meta.url));
    workerRef.current = w;
    w.onmessage = (e: MessageEvent) => {
      const msg = e.data;
      if (msg?.type === "progress") setProgress({ completed: msg.completed, total: msg.total });
      if (msg?.type === "done") {
        setResult(msg.result);
        setProgress(null);
        setActiveTab("dashboard"); // Switch to dashboard on completion
      }
    };
    return () => {
      w.terminate();
      workerRef.current = null;
    };
  }, [setResult]);

  const run = () => {
    if (!workerRef.current) return;
    setResult(null);
    setProgress({ completed: 0, total: runs });
    workerRef.current.postMessage({ type: "run", runs, assumptions });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-900 border-t-transparent"></div>
      </div>
    );
  }

  if (!user || profile?.role !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-zinc-900">Admin Access Required</h1>
            <p className="mt-2 text-sm text-zinc-500">Please sign in with an authorized account to access the simulator.</p>
          </div>
          <LoginForm />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-zinc-50 text-zinc-900 font-sans">
      <div className="sticky top-0 z-10 border-b bg-white/80 px-6 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight">DentalSolutions <span className="text-zinc-400 font-normal">Simulator</span></h1>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-zinc-500">Runs</span>
              <input
                type="number"
                value={runs}
                onChange={(e) => setRuns(Number(e.target.value))}
                className="w-16 rounded border px-2 py-1 text-sm text-right"
              />
            </div>
            <button
              onClick={run}
              disabled={!!progress}
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
            >
              {progress ? `Running (${Math.round((progress.completed / progress.total) * 100)}%)` : "Run Simulation"}
            </button>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <Tabs className="w-full">
          <div className="mb-8 flex justify-center">
            <TabsList className="grid w-full max-w-5xl grid-cols-9">
              <TabsTrigger active={activeTab === "dashboard"} onClick={() => setActiveTab("dashboard")}>Dashboard</TabsTrigger>
              <TabsTrigger active={activeTab === "marketing"} onClick={() => setActiveTab("marketing")}>Marketing</TabsTrigger>
              <TabsTrigger active={activeTab === "sales"} onClick={() => setActiveTab("sales")}>Sales</TabsTrigger>
              <TabsTrigger active={activeTab === "procedures"} onClick={() => setActiveTab("procedures")}>Procedures</TabsTrigger>
              <TabsTrigger active={activeTab === "operations"} onClick={() => setActiveTab("operations")}>Operations</TabsTrigger>
              <TabsTrigger active={activeTab === "financials"} onClick={() => setActiveTab("financials")}>Financials</TabsTrigger>
              <TabsTrigger active={activeTab === "calendar"} onClick={() => setActiveTab("calendar")}>Calendar</TabsTrigger>
              <TabsTrigger active={activeTab === "ledger"} onClick={() => setActiveTab("ledger")}>Ledger</TabsTrigger>
              <TabsTrigger active={activeTab === "log"} onClick={() => setActiveTab("log")}>Client Log</TabsTrigger>
            </TabsList>
          </div>

          <div className="min-h-[500px]">
            <TabsContent active={activeTab === "dashboard"}>
              <DashboardTab />
            </TabsContent>
            <TabsContent active={activeTab === "marketing"}>
              <MarketingTab />
            </TabsContent>
            <TabsContent active={activeTab === "sales"}>
              <SalesTab />
            </TabsContent>
            <TabsContent active={activeTab === "procedures"}>
              <ProceduresTab />
            </TabsContent>
            <TabsContent active={activeTab === "operations"}>
              <OperationsTab />
            </TabsContent>
            <TabsContent active={activeTab === "financials"}>
              <FinancialsTab />
            </TabsContent>
            <TabsContent active={activeTab === "calendar"}>
              <CalendarTab />
            </TabsContent>
            <TabsContent active={activeTab === "ledger"}>
              <LedgerTab />
            </TabsContent>
            <TabsContent active={activeTab === "log"}>
              <ClientLogTab />
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  );
}
