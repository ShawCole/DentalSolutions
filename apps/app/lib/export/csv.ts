import type { MonthlyKPI } from "@dentalsolutions/core";

export function toMonthlyCsv(rows: MonthlyKPI[]): string {
    const headers = [
        "month",
        "cashStart",
        "adSpend",
        "commissions",
        "salaries",
        "cashAfterOverhead",
        "patients",
        "revenue",
        "downpaymentCash",
        "installmentsCash",
        "capex",
        "cashEnd",
        "chairHoursAvailable",
        "chairHoursUsed",
        "utilizationPct",
    ];
    const lines = [headers.join(",")];
    for (const r of rows) {
        lines.push(
            [
                r.monthIdx + 1,
                r.cashStart ?? 0,
                r.adSpend ?? 0,
                r.commissions ?? 0,
                r.salaries ?? 0,
                r.cashAfterOverhead ?? 0,
                r.patientsTotal ?? 0,
                r.revenue ?? 0,
                r.downpaymentCash ?? 0,
                r.installmentsCash ?? 0,
                r.capex ?? 0,
                r.cashOnHand ?? 0,
                r.chairHoursAvailable ?? 0,
                r.chairHoursUsed ?? 0,
                r.utilizationPct ?? 0,
            ]
                .map((v) => (typeof v === "number" ? String(v) : JSON.stringify(v)))
                .join(",")
        );
    }
    return lines.join("\n");
}

export function download(filename: string, content: string, mime = "text/csv") {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}


