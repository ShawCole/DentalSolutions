import { buildDailySchedule, ScheduleResult } from "../schedule/daily";
import { estimatePricingPerPatient, triMode } from "./pricing";
import { getRandomName } from "../names";
import { createSeededRng } from "../random";
import { Assumptions, ClientLogEntry, LedgerEvent } from "../types";

function addBusinessDaysMonFri(from: Date, days: number): Date {
    let d = new Date(from);
    let remaining = days;
    while (remaining > 0) {
        d = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1));
        const dow = d.getUTCDay();
        if (dow >= 1 && dow <= 5) remaining -= 1; // Mon-Fri only
    }
    return d;
}

function addMonthsSameDay(from: Date, months: number): Date {
    const d = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth() + months, from.getUTCDate()));
    return d;
}

function firstFridayAfter(date: Date) {
    let d = new Date(date);
    // move to next Friday (5)
    while (d.getUTCDay() !== 5) {
        d = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1));
    }
    return d;
}

export function buildLedger(
    assumptions: Assumptions,
    monthSchedules?: ScheduleResult[],
    allClientLogs?: ClientLogEntry[]
): LedgerEvent[] {
    const events: LedgerEvent[] = [];
    const months = assumptions.capacity.months;

    const [startYear, startMonth] = assumptions.capacity.startMonthISO.split("-").map(Number);
    const simulationStart = new Date(Date.UTC(startYear, (startMonth - 1), 1));

    // Starting Cash (Initial Capital)
    if (assumptions.startingCash > 0) {
        events.push({
            date: simulationStart,
            kind: "InitialCapital",
            amount: assumptions.startingCash,
            cash: true,
            revenue: false,
            cost: false,
            note: "Initial Business Liquidity"
        });
    }

    // Loan Inflow (Principal Receipt)
    if (assumptions.loan && assumptions.loan.enabled) {
        events.push({
            date: simulationStart,
            kind: "LoanRepayment",
            amount: assumptions.loan.principal,
            cash: true,
            revenue: false,
            cost: false,
            note: "Loan Principal Receipt"
        });
    }

    // Loan Repayment logic (matching runSimulation.ts)
    if (assumptions.loan && assumptions.loan.enabled) {
        const { principal, interestRate, termMonths, repaymentStartMonth } = assumptions.loan;
        const monthlyRate = interestRate / 12;
        const denominator = Math.pow(1 + monthlyRate, termMonths) - 1;
        const loanRepayment = principal * (monthlyRate + (monthlyRate / (denominator || 1)));

        for (let m = 0; m < months; m++) {
            const monthStart = new Date(Date.UTC(startYear, (startMonth - 1) + m, 1));

            // Repayment
            if (m >= repaymentStartMonth && m < (repaymentStartMonth + termMonths)) {
                const repNote = `Loan Repayment (${m - repaymentStartMonth + 1} of ${termMonths})`;
                events.push({
                    date: monthStart,
                    kind: "LoanRepayment",
                    amount: -loanRepayment,
                    cash: true,
                    revenue: false,
                    cost: true,
                    note: repNote
                });
            }

        }
    }

    // Utilities and Fixed Costs on the 1st of each month
    for (let m = 0; m < months; m++) {
        const monthStart = new Date(Date.UTC(startYear, (startMonth - 1) + m, 1));
        // Utilities / Fixed costs
        for (const item of assumptions.fixedCosts.items) {
            events.push({ date: monthStart, kind: "FixedCost", amount: -Math.abs(item.amountPerMonth), cash: true, revenue: false, cost: true, note: item.name });
        }

        // Regular Ad Spend
        const totalAdSpend = assumptions.funnel.savedCampaigns.reduce((sum, camp) => sum + camp.funnel.adSpend, 0);
        if (totalAdSpend > 0) {
            events.push({ date: monthStart, kind: "MarketingExpense", amount: -totalAdSpend, cash: true, revenue: false, cost: true, note: "Regular Campaign Ad Spend" });
        }
    }

    // Biweekly payroll every other Friday, anchored to first Friday after start-month 1st
    const anchor = firstFridayAfter(new Date(Date.UTC(startYear, (startMonth - 1), 1)));
    // generate across the whole horizon
    let pay = new Date(anchor);
    const horizonEnd = new Date(Date.UTC(startYear, (startMonth - 1) + months, 1));
    while (pay < horizonEnd) {
        // Approximate payroll: two paychecks per month equals monthly salaries split; we use monthly receptionist+nurse / 2 per paycheck
        const s = (assumptions.staff.nurseAssistantMonthly.mode + assumptions.staff.receptionistMonthly.mode) / 2;
        events.push({ date: new Date(pay), kind: "PayrollRun", amount: -Math.abs(s), cash: true, revenue: false, cost: true });
        pay = new Date(Date.UTC(pay.getUTCFullYear(), pay.getUTCMonth(), pay.getUTCDate() + 14));
    }

    // Per-month daily schedule and per-entry events
    for (let m = 0; m < months; m++) {
        const rng = createSeededRng(assumptions.seed + 5000 + m);

        // Use provided schedule/log if available, otherwise build fresh
        const schedule = monthSchedules?.[m] || buildDailySchedule(assumptions, m);
        const { summaries: days, clientLog: currentMonthLog } = schedule;

        // If we have a global log provided, we should filter it or use currentMonthLog
        const monthLog = allClientLogs ? allClientLogs.filter(cl => cl.monthIdx === m) : currentMonthLog;

        const chairs = assumptions.capacity.chairsByMonth[m] ?? assumptions.capacity.chairsByMonth.at(-1)!;
        const doctors = assumptions.capacity.doctorsByMonth[m] ?? assumptions.capacity.doctorsByMonth.at(-1)!;
        const doctorCommission = assumptions.staff.doctorCommissionPct.mode;
        const isOwnerMonth = m < assumptions.staff.ownerAsDoctorMonths;

        for (const day of days) {
            // For each entry, treat as a client
            for (const entry of day.entries) {
                // Only trigger financial events on the first appointment
                if (entry.apptIndex === 1) {
                    const firstServiceDate = day.date;
                    const clientId = entry.clientId; // Defined in DailyEntry
                    const price = entry.revenue; // already computed
                    const clientData = monthLog.find(cl => cl.id === clientId);
                    if (!clientData) {
                        // If no client log found, fallback to basic event without client details
                        // preventing crash but logging warning could be useful
                        continue;
                    }

                    const firstName = clientData.firstName || "Unknown";
                    const lastName = clientData.lastName || "Patient";
                    const patientProps = { clientId, patientFirstName: firstName, patientLastName: lastName };

                    const service = serviceLabelForKey(entry.packageKey as any);
                    const { totalAppts, completionDate } = appointmentsInfoForKey(assumptions, entry.packageKey as any, firstServiceDate);

                    const isFinanced = (clientData.installmentCount || 0) > 0;
                    const paymentLabel = isFinanced ? "Financed" : "Paid in Full";
                    const firstNotePrefix = `${Math.min(1, totalAppts)}/${totalAppts} - ${service} | ${paymentLabel}`;

                    // Revenue recognized today
                    events.push({ date: firstServiceDate, kind: "ServiceRevenue", amount: price, cash: false, revenue: true, cost: false, note: firstNotePrefix, service, ...patientProps });

                    // Downpayment amount (from client log)
                    const downpaymentTotal = clientData.downpayment ?? price;
                    const bookingDeposit = assumptions.financing.bookingDeposit;

                    // Calculate booking date (approximate based on lead time)
                    const bookingLeadDays = Math.round(assumptions.financing.bookingLeadTimeDays.mode);
                    const bookingDate = new Date(Date.UTC(firstServiceDate.getUTCFullYear(), firstServiceDate.getUTCMonth(), firstServiceDate.getUTCDate() - bookingLeadDays));

                    // 1. Booking Deposit - Received on booking date
                    events.push({
                        date: bookingDate,
                        kind: "BookingDownpaymentHeld",
                        amount: bookingDeposit,
                        cash: true,
                        revenue: false,
                        cost: false,
                        note: `${firstNotePrefix} | Booking Deposit`,
                        service,
                        ...patientProps
                    });

                    // 2. Remainder of Downpayment - Received on service day
                    const remainingDownpayment = Math.max(0, downpaymentTotal - bookingDeposit);

                    if (remainingDownpayment > 0) {
                        events.push({
                            date: firstServiceDate,
                            kind: "HeldDepositRelease", // Reusing kind for cash inflow from client
                            amount: remainingDownpayment,
                            cash: true,
                            revenue: false,
                            cost: false,
                            note: `${firstNotePrefix} | Downpayment Remainder`,
                            service,
                            ...patientProps
                        });
                    }

                    // 3. Installments - ONLY if financed
                    if (isFinanced) {
                        const monthsToPay = clientData.installmentCount || assumptions.financing.monthsToPay;
                        const financedRemainder = Math.max(0, price - downpaymentTotal);

                        // Weekly logic: split monthly into 4 Fridays
                        const totalWeeks = monthsToPay * 4;
                        const weeklyPortion = totalWeeks > 0 ? financedRemainder / totalWeeks : 0;

                        let currentFriday = firstFridayAfter(firstServiceDate);
                        for (let k = 1; k <= totalWeeks; k++) {
                            const received = weeklyPortion * (1 - assumptions.financing.providerFeePct);
                            const remaining = Math.max(0, financedRemainder - (weeklyPortion * k));
                            const instNote = `${paymentLabel} | ${k} of ${totalWeeks} (wk) - rem $${Math.round(remaining).toLocaleString()}`;
                            events.push({ date: new Date(currentFriday), kind: "InstallmentCashReceived", amount: received, cash: true, revenue: false, cost: false, service, note: instNote, ...patientProps });

                            // move to next Friday
                            currentFriday = new Date(Date.UTC(currentFriday.getUTCFullYear(), currentFriday.getUTCMonth(), currentFriday.getUTCDate() + 7));
                        }
                    }

                    // Materials cost on first service day
                    events.push({ date: firstServiceDate, kind: "MaterialsCost", amount: -materialsForKey(assumptions, entry.packageKey, price), cash: true, revenue: false, cost: true, service, note: firstNotePrefix, ...patientProps });

                    // Hotel/Food costs (only if price >= $9,000)
                    if (price >= 9000) {
                        const { hotelNight, foodDay } = assumptions.variableCosts.perClient || {};
                        const { nights, foodDays } = stayForKey(assumptions, entry.packageKey);
                        if (hotelNight && nights > 0) events.push({ date: firstServiceDate, kind: "HotelCost", amount: -(hotelNight * nights), cash: true, revenue: false, cost: true, service, note: firstNotePrefix, ...patientProps });
                        if (foodDay && foodDays > 0) events.push({ date: firstServiceDate, kind: "FoodCost", amount: -(foodDay * foodDays), cash: true, revenue: false, cost: true, service, note: firstNotePrefix, ...patientProps });
                    }

                    // Commission 50% on first appointment day (v1)
                    if (!isOwnerMonth) {
                        const commission = price * doctorCommission * 0.5;
                        events.push({ date: firstServiceDate, kind: "CommissionFirstHalf", amount: -commission, cash: true, revenue: false, cost: true, service, note: firstNotePrefix, ...patientProps });
                    }

                    // Commission second half on completion date
                    const completionMonthIdx = monthIndexFromDate(assumptions, completionDate);
                    const ownerAtCompletion = completionMonthIdx < assumptions.staff.ownerAsDoctorMonths;
                    if (completionDate.getTime() !== firstServiceDate.getTime() && !ownerAtCompletion) {
                        const commission2 = price * doctorCommission * 0.5;
                        const completeNote = `${totalAppts}/${totalAppts} - ${service}`;
                        events.push({ date: completionDate, kind: "CommissionSecondHalf", amount: -commission2, cash: true, revenue: false, cost: true, service, note: completeNote, ...patientProps });
                    }
                }
            }
        }

        // Capex: X-ray on its month, chairs handled elsewhere (already reflected via capacity)
        if (assumptions.capacity.xray.enabledMonthIdx === m) {
            const monthStart = new Date(Date.UTC(startYear, (startMonth - 1) + m, 1));
            events.push({ date: monthStart, kind: "Capex", amount: -Math.abs(assumptions.capacity.xray.capex), cash: true, revenue: false, cost: true, note: "X-ray" });
        }
    }

    return events.sort((a, b) => a.date.getTime() - b.date.getTime());
}

function materialsForKey(a: Assumptions, key: any, price: number): number {
    switch (key) {
        case "smileDesignNonInvasive":
            // approximate using mid material from NI options proportionally to price
            // Use explicit map based on nearest price
            return nearest([a.pricing.smileDesign.nonInvasive.nanotech, a.pricing.smileDesign.nonInvasive.porcelain, a.pricing.smileDesign.nonInvasive.cubicZirconia], [a.variableCosts.perService.smileNonInvasive.nanotech, a.variableCosts.perService.smileNonInvasive.porcelain, a.variableCosts.perService.smileNonInvasive.cubicZirconia], price);
        case "smileDesignInvasive":
            return nearest([a.pricing.smileDesign.invasive.porcelain, a.pricing.smileDesign.invasive.porcelainPure, a.pricing.smileDesign.invasive.cubicZirconia], [a.variableCosts.perService.smileInvasive.porcelain, a.variableCosts.perService.smileInvasive.porcelainPure, a.variableCosts.perService.smileInvasive.cubicZirconia], price);
        case "implants1":
        case "implants2":
        case "implants3": {
            const count = key === "implants1" ? 1 : key === "implants2" ? 2 : 3;
            return (a.variableCosts.perService.implants.perImplant || 0) * count;
        }
        case "allIn4One":
            return a.variableCosts.perService.allIn4.oneArc || 0;
        case "allIn4Two":
            return a.variableCosts.perService.allIn4.twoArcs || 0;
    }
    return 0;
}

function nearest(priceOptions: number[], costOptions: number[], price: number): number {
    let bestIdx = 0;
    let bestDiff = Math.abs(price - priceOptions[0]!);
    for (let i = 1; i < priceOptions.length; i++) {
        const diff = Math.abs(price - priceOptions[i]!);
        if (diff < bestDiff) {
            bestDiff = diff;
            bestIdx = i;
        }
    }
    return costOptions[bestIdx] || 0;
}

function stayForKey(a: Assumptions, key: any): { nights: number; foodDays: number } {
    switch (key) {
        case "smileDesignNonInvasive":
            return { nights: 2, foodDays: 2 };
        case "smileDesignInvasive": {
            const nights = Math.round(a.durations.smileDesign.invasiveSpanDays.mode);
            return { nights, foodDays: nights };
        }
        case "allIn4One":
            return { nights: 14 + 10, foodDays: 14 + 10 };
        case "allIn4Two":
            return { nights: 14 + 10, foodDays: 14 + 10 };
        default:
            return { nights: 0, foodDays: 0 };
    }
}

function serviceLabelForKey(key: any): string {
    switch (key) {
        case "smileDesignNonInvasive":
            return "Smile Design - Non-invasive";
        case "smileDesignInvasive":
            return "Smile Design - Invasive";
        case "implants1":
            return "Implants (1)";
        case "implants2":
            return "Implants (2)";
        case "implants3":
            return "Implants (3)";
        case "allIn4One":
            return "All-in-4 (1 arc)";
        case "allIn4Two":
            return "All-in-4 (both arcs)";
        default:
            return String(key);
    }
}

function appointmentsInfoForKey(a: Assumptions, key: any, firstDate: Date): { totalAppts: number; completionDate: Date } {
    switch (key) {
        case "smileDesignNonInvasive": {
            return { totalAppts: 1, completionDate: firstDate };
        }
        case "smileDesignInvasive": {
            const total = Math.round(a.durations.smileDesign.invasiveApptsCount.mode);
            const daysSpan = Math.round(a.durations.smileDesign.invasiveSpanDays.mode);
            const completion = new Date(Date.UTC(firstDate.getUTCFullYear(), firstDate.getUTCMonth(), firstDate.getUTCDate() + daysSpan));
            return { totalAppts: Math.max(1, total), completionDate: completion };
        }
        case "implants1":
        case "implants2": {
            return { totalAppts: 1, completionDate: firstDate };
        }
        case "implants3": {
            const completion = new Date(Date.UTC(firstDate.getUTCFullYear(), firstDate.getUTCMonth(), firstDate.getUTCDate() + 1));
            return { totalAppts: 2, completionDate: completion };
        }
        case "allIn4One": {
            const monthsLater = Math.round(a.durations.allIn4.returnAfterMonths.mode);
            const completion = addMonthsSameDay(firstDate, monthsLater);
            return { totalAppts: 2, completionDate: completion };
        }
        case "allIn4Two": {
            const monthsLater = Math.round(a.durations.allIn4.returnAfterMonths.mode);
            const completion = addMonthsSameDay(firstDate, monthsLater);
            return { totalAppts: 3, completionDate: completion };
        }
        default:
            return { totalAppts: 1, completionDate: firstDate };
    }
}

function monthIndexFromDate(a: Assumptions, d: Date): number {
    const [y, m] = a.capacity.startMonthISO.split("-").map(Number);
    const base = new Date(Date.UTC(y, m - 1, 1));
    const months = (d.getUTCFullYear() - base.getUTCFullYear()) * 12 + (d.getUTCMonth() - base.getUTCMonth());
    return months;
}

function hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
}


