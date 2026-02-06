// User roles for the application
export type UserRole = "admin" | "staff" | "client";

// User profile stored in Firestore
export interface UserProfile {
    uid: string;
    email: string;
    displayName: string | null;
    role: UserRole;
    createdAt: Date;
    lastLogin: Date;
    // For clients, link to their client record
    clientId?: string;
    // For staff, their provider details
    providerId?: string;
    // Permissions override (optional fine-grained control)
    permissions?: string[];
}

// Client record synced from GHL
export interface Client {
    id: string;
    ghlContactId: string;
    name: string;
    email: string;
    phone: string;
    status: "lead" | "consultation" | "booked" | "treated" | "complete" | "lost";
    source: {
        campaign?: string;
        channel?: string;
        medium?: string;
    };
    tags: string[];
    notes: string;
    createdAt: Date;
    updatedAt: Date;
}

// Appointment record
export interface Appointment {
    id: string;
    clientId: string;
    providerId: string;
    chairId: string;
    startTime: Date;
    endTime: Date;
    status: "scheduled" | "confirmed" | "in-progress" | "completed" | "cancelled" | "no-show";
    serviceType: string;
    packageType?: string;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
}

// Financial transaction
export interface Transaction {
    id: string;
    clientId: string;
    appointmentId?: string;
    type: "payment" | "refund" | "adjustment";
    amount: number;
    currency: string;
    status: "pending" | "completed" | "failed" | "refunded";
    stripePaymentIntentId?: string;
    stripeChargeId?: string;
    method: "card" | "cash" | "financing" | "transfer";
    notes: string;
    createdAt: Date;
}

// Expense record
export interface Expense {
    id: string;
    category: "rent" | "utilities" | "salaries" | "supplies" | "marketing" | "equipment" | "other";
    amount: number;
    date: Date;
    vendorName?: string;
    description: string;
    isRecurring: boolean;
    recurringFrequency?: "weekly" | "monthly" | "quarterly" | "annually";
    createdAt: Date;
}

// Capital expenditure / Asset
export interface Asset {
    id: string;
    type: "chair" | "xray" | "equipment" | "software" | "other";
    name: string;
    purchaseDate: Date;
    cost: number;
    status: "planned" | "ordered" | "delivered" | "active" | "retired";
    depreciation?: {
        method: "straight-line" | "declining-balance";
        years: number;
        currentValue: number;
    };
    notes: string;
    createdAt: Date;
}

// Marketing campaign tracking
export interface MarketingCampaign {
    id: string;
    name: string;
    platform: "facebook" | "instagram" | "google" | "tiktok" | "other";
    region: "US" | "MEX" | "other";
    budgetMonthly: number;
    actualSpend: number;
    leads: number;
    conversions: number;
    startDate: Date;
    endDate?: Date;
    isActive: boolean;
    ghlCampaignId?: string;
    createdAt: Date;
}

// Provider (doctor/staff) record
export interface Provider {
    id: string;
    userId?: string;
    name: string;
    role: "doctor" | "hygienist" | "assistant" | "receptionist";
    commissionPct: number;
    monthlySalary: number;
    isActive: boolean;
    schedule?: {
        [day: string]: { start: string; end: string } | null;
    };
    createdAt: Date;
}
