import { adminDb } from "../firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export type GhlLead = {
    id?: string;
    contactId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    source: string;
    tags: string[];
    customFields: Record<string, any>;
    createdAt: any;
};

/**
 * Saves a lead from a GHL webhook payload to Firestore.
 * Handles variations in GHL payload structure (Workflow vs Trigger).
 */
export async function saveGhlLead(payload: any) {
    let db;
    try {
        db = adminDb();
    } catch (e) {
        console.warn("[leadService] Firestore Admin not available, logging payload only.");
        console.log("[GHL Payload Preview]:", JSON.stringify(payload).slice(0, 500));
        return null;
    }

    // GHL workflows usually wrap the contact in a "contact" property.
    // Triggers might send it at the top level.
    const leadData = payload.contact || payload;

    const lead: GhlLead = {
        contactId: leadData.id || leadData.contact_id || "unknown",
        firstName: leadData.firstName || leadData.first_name || "",
        lastName: leadData.lastName || leadData.last_name || "",
        email: leadData.email || "",
        phone: leadData.phone || "",
        source: leadData.source || payload.workflow?.name || "GHL Webhook",
        tags: leadData.tags || [],
        customFields: leadData.customFields || leadData.custom_fields || {},
        createdAt: FieldValue.serverTimestamp(),
    };

    try {
        const docRef = await db.collection("leads").add(lead);
        return docRef.id;
    } catch (e) {
        console.error("[leadService] Error saving lead to Firestore:", e);
        throw e;
    }
}

/**
 * Maps GHL lead data to simulation inputs.
 * This can be used to dynamically adjust 'demand bump' or 'cpl' based on real volume.
 */
export function mapLeadsToSimInputs(leads: GhlLead[]) {
    // Logic to aggregate leads by campaign/tag and compute actual CPL
    // for use in the "Marketing Performance" dashboard.
    return {
        count: leads.length,
        sources: Array.from(new Set(leads.map(l => l.source))),
        // ... more metrics
    };
}
