import { NextRequest, NextResponse } from 'next/server';
import { saveGhlLead } from '@/lib/ghl/leadService';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Save to Firestore via leadService
        const leadId = await saveGhlLead(body);

        console.log(`[GHL Webhook] Successfully processed lead: ${leadId || 'Logged only'}`);

        return NextResponse.json({
            status: 'success',
            received: true,
            leadId,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error("[GHL Webhook] Error processing request:", error);
        return NextResponse.json({
            status: 'error',
            message: 'Failed to process webhook'
        }, { status: 400 });
    }
}
