import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

async function verifyAuth(request: NextRequest) {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) return null;

    try {
        const auth = adminAuth();
        const db = adminDb();
        const token = authHeader.split("Bearer ")[1];
        const decodedToken = await auth.verifyIdToken(token);
        const userDoc = await db.collection("users").doc(decodedToken.uid).get();
        return { uid: decodedToken.uid, role: userDoc.data()?.role || "client" };
    } catch {
        return null;
    }
}

// GET /api/appointments - List appointments
export async function GET(request: NextRequest) {
    const auth = await verifyAuth(request);
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const db = adminDb();
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get("clientId");
    const providerId = searchParams.get("providerId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    let query = db.collection("appointments").orderBy("startTime", "asc");

    if (clientId) query = query.where("clientId", "==", clientId);
    if (providerId) query = query.where("providerId", "==", providerId);
    if (startDate) query = query.where("startTime", ">=", new Date(startDate));
    if (endDate) query = query.where("startTime", "<=", new Date(endDate));

    const snapshot = await query.limit(200).get();
    const appointments = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        startTime: doc.data().startTime?.toDate?.() || null,
        endTime: doc.data().endTime?.toDate?.() || null,
    }));

    return NextResponse.json({ appointments });
}

// POST /api/appointments - Create appointment
export async function POST(request: NextRequest) {
    const auth = await verifyAuth(request);
    if (!auth || (auth.role !== "admin" && auth.role !== "staff")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = adminDb();
    const data = await request.json();
    const now = new Date();

    const appointmentRef = db.collection("appointments").doc();
    await appointmentRef.set({
        ...data,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        status: data.status || "scheduled",
        createdAt: now,
        updatedAt: now,
    });

    return NextResponse.json({ success: true, id: appointmentRef.id });
}

// PATCH /api/appointments - Update appointment
export async function PATCH(request: NextRequest) {
    const auth = await verifyAuth(request);
    if (!auth || (auth.role !== "admin" && auth.role !== "staff")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = adminDb();
    const { id, ...updates } = await request.json();
    if (!id) return NextResponse.json({ error: "Missing appointment ID" }, { status: 400 });

    const appointmentRef = db.collection("appointments").doc(id);

    if (updates.startTime) updates.startTime = new Date(updates.startTime);
    if (updates.endTime) updates.endTime = new Date(updates.endTime);
    updates.updatedAt = new Date();

    await appointmentRef.update(updates);
    return NextResponse.json({ success: true });
}
