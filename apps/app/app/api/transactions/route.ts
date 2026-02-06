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

// GET /api/transactions - List transactions
export async function GET(request: NextRequest) {
    const auth = await verifyAuth(request);
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const db = adminDb();
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get("clientId");
    const status = searchParams.get("status");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    let query = db.collection("transactions").orderBy("createdAt", "desc");

    if (clientId) query = query.where("clientId", "==", clientId);
    if (status) query = query.where("status", "==", status);
    if (startDate) query = query.where("createdAt", ">=", new Date(startDate));
    if (endDate) query = query.where("createdAt", "<=", new Date(endDate));

    const snapshot = await query.limit(500).get();
    const transactions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || null,
    }));

    return NextResponse.json({ transactions });
}

// POST /api/transactions - Create transaction
export async function POST(request: NextRequest) {
    const auth = await verifyAuth(request);
    if (!auth || (auth.role !== "admin" && auth.role !== "staff")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = adminDb();
    const data = await request.json();
    const now = new Date();

    const transactionRef = db.collection("transactions").doc();
    await transactionRef.set({
        ...data,
        status: data.status || "pending",
        currency: data.currency || "USD",
        createdAt: now,
    });

    return NextResponse.json({ success: true, id: transactionRef.id });
}
