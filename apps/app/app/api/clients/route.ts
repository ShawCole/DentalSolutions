import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

// Middleware helper to verify auth token
async function verifyAuth(request: NextRequest) {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
        return null;
    }

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

// GET /api/clients - List all clients (staff/admin only)
export async function GET(request: NextRequest) {
    const auth = await verifyAuth(request);
    if (!auth || (auth.role !== "admin" && auth.role !== "staff")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = adminDb();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "50");

    let query = db.collection("clients").orderBy("createdAt", "desc").limit(limit);

    if (status) {
        query = query.where("status", "==", status);
    }

    const snapshot = await query.get();
    const clients = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || null,
        updatedAt: doc.data().updatedAt?.toDate?.() || null,
    }));

    return NextResponse.json({ clients });
}

// POST /api/clients - Create a new client
export async function POST(request: NextRequest) {
    const auth = await verifyAuth(request);
    if (!auth || (auth.role !== "admin" && auth.role !== "staff")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = adminDb();
    const data = await request.json();

    const clientRef = db.collection("clients").doc();
    const now = new Date();

    await clientRef.set({
        ...data,
        status: data.status || "lead",
        tags: data.tags || [],
        createdAt: now,
        updatedAt: now,
    });

    return NextResponse.json({
        success: true,
        id: clientRef.id,
        message: "Client created successfully"
    });
}
