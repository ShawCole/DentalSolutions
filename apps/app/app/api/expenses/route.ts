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

// GET /api/expenses - List expenses
export async function GET(request: NextRequest) {
    const auth = await verifyAuth(request);
    if (!auth || auth.role === "client") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = adminDb();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    let query = db.collection("expenses").orderBy("date", "desc");

    if (category) query = query.where("category", "==", category);
    if (startDate) query = query.where("date", ">=", new Date(startDate));
    if (endDate) query = query.where("date", "<=", new Date(endDate));

    const snapshot = await query.limit(500).get();
    const expenses = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate?.() || null,
        createdAt: doc.data().createdAt?.toDate?.() || null,
    }));

    return NextResponse.json({ expenses });
}

// POST /api/expenses - Create expense
export async function POST(request: NextRequest) {
    const auth = await verifyAuth(request);
    if (!auth || auth.role !== "admin") {
        return NextResponse.json({ error: "Admin only" }, { status: 403 });
    }

    const db = adminDb();
    const data = await request.json();
    const now = new Date();

    const expenseRef = db.collection("expenses").doc();
    await expenseRef.set({
        ...data,
        date: data.date ? new Date(data.date) : now,
        createdAt: now,
    });

    return NextResponse.json({ success: true, id: expenseRef.id });
}

// DELETE /api/expenses - Delete expense
export async function DELETE(request: NextRequest) {
    const auth = await verifyAuth(request);
    if (!auth || auth.role !== "admin") {
        return NextResponse.json({ error: "Admin only" }, { status: 403 });
    }

    const db = adminDb();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    await db.collection("expenses").doc(id).delete();
    return NextResponse.json({ success: true });
}
