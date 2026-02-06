import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

// GET /api/auth/me - Get current user profile
export async function GET(request: NextRequest) {
    try {
        const auth = adminAuth();
        const db = adminDb();

        const authHeader = request.headers.get("authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.split("Bearer ")[1];
        const decodedToken = await auth.verifyIdToken(token);

        const userDoc = await db.collection("users").doc(decodedToken.uid).get();

        if (!userDoc.exists) {
            return NextResponse.json({ error: "User profile not found" }, { status: 404 });
        }

        return NextResponse.json({
            uid: decodedToken.uid,
            email: decodedToken.email,
            ...userDoc.data(),
        });
    } catch (error) {
        console.error("Auth error:", error);
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
}

// POST /api/auth/create-admin - Create first admin user (protected route)
export async function POST(request: NextRequest) {
    try {
        const auth = adminAuth();
        const db = adminDb();

        const { email, password, displayName, adminSecret } = await request.json();

        // Simple admin creation protection - in production, use a more secure method
        if (adminSecret !== process.env.ADMIN_CREATION_SECRET) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Check if any admin exists
        const adminsSnapshot = await db
            .collection("users")
            .where("role", "==", "admin")
            .limit(1)
            .get();

        // For first admin, allow creation; otherwise require existing admin
        if (!adminsSnapshot.empty) {
            // Verify the requester is an admin
            const authHeader = request.headers.get("authorization");
            if (!authHeader?.startsWith("Bearer ")) {
                return NextResponse.json({ error: "Only admins can create other admins" }, { status: 403 });
            }

            const token = authHeader.split("Bearer ")[1];
            const decodedToken = await auth.verifyIdToken(token);
            const requesterDoc = await db.collection("users").doc(decodedToken.uid).get();

            if (requesterDoc.data()?.role !== "admin") {
                return NextResponse.json({ error: "Only admins can create other admins" }, { status: 403 });
            }
        }

        // Create user in Firebase Auth
        const userRecord = await auth.createUser({
            email,
            password,
            displayName,
        });

        // Create user profile in Firestore
        await db.collection("users").doc(userRecord.uid).set({
            email,
            displayName,
            role: "admin",
            createdAt: new Date(),
            lastLogin: new Date(),
        });

        return NextResponse.json({
            success: true,
            uid: userRecord.uid,
            message: "Admin user created successfully",
        });
    } catch (error: any) {
        console.error("Admin creation error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to create admin" },
            { status: 500 }
        );
    }
}
