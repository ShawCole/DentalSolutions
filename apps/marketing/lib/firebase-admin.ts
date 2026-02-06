import { initializeApp, getApps, cert, App, applicationDefault } from "firebase-admin/app";
import { getAuth, Auth } from "firebase-admin/auth";
import { getFirestore, Firestore } from "firebase-admin/firestore";

let adminApp: App | null = null;
let adminAuth: Auth | null = null;
let adminDb: Firestore | null = null;

function initializeAdminApp(): App | null {
    // Skip initialization during build if no credentials
    if (typeof process === "undefined") return null;

    if (getApps().length > 0) {
        return getApps()[0];
    }

    try {
        const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

        if (serviceAccountKey) {
            // Production: use service account from environment
            const serviceAccount = JSON.parse(serviceAccountKey);
            return initializeApp({
                credential: cert(serviceAccount),
                projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            });
        } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
            // GCP environment: use application default credentials
            return initializeApp({
                credential: applicationDefault(),
                projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            });
        } else {
            // Development without credentials - log warning but don't crash build
            console.warn(
                "[firebase-admin] No credentials found. Set FIREBASE_SERVICE_ACCOUNT_KEY or GOOGLE_APPLICATION_CREDENTIALS."
            );
            return null;
        }
    } catch (error) {
        console.error("[firebase-admin] Initialization error:", error);
        return null;
    }
}

// Lazy initialization
function getAdminApp(): App | null {
    if (!adminApp) {
        adminApp = initializeAdminApp();
    }
    return adminApp;
}

function getAdminAuth(): Auth {
    const app = getAdminApp();
    if (!app) {
        throw new Error("Firebase Admin not initialized. Check your credentials.");
    }
    if (!adminAuth) {
        adminAuth = getAuth(app);
    }
    return adminAuth;
}

function getAdminDb(): Firestore {
    const app = getAdminApp();
    if (!app) {
        throw new Error("Firebase Admin not initialized. Check your credentials.");
    }
    if (!adminDb) {
        adminDb = getFirestore(app);
    }
    return adminDb;
}

// Export getters instead of direct references for lazy initialization
export { getAdminAuth as adminAuth, getAdminDb as adminDb };
export default getAdminApp;
