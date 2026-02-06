import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, connectAuthEmulator, Auth } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator, Firestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if config is valid (has required fields)
const isConfigValid = Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

function getFirebaseApp(): FirebaseApp | null {
    if (!isConfigValid) {
        if (typeof window !== "undefined") {
            console.warn("[firebase] Missing Firebase configuration. Set NEXT_PUBLIC_FIREBASE_* environment variables.");
        }
        return null;
    }

    if (app) return app;

    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    return app;
}

function getFirebaseAuth(): Auth | null {
    const firebaseApp = getFirebaseApp();
    if (!firebaseApp) return null;

    if (auth) return auth;

    auth = getAuth(firebaseApp);

    // Connect to emulators in development
    if (process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_USE_EMULATORS === "true") {
        connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
    }

    return auth;
}

function getFirebaseDb(): Firestore | null {
    const firebaseApp = getFirebaseApp();
    if (!firebaseApp) return null;

    if (db) return db;

    db = getFirestore(firebaseApp);

    // Connect to emulators in development
    if (process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_USE_EMULATORS === "true") {
        connectFirestoreEmulator(db, "localhost", 8080);
    }

    return db;
}

export { getFirebaseAuth as auth, getFirebaseDb as db };
export default getFirebaseApp;
