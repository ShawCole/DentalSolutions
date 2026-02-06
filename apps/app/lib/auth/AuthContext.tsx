"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
    User,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth as getAuth, db as getDb } from "@/lib/firebase";
import type { UserProfile, UserRole } from "@dentalsolutions/core";

interface AuthContextType {
    user: User | null;
    profile: UserProfile | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, displayName: string, role?: UserRole) => Promise<void>;
    signOut: () => Promise<void>;
    isAdmin: boolean;
    isStaff: boolean;
    isClient: boolean;
    isConfigured: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    const auth = getAuth();
    const db = getDb();
    const isConfigured = Boolean(auth && db);

    useEffect(() => {
        // Check for mock session first
        const mockSession = localStorage.getItem("mock_session");
        if (mockSession) {
            const mockUser = JSON.parse(mockSession);
            setUser({
                uid: mockUser.uid,
                email: mockUser.email,
                displayName: mockUser.displayName,
                emailVerified: true,
                isAnonymous: false,
                metadata: {},
                providerData: [],
                refreshToken: "",
                tenantId: null,
                delete: async () => { },
                getIdToken: async () => "mock-token",
                getIdTokenResult: async () => ({
                    token: "mock-token",
                    signInProvider: "custom",
                    claims: {},
                    authTime: Date.now().toString(),
                    issuedAtTime: Date.now().toString(),
                    expirationTime: (Date.now() + 3600000).toString(),
                }),
                reload: async () => { },
                toJSON: () => ({}),
                phoneNumber: null,
                photoURL: null,
                providerId: "custom",
            } as unknown as User);

            setProfile({
                uid: mockUser.uid,
                email: mockUser.email,
                displayName: mockUser.displayName,
                role: "admin",
                createdAt: new Date(),
                lastLogin: new Date(),
                clientId: "mock-client-id",
                providerId: "custom",
                permissions: ["all"],
            });
            setLoading(false);
            return;
        }

        if (!auth) {
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            // Ignore Firebase updates if we are in mock mode involved
            if (localStorage.getItem("mock_session")) return;

            setUser(firebaseUser);

            if (firebaseUser && db) {
                // Fetch user profile from Firestore
                const profileRef = doc(db, "users", firebaseUser.uid);
                const profileSnap = await getDoc(profileRef);

                if (profileSnap.exists()) {
                    const data = profileSnap.data();
                    setProfile({
                        uid: firebaseUser.uid,
                        email: firebaseUser.email || "",
                        displayName: data.displayName,
                        role: data.role,
                        createdAt: data.createdAt?.toDate() || new Date(),
                        lastLogin: data.lastLogin?.toDate() || new Date(),
                        clientId: data.clientId,
                        providerId: data.providerId,
                        permissions: data.permissions,
                    });

                    // Update last login
                    await setDoc(profileRef, { lastLogin: serverTimestamp() }, { merge: true });
                } else {
                    setProfile(null);
                }
            } else {
                setProfile(null);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, [auth, db]);

    const signIn = async (email: string, password: string) => {
        // Mock Auth Bypass
        if ((email === "dev@example.com" && password === "password") ||
            (email === "DentalSolutions" && password === "Password123")) {
            const mockUser = {
                uid: "mock-user-123",
                email: email === "DentalSolutions" ? "admin@dentalcancun.com" : "dev@example.com",
                displayName: email === "DentalSolutions" ? "DentalSolutions Admin" : "Developer",
            };
            localStorage.setItem("mock_session", JSON.stringify(mockUser));

            // Trigger state update immediately
            setUser({
                uid: mockUser.uid,
                email: mockUser.email,
                displayName: mockUser.displayName,
                emailVerified: true,
                isAnonymous: false,
                metadata: {},
                providerData: [],
                refreshToken: "",
                tenantId: null,
                delete: async () => { },
                getIdToken: async () => "mock-token",
                getIdTokenResult: async () => ({
                    token: "mock-token",
                    signInProvider: "custom",
                    claims: {},
                    authTime: Date.now().toString(),
                    issuedAtTime: Date.now().toString(),
                    expirationTime: (Date.now() + 3600000).toString(),
                }),
                reload: async () => { },
                toJSON: () => ({}),
                phoneNumber: null,
                photoURL: null,
                providerId: "custom",
            } as unknown as User);

            setProfile({
                uid: mockUser.uid,
                email: mockUser.email,
                displayName: mockUser.displayName,
                role: "admin",
                createdAt: new Date(),
                lastLogin: new Date(),
                clientId: "mock-client-id",
                providerId: "custom",
                permissions: ["all"],
            });
            return;
        }

        if (!auth) throw new Error("Firebase not configured");
        await signInWithEmailAndPassword(auth, email, password);
    };

    const signUp = async (
        email: string,
        password: string,
        displayName: string,
        role: UserRole = "client"
    ) => {
        if (!auth || !db) throw new Error("Firebase not configured");

        const credential = await createUserWithEmailAndPassword(auth, email, password);

        // Create user profile in Firestore
        const profileRef = doc(db, "users", credential.user.uid);
        await setDoc(profileRef, {
            email,
            displayName,
            role,
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp(),
        });
    };

    const signOut = async () => {
        localStorage.removeItem("mock_session");
        setProfile(null);
        setUser(null);

        if (auth) {
            await firebaseSignOut(auth);
        }
    };

    const isAdmin = profile?.role === "admin";
    const isStaff = profile?.role === "staff" || isAdmin;
    const isClient = profile?.role === "client";

    return (
        <AuthContext.Provider
            value={{
                user,
                profile,
                loading,
                signIn,
                signUp,
                signOut,
                isAdmin,
                isStaff,
                isClient,
                isConfigured,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
