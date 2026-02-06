"use client";

import { useState, FormEvent } from "react";
import { useAuth } from "@/lib/auth/AuthContext";

interface LoginFormProps {
    onSuccess?: () => void;
    showSignUp?: boolean;
}

export function LoginForm({ onSuccess, showSignUp = false }: LoginFormProps) {
    const { signIn, signUp } = useAuth();
    const [mode, setMode] = useState<"login" | "signup">("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            if (mode === "login") {
                await signIn(email, password);
            } else {
                await signUp(email, password, displayName);
            }
            onSuccess?.();
        } catch (err: any) {
            setError(err.message || "Authentication failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-xl border border-zinc-100 p-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-zinc-900">
                        {mode === "login" ? "Welcome Back" : "Create Account"}
                    </h1>
                    <p className="text-zinc-500 mt-2">
                        {mode === "login"
                            ? "Sign in to access your dashboard"
                            : "Set up your account to get started"}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {mode === "signup" && (
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-zinc-200 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-colors"
                                placeholder="John Smith"
                                required
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                            Username or Email
                        </label>
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-zinc-200 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-colors"
                            placeholder="DentalSolutions"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-zinc-200 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-colors"
                            placeholder="••••••••"
                            required
                            minLength={6}
                        />
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-zinc-900 text-white py-3 rounded-lg font-medium hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading
                            ? "Please wait..."
                            : mode === "login"
                                ? "Sign In"
                                : "Create Account"}
                    </button>
                </form>

                {showSignUp && (
                    <div className="mt-6 text-center">
                        <button
                            onClick={() => setMode(mode === "login" ? "signup" : "login")}
                            className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
                        >
                            {mode === "login"
                                ? "Don't have an account? Sign up"
                                : "Already have an account? Sign in"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
