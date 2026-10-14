"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface User {
    name: string;
    email: string;
    phone?: string;
}

interface StoredSession {
    user: User;
    expiresAt: number;
}

interface AuthContextType {
    user: User | null;
    login: (
        identifier: string,
        pass: string,
        rememberMe?: boolean
    ) => { success: boolean; message?: string };
    register: (
        name: string,
        email: string,
        phone: string,
        pass: string
    ) => { success: boolean; message?: string };
    logout: () => void;
    isAuthenticated: boolean;
    isAuthLoaded: boolean;
}

const SHORT_SESSION_MS = 4 * 60 * 60 * 1000; // 4 Hours (Regular)
const LONG_SESSION_MS = 30 * 24 * 60 * 60 * 1000; // 30 Days (Remember Me)

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthLoaded, setIsAuthLoaded] = useState(false);

    useEffect(() => {
        const verifySession = () => {
            try {
                const storedSessionRaw = localStorage.getItem("app_user_session");
                if (!storedSessionRaw) {
                    setUser(null);
                    return;
                }

                const session: StoredSession = JSON.parse(storedSessionRaw);
                if (Date.now() > session.expiresAt) {
                    localStorage.removeItem("app_user_session");
                    setUser(null);
                } else {
                    setUser(session.user);
                }
            } catch (error) {
                console.error("Session verification failed:", error);
                localStorage.removeItem("app_user_session");
                setUser(null);
            } finally {
                setIsAuthLoaded(true);
            }
        };

        verifySession();
        const interval = setInterval(verifySession, 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const saveSession = (userData: User, rememberMe: boolean = false) => {
        const duration = rememberMe ? LONG_SESSION_MS : SHORT_SESSION_MS;
        const session: StoredSession = {
            user: userData,
            expiresAt: Date.now() + duration,
        };
        setUser(userData);
        setIsAuthLoaded(true);
        localStorage.setItem("app_user_session", JSON.stringify(session));
    };

    const register = (name: string, email: string, phone: string, pass: string) => {
        try {
            const usersRaw = localStorage.getItem("app_registered_users");
            const users: Array<{ name: string; email: string; phone: string; pass: string }> = usersRaw
                ? JSON.parse(usersRaw)
                : [];

            const cleanEmail = email.trim().toLowerCase();
            const cleanPhone = phone.trim();

            const exists = users.some(
                (u) =>
                    u.email.toLowerCase() === cleanEmail ||
                    (cleanPhone && u.phone === cleanPhone)
            );

            if (exists) {
                return {
                    success: false,
                    message: "An account with this email or phone number already exists.",
                };
            }

            users.push({ name: name.trim(), email: cleanEmail, phone: cleanPhone, pass });
            localStorage.setItem("app_registered_users", JSON.stringify(users));

            saveSession({ name: name.trim(), email: cleanEmail, phone: cleanPhone }, true);
            return { success: true };
        } catch {
            return { success: false, message: "Registration failed. Please try again." };
        }
    };

    const login = (identifier: string, pass: string, rememberMe: boolean = false) => {
        try {
            const usersRaw = localStorage.getItem("app_registered_users");
            const users: Array<{ name: string; email: string; phone: string; pass: string }> = usersRaw
                ? JSON.parse(usersRaw)
                : [];

            const cleanId = identifier.trim().toLowerCase();

            const found = users.find(
                (u) =>
                    (u.email.toLowerCase() === cleanId || u.phone === cleanId) &&
                    u.pass === pass
            );

            if (found) {
                saveSession(
                    { name: found.name, email: found.email, phone: found.phone },
                    rememberMe
                );
                return { success: true };
            }

            return { success: false, message: "Invalid email/phone or password." };
        } catch {
            return { success: false, message: "Login failed. Please try again." };
        }
    };

    const logout = () => {
        try {
            setUser(null);
            setIsAuthLoaded(true);
            localStorage.removeItem("app_user_session");
        } catch (error) {
            console.error("Failed to clear session:", error);
        }
    };

    return (
        <AuthContext.Provider
            value={{ user, login, register, logout, isAuthenticated: !!user, isAuthLoaded }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};