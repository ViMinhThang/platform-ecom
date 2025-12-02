import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";

interface AuthResponse {
    response: {
        userId: number;
        username: string;
        email: string;
        roles: string[];
        imageUrl?: string;
        isActive?: boolean;
    };
    jwtCookie: {
        value: string;
    };
}

interface CustomUser {
    id: string;
    name: string;
    email: string;
    roles: string[];
    imageUrl?: string;
    accessToken: string;
}

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    const res = await fetch(`${API_BASE_URL}/auth/login`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            email: credentials?.email,
                            password: credentials?.password,
                        }),
                    });

                    if (!res.ok) {
                        const error = await res.json().catch(() => ({ message: "Invalid credentials" }));
                        throw new Error(error?.message || "Invalid email or password");
                    }

                    const data: AuthResponse = await res.json();

                    if (!data.response?.userId) {
                        throw new Error("Invalid response from authentication server");
                    }

                    const user: CustomUser = {
                        id: String(data.response.userId),
                        name: data.response.username,
                        email: data.response.email,
                        roles: data.response.roles || [],
                        imageUrl: data.response.imageUrl,
                        accessToken: data.jwtCookie.value,
                    };

                    return user;
                } catch (error) {
                    console.error("Authorization failed:", error);
                    throw error instanceof Error ? error : new Error("Authorization failed");
                }
            },
        }),
    ],

    session: {
        strategy: "jwt",
    },

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.user = user;
            }
            return token;
        },
        async session({ session, token }) {
            session.user = token.user as CustomUser;
            session.accessToken = (token.user as CustomUser)?.accessToken;
            return session;
        },
    },

    pages: {
        signIn: "/auth/sign-in",
    },

    secret: process.env.NEXTAUTH_SECRET,
};
