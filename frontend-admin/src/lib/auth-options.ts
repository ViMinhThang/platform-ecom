import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { logger } from "@/lib/logger";
import { API_ENDPOINTS } from "@/config/constants";

interface AuthResponse {
    success: boolean;
    message: string;
    data: {
        response: {
            userId: number;
            username: string;
            email: string;
            roles: string[];
        };
        jwtCookie: {
            value: string;
        };
    };
}


interface CustomUser {
    id: string;
    name: string;
    email: string;
    roles: string[];
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
                    const res = await fetch(`${API_ENDPOINTS.AUTH}/login`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            email: credentials?.email,
                            password: credentials?.password,
                        }),
                    });

                    const data: AuthResponse = await res.json();

                    if (!res.ok || !data.success) {
                        throw new Error(data?.message || "Invalid email or password");
                    }

                    const authData = data.data;

                    logger.debug("User authorization successful", {
                        userId: authData.response?.userId,
                        username: authData.response?.username,
                        responseStructure: JSON.stringify(data)
                    });

                    // Handle missing user ID
                    if (!authData.response?.userId && !authData.response?.username) {
                        throw new Error("Invalid response from authentication server");
                    }

                    const user: CustomUser = {
                        id: String(authData.response.userId),
                        name: authData.response.username,
                        email: authData.response.email,
                        roles: authData.response.roles || [],
                        accessToken: authData.jwtCookie.value,
                    };
                    return user;
                } catch (error) {
                    logger.error("Authorization failed", error instanceof Error ? error : undefined);
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
