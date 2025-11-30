import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { logger } from "@/lib/logger";
import { API_ENDPOINTS } from "@/config/constants";

interface AuthResponse {
    response: {
        userId: number;
        username: string;
        email: string;
        roles: string[];
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
                    const res = await fetch(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.AUTH}/login`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            email: credentials?.email,
                            password: credentials?.password,
                        }),
                    });

                    const data: AuthResponse = await res.json();

                    if (!res.ok) {
                        throw new Error(data?.response?.username || "Invalid email or password");
                    }

                    logger.debug("User authorization successful", {
                        userId: data.response?.userId,
                        username: data.response?.username,
                        responseStructure: JSON.stringify(data)
                    });

                    // Handle missing user ID
                    if (!data.response?.userId && !data.response?.username) {
                        throw new Error("Invalid response from authentication server");
                    }

                    const user: CustomUser = {
                        id: String(data.response.userId),
                        name: data.response.username,
                        email: data.response.email,
                        roles: data.response.roles || [],
                        accessToken: data.jwtCookie.value,
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
