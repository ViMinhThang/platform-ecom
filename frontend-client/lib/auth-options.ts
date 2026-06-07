import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { logger } from "./logger";
import { env } from "./config/env";

interface LoginData {
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

interface AuthResponse {
    success: boolean;
    message: string;
    data: LoginData;
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
            name: "Thông tin đăng nhập",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Mật khẩu", type: "password" },
            },
            async authorize(credentials) {
                try {
                    const res = await fetch(`${env.apiBaseUrl}/api/v1/auth/login`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            email: credentials?.email,
                            password: credentials?.password,
                        }),
                    });

                    if (!res.ok) {
                        const error = await res.json().catch(() => ({ message: "Thông tin đăng nhập không hợp lệ" }));
                        throw new Error(error?.message || "Email hoặc mật khẩu không hợp lệ");
                    }

                    const apiResponse: AuthResponse = await res.json();
                    logger.info("Authentication response:", { data: apiResponse.data });

                    if (!apiResponse.data?.response?.userId) {
                        throw new Error("Phản hồi từ máy chủ xác thực không hợp lệ");
                    }

                    const { data } = apiResponse;

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
                    logger.error("Authorization failed:", error);
                    throw error instanceof Error ? error : new Error("Xác thực thất bại");
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
