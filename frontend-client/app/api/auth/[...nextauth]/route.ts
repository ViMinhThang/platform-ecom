import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

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
                    const res = await fetch("http://localhost:8080/api/auth/login", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            email: credentials?.email,
                            password: credentials?.password,
                        }),
                    });

                    const text = await res.text();
                    console.log("Response text:", text);

                    if (!text) {
                        throw new Error("Empty response from server");
                    }

                    const data = JSON.parse(text);

                    if (!res.ok) {
                        throw new Error(data?.message || "Invalid email or password");
                    }

                    const user = {
                        id: data.response.userId.toString(),
                        name: data.response.username,
                        email: data.response.email,
                        roles: data.response.roles,
                        imageUrl: data.response.imageUrl,
                        accessToken: data.jwtCookie.value,
                    };
                    return user
                } catch (error: any) {
                    console.error("Authorize error:", error);
                    throw new Error(error.message);
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
            session.user = token.user as any;
            session.accessToken = token.user?.accessToken;
            return session;
        },
    },

    pages: {
        signIn: "/auth/sign-in",
    },

    secret: process.env.NEXTAUTH_SECRET
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
