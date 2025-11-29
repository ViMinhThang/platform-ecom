import { withAuth } from "next-auth/middleware";

export default withAuth(
    function middleware(req) {
        // Add custom logic here if needed, e.g. role checks
    },
    {
        pages: {
            signIn: "/auth/sign-in",
        },
    }
);

export const config = {
    matcher: ["/profile/:path*", "/orders/:path*"],
};
