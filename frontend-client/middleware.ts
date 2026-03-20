import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const pathname = req.nextUrl.pathname;

        // Admin dashboard role-based access control
        // Only SELLER role can access admin dashboard
        if (pathname.startsWith("/admin/dashboard/")) {
            const userRoles = token?.user?.roles as string[] || [];
            
            // Require SELLER role to access admin dashboard
            const hasSellerAccess = userRoles.includes("ROLE_SELLER");
            
            if (!hasSellerAccess) {
                // Redirect to home page if user doesn't have seller access
                return NextResponse.redirect(new URL("/", req.url));
            }
        }
    },
    {
        pages: {
            signIn: "/auth/sign-in",
        },
    }
);

export const config = {
    matcher: [
        "/profile/:path*", 
        "/orders/:path*",
        "/admin/dashboard/:path*"
    ],
};
