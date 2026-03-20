import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;

    if (
      req.nextUrl.pathname.startsWith("/admin/dashboard/admin") &&
      token?.user?.roles.includes("ROLE_SELLER")
    ) {
      return new Response("Forbidden", { status: 403 });
    }

    if (
      req.nextUrl.pathname.startsWith("/admin/dashboard/admin") &&
      token?.user?.roles.includes("ROLE_ADMIN")
    ) {
      return new Response("Forbidden", { status: 403 });
    }
  },
  {
    pages: {
      signIn: "/auth/sign-in",
    },
  }
);

export const config = {
  matcher: ["/admin/dashboard/:path*"],
};
