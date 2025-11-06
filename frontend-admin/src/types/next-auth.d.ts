// types/next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken?: string;
    user?: {
      id?: string;
      email?: string;
      name?: string;
      roles?: string[];
      accessToken?: string;
    };
  }

  interface User {
    id: string;
    email: string;
    name?: string;
    roles: string[];
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    accessToken?: string;
    user?: {
      id?: string;
      email?: string;
      name?: string;
      roles: string[];
      accessToken?: string;
    };
  }
}
