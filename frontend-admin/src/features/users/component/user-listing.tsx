import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import UserListingClient from "./user-listing-client";

interface UserListingPageProps {
  searchParams?: {
    page: number;
    perPage: number;
    username: string | null;
    email: string | null;
  };
}

export default async function UserListingPage({ searchParams }: UserListingPageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return <div>You must be signed in to view users.</div>;
  }

  return (
    <UserListingClient
      token={session.accessToken}
      searchParams={searchParams}
    />
  );
}
