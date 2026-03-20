import UserListingClient from "./user-listing-client";

interface UserListingPageProps {
  searchParams?: {
    page: number;
    perPage: number;
    username: string | null;
    email: string | null;
  };
}

export default function UserListingPage({ searchParams }: UserListingPageProps) {
  return (
    <UserListingClient
      searchParams={searchParams}
    />
  );
}
