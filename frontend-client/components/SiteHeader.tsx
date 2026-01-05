"use client";

import { TopBar } from "./header/TopBar";
import { SearchHeader } from "./header/SearchHeader";

export const SiteHeader = () => {
  return (
    <div className="flex flex-col">
      <TopBar />
      <SearchHeader />
    </div>
  );
};
