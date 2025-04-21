"use client";

import {Input} from "@/components/ui/input";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";

export function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Debounce the search query for 300ms
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        // push new route
        router.push(`/?search=${searchQuery}`);
      } else {
        router.push(`/`);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, router]);

  return (
    <Input
      type="search"
      placeholder="Search listings..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  );
}
