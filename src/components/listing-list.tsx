"use client";

import {useEffect, useState} from "react";
import {searchListings, Listing} from "@/services/gde-kako";
import {useSearchParams} from "next/navigation";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {summarizeListing} from "@/ai/flows/listing-summary";
import {useToast} from "@/hooks/use-toast";

export function ListingList() {
  const searchParams = useSearchParams();
  const [listings, setListings] = useState<Listing[]>([]);
  const {toast} = useToast();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const query = searchParams?.get("search") || "";
    const fetchListings = async () => {
      setLoading(true);
      try {
        const results = await searchListings(query);
        setListings(results);
      } catch (error) {
        console.error("Failed to fetch listings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [searchParams]);

  const handleSummarize = async (listing: Listing) => {
    try {
      const summary = await summarizeListing({
        title: listing.title,
        description: listing.description,
      });
      toast({
        title: "Listing Summary",
        description: summary.summary,
      });
    } catch (error) {
      console.error("Failed to summarize listing:", error);
      toast({
        title: "Error",
        description: "Failed to generate summary. Please try again.",
      });
    }
  };

  if (loading) {
    return <div>Loading listings...</div>;
  }

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {listings.map((listing) => (
        <Card key={listing.id}>
          <CardHeader>
            <CardTitle>{listing.title}</CardTitle>
            <CardDescription>{listing.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <img src={`https://picsum.photos/seed/${listing.id}/600/400`} alt={listing.title} className="rounded-md mb-2"/>
            <Button onClick={() => handleSummarize(listing)}>Summarize</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
