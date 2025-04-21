import {SearchBar} from "@/components/search-bar";
import {ListingList} from "@/components/listing-list";
import {Card} from "@/components/ui/card";

export default function Home() {
  return (
    <div className="container mx-auto py-10">
      <Card className="p-4 mb-4">
        <SearchBar/>
      </Card>
      <ListingList/>
    </div>
  );
}
