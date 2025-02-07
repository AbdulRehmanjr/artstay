import { ArtisanList } from "~/components/artisans/artisan-list";
import { ArtisanFilter } from "~/components/artisans/filter-tab";

export default function ArtisanPage() {
  return (
    <>
   
      <ArtisanFilter />
      <ArtisanList/>
    </>
  );
}
