import { ArtisanLanding } from "~/components/landing/artisans/home";
import { BusinessLanding } from "~/components/landing/business/home";
import { DiningLanding } from "~/components/landing/dining/home";
import { FairLanding } from "~/components/landing/fair/home";
import { LanguageLanding } from "~/components/landing/language/home";
import { PlannerLanding } from "~/components/landing/planner/home";
import { RetreatLanding } from "~/components/landing/retreat/home";
import { SafariLanding } from "~/components/landing/safari/home";
import { TourLanding } from "~/components/landing/tour/home";
import { TransitLanding } from "~/components/landing/transist/home";

export default  function HomePage() {
  return (
    <>
      <ArtisanLanding />
      <SafariLanding />
      <FairLanding />
      <BusinessLanding />
      <TourLanding />
      <RetreatLanding/>
      <DiningLanding/>
      <TransitLanding/>
      <PlannerLanding/>
      <LanguageLanding/>
    </>
  );
}
