import Header from "@/components/shared/Header";
import MainNav from "@/components/shared/MainNav";

import EventsPromotionCarousel from "@/components/home/EventsPromotionCarousel";
import CheckinStats from "@/components/checkin/CheckinStats";
import HeroStatsSection from "@/components/home/HeroStatsSection";

export default function HomePage() {
  return (
    <main className="h-svh overflow-hidden w-full max-w-sm mx-auto relative">
      <Header />

      {/* Section 1: Stats */}
      <HeroStatsSection />

      {/* Section 2: Check in stats */}
      <CheckinStats />

      {/* Section 3: Promotion and Events */}
      <EventsPromotionCarousel />

      <MainNav />
    </main>
  );
}
