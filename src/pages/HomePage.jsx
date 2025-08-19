import React, { useState, useEffect } from 'react';
import Header from "@/components/shared/Header";
import MainNav from "@/components/shared/MainNav";

import EventsPromotionCarousel from "@/components/home/EventsPromotionCarousel";
import CheckinStats from "@/components/checkin/CheckinStats";
import HeroStatsSection from "@/components/home/HeroStatsSection";

export default function HomePage() {
  const [memberData, setMemberData] = useState(null);

  useEffect(() => {
    // Check if member is logged in
    const storedMemberData = localStorage.getItem('memberData');
    if (storedMemberData) {
      try {
        const member = JSON.parse(storedMemberData);
        setMemberData(member);
      } catch (err) {
        console.error('Failed to parse member data:', err);
      }
    }
  }, []);

  return (
    <main className="h-svh overflow-hidden w-full max-w-sm mx-auto relative">
      <Header memberData={memberData} />

      {/* Section 1: Stats */}
      <HeroStatsSection memberData={memberData} />

      {/* Section 2: Check in stats */}
      <CheckinStats memberData={memberData} />

      {/* Section 3: Promotion and Events */}
      <EventsPromotionCarousel />

      <MainNav />
    </main>
  );
}
