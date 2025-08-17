import { NavLink } from "react-router-dom";

import LuckySpinIcon from "@/assets/images/icons/lucky-spin.png";
import CheckinIcon from "@/assets/images/icons/checkin.svg";
import RedeemIcon from "@/assets/images/icons/redeem.svg";
import TournamentsIcon from "@/assets/images/icons/tournaments.svg";
import ProfileIcon from "@/assets/images/icons/profile.svg";

const menuItems = [
  { name: "Lucky Spin", icon: LuckySpinIcon, path: "/lucky-spin" },
  { name: "Check-In", icon: CheckinIcon, path: "/check-in" },
  { name: "Redeem", icon: RedeemIcon, path: "/redeem" },
  { name: "Tournaments", icon: TournamentsIcon, path: "/tournament" },
  { name: "Profile", icon: ProfileIcon, path: "/profile" },
];

import { useLocation } from "react-router-dom";

export default function MainNav() {
  const location = useLocation();
  // Define all routes that should activate Profile tab
  const profileRoutes = [
    "/profile",
    "/userProfile",
    "/leaderboard",
    "/vip",
    "/badge"
  ];

  return (
    <div className="fixed bottom-0 w-full max-w-sm h-40 flex items-end mx-auto left-0 right-0 z-50">
      <section className="w-full h-20 golden-box-shadow rounded-t-3xl border border-[#DD8F1F]/25 border-b-0 bg-[#1a1a1a]/80 backdrop-blur-sm px-2">
        <nav className="flex justify-between items-center h-full text-xs">
          {menuItems.map((item, index) => {
            // If this is the Profile tab, check if current route matches any profileRoutes
            const isProfileTab = item.name === "Profile";
            const isActive = isProfileTab
              ? profileRoutes.some((route) => location.pathname.startsWith(route))
              : location.pathname.startsWith(item.path);
            return (
              <NavLink
                key={index}
                to={item.path}
                className={
                  `flex flex-col items-center justify-center gap-1 flex-1 transition ${isActive
                    ? "text-white opacity-100"
                    : "text-white/50 opacity-60"
                  }`
                }
              >
                <img src={item.icon} alt={item.name} className="size-9" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </section>
    </div>
  );
}
