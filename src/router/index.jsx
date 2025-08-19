import AchievementPage from "@/pages/AchievementPage";
import AdminLogin from "@/pages/AdminLogin";
import CheckinPage from "@/pages/CheckinPage";
import Dashboard from "@/pages/Dashboard";
import HistoryPage from "@/pages/HistoryPage";
import HomePage from "@/pages/HomePage";
import LeaderboardPage from "@/pages/LeaderboardPage";
import LuckySpinManagement from "@/pages/LuckySpinManagement";
import LuckySpinPage from "@/pages/LuckySpinPage";
import MemberLogin from "@/pages/MemberLogin";
import ProfilePage from "@/pages/ProfilePage";
import RedeemPage from "@/pages/RedeemPage";
import TestPage from "@/pages/TestPage";
import TournamentPage from "@/pages/TournamentPage";
import UserProfile from "@/pages/UserProfile";
import VipPage from "@/pages/VipPage";

import { createBrowserRouter } from "react-router-dom";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/admin-login",
    element: <AdminLogin />,
  },
  {
    path: "/member-login",
    element: <MemberLogin />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/luckySpinManagement",
    element: <LuckySpinManagement />,
  },
  {
    path: "/check-in",
    element: <CheckinPage />,
  },
  {
    path: "/lucky-spin",
    element: <LuckySpinPage />,
  },
  {
    path: "/redeem",
    element: <RedeemPage />,
  },
  {
    path: "/history",
    element: <HistoryPage />,
  },
  {
    path: "/tournament",
    element: <TournamentPage />,
  },
  {
    path: "/profile",
    element: <ProfilePage />,
  },
  {
    path: "/userProfile",
    element: <UserProfile />,
  },
  {
    path: "/leaderboard",
    element: <LeaderboardPage />,
  },
  {
    path: "/badge",
    element: <AchievementPage />,
  },
  {
    path: "/vip",
    element: <VipPage />,
  },
  {
    path: "/test",
    element: <TestPage />,
  },
]);

export default routes;
