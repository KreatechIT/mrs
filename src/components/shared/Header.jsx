import Logo from "@/assets/images/logo.svg";
import HomeIcon from "@/assets/images/icons/home.svg";
import { NavLink } from "react-router-dom";

export default function Header() {
  return (
    <header className="w-full h-20 golden-box-shadow rounded-b-3xl border border-[#DD8F1F]/25 border-t-0 relative">
      <div className="h-full flex justify-center items-center">
        <img src={Logo} alt="" className="mr-5" />
      </div>

      {/* Home Icon */}
      <NavLink to="/">
        <img src={HomeIcon} alt="" className="absolute right-6 top-6" />
      </NavLink>
    </header>
  );
}
