import Logo from "@/assets/images/logo.svg";
import HomeIcon from "@/assets/images/icons/home.svg";
import { NavLink, useNavigate } from "react-router-dom";

export default function Header({ memberData }) {
  const navigate = useNavigate();

  const handleMemberLogout = () => {
    localStorage.removeItem('memberData');
    localStorage.removeItem('memberTokens');
    navigate('/member-login');
  };

  return (
    <header className="w-full h-20 golden-box-shadow rounded-b-3xl border border-[#DD8F1F]/25 border-t-0 relative">
      <div className="h-full flex justify-center items-center">
        <img src={Logo} alt="" className="mr-5" />
      </div>

      {/* Member Info and Actions */}
      {memberData ? (
        <div className="absolute left-4 top-4 flex flex-col items-start">
          <span className="text-white text-xs font-medium">{memberData.username}</span>
          <span className="text-yellow-400 text-xs">{memberData.tier}</span>
        </div>
      ) : (
        <NavLink 
          to="/member-login" 
          className="absolute left-4 top-6 text-yellow-400 text-xs hover:text-yellow-300"
        >
          Login
        </NavLink>
      )}

      {/* Home Icon or Logout */}
      <div className="absolute right-4 top-4 flex items-center gap-2">
        {memberData && (
          <button
            onClick={handleMemberLogout}
            className="text-red-400 text-xs hover:text-red-300 mr-2"
          >
            Logout
          </button>
        )}
        <NavLink to="/">
          <img src={HomeIcon} alt="" className="w-6 h-6" />
        </NavLink>
      </div>
    </header>
  );
}
