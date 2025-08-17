import { NavLink } from 'react-router-dom';
import Logo from "@/assets/images/logo.svg";

const sidebarLinks = [
    { to: '/dashboard', icon: '🏠', label: 'Home Dashboard' },
    { to: '/luckySpinManagement', icon: '🎯', label: 'Lucky Spin Management' },
    { to: '/redeem', icon: '💎', label: 'Points Redemption Mall' },
    { to: '/redeem', icon: '🎁', label: 'Points Redemption Gift' },
    { to: '/tournament', icon: '🏆', label: 'Tournament' },
    { to: '/vip', icon: '👑', label: 'VIP Membership Panel' },
    { to: '/reports', icon: '📊', label: 'Reports' },
    { to: '/users', icon: '👥', label: 'User Management' },
    { to: '/notifications', icon: '🔔', label: 'Notification Management' },
];

const LeftSideBar = () => (
    <div className="w-64 bg-gray-900 text-white min-h-screen p-4">
        <div className="flex items-center mb-8">
            <img src={Logo} alt="Logo" className="h-10" />
        </div>

        <nav className="space-y-2">
            {sidebarLinks.map(link => (
                <NavLink key={link.label} to={link.to} className={({ isActive }) => `px-3 py-2 rounded text-sm flex items-center ${isActive ? 'bg-yellow-500 text-black' : 'text-gray-300 hover:bg-gray-800'}`}>
                    <span className="mr-2">{link.icon}</span> {link.label}
                </NavLink>
            ))}
        </nav>

        <div className="absolute bottom-4 left-4">
            <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-600 rounded-full mr-2"></div>
                <div>
                    <div className="text-sm">Andrew Forrest</div>
                    <div className="text-xs text-gray-400">Admin@mrslogan.com</div>
                </div>
            </div>
        </div>
    </div>
);

export default LeftSideBar;
