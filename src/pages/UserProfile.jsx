import Crown from "@/assets/images/wheel/rank-bronze.png";
import Avatar from "@/assets/images/profile/avatar.png";
import Header from "@/components/shared/Header";
import MainNav from "@/components/shared/MainNav";

export default function UserProfile() {
    return (
        <div className="h-svh overflow-hidden w-full max-w-sm mx-auto relative flex flex-col">
            <Header />
            {/* Profile Card */}
            <div className="w-full flex flex-col items-center flex-1">
                <div className="relative w-24 h-24 rounded-full bg-gradient-to-b from-yellow-400/30 to-yellow-900/30 flex items-center justify-center mb-4 shadow-lg">
                    <img src={Avatar} alt="Avatar" className="w-20 h-20 object-cover rounded-full border-4 border-yellow-400" />
                    {/* Edit icon overlay */}
                    <div className="absolute bottom-2 right-2 w-7 h-7 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
                        <svg width="16" height="16" fill="none" stroke="black" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" /></svg>
                    </div>
                </div>
                {/* Editable fields */}
                <div className="w-full max-w-xs flex flex-col gap-3 mb-6">
                    <div className="flex items-center bg-black border border-gray-400 rounded-lg px-4 py-2">
                        <input
                            type="text"
                            defaultValue="Abiazabran"
                            className="bg-transparent text-white flex-1 outline-none"
                        />
                        <button className="ml-2">
                            <svg width="16" height="16" fill="none" stroke="#FFD700" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" /></svg>
                        </button>
                    </div>
                    <div className="flex items-center bg-black border border-gray-400 rounded-lg px-4 py-2">
                        <input
                            type="text"
                            defaultValue="Mohammadpur, Dhaka-1207"
                            className="bg-transparent text-white flex-1 outline-none"
                        />
                        <button className="ml-2">
                            <svg width="16" height="16" fill="none" stroke="#FFD700" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" /></svg>
                        </button>
                    </div>
                </div>
                {/* Rank and Points Card */}
                <div className="w-full max-w-xs flex gap-0.5 mb-8">
                    <div className="flex-1 bg-gradient-to-b from-yellow-900/60 to-yellow-400/20 border border-yellow-700 rounded-l-xl p-4 flex flex-col items-center justify-center shadow-md">
                        <div className="text-xs text-gray-200 mb-1">Rank Badge</div>
                        <img src={Crown} alt="Rank Badge" className="w-8 h-8 mb-1" />
                        <div className="text-yellow-400 text-sm font-bold">Bronze</div>
                    </div>
                    <div className="flex-1 bg-gradient-to-b from-yellow-900/60 to-yellow-400/20 border border-yellow-700 rounded-r-xl p-4 flex flex-col items-center justify-center shadow-md">
                        <div className="text-xs text-gray-200 mb-1">MRS Point</div>
                        <div className="text-yellow-400 text-2xl font-bold">3400 <span className="text-base font-normal">pts</span></div>
                    </div>
                </div>
            </div>
            {/* Save Button at bottom */}
            <div className="w-full flex justify-center pb-4 relative bottom-[11%]">
                <button className="w-full max-w-xs py-3 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-bold text-lg shadow-md hover:brightness-110 transition-all">
                    Saved Change
                </button>
            </div>
            <MainNav />
        </div>
    );
}
