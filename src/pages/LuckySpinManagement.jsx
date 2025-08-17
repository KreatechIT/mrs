import LeftSideBar from "@/components/shared/LeftSideBar";
import DailyLimits from "@/assets/images/icons/daily-limits.png";
import SpinItems from "@/assets/images/icons/spin-items-panel.png";
import PrizeSettings from "@/assets/images/icons/prize-settings.png";
import UserLogs from "@/assets/images/icons/user-logs.png";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import SpinItemsIcon from "@/assets/images/icons/spin-items-panel.png";
import ImageIcon from "@/assets/images/icons/image-upload.png";

const spinItems = [
    { name: "iPhone 16 Pro Max", image: "/src/assets/images/airpods.png" },
    { name: "Gold Bar 5 Gram", image: "100" },
    { name: "Free Bonus 1.88", image: "/src/assets/images/badges/tier-1.svg" },
    { name: "Free Bonus 8.88", image: "100" },
    { name: "Thank You", image: "100" },
    { name: "Free Bonus 16.88", image: "100" },
    { name: "Free Bonus 23.88", image: "100" },
    { name: "MRS Point +3", image: "100" },
];

const topCards = [
    {
        image: SpinItems,
        label: "Spin Items Panel",
        active: true,
        cardClass: "bg-gradient-to-r from-yellow-500 to-yellow-300 shadow-lg",
        textClass: "text-white text-xl font-bold"
    },
    {
        image: PrizeSettings,
        label: "Prize Settings",
        active: false,
        cardClass: "bg-gray-900 shadow-lg",
        textClass: "text-gray-400 text-base font-semibold"
    },
    {
        image: UserLogs,
        label: "User Logs",
        active: false,
        cardClass: "bg-gray-900 shadow-lg",
        textClass: "text-gray-400 text-base font-semibold"
    },
    {
        image: DailyLimits,
        label: "Daily Limits",
        active: false,
        cardClass: "bg-gray-900 shadow-lg",
        textClass: "text-gray-400 text-base font-semibold"
    }
];


// DRY Modal component for Add/Edit
const SpinItemModal = ({ open, setOpen, mode = "add", initialData = {} }) => (
    <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/70 z-50" />
            <Dialog.Content className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 bg-gray-800 rounded-xl shadow-lg p-8 w-[400px] flex flex-col items-center border border-gray-700">
                <img src={SpinItemsIcon} alt="Spin Items" className="h-12 mb-4" />
                <h2 className="text-white text-xl font-semibold mb-6">{mode === "add" ? "Add New Spin Items" : "Edit Spin Item"}</h2>
                <form className="w-full flex flex-col gap-6">
                    <div>
                        <label className="text-gray-300 text-sm mb-2 block">Reward Name :</label>
                        <input type="text" defaultValue={initialData.name || ""} className="w-full bg-transparent border border-yellow-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                    </div>
                    <div>
                        <label className="text-gray-300 text-sm mb-2 block">Image</label>
                        <div className="border-2 border-dashed border-gray-600 rounded-lg h-32 flex items-center justify-center bg-gray-900">
                            <img src={initialData.image || ImageIcon} alt="Upload" className="h-10" />
                        </div>
                    </div>
                    <div className="flex justify-end gap-4 mt-2">
                        <button type="button" className="bg-white text-red-500 px-4 py-1 rounded" onClick={() => setOpen(false)}>Cancel</button>
                        <button type="submit" className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-black px-4 py-1 rounded font-bold">Confirm</button>
                    </div>
                </form>
            </Dialog.Content>
        </Dialog.Portal>
    </Dialog.Root>
);

const LuckySpinManagement = () => {
    const [addOpen, setAddOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editData, setEditData] = useState({});

    return (
        <div className="flex min-h-screen bg-black">
            <LeftSideBar />
            <div className="flex-1 p-8">
                <h1 className="text-3xl font-bold text-white mb-6">Lucky Spin Management</h1>
                <div className="grid grid-cols-4 gap-6 mb-8">
                    {topCards.map((card) => (
                        <div
                            key={card.label}
                            className={`rounded-lg p-6 flex flex-row items-center justify-center ${card.cardClass}`}
                        >
                            <img src={card.image} alt={card.label} className="h-12 w-12 object-contain mr-3" />
                            <span className={card.textClass}>{card.label}</span>
                        </div>
                    ))}
                </div>
                <div className="bg-gray-900 rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-white">Spin Items Panel Table</h2>
                        <div className="flex items-center gap-2">
                            <button className="bg-yellow-100 text-yellow-600 px-3 py-1 rounded text-xs font-bold">Spin Sequence Setting</button>
                            <button className="bg-yellow-500 text-black px-4 py-1 rounded text-xs font-bold" onClick={() => setAddOpen(true)}>Add</button>
                        </div>
                    </div>
                    <table className="w-full rounded overflow-hidden">
                        <thead>
                            <tr className="bg-black text-white">
                                <th className="text-left py-3 px-4 font-medium">Reward Name</th>
                                <th className="text-left py-3 px-4 font-medium">Item Image</th>
                                <th className="text-left py-3 px-4 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {spinItems.map((item, idx) => (
                                <tr key={idx} className="border-b border-gray-800 bg-gray-900">
                                    <td className="py-3 px-4 text-gray-200">
                                        {item.name}
                                    </td>
                                    <td className="py-3 px-4">
                                        {item.image.endsWith('.png') || item.image.endsWith('.svg') ? (
                                            <img src={item.image} alt={item.name} className="h-10 mx-auto" />
                                        ) : (
                                            <span className="text-gray-400">{item.image}</span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4">
                                        <button className="bg-green-500 text-white px-4 py-1 rounded mr-2" onClick={() => { setEditData(item); setEditOpen(true); }}>Edit</button>
                                        <button className="bg-black border border-red-400 text-red-500 px-4 py-1 rounded">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <SpinItemModal open={addOpen} setOpen={setAddOpen} mode="add" />
                <SpinItemModal open={editOpen} setOpen={setEditOpen} mode="edit" initialData={editData} />
            </div>
        </div>
    );
};

export default LuckySpinManagement;