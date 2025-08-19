import LeftSideBar from "@/components/shared/LeftSideBar";
import DailyLimits from "@/assets/images/icons/daily-limits.png";
import SpinItems from "@/assets/images/icons/spin-items-panel.png";
import PrizeSettings from "@/assets/images/icons/prize-settings.png";
import UserLogs from "@/assets/images/icons/user-logs.png";
import * as Dialog from "@radix-ui/react-dialog";
import * as Switch from "@radix-ui/react-switch";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import SpinItemsIcon from "@/assets/images/icons/spin-items-panel.png";
import ImageIcon from "@/assets/images/icons/image-upload.png";
import { luckySpinItemsService } from "@/api/services/LuckySpinItemsService.js";
import { authService } from "@/api/services/AuthService.js";
import { memberService } from "@/api/services/MemberService.js";



const topCards = [
    {
        image: SpinItems,
        label: "Spin Items Panel",
        cardClass: "bg-gradient-to-r from-yellow-500 to-yellow-300 shadow-lg",
        activeCardClass: "bg-gradient-to-r from-yellow-500 to-yellow-300 shadow-lg",
        inactiveCardClass: "bg-gray-900 shadow-lg",
        textClass: "text-white text-xl font-bold",
        inactiveTextClass: "text-gray-400 text-base font-semibold"
    },
    {
        image: PrizeSettings,
        label: "Prize Settings",
        cardClass: "bg-gradient-to-r from-yellow-500 to-yellow-400 shadow-lg",
        activeCardClass: "bg-gradient-to-r from-yellow-500 to-yellow-400 shadow-lg",
        inactiveCardClass: "bg-gray-900 shadow-lg",
        textClass: "text-white text-xl font-bold",
        inactiveTextClass: "text-gray-400 text-base font-semibold"
    },
    {
        image: UserLogs,
        label: "User Logs",
        cardClass: "bg-gray-900 shadow-lg",
        activeCardClass: "bg-gradient-to-r from-yellow-500 to-yellow-400 shadow-lg",
        inactiveCardClass: "bg-gray-900 shadow-lg",
        textClass: "text-white text-xl font-bold",
        inactiveTextClass: "text-gray-400 text-base font-semibold"
    },
    {
        image: DailyLimits,
        label: "Daily Limits",
        cardClass: "bg-gray-900 shadow-lg",
        activeCardClass: "bg-gradient-to-r from-yellow-500 to-yellow-400 shadow-lg",
        inactiveCardClass: "bg-gray-900 shadow-lg",
        textClass: "text-white text-xl font-bold",
        inactiveTextClass: "text-gray-400 text-base font-semibold"
    }
];


// Enhanced Modal component for Add/Edit/Spin Sequence with full functionality
const SpinItemModal = ({ open, setOpen, mode = "add", initialData = {}, onSubmit, loading: modalLoading = false }) => {
    const [formData, setFormData] = useState({
        reward_name: '',
        probability: 0.1,
        unlimited: false,
        quantity: 1,
        image: null
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const fileInputRef = useRef(null);

    // Initialize form data when modal opens or initialData changes
    useEffect(() => {
        if (open) {
            if (mode === "edit" && initialData) {
                setFormData({
                    reward_name: initialData.reward_name || '',
                    probability: typeof initialData.probability === 'string' ? parseFloat(initialData.probability) : (initialData.probability || 0.1),
                    unlimited: initialData.unlimited || false,
                    quantity: initialData.quantity || 1,
                    image: null // Don't set existing image in form, will be handled separately
                });
                // Set image preview if existing image exists
                setImagePreview(initialData.image || null);
            } else {
                setFormData({
                    reward_name: '',
                    probability: 0.1,
                    unlimited: false,
                    quantity: 1,
                    image: null
                });
                setImagePreview(null);
            }
            setFormErrors({});
        }
    }, [open, mode, initialData?.uuid]); // Only depend on the UUID to avoid object reference issues

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (formErrors[field]) {
            setFormErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    const handleImageDrop = useCallback((e) => {
        e.preventDefault();
        setDragActive(false);
        
        const files = e.dataTransfer.files;
        if (files && files[0]) {
            handleImageFile(files[0]);
        }
    }, []);

    const handleImageFile = (file) => {
        if (file && file.type.startsWith('image/')) {
            setFormData(prev => ({ ...prev, image: file }));
            
            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => setImagePreview(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const validateForm = () => {
        const errors = {};
        
        if (!formData.reward_name.trim()) {
            errors.reward_name = 'Reward name is required';
        }
        
        // Check for valid probability number
        const prob = parseFloat(formData.probability);
        if (isNaN(prob) || prob <= 0 || prob > 1) {
            errors.probability = 'Probability must be a valid number between 0.01 and 1';
        }
        
        // Quantity validation only when not unlimited
        if (!formData.unlimited) {
            const qty = parseInt(formData.quantity);
            if (isNaN(qty) || qty <= 0) {
                errors.quantity = 'Quantity must be a positive integer when not unlimited';
            }
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        const submitData = {
            reward_name: formData.reward_name.trim(),
            probability: parseFloat(formData.probability),
            unlimited: formData.unlimited,
            quantity: formData.unlimited ? null : parseInt(formData.quantity)
        };
        
        await onSubmit(submitData, formData.image);
    };

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    if (mode === "sequence") {
        return (
            <Dialog.Root open={open} onOpenChange={setOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/70 z-50" />
                    <Dialog.Content className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 bg-gray-800 rounded-xl shadow-lg p-8 w-[400px] flex flex-col items-center border border-gray-700">
                        <Dialog.Title asChild>
                            <h2 className="text-white text-xl font-semibold mb-6">Spin Sequence Settings</h2>
                        </Dialog.Title>
                        <Dialog.Description className="text-gray-300 text-sm mb-4 text-center">
                            Configure the sequence settings for the lucky spin feature.
                        </Dialog.Description>
                        <img src={SpinItemsIcon} alt="Spin Items" className="h-12 mb-4" />
                        <div className="w-full flex flex-col gap-6">
                            <div>
                                <label className="text-gray-300 text-sm mb-2 block">Sequence Name :</label>
                                <input type="text" className="w-full bg-transparent border border-yellow-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                            </div>
                            <div>
                                <label className="text-gray-300 text-sm mb-2 block">Description</label>
                                <textarea className="w-full bg-transparent border border-yellow-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500" rows={3} />
                            </div>
                            <div className="flex justify-end gap-4 mt-2">
                                <button type="button" className="bg-white text-red-500 px-4 py-1 rounded" onClick={() => setOpen(false)}>Cancel</button>
                                <button type="button" className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-black px-4 py-1 rounded font-bold">Confirm</button>
                            </div>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        );
    }

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/70 z-50" />
                <Dialog.Content className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 bg-gray-800 rounded-xl shadow-lg p-8 w-[500px] flex flex-col items-center border border-gray-700 max-h-[90vh] overflow-y-auto">
                    <Dialog.Title asChild>
                        <h2 className="text-white text-xl font-semibold mb-6">
                            {mode === "add" ? "Add New Spin Item" : "Edit Spin Item"}
                        </h2>
                    </Dialog.Title>
                    <Dialog.Description className="text-gray-300 text-sm mb-4 text-center">
                        {mode === "add" ? "Create a new spin item with custom rewards and probabilities." : "Update the selected spin item settings and properties."}
                    </Dialog.Description>
                    <img src={SpinItemsIcon} alt="Spin Items" className="h-12 mb-4" />
                    
                    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
                        {/* Reward Name */}
                        <div>
                            <label className="text-gray-300 text-sm mb-2 block">Reward Name *</label>
                            <input 
                                type="text" 
                                value={formData.reward_name}
                                onChange={(e) => handleInputChange('reward_name', e.target.value)}
                                className={`w-full bg-transparent border rounded px-3 py-2 text-white focus:outline-none focus:ring-2 ${
                                    formErrors.reward_name ? 'border-red-500 focus:ring-red-500' : 'border-yellow-700 focus:ring-yellow-500'
                                }`}
                                placeholder="Enter reward name"
                                disabled={modalLoading}
                            />
                            {formErrors.reward_name && <p className="text-red-400 text-xs mt-1">{formErrors.reward_name}</p>}
                        </div>

                        {/* Probability */}
                        <div>
                            <label className="text-gray-300 text-sm mb-2 block">Probability (0.01 - 1.0) *</label>
                            <input 
                                type="number" 
                                step="0.01"
                                min="0.01"
                                max="1.0"
                                value={formData.probability}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    // Only update if it's a valid number or empty (for clearing)
                                    if (value === '' || (!isNaN(parseFloat(value)) && isFinite(value))) {
                                        handleInputChange('probability', value === '' ? 0.01 : parseFloat(value));
                                    }
                                }}
                                className={`w-full bg-transparent border rounded px-3 py-2 text-white focus:outline-none focus:ring-2 ${
                                    formErrors.probability ? 'border-red-500 focus:ring-red-500' : 'border-yellow-700 focus:ring-yellow-500'
                                }`}
                                placeholder="0.1"
                                disabled={modalLoading}
                            />
                            {formErrors.probability && <p className="text-red-400 text-xs mt-1">{formErrors.probability}</p>}
                        </div>

                        {/* Unlimited Toggle */}
                        <div>
                            <div className="flex items-center justify-between">
                                <label className="text-gray-300 text-sm">Unlimited Quantity</label>
                                <Switch.Root
                                    checked={formData.unlimited}
                                    onCheckedChange={(checked) => handleInputChange('unlimited', checked)}
                                    className="w-10 h-6 bg-gray-600 rounded-full data-[state=checked]:bg-yellow-500 relative flex items-center transition-colors duration-200"
                                    disabled={modalLoading}
                                >
                                    <Switch.Thumb className="block w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 translate-x-1 data-[state=checked]:translate-x-5" />
                                </Switch.Root>
                            </div>
                        </div>

                        {/* Quantity (only if not unlimited) */}
                        {!formData.unlimited && (
                            <div>
                                <label className="text-gray-300 text-sm mb-2 block">Quantity *</label>
                                <input 
                                    type="number" 
                                    min="1"
                                    value={formData.quantity}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        // Only update if it's a valid integer or empty (for clearing)
                                        if (value === '' || (!isNaN(parseInt(value)) && parseInt(value) > 0)) {
                                            handleInputChange('quantity', value === '' ? 1 : parseInt(value));
                                        }
                                    }}
                                    className={`w-full bg-transparent border rounded px-3 py-2 text-white focus:outline-none focus:ring-2 ${
                                        formErrors.quantity ? 'border-red-500 focus:ring-red-500' : 'border-yellow-700 focus:ring-yellow-500'
                                    }`}
                                    placeholder="1"
                                    disabled={modalLoading}
                                />
                                {formErrors.quantity && <p className="text-red-400 text-xs mt-1">{formErrors.quantity}</p>}
                            </div>
                        )}

                        {/* Image Upload */}
                        <div>
                            <label className="text-gray-300 text-sm mb-2 block">Image</label>
                            <div 
                                className={`border-2 border-dashed rounded-lg h-32 flex items-center justify-center bg-gray-900 transition-colors ${
                                    dragActive ? 'border-yellow-500 bg-yellow-500/10' : 'border-gray-600'
                                }`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleImageDrop}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {imagePreview ? (
                                    <div className="relative">
                                        <img src={imagePreview} alt="Preview" className="h-24 object-contain" />
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setImagePreview(null);
                                                setFormData(prev => ({ ...prev, image: null }));
                                            }}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                                            disabled={modalLoading}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ) : (
                                    <div className="text-center text-gray-400">
                                        <img src={ImageIcon} alt="Upload" className="h-10 mx-auto mb-2" />
                                        <p className="text-sm">Click or drag image here</p>
                                        <p className="text-xs">(PNG, JPG, JPEG)</p>
                                    </div>
                                )}
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={(e) => e.target.files && e.target.files[0] && handleImageFile(e.target.files[0])}
                                className="hidden"
                                disabled={modalLoading}
                            />
                        </div>

                        {/* Form Actions */}
                        <div className="flex justify-end gap-4 mt-2">
                            <button 
                                type="button" 
                                className="bg-white text-red-500 px-4 py-2 rounded hover:bg-gray-100 transition-colors" 
                                onClick={() => setOpen(false)}
                                disabled={modalLoading}
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-black px-6 py-2 rounded font-bold hover:from-yellow-600 hover:to-yellow-500 transition-colors disabled:opacity-50"
                                disabled={modalLoading}
                            >
                                {modalLoading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                                        {mode === "add" ? "Creating..." : "Updating..."}
                                    </div>
                                ) : (
                                    mode === "add" ? "Create Item" : "Update Item"
                                )}
                            </button>
                        </div>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};


const PRIZE_SETTINGS_DATA = [
    {
        name: "Max Prize Pool Per Day",
        value: "RM1,000",
        editable: false,
        systemLimit: true,
    },
    {
        name: "Max Total Probability (%)",
        value: "100%",
        editable: true,
        systemLimit: false,
    },
    {
        name: "Auto-disable Big Prizes",
        value: "Enabled",
        editable: true,
        systemLimit: false,
    },
    {
        name: "Enable Category Weighting",
        value: "On",
        editable: true,
        systemLimit: false,
    },
];

const USER_LOGS_DATA = [
    { username: "john88", time: "27 Jun, 3:42 PM", result: "Jackpot RM100", device: "iPhone Safari", ip: "203.0.113.11" },
    { username: "john88", time: "27 Jun, 3:42 PM", result: "RM10 Free Credit", device: "iPhone Safari", ip: "203.0.113.11" },
    { username: "john88", time: "27 Jun, 3:42 PM", result: "RM10 Free Credit", device: "iPhone Safari", ip: "203.0.113.11" },
    { username: "john88", time: "27 Jun, 3:42 PM", result: "No Win", device: "iPhone Safari", ip: "203.0.113.11", noWin: true },
    { username: "john88", time: "27 Jun, 3:42 PM", result: "RM10 Free Credit", device: "iPhone Safari", ip: "203.0.113.11" },
    { username: "john88", time: "27 Jun, 3:42 PM", result: "RM10 Free Credit", device: "iPhone Safari", ip: "203.0.113.11" },
    { username: "john88", time: "27 Jun, 3:42 PM", result: "RM10 Free Credit", device: "iPhone Safari", ip: "203.0.113.11" },
    { username: "john88", time: "27 Jun, 3:42 PM", result: "RM10 Free Credit", device: "iPhone Safari", ip: "203.0.113.11" },
    { username: "john88", time: "27 Jun, 3:42 PM", result: "RM10 Free Credit", device: "iPhone Safari", ip: "203.0.113.11" },
    { username: "john88", time: "27 Jun, 3:42 PM", result: "RM10 Free Credit", device: "iPhone Safari", ip: "203.0.113.11" },
    { username: "john88", time: "27 Jun, 3:42 PM", result: "RM10 Free Credit", device: "iPhone Safari", ip: "203.0.113.11" },
    { username: "john88", time: "27 Jun, 3:42 PM", result: "RM10 Free Credit", device: "iPhone Safari", ip: "203.0.113.11" },
];

const LuckySpinManagement = () => {
    const [addOpen, setAddOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editData, setEditData] = useState({});
    const [activeCard, setActiveCard] = useState(topCards[0].label);
    const [prizeSettings, setPrizeSettings] = useState(PRIZE_SETTINGS_DATA);
    const [year, setYear] = useState("2025");
    const [spinItems, setSpinItems] = useState([]);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const fetchSpinItems = useCallback(async () => {
        try {
            setLoading(true);
            const items = await luckySpinItemsService.listItems();
            setSpinItems(items);
            setError('');
        } catch (err) {
            setError('Failed to fetch spin items');
            console.error('Failed to fetch spin items:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchMembers = useCallback(async () => {
        try {
            const membersData = await memberService.listMembers();
            setMembers(membersData);
        } catch (err) {
            console.error('Failed to fetch members:', err);
        }
    }, []);

    // Check authentication on component mount
    useEffect(() => {
        const checkAuth = async () => {
            if (!authService.isAuthenticated()) {
                navigate('/admin-login');
                return;
            }

            try {
                const isValid = await authService.verifyToken();
                if (!isValid) {
                    navigate('/admin-login');
                    return;
                }

                // Fetch initial data
                await fetchSpinItems();
                await fetchMembers();
            } catch (err) {
                console.error('Auth check failed:', err);
                navigate('/admin-login');
            }
        };

        checkAuth();
    }, [navigate]);

    const handleArchiveItem = async (uuid) => {
        if (!confirm('Are you sure you want to archive this item? This action cannot be undone.')) {
            return;
        }
        
        try {
            await luckySpinItemsService.archiveItem(uuid);
            await fetchSpinItems(); // Refresh the list
            setError(''); // Clear any existing errors
        } catch (err) {
            setError('Failed to archive item');
            console.error('Failed to archive item:', err);
        }
    };

    const handleCreateItem = async (itemData, imageFile) => {
        try {
            setModalLoading(true);
            setError('');
            
            let result;
            if (imageFile) {
                result = await luckySpinItemsService.createItemWithImage(itemData, imageFile);
            } else {
                result = await luckySpinItemsService.createItem(itemData);
            }
            
            await fetchSpinItems(); // Refresh the list
            setAddOpen(false); // Close modal
            
            // Show success message (you could use a toast library instead)
            alert(`Successfully created spin item: ${result.reward_name}`);
        } catch (err) {
            setError(`Failed to create item: ${err.message}`);
            console.error('Failed to create item:', err);
        } finally {
            setModalLoading(false);
        }
    };

    const handleUpdateItem = async (itemData, imageFile) => {
        try {
            setModalLoading(true);
            setError('');
            
            // For updates, if there's a new image, we need to use multipart form
            // Otherwise, use regular JSON update
            let result;
            if (imageFile) {
                result = await luckySpinItemsService.createItemWithImage(itemData, imageFile);
                // Note: The API might not support image updates via PUT, so we might need to handle this differently
                // You may need to check your backend API to see if it supports image updates
            } else {
                result = await luckySpinItemsService.updateItem(editData.uuid, itemData);
            }
            
            await fetchSpinItems(); // Refresh the list
            setEditOpen(false); // Close modal
            
            alert(`Successfully updated spin item: ${result.reward_name}`);
        } catch (err) {
            setError(`Failed to update item: ${err.message}`);
            console.error('Failed to update item:', err);
        } finally {
            setModalLoading(false);
        }
    };

    const handleCardClick = useCallback((label) => {
        setActiveCard(label);
    }, []);

    const handleSystemLimitChange = useCallback((idx, checked) => {
        setPrizeSettings((prev) => prev.map((s, i) => i === idx ? { ...s, systemLimit: checked } : s));
    }, []);

    return (
        <Tooltip.Provider>
            <div className="flex min-h-screen bg-black">
                <LeftSideBar />
                <div className="flex-1 p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-white">Lucky Spin Management</h1>
                        <button
                            onClick={async () => {
                                try {
                                    await authService.logout();
                                    navigate('/admin-login');
                                } catch (err) {
                                    console.error('Logout failed:', err);
                                    navigate('/admin-login');
                                }
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                    <div className="grid grid-cols-4 gap-6 mb-8">
                        {topCards.map((card) => (
                            <button
                                key={card.label}
                                className={`rounded-lg p-6 flex flex-row items-center justify-center transition-all duration-200 focus:outline-none cursor-pointer ${activeCard === card.label ? card.activeCardClass + ' ring-2 ring-yellow-400' : card.inactiveCardClass}`}
                                onClick={() => handleCardClick(card.label)}
                                style={activeCard === card.label ? {} : {}}
                            >
                                <img src={card.image} alt={card.label} className="h-12 w-12 object-contain mr-3" />
                                <span className={activeCard === card.label ? card.textClass : card.inactiveTextClass}>{card.label}</span>
                            </button>
                        ))}
                    </div>
                    {activeCard === "Prize Settings" ? (
                        <div className="bg-gray-900 rounded-lg p-6 ">
                            <h2 className="text-2xl font-semibold text-white mb-4">Prize Settings</h2>
                            <div className="bg-black rounded-lg overflow-hidden mb-4">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-white">
                                            <th className="text-left py-3 px-4 font-medium">Setting Name</th>
                                            <th className="text-left py-3 px-4 font-medium">Value</th>
                                            <th className="text-left py-3 px-4 font-medium">Editable</th>
                                            <th className="text-left py-3 px-4 font-medium">System Limit</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-gray-900">
                                        {prizeSettings.map((setting, idx) => (
                                            <tr key={idx} className="border-b border-[#DADADA]">
                                                <td className="py-3 px-4 text-gray-200">{setting.name}</td>
                                                <td className="py-3 px-4 text-gray-200">
                                                    <Tooltip.Root delayDuration={200}>
                                                        <Tooltip.Trigger asChild>
                                                            <span className="cursor-pointer">
                                                                {setting.value}
                                                            </span>
                                                        </Tooltip.Trigger>
                                                        <Tooltip.Portal>
                                                            <Tooltip.Content className="bg-gray-800 text-white px-4 py-2 rounded shadow-lg text-sm" sideOffset={5}>
                                                                {(() => {
                                                                    switch (setting.name) {
                                                                        case "Max Prize Pool Per Day":
                                                                            return "Maximum prize pool allowed per day.";
                                                                        case "Max Total Probability (%)":
                                                                            return "Total prize probability must stay under 100%.";
                                                                        case "Auto-disable Big Prizes":
                                                                            return "Automatically disables big prizes when limits are reached.";
                                                                        case "Enable Category Weighting":
                                                                            return "Enable weighting by prize category.";
                                                                        default:
                                                                            return setting.value;
                                                                    }
                                                                })()}
                                                                <Tooltip.Arrow className="fill-gray-800" />
                                                            </Tooltip.Content>
                                                        </Tooltip.Portal>
                                                    </Tooltip.Root>
                                                </td>
                                                <td className="py-3 px-4">
                                                    {setting.editable ? (
                                                        <button className="bg-green-500 text-white px-6 py-2 rounded font-bold">Edit</button>
                                                    ) : (
                                                        <span className="text-gray-500">No</span>
                                                    )}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <Switch.Root
                                                        checked={setting.systemLimit}
                                                        onCheckedChange={(checked) => handleSystemLimitChange(idx, checked)}
                                                        className="w-10 h-6 bg-gray-300 rounded-full data-[state=checked]:bg-purple-500 relative flex items-center transition-colors duration-200"
                                                        style={{ outline: 'none' }}
                                                        tabIndex={0}
                                                        aria-label="System Limit"
                                                    >
                                                        <Switch.Thumb
                                                            className="block w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 translate-x-1 data-[state=checked]:translate-x-5"
                                                        />
                                                    </Switch.Root>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="flex justify-end">
                                <button className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-black px-4 py-2 rounded font-bold">Add</button>
                            </div>
                        </div>
                    ) : activeCard === "Spin Items Panel" ? (
                        <div className="bg-gray-900 rounded-lg p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold text-white">Spin Items Panel Table</h2>
                                <div className="flex items-center gap-2">
                                    <button 
                                        className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-black px-6 py-2 rounded font-bold hover:from-yellow-600 hover:to-yellow-500 transition-colors"
                                        onClick={() => setAddOpen(true)}
                                    >
                                        Add New Spin Item
                                    </button>
                                </div>
                            </div>
                            <table className="w-full rounded overflow-hidden">
                                <thead>
                                    <tr className="bg-black text-white">
                                        <th className="text-left py-3 px-4 font-medium w-3/12">Reward Name</th>
                                        <th className="text-center py-3 px-4 font-medium w-2/12">Image</th>
                                        <th className="text-center py-3 px-4 font-medium w-2/12">Probability</th>
                                        <th className="text-center py-3 px-4 font-medium w-2/12">Quantity</th>
                                        <th className="text-center py-3 px-4 font-medium w-3/12">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan="5" className="py-8 text-center text-gray-400">
                                                <div className="flex items-center justify-center gap-2">
                                                    <div className="w-4 h-4 border-2 border-gray-400 border-t-yellow-500 rounded-full animate-spin"></div>
                                                    Loading spin items...
                                                </div>
                                            </td>
                                        </tr>
                                    ) : error ? (
                                        <tr>
                                            <td colSpan="5" className="py-8 text-center text-red-400">
                                                <div className="flex flex-col items-center gap-2">
                                                    <span>⚠️ {error}</span>
                                                    <button 
                                                        onClick={fetchSpinItems}
                                                        className="text-yellow-500 hover:text-yellow-400 text-sm underline"
                                                    >
                                                        Try again
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : spinItems.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="py-8 text-center text-gray-400">
                                                No spin items found. Click "Add" to create your first spin item.
                                            </td>
                                        </tr>
                                    ) : (
                                        spinItems.map((item, idx) => (
                                            <tr key={item.uuid || idx} className="border-b border-gray-800 bg-gray-900 hover:bg-gray-800 transition-colors">
                                                <td className="py-3 px-4 text-gray-200 text-left">
                                                    <div className="font-medium">{item.reward_name}</div>
                                                    {item.uuid && (
                                                        <div className="text-xs text-gray-400 mt-1">
                                                            ID: {item.uuid.substring(0, 8)}...
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <div className="flex items-center justify-center h-full">
                                                        {item.image && (item.image.endsWith('.png') || item.image.endsWith('.svg') || item.image.endsWith('.jpg') || item.image.endsWith('.jpeg') || item.image.startsWith('http') || item.image.startsWith('data:')) ? (
                                                            <img 
                                                                src={item.image} 
                                                                alt={item.reward_name} 
                                                                className="h-12 w-12 object-cover rounded border border-gray-600" 
                                                                onError={(e) => {
                                                                    e.target.style.display = 'none';
                                                                    e.target.nextSibling.style.display = 'block';
                                                                }}
                                                            />
                                                        ) : null}
                                                        <span className={`text-gray-400 text-sm ${item.image ? 'hidden' : ''}`}>No Image</span>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <div className="text-gray-200 font-mono">
                                                        {(parseFloat(item.probability) * 100).toFixed(2)}%
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <div className="text-gray-200">
                                                        {item.unlimited ? (
                                                            <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">
                                                                Unlimited
                                                            </span>
                                                        ) : (
                                                            <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">
                                                                {item.quantity}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition-colors"
                                                            onClick={() => { setEditData(item); setEditOpen(true); }}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
                                                            onClick={() => handleArchiveItem(item.uuid)}
                                                        >
                                                            Archive
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    ) : activeCard === "User Logs" ? (
                        <div className="bg-gray-900 rounded-lg p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-semibold text-white">User Logs</h2>
                                <button className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-black px-4 py-2 rounded font-bold flex items-center gap-2">
                                    <span>{year}</span>
                                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                </button>
                            </div>
                            <div className="bg-black rounded-lg overflow-hidden mb-4" style={{ maxHeight: '530px', overflowY: 'auto' }}>
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-black text-white">
                                            <th className="text-left py-3 px-4 font-medium">Username</th>
                                            <th className="text-left py-3 px-4 font-medium">Spin Time</th>
                                            <th className="text-left py-3 px-4 font-medium">Prize Result</th>
                                            <th className="text-left py-3 px-4 font-medium">Device</th>
                                            <th className="text-left py-3 px-4 font-medium">IP Address</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-gray-900">
                                        {USER_LOGS_DATA.map((log, idx) => (
                                            <tr key={idx} className={log.noWin ? "bg-red-200" : "border-b border-gray-800"}>
                                                <td className={`py-3 px-4 ${log.noWin ? "text-red-700 font-bold" : "text-gray-200"}`}>{log.username}</td>
                                                <td className={`py-3 px-4 ${log.noWin ? "text-red-700 font-bold" : "text-gray-200"}`}>{log.time}</td>
                                                <td className={`py-3 px-4 ${log.noWin ? "text-red-700 font-bold" : "text-gray-200"}`}>{log.result}</td>
                                                <td className={`py-3 px-4 ${log.noWin ? "text-red-700 font-bold" : "text-gray-200"}`}>{log.device}</td>
                                                <td className={`py-3 px-4 ${log.noWin ? "text-red-700 font-bold" : "text-gray-200"}`}>{log.ip}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : activeCard === "Daily Limits" ? (
                        <div className="bg-gray-900 rounded-lg p-6">
                            <div className="flex flex-col gap-4 mb-4">
                                <div className="flex items-center justify-between gap-2 w-full">
                                    <div className="flex gap-0.5">
                                        <input type="text" placeholder="Search.." className="w-md border  rounded px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                                        <button className="bg-yellow-200 text-yellow-700 px-2 py-1 rounded"><svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" stroke="#BBAA44" strokeWidth="2" /><path d="M21 21l-4.35-4.35" stroke="#BBAA44" strokeWidth="2" strokeLinecap="round" /></svg></button>
                                    </div>
                                    <div className="flex ml-4 gap-2">
                                        <button
                                            className={`px-4 py-1 rounded font-bold text-lg transition-all duration-200 focus:outline-none ${activeCard === 'Member Activity Overview Table' ? 'bg-gradient-to-r from-yellow-500 to-yellow-400 text-black' : 'bg-gray-800 text-white'}`}
                                            onClick={() => setActiveCard('Member Activity Overview Table')}
                                        >
                                            Member Activity Overview Table
                                        </button>
                                        <button
                                            className={`px-4 py-1 rounded font-bold text-lg transition-all duration-200 focus:outline-none ${activeCard === 'Daily Limits' ? 'bg-gradient-to-r from-yellow-500 to-yellow-400 text-black' : 'bg-gray-800 text-white'}`}
                                            onClick={() => setActiveCard('Daily Limits')}
                                        >
                                            Daily Limits
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-black rounded-lg overflow-hidden mb-4" style={{ maxHeight: '530px', overflowY: 'auto' }}>
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-black text-white">
                                            <th className="text-left py-3 px-4 font-medium">Member Name</th>
                                            <th className="text-left py-3 px-4 font-medium">Last Login</th>
                                            <th className="text-left py-3 px-4 font-medium">Section</th>
                                            <th className="text-left py-3 px-4 font-medium">Time Spent</th>
                                            <th className="text-left py-3 px-4 font-medium">VIP Tier</th>
                                            <th className="text-center py-3 px-4 font-medium">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-gray-900">
                                        {[...Array(12)].map((_, idx) => (
                                            <tr key={idx} className="border-b border-gray-800">
                                                <td className="py-3 px-4 text-gray-200">john88</td>
                                                <td className="py-3 px-4 text-gray-200">26 June, 2:44 PM</td>
                                                <td className="py-3 px-4 text-gray-200">Spin Wheel</td>
                                                <td className="py-3 px-4 text-gray-200">18 mins</td>
                                                <td className="py-3 px-4 text-gray-200">VIP 4</td>
                                                <td className="py-3 px-4 text-center">
                                                    <button className="border border-red-400 text-red-500 px-4 py-1 rounded font-bold bg-white">Set Limit</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="flex justify-end text-gray-400 text-xs mt-2">
                                <span>1-10 of 120</span>
                                <span className="ml-4">&lt; &gt;</span>
                            </div>
                        </div>
                    ) : null}
                    <SpinItemModal 
                        open={addOpen} 
                        setOpen={setAddOpen} 
                        mode="add" 
                        onSubmit={handleCreateItem}
                        loading={modalLoading}
                    />
                    <SpinItemModal 
                        open={editOpen} 
                        setOpen={setEditOpen} 
                        mode="edit" 
                        initialData={editData}
                        onSubmit={handleUpdateItem}
                        loading={modalLoading}
                    />
                </div>
            </div>
        </Tooltip.Provider>
    );
};

export default LuckySpinManagement;