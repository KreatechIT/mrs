import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, Bell } from 'lucide-react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, ResponsiveContainer, AreaChart, Area, Cell } from 'recharts';
import LeftSideBar from '@/components/shared/LeftSideBar';
import { memberService } from '@/api/services/MemberService.js';
import { authService } from '@/api/services/AuthService.js';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const totalPages = 35;
    const itemsPerPage = 15;

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
                
                // Fetch members data
                await fetchMembers();
            } catch (err) {
                console.error('Auth check failed:', err);
                navigate('/admin-login');
            }
        };

        checkAuth();
    }, [navigate]);

    const fetchMembers = async () => {
        try {
            setLoading(true);
            const membersData = await memberService.listMembers();
            setMembers(membersData);
            setError('');
        } catch (err) {
            setError('Failed to fetch members data');
            console.error('Failed to fetch members:', err);
        } finally {
            setLoading(false);
        }
    };

    // Filter members based on search term
    const filteredMembers = members.filter(member =>
        member.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Transform member data for display
    const memberData = filteredMembers.map(member => ({
        name: member.username,
        lastLogin: member.updated_at ? new Date(member.updated_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }) : 'N/A',
        activeSection: 'Spin Wheel', // Default since API doesn't provide this
        timeSpent: '16 mins', // Default since API doesn't provide this
        vipTier: member.tier || 'N/A'
    }));

    // Sample chart data - updated to match the image
    const chartData = [
        { day: 'Sat', value: 3000 },
        { day: 'Sun', value: 2500 },
        { day: 'Mon', value: 3800 },
        { day: 'Tue', value: 2600 },
        { day: 'Wed', value: 1800 },
        { day: 'Thu', value: 3600 },
        { day: 'Fri', value: 3200 },
    ];



    const BarChart = ({ data }) => {
        return (
            <div className="h-40 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <XAxis
                            dataKey="day"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9CA3AF', fontSize: 12 }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9CA3AF', fontSize: 12 }}
                            domain={[0, 8000]}
                            tickFormatter={(value) => `${value / 1000}K`}
                        />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.day === 'Thu' ? '#EAB308' : '#F97316'} />
                            ))}
                        </Bar>
                    </RechartsBarChart>
                </ResponsiveContainer>
            </div>
        );
    };

    const LineChart = () => {
        // Data points to match the smooth curve in the reference image
        const checkInData = [
            { day: 'Sat', value: 5000 },
            { day: 'Sun', value: 4200 },
            { day: 'Mon', value: 6000 },
            { day: 'Tue', value: 3500 },
            { day: 'Wed', value: 5000 },
            { day: 'Thu', value: 6500 },
            { day: 'Fri', value: 1800 },
        ];

        return (
            <div className="relative">
                {/* Percentage indicator */}
                <div className="absolute top-0 left-0 z-10">
                    <div className="flex items-center text-green-400 text-sm font-medium">
                        <span className="mr-1">↗</span>
                        <span>+0.85%</span>
                    </div>
                </div>

                <div className="h-32 w-full mt-6">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={checkInData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#F97316" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="day"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                domain={[0, 8000]}
                                tickFormatter={(value) => `${value / 1000}K`}
                            />
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#F97316"
                                strokeWidth={3}
                                fill="url(#colorGradient)"
                                dot={{ fill: '#F97316', strokeWidth: 2, r: 4 }}
                                activeDot={{ r: 6, stroke: '#F97316', strokeWidth: 2, fill: '#000' }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );
    };

    const CircularProgress = ({ percentage, total, label }) => {
        const radius = 80;
        const strokeWidth = 12;
        const normalizedRadius = radius - strokeWidth * 2;
        const circumference = normalizedRadius * 2 * Math.PI;
        const strokeDasharray = `${circumference} ${circumference}`;
        const strokeDashoffset = circumference - (percentage / 100) * circumference;
        return (
            <div className="relative">
                <svg
                    height={radius * 2}
                    width={radius * 2}
                    className="transform -rotate-90"
                >
                    {/* Background circle */}
                    <circle
                        stroke="#374151"
                        fill="transparent"
                        strokeWidth={strokeWidth}
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                    />
                    {/* Progress circle */}
                    <circle
                        stroke="#F59E0B"
                        fill="transparent"
                        strokeWidth={strokeWidth}
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                        className="transition-all duration-500 ease-in-out"
                    />
                </svg>
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-green-400 text-sm font-medium">{label}</div>
                    <div className="text-white text-3xl font-bold">{total.toLocaleString()}</div>
                </div>
            </div>

        );
    };

    return (
        <div className="flex bg-gray-900 text-white min-h-screen">
            <LeftSideBar />

            <div className="flex-1 p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold">Home Dashboard</h1>
                    <div className="flex items-center space-x-4">
                        <Bell className="w-6 h-6 text-gray-400" />
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
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                            Logout
                        </button>
                        <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
                    </div>
                </div>

                {/* Top Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Member Activity Overview */}
                    <div className="bg-gray-800 rounded-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">Member Activity Overview</h2>
                            <span className="bg-yellow-500 text-black px-2 py-1 rounded text-xs">last 7 days</span>
                        </div>
                        <div className="text-sm text-gray-400 mb-2">Active Users: 169</div>
                        <BarChart data={chartData} />
                    </div>

                    {/* Daily Check-In Summary */}
                    <div className="bg-gray-800 rounded-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">Daily Check-In Summary</h2>
                            <span className="bg-yellow-500 text-black px-2 py-1 rounded text-xs">This Week</span>
                        </div>
                        <div className="text-sm text-gray-400 mb-2">
                            <span className="bg-gray-700 px-2 py-1 rounded text-xs">Week/Month</span>
                        </div>
                        <LineChart />
                    </div>

                    {/* Total Active Users */}
                    <div className="bg-gray-800 rounded-lg p-6 flex flex-col items-center justify-center">
                        <div className=" flex flex-col items-center justify-center max-w-sm mx-auto">
                            <h2 className="text-white text-lg font-semibold mb-6">Total Active Users</h2>
                            <CircularProgress percentage={78} total={2500} label="Active Users" />
                            <div className="mt-6 flex items-center space-x-3">
                                <div className="bg-yellow-500 text-black px-2 py-1 rounded text-xs font-semibold">
                                    78%
                                </div>
                                <div className="text-white text-sm">
                                    <div className="font-medium">Today Active Users</div>
                                    <div className="text-gray-300">935</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Member Activity Table */}
                <div className="bg-gray-800 rounded-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-semibold">Member Activity Overview Table</h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-700">
                                    <th className="text-left py-3 px-4 font-medium">Member Name ↑</th>
                                    <th className="text-left py-3 px-4 font-medium">Last Login ↑</th>
                                    <th className="text-left py-3 px-4 font-medium">Active Section ↑</th>
                                    <th className="text-left py-3 px-4 font-medium">Time Spent ↑</th>
                                    <th className="text-left py-3 px-4 font-medium">VIP Tier ↑</th>
                                </tr>
                            </thead>
                            <tbody>
                                {memberData.map((member, index) => (
                                    <tr key={index} className="border-b border-gray-700 hover:bg-gray-750">
                                        <td className="py-3 px-4">{member.name}</td>
                                        <td className="py-3 px-4 text-gray-400">{member.lastLogin}</td>
                                        <td className="py-3 px-4">{member.activeSection}</td>
                                        <td className="py-3 px-4">{member.timeSpent}</td>
                                        <td className="py-3 px-4">
                                            <span className="text-yellow-500">{member.vipTier}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-between items-center mt-6">
                        <span className="text-sm text-gray-400">
                            1-15 of 525
                        </span>
                        <div className="flex items-center space-x-2">
                            <button className="p-2 rounded hover:bg-gray-700">
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="text-sm">
                                {currentPage} of {totalPages}
                            </span>
                            <button className="p-2 rounded hover:bg-gray-700">
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;