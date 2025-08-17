import { motion } from "framer-motion";
import Header from "@/components/shared/Header";
import MainNav from "@/components/shared/MainNav";

import badgeIcon from "@/assets/images/icons/badge-achivements.svg";
import tier1Icon from "@/assets/images/badges/tier-1.svg";
import tier2Icon from "@/assets/images/badges/tier-2.svg";
import tier3Icon from "@/assets/images/badges/tier-3.svg";

const achievements = [
    {
        title: "Tier 1 Badge",
        description: "Awarded for first deposit.",
        icon: tier1Icon,
        achieved: true,
    },
    {
        title: "Tier 2 Badge",
        description: "Awarded for 10 deposits.",
        icon: tier2Icon,
        achieved: false,
    },
    {
        title: "Tier 3 Badge",
        description: "Awarded for 50 deposits.",
        icon: tier3Icon,
        achieved: false,
    },
    // Add more badges as needed
];

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            delayChildren: 0.2,
            staggerChildren: 0.15
        }
    }
};

const cardVariants = {
    hidden: {
        y: 50,
        opacity: 0,
        scale: 0.8
    },
    visible: {
        y: 0,
        opacity: 1,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 12
        }
    }
};

const badgeVariants = {
    hidden: {
        scale: 0,
        rotate: -180
    },
    visible: {
        scale: 1,
        rotate: 0,
        transition: {
            type: "spring",
            stiffness: 200,
            damping: 10
        }
    }
};

const achievedBadgeVariants = {
    hidden: {
        scale: 0,
        rotate: -180
    },
    visible: {
        scale: 1,
        rotate: 0,
        transition: {
            type: "spring",
            stiffness: 200,
            damping: 10,
            delay: 0.3
        }
    }
};

const headerVariants = {
    hidden: {
        x: -50,
        opacity: 0
    },
    visible: {
        x: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 120,
            damping: 10
        }
    }
};

const mainCardVariants = {
    hidden: {
        y: -30,
        opacity: 0,
        scale: 0.95
    },
    visible: {
        y: 0,
        opacity: 1,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15
        }
    }
};

const achievedTagVariants = {
    hidden: {
        scale: 0,
        y: 10
    },
    visible: {
        scale: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 10,
            delay: 0.5
        }
    }
};

export default function AchievementPage() {
    return (
        <div className="min-h-svh w-full max-w-md mx-auto bg-black flex flex-col items-center justify-between pb-4">
            <Header />
            <motion.div
                className="flex-1 w-full flex flex-col items-center justify-start pt-6 px-4"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <motion.div
                    className="w-full max-w-md mx-auto bg-gradient-to-b from-yellow-900/40 to-black rounded-xl shadow-lg p-4"
                    variants={mainCardVariants}
                    whileHover={{
                        scale: 1.02,
                        transition: { type: "spring", stiffness: 300 }
                    }}
                >
                    <motion.div
                        className="flex items-center gap-2 mb-6"
                        variants={headerVariants}
                    >
                        <motion.img
                            src={badgeIcon}
                            alt="Badge Icon"
                            className="w-8 h-8"
                            initial={{ rotate: 0 }}
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatDelay: 3,
                                ease: "easeInOut"
                            }}
                        />
                        <motion.h2
                            className="text-2xl font-bold text-white"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            Badges & Achievements
                        </motion.h2>
                    </motion.div>
                    <motion.div
                        className="grid grid-cols-2 gap-4"
                        variants={containerVariants}
                    >
                        {achievements.map((badge, idx) => (
                            <motion.div
                                key={idx}
                                className={`flex flex-col items-center bg-black border border-yellow-400 rounded-xl p-3 shadow-lg ${badge.achieved ? "" : "opacity-40"}`}
                                variants={cardVariants}
                                whileHover={{
                                    scale: badge.achieved ? 1.05 : 1.02,
                                    borderColor: badge.achieved ? "#fbbf24" : "#854d0e",
                                    boxShadow: badge.achieved ? "0 0 20px rgba(251, 191, 36, 0.3)" : "0 0 10px rgba(133, 77, 14, 0.2)",
                                    transition: { type: "spring", stiffness: 300 }
                                }}
                                whileTap={{
                                    scale: 0.95,
                                    transition: { type: "spring", stiffness: 400 }
                                }}
                            >
                                <motion.img
                                    src={badge.icon}
                                    alt={badge.title}
                                    className="w-16 h-16 mb-2"
                                    variants={badge.achieved ? achievedBadgeVariants : badgeVariants}
                                    whileHover={badge.achieved ? {
                                        rotate: [0, -10, 10, 0],
                                        transition: { duration: 0.5 }
                                    } : {}}
                                />
                                <motion.div
                                    className="text-yellow-400 font-bold text-lg mb-1"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.15 + 0.4 }}
                                >
                                    {badge.title}
                                </motion.div>
                                <motion.div
                                    className="text-white text-xs text-center"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: idx * 0.15 + 0.5 }}
                                >
                                    {badge.description}
                                </motion.div>
                                {badge.achieved && (
                                    <motion.span
                                        className="mt-2 px-2 py-1 bg-yellow-400 text-black text-xs rounded-full"
                                        variants={achievedTagVariants}
                                        whileHover={{
                                            scale: 1.1,
                                            backgroundColor: "#fbbf24",
                                            transition: { type: "spring", stiffness: 400 }
                                        }}
                                        whileTap={{
                                            scale: 0.9,
                                            transition: { type: "spring", stiffness: 500 }
                                        }}
                                    >
                                        Achieved
                                    </motion.span>
                                )}
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </motion.div>
            <MainNav />
        </div>
    );
}