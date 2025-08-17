import { motion } from "framer-motion";
import Header from "@/components/shared/Header";
import MainNav from "@/components/shared/MainNav";

const leaderboardData = [
  { rank: 1, player: "LuckyMaster", amount: "RM 5,555" },
  { rank: 2, player: "LuckyMaster", amount: "RM 5,555" },
  { rank: 3, player: "LuckyMaster", amount: "RM 5,555" },
  { rank: 4, player: "LuckyMaster", amount: "RM 5,555" },
  { rank: 5, player: "LuckyMaster", amount: "RM 5,555" },
  { rank: 6, player: "LuckyMaster", amount: "RM 5,555" },
  { rank: 7, player: "LuckyMaster", amount: "RM 5,555" },
  { rank: 8, player: "LuckyMaster", amount: "RM 5,555" },
  { rank: 9, player: "LuckyMaster", amount: "RM 5,555" },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.1
    }
  }
};

const cardVariants = {
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

const titleVariants = {
  hidden: {
    y: -20,
    opacity: 0
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 10
    }
  }
};

const tableVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.05
    }
  }
};

const headerRowVariants = {
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

const rowVariants = {
  hidden: {
    x: -30,
    opacity: 0,
    scale: 0.95
  },
  visible: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12
    }
  }
};

const cellVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 }
  }
};

// Get special styling for top 3 ranks
const getTopRankStyling = (rank) => {
  switch (rank) {
    case 1:
      return {
        glow: "0 0 15px rgba(255, 215, 0, 0.5)",
        scale: 1.02,
        backgroundColor: "rgba(255, 215, 0, 0.1)"
      };
    case 2:
      return {
        glow: "0 0 10px rgba(192, 192, 192, 0.4)",
        scale: 1.01,
        backgroundColor: "rgba(192, 192, 192, 0.05)"
      };
    case 3:
      return {
        glow: "0 0 8px rgba(205, 127, 50, 0.4)",
        scale: 1.005,
        backgroundColor: "rgba(205, 127, 50, 0.05)"
      };
    default:
      return {
        glow: "none",
        scale: 1,
        backgroundColor: "transparent"
      };
  }
};

export default function LeaderboardPage() {
  return (
    <div className="min-h-svh w-full max-w-md mx-auto bg-black flex flex-col items-center justify-between pb-4 overflow-x-hidden">
      <Header />
      <motion.div
        className="flex-1 w-full flex flex-col items-center justify-start pt-6 px-4"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div
          className="w-full max-w-md mx-auto bg-gradient-to-b from-yellow-900/40 to-black rounded-xl shadow-lg p-4"
          variants={cardVariants}
          whileHover={{
            transition: { type: "spring", stiffness: 300 }
          }}
        >
          <motion.h2
            className="text-center text-2xl font-bold text-white mb-6"
            variants={titleVariants}
            initial={{ opacity: 0, y: -20 }}
            animate={{
              opacity: 1,
              y: 0,
              backgroundImage: ["linear-gradient(45deg, #fbbf24, #f59e0b)", "linear-gradient(45deg, #f59e0b, #fbbf24)"],
            }}
            transition={{
              duration: 0.5,
              backgroundImage: { duration: 2, repeat: Infinity, repeatType: "reverse" }
            }}
          >
            The Top 10 players
          </motion.h2>
          <motion.div
            className="overflow-x-auto"
            variants={tableVariants}
          >
            <motion.table
              className="w-full text-left border-separate border-spacing-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <thead>
                <motion.tr variants={headerRowVariants}>
                  <motion.th
                    className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-bold py-2 px-4 rounded-tl-lg"
                    initial={{ rotateY: -90, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
                  >
                    Rank
                  </motion.th>
                  <motion.th
                    className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-bold py-2 px-4"
                    initial={{ rotateY: -90, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
                  >
                    Players
                  </motion.th>
                  <motion.th
                    className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-bold py-2 px-4 rounded-tr-lg"
                    initial={{ rotateY: -90, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    transition={{ delay: 0.7, type: "spring", stiffness: 100 }}
                  >
                    Win Amount
                  </motion.th>
                </motion.tr>
              </thead>
              <tbody>
                {leaderboardData.map((row) => {
                  const topRankStyling = getTopRankStyling(row.rank);

                  return (
                    <motion.tr
                      key={row.rank}
                      variants={rowVariants}
                      whileHover={{
                        scale: topRankStyling.scale,
                        boxShadow: topRankStyling.glow,
                        backgroundColor: topRankStyling.backgroundColor,
                        transition: { type: "spring", stiffness: 300 }
                      }}
                      whileTap={{
                        scale: 0.98,
                        transition: { type: "spring", stiffness: 400 }
                      }}
                    >
                      <motion.td
                        className="border border-yellow-400 px-4 py-2 text-yellow-400 font-bold rounded-l-lg bg-black"
                        variants={cellVariants}
                        whileHover={row.rank <= 3 ? {
                          color: row.rank === 1 ? "#FFD700" : row.rank === 2 ? "#C0C0C0" : "#CD7F32",
                          scale: 1.1,
                          transition: { type: "spring", stiffness: 300 }
                        } : {}}
                      >
                        {row.rank === 1 && (
                          <motion.span
                            initial={{ rotate: 0 }}
                            animate={{ rotate: [0, -5, 5, 0] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                          >
                            👑 {row.rank}
                          </motion.span>
                        )}
                        {row.rank === 2 && (
                          <motion.span
                            initial={{ scale: 1 }}
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
                          >
                            🥈 {row.rank}
                          </motion.span>
                        )}
                        {row.rank === 3 && (
                          <motion.span
                            initial={{ y: 0 }}
                            animate={{ y: [0, -2, 0] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
                          >
                            🥉 {row.rank}
                          </motion.span>
                        )}
                        {row.rank > 3 && row.rank}
                      </motion.td>
                      <motion.td
                        className="border border-yellow-400 px-4 py-2 text-white bg-black"
                        variants={cellVariants}
                        whileHover={{
                          color: "#fbbf24",
                          transition: { duration: 0.2 }
                        }}
                      >
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: row.rank * 0.1 + 0.5 }}
                        >
                          {row.player}
                        </motion.span>
                      </motion.td>
                      <motion.td
                        className="border border-yellow-400 px-4 py-2 text-yellow-200 rounded-r-lg bg-black"
                        variants={cellVariants}
                        whileHover={{
                          color: "#fbbf24",
                          scale: 1.05,
                          transition: { type: "spring", stiffness: 300 }
                        }}
                      >
                        <motion.span
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            delay: row.rank * 0.1 + 0.6,
                            type: "spring",
                            stiffness: 150
                          }}
                        >
                          {row.amount}
                        </motion.span>
                      </motion.td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </motion.table>
          </motion.div>
        </motion.div>
      </motion.div>
      <MainNav />
    </div>
  );
}