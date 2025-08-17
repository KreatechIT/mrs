import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/shared/Header";
import slotImg from "@/assets/images/profile/777.png";
import tier1 from "@/assets/images/badges/tier-1.svg";
import tier2 from "@/assets/images/badges/tier-2.svg";
import tier3 from "@/assets/images/badges/tier-3.svg";
import tier4 from "@/assets/images/badges/tier-4.svg";
import tier5 from "@/assets/images/badges/tier-5.svg";
import tier6 from "@/assets/images/badges/tier-6.svg";
import tier7 from "@/assets/images/badges/tier-7.svg";
import tier8 from "@/assets/images/badges/tier-8.svg";
import tier9 from "@/assets/images/badges/tier-9.svg";

const ranks = [
  { name: "Bronze", img: tier1, number: 1 },
  { name: "Silver", img: tier2, number: 2 },
  { name: "Gold", img: tier3, number: 3 },
  { name: "Platinum", img: tier4, number: 4 },
  { name: "Diamond", img: tier5, number: 5 },
  { name: "Royal", img: tier6, number: 6 },
  { name: "Grandmaster", img: tier7, number: 7 },
  { name: "Legend", img: tier8, number: 8 },
  { name: "Supreme King", img: tier9, number: 9 },
];

import MainNav from "@/components/shared/MainNav";
import { useState } from "react";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const headerVariants = {
  hidden: {
    opacity: 0,
    y: -30
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 15
    }
  }
};

const cardVariants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    y: 50
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const vipTitleVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    rotateY: -90
  },
  visible: {
    opacity: 1,
    scale: 1,
    rotateY: 0,
    transition: {
      type: "spring",
      stiffness: 150,
      damping: 20,
      delay: 0.4
    }
  }
};

const slotImgVariants = {
  hidden: {
    opacity: 0,
    scale: 0.5,
    rotate: -180
  },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 15,
      delay: 0.5
    }
  }
};

const currentRankVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.9
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 150,
      damping: 20,
      delay: 0.6
    }
  }
};

const rankGridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.7
    }
  }
};

const rankItemVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.8
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 150,
      damping: 20
    }
  }
};

const paginationVariants = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 20,
      delay: 1.0
    }
  }
};

const tableVariants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      delay: 1.2,
      staggerChildren: 0.03,
      delayChildren: 1.3
    }
  }
};

const tableRowVariants = {
  hidden: {
    opacity: 0,
    x: -20
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 20
    }
  }
};

const termsVariants = {
  hidden: {
    opacity: 0,
    y: 30
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      delay: 1.5,
      staggerChildren: 0.1,
      delayChildren: 1.6
    }
  }
};

const termItemVariants = {
  hidden: {
    opacity: 0,
    x: -20
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 20
    }
  }
};

export default function VipPage() {
  const [page, setPage] = useState(0);
  const pageSize = 5;
  const totalPages = Math.ceil(ranks.length / pageSize);
  const pagedRanks = ranks.slice(page * pageSize, page * pageSize + pageSize);

  // Create placeholders to maintain consistent grid
  const displayRanks = [...pagedRanks];
  while (displayRanks.length < pageSize) {
    displayRanks.push(null);
  }

  return (
    <motion.div
      className="min-h-svh w-full max-w-md mx-auto bg-black flex flex-col items-center justify-between pb-[5rem] overflow-y-auto scrollbar-thin scrollbar-thumb-yellow-400 scrollbar-track-black"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={headerVariants}>
        <Header />
      </motion.div>

      <div className="flex-1 w-full flex flex-col items-center justify-start pt-6 px-4">
        <motion.div
          className="w-full max-w-md mx-auto bg-gradient-to-b from-yellow-900/40 to-black rounded-xl shadow-lg p-4"
          variants={cardVariants}
          whileHover={{
            scale: 1.02,
            boxShadow: "0 20px 40px rgba(255, 193, 7, 0.1)",
            transition: { type: "spring", stiffness: 300 }
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <motion.div variants={vipTitleVariants}>
              <motion.h1
                className="text-6xl font-extrabold text-yellow-400 leading-none"
                whileHover={{
                  scale: 1.05,
                  textShadow: "0 0 20px #FBBF24",
                  transition: { duration: 0.3 }
                }}
              >
                VIP
              </motion.h1>
              <motion.div
                className="text-2xl font-bold text-gray-200 mt-2 tracking-wide"
                initial={{ opacity: 0, x: -20 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  transition: { delay: 0.7 }
                }}
              >
                REWARD SYSTEM
              </motion.div>
            </motion.div>
            <motion.img
              src={slotImg}
              alt="VIP Slot"
              className="w-36 h-36"
              variants={slotImgVariants}
              whileHover={{
                rotate: 360,
                scale: 1.1,
                filter: "brightness(1.2)",
                transition: {
                  rotate: { duration: 1, ease: "easeInOut" },
                  scale: { type: "spring", stiffness: 300 }
                }
              }}
            />
          </div>

          <motion.div
            className="text-center text-xl font-bold text-orange-400 mb-8"
            variants={currentRankVariants}
            whileHover={{
              scale: 1.1,
              color: "#FBBF24",
              textShadow: "0 0 15px #FBBF24",
              transition: { duration: 0.2 }
            }}
          >
            Your current rank is Silver
          </motion.div>

          {/* Fixed grid container */}
          <AnimatePresence mode="wait">
            <motion.div
              className="grid grid-cols-5 pb-2 w-full max-w-sm mx-auto gap-7"
              key={page}
              variants={rankGridVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            >
              {displayRanks.map((rank, index) => (
                <motion.div
                  key={rank?.number || `placeholder-${index}`}
                  className="flex flex-col items-center"
                  variants={rankItemVariants}
                  whileHover={rank ? {
                    scale: 1.1,
                    y: -5,
                    transition: { type: "spring", stiffness: 300 }
                  } : {}}
                >
                  {rank ? (
                    <>
                      <motion.div
                        className="w-14 h-14 mb-2 flex items-center justify-center"
                        whileHover={{
                          rotate: 15,
                          scale: 1.2,
                          filter: "brightness(1.3) drop-shadow(0 0 10px rgba(255, 193, 7, 0.5))",
                          transition: { type: "spring", stiffness: 300 }
                        }}
                      >
                        <img src={rank.img} alt={rank.name} className="w-full h-full object-contain" />
                      </motion.div>
                      <motion.div
                        className="text-yellow-400 font-bold text-sm mb-1"
                        whileHover={{
                          scale: 1.2,
                          textShadow: "0 0 10px #FBBF24"
                        }}
                      >
                        {rank.number}
                      </motion.div>
                      <motion.div
                        className="text-gray-200 text-xs text-center leading-tight whitespace-nowrap"
                        whileHover={{
                          color: "#FBBF24",
                          scale: 1.1
                        }}
                      >
                        {rank.name}
                      </motion.div>
                    </>
                  ) : (
                    // Invisible placeholder to maintain grid structure
                    <>
                      <div className="w-14 h-14 mb-2"></div>
                      <div className="text-sm mb-1 opacity-0">0</div>
                      <div className="text-xs opacity-0">Placeholder</div>
                    </>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          <motion.div
            className="flex justify-center items-center gap-6 mt-6 w-full"
            variants={paginationVariants}
          >
            <motion.button
              className="w-8 h-8 rounded-full bg-yellow-400 text-black font-bold disabled:opacity-40 flex items-center justify-center hover:bg-yellow-300 transition-colors"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              whileHover={{
                scale: 1.1,
                boxShadow: "0 0 15px rgba(255, 193, 7, 0.5)"
              }}
              whileTap={{ scale: 0.9 }}
            >
              ←
            </motion.button>
            <motion.span
              className="text-yellow-400 text-sm font-bold"
              whileHover={{
                scale: 1.1,
                textShadow: "0 0 10px #FBBF24"
              }}
            >
              {page + 1} / {totalPages}
            </motion.span>
            <motion.button
              className="w-8 h-8 rounded-full bg-yellow-400 text-black font-bold disabled:opacity-40 flex items-center justify-center hover:bg-yellow-300 transition-colors"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              whileHover={{
                scale: 1.1,
                boxShadow: "0 0 15px rgba(255, 193, 7, 0.5)"
              }}
              whileTap={{ scale: 0.9 }}
            >
              →
            </motion.button>
          </motion.div>

          {/* VIP Tier Table */}
          <motion.div
            className="mt-8 w-full"
            variants={tableVariants}
          >
            <div className="rounded-xl border border-yellow-400 overflow-hidden">
              <table className="w-full text-left bg-black">
                <thead>
                  <tr className="bg-gradient-to-r from-yellow-300 to-yellow-500 text-black text-sm">
                    <th className="px-4 py-3 font-bold">Tier Level</th>
                    <th className="px-4 py-3 font-bold">Deposit Requirement</th>
                    <th className="px-4 py-3 font-bold">Points Rate %</th>
                  </tr>
                </thead>
                <tbody className="text-white text-xs">
                  {[
                    { img: tier1, name: "1 Deposit Ticket", deposit: "1 Deposit Ticket", rate: "10.00%" },
                    { img: tier2, name: "MYR 3,888", deposit: "MYR 3,888", rate: "10.50%" },
                    { img: tier3, name: "MYR 10,000", deposit: "MYR 10,000", rate: "11.00%" },
                    { img: tier4, name: "MYR 50,000", deposit: "MYR 50,000", rate: "11.50%" },
                    { img: tier5, name: "MYR 300,000", deposit: "MYR 300,000", rate: "12.00%" },
                    { img: tier6, name: "MYR 800,000", deposit: "MYR 800,000", rate: "12.50%" },
                    { img: tier7, name: "MYR 1,500,000", deposit: "MYR 1,500,000", rate: "13.00%" },
                    { img: tier8, name: "MYR 3,000,000", deposit: "MYR 3,000,000", rate: "13.50%" },
                    { img: tier9, name: "By Invitation", deposit: "By Invitation", rate: "14.00%" }
                  ].map((tier, index) => (
                    <motion.tr
                      key={index}
                      variants={tableRowVariants}
                      whileHover={{
                        backgroundColor: "rgba(255, 193, 7, 0.1)",
                        scale: 1.02,
                        transition: { duration: 0.2 }
                      }}
                    >
                      <td className="px-4 py-3">
                        <motion.img
                          src={tier.img}
                          alt={tier.name}
                          className="inline w-8 h-8 align-middle mr-2"
                          whileHover={{
                            scale: 1.2,
                            rotate: 10,
                            filter: "brightness(1.3)"
                          }}
                        />
                        {tier.name}
                      </td>
                      <td className="px-4 py-3">{tier.deposit}</td>
                      <td className="px-4 py-3">{tier.rate}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Terms & Conditions */}
          <motion.div
            className="mt-8 w-full"
            variants={termsVariants}
          >
            <div className="mb-2">
              <motion.span
                className="inline-block bg-yellow-400 text-black font-bold px-4 py-2 rounded-t-lg text-sm"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 15px rgba(255, 193, 7, 0.5)"
                }}
              >
                Terms & Conditions
              </motion.span>
            </div>
            <motion.div
              className="bg-black border border-yellow-400 rounded-b-xl p-4 text-xs text-white space-y-2"
              whileHover={{
                borderColor: "#FBBF24",
                boxShadow: "0 0 20px rgba(255, 193, 7, 0.1)"
              }}
            >
              {[
                "Credit cannot mixed with other deposits and bonuses.",
                "1 Member / 1 ID / 1 Name can only participate in this Lucky Spin Event.",
                "Only slot games are allowed.",
                "The name on the bank account must match the registered name. If they do not match or if the bank account number is incorrect, all winnings will be forfeited."
              ].map((term, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-2"
                  variants={termItemVariants}
                  whileHover={{
                    x: 5,
                    color: "#FDE047"
                  }}
                >
                  <motion.span
                    className="text-yellow-400"
                    whileHover={{ scale: 1.5 }}
                  >
                    •
                  </motion.span>
                  <span>{term}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      <motion.div variants={headerVariants}>
        <MainNav />
      </motion.div>
    </motion.div>
  );
}