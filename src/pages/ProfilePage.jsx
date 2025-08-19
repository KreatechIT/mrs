import { motion } from "framer-motion";
import Header from "@/components/shared/Header";
import { Link, useNavigate } from "react-router-dom";
import MainNav from "@/components/shared/MainNav";
import Avatar from "@/assets/images/profile/avatar.png";
import Transaction from "@/assets/images/icons/transaction.png";
import Badge from "@/assets/images/icons/badge.png";
import Leaderboard from "@/assets/images/icons/leaderBoard.png";
import Crown from "@/assets/images/icons/crown.png";
import Logout from "@/assets/images/icons/logout.png";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const headerVariants = {
  hidden: {
    opacity: 0,
    y: -20
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

const asideVariants = {
  hidden: {
    opacity: 0,
    x: -50,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const userInfoVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.9
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

const avatarVariants = {
  hidden: {
    opacity: 0,
    scale: 0.3,
    rotate: -180
  },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 15,
      delay: 0.3
    }
  }
};

const userTextVariants = {
  hidden: {
    opacity: 0,
    x: -20
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 150,
      damping: 20,
      delay: 0.4
    }
  }
};

const navVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.5
    }
  }
};

const navItemVariants = {
  hidden: {
    opacity: 0,
    x: -30,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 15
    }
  }
};

const iconVariants = {
  hover: {
    scale: 1.2,
    rotate: 10,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  },
  tap: {
    scale: 0.9,
    rotate: -5,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 20
    }
  }
};

const textVariants = {
  hover: {
    x: 5,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  }
};

const leaderboardVariants = {
  hover: {
    scale: 1.03,
    y: -2,
    backgroundColor: "rgba(250, 204, 21, 0.1)",
    boxShadow: "0 4px 20px rgba(250, 204, 21, 0.3)",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  }
};

export default function ProfilePage() {
  const navigate = useNavigate();

  return (
    <motion.main
      className="h-svh overflow-hidden w-full max-w-sm mx-auto relative"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Header />

      <motion.aside
        className="w-64 min-h-svh flex flex-col py-6 px-4"
        style={{
          background:
            'linear-gradient(0deg, rgba(255,255,132,0.1), rgba(255,255,132,0.1)), linear-gradient(3.06deg, rgba(242,195,107,0) -74.37%, rgba(221,143,31,0.1) 94%)',
        }}
        variants={asideVariants}
      >
        {/* User Info */}
        <motion.button
          className="flex items-center gap-2 mb-8 w-full focus:outline-none cursor-pointer"
          onClick={() => navigate('/userprofile')}
          style={{ background: 'none', border: 'none', padding: 0 }}
          variants={userInfoVariants}
          whileHover={{
            scale: 1.02,
            y: -2,
            transition: { type: "spring", stiffness: 300 }
          }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div
            className="w-14 h-14 rounded-full bg-gray-700 mb-2 flex items-center justify-center overflow-hidden"
            variants={avatarVariants}
            whileHover={{
              scale: 1.1,
              rotate: 5,
              boxShadow: "0 0 20px rgba(242, 195, 107, 0.5)",
              transition: { type: "spring", stiffness: 300 }
            }}
          >
            <img
              src={Avatar}
              alt="Avatar"
              className="w-full h-full object-cover rounded-full"
              style={{ background: '#222' }}
            />
          </motion.div>
          <motion.div
            className="text-left"
            variants={userTextVariants}
          >
            <motion.div
              className="text-lg font-bold text-white"
              whileHover={{
                scale: 1.05,
                color: "#F2C36B",
                transition: { duration: 0.2 }
              }}
            >
              Lucky<span className="text-yellow-400">Master21</span>
            </motion.div>
            <motion.div
              className="text-sm text-gray-300"
              whileHover={{
                scale: 1.1,
                color: "#FBBF24",
                transition: { duration: 0.2 }
              }}
            >
              15,350 pts
            </motion.div>
          </motion.div>
        </motion.button>

        {/* Navigation Items */}
        <motion.nav
          className="flex flex-col gap-2"
          variants={navVariants}
        >
          <motion.div variants={navItemVariants}>
            <Link
              to="/history"
              className="flex items-center gap-3 py-2 border-b border-white/30 transition-colors duration-150 hover:bg-white/10 rounded cursor-pointer"
            >
              <motion.div
                variants={iconVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <motion.img
                  src={Transaction}
                  alt="Transaction"
                  className="w-5 h-5"
                  whileHover={{ filter: "brightness(1.3)" }}
                />
              </motion.div>
              <motion.span
                className="text-white text-base"
                variants={textVariants}
                whileHover="hover"
              >
                Transaction History
              </motion.span>
            </Link>
          </motion.div>

          <motion.div variants={navItemVariants}>
            <Link
              to="/badge"
              className="flex items-center gap-3 py-2 border-b border-white/30 transition-colors duration-150 hover:bg-white/10 rounded cursor-pointer"
            >
              <motion.div
                variants={iconVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <motion.img
                  src={Badge}
                  alt="Badge"
                  className="w-5 h-5"
                  whileHover={{ filter: "brightness(1.3)" }}
                />
              </motion.div>
              <motion.span
                className="text-white text-base"
                variants={textVariants}
                whileHover="hover"
              >
                Badge / Achievement
              </motion.span>
            </Link>
          </motion.div>

          <motion.div variants={navItemVariants}>
            <motion.div
              whileHover={leaderboardVariants.hover}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to="/leaderboard"
                className="flex items-center gap-3 py-2 border-b border-yellow-400 transition-colors duration-150 hover:bg-yellow-400/10 rounded cursor-pointer"
              >
                <motion.div
                  variants={iconVariants}
                  whileHover={{
                    ...iconVariants.hover,
                    filter: "brightness(1.3) drop-shadow(0 0 8px #FBBF24)"
                  }}
                  whileTap="tap"
                >
                  <img src={Leaderboard} alt="Leaderboard" className="w-5 h-5" />
                </motion.div>
                <motion.span
                  className="text-yellow-400 text-base font-bold"
                  variants={textVariants}
                  whileHover={{
                    ...textVariants.hover,
                    textShadow: "0 0 10px #FBBF24"
                  }}
                >
                  Leaderboard
                </motion.span>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div variants={navItemVariants}>
            <Link
              to="/vip"
              className="flex items-center gap-3 py-2 border-b border-white/30 transition-colors duration-150 hover:bg-white/10 rounded cursor-pointer"
            >
              <motion.div
                variants={iconVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <motion.img
                  src={Crown}
                  alt="VIP"
                  className="w-5 h-5"
                  whileHover={{
                    filter: "brightness(1.3) drop-shadow(0 0 5px #FFD700)",
                    rotate: 15
                  }}
                />
              </motion.div>
              <motion.span
                className="text-white text-base"
                variants={textVariants}
                whileHover="hover"
              >
                VIP membership
              </motion.span>
            </Link>
          </motion.div>

          <motion.div variants={navItemVariants}>
            <motion.button
              className="flex items-center gap-3 py-2 border-b border-white/30 transition-colors duration-150 hover:bg-white/10 rounded cursor-pointer w-full text-left"
              onClick={() => {/* add logout logic here */ }}
              whileHover={{
                scale: 1.02,
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                borderColor: "rgba(239, 68, 68, 0.3)"
              }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                variants={iconVariants}
                whileHover={{
                  ...iconVariants.hover,
                  filter: "brightness(1.3) hue-rotate(0deg)"
                }}
                whileTap="tap"
              >
                <img src={Logout} alt="Logout" className="w-5 h-5" />
              </motion.div>
              <motion.span
                className="text-white text-base"
                variants={textVariants}
                whileHover={{
                  ...textVariants.hover,
                  color: "#FCA5A5"
                }}
              >
                log out
              </motion.span>
            </motion.button>
          </motion.div>
        </motion.nav>
      </motion.aside>

      <MainNav />
    </motion.main>
  );
}