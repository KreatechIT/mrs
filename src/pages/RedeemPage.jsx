import { motion } from "framer-motion";
import HeroStatsSection from "@/components/home/HeroStatsSection";
import Header from "@/components/shared/Header";
import MainNav from "@/components/shared/MainNav";
import { Button } from "@/components/ui/button";

import GiftIcon from "@/assets/images/icons/gift-icon.svg";
import RedeemTabs from "@/components/redeem/RedeemTabs";
import { NavLink } from "react-router-dom";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 15
    }
  }
};

const buttonVariants = {
  hidden: {
    opacity: 0,
    x: 50,
    scale: 0.9
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 150,
      damping: 20,
      delay: 0.4
    }
  }
};

export default function RedeemPage() {
  return (
    <>
      <title>Redeem - MRS</title>
      <motion.main
        className="h-svh overflow-hidden w-full max-w-sm mx-auto relative"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <Header />
        </motion.div>

        <motion.div variants={itemVariants}>
          <HeroStatsSection />
        </motion.div>

        <motion.div
          className="flex mt-4 mx-3 justify-end mb-10"
          variants={buttonVariants}
        >
          <NavLink to="/history">
            <motion.div
              whileHover={{
                scale: 1.05,
                y: -2
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Button className="text-xs redemption-history-btn">
                <motion.img
                  src={GiftIcon}
                  alt=""
                  className="size-4"
                  whileHover={{ rotate: 15 }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
                Redemption Logs
              </Button>
            </motion.div>
          </NavLink>
        </motion.div>

        <motion.div variants={itemVariants}>
          <RedeemTabs />
        </motion.div>

        <MainNav />
      </motion.main>
    </>
  );
}

