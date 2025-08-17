import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RedeemCarousel from "./RedeemCarousel";
import { useState } from "react";

// Animation variants for tabs
const tabVariants = {
  hidden: {
    opacity: 0,
    y: 10
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  }
};

const tabContentVariants = {
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
      damping: 20,
      staggerChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: {
      duration: 0.2
    }
  }
};

const carouselVariants = {
  hidden: {
    opacity: 0,
    x: -30,
    scale: 0.95
  },
  visible: (index) => ({
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      delay: index * 0.1
    }
  })
};

export default function RedeemTabs() {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <Tabs
      defaultValue="all"
      className="w-full"
      onValueChange={setActiveTab}
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={tabVariants}
      >
        <TabsList className="bg-transparent border-b border-transparent space-x-3 px-4 py-2">
          {["all", "angpows", "vouchers", "merchendises"].map((tab, index) => (
            <motion.div
              key={tab}
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: {
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 200,
                  damping: 20
                }
              }}
            >
              <TabsTrigger
                value={tab}
                className="data-[state=active]:text-[#F2C36B] data-[state=active]:font-semibold data-[state=active]:underline data-[state=active]:underline-offset-[6px] text-white px-0"
              >
                {tab === "all" ? "All" :
                  tab === "angpows" ? "Angpows" :
                    tab === "vouchers" ? "Vouchers" : "Merchandises"}
              </TabsTrigger>
            </motion.div>
          ))}
        </TabsList>
      </motion.div>

      <AnimatePresence mode="wait">
        <TabsContent value="all" key="all">
          <motion.div
            variants={tabContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div custom={0} variants={carouselVariants}>
              <RedeemCarousel />
            </motion.div>
            <motion.div custom={1} variants={carouselVariants}>
              <RedeemCarousel />
            </motion.div>
          </motion.div>
        </TabsContent>

        <TabsContent value="angpows" key="angpows">
          <motion.div
            variants={tabContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div custom={0} variants={carouselVariants}>
              <RedeemCarousel />
            </motion.div>
            <motion.div custom={1} variants={carouselVariants}>
              <RedeemCarousel />
            </motion.div>
          </motion.div>
        </TabsContent>

        <TabsContent value="vouchers" key="vouchers">
          <motion.div
            variants={tabContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div custom={0} variants={carouselVariants}>
              <RedeemCarousel />
            </motion.div>
            <motion.div custom={1} variants={carouselVariants}>
              <RedeemCarousel />
            </motion.div>
          </motion.div>
        </TabsContent>

        <TabsContent value="merchendises" key="merchendises">
          <motion.div
            variants={tabContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div custom={0} variants={carouselVariants}>
              <RedeemCarousel />
            </motion.div>
            <motion.div custom={1} variants={carouselVariants}>
              <RedeemCarousel />
            </motion.div>
          </motion.div>
        </TabsContent>
      </AnimatePresence>
    </Tabs>
  );
}
