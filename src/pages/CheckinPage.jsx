import CheckinStats from "@/components/checkin/CheckinStats";
import Header from "@/components/shared/Header";
import MainNav from "@/components/shared/MainNav";
import BigCalendarIcon from "@/assets/images/check-in/check-in-calendar.png";
import { motion } from "framer-motion";

const records = [
  { date: "2525-06-26 18:58:01", day: "Check In Day 1", token: "1.00" },
  { date: "2525-06-26 18:58:01", day: "Check In Day 2", token: "1.00" },
  { date: "2525-06-26 18:58:01", day: "Check In Day 3", token: "3.00" },
  { date: "2525-06-26 18:58:01", day: "Check In Day 4", token: "1.00" },
  { date: "2525-06-26 18:58:01", day: "Check In Day 5", token: "3.00" },
];

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
      stiffness: 100,
      damping: 15
    }
  }
};

const bonusSectionVariants = {
  hidden: {
    opacity: 0,
    x: -30
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 20,
      delay: 0.3
    }
  }
};

const calendarIconVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    rotate: -10
  },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 150,
      damping: 20,
      delay: 0.5
    }
  }
};

const recordsHeaderVariants = {
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
      damping: 20,
      delay: 0.6
    }
  }
};

const recordItemVariants = {
  hidden: {
    opacity: 0,
    x: -50,
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
      delay: 0.7 + (index * 0.1)
    }
  })
};

export default function CheckinPage() {
  return (
    <>
      <title>Daily Check-in - MRS</title>
      <motion.main
        className="h-svh overflow-hidden w-full max-w-sm mx-auto relative"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <Header />
        </motion.div>

        {/* Section 1: Check in */}
        <motion.div variants={itemVariants}>
          <CheckinStats />
        </motion.div>

        <motion.section
          className="mt-8 px-12"
          variants={bonusSectionVariants}
        >
          <div className="flex items-center justify-between">
            <motion.div
              className="text-gradient text-xl font-semibold"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Check In <br /> Bonus
            </motion.div>
            <motion.div
              variants={calendarIconVariants}
              whileHover={{
                scale: 1.1,
                rotate: 5,
                transition: { type: "spring", stiffness: 300 }
              }}
              whileTap={{ scale: 0.95 }}
            >
              <img src={BigCalendarIcon} alt="" />
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          className="mt-6 px-2"
          initial="hidden"
          animate="visible"
        >
          <motion.h2
            className="text-white text-lg font-medium mb-3"
            variants={recordsHeaderVariants}
          >
            Check In Record
          </motion.h2>
          <div className="space-y-3 text-[10px]">
            {records.map((item, index) => (
              <motion.div
                key={index}
                className="flex items-center justify-between checkin-table-row-gradient text-white px-4 py-3 shadow"
                custom={index}
                variants={recordItemVariants}
                whileHover={{
                  scale: 1.02,
                  x: 5,
                  transition: { type: "spring", stiffness: 300 }
                }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="">{item.date}</span>
                <span className="">{item.day}</span>
                <motion.span
                  className=""
                  whileHover={{
                    scale: 1.1,
                    color: "#ffd700",
                    transition: { duration: 0.2 }
                  }}
                >
                  You Get {item.token} Token
                </motion.span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <MainNav />
      </motion.main>
    </>
  );
}