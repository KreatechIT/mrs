import { motion } from "framer-motion";
import BronzeTierBadge from "@/assets/images/badges/tier-1.svg";

// Animation variants
const sectionVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 20
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 20,
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const cardVariants = {
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

const badgeVariants = {
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
      stiffness: 200,
      damping: 15,
      delay: 0.3
    }
  }
};

const pointsVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20,
      delay: 0.4
    }
  }
};

export default function HeroStatsSection() {
  return (
    <motion.section
      className="mt-6 border-[0.5px] border-golden/75 mx-2 h-24 rounded-lg p-1 grid grid-cols-3 gap-2"
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      whileHover={{
        scale: 1.02,
        transition: { type: "spring", stiffness: 300 }
      }}
    >
      <motion.div
        className="h-full stats-card-gradient rounded-md text-[10px] flex justify-center p-1 flex-col"
        variants={cardVariants}
        whileHover={{
          scale: 1.05,
          y: -2,
          transition: { type: "spring", stiffness: 300 }
        }}
      >
        <motion.p
          className="opacity-75"
          initial={{ opacity: 0, x: -10 }}
          animate={{
            opacity: 0.75,
            x: 0,
            transition: { delay: 0.5 }
          }}
        >
          Name: John Doe
        </motion.p>
        <motion.p
          className="opacity-75"
          initial={{ opacity: 0, x: -10 }}
          animate={{
            opacity: 0.75,
            x: 0,
            transition: { delay: 0.6 }
          }}
        >
          Phone: 017xxxxxx00
        </motion.p>
      </motion.div>

      <motion.div
        className="h-full stats-card-gradient rounded-md p-1"
        variants={cardVariants}
        whileHover={{
          scale: 1.05,
          y: -2,
          transition: { type: "spring", stiffness: 300 }
        }}
      >
        <motion.p
          className="text-xs text-center opacity-75"
          initial={{ opacity: 0, y: -10 }}
          animate={{
            opacity: 0.75,
            y: 0,
            transition: { delay: 0.3 }
          }}
        >
          Rank Badge
        </motion.p>
        <motion.div
          variants={badgeVariants}
          whileHover={{
            rotate: 360,
            scale: 1.1,
            transition: { duration: 0.6 }
          }}
        >
          <img src={BronzeTierBadge} alt="" className="size-13 mx-auto" />
        </motion.div>
        <motion.p
          className="text-xs text-center text-golden -mt-1.5"
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: {
              delay: 0.7,
              type: "spring",
              stiffness: 200
            }
          }}
          whileHover={{
            scale: 1.1,
            color: "#FFD700",
            transition: { duration: 0.2 }
          }}
        >
          Bronze
        </motion.p>
      </motion.div>

      <motion.div
        className="h-full stats-card-gradient rounded-md p-1"
        variants={cardVariants}
        whileHover={{
          scale: 1.05,
          y: -2,
          transition: { type: "spring", stiffness: 300 }
        }}
      >
        <motion.p
          className="text-xs text-center opacity-75"
          initial={{ opacity: 0, y: -10 }}
          animate={{
            opacity: 0.75,
            y: 0,
            transition: { delay: 0.4 }
          }}
        >
          MRS Points
        </motion.p>

        <motion.p
          className="font-bold text-center mt-4"
          variants={pointsVariants}
          whileHover={{
            scale: 1.15,
            color: "#F2C36B",
            transition: { type: "spring", stiffness: 300 }
          }}
        >
          3400 <span className="text-xs opacity-75 font-normal">pts</span>
        </motion.p>
      </motion.div>
    </motion.section>
  );
}