import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/shared/Header";
import MainNav from "@/components/shared/MainNav";

import TournamentImg1 from "@/assets/images/promotion-events/promotion-event-1.png";
import TournamentImg2 from "@/assets/images/promotion-events/promotion-event-2.png";
import { useState } from "react";
import TournamentDialog from "@/components/tournament/TournamentDialog";

const tournamentsData = [
  {
    groupName: "Weekly Battles",
    tournaments: [
      {
        img: TournamentImg1,
        name: "Name",
      },
      {
        img: TournamentImg2,
        name: "Name",
      },
      {
        img: TournamentImg2,
        name: "Name",
      },
      {
        img: TournamentImg1,
        name: "Name",
      },
    ],
  },
  {
    groupName: "Hot Games",
    tournaments: [
      {
        img: TournamentImg1,
        name: "Name",
      },
      {
        img: TournamentImg2,
        name: "Name",
      },
      {
        img: TournamentImg2,
        name: "Name",
      },
      {
        img: TournamentImg1,
        name: "Name",
      },
      {
        img: TournamentImg1,
        name: "Name",
      },
      {
        img: TournamentImg2,
        name: "Name",
      },
      {
        img: TournamentImg2,
        name: "Name",
      },
      {
        img: TournamentImg1,
        name: "Name",
      },
    ],
  },
  {
    groupName: "Exclusive Tournaments",
    tournaments: [
      {
        img: TournamentImg1,
        name: "Name",
      },
      {
        img: TournamentImg2,
        name: "Name",
      },
      {
        img: TournamentImg2,
        name: "Name",
      },
      {
        img: TournamentImg1,
        name: "Name",
      },
    ],
  },
];

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

const sectionVariants = {
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
      damping: 20
    }
  }
};

const groupTitleVariants = {
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
      stiffness: 150,
      damping: 20,
      delay: 0.1
    }
  }
};

const tournamentGridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.2
    }
  }
};

const tournamentCardVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.9,
    rotateX: -15
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 15
    }
  }
};

const imageVariants = {
  hover: {
    scale: 1.05,
    y: -5,
    rotateX: 5,
    boxShadow: "4px 8px 25px rgba(221, 143, 31, 0.4)",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  },
  tap: {
    scale: 0.95,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 20
    }
  }
};

const textVariants = {
  hover: {
    scale: 1.05,
    color: "#F2C36B",
    transition: {
      duration: 0.2
    }
  }
};

export default function TournamentPage() {
  const [tournamentDialogOpen, setTournamentDialogOpen] = useState(false);

  return (
    <>
      <title>Tournaments - MRS</title>
      <motion.main
        className="overflow-hidden w-full max-w-sm mx-auto relative"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={headerVariants}>
          <Header />
        </motion.div>

        <motion.section
          className="mt-0 mx-2"
          variants={sectionVariants}
        >
          {tournamentsData.map((tournamentGroup, gIndex) => (
            <motion.div
              key={gIndex}
              className="mt-10"
              initial={{ opacity: 0, y: 50 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: {
                  delay: gIndex * 0.2,
                  type: "spring",
                  stiffness: 100,
                  damping: 20
                }
              }}
            >
              <motion.h2
                className="text-lg"
                variants={groupTitleVariants}
                whileHover={{
                  x: 10,
                  color: "#F2C36B",
                  transition: { duration: 0.2 }
                }}
              >
                {tournamentGroup.groupName}
              </motion.h2>

              <motion.div
                className="grid grid-cols-4 gap-4 mt-2"
                variants={tournamentGridVariants}
              >
                {tournamentGroup.tournaments.map((tournament, tIndex) => (
                  <motion.div
                    key={tIndex}
                    className="cursor-pointer"
                    variants={tournamentCardVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => setTournamentDialogOpen(true)}
                    layout
                  >
                    <motion.img
                      src={tournament.img}
                      alt=""
                      className="shadow-[2px_4px_20px_#DD8F1FDD] rounded-xl"
                      variants={imageVariants}
                      whileHover={{
                        ...imageVariants.hover,
                        filter: "brightness(1.1) saturate(1.2)"
                      }}
                      whileTap={imageVariants.tap}
                    />
                    <motion.p
                      className="text-center text-sm mt-0.5"
                      variants={textVariants}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        transition: {
                          delay: gIndex * 0.2 + tIndex * 0.05 + 0.3
                        }
                      }}
                    >
                      {tournament.name}
                    </motion.p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </motion.section>

        <div className="h-32"></div>

        <MainNav />
      </motion.main>

      <AnimatePresence>
        {tournamentDialogOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <TournamentDialog
              open={tournamentDialogOpen}
              setOpen={setTournamentDialogOpen}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}