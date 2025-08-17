import { motion } from "framer-motion";
import Header from "@/components/shared/Header";
import MainNav from "@/components/shared/MainNav";

const historyData = [
  {
    date: "23/10/2024 5:55:12 pm",
    product: "918KISS",
    type: "Bonus",
    status: "Completed",
    amount: "0.00",
    bonus: "25.00",
  },
  {
    date: "23/10/2024 5:55:12 pm",
    product: "Main Wallet",
    type: "Deposit",
    status: "Completed",
    amount: "1,000.00",
    bonus: "0.00",
  },
  {
    date: "26/09/2024 10:21:17 am",
    product: "Main Wallet",
    type: "Deposit",
    status: "Completed",
    amount: "650.00",
    bonus: "0.00",
  },
  {
    date: "26/09/2024 10:21:17 am",
    product: "Main Wallet",
    type: "Deposit",
    status: "Completed",
    amount: "5,050.00",
    bonus: "0.00",
  },
  {
    date: "28/08/2024 2:26:38 pm",
    product: "918KISS",
    type: "Withdraw",
    status: "Completed",
    amount: "15.00",
    bonus: "0.00",
  },
  // Repeat for demo
  {
    date: "23/10/2024 5:55:12 pm",
    product: "918KISS",
    type: "Bonus",
    status: "Completed",
    amount: "0.00",
    bonus: "25.00",
  },
  {
    date: "23/10/2024 5:55:12 pm",
    product: "Main Wallet",
    type: "Deposit",
    status: "Completed",
    amount: "1,000.00",
    bonus: "0.00",
  },
  {
    date: "26/09/2024 10:21:17 am",
    product: "Main Wallet",
    type: "Deposit",
    status: "Completed",
    amount: "650.00",
    bonus: "0.00",
  },
  {
    date: "26/09/2024 10:21:17 am",
    product: "Main Wallet",
    type: "Deposit",
    status: "Completed",
    amount: "5,050.00",
    bonus: "0.00",
  },
  {
    date: "28/08/2024 2:26:38 pm",
    product: "918KISS",
    type: "Withdraw",
    status: "Completed",
    amount: "15.00",
    bonus: "0.00",
  },
];

const getTypeColor = (type) => {
  switch (type) {
    case 'Deposit': return 'text-green-400';
    case 'Withdraw': return 'text-red-400';
    case 'Bonus': return 'text-yellow-400';
    default: return 'text-white';
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Completed': return 'text-green-400 bg-green-900/20';
    case 'Pending': return 'text-yellow-400 bg-yellow-900/20';
    case 'Failed': return 'text-red-400 bg-red-900/20';
    default: return 'text-gray-400 bg-gray-900/20';
  }
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

const headerVariants = {
  hidden: { y: -30, opacity: 0 },
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

const statsVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      delay: 0.5
    }
  }
};

export default function HistoryPage() {
  return (
    <div className="min-h-svh w-full max-w-md mx-auto bg-black flex flex-col items-center justify-between pb-4 overflow-y-auto scrollbar-thin scrollbar-thumb-yellow-400 scrollbar-track-black pb-[4rem]">
      <Header />
      <motion.div
        className="flex-1 px-4 py-6 overflow-y-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div
          className="mb-6"
          variants={headerVariants}
        >
          <h2 className="text-center text-3xl font-bold text-transparent bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text mb-2">
            Transaction History
          </h2>
          <p className="text-center text-gray-400 text-sm">Your recent activity</p>
        </motion.div>

        <motion.div className="space-y-3" variants={containerVariants}>
          {historyData.map((transaction, idx) => (
            <motion.div
              key={idx}
              className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-xl p-4 border border-yellow-400/20 hover:border-yellow-400/40 transition-all duration-300 backdrop-blur-sm"
              variants={itemVariants}
              whileHover={{
                scale: 1.02,
                transition: { type: "spring", stiffness: 300 }
              }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Header Row */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <motion.span
                      className="text-yellow-400 font-semibold text-sm"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 + 0.2 }}
                    >
                      {transaction.product}
                    </motion.span>
                  </div>
                  <motion.div
                    className="text-gray-400 text-xs"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.1 + 0.3 }}
                  >
                    {transaction.date}
                  </motion.div>
                </div>
                <motion.span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    delay: idx * 0.1 + 0.4
                  }}
                >
                  {transaction.status}
                </motion.span>
              </div>

              {/* Amount Row + Type */}
              <motion.div
                className="flex w-full justify-between"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 + 0.5 }}
              >
                {parseFloat(transaction.amount) > 0 && (
                  <div className="text-center flex-1">
                    <div className="text-xs text-gray-400">Amount</div>
                    <motion.div
                      className="text-white font-semibold"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 150,
                        delay: idx * 0.1 + 0.6
                      }}
                    >
                      ${transaction.amount}
                    </motion.div>
                  </div>
                )}
                {parseFloat(transaction.bonus) > 0 && (
                  <div className="text-center flex-1">
                    <div className="text-xs text-gray-400">Bonus</div>
                    <motion.div
                      className="text-yellow-400 font-semibold"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 150,
                        delay: idx * 0.1 + 0.6
                      }}
                    >
                      +${transaction.bonus}
                    </motion.div>
                  </div>
                )}
                <div className="text-center flex-1">
                  <div className="text-xs text-gray-400">Type</div>
                  <motion.div
                    className={`font-bold ${getTypeColor(transaction.type)}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.1 + 0.7 }}
                  >
                    {transaction.type}
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Summary Card */}
        <motion.div
          className="mt-8 bg-gradient-to-br from-yellow-900/30 to-orange-900/30 rounded-xl p-4 border border-yellow-400/30"
          variants={statsVariants}
          whileHover={{
            scale: 1.02,
            transition: { type: "spring", stiffness: 300 }
          }}
        >
          <motion.h3
            className="text-yellow-400 font-semibold mb-3 text-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            Quick Stats
          </motion.h3>
          <motion.div
            className="grid grid-cols-3 gap-4 text-center"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  delayChildren: 0.9,
                  staggerChildren: 0.1
                }
              }
            }}
          >
            <motion.div
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: { y: 0, opacity: 1 }
              }}
            >
              <motion.div
                className="text-2xl font-bold text-green-400"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  delay: 1.0
                }}
              >
                {historyData.filter(t => t.type === 'Deposit').length}
              </motion.div>
              <div className="text-xs text-gray-400">Deposits</div>
            </motion.div>
            <motion.div
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: { y: 0, opacity: 1 }
              }}
            >
              <motion.div
                className="text-2xl font-bold text-red-400"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  delay: 1.1
                }}
              >
                {historyData.filter(t => t.type === 'Withdraw').length}
              </motion.div>
              <div className="text-xs text-gray-400">Withdrawals</div>
            </motion.div>
            <motion.div
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: { y: 0, opacity: 1 }
              }}
            >
              <motion.div
                className="text-2xl font-bold text-yellow-400"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  delay: 1.2
                }}
              >
                {historyData.filter(t => t.type === 'Bonus').length}
              </motion.div>
              <div className="text-xs text-gray-400">Bonuses</div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
      <MainNav />
    </div>
  );
}