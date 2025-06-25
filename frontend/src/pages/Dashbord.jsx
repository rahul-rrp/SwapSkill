import React, { useState } from "react";
import { NavLink, Routes, Route, useLocation } from "react-router-dom";
import { CiLogout } from "react-icons/ci";
import StatsCards from "../Component/StatsCard";
import UserProfile from "../Component/UserProfile";
import SendRequestForm from "../Component/SendRequestForm";
import SentRequestsList from "../Component/SentRequestsList";
import ReceivedRequestsList from "../Component/ReceivedRequestsList";
import SearchUsersBySkill from "../Component/SearchUsersBySkill";
import ChatPage from "../Component/Chat/ChatPage";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { to: "/", label: "🏠 Dashboard" },
  { to: "/requests/find", label: "🔍 Find by Skill" },
  { to: "/requests/sent", label: "📦 Sent Requests" },
  { to: "/requests/received", label: "📥 Received Requests" },
  { to: "/chat", label: "💬 Chat" },
];

const sidebarVariants = {
  open: { x: 0, transition: { type: "spring", stiffness: 120, damping: 20 } },
  closed: { x: -320, transition: { type: "spring", stiffness: 120, damping: 20 } },
};

const navItemVariants = {
  initial: { opacity: 0, y: 10, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 260, damping: 20 } },
  hover: {
    scale: 1.05,
    boxShadow: "0 0 8px rgba(102, 126, 234, 0.7), 0 0 15px rgba(139, 92, 246, 0.5)",
    transition: { duration: 0.3 },
  },
};

const floatingBgVariants = {
  animate: {
    scale: [1, 1.1, 1],
    opacity: [0.15, 0.25, 0.15],
    transition: { duration: 6, ease: "easeInOut", repeat: Infinity },
  },
};

const logoutButtonVariants = {
  hover: {
    scale: 1.05,
    boxShadow: "0 0 12px rgba(139, 92, 246, 0.9), 0 0 24px rgba(102, 126, 234, 0.7)",
    transition: { duration: 0.3 },
  },
  tap: { scale: 0.95 },
};

const pageVariants = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -15, transition: { duration: 0.3 } },
};

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const handleLogout = () => {
    localStorage.setItem("token", "");
    window.location.reload();
  };

  const activeClass =
    "bg-gradient-to-r from-indigo-600 to-purple-700 text-white shadow-lg scale-[1.05]";
  const inactiveClass =
    "text-indigo-700 hover:text-white hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-600 hover:shadow-lg transition-all duration-300";

  return (
    <div className="flex flex-1 min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-white overflow-hidden relative">
      {/* Floating decorative background shape */}
      <motion.div
        variants={floatingBgVariants}
        animate="animate"
        className="fixed top-10 left-[-100px] w-72 h-72 rounded-full bg-gradient-to-r from-indigo-400 to-purple-600 blur-3xl pointer-events-none z-0"
        aria-hidden="true"
      />

      {/* Sidebar */}
      <motion.nav
        initial="closed"
        animate={sidebarOpen || window.innerWidth >= 768 ? "open" : "closed"}
        variants={sidebarVariants}
        className="fixed inset-y-0 left-0 w-64 bg-white bg-opacity-90 backdrop-blur-md shadow-xl z-50 rounded-r-3xl overflow-hidden md:relative md:rounded-none md:shadow-none"
      >
        <div className="flex flex-col flex-grow pt-6 h-full px-5">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex items-center justify-between font-extrabold text-3xl text-indigo-700 tracking-wide select-none"
          >
            SkillSwap
            <button
              aria-label="Close sidebar"
              className="md:hidden text-indigo-500 hover:text-purple-600 focus:outline-none transition-transform duration-300"
              onClick={() => setSidebarOpen(false)}
            >
              <motion.span
                whileTap={{ rotate: 90 }}
                className="block"
                style={{ display: "inline-block" }}
              >
                ✕
              </motion.span>
            </button>
          </motion.div>

          <hr className="border-indigo-200 my-6" />

          <nav className="flex flex-col gap-3 flex-grow">
            {navItems.map((item, i) => (
              <motion.div
                key={i}
                variants={navItemVariants}
                initial="initial"
                animate="animate"
                whileHover="hover"
                className="rounded-lg"
                transition={{ delay: 0.05 * i }}
              >
                <NavLink
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-6 py-3 text-base font-semibold rounded-lg transition-transform duration-300 transform cursor-pointer ${
                      isActive ? activeClass : inactiveClass
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </motion.div>
            ))}
          </nav>

          <hr className="border-indigo-200 my-6" />

          <motion.button
            variants={logoutButtonVariants}
            whileHover="hover"
            whileTap="tap"
            type="button"
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-indigo-700 bg-indigo-100 hover:bg-indigo-200 shadow-md transition"
          >
            <CiLogout className="w-6 h-6" /> Log out
          </motion.button>
        </div>
      </motion.nav>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-auto z-10">
        {/* Top bar for small screen menu toggle */}
        <header className="p-5 bg-white bg-opacity-70 backdrop-blur-md shadow-sm sticky top-0 z-30 flex justify-between items-center md:hidden">
          <h1 className="text-xl font-bold text-indigo-700 tracking-wide select-none">
            SkillSwap Dashboard
          </h1>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
            className="text-indigo-700 hover:text-purple-700 focus:outline-none"
          >
            ☰
          </motion.button>
        </header>

        <main className="p-8 max-w-7xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <motion.h2
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{
                yoyo: Infinity,
                duration: 1.6,
                ease: "easeInOut",
              }}
              className="text-4xl font-extrabold text-indigo-700 select-none"
            >
              👋 Welcome to SkillSwap Dashboard
            </motion.h2>
          </motion.div>

          {/* Page routes with fade & slide animation on route change */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-8"
            >
              <Routes location={location} key={location.pathname}>
                <Route
                  path="/"
                  element={
                    <>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                      >
                        <StatsCards />
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <UserProfile />
                      </motion.div>
                    </>
                  }
                />
                <Route path="requests/send" element={<SendRequestForm />} />
                <Route path="requests/sent" element={<SentRequestsList />} />
                <Route path="requests/received" element={<ReceivedRequestsList />} />
                <Route path="requests/find" element={<SearchUsersBySkill />} />
                <Route path="chat" element={<ChatPage />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
