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
import { motion } from "framer-motion";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const handleLogout = () => {
    localStorage.setItem("token", "");
    window.location.reload();
  };

  const activeClass = "bg-indigo-600 text-white shadow-md scale-[1.02]";
  const inactiveClass =
    "text-gray-800 hover:text-white hover:bg-indigo-500 hover:shadow-lg transition-all duration-300";

  return (
    <div className="flex flex-1 bg-gradient-to-br from-indigo-200 via-indigo-100 to-white min-h-screen">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen || window.innerWidth >= 768 ? 0 : -300 }}
        transition={{ type: "spring", stiffness: 100 }}
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-xl z-50 transform md:relative transition-transform duration-300`}
      >
        <div className="flex flex-col flex-grow pt-5 h-full">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between px-4 font-bold text-2xl text-indigo-700"
          >
            SkillSwap
            <button
              className="md:hidden text-gray-600 hover:text-red-600"
              onClick={() => setSidebarOpen(false)}
            >
              ✖
            </button>
          </motion.div>

          <hr className="border-gray-200 mt-4" />

          <div className="flex flex-col flex-1 justify-between px-3 mt-6">
            <nav className="space-y-3">
              {[{
                to: "/",
                label: "🏠 Dashboard"
              }, {
                to: "/requests/find",
                label: "🔍 Find by Skill"
              }, {
                to: "/requests/sent",
                label: "📦 Sent Requests"
              }, {
                to: "/requests/received",
                label: "📥 Received Requests"
              }, {
                to: "/chat",
                label: "💬 Chat"
              }].map((item, index) => (
                <NavLink
                  key={index}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-5 py-3 text-sm font-medium rounded-lg transition-transform duration-300 transform hover:scale-[1.02] ${
                      isActive ? activeClass : inactiveClass
                    }`
                  }
                  end={item.to === "/"}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <hr className="border-gray-200 mt-10" />

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="pb-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={handleLogout}
                className="flex items-center w-full px-5 py-3 text-sm font-medium text-gray-900 rounded-lg hover:bg-gray-200 transition"
              >
                <CiLogout className="w-5 h-5 mr-3" /> Log out
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        <main className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-7xl"
          >
            <motion.div
              className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-lg mb-6 border border-indigo-100"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold text-indigo-700 animate-pulse">
                👋 Welcome to SkillSwap Dashboard
              </h1>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 md:hidden text-xl text-indigo-700 hover:text-indigo-900"
                onClick={() => setSidebarOpen(true)}
              >
                ☰
              </motion.button>
            </motion.div>

            {/* Page Routes */}
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <StatsCards />
                    <UserProfile />
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
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
