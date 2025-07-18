import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { getUserDetails } from "../services/oprations/auth";
import { Loader2, UserCircle2, Mail, BrainCircuit } from "lucide-react";
import { motion } from "framer-motion";
import { CiLogout } from "react-icons/ci";

const logoutButtonVariants = {
  hover: {
    scale: 1.05,
    boxShadow:
      "0 0 12px rgba(99, 102, 241, 0.8), 0 0 24px rgba(139, 92, 246, 0.6)",
    transition: { duration: 0.3 },
  },
  tap: { scale: 0.95 },
};

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  const getdel = async () => {
    setLoading(true);
    try {
      const getUserDe = await getUserDetails();
      setProfile(getUserDe.user);
    } catch (error) {
      toast.error("Failed to load user profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getdel();
  }, []);

  const handleLogout = () => {
  // ✅ Clear token
  localStorage.removeItem("token");

  // ✅ Show toast
  toast.success("Logged out successfully!");

  // ✅ Redirect to homepage after a short delay (optional)
  setTimeout(() => {
    window.location.href = "/";
  }, 500); // you can adjust delay if you want
};


  if (loading) {
    return (
      <div className="flex justify-center items-center mt-10 text-indigo-500">
        <Loader2 className="animate-spin w-6 h-6 mr-2" />
        Loading Profile...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center mt-10 text-red-600 font-medium">
        No profile data found.
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-xl w-full mx-auto p-8 rounded-3xl shadow-xl border border-indigo-100 relative overflow-hidden bg-gradient-to-br from-white via-indigo-50 to-purple-50"
    >
      {/* Floating gradient background blob */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-400 opacity-20 rounded-full blur-3xl"></div>

      <div className="relative z-10 flex flex-col items-center space-y-6">
        {/* Avatar */}
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
            <UserCircle2 className="w-16 h-16 text-white" />
          </div>
        </div>

        {/* Name */}
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-wide text-center">
          {profile.firstName} {profile.lastName}
        </h1>

        {/* Email */}
        <div className="flex items-center gap-2 text-gray-600">
          <Mail className="w-5 h-5 text-indigo-600" />
          <span className="text-sm sm:text-base">{profile.email}</span>
        </div>

        {/* Skills */}
        <div className="mt-6 w-full">
          <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2 mb-3">
            <BrainCircuit className="w-5 h-5 text-purple-600" />
            Skills Offered
          </h2>
          <div className="flex flex-wrap gap-2">
            {profile.skillsOffered && profile.skillsOffered.length > 0 ? (
              profile.skillsOffered.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-sm rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md"
                >
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-gray-500 italic">No skills added</span>
            )}
          </div>
        </div>

        {/* Logout Button */}
        <motion.button
          variants={logoutButtonVariants}
          whileHover="hover"
          whileTap="tap"
          type="button"
          onClick={handleLogout}
          aria-label="Log out"
          className="mt-8 flex items-center justify-center gap-3 px-6 py-3 rounded-full 
             font-semibold text-white bg-gradient-to-r from-red-500 to-pink-500 
             shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <CiLogout className="w-6 h-6" />
          Log out
        </motion.button>
      </div>
    </motion.div>
  );
};

export default UserProfile;
