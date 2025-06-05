import React, { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import axios from "axios";

const SearchUsersBySkill = () => {
  const [skill, setSkill] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [offeredSkills, setOfferedSkills] = useState("");

  const handleSearch = async () => {
    if (!skill.trim()) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://localhost:4000/api/v1/request/user/userbyskills?skill=${skill}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const fetchedUsers = res.data.users || [];
      setUsers(fetchedUsers);

      if (fetchedUsers.length === 0) {
        toast.error("No users found with that skill.");
      }
    } catch (err) {
      toast.error("Failed to search users.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sendRequest = async (receiverId, requestedSkill) => {
    if (!offeredSkills.trim()) {
      toast.error("Please enter your offered skills first.");
      return;
    }

    const payload = {
      receiverId,
      offeredSkills: offeredSkills.split(",").map((s) => s.trim()),
      requestedSkills: [requestedSkill],
    };

    try {
      await axios.post("http://localhost:4000/api/v1/request/request", payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.success("Request sent successfully!");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Error sending skill exchange request."
      );
      console.error(err);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md space-y-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold text-indigo-700">
        🔍 Find People by Skill
      </h2>

      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search skill e.g. React, Python"
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={handleSearch}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Search
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <input
          type="text"
          placeholder="Your offered skills (comma separated)"
          value={offeredSkills}
          onChange={(e) => setOfferedSkills(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {loading && <p className="text-gray-500">Loading users...</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        {users.map((user) => (
          <motion.div
            key={user._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition"
          >
            <h3 className="text-lg font-semibold text-gray-800">
              {user.firstName} {user.lastName}
            </h3>
            <p className="text-sm text-gray-600">{user.email}</p>
            <p className="text-sm text-gray-700 mt-1">
              Skills: {user.skillsOffered.join(", ")}
            </p>

            <button
              onClick={() => sendRequest(user._id, skill)}
              className="mt-3 px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700"
            >
              Send Request
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SearchUsersBySkill;
