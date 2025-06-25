import React, { useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";

const SendRequestForm = () => {
  const [formData, setFormData] = useState({
    offeredSkills: "",
    requestedSkills: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      offeredSkills: formData.offeredSkills.split(",").map((s) => s.trim()),
      requestedSkills: formData.requestedSkills.split(",").map((s) => s.trim()),
    };

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/request/request`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Request sent successfully!");
      setFormData({ offeredSkills: "", requestedSkills: "" });
    } catch (error) {
      toast.error("Failed to send request.");
      console.error(error);
    }
  };

  return (
    <section className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-16 px-6 rounded-lg max-w-3xl mx-auto shadow-lg animate-fadeIn">
      <h2 className="text-4xl font-extrabold mb-6 text-center drop-shadow-lg">
        Send Skill Exchange Request
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2 font-semibold">Skills You Offer</label>
          <input
            type="text"
            name="offeredSkills"
            placeholder="e.g. JavaScript, React, Design"
            value={formData.offeredSkills}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">Skills You Want</label>
          <input
            type="text"
            name="requestedSkills"
            placeholder="e.g. Python, Marketing"
            value={formData.requestedSkills}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-indigo-900 font-bold py-3 rounded-md shadow-md transition duration-300"
        >
          Send Request
        </button>
      </form>
    </section>
  );
};

export default SendRequestForm;
