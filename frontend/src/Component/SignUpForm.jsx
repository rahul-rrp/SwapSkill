import { useState } from "react";
import { signUp } from "../services/oprations/auth";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirm_password: "",
    skillsOffered: "",
    bio: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      alert("Passwords do not match!");
      return;
    }

    const skillsArray = formData.skillsOffered
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill !== "");

    const userData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      confirm_password: formData.confirm_password,
      password: formData.password,
      skillsOffered: skillsArray,
      bio: formData.bio,
    };

    await signUp(userData, navigate);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center min-h-screen p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-lg border border-indigo-100"
      >
        <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-2">
          Join <span className="text-indigo-600">SkillSwap</span>
        </h2>
        <p className="text-center text-gray-500 mb-6 text-sm">
          Learn. Teach. Grow together. Empower through peer-to-peer skill exchange.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-1 font-medium text-gray-700">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-300"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-300"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-300"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-1 font-medium text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-300"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-300"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium text-gray-700">
              Skills Offered <span className="text-sm text-gray-400">(comma-separated)</span>
            </label>
            <input
              type="text"
              name="skillsOffered"
              value={formData.skillsOffered}
              onChange={handleChange}
              required
              placeholder="e.g., Python, Guitar, Design"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-300"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-1 font-medium text-gray-700">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-300"
              placeholder="Tell us a little about yourself"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all duration-300"
          >
            Create My Account
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <a href="/signin" className="text-indigo-500 hover:underline">
            Sign in here
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default SignUpForm;
