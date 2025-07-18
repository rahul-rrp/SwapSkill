import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer, Slide } from "react-toastify";
import logo from '../assets/logo.png'
import pic from '../assets/logo1.png'
import "react-toastify/dist/ReactToastify.css";
import Footer from "../Component/Footer";
import {
  Lightbulb,
  Users,
  GraduationCap,
  Search,
  Zap,
  CheckCircle,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.25, duration: 0.7, ease: "easeOut" },
  }),
};

const knowledgeKeywords = [
  "Learning",
  "Creativity",
  "Innovation",
  "Growth",
  "Wisdom",
  "Curiosity",
  "Discovery",
  "Mentorship",
  "Inspiration",
  "Collaboration",
  "Exploration",
  "Insight",
  "Mastery",
  "Education",
];

const skillKeywords = ["Python", "UI/UX", "Photography", "React", "Blockchain"];

const floatingSkills = [
  "JavaScript",
  "CSS",
  "Node.js",
  "MongoDB",
  "AI",
  "Machine Learning",
  "Public Speaking",
  "Design",
];

const stats = [
  { label: "Users", value: 1200, icon: Users },
  { label: "Skills Exchanged", value: 850, icon: Lightbulb },
  { label: "Projects Built", value: 420, icon: GraduationCap },
];

// Custom toast purple style
const toastStyle = {
  error: {
    style: {
      background: "linear-gradient(135deg, #7e5bef, #a37bfa)", // purple gradient
      color: "#fff",
      fontWeight: "600",
      boxShadow: "0 0 10px #a37bfa",
    },
    iconTheme: {
      primary: "#d6bcfa", // light purple icon color
      secondary: "#5a3ebf",
    },
    // Add a subtle pulse animation using CSS class
    className: "toast-purple-pulse",
  },
};

const HeroSection = () => {
  const [currentSkill, setCurrentSkill] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to search for skills.", toastStyle.error);
        return;
      }
      if (search.trim()) {
        navigate(`/search/${search.trim().toLowerCase()}`);
      }
    }
  };

  useEffect(() => {
    let timeout;
    const fullText = skillKeywords[currentSkill];
    let index = 0;

    const type = () => {
      if (index <= fullText.length) {
        setDisplayText(fullText.slice(0, index));
        index++;
        timeout = setTimeout(type, 150);
      } else {
        timeout = setTimeout(erase, 1500);
      }
    };

    const erase = () => {
      if (index >= 0) {
        setDisplayText(fullText.slice(0, index));
        index--;
        timeout = setTimeout(erase, 80);
      } else {
        setCurrentSkill((prev) => (prev + 1) % skillKeywords.length);
      }
    };

    type();

    return () => clearTimeout(timeout);
  }, [currentSkill]);

  return (
    <>
      {/* ToastContainer with Slide animation */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        pauseOnHover
        theme="colored"
        transition={Slide}
        closeButton={false}
      />

      <section className="pt-20 pb-32 bg-gradient-to-b from-white to-indigo-50 overflow-hidden relative">
        {/* Floating animated background shape */}
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-indigo-300 opacity-20 blur-3xl"
          animate={{ scale: [1, 1.15, 1], rotate: [0, 20, 0], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden="true"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="mb-6"
          >
            <motion.img
                src={logo}
              alt="SkillSwap Logo"
              className="mx-auto w-24 h-24 object-contain rounded-full shadow-lg"
              whileHover={{ rotate: [0, 7, -7, 0], scale: 1.08 }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
            />
          </motion.div>

          <motion.div
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-1 rounded-full mb-4 text-sm font-medium shadow-sm"
          >
            <Lightbulb className="w-4 h-4 animate-bounce text-indigo-600" />
            Peer-to-Peer Learning Revolution
          </motion.div>

          <motion.h1
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-4"
            style={{ textShadow: "0 0 10px rgba(126, 91, 239, 0.5)" }}
          >
            Unlock Skills, Share Knowledge with{" "}
            <span className="text-indigo-600 underline decoration-wavy decoration-2">
              SkillSwap
            </span>
          </motion.h1>

          <motion.p
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-lg text-gray-700 max-w-2xl mx-auto mb-10 min-h-[1.5rem]"
          >
            Learn, teach, and collaborate with passionate people across the
            globe. SkillSwap empowers everyone to grow through{" "}
            <span className="font-semibold text-indigo-600">{displayText}</span>
            <span className="inline-block w-4 border-r-2 border-indigo-600 animate-pulse ml-1"></span>
          </motion.p>

          <motion.div
            custom={4}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="relative max-w-xl mx-auto mb-10"
          >
            <input
              type="text"
              placeholder="Search skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearch}
              className="input-class px-10 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 w-full shadow-md"
            />
            <Search className="absolute left-4 top-3 text-indigo-400" />
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-5 mb-20"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: { staggerChildren: 0.3 },
              },
            }}
          >
            <motion.a
              href="/signup"
              whileHover={{ scale: 1.07, boxShadow: "0 0 15px #7e5bef" }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-indigo-600 text-white rounded-full font-semibold shadow-lg hover:bg-indigo-700 transition"
            >
              Join Now
            </motion.a>
            <motion.a
              href="/signin"
              whileHover={{ scale: 1.07, boxShadow: "0 0 15px #7e5bef" }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 border border-indigo-600 text-indigo-600 rounded-full font-semibold hover:bg-indigo-50 transition"
            >
              Login
            </motion.a>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.25 } },
            }}
          >
            {[
              {
                icon: (
                  <GraduationCap className="w-8 h-8 mb-2 text-indigo-500" />
                ),
                title: "Learn from Mentors",
                desc: "Expand your expertise with real-world guidance.",
                bg: "bg-indigo-50",
              },
              {
                icon: <Users className="w-8 h-8 mb-2 text-green-500" />,
                title: "Teach Others",
                desc: "Share your skills and inspire new learners.",
                bg: "bg-green-50",
              },
              {
                icon: <Lightbulb className="w-8 h-8 mb-2 text-yellow-500" />,
                title: "Build Together",
                desc: "Collaborate on projects and grow your network.",
                bg: "bg-yellow-50",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                whileHover={{ y: -7, scale: 1.05, boxShadow: "0 10px 15px rgba(126, 91, 239, 0.3)" }}
                className={`p-6 rounded-2xl shadow-md ${item.bg} cursor-pointer select-none`}
              >
                {item.icon}
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="max-w-4xl mx-auto mb-20"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.35 } },
            }}
          >
            <h2 className="text-3xl font-extrabold text-gray-900 mb-10">
              How It Works
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 text-center">
              {[
                {
                  icon: <Zap className="mx-auto mb-4 w-10 h-10 text-indigo-600" />,
                  title: "1. Find Skills",
                  desc: "Search and discover new skills to learn or teach.",
                },
                {
                  icon: (
                    <CheckCircle className="mx-auto mb-4 w-10 h-10 text-green-600" />
                  ),
                  title: "2. Connect",
                  desc: "Send requests and start meaningful skill exchanges.",
                },
                {
                  icon: (
                    <Clock className="mx-auto mb-4 w-10 h-10 text-yellow-600" />
                  ),
                  title: "3. Collaborate",
                  desc: "Work together and build projects with peers.",
                },
              ].map((step, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  whileHover={{ scale: 1.07, boxShadow: "0 0 20px rgba(0,0,0,0.1)" }}
                  className="p-6 rounded-xl shadow-lg bg-white cursor-pointer"
                >
                  {step.icon}
                  <h3 className="text-lg font-semibold">{step.title}</h3>
                  <p className="text-gray-600 mt-2">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="relative flex flex-col md:flex-row justify-center items-center gap-8 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
          >
            <motion.img
              src={pic}
              alt="SkillSwap Community"
              className="w-full max-w-md rounded-xl object-cover shadow-xl"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="relative w-full max-w-md h-[300px]">
              {floatingSkills.map((skill, i) => {
                const angle = (360 / floatingSkills.length) * i;
                const radius = 100;
                const x = Math.cos((angle * Math.PI) / 180) * radius;
                const y = Math.sin((angle * Math.PI) / 180) * radius;
                return (
                  <motion.div
                    key={skill}
                    className="absolute bg-indigo-200 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold shadow-lg select-none cursor-default"
                    style={{
                      top: "50%",
                      left: "50%",
                      x,
                      y,
                      translateX: "-50%",
                      translateY: "-50%",
                    }}
                    animate={{
                      y: [y, y + 12, y],
                      x: [x, x + 12, x],
                    }}
                    transition={{
                      duration: 6 + i * 0.7,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.25,
                    }}
                    title={skill}
                  >
                    {skill}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            className="relative overflow-hidden mt-10 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.8 }}
          >
            <motion.div
              className="flex gap-6 whitespace-nowrap"
              animate={{ x: ["0%", "-100%"] }}
              transition={{
                repeat: Infinity,
                duration: 28,
                ease: "linear",
              }}
            >
              {[...knowledgeKeywords, ...knowledgeKeywords].map((word, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center justify-center w-28 h-16 rounded-full bg-indigo-100 text-indigo-700 font-semibold text-sm shadow-lg select-none cursor-default"
                  title={word}
                >
                  {word}
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            className="max-w-4xl mx-auto flex justify-center gap-12 mb-16"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.3 } },
            }}
          >
            {stats.map(({ label, value, icon: Icon }, i) => (
              <motion.div
                key={label}
                variants={fadeUp}
                className="flex flex-col items-center cursor-default select-none"
                whileHover={{ scale: 1.05, textShadow: "0 0 10px #7e5bef" }}
              >
                <Icon className="w-10 h-10 text-indigo-600 mb-2" />
                <AnimatedCounter value={value} />
                <span className="text-gray-600 mt-1">{label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      <Footer />
      <style>{`
        /* Custom toast purple pulse */
        .Toastify__toast--error.toast-purple-pulse {
          animation: pulse-purple 2.5s infinite ease-in-out;
          border-radius: 12px;
        }
        @keyframes pulse-purple {
          0%, 100% {
            box-shadow: 0 0 10px #a37bfa, 0 0 20px #7e5bef;
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 25px #d6bcfa, 0 0 40px #9e7bf7;
            transform: scale(1.03);
          }
        }
        /* Input styling */
        .input-class {
          transition: all 0.3s ease;
        }
        .input-class:focus {
          border-color: #7e5bef;
          box-shadow: 0 0 10px #7e5bef;
          outline: none;
        }
      `}</style>
    </>
  );
};

// Animated counter component for stats
const AnimatedCounter = ({ value }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = value / (duration / 30);

    const counter = setInterval(() => {
      start += increment;
      if (start >= value) {
        start = value;
        clearInterval(counter);
      }
      setCount(Math.floor(start));
    }, 30);

    return () => clearInterval(counter);
  }, [value]);

  return <span className="text-3xl font-bold text-indigo-700">{count}</span>;
};

export default HeroSection;
