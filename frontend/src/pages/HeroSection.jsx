import React from "react";
import { Lightbulb, Users, GraduationCap, Search, Linkedin, Github } from "lucide-react";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <>
      <section className="pt-20 pb-24 bg-gradient-to-b from-white to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          {/* Hero Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-1 rounded-full mb-5 text-sm font-medium"
          >
            <Lightbulb className="w-4 h-4 animate-bounce" />
            Empowering peer-to-peer education
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-6"
          >
            Learn, Teach, and Grow with{" "}
            <motion.span
              initial={{ scale: 0.9 }}
              animate={{ scale: 1.05 }}
              transition={{ yoyo: Infinity, duration: 1 }}
              className="text-indigo-600 underline decoration-wavy"
            >
              SkillSwap
            </motion.span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto mb-10"
          >
            Connect with learners and mentors around the world. Exchange skills, collaborate
            on projects, and create a smarter future — together.
          </motion.p>

          {/* Search Input */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="relative max-w-xl mx-auto mb-10"
          >
            <input
              type="text"
              placeholder="Search skills (e.g. Python, Guitar, Public Speaking)"
              className="w-full py-3 pl-12 pr-4 border border-gray-300 rounded-full shadow-md focus:outline-indigo-500 text-gray-700"
            />
            <Search className="absolute left-4 top-3 text-gray-400 animate-pulse" />
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-4 mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <motion.a
              href="/signup"
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center justify-center px-8 py-3 text-white bg-indigo-600 hover:bg-indigo-700 font-semibold text-base rounded-full transition duration-300 shadow-lg"
            >
              Join Now
            </motion.a>
            <motion.a
              href="/signin"
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center justify-center px-8 py-3 text-indigo-600 border border-indigo-600 hover:bg-indigo-50 font-semibold text-base rounded-full transition duration-300"
            >
              Login
            </motion.a>
          </motion.div>

          {/* Features */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.2 } },
            }}
          >
            {[{
              icon: <GraduationCap className="w-8 h-8 mb-2 animate-bounce" />,
              title: "Learn Anything",
              desc: "From tech to music, discover skills from real mentors.",
              bg: "bg-indigo-50",
            }, {
              icon: <Users className="w-8 h-8 mb-2 animate-pulse" />,
              title: "Teach What You Know",
              desc: "Help others by sharing your own unique talents.",
              bg: "bg-green-50",
            }, {
              icon: <Lightbulb className="w-8 h-8 mb-2 animate-wiggle" />,
              title: "Collaborate & Build",
              desc: "Connect through projects and boost your portfolio.",
              bg: "bg-yellow-50",
            }].map((card, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className={`p-6 rounded-xl text-gray-800 shadow-sm hover:shadow-md transition ${card.bg}`}
              >
                {card.icon}
                <h4 className="font-semibold text-lg">{card.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{card.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Illustration */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="relative mt-16 flex flex-col items-center"
          >
            <img
              src="https://illustrations.popsy.co/gray/teacher-and-student-2.svg"
              alt="SkillSwap Community"
              className="w-full max-w-xl mx-auto animate-fade-in"
            />
            <div className="flex -space-x-4 mt-6">
              {["A", "B", "C", "D"].map((l, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-indigo-200 text-indigo-700 font-bold flex items-center justify-center border-2 border-white shadow-md"
                >
                  {l}
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              12,000+ learners and mentors already connected
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 px-4 mt-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4">
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>SkillSwap</strong> © {new Date().getFullYear()}</p>
            <p>Developed & Led by <strong>Rahul Prajapati</strong></p>
            <p>Designed & Frontend by <strong>Hritik Singh</strong></p>
            <p>Documented by <strong>Kaif</strong></p>
            <p>Helped in Backend & Frontend by <strong>Abhinandan Maurya</strong></p>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <a
              href="https://www.linkedin.com/in/rahul-rrp"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-indigo-600 transition"
            >
              <Linkedin className="w-6 h-6" />
            </a>
            <a
              href="https://github.com/rahul-rrp"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-indigo-600 transition"
            >
              <Github className="w-6 h-6" />
            </a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default HeroSection;
