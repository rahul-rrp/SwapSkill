import React from "react";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <motion.footer
      className="bg-gradient-to-b from-indigo-50 to-white text-gray-700 py-12 mt-16 border-t border-gray-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-gray-300 pb-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold text-indigo-700 mb-4">About SkillSwap</h3>
            <p className="text-sm leading-6 text-gray-600">
              SkillSwap is a peer‑to‑peer skill exchange platform. Connect, teach, and learn
              in real-time with a vibrant global community.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold text-indigo-700 mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/"
                  className="hover:text-indigo-600 transition-colors duration-200"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="hover:text-indigo-600 transition-colors duration-200"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="/features"
                  className="hover:text-indigo-600 transition-colors duration-200"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="hover:text-indigo-600 transition-colors duration-200"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-xl font-bold text-indigo-700 mb-4">Follow Us</h3>
            <div className="flex space-x-4 text-2xl">
              <a
                href="#"
                className="hover:text-indigo-600 transition-colors duration-200"
                aria-label="Facebook"
              >
                🌐
              </a>
              <a
                href="#"
                className="hover:text-indigo-600 transition-colors duration-200"
                aria-label="Twitter"
              >
                🐦
              </a>
              <a
                href="#"
                className="hover:text-indigo-600 transition-colors duration-200"
                aria-label="Instagram"
              >
                📸
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} SkillSwap. All rights reserved.</p>
          <p className="mt-4 md:mt-0">
            Built with ❤️ for learners & mentors.
          </p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
