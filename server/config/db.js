const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

exports.connect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("✅ Database connected successfully!");
    } catch (error) {
        console.error("❌ DB Connection Failed:", error);
        process.exit(1);
    }
};
