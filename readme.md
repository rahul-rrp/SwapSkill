# 🔁 SkillSwap – Peer-to-Peer Skill Exchange Platform

SkillSwap is a MERN stack-based platform that allows users to **connect, teach, and learn** from each other by exchanging skills in real-time.

## 🚀 Features

- 🔐 Secure authentication (Signup / Login)
- 🎯 Search users by skill
- 📨 Send / Accept / Reject skill exchange requests
- 💬 Real-time chat system
- 📊 Dashboard with user stats
- 👤 Profile management

## 🛠️ Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Framer Motion
- **Backend:** Node.js, Express.js, MongoDB
- **Auth:** JWT-based authentication
- **UI Icons:** Lucide, Heroicons
- **API Testing:** Postman

## 📁 Folder Structure (Frontend)

src/
├── api/ # Axios API requests
├── components/ # UI Components (Chat, Forms, Lists)
├── context/ # Auth Context
├── pages/ # Page views like Login, Dashboard
├── routes/ # Protected & public route handlers
└── main.jsx # Entry point

markdown
Copy
Edit

## 👥 Team Credits

- 👨‍💻 Developed & Led by: **Rahul Prajapati**
- 🎨 Designed by: **Hritik Singh**
- 📚 Documented by: **Kaif**
- 🧠 Backend & Frontend Support: **Abhinandan Maurya**

## 🔗 Connect with Us

- 💼 [LinkedIn – Rahul Prajapati](https://www.linkedin.com/in/rahul-rrp)
- 💻 [GitHub – rahul-rrp](https://github.com/rahul-rrp)

---

> ✨ *“Learn. Teach. Grow. Together with SkillSwap.”*
🚀 Deployment Steps (MERN Stack)
🔧 Backend Setup
Clone the backend repo

bash
Copy
Edit
git clone <your-backend-repo-url>
cd backend
Install dependencies

bash
Copy
Edit
npm install
Create .env file
Add this in the root of your backend:

env
Copy
Edit
PORT=5000
MONGODB_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret_key
Start the server

bash
Copy
Edit
npm run dev
🌐 Frontend Setup
Clone the frontend repo

bash
Copy
Edit
git clone <your-frontend-repo-url>
cd frontend
Install dependencies

bash
Copy
Edit
npm install
Create .env file
Add this to the root of your frontend:

env
Copy
Edit
VITE_API_BASE_URL=http://localhost:5000/api
Run the app

bash
Copy
Edit
npm run dev
📦 Production Deployment
🟢 Backend (Render, Railway, or VPS)
Set up your MongoDB URI and JWT_SECRET in environment variables.

Deploy index.js or server.js.

🔵 Frontend (Vercel, Netlify)
Set VITE_API_BASE_URL to your live backend URL.

Build and deploy:

bash
Copy
Edit
npm run build