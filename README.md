# Skill Developer Platform

A comprehensive, full-stack **Skill Development & Learning Management System** built for organizations to manage student learning journeys, live lectures, AI-powered recommendations, projects, certificates, and more.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-ES_Modules-339933?logo=node.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Auth-3ECF8E?logo=supabase&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-Realtime-010101?logo=socket.io&logoColor=white)

---

## ✨ Features

### 🎓 Student Portal
- **Dashboard** — Personalized skill scores, project stats, upcoming lectures
- **AI Assistant** — Gemini-powered chatbot for learning guidance
- **Learning Path** — AI-generated roadmaps tailored to career goals
- **Projects** — Submit, track, and manage personal & assigned projects
- **Lectures** — Join live sessions, watch recordings
- **Certificates** — Earn verified certificates with QR codes
- **Skill Gap Analysis** — Identify & bridge skill gaps
- **Leaderboard & Forums** — Collaborative learning community

### 👨‍🏫 Teacher Portal
- Manage lectures, resources, and Q&A sessions
- Track student progress and submissions

### 👔 Manager & HR Portals
- Team progress tracking & skill heat maps
- Intern evaluations & department comparisons
- Certificate management

### 🛡️ Admin Portal
- User management & approval workflows
- Department & skill management
- System logs & org-wide settings
- Announcement broadcasts

### 🌐 Platform-wide
- **Multi-language support** — English, Hindi, Marathi, French, Russian, Arabic
- **Dark/Light mode** — Full theme system with CSS variables
- **Real-time messaging** — Socket.io powered chat
- **Responsive design** — Works on desktop, tablet, and mobile

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite 5, TailwindCSS 3.4, Framer Motion, Recharts |
| **State** | Redux Toolkit, Redux Persist |
| **Backend** | Node.js, Express.js, Socket.io |
| **Database** | PostgreSQL (via Supabase) |
| **Auth** | Supabase Auth + JWT |
| **AI** | Google Gemini AI (via @google/genai) |
| **Storage** | Cloudinary (images/files) |
| **Email** | Resend |
| **Deployment** | Vercel (frontend), Render (backend) |

---

## 📁 Project Structure

```
Skill-Developer/
├── frontend/                 # React + Vite frontend
│   ├── src/
│   │   ├── api/              # Axios instance & API helpers
│   │   ├── components/       # Reusable UI components
│   │   │   ├── layout/       # DashboardLayout, Sidebar
│   │   │   ├── modals/       # ProfileCompletionModal, etc.
│   │   │   ├── cards/        # StatCard, etc.
│   │   │   ├── shared/       # UnifiedMessages, etc.
│   │   │   └── ChatBot/      # AI ChatBot component
│   │   ├── context/          # SocketContext
│   │   ├── contexts/         # LanguageContext, ThemeContext
│   │   ├── hooks/            # Custom hooks
│   │   ├── pages/            # Route pages
│   │   │   ├── student/      # Student dashboard, projects, etc.
│   │   │   ├── admin/        # Admin dashboard, user mgmt, etc.
│   │   │   ├── teacher/      # Teacher lectures, resources
│   │   │   ├── manager/      # Manager team progress
│   │   │   ├── hr/           # HR evaluations, interns
│   │   │   └── dashboard/    # Super admin dashboard
│   │   ├── store/            # Redux slices
│   │   ├── services/         # Supabase client
│   │   ├── utils/            # Translations, theme helpers
│   │   ├── Router.jsx        # App routing
│   │   ├── main.jsx          # Entry point
│   │   └── index.css         # Global styles & CSS variables
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── backend/                  # Node.js + Express backend
│   ├── server.js             # Entry point
│   ├── src/
│   │   ├── app.js            # Express app setup
│   │   ├── config/           # DB, socket, cloudinary config
│   │   ├── controllers/      # Route handlers
│   │   ├── middleware/       # Auth, validation middleware
│   │   ├── routes/           # API routes
│   │   ├── services/         # Business logic
│   │   ├── utils/            # Helpers
│   │   ├── jobs/             # Cron jobs
│   │   └── seeders/          # Database seeders
│   ├── migrations/           # SQL migration files
│   └── package.json
│
├── package.json              # Root workspace scripts
├── vercel.json               # Vercel deployment config
└── README.md
```

---

## 🚀 Quick Start

See [setup.md](./setup.md) for detailed setup instructions.

```bash
# 1. Clone the repository
git clone https://github.com/Khangulamgousamjat/Skill-Developer.git
cd Skill-Developer

# 2. Install dependencies
npm install              # Installs frontend + backend deps

# 3. Configure environment
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
# Edit both .env files with your credentials

# 4. Run development servers
cd frontend && npm run dev    # Frontend on http://localhost:5173
cd backend && npm run dev     # Backend on http://localhost:5000
```

---

## 🔑 Environment Variables

### Frontend (`frontend/.env`)
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Backend (`backend/.env`)
```env
PORT=5000
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GEMINI_API_KEY=your_gemini_api_key
RESEND_API_KEY=your_resend_api_key
```

---

## 🌍 Supported Languages

| Language | Code |
|----------|------|
| English  | `en` |
| Hindi    | `hi` |
| Marathi  | `mr` |
| French   | `fr` |
| Russian  | `ru` |
| Arabic   | `ar` |

---

## 📦 Deployment

### Frontend (Vercel)
```bash
npm run build    # Builds to frontend/dist/
```
The `vercel.json` at the root handles SPA routing.

### Backend (Render)
Set the start command to `node server.js` and configure the environment variables.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📜 License

This project is private and proprietary. All rights reserved.

---

## 👨‍💻 Author

**Gous Khan** — Built with ❤️ for skill development and learning.
