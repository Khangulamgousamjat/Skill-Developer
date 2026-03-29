# 🚀 Gous org — Enterprise Learning Platform
**Smart Skill & Live Learning Module** 

Developed for **Gous org**, this platform is an end-to-end Enterprise Resource Planning (ERP) application focused on cultivating, tracking, and elevating the capabilities of an engineering workforce. Built with a pristine glassmorphic design system and fueled by real-time Google Gemini AI insights, it redefines the modern training dashboard.

---

## 🏗️ Exhaustive System Architecture & Folder Structure

The project is structured as a full-stack monorepo bridging a Vite-React frontend and an Express Node.js backend.

```text
Gous-Org-Learning-Module/
│
├── app_frontend/                 # React 18 + Vite Frontend Application
│   ├── public/                   # Static uncompiled assets (favicons, etc.)
│   ├── src/
│   │   ├── api/                  # API Clients
│   │   │   └── axios.js          # Pre-configured Axios instance with JWT Interceptors and Token Refresh logic
│   │   ├── assets/               # Image resources and SVG backgrounds
│   │   ├── components/           # Modular, Reusable UI Elements
│   │   │   ├── chatbot/          # Draggable, globally available AI Mentor Chatbot
│   │   │   ├── layout/           # Structural elements (Sidebar.jsx, Navbar.jsx, ProtectedRoute.jsx)
│   │   │   └── ui/               # Atomic Design primitives (Input arrays, GlareHover cards, Glass panels)
│   │   ├── context/              # Global State
│   │   │   └── AppContext.jsx    # Unified context provider combining custom hooks for theme and feature toggles
│   │   ├── data/                 # Data Structures
│   │   │   └── mockData.js       # JSON structures for the UI (skillGaps, activeProjects, etc.)
│   │   ├── hooks/                # Custom React Logic
│   │   │   └── useAppLogic.js    # 300+ line custom hook controlling AI states, modal visibility, and overarching UI logic
│   │   ├── pages/                # Route-level Page Components grouped by User Role
│   │   │   ├── admin/            # [Super Admin]
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── ApprovalsPage.jsx (Approve/Reject staff accounts)
│   │   │   │   ├── SettingsPage.jsx (Maintenance mode, API quotas)
│   │   │   │   ├── DepartmentsPage.jsx (CRUD organization departments)
│   │   │   │   ├── UsersPage.jsx (Account suspension/investigation)
│   │   │   │   └── AnalyticsPage.jsx (System-wide metrics via Recharts)
│   │   │   ├── auth/             # [Authentication]
│   │   │   │   ├── LoginPage.jsx
│   │   │   │   ├── RegisterPage.jsx (Intern registration)
│   │   │   │   └── StaffRegisterPage.jsx (HR/Manager registration requiring approval)
│   │   │   ├── dashboard/        # [Wrappers]
│   │   │   │   └── DashboardLayout.jsx (Main authenticated app wrapper with dynamic Sidebar)
│   │   │   ├── hr/               # [HR Admin]
│   │   │   │   ├── InternsPage.jsx (Global roster)
│   │   │   │   ├── AttendancePage.jsx (Lecture participation logs)
│   │   │   │   └── OnboardingPage.jsx (5-step checklist tracking)
│   │   │   ├── manager/          # [Manager]
│   │   │   │   ├── TeamPage.jsx (Direct subordinates view)
│   │   │   │   ├── EvaluationsPage.jsx (Technical & Soft-skill grading sliders)
│   │   │   │   └── ManagerProjectsPage.jsx (Job curriculum assignment)
│   │   │   └── student/          # [Interns]
│   │   │       ├── SkillsPage.jsx (Radar charts & AI Gap analysis)
│   │   │       ├── LecturesPage.jsx (Upcoming live streams & AI pre-briefs)
│   │   │       ├── ProjectsPage.jsx (Kanban task boards)
│   │   │       └── ProfilePage.jsx (Stats & AI Resume generation)
│   │   ├── services/             # Core Integrations
│   │   │   └── geminiApi.js      # Proxy service relaying front-end AI requests to backend REST API safely
│   │   ├── App.jsx               # React Router configuration binding everything together
│   │   ├── index.css             # Tailwind layers, webkit scrollbar resets, and Keyframe animations
│   │   └── main.jsx              # React DOM Mount Point
│   ├── .env                      # Contains VITE_API_BASE_URL
│   ├── tailwind.config.js        # Defines design tokens (fonts, custom colors, animations)
│   └── vite.config.js            # Defines proxy mapping for localhost dev server
│
└── backend/                      # Node.js + Express + Supabase API
    ├── migrations/               # Database Architecture Definitions
    │   └── 001_initial_schema.sql# Over 20+ tables defining Users, Departments, Skills, Projects, Sessions, and Attendance
    ├── src/
    │   ├── config/               
    │   │   └── db.js             # PostgreSQL Pool configuration mapping to Supabase connection string
    │   ├── controllers/          # Core Business Logic and Endpoint Handlers
    │   │   ├── admin.controller.js  # Approvals processing, global analytics accumulation
    │   │   ├── ai.controller.js     # Uses @google/genai to process prompt generation, skill gap analysis, and lecture questions
    │   │   ├── auth.controller.js   # JWT minting, password hashing, HttpOnly cookie generation
    │   │   ├── hr.controller.js     # Complex SQL JOINs filtering intern cross-department statistics
    │   │   └── manager.controller.js# SQL queries binding evaluations to specific team members
    │   ├── middleware/           # Security & Interceptors
    │   │   ├── auth.middleware.js   # decode() logic to ensure valid JWT signatures present in cookies
    │   │   └── roleCheck.middleware.js # RBAC logic to cross-reference required roles for an endpoint
    │   ├── routes/               # Express Router mapping paths exactly to Controllers
    │   │   ├── admin.routes.js
    │   │   ├── ai.routes.js
    │   │   ├── auth.routes.js
    │   │   ├── hr.routes.js
    │   │   └── manager.routes.js
    │   └── app.js                # Instantiates Express. Sets Helmet, CORS, Cookie-Parser, and the Global Error Handler
    ├── .env                      # Master Environment Variables (Supabase string, Gemini Key, JWT Secret)
    ├── package.json              # Express dependencies
    ├── seed_users.js             # Initialization script executing INSERT commands to create Admin testing accounts
    └── server.js                 # Network Entry Point bounding Express app to given PORT
```

---

## 🗄️ Master Database Schema (Supabase PostgreSQL)

The database `001_initial_schema.sql` defines the relationships operating SSLLM:

- **`platform_settings`**: Global keys toggling open registration, API quotas, and system maintenance.
- **`departments`**: Isolated silos (e.g., "Engineering", "Marketing").
- **`roles`**: Enumerated definitions (`student`, `expert`, `hr_admin`, `manager`, `super_admin`).
- **`users`**: The central entity table combining email, hashed passwords, roles, status (`active`, `pending_approval`), and foreign keys mapping to departments/managers.
- **`skills` & `department_skills`**: The core logic table defining what skills are required for specific departments on a scale of 1-100.
- **`intern_skills`**: Tracks the dynamic progress of an intern against the `department_skills` targets.
- **`projects` & `project_assignments`**: Links tasks/curriculum assignments directly to users, along with kanban status columns (`todo`, `in_progress`, `review`).
- **`lectures` & `lecture_attendance`**: Tracks scheduled educational streams with foreign keys attributing attendance to users.
- **`evaluations`**: Hard data table storing 1-10 scores written by Managers, with notes columns.

---

## 🌟 The "Gemini 2.5" AI Implementation Deep-Dive

SSLLM leverages Google's **Gemini 2.5 Flash API** extensively. To maintain zero-trust security architecture, the `GEMINI_API_KEY` never touches the React frontend. 

1. **The AI Router:** Custom queries generated in React via `app_frontend/src/services/geminiApi.js` encapsulate the prompt and send a `POST` request to `[SERVER]/api/ai/ask`.
2. **The AI Controller:** The Node.js Express Controller at `src/controllers/ai.controller.js` parses the incoming request, injects system meta-prompts (e.g. "Act as a Senior Developer..."), and fires off a generation task using the official `@google/genai` library.
3. **Delivery:** The structured JSON string is passed safely back to the frontend to render inside the target UI module.

**Modules Powered by this Integration include:**
* **Chatbot Modal**: Real-time context-aware mentoring.
* **Skill Gap Analysis `[GET /api/ai/skill-gap/:internId]`**: Generates actionable text comparing the intern's specific scores retrieved from `intern_skills` to `department_skills`.
* **Lecture Prep `[POST /api/ai/lecture-prep]`**: Calculates required prerequisite reading before a student joins a live-lecture based on the topic.
* **Career Action Generation**: Synthesizes projects into LinkedIn bio snippets and team Stand-up Slack updates on command.

---

## 🛠️ Exhaustive Setup & Installation Guide

A complete master list of setup steps to clone, configure, run, and modify the platform.

### Prerequisites Checklist
*   **Node.js**: Version 18.0.0 or higher.
*   **PostgreSQL**: Version 14 or higher (Via Supabase or locally hosted).
*   **Google Gemini AI Platform**: You must generate a free API key via Google AI Studio.
*   **SendGrid** (Optional): A dummy key is fine if you are bypassing mailing systems.

### 1. Database Initialization
1. Create a free account on **Supabase**.
2. Create a new Organization and Database.
3. Copy the "Transaction Pooler" or standard "Session" connection string provided under Database -> Settings. Let's call this `YOUR_DB_STRING`.
4. Navigate to the Supabase SQL Editor UI and copy-paste the entirety of `backend/migrations/001_initial_schema.sql` and click **Run**.
5. Your tables, constraints, and relationships are now initialized.

### 2. Backend Environment Settings
Navigate into `/backend/` and run `npm install`.
Create a `.env` file at the root of `backend/` and rigorously fill out these values:

```env
# Network Settings
PORT=5000

# Security (Crucial: Generate a 64 character random string here)
JWT_ACCESS_SECRET=your_super_secret_jwt_key_that_is_very_long_and_complex
COOKIE_SECRET=optional_layer_of_security

# Database Configuration (From Supabase Step 1)
# Ensure you append ?sslmode=require if connecting from localhost!
DATABASE_URL=postgres://[user]:[password]@[host]:[port]/postgres?sslmode=require

# External Services
GEMINI_API_KEY=AIzaSy...[Your-Google-AI-Key]

# Mailing Configuration (Insert a fake ID if skipping mailing)
RESEND_API_KEY=re_your-key-here
FROM_EMAIL=onboarding@resend.dev
FROM_NAME=Gous org
```

### 3. Backend Test Data Generation
While terminal is within `/backend/`, execute:
```bash
node seed_users.js
```
This forces the creation of `platform_settings` logic and inserts your testing profiles over the encrypted API.
Test Profiles generated:
*   `hr@gousorg.com` / `HrAdmin@12`
*   `manager@gousorg.com` / `Manager@12`

> *To setup your Super Admin, manually go into Supabase Table Editor, create a row in `users`, and set role to `super_admin`.*

Run the backend continuously:
```bash
npm run dev
```

### 4. Frontend Environment Settings
Open a new terminal, navigate into `/app_frontend/` and run `npm install`.
Create a `.env` file at the root of `app_frontend/`:

```env
# Important: Must map directly to your backend server prefix route.
VITE_API_BASE_URL=http://localhost:5000/api
```

Boot the frontend:
```bash
npm run dev -- --port 5173
```
*Platform should now be live at `http://localhost:5173`.*

---

## 🎨 Modifying The Design System (Tailwind)
The SSLLM system utilizes "Glassmorphism" as its primary aesthetic, bound to dynamic theme tokens.

1. **Theme Tokens**: Look inside `app_frontend/src/context/AppContext.jsx`. The variable `t` contains conditional class strings (dark vs light mode).
2. **Animations**: Built-in Tailwind keyframes (`animate-fade-in`, `animate-slide-up`, `glare-hover`) are explicitly defined inside `tailwind.config.js`. You can adjust timing loops within the `theme: { extend: {} }` keys.
3. **Gradients**: Core identity colors are `#1E3A5F` (Navy), `#00D2FF` (Cyan Glow), and `#F4A100` (Amber).

---

## 🚢 Production Deployment Playbook

### Backend (Render / Heroku)
1. Fork or upload this complete repository into your personal GitHub.
2. Link the repository to your hosting provider. Set Root Directory manually to `backend/`.
3. Set the installation command to `npm install` and your start command to `node src/server.js`.
4. Copy ALL values from your local `backend/.env` file directly into the Web Service's Environment Variables GUI. (Do not upload the .env file to git).

### Frontend (Vercel / Netlify)
1. Link your personal GitHub repository to Vercel.
2. Set Root Directory manually to `app_frontend/`.
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Very Important: Add the environment variable `VITE_API_BASE_URL` to Vercel. Set the value to exactly whatever the HTTPS link of your backend is *(Example: `https://ssllm-api.onrender.com/api`)*.
6. Trigger the build.

---
📝 *Built for Gous org with extreme precision to elevate the standard of learning and management within the modern Enterprise.*
