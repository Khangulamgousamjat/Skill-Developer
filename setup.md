# Setup Guide — Skill Developer Platform

Complete guide to set up the Skill Developer Platform for local development and production deployment.

---

## Prerequisites

Before you begin, ensure you have the following installed:

| Tool | Version | Download |
|------|---------|----------|
| **Node.js** | v18+ | [nodejs.org](https://nodejs.org) |
| **npm** | v9+ | Comes with Node.js |
| **Git** | Latest | [git-scm.com](https://git-scm.com) |

You'll also need accounts for:
- [Supabase](https://supabase.com) — Database & Authentication
- [Cloudinary](https://cloudinary.com) — Image/file storage
- [Google AI Studio](https://aistudio.google.com) — Gemini AI API key
- [Resend](https://resend.com) — Email service (optional)

---

## 1. Clone the Repository

```bash
git clone https://github.com/Khangulamgousamjat/Skill-Developer.git
cd Skill-Developer
```

---

## 2. Install Dependencies

From the project root:

```bash
# Install all dependencies (frontend + backend)
npm install
```

This runs `npm install` in both `frontend/` and `backend/` directories automatically.

Or install them separately:

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

---

## 3. Configure Supabase

### 3.1 Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note your **Project URL** and **Anon Key** from Settings → API
3. Note your **Service Role Key** (for backend)

### 3.2 Run Database Migrations

The project includes SQL migration files in `backend/migrations/`. Run them in order in the Supabase SQL Editor:

1. Go to your Supabase Dashboard → SQL Editor
2. Execute each migration file from `backend/migrations/` in order
3. This creates all required tables: users, projects, lectures, certificates, etc.

### 3.3 Enable Auth

1. In Supabase Dashboard → Authentication → Providers
2. Enable **Email** authentication
3. Disable email confirmation for development (optional)

---

## 4. Configure Environment Variables

### 4.1 Frontend Environment

Create `frontend/.env`:

```env
# API endpoints
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000

# Supabase (from your Supabase project settings)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 4.2 Backend Environment

Create `backend/.env`:

```env
# Server
PORT=5000
NODE_ENV=development

# Database (Supabase PostgreSQL connection string)
DATABASE_URL=postgresql://postgres:your_password@db.your-project.supabase.co:5432/postgres

# Authentication
JWT_SECRET=your_random_secret_string_here
JWT_EXPIRES_IN=7d

# Supabase Admin
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Cloudinary (for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Resend Email (optional)
RESEND_API_KEY=your_resend_api_key

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

---

## 5. Run Development Servers

### Frontend (Vite dev server)

```bash
cd frontend
npm run dev
```

The frontend will be available at **http://localhost:5173**

### Backend (Express + Socket.io)

```bash
cd backend
npm run dev
```

The backend API will be available at **http://localhost:5000**

> **Note:** The backend uses `nodemon` for auto-reload during development. If `nodemon` is not found, run `npx nodemon server.js` or use `npm start` instead.

---

## 6. Default User Roles

The platform supports 5 user roles:

| Role | Access Level |
|------|-------------|
| `student` | Student dashboard, projects, lectures, certificates, AI assistant |
| `teacher` | Lecture management, resource uploads, Q&A, student progress |
| `manager` | Team progress, skill heat maps, project oversight |
| `hr_admin` | Intern management, evaluations, department comparisons |
| `super_admin` | Full system access: users, approvals, departments, skills, logs |

New users register as `student` by default. Other roles require admin approval.

---

## 7. Build for Production

### Frontend Build

```bash
cd frontend
npm run build
```

This generates optimized static files in `frontend/dist/`.

### Backend Production Start

```bash
cd backend
npm start
```

---

## 8. Deployment

### Frontend → Vercel

1. Connect your GitHub repo to [Vercel](https://vercel.com)
2. Set the **Root Directory** to `frontend`
3. Set the **Build Command** to `npm run build`
4. Set the **Output Directory** to `dist`
5. Add environment variables in Vercel dashboard
6. The `vercel.json` in the root handles SPA routing automatically

### Backend → Render

1. Create a new **Web Service** on [Render](https://render.com)
2. Connect your GitHub repo
3. Set the **Root Directory** to `backend`
4. Set the **Build Command** to `npm install`
5. Set the **Start Command** to `node server.js`
6. Add all backend environment variables
7. Set `NODE_ENV=production`

---

## 9. Troubleshooting

### Common Issues

| Issue | Solution |
|-------|---------|
| `nodemon: not found` | Run `npm install` in backend, or use `npx nodemon server.js` |
| Build fails with CSS error | Ensure `tailwind.config.js` has the shadcn color mappings |
| CORS errors | Check `FRONTEND_URL` in backend `.env` matches your frontend URL |
| Socket.io won't connect | Ensure `VITE_SOCKET_URL` points to the backend root (not `/api`) |
| Supabase auth errors | Verify `SUPABASE_URL` and `SUPABASE_ANON_KEY` are correct |
| AI chatbot not working | Check `GEMINI_API_KEY` is set in backend `.env` |

### Resetting the Database

If you need to start fresh:
1. Go to Supabase SQL Editor
2. Drop all tables
3. Re-run the migration files from `backend/migrations/`

---

## 10. Project Scripts

### Root
```bash
npm run dev        # Start frontend dev server
npm run build      # Build frontend for production
npm install        # Install all dependencies
```

### Frontend
```bash
npm run dev        # Vite dev server (port 5173)
npm run build      # Production build
npm run preview    # Preview production build
npm run lint       # ESLint check
```

### Backend
```bash
npm run dev        # Nodemon dev server (port 5000)
npm start          # Production server
```

---

## Need Help?

- Check the [README.md](./README.md) for an overview
- Review the [CREDENTIALS_GUIDE.md](./CREDENTIALS_GUIDE.md) for API key setup
- Open an issue on GitHub for bugs or feature requests
