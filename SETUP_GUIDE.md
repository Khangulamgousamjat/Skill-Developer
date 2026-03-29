# Smart Skill & Live Learning Module — Master Setup Guide

This document contains everything you need to set up the necessary third-party services and initialize your database for the Gous org Learning Platform. Follow these steps sequentially.

---

## Part 1: Required API Keys & URLs

### 1. PostgreSQL Database (Supabase) 🐘
*Used for: Core database. Storing users, roles, and dashboards.*

1. Go to **[https://supabase.com/](https://supabase.com/)** and click **Start your project**.
2. Create a new organization and project (e.g., `Gous org Learning Database`). 
3. **Important:** Create a strong Database Password and save it somewhere secure.
4. Once the database finishes provisioning, go to **Settings (Gear Icon on the left) -> Database**.
5. Scroll down to the **Connection string** section and click the **URI** tab.
6. Copy the string. It will look like this: `postgresql://postgres.xxx:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres`
7. Replace `[YOUR-PASSWORD]` with the password you created in Step 3.
8. **Paste this into `.env`** as `DATABASE_URL`.

### 2. Email Delivery (Resend) 📧
*Used for: Secure Student/Staff OTP Verification.*

1. Go to **[https://resend.com/](https://resend.com/)** and create a search account.
2. In the left menu dashboard, go to **Settings -> API Keys**.
3. Click **Create API Key** (top right).
4. Name it `Gous org Backend` and copy it.
5. Copy the generated key (it starts with `SG.`).
6. **Paste this into `.env`** as `RESEND_API_KEY`.
7. Go to **Settings -> Sender Authentication** and register your sender email.
8. **Paste this email into `.env`** as `FROM_EMAIL`. Use `onboarding@resend.dev` for testing.

### 3. Gemini 2.5 Flash AI 🤖
*Used for: AI Mentor Chatbot and dynamic generation tools.*

1. Go to **[https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)** and log in with Google.
2. Click **Create API Key** (Create in a new project).
3. Copy the long character string.
4. **Paste this into `.env`** as `GEMINI_API_KEY`.

*(Note: If you also want to set up Redis, Cloudinary, and OpenAI early, refer back to the `CREDENTIALS_GUIDE.md` file for their URLs. The above 3 are strictly required right now).*

---

## Part 2: Supabase Raw SQL Setup

Once you have created your Supabase project (from Part 1, Step 1), you need to initialize the 29 tables.

1. Go back to your [Supabase Dashboard](https://supabase.com/dashboard).
2. On the left sidebar, click the **SQL Editor** icon (it looks like a terminal `>_`).
3. Click **New Query**.
4. **Copy the entire block of SQL code below** and paste it into the editor.
5. Click the green **Run** button at the bottom right.

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────────
-- ENUMS
-- ─────────────────────────────────────────────
CREATE TYPE user_role AS ENUM (
  'super_admin', 'hr_admin', 'manager', 'expert', 'student'
);

CREATE TYPE account_status AS ENUM (
  'pending_email', 'pending_approval', 'active', 'rejected', 'deactivated'
);

CREATE TYPE skill_level AS ENUM (
  'beginner', 'intermediate', 'advanced'
);

CREATE TYPE skill_priority AS ENUM (
  'critical', 'important', 'nice_to_have'
);

CREATE TYPE lecture_status AS ENUM (
  'scheduled', 'live', 'completed', 'cancelled'
);

CREATE TYPE project_status AS ENUM (
  'todo', 'in_progress', 'under_review', 'completed'
);

CREATE TYPE project_difficulty AS ENUM (
  'easy', 'medium', 'hard'
);

CREATE TYPE resource_type AS ENUM (
  'pdf', 'ppt', 'video', 'link', 'zip'
);

CREATE TYPE certificate_type AS ENUM (
  'skill', 'project', 'milestone', 'completion'
);

CREATE TYPE notification_type AS ENUM (
  'lecture_reminder', 'project_deadline', 'certificate_issued',
  'approval_update', 'message_received', 'announcement',
  'red_flag', 'project_reviewed', 'skill_verified'
);

CREATE TYPE request_status AS ENUM (
  'pending', 'approved', 'rejected'
);

CREATE TYPE recommendation_status AS ENUM (
  'pending', 'completed', 'skipped'
);

CREATE TYPE feedback_type AS ENUM (
  'thumbs_up', 'thumbs_down'
);

-- ─────────────────────────────────────────────
-- TABLE 1: departments (no FK yet)
-- ─────────────────────────────────────────────
CREATE TABLE departments (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          VARCHAR(100) NOT NULL UNIQUE,
  description   TEXT,
  manager_id    UUID,
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMP DEFAULT NOW(),
  updated_at    TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- TABLE 2: users
-- ─────────────────────────────────────────────
CREATE TABLE users (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name           VARCHAR(150) NOT NULL,
  email               VARCHAR(255) NOT NULL UNIQUE,
  password_hash       VARCHAR(255) NOT NULL,
  role                user_role NOT NULL DEFAULT 'student',
  department_id       UUID REFERENCES departments(id) ON DELETE SET NULL,
  employee_id         VARCHAR(100),
  profile_photo_url   VARCHAR(500),
  bio                 TEXT,
  phone               VARCHAR(20),
  is_email_verified   BOOLEAN DEFAULT FALSE,
  account_status      account_status DEFAULT 'pending_email',
  rejection_reason    TEXT,
  access_reason       TEXT,
  dark_mode           BOOLEAN DEFAULT FALSE,
  last_active         TIMESTAMP,
  created_at          TIMESTAMP DEFAULT NOW(),
  updated_at          TIMESTAMP DEFAULT NOW()
);

-- Add manager FK back to departments
ALTER TABLE departments
  ADD CONSTRAINT fk_dept_manager
  FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE SET NULL;

-- ─────────────────────────────────────────────
-- TABLE 3: role_requests
-- ─────────────────────────────────────────────
CREATE TABLE role_requests (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  requested_role    user_role NOT NULL,
  department_id     UUID REFERENCES departments(id) ON DELETE SET NULL,
  employee_id       VARCHAR(100) NOT NULL,
  reason            TEXT NOT NULL,
  status            request_status DEFAULT 'pending',
  reviewed_by       UUID REFERENCES users(id) ON DELETE SET NULL,
  rejection_reason  TEXT,
  requested_at      TIMESTAMP DEFAULT NOW(),
  reviewed_at       TIMESTAMP
);

-- ─────────────────────────────────────────────
-- TABLE 4: otp_verifications
-- ─────────────────────────────────────────────
CREATE TABLE otp_verifications (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  otp_code    VARCHAR(6) NOT NULL,
  purpose     VARCHAR(50) NOT NULL,
  expires_at  TIMESTAMP NOT NULL,
  used        BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- TABLE 5: refresh_tokens
-- ─────────────────────────────────────────────
CREATE TABLE refresh_tokens (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash   VARCHAR(255) NOT NULL UNIQUE,
  expires_at   TIMESTAMP NOT NULL,
  is_revoked   BOOLEAN DEFAULT FALSE,
  created_at   TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- TABLE 6: skills
-- ─────────────────────────────────────────────
CREATE TABLE skills (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name         VARCHAR(150) NOT NULL UNIQUE,
  category     VARCHAR(100) NOT NULL,
  description  TEXT,
  created_by   UUID REFERENCES users(id) ON DELETE SET NULL,
  is_active    BOOLEAN DEFAULT TRUE,
  created_at   TIMESTAMP DEFAULT NOW(),
  updated_at   TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- TABLE 7: department_skills
-- ─────────────────────────────────────────────
CREATE TABLE department_skills (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  department_id   UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  skill_id        UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  required_level  skill_level NOT NULL DEFAULT 'beginner',
  priority        skill_priority NOT NULL DEFAULT 'important',
  created_at      TIMESTAMP DEFAULT NOW(),
  UNIQUE(department_id, skill_id)
);

-- ─────────────────────────────────────────────
-- TABLE 8: intern_skills
-- ─────────────────────────────────────────────
CREATE TABLE intern_skills (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  intern_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  skill_id       UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  current_level  skill_level NOT NULL DEFAULT 'beginner',
  is_verified    BOOLEAN DEFAULT FALSE,
  verified_by    UUID REFERENCES users(id) ON DELETE SET NULL,
  verified_at    TIMESTAMP,
  updated_at     TIMESTAMP DEFAULT NOW(),
  UNIQUE(intern_id, skill_id)
);

-- ─────────────────────────────────────────────
-- TABLE 9: lectures
-- ─────────────────────────────────────────────
CREATE TABLE lectures (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title            VARCHAR(255) NOT NULL,
  description      TEXT,
  expert_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  department_id    UUID REFERENCES departments(id) ON DELETE SET NULL,
  skill_id         UUID REFERENCES skills(id) ON DELETE SET NULL,
  scheduled_at     TIMESTAMP NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  meeting_link     VARCHAR(500),
  recording_url    VARCHAR(500),
  status           lecture_status DEFAULT 'scheduled',
  created_at       TIMESTAMP DEFAULT NOW(),
  updated_at       TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- TABLE 10: lecture_attendance
-- ─────────────────────────────────────────────
CREATE TABLE lecture_attendance (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lecture_id              UUID NOT NULL REFERENCES lectures(id) ON DELETE CASCADE,
  intern_id               UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  joined_at               TIMESTAMP,
  left_at                 TIMESTAMP,
  duration_watched_minutes INTEGER DEFAULT 0,
  is_manual               BOOLEAN DEFAULT FALSE,
  marked_by               UUID REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE(lecture_id, intern_id)
);

-- ─────────────────────────────────────────────
-- TABLE 11: lecture_resources
-- ─────────────────────────────────────────────
CREATE TABLE lecture_resources (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lecture_id    UUID NOT NULL REFERENCES lectures(id) ON DELETE CASCADE,
  title         VARCHAR(255) NOT NULL,
  file_url      VARCHAR(500) NOT NULL,
  resource_type resource_type NOT NULL,
  uploaded_by   UUID REFERENCES users(id) ON DELETE SET NULL,
  uploaded_at   TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- TABLE 12: lecture_questions
-- ─────────────────────────────────────────────
CREATE TABLE lecture_questions (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lecture_id    UUID NOT NULL REFERENCES lectures(id) ON DELETE CASCADE,
  intern_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  answer_text   TEXT,
  answered_by   UUID REFERENCES users(id) ON DELETE SET NULL,
  answered_at   TIMESTAMP,
  asked_at      TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- TABLE 13: projects
-- ─────────────────────────────────────────────
CREATE TABLE projects (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title            VARCHAR(255) NOT NULL,
  description      TEXT NOT NULL,
  department_id    UUID REFERENCES departments(id) ON DELETE SET NULL,
  created_by       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  skills_covered   UUID[] DEFAULT '{}',
  deadline         TIMESTAMP NOT NULL,
  difficulty_level project_difficulty NOT NULL DEFAULT 'medium',
  is_active        BOOLEAN DEFAULT TRUE,
  created_at       TIMESTAMP DEFAULT NOW(),
  updated_at       TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- TABLE 14: project_milestones
-- ─────────────────────────────────────────────
CREATE TABLE project_milestones (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id   UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title        VARCHAR(255) NOT NULL,
  description  TEXT,
  due_date     TIMESTAMP,
  order_index  INTEGER NOT NULL DEFAULT 1,
  created_at   TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- TABLE 15: project_assignments
-- ─────────────────────────────────────────────
CREATE TABLE project_assignments (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id        UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  intern_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assigned_by       UUID REFERENCES users(id) ON DELETE SET NULL,
  assigned_at       TIMESTAMP DEFAULT NOW(),
  status            project_status DEFAULT 'todo',
  submitted_at      TIMESTAMP,
  submission_url    VARCHAR(500),
  submission_notes  TEXT,
  score             INTEGER CHECK (score >= 1 AND score <= 10),
  feedback          TEXT,
  reviewed_by       UUID REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at       TIMESTAMP,
  UNIQUE(project_id, intern_id)
);

-- ─────────────────────────────────────────────
-- TABLE 16: milestone_completions
-- ─────────────────────────────────────────────
CREATE TABLE milestone_completions (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  milestone_id   UUID NOT NULL REFERENCES project_milestones(id) ON DELETE CASCADE,
  assignment_id  UUID NOT NULL REFERENCES project_assignments(id) ON DELETE CASCADE,
  completed_at   TIMESTAMP DEFAULT NOW(),
  submission_url VARCHAR(500),
  UNIQUE(milestone_id, assignment_id)
);

-- ─────────────────────────────────────────────
-- TABLE 17: learning_resources
-- ─────────────────────────────────────────────
CREATE TABLE learning_resources (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title            VARCHAR(255) NOT NULL,
  url              VARCHAR(500) NOT NULL,
  platform         VARCHAR(100),
  skill_id         UUID REFERENCES skills(id) ON DELETE SET NULL,
  resource_type    VARCHAR(50),
  duration_minutes INTEGER,
  added_by         UUID REFERENCES users(id) ON DELETE SET NULL,
  is_active        BOOLEAN DEFAULT TRUE,
  created_at       TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- TABLE 18: ai_recommendations
-- ─────────────────────────────────────────────
CREATE TABLE ai_recommendations (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  intern_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  resource_id   UUID REFERENCES learning_resources(id) ON DELETE SET NULL,
  title         VARCHAR(255),
  url           VARCHAR(500),
  platform      VARCHAR(100),
  reason        TEXT NOT NULL,
  resource_type VARCHAR(50),
  duration_min  INTEGER,
  status        recommendation_status DEFAULT 'pending',
  feedback      feedback_type,
  generated_at  TIMESTAMP DEFAULT NOW(),
  updated_at    TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- TABLE 19: learning_paths
-- ─────────────────────────────────────────────
CREATE TABLE learning_paths (
  id                       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  intern_id                UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  week_number              INTEGER NOT NULL,
  year                     INTEGER NOT NULL,
  recommended_resource_ids UUID[] DEFAULT '{}',
  weekly_goal_hours        INTEGER DEFAULT 5,
  generated_at             TIMESTAMP DEFAULT NOW(),
  UNIQUE(intern_id, week_number, year)
);

-- ─────────────────────────────────────────────
-- TABLE 20: progress_snapshots
-- ─────────────────────────────────────────────
CREATE TABLE progress_snapshots (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  intern_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  week_number      INTEGER NOT NULL,
  year             INTEGER NOT NULL,
  skill_score      DECIMAL(5,2) DEFAULT 0,
  project_score    DECIMAL(5,2) DEFAULT 0,
  attendance_score DECIMAL(5,2) DEFAULT 0,
  overall_score    DECIMAL(5,2) DEFAULT 0,
  created_at       TIMESTAMP DEFAULT NOW(),
  UNIQUE(intern_id, week_number, year)
);

-- ─────────────────────────────────────────────
-- TABLE 21: certificates
-- ─────────────────────────────────────────────
CREATE TABLE certificates (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  intern_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  certificate_type  certificate_type NOT NULL,
  skill_id          UUID REFERENCES skills(id) ON DELETE SET NULL,
  project_id        UUID REFERENCES projects(id) ON DELETE SET NULL,
  issued_by         UUID REFERENCES users(id) ON DELETE SET NULL,
  issued_at         TIMESTAMP DEFAULT NOW(),
  pdf_url           VARCHAR(500),
  verification_code VARCHAR(100) UNIQUE NOT NULL,
  skills_covered    UUID[] DEFAULT '{}',
  is_valid          BOOLEAN DEFAULT TRUE
);

-- ─────────────────────────────────────────────
-- TABLE 22: certificate_templates
-- ─────────────────────────────────────────────
CREATE TABLE certificate_templates (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          VARCHAR(150) NOT NULL,
  html_template TEXT NOT NULL,
  logo_url      VARCHAR(500),
  primary_color VARCHAR(20) DEFAULT '#1E3A5F',
  is_active     BOOLEAN DEFAULT FALSE,
  created_by    UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at    TIMESTAMP DEFAULT NOW(),
  updated_at    TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- TABLE 23: evaluations
-- ─────────────────────────────────────────────
CREATE TABLE evaluations (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  intern_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  manager_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  period_start   DATE NOT NULL,
  period_end     DATE NOT NULL,
  scores         JSONB NOT NULL DEFAULT '{}',
  comments       TEXT,
  overall_score  DECIMAL(5,2),
  submitted_at   TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- TABLE 24: messages
-- ─────────────────────────────────────────────
CREATE TABLE messages (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject      VARCHAR(255) NOT NULL,
  body         TEXT NOT NULL,
  is_read      BOOLEAN DEFAULT FALSE,
  read_at      TIMESTAMP,
  sent_at      TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- TABLE 25: announcements
-- ─────────────────────────────────────────────
CREATE TABLE announcements (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title               VARCHAR(255) NOT NULL,
  body                TEXT NOT NULL,
  posted_by           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  target_role         user_role,
  target_department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  is_active           BOOLEAN DEFAULT TRUE,
  created_at          TIMESTAMP DEFAULT NOW(),
  updated_at          TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- TABLE 26: notifications
-- ─────────────────────────────────────────────
CREATE TABLE notifications (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title             VARCHAR(255) NOT NULL,
  message           TEXT NOT NULL,
  notification_type notification_type NOT NULL,
  is_read           BOOLEAN DEFAULT FALSE,
  read_at           TIMESTAMP,
  action_url        VARCHAR(500),
  created_at        TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- TABLE 27: activity_logs
-- ─────────────────────────────────────────────
CREATE TABLE activity_logs (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action       VARCHAR(100) NOT NULL,
  entity_type  VARCHAR(50),
  entity_id    UUID,
  description  TEXT,
  ip_address   VARCHAR(50),
  created_at   TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- TABLE 28: onboarding_checklist
-- ─────────────────────────────────────────────
CREATE TABLE onboarding_checklist (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  intern_id               UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  profile_completed       BOOLEAN DEFAULT FALSE,
  department_confirmed    BOOLEAN DEFAULT FALSE,
  skill_gap_viewed        BOOLEAN DEFAULT FALSE,
  first_lecture_attended  BOOLEAN DEFAULT FALSE,
  first_project_submitted BOOLEAN DEFAULT FALSE,
  checklist_completed     BOOLEAN DEFAULT FALSE,
  completed_at            TIMESTAMP,
  created_at              TIMESTAMP DEFAULT NOW(),
  updated_at              TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- TABLE 29: gamification
-- ─────────────────────────────────────────────
CREATE TABLE gamification (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id              UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  total_xp             INTEGER DEFAULT 0,
  current_streak_days  INTEGER DEFAULT 0,
  longest_streak_days  INTEGER DEFAULT 0,
  last_active_date     DATE,
  badges               JSONB DEFAULT '[]',
  updated_at           TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- INDEXES FOR PERFORMANCE
-- ─────────────────────────────────────────────
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_department ON users(department_id);
CREATE INDEX idx_users_status ON users(account_status);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX idx_activity_logs_user ON activity_logs(user_id, created_at);
CREATE INDEX idx_progress_snapshots_intern ON progress_snapshots(intern_id, year, week_number);
CREATE INDEX idx_lectures_scheduled ON lectures(scheduled_at, status);
CREATE INDEX idx_project_assignments_intern ON project_assignments(intern_id, status);
CREATE INDEX idx_messages_receiver ON messages(receiver_id, is_read);
```

You will see a green "Success" message when the tables have been created!
