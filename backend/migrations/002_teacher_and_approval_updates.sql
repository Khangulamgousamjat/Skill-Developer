-- SSLLM Migration 002: Teacher Role & Approval Chain Updates

-- 1. Rename 'expert' to 'teacher' in user_role enum
-- Note: PostgreSQL 10+ supports RENAME VALUE for enums
ALTER TYPE user_role RENAME VALUE 'expert' TO 'teacher';

-- 2. Add 'approver_role' to role_requests
ALTER TABLE role_requests ADD COLUMN IF NOT EXISTS approver_role user_role;

-- Update existing requests to be reviewed by super_admin by default
UPDATE role_requests SET approver_role = 'super_admin' WHERE approver_role IS NULL;

-- 3. Create teacher_videos table
CREATE TABLE IF NOT EXISTS teacher_videos (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title          VARCHAR(255) NOT NULL,
  description    TEXT,
  video_url      VARCHAR(500) NOT NULL,
  thumbnail_url  VARCHAR(500),
  duration       INTEGER DEFAULT 0, -- in seconds
  category       VARCHAR(100) DEFAULT 'Technical',
  tags           JSONB DEFAULT '[]',
  is_public      BOOLEAN DEFAULT TRUE,
  views_count    INTEGER DEFAULT 0,
  created_at     TIMESTAMP DEFAULT NOW(),
  updated_at     TIMESTAMP DEFAULT NOW()
);

-- 4. Create index for teacher_videos
CREATE INDEX IF NOT EXISTS idx_teacher_videos_teacher ON teacher_videos(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teacher_videos_public ON teacher_videos(is_public);

-- 5. Rename expert_id in lectures to teacher_id
ALTER TABLE lectures RENAME COLUMN expert_id TO teacher_id;

-- 6. Rename expert_id/expert_name in related tables/logic
-- (Assuming based on grep results)
-- No other tables have expert_id directly in 001_initial_schema.sql except for FKs
