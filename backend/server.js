import app from './src/app.js';
import { db } from './src/config/db.js';
import redisClient from './src/config/redis.js';
import { runAdminSeeder } from './src/seeders/adminSeeder.js';
import { initializeSocket } from './src/config/socket.js';
import http from 'http';

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Attach Socket.io to the HTTP Server
initializeSocket(server);

async function createTablesIfNotExist() {
  try {
    await db.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    await db.query(`
      DO $$ BEGIN
        CREATE TYPE user_role AS ENUM (
          'super_admin','hr_admin','manager','expert','student'
        );
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;
    `);

    await db.query(`
      DO $$ BEGIN
        CREATE TYPE account_status AS ENUM (
          'pending_email','pending_approval',
          'active','rejected','deactivated'
        );
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS departments (
        id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name        VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        manager_id  UUID,
        is_active   BOOLEAN DEFAULT TRUE,
        created_at  TIMESTAMP DEFAULT NOW(),
        updated_at  TIMESTAMP DEFAULT NOW()
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        full_name         VARCHAR(150) NOT NULL,
        email             VARCHAR(255) NOT NULL UNIQUE,
        password_hash     VARCHAR(255) NOT NULL,
        role              user_role NOT NULL DEFAULT 'student',
        department_id     UUID REFERENCES departments(id)
                          ON DELETE SET NULL,
        employee_id       VARCHAR(100),
        profile_photo_url VARCHAR(500),
        bio               TEXT,
        phone             VARCHAR(20),
        is_email_verified BOOLEAN DEFAULT FALSE,
        account_status    account_status DEFAULT 'pending_email',
        rejection_reason  TEXT,
        access_reason     TEXT,
        dark_mode         BOOLEAN DEFAULT FALSE,
        last_active       TIMESTAMP,
        created_at        TIMESTAMP DEFAULT NOW(),
        updated_at        TIMESTAMP DEFAULT NOW()
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS role_requests (
        id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id          UUID NOT NULL REFERENCES users(id)
                          ON DELETE CASCADE,
        requested_role   user_role NOT NULL,
        department_id    UUID REFERENCES departments(id)
                          ON DELETE SET NULL,
        employee_id      VARCHAR(100) NOT NULL,
        reason           TEXT NOT NULL,
        status           VARCHAR(20) DEFAULT 'pending',
        reviewed_by      UUID REFERENCES users(id)
                          ON DELETE SET NULL,
        rejection_reason TEXT,
        requested_at     TIMESTAMP DEFAULT NOW(),
        reviewed_at      TIMESTAMP
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS otp_verifications (
        id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id    UUID NOT NULL REFERENCES users(id)
                   ON DELETE CASCADE,
        otp_code   VARCHAR(6) NOT NULL,
        purpose    VARCHAR(50) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        used       BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS refresh_tokens (
        id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token_hash   VARCHAR(255) NOT NULL UNIQUE,
        expires_at   TIMESTAMP NOT NULL,
        is_revoked   BOOLEAN DEFAULT FALSE,
        created_at   TIMESTAMP DEFAULT NOW()
      )
    `);

    // --- STUDENT DASHBOARD TABLES ---
    await db.query(`
      CREATE TABLE IF NOT EXISTS personal_projects (
        id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title       VARCHAR(255) NOT NULL,
        description TEXT,
        link        VARCHAR(500),
        status      VARCHAR(50) DEFAULT 'In Progress',
        created_at  TIMESTAMP DEFAULT NOW(),
        updated_at  TIMESTAMP DEFAULT NOW()
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS learning_roadmaps (
        id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        topic_name  VARCHAR(100) NOT NULL,
        roadmap_json JSONB NOT NULL,
        status      VARCHAR(50) DEFAULT 'Not Started',
        created_at  TIMESTAMP DEFAULT NOW(),
        updated_at  TIMESTAMP DEFAULT NOW()
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS gamification (
        id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id              UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
        total_xp             INTEGER DEFAULT 0,
        current_level        INTEGER DEFAULT 1,
        current_streak_days  INTEGER DEFAULT 0,
        last_activity_at     TIMESTAMP DEFAULT NOW(),
        badges               JSONB DEFAULT '[]',
        updated_at           TIMESTAMP DEFAULT NOW()
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS user_badges (
        id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        badge_name  VARCHAR(100) NOT NULL,
        badge_icon  VARCHAR(100),
        earned_at   TIMESTAMP DEFAULT NOW()
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title             VARCHAR(255) NOT NULL,
        message           TEXT NOT NULL,
        notification_type VARCHAR(50) NOT NULL,
        is_read           BOOLEAN DEFAULT FALSE,
        read_at           TIMESTAMP,
        action_url        VARCHAR(500),
        created_at        TIMESTAMP DEFAULT NOW()
      )
    `);

    // After creating departments table:
    const deptCheck = await db.query(
      'SELECT COUNT(*) FROM departments'
    );
    if (parseInt(deptCheck.rows[0].count) === 0) {
      const defaultDepartments = [
        { name: 'Computer Science',
          description: 'CS and software development' },
        { name: 'Information Technology',
          description: 'IT infrastructure and support' },
        { name: 'Human Resources',
          description: 'HR and people management' },
        { name: 'Finance',
          description: 'Finance and accounting' },
        { name: 'Marketing',
          description: 'Marketing and communications' },
        { name: 'Operations',
          description: 'Business operations' },
        { name: 'Design',
          description: 'UI/UX and graphic design' },
        { name: 'Sales',
          description: 'Sales and business development' },
        { name: 'Data Science',
          description: 'Data analysis and ML' },
        { name: 'Cybersecurity',
          description: 'Security and compliance' },
      ];

      for (const dept of defaultDepartments) {
        await db.query(
          `INSERT INTO departments (name, description)
           VALUES ($1, $2)
           ON CONFLICT (name) DO NOTHING`,
          [dept.name, dept.description]
        );
      }
      console.log('✅ Default departments seeded');
    } else {
      console.log('✅ Departments already exist');
    }

    console.log('✅ All tables ready');
  } catch (error) {
    console.error('❌ Table creation error:', error.message);
    throw error;
  }
}

async function startServer() {
  try {
    await db.query('SELECT NOW()');
    console.log('✅ PostgreSQL connected');

    await createTablesIfNotExist();

    if (redisClient) {
      console.log('✅ Redis connected');
    }

    await runAdminSeeder();

    server.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Server failed to start:', error);
    process.exit(1);
  }
}

startServer();
