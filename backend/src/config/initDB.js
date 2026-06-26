const { query } = require('./prisma');

const initDB = async () => {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS "User" (
        id            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
        name          TEXT NOT NULL,
        email         TEXT UNIQUE NOT NULL,
        "passwordHash" TEXT NOT NULL,
        "createdAt"   TIMESTAMPTZ DEFAULT NOW(),
        "updatedAt"   TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS "AvailabilitySlot" (
        id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
        "userId"    TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
        "dayOfWeek" INTEGER NOT NULL,
        "startTime" TEXT NOT NULL,
        "endTime"   TEXT NOT NULL,
        "createdAt" TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS "Task" (
        id                  TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
        "userId"            TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
        title               TEXT NOT NULL,
        description         TEXT,
        category            TEXT,
        importance          INTEGER NOT NULL DEFAULT 3,
        "dueDate"           TIMESTAMPTZ NOT NULL,
        "userEstimatedTime" INTEGER,
        "aiPredictedTime"   INTEGER,
        "actualTime"        INTEGER,
        "priorityScore"     FLOAT,
        "priorityQuadrant"  TEXT,
        status              TEXT DEFAULT 'PENDING',
        "completedAt"       TIMESTAMPTZ,
        "createdAt"         TIMESTAMPTZ DEFAULT NOW(),
        "updatedAt"         TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS "DailySchedule" (
        id                  TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
        "userId"            TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
        "taskId"            TEXT NOT NULL REFERENCES "Task"(id) ON DELETE CASCADE,
        date                TIMESTAMPTZ NOT NULL,
        "startTime"         TIMESTAMPTZ NOT NULL,
        "endTime"           TIMESTAMPTZ NOT NULL,
        "allocatedMinutes"  INTEGER NOT NULL,
        "generationVersion" INTEGER DEFAULT 1,
        "rescheduleReason"  TEXT,
        status              TEXT DEFAULT 'PLANNED',
        "wasModified"       BOOLEAN DEFAULT FALSE,
        "createdAt"         TIMESTAMPTZ DEFAULT NOW(),
        "updatedAt"         TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS "UserBehavior" (
        id                      TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
        "userId"                TEXT NOT NULL,
        "taskId"                TEXT,
        "taskCategory"          TEXT,
        importance              INTEGER,
        "originalEstimatedTime" INTEGER,
        "aiPredictedTime"       INTEGER,
        "actualTime"            INTEGER,
        "completedHour"         INTEGER,
        "wasScheduleModified"   BOOLEAN DEFAULT FALSE,
        "scheduledHour"         INTEGER,
        "createdAt"             TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    console.log('✅ Database tables initialized');
  } catch (err) {
    console.error('❌ DB init error:', err.message);
    // Don't crash — tables may already exist
  }
};

module.exports = initDB;
