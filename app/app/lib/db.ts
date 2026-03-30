import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "data", "dev.db");

const globalForDb = globalThis as unknown as { db: Database.Database };

export const db = globalForDb.db || new Database(dbPath);

if (process.env.NODE_ENV !== "production") globalForDb.db = db;

// Ensure tables exist
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    title TEXT,
    bio TEXT,
    location TEXT,
    website TEXT,
    skills TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS milestone_reports (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    project_id TEXT NOT NULL,
    milestone_id TEXT NOT NULL,
    summary TEXT NOT NULL,
    details TEXT,
    files TEXT DEFAULT '[]',
    created_at TEXT DEFAULT (datetime('now')),
    UNIQUE(user_id, project_id, milestone_id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`);

// Add link column if it doesn't exist
try {
  db.exec(`ALTER TABLE milestone_reports ADD COLUMN link TEXT`);
} catch {
  // Column already exists
}

db.exec(`
  CREATE TABLE IF NOT EXISTS case_studies (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    project_id TEXT UNIQUE NOT NULL,
    project_title TEXT NOT NULL,
    company_name TEXT NOT NULL,
    sections TEXT NOT NULL DEFAULT '[]',
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`);
