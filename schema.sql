CREATE TABLE internships (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  mode TEXT NOT NULL CHECK(mode IN ('Online', 'Offline', 'Hybrid')),
  duration TEXT NOT NULL,
  skills TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
