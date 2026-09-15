const fs = require("fs");
const path = require("path");
const initSqlJs = require("sql.js");

const dbDir = path.join(__dirname, "data");
const dbFile = path.join(dbDir, "internships.sqlite");

async function createDatabase() {
  fs.mkdirSync(dbDir, { recursive: true });

  const SQL = await initSqlJs({
    locateFile: file => path.join(__dirname, "node_modules", "sql.js", "dist", file)
  });

  const buffer = fs.existsSync(dbFile) ? fs.readFileSync(dbFile) : null;
  const db = buffer ? new SQL.Database(buffer) : new SQL.Database();

  db.run(`
    CREATE TABLE IF NOT EXISTS internships (
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
  `);

  return db;
}

function saveDatabase(db) {
  const data = db.export();
  fs.writeFileSync(dbFile, Buffer.from(data));
}

module.exports = { createDatabase, saveDatabase, dbFile };
