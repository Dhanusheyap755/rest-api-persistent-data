const express = require("express");
const { createDatabase, saveDatabase } = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

function validateInternship(body) {
  const required = [
    "title", "company", "location", "mode",
    "duration", "skills", "description"
  ];

  const missing = required.filter((field) => {
    const value = body[field];
    return value === undefined || value === null || String(value).trim() === "";
  });

  if (missing.length) {
    return `Missing required fields: ${missing.join(", ")}`;
  }

  if (!["Online", "Offline", "Hybrid"].includes(body.mode)) {
    return "Mode must be Online, Offline, or Hybrid";
  }

  return null;
}

function getRows(db, sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);

  const rows = [];
  while (stmt.step()) {
    rows.push(stmt.get());
  }

  stmt.free();
  return rows;
}

function getOne(db, sql, params = []) {
  const rows = getRows(db, sql, params);
  if (rows.length === 0) return null;

  const row = rows[0];

  return {
    id: row[0],
    title: row[1],
    company: row[2],
    location: row[3],
    mode: row[4],
    duration: row[5],
    skills: String(row[6]).split(",").map((s) => s.trim()),
    description: row[7],
    created_at: row[8]
  };
}

(async () => {
  const db = await createDatabase();

  // HOME
  app.get("/", (req, res) => {
    res.json({
      message: "Internship REST API is running",
      database: "SQLite",
      endpoints: "/api/internships"
    });
  });

  // GET ALL + PAGINATION + SEARCH
  app.get("/api/internships", (req, res) => {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 5, 1), 50);
    const offset = (page - 1) * limit;
    const search = (req.query.search || "").trim();

    let rows;
    let total;

    if (search) {
      const pattern = `%${search}%`;

      rows = getRows(
        db,
        `SELECT id, title, company, location, mode, duration, skills,
                description, created_at
         FROM internships
         WHERE title LIKE ? OR company LIKE ? OR location LIKE ?
         ORDER BY id DESC
         LIMIT ? OFFSET ?`,
        [pattern, pattern, pattern, limit, offset]
      );

      total = getRows(
        db,
        `SELECT COUNT(*) FROM internships
         WHERE title LIKE ? OR company LIKE ? OR location LIKE ?`,
        [pattern, pattern, pattern]
      )[0][0];
    } else {
      rows = getRows(
        db,
        `SELECT id, title, company, location, mode, duration, skills,
                description, created_at
         FROM internships
         ORDER BY id DESC
         LIMIT ? OFFSET ?`,
        [limit, offset]
      );

      total = getRows(db, "SELECT COUNT(*) FROM internships")[0][0];
    }

    res.json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: rows.map((row) => ({
        id: row[0],
        title: row[1],
        company: row[2],
        location: row[3],
        mode: row[4],
        duration: row[5],
        skills: String(row[6]).split(",").map((s) => s.trim()),
        description: row[7],
        created_at: row[8]
      }))
    });
  });

  // GET ONE
  app.get("/api/internships/:id", (req, res) => {
    const internship = getOne(
      db,
      `SELECT id, title, company, location, mode, duration, skills,
              description, created_at
       FROM internships
       WHERE id = ?`,
      [req.params.id]
    );

    if (!internship) {
      return res.status(404).json({
        success: false,
        error: "Internship not found"
      });
    }

    res.json({
      success: true,
      data: internship
    });
  });

  // CREATE
  app.post("/api/internships", (req, res) => {
    const error = validateInternship(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        error
      });
    }

    const {
      title,
      company,
      location,
      mode,
      duration,
      skills,
      description
    } = req.body;

    const skillsText = Array.isArray(skills)
      ? skills.join(", ")
      : String(skills).trim();

    db.run(
      `INSERT INTO internships
       (title, company, location, mode, duration, skills, description)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        title.trim(),
        company.trim(),
        location.trim(),
        mode,
        duration.trim(),
        skillsText,
        description.trim()
      ]
    );

    // IMPORTANT:
    // Get the inserted ID before saving the database file.
    // This avoids the data:null issue from the previous version.
    const insertedRows = getRows(
      db,
      "SELECT id FROM internships ORDER BY id DESC LIMIT 1"
    );

    if (insertedRows.length === 0) {
      return res.status(500).json({
        success: false,
        error: "Record was not created"
      });
    }

    const newId = insertedRows[0][0];

    saveDatabase(db);

    const created = getOne(
      db,
      `SELECT id, title, company, location, mode, duration, skills,
              description, created_at
       FROM internships
       WHERE id = ?`,
      [newId]
    );

    res.status(201).json({
      success: true,
      message: "Internship created",
      data: created
    });
  });

  // UPDATE
  app.put("/api/internships/:id", (req, res) => {
    const existing = getOne(
      db,
      `SELECT id, title, company, location, mode, duration, skills,
              description, created_at
       FROM internships
       WHERE id = ?`,
      [req.params.id]
    );

    if (!existing) {
      return res.status(404).json({
        success: false,
        error: "Internship not found"
      });
    }

    const merged = {
      ...existing,
      ...req.body
    };

    const error = validateInternship(merged);

    if (error) {
      return res.status(400).json({
        success: false,
        error
      });
    }

    const skillsText = Array.isArray(merged.skills)
      ? merged.skills.join(", ")
      : String(merged.skills).trim();

    db.run(
      `UPDATE internships
       SET title = ?, company = ?, location = ?, mode = ?,
           duration = ?, skills = ?, description = ?
       WHERE id = ?`,
      [
        String(merged.title).trim(),
        String(merged.company).trim(),
        String(merged.location).trim(),
        merged.mode,
        String(merged.duration).trim(),
        skillsText,
        String(merged.description).trim(),
        req.params.id
      ]
    );

    saveDatabase(db);

    const updated = getOne(
      db,
      `SELECT id, title, company, location, mode, duration, skills,
              description, created_at
       FROM internships
       WHERE id = ?`,
      [req.params.id]
    );

    res.json({
      success: true,
      message: "Internship updated",
      data: updated
    });
  });

  // DELETE
  app.delete("/api/internships/:id", (req, res) => {
    const existing = getOne(
      db,
      `SELECT id, title, company, location, mode, duration, skills,
              description, created_at
       FROM internships
       WHERE id = ?`,
      [req.params.id]
    );

    if (!existing) {
      return res.status(404).json({
        success: false,
        error: "Internship not found"
      });
    }

    db.run("DELETE FROM internships WHERE id = ?", [req.params.id]);
    saveDatabase(db);

    res.json({
      success: true,
      message: "Internship deleted"
    });
  });

  // INVALID ROUTE
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      error: "Route not found"
    });
  });

  // SERVER ERROR
  app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  });

  app.listen(PORT, () => {
    console.log(`REST API running at http://localhost:${PORT}`);
  });
})();
