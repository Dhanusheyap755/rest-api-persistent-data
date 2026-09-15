const fs = require("fs");
const path = require("path");
const { createDatabase, saveDatabase } = require("./db");

(async () => {
  const db = await createDatabase();

  const count = db.exec("SELECT COUNT(*) AS count FROM internships")[0]?.values[0][0] || 0;

  if (count === 0) {
    const records = [
      ["Full Stack Developer Intern", "TechNova Solutions", "Chennai", "Hybrid", "3 months", "HTML, CSS, JavaScript, Node.js", "Build and test web applications with the development team."],
      ["Data Analyst Intern", "InsightWorks", "Coimbatore", "Online", "2 months", "Python, SQL, Excel", "Analyze business data and prepare simple reports."],
      ["Cyber Security Intern", "SecureNet Labs", "Bengaluru", "Online", "3 months", "Networking, Linux, Security", "Assist with security monitoring and basic vulnerability analysis."],
      ["Frontend Developer Intern", "PixelCraft", "Erode", "Offline", "2 months", "HTML, CSS, React", "Create responsive user interfaces for web products."],
      ["Backend Developer Intern", "CloudBridge", "Hyderabad", "Hybrid", "4 months", "Node.js, Express, REST API", "Develop backend services and REST API endpoints."]
    ];

    const stmt = db.prepare(`
      INSERT INTO internships
      (title, company, location, mode, duration, skills, description)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    for (const record of records) stmt.run(record);
    stmt.free();

    saveDatabase(db);
    console.log("Database seeded with 5 internship records.");
  } else {
    console.log(`Database already contains ${count} records. Nothing to seed.`);
  }
})();
