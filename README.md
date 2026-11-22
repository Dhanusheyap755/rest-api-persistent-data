# Persistent REST API with Express.js & SQLite

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-Framework-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![SQLite](https://img.shields.io/badge/SQLite-Persistent%20Data-003B57?style=flat&logo=sqlite&logoColor=white)](https://www.sqlite.org/)

## 📌 Project Overview
A production-grade RESTful API built with **Express.js and SQLite (`sql.js`)** providing persistent CRUD operations, input validation, search filtering, and pagination. Built for EdVyro Task 03, this project demonstrates clean backend architecture and predictable HTTP response structures.

---

## 🚀 API Capabilities
- **CRUD Operations:** Complete endpoints for Creating, Reading, Updating, and Deleting records.
- **Pagination & Limiting:** Built-in `page` and `limit` query parameters for high-performance record retrieval.
- **Search & Filtering:** Dynamic SQL filtering on title, category, and status fields.
- **Seed & Migration Scripts:** Automated schema creation (`schema.sql`) and sample data ingestion (`seed.js`).

---

## 📂 Project Folder Structure
```
rest-api-persistent-data/
├── .gitignore
├── README.md
├── api-examples.json      # Sample request and response payloads
├── db.js                  # SQLite database wrapper
├── package.json
├── schema.sql             # Relational table schema definitions
├── seed.js                # Database seeder script
└── server.js              # Express API server entrypoint
```

---

## 💻 Installation & Execution Instructions
```bash
git clone https://github.com/Dhanusheyap755/rest-api-persistent-data.git
cd rest-api-persistent-data
npm install
node seed.js    # Initialize and seed database
npm start       # Start API on http://localhost:3000
```
