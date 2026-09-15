# Internship REST API — Persistent Data

This project implements the EdVyro Task 03 requirements using Node.js, Express and SQLite.

## Why this version works on your system

The earlier version used `better-sqlite3`, which is a native Node.js module. Your Node.js version is **25.7.0**, and npm could not find a compatible prebuilt binary, then tried to compile it and failed because Visual Studio C++ build tools were not installed.

This version uses **sql.js**, a SQLite implementation that does not require native C++ compilation during `npm install`.

## Features

- Node.js + Express REST API
- SQLite persistent storage
- Create, Read, Update, Delete
- Input validation
- Pagination
- Search
- HTTP status codes
- JSON responses
- Seed data
- Error handling

## Run

Open PowerShell in this folder:

```powershell
npm install
npm run seed
npm start
```

Then open:

`http://localhost:3000`

## Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/internships` | List records |
| GET | `/api/internships/:id` | Detail |
| POST | `/api/internships` | Create |
| PUT | `/api/internships/:id` | Update |
| DELETE | `/api/internships/:id` | Delete |

Pagination:

`http://localhost:3000/api/internships?page=1&limit=2`

Search:

`http://localhost:3000/api/internships?search=developer`

## Example POST JSON

```json
{
  "title": "Java Developer Intern",
  "company": "CodeWorks",
  "location": "Chennai",
  "mode": "Online",
  "duration": "3 months",
  "skills": ["Java", "SQL", "Git"],
  "description": "Work on backend applications and APIs."
}
```

## Project structure

```text
rest-api-persistent-data/
├── data/
│   └── internships.sqlite
├── db.js
├── server.js
├── seed.js
├── schema.sql
├── api-examples.json
├── package.json
├── README.md
└── .gitignore
```

The SQLite database file is created automatically after `npm run seed`.
