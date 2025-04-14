# 📚 DTS Developer Technical Test

This project is a backend API built with **Node.js**, **Express**, and **PostgreSQL** for managing tasks. It serves as a technical demonstration of backend development best practices including RESTful routing, modular architecture, and database integration.

---

## 🚀 Features

- Full REST API for task management
- PostgreSQL integration using `pg`
- Environment-based configuration
- Seeding with sample data
- Error handling middleware
- Prepared for expansion (users, comments, etc.)

---

## 📁 Project Structure

```
backend/
├── controllers/             # Request handlers
├── db/
│   ├── connection.js        # DB connection via pg Pool
│   ├── setup.sql            # SQL script to create tables
│   ├── seeds/
│   │   ├── run-seed.js      # Entrypoint for seeding
│   │   └── seed.js          # Logic for inserting data
│   └── test-data/
│       ├── tasks.js         # Task data for seeding
│       └── index.js         # Export of test data
├── routes/
│   ├── api-router.js        # All API routes mounted here
│   └── tasks-router.js      # Routes for task operations
├── app.js                   # Express app setup
├── listen.js                # Starts the server
├── package.json             # Project config
└── README.md                # You're here!
```

---

## 🛠️ Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Environment setup

Create `.env` files for different environments inside the `backend/` directory (see .env-example, check db/setup.sql for database name):

#### `.env.development`

```
PGDATABASE=your_dev_db_name
```

#### `.env.test`

```
PGDATABASE=your_test_db_name
```

#### `.env.production`

```
DATABASE_URL=your_production_db_url
```

---

## 🗃️ Database Setup

### Run the setup and seed scripts

```bash
npm run setup-dbs   # Creates the database
npm run seed        # Seeds the database with test data
```

---

## 🌐 Running the Server

```bash
npm start
```

By default, the server will run on [http://localhost:9090](http://localhost:9090)

---

## ⚙️ Scripts

```json
"scripts": {
  "start": "node listen.js",
  "test": "jest",
  "prepare": "husky",
  "precommit": "eslint .",
  "setup-dbs": "psql -f ./db/setup.sql",
  "seed": "node ./db/seeds/run-seed.js"
}
```

---

## 📬 Example Endpoints

| Method | Endpoint         | Description          |
| ------ | ---------------- | -------------------- |
| GET    | `/api/tasks`     | Get all tasks        |
| POST   | `/api/tasks`     | Create a new task    |
| GET    | `/api/tasks/:id` | Get a task by ID     |
| PATCH  | `/api/tasks/:id` | Update a task status |
| DELETE | `/api/tasks/:id` | Delete a task        |

---

## 🧪 Testing

To run tests

```bash
npm test
```

---

## 🧰 Built With

- Node.js
- Express
- PostgreSQL
- pg
- dotenv
- Jest, Supertest(for testing)
- ESLint + Husky (for linting and precommit hooks)

---

## 📌 Notes

- This project uses native ES modules. Ensure your `package.json` includes `"type": "module"`.
- Error handling is standardized through custom and PostgreSQL error middleware.
- The server defaults to port `9090` unless otherwise specified.

---

## 📩 Contact

Have questions, suggestions, or want to collaborate?

- GitHub: [ZEwela](https://github.com/zewela)
- Email: [ewelinazawol@gmail.com](mailto:ewelinazawol@gmail.com)
