# Finance Dashboard Backend API

A robust and scalable backend API for a personal finance dashboard application. It provides endpoints for user authentication, managing financial records (income/expense), and generating insightful dashboard analytics via powerful aggregation pipelines.

## Tech Stack

-   **Backend**: Node.js, Express.js
-   **Database**: MongoDB with Mongoose ODM
-   **Authentication**: JSON Web Tokens (JWT)
-   **Password Hashing**: bcryptjs
-   **Validation**: express-validator
-   **Environment**: dotenv, cors
-   **Development**: nodemon

## Project Structure

```
/
├── src/
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── rbac.js
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.js
│   │   │   └── auth.routes.js
│   │   ├── dashboard/
│   │   │   ├── dashboard.controller.js
│   │   │   ├── dashboard.routes.js
│   │   │   └── dashboard.service.js
│   │   ├── records/
│   │   │   ├── record.controller.js
│   │   │   ├── record.model.js
│   │   │   ├── record.routes.js
│   │   │   └── record.service.js
│   │   └── users/
│   │       ├── user.controller.js
│   │       ├── user.model.js
│   │       ├── user.routes.js
│   │       └── user.service.js
│   ├── utils/
│   │   └── apiResponse.js
│   ├── app.js
│   └── server.js
├── .env.example
├── package.json
└── seed.js
```

## Setup Instructions

Follow these steps to get the project running locally.

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd <project-directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root directory by copying the example file.
    ```bash
    cp .env.example .env
    ```
    Fill in the required values in the `.env` file:
    ```
    PORT=5000
    MONGODB_URI=mongodb://localhost:27017/finance-dashboard
    JWT_SECRET=your-super-secret-key
    JWT_EXPIRES_IN=1h
    ```

4.  **Seed the database:**
    Run the seed script to populate the database with initial users and sample records.
    ```bash
    npm run seed
    ```

5.  **Start the development server:**
    This will start the server with `nodemon`, which automatically restarts on file changes.
    ```bash
    npm run dev
    ```
    The API will be running at `http://localhost:5000`.

## Test Credentials

Use these credentials to test the API with different user roles.

| Role    | Email             | Password   |
| :------ | :---------------- | :--------- |
| Admin   | `admin@test.com`  | `admin123` |
| Analyst | `analyst@test.com`| `analyst123`|
| Viewer  | `viewer@test.com` | `viewer123`|

## API Reference

### Auth Module (`/api/auth`)

| Method | Path       | Auth  | Role(s) | Description                  |
| :----- | :--------- | :---- | :------ | :--------------------------- |
| `POST` | `/register`| No    | -       | Registers a new user.        |
| `POST` | `/login`   | No    | -       | Logs in a user and returns a JWT. |

### User Module (`/api/users`)

| Method  | Path         | Auth  | Role(s) | Description                  |
| :------ | :----------- | :---- | :------ | :--------------------------- |
| `GET`   | `/`          | Yes   | `ADMIN` | Retrieves a list of all users. |
| `PATCH` | `/:id/role`  | Yes   | `ADMIN` | Updates a specific user's role. |
| `PATCH` | `/:id/status`| Yes   | `ADMIN` | Updates a user's status (ACTIVE/INACTIVE). |

### Record Module (`/api/records`)

| Method   | Path   | Auth  | Role(s)                | Description                  |
| :------- | :----- | :---- | :--------------------- | :--------------------------- |
| `POST`   | `/`    | Yes   | `ADMIN`                | Creates a new financial record. |
| `GET`    | `/`    | Yes   | `ANALYST`, `ADMIN` | Retrieves a list of records with filtering. |
| `GET`    | `/:id` | Yes   | `ANALYST`, `ADMIN` | Retrieves a single record by ID. |
| `PATCH`  | `/:id` | Yes   | `ADMIN`                | Updates a specific record.   |
| `DELETE` | `/:id` | Yes   | `ADMIN`                | Soft deletes a record.       |

### Dashboard Module (`/api/dashboard`)

| Method | Path          | Auth  | Role(s)           | Description                  |
| :----- | :------------ | :---- | :---------------- | :--------------------------- |
| `GET`  | `/summary`    | Yes   | `VIEWER`, `ANALYST`, `ADMIN` | Gets a summary of finances (totals, net balance). |
| `GET`  | `/by-category`| Yes   | `VIEWER`, `ANALYST`, `ADMIN` | Gets financial totals grouped by category. |
| `GET`  | `/trends`     | Yes   | `VIEWER`, `ANALYST`, `ADMIN` | Gets monthly income and expense trends. |

## Design Decisions

-   **Soft Deletes vs. Hard Deletes**: Financial records are soft-deleted (`isDeleted: true`) instead of being permanently removed from the database. This is a critical design choice for data integrity and auditing. It ensures that historical data is never lost, allowing for recovery, historical analysis, and maintaining a complete audit trail, which is essential in financial applications.

-   **MongoDB Aggregation Pipelines**: The dashboard relies exclusively on MongoDB's aggregation framework for all calculations (e.g., totals, balances, trends). This approach is far more efficient and scalable than fetching raw data and processing it in JavaScript. It delegates complex computations to the database layer, which is optimized for such tasks, reducing network latency, minimizing memory usage on the application server, and simplifying the application code.

-   **RBAC Middleware Factory**: Role-Based Access Control is implemented using a middleware factory pattern (`requireRoles([...])`). This pattern promotes clean, declarative, and reusable code. Instead of writing repetitive role-checking logic inside each controller, we define the required roles directly in the route definitions. This makes the authorization logic easy to read, manage, and test.

-   **Controller-Service Separation**: The architecture strictly separates controllers from services. Controllers are thin layers responsible only for handling the HTTP request/response cycle (parsing input, calling the service, and sending a response). All business logic, database interactions, and complex operations reside in the service layer. This separation of concerns makes the application more modular, easier to test (services can be tested in isolation), and simpler to maintain as the application grows.

## Assumptions Made

-   The application assumes it will be run in an environment where Node.js and MongoDB are available.
-   It is assumed that the `JWT_SECRET` in the `.env` file will be replaced with a strong, securely generated secret in a production environment.
-   The default user created via the `/register` endpoint always receives the `VIEWER` role. Role assignment is restricted to admin-only user management APIs.
-   Date strings provided to the API for filtering or creation are expected to be in a format that JavaScript's `new Date()` can parse correctly (e.g., ISO 8601 format).
