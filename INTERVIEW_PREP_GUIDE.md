# Interview Preparation Guide: Finance Dashboard API

This guide is designed to take you from zero knowledge to a deep understanding of this project. Read this from top to bottom, and you'll be prepared to answer any question an interviewer might ask.

---

### Part 1: The Big Picture (High-Level)

Start here. These are the "elevator pitch" answers.

#### Q: Can you give me a brief overview of the project?

**Your Answer:** "This is a backend API for a personal finance dashboard. It's designed to handle user accounts, manage financial records like income and expenses, and provide aggregated data for a frontend application to display as charts and summaries."

#### Q: What problem does it solve?

**Your Answer:** "It solves the core backend problem of any dashboard application: how to securely store, manage, and analyze data. It provides a structured way to handle user permissions, perform CRUD (Create, Read, Update, Delete) operations on financial entries, and efficiently calculate analytics without slowing down the application."

#### Q: Who are the users of this system?

**Your Answer:** "The system is designed for three types of users, each with different permissions:
*   **Viewers:** Can only see the final dashboard summaries. They have read-only access to high-level data.
*   **Analysts:** Can do everything a Viewer can, plus they can see individual financial records to understand the details.
*   **Admins:** Have full control. They can manage users, add or edit financial records, and see everything."

---

### Part 2: The Tech Stack (The "What" and "Why")

This section explains the tools we used and, more importantly, *why* we used them.

#### Q: What technologies did you use, and why did you choose them?

**Your Answer:** "We used the MERN stack, which is a popular and effective choice for modern web applications."

*   **Node.js & Express.js (The Server):**
    *   **What it is:** Node.js is the environment that lets us run JavaScript on the server. Express is a framework that makes building APIs with Node.js much faster and more organized.
    *   **Why we used it:** "It's fast, efficient, and uses JavaScript, which means we can use the same language across the entire stack (frontend and backend). Its massive ecosystem (`npm`) has a library for everything we needed."

*   **MongoDB & Mongoose (The Database):**
    *   **What it is:** MongoDB is a NoSQL document database. It stores data in flexible, JSON-like documents. Mongoose is a library that helps us model our application data and connect to MongoDB in a structured way.
    *   **Why we used it:** "A document database like MongoDB is great for this project because the structure of financial records can evolve. Mongoose provides schemas and validation, giving us the best of both worlds: flexibility and data integrity."

*   **JWT (JSON Web Tokens) for Authentication:**
    *   **What it is:** JWT is a standard for securely transmitting information between parties as a JSON object. When a user logs in, we give them a token. They must include this token in the header of every subsequent request to prove who they are.
    *   **Why we used it:** "JWTs are stateless and secure. The server doesn't need to store session information, which makes the API highly scalable. We can encode the user's ID and role directly into the token, so we know their permission level on every request."

*   **Bcrypt.js (For Password Security):**
    *   **What it is:** A library used to hash passwords.
    *   **Why we used it:** "We **never** store passwords directly. That would be a massive security risk. Bcrypt takes a password, runs it through a complex one-way algorithm (hashing), and stores the result. When a user tries to log in, we hash their submitted password and compare it to the stored hash. You can't reverse the hash to get the original password."

---

### Part 3: The Architecture (The "How")

This is the most important part. It explains how the code is organized and why it's structured this way.

#### Q: How did you structure your application? Can you explain the Controller-Service pattern?

**Your Answer:** "The application is structured using a **Controller-Service pattern** to ensure a strong **separation of concerns**. This makes the code cleaner, easier to test, and more maintainable."

*   **The Controller (`*.controller.js`):** "Think of the controller as the **traffic cop**. Its only job is to manage the HTTP request and response. It receives a request, validates the input, calls the appropriate service to do the actual work, and then sends back a response (either success or error) based on what the service returns."

*   **The Service (`*.service.js`):** "The service is the **brain** of the application. It contains all the business logic. It's responsible for interacting with the database (via the Mongoose model), performing calculations, and enforcing the rules of the application. It knows nothing about HTTP requests or responses."

*   **The Model (`*.model.js`):** "The model is the **blueprint for our data**. It defines the schema—the fields, types, and rules—for our data in the MongoDB database."

*   **The Route (`*.routes.js`):** "The route is the **address book**. It maps incoming API endpoints (like `GET /api/users`) to the correct controller function that should handle them."

#### Q: How does your access control (RBAC) work?

**Your Answer:** "We implemented Role-Based Access Control using a **middleware factory pattern**."

1.  **Authentication First:** A `verifyToken` middleware runs first on protected routes. It checks for a valid JWT in the request header. If the token is valid, it decodes it and attaches the user's information (like `userId` and `role`) to the `req` object.
2.  **Authorization Second:** The `requireRoles` middleware runs next. It's a "factory" because it's a function that returns another function. We pass it an array of allowed roles (e.g., `requireRoles(['ADMIN'])`). It then checks if the `role` from the decoded token is in the allowed list. If not, it immediately sends a `403 Forbidden` error.
3.  **Why this pattern?** "This approach is very clean and declarative. You can see exactly which roles are required just by looking at the route definition. It keeps our authorization logic out of the controllers and makes it highly reusable."

#### Q: Why did you choose to soft-delete records?

**Your Answer:** "In a financial system, data integrity and history are critical. We **soft-delete** records by setting an `isDeleted` flag to `true` instead of permanently removing them from the database. This ensures we never lose historical data, which is essential for auditing, recovering from mistakes, and accurate long-term reporting. All database queries are built to automatically filter out records where `isDeleted: true`."

#### Q: Why use MongoDB Aggregation Pipelines for the dashboard?

**Your Answer:** "For analytics, performance is key. Instead of fetching thousands of records from the database and then calculating totals or averages in JavaScript, we use **MongoDB's Aggregation Pipeline**. This delegates the computation directly to the database, which is highly optimized for this kind of work. It dramatically reduces the amount of data sent over the network and minimizes the CPU load on our application server, resulting in a much faster and more scalable API."

---

### Part 4: The Code in Action (Walkthrough)

Be ready to trace a request through the system.

#### Q: Walk me through what happens when an Admin creates a new record.

**Your Answer:** "Certainly. Here's the step-by-step flow for `POST /api/records`:"

1.  **Request Hits the Route:** The request first hits the `record.routes.js` file. The router matches the path and method.
2.  **Authentication Middleware:** The `verifyToken` middleware runs. It validates the Admin's JWT. If valid, it attaches the user payload (e.g., `{ userId: '...', role: 'ADMIN' }`) to the `req` object and calls `next()`.
3.  **Authorization Middleware:** The `requireRoles(['ADMIN'])` middleware runs. It checks `req.user.role` and sees that 'ADMIN' is in the allowed list, so it calls `next()`.
4.  **Validation Middleware:** The `express-validator` middleware runs to ensure the request body has a valid `amount`, `type`, `category`, etc.
5.  **Controller Function:** The request finally reaches the `createRecord` function in `record.controller.js`.
6.  **Call the Service:** The controller doesn't do the work itself. It calls `recordService.createRecord()`, passing in the data from the request body and the `userId` from the token.
7.  **Service Logic:** The `createRecord` function in `record.service.js` creates a new Mongoose `Record` model with the data and saves it to the database.
8.  **Response:** The service returns the newly created record to the controller.
9.  **Send Response:** The controller uses the `successResponse` utility to send a `201 Created` status code and the new record back to the client.
10. **Error Handling:** "If anything goes wrong at any step—from the database saving to any other error—it gets caught and passed to a global error-handling middleware in `app.js`, which ensures a consistent error response is always sent."

---

Good luck! You've got this.
