# Documentation

## Overview

The Financial Data Aggregator is a secure, scalable, and real-time web application that enables users to access, analyze, and manage normalized financial transaction data from multiple roles (admin, customer, client). Built with a modern stack (Next.js, MySQL, Tailwind CSS), the system delivers performant APIs, a role-aware dashboard, and interactive analytics—backed by industry security and engineering standards.

---

## Key Features

### 1. Authentication and Role-Based Access
- **JWT Authentication:** All logins issue a JWT (JSON Web Token) representing the user's role and identity.
- **Three Distinct Roles:**
  - **Admin:** Full access, advanced filters, sees all data and analytics.
  - **Customer:** Sees and filters only their transactions, unified UI.
  - **Client:** Views all data scoped to their assigned category, analytics and tables match the customer UI but restricted to their category.
- **Role-determined filtering, sidebar, and dashboard appearance.**
- **Session security:** Tokens expire and auto-refresh, with explicit logout.

### 2. Secure, Normalized Database Design
- **Fully normalized RDBMS structure** (MySQL):
    - `customers`, `clients`, `categories`, `merchants`, and `transactions`.
- **Referential integrity:** Foreign keys and index optimization.
- **All critical account data (logins, roles) stored in a `users` table**.

### 3. Robust REST APIs
- **Unified and modular endpoints:**
    - `/api/auth/login` — unified login for all roles.
    - `/api/transactions` — filterable, paginated, role-restricted transactions endpoint.
    - `/api/transactions-stats` — gets analytics/grouped statistics for dynamic graphs, role-aware.
    - `/api/auth/update` — update user credentials.
- **Built-in pagination and column sorting** (limit/page, sort/order parameters).
- **All endpoints enforce data segregation/checks based on JWT.**
- **Strict error handling:** Always mask sensitive errors.

### 4. Real-Time, Responsive Dashboard (UI)
- **Adaptive dashboard built with Tailwind CSS and React:** Mobile-first, accessible.
- **Dynamic sidebar and filter panel:** Always shows only allowed filters per user’s role.
- **Interactive pagination and fast searching/filtering.**

### 5. Visual Analytics (Charts)
- **Pie and bar charts connected directly to the API:**
    - Admin: Insights by merchant, category, gender, zipcode.
    - Customer: See spending by category/merchant, merchant share, etc.
    - Client: Top merchants, gender/zipcode breakdown—all data always constrained to their assigned category.
- **Charts auto-update based on filters and role, are mobile-optimized, visually accessible, and always proportioned.**
- **Data “no results” messages are friendly and clearly styled.**

### 6. Engineering & Security Best Practices

- **JWT secret only on server, never exposed.**
- **APIs reject unauthorized or unexpected tokens/roles.**
- **All REST APIs throttle to prevent brute-force/rate-limiting attacks.**
- **Sanitized SQL with parameterized queries (avoids SQL injection).**
- **All passwords intended to be bcrypt-hashed (demo: plaintext allowed).**

### 7. Scalability, Performance, and Deployability

- **Designed for large datasets:** Pagination and indexes on all filter/search fields.
- **Endpoints provide total counts for UIs to support infinite/advanced pagination.
- **Tested for latency and concurrent loads.**
- **Cloud-Native:** Can be deployed instantly to Vercel/Netlify or as a Dockerized service.
- **Automated token refresh, session expiry—feels fast, never stale.**

---

## Testing & Documentation

- **Unit tests included for API route handlers.**
- **API returns proper HTTP status codes on error.**
- **README: instructions for environment variables, setup, demo logins, and more.**

---

## Database and ER Diagram

- **ER Diagram provided (PNG/Draw.io) showing all primary/foreign key relationships.**
- **SQL schema file included for local setup.**

---
**Thank you for the Hamper!**
