# Growth IT Solution 🚀

> **Next-Generation Full-Stack Web Application & Enterprise IT Solutions Engine**

Growth IT Solution is a full-stack digital platform engineered for high-growth tech companies, enterprise cloud migrations, custom AI integrations, cybersecurity auditing, and secure role-based administrative governance.

---

## 📁 Repository Structure

```
Growth-IT-Solution/
├── frontend/             # Frontend Single Page Applications
│   ├── index.html        # Public website main layout
│   ├── styles.css        # Public design system tokens & glassmorphic UI
│   ├── app.js            # Cost estimator & public API engine
│   ├── admin.html        # Admin Portal UI (Login, Profile, Password, Role Panels)
│   ├── admin.css         # Admin glassmorphism dashboard design system
│   └── admin.js          # Admin Auth, Cookie Session & RBAC tester
├── backend/              # Node.js REST API Server & Security Engine
│   ├── server.js         # API Server, Auth router & static file server
│   ├── seedAdmin.js      # Developer CLI tool for seeding initial SUPER_ADMIN
│   ├── test-auth.js      # Phase 2 Auth & Authorization integration test suite
│   ├── test.js           # Legacy API verification suite
│   ├── middleware/
│   │   └── authMiddleware.js # Authentication & Role Authorization middlewares
│   └── utils/
│       ├── bcrypt.js     # Secure $2b$ Bcrypt password hasher (scrypt engine)
│       ├── cookies.js    # HttpOnly Cookie parser & serializer
│       └── rateLimiter.js# Sliding window brute-force login rate limiter
├── database/             # Relational Database Schemas & Data Store
│   ├── schema.sql        # SQL DDL (users, sessions, services, portfolio, inquiries)
│   ├── seed.sql          # Seed data records
│   └── db.js             # Data store & session lifecycle manager
├── README.md             # Project documentation & execution guide
└── package.json          # Root orchestration scripts
```

---

## 🔐 Phase 2: Secure Admin Authentication & Authorization

### Roles & Permissions Matrix

| Role | Permissions | Access Scope |
| :--- | :--- | :--- |
| `SUPER_ADMIN` | `system:all`, `manage:*` | Full system access, administrative user management. |
| `ADMIN` | `manage:services`, `manage:projects`, `manage:messages`, `manage:media`, `manage:blogs`, `manage:pages`, `manage:content`, `manage:assigned_content` | Manage website content, projects, services, messages, and media. |
| `EDITOR` | `manage:blogs`, `manage:pages`, `manage:content`, `manage:assigned_content` | Manage technical blogs, pages, and web content. |
| `CONTENT_MANAGER` | `manage:assigned_content` | Manage assigned marketing and copy content only. |

*Backend middleware strictly enforces permissions per endpoint — access is never reliant on frontend UI hiding alone.*

---

## 🔑 Seeding the First Admin (SUPER_ADMIN)

Developer seed support allows creating or updating the initial `SUPER_ADMIN` account using environment variables. **No production password is hardcoded.**

### Method 1: Using Environment Variables (Recommended for Prod/Staging)

Pass `ADMIN_EMAIL` and `ADMIN_PASSWORD` when starting the server or running the seed tool:

#### PowerShell (Windows):
```powershell
$env:ADMIN_EMAIL="superadmin@yourcompany.com"
$env:ADMIN_PASSWORD="YourSuperSecretPassword2026!"
node backend/seedAdmin.js
```

#### Bash (Linux / macOS):
```bash
ADMIN_EMAIL="superadmin@yourcompany.com" ADMIN_PASSWORD="YourSuperSecretPassword2026!" node backend/seedAdmin.js
```

### Method 2: Development Seed Defaults
In local development mode without environment variables, the database seeds the following accounts:
- **SUPER_ADMIN**: `superadmin@growthit.com` / `SuperAdminSecret2026!`
- **ADMIN**: `admin@growthit.com` / `AdminPass2026!`
- **EDITOR**: `editor@growthit.com` / `EditorPass2026!`
- **CONTENT_MANAGER**: `content@growthit.com` / `ContentPass2026!`

---

## ⚡ Quick Start Guide

### Running the Application

1. **Start the API & Admin Server**:
   ```bash
   node backend/server.js
   ```
   Or via npm:
   ```bash
   npm start
   ```

2. **Access URLs**:
   - **Public Website**: [http://127.0.0.1:5000](http://127.0.0.1:5000)
   - **Admin Portal**: [http://127.0.0.1:5000/admin.html](http://127.0.0.1:5000/admin.html)
   - **API Health Check**: [http://127.0.0.1:5000/api/health](http://127.0.0.1:5000/api/health)

3. **Run Phase 2 Auth Integration Tests**:
   ```bash
   node backend/test-auth.js
   ```
   Or via npm:
   ```bash
   npm test
   ```

---

## 🔌 API Endpoints Summary

### Authentication APIs
| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Public (Rate-Limited) | Authenticate user, verify bcrypt hash, set HTTP-Only cookie |
| `POST` | `/api/auth/logout` | Session Required | Destroy active session & clear HTTP-Only cookie |
| `GET` | `/api/auth/me` | Session Required | Retrieve current sanitized logged-in user profile & permissions |
| `POST` | `/api/auth/change-password` | Session Required | Validate current password, update bcrypt hash, invalidate old sessions |

### Protected Role-Based Admin APIs
| Method | Endpoint | Required Role | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/dashboard` | `SUPER_ADMIN`, `ADMIN`, `EDITOR`, `CONTENT_MANAGER` | Admin dashboard stats |
| `GET` | `/api/admin/users` | `SUPER_ADMIN` | List all system users |
| `POST` | `/api/admin/users` | `SUPER_ADMIN` | Create new admin/editor user |
| `POST` | `/api/admin/services` | `SUPER_ADMIN`, `ADMIN` | Manage services |
| `POST` | `/api/admin/projects` | `SUPER_ADMIN`, `ADMIN` | Manage portfolio projects |
| `POST` | `/api/admin/blogs` | `SUPER_ADMIN`, `ADMIN`, `EDITOR` | Manage blogs & pages |
| `POST` | `/api/admin/assigned-content` | `SUPER_ADMIN`, `ADMIN`, `EDITOR`, `CONTENT_MANAGER` | Manage assigned content |

### Public APIs
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Operational health check |
| `GET` | `/api/services` | List active services |
| `GET` | `/api/portfolio` | List portfolio projects (`?category=FinTech`) |
| `GET` | `/api/stats` | Dynamic stats metrics |
| `POST` | `/api/estimator` | Calculate project cost estimate & submit inquiry |
| `POST` | `/api/contact` | Submit contact message |
| `POST` | `/api/subscribe` | Newsletter subscription |

---

## 🛡️ License

Distributed under the MIT License. Copyright &copy; 2026 Growth IT Solution Inc.
