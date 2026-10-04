# Growth IT Solution 🚀

> **Next-Generation Full-Stack Web Application & Enterprise IT Solutions Engine**

Growth IT Solution is a full-stack digital platform engineered for high-growth tech companies, enterprise cloud migrations, custom AI integrations, and cybersecurity auditing.

---

## 📁 Repository Structure

```
Growth-IT-Solution/
├── frontend/             # Single Page Application (HTML5, Glassmorphic CSS3, ES6 JS)
│   ├── index.html        # Main semantic HTML structure & layout
│   ├── styles.css        # Modern design system tokens, glassmorphism, responsive grid
│   └── app.js            # Real-time API state, cost estimator engine, toast system
├── backend/              # Node.js REST API Server (Zero-dependency native HTTP)
│   ├── server.js         # Express-compatible API router & static asset server
│   ├── test.js           # Automated integration test suite
│   └── package.json      # Backend configuration
├── database/             # Relational Database Schemas & Data Layer
│   ├── schema.sql        # SQL DDL schemas (users, services, portfolio, inquiries)
│   ├── seed.sql          # Comprehensive seed records
│   └── db.js             # Data persistence interface & seed manager
├── assets/               # Generated high-resolution digital assets
│   ├── logo.jpg          # Growth IT Solution branding logo
│   └── hero_graphic.jpg  # 3D cloud & AI architecture diagram
├── README.md             # Project documentation & execution guide
└── package.json          # Root orchestration scripts
```

---

## ⚡ Key Features

1. **Interactive Project Cost & Scope Estimator**:
   - Real-time calculation of project budgets and delivery timelines based on category, scale (MVP / Growth / Enterprise), and custom feature add-ons.
   - Direct submission to backend REST API with instant inquiry creation.

2. **Live Backend Integration & Health Monitor**:
   - Status indicator pill on navigation bar polling `/api/health`.
   - Dynamic services showcase (`/api/services`) and filterable case studies (`/api/portfolio`).

3. **Modern Dark Glassmorphism UI/UX**:
   - Customized design system built with CSS custom properties, HSL color tokens, dark mode toggle, smooth transitions, and responsive grid layouts.

4. **Zero-Dependency Backend**:
   - High-speed Node.js API server running out-of-the-box without requiring external npm packages.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18.x or v20+ / v24+) installed on system.

### Running the Application

1. **Start the API & Web Server**:
   ```bash
   node backend/server.js
   ```
   Or via npm script:
   ```bash
   npm start
   ```

2. **Access the Application**:
   - Web App UI: [http://127.0.0.1:5000](http://127.0.0.1:5000)
   - API Health Check: [http://127.0.0.1:5000/api/health](http://127.0.0.1:5000/api/health)

3. **Run API Integration Tests**:
   ```bash
   node backend/test.js
   ```

---

## 🔌 API Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Server status & DB operational check |
| `GET` | `/api/services` | Retrieve all active IT service offerings |
| `GET` | `/api/portfolio` | Retrieve case studies (optional `?category=FinTech`) |
| `GET` | `/api/stats` | Dynamic metrics & enterprise stats |
| `POST` | `/api/estimator` | Calculate project cost & save inquiry record |
| `POST` | `/api/contact` | Submit consultation message |
| `POST` | `/api/subscribe` | Join newsletter mailing list |

---

## 🛡️ License

Distributed under the MIT License. Copyright &copy; 2026 Growth IT Solution Inc.
