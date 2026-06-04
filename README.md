<div align="center">

# 🚀 LeadFlow CRM

**A modern, full-stack Lead Management CRM for small businesses**

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://reactjs.org)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)](https://vitejs.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb)](https://mongodb.com)

[Live Demo](#) · [Report Bug](../../issues) · [Request Feature](../../issues)

</div>

---

## 📁 Project Structure

```
leadflow-crm/                  ← root (this repo)
├── Frontend/                  ← React + Vite frontend
│   ├── src/
│   │   ├── api/               ← Axios API client
│   │   ├── components/        ← Reusable UI components
│   │   ├── pages/             ← Dashboard & Leads pages
│   │   ├── utils/             ← Constants, validators, formatters
│   │   ├── App.jsx            ← Root component
│   │   └── main.jsx           ← Entry point
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── Backend/                   ← Node.js + Express + MongoDB API
    ├── config/
    │   └── db.js              ← MongoDB connection
    ├── models/
    │   └── Lead.js            ← Mongoose schema
    ├── routes/
    │   └── leads.js           ← API route handlers
    ├── server.js              ← Express entry point
    └── package.json
```

---

## ✨ Features

- 📊 **Dashboard** — real-time stats, pipeline value, conversion rate, status/source charts
- 👥 **Lead Management** — create, view, edit, and delete leads
- 🔄 **Inline Status Updates** — click any status badge to instantly update
- 🔍 **Search & Filter** — search by name, email, or company; filter by status and source
- ↕️ **Sorting** — click any column header to sort ascending/descending
- 📄 **Pagination** — configurable page sizes (10 / 25 / 50)
- ✅ **Validation** — client-side and server-side form validation
- 🌑 **Dark UI** — polished dark theme with smooth transitions

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite 5 |
| Styling | Pure CSS with CSS Variables |
| HTTP Client | Axios |
| Icons | Tabler Icons |
| Notifications | react-hot-toast |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| Validation | express-validator |

---

## 🚀 Quick Start

### 1. Clone the repo

```bash
git clone https://github.com/evanbose7/leadflow-crm.git
cd leadflow-crm
```

### 2. Start the Backend

```bash
cd Backend
npm install
cp .env.example .env      # then fill in your MongoDB URI
npm start
```

### 3. Start the Frontend

```bash
cd Frontend
npm install
cp .env.example .env      # already set to http://localhost:5000/api
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) 🎉

> See [Frontend/README.md](./Frontend/README.md) and [Backend/README.md](./Backend/README.md) for detailed setup instructions.

---

## 📦 Lead Fields

| Field | Type | Required |
|---|---|---|
| Name | String | ✅ |
| Email | String (unique) | ✅ |
| Phone | String | ✅ |
| Company | String | ✅ |
| Status | New / Contacted / Qualified / Converted / Lost | — |
| Source | Website / Referral / Cold Call / Email Campaign / Social Media / Other | — |
| Value | Number (₹) | — |
| Notes | String | — |
| Created Date | Date (auto) | — |

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/leads` | Get all leads (search, filter, sort, paginate) |
| GET | `/api/leads/stats` | Dashboard statistics |
| GET | `/api/leads/:id` | Get single lead |
| POST | `/api/leads` | Create new lead |
| PUT | `/api/leads/:id` | Update lead |
| PATCH | `/api/leads/:id/status` | Quick status update |
| DELETE | `/api/leads/:id` | Delete lead |

---

## ☁️ Deployment

| Part | Platform | Status |
|---|---|---|
| Frontend | Vercel | [Live Demo](#) |
| Backend | Railway | [API](#) |
| Database | MongoDB Atlas | Cloud |

---

## 📄 License

MIT © 2024 evanbose7
