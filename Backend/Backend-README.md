<div align="center">

# ⚙️ LeadFlow CRM — Backend

**Node.js + Express + MongoDB REST API**

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.18-000000?style=flat-square&logo=express)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb)](https://mongodb.com)

</div>

---

## 📁 Folder Structure

```
Backend/
├── config/
│   └── db.js          ← MongoDB connection setup
├── models/
│   └── Lead.js        ← Mongoose Lead schema & model
├── routes/
│   └── leads.js       ← All API route handlers
├── server.js          ← Express app entry point
├── package.json
├── .env               ← Your secrets (never commit this)
└── .env.example       ← Safe template to commit
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js 18+
- MongoDB (local) or a free [MongoDB Atlas](https://cloud.mongodb.com) account

### 1. Install dependencies

```bash
cd Backend
npm install
```

### 2. Create your `.env` file

```bash
cp .env.example .env
```

Open `.env` and fill in your values:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/leadflow
FRONTEND_URL=http://localhost:5173
```

**Using MongoDB Atlas (cloud)?** Replace `MONGODB_URI` with your Atlas connection string:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/leadflow
```

### 3. Start the server

```bash
# Production
npm start

# Development (auto-restarts on file change)
npm run dev
```

Server runs at → `http://localhost:5000`

Health check → `http://localhost:5000/api/health`

---

## 🌐 API Reference

Base URL: `http://localhost:5000/api`

---

### GET `/api/leads`
Get all leads with search, filter, sort, and pagination.

**Query Parameters:**

| Param | Type | Default | Description |
|---|---|---|---|
| `search` | string | — | Search name, email, company |
| `status` | string | — | Filter by status |
| `source` | string | — | Filter by source |
| `sortBy` | string | `createdAt` | Field to sort by |
| `sortOrder` | `asc` / `desc` | `desc` | Sort direction |
| `page` | number | `1` | Page number |
| `limit` | number | `10` | Results per page (max 100) |

**Example:**
```
GET /api/leads?search=john&status=New&sortBy=createdAt&sortOrder=desc&page=1&limit=10
```

**Response:**
```json
{
  "success": true,
  "data": [ ...leads ],
  "pagination": {
    "total": 42,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

### GET `/api/leads/stats`
Get dashboard statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 42,
    "conversionRate": "14.3",
    "totalValue": 850000,
    "byStatus": [ { "_id": "New", "count": 10 }, ... ],
    "bySource": [ { "_id": "Website", "count": 8 }, ... ],
    "recentLeads": [ ...5 latest leads ],
    "monthlyTrend": [ ... ]
  }
}
```

---

### GET `/api/leads/:id`
Get a single lead by ID.

**Response:**
```json
{
  "success": true,
  "data": { ...lead }
}
```

---

### POST `/api/leads`
Create a new lead.

**Request Body:**
```json
{
  "name": "Priya Sharma",
  "email": "priya@techcorp.in",
  "phone": "+91 98765 43210",
  "company": "TechCorp India",
  "status": "New",
  "source": "Website",
  "value": 85000,
  "notes": "Interested in enterprise plan"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": { ...createdLead },
  "message": "Lead created successfully"
}
```

---

### PUT `/api/leads/:id`
Update an existing lead (all fields).

**Request Body:** same as POST

**Response:**
```json
{
  "success": true,
  "data": { ...updatedLead },
  "message": "Lead updated successfully"
}
```

---

### PATCH `/api/leads/:id/status`
Quick status-only update.

**Request Body:**
```json
{
  "status": "Qualified"
}
```

**Response:**
```json
{
  "success": true,
  "data": { ...updatedLead },
  "message": "Status updated"
}
```

---

### DELETE `/api/leads/:id`
Delete a lead.

**Response:**
```json
{
  "success": true,
  "message": "Lead deleted successfully"
}
```

---

## 📦 Lead Schema

```js
{
  name:      String,    // required, max 100 chars
  email:     String,    // required, unique, valid email format
  phone:     String,    // required
  company:   String,    // required, max 100 chars
  status:    String,    // enum: New | Contacted | Qualified | Converted | Lost
  source:    String,    // enum: Website | Referral | Cold Call | Email Campaign | Social Media | Other
  value:     Number,    // min 0, default 0
  notes:     String,    // max 1000 chars
  createdAt: Date,      // auto-generated
  updatedAt: Date,      // auto-updated
}
```

---

## 🔒 Environment Variables

| Variable | Description | Example |
|---|---|---|
| `PORT` | Port to run the server | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/leadflow` |
| `FRONTEND_URL` | Allowed CORS origin | `http://localhost:5173` |

---

## ☁️ Deploy to Railway

1. Push your code to GitHub
2. Go to [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub**
3. Select your repo
4. Add environment variables in Railway dashboard:
   ```
   PORT        = 5000
   MONGODB_URI = mongodb+srv://...
   FRONTEND_URL = https://your-frontend.vercel.app
   ```
5. Railway gives you a public URL like `https://crm-backend.up.railway.app`

---

## 📄 License

MIT © 2024 evanbose7
