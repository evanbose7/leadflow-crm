<div align="center">

# 🖥️ LeadFlow CRM — Frontend

**React 18 + Vite · Dark UI · Full Lead Management Interface**

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://reactjs.org)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)](https://vitejs.dev)
[![Axios](https://img.shields.io/badge/Axios-1.6-5A29E4?style=flat-square&logo=axios)](https://axios-http.com)

</div>

---

## 📁 Folder Structure

```
Frontend/
├── public/
│   └── _redirects             ← Netlify SPA routing fix
├── src/
│   ├── api/
│   │   └── leads.js           ← Axios API client (all 7 endpoints)
│   ├── components/
│   │   ├── UI.jsx             ← Reusable: Btn, Badge, IconBtn, Spinner, Empty
│   │   ├── Sidebar.jsx        ← Navigation + connection status indicator
│   │   ├── LeadModal.jsx      ← Add / Edit lead form modal
│   │   └── ConfirmModal.jsx   ← Delete confirmation modal
│   ├── pages/
│   │   ├── Dashboard.jsx      ← Stats cards, bar charts, recent leads
│   │   └── Leads.jsx          ← Table with search, filter, sort, pagination
│   ├── utils/
│   │   └── constants.js       ← Shared enums, colors, validators, formatters
│   ├── App.jsx                ← Root component — all state & API calls
│   ├── main.jsx               ← React entry point
│   └── index.css              ← CSS variables + global dark theme
├── index.html
├── vite.config.js
├── vercel.json                ← Vercel SPA routing fix
├── .env.example
└── package.json
```

---

## ✨ Features

- 📊 **Dashboard** — stat cards (total leads, conversion rate, pipeline value, qualified count), status & source bar charts, recent leads list
- 👥 **Leads Table** — full paginated table with all lead details
- 🔍 **Search** — debounced search across name, email, and company
- 🎛️ **Filters** — filter by status and source simultaneously
- ↕️ **Sorting** — click any column header to toggle asc/desc sort
- 📄 **Pagination** — page controls with configurable page sizes (10 / 25 / 50)
- 🔄 **Inline Status Update** — click any status badge in the table to instantly change it
- ➕ **Add Lead** — modal form with full validation
- ✏️ **Edit Lead** — pre-filled modal form
- 🗑️ **Delete Lead** — confirmation modal before deletion
- 🌑 **Dark Theme** — polished dark UI with CSS variables
- 🔌 **Connection Indicator** — sidebar shows if backend is connected or offline

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js 18+
- Backend server running (see [Backend README](../Backend/README.md))

### 1. Navigate to the Frontend folder

```bash
cd Frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create your `.env` file

```bash
cp .env.example .env
```

Your `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

> This points to your local backend. Change it to your deployed backend URL for production.

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser 🎉

---

## 📜 Available Scripts

```bash
npm run dev        # Start dev server with hot reload → http://localhost:5173
npm run build      # Build for production → outputs to dist/
npm run preview    # Preview the production build locally
```

---

## 🌐 API Connection

All API calls are made through `src/api/leads.js` using Axios.

The base URL is read from the `VITE_API_URL` environment variable:

```js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
})
```

| Frontend Action | API Call |
|---|---|
| Load leads table | `GET /api/leads?search=&status=&page=1` |
| Load dashboard stats | `GET /api/leads/stats` |
| Add new lead | `POST /api/leads` |
| Edit lead | `PUT /api/leads/:id` |
| Change status badge | `PATCH /api/leads/:id/status` |
| Delete lead | `DELETE /api/leads/:id` |

---

## 🎨 Theming

All colors are defined as CSS variables in `src/index.css`:

```css
:root {
  --bg: #0d0d0f;          /* page background */
  --bg2: #18181c;         /* card / sidebar background */
  --accent: #6c63ff;      /* primary purple */
  --green: #22c55e;       /* converted / success */
  --amber: #f59e0b;       /* contacted / warning */
  --red: #ef4444;         /* lost / danger */
  --blue: #3b82f6;        /* new leads */
  --purple: #a855f7;      /* qualified */
}
```

To change the theme, simply update these variables.

---

## ☁️ Deploy to Vercel

### Option 1 — Vercel CLI

```bash
npm run build
npm i -g vercel
vercel --prod
```

### Option 2 — Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repo (`evanbose7/leadflow-crm`)
3. Set **Root Directory** to `Frontend`
4. Add environment variable:
   ```
   VITE_API_URL = https://your-backend.up.railway.app/api
   ```
5. Click **Deploy**

> The `vercel.json` file is already configured to handle SPA routing correctly.

---

## 🔧 Dependencies

| Package | Version | Purpose |
|---|---|---|
| react | ^18.2.0 | UI framework |
| react-dom | ^18.2.0 | DOM rendering |
| axios | ^1.6.5 | HTTP client for API calls |
| react-hot-toast | ^2.4.1 | Toast notifications |
| vite | ^5.0.8 | Build tool & dev server |
| @vitejs/plugin-react | ^4.2.1 | React fast refresh |

---

## 📄 License

MIT © 2024 evanbose7
