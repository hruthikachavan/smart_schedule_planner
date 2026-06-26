# AI Productivity Planner — Fullstack

A complete AI-powered productivity platform with a Node.js/Express backend (PostgreSQL via `pg`) and a React/Vite/Tailwind frontend.

---

## Project Structure

```
fullstack-planner/
├── backend/          # Node.js + Express + pg (PostgreSQL)
└── frontend/         # React + Vite + Tailwind CSS
```

---

## 🚀 Quick Start

### 1. Backend

```bash
cd backend
npm install
# Edit .env if needed (DATABASE_URL, JWT_SECRET, PORT)
npm run dev        # starts on http://localhost:5000
```

The server **auto-creates all database tables** on first start — no migrations needed.

### 2. Frontend

```bash
cd frontend
npm install
# .env already set to VITE_API_URL=http://localhost:5000
npm run dev        # starts on http://localhost:5173
```

---

## ⚙️ Environment Variables

### Backend `.env`
```env
PORT=5000
DATABASE_URL=postgresql://...   # your Supabase/Postgres connection string
JWT_SECRET=your_secret_here
NODE_ENV=development
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:5000
```

> The frontend uses a Vite proxy in dev mode — requests to `/api/*` are forwarded to the backend. In production, update `VITE_API_URL` to your deployed backend URL.

---

## 📡 API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /auth/register | ❌ | Register new user |
| POST | /auth/login | ❌ | Login, returns JWT |
| GET | /auth/me | ✅ | Get current user |
| GET | /tasks | ✅ | List all tasks |
| POST | /tasks | ✅ | Create task |
| PUT | /tasks/:id | ✅ | Update task |
| DELETE | /tasks/:id | ✅ | Delete task |
| PATCH | /tasks/:id/complete | ✅ | Mark complete |
| GET | /tasks/quadrants | ✅ | Eisenhower view |
| GET | /availability | ✅ | Get slots |
| PUT | /availability/bulk | ✅ | Bulk replace slots |
| POST | /schedule/generate | ✅ | Generate AI schedule |
| POST | /schedule/regenerate | ✅ | Regenerate schedule |
| GET | /schedule/today | ✅ | Today's blocks |
| GET | /schedule/week | ✅ | Week schedule |
| GET | /schedule/stats | ✅ | Schedule statistics |
| GET | /analytics/insights | ✅ | Full analytics |
| GET | /health | ❌ | Health check |

---

## 🗺️ Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/login` | Sign in |
| `/register` | Create account |
| `/app` | Dashboard |
| `/app/tasks` | Task manager (Cards / Quadrant / Timeline) |
| `/app/schedule` | AI Schedule generator |
| `/app/availability` | Weekly availability grid |
| `/app/insights` | Analytics & AI recommendations |
| `/app/settings` | User settings & preferences |

---

## 🧠 AI Scheduling Algorithm

1. **Priority Scoring** — each task gets a 0–100 score based on importance (1–5) and deadline urgency
2. **Eisenhower Quadrant** — DO_FIRST / SCHEDULE / DELEGATE / ELIMINATE
3. **Slot Allocation** — tasks are greedily assigned to availability slots respecting estimated time and 5-min buffers
4. **Learning** — duration multiplier learns from actual vs estimated completion times
5. **Recommendations** — analytics engine detects patterns and suggests improvements

---

## 🛠️ Tech Stack

**Backend:** Node.js, Express, pg (PostgreSQL), bcryptjs, jsonwebtoken, uuid  
**Frontend:** React 18, Vite, Tailwind CSS, React Router v6, Recharts, date-fns, lucide-react  
**Database:** PostgreSQL (Supabase-compatible)
