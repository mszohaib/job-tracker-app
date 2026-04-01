# Job Tracker App

A full-stack job application tracker built with React, Node.js, Express, and Supabase.

## Features

- **User Auth**: Register and login
- **Job CRUD**: Add, view, update, delete job applications
- **Filtering**: Filter jobs by status (Applied, Interviewing, Rejected, Offer)
- **Job Details**: Company, role, status, application date, notes

## Project Structure

```
/client   - React frontend (Vite + Tailwind)
/server   - Node.js + Express backend
```

## Setup

### Prerequisites

- Node.js 18+
- Supabase account

### Server

1. `cd server`
2. `npm install`
3. Create `.env` with:
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
   - `JWT_SECRET`
4. `npm run dev` (starts on port 5000)

### Client

1. `cd client`
2. `npm install`
3. Create `.env` with:
   - `VITE_API_URL=http://localhost:5000`
4. `npm run dev` (starts on port 5173)

## Supabase Tables

- **users**: id, name, email, password_hash
- **jobs**: id, user_id, company, role, status, applicationDate, notes, created_at

## Deploy (Vercel + Render)

### Render (backend)

1. New **Web Service** → connect repo, **Root Directory:** `server`
2. **Build:** `npm install` · **Start:** `node index.js`
3. **Environment:** `SUPABASE_URL`, `SUPABASE_KEY`, `JWT_SECRET` (same as local `.env`)
4. Render sets `PORT` automatically — the server uses `process.env.PORT`

### Vercel (frontend)

1. Import repo, **Root Directory:** `client` · Framework: **Vite**
2. **Environment Variables** → add **`VITE_API_URL`** = your Render URL, e.g. `https://your-app.onrender.com`  
   - **HTTPS**, **no trailing slash**
   - Must be set **before** build (Production + Preview if you use previews)
3. Redeploy after changing env vars

### Common production issues

| Issue | Fix |
|-------|-----|
| Login/register fails / wrong URL | Set `VITE_API_URL` on Vercel to the Render URL, not `localhost` |
| Backend won’t start on Render | Use `process.env.PORT` (included in this repo) |
| CORS errors | Server allows all origins; ensure frontend calls the Render URL |

## Notes

- Auth uses JWT (7-day expiry)
- RLS disabled on jobs/users for this project
- Jobs are sorted by created_at (newest first)
