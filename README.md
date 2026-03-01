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

## Notes

- Auth uses JWT (7-day expiry)
- RLS disabled on jobs/users for this project
- Jobs are sorted by created_at (newest first)
