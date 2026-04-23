# DevConnect

Fullstack developer blog platform with:

- `backend/`: Node.js, Express, MongoDB, Mongoose, JWT auth, REST API, EJS demo views
- `frontend/`: React + Vite app styled as a black-and-white dark UI for Vercel

## Features

- User registration and login with hashed passwords and JWT
- Protected profile update flow
- Blog CRUD with owner-only update/delete
- Likes and comments
- Search and pagination on posts
- SSR demo pages with EJS on the backend
- Deployment-ready structure for Render and Vercel

## Project Structure

```txt
DevConnect/
├── backend/
├── frontend/
├── render.yaml
└── README.md
```

## Backend Setup

1. Copy [backend/.env.example](/d:/DevConnect/backend/.env.example) to `backend/.env`
2. Set:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `CLIENT_URL`
3. Install and run:

```bash
cd backend
npm install
npm run dev
```

Backend runs on `http://localhost:5000`.

## Frontend Setup

1. Copy [frontend/.env.example](/d:/DevConnect/frontend/.env.example) to `frontend/.env`
2. Set `VITE_API_URL=http://localhost:5000/api`
3. Install and run:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

## API Endpoints

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Users

- `GET /api/users/:id`
- `PUT /api/users/:id`

### Posts

- `POST /api/posts`
- `GET /api/posts`
- `GET /api/posts/:id`
- `PATCH /api/posts/:id`
- `DELETE /api/posts/:id`
- `POST /api/posts/:id/like`

### Comments

- `GET /api/posts/:postId/comments`
- `POST /api/posts/:postId/comments`
- `PATCH /api/comments/:id`
- `DELETE /api/comments/:id`

## Render Deployment

- Create a Render Web Service from this repo
- Use `backend` as the root directory
- Build command: `npm install`
- Start command: `npm start`
- Add env vars from `backend/.env.example`
- Set `CLIENT_URL` to your Vercel frontend URL

`render.yaml` is included for convenience.

## Vercel Deployment

- Import the repo into Vercel
- Set the root directory to `frontend`
- Framework preset: `Vite`
- Build command: `npm run build`
- Output directory: `dist`
- Add `VITE_API_URL=https://your-render-backend.onrender.com/api`

`frontend/vercel.json` handles SPA routing.

## Notes

- The backend also includes EJS pages for learning SSR at `/`, `/login`, `/register`, and `/posts/:id/view`
- For production, keep `JWT_SECRET` long and private
- MongoDB Atlas is recommended for deployment
