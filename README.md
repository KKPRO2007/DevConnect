# DevConnect

Developer blog platform served from Express + EJS on Render:

- `backend/`: Node.js, Express, MongoDB, Mongoose, JWT auth, REST API, and EJS pages

## Features

- User registration and login with hashed passwords and JWT
- Protected profile update flow
- Blog CRUD with owner-only update/delete
- Likes and comments
- Search and pagination on posts
- Server-rendered pages with EJS on the backend
- Deployment-ready backend structure for Render

## Project Structure

```txt
DevConnect/
├── backend/
├── render.yaml
└── README.md
```

Backend runs on `http://localhost:5000`.

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
- Add env vars:
   - `NODE_ENV=production`
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `CLIENT_URL` (optional; comma-separated list of allowed origins for `/api` CORS)

`render.yaml` is included for convenience.

## Notes

- The main UI is now served by the backend at `/`, `/login`, `/register`, `/profile`, `/create-post`, `/users/:id`, and `/posts/:id`
- The Render URL is the only URL you need for webpages and API
- For production, keep `JWT_SECRET` long and private
- MongoDB Atlas is recommended for deployment
- Registered users are stored in MongoDB, and the server keeps auth in an `httpOnly` cookie for the EJS flow
