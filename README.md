# 📚 Book Store

Full-stack CRUD app for managing books.  
Frontend is a SPA built with React + Vite + Tailwind (with notistack for nice UI alerts).  
Backend is Node.js + Express + MongoDB (Mongoose) with middleware, CORS, and REST endpoints.

# ✨ Features
- Create / Read / Update / Delete books
- SPA navigation (React Router)
- Toast notifications with notistack (better UX)
- Tailwind styling
- CORS configured for local dev
- Tested with Playwright (E2E, frontend) and Jest (backend)
- Easy API testing via Postman/Insomnia

Install dependencies
# backend
cd backend
npm install

# frontend
cd frontend
npm install

Start development servers
# backend 
cd backend
npm run dev

# frontend 
cd frontend
npm run dev

Testing

Frontend E2E (Playwright)
cd frontend
first time only:
npx playwright install
run tests:
npm run test:e2e

Backend (Jest)
cd backend
npm test

