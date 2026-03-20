# CODEX.md

## Project
Bookmatch-ai is an AI-powered web application for personalized book recommendations based on user preferences and reading history.

## Stack
- Frontend: React 19, Vite, React Router, Tailwind CSS
- Backend: FastAPI, SQLAlchemy
- Database: PostgreSQL
- Auth/session: cookie or session-based auth; frontend requests include credentials

## Repo Structure
- `frontend/` contains the React frontend
- `Backend/` contains the FastAPI backend
- `docker-compose.yml` defines the local database and backend services

## Local Development
- Frontend URL: `http://localhost:5173`
- Backend API URL: `http://localhost:8000`
- Database port: `5432`

## Backend Notes
- FastAPI app title: `BookMatch API`
- CORS allows `http://localhost:5173`
- Session middleware is enabled
- Main routers: `auth`, `booklists`, `books`, `recommendations`
- Health endpoint: `GET /health`

## Frontend Notes
- The frontend currently talks to the backend at `http://localhost:8000`
- Some authenticated requests use `credentials: "include"`
- Follow the existing React and Tailwind patterns unless a redesign is requested

## Working Preferences
- Prefer small, focused changes over large refactors
- Preserve existing project patterns when possible
- Ask before changing core auth, database schema, or app architecture
- Do not overwrite unrelated user changes in dirty files
- Run relevant lint or tests after changes when practical
- Keep explanations concise and practical

## Guidance For Codex
- Start by inspecting relevant files before proposing or making changes
- State important assumptions briefly
- If there are multiple reasonable approaches, recommend one with short tradeoff notes
- Prefer beginner-friendly clarity over clever abstractions unless the project already uses them

## Commands
- Frontend dev: `npm run dev` from `frontend/`
- Frontend build: `npm run build` from `frontend/`
- Frontend lint: `npm run lint` from `frontend/`
- Backend dev: `uvicorn main:app --host 0.0.0.0 --port 8000 --reload` from `Backend/`
- Docker services: `docker-compose up`

## Maintainers
- Igor Petersson
- Oliver Cupan

## Notes To Update Over Time
- Current priorities
- Known bugs
- Temporary implementation decisions
- Preferred coding style details
- Areas that are safe to refactor and areas that should be left alone
