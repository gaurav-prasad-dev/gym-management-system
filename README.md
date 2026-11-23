# Gym Management System

A modular monolith Gym Management ERP SaaS application.

## Architecture

The project consists of:
- **`frontend/`**: React application built with TypeScript, Vite, and Tailwind CSS.
- **`backend/`**: REST API built with Node.js, Express.js, TypeScript, and Prisma ORM.
- **`documents.md/`**: Architecture and design documentation.

## Prerequisites

- Node.js (v18+ or v24 LTS recommended)
- npm or pnpm
- PostgreSQL (for backend database)

## Quick Start

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

The backend server runs on `http://localhost:5001` by default.  
Health check endpoint: `http://localhost:5001/api/health`

### 2. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The frontend application runs on `http://localhost:5174` by default.

### 3. Root Scripts

From the repository root:
```bash
npm run dev:backend
npm run dev:frontend
```
