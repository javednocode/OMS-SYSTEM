# OMS - Multi Distributor Order Management System

A full-stack SaaS application for managing distributors, shopkeepers, products, and orders. Built with Next.js 14 App Router, Node.js, Express, Prisma, and SQLite.

## Project Structure

- `/frontend`: Next.js 14 App Router with Tailwind CSS
- `/backend`: Node.js + Express with Prisma ORM

## Features

1. **Super Admin Dashboard**: Manage distributors and view system-wide analytics.
2. **Distributor Dashboard**: Manage products, shopkeepers, and fulfill incoming orders.
3. **Shopkeeper View**: Browse distributor catalogs, add to cart, place orders, and view order history.

## Setup Instructions

Make sure you have Node.js (v18+) installed.

### 1. Install Dependencies

You can install all dependencies from the root directory, or individually in the frontend and backend folders.
From the root `/oms-system` directory:
```bash
cd backend && npm install
cd ../frontend && npm install
cd ..
```

### 2. Run the Application Locally

We use `concurrently` to run both the frontend and backend with a single command. From the root `/oms-system` directory, run:
```bash
npm run dev
```

- **Frontend** will start at `http://localhost:3000`
- **Backend** will start at `http://localhost:4000`

### 3. Login Accounts

A super admin is automatically seeded in the database.
- **Email:** `admin@oms.com`
- **Password:** `admin123`

Log in with this account at `http://localhost:3000/login` to create your first Distributor. 
Then, log in as that Distributor to add Shopkeepers and Products.

## Tech Stack
- Frontend: Next.js 14, TailwindCSS, Lucide React
- Backend: Express, Node.js, Prisma, SQLite, JWT Auth, Bcrypt
