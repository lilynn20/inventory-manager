# 📦 Inventory Management System

A full-stack inventory management web application built with **React**, **Laravel**, and **MongoDB**.

---

## 🏗️ Architecture

```
inventory-app/
├── backend/    ← Laravel 10 REST API
└── frontend/   ← React 18 + Vite SPA
```

---

## ✅ Prerequisites

| Tool       | Version  |
|------------|----------|
| PHP        | ≥ 8.1    |
| Composer   | ≥ 2.x    |
| Node.js    | ≥ 18.x   |
| MongoDB    | ≥ 6.0    |

---

## 🚀 Quick Start

### 1. Clone / extract the project

### 2. Backend Setup

```bash
cd backend

# Install PHP dependencies
composer install

# Copy and configure environment
cp .env.example .env
# Edit .env: set DB_HOST, DB_PORT, DB_DATABASE as needed

# Generate app key
php artisan key:generate

# Generate JWT secret
php artisan jwt:secret

# Seed the database with demo data
php artisan db:seed

# Start the API server
php artisan serve
# → Running on http://localhost:8000
```

### 3. Frontend Setup

```bash
cd frontend

# Install JS dependencies
npm install

# Start dev server
npm run dev
# → Running on http://localhost:5173
```

### 4. Open in browser

Go to **http://localhost:5173**

---

## 🔐 Demo Credentials

| Role     | Email                     | Password |
|----------|---------------------------|----------|
| Admin    | admin@inventory.com       | password |
| Employee | employee@inventory.com    | password |

---

## 📋 Features

### Authentication
- JWT-based login/logout
- Role-based access control (Admin / Employee)

### Dashboard
- Summary statistics (products, categories, stock, low-stock alerts)
- Monthly stock movement bar chart (Chart.js)
- Top products by stock value (Doughnut chart)
- Recent movements feed
- Low stock alerts

### Products (Admin: full CRUD | Employee: read-only)
- Add, edit, delete products
- Image upload support
- Search by name/description
- Filter by category or low-stock status
- Low-stock threshold per product

### Categories (Admin: full CRUD | Employee: read-only)
- Manage product categories
- Prevents deletion if products are assigned

### Stock Movements (All users can record)
- Record stock IN / stock OUT
- Validates against available quantity for outgoing movements
- Filter by type and product
- Real-time summary totals

---

## 🛠️ API Endpoints

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me

GET    /api/dashboard

GET    /api/categories
POST   /api/categories          [admin]
PUT    /api/categories/{id}     [admin]
DELETE /api/categories/{id}     [admin]

GET    /api/products
POST   /api/products            [admin]
POST   /api/products/{id}       [admin]  (PUT via FormData)
DELETE /api/products/{id}       [admin]

GET    /api/stock-movements
POST   /api/stock-movements
GET    /api/stock-movements/{id}
```

---

## 🗄️ MongoDB Collections

| Collection       | Description                |
|------------------|----------------------------|
| `users`          | User accounts & roles      |
| `categories`     | Product categories         |
| `products`       | Product catalog            |
| `stock_movements`| All stock in/out records   |

---

## 🏗️ Build for Production

```bash
# Frontend
cd frontend
npm run build
# Output in frontend/dist/

# Backend - serve dist/ as static + run Laravel
php artisan serve --env=production
```
