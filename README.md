# StockFlow - Inventory Management System

A multi-tenant SaaS inventory management platform built with Laravel, React, and MongoDB.

## Features

- **Multi-tenant Architecture**: Companies can register and manage their own isolated inventory
- **User Management**: Admin users can add/remove team members
- **Product Management**: Track products with categories, prices, and stock levels
- **Stock Movements**: Record stock in/out with history tracking
- **Low Stock Alerts**: Dashboard highlights products below threshold
- **Analytics Dashboard**: Overview of inventory value, movements, and trends

## Tech Stack

### Backend
- PHP 8.x with Laravel 10
- MongoDB (via mongodb/laravel-mongodb)
- JWT Authentication (tymon/jwt-auth)

### Frontend
- React 18 with Vite
- React Router for navigation
- Lucide React for icons
- React Hot Toast for notifications

## Getting Started

### Prerequisites
- PHP 8.x with MongoDB extension
- Composer
- Node.js 18+
- MongoDB server

### Backend Setup
```bash
cd backend
composer install
cp .env.example .env
# Configure your MongoDB connection in .env
php artisan key:generate
php artisan jwt:secret
php artisan db:seed
php artisan serve
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Demo Credentials
- **Admin**: admin@inventory.com / password
- **Employee**: employee@inventory.com / password

## API Endpoints

### Authentication
- `POST /api/register` - Register new company
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/me` - Get current user

### Resources (require authentication)
- `GET|POST /api/products` - List/create products
- `GET|PUT|DELETE /api/products/{id}` - Product operations
- `GET|POST /api/categories` - List/create categories
- `GET|PUT|DELETE /api/categories/{id}` - Category operations
- `GET|POST /api/movements` - List/create stock movements
- `GET /api/dashboard` - Dashboard statistics

### Admin Only
- `GET /api/employees` - List company employees
- `POST /api/employees` - Add employee
- `DELETE /api/employees/{id}` - Remove employee

## Project Structure

```
├── backend/
│   ├── app/
│   │   ├── Http/Controllers/
│   │   ├── Models/
│   │   └── Middleware/
│   ├── config/
│   ├── database/seeders/
│   └── routes/api.php
│
└── frontend/
    └── src/
        ├── components/
        ├── context/
        ├── pages/
        └── services/
```

## License

MIT
