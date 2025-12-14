# 📦 Inventory Management System – API Documentation
## Base URL (Production)
```cpp
http://54.144.215.63
```
Semua endpoint diakses melalui REST API dan diuji menggunakan Postman.
Aplikasi ini tidak memiliki frontend.

# 🔐 Authentication
Sistem menggunakan JWT (JSON Web Token)
Token dikirim melalui header:
```makefile
Authorization: Bearer <access_token>
```
## 1️⃣ Health Check
**GET** `/api/health`
Mengecek apakah API berjalan dengan baik.
**Response** 
```JSON
{
  "success": true,
  "message": "API is running"
}
```
## 2️⃣ Authentication Endpoint
### 2.1 Login
**POST** `/api/auth/login`
Login User atau Admin untuk mendapatkan access token.
**Body**
```JSON
{
  "email": "admin@mail.com",
  "password": "admin123"
}
```
**Response** 
```JSON
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "jwt_token_here",
    "user": {
      "id": 1,
      "email": "admin@mail.com",
      "role": "ADMIN"
    }
  }
}
```
## 3️⃣ User Management (Admin Only)
**GET** `/api/users`
Menampilkan daftar semua user. 
🔒 Hanya role ADMIN
---
**POST** `/api/users`
Membuat user baru.
**Body**
```JSON
{
  "username": "user02",
  "email": "user02@mail.com",
  "password": "user123",
  "role": "USER"
}
```
## 4️⃣ Category Management
**GET** `/api/categories`
Menampilkan semua kategori produk.
---
**POST** `/api/categories` (Admin)
**Body**
```JSON
{
  "name": "Electronics",
  "description": "Electronic devices"
}
```
---
**PUT** `/api/categories/:id` (Admin)
**Body**
```JSON
{
  "name": "Updated Category"
}
```
---
**DELETE** `/api/categories/:id` (Admin)
Menghapus kategori berdasarkan ID.
## 5️⃣ Product Management
**GET** `/api/products`
Query (Optional)
```pgsql
?page=1&limit=10&search=monitor
```
---
**POST** `/api/products` (Admin)
**Body**
```JSON
{
  "name": "Monitor LED",
  "sku": "MON-001",
  "price": 2500000,
  "categoryId": 1
}
```
---
**PUT** `/api/products/:id` (Admin)
**Body**
```JSON
{
  "price": 2700000,
}
```
---
**DELETE** `/api/products/:id` (Admin)
Menghapus produk berdasarkan ID.
## 6️⃣ Warehouse Management
**GET** `/api/warehouses`
Menampilkan semua gudang.
---
**POST** `/api/warehouses` (Admin)
**Body**
```JSON
{
  "name": "Main Warehouse",
  "location": "Jakarta"
}
``` 
## 7️⃣ Stock Management
**GET** `/api/stocks`
Menampilkan semua stok.
---
**POST** `/api/stocks` (Admin)
**Body**
```JSON
{
  "productId": 1,
  "warehouseId": 1,
  "quantity": 50
}
```

# 🔐 Authorization Rules
| Role | Akses |
| --- | --- |
| ADMIN | Full access (CRUD) |
| USER | Read only |

# 🧪 Testing Tools
- Postman
- Browser (Health Check)
- Production URL via AWS EC2 + Nginx

# 📦 Deployment Environment
- AWS EC2 (Ubuntu)
- Nginx (Reverse Proxy)
- PM2 (Process Manager)
- PostgreSQL
- Prisma ORM

# ✅ Status
Semua endpoint berhasil diuji dan berjalan di production environment.