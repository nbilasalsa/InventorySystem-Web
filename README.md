# 📦 Inventory Management System – API Documentation
Backend REST API untuk Inventory Management System yang digunakan untuk mengelola user, kategori, produk, gudang, dan stok.
Aplikasi ini dibangun tanpa frontend dan diuji menggunakan Postman.

API ini sudah dideploy ke AWS EC2 dan dapat diakses melalui Production URL.

# 🚀 Fitur Utama
- Autentikasi & otorisasi menggunakan JWT
- Role-based access:
1. ADMIN: kelola kategori, produk, warehouse, stok
2. USER: akses data (read-only)
- CRUD untuk:
1. User
2. Category
3. Product
4. Warehouse
5. Stock
- Pagination, filtering, dan search
- Produciton-ready deployment

# 🛠️ Teknologi yang Digunakan 
- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- JWT Authentication
- PM2
- Nginx
- AWS EC2
- Git & GitHub
- Postman

# 🌐 Production API URL
```cpp
http://54.144.215.63

```
Server menggunakan Nginx reverse proxy, sehingga tidak menggunakan port 3000 di browser.

# 📁 Struktur Folder
```
InventorySystem-Web/
│
├── prisma/
│   ├── schema.prisma
│   ├── seed.js
│   └── migrations/
│
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── validators/
│   └── index.js
│
├── .env
├── .gitignore
├── API-DOCS.md
├── DEPLOYMENT.md
├── dev.db
├── package-lock.json
├── package.json
├── prisma.config.ts
└── README.md
```

# ⚙️ Environment Variables
buat file `.env` di root project
```env
PORT=3000

DATABASE_URL=postgresql://inventory_user:password@localhost:5432/inventory_db

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=15m

JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d
```

# 📦 Instalasi & Menjalankan Project (Local)
```bash
# clone repository
git clone https://github.com/nbilasalsa/InventorySystem-Web
cd InventorySystem-Web

# install dependencies
npm install

# generate prisma client
npx prisma generate

# migrate database
npx prisma migrate dev

# seed data awal
npx prisma db seed

# jalankan server
npm run dev
```

# 🔐 Akun Default (Seed)
## Admin
```pgsql
Email    : admin@mail.com
Password : admin123
Role     : ADMIN
```
## User
```pgsql
Email    : user01@mail.com
Password : user123
Role     : USER
```

# 🧪 Testing API (Postman)
- Import koleksi Postman
- Gunakan endpoint:
1. `/api/auth/login`
2. `/api/products`
3. `/api/categories`
4. `/api/warehouses`

- Tambahkan header:
```http
Authorization: Bearer <access_token>
```

# ⚡ Deployment (Ringkas)
- Server: AWS EC2 (Ubuntu)
- Process manager: PM2
- Reverse proxy: Nginx
- Database: PostgreSQL
Menjalankan aplikasi di server:
```bash
pm2 start ecosystem.config.cjs
pm2 save
```

# 🧑‍💻 Author
Nabila Salsabila Akbar S — D121231061<br>
Teknik Informatika, Universitas Hasanuddin<br>
Project: Final Pemrograman Web