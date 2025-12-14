# 🚀 DEPLOYMENT GUIDE
**Inventory Management System – Backend REST API**
menjelaskan langkah-langkah yang diperlukan untuk menginstal, mengkonfigurasi, dan menjalankan aplikasi Inventory System Management (Node.js/Express/Prisma) di lingkungan server produksi (Ubuntu AWS EC2).

# 📌 Project Overview
Project ini merupakan **Inventory Management System berbasis REST API** yang dikembangkan menggunakan Node.js dan Express.js.
Aplikasi ini digunakan untuk mengelola user, kategori, produk, warehouse, dan stok, serta mendukung role-based access control (Admin & User).

# 🛠️ Technologies Used
- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- JWT Authentication
- AWS EC2 (Ubuntu)
- Nginx (Reverse Proxy)
- PM2 (Process Manager)
- Git & GitHub
- Postman (API Testing)

## I. FASE DEPLOYMENT AWAL: INFRASTRUKTUR AWS EC2
### 1. Peluncuran Instance Komputasi (EC2)
Proses ini dilakukan melalui AWS Management Console.
1. **Pemilihan AMI:** Pilih _Operating System_ **Ubuntu Server 22.04 LTS (HVM)**, karena kompatibilitasnya yang tinggi dengan Node.js dan Nginx.
2. **Tipe Instance**: Tentukan `t2.micro` (cocok untuk lingkungan staging atau beban rendah) atau `t3.small` (direkomendasikan untuk production yang lebih stabil).
3. **Key Pair**: Pastikan Anda telah membuat atau memilih Key Pair yang ada (misalnya, _ila-inventory-key.pem_). File ini wajib untuk akses SSH.
4. **Konfigurasi Jaringan**: 
- Pilih VPC dan Subnet yang sesuai.
- Auto-assign Public IP harus diatur ke Enable (opsional, karena akan diganti dengan EIP).

Pastikan server Anda (AWS EC2) telah menginstal beberapa komponen berikut:
- Node.js & npm: Versi 18.x atau lebih tinggi.
- PostgreSQL: Database server harus sudah terinstal dan berjalan.
- Git: Untuk kloning repositori.
- Nginx: Sudah terinstal dan akan digunakan sebagai reverse proxy.

### 2. Konfigurasi Security Group (Firewall)
Buat _Security Group_ baru atau edit yang sudah ada untuk mengizinkan _traffic_ yang krusial.
| Tipe | Protokol | Port Range | Sumber(Source) | Deskripsi Wajib |
| --- | --- | --- | --- | --- |
| SSH | TCP | 22 | My IP / 0.0.0.0/0 | Akses administrasi server |
| HTTP | TCP | 80 | 0.0.0.0/0 | Akses publik untuk Nginx |
| Custom TCP | TCP | 3000 | 0.0.0.0/0 | Akses debugging atau testing aplikasi internal (Port Node.js) |

### 3. Alokasi dan Asosiasi Elastic IP (EIP)
Untuk memastikan alamat publik (`54.144.215.63`) tidak berubah setelah reboot atau stop server, EIP wajib digunakan.
1. Di AWS Console, navigasi ke EC2 Dashboard -> Elastic IPs.
2. Klik Allocate Elastic IP address dan setuju pada alokasi dari Amazon's pool.
3. Setelah dialokasikan, pilih EIP tersebut, klik Actions, lalu Associate Elastic IP address.
4. Pilih instance EC2 yang baru diluncurkan (i-XXXXXXXX).
5. Verifikasi bahwa IP Publik instans kini telah berubah menjadi 54.144.215.63.

## II. FASE PROVISIONING SERVER (SSH Terminal)
### 1. Akses SSH Awal
Pastikan izin Key Pair sudah benar (`chmod 400`).
```bash
# Pastikan menggunakan EIP yang telah diasosiasikan
ssh -i "ila-inventory-key.pem"@54.144.215.63
```
### 2. Update Sistem dan Instalasi Tool Dasar
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install git nginx -y
```
Instal PM2:
```bash
sudo npm install -g pm2
```
### 3. Database Setup (PostgreSQL)
```bash
sudo -u postgres psql
```
```sql
CREATE DATABASE inventory_db;
CREATE USER inventory_user WITH PASSWORD 'password';
ALTER USER inventory_user CREATEDB;
GRANT ALL PRIVILEGES ON DATABASE inventory_db TO inventory_user;
```
### 4. Project Setup
```bash
git clone https://github.com/nbilasalsa/InventorySystem-Web.git
cd InventorySystem-Web
npm install
```
### 5. Environment Configuration
Membuat file `.env`:
```env
PORT=3000
DATABASE_URL=postgresql://inventory_user:password@localhost:5432/inventory_db
JWT_SECRET=supersecretkey
JWT_EXPIRES_IN=15m
```
### 6. Prisma Migration & Seeding
```bash
npx prisma migrate dev --name init
npx prisma generate
npx prisma db seed
```
### 7. Run Application with PM2
```bash
pm2 start ecosystem.config.cjs
pm2 save
```
### 8. Nginx Configuration (Reverse Proxy)
```bash
sudo nano /etc/nginx/sites-available/default
```
```nginx
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```
```bash
sudo systemctl restart nginx
```

# ✅ API Testing
Seluruh endpoint diuji menggunakan Postman, meliputi:
- Authentication (Login Admin & User)
- CRUD Category
- CRUD Product
- Warehouse & Stock Management
- Role-based Authorization (Admin vs User)

# 📝 Conclusion
Deployment berhasil dilakukan dan aplikasi dapat diakses secara publik melalui AWS EC2.
Sistem berjalan stabil, database terhubung dengan baik, dan seluruh endpoint dapat diuji secara real menggunakan Postman.