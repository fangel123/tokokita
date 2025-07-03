# 🛍️ TokoKita E-Commerce

[![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://reactjs.org/)
[![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)](https://expressjs.com/)
[![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Vercel](https://img.shields.io/badge/Vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![Railway](https://img.shields.io/badge/Railway-13141B?style=for-the-badge&logo=railway&logoColor=white)](https://railway.app/)

**TokoKita** adalah aplikasi web e-commerce full-stack yang dibangun dari awal sebagai proyek portofolio. Platform ini dirancang untuk menghubungkan penjual (Seller) dengan pembeli (Buyer), menampilkan produk, dan mengelola alur transaksi sederhana. Fokus utama proyek ini adalah pada kualitas implementasi, arsitektur yang solid, dan penerapan fitur-fitur kompleks yang mendemonstrasikan pemahaman mendalam tentang pengembangan web modern.

## 🚀 Live Demo

Aplikasi ini telah di-deploy dan dapat diakses melalui link berikut:

**Frontend (Vercel):** [https://tokokita-bymik.vercel.app/](https://tokokita-bymik.vercel.app/)

**Backend (Railway):** `https://tokokita-production.up.railway.app`

## ✨ Fitur Utama

### Fitur Publik & Pembeli (Buyer)
- **Katalog Produk:** Menampilkan semua produk dengan fitur pencarian dan filter berdasarkan kategori.
- **Detail Produk:** Halaman detail untuk setiap produk, menampilkan galeri gambar, deskripsi, harga, stok, serta rating dan review.
- **Sistem "Suka" (Like):** Pengguna yang login dapat menyukai produk, dan jumlah total suka akan ditampilkan.
- **Sistem Review & Rating:** Pengguna yang login dapat memberikan rating (1-5 bintang) dan ulasan untuk produk.
- **Otentikasi Pengguna:** Sistem registrasi dan login yang aman untuk Buyer dan Seller.
- **Keranjang Belanja:** Fungsionalitas penuh untuk menambah, mengurangi kuantitas, dan menghapus item dari keranjang. State keranjang disimpan di `localStorage` agar tidak hilang saat refresh.
- **Alur Checkout:**
  - Integrasi dengan API eksternal (Komerce) untuk kalkulasi ongkos kirim dinamis.
  - Sistem pencarian destinasi (kota/kecamatan).
  - Ringkasan belanja dan finalisasi pesanan.

### Fitur Penjual (Seller)
- **Dashboard Khusus:** Area terproteksi yang hanya bisa diakses oleh pengguna dengan peran "Seller".
- **Ringkasan Dinamis:** Menampilkan statistik real-time seperti total produk, total pesanan masuk, dan rating rata-rata dari semua produk.
- **Manajemen Produk (CRUD):** Kemampuan untuk menambah, melihat, **mengedit**, dan menghapus produk mereka sendiri.
- **Manajemen Pesanan:** Halaman untuk melihat semua pesanan yang masuk untuk produk mereka, lengkap dengan detail produk dan info pembeli.
- **Manajemen Review:** Halaman untuk melihat semua ulasan yang diberikan oleh pembeli untuk produk-produk mereka.

## 🛠️ Tech Stack & Arsitektur

Proyek ini dibangun menggunakan arsitektur Monorepo dengan pemisahan yang jelas antara frontend dan backend.

### Frontend
- **Framework:** React 18 (Vite)
- **Routing:** React Router v6
- **Styling:** Tailwind CSS
- **Animasi:** Framer Motion
- **Manajemen State:** React Context (untuk Auth, Cart, dan Products)
- **Validasi Form:** Zod
- **HTTP Client:** Axios
- **Ikon:** Lucide React

### Backend
- **Framework:** Node.js dengan Express.js
- **Database ORM:** Prisma
- **Database:** PostgreSQL
- **Otentikasi:** JSON Web Tokens (JWT)
- **Keamanan:** `bcryptjs` untuk hashing password, `cors` untuk keamanan request.
- **Manajemen Environment:** `dotenv`

### Deployment
- **Frontend:** Vercel, dengan integrasi CI/CD dari GitHub.
- **Backend & Database:** Railway, dengan integrasi CI/CD dari GitHub.

## ⚙️ Menjalankan Secara Lokal

Untuk menjalankan proyek ini di mesin lokal Anda, ikuti langkah-langkah berikut:

### Prasyarat
- Node.js (v18 atau lebih baru)
- npm / yarn
- Git
- PostgreSQL terinstal dan berjalan di mesin Anda

### 1. Clone Repository
```bash
git clone https://github.com/fangel123/tokokita.git
cd tokokita
```

### 2. Setup Backend
```bash
# Masuk ke direktori server
cd server

# Instal dependensi
npm install

# Buat file .env dan isi sesuai dengan .env.example
cp .env.example .env

# Edit file .env dengan kredensial database PostgreSQL lokal Anda
# dan kunci rahasia lainnya.

# Jalankan migrasi database
npx prisma migrate dev

# (Opsional) Isi database dengan data awal
npx prisma db seed

# Jalankan server backend
npm run dev
```
Server backend akan berjalan di `http://localhost:5001`.

### 3. Setup Frontend
```bash
# Buka terminal baru dan masuk ke direktori client
cd client

# Instal dependensi
npm install

# (Opsional) Buat file .env.local untuk development
# Jika tidak dibuat, frontend akan otomatis menunjuk ke http://localhost:5001/api

# Jalankan server development frontend
npm run dev
```
Aplikasi frontend akan berjalan di `http://localhost:5173`.

## 🌳 Environment Variables

Anda perlu membuat file `.env` di direktori `server` dengan variabel berikut:
```env
# URL Koneksi Database PostgreSQL
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"

# Kunci rahasia untuk menandatangani JWT
JWT_SECRET="<YOUR_SUPER_SECRET_KEY>"

# Kunci API dari Komerce (atau penyedia ongkir lainnya)
KOMERCE_API_KEY="<YOUR_KOMERCE_API_KEY>"
KOMERCE_RAJAONGKIR_BASE_URL="https://rajaongkir.komerce.id/api/v1"
```

## 📸 Screenshot

*(Di sini Anda bisa menambahkan beberapa screenshot aplikasi Anda)*

**Homepage**
![Homepage](/home-buyer.png)

**Halaman Produk**
![Product](/product-buyer.png)

**Halaman Detail Produk**
![Product Detail](/detail-product-buyer.png)

**Seller Dashboard**
![Seller Dashboard](/dashboard-seller.png)

**Halaman Tambah Produk**
![Add Product](/add-product-seller.png)

**Halaman Manajemen Produk**
![Management Product](/management-product-seller.png)

## 📄 Lisensi
Proyek ini dilisensikan di bawah [Lisensi MIT](LICENSE).