# 🎓 Website Portfolio Kelas XI TJKT 1

Website interaktif dan modern untuk kelas XI TJKT 1 (Teknik Jaringan Komputer dan Telekomunikasi) dengan sistem galeri foto, like, dan komentar. Aplikasi ini fully responsive dan siap untuk di-deploy ke Railway.

## ✨ Fitur Utama

- 📸 **Galeri Foto Interaktif** - Upload, like, dan comment pada foto
- 👥 **Daftar Siswa** - Profil lengkap semua siswa kelas
- 🎨 **Desain Modern** - Dark mode dengan animasi 3D menggunakan Three.js
- 📱 **Fully Responsive** - Tampil sempurna di semua perangkat (mobile, tablet, desktop)
- 🔐 **Sistem Login** - Login menggunakan NISN siswa
- 🗂️ **Kategori Album** - Kegiatan, Praktikum, Acara, dan Lainnya
- 💾 **Database PostgreSQL** - Data tersimpan aman dan terstruktur
- ☁️ **Cloud Upload** - Foto disimpan di Cloudinary

## 🛠️ Teknologi yang Digunakan

### Backend
- **Flask** - Python web framework
- **PostgreSQL** - Database (via Railway/Neon)
- **SQLAlchemy** - ORM untuk database
- **Flask-Login** - Manajemen autentikasi
- **Cloudinary** - Cloud storage untuk foto

### Frontend
- **Tailwind CSS** - Utility-first CSS framework
- **Three.js** - Animasi 3D background
- **GSAP** - Library animasi smooth
- **Font Awesome** - Icon library
- **JavaScript Vanilla** - Interaktivitas dan animasi

## 📋 Prasyarat

Sebelum deploy, pastikan Anda memiliki:

1. **Akun Railway** - Daftar gratis di [railway.app](https://railway.app)
2. **Akun Cloudinary** - Daftar gratis di [cloudinary.com](https://cloudinary.com)
3. **Akun SendGrid (Opsional)** - Untuk fitur email

## 🚀 Cara Deploy ke Railway

### Langkah 1: Persiapan Akun Cloudinary

1. Login ke [Cloudinary Dashboard](https://cloudinary.com/console)
2. Catat informasi berikut dari dashboard:
   - `Cloud Name`
   - `API Key`
   - `API Secret`

### Langkah 2: Deploy ke Railway

#### Opsi A: Deploy via GitHub (Recommended)

1. **Fork atau Push repository ini ke GitHub Anda**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/username/repo-name.git
   git push -u origin main
   ```

2. **Login ke Railway**
   - Kunjungi [railway.app](https://railway.app)
   - Klik "Start a New Project"
   - Pilih "Deploy from GitHub repo"
   - Pilih repository Anda

3. **Railway akan otomatis mendeteksi konfigurasi dari `railway.json`**

#### Opsi B: Deploy via Railway CLI

1. **Install Railway CLI**
   ```bash
   npm i -g @railway/cli
   ```

2. **Login ke Railway**
   ```bash
   railway login
   ```

3. **Inisialisasi project**
   ```bash
   railway init
   ```

4. **Deploy aplikasi**
   ```bash
   railway up
   ```

### Langkah 3: Setup Database PostgreSQL

1. **Di Railway Dashboard, klik project Anda**
2. **Klik "New" → "Database" → "Add PostgreSQL"**
3. Railway akan otomatis membuat database dan set environment variable `DATABASE_URL`

### Langkah 4: Setup Environment Variables

Di Railway Dashboard, tambahkan environment variables berikut:

#### **Wajib:**
```
SESSION_SECRET=buatpasswordrahasiayangsangatkuat123456
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### **Opsional (untuk fitur email):**
```
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=your_verified_email@domain.com
```

### Cara Menambahkan Environment Variables:

1. Buka project di Railway Dashboard
2. Pilih service aplikasi Anda
3. Klik tab "Variables"
4. Klik "New Variable"
5. Masukkan key dan value
6. Klik "Add"

### Langkah 5: Deploy dan Generate Domain

1. **Railway akan otomatis build dan deploy aplikasi**
2. **Generate public domain:**
   - Di Railway Dashboard, klik "Settings"
   - Scroll ke bagian "Domains"
   - Klik "Generate Domain"
   - Domain public Anda akan tersedia (contoh: `your-app.up.railway.app`)

3. **Atau gunakan custom domain:**
   - Klik "Custom Domain"
   - Masukkan domain Anda
   - Ikuti instruksi DNS yang diberikan

## 🔧 Konfigurasi Lokal (Development)

### 1. Clone Repository
```bash
git clone <repository-url>
cd <project-folder>
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

Atau jika menggunakan `uv`:
```bash
uv sync
```

### 3. Setup Environment Variables

Buat file `.env` di root folder:
```env
DATABASE_URL=postgresql://user:password@localhost/dbname
SESSION_SECRET=your-secret-key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Setup Database Lokal

```bash
# Install PostgreSQL (jika belum)
# Buat database
createdb nama_database

# Jalankan migrasi (otomatis saat app pertama kali running)
python main.py
```

### 5. Jalankan Aplikasi

```bash
# Development mode
python main.py

# Production mode dengan Gunicorn
gunicorn --bind 0.0.0.0:5000 main:app
```

Aplikasi akan berjalan di `http://localhost:5000`

## 📁 Struktur Project

```
.
├── app.py                 # Konfigurasi Flask & Database
├── main.py               # Entry point aplikasi
├── models.py             # Database models (Student, Photo, Like, Comment)
├── templates/            # HTML templates
│   ├── index.html       # Halaman utama
│   ├── gallery.html     # Galeri foto
│   ├── album.html       # Detail album
│   ├── students.html    # Daftar siswa
│   └── login.html       # Halaman login
├── static/              # Assets statis
│   ├── css/
│   │   └── main.css     # Custom CSS & responsive styles
│   ├── js/
│   │   ├── animations.js      # Animasi & interaksi
│   │   ├── three-scene.js     # 3D background
│   │   └── cute-interactions.js
│   └── uploads/         # Uploaded photos (local only)
├── railway.json         # Konfigurasi Railway
├── Procfile            # Command untuk Railway/Heroku
├── runtime.txt         # Python version
├── requirements.txt    # Python dependencies
└── README.md          # Dokumentasi ini
```

## 🎨 Fitur Responsive

Aplikasi ini dioptimasi untuk berbagai ukuran layar:

### Mobile (< 640px)
- Navigasi hamburger menu
- Grid foto 1 kolom
- Font size yang disesuaikan
- Button touch-friendly (min 44x44px)
- Network topology yang disederhanakan

### Tablet (640px - 1024px)
- Grid foto 2 kolom
- Navigasi yang lebih luas
- Animasi yang dioptimasi

### Desktop (> 1024px)
- Grid foto 3-4 kolom
- Full animasi & effects
- Hover interactions

## 🔐 Sistem Login

Siswa login menggunakan **NISN (10 digit)**. Data siswa diambil dari `siswa.json`.

### Cara menambah siswa baru:

Edit file `siswa.json`:
```json
{
  "1234567890": {
    "id": "1234567890",
    "name": "Nama Lengkap Siswa",
    "nickname": "Nama Panggilan"
  }
}
```

## 📊 Database Schema

### Table: students
- `id` (Integer, Primary Key)
- `nisn` (String, Unique)
- `name` (String)
- `nickname` (String)

### Table: photos
- `id` (Integer, Primary Key)
- `title` (String)
- `description` (Text)
- `cloudinary_url` (String)
- `category` (String)
- `uploader_id` (Foreign Key)
- `upload_date` (DateTime)

### Table: likes
- `id` (Integer, Primary Key)
- `photo_id` (Foreign Key)
- `user_id` (Foreign Key)
- `created_at` (DateTime)

### Table: comments
- `id` (Integer, Primary Key)
- `photo_id` (Foreign Key)
- `user_id` (Foreign Key)
- `comment_text` (Text)
- `created_at` (DateTime)

## 🔄 Update & Maintenance

### Update Code di Railway:

1. **Jika deploy via GitHub:**
   ```bash
   git add .
   git commit -m "Update message"
   git push
   ```
   Railway akan otomatis re-deploy

2. **Jika deploy via CLI:**
   ```bash
   railway up
   ```

### Backup Database:

```bash
# Di Railway Dashboard
# Klik PostgreSQL database → Data → Export
```

### Monitoring:

- **Logs**: Railway Dashboard → Your Service → Deployments → View Logs
- **Metrics**: Railway Dashboard → Your Service → Metrics

## ⚡ Optimasi Performance

1. **Cloudinary**: Semua foto di-upload ke cloud, mengurangi beban server
2. **CDN**: Tailwind CSS, Font Awesome, Three.js loaded via CDN
3. **Lazy Loading**: Animasi dijalankan hanya saat dibutuhkan
4. **Responsive Images**: Foto otomatis di-optimize untuk mobile
5. **Database Connection Pooling**: Konfigurasi di `app.py`

## 🐛 Troubleshooting

### Error: "SESSION_SECRET environment variable must be set"
**Solusi**: Tambahkan `SESSION_SECRET` di environment variables Railway

### Error: "Database connection failed"
**Solusi**: 
1. Pastikan PostgreSQL database sudah dibuat di Railway
2. Cek environment variable `DATABASE_URL` sudah ter-set

### Error: "Cloudinary upload failed"
**Solusi**: 
1. Verifikasi Cloudinary credentials benar
2. Cek quota Cloudinary Anda belum habis

### Foto tidak muncul setelah upload
**Solusi**:
1. Cek Cloudinary dashboard apakah foto ter-upload
2. Periksa browser console untuk error
3. Verifikasi database memiliki URL yang benar

## 📝 Catatan Penting

1. **Free Tier Railway**:
   - 500 jam execution per bulan
   - $5 credit gratis untuk new users
   - Setelah credit habis, perlu upgrade

2. **Cloudinary Free Tier**:
   - 25 GB storage
   - 25 GB bandwidth per bulan
   - Cukup untuk penggunaan kelas

3. **Database Limits**:
   - Railway PostgreSQL: Shared CPU di free tier
   - Untuk production berat, consider upgrade

## 🎯 Roadmap & Future Features

- [ ] Export data siswa ke PDF/Excel
- [ ] Notifikasi real-time untuk like & comment
- [ ] Fitur chat antar siswa
- [ ] Dashboard admin untuk moderasi
- [ ] PWA support untuk install di mobile
- [ ] Dark/Light theme toggle persistent

## 👥 Kontributor

Website ini dibuat dengan ❤️ oleh dan untuk **XI TJKT 1**

## 📄 Lisensi

Bebas digunakan untuk keperluan edukasi dan non-komersial.

---

## 🆘 Butuh Bantuan?

Jika ada pertanyaan atau masalah:
1. Cek bagian Troubleshooting di atas
2. Periksa Railway logs untuk error details
3. Hubungi admin kelas

**Happy Coding! 🚀**
