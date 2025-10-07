# ✅ Checklist Deployment Railway

## 📋 Persiapan Sebelum Deploy

### 1. Akun & Kredensial
- [ ] Akun Railway sudah dibuat (https://railway.app)
- [ ] Akun Cloudinary sudah dibuat (https://cloudinary.com)
- [ ] Cloud Name, API Key, API Secret Cloudinary sudah dicatat
- [ ] (Opsional) Akun SendGrid untuk email

### 2. Repository
- [ ] Code sudah di push ke GitHub/GitLab
- [ ] File `railway.json` ada dan benar
- [ ] File `Procfile` ada dan benar
- [ ] File `runtime.txt` ada (python-3.11)
- [ ] File `pyproject.toml` dengan dependencies lengkap

## 🚀 Langkah Deploy

### Step 1: Deploy Aplikasi
- [ ] Login ke Railway Dashboard
- [ ] Klik "New Project"
- [ ] Pilih "Deploy from GitHub repo"
- [ ] Pilih repository yang sudah dibuat
- [ ] Railway otomatis detect dan build

### Step 2: Setup Database
- [ ] Di Railway Dashboard, klik project
- [ ] Klik "New" → "Database" → "Add PostgreSQL"
- [ ] Tunggu database selesai provisioning
- [ ] Cek environment variable `DATABASE_URL` otomatis ter-set

### Step 3: Environment Variables
Tambahkan di Railway Dashboard → Variables:

**WAJIB:**
- [ ] `SESSION_SECRET` = `[password_kuat_random]`
- [ ] `CLOUDINARY_CLOUD_NAME` = `[your_cloud_name]`
- [ ] `CLOUDINARY_API_KEY` = `[your_api_key]`
- [ ] `CLOUDINARY_API_SECRET` = `[your_api_secret]`

**OPSIONAL:**
- [ ] `SENDGRID_API_KEY` = `[your_sendgrid_key]`
- [ ] `SENDGRID_FROM_EMAIL` = `[verified_email]`

### Step 4: Domain
- [ ] Generate domain public (Settings → Domains → Generate Domain)
- [ ] Atau setup custom domain jika ada
- [ ] Test akses domain

## ✅ Verifikasi Deployment

### Cek Aplikasi Jalan
- [ ] Buka domain yang di-generate
- [ ] Halaman utama muncul dengan benar
- [ ] Login berfungsi (gunakan NISN dari siswa.json)
- [ ] Upload foto berfungsi
- [ ] Like & comment berfungsi
- [ ] Gallery menampilkan foto
- [ ] Responsive di mobile/tablet

### Cek Logs
- [ ] Di Railway Dashboard → Deployments → View Logs
- [ ] Tidak ada error critical
- [ ] Database connection berhasil
- [ ] Gunicorn server running

### Cek Database
- [ ] Di Railway Dashboard → PostgreSQL → Data
- [ ] Table students, photos, likes, comments ada
- [ ] Data siswa ter-load dari siswa.json

## 🔧 Troubleshooting Checklist

### Jika Deploy Gagal
- [ ] Cek Build Logs untuk error
- [ ] Pastikan pyproject.toml dependencies benar
- [ ] Cek runtime.txt (harus python-3.11)
- [ ] Verifikasi railway.json format benar

### Jika App Crash
- [ ] Cek SESSION_SECRET sudah di-set
- [ ] Cek DATABASE_URL format benar (postgresql://)
- [ ] Cek Cloudinary credentials benar
- [ ] Lihat Deployment Logs untuk detail error

### Jika Upload Foto Gagal
- [ ] Verifikasi Cloudinary credentials
- [ ] Cek Cloudinary quota tidak habis
- [ ] Test upload file < 10MB
- [ ] Cek format file (jpg, png, jpeg, gif)

### Jika Database Error
- [ ] Pastikan PostgreSQL sudah running
- [ ] Cek DATABASE_URL environment variable
- [ ] Restart deployment
- [ ] Cek connection pooling settings

## 📊 Post-Deployment

### Monitoring
- [ ] Bookmark Railway Dashboard untuk monitoring
- [ ] Setup notifikasi error (optional)
- [ ] Catat domain untuk dibagikan

### Data Siswa
- [ ] Pastikan siswa.json sudah berisi data lengkap
- [ ] Update nama ketua kelas di CLASS_STRUCTURE (app.py)
- [ ] Update info wali kelas di HOMEROOM_TEACHER (app.py)

### Testing User
- [ ] Test login dengan minimal 3 NISN berbeda
- [ ] Upload foto di berbagai kategori
- [ ] Test like & comment dari user berbeda
- [ ] Test responsive di berbagai device

## 🎯 Optional Optimizations

- [ ] Setup custom domain
- [ ] Enable Railway analytics
- [ ] Setup database backup schedule
- [ ] Configure CDN untuk static files
- [ ] Setup Cloudinary transformations untuk optimize images

## 📞 Support

Jika ada masalah:
1. ✅ Cek checklist ini lagi
2. 📖 Baca README.md bagian Troubleshooting
3. 📊 Cek Railway Deployment Logs
4. 💬 Hubungi admin kelas

---

**Status Deployment:**
- [ ] ✅ Berhasil Deploy
- [ ] ✅ Database Running
- [ ] ✅ Environment Variables Set
- [ ] ✅ Domain Public Generated
- [ ] ✅ Testing Passed

**Deployment Date:** _____________

**Domain URL:** _____________________________________________
