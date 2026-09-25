<div align="center">

# 🚀 SellerBoost — Shopee Auto Product Boost

**Tools Otomatisasi Push Produk Shopee — 100% Gratis & Open Source**

![Platform](https://img.shields.io/badge/Platform-Windows%2010%20%7C%2011-blue?style=flat-square&logo=windows&logoColor=white)
![Shopee](https://img.shields.io/badge/Shopee-Seller%20Center-EE4D2D?style=flat-square&logo=shopee&logoColor=white)
![Version](https://img.shields.io/badge/Version-2.0.0-success?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

</div>

---

## 💡 Apa Ini?

Sebagai Seller Shopee, menekan tombol **"Naikkan Produk"** setiap 4 jam secara manual sangatlah melelahkan dan sering terlewat.

**SellerBoost** hadir sebagai asisten virtual toko Anda — berjalan otomatis 24/7 di background dengan fitur **Smart Cooldown Tracker** yang membaca server Shopee agar aman dari spam.

> ⚠️ **Disclaimer:** Tools ini dibuat untuk tujuan edukasi dan automasi pribadi. Segala risiko akibat penggunaan tools ini sepenuhnya menjadi tanggung jawab pengguna.

---

## ✨ Fitur Utama

- 🖥️ **Modern SPA Dashboard** — Antarmuka Single Page Application bergaya Enterprise
- 📊 **30-Day Product Analytics** — Monitor Views, Sales, Conversion Rate 30 hari terakhir
- 📦 **Orders To Ship Tracker** — Notifikasi pesanan baru langsung di dashboard
- 👥 **Multi-Account Manager** — Kelola banyak toko Shopee sekaligus
- 🧠 **Smart Cooldown Tracker** — Bot baca sisa waktu cooldown dari server Shopee secara real-time
- 🛡️ **Human-Like Delay** — Random delay per aksi agar terlihat seperti aktivitas manusia
- 🔕 **Minimize to Tray** — Tutup window, bot tetap jalan di background (system tray)
- 💻 **CLI Mode** — Bisa juga dijalankan via terminal tanpa GUI
- 🔓 **100% Free & Open Source** — MIT License, tidak ada biaya tersembunyi

---

## ⬇️ Download & Cara Pakai (Termudah)

### Opsi A: Download Portable .exe ⭐ (Direkomendasikan)

> **Tidak perlu install Node.js, tidak perlu npm install — langsung jalan!**

1. Pergi ke **[Releases](../../releases/latest)**
2. Download **`SellerBoost-Portable-2.0.0.exe`**
3. Jalankan file `.exe` → Dashboard langsung terbuka
4. Tambahkan cookie Shopee via tombol **"Tambah Akun Baru"**
5. Klik **Start Bot** — selesai!

> 💡 Saat close window (❌), app **tidak mati** — tetap jalan di system tray (pojok kanan bawah taskbar). Klik icon tray untuk buka kembali. Untuk keluar total: klik kanan icon tray → **Keluar**.

---

### Opsi B: Jalankan dari Source Code (Developer)

**Prasyarat:** [Node.js](https://nodejs.org/) v16+

```bash
# 1. Clone repo
git clone https://github.com/airdrop-888/SellerBoost-Shopee.git
cd SellerBoost-Shopee

# 2. Install dependencies
npm install

# 3. Jalankan GUI Dashboard
npm start

# ATAU CLI Mode (terminal only)
npm run cli
```

> ⚠️ **Catatan:** Jika `npm start` error karena Electron binary gagal download, jalankan via `run.bat` atau download portable `.exe` di Releases.

---

## 🍪 Cara Tambah Akun (Cookie Shopee)

### Via UI Aplikasi (Paling Mudah)

1. Buka aplikasi SellerBoost
2. Klik tombol **"Tambah Akun Baru"** (Dashboard atau tab Accounts)
3. Paste Cookie Shopee Seller kamu (harus mengandung `SPC_CDS`)
4. Klik **"Simpan Akun"**

**Cara Ambil Cookie dari Browser:**
1. Buka [Shopee Seller Center](https://seller.shopee.co.id) → Login
2. Tekan **F12** → Tab **Application** → **Cookies** → `seller.shopee.co.id`
3. Salin seluruh string cookie (pastikan ada `SPC_CDS`)

**Cara Hapus Akun:**
- Buka tab **Dashboard** atau tab **Accounts**
- Klik ikon 🗑️ di kolom ACTIONS → Konfirmasi

> 💡 Session cookie Shopee berlaku ~7 hari. Update cookie lama dengan fitur **Tambah Akun** di UI — tidak perlu buka file manual.

---

## 📁 Struktur Project

```
SellerBoost-Shopee/
├── src/
│   ├── main.js          # Electron main process + system tray
│   ├── bot-core.js      # Core logic API & auto-boost
│   ├── index.html       # SPA Dashboard UI
│   ├── style.css        # Stylesheet dashboard
│   └── icon.png         # Tray icon
├── build/
│   └── icon.ico         # Windows app icon (multi-size)
├── index.js             # CLI version (tanpa GUI)
├── run.bat              # Silent launcher (tanpa terminal window)
├── run_silent.vbs       # Helper VBS untuk silent launch
├── cookies.txt          # File konfigurasi cookie akun
├── package.json         # Dependencies & scripts
└── readme.md            # Dokumentasi ini
```

---

## 🛠️ Build .exe Sendiri (Opsional)

```bash
# Install dependencies dulu
npm install

# Build portable .exe
npm run dist

# Output ada di: dist-build/SellerBoost-Portable-2.0.0.exe
```

---

## ⚙️ Teknologi

| Teknologi | Kegunaan |
|-----------|----------|
| [Electron](https://www.electronjs.org/) | Desktop App Framework |
| [Axios](https://axios-http.com/) | HTTP Client untuk API Shopee |
| [Node.js](https://nodejs.org/) | Runtime Environment |

---

## 🤝 Kontribusi

Pull request sangat diterima! Silakan:
1. Fork project ini
2. Buat branch baru (`git checkout -b feature/fitur-baru`)
3. Commit perubahan (`git commit -m 'feat: tambah fitur baru'`)
4. Push ke branch (`git push origin feature/fitur-baru`)
5. Buat Pull Request

---

## 📄 Lisensi

Project ini dilisensikan under **[MIT License](LICENSE)** — bebas digunakan, dimodifikasi, dan didistribusikan.

---

<div align="center">
  <b>Made with ❤️ for Indonesian Shopee Sellers</b>
  <br>
  <i>Free & Open Source Forever</i>
</div>
