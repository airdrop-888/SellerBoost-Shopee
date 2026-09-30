<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=200&section=header&text=SellerBoost&fontSize=60&fontColor=fff&animation=twinkling&fontAlignY=38&desc=Shopee%20Auto%20Product%20Boost%20%7C%20Free%20%26%20Open%20Source&descAlignY=60&descSize=16" width="100%"/>

</div>

<div align="center">

[![Version](https://img.shields.io/badge/version-2.1.0-blue?style=for-the-badge)](https://github.com/airdrop-888/SellerBoost-Shopee/releases)
[![Platform](https://img.shields.io/badge/platform-Windows-0078D6?style=for-the-badge&logo=windows&logoColor=white)](https://github.com/airdrop-888/SellerBoost-Shopee/releases)
[![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)](LICENSE)
[![Electron](https://img.shields.io/badge/Electron-27-47848F?style=for-the-badge&logo=electron&logoColor=white)](https://electronjs.org)

</div>

---

## 📦 Download

<div align="center">

### ⬇️ [SellerBoost-Setup-2.1.0.exe](https://github.com/airdrop-888/SellerBoost-Shopee/releases/latest)

> Installer resmi untuk Windows 64-bit. Klik dua kali dan ikuti wizard instalasi.

</div>

---

## ✨ Fitur Unggulan

| Fitur | Keterangan |
|-------|-----------|
| 🚀 **Auto Product Boost** | Boost produk Shopee otomatis sesuai slot & cooldown |
| 🖥️ **Modern SPA Dashboard** | UI elegan dengan navigasi tab instant |
| 👥 **Multi-Account** | Kelola banyak akun toko dalam satu dashboard |
| 📊 **30-Day Analytics** | Pantau Views, Sales, dan Conversion Rate produk |
| 📦 **Orders To Ship Tracker** | Notifikasi badge merah untuk pesanan siap kirim |
| ⏱️ **Smart Cooldown** | Deteksi otomatis waktu boost berikutnya |
| 🗂️ **Riwayat Boost** | Log lengkap semua aktivitas boost |
| 🔔 **System Tray** | Minimize ke tray, berjalan di background |
| 💾 **Data Persisten** | Cookies & data tersimpan di `%APPDATA%` — tidak hilang saat restart |
| 🚀 **Windows Startup** | Otomatis berjalan saat Windows dinyalakan |
| 🔄 **Auto-Resume Bot** | Bot otomatis lanjut setelah restart/mati lampu |

---

## 🖼️ Screenshot

> Dashboard utama dengan tabel akun, status bot, dan log aktivitas realtime.

---

## 🔧 Cara Install

### Metode 1: Installer (Direkomendasikan)

1. Download **`SellerBoost-Setup-2.1.0.exe`** dari [Releases](https://github.com/airdrop-888/SellerBoost-Shopee/releases/latest)
2. Jalankan installer sebagai **Administrator**
3. Ikuti wizard → **Next → Install → Finish**
4. Software terinstall di `C:\Program Files\SellerBoost\`
5. Shortcut otomatis muncul di Desktop dan Start Menu

### Metode 2: Build dari Source

```bash
# Clone repository
git clone https://github.com/airdrop-888/SellerBoost-Shopee.git
cd SellerBoost-Shopee

# Install dependencies
npm install

# Jalankan mode development
npm start

# Build installer
npm run dist:nsis
```

**Requirements:** Node.js 18+, Windows 10/11 x64

---

## 🍪 Cara Mendapatkan Cookie Shopee

1. Login ke [seller.shopee.co.id](https://seller.shopee.co.id)
2. Buka **DevTools** → F12
3. Tab **Application** → **Cookies** → `https://seller.shopee.co.id`
4. Klik kanan → **Copy all** atau gunakan extension **Cookie-Editor**
5. Paste ke kolom "Tambah Akun Baru" di dashboard

> ⚠️ **Penting:** Pastikan cookie mengandung nilai `SPC_CDS`. Cookie biasanya valid 7-30 hari.

---

## ⚙️ Pengaturan Auto-Start (Baru di v2.1.0)

Buka halaman **Settings** di dashboard:

| Pengaturan | Fungsi |
|-----------|--------|
| **Jalankan Saat Windows Startup** | App otomatis berjalan di background setiap PC dinyalakan |
| **Auto-Resume Bot Setelah Restart** | Bot otomatis lanjut jika PC restart/mati lampu saat bot aktif |

**Skenario mati lampu:**
```
PC Mati → Hidup → SellerBoost launch otomatis (tersembunyi)
                → Bot resume di background 🟢
                → Ikon muncul di System Tray
```

---

## 💾 Lokasi Penyimpanan Data

Data disimpan secara **permanen** di folder AppData, terpisah dari folder instalasi:

```
C:\Users\<NamaUser>\AppData\Roaming\SellerBoost\
├── cookies.txt    ← Data akun (tidak hilang saat reinstall)
├── stats.json     ← Riwayat & statistik boost
└── config.json    ← Konfigurasi auto-start & auto-resume
```

---

## 🔔 System Tray

- **Minimize/Close** → App tetap berjalan di background (ikon muncul di tray)
- **Klik ikon tray** → Toggle tampilkan/sembunyikan dashboard
- **Klik kanan tray** → Menu: Buka Dashboard, Sembunyikan, Keluar

---

## 📋 Changelog

### v2.1.0 — Auto-Start & Persistent Data
- ✅ **Installer NSIS** — wizard install ke `C:\Program Files`
- ✅ **Windows Startup** — daftar ke registry via `app.setLoginItemSettings()`
- ✅ **Auto-Resume Bot** — bot lanjut otomatis setelah restart/mati lampu
- ✅ **Persistent Storage** — cookies & stats tersimpan di `%APPDATA%` (tidak hilang)
- ✅ **Settings Page** — UI toggle untuk konfigurasi startup & auto-resume
- ✅ **config.json** — menyimpan state bot secara permanen

### v2.0.0 — Dashboard Overhaul
- ✅ Modern SPA Dashboard dengan sidebar navigasi
- ✅ Multi-account management
- ✅ 30-Day Product Analytics (Views, Sales, Conversion)
- ✅ Orders To Ship Tracker
- ✅ Smart Cooldown Detection
- ✅ System Tray support
- ✅ Riwayat boost & statistik

### v1.0.0 — Initial Release
- ✅ CLI-based auto boost
- ✅ Multi-account via cookies.txt

---

## ⚠️ Disclaimer

Tool ini dibuat untuk keperluan edukasi dan otomatisasi pribadi. Gunakan dengan bijak dan sesuai **Terms of Service** Shopee. Penulis tidak bertanggung jawab atas segala konsekuensi penggunaan tool ini.

---

## 📄 License

MIT License — Free & Open Source

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=100&section=footer" width="100%"/>

⭐️ *Jika tool ini bermanfaat, berikan bintang di GitHub!* ⭐️

</div>
