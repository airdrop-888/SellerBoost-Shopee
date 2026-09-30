<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=200&section=header&text=SellerBoost&fontSize=60&fontColor=fff&animation=twinkling&fontAlignY=38&desc=Shopee%20Auto%20Product%20Boost%20%7C%20Free%20%26%20Open%20Source&descAlignY=60&descSize=16" width="100%"/>

</div>

<div align="center">

[![Version](https://img.shields.io/badge/version-2.2.0-blue?style=for-the-badge)](https://github.com/airdrop-888/SellerBoost-Shopee/releases)
[![Platform](https://img.shields.io/badge/platform-Windows-0078D6?style=for-the-badge&logo=windows&logoColor=white)](https://github.com/airdrop-888/SellerBoost-Shopee/releases)
[![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)](LICENSE)
[![Electron](https://img.shields.io/badge/Electron-27-47848F?style=for-the-badge&logo=electron&logoColor=white)](https://electronjs.org)

</div>

---

## 📦 Download

<div align="center">

### ⬇️ [SellerBoost-Setup-2.2.0.exe](https://github.com/airdrop-888/SellerBoost-Shopee/releases/latest)

> Installer resmi untuk Windows 64-bit. Double-click dan ikuti wizard instalasi.

</div>

---

## 🖼️ Preview UI

> **v2.2.0** hadir dengan redesign UI premium — dark sidebar, Shopee orange accent, enterprise-grade dashboard.

| Dashboard | Boost Manager |
|-----------|--------------|
| KPI cards + hero countdown + live console | Product queue + slot telemetry |

| Orders To Ship | Products Catalog |
|----------------|-----------------|
| Urgency timer + deadline alert | Boost status overlay per produk |

---

## ✨ Semua Fitur

| Fitur | Keterangan |
|-------|-----------|
| 🚀 **Auto Product Boost** | Boost produk Shopee otomatis sesuai slot & cooldown (4 jam) |
| 🖥️ **Premium Dashboard** | Dark sidebar + 4 KPI cards + hero boost card realtime |
| 👥 **Multi-Account** | Kelola banyak toko dalam satu dashboard |
| 📦 **Products Catalog** | Lihat semua produk live: harga, stok, terjual, status boost |
| 🛒 **Orders To Ship** | Daftar pesanan pending dengan **urgency deadline timer** (⚠ < 12 jam) |
| 📊 **Revenue Analytics** | Revenue, Orders, Visitors, Conversion Rate dari Shopee key-metrics |
| 📈 **30-Day Performance** | Views, Sales, Conversion Rate per produk yang di-boost |
| ⏱️ **Smart Cooldown** | Deteksi waktu boost berikutnya secara otomatis |
| 🗂️ **Activity Logs** | Riwayat lengkap semua aktivitas boost |
| 🔔 **System Tray** | Minimize ke tray, berjalan di background |
| 💾 **Persistent Storage** | Data tersimpan di `%APPDATA%` — tidak hilang saat restart |
| 🚀 **Windows Startup** | Otomatis berjalan saat Windows dinyalakan |
| 🔄 **Auto-Resume Bot** | Bot otomatis lanjut setelah restart/mati lampu |
| ⚙️ **Settings Panel** | Toggle startup & auto-resume dengan UI modern |

---

## 🔧 Cara Install

### Metode 1: Installer (Direkomendasikan)

1. Download **`SellerBoost-Setup-2.2.0.exe`** dari [Releases](https://github.com/airdrop-888/SellerBoost-Shopee/releases/latest)
2. Jalankan installer sebagai **Administrator**
3. Ikuti wizard → **Next → Install → Finish**
4. Software terinstall di `C:\Program Files\SellerBoost\`
5. Shortcut muncul di Desktop dan Start Menu

### Metode 2: Build dari Source

```bash
git clone https://github.com/airdrop-888/SellerBoost-Shopee.git
cd SellerBoost-Shopee
npm install
npm start          # mode development
npm run dist:nsis  # build installer
```

**Requirements:** Node.js 18+, Windows 10/11 x64

---

## 🍪 Cara Mendapatkan Cookie Shopee

1. Login ke [seller.shopee.co.id](https://seller.shopee.co.id)
2. Buka **DevTools** → F12
3. Tab **Application** → **Cookies** → `https://seller.shopee.co.id`
4. Copy semua cookie (pastikan ada `SPC_CDS`)
5. Paste ke dashboard → **Add Account**

> ⚠️ Cookie biasanya valid 7–30 hari. Perbarui jika status akun jadi "Expired".

---

## 🗺️ Navigasi Dashboard

```
📌 Dashboard      — KPI overview, hero boost card, live console, account table
📦 Products       — Katalog produk live: harga, stok, status boost (Boosting/Ready/Cooldown)
🚀 Boost Manager  — Queue produk, telemetry engine, live bot console
👥 Accounts       — Kelola cookie session semua toko
🛒 Orders         — Pesanan yang perlu dikirim + urgency deadline timer
📊 Analytics      — Revenue summary + 30-day product performance
📋 Activity Logs  — Riwayat semua aktivitas boost
⚙️ Settings       — Windows Startup + Auto-Resume konfigurasi
```

---

## 🔄 Auto-Start Setup (Sekali Aja)

Buka **Settings** → aktifkan 2 toggle:

| Setting | Fungsi |
|---------|--------|
| **Jalankan Saat Windows Startup** | App otomatis berjalan di background saat PC dinyalakan |
| **Auto-Resume Bot Setelah Restart** | Bot lanjut otomatis jika PC restart/mati lampu |

**Alur setelah setup:**
```
Mati lampu → PC hidup → SellerBoost launch tersembunyi
                      → Bot resume di background 🟢
                      → Ikon muncul di System Tray
```

---

## 💾 Lokasi Data

```
C:\Users\<NamaUser>\AppData\Roaming\SellerBoost\
├── cookies.txt    ← Data akun (tidak hilang saat reinstall)
├── stats.json     ← Riwayat & statistik boost
└── config.json    ← Konfigurasi auto-start & auto-resume
```

---

## 📋 Changelog

### v2.2.0 — Premium UI Redesign + Orders & Products & Analytics
- ✅ **Premium UI Redesign** — dark sidebar, Shopee orange accent, enterprise design system
- ✅ **Products Catalog** — tampilkan semua produk live: harga, stok, terjual, status boost
- ✅ **Orders To Ship** — daftar pesanan lengkap dengan urgency deadline timer (⚠ < 12 jam)
- ✅ **Revenue Analytics** — revenue, orders, visitors, conversion rate dari Shopee API
- ✅ **Boost Manager** — halaman dedicated dengan product queue & telemetry
- ✅ **Recent Activity** panel di dashboard
- ✅ **Orders badge** merah di nav sidebar saat ada pesanan urgent
- ✅ 8 halaman navigasi: Dashboard, Products, Boost Manager, Accounts, Orders, Analytics, History, Settings
- ✅ 3 API endpoint baru: `getAllProducts`, `getOrdersDetail`, `getRevenueSummary`

### v2.1.0 — Auto-Start & Persistent Data
- ✅ Installer NSIS — install ke `C:\Program Files`
- ✅ Windows Startup via `app.setLoginItemSettings()`
- ✅ Auto-Resume Bot setelah restart/mati lampu
- ✅ Persistent storage di `%APPDATA%\SellerBoost`
- ✅ Settings page dengan toggle switch

### v2.0.0 — Dashboard Overhaul
- ✅ Modern SPA Dashboard dengan sidebar navigasi
- ✅ Multi-account management
- ✅ 30-Day Product Analytics
- ✅ Orders To Ship badge
- ✅ System Tray support

### v1.0.0 — Initial Release
- ✅ CLI-based auto boost
- ✅ Multi-account via cookies.txt

---

## ⚠️ Disclaimer

Tool ini dibuat untuk keperluan edukasi dan otomatisasi pribadi. Gunakan sesuai **Terms of Service** Shopee. Penulis tidak bertanggung jawab atas segala konsekuensi penggunaan tool ini.

---

## 📄 License

MIT License — Free & Open Source

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=100&section=footer" width="100%"/>

⭐️ *Jika tool ini bermanfaat, berikan bintang di GitHub!* ⭐️

</div>
