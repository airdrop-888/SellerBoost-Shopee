<div align="center">

# 🚀 Shopee Auto Product Boost (Free & Open Source)
**Tools Otomatisasi Push Produk Shopee - 100% Gratis & Open Source**

![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%2010%20%7C%2011-blue?style=for-the-square&logo=windows&logoColor=white)
![Shopee](https://img.shields.io/badge/Shopee-Seller%20Center-EE4D2D?style=for-the-square&logo=shopee&logoColor=white)
![Version](https://img.shields.io/badge/Version-2.0.0-success?style=for-the-square)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-square)

</div>

---

## 💡 Apa Ini?

Sebagai Seller Shopee, menekan tombol **"Naikkan Produk"** setiap 4 jam secara manual sangatlah melelahkan dan sering terlewat.

**Shopee Auto Product Boost** hadir sebagai asisten virtual toko Anda. Software ini akan berjalan otomatis di PC/RDP Anda 24/7 dengan fitur **Smart Cooldown Tracker** yang membaca server Shopee agar aman dari deteksi bot.

> ⚠️ **Disclaimer:** Tools ini dibuat untuk tujuan edukasi dan automasi pribadi. Segala risiko akibat penggunaan tools ini (termasuk potensi banned oleh Shopee) sepenuhnya menjadi tanggung jawab pengguna.

---

## ✨ Fitur Utama

*   🖥️ **Modern SPA Dashboard** — Antarmuka *Single Page Application* bergaya Enterprise. Berpindah tab secara instan dan halus.
*   📊 **30-Day Product Analytics** — Monitor performa produk Anda selama 30 hari terakhir (*Views*, *Sales*, *Conversion Rate*).
*   📦 **Orders To Ship Tracker** — Notifikasi langsung di dashboard ketika ada pesanan baru masuk.
*   👥 **Multi-Account Manager** — Jalankan banyak toko Shopee sekaligus hanya dengan 1x klik.
*   🧠 **Smart Cooldown Tracker (Anti-Spam)** — Bot membaca sisa waktu cooldown dari server Shopee secara *real-time*. Jika slot penuh, bot otomatis menunggu dan bangun tepat saat tombol boost siap ditekan lagi.
*   🛡️ **Human-Like Delay** — Algoritma *random delay* per aksi membuat aktivitas bot terlihat seperti manusia asli.
*   💻 **CLI Mode** — Bisa juga dijalankan via terminal tanpa GUI Electron.
*   🔓 **100% Free & Open Source** — Tidak ada biaya tersembunyi, tidak ada lock-in.

---

## 🚀 Cara Install & Pakai

### Prasyarat
- [Node.js](https://nodejs.org/) v16+ (download & install dari website resmi)

### Langkah Instalasi

```bash
# 1. Clone atau download project ini
git clone <repo-url>
cd seller-boost

# 2. Install dependencies
npm install
```

### Cara Menjalankan

**Opsi A: Via run.bat (Paling Mudah - Windows) ⭐**
```
Klik 2x file `run.bat` - aplikasi langsung jalan **TANPA terminal/console window**
- Auto-install dependencies saat pertama kali
- Auto-buat file cookies.txt kalau belum ada
- Langsung buka GUI Dashboard SellerBoost
```

**Opsi B: Via Terminal (Developer)**
```bash
# GUI Dashboard (Electron) - akan tampil terminal
npm start

# ATAU CLI Mode (Terminal only)
npm run cli
```

**Opsi B: Via Terminal**
```bash
# GUI Dashboard (Electron)
npm start

# ATAU CLI Mode (Terminal only)
npm run cli
```

### Konfigurasi Akun (Langsung dari UI Aplikasi)

**Cara Tambah Akun:**
1. Buka aplikasi SellerBoost (via `run.bat` atau `npm start`)
2. Klik tombol **"Add Account"** di Dashboard atau tab **Accounts**
3. Paste Cookie Shopee Seller Anda (harus mengandung `SPC_CDS`)
4. Klik **"Simpan Akun"**

**Cara Hapus Akun:**
1. Buka tab **Dashboard**
2. Klik ikon 🗑️ **(hapus)** di kolom **ACTIONS** untuk akun yang ingin dihapus
3. Konfirmasi penghapusan

> 💡 **Tips:** Session cookie Shopee biasanya berlaku ~7 hari. Gunakan fitur **Add Account** di UI untuk update cookie dengan mudah tanpa perlu buka folder/file manual.

**Cara Manual (Alternatif):**
1. Buka [Shopee Seller Center](https://seller.shopee.co.id) → Login
2. Tekan **F12** → Tab **Application** → **Cookies**
3. Salin seluruh string Cookie (pastikan mengandung `SPC_CDS`)
4. Buka file `cookies.txt` → Paste (1 baris = 1 akun) → Simpan

---

## 📁 Struktur Project

```
seller-boost/
├── src/
│   ├── main.js          # Electron main process
│   ├── bot-core.js      # Core logic API & auto-boost
│   ├── index.html       # SPA Dashboard UI
│   └── style.css        # Stylesheet dashboard
├── index.js             # CLI version (tanpa GUI)
├── run.bat              # ⭐ Silent launcher (klik 2x, tanpa terminal)
├── run_silent.vbs       # Helper untuk silent launch
├── cookies.txt          # File konfigurasi cookie akun
├── package.json         # Dependencies & scripts
└── readme.md            # Dokumentasi ini
```

---

## 🛠️ Build ke .exe (Opsional)

Jika ingin membagikan dalam bentuk file `.exe`:

```bash
npm run dist
```

Hasil build akan ada di folder `dist/`.

---

## ⚙️ Teknologi yang Dipakai

| Teknologi | Kegunaan |
|-----------|----------|
| [Electron](https://www.electronjs.org/) | Desktop App Framework |
| [Axios](https://axios-http.com/) | HTTP Client untuk API Shopee |
| [Node.js](https://nodejs.org/) | Runtime Environment |

---

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan:
1. Fork project ini
2. Buat branch baru (`git checkout -b feature/fitur-baru`)
3. Commit perubahan (`git commit -m 'Tambah fitur baru'`)
4. Push ke branch (`git push origin feature/fitur-baru`)
5. Buat Pull Request

---

## 📄 Lisensi

Project ini dilisensikan under **MIT License** - bebas digunakan, dimodifikasi, dan didistribusikan.

---

<div align="center">
  <b>Made with ❤️ for Indonesian Shopee Sellers</b>
  
  *[Open Source - Free Forever]*
</div>
