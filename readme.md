<div align="center">

# SellerBoost

**Otomatisasi Boost Produk Shopee untuk Seller Indonesia**

`v2.4.0` · Windows 10/11 x64 · Multi-Akun

</div>

---

## Apa itu SellerBoost?

SellerBoost adalah aplikasi desktop Windows yang menjalankan **auto-boost produk Shopee** sesuai jadwal slot dan cooldown 4 jam, tanpa perlu buka browser atau klik manual berulang. Semua aktivitas dipantau dari satu dashboard: status boost per produk, pesanan yang harus segera dikirim, dan performa 30 hari.

Cocok untuk seller yang punya banyak produk dan/atau banyak toko dan tidak mau kehilangan slot boost hanya karena lupa klik.

---

## Fitur Utama

| Fitur | Keterangan |
|---|---|
| Auto Product Boost | Boost otomatis mengikuti slot & cooldown 4 jam, retry saat gagal |
| Dashboard Premium | KPI cards, hero boost card, live console, dark theme |
| Multi-Akun | Kelola banyak toko dalam satu aplikasi |
| Products Catalog | Harga, stok, terjual, dan status boost tiap produk (Boosting / Ready / Cooldown) |
| Orders To Ship | Pesanan pending + timer urgensi (peringatan < 12 jam) |
| Revenue Analytics | Revenue, orders, visitors, conversion rate dari Shopee key-metrics |
| 30-Day Performance | Views, sales, conversion rate per produk yang di-boost |
| Activity Logs | Riwayat lengkap setiap aksi boost |
| System Tray | Jalan di background, minimize ke tray |
| Windows Startup | Otomatis aktif saat Windows dinyalakan |
| Auto-Resume | Bot lanjut sendiri setelah restart / mati lampu |
| Auto-Updater | Cek versi baru, download, dan install dari dalam aplikasi |

---

## Instalasi

**Installer (disarankan)**

1. Jalankan `SellerBoost-Setup-2.4.0.exe` **sebagai Administrator**
2. Ikuti wizard: **Next → Install → Finish**
3. Terpasang di `C:\Program Files\SellerBoost\`
4. Shortcut tersedia di Desktop dan Start Menu

**Portable / dari source (untuk development)**

```bash
npm install
npm start          # jalankan mode development
npm run dist:nsis  # build installer
```

Requirements: Node.js 18+, Windows 10/11 x64

---

## Mulai Cepat

1. Buka `seller.shopee.co.id` di browser, login
2. F12 → **Application** → **Cookies** → `https://seller.shopee.co.id`
3. Copy semua cookie (pastikan ada `SPC_CDS` dan `SPC_F`)
4. Di SellerBoost: **Accounts → Add Account**, paste cookie, simpan
5. Masuk ke **Boost Manager**, pilih produk, klik **Start**
6. Aktifkan **Settings → Windows Startup + Auto-Resume** agar boost jalan terus

Panduan lengkap: [`docs/PANDUAN-PENGGUNA.md`](docs/PANDUAN-PENGGUNA.md)

---

## Lokasi Data

```
%APPDATA%\SellerBoost\
├── cookies.txt   session akun (lokal, tidak dikirim ke mana pun)
├── stats.json    riwayat & statistik boost
└── config.json   pengaturan startup & auto-resume
```

Cookie tersimpan hanya di komputer pengguna. Uninstall aplikasi tidak menghapus folder data ini.

---

## Struktur Repo

```
src/        kode aplikasi (main process, bot core, UI)
build/      icon installer
docs/       panduan pengguna, changelog, kebijakan lisensi
release/    installer siap distribusi
tools/      script development (generate icon)
index.js    entry CLI
```

---

## Changelog

Lihat [`docs/CHANGELOG.md`](docs/CHANGELOG.md).

---

## Dukungan

Ada masalah atau butuh bantuan setup? Hubungi penjual dengan menyertakan:
versi aplikasi (pojok kiri bawah dashboard), screenshot error, dan isi `Activity Logs`.

---

## Lisensi

Perangkat lunak ini **bukan** open source. Penggunaan diatur dalam
[`docs/LICENSE-EULA.md`](docs/LICENSE-EULA.md). Dilarang menjual ulang,
mendistribusikan, atau membocorkan aplikasi tanpa izin tertulis dari pemilik.
