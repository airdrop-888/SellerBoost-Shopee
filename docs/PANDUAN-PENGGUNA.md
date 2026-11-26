# Panduan Pengguna SellerBoost

Panduan ini untuk pengguna akhir (pembeli). Tidak perlu pengetahuan teknis.

---

## 1. Syarat

- Windows 10 atau Windows 11, 64-bit
- Akun Shopee Seller aktif (seller.shopee.co.id)
- Koneksi internet stabil
- Aplikasi dijalankan sebagai Administrator

---

## 2. Instalasi

1. Klik dua kali `SellerBoost-Setup-2.4.0.exe`
2. Jika muncul peringatan Windows ("Windows protected your PC"), klik **More info → Run anyway**. Ini normal untuk aplikasi tanpa sertifikat digital komersial.
3. Klik **Next → Install → Finish**
4. Buka SellerBoost dari shortcut Desktop (klik kanan → **Run as administrator**)

---

## 3. Menambahkan Akun

SellerBoost bekerja dengan cookie session, bukan password. Password tidak pernah diminta.

1. Buka `https://seller.shopee.co.id` di Chrome/Edge, login seperti biasa
2. Tekan **F12** → tab **Application** (Chrome) atau **Storage** (Edge)
3. Buka **Cookies → https://seller.shopee.co.id**
4. Copy seluruh daftar cookie. Cara cepat: di Console jalankan

   ```js
   document.cookie
   ```

5. Di SellerBoost: menu **Accounts → Add Account**
6. Paste cookie, beri nama toko, klik **Save**
7. Status akun harus **Active**. Kalau **Expired**, ulangi langkah 1–6.

**Penting:** minimal harus ada cookie `SPC_CDS` dan `SPC_F`. Tanpa itu, login tidak valid.

---

## 4. Menjalankan Auto-Boost

1. Buka **Boost Manager**
2. Pilih akun toko
3. Centang produk yang ingin di-boost (maksimal sesuai slot Shopee)
4. Klik **Start Bot**
5. Pantau **Live Console** — setiap aksi tercatat dengan timestamp

Bot akan:
- Boost produk yang masih punya slot
- Menunggu cooldown 4 jam per produk
- Retry otomatis jika gagal
- Lanjut sendiri setelah restart (jika Auto-Resume aktif)

---

## 5. Mengaktifkan Auto-Start (sekali saja)

Buka **Settings**, aktifkan:

| Toggle | Fungsi |
|---|---|
| Jalankan saat Windows Startup | App otomatis jalan di background saat PC menyala |
| Auto-Resume Bot Setelah Restart | Bot lanjut otomatis setelah restart / mati lampu |

Alur setelah aktif:

```
Mati lampu → PC menyala → SellerBoost jalan tersembunyi
                        → Bot resume di background
                        → Ikon muncul di System Tray
```

---

## 6. Halaman Lain

- **Products** — katalog live: harga, stok, terjual, status boost
- **Orders** — pesanan yang harus segera dikirim, dengan timer deadline
- **Analytics** — revenue, orders, visitors, conversion rate, performa 30 hari
- **Activity Logs** — riwayat semua aksi boost
- **Settings** — startup, auto-resume, update aplikasi

---

## 7. Update Aplikasi

SellerBoost mengecek update otomatis saat dibuka. Jika ada versi baru, muncul notifikasi di dashboard — klik **Update** dan installer akan diunduh lalu dijalankan. Data akun tidak terhapus saat update.

---

## 8. Troubleshooting

| Masalah | Penyebab & solusi |
|---|---|
| Akun status Expired | Cookie kedaluwarsa. Login ulang di browser, copy cookie baru |
| Boost gagal terus / error 401 | Cookie tidak lengkap atau sesi logout. Pastikan `SPC_CDS` ada |
| Produk tidak muncul | Akun salah dipilih, atau toko belum punya produk aktif |
| Bot berhenti sendiri | PC sleep. Matikan sleep: Settings → System → Power → Sleep = Never |
| App tidak muncul setelah restart | Jalankan sekali sebagai Administrator, lalu cek ulang toggle startup |
| Antivirus memblokir | Tambahkan folder `C:\Program Files\SellerBoost` ke exclusion |
| Data hilang setelah reinstall | Data ada di `%APPDATA%\SellerBoost` — backup folder ini sebelum uninstall |

---

## 9. Backup Data

Copy folder `%APPDATA%\SellerBoost` (paste di address bar Explorer) ke flashdisk / cloud. Isi: `cookies.txt`, `stats.json`, `config.json`.

**Jangan bagikan folder ini ke siapa pun.** Isinya session login toko Anda.

---

## 10. Etika & Risiko

SellerBoost hanya mengotomatiskan aksi yang bisa dilakukan manual di dashboard Shopee. Tetap ada risiko perubahan kebijakan Shopee terhadap otomatisasi. Gunakan dengan bijak dan pantau akun secara berkala.
