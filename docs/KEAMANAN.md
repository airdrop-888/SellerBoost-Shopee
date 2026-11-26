# Keamanan

## Jangan pernah commit file ini

| File | Kenapa |
|---|---|
| `cookies.txt` | Berisi session login Shopee (`SPC_CDS`, `SPC_F`). Siapa pun yang punya file ini bisa mengambil alih toko. |
| `*.har` | Capture network browser: berisi cookie, token, data pesanan, dan data pembeli. |
| `stats.json`, `config.json` | Riwayat dan konfigurasi akun. |
| `.env`, `*.pem`, `*.key`, `*.pfx` | Kredensial dan private key. |

Semua sudah masuk `.gitignore`. Jangan di-force add (`git add -f`).

## Lokasi data runtime

Data aplikasi asli disimpan di `%APPDATA%\SellerBoost`, **di luar folder repo**:

- `cookies.txt` — session akun
- `stats.json` — riwayat boost
- `config.json` — pengaturan

File `cookies.txt` di folder repo hanya sisa development lama dan tidak dipakai aplikasi.

## Kalau cookie/session sudah terlanjur bocor

1. Login ke `seller.shopee.co.id` → **Logout dari semua perangkat** (atau ganti password).
2. Buat cookie baru, update di halaman **Accounts**.
3. Hapus file bocor dari working directory, lalu bersihkan history git.
4. Kalau sudah ter-push ke GitHub: force-push history bersih, hapus tag lama, lalu minta
   GitHub Support menghapus cached view — atau hapus repo dan buat ulang (paling pasti).

## Checklist sebelum push

```bash
git status --short
git diff --cached --name-only | Select-String -Pattern "cookies|\.har|secret|\.env"
```
