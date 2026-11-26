# Changelog

## v2.4.0 — 30 Sep 2026
- Fix sinkronisasi countdown timer: hero, sidebar, dan tabel memakai satu sumber waktu
- Perbaikan encoding HTML (UTF-8 clean) hasil rebuild
- Auto-updater: cek GitHub Releases, download installer, progress bar
- Products page auto-load saat dibuka
- Image fallback untuk produk tanpa thumbnail
- Perbaikan bug minor pada engine boost

## v2.2.0 — Premium UI Redesign
- Redesign UI: dark sidebar, aksen Shopee orange, design system enterprise
- Products Catalog: harga, stok, terjual, status boost per produk
- Orders To Ship dengan urgency deadline timer (< 12 jam)
- Revenue Analytics: revenue, orders, visitors, conversion rate
- Halaman Boost Manager dengan product queue & telemetry
- Recent Activity panel di dashboard
- Badge merah di nav saat ada pesanan urgent
- 3 endpoint baru: `getAllProducts`, `getOrdersDetail`, `getRevenueSummary`

## v2.1.0 — Auto-Start & Persistent Data
- Installer NSIS, install ke `C:\Program Files`
- Windows Startup via `app.setLoginItemSettings()`
- Auto-Resume bot setelah restart / mati lampu
- Persistent storage di `%APPDATA%\SellerBoost`
- Settings page dengan toggle switch

## v2.0.0 — Dashboard Overhaul
- Dashboard SPA dengan sidebar navigasi
- Multi-account management
- 30-day product analytics
- Orders To Ship badge
- System tray support

## v1.0.0 — Initial Release
- Auto boost berbasis CLI
- Multi-account via cookies.txt
