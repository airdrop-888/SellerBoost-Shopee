const axios = require('axios');
const fs = require('fs');
const path = require('path');
const readline = require('readline'); 
const { createSpinner } = require('nanospinner');
const pc = require('picocolors');
const figlet = require('figlet');

// ==========================================
// KONFIGURASI UMUM
// ==========================================
const COOKIE_FILE = path.join(process.cwd(), 'cookies.txt');
const DEFAULT_COOLDOWN = 4 * 60 * 60; // 4 Jam dalam detik

// Fungsi Jeda (Anti-Spam)
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Fungsi Pause Terminal 
function pauseAndExit() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question(pc.cyan('\nPress ENTER untuk keluar dari aplikasi...'), () => {
        rl.close();
        process.exit(1);
    });
}

// Format detik ke teks
function formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) return `${h} Jam ${m} Menit`;
    if (m > 0) return `${m} Menit ${s} Detik`;
    return `${s} Detik`;
}

// Fungsi Countdown Real-Time
function startCountdown(durationInSeconds, callback) {
    let remaining = Math.floor(durationInSeconds);
    console.log(pc.magenta(`\n💤 Analisa selesai. Mengamankan IP dari deteksi bot...`));

    const interval = setInterval(() => {
        if (remaining <= 0) {
            clearInterval(interval);
            readline.clearLine(process.stdout, 0);
            readline.cursorTo(process.stdout, 0);
            console.log(pc.green(`\n⏱️ Waktu tunggu selesai! Memulai eksekusi kembali...`));
            callback(); 
            return;
        }

        const h = Math.floor(remaining / 3600);
        const m = Math.floor((remaining % 3600) / 60);
        const s = Math.floor(remaining % 60);
        
        let timeString = '';
        if (h > 0) timeString += `${h} Jam `;
        if (m > 0 || h > 0) timeString += `${String(m).padStart(2, '0')} Menit `;
        timeString += `${String(s).padStart(2, '0')} Detik`;

        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(pc.gray(`⏱️ Bot otomatis berjalan kembali dalam: `) + pc.yellow(pc.bold(timeString)));

        remaining--;
    }, 1000); 
}

// Membaca file cookies.txt
function loadCookies() {
    try {
        if (!fs.existsSync(COOKIE_FILE)) {
            fs.writeFileSync(COOKIE_FILE, '');
            return [];
        }
        const data = fs.readFileSync(COOKIE_FILE, 'utf-8');
        return data.split('\n').map(line => line.trim()).filter(line => line && !line.startsWith('#'));
    } catch (error) {
        console.error(pc.red('❌ Gagal membaca file cookies.txt:'), error.message);
        return [];
    }
}

function getSpcCds(cookie) {
    const match = cookie.match(/SPC_CDS=([^;]+)/);
    return match ? match[1] : null;
}

function getHeaders(cookie) {
    return {
        'Cookie': cookie,
        'Content-Type': 'application/json;charset=UTF-8',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Referer': 'https://seller.shopee.co.id/portal/product/list/live/all'
    };
}

// ==========================================
// FUNGSI API SHOPEE (DENGAN PROTEKSI ERROR)
// ==========================================

async function fetchBumpedSlots(cookie, spcCds) {
    const url = `https://seller.shopee.co.id/api/v3/opt/mpsku/list/get_bumped_product_list?SPC_CDS=${spcCds}&SPC_CDS_VER=2`;
    const res = await axios.get(url, { headers: getHeaders(cookie) });
    
    // Cek jika cookie expired (Shopee mereturn HTML bukan JSON code)
    if (res.data.code === undefined) {
        throw new Error('Cookie tidak valid atau sudah expired. Harap update cookie!');
    }
    if (res.data.code !== 0) throw new Error(res.data.user_message || res.data.message || 'Gagal mengambil info slot boost');
    
    const config = res.data.data.config || { total_slots: 5, cooldown_seconds: 14400 };
    const activeProducts = res.data.data.products || [];
    
    let lowestCooldown = config.cooldown_seconds;
    if (activeProducts.length > 0) {
        lowestCooldown = Math.min(...activeProducts.map(p => p.cool_down_seconds));
    }

    return {
        totalSlots: config.total_slots,
        usedSlots: activeProducts.length,
        availableSlots: config.total_slots - activeProducts.length,
        activeProductIds: activeProducts.map(p => p.id),
        lowestCooldownSeconds: lowestCooldown
    };
}

async function fetchLiveProducts(cookie, spcCds) {
    const url = `https://seller.shopee.co.id/api/v3/opt/mpsku/list/v2/search_product_list?SPC_CDS=${spcCds}&SPC_CDS_VER=2&page_size=30&list_type=live_all`;
    const res = await axios.get(url, { headers: getHeaders(cookie) });
    if (res.data.code !== 0) throw new Error(res.data.user_message || res.data.message || 'Gagal mengambil daftar produk');
    return res.data.data.products ? res.data.data.products.map(p => ({ id: p.id, name: p.name })) : [];
}

async function fetchBoostInfo(cookie, spcCds, productIds) {
    if (!productIds || productIds.length === 0) return {}; // Proteksi jika produk kosong
    
    const idList = productIds.join(',');
    const url = `https://seller.shopee.co.id/api/v3/opt/mpsku/list/get_boost_info?SPC_CDS=${spcCds}&SPC_CDS_VER=2&product_id_list=${idList}`;
    const res = await axios.get(url, { headers: getHeaders(cookie) });
    if (res.data.code !== 0) throw new Error(res.data.user_message || res.data.message || `Gagal mengambil info status boost (Code: ${res.data.code})`);
    return res.data.data.boost_infos || {};
}

async function doBoostProduct(cookie, spcCds, productId) {
    const url = `https://seller.shopee.co.id/api/v3/opt/product/boost_product/?version=3.1.0&SPC_CDS=${spcCds}&SPC_CDS_VER=2`;
    const payload = { id: productId };
    const res = await axios.post(url, payload, { headers: getHeaders(cookie) });
    
    if (res.data.code === 0) return true;
    throw new Error(res.data.user_message || res.data.message || `ErrorCode:${res.data.code}`);
}

// ==========================================
// LOGIKA UTAMA PEMROSESAN 1 AKUN
// ==========================================

async function processAccount(cookie, index) {
    console.log(pc.blue(`\n=========================================`));
    console.log(pc.bgBlue(pc.white(` >>> PROSES AKUN KE-${index + 1} <<< `)));
    console.log(pc.blue(`=========================================`));

    const spcCds = getSpcCds(cookie);
    if (!spcCds) {
        console.log(pc.red(`❌ [Akun ${index + 1}] Gagal: Token SPC_CDS tidak ditemukan di cookie.`));
        return DEFAULT_COOLDOWN; 
    }

    const spinner = createSpinner('Menganalisa status cooldown saat ini...').start();

    try {
        const slotsInfo = await fetchBumpedSlots(cookie, spcCds);
        
        if (slotsInfo.availableSlots <= 0) {
            spinner.success({ 
                text: pc.yellow(`[Akun ${index + 1}] Slot Penuh (5/5). Waktu tunggu tercepat: ${pc.white(formatTime(slotsInfo.lowestCooldownSeconds))}`) 
            });
            return slotsInfo.lowestCooldownSeconds; 
        }

        spinner.update({ text: `Slot tersedia: ${slotsInfo.availableSlots}. Mengambil daftar produk...` });
        await delay(1500);

        const products = await fetchLiveProducts(cookie, spcCds);
        if (products.length === 0) {
            spinner.error({ text: `[Akun ${index + 1}] Tidak ada produk live di toko ini.` });
            return DEFAULT_COOLDOWN;
        }

        // Filter produk yang belum diboost
        const safeProducts = products.filter(p => !slotsInfo.activeProductIds.includes(p.id));

        // PROTEKSI BUG 0 PRODUK:
        if (safeProducts.length === 0) {
            spinner.success({ text: pc.yellow(`[Akun ${index + 1}] Semua produk toko sudah berada dalam antrean Boost/Cooldown.`) });
            return slotsInfo.lowestCooldownSeconds > 0 ? slotsInfo.lowestCooldownSeconds : DEFAULT_COOLDOWN;
        }

        const productIds = safeProducts.map(p => p.id);
        const boostInfos = await fetchBoostInfo(cookie, spcCds, productIds);
        
        const availableProducts = safeProducts.filter(p => {
            const info = boostInfos[p.id];
            return info && info.disabled_boost_button === false;
        });

        if (availableProducts.length === 0) {
            spinner.success({ text: pc.yellow(`[Akun ${index + 1}] Semua produk yang tersisa masih belum bisa di-boost (status: disabled).`) });
            return slotsInfo.lowestCooldownSeconds > 0 ? slotsInfo.lowestCooldownSeconds : DEFAULT_COOLDOWN;
        }

        let limitToBoost = Math.min(slotsInfo.availableSlots, availableProducts.length);
        spinner.success({ text: `Memulai boost untuk ${limitToBoost} produk baru...` });
        
        let successCount = 0;

        for (let i = 0; i < limitToBoost; i++) {
            const targetProduct = availableProducts[i];
            const actionSpinner = createSpinner(`Mem-boost: ${targetProduct.name.substring(0, 30)}...`).start();
            
            try {
                await doBoostProduct(cookie, spcCds, targetProduct.id);
                actionSpinner.success({ text: pc.green(`Berhasil boost: ${targetProduct.name.substring(0, 30)}...`) });
                successCount++;
                
                if (i < limitToBoost - 1) {
                    await delay(Math.floor(Math.random() * 3000) + 3000); 
                }
            } catch (err) {
                actionSpinner.error({ text: pc.red(`Gagal boost: ${targetProduct.name.substring(0, 30)} - ${err.message}`) });
            }
        }

        console.log(pc.green(`\n✅ [Akun ${index + 1}] Selesai! Berhasil mem-boost ${successCount} produk.`));
        
        const postCheck = await fetchBumpedSlots(cookie, spcCds);
        return postCheck.lowestCooldownSeconds > 0 ? postCheck.lowestCooldownSeconds : DEFAULT_COOLDOWN;

    } catch (error) {
        spinner.error({ text: pc.red(`[Akun ${index + 1}] Terjadi error: ${error.message}`) });
        return DEFAULT_COOLDOWN;
    }
}

// ==========================================
// PENJADWALAN SMART SCHEDULER
// ==========================================

async function runManager() {
    console.clear();
    console.log(pc.cyan(figlet.textSync('Seller Boost', { horizontalLayout: 'fitted' })));
    console.log(pc.green('   ⚡ Free Auto Shopee Product Boost ⚡\n'));
    
    console.log(pc.blue('╔════════════════════════════════════════════════════════════╗'));
    console.log(pc.blue(`║ ${pc.white('🚀 Fitur: Multi-Account & Smart Cooldown Tracker')}           ║`));
    console.log(pc.blue(`║ ${pc.white('⏰ Siklus: Dinamis dengan Real-Time Countdown')}              ║`));
    console.log(pc.blue('╚════════════════════════════════════════════════════════════╝\n'));

    const cookies = loadCookies();

    if (cookies.length === 0) {
        console.log(pc.bgRed(pc.white('\n ❌ PEMBERITAHUAN PENTING ')));
        console.log(pc.yellow('➜ File ') + pc.white('cookies.txt') + pc.yellow(' kosong atau belum diisi.'));
        console.log(pc.yellow('➜ Silakan buka file ') + pc.white('cookies.txt') + pc.yellow(' di folder yang sama dengan aplikasi ini.'));
        console.log(pc.yellow('➜ Masukkan cookie akun Shopee Anda (satu akun per baris), lalu simpan dan buka kembali aplikasi ini.\n'));
        pauseAndExit();
        return; 
    }

    console.log(pc.gray(`📡 Terdeteksi ${pc.white(cookies.length)} akun di dalam file cookies.txt\n`));

    const executeCycle = async () => {
        console.log(pc.magenta(`\n[${new Date().toLocaleString('id-ID')}] 🔄 Memulai analisa & eksekusi boost...`));
        
        let globalLowestWaitSeconds = DEFAULT_COOLDOWN;

        for (let i = 0; i < cookies.length; i++) {
            const accountWaitSeconds = await processAccount(cookies[i], i);
            
            if (accountWaitSeconds < globalLowestWaitSeconds) {
                globalLowestWaitSeconds = accountWaitSeconds;
            }

            if (i < cookies.length - 1) {
                const waitSpinner = createSpinner('Berpindah ke akun berikutnya...').start();
                await delay(Math.floor(Math.random() * 3000) + 3000);
                waitSpinner.success({ text: 'Lanjut...' });
            }
        }

        let nextRunSeconds = globalLowestWaitSeconds + 15; 
        if (nextRunSeconds < 60) nextRunSeconds = 60;

        startCountdown(nextRunSeconds, executeCycle);
    };

    await executeCycle();
}

// Jalankan Bot
runManager().catch(err => {
    console.error(pc.red('\n💥 Terjadi kesalahan sistem fatal:'), err.message);
    pauseAndExit(); 
});