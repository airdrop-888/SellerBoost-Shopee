const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

const { app } = require('electron');

// ==========================================
// FIX PATH UNTUK .EXE
// ==========================================
let rootPath;
if (app.isPackaged) {
    // Saat di-build jadi .exe, file cookies.txt akan dicari bersebelahan dengan .exe
    rootPath = path.dirname(process.execPath);
} else {
    // Saat tahap development (npm start), cari di folder root project
    rootPath = path.join(__dirname, '..');
}
const COOKIE_FILE = path.join(rootPath, 'cookies.txt');
const STATS_FILE = path.join(rootPath, 'stats.json');
const DEFAULT_COOLDOWN = 4 * 60 * 60; // 4 Jam

// STATE BOT GLOBAL
let isBotRunning = false;
let logCallback = null;
let botCountdownInterval = null;

function getHeaders(cookie) {
    return {
        'Cookie': cookie,
        'Content-Type': 'application/json;charset=UTF-8',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Referer': 'https://seller.shopee.co.id/portal/product/list/live/all'
    };
}

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

function botLog(msg, type = 'info') {
    if (logCallback) {
        logCallback({ msg, type, time: new Date().toLocaleTimeString('id-ID') });
    }
}

// Helper format waktu
function formatSeconds(sec) {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = Math.floor(sec % 60);
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
}

// Fungsi pembantu untuk ambil Nama Toko asli
async function getShopInfo(cookie, spcCds) {
    try {
        const url = `https://seller.shopee.co.id/api/framework/selleraccount/shop_info/?SPC_CDS=${spcCds}&SPC_CDS_VER=2&_cache_api_sw_v1_=1`;
        const customHeaders = { ...getHeaders(cookie), 'Referer': 'https://seller.shopee.co.id/' };
        const res = await axios.get(url, { headers: customHeaders });
        if (res.data && res.data.data && res.data.data.name) {
            return res.data.data.name;
        }
        return "Unknown Store";
    } catch (e) {
        return "Unknown Store";
    }
}

// Fungsi ambil Order To Ship
async function getOrdersToShip(cookie, spcCds) {
    try {
        const url = `https://seller.shopee.co.id/api/v3/order/get_order_list_to_ship_meta?SPC_CDS=${spcCds}&SPC_CDS_VER=2`;
        const payload = { entity_type: 1, order_status: 0, shipping_priority: 2 };
        const customHeaders = { ...getHeaders(cookie), 'Referer': 'https://seller.shopee.co.id/portal/sale/order?type=toship&source=to_process' };
        const res = await axios.post(url, payload, { headers: customHeaders });
        if (res.data && res.data.data && res.data.data.order_status && res.data.data.order_status["100"] !== undefined) {
            return res.data.data.order_status["100"];
        }
        return 0;
    } catch (e) {
        return 0;
    }
}

// Stats & History Management
async function getStats() {
    try {
        if (!fs.existsSync(STATS_FILE)) {
            await fs.writeFile(STATS_FILE, JSON.stringify({ totalBoosted: 0, history: [] }));
        }
        return JSON.parse(await fs.readFile(STATS_FILE, 'utf-8'));
    } catch (err) {
        return { totalBoosted: 0, history: [] };
    }
}

async function addHistory(shopName, productName, status) {
    let stats = await getStats();
    if (status === 'Success') stats.totalBoosted++;
    
    stats.history.unshift({
        time: new Date().toLocaleTimeString('id-ID'),
        date: new Date().toLocaleDateString('id-ID'),
        shopName,
        productName: productName.substring(0, 50),
        status
    });
    
    // Limit history to 100
    if (stats.history.length > 100) stats.history.pop();
    await fs.writeFile(STATS_FILE, JSON.stringify(stats, null, 2));
}

// ==========================================
// FUNGSI UTAMA: AMBIL SEMUA DATA AKUN (UI)
// ==========================================
async function getAllAccountsStatus() {
    try {
        if (!fs.existsSync(COOKIE_FILE)) {
            await fs.writeFile(COOKIE_FILE, '');
            return [];
        }

        const data = await fs.readFile(COOKIE_FILE, 'utf-8');
        const cookies = data.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'));
        
        const results = [];
        for (let cookie of cookies) {
            const spcCds = cookie.match(/SPC_CDS=([^;]+)/)?.[1];
            if (!spcCds) {
                results.push({ name: "Invalid Cookie", status: "Error", slots: "0/5", next: "--", cookie });
                continue;
            }

            try {
                const shopName = await getShopInfo(cookie, spcCds);
                const ordersToShip = await getOrdersToShip(cookie, spcCds);
                
                const res = await axios.get(`https://seller.shopee.co.id/api/v3/opt/mpsku/list/get_bumped_product_list?SPC_CDS=${spcCds}&SPC_CDS_VER=2`, { headers: getHeaders(cookie) });
                
                if (res.data.code === undefined || res.data.code !== 0) {
                    results.push({ name: shopName, status: "Expired", slots: "0/5", nextTimestamp: 0, ordersToShip: 0, cookie });
                    continue;
                }

                const d = res.data.data;
                const activeCount = d.products ? d.products.length : 0;
                
                let lowestCd = 0;
                if (activeCount > 0) {
                    lowestCd = Math.min(...d.products.map(p => p.cool_down_seconds));
                }

                results.push({
                    name: shopName,
                    status: activeCount === 5 ? "Cooldown" : "Active",
                    slots: `${activeCount}/5`,
                    nextTimestamp: lowestCd > 0 ? Date.now() + (lowestCd * 1000) : 0,
                    ordersToShip: ordersToShip,
                    cookie: cookie
                });
            } catch (e) {
                results.push({ name: "Connection Error", status: "Offline", slots: "0/5", nextTimestamp: 0, ordersToShip: 0, cookie });
            }
        }
        return results;
    } catch (err) {
        console.error("Gagal load accounts:", err);
        return [];
    }
}

// ==========================================
// FUNGSI: TAMBAH AKUN BARU KE cookies.txt
// ==========================================
async function addAccount(newCookie) {
    try {
        if (!newCookie || !newCookie.includes('SPC_CDS')) return { success: false, msg: "Cookie tidak valid!" };
        await fs.appendFile(COOKIE_FILE, `\n${newCookie.trim()}`);
        return { success: true, msg: "Akun berhasil ditambahkan!" };
    } catch (err) {
        return { success: false, msg: err.message };
    }
}

// ==========================================
// FUNGSI UTAMA: AMBIL PERFORMA PRODUK
// ==========================================
async function getProductPerformance(cookie) {
    try {
        const spcCds = cookie.match(/SPC_CDS=([^;]+)/)?.[1];
        if (!spcCds) return [];

        const shopName = await getShopInfo(cookie, spcCds);

        // Fetch bumped products
        const urlList = `https://seller.shopee.co.id/api/v3/opt/mpsku/list/get_bumped_product_list?SPC_CDS=${spcCds}&SPC_CDS_VER=2`;
        const resList = await axios.get(urlList, { headers: getHeaders(cookie) });
        if (!resList.data || resList.data.code !== 0) return [];

        const products = resList.data.data.products || [];
        if (products.length === 0) return [];

        const productIds = products.map(p => p.id).join(',');
        
        // Fetch performance
        const perfUrl = `https://seller.shopee.co.id/api/v3/opt/mpsku/list/v2/get_product_performance_info?SPC_CDS=${spcCds}&SPC_CDS_VER=2&product_ids=${productIds}&need_trend=false&need_growth_rate=false&reference_id=92dbb3d6-fad5-45e9-99c9-34b780b347b4`;
        const customHeaders = { ...getHeaders(cookie), 'Referer': 'https://seller.shopee.co.id/portal/product/list/live/all?operationSortBy=recommend_v2' };
        
        const resPerf = await axios.get(perfUrl, { headers: customHeaders });
        const perfData = resPerf.data?.data?.performance || {};

        return products.map(p => {
            const stats = perfData[p.id] || { l30d_sales: 0, l30d_impression: 0, l30d_conversion: 0 };
            return {
                id: p.id,
                name: p.name,
                image: p.image_url ? `https://cf.shopee.co.id/file/${p.image_url}` : '',
                shopName: shopName,
                views: stats.l30d_impression || 0,
                sales: stats.l30d_sales || 0,
                conversion: stats.l30d_conversion || 0,
                cooldown: p.cool_down_seconds
            };
        });
    } catch (e) {
        console.error("Error getProductPerformance", e);
        return [];
    }
}

// ==========================================
// FITUR AUTO-BOOST (DARI index.js)
// ==========================================

function getSpcCds(cookie) {
    const match = cookie.match(/SPC_CDS=([^;]+)/);
    return match ? match[1] : null;
}

async function fetchBumpedSlots(cookie, spcCds) {
    const url = `https://seller.shopee.co.id/api/v3/opt/mpsku/list/get_bumped_product_list?SPC_CDS=${spcCds}&SPC_CDS_VER=2`;
    const res = await axios.get(url, { headers: getHeaders(cookie) });
    if (res.data.code === undefined) throw new Error('Cookie tidak valid atau sudah expired');
    if (res.data.code !== 0) throw new Error(res.data.user_message || 'Gagal mengambil info slot boost');
    
    const config = res.data.data.config || { total_slots: 5, cooldown_seconds: 14400 };
    const activeProducts = res.data.data.products || [];
    let lowestCooldown = config.cooldown_seconds;
    if (activeProducts.length > 0) lowestCooldown = Math.min(...activeProducts.map(p => p.cool_down_seconds));

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
    if (res.data.code !== 0) throw new Error('Gagal mengambil daftar produk');
    return res.data.data.products ? res.data.data.products.map(p => ({ id: p.id, name: p.name })) : [];
}

async function fetchBoostInfo(cookie, spcCds, productIds) {
    if (!productIds || productIds.length === 0) return {};
    const idList = productIds.join(',');
    const url = `https://seller.shopee.co.id/api/v3/opt/mpsku/list/get_boost_info?SPC_CDS=${spcCds}&SPC_CDS_VER=2&product_id_list=${idList}`;
    const res = await axios.get(url, { headers: getHeaders(cookie) });
    if (res.data.code !== 0) throw new Error('Gagal mengambil status boost');
    return res.data.data.boost_infos || {};
}

async function doBoostProduct(cookie, spcCds, productId) {
    const url = `https://seller.shopee.co.id/api/v3/opt/product/boost_product/?version=3.1.0&SPC_CDS=${spcCds}&SPC_CDS_VER=2`;
    const res = await axios.post(url, { id: productId }, { headers: getHeaders(cookie) });
    if (res.data.code === 0) return true;
    throw new Error(res.data.user_message || `ErrorCode:${res.data.code}`);
}

async function processAccountBot(cookie, index) {
    if (!isBotRunning) return DEFAULT_COOLDOWN;

    const spcCds = getSpcCds(cookie);
    if (!spcCds) {
        botLog(`[Akun ${index + 1}] Gagal: SPC_CDS tidak ditemukan.`, 'error');
        return DEFAULT_COOLDOWN;
    }

    const shopName = await getShopInfo(cookie, spcCds);
    botLog(`Menganalisa Toko: ${shopName}`, 'info');

    try {
        const slotsInfo = await fetchBumpedSlots(cookie, spcCds);
        if (slotsInfo.availableSlots <= 0) {
            botLog(`[${shopName}] Slot penuh (5/5). Cooldown: ${formatSeconds(slotsInfo.lowestCooldownSeconds)}`, 'warning');
            return slotsInfo.lowestCooldownSeconds;
        }

        const products = await fetchLiveProducts(cookie, spcCds);
        if (products.length === 0) {
            botLog(`[${shopName}] Tidak ada produk live.`, 'warning');
            return DEFAULT_COOLDOWN;
        }

        const safeProducts = products.filter(p => !slotsInfo.activeProductIds.includes(p.id));
        if (safeProducts.length === 0) {
            botLog(`[${shopName}] Semua produk sudah antre/cooldown.`, 'warning');
            return slotsInfo.lowestCooldownSeconds > 0 ? slotsInfo.lowestCooldownSeconds : DEFAULT_COOLDOWN;
        }

        const boostInfos = await fetchBoostInfo(cookie, spcCds, safeProducts.map(p => p.id));
        const availableProducts = safeProducts.filter(p => {
            const info = boostInfos[p.id];
            return info && info.disabled_boost_button === false;
        });

        if (availableProducts.length === 0) {
            botLog(`[${shopName}] Produk tersisa belum bisa diboost.`, 'warning');
            return slotsInfo.lowestCooldownSeconds > 0 ? slotsInfo.lowestCooldownSeconds : DEFAULT_COOLDOWN;
        }

        let limitToBoost = Math.min(slotsInfo.availableSlots, availableProducts.length);
        botLog(`[${shopName}] Memulai boost untuk ${limitToBoost} produk...`, 'info');
        
        let successCount = 0;
        for (let i = 0; i < limitToBoost; i++) {
            if (!isBotRunning) return DEFAULT_COOLDOWN;
            const targetProduct = availableProducts[i];
            
            try {
                await doBoostProduct(cookie, spcCds, targetProduct.id);
                botLog(`[${shopName}] Berhasil boost: ${targetProduct.name.substring(0, 30)}...`, 'success');
                await addHistory(shopName, targetProduct.name, 'Success');
                successCount++;
                if (i < limitToBoost - 1) await delay(3000);
            } catch (err) {
                botLog(`[${shopName}] Gagal: ${err.message}`, 'error');
                await addHistory(shopName, targetProduct.name, 'Failed');
            }
        }

        botLog(`[${shopName}] Selesai! Berhasil boost ${successCount} produk.`, 'success');
        const postCheck = await fetchBumpedSlots(cookie, spcCds);
        return postCheck.lowestCooldownSeconds > 0 ? postCheck.lowestCooldownSeconds : DEFAULT_COOLDOWN;
    } catch (err) {
        botLog(`[${shopName}] Error: ${err.message}`, 'error');
        return DEFAULT_COOLDOWN;
    }
}

async function executeCycle(cookies) {
    if (!isBotRunning) return;
    botLog('🔄 Memulai siklus auto-boost baru...', 'info');
    
    let globalLowestWaitSeconds = DEFAULT_COOLDOWN;

    for (let i = 0; i < cookies.length; i++) {
        if (!isBotRunning) break;
        const wait = await processAccountBot(cookies[i], i);
        if (wait < globalLowestWaitSeconds) {
            globalLowestWaitSeconds = wait;
        }
        if (i < cookies.length - 1 && isBotRunning) {
            botLog('Berpindah ke akun berikutnya...', 'info');
            await delay(3000);
        }
    }

    if (!isBotRunning) return;

    let nextRunSeconds = globalLowestWaitSeconds + 15;
    if (nextRunSeconds < 60) nextRunSeconds = 60;
    
    startCountdown(nextRunSeconds, cookies);
}

function startCountdown(durationInSeconds, cookies) {
    let remaining = Math.floor(durationInSeconds);
    botLog(`💤 Menunggu cooldown... Siklus selanjutnya: ${formatSeconds(remaining)}`, 'warning');

    if (botCountdownInterval) clearInterval(botCountdownInterval);
    
    botCountdownInterval = setInterval(() => {
        if (!isBotRunning) {
            clearInterval(botCountdownInterval);
            return;
        }
        if (remaining <= 0) {
            clearInterval(botCountdownInterval);
            botLog('⏱️ Cooldown selesai! Menjalankan kembali...', 'success');
            executeCycle(cookies);
            return;
        }
        
        // Optional: Update UI countdown (setiap 5 detik)
        if (remaining % 5 === 0 && logCallback) {
            logCallback({ type: 'countdown', remaining });
        }
        
        remaining--;
    }, 1000);
}

// Controller
async function startBot(cb) {
    if (isBotRunning) return { success: false, msg: 'Bot sudah berjalan.' };
    
    logCallback = cb;
    isBotRunning = true;
    botLog('🚀 Sistem Auto-Boost Diaktifkan!', 'success');
    botLog(`📂 Jalur File Akun: ${COOKIE_FILE}`, 'info');
    
    if (!fs.existsSync(COOKIE_FILE)) {
        botLog('File cookies.txt tidak ditemukan!', 'error');
        isBotRunning = false;
        return { success: false };
    }

    const data = await fs.readFile(COOKIE_FILE, 'utf-8');
    const cookies = data.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'));
    
    if (cookies.length === 0) {
        botLog('Tidak ada akun (cookies kosong).', 'error');
        isBotRunning = false;
        return { success: false };
    }

    // Refresh UI table via logCallback special event
    if(logCallback) logCallback({ type: 'refresh_ui' });
    
    executeCycle(cookies);
    return { success: true };
}

function stopBot() {
    isBotRunning = false;
    if (botCountdownInterval) clearInterval(botCountdownInterval);
    if (logCallback) {
        botLog('⏹️ Sistem Auto-Boost Dihentikan oleh Pengguna.', 'warning');
    }
    return { success: true };
}

module.exports = { 
    getAllAccountsStatus,
    getProductPerformance,
    addAccount,
    startBot,
    stopBot,
    getStats
};