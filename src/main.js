const { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const https = require('https');
const { spawn } = require('child_process');
const botCore = require('./bot-core');

// ==========================================
// AUTO-UPDATER (GitHub Releases)
// ==========================================
const GITHUB_OWNER = 'airdrop-888';
const GITHUB_REPO  = 'SellerBoost-Shopee';
const CURRENT_VERSION = app.getVersion(); // dari package.json

async function checkForUpdates() {
    try {
        const axios = require('axios');
        const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/releases/latest`;
        const res = await axios.get(url, {
            headers: { 'User-Agent': 'SellerBoost-App', 'Accept': 'application/vnd.github.v3+json' },
            timeout: 8000
        });
        const latest = res.data;
        const latestVersion = (latest.tag_name || '').replace(/^v/, '');
        if (!latestVersion) return null;

        // Bandingkan versi (semver sederhana)
        if (isNewerVersion(latestVersion, CURRENT_VERSION)) {
            // Cari asset .exe installer
            const asset = (latest.assets || []).find(a =>
                a.name.toLowerCase().endsWith('.exe') && a.name.toLowerCase().includes('setup')
            ) || (latest.assets || [])[0];

            return {
                version: latestVersion,
                notes: latest.body || '',
                downloadUrl: asset ? asset.browser_download_url : latest.html_url,
                htmlUrl: latest.html_url,
                hasDirectDownload: !!(asset)
            };
        }
        return null; // sudah versi terbaru
    } catch (e) {
        console.log('[Updater] Gagal cek update:', e.message);
        return null;
    }
}

function isNewerVersion(latest, current) {
    const parse = v => v.split('.').map(n => parseInt(n) || 0);
    const [la, lb, lc] = parse(latest);
    const [ca, cb, cc] = parse(current);
    if (la !== ca) return la > ca;
    if (lb !== cb) return lb > cb;
    return lc > cc;
}

async function downloadAndInstall(downloadUrl, version) {
    return new Promise((resolve, reject) => {
        const tmpPath = path.join(app.getPath('temp'), `SellerBoost-Setup-${version}.exe`);
        const file = fs.createWriteStream(tmpPath);
        let totalBytes = 0;
        let receivedBytes = 0;

        function doRequest(url, redirectCount = 0) {
            if (redirectCount > 5) return reject(new Error('Too many redirects'));
            const proto = url.startsWith('https') ? https : require('http');
            proto.get(url, { headers: { 'User-Agent': 'SellerBoost-App' } }, res => {
                // Handle redirect
                if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307 || res.statusCode === 308) {
                    return doRequest(res.headers.location, redirectCount + 1);
                }
                if (res.statusCode !== 200) {
                    return reject(new Error(`HTTP ${res.statusCode}`));
                }
                totalBytes = parseInt(res.headers['content-length'] || '0');
                res.on('data', chunk => {
                    receivedBytes += chunk.length;
                    if (mainWindow && totalBytes > 0) {
                        const pct = Math.round((receivedBytes / totalBytes) * 100);
                        mainWindow.webContents.send('update-progress', { percent: pct, received: receivedBytes, total: totalBytes });
                    }
                });
                res.pipe(file);
                file.on('finish', () => {
                    file.close(() => resolve(tmpPath));
                });
            }).on('error', err => {
                fs.unlink(tmpPath, () => {});
                reject(err);
            });
        }
        doRequest(downloadUrl);
    });
}

// Fix GPU error: Disable GPU acceleration
app.disableHardwareAcceleration();
app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('disable-gpu-compositing');
app.commandLine.appendSwitch('disable-software-rasterizer');

let mainWindow;
let tray;

// Deteksi apakah app diluncurkan dari Windows Startup (--autostart flag)
const isAutoStart = process.argv.includes('--autostart');

// Prevent app from quitting when window closed
app.on('window-all-closed', (e) => {
    // Jangan quit - tetap jalan di background (tray)
    e.preventDefault();
});

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 850,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        autoHideMenuBar: true,
        title: "SellerBoost - Dashboard",
        show: false, // Hide until ready-to-show for smoother startup
        icon: path.join(__dirname, 'icon.png')
    });

    mainWindow.loadFile(path.join(__dirname, 'index.html'));
    
    // Show window when ready (hanya kalau bukan auto-start, atau user buka dari tray)
    mainWindow.once('ready-to-show', () => {
        if (!isAutoStart) {
            mainWindow.show();
        }
        // Kirim status bot ke UI begitu window siap
        mainWindow.webContents.once('did-finish-load', async () => {
            const cfg = await botCore.getConfig();
            mainWindow.webContents.send('startup-config', cfg);
        });
    });

    // Close button (❌) = minimize to tray, not quit
    mainWindow.on('close', (e) => {
        if (!app.isQuitting) {
            e.preventDefault();
            mainWindow.hide();
        }
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

function createTray() {
    const iconPath = path.join(__dirname, 'icon.png');
    const icon = nativeImage.createFromPath(iconPath);
    
    tray = new Tray(icon.resize({ width: 16, height: 16 }));
    tray.setToolTip('SellerBoost - Auto Product Boost');
    
    const buildContextMenu = () => Menu.buildFromTemplate([
        {
            label: 'Buka Dashboard',
            click: () => {
                if (mainWindow) {
                    mainWindow.show();
                    mainWindow.focus();
                } else {
                    createWindow();
                }
            }
        },
        {
            label: 'Sembunyikan',
            click: () => {
                if (mainWindow) mainWindow.hide();
            }
        },
        { type: 'separator' },
        {
            label: 'Keluar',
            click: async () => {
                app.isQuitting = true;
                await botCore.stopBot();
                if (tray) tray.destroy();
                app.quit();
            }
        }
    ]);
    
    tray.setContextMenu(buildContextMenu());
    
    // Click tray icon = toggle window
    tray.on('click', () => {
        if (mainWindow) {
            if (mainWindow.isVisible()) {
                mainWindow.hide();
            } else {
                mainWindow.show();
                mainWindow.focus();
            }
        } else {
            createWindow();
        }
    });
}

// ==========================================
// AUTO-RESUME BOT DI BACKGROUND
// ==========================================
async function autoResumeBot() {
    const cfg = await botCore.getConfig();
    // Hanya auto-resume jika fitur diaktifkan dan bot sebelumnya sedang running
    if (cfg.autoResume && cfg.wasRunning) {
        console.log('[SellerBoost] Auto-resume bot di background...');
        await botCore.startBot((logData) => {
            // Kirim log ke UI kalau window terbuka
            if (mainWindow && mainWindow.webContents) {
                mainWindow.webContents.send('bot-log', logData);
            }
        });
        // Update tooltip tray
        if (tray) tray.setToolTip('SellerBoost - Bot Aktif 🟢');
    }
}

app.whenReady().then(async () => {
    createWindow();
    createTray();
    
    // Jalankan auto-resume setelah app siap
    await autoResumeBot();
    
    // Cek update 3 detik setelah app siap (biar UI udah loaded)
    setTimeout(async () => {
        const updateInfo = await checkForUpdates();
        if (updateInfo && mainWindow) {
            mainWindow.webContents.send('update-available', updateInfo);
        }
    }, 3000);
    
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// ==========================================
// IPC HANDLERS (Jembatan UI ke Logic)
// ==========================================

ipcMain.handle('get-all-accounts', async () => {
    return await botCore.getAllAccountsStatus();
});

ipcMain.handle('add-new-account', async (event, cookie) => {
    return await botCore.addAccount(cookie);
});

ipcMain.handle('delete-account', async (event, cookie) => {
    return await botCore.deleteAccount(cookie);
});

// STATS & HISTORY
ipcMain.handle('get-stats', async () => {
    return await botCore.getStats();
});

// PRODUCTS PERFORMANCE
ipcMain.handle('get-products-performance', async (event, cookie) => {
    return await botCore.getProductPerformance(cookie);
});

// ALL PRODUCTS (new Products page)
ipcMain.handle('get-all-products', async (event, cookie) => {
    return await botCore.getAllProducts(cookie);
});

// ORDERS DETAIL (new Orders page)
ipcMain.handle('get-orders-detail', async (event, cookie) => {
    return await botCore.getOrdersDetail(cookie);
});

// REVENUE SUMMARY (new Analytics feature)
ipcMain.handle('get-revenue-summary', async (event, cookie) => {
    return await botCore.getRevenueSummary(cookie);
});

// START/STOP BOT EVENTS
ipcMain.handle('start-auto-boost', async (event) => {
    return await botCore.startBot((logData) => {
        if (mainWindow) {
            mainWindow.webContents.send('bot-log', logData);
        }
    });
});

ipcMain.handle('stop-auto-boost', async () => {
    return await botCore.stopBot();
});

// ==========================================
// CONFIG IPC: Windows Startup + Auto-Resume
// ==========================================

// Ambil config dari UI
ipcMain.handle('get-config', async () => {
    return await botCore.getConfig();
});

// Simpan config dari UI
ipcMain.handle('save-config', async (event, updates) => {
    const cfg = await botCore.saveConfig(updates);
    
    // Terapkan setting Windows Startup
    if ('runOnStartup' in updates) {
        const exePath = process.execPath;
        app.setLoginItemSettings({
            openAtLogin: updates.runOnStartup,
            // Tambahkan --autostart flag agar app tahu ini dari startup
            args: updates.runOnStartup ? ['--autostart'] : []
        });
    }
    
    return cfg;
});

// Baca status Windows Startup aktual dari registry
ipcMain.handle('get-startup-status', async () => {
    const settings = app.getLoginItemSettings({
        args: ['--autostart']
    });
    return { openAtLogin: settings.openAtLogin };
});

// Tray IPC: trigger quit from renderer (optional)
ipcMain.handle('quit-app', async () => {
    app.isQuitting = true;
    await botCore.stopBot();
    if (tray) tray.destroy();
    app.quit();
});

// ==========================================
// UPDATE IPC HANDLERS
// ==========================================

// Manual check dari UI
ipcMain.handle('check-for-updates', async () => {
    return await checkForUpdates();
});

// Download + install update
ipcMain.handle('download-and-install', async (event, { downloadUrl, version, htmlUrl, hasDirectDownload }) => {
    try {
        if (!hasDirectDownload) {
            // Fallback: buka browser ke halaman releases
            shell.openExternal(htmlUrl);
            return { success: true, fallback: true };
        }

        if (mainWindow) mainWindow.webContents.send('update-progress', { percent: 0, status: 'downloading' });

        const installerPath = await downloadAndInstall(downloadUrl, version);

        if (mainWindow) mainWindow.webContents.send('update-progress', { percent: 100, status: 'launching' });

        // Jalankan installer, lalu quit
        setTimeout(async () => {
            spawn(installerPath, [], { detached: true, stdio: 'ignore' }).unref();
            app.isQuitting = true;
            await botCore.stopBot();
            if (tray) tray.destroy();
            app.quit();
        }, 500);

        return { success: true };
    } catch (e) {
        console.error('[Updater] Download gagal:', e.message);
        // Fallback ke browser jika download gagal
        shell.openExternal(htmlUrl);
        return { success: false, error: e.message, fallback: true };
    }
});

// Dismiss update (jangan tampilkan lagi untuk versi ini)
ipcMain.handle('dismiss-update', (event, version) => {
    // Simpan versi yang di-skip ke config
    botCore.saveConfig({ skippedVersion: version });
    return true;
});