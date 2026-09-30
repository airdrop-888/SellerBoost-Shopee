const { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage } = require('electron');
const path = require('path');
const botCore = require('./bot-core');

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