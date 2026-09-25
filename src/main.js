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

// Prevent app from quitting when window closed
app.on('window-all-closed', (e) => {
    // Pastikan bot mati jika aplikasi di-close
    botCore.stopBot();
    e.preventDefault(); // Don't quit, keep running in background
    if (process.platform !== 'darwin') {
        // On Windows/Linux, keep app running in tray
    }
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
    
    // Show window when ready to avoid white flash
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
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
    // Load tray icon
    const iconPath = path.join(__dirname, 'icon.png');
    const icon = nativeImage.createFromPath(iconPath);
    
    tray = new Tray(icon.resize({ width: 16, height: 16 }));
    tray.setToolTip('SellerBoost - Auto Product Boost');
    
    const contextMenu = Menu.buildFromTemplate([
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
            click: () => {
                app.isQuitting = true;
                botCore.stopBot();
                if (tray) tray.destroy();
                app.quit();
            }
        }
    ]);
    
    tray.setContextMenu(contextMenu);
    
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

app.whenReady().then(() => {
    createWindow();
    createTray();
    
    app.on('activate', () => {
        // On macOS, re-create window when dock icon clicked
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

// START/STOP BOT EVENTS
ipcMain.handle('start-auto-boost', async (event) => {
    return await botCore.startBot((logData) => {
        // Kirim log ke renderer process (index.html)
        if (mainWindow) {
            mainWindow.webContents.send('bot-log', logData);
        }
    });
});

ipcMain.handle('stop-auto-boost', async () => {
    return botCore.stopBot();
});

// Tray IPC: trigger quit from renderer (optional)
ipcMain.handle('quit-app', () => {
    app.isQuitting = true;
    botCore.stopBot();
    if (tray) tray.destroy();
    app.quit();
});