const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const botCore = require('./bot-core');

// Fix GPU error: Disable GPU acceleration
app.disableHardwareAcceleration();
app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('disable-gpu-compositing');
app.commandLine.appendSwitch('disable-software-rasterizer');

let mainWindow;

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
        // icon: path.join(__dirname, 'icon.ico')
    });

    mainWindow.loadFile(path.join(__dirname, 'index.html'));
    
    // Show window when ready to avoid white flash
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });
}

app.whenReady().then(createWindow);

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

app.on('window-all-closed', () => {
    // Pastikan bot mati jika aplikasi di-close
    botCore.stopBot();
    if (process.platform !== 'darwin') app.quit();
});