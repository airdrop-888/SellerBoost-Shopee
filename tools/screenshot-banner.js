// Render docs/assets/banner.html menjadi docs/assets/banner.png
// Resolusi output mengikuti scaling Windows (1x/1.25x/1.5x), viewport CSS dipaksa 1600x533.
// Jalankan: npx electron tools/screenshot-banner.js

const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

app.disableHardwareAcceleration();

const W = 1600;
const H = 533;

function fail(err) {
  console.error('[banner]', err && err.stack ? err.stack : err);
  app.exit(1);
}

app.whenReady().then(async () => {
  const outPath = path.join(__dirname, '..', 'docs', 'assets', 'banner.png');
  const srcPath = path.join(__dirname, '..', 'docs', 'assets', 'banner.html');

  const win = new BrowserWindow({
    width: W,
    height: H,
    show: true,
    frame: false,
    useContentSize: true,
    backgroundColor: '#080A0F',
    webPreferences: { nodeIntegration: false }
  });

  await win.loadFile(srcPath);

  // Sesuaikan ukuran window supaya viewport CSS tepat W x H (kompensasi display scaling)
  for (let i = 0; i < 4; i++) {
    const { innerWidth, innerHeight } = await win.webContents.executeJavaScript(
      '({ innerWidth: window.innerWidth, innerHeight: window.innerHeight })'
    );
    const fx = W / innerWidth;
    const fy = H / innerHeight;
    if (Math.abs(fx - 1) < 0.005 && Math.abs(fy - 1) < 0.005) break;
    const [cw, ch] = win.getContentSize();
    win.setContentSize(Math.round(cw * fx), Math.round(ch * fy));
    await new Promise(r => setTimeout(r, 350));
  }

  await new Promise(r => setTimeout(r, 700));

  const image = await win.webContents.capturePage();
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, image.toPNG());

  const size = image.getSize();
  const dpr = await win.webContents.executeJavaScript('window.devicePixelRatio');
  const vp = await win.webContents.executeJavaScript(
    '({ w: window.innerWidth, h: window.innerHeight })'
  );
  console.log(`saved ${outPath} (${size.width}x${size.height}) dpr=${dpr} viewport=${vp.w}x${vp.h}`);

  app.exit(0);
}).catch(fail);
