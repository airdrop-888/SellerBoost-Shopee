/**
 * Generate icon.ico for electron-builder (Windows)
 * ICO format: contains multiple sizes (16x16, 32x32, 48x48, 256x256)
 * Also generates icon.png for tray
 */

const fs = require('fs');
const zlib = require('zlib');

// ==========================================
// PNG GENERATOR
// ==========================================
function createPNG(width, height, getColor) {
    function crc32(buf) {
        let crc = -1;
        for (let i = 0; i < buf.length; i++) {
            crc ^= buf[i];
            for (let j = 0; j < 8; j++)
                crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0);
        }
        return (crc ^ -1) >>> 0;
    }

    function chunk(type, data) {
        const t = Buffer.from(type);
        const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
        const crcBuf = Buffer.alloc(4);
        crcBuf.writeUInt32BE(crc32(Buffer.concat([t, data])));
        return Buffer.concat([len, t, data, crcBuf]);
    }

    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(width, 0);
    ihdr.writeUInt32BE(height, 4);
    ihdr[8] = 8; ihdr[9] = 6; // RGBA

    const raw = Buffer.alloc(height * (1 + width * 4));
    for (let y = 0; y < height; y++) {
        raw[y * (1 + width * 4)] = 0;
        for (let x = 0; x < width; x++) {
            const [r, g, b, a] = getColor(x, y, width, height);
            const i = y * (1 + width * 4) + 1 + x * 4;
            raw[i] = r; raw[i+1] = g; raw[i+2] = b; raw[i+3] = a;
        }
    }

    const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
    return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
}

// ==========================================
// PIXEL COLOR FUNCTION (Shopee orange circle)
// ==========================================
function getPixelColor(x, y, w, h) {
    const cx = x - w / 2 + 0.5;
    const cy = y - h / 2 + 0.5;
    const dist = Math.sqrt(cx * cx + cy * cy);
    const radius = w / 2 - 0.5;
    const innerR = radius * 0.55;

    // Outer circle - Shopee orange
    if (dist < radius - 1) {
        // Inner darker circle
        if (dist < innerR) {
            // Draw "S" letter in white
            const nx = (x / w) - 0.5; // normalize -0.5 to 0.5
            const ny = (y / h) - 0.5;

            // Simple "S" shape using bezier-like segments
            const inS = (
                // Top bar of S
                (ny >= -0.25 && ny <= -0.15 && nx >= -0.12 && nx <= 0.15) ||
                // Top-left curve
                (ny >= -0.25 && ny <= 0.0 && nx >= -0.15 && nx <= -0.05) ||
                // Middle bar
                (ny >= -0.05 && ny <= 0.05 && nx >= -0.12 && nx <= 0.12) ||
                // Bottom-right curve
                (ny >= 0.0 && ny <= 0.25 && nx >= 0.05 && nx <= 0.15) ||
                // Bottom bar
                (ny >= 0.15 && ny <= 0.25 && nx >= -0.15 && nx <= 0.12)
            );

            if (inS) return [255, 255, 255, 255]; // white S
            return [200, 55, 10, 255]; // darker orange center
        }
        return [241, 88, 44, 255]; // Shopee orange
    }

    // Anti-alias edge
    if (dist < radius + 0.5) {
        const alpha = Math.round(255 * Math.max(0, radius - dist + 0.5));
        return [241, 88, 44, alpha];
    }

    return [0, 0, 0, 0]; // transparent
}

// ==========================================
// GENERATE PNG FILES
// ==========================================
const sizes = [16, 32, 48, 256];
const pngBuffers = {};

for (const size of sizes) {
    pngBuffers[size] = createPNG(size, size, getPixelColor);
}

// Save tray icon (16x16 png)
fs.writeFileSync('./src/icon.png', pngBuffers[16]);
console.log('✅ src/icon.png generated (16x16)');

// Save 256x256 for reference
fs.writeFileSync('./src/icon-256.png', pngBuffers[256]);
console.log('✅ src/icon-256.png generated (256x256)');

// ==========================================
// BUILD ICO (multi-size)
// ==========================================
// ICO format: header + directory + image data
// Each PNG image embedded as PNG inside ICO (modern format)

const icoSizes = [16, 32, 48, 256];
const images = icoSizes.map(s => pngBuffers[s]);

const ICONDIR_SIZE = 6;
const ICONDIRENTRY_SIZE = 16;
const headerSize = ICONDIR_SIZE + ICONDIRENTRY_SIZE * icoSizes.length;

// Calculate offsets
let offset = headerSize;
const offsets = [];
for (const img of images) {
    offsets.push(offset);
    offset += img.length;
}

const totalSize = offset;
const ico = Buffer.alloc(totalSize);

// ICONDIR header
ico.writeUInt16LE(0, 0);       // reserved
ico.writeUInt16LE(1, 2);       // type: 1 = ICO
ico.writeUInt16LE(icoSizes.length, 4); // count

// ICONDIRENTRY for each image
for (let i = 0; i < icoSizes.length; i++) {
    const size = icoSizes[i];
    const base = ICONDIR_SIZE + i * ICONDIRENTRY_SIZE;
    ico.writeUInt8(size === 256 ? 0 : size, base);     // width (0 = 256)
    ico.writeUInt8(size === 256 ? 0 : size, base + 1); // height
    ico.writeUInt8(0, base + 2);   // color count
    ico.writeUInt8(0, base + 3);   // reserved
    ico.writeUInt16LE(1, base + 4); // planes
    ico.writeUInt16LE(32, base + 6); // bit count
    ico.writeUInt32LE(images[i].length, base + 8);  // size of image data
    ico.writeUInt32LE(offsets[i], base + 12); // offset of image data
}

// Write image data
for (let i = 0; i < images.length; i++) {
    images[i].copy(ico, offsets[i]);
}

fs.writeFileSync('./build/icon.ico', ico);
console.log('✅ build/icon.ico generated (' + icoSizes.join('x, ') + 'x px, ' + ico.length + ' bytes)');
console.log('\nDone! Ready to build with electron-builder.');
