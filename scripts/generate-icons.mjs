import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '..', 'public');

function createIconSVG(size) {
  // Scale factor relative to 512
  const s = size / 512;

  // Book/journal dimensions
  const bookW = 220 * s;
  const bookH = 280 * s;
  const bookX = (size - bookW) / 2;
  const bookY = (size - bookH) / 2;
  const bookR = 16 * s;

  // Spine
  const spineW = 24 * s;

  // Lines on the page
  const lineStartX = bookX + spineW + 30 * s;
  const lineGap = 42 * s;
  const lineY1 = bookY + 65 * s;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#5b4dc7"/>
      <stop offset="50%" stop-color="#7c6ef0"/>
      <stop offset="100%" stop-color="#475569"/>
    </linearGradient>
  </defs>
  <!-- Full-bleed background - no rounded corners, no transparency -->
  <rect width="${size}" height="${size}" fill="url(#bg)"/>

  <!-- Book body (white, slightly transparent) -->
  <rect x="${bookX}" y="${bookY}" width="${bookW}" height="${bookH}" rx="${bookR}" fill="white" opacity="0.95"/>

  <!-- Book spine -->
  <rect x="${bookX}" y="${bookY}" width="${spineW}" height="${bookH}" rx="${bookR}" fill="white" opacity="0.7"/>
  <rect x="${bookX + spineW * 0.5}" y="${bookY}" width="${spineW * 0.5}" height="${bookH}" fill="white" opacity="0.85"/>

  <!-- Spine accent line -->
  <line x1="${bookX + spineW + 4 * s}" y1="${bookY + 20 * s}" x2="${bookX + spineW + 4 * s}" y2="${bookY + bookH - 20 * s}" stroke="#7c6ef0" stroke-width="${3 * s}" stroke-linecap="round" opacity="0.3"/>

  <!-- Text lines -->
  <line x1="${lineStartX}" y1="${lineY1}" x2="${bookX + bookW - 30 * s}" y2="${lineY1}" stroke="#7c6ef0" stroke-width="${4 * s}" stroke-linecap="round" opacity="0.6"/>
  <line x1="${lineStartX}" y1="${lineY1 + lineGap}" x2="${bookX + bookW - 55 * s}" y2="${lineY1 + lineGap}" stroke="#7c6ef0" stroke-width="${4 * s}" stroke-linecap="round" opacity="0.45"/>
  <line x1="${lineStartX}" y1="${lineY1 + lineGap * 2}" x2="${bookX + bookW - 35 * s}" y2="${lineY1 + lineGap * 2}" stroke="#7c6ef0" stroke-width="${4 * s}" stroke-linecap="round" opacity="0.35"/>
  <line x1="${lineStartX}" y1="${lineY1 + lineGap * 3}" x2="${bookX + bookW - 70 * s}" y2="${lineY1 + lineGap * 3}" stroke="#7c6ef0" stroke-width="${4 * s}" stroke-linecap="round" opacity="0.25"/>

  <!-- Small pen/pencil accent in bottom right area -->
  <g transform="translate(${size * 0.62}, ${size * 0.62}) rotate(-45)">
    <rect x="0" y="0" width="${8 * s}" height="${50 * s}" rx="${4 * s}" fill="#a594ff" opacity="0.7"/>
    <polygon points="${-1 * s},${50 * s} ${9 * s},${50 * s} ${4 * s},${62 * s}" fill="#a594ff" opacity="0.7"/>
  </g>
</svg>`;
}

async function generateIcon(size) {
  const svg = createIconSVG(size);
  const outputPath = path.join(publicDir, `icon-${size}.png`);

  await sharp(Buffer.from(svg))
    .resize(size, size)
    .png()
    .toFile(outputPath);

  console.log(`Generated icon-${size}.png`);
}

async function main() {
  await generateIcon(192);
  await generateIcon(512);
  console.log('Done!');
}

main().catch(console.error);
