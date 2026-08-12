import sharp from 'sharp'
import { copyFile, readFile } from 'node:fs/promises'

const fav = 'public/favicon.svg'

await copyFile(fav, 'public/logo.svg')

await sharp(fav).resize(180, 180).png().toFile('public/apple-touch-icon.png')
await sharp(fav).resize(32, 32).png().toFile('public/favicon-32x32.png')
await sharp(fav).resize(192, 192).png().toFile('public/icon-192.png')
await sharp(fav).resize(512, 512).png().toFile('public/icon-512.png')

const mark = await readFile(fav, 'utf8')
const markBody = mark
  .replace(/<\?xml[^>]*>/, '')
  .replace(/<svg[^>]*>/, '')
  .replace(/<\/svg>/, '')
  .replace(/<title[\s\S]*?<\/title>/, '')
  .replace(/<desc[\s\S]*?<\/desc>/, '')

const ogSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#050505"/>
  <polygon points="0,0 520,0 420,220 0,180" fill="#141414"/>
  <polygon points="520,0 1200,0 1200,200 700,140" fill="#101010"/>
  <polygon points="0,180 420,220 360,430 0,500" fill="#1A1A1A"/>
  <polygon points="700,140 1200,200 1200,420 780,360" fill="#121212"/>
  <polygon points="360,430 780,360 1200,420 1200,630 0,630 0,500" fill="#0C0C0C"/>
  <polygon points="780,160 980,120 1100,280 900,320" fill="#C41E2A"/>
  <polygon points="900,320 1100,280 1200,360 1040,420" fill="#E02430" opacity="0.85"/>
  <polygon points="620,280 780,360 700,480 540,420" fill="#8B1520" opacity="0.55"/>

  <g transform="translate(120 155) scale(0.625)">
    ${markBody}
  </g>

  <text x="490" y="300" fill="#FFFFFF" font-family="Arial Black, Arial, Helvetica, sans-serif" font-size="92" font-weight="800" letter-spacing="4">phptrash</text>
  <text x="490" y="360" fill="#A0A0A0" font-family="Arial, Helvetica, sans-serif" font-size="28" letter-spacing="2">fullstack · PHP · Laravel · Vue</text>
  <rect x="490" y="390" width="72" height="6" rx="3" fill="#E02430"/>
</svg>`

await sharp(Buffer.from(ogSvg)).jpeg({ quality: 90, mozjpeg: true }).toFile('public/og.jpg')

console.log('brand assets generated')
