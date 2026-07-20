import { Resvg } from "@resvg/resvg-js";
import { writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const OUT_PATH = resolve(root, "public/og-card.png");

const W = 1200;
const H = 630;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="#0a0a0a"/>
  <rect x="${(W - 280) / 2}" y="${(H - 280) / 2}" width="280" height="280" rx="48" fill="#111111" stroke="#1f1f1f" stroke-width="1"/>
  <text x="${W / 2}" y="${H / 2 + 50}" text-anchor="middle" font-family="Arial" font-size="148" fill="#fafafa">JN</text>
</svg>`;

const resvg = new Resvg(svg, {
  font: {
    loadSystemFonts: true,
    defaultFontFamily: "Segoe UI",
  },
});

const png = resvg.render().asPng();
writeFileSync(OUT_PATH, png);
console.log(`wrote ${OUT_PATH} (${png.length} bytes)`);
