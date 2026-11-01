/**
 * Renders the Open Graph image (1200×630): the Groove eye with the headline on --ink.
 * Writes src/app/opengraph-image.png and twitter-image.png. Needs Google Chrome and a
 * network connection (fonts come from Google Fonts at render time only).
 * Run: npm run og
 */
import { execFileSync } from "node:child_process";
import { copyFileSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { eyeSvgMarkup } from "../src/components/brand/eyeGeometry.ts";

const CHROME = process.env.CHROME ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const dir = mkdtempSync(join(tmpdir(), "groove-og-"));
const html = join(dir, "og.html");
const png = join(dir, "og.png");

writeFileSync(
  html,
  `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&family=JetBrains+Mono:wght@400&display=block">
<style>
  html,body{margin:0;width:1200px;height:630px;background:#07070A;overflow:hidden}
  .rings{position:absolute;inset:0;background:repeating-radial-gradient(circle at 78% 56%,transparent 0 7px,rgb(255 255 255/.03) 7px 8px);-webkit-mask-image:radial-gradient(circle at 78% 56%,#000 0 26%,transparent 62%)}
  .mono{font-family:"JetBrains Mono",monospace;font-size:17px;letter-spacing:.1em;text-transform:uppercase;color:#9A958A}
  .word{position:absolute;left:72px;top:64px;font-family:Archivo;font-weight:900;font-stretch:125%;font-size:26px;letter-spacing:.07em;color:#EDE8DD}
  .eyebrow{position:absolute;left:72px;top:206px}
  h1{position:absolute;left:68px;top:236px;margin:0;font-family:Archivo;font-weight:900;font-stretch:125%;font-size:96px;line-height:.9;letter-spacing:-.035em;color:#EDE8DD}
  .eye{position:absolute;right:40px;top:206px;width:440px}
  .foot{position:absolute;left:72px;bottom:58px}
  .dot{display:inline-block;width:10px;height:10px;border-radius:50%;background:#FF3B2F;margin-right:12px;vertical-align:1px}
</style></head><body>
<div class="rings"></div>
<div class="word">GROOVE</div>
<div class="eyebrow mono">Independent AI label · Robinhood Chain · Solana</div>
<h1>Sign talent<br>that never<br>sleeps.</h1>
<div class="eye">${eyeSvgMarkup()}</div>
<div class="foot mono"><span class="dot"></span>Sign once. It never leaves the groove.</div>
</body></html>`,
);

execFileSync(CHROME, [
  "--headless=new",
  "--hide-scrollbars",
  "--window-size=1200,630",
  "--virtual-time-budget=6000",
  `--screenshot=${png}`,
  `file://${html}`,
], { stdio: "ignore" });

const app = fileURLToPath(new URL("../src/app/", import.meta.url));
copyFileSync(png, join(app, "opengraph-image.png"));
copyFileSync(png, join(app, "twitter-image.png"));
writeFileSync(join(app, "opengraph-image.alt.txt"), "Groove: Sign talent that never sleeps. The Groove eye, a record for an iris.");
writeFileSync(join(app, "twitter-image.alt.txt"), "Groove: Sign talent that never sleeps. The Groove eye, a record for an iris.");
console.log("wrote src/app/opengraph-image.png and twitter-image.png");
