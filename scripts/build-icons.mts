/**
 * Writes src/app/icon.svg (the favicon) from the eye geometry, so the favicon can never
 * drift from the mark. Run: npm run icons
 */
import { writeFileSync } from "node:fs";
import { EYE, eyeClipPath, lowerLidPath, upperLidPath } from "../src/components/brand/eyeGeometry.ts";

const { cx, cy, irisR, lockedR } = EYE;
// Square tile: the eye (240×160) scaled into a 64×64 rounded --ink square.
const s = 58 / EYE.w;
const ty = (64 - EYE.h * s) / 2;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
<rect width="64" height="64" rx="14" fill="#07070A"/>
<defs><clipPath id="c"><path d="${eyeClipPath(1)}"/></clipPath></defs>
<g transform="translate(3 ${ty.toFixed(2)}) scale(${s.toFixed(5)})">
<g clip-path="url(#c)">
<rect width="${EYE.w}" height="${EYE.h}" fill="#0E0E12"/>
<circle cx="${cx}" cy="${cy}" r="${irisR}" fill="#0A0A0D"/>
<circle cx="${cx}" cy="${cy}" r="34" fill="none" stroke="#EDE8DD" stroke-opacity=".35" stroke-width="4"/>
<circle cx="${cx}" cy="${cy}" r="47" fill="none" stroke="#EDE8DD" stroke-opacity=".25" stroke-width="4"/>
<circle cx="${cx}" cy="${cy}" r="${lockedR}" fill="none" stroke="#FF3B2F" stroke-width="8"/>
<circle cx="${cx}" cy="${cy}" r="13" fill="#16161C"/>
<ellipse cx="${cx - 17}" cy="${cy - 19}" rx="9" ry="6" fill="#EDE8DD" transform="rotate(-30 ${cx - 17} ${cy - 19})"/>
</g>
<path d="${lowerLidPath()}" fill="none" stroke="#EDE8DD" stroke-width="11" stroke-linecap="round"/>
<path d="${upperLidPath(1)}" fill="none" stroke="#EDE8DD" stroke-width="15" stroke-linecap="round"/>
</g>
</svg>
`;

writeFileSync(new URL("../src/app/icon.svg", import.meta.url), svg);
console.log("wrote src/app/icon.svg");
