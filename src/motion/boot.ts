/* Server-safe (no "use client"): imported by the root layout. */

export const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Inlined in <head> so html[data-motion] and html[data-intro] are right before first paint.
 * The intro plays on the home page only, once per session, never with reduced motion or
 * when arriving on an #anchor. `?intro` forces a replay (handy for review).
 */
export function bootScript(basePath: string): string {
  const home = JSON.stringify(basePath.replace(/\/+$/, ""));
  return `try{var d=document.documentElement,r=matchMedia('${REDUCED_QUERY}').matches;d.dataset.motion=r?'reduce':'full';var p=location.pathname.replace(/\\/+$/,''),f=/[?&]intro\\b/.test(location.search);if(!r&&p===${home}&&!location.hash&&(f||!sessionStorage.getItem('groove:intro')))d.dataset.intro='play'}catch(e){}`;
}
