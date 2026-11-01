/*
 * Coordination between the intro overlay and the page beneath it. The boot script sets
 * html[data-intro="play"] before first paint when the intro will run; the intro sets it to
 * "done" when it ends, and fires INTRO_HANDOFF when the hero should start revealing.
 */

export const INTRO_HANDOFF = "groove:intro-handoff";
export const INTRO_SESSION_KEY = "groove:intro";

export type IntroHandoffDetail = { skipped: boolean };

export function introWillPlay(): boolean {
  return typeof document !== "undefined" && document.documentElement.dataset.intro === "play";
}

/** Runs `fn` at handoff if the intro is playing; otherwise never (the page is already final). */
export function onIntroHandoff(fn: (detail: IntroHandoffDetail) => void): () => void {
  const handler = (e: Event) =>
    fn((e as CustomEvent<IntroHandoffDetail>).detail ?? { skipped: false });
  window.addEventListener(INTRO_HANDOFF, handler, { once: true });
  return () => window.removeEventListener(INTRO_HANDOFF, handler);
}

export function dispatchIntroHandoff(detail: IntroHandoffDetail) {
  window.dispatchEvent(new CustomEvent<IntroHandoffDetail>(INTRO_HANDOFF, { detail }));
}
