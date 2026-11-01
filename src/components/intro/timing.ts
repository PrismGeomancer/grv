/**
 * Every intro timing, in seconds from the start of the master timeline. Tune beats here;
 * nothing in Intro.tsx hard-codes a time. `end` must stay 6.0 (brief §6).
 */
export const INTRO_TIMING = {
  end: 6.0,
  skipAt: 0.8,

  // 0.0–1.0 · black, grain, the clock ticks 02:59:57 → :58 → :59
  clockIn: 0.05,
  clockTicks: [0.38, 0.7],

  // 1.0–1.8 · 03:00:00, ON AIR flickers on, "everyone's asleep."
  three: 1.0,
  asleepAt: 1.1,
  typeCps: 30,

  // 1.8–3.0 · retype "not everyone.", the eye opens from a slit and starts to spin
  wake: 1.8,
  retypeAt: 2.12,
  eyeOpenAt: 1.85,
  eyeOpenDur: 1.1,
  spinAt: 2.1,

  // 3.0–4.4 · the agent wakes up: status lines, then the accelerating fan counter
  agent: 3.0,
  statusGap: 0.2,
  statusCps: 80,
  fansAt: 3.82,

  // 4.4–5.2 · blinkResist, status lines collapse into the iris
  resist: 4.4,
  resistDur: 0.78,
  collapseAt: 4.6,

  // 5.2–6.0 · locked groove flares, "locked in the groove.", zoom + Flip into the hero
  lock: 5.2,
  lockedCps: 48,
  handoff: 5.45,
  revealAt: 5.6,
} as const;
