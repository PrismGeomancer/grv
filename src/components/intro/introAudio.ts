/*
 * Intro sound, synthesised with the Web Audio API: no audio files, so nothing to license.
 * Off by default and only ever started from the user's click on the speaker toggle.
 *   roomTone(): filtered brown noise, very quiet
 *   crackle():  a needle-drop: a soft thud plus sparse vinyl clicks
 *   thump():    a low sine drop
 */

export class IntroAudio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private tone: AudioBufferSourceNode | null = null;

  get enabled() {
    return this.ctx !== null && this.ctx.state === "running";
  }

  async enable() {
    if (!this.ctx) {
      const Ctx =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new Ctx();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0;
      this.master.connect(this.ctx.destination);
      this.startRoomTone();
    }
    await this.ctx.resume();
    this.ramp(0.9, 0.4);
  }

  disable() {
    this.ramp(0, 0.25);
    window.setTimeout(() => void this.ctx?.suspend(), 300);
  }

  fadeOutAndClose(seconds = 1.2) {
    if (!this.ctx) return;
    this.ramp(0, seconds);
    const ctx = this.ctx;
    window.setTimeout(() => void ctx.close(), seconds * 1000 + 100);
    this.ctx = null;
  }

  crackle() {
    const ctx = this.ctx;
    if (!ctx || !this.master || !this.enabled) return;
    const len = Math.floor(ctx.sampleRate * 1.4);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      const t = i / ctx.sampleRate;
      // The drop: a short low-passed noise burst.
      const drop = t < 0.06 ? (Math.random() * 2 - 1) * (1 - t / 0.06) * 0.5 : 0;
      // Sparse clicks that thin out.
      const click = Math.random() < 0.0016 * (1 - t / 1.4) ? (Math.random() * 2 - 1) * 0.7 : 0;
      data[i] = drop + click;
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 2400;
    filter.Q.value = 0.6;
    const g = ctx.createGain();
    g.gain.value = 0.35;
    src.connect(filter).connect(g).connect(this.master);
    src.start();
  }

  thump() {
    const ctx = this.ctx;
    if (!ctx || !this.master || !this.enabled) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(70, now);
    osc.frequency.exponentialRampToValueAtTime(32, now + 0.5);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.55, now + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
    osc.connect(g).connect(this.master);
    osc.start(now);
    osc.stop(now + 0.85);
  }

  private startRoomTone() {
    const ctx = this.ctx!;
    const len = ctx.sampleRate * 4;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) {
      last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02; // brown noise
      data[i] = last * 3.2;
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 420;
    const g = ctx.createGain();
    g.gain.value = 0.06;
    src.connect(filter).connect(g).connect(this.master!);
    src.start();
    this.tone = src;
  }

  private ramp(to: number, seconds: number) {
    if (!this.ctx || !this.master) return;
    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(this.master.gain.value, now);
    this.master.gain.linearRampToValueAtTime(to, now + seconds);
  }
}
