// Web Audio API Synthesizer for Safety Alerts, Safety Check Chimes, SOS Sirens, and Arrival Jingles

class SoundService {
  private ctx: AudioContext | null = null;
  private sirenInterval: any = null;
  private isSirenActive = false;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Soft safety check reminder chime ("Hey Dosth, everything okay?")
  public playCheckInChime() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 harmonious chime
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.12);

        gain.gain.setValueAtTime(0.01, now + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.3, now + i * 0.12 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 0.5);
      });
    } catch (e) {
      console.warn('Web Audio check-in chime not played:', e);
    }
  }

  // Countdown urgency tick
  public playCountdownTick(isUrgent: boolean = false) {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(isUrgent ? 880 : 440, now);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch (e) {
      console.warn('Web Audio tick error:', e);
    }
  }

  // Safe Arrival Victory Jingle
  public playSafeArrivalJingle() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const melody = [
        { note: 523.25, time: 0.0, dur: 0.15 }, // C5
        { note: 659.25, time: 0.15, dur: 0.15 }, // E5
        { note: 783.99, time: 0.30, dur: 0.18 }, // G5
        { note: 1046.50, time: 0.48, dur: 0.45 }, // C6 high celebration
      ];

      melody.forEach(({ note, time, dur }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note, now + time);

        gain.gain.setValueAtTime(0.01, now + time);
        gain.gain.exponentialRampToValueAtTime(0.4, now + time + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + time + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + time);
        osc.stop(now + time + dur + 0.05);
      });
    } catch (e) {
      console.warn('Web audio victory error:', e);
    }
  }

  // High decibel SOS Siren Strobe Tone
  public startSOSSiren() {
    if (this.isSirenActive) return;
    this.isSirenActive = true;

    try {
      const ctx = this.getContext();
      if (!ctx) return;

      let up = true;
      const playPulse = () => {
        if (!this.isSirenActive) return;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        const startFreq = up ? 600 : 1200;
        const endFreq = up ? 1200 : 600;
        up = !up;

        osc.frequency.setValueAtTime(startFreq, now);
        osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.4);

        gain.gain.setValueAtTime(0.6, now);
        gain.gain.linearRampToValueAtTime(0.6, now + 0.38);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.41);
      };

      playPulse();
      this.sirenInterval = setInterval(playPulse, 420);
    } catch (e) {
      console.warn('SOS Siren error:', e);
    }
  }

  public stopSOSSiren() {
    this.isSirenActive = false;
    if (this.sirenInterval) {
      clearInterval(this.sirenInterval);
      this.sirenInterval = null;
    }
  }

  public isSirenRunning(): boolean {
    return this.isSirenActive;
  }
}

export const soundService = new SoundService();
