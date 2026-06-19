/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class AudioEngine {
  private ctx: AudioContext | null = null;
  private mainGain: GainNode | null = null;
  private ambientOsc1: OscillatorNode | null = null;
  private ambientOsc2: OscillatorNode | null = null;
  private ambientFilter: BiquadFilterNode | null = null;
  private isMuted: boolean = true;
  private isInitialized: boolean = false;

  constructor() {
    // Lazy initialize to bypass browser autoplay policies
  }

  init() {
    if (this.isInitialized) return;
    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtxClass();
      this.mainGain = this.ctx.createGain();
      this.mainGain.gain.setValueAtTime(0, this.ctx.currentTime);
      this.mainGain.connect(this.ctx.destination);
      this.isInitialized = true;
      this.isMuted = false;
      this.startAmbientDrone();
    } catch (e) {
      console.warn("Failed to initialize Web Audio Engine: ", e);
    }
  }

  toggleMute(): boolean {
    this.init();
    if (!this.ctx || !this.mainGain) return true;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (this.isMuted) {
      // Unmute: Fade volume in smoothly
      this.mainGain.gain.setValueAtTime(this.mainGain.gain.value, this.ctx.currentTime);
      this.mainGain.gain.linearRampToValueAtTime(0.25, this.ctx.currentTime + 1.2);
      this.isMuted = false;
    } else {
      // Mute: Fade volume out smoothly
      this.mainGain.gain.setValueAtTime(this.mainGain.gain.value, this.ctx.currentTime);
      this.mainGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.3);
      this.isMuted = true;
    }
    return this.isMuted;
  }

  isCurrentlyMuted() {
    return this.isMuted;
  }

  private startAmbientDrone() {
    if (!this.ctx || !this.mainGain) return;

    try {
      // High-end ambient synthesizer drone
      this.ambientFilter = this.ctx.createBiquadFilter();
      this.ambientFilter.type = 'lowpass';
      this.ambientFilter.frequency.setValueAtTime(140, this.ctx.currentTime);
      this.ambientFilter.Q.setValueAtTime(2.0, this.ctx.currentTime);
      
      // Oscillator 1: Low ambient pad hum
      this.ambientOsc1 = this.ctx.createOscillator();
      this.ambientOsc1.type = 'sawtooth';
      this.ambientOsc1.frequency.setValueAtTime(55, this.ctx.currentTime); // A1 note
      
      // Oscillator 2: Detention detuned hum
      this.ambientOsc2 = this.ctx.createOscillator();
      this.ambientOsc2.type = 'sawtooth';
      this.ambientOsc2.frequency.setValueAtTime(55.4, this.ctx.currentTime); // slightly detuned
      
      const droneGain = this.ctx.createGain();
      droneGain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      
      this.ambientOsc1.connect(this.ambientFilter);
      this.ambientOsc2.connect(this.ambientFilter);
      this.ambientFilter.connect(droneGain);
      droneGain.connect(this.mainGain);
      
      this.ambientOsc1.start();
      this.ambientOsc2.start();

      // slow ambient filter cutoff modulation to make the space feel alive and moving
      const modulateFilters = () => {
        if (!this.ctx || !this.ambientFilter || this.isMuted) return;
        const now = this.ctx.currentTime;
        const targetFreq = 120 + Math.random() * 80;
        this.ambientFilter.frequency.linearRampToValueAtTime(targetFreq, now + 4.0);
        setTimeout(modulateFilters, 4000);
      };
      modulateFilters();
    } catch (e) {
      console.warn("Drone creation mismatch", e);
    }
  }

  playPortal() {
    this.init();
    if (!this.ctx || !this.mainGain || this.isMuted) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(40, now);
      // Sweeping frequency from deep void sub-bass (40Hz) to cosmic high (800Hz)
      osc.frequency.exponentialRampToValueAtTime(800, now + 3.0);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(100, now);
      filter.frequency.exponentialRampToValueAtTime(1200, now + 3.0);
      filter.Q.setValueAtTime(4.0, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.4, now + 0.8);
      gain.gain.linearRampToValueAtTime(0.1, now + 2.4);
      gain.gain.linearRampToValueAtTime(0, now + 3.0);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.mainGain);

      osc.start(now);
      osc.stop(now + 3.1);
    } catch (e) {
      // Ignored
    }
  }

  playHover() {
    if (!this.ctx || !this.mainGain || this.isMuted) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(950, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.08);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);

      osc.connect(gain);
      gain.connect(this.mainGain);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch (e) {
      // Ignored
    }
  }

  playClick() {
    this.init();
    if (!this.ctx || !this.mainGain || this.isMuted) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const oscSub = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.15);

      oscSub.type = 'sine';
      oscSub.frequency.setValueAtTime(80, now);
      oscSub.frequency.exponentialRampToValueAtTime(40, now + 0.15);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

      osc.connect(gain);
      oscSub.connect(gain);
      gain.connect(this.mainGain);

      osc.start(now);
      oscSub.start(now);
      osc.stop(now + 0.2);
      oscSub.stop(now + 0.2);
    } catch (e) {
      // Ignored
    }
  }

  playRobot() {
    if (!this.ctx || !this.mainGain || this.isMuted) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const modulator = this.ctx.createOscillator();
      const modGain = this.ctx.createGain();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.linearRampToValueAtTime(80, now + 0.4);

      modulator.type = 'sine';
      modulator.frequency.setValueAtTime(35, now); // Ring modulation

      modGain.gain.setValueAtTime(60, now);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      modulator.connect(modGain);
      modGain.connect(osc.frequency);
      osc.connect(gain);
      gain.connect(this.mainGain);

      modulator.start(now);
      osc.start(now);
      modulator.stop(now + 0.5);
      osc.stop(now + 0.5);
    } catch (e) {
      // Ignored
    }
  }

  playSpace() {
    if (!this.ctx || !this.mainGain || this.isMuted) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(330, now + 0.6);

      filter.type = 'peaking';
      filter.frequency.setValueAtTime(600, now);
      filter.Q.setValueAtTime(8.0, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.mainGain);

      osc.start(now);
      osc.stop(now + 0.8);
    } catch (e) {
      // Ignored
    }
  }

  playQuantum() {
    if (!this.ctx || !this.mainGain || this.isMuted) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(800, now);
      // exponential chirp for quantum particle bubble
      osc.frequency.exponentialRampToValueAtTime(2200, now + 0.3);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, now);
      filter.Q.setValueAtTime(12.0, now);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.mainGain);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) {
      // Ignored
    }
  }
}

export const audioEngine = new AudioEngine();
