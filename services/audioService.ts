class AudioService {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // Check local storage for initial state
    const saved = localStorage.getItem('intro_wheel_muted');
    this.isMuted = saved === 'true';
  }

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    localStorage.setItem('intro_wheel_muted', String(muted));
  }

  public getMuted() {
    return this.isMuted;
  }

  public playTick(_velocity: number) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.02);
  }
  
  public playWin() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    
    const notes = [
      { f: 1046.50, t: 0 },    // C6
      { f: 1318.51, t: 0.05 }, // E6
      { f: 1567.98, t: 0.1 },  // G6
    ];

    notes.forEach((note, i) => {
      const startTime = now + note.t;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(note.f * 0.95, startTime);
      osc.frequency.exponentialRampToValueAtTime(note.f, startTime + 0.02);
      
      const isLast = i === notes.length - 1;
      const duration = isLast ? 0.6 : 0.15;
      
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.12, startTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      
      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  }

  public playPop() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const numSparkles = 5; 
    
    for (let i = 0; i < numSparkles; i++) {
      const startTime = now + (i * 0.03); 
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      const freq = 3000 + Math.random() * 2000;
      osc.frequency.setValueAtTime(freq, startTime);
      
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.08, startTime + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.06);
    }
  }

  public playRemove() {}
}

export const audioService = new AudioService();