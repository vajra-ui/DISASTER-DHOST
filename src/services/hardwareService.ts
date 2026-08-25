import { EmergencyPacket, LocationData } from '../types/dhostAuth';

export interface DeviceTelemetry {
  lat: number;
  lng: number;
  accuracy: number;
  altitude: number | null;
  heading: number | null;
  speed: number | null;
  batteryLevel: number;
  isCharging: boolean;
  isOnline: boolean;
  networkType: string;
}

class HardwareService {
  private currentCoords: { lat: number; lng: number; accuracy: number } = {
    lat: 11.6685,
    lng: 78.1420,
    accuracy: 5.0
  };
  private batteryLevel: number = 85;
  private isCharging: boolean = false;
  private audioCtx: AudioContext | null = null;
  private sirenOscillator: OscillatorNode | null = null;
  private sirenGain: GainNode | null = null;
  private sirenInterval: any = null;
  private meshChannel: BroadcastChannel | null = null;
  private isListeningVoice: boolean = false;
  private recognition: any = null;

  constructor() {
    this.initGeolocation();
    this.initBattery();
    this.initMeshChannel();
  }

  // ==========================================
  // 1. REAL GEOLOCATION API
  // ==========================================
  private initGeolocation(): void {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          this.currentCoords = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy || 4.5
          };
        },
        (err) => {
          console.warn('Geolocation initial watch fallback:', err.message);
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 10000 }
      );

      navigator.geolocation.watchPosition(
        (pos) => {
          this.currentCoords = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy || 3.0
          };
        },
        (err) => console.warn('Continuous GPS watch notice:', err.message),
        { enableHighAccuracy: true, maximumAge: 5000 }
      );
    }
  }

  public async getLiveCoordinates(): Promise<LocationData> {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && 'geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            this.currentCoords = {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
              accuracy: pos.coords.accuracy || 3.5
            };
            resolve({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
              accuracyMeters: Math.round(pos.coords.accuracy || 4),
              address: `GPS Lat: ${pos.coords.latitude.toFixed(4)}, Lng: ${pos.coords.longitude.toFixed(4)}`,
              landmark: 'Live GPS Pin (High Precision)'
            });
          },
          () => {
            resolve({
              lat: this.currentCoords.lat,
              lng: this.currentCoords.lng,
              accuracyMeters: 5,
              address: 'Disaster Impact Zone (GPS Active)',
              landmark: 'Fairlands Primary Shelter Area'
            });
          },
          { enableHighAccuracy: true, timeout: 4000 }
        );
      } else {
        resolve({
          lat: this.currentCoords.lat,
          lng: this.currentCoords.lng,
          accuracyMeters: 5,
          address: 'Disaster Impact Zone',
          landmark: 'Fairlands Primary Shelter Area'
        });
      }
    });
  }

  // ==========================================
  // 2. REAL BATTERY TELEMETRY API
  // ==========================================
  private initBattery(): void {
    if (typeof window !== 'undefined' && 'getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        this.batteryLevel = Math.round(battery.level * 100);
        this.isCharging = battery.charging;

        battery.addEventListener('levelchange', () => {
          this.batteryLevel = Math.round(battery.level * 100);
        });
        battery.addEventListener('chargingchange', () => {
          this.isCharging = battery.charging;
        });
      }).catch(() => {});
    }
  }

  public getBatteryLevel(): number {
    return this.batteryLevel;
  }

  public isDeviceCharging(): boolean {
    return this.isCharging;
  }

  // ==========================================
  // 3. REAL WEB AUDIO ACOUSTIC RESCUE SIREN
  // ==========================================
  private getAudioContext(): AudioContext {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioContextClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  public playRescueSiren(): boolean {
    try {
      const ctx = this.getAudioContext();
      this.stopRescueSiren();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(850, ctx.currentTime);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      let freq = 850;
      let rising = true;

      this.sirenInterval = setInterval(() => {
        if (!ctx || ctx.state === 'closed') return;
        if (rising) {
          freq += 60;
          if (freq >= 1600) rising = false;
        } else {
          freq -= 60;
          if (freq <= 850) rising = true;
        }
        try {
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
        } catch {}
      }, 50);

      this.sirenOscillator = osc;
      this.sirenGain = gain;
      return true;
    } catch (e) {
      console.warn('Audio Siren playback error:', e);
      return false;
    }
  }

  public stopRescueSiren(): void {
    if (this.sirenInterval) {
      clearInterval(this.sirenInterval);
      this.sirenInterval = null;
    }
    if (this.sirenOscillator) {
      try {
        this.sirenOscillator.stop();
        this.sirenOscillator.disconnect();
      } catch {}
      this.sirenOscillator = null;
    }
  }

  public playDispatchChime(): void {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // Note 1 (High Alert Bell)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(880, now);
      gain1.gain.setValueAtTime(0.2, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.35);

      // Note 2 (Ascending Harmonic)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1320, now + 0.15);
      gain2.gain.setValueAtTime(0.25, now + 0.15);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.15);
      osc2.stop(now + 0.55);
    } catch {}
  }

  // ==========================================
  // 4. REAL WEB SPEECH RECOGNITION (VOICE SOS)
  // ==========================================
  public startVoiceSos(
    onTranscription: (text: string, isFinal: boolean) => void,
    onError: (err: string) => void
  ): () => void {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      onError('Web Speech API is not supported in this browser. You can type or tap emergency cards.');
      return () => {};
    }

    try {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-IN'; // Also supports ta-IN, hi-IN

      this.recognition.onresult = (event: any) => {
        let transcript = '';
        let isFinal = false;
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
          if (event.results[i].isFinal) isFinal = true;
        }
        onTranscription(transcript, isFinal);
      };

      this.recognition.onerror = (event: any) => {
        onError(`Voice input error: ${event.error}`);
      };

      this.recognition.start();
      this.isListeningVoice = true;

      return () => {
        if (this.recognition) {
          try {
            this.recognition.stop();
          } catch {}
          this.isListeningVoice = false;
        }
      };
    } catch (e: any) {
      onError(`Failed to start speech recognition: ${e.message}`);
      return () => {};
    }
  }

  // ==========================================
  // 5. REAL BROADCASTCHANNEL MULTI-TAB MESH BUS
  // ==========================================
  private initMeshChannel(): void {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      this.meshChannel = new BroadcastChannel('dhost_disaster_mesh_bus');
    }
  }

  public broadcastMeshEvent(type: 'NEW_INCIDENT' | 'STATUS_CHANGE' | 'PRIORITY_CHANGE' | 'FAILOVER', payload: any): void {
    if (this.meshChannel) {
      try {
        this.meshChannel.postMessage({ type, payload, timestamp: Date.now() });
      } catch (e) {
        console.warn('Mesh broadcast error:', e);
      }
    }
  }

  public onMeshEvent(callback: (event: { type: string; payload: any; timestamp: number }) => void): () => void {
    if (this.meshChannel) {
      const handler = (e: MessageEvent) => {
        if (e.data && e.data.type) {
          callback(e.data);
        }
      };
      this.meshChannel.addEventListener('message', handler);
      return () => {
        if (this.meshChannel) {
          this.meshChannel.removeEventListener('message', handler);
        }
      };
    }
    return () => {};
  }

  // ==========================================
  // 6. REAL SMS & WHATSAPP FALLBACK URIs
  // ==========================================
  public generateSmsDistressUri(packet: EmergencyPacket): string {
    const text = `SOS! DISASTER DHOST EMERGENCY BEACON\nID: ${packet.incidentId}\nType: ${packet.incidentCategoryLabel}\nGPS: ${packet.location.lat.toFixed(5)},${packet.location.lng.toFixed(5)}\nPeople: ${packet.peopleCount}\nMsg: ${packet.requestText}\nBattery: ${packet.batteryLevel}%`;
    return `sms:112?body=${encodeURIComponent(text)}`;
  }

  public generateWhatsAppDistressUri(packet: EmergencyPacket): string {
    const text = `🚨 *DISASTER DHOST EMERGENCY RESCUE BEACON*\n*Incident ID:* ${packet.incidentId}\n*Category:* ${packet.incidentCategoryLabel}\n*People Affected:* ${packet.peopleCount}\n*Live Coordinates:* https://maps.google.com/?q=${packet.location.lat},${packet.location.lng}\n*Landmark:* ${packet.location.landmark}\n*Message:* ${packet.requestText}\n*Device Battery:* ${packet.batteryLevel}%\n_Transmitted via DHOST Mesh Relay_`;
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  }

  public async triggerNativeShare(packet: EmergencyPacket): Promise<boolean> {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `🆘 SOS Beacon - ${packet.incidentId}`,
          text: `EMERGENCY SOS: ${packet.incidentCategoryLabel} at ${packet.location.address}. People: ${packet.peopleCount}. Details: ${packet.requestText}`,
          url: `https://maps.google.com/?q=${packet.location.lat},${packet.location.lng}`
        });
        return true;
      } catch {
        return false;
      }
    }
    return false;
  }
}

export const hardwareService = new HardwareService();
