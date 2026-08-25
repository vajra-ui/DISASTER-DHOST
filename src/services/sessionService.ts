import { NetworkMode, ResponderUser, TrustedSessionState } from '../types/dhostAuth';

const ANON_SESSION_KEY = 'dhost_anon_device_session';
const TRUSTED_SESSION_KEY = 'dhost_trusted_session_state';
const NETWORK_MODE_KEY = 'dhost_network_simulation_mode';
const DEVICE_FINGERPRINT_KEY = 'dhost_device_hardware_fingerprint';

class SessionService {
  private anonSessionToken: string | null = null;
  private deviceFingerprint: string | null = null;

  constructor() {
    this.initDeviceFingerprint();
    this.initAnonymousSession();
  }

  private initDeviceFingerprint(): string {
    let fp = localStorage.getItem(DEVICE_FINGERPRINT_KEY);
    if (!fp) {
      const randomHex = Math.floor(Math.random() * 0xFFFFFF).toString(16).toUpperCase().padStart(6, '0');
      fp = `DNIOST-DEV-${randomHex}`;
      localStorage.setItem(DEVICE_FINGERPRINT_KEY, fp);
    }
    this.deviceFingerprint = fp;
    return fp;
  }


  public getDeviceFingerprint(): string {
    return this.deviceFingerprint || this.initDeviceFingerprint();
  }

  public initAnonymousSession(): string {
    let token = localStorage.getItem(ANON_SESSION_KEY);
    if (!token) {
      const hex = Math.floor(Math.random() * 0xFFFFFF).toString(16).toUpperCase().padStart(6, '0');
      token = `DD-${hex}`;
      localStorage.setItem(ANON_SESSION_KEY, token);
    }
    this.anonSessionToken = token;
    return token;
  }


  public getAnonymousSessionToken(): string {
    if (!this.anonSessionToken) {
      return this.initAnonymousSession();
    }
    return this.anonSessionToken;
  }


  public saveTrustedSession(responder: ResponderUser, isOfflineTrusted: boolean = false): TrustedSessionState {
    const session: TrustedSessionState = {
      token: `SES-${responder.responderId}-${Date.now()}`,
      responder,
      deviceFingerprint: this.getDeviceFingerprint(),
      authenticatedAt: Date.now(),
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
      isOfflineTrusted
    };
    localStorage.setItem(TRUSTED_SESSION_KEY, JSON.stringify(session));
    return session;
  }


  public getTrustedSession(): TrustedSessionState | null {
    try {
      const raw = localStorage.getItem(TRUSTED_SESSION_KEY);
      if (!raw) return null;
      const parsed: TrustedSessionState = JSON.parse(raw);
      if (parsed.deviceFingerprint !== this.getDeviceFingerprint()) {
        console.warn('Session device fingerprint mismatch; rejecting invalid session');
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  }


  public clearTrustedSession(): void {
    localStorage.removeItem(TRUSTED_SESSION_KEY);
  }


  public getNetworkMode(): NetworkMode {
    try {
      const mode = localStorage.getItem(NETWORK_MODE_KEY);
      if (mode === 'OFFLINE_MESH' || mode === 'CELLULAR_DEGRADED') return mode;
      return 'ONLINE';
    } catch {
      return 'ONLINE';
    }
  }


  public setNetworkMode(mode: NetworkMode): void {
    localStorage.setItem(NETWORK_MODE_KEY, mode);
  }
}

export const sessionService = new SessionService();
