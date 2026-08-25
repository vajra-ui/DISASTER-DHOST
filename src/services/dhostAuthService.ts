import { AuthStatus, NetworkMode, ResponderUser, UserRole } from '../types/dhostAuth';
import { sessionService } from './sessionService';

export interface DemoAccountInfo {
  responderId: string;
  name: string;
  role: UserRole;
  organization: string;
  unitDesignation: string;
  badgeNumber: string;
  pin: string;
  demoPin: string;
  description: string;
}

export const DEMO_RESPONDERS: DemoAccountInfo[] = [
  {
    responderId: 'CMD-001',
    name: 'Capt. Rajesh Varma',
    role: 'COMMANDER',
    organization: 'NDRF',
    unitDesignation: 'District Incident Command HQ',
    badgeNumber: 'DERF-CMD-09',
    pin: '9900',
    demoPin: '9900',
    description: 'Full operational control, dispatch, priority escalation, mesh simulation'
  },
  {
    responderId: 'RSC-1042',
    name: 'Sgt. Ananya Sen',
    role: 'RESCUE_TEAM',
    organization: 'NDRF',
    unitDesignation: 'Unit 4 Tactical Search & Rescue',
    badgeNumber: 'NDRF-RSC-1042',
    pin: '9900',
    demoPin: '9900',
    description: 'Field rescue dispatch, navigation, victim status updates, mesh relay'
  },
  {
    responderId: 'MED-204',
    name: 'Dr. K. Raghavan',
    role: 'MEDICAL',
    organization: 'DPC-MED',
    unitDesignation: 'Mobile Field Triage Unit 2',
    badgeNumber: 'RC-MED-204',
    pin: '9900',
    demoPin: '9900',
    description: 'Medical triage queue, casualty status, stabilization & medevac transport'
  }
];

export const DEMO_RESPONDER_ACCOUNTS = DEMO_RESPONDERS;

class DhostAuthService {
  private currentUser: ResponderUser | null = null;
  private authStatus: AuthStatus = 'GUEST';
  private networkMode: NetworkMode = 'ONLINE';
  private subscribers: Array<() => void> = [];

  constructor() {
    this.networkMode = sessionService.getNetworkMode();
    this.restoreSession();
  }

  public subscribe(fn: () => void): () => void {
    this.subscribers.push(fn);
    return () => {
      this.subscribers = this.subscribers.filter(s => s !== fn);
    };
  }

  private notify(): void {
    this.subscribers.forEach(s => s());
  }

  public restoreSession(): void {
    const trusted = sessionService.getTrustedSession();
    if (trusted && trusted.responder) {
      this.currentUser = trusted.responder;
      this.authStatus = this.networkMode === 'ONLINE' 
        ? this.getRoleAuthStatus(trusted.responder.role) 
        : 'OFFLINE_TRUSTED';
    } else {
      this.currentUser = null;
      this.authStatus = 'GUEST';
    }
    this.notify();
  }

  private getRoleAuthStatus(role: UserRole): AuthStatus {
    switch (role) {
      case 'COMMANDER': return 'COMMANDER_AUTHENTICATED';
      case 'RESCUE_TEAM': return 'RESPONDER_AUTHENTICATED';
      case 'MEDICAL': return 'MEDICAL_AUTHENTICATED';
      default: return 'GUEST';
    }
  }

  public getCurrentUser(): ResponderUser | null {
    return this.currentUser;
  }

  public getAuthStatus(): AuthStatus {
    return this.authStatus;
  }

  public isAuthenticated(): boolean {
    return this.currentUser !== null && this.authStatus !== 'GUEST' && this.authStatus !== 'UNAUTHORIZED';
  }

  public getNetworkMode(): NetworkMode {
    return this.networkMode;
  }

  public setNetworkMode(mode: NetworkMode): void {
    this.networkMode = mode;
    sessionService.setNetworkMode(mode);

    if (this.currentUser) {
      if (mode !== 'ONLINE') {
        this.authStatus = 'OFFLINE_TRUSTED';
      } else {
        this.authStatus = this.getRoleAuthStatus(this.currentUser.role);
      }
    }
    this.notify();
  }

  public getDemoAccounts(): DemoAccountInfo[] {
    return DEMO_RESPONDERS;
  }

  public async login(
    organization: string,
    responderId: string,
    pin: string,
    trustDevice: boolean = true
  ): Promise<ResponderUser> {
    const cleanId = responderId.trim().toUpperCase();
    const cleanOrg = organization.trim();

    if (this.networkMode !== 'ONLINE') {
      const existingTrusted = sessionService.getTrustedSession();
      if (existingTrusted && existingTrusted.responder.responderId === cleanId) {
        this.currentUser = existingTrusted.responder;
        this.authStatus = 'OFFLINE_TRUSTED';
        this.notify();
        return existingTrusted.responder;
      }

      throw new Error(
        'NETWORK UNAVAILABLE\n\nNew responder verification requires connectivity or authorized local provisioning.\n\n[ REQUEST ACCESS ]'
      );
    }

    const match = DEMO_RESPONDERS.find(r => r.responderId === cleanId);
    if (!match) {
      throw new Error('Invalid Responder ID. Use demo accounts CMD-001, RSC-1042, or MED-204.');
    }

    if (pin.trim() !== match.pin && pin.trim() !== 'demo' && pin.trim() !== '123456') {
      throw new Error('Invalid PIN or Security Credential.');
    }

    const responder: ResponderUser = {
      responderId: match.responderId,
      name: match.name,
      role: match.role,
      organization: cleanOrg || match.organization,
      unitDesignation: match.unitDesignation,
      badgeNumber: match.badgeNumber,
      isTrustedDevice: trustDevice,
      lastOnlineAuthTimestamp: Date.now(),
      sessionToken: 'SES-' + match.responderId + '-' + Date.now(),
      status: 'AVAILABLE',
      currentCoords: { lat: 11.6643, lng: 78.1460 }
    };

    if (trustDevice) {
      sessionService.saveTrustedSession(responder, false);
    }

    this.currentUser = responder;
    this.authStatus = this.getRoleAuthStatus(responder.role);
    this.notify();
    return responder;
  }

  public quickSwitchDemo(role: UserRole): ResponderUser {
    const match = DEMO_RESPONDERS.find(r => r.role === role) || DEMO_RESPONDERS[0];
    const responder: ResponderUser = {
      responderId: match.responderId,
      name: match.name,
      role: match.role,
      organization: match.organization,
      unitDesignation: match.unitDesignation,
      badgeNumber: match.badgeNumber,
      isTrustedDevice: true,
      lastOnlineAuthTimestamp: Date.now(),
      sessionToken: 'SES-' + match.responderId + '-' + Date.now(),
      status: 'AVAILABLE',
      currentCoords: { lat: 11.6643, lng: 78.1460 }
    };

    sessionService.saveTrustedSession(responder, this.networkMode !== 'ONLINE');
    this.currentUser = responder;
    this.authStatus = this.networkMode === 'ONLINE' 
      ? this.getRoleAuthStatus(responder.role) 
      : 'OFFLINE_TRUSTED';
    this.notify();
    return responder;
  }

  public logout(force: boolean = false): { warningRequired: boolean } {
    if (!force && this.networkMode !== 'ONLINE' && this.currentUser) {
      return { warningRequired: true };
    }

    sessionService.clearTrustedSession();
    this.currentUser = null;
    this.authStatus = 'GUEST';
    this.notify();
    return { warningRequired: false };
  }
}

export const dhostAuthService = new DhostAuthService();
