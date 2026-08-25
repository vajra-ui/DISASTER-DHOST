import { 
  EmergencyPacket, 
  IncidentPriority, 
  IncidentStatus, 
  IncidentType, 
  LocationData 
} from '../types/dhostAuth';
import { sessionService } from './sessionService';
import { hardwareService } from './hardwareService';

const INCIDENTS_STORAGE_KEY = 'dhost_emergency_incidents_store';

const SEED_INCIDENTS: EmergencyPacket[] = [
  {
    incidentId: 'DD-26-FLD-8A71C2',
    sessionToken: 'DD-7A82F1',
    incidentType: 'FLOOD_TRAPPED',
    incidentCategoryLabel: 'Trapped in Rising Floodwaters',
    requestText: 'Water level reached 1st floor. 4 elderly persons and 1 infant trapped inside.',
    originalLanguage: 'Tamil',
    translatedText: 'Water level reached 1st floor. 4 elderly persons and 1 infant trapped inside.',
    aiTriageCategory: 'P1 - Imminent Life Threat (Hypothermia & Drowning Risk)',
    priority: 'CRITICAL',
    peopleCount: 5,
    location: {
      lat: 11.6685,
      lng: 78.1420,
      address: '24/B, Riverview Road, Fairlands',
      landmark: 'Behind St. Jude Primary School',
      accuracyMeters: 4.2
    },
    timestamp: Date.now() - 25 * 60 * 1000,
    batteryLevel: 38,
    relayStatus: 'MESH_RELAYED',
    hopCount: 3,
    dhostPath: ['VICTIM_NODE_7A82', 'MESH_RELAY_A12', 'DRONE_RELAY_02', 'COMMAND_BASE_01'],
    status: 'ACKNOWLEDGED',
    assignedTeamId: 'RSC-1042',
    assignedTeamName: 'Rescue Team Alpha (NDRF)',
    isCommunityReport: false,
    voluntaryContact: {
      name: 'R. Subramanian',
      phone: '+91 94432 18902',
      medicalNotes: 'Two elderly patients require regular medication; insulin dependent.'
    },
    logs: [
      { timestamp: Date.now() - 25 * 60 * 1000, action: 'SOS Packet Broadcasted via DHOST Mesh', actor: 'Victim Device DD-7A82F1' },
      { timestamp: Date.now() - 23 * 60 * 1000, action: 'Relayed across 3 mesh hops to EOC', actor: 'DRONE_RELAY_02' },
      { timestamp: Date.now() - 15 * 60 * 1000, action: 'Incident Acknowledged and Assigned to RSC-1042', actor: 'Capt. Rajesh Varma (Commander)' }
    ]
  },
  {
    incidentId: 'DD-26-COL-4F92B1',
    sessionToken: 'DD-9E31C4',
    incidentType: 'STRUCTURAL_COLLAPSE',
    incidentCategoryLabel: 'Building Structural Collapse',
    requestText: 'Roof of community market collapsed due to water saturation. People trapped under debris.',
    originalLanguage: 'English',
    translatedText: 'Roof of community market collapsed due to water saturation. People trapped under debris.',
    aiTriageCategory: 'P1 - Crush Injury / Asphyxiation Risk',
    priority: 'CRITICAL',
    peopleCount: 6,
    location: {
      lat: 11.6620,
      lng: 78.1495,
      address: 'OLD Market Square, Bazaar Street',
      landmark: 'Opposite Municipal Water Tank',
      accuracyMeters: 6.8
    },
    timestamp: Date.now() - 40 * 60 * 1000,
    batteryLevel: 64,
    relayStatus: 'MESH_RELAYED',
    hopCount: 2,
    dhostPath: ['VICTIM_NODE_9E31', 'MOBILE_RELAY_B4', 'COMMAND_BASE_01'],
    status: 'EN_ROUTE',
    assignedTeamId: 'RSC-1042',
    assignedTeamName: 'Rescue Team Alpha (NDRF)',
    isCommunityReport: false,
    voluntaryContact: {
      name: 'K. Vimal',
      phone: '+91 98421 66732'
    },
    logs: [
      { timestamp: Date.now() - 40 * 60 * 1000, action: 'SOS Packet Created', actor: 'Victim Device DD-9E31C4' },
      { timestamp: Date.now() - 32 * 60 * 1000, action: 'Priority Escalated to CRITICAL by AI NLP Triage', actor: 'DIOST Edge AI' },
      { timestamp: Date.now() - 10 * 60 * 1000, action: 'Rescue Unit Alpha En Route to Scene', actor: 'Sgt. Ananya Sen (RSC-1042)' }
    ]
  },
  {
    incidentId: 'DD-26-MED-1D33A8',
    sessionToken: 'DD-5B1182',
    incidentType: 'MEDICAL_CRITICAL',
    incidentCategoryLabel: 'Critical Medical Emergency (Oxygen Depletion)',
    requestText: 'Elderly patient with severe dyspnea; oxygen concentrator battery dying due to blackout.',
    originalLanguage: 'Tamil',
    translatedText: 'Elderly patient with severe dyspnea; oxygen concentrator battery dying due to blackout.',
    aiTriageCategory: 'P1 - Acute Respiratory Failure',
    priority: 'CRITICAL',
    peopleCount: 2,
    location: {
      lat: 11.6740,
      lng: 78.1360,
      address: 'Flat 302, Green Meadows Apts, Meyyanur Bypass',
      landmark: 'Near New Bus Stand Flyover',
      accuracyMeters: 3.5
    },
    timestamp: Date.now() - 18 * 60 * 1000,
    batteryLevel: 22,
    relayStatus: 'DIRECT',
    hopCount: 1,
    dhostPath: ['VICTIM_NODE_5B11', 'COMMAND_BASE_01'],
    status: 'REPORTED',
    assignedTeamId: 'MED-204',
    assignedTeamName: 'Medical Rapid Triage (Red Cross)',
    isCommunityReport: false,
    voluntaryContact: {
      name: 'Dr. S. Meenakshi',
      phone: '+91 97890 12345',
      medicalNotes: 'Stage 3 COOD, immediate portable O2 cylinder required.'
    },
    logs: [
      { timestamp: Date.now() - 18 * 60 * 1000, action: 'Medical Alert Broadcasted', actor: 'Victim Device DD-5B1182' },
      { timestamp: Date.now() - 12 * 60 * 1000, action: 'Forwarded to Medical Unit MED-204', actor: 'Ops Controller' }
    ]
  },
  {
    incidentId: 'DD-26-HAZ-9E40B7',
    sessionToken: 'DD-4C7790',
    incidentType: 'COMMUNITY_REPORT',
    incidentCategoryLabel: 'High Voltage Power Cable Snapped in Water',
    requestText: 'Substation line fallen across flooded intersection. Sparks visible. Road completely unsafe.',
    originalLanguage: 'English',
    translatedText: 'Substation line fallen across flooded intersection. Sparks visible. Road completely unsafe.',
    aiTriageCategory: 'P2 - Severe Hazard (Electrocution Risk)',
    priority: 'HIGH',
    peopleCount: 0,
    location: {
      lat: 11.6600,
      lng: 78.1410,
      address: 'Main Junction, Salem Road',
      landmark: 'Near Petrol Station',
      accuracyMeters: 12.0
    },
    timestamp: Date.now() - 55 * 60 * 1000,
    batteryLevel: 75,
    relayStatus: 'STORE_AND_FORWARD',
    hopCount: 2,
    dhostPath: ['CITIZEN_NODE_4C77', 'VEHICLE_RELAY_04', 'COMMAND_BASE_01'],
    status: 'REPORTED',
    isCommunityReport: true,
    logs: [
      { timestamp: Date.now() - 55 * 60 * 1000, action: 'Community Report logged by Volunteer', actor: 'Citizen Volunteer DD-4C7790' }
    ]
  },
  {
    incidentId: 'DD-26-SAF-3C20F9',
    sessionToken: 'DD-88AA12',
    incidentType: 'SAFE_CHECKIN',
    incidentCategoryLabel: 'Community Safe Shelter Operational',
    requestText: 'Shelter open with clean drinking water, dry rations, and backup generator for 200 people.',
    originalLanguage: 'English',
    translatedText: 'Shelter open with clean drinking water, dry rations, and backup generator for 200 people.',
    aiTriageCategory: 'P4 - Resource / Safety Beacon',
    priority: 'LOW',
    peopleCount: 140,
    location: {
      lat: 11.6780,
      lng: 78.1480,
      address: 'Government Higher Secondary School',
      landmark: 'Near North Gate',
      accuracyMeters: 5.0
    },
    timestamp: Date.now() - 90 * 60 * 1000,
    batteryLevel: 98,
    relayStatus: 'DIRECT',
    hopCount: 1,
    dhostPath: ['COMMUNITY_BEACON_07', 'COMMAND_BASE_01'],
    status: 'RESOLVED',
    isCommunityReport: false,
    logs: [
      { timestamp: Date.now() - 90 * 60 * 1000, action: 'Safe Haven Broadcast Initiated', actor: 'Shelter Coordinator' }
    ]
  }
];

class IncidentService {
  private incidents: EmergencyPacket[] = [];
  private subscribers: Array<() => void> = [];

  constructor() {
    this.loadIncidents();
    if (typeof window !== 'undefined') {
      hardwareService.onMeshEvent(() => {
        this.loadIncidents();
        this.notify();
      });
    }
  }

  private loadIncidents(): void {
    try {
      const raw = localStorage.getItem(INCIDENTS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          if (Array.isArray(parsed[0])) {
            this.incidents = parsed[0];
          } else {
            this.incidents = parsed;
          }
        } else {
          this.incidents = [...SEED_INCIDENTS];
        }
      } else {
        this.incidents = [...SEED_INCIDENTS];
        this.persist();
      }
    } catch {
      this.incidents = [...SEED_INCIDENTS];
    }
  }

  private persist(broadcast = true): void {
    try {
      localStorage.setItem(INCIDENTS_STORAGE_KEY, JSON.stringify(this.incidents));
      if (broadcast) {
        hardwareService.broadcastMeshEvent('STATUS_CHANGE', { count: this.incidents.length });
      }
    } catch (e) {
      console.warn('Failed to persist incidents store', e);
    }
    this.notify();
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

  public getAllIncidents(): EmergencyPacket[] {
    return [...this.incidents].sort((a, b) => b.timestamp - a.timestamp);
  }

  public getIncidentById(id: string): EmergencyPacket | null {
    return this.incidents.find(inc => inc.incidentId === id) || null;
  }

  public getIncidentsForTeam(teamId: string): EmergencyPacket[] {
    return this.incidents.filter(inc => inc.assignedTeamId === teamId);
  }

  public createVictimEmergency(params: {
    incidentType: IncidentType;
    requestText: string;
    originalLanguage?: string;
    peopleCount: number;
    location: LocationData;
    batteryLevel?: number;
    voluntaryContact?: {
      name?: string;
      phone?: string;
      medicalNotes?: string;
    };
  }): EmergencyPacket {
    const sessionToken = sessionService.getAnonymousSessionToken();
    const typeCode = params.incidentType.split('_')[0].substring(0, 3);
    const hex = Math.floor(Math.random() * 0xFFFFFF).toString(16).toUpperCase().padStart(6, '0');
    const incidentId = 'DD-26-' + typeCode + '-' + hex;

    let aiCategory = 'P2 - High Priority Emergency';
    let priority: IncidentPriority = 'HIGH';

    if (params.incidentType === 'FLOOD_TRAPPED' || params.incidentType === 'STRUCTURAL_COLLAPSE') {
      aiCategory = 'P1 - Imminent Life Threat (DHOST AI High-Confidence)';
      priority = 'CRITICAL';
    } else if (params.incidentType === 'MEDICAL_CRITICAL') {
      aiCategory = 'P1 - Immediate Medical Intervention Required';
      priority = 'CRITICAL';
    }

    const newPacket: EmergencyPacket = {
      incidentId,
      sessionToken,
      incidentType: params.incidentType,
      incidentCategoryLabel: this.getCategoryLabel(params.incidentType),
      requestText: params.requestText.trim() || 'Immediate emergency rescue assistance required.',
      originalLanguage: params.originalLanguage || 'English',
      translatedText: params.requestText.trim() || 'Immediate emergency rescue assistance required.',
      aiTriageCategory: aiCategory,
      priority,
      peopleCount: Math.max(1, params.peopleCount || 1),
      location: params.location,
      timestamp: Date.now(),
      batteryLevel: params.batteryLevel !== undefined ? params.batteryLevel : 85,
      relayStatus: 'MESH_RELAYED',
      hopCount: 2,
      dhostPath: ['VICTIM_NODE_' + sessionToken.replace('DD-', ''), 'MESH_RELAY_A01', 'COMMAND_BASE_01'],
      status: 'REPORTED',
      isCommunityReport: false,
      voluntaryContact: params.voluntaryContact,
      logs: [
        {
          timestamp: Date.now(),
          action: 'Emergency SOS Broadcasted (Zero-Auth Protocol)',
          actor: 'Anonymous Device ' + sessionToken
        },
        {
          timestamp: Date.now() + 200,
          action: 'Encrypted DHOST packet buffered and relayed via Mesh peer',
          actor: 'MESH_RELAY_A01'
        }
      ]
    };

    this.incidents.unshift(newPacket);
    this.persist(false);
    hardwareService.broadcastMeshEvent('NEW_INCIDENT', newPacket);
    return newPacket;
  }


  public createCommunityReport(params: {
    hazardType: string;
    description: string;
    peopleCount?: number;
    location: LocationData;
  }): EmergencyPacket {
    const sessionToken = sessionService.getAnonymousSessionToken();
    const hex = Math.floor(Math.random() * 0xFFFFFF).toString(16).toUpperCase().padStart(6, '0');
    const incidentId = 'DD-26-COM-' + hex;

    const newReport: EmergencyPacket = {
      incidentId,
      sessionToken,
      incidentType: 'COMMUNITY_REPORT',
      incidentCategoryLabel: 'Community Hazard: ' + params.hazardType,
      requestText: params.description.trim(),
      originalLanguage: 'English',
      translatedText: params.description.trim(),
      aiTriageCategory: 'Community Field Report (Unverified Crowd Intel)',
      priority: 'MEDIUM',
      peopleCount: params.peopleCount || 0,
      location: params.location,
      timestamp: Date.now(),
      batteryLevel: 90,
      relayStatus: 'MESH_RELAYED',
      hopCount: 2,
      dhostPath: ['CITIZEN_' + sessionToken.replace('DD-', ''), 'NEIGHBOR_RELAY', 'COMMAND_BASE_01'],
      status: 'REPORTED',
      isCommunityReport: true,
      logs: [
        {
          timestamp: Date.now(),
          action: 'Community Hazard Report submitted (Zero-Auth)',
          actor: 'Community Reporter ' + sessionToken
        }
      ]
    };

    this.incidents.unshift(newReport);
    this.persist();
    return newReport;
  }

  public createSafeCheckIn(params: {
    name?: string;
    message?: string;
    location: LocationData;
  }): EmergencyPacket {
    const sessionToken = sessionService.getAnonymousSessionToken();
    const hex = Math.floor(Math.random() * 0xFFFFFF).toString(16).toUpperCase().padStart(6, '0');
    const incidentId = 'DD-26-SAF-' + hex;

    const safePacket: EmergencyPacket = {
      incidentId,
      sessionToken,
      incidentType: 'SAFE_CHECKIN',
      incidentCategoryLabel: 'I AM SAFE Check-In',
      requestText: params.message || 'I am safe and in a secure shelter location.',
      originalLanguage: 'English',
      translatedText: params.message || 'I am safe and in a secure shelter location.',
      aiTriageCategory: 'P4 - Safety Check-In Beacon',
      priority: 'LOW',
      peopleCount: 1,
      location: params.location,
      timestamp: Date.now(),
      batteryLevel: 95,
      relayStatus: 'DIRECT',
      hopCount: 1,
      dhostPath: ['SAFE_DEVICE_' + sessionToken.replace('DD-', ''), 'COMMAND_BASE_01'],
      status: 'RESOLVED',
      isCommunityReport: false,
      voluntaryContact: {
        name: params.name || 'Anonymous Citizen'
      },
      logs: [
        {
          timestamp: Date.now(),
          action: 'Safe Beacon broadcasted across local DIOST Mesh',
          actor: params.name || 'Citizen ' + sessionToken
        }
      ]
    };

    this.incidents.unshift(safePacket);
    this.persist();
    return safePacket;
  }


  public assignTeam(incidentId: string, teamId: string, teamName: string, actor: string = 'Incident Commander'): EmergencyPacket | null {
    const inc = this.incidents.find(i => i.incidentId === incidentId);
    if (!inc) return null;

    inc.assignedTeamId = teamId;
    inc.assignedTeamName = teamName;
    if (inc.status === 'REPORTED') {
      inc.status = 'ACKNOWLEDGED';
    }
    inc.logs.push({
      timestamp: Date.now(),
      action: 'Assigned to ' + teamName + ' (' + teamId + ')',
      actor
    });

    this.persist();
    return inc;
  }

  public createVictimSos(params: {
    incidentType: IncidentType;
    requestText: string;
    originalLanguage?: string;
    peopleCount: number;
    location: LocationData;
    batteryLevel?: number;
    voluntaryContact?: {
      name?: string;
      phone?: string;
      medicalNotes?: string;
    };
  }): EmergencyPacket {
    return this.createVictimEmergency(params);
  }

  public resetToDefaults(): void {
    this.resetToSeed();
  }


  public updateStatus(incidentId: string, status: IncidentStatus, actor: string, note?: string): EmergencyPacket | null {
    const inc = this.incidents.find(i => i.incidentId === incidentId);
    if (!inc) return null;

    inc.status = status;
    inc.logs.push({
      timestamp: Date.now(),
      action: 'Status updated to ' + status,
      actor,
      note
    });

    this.persist();
    return inc;
  }


  public updatePriority(incidentId: string, priority: IncidentPriority, actor: string): EmergencyPacket | null {
    const inc = this.incidents.find(i => i.incidentId === incidentId);
    if (!inc) return null;

    const oldPriority = inc.priority;
    inc.priority = priority;
    inc.logs.push({
      timestamp: Date.now(),
      action: 'Priority changed from ' + oldPriority + ' to ' + priority,
      actor
    });

    this.persist();
    return inc;
  }


  public resetToSeed(): void {
    this.incidents = [...SEED_INCIDENTS];
    this.persist();
  }


  private getCategoryLabel(type: IncidentType): string {
    switch (type) {
      case 'FLOOD_TRAPPED': return 'Trapped in Rising Floodwater';
      case 'STRUCTURAL_COLLAPSE': return 'Structural Collapse / Entrapment';
      case 'MEDICAL_CRITICAL': return 'Critical Medical Emergency';
      case 'FIRE_HAZARD': return 'Active Fire Hazard';
      case 'LANDSLIDE': return 'Landslide & Blocked Access';
      case 'MISSING_PERSON': return 'Missing Person Report';
      case 'COMMUNITY_REPORT': return 'Community Hazard Report';
      case 'SAFE_CHECKIN': return 'I AM SAFE Status';
      default: return 'Emergency Assistance Request';
    }
  }
}

export const incidentService = new IncidentService();
