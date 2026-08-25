export type UserRole = 'COMMANDER' | 'RESCUE_TEAM' | 'MEDICAL' | 'VOLUNTEER';

export type AuthStatus = 
  | 'GUEST' 
  | 'RESPONDER_AUTHENTICATED' 
  | 'COMMANDER_AUTHENTICATED' 
  | 'MEDICAL_AUTHENTICATED' 
  | 'OFFLINE_TRUSTED' 
  | 'UNAUTHORIZED';

export type NetworkMode = 'ONLINE' | 'OFFLINE_MESH' | 'CELLULAR_DEGRADED';

export type IncidentPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type IncidentStatus = 
  | 'REPORTED' 
  | 'ACKNOWLEDGED' 
  | 'EN_ROUTE' 
  | 'ON_SCENE' 
  | 'RESCUED' 
  | 'STABILIZED' 
  | 'RESOLVED';

export type IncidentType = 
  | 'FLOOD_TRAPPED' 
  | 'STRUCTURAL_COLLAPSE' 
  | 'MEDICAL_CRITICAL' 
  | 'FIRE_HAZARD' 
  | 'LANDSLIDE' 
  | 'MISSING_PERSON' 
  | 'COMMUNITY_REPORT' 
  | 'SAFE_CHECKIN';

export type LocationConfidence = 'HIGH' | 'MEDIUM' | 'APPROXIMATE';

export interface LocationData {
  lat: number;
  lng: number;
  address: string;
  landmark: string;
  accuracyMeters: number;
  confidence?: LocationConfidence;
  lastKnownTimestamp?: number;
}

export interface HopPathDetail {
  nodeId: string;
  nodeName: string;
  role: 'VICTIM_ORIGIN' | 'RELAY' | 'RESCUE_VEHICLE' | 'COMMAND_HQ';
  protocol: 'BLUETOOTH' | 'WIFI_DIRECT' | 'LORA_MESH' | 'SAT_GATEWAY';
  timestamp: number;
  latencyMs: number;
}

export interface EmergencyPacketLog {
  timestamp: number;
  action: string;
  actor: string;
  note?: string;
}

export interface EmergencyPacket {
  incidentId: string;
  sessionToken: string;
  incidentType: IncidentType;
  incidentCategoryLabel: string;
  requestText: string;
  originalLanguage: string;
  translatedText: string;
  aiTriageCategory: string;
  priority: IncidentPriority;
  peopleCount: number;
  location: LocationData;
  timestamp: number;
  batteryLevel: number;
  relayStatus: 'DIRECT' | 'MESH_RELAYED' | 'STORE_AND_FORWARD';
  hopCount: number;
  dhostPath: string[];
  hopPathDetails?: HopPathDetail[];
  status: IncidentStatus;
  assignedTeamId?: string;
  assignedTeamName?: string;
  isCommunityReport?: boolean;
  isSurvivalMode?: boolean;
  isLastGaspLocation?: boolean;
  photoClue?: string;
  packetHash?: string;
  voluntaryContact?: {
    name?: string;
    phone?: string;
    medicalNotes?: string;
  };
  logs: EmergencyPacketLog[];
}

export interface IncidentCluster {
  clusterId: string;
  clusterName: string;
  centerLat: number;
  centerLng: number;
  radiusMeters: number;
  totalIncidents: number;
  totalPeople: number;
  consolidatedPriority: IncidentPriority;
  incidentIds: string[];
  landmark: string;
}

export interface ResponderUser {
  responderId: string;
  name: string;
  role: UserRole;
  organization: string;
  unitDesignation: string;
  badgeNumber: string;
  isTrustedDevice: boolean;
  lastOnlineAuthTimestamp: number;
  sessionToken: string;
  status: 'AVAILABLE' | 'EN_ROUTE' | 'ON_SCENE' | 'OFF_DUTY';
  currentCoords?: {
    lat: number;
    lng: number;
  };
}

export interface TrustedSessionState {
  token: string;
  responder: ResponderUser;
  deviceFingerprint: string;
  authenticatedAt: number;
  expiresAt: number;
}