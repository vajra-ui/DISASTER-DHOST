export type TravelMode = 'walk' | 'bike' | 'drive' | 'transit';

export type MainNavTab = 'home' | 'journey' | 'safety_insights' | 'contacts' | 'profile';

export type ActiveAppView = 
  | 'main'               // Main tab bar view (Home, Journey, Insights, Contacts, Profile)
  | 'search'             // Destination search overlay
  | 'route_selection'    // 45% map + Route A/B/C cards
  | 'live_journey'       // Calm Live Journey Navigation HUD
  | 'emergency'          // Dedicated Press-and-Hold SOS screen
  | 'safety_check';      // Safety check prompt

export type ReportCategory = 
  | 'poor_lighting'
  | 'suspicious_activity'
  | 'unsafe_area'
  | 'road_hazard'
  | 'harassment_concern'
  | 'accident'
  | 'police_presence'
  | 'safe_haven'
  | 'other';

export type VerificationStatus = 'VERIFIED' | 'COMMUNITY' | 'UNVERIFIED';

export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';

export interface LocationCoordinate {
  lat: number;
  lng: number;
  name?: string;
  address?: string;
}

export interface RouteOption {
  id: 'safest' | 'fastest' | 'balanced';
  title: string;
  tagline: string;
  badgeText: string;
  badgeType: 'safe' | 'speed' | 'balanced';
  distanceKm: number;
  durationMinutes: number;
  safetyScore: number; // e.g. 94 for Route A, 86 for Route B, 71 for Route C
  coordinates: [number, number][]; // [lat, lng] array
  instructions: TurnInstruction[];
  isRecommended: boolean;
  indicators: {
    lighting: 'Well lit' | 'Moderate' | 'Low';
    crowd: 'High' | 'Moderate' | 'Low';
    risk: 'Low' | 'Moderate' | 'High';
    policeProximity: string;
  };
  explanation: string;
}

export interface TurnInstruction {
  text: string;
  maneuver: 'depart' | 'turn-left' | 'turn-right' | 'straight' | 'slight-left' | 'slight-right' | 'roundabout' | 'arrive';
  distanceMeters: number;
  streetName: string;
  lat: number;
  lng: number;
}

export interface CommunityReport {
  id: string;
  category: ReportCategory;
  title: string;
  description: string;
  location: LocationCoordinate;
  timestamp: string;
  severity: SeverityLevel;
  status: VerificationStatus;
  upvotes: number;
  downvotes: number;
  reporterName?: string;
  isDemo?: boolean;
}

export interface TrustedContact {
  id: string;
  name: string;
  relation: string;
  phone: string;
  avatarUrl?: string;
  status: 'Available' | 'Active on Trip' | 'Offline';
  autoAlertOnEmergency: boolean;
  notifyOnStart: boolean;
  notifyOnArrival: boolean;
}

export interface EmergencyServicePOI {
  id: string;
  name: string;
  type: 'police' | 'hospital' | 'safe_haven';
  address: string;
  phone: string;
  location: LocationCoordinate;
  isOpen24x7: boolean;
  distanceKm?: number;
}

export interface UserProfile {
  name: string;
  phone: string;
  bloodGroup: string;
  emergencyNotes: string;
  autoAlertEmergencies: boolean;
  trustedCircle: TrustedContact[];
}

export interface ActiveJourneyState {
  isActive: boolean;
  isPaused: boolean;
  selectedRoute: RouteOption | null;
  startLocation: LocationCoordinate;
  destinationLocation: LocationCoordinate;
  currentStepIndex: number;
  currentCoordinate: LocationCoordinate;
  distanceRemainingKm: number;
  timeRemainingMinutes: number;
  averageSpeedKmh: number;
  startTime: number;
  batteryLevel: number;
  liveSafetyScore: number;
  indicators: {
    crowd: 'High' | 'Moderate' | 'Low';
    lighting: 'Good' | 'Fair' | 'Poor';
    risk: 'Low' | 'Moderate' | 'High';
    network: 'Strong' | 'Medium' | 'Weak';
  };
}
