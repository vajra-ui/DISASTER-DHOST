import { CommunityReport, EmergencyServicePOI, LocationCoordinate, RouteOption, UserProfile } from '../types/safety';

export const INITIAL_USER_PROFILE: UserProfile = {
  name: 'Vajra',
  phone: '+91 98765 43210',
  bloodGroup: 'O+',
  emergencyNotes: 'Contact family first in emergency. No medication allergies.',
  autoAlertEmergencies: true,
  trustedCircle: [
    {
      id: 'tc-1',
      name: 'Priya Sharma',
      relation: 'Sister',
      phone: '+91 98765 43211',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      status: 'Available',
      autoAlertOnEmergency: true,
      notifyOnStart: true,
      notifyOnArrival: true
    },
    {
      id: 'tc-2',
      name: 'Rajesh Kumar',
      relation: 'Father',
      phone: '+91 98765 43212',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      status: 'Available',
      autoAlertOnEmergency: true,
      notifyOnStart: true,
      notifyOnArrival: true
    },
    {
      id: 'tc-3',
      name: 'Dr. Ananya Iyer',
      relation: 'Friend',
      phone: '+91 98765 43213',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      status: 'Available',
      autoAlertOnEmergency: true,
      notifyOnStart: false,
      notifyOnArrival: true
    }
  ]
};

// Default Route Options (A, B, C matching exact prompt requirements)
export const DEFAULT_ROUTES: { safest: RouteOption; balanced: RouteOption; fastest: RouteOption } = {
  safest: {
    id: 'safest',
    title: 'Route A',
    tagline: 'Via Main Boulevard & Central Avenue',
    badgeText: 'RECOMMENDED',
    badgeType: 'safe',
    safetyScore: 94,
    distanceKm: 3.2,
    durationMinutes: 18,
    isRecommended: true,
    indicators: {
      lighting: 'Well lit',
      crowd: 'High',
      risk: 'Low',
      policeProximity: 'Police post 350m away'
    },
    explanation: 'Safety Dosth recommends Route A because it prioritizes safety over travel time with continuous street lighting, high footfall, and CCTV coverage.',
    coordinates: [
      [11.6643, 78.1460],
      [11.6660, 78.1450],
      [11.6685, 78.1430],
      [11.6710, 78.1400],
      [11.6708, 78.1370],
      [11.6705, 78.1338]
    ],
    instructions: [
      { text: 'Head north on Main Avenue (High Lighting)', maneuver: 'depart', distanceMeters: 450, streetName: 'Main Boulevard', lat: 11.6643, lng: 78.1460 },
      { text: 'Turn left onto Central Boulevard past Police Station', maneuver: 'turn-left', distanceMeters: 800, streetName: 'Central Blvd', lat: 11.6660, lng: 78.1450 },
      { text: 'Continue straight along illuminated commercial shops', maneuver: 'straight', distanceMeters: 1200, streetName: 'Commercial Way', lat: 11.6685, lng: 78.1430 },
      { text: 'Arrive safely at destination', maneuver: 'arrive', distanceMeters: 300, streetName: 'Destination Approach', lat: 11.6705, lng: 78.1338 }
    ]
  },
  balanced: {
    id: 'balanced',
    title: 'Route B',
    tagline: 'Via Outer Ring Road Corridor',
    badgeText: 'BALANCED',
    badgeType: 'balanced',
    safetyScore: 86,
    distanceKm: 2.8,
    durationMinutes: 15,
    isRecommended: false,
    indicators: {
      lighting: 'Moderate',
      crowd: 'Moderate',
      risk: 'Low',
      policeProximity: 'Police post 750m away'
    },
    explanation: 'Balanced option with moderate vehicle flow and good main road visibility.',
    coordinates: [
      [11.6643, 78.1460],
      [11.6670, 78.1440],
      [11.6690, 78.1380],
      [11.6705, 78.1338]
    ],
    instructions: [
      { text: 'Head northeast on Ring Road', maneuver: 'depart', distanceMeters: 900, streetName: 'Ring Rd', lat: 11.6643, lng: 78.1460 },
      { text: 'Turn right onto Junction Link', maneuver: 'turn-right', distanceMeters: 1400, streetName: 'Link Rd', lat: 11.6670, lng: 78.1440 }
    ]
  },
  fastest: {
    id: 'fastest',
    title: 'Route C',
    tagline: 'Via Meyyanur Residential Alleys',
    badgeText: 'FASTEST',
    badgeType: 'speed',
    safetyScore: 71,
    distanceKm: 2.2,
    durationMinutes: 11,
    isRecommended: false,
    indicators: {
      lighting: 'Low',
      crowd: 'Low',
      risk: 'Moderate',
      policeProximity: 'Police post 1.6km away'
    },
    explanation: 'Shorter distance but cuts through dim residential lanes with lower footfall.',
    coordinates: [
      [11.6643, 78.1460],
      [11.6630, 78.1410],
      [11.6625, 78.1360],
      [11.6660, 78.1340],
      [11.6705, 78.1338]
    ],
    instructions: [
      { text: 'Cut west through 2nd Cross lane', maneuver: 'depart', distanceMeters: 600, streetName: '2nd Cross', lat: 11.6643, lng: 78.1460 },
      { text: 'Turn onto Backlane Alley (Low lighting)', maneuver: 'turn-left', distanceMeters: 850, streetName: 'Backlane', lat: 11.6630, lng: 78.1410 }
    ]
  }
};

export const SEED_EMERGENCY_SERVICES: EmergencyServicePOI[] = [
  {
    id: 'poi-pol-1',
    name: 'Town Central Police Station',
    type: 'police',
    address: 'Near Old Bus Stand, Fort Main Rd',
    phone: '0427-2210100',
    location: { lat: 11.6540, lng: 78.1520 },
    isOpen24x7: true,
    distanceKm: 0.4
  },
  {
    id: 'poi-pol-2',
    name: 'All Women Police Station',
    type: 'police',
    address: 'Suramangalam Main Rd',
    phone: '0427-2448100',
    location: { lat: 11.6750, lng: 78.1300 },
    isOpen24x7: true,
    distanceKm: 1.2
  },
  {
    id: 'poi-hosp-1',
    name: 'Govt. Medical Hospital (Casualty)',
    type: 'hospital',
    address: 'Fort Rd (24/7 Trauma Unit)',
    phone: '0427-2211200',
    location: { lat: 11.6580, lng: 78.1580 },
    isOpen24x7: true,
    distanceKm: 0.7
  },
  {
    id: 'poi-haven-1',
    name: 'Apollo 24/7 Pharmacy & Safe Shelter',
    type: 'safe_haven',
    address: 'Fairlands Main Rd (CCTV & Security)',
    phone: '1860-500-0101',
    location: { lat: 11.6660, lng: 78.1420 },
    isOpen24x7: true,
    distanceKm: 0.3
  }
];

export const POPULAR_SAFE_DESTINATIONS = [
  { name: 'Central Bus Stand Terminal', address: 'Meyyanur Bypass, Salem', category: 'Transit' },
  { name: 'City Hospital (Trauma Center)', address: 'Fort Rd, Salem', category: 'Medical' },
  { name: 'IT Tech Park', address: 'Junction Main Rd, Salem', category: 'Work' },
  { name: 'Saradha College Campus', address: 'Saradha College Rd, Salem', category: 'Education' }
];
