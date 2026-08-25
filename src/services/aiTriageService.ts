import { EmergencyPacket, IncidentPriority, UserRole, IncidentCluster, LocationConfidence } from '../types/dhostAuth';

export interface AiTriageAnalysis {
  urgencyScore: number; // 0 - 100
  suggestedPriority: IncidentPriority;
  recommendedTeamId: string;
  recommendedTeamName: string;
  reasoning: string;
  keyHazards: string[];
}

export const DEPLOYED_RESCUE_TEAMS = [
  {
    teamId: 'RSC-1042',
    name: 'Rescue Alpha (Sgt. Ananya Sen)',
    callSign: 'ALPHA-LEAD',
    type: 'GROUND_SEARCH_RESCUE',
    specialty: 'Urban Search, Collapse Extraction & First Aid',
    personnel: 6,
    equipment: '2 Inflatable Rafts, Hydraulic Cutters, Thermal Scanner',
    status: 'AVAILABLE',
    currentLocation: 'Fairlands Central Station',
    lat: 11.6685,
    lng: 78.1420
  },
  {
    teamId: 'RSC-1088',
    name: 'Rescue Bravo (Insp. Murugan)',
    callSign: 'BRAVO-WATER',
    type: 'FLOOD_BOAT_UNIT',
    specialty: 'Rapid Flood Evacuation & Deep Water Rescue',
    personnel: 8,
    equipment: '4 Motorized Zodiac Boats, Life Jackets, Winches',
    status: 'EN_ROUTE',
    currentLocation: 'Lakeview Submerged Sector',
    lat: 11.6640,
    lng: 78.1480
  },
  {
    teamId: 'MED-204',
    name: 'Med Triage 2 (Dr. K. Raghavan)',
    callSign: 'MED-CORPS-02',
    type: 'MOBILE_MEDICAL_TRAUMA',
    specialty: 'Advanced Trauma Stabilization & Pediatric Care',
    personnel: 5,
    equipment: 'Mobile Trauma Tent, Defibrillator, Oxygen Resupply',
    status: 'ON_SCENE',
    currentLocation: 'Anna Park Relief Hospital',
    lat: 11.6720,
    lng: 78.1390
  },
  {
    teamId: 'AIR-01',
    name: 'Coast Guard Helo (Wing Cmdr. Joseph)',
    callSign: 'AIR-LIFT-01',
    type: 'HELICOPTER_AIR_MEDEVAC',
    specialty: 'Rooftop Winch Air-Lift & Night FLIR Search',
    personnel: 4,
    equipment: 'Chetak Helo with Rescue Winch & Searchlights',
    status: 'AVAILABLE',
    currentLocation: 'Salem Sports Complex Helipad',
    lat: 11.6600,
    lng: 78.1350
  }
];

class AiTriageService {
  /**
   * Analyzes an emergency packet with AI NLP & Geospatial heuristic
   */
  public analyzeIncident(packet: EmergencyPacket): AiTriageAnalysis {
    const text = (packet.requestText + ' ' + (packet.translatedText || '')).toLowerCase();
    const type = packet.incidentType;
    let score = 50;
    const hazards: string[] = [];

    // Water level heuristics
    if (text.includes('chest') || text.includes('neck') || text.includes('roof') || text.includes('surging') || text.includes('flood') || text.includes('water')) {
      score += 25;
      hazards.push('Rapid Inundation / Water Surging Above Safe Levels');
    }

    // Collapse / Debris heuristics
    if (type === 'STRUCTURAL_COLLAPSE' || text.includes('trapped') || text.includes('debris') || text.includes('wall collapse')) {
      score += 25;
      hazards.push('Physical Structural Entrapment under Debris');
    }

    // Medical Trauma
    if (type === 'MEDICAL_CRITICAL' || text.includes('bleeding') || text.includes('heart') || text.includes('unconscious') || text.includes('infant') || text.includes('child')) {
      score += 20;
      hazards.push('Critical Medical Trauma / Vulnerable Population (Infant/Elderly)');
    }

    // People count multiplier
    if (packet.peopleCount >= 4) {
      score += 15;
      hazards.push(`High Density Group Casualty (${packet.peopleCount} individuals trapped)`);
    }

    // Battery depletion penalty
    if (packet.batteryLevel <= 20) {
      score += 10;
      hazards.push(`Critical Device Power Depletion (${packet.batteryLevel}% remaining)`);
    }

    score = Math.min(100, Math.max(15, score));

    // Priority mapping
    let suggestedPriority: IncidentPriority = 'MEDIUM';
    if (score >= 80) suggestedPriority = 'CRITICAL';
    else if (score >= 60) suggestedPriority = 'HIGH';
    else if (score >= 40) suggestedPriority = 'MEDIUM';
    else suggestedPriority = 'LOW';

    // Best Team matching
    let recTeam = DEPLOYED_RESCUE_TEAMS[0];
    let reasoning = 'Assigned to Urban Search & Rescue based on proximity.';

    if (text.includes('roof') || text.includes('isolated') || text.includes('winch')) {
      recTeam = DEPLOYED_RESCUE_TEAMS[3]; // Helo
      reasoning = 'AI recommends Air-Lift Helo (AIR-01) for isolated rooftop winch extraction.';
    } else if (type === 'FLOOD_TRAPPED' || text.includes('water') || text.includes('boat')) {
      recTeam = DEPLOYED_RESCUE_TEAMS[1]; // Boat unit
      reasoning = 'AI recommends Boat Unit (RSC-1088) with motorized rafts for deep water extraction.';
    } else if (type === 'MEDICAL_CRITICAL' || text.includes('doctor') || text.includes('oxygen') || text.includes('injury')) {
      recTeam = DEPLOYED_RESCUE_TEAMS[2]; // Medical
      reasoning = 'AI recommends Medical Rapid Triage (MED-204) for on-site medical stabilization.';
    } else {
      recTeam = DEPLOYED_RESCUE_TEAMS[0]; // Rescue Alpha
      reasoning = 'AI recommends Rescue Alpha (RSC-1042) for ground search & extraction.';
    }

    return {
      urgencyScore: score,
      suggestedPriority,
      recommendedTeamId: recTeam.teamId,
      recommendedTeamName: recTeam.name,
      reasoning,
      keyHazards: hazards
    };
  }

  /**
   * Sorts incidents automatically using AI Urgency Score
   */
  public sortIncidentsByUrgency(incidents: EmergencyPacket[]): EmergencyPacket[] {
    return [...incidents].sort((a, b) => {
      const aResolved = a.status === 'RESOLVED' || a.status === 'RESCUED';
      const bResolved = b.status === 'RESOLVED' || b.status === 'RESCUED';
      if (aResolved && !bResolved) return 1;
      if (!aResolved && bResolved) return -1;

      const aScore = this.analyzeIncident(a).urgencyScore;
      const bScore = this.analyzeIncident(b).urgencyScore;
      return bScore - aScore;
    });
  }

  /**
   * Duplicate Incident Spatial Clustering
   * Groups nearby reports within radius (e.g. 250m) into single actionable clusters
   */
  public clusterIncidents(incidents: EmergencyPacket[], radiusMeters: number = 250): IncidentCluster[] {
    const clusters: IncidentCluster[] = [];
    const visited = new Set<string>();

    // Haversine distance in meters
    const getDistanceMeters = (lat1: number, lon1: number, lat2: number, lon2: number) => {
      const R = 6371e3; // metres
      const φ1 = (lat1 * Math.PI) / 180;
      const φ2 = (lat2 * Math.PI) / 180;
      const Δφ = ((lat2 - lat1) * Math.PI) / 180;
      const Δλ = ((lon2 - lon1) * Math.PI) / 180;

      const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      return R * c;
    };

    incidents.forEach((inc, index) => {
      if (visited.has(inc.incidentId) || inc.status === 'RESOLVED') return;

      const clusterGroup: EmergencyPacket[] = [inc];
      visited.add(inc.incidentId);

      incidents.forEach((other) => {
        if (inc.incidentId !== other.incidentId && !visited.has(other.incidentId) && other.status !== 'RESOLVED') {
          const dist = getDistanceMeters(inc.location.lat, inc.location.lng, other.location.lat, other.location.lng);
          if (dist <= radiusMeters) {
            clusterGroup.push(other);
            visited.add(other.incidentId);
          }
        }
      });

      const totalPeople = clusterGroup.reduce((sum, item) => sum + item.peopleCount, 0);
      const hasCritical = clusterGroup.some(item => item.priority === 'CRITICAL');

      clusters.push({
        clusterId: `CLUST-${(index + 1).toString().padStart(2, '0')}`,
        clusterName: `${inc.incidentCategoryLabel} Cluster (${inc.location.landmark || 'Fairlands Sector'})`,
        centerLat: inc.location.lat,
        centerLng: inc.location.lng,
        radiusMeters,
        totalIncidents: clusterGroup.length,
        totalPeople,
        consolidatedPriority: hasCritical || totalPeople >= 6 ? 'CRITICAL' : 'HIGH',
        incidentIds: clusterGroup.map(i => i.incidentId),
        landmark: inc.location.landmark || inc.location.address || 'Disaster Sector'
      });
    });

    return clusters;
  }
}

export const aiTriageService = new AiTriageService();
