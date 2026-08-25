import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  ArrowLeft, 
  Layers, 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  ShieldAlert, 
  AlertOctagon, 
  Radio, 
  Truck, 
  Anchor, 
  Compass, 
  Navigation, 
  Eye, 
  Zap, 
  Activity, 
  Users, 
  Clock, 
  CheckCircle2, 
  X, 
  Plus, 
  LifeBuoy, 
  Heart, 
  ChevronRight, 
  ShieldCheck, 
  Brain, 
  Sliders, 
  Plane, 
  AlertTriangle,
  Flame,
  Wind,
  Biohazard,
  Mountain,
  Building,
  Info,
  Maximize2
} from 'lucide-react';
import { EmergencyPacket, IncidentPriority } from '../../types/dhostAuth';

export type DisasterCategory = 
  | 'FLOOD' 
  | 'EARTHQUAKE' 
  | 'WILDFIRE' 
  | 'CYCLONE' 
  | 'CHEMICAL_HAZMAT' 
  | 'LANDSLIDE';

interface Props {
  incidents: EmergencyPacket[];
  onSelectIncident?: (incident: EmergencyPacket) => void;
  onClose: () => void;
}

export interface RescuePossibility {
  id: string;
  name: string;
  vehicleName: string;
  feasibilityScore: number;
  etaMins: number;
  capacity: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  routeDescription: string;
  pros: string[];
  cons: string[];
  actionStatus: string;
}

interface DisasterConfig {
  id: DisasterCategory;
  name: string;
  icon: string;
  color: string;
  scenarioTitle: string;
  incidentLandmark: string;
  casualtySummary: string;
  hazardDescription: string;
  skyColor: number;
  fogColor: number;
  incidentPos: [number, number, number];
  safeZonePos: [number, number, number];
  safeZoneName: string;
  cameraIncidentPos: [number, number, number];
  options: RescuePossibility[];
}

/**
 * 6 Disaster Configurations with Unique Spatial 3D Locations & Real-Time AI Strategies
 */
const DISASTER_CONFIGS: Record<DisasterCategory, DisasterConfig> = {
  FLOOD: {
    id: 'FLOOD',
    name: 'Flood / Tsunami',
    icon: '🌊',
    color: 'from-blue-600 to-cyan-500',
    scenarioTitle: 'Urban Inundation (4.2ft Surge)',
    incidentLandmark: 'Old Bridge Sector Flooded Rooftop',
    casualtySummary: '14 Stranded on Rooftop • 2 Fractures',
    hazardDescription: 'Rapid 4.2ft currents, submerged 11kV lines',
    skyColor: 0x020617,
    fogColor: 0x031525,
    incidentPos: [-18, 12, 12],
    safeZonePos: [50, 18, -45],
    safeZoneName: '🏥 Govt Hospital High-Ground Shelter',
    cameraIncidentPos: [-28, 22, 28],
    options: [
      {
        id: 'ZODIAC_BOAT',
        name: 'Option A: Zodiac Rescue Raft (Boat #02)',
        vehicleName: 'Team Bravo Zodiac Raft',
        feasibilityScore: 94,
        etaMins: 8,
        capacity: '14+ People (100% Extrication)',
        riskLevel: 'LOW',
        routeDescription: 'Deep River Channel (4.8km Safe Approach)',
        pros: ['Shallow 4.2ft draft optimal', 'Direct rooftop tethering', 'Low structural risk'],
        cons: ['Slightly slower than helicopter'],
        actionStatus: '🚤 Cruising River Channel ➔ Winch Extrication ➔ Hospital Safe'
      },
      {
        id: 'HELO_WINCH',
        name: 'Option B: Coast Guard Helo AIR-01 Winch',
        vehicleName: 'Coast Guard Helo Air-1',
        feasibilityScore: 78,
        etaMins: 4,
        capacity: '4 People / Lift (Requires 3 Sorties)',
        riskLevel: 'MEDIUM',
        routeDescription: 'Direct Aerial Ingress (Altitude 35m)',
        pros: ['Fastest arrival (4 mins)', 'Immediate triage for 2 fracture casualties'],
        cons: ['45 km/h high wind gusts', 'Rotor downwash on flooded structures'],
        actionStatus: '🚁 Aerial Ingress ➔ Rooftop Hover ➔ Winch Basket Hoist'
      },
      {
        id: 'TACTICAL_TRUCK',
        name: 'Option C: 4x4 Tactical Rescue Truck',
        vehicleName: 'Rescue Alpha Tactical 4x4',
        feasibilityScore: 42,
        etaMins: 22,
        capacity: '18 People Max',
        riskLevel: 'HIGH',
        routeDescription: 'Submerged Road (North Bridge Crossing)',
        pros: ['Heavy extrication gear on board'],
        cons: ['Water level (4.2ft) exceeds 3.5ft air-intake', 'Downed 11kV lines on roadway'],
        actionStatus: '⚠️ Bridge Cross Attempt ➔ Stalled by 4.2ft Water ➔ AI Reroute Alert'
      }
    ]
  },

  EARTHQUAKE: {
    id: 'EARTHQUAKE',
    name: 'Earthquake / Collapse',
    icon: '🏚️',
    color: 'from-amber-600 to-stone-500',
    scenarioTitle: 'Magnitude 6.8 Urban Rupture',
    incidentLandmark: 'Downtown Central Tower Rubble Void',
    casualtySummary: '9 Trapped in Basement Rubble Void',
    hazardDescription: 'Aftershock collapse hazard, gas lines, unstable slabs',
    skyColor: 0x0f172a,
    fogColor: 0x1c1917,
    incidentPos: [-35, 2.5, -20],
    safeZonePos: [45, 2, 40],
    safeZoneName: '🏟️ City Stadium Seismic Relief Base',
    cameraIncidentPos: [-45, 15, -5],
    options: [
      {
        id: 'K9_ACOUSTIC',
        name: 'Option A: K-9 Search & Void Breachers',
        vehicleName: 'NDRF Heavy Extrication Breachers',
        feasibilityScore: 92,
        etaMins: 6,
        capacity: '9 Trapped Survivors',
        riskLevel: 'LOW',
        routeDescription: 'Stable Eastern Seismic Corridor',
        pros: ['Acoustic life-detectors locate trapped voids', 'Zero dynamic slab vibration'],
        cons: ['Manual micro-hydraulic cutting required'],
        actionStatus: '🐕 K9 Void Detection ➔ Micro-Hydraulic Breaching ➔ Safe Extrication'
      },
      {
        id: 'HELO_CRANE',
        name: 'Option B: Airborne Heavy Helo Shoring',
        vehicleName: 'Heavy Lift Helo Sky-Crane',
        feasibilityScore: 81,
        etaMins: 5,
        capacity: '4 Victims / Sortie',
        riskLevel: 'MEDIUM',
        routeDescription: 'Direct Skyway Void Access',
        pros: ['Rapid roof slab stabilization', 'Direct extraction for trauma patients'],
        cons: ['Rotor turbulence may shift loose rubble'],
        actionStatus: '🚁 Overhead Void Stabilizing ➔ Winch Harness Lift ➔ Base'
      },
      {
        id: 'HEAVY_EXCAVATOR',
        name: 'Option C: Heavy Tracked Excavator',
        vehicleName: 'Heavy Tracked Digger Unit',
        feasibilityScore: 38,
        etaMins: 18,
        capacity: 'Road Clearing Only',
        riskLevel: 'HIGH',
        routeDescription: 'Blocked Rubble Main Street',
        pros: ['Clears heavy 10-ton concrete debris'],
        cons: ['Vibration triggers secondary void collapses!', 'Gas main ignition risk'],
        actionStatus: '⚠️ Excavator Vibration Risk ➔ Secondary Collapse Threat'
      }
    ]
  },

  WILDFIRE: {
    id: 'WILDFIRE',
    name: 'Wildfire / Inferno',
    icon: '🔥',
    color: 'from-red-600 to-orange-500',
    scenarioTitle: 'Fast Crown Fire Front (28 km/h)',
    incidentLandmark: 'East Forest Timber Factory Perimeter',
    casualtySummary: '16 Trapped in Concrete Fire Shelter',
    hazardDescription: '850°C heat, zero-visibility toxic smoke',
    skyColor: 0x270707,
    fogColor: 0x3d0c02,
    incidentPos: [35, 7, 30],
    safeZonePos: [-45, 2, -35],
    safeZoneName: '⚓ Upwind Marine Pier Shelter',
    cameraIncidentPos: [25, 20, 48],
    options: [
      {
        id: 'AIR_BOMBER',
        name: 'Option A: Bambi Bucket Helo Water Drop',
        vehicleName: 'Fire Bomber Helo AIR-01',
        feasibilityScore: 96,
        etaMins: 3,
        capacity: '16 Trapped Evacuees',
        riskLevel: 'LOW',
        routeDescription: 'Thermal FLIR Clear Skyway',
        pros: ['Suppresses thermal barrier with 2,000L drop', 'Cools escape corridor'],
        cons: ['Requires turnaround refill cycle'],
        actionStatus: '🛩️ 2000L Fire Retardant Drop ➔ Thermal Corridor Clear'
      },
      {
        id: 'FOAM_TENDER',
        name: 'Option B: Armored Foam Tender Unit',
        vehicleName: 'Industrial Foam Tender Squad',
        feasibilityScore: 74,
        etaMins: 7,
        capacity: '12 People',
        riskLevel: 'MEDIUM',
        routeDescription: 'Wetted Road Perimeter (South)',
        pros: ['Positive-pressure cabin protects crew', 'High-volume chemical foam'],
        cons: ['Radiant heat risks tire degradation'],
        actionStatus: '🚒 Foam Curtain Deployed ➔ Fire Barrier Breached ➔ Loaded'
      },
      {
        id: 'FOOT_EVAC',
        name: 'Option C: Ground Foot Escort',
        vehicleName: 'Volunteer Ground Trail Guide',
        feasibilityScore: 19,
        etaMins: 25,
        capacity: 'Unpredictable',
        riskLevel: 'HIGH',
        routeDescription: 'Unpaved Ridge Trail Corridor',
        pros: ['No vehicle reliance'],
        cons: ['CRITICAL: Fire moving at 28 km/h will cut off ridge in 4 mins!'],
        actionStatus: '🚨 HIGH HAZARD: Fire Flashover Threat! Trail engulfed.'
      }
    ]
  },

  CYCLONE: {
    id: 'CYCLONE',
    name: 'Cyclone / Hurricane',
    icon: '🌪️',
    color: 'from-teal-600 to-cyan-700',
    scenarioTitle: 'Category 4 Squall (140 km/h Gusts)',
    incidentLandmark: 'Coastal Fishermen Community Hall',
    casualtySummary: '11 Stranded in Coastal Hall',
    hazardDescription: 'Airborne metal sheet debris, severed power grid',
    skyColor: 0x04131e,
    fogColor: 0x08253a,
    incidentPos: [-45, 5, 35],
    safeZonePos: [40, 14, -20],
    safeZoneName: '🛡️ Reinforced Inland Cyclone Bunker',
    cameraIncidentPos: [-55, 18, 50],
    options: [
      {
        id: 'ARMORED_4X4',
        name: 'Option A: Heavy Armored Storm Transport',
        vehicleName: 'Tactical Storm Rescue Transport',
        feasibilityScore: 89,
        etaMins: 9,
        capacity: '11 Stranded Civilians',
        riskLevel: 'LOW',
        routeDescription: 'Leeward Protected Urban Avenue',
        pros: ['Reinforced polycarbonate windshield', 'Low center of gravity'],
        cons: ['Slow speed in heavy rain squall'],
        actionStatus: '🚜 Armored Transport Navigating 140km/h Winds ➔ Safe Base'
      },
      {
        id: 'JET_BOAT',
        name: 'Option B: Water-Jet Shallow Craft',
        vehicleName: 'Coastal Jet Rescue Craft',
        feasibilityScore: 72,
        etaMins: 11,
        capacity: '8 People / Trip',
        riskLevel: 'MEDIUM',
        routeDescription: 'Inland Drainage Canal',
        pros: ['Jet propulsion immune to floating debris'],
        cons: ['Severe chop & 3m surge waves'],
        actionStatus: '🚤 Jet Craft Cutting Through Surge Waves ➔ Pier Extraction'
      },
      {
        id: 'AIR_HELO',
        name: 'Option C: Rotary Aircraft',
        vehicleName: 'Coast Guard Helo Air-1',
        feasibilityScore: 28,
        etaMins: 6,
        capacity: '4 People',
        riskLevel: 'HIGH',
        routeDescription: 'Direct Skyway Vector',
        pros: ['Rapid transit'],
        cons: ['GROUNDED: Wind gusts (140 km/h) exceed 75 km/h rotor limits!'],
        actionStatus: '⛔ FLIGHT HALTED: Dangerous wind shear exceeds limits!'
      }
    ]
  },

  CHEMICAL_HAZMAT: {
    id: 'CHEMICAL_HAZMAT',
    name: 'Chemical / Hazmat Gas',
    icon: '☣️',
    color: 'from-emerald-600 to-lime-500',
    scenarioTitle: 'Toxic Industrial Vapor Plume',
    incidentLandmark: 'North Chemical Processing Reactor',
    casualtySummary: '8 Workers Trapped in Control Room',
    hazardDescription: 'Lethal LC50 gas plume, caustic vapor burns',
    skyColor: 0x031c12,
    fogColor: 0x062d1d,
    incidentPos: [0, 5, -50],
    safeZonePos: [-35, 2, 45],
    safeZoneName: '☣️ Mobile Decontamination Base',
    cameraIncidentPos: [-12, 18, -32],
    options: [
      {
        id: 'HAZMAT_DRONE_SCBA',
        name: 'Option A: Positive-Pressure Level-A SCBA',
        vehicleName: 'NDRF Level-A Hazmat Unit',
        feasibilityScore: 95,
        etaMins: 5,
        capacity: '8 Trapped Personnel',
        riskLevel: 'LOW',
        routeDescription: 'Upwind Safe North Access',
        pros: ['Self-Contained Breathing Apparatus', 'Vapor-tight chemical suits', 'Decon pod on site'],
        cons: ['45-min air cylinder limit'],
        actionStatus: '🤖 Hazmat Squad in Gas-Tight Suits ➔ Decon Extrication'
      },
      {
        id: 'OVERHEAD_HELO',
        name: 'Option B: Helo Thermal Gas Mapping',
        vehicleName: 'FLIR Hazmat Aerial Recon Helo',
        feasibilityScore: 79,
        etaMins: 4,
        capacity: 'Aerial Guide Only',
        riskLevel: 'MEDIUM',
        routeDescription: 'Crosswind High Elevation (60m)',
        pros: ['Maps gas plume boundary with optical gas imaging'],
        cons: ['Rotor downdraft may disperse toxic cloud'],
        actionStatus: '🚁 Infrared Gas Mapping ➔ Guiding Ground Teams'
      },
      {
        id: 'STANDARD_AMBULANCE',
        name: 'Option C: Civilian Ambulance',
        vehicleName: 'City Ambulance Unit #04',
        feasibilityScore: 15,
        etaMins: 10,
        capacity: '4 Patients',
        riskLevel: 'HIGH',
        routeDescription: 'Downwind Main Highway',
        pros: ['General medical care'],
        cons: ['FATAL: Standard filters fail against chlorine gas! Inhalation risk.'],
        actionStatus: '⛔ HAZMAT WARNING: Toxic zone entered! Retreat ordered.'
      }
    ]
  },

  LANDSLIDE: {
    id: 'LANDSLIDE',
    name: 'Landslide / Avalanche',
    icon: '🏔️',
    color: 'from-amber-700 to-yellow-600',
    scenarioTitle: 'Slope Failure Burying Valley Highway',
    incidentLandmark: 'Mountain Pass Valley Roadway',
    casualtySummary: '12 Stranded in Mountain Bus',
    hazardDescription: 'Secondary slope failure risk, severed access road',
    skyColor: 0x0a101d,
    fogColor: 0x141a29,
    incidentPos: [-25, 6, -35],
    safeZonePos: [45, 22, 25],
    safeZoneName: '🚁 Alpine Heli-Plateau Safe Zone',
    cameraIncidentPos: [-35, 18, -18],
    options: [
      {
        id: 'LONG_LINE_HELO',
        name: 'Option A: Mountain Helo Long-Line Winch',
        vehicleName: 'Mountain Air-Rescue Helo AIR-01',
        feasibilityScore: 93,
        etaMins: 4,
        capacity: '12 Stranded Passengers',
        riskLevel: 'LOW',
        routeDescription: 'Clear Ridge Aerial Insertion',
        pros: ['Avoids unstable mudflow below', 'Rapid direct hoisting from bus roof'],
        cons: ['Mountain updraft turbulence'],
        actionStatus: '🚁 Long-Line Winch Hoisting Passengers ➔ Heli-Pad Safe'
      },
      {
        id: 'ROPE_RESCUE',
        name: 'Option B: Alpine High-Angle Rope Rig',
        vehicleName: 'Alpine Technical Rescue Team',
        feasibilityScore: 84,
        etaMins: 12,
        capacity: '12 Passengers',
        riskLevel: 'MEDIUM',
        routeDescription: 'Upper Cliff Stable Anchor System',
        pros: ['High safety factor steel zip-line', 'Operates in zero visibility'],
        cons: ['Requires 12 mins to set up anchor ropes'],
        actionStatus: '🧗 High-Angle Rope Rig Deployed ➔ Zipline to Upper Cliff'
      },
      {
        id: 'GROUND_TRUCK',
        name: 'Option C: Highway Patrol Truck',
        vehicleName: 'District Highway Patrol Truck',
        feasibilityScore: 22,
        etaMins: 30,
        capacity: '10 People',
        riskLevel: 'HIGH',
        routeDescription: 'Severed Valley Road',
        pros: ['Carries generator'],
        cons: ['BLOCKED: Highway washed away by 300m mudflow slide!'],
        actionStatus: '⛔ ROAD SEVERED: Mudflow blocks roadway. Vehicle stuck.'
      }
    ]
  }
};

/**
 * Procedural Facade Texture Generator
 */
function createFacadeTexture(type: 'OFFICE' | 'APARTMENT' | 'HOSPITAL'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = type === 'HOSPITAL' ? '#1e293b' : '#0f172a';
  ctx.fillRect(0, 0, 512, 512);

  const rows = 8;
  const cols = 8;
  const rowHeight = 512 / rows;
  const colWidth = 512 / cols;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * colWidth + 8;
      const y = r * rowHeight + 8;
      const w = colWidth - 16;
      const h = rowHeight - 16;

      ctx.fillStyle = '#334155';
      ctx.fillRect(x - 2, y - 2, w + 4, h + 4);

      const isLit = (r + c * 3) % 3 !== 0;
      if (isLit) {
        ctx.fillStyle = type === 'HOSPITAL' ? '#38bdf8' : (r % 2 === 0 ? '#fef08a' : '#93c5fd');
      } else {
        ctx.fillStyle = '#020617';
      }
      ctx.fillRect(x, y, w, h);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + w * 0.45, y);
      ctx.lineTo(x, y + h * 0.55);
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/**
 * Procedural Helipad Texture Generator
 */
function createHelipadTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 0, 256, 256);

  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.arc(128, 128, 90, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 110px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('H', 128, 128);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

/**
 * Procedural 3D Human Figure Generator
 */
function createHumanFigure({
  isRescuer = false,
  isInjured = false,
  isWaving = true,
  shirtColor = 0xf59e0b,
  scale = 1.0
}: {
  isRescuer?: boolean;
  isInjured?: boolean;
  isWaving?: boolean;
  shirtColor?: number;
  scale?: number;
}): THREE.Group {
  const group = new THREE.Group();

  // Head
  const headGeo = new THREE.SphereGeometry(0.32 * scale, 12, 12);
  const skinMat = new THREE.MeshStandardMaterial({ color: 0xe0ac69, roughness: 0.6 });
  const head = new THREE.Mesh(headGeo, skinMat);
  head.position.y = 1.65 * scale;
  head.castShadow = true;
  group.add(head);

  // Helmet / Cap
  if (isRescuer) {
    const helmetGeo = new THREE.SphereGeometry(0.36 * scale, 12, 12, 0, Math.PI * 2, 0, Math.PI * 0.65);
    const helmetMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, metalness: 0.3 });
    const helmet = new THREE.Mesh(helmetGeo, helmetMat);
    helmet.position.y = 1.72 * scale;
    group.add(helmet);
  } else {
    const hairGeo = new THREE.SphereGeometry(0.34 * scale, 10, 10, 0, Math.PI * 2, 0, Math.PI * 0.5);
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9 });
    const hair = new THREE.Mesh(hairGeo, hairMat);
    hair.position.y = 1.7 * scale;
    group.add(hair);
  }

  // Torso
  const torsoGeo = new THREE.BoxGeometry(0.65 * scale, 0.8 * scale, 0.38 * scale);
  const torsoMat = new THREE.MeshStandardMaterial({ 
    color: isRescuer ? 0xf97316 : isInjured ? 0xef4444 : shirtColor,
    roughness: 0.7 
  });
  const torso = new THREE.Mesh(torsoGeo, torsoMat);
  torso.position.y = 1.08 * scale;
  torso.castShadow = true;
  group.add(torso);

  if (isRescuer) {
    const stripGeo = new THREE.BoxGeometry(0.68 * scale, 0.14 * scale, 0.4 * scale);
    const stripMat = new THREE.MeshBasicMaterial({ color: 0xf1f5f9 });
    const strip = new THREE.Mesh(stripGeo, stripMat);
    strip.position.y = 1.08 * scale;
    group.add(strip);
  }

  // Arms
  const armGeo = new THREE.CylinderGeometry(0.1 * scale, 0.1 * scale, 0.7 * scale, 8);
  const armMat = new THREE.MeshStandardMaterial({ 
    color: isRescuer ? 0xf97316 : isInjured ? 0xef4444 : shirtColor, 
    roughness: 0.7 
  });

  const leftArm = new THREE.Mesh(armGeo, armMat);
  if (isWaving && !isInjured) {
    leftArm.position.set(-0.42 * scale, 1.45 * scale, 0);
    leftArm.rotation.z = Math.PI * 0.75;
  } else {
    leftArm.position.set(-0.42 * scale, 0.95 * scale, 0.05 * scale);
    leftArm.rotation.x = Math.PI * 0.15;
  }
  leftArm.castShadow = true;
  group.add(leftArm);

  const rightArm = new THREE.Mesh(armGeo, armMat);
  if (isWaving && !isInjured) {
    rightArm.position.set(0.42 * scale, 1.45 * scale, 0);
    rightArm.rotation.z = -Math.PI * 0.75;
  } else {
    rightArm.position.set(0.42 * scale, 0.95 * scale, 0.05 * scale);
    rightArm.rotation.x = Math.PI * 0.15;
  }
  rightArm.castShadow = true;
  group.add(rightArm);

  // Legs
  const legGeo = new THREE.CylinderGeometry(0.12 * scale, 0.12 * scale, 0.75 * scale, 8);
  const pantsMat = new THREE.MeshStandardMaterial({ 
    color: isRescuer ? 0x0f172a : 0x1e293b, 
    roughness: 0.8 
  });

  const leftLeg = new THREE.Mesh(legGeo, pantsMat);
  leftLeg.position.set(-0.18 * scale, 0.38 * scale, 0);
  leftLeg.castShadow = true;
  group.add(leftLeg);

  const rightLeg = new THREE.Mesh(legGeo, pantsMat);
  rightLeg.position.set(0.18 * scale, 0.38 * scale, 0);
  rightLeg.castShadow = true;
  group.add(rightLeg);

  return group;
}

export const Dhost3DDigitalTwin: React.FC<Props> = ({
  incidents,
  onSelectIncident,
  onClose
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // Active Disaster Mode State
  const [activeDisaster, setActiveDisaster] = useState<DisasterCategory>('FLOOD');
  const currentDisaster = DISASTER_CONFIGS[activeDisaster];

  // Active Selected Rescue Strategy
  const [selectedPossibilityIndex, setSelectedPossibilityIndex] = useState<number>(0);
  const currentOption = currentDisaster.options[selectedPossibilityIndex] || currentDisaster.options[0];

  // Mobile Bottom Tab State
  const [mobileBottomTab, setMobileBottomTab] = useState<'STRATEGIES' | 'THREAT_DETAILS'>('STRATEGIES');

  // References for Three.js Scene Updates
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const hazardVolumeRef = useRef<THREE.Mesh | null>(null);
  const particleSystemRef = useRef<THREE.Points | null>(null);
  const vehicleGroupRef = useRef<THREE.Group | null>(null);
  const rescueBeamRef = useRef<THREE.Mesh | null>(null);
  const activeSplineRef = useRef<THREE.Line | null>(null);

  // -------------------------------------------------------------
  // THREE.JS INITIALIZATION & SCENE SETUP
  // -------------------------------------------------------------
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const [ix, iy, iz] = currentDisaster.incidentPos;
    const [sx, sy, sz] = currentDisaster.safeZonePos;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(currentDisaster.skyColor);
    scene.fog = new THREE.FogExp2(currentDisaster.fogColor, 0.007);
    sceneRef.current = scene;

    // 2. Camera: Smoothly point towards the active disaster incident location
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    const [cpx, cpy, cpz] = currentDisaster.cameraIncidentPos;
    camera.position.set(cpx, cpy, cpz);
    camera.lookAt(ix, iy, iz);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0x1e293b, 2.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x38bdf8, 1.8);
    dirLight.position.set(40, 80, 50);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const amberLight = new THREE.PointLight(0xf59e0b, 4, 120);
    amberLight.position.set(ix, iy + 10, iz);
    scene.add(amberLight);

    const victimRedLight = new THREE.PointLight(0xef4444, 6, 50);
    victimRedLight.position.set(ix, iy + 4, iz);
    scene.add(victimRedLight);

    // 5. Ground Plane Grid
    const groundGeo = new THREE.PlaneGeometry(280, 280);
    const groundMat = new THREE.MeshStandardMaterial({ 
      color: activeDisaster === 'WILDFIRE' ? 0x180a05 : activeDisaster === 'EARTHQUAKE' ? 0x1c1917 : 0x070b14, 
      roughness: 0.9, 
      metalness: 0.1 
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const gridHelper = new THREE.GridHelper(280, 56, 0x1e293b, 0x0f172a);
    gridHelper.position.y = 0.05;
    scene.add(gridHelper);

    // 6. Bridge
    const bridgeGeo = new THREE.BoxGeometry(18, 2.5, 75);
    const bridgeMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5 });
    const bridge = new THREE.Mesh(bridgeGeo, bridgeMat);
    bridge.position.set(0, 2.5, 0);
    bridge.castShadow = true;
    scene.add(bridge);

    // -------------------------------------------------------------
    // 7. REALISTIC CITY BUILDINGS WITH PROCEDURAL TEXTURES
    // -------------------------------------------------------------
    const buildingsGroup = new THREE.Group();
    scene.add(buildingsGroup);

    const officeTexture = createFacadeTexture('OFFICE');
    const aptTexture = createFacadeTexture('APARTMENT');
    const hospTexture = createFacadeTexture('HOSPITAL');
    const helipadTexture = createHelipadTexture();

    const officeMat = new THREE.MeshStandardMaterial({ map: officeTexture, roughness: 0.4, metalness: 0.3 });
    const aptMat = new THREE.MeshStandardMaterial({ map: aptTexture, roughness: 0.6, metalness: 0.2 });
    const hvacMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.3, metalness: 0.6 });

    for (let x = -90; x <= 90; x += 26) {
      for (let z = -90; z <= 90; z += 26) {
        if (Math.abs(x) < 20) continue;
        if (Math.abs(x - sx) < 18 && Math.abs(z - sz) < 18) continue; // Safe zone reserve
        if (Math.abs(x - ix) < 15 && Math.abs(z - iz) < 15) continue; // Incident reserve

        let bHeight = Math.floor(Math.random() * 16) + 8;
        const bWidth = Math.floor(Math.random() * 4) + 14;
        const bDepth = Math.floor(Math.random() * 4) + 14;
        const bMat = (x + z) % 2 === 0 ? officeMat : aptMat;

        if (activeDisaster === 'EARTHQUAKE' && Math.abs(x) < 50) {
          bHeight = Math.max(4, bHeight * 0.5);
        }

        const bGeo = new THREE.BoxGeometry(bWidth, bHeight, bDepth);
        const bMesh = new THREE.Mesh(bGeo, bMat);
        bMesh.position.set(x, bHeight / 2, z);
        
        if (activeDisaster === 'EARTHQUAKE') {
          bMesh.rotation.z = (Math.random() * 0.15 - 0.075);
          bMesh.rotation.x = (Math.random() * 0.15 - 0.075);
        }

        bMesh.castShadow = true;
        bMesh.receiveShadow = true;
        buildingsGroup.add(bMesh);

        const parapet = new THREE.Mesh(new THREE.BoxGeometry(bWidth + 0.3, 0.8, bDepth + 0.3), new THREE.MeshStandardMaterial({ color: 0x334155 }));
        parapet.position.set(x, bHeight + 0.4, z);
        buildingsGroup.add(parapet);

        const hvac = new THREE.Mesh(new THREE.BoxGeometry(3.5, 1.8, 3.5), hvacMat);
        hvac.position.set(x, bHeight + 1.2, z);
        buildingsGroup.add(hvac);
      }
    }

    // 8. DISASTER INCIDENT SITE STRUCTURE AT EXACT INCIDENT LOCATION (ix, iy, iz)
    const incidentSiteGroup = new THREE.Group();
    incidentSiteGroup.position.set(ix, 0, iz);

    const incidentBldgGeo = new THREE.BoxGeometry(20, iy, 20);
    const incidentBldgMesh = new THREE.Mesh(incidentBldgGeo, officeMat);
    incidentBldgMesh.position.y = iy / 2;
    incidentBldgMesh.castShadow = true;
    incidentSiteGroup.add(incidentBldgMesh);

    const roofParapet = new THREE.Mesh(new THREE.BoxGeometry(20.4, 0.9, 20.4), new THREE.MeshStandardMaterial({ color: 0x475569 }));
    roofParapet.position.y = iy + 0.45;
    incidentSiteGroup.add(roofParapet);

    buildingsGroup.add(incidentSiteGroup);

    // 9. SAFE ZONE / HOSPITAL SHELTER AT (sx, sy, sz)
    const safeZoneGroup = new THREE.Group();
    safeZoneGroup.position.set(sx, 0, sz);

    const safeBldgGeo = new THREE.BoxGeometry(28, sy, 28);
    const safeBldgMesh = new THREE.Mesh(safeBldgGeo, new THREE.MeshStandardMaterial({ map: hospTexture, roughness: 0.3, metalness: 0.4 }));
    safeBldgMesh.position.y = sy / 2;
    safeBldgMesh.castShadow = true;
    safeZoneGroup.add(safeBldgMesh);

    const helipad = new THREE.Mesh(new THREE.BoxGeometry(16, 0.4, 16), new THREE.MeshStandardMaterial({ map: helipadTexture, roughness: 0.7 }));
    helipad.position.set(0, sy + 0.2, 0);
    safeZoneGroup.add(helipad);

    const crossH = new THREE.Mesh(new THREE.BoxGeometry(12, 0.6, 3.5), new THREE.MeshBasicMaterial({ color: 0x10b981 }));
    const crossV = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.6, 12), new THREE.MeshBasicMaterial({ color: 0x10b981 }));
    crossH.position.set(-6, sy + 0.6, -6);
    crossV.position.set(-6, sy + 0.6, -6);
    safeZoneGroup.add(crossH);
    safeZoneGroup.add(crossV);

    buildingsGroup.add(safeZoneGroup);

    // 10. DYNAMIC HAZARD VOLUMES (Spawned at exact disaster incident coordinates)
    if (activeDisaster === 'FLOOD') {
      const floodGeo = new THREE.BoxGeometry(190, 4.5, 190);
      const floodMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, transparent: true, opacity: 0.55, roughness: 0.1, metalness: 0.9 });
      const floodMesh = new THREE.Mesh(floodGeo, floodMat);
      floodMesh.position.set(ix, 2.25, iz);
      scene.add(floodMesh);
      hazardVolumeRef.current = floodMesh;
    } else if (activeDisaster === 'WILDFIRE') {
      const fireGeo = new THREE.CylinderGeometry(25, 35, 18, 32);
      const fireMat = new THREE.MeshStandardMaterial({ color: 0xef4444, transparent: true, opacity: 0.45, emissive: 0xd97706, emissiveIntensity: 0.8 });
      const fireMesh = new THREE.Mesh(fireGeo, fireMat);
      fireMesh.position.set(ix, 9, iz);
      scene.add(fireMesh);
      hazardVolumeRef.current = fireMesh;
    } else if (activeDisaster === 'CHEMICAL_HAZMAT') {
      const gasGeo = new THREE.SphereGeometry(26, 24, 24);
      const gasMat = new THREE.MeshStandardMaterial({ color: 0x10b981, transparent: true, opacity: 0.4, emissive: 0x22c55e, emissiveIntensity: 0.6 });
      const gasMesh = new THREE.Mesh(gasGeo, gasMat);
      gasMesh.position.set(ix, 12, iz);
      scene.add(gasMesh);
      hazardVolumeRef.current = gasMesh;
    } else if (activeDisaster === 'LANDSLIDE') {
      const mudGeo = new THREE.ConeGeometry(30, 20, 16);
      const mudMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
      const mudMesh = new THREE.Mesh(mudGeo, mudMat);
      mudMesh.position.set(ix, 8, iz);
      mudMesh.rotation.z = Math.PI * 0.3;
      scene.add(mudMesh);
      hazardVolumeRef.current = mudMesh;
    }

    // 11. PARTICLE SYSTEM
    const particleCount = 350;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 160;
      particlePositions[i + 1] = Math.random() * 60;
      particlePositions[i + 2] = (Math.random() - 0.5) * 160;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: activeDisaster === 'WILDFIRE' ? 0xf59e0b : activeDisaster === 'CHEMICAL_HAZMAT' ? 0x22c55e : activeDisaster === 'CYCLONE' ? 0x38bdf8 : 0x94a3b8,
      size: 0.7,
      transparent: true,
      opacity: 0.8
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);
    particleSystemRef.current = particles;

    // 12. 3D HUMAN STRANDED VICTIMS AT EXACT INCIDENT LOCATION (ix, iy, iz)
    const peopleStuckGroup = new THREE.Group();
    scene.add(peopleStuckGroup);

    const shirtColors = [0xf59e0b, 0x38bdf8, 0xef4444, 0x10b981, 0xa855f7, 0xf97316, 0xec4899];

    for (let p = 0; p < 14; p++) {
      const px = ix + (p % 4) * 2.2 - 3.3;
      const pz = iz + Math.floor(p / 4) * 2.2 - 3.3;
      const isInjured = p === 0 || p === 1;

      const humanFigure = createHumanFigure({
        isRescuer: false,
        isInjured,
        isWaving: true,
        shirtColor: shirtColors[p % shirtColors.length],
        scale: 1.0
      });

      humanFigure.position.set(px, iy, pz);
      peopleStuckGroup.add(humanFigure);
    }

    const sosRing = new THREE.Mesh(
      new THREE.RingGeometry(3.8, 4.6, 32),
      new THREE.MeshBasicMaterial({ color: 0xef4444, side: THREE.DoubleSide, transparent: true, opacity: 0.85 })
    );
    sosRing.rotation.x = -Math.PI / 2;
    sosRing.position.set(ix, iy + 3.5, iz);
    peopleStuckGroup.add(sosRing);

    // 13. DYNAMIC 3D RESCUE ROUTE SPLINE CONNECTING BASE -> INCIDENT -> SAFEZONE
    let routePointsList: THREE.Vector3[] = [];

    if (selectedPossibilityIndex === 1 || activeDisaster === 'WILDFIRE' || activeDisaster === 'LANDSLIDE') {
      const heloCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 35, -40),
        new THREE.Vector3((ix + 0) / 2, 38, (iz - 40) / 2),
        new THREE.Vector3(ix, iy + 14, iz),
        new THREE.Vector3((ix + sx) / 2, 32, (iz + sz) / 2),
        new THREE.Vector3(sx, sy + 6, sz)
      ]);
      routePointsList = heloCurve.getPoints(80);
    } else {
      const surfaceCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 3, -40),
        new THREE.Vector3((ix + 0) / 2, 3.5, (iz - 40) / 2),
        new THREE.Vector3(ix, iy, iz),
        new THREE.Vector3((ix + sx) / 2, 5, (iz + sz) / 2),
        new THREE.Vector3(sx, sy, sz)
      ]);
      routePointsList = surfaceCurve.getPoints(80);
    }

    const splineGeo = new THREE.BufferGeometry().setFromPoints(routePointsList);
    const splineMat = new THREE.LineDashedMaterial({
      color: currentOption.feasibilityScore >= 90 ? 0x10b981 : currentOption.feasibilityScore >= 70 ? 0xf59e0b : 0xef4444,
      dashSize: 3,
      gapSize: 1.5,
      linewidth: 4
    });
    const splineLine = new THREE.Line(splineGeo, splineMat);
    splineLine.computeLineDistances();
    scene.add(splineLine);
    activeSplineRef.current = splineLine;

    // Winch Beam
    const winchGeo = new THREE.CylinderGeometry(0.25, 0.25, 12, 16);
    const winchMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.85 });
    const winchBeam = new THREE.Mesh(winchGeo, winchMat);
    winchBeam.position.set(ix, iy + 6, iz);
    scene.add(winchBeam);
    rescueBeamRef.current = winchBeam;

    // 14. 3D RESCUE VEHICLES
    const vehicleGroup = new THREE.Group();
    vehicleGroupRef.current = vehicleGroup;
    scene.add(vehicleGroup);

    // Zodiac Boat
    const boatContainer = new THREE.Group();
    const boatHull = new THREE.Mesh(new THREE.BoxGeometry(4.8, 1.8, 8.5), new THREE.MeshStandardMaterial({ color: 0x2563eb }));
    boatContainer.add(boatHull);

    const rescuer1 = createHumanFigure({ isRescuer: true, scale: 1.1 });
    rescuer1.position.set(0.8, 0.9, 1.5);
    boatContainer.add(rescuer1);

    const rescuer2 = createHumanFigure({ isRescuer: true, scale: 1.1 });
    rescuer2.position.set(-0.8, 0.9, -1.8);
    boatContainer.add(rescuer2);

    boatContainer.position.set(0, 3, -40);
    vehicleGroup.add(boatContainer);

    // Helicopter
    const heloContainer = new THREE.Group();
    const heloBody = new THREE.Mesh(new THREE.BoxGeometry(4.5, 3.2, 9.5), new THREE.MeshStandardMaterial({ color: 0xf59e0b }));
    heloContainer.add(heloBody);

    const rotor = new THREE.Mesh(new THREE.BoxGeometry(16, 0.2, 1.4), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    rotor.position.set(0, 2.2, 0);
    heloContainer.add(rotor);

    const heloPilot = createHumanFigure({ isRescuer: true, scale: 0.95 });
    heloPilot.position.set(0, 0.3, 2.0);
    heloContainer.add(heloPilot);

    heloContainer.position.set(20, 35, -40);
    vehicleGroup.add(heloContainer);

    // 15. Touch / Mouse Controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !cameraRef.current) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      cameraRef.current.position.x += deltaX * 0.2;
      cameraRef.current.position.y = Math.max(15, Math.min(120, cameraRef.current.position.y - deltaY * 0.2));
      cameraRef.current.lookAt(ix, iy, iz);

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => { isDragging = false; };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1 || !cameraRef.current) return;
      const deltaX = e.touches[0].clientX - previousMousePosition.x;
      const deltaY = e.touches[0].clientY - previousMousePosition.y;

      cameraRef.current.position.x += deltaX * 0.3;
      cameraRef.current.position.y = Math.max(15, Math.min(120, cameraRef.current.position.y - deltaY * 0.3));
      cameraRef.current.lookAt(ix, iy, iz);

      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onTouchEnd = () => { isDragging = false; };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    domElement.addEventListener('touchstart', onTouchStart, { passive: true });
    domElement.addEventListener('touchmove', onTouchMove, { passive: true });
    domElement.addEventListener('touchend', onTouchEnd);

    // 16. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (particleSystemRef.current) {
        const pos = particleSystemRef.current.geometry.attributes.position.array as Float32Array;
        for (let p = 1; p < pos.length; p += 3) {
          pos[p] -= activeDisaster === 'CYCLONE' ? 1.2 : 0.4;
          if (pos[p] < 0) pos[p] = 60;
        }
        particleSystemRef.current.geometry.attributes.position.needsUpdate = true;
      }

      if (vehicleGroupRef.current && vehicleGroupRef.current.children[1]) {
        const heloMesh = vehicleGroupRef.current.children[1];
        if (heloMesh.children[1]) {
          heloMesh.children[1].rotation.y = elapsedTime * 30;
        }
      }

      if (vehicleGroupRef.current) {
        const boatMesh = vehicleGroupRef.current.children[0];
        const heloMesh = vehicleGroupRef.current.children[1];

        if (selectedPossibilityIndex === 1 || activeDisaster === 'WILDFIRE' || activeDisaster === 'LANDSLIDE') {
          heloMesh.position.x = ix + Math.sin(elapsedTime * 0.8) * 30;
          heloMesh.position.z = iz + Math.cos(elapsedTime * 0.8) * 30;
          heloMesh.position.y = iy + 16 + Math.sin(elapsedTime * 2) * 2;
          boatMesh.position.set(0, 3, -40);
        } else {
          boatMesh.position.z = -20 + Math.sin(elapsedTime * 0.6) * 25;
          heloMesh.position.set(20, 35, -40);
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domElement.removeEventListener('touchstart', onTouchStart);
      domElement.removeEventListener('touchmove', onTouchMove);
      domElement.removeEventListener('touchend', onTouchEnd);
      if (rendererRef.current?.domElement) {
        rendererRef.current.domElement.remove();
      }
    };
  }, [activeDisaster, selectedPossibilityIndex]);

  const handleSwitchDisaster = (disasterId: DisasterCategory) => {
    setActiveDisaster(disasterId);
    setSelectedPossibilityIndex(0);
  };

  const handleFocusStrandedPeople = () => {
    if (!cameraRef.current) return;
    const [ix, iy, iz] = currentDisaster.incidentPos;
    const [cpx, cpy, cpz] = currentDisaster.cameraIncidentPos;
    cameraRef.current.position.set(cpx, cpy, cpz);
    cameraRef.current.lookAt(ix, iy, iz);
  };

  const handleFocusHospital = () => {
    if (!cameraRef.current) return;
    const [sx, sy, sz] = currentDisaster.safeZonePos;
    cameraRef.current.position.set(sx - 15, sy + 15, sz + 20);
    cameraRef.current.lookAt(sx, sy, sz);
  };

  const handleResetCamera = () => {
    if (!cameraRef.current) return;
    cameraRef.current.position.set(-25, 55, 85);
    cameraRef.current.lookAt(0, 0, 0);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col text-slate-100 select-none overflow-hidden animate-in fade-in">
      
      {/* ======================================================== */}
      {/* 1. COMPACT STRUCTURED TOP BAR                            */}
      {/* ======================================================== */}
      <header className="p-2.5 bg-slate-900 border-b border-slate-800 shrink-0 z-30 space-y-2 shadow-lg">
        
        {/* Top Row: Back Button + Active Title + Camera Focus Icons */}
        <div className="flex items-center justify-between gap-2">
          
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center gap-1 text-xs font-bold shrink-0 active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-[11px]">Back</span>
            </button>

            <div>
              <h1 className="text-xs font-black text-white flex items-center gap-1.5 leading-tight">
                <span>3D TWIN</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono font-bold">
                  {currentDisaster.icon} {currentDisaster.name}
                </span>
              </h1>
              <p className="text-[9px] text-slate-400 font-mono line-clamp-1">
                📍 {currentDisaster.incidentLandmark}
              </p>
            </div>
          </div>

          {/* Quick 1-Tap Camera Focus Pills */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={handleFocusStrandedPeople}
              className="px-2 py-1 rounded-lg bg-red-950/80 border border-red-500/40 text-red-300 font-bold text-[10px] active:scale-95 transition"
            >
              👥 Victims
            </button>
            <button
              onClick={handleFocusHospital}
              className="px-2 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-bold text-[10px] active:scale-95 transition"
            >
              🏥 Shelter
            </button>
            <button
              onClick={handleResetCamera}
              className="p-1 rounded-lg bg-slate-800 text-slate-300 active:scale-95 transition"
              title="Reset View"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Bottom Row: 6 Disaster Icon Switchers */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 text-xs scrollbar-none">
          {(Object.keys(DISASTER_CONFIGS) as DisasterCategory[]).map(dKey => {
            const d = DISASTER_CONFIGS[dKey];
            const isActive = activeDisaster === dKey;
            return (
              <button
                key={dKey}
                onClick={() => handleSwitchDisaster(dKey)}
                className={`px-2.5 py-1 rounded-xl font-black transition text-[11px] whitespace-nowrap flex items-center gap-1 shrink-0 ${
                  isActive 
                    ? `bg-gradient-to-r ${d.color} text-white ring-2 ring-white/40 shadow-sm` 
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>{d.icon}</span>
                <span>{d.name.split('/')[0]}</span>
              </button>
            );
          })}
        </div>

      </header>

      {/* ======================================================== */}
      {/* 2. FULL-VIEW UNOBSTRUCTED 3D VIEWPORT                    */}
      {/* ======================================================== */}
      <div className="relative flex-1 bg-slate-950 overflow-hidden w-full min-h-[40vh]">
        
        {/* Three.js DOM Injection Mount */}
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing touch-none" />

        {/* Minimal 1-Line Status Ticker */}
        <div className="absolute top-2 left-2 right-2 z-10 pointer-events-none">
          <div className="mx-auto max-w-lg px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/60 shadow-md text-center">
            <span className="text-[10px] font-mono font-bold text-amber-300 truncate block">
              {currentOption.actionStatus}
            </span>
          </div>
        </div>

        {/* Dynamic Location Pin Badge at Bottom Right */}
        <div className="absolute bottom-2 right-2 z-10 pointer-events-none">
          <span className="text-[9px] font-mono text-amber-400 bg-slate-950/80 px-2 py-0.5 rounded border border-amber-500/40">
            📍 {currentDisaster.incidentLandmark}
          </span>
        </div>

        {/* Gesture Hint at Bottom Left */}
        <div className="absolute bottom-2 left-2 z-10 pointer-events-none">
          <span className="text-[9px] font-mono text-slate-500 bg-slate-950/70 px-2 py-0.5 rounded border border-slate-800">
            👆 Drag: Rotate • Pinch: Zoom
          </span>
        </div>

      </div>

      {/* ======================================================== */}
      {/* 3. STRUCTURED DOCKED BOTTOM COMMAND TRAY (NO POPUPS)     */}
      {/* ======================================================== */}
      <div className="bg-slate-900 border-t-2 border-slate-800 shrink-0 z-30 flex flex-col font-sans max-h-[42vh] overflow-y-auto">
        
        {/* Tab Toggle Row */}
        <div className="p-2 border-b border-slate-800 flex items-center justify-between gap-2">
          
          <div className="flex items-center gap-1">
            <button
              onClick={() => setMobileBottomTab('STRATEGIES')}
              className={`px-3 py-1 rounded-lg text-xs font-black transition flex items-center gap-1.5 ${
                mobileBottomTab === 'STRATEGIES'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Brain className="w-3.5 h-3.5" />
              <span>AI Strategies ({currentDisaster.options.length})</span>
            </button>

            <button
              onClick={() => setMobileBottomTab('THREAT_DETAILS')}
              className={`px-3 py-1 rounded-lg text-xs font-black transition flex items-center gap-1.5 ${
                mobileBottomTab === 'THREAT_DETAILS'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Location & Threat</span>
            </button>
          </div>

          <span className="text-[10px] font-mono text-emerald-400 font-bold">
            {currentOption.feasibilityScore}% AI MATCH
          </span>

        </div>

        {/* Tab 1: AI Strategies (Swipeable Cards) */}
        {mobileBottomTab === 'STRATEGIES' && (
          <div className="p-2.5 space-y-2">
            
            {/* Horizontal Strategy Selection Cards */}
            <div className="grid grid-cols-3 gap-1.5">
              {currentDisaster.options.map((opt, idx) => (
                <button
                  key={opt.id}
                  onClick={() => setSelectedPossibilityIndex(idx)}
                  className={`p-2 rounded-xl border text-left transition space-y-0.5 ${
                    selectedPossibilityIndex === idx
                      ? 'bg-purple-950/90 border-purple-400 ring-1 ring-purple-400 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      {idx === 0 ? 'Opt A' : idx === 1 ? 'Opt B' : 'Opt C'}
                    </span>
                    <span className={`text-[9px] font-black px-1 rounded ${
                      opt.feasibilityScore >= 90 ? 'bg-emerald-500/20 text-emerald-400' :
                      opt.feasibilityScore >= 70 ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {opt.feasibilityScore}%
                    </span>
                  </div>
                  <p className="text-[10px] font-black truncate leading-tight">
                    {opt.vehicleName}
                  </p>
                  <p className="text-[9px] text-slate-400">
                    ETA: {opt.etaMins}m
                  </p>
                </button>
              ))}
            </div>

            {/* Strategy Detail Card */}
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="font-black text-white">{currentOption.name}</span>
                <span className="text-[10px] text-slate-400 font-mono">{currentOption.capacity}</span>
              </div>
              <p className="text-[10px] text-slate-300 font-mono">
                📍 {currentOption.routeDescription}
              </p>
              <div className="flex items-center gap-2 pt-0.5 text-[10px]">
                <span className="text-emerald-400">✓ {currentOption.pros[0]}</span>
                <span className="text-amber-400">⚠️ {currentOption.cons[0]}</span>
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: Casualty & Threat Details */}
        {mobileBottomTab === 'THREAT_DETAILS' && (
          <div className="p-2.5 space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-red-400 font-black text-xs">
                <span>💥 {currentDisaster.scenarioTitle}</span>
                <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-[10px]">CRITICAL</span>
              </div>
              <p className="text-slate-300 text-[11px]">
                📍 <strong>Danger Location:</strong> {currentDisaster.incidentLandmark}
              </p>
              <p className="text-slate-300 text-[11px]">
                👥 <strong>Casualties:</strong> {currentDisaster.casualtySummary}
              </p>
              <p className="text-slate-300 text-[11px]">
                🛡️ <strong>Safe Shelter:</strong> {currentDisaster.safeZoneName}
              </p>
              <p className="text-slate-300 text-[11px]">
                ⚠️ <strong>Threat:</strong> {currentDisaster.hazardDescription}
              </p>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
