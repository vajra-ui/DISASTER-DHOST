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
  Building2,
  Droplets,
  Waves,
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
  screenEffectName: string;
  skyColor: number;
  fogColor: number;
  options: RescuePossibility[];
}

/**
 * 6 Disaster Configurations with Screen Effects & Real-Time AI Rescue Strategies
 * All in the persistent, structured 3D City Environment!
 */
const DISASTER_CONFIGS: Record<DisasterCategory, DisasterConfig> = {
  FLOOD: {
    id: 'FLOOD',
    name: 'Tsunami / Flood Surge',
    icon: '🌊',
    color: 'from-blue-600 to-cyan-500',
    scenarioTitle: 'Tsunami Surge Inundation (4.2ft Street Flood)',
    incidentLandmark: 'Commercial Complex Rooftop (Old Bridge Sector)',
    casualtySummary: '14 Stranded Civilians • 2 Leg Fractures',
    hazardDescription: 'Rapid water surge currents, submerged 11kV lines, hydro-lock hazard',
    screenEffectName: '🌊 WATER LENS SPLASH & WAVE SURGE',
    skyColor: 0x020617,
    fogColor: 0x031525,
    options: [
      {
        id: 'ZODIAC_BOAT',
        name: 'Option A: Zodiac Inflatable Raft (Boat Unit #02)',
        vehicleName: 'Team Bravo Zodiac Raft',
        feasibilityScore: 94,
        etaMins: 8,
        capacity: '14+ People (100% Single Sortie)',
        riskLevel: 'LOW',
        routeDescription: 'Deep River Channel (4.8km Safe Waterway Approach)',
        pros: ['Shallow 4.2ft draft optimal', 'Direct rooftop high-line tethering', 'Zero structural impact'],
        cons: ['Slightly slower than helicopter'],
        actionStatus: '🚤 Cruising River Channel ➔ Winch Extrication ➔ Hospital Safe'
      },
      {
        id: 'HELO_WINCH',
        name: 'Option B: Coast Guard Helo AIR-01 Winch Basket',
        vehicleName: 'Coast Guard Helo Air-1',
        feasibilityScore: 78,
        etaMins: 4,
        capacity: '4 People / Lift (Requires 3 Sorties)',
        riskLevel: 'MEDIUM',
        routeDescription: 'Direct Aerial Ingress (Altitude 35m)',
        pros: ['Fastest arrival (4 mins)', 'Immediate triage for 2 fracture casualties'],
        cons: ['45 km/h high-altitude wind gusts', 'Rotor downwash on flooded structures'],
        actionStatus: '🚁 Aerial Ingress ➔ Rooftop Hover ➔ Winch Basket Hoist'
      },
      {
        id: 'TACTICAL_TRUCK',
        name: 'Option C: 4x4 High-Clearance Tactical Rescue Truck',
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
    scenarioTitle: 'Magnitude 6.8 Seismic Ground Rupture',
    incidentLandmark: 'Downtown Central Tower Collapse Void',
    casualtySummary: '9 Trapped in Basement Rubble Void • 3 Severe Trauma',
    hazardDescription: 'Aftershock collapse hazard, gas lines, unstable concrete slabs',
    screenEffectName: '🏚️ SEISMIC CAMERA TREMOR & GROUND SHAKE',
    skyColor: 0x0f172a,
    fogColor: 0x1c1917,
    options: [
      {
        id: 'K9_ACOUSTIC',
        name: 'Option A: K-9 Search Squad & Acoustic Void Breachers',
        vehicleName: 'NDRF Heavy Extrication Breachers',
        feasibilityScore: 92,
        etaMins: 6,
        capacity: '9 Trapped Survivors',
        riskLevel: 'LOW',
        routeDescription: 'Stable Eastern Seismic Access Corridor',
        pros: ['Acoustic life-detectors locate trapped voids', 'Zero dynamic slab vibration'],
        cons: ['Manual micro-hydraulic cutting required'],
        actionStatus: '🐕 K9 Void Detection ➔ Micro-Hydraulic Breaching ➔ Safe Extrication'
      },
      {
        id: 'HELO_CRANE',
        name: 'Option B: Airborne Heavy Helo Debris Shoring',
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
        name: 'Option C: Heavy Tracked Excavator Clearing',
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
    scenarioTitle: 'Fast Crown Fire Front Over City Blocks',
    incidentLandmark: 'East City Forest & Timber Factory Border',
    casualtySummary: '16 Trapped in Concrete Fire Shelter • 4 Smoke Inhalation',
    hazardDescription: '850°C radiant heat, zero-visibility toxic CO/CO2 smoke',
    screenEffectName: '🔥 RADIANT HEAT GLOW & BURNING EMBERS',
    skyColor: 0x270707,
    fogColor: 0x3d0c02,
    options: [
      {
        id: 'AIR_BOMBER',
        name: 'Option A: Bambi Bucket Helo Water Drop + FLIR Path',
        vehicleName: 'Fire Bomber Helo AIR-01',
        feasibilityScore: 96,
        etaMins: 3,
        capacity: '16 Trapped Evacuees',
        riskLevel: 'LOW',
        routeDescription: 'Thermal FLIR Clear Skyway Approach',
        pros: ['Suppresses thermal barrier with 2,000L drop', 'Cools evacuation escape corridor'],
        cons: ['Requires turnaround refill cycle'],
        actionStatus: '🛩️ 2000L Fire Drop on Roof ➔ Thermal Path Cleared ➔ Safe Evac'
      },
      {
        id: 'FOAM_TENDER',
        name: 'Option B: Armored Fire Tender Foam Shield Unit',
        vehicleName: 'Industrial Foam Tender Squad',
        feasibilityScore: 74,
        etaMins: 7,
        capacity: '12 People',
        riskLevel: 'MEDIUM',
        routeDescription: 'Wetted Road Perimeter (South Approach)',
        pros: ['Positive-pressure cabin protects crew', 'High-volume chemical foam barrier'],
        cons: ['Radiant heat risks tire degradation'],
        actionStatus: '🚒 Foam Curtain Deployed ➔ Fire Barrier Breached ➔ Loaded'
      },
      {
        id: 'FOOT_EVAC',
        name: 'Option C: Ground Foot Evacuation Escort',
        vehicleName: 'Volunteer Ground Trail Guide',
        feasibilityScore: 19,
        etaMins: 25,
        capacity: 'Unpredictable',
        riskLevel: 'HIGH',
        routeDescription: 'Unpaved Ridge Trail Corridor',
        pros: ['No vehicle reliance'],
        cons: ['CRITICAL: Fire front moving at 28 km/h will cut off ridge in 4 mins!'],
        actionStatus: '🚨 HIGH HAZARD: Fire Flashover Threat! Trail engulfed.'
      }
    ]
  },

  CYCLONE: {
    id: 'CYCLONE',
    name: 'Cyclone / Hurricane',
    icon: '🌪️',
    color: 'from-teal-600 to-cyan-700',
    scenarioTitle: 'Category 4 Cyclone Squall (140 km/h Gusts)',
    incidentLandmark: 'Coastal Fishermen Community Center',
    casualtySummary: '11 Stranded in Coastal Hall • Flash Storm Surge',
    hazardDescription: 'Airborne metal sheet debris, severed power grid, 140 km/h wind shear',
    screenEffectName: '🌪️ 140KM/H WIND STREAKS & RAIN SQUALL',
    skyColor: 0x04131e,
    fogColor: 0x08253a,
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
        pros: ['Reinforced polycarbonate windshield against flying debris', 'Low center of gravity'],
        cons: ['Slow speed in heavy rain squall'],
        actionStatus: '🚜 Armored Transport Navigating 140km/h Winds ➔ Safe Base'
      },
      {
        id: 'JET_BOAT',
        name: 'Option B: Water-Jet Shallow Coastal Craft',
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
        name: 'Option C: Standard Rotary Helicopter',
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
    scenarioTitle: 'Chlorine / Toxic Industrial Vapor Plume',
    incidentLandmark: 'North Chemical Processing Reactor Core',
    casualtySummary: '8 Workers Trapped in Control Room',
    hazardDescription: 'Lethal LC50 gas plume, caustic vapor burns, vapor explosion threshold',
    screenEffectName: '☣️ TOXIC GREEN VAPOR LENS & HAZMAT HUD',
    skyColor: 0x031c12,
    fogColor: 0x062d1d,
    options: [
      {
        id: 'HAZMAT_DRONE_SCBA',
        name: 'Option A: Positive-Pressure Level-A SCBA Hazmat Squad',
        vehicleName: 'NDRF Level-A Hazmat Unit',
        feasibilityScore: 95,
        etaMins: 5,
        capacity: '8 Trapped Personnel',
        riskLevel: 'LOW',
        routeDescription: 'Upwind Safe North Access Route',
        pros: ['Self-Contained Breathing Apparatus (SCBA)', 'Vapor-tight chemical suits', 'Decon pod on site'],
        cons: ['45-min air cylinder tank limit'],
        actionStatus: '🤖 Hazmat Squad in Gas-Tight Suits ➔ Decon Extrication'
      },
      {
        id: 'OVERHEAD_HELO',
        name: 'Option B: High-Altitude Helo Thermal Gas Mapping',
        vehicleName: 'FLIR Hazmat Aerial Recon Helo',
        feasibilityScore: 79,
        etaMins: 4,
        capacity: 'Aerial Guide Only',
        riskLevel: 'MEDIUM',
        routeDescription: 'Crosswind High Elevation Vector (60m)',
        pros: ['Maps real-time gas plume boundary with optical gas imaging'],
        cons: ['Rotor downdraft may disperse toxic cloud'],
        actionStatus: '🚁 Infrared Gas Mapping ➔ Guiding Ground Teams'
      },
      {
        id: 'STANDARD_AMBULANCE',
        name: 'Option C: Standard Civilian Ambulance',
        vehicleName: 'City Ambulance Unit #04',
        feasibilityScore: 15,
        etaMins: 10,
        capacity: '4 Patients',
        riskLevel: 'HIGH',
        routeDescription: 'Downwind Main Highway',
        pros: ['Equipped for general medical care'],
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
    scenarioTitle: 'Slope Failure Burying Mountain Valley Highway',
    incidentLandmark: 'Mountain Pass Valley Corridors',
    casualtySummary: '12 Stranded in Mountain Bus • Mud Surrounding Vehicle',
    hazardDescription: 'Secondary slope failure risk, liquefied mud deposits, severed access road',
    screenEffectName: '🏔️ MUD SPRAY & MOUNTAIN ROCKFALL',
    skyColor: 0x0a101d,
    fogColor: 0x141a29,
    options: [
      {
        id: 'LONG_LINE_HELO',
        name: 'Option A: High-Altitude Mountain Helo Long-Line Winch',
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
        name: 'Option B: Alpine Technical High-Angle Rope Rigging',
        vehicleName: 'Alpine Technical Rescue Team',
        feasibilityScore: 84,
        etaMins: 12,
        capacity: '12 Passengers',
        riskLevel: 'MEDIUM',
        routeDescription: 'Upper Cliff Stable Anchor System',
        pros: ['High safety factor steel zip-line system', 'Operates in zero visibility'],
        cons: ['Requires 12 mins to set up anchor ropes'],
        actionStatus: '🧗 High-Angle Rope Rig Deployed ➔ Zipline to Upper Cliff'
      },
      {
        id: 'GROUND_TRUCK',
        name: 'Option C: Standard Highway Patrol Truck',
        vehicleName: 'District Highway Patrol Truck',
        feasibilityScore: 22,
        etaMins: 30,
        capacity: '10 People',
        riskLevel: 'HIGH',
        routeDescription: 'Severed Mountain Valley Road',
        pros: ['Carries heavy generator'],
        cons: ['BLOCKED: Highway washed away by 300m mudflow slide!'],
        actionStatus: '⛔ ROAD SEVERED: Mudflow blocks roadway. Vehicle stuck.'
      }
    ]
  }
};

/**
 * Procedural Realistic Building Facade Texture Generator
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

  // Base camera position reference for Earthquake Shake
  const baseCameraPos = useRef<THREE.Vector3>(new THREE.Vector3(-25, 45, 75));

  // -------------------------------------------------------------
  // THREE.JS INITIALIZATION & SCENE SETUP
  // -------------------------------------------------------------
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(currentDisaster.skyColor);
    scene.fog = new THREE.FogExp2(currentDisaster.fogColor, 0.007);
    sceneRef.current = scene;

    // 2. Camera Setup (Large Structured City Perspective)
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    camera.position.set(-25, 45, 75);
    camera.lookAt(-5, 8, 0);
    cameraRef.current = camera;
    baseCameraPos.current.set(-25, 45, 75);

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

    // 4. Ambient & Directional Lighting
    const ambientLight = new THREE.AmbientLight(0x1e293b, 2.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x38bdf8, 1.8);
    dirLight.position.set(40, 80, 50);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const amberLight = new THREE.PointLight(0xf59e0b, 4, 120);
    amberLight.position.set(-18, 25, 10);
    scene.add(amberLight);

    const victimRedLight = new THREE.PointLight(0xef4444, 6, 50);
    victimRedLight.position.set(-18, 16, 12);
    scene.add(victimRedLight);

    // 5. Large Ground Plane Grid
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

    // 6. River & 3D Bridge with Pylons
    const riverGeo = new THREE.PlaneGeometry(45, 280);
    const riverMat = new THREE.MeshStandardMaterial({ 
      color: activeDisaster === 'FLOOD' ? 0x0284c7 : 0x0369a1, 
      roughness: 0.1, 
      metalness: 0.85, 
      transparent: true, 
      opacity: 0.88 
    });
    const river = new THREE.Mesh(riverGeo, riverMat);
    river.rotation.x = -Math.PI / 2;
    river.position.set(0, 0.1, 0);
    scene.add(river);

    const bridgeGeo = new THREE.BoxGeometry(18, 2.5, 75);
    const bridgeMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5 });
    const bridge = new THREE.Mesh(bridgeGeo, bridgeMat);
    bridge.position.set(0, 2.5, 0);
    bridge.castShadow = true;
    scene.add(bridge);

    // -------------------------------------------------------------
    // 7. REALISTIC STRUCTURED CITY BUILDINGS WITH PROCEDURAL TEXTURES
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

    // Generate City Blocks
    for (let x = -90; x <= 90; x += 26) {
      for (let z = -90; z <= 90; z += 26) {
        if (Math.abs(x) < 22) continue; // River
        if (x >= 35 && z <= -30) continue; // Hospital shelter reserve
        if (x <= -10 && x >= -28 && z >= 0 && z <= 24) continue; // Incident rooftop reserve

        let bHeight = Math.floor(Math.random() * 16) + 8;
        const bWidth = Math.floor(Math.random() * 4) + 14;
        const bDepth = Math.floor(Math.random() * 4) + 14;
        const bMat = (x + z) % 2 === 0 ? officeMat : aptMat;

        if (activeDisaster === 'EARTHQUAKE' && Math.abs(x) < 50) {
          bHeight = Math.max(4, bHeight * 0.6);
        }

        const bGeo = new THREE.BoxGeometry(bWidth, bHeight, bDepth);
        const bMesh = new THREE.Mesh(bGeo, bMat);
        bMesh.position.set(x, bHeight / 2, z);
        
        if (activeDisaster === 'EARTHQUAKE') {
          bMesh.rotation.z = (Math.random() * 0.12 - 0.06);
          bMesh.rotation.x = (Math.random() * 0.12 - 0.06);
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

    // 8. DISASTER INCIDENT COMMERCIAL COMPLEX (-18, 0, 12)
    const strandedBldgGroup = new THREE.Group();
    strandedBldgGroup.position.set(-18, 0, 12);

    const strandedGeo = new THREE.BoxGeometry(20, 12, 20);
    const strandedMesh = new THREE.Mesh(strandedGeo, officeMat);
    strandedMesh.position.y = 6;
    strandedMesh.castShadow = true;
    strandedBldgGroup.add(strandedMesh);

    const roofParapet = new THREE.Mesh(new THREE.BoxGeometry(20.4, 0.9, 20.4), new THREE.MeshStandardMaterial({ color: 0x475569 }));
    roofParapet.position.y = 12.45;
    strandedBldgGroup.add(roofParapet);

    buildingsGroup.add(strandedBldgGroup);

    // 9. HOSPITAL SAFE ZONE (50, 0, -45)
    const hospGroup = new THREE.Group();
    hospGroup.position.set(50, 0, -45);

    const hospGeo = new THREE.BoxGeometry(30, 18, 30);
    const hospMesh = new THREE.Mesh(hospGeo, new THREE.MeshStandardMaterial({ map: hospTexture, roughness: 0.3, metalness: 0.4 }));
    hospMesh.position.y = 9;
    hospMesh.castShadow = true;
    hospGroup.add(hospMesh);

    const helipad = new THREE.Mesh(new THREE.BoxGeometry(16, 0.4, 16), new THREE.MeshStandardMaterial({ map: helipadTexture, roughness: 0.7 }));
    helipad.position.set(0, 18.2, 0);
    hospGroup.add(helipad);

    const crossH = new THREE.Mesh(new THREE.BoxGeometry(12, 0.6, 3.5), new THREE.MeshBasicMaterial({ color: 0x10b981 }));
    const crossV = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.6, 12), new THREE.MeshBasicMaterial({ color: 0x10b981 }));
    crossH.position.set(-6, 18.6, -6);
    crossV.position.set(-6, 18.6, -6);
    hospGroup.add(crossH);
    hospGroup.add(crossV);

    buildingsGroup.add(hospGroup);

    // 10. DYNAMIC HAZARD VOLUMES IN THE CITY
    if (activeDisaster === 'FLOOD') {
      const floodGeo = new THREE.BoxGeometry(190, 4.5, 190);
      const floodMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, transparent: true, opacity: 0.55, roughness: 0.1, metalness: 0.9 });
      const floodMesh = new THREE.Mesh(floodGeo, floodMat);
      floodMesh.position.set(-10, 2.25, 10);
      scene.add(floodMesh);
      hazardVolumeRef.current = floodMesh;
    } else if (activeDisaster === 'WILDFIRE') {
      const fireGeo = new THREE.CylinderGeometry(25, 35, 18, 32);
      const fireMat = new THREE.MeshStandardMaterial({ color: 0xef4444, transparent: true, opacity: 0.45, emissive: 0xd97706, emissiveIntensity: 0.8 });
      const fireMesh = new THREE.Mesh(fireGeo, fireMat);
      fireMesh.position.set(-18, 9, 12);
      scene.add(fireMesh);
      hazardVolumeRef.current = fireMesh;
    } else if (activeDisaster === 'CHEMICAL_HAZMAT') {
      const gasGeo = new THREE.SphereGeometry(26, 24, 24);
      const gasMat = new THREE.MeshStandardMaterial({ color: 0x10b981, transparent: true, opacity: 0.4, emissive: 0x22c55e, emissiveIntensity: 0.6 });
      const gasMesh = new THREE.Mesh(gasGeo, gasMat);
      gasMesh.position.set(-18, 12, 12);
      scene.add(gasMesh);
      hazardVolumeRef.current = gasMesh;
    } else if (activeDisaster === 'LANDSLIDE') {
      const mudGeo = new THREE.ConeGeometry(30, 20, 16);
      const mudMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
      const mudMesh = new THREE.Mesh(mudGeo, mudMat);
      mudMesh.position.set(-8, 8, -10);
      mudMesh.rotation.z = Math.PI * 0.3;
      scene.add(mudMesh);
      hazardVolumeRef.current = mudMesh;
    }

    // 11. PARTICLES (Rain Squalls, Burning Embers, Toxic Droplets)
    const particleCount = 380;
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
      size: 0.75,
      transparent: true,
      opacity: 0.85
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);
    particleSystemRef.current = particles;

    // 12. 3D HUMAN STRANDED VICTIMS ON ROOFTOP
    const peopleStuckGroup = new THREE.Group();
    scene.add(peopleStuckGroup);

    const shirtColors = [0xf59e0b, 0x38bdf8, 0xef4444, 0x10b981, 0xa855f7, 0xf97316, 0xec4899];

    for (let p = 0; p < 14; p++) {
      const px = -18 + (p % 4) * 2.2 - 3.3;
      const pz = 12 + Math.floor(p / 4) * 2.2 - 3.3;
      const isInjured = p === 0 || p === 1;

      const humanFigure = createHumanFigure({
        isRescuer: false,
        isInjured,
        isWaving: true,
        shirtColor: shirtColors[p % shirtColors.length],
        scale: 1.0
      });

      humanFigure.position.set(px, 12, pz);
      peopleStuckGroup.add(humanFigure);
    }

    const sosRing = new THREE.Mesh(
      new THREE.RingGeometry(3.8, 4.6, 32),
      new THREE.MeshBasicMaterial({ color: 0xef4444, side: THREE.DoubleSide, transparent: true, opacity: 0.85 })
    );
    sosRing.rotation.x = -Math.PI / 2;
    sosRing.position.set(-18, 15.5, 12);
    peopleStuckGroup.add(sosRing);

    // 13. DYNAMIC 3D RESCUE ROUTE SPLINE
    let routePointsList: THREE.Vector3[] = [];

    if (selectedPossibilityIndex === 1 || activeDisaster === 'WILDFIRE' || activeDisaster === 'LANDSLIDE') {
      const heloCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(20, 35, -40),
        new THREE.Vector3(5, 38, -15),
        new THREE.Vector3(-18, 30, 12),
        new THREE.Vector3(-18, 24, 12),
        new THREE.Vector3(20, 35, -20),
        new THREE.Vector3(50, 22, -45)
      ]);
      routePointsList = heloCurve.getPoints(80);
    } else {
      const surfaceCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 3, -40),
        new THREE.Vector3(0, 3, -15),
        new THREE.Vector3(-10, 3.5, 0),
        new THREE.Vector3(-18, 4, 8),
        new THREE.Vector3(-18, 12, 12),
        new THREE.Vector3(15, 6, -10),
        new THREE.Vector3(50, 10, -45)
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
    winchBeam.position.set(-18, 18, 12);
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

    // 15. Touch & Mouse Controls
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

      baseCameraPos.current.x += deltaX * 0.2;
      baseCameraPos.current.y = Math.max(15, Math.min(120, baseCameraPos.current.y - deltaY * 0.2));
      cameraRef.current.position.copy(baseCameraPos.current);
      cameraRef.current.lookAt(-5, 8, 0);

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

      baseCameraPos.current.x += deltaX * 0.3;
      baseCameraPos.current.y = Math.max(15, Math.min(120, baseCameraPos.current.y - deltaY * 0.3));
      cameraRef.current.position.copy(baseCameraPos.current);
      cameraRef.current.lookAt(-5, 8, 0);

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

    // 16. Animation Loop with Dynamic Screen Shaking
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // =========================================================
      // DYNAMIC EARTHQUAKE CAMERA SHAKE PHYSICS
      // =========================================================
      if (activeDisaster === 'EARTHQUAKE' && cameraRef.current) {
        const shakeX = (Math.sin(elapsedTime * 45) + Math.cos(elapsedTime * 65)) * 0.45;
        const shakeY = (Math.cos(elapsedTime * 50) + Math.sin(elapsedTime * 70)) * 0.35;
        cameraRef.current.position.set(
          baseCameraPos.current.x + shakeX,
          baseCameraPos.current.y + shakeY,
          baseCameraPos.current.z
        );
        cameraRef.current.lookAt(-5, 8, 0);
      } else if (cameraRef.current) {
        cameraRef.current.position.copy(baseCameraPos.current);
      }

      // Particles Motion
      if (particleSystemRef.current) {
        const pos = particleSystemRef.current.geometry.attributes.position.array as Float32Array;
        for (let p = 1; p < pos.length; p += 3) {
          pos[p] -= activeDisaster === 'CYCLONE' ? 1.2 : activeDisaster === 'FLOOD' ? 0.9 : 0.4;
          if (pos[p] < 0) pos[p] = 60;
        }
        particleSystemRef.current.geometry.attributes.position.needsUpdate = true;
      }

      // Helo Rotor Spin
      if (vehicleGroupRef.current && vehicleGroupRef.current.children[1]) {
        const heloMesh = vehicleGroupRef.current.children[1];
        if (heloMesh.children[1]) {
          heloMesh.children[1].rotation.y = elapsedTime * 30;
        }
      }

      // Vehicle Motion
      if (vehicleGroupRef.current) {
        const boatMesh = vehicleGroupRef.current.children[0];
        const heloMesh = vehicleGroupRef.current.children[1];

        if (selectedPossibilityIndex === 1 || activeDisaster === 'WILDFIRE' || activeDisaster === 'LANDSLIDE') {
          heloMesh.position.x = -18 + Math.sin(elapsedTime * 0.8) * 35;
          heloMesh.position.z = 12 + Math.cos(elapsedTime * 0.8) * 35;
          heloMesh.position.y = 30 + Math.sin(elapsedTime * 2) * 2;
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
    baseCameraPos.current.set(-28, 22, 28);
    cameraRef.current.position.set(-28, 22, 28);
    cameraRef.current.lookAt(-18, 12, 12);
  };

  const handleFocusHospital = () => {
    if (!cameraRef.current) return;
    baseCameraPos.current.set(35, 30, -25);
    cameraRef.current.position.set(35, 30, -25);
    cameraRef.current.lookAt(50, 12, -45);
  };

  const handleResetCamera = () => {
    if (!cameraRef.current) return;
    baseCameraPos.current.set(-25, 45, 75);
    cameraRef.current.position.set(-25, 45, 75);
    cameraRef.current.lookAt(-5, 8, 0);
  };

  return (
    <div className={`fixed inset-0 z-50 bg-slate-950 flex flex-col text-slate-100 select-none overflow-hidden animate-in fade-in ${
      activeDisaster === 'EARTHQUAKE' ? 'animate-[pulse_0.4s_ease-in-out_infinite]' : ''
    }`}>
      
      {/* ======================================================== */}
      {/* 1. TOP COMPACT DISASTER BAR                              */}
      {/* ======================================================== */}
      <header className="p-2.5 bg-slate-900 border-b border-slate-800 shrink-0 z-30 space-y-2 shadow-lg">
        
        {/* Top Row: Back + Disaster Title + Camera Focus Pills */}
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
                <span>3D CITY TWIN</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono font-bold">
                  {currentDisaster.icon} {currentDisaster.name}
                </span>
              </h1>
              <p className="text-[9px] text-slate-400 font-mono line-clamp-1">
                📍 {currentDisaster.incidentLandmark}
              </p>
            </div>
          </div>

          {/* Camera Focus Pills */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={handleFocusStrandedPeople}
              className="px-2 py-1 rounded-lg bg-red-950/80 border border-red-500/40 text-red-300 font-bold text-[10px] active:scale-95 transition"
            >
              👥 Victims (14)
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
              title="Reset Overview"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* 6 Disaster Switchers */}
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
                    ? `bg-gradient-to-r ${d.color} text-white ring-2 ring-white/40 shadow-sm scale-105` 
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
      {/* 2. FULL-VIEW 3D CANVAS WITH DYNAMIC SCREEN EFFECTS       */}
      {/* ======================================================== */}
      <div className="relative flex-1 bg-slate-950 overflow-hidden w-full min-h-[40vh]">
        
        {/* Three.js DOM Injection Mount */}
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing touch-none" />

        {/* ======================================================= */}
        {/* SCREEN OVERLAY EFFECT 1: 🌊 TSUNAMI / FLOOD WATER SPLASH */}
        {/* ======================================================= */}
        {activeDisaster === 'FLOOD' && (
          <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
            {/* Water Droplets on Camera Glass */}
            <div className="absolute top-4 left-6 w-12 h-12 rounded-full bg-cyan-400/20 backdrop-blur-[2px] border border-cyan-300/40 shadow-inner animate-pulse" />
            <div className="absolute bottom-10 right-8 w-16 h-16 rounded-full bg-blue-500/20 backdrop-blur-[3px] border border-blue-400/50 shadow-inner" />
            <div className="absolute top-1/3 right-12 w-8 h-8 rounded-full bg-cyan-300/25 backdrop-blur-[1px] border border-cyan-200/40" />
            {/* Wave Splash Vignette */}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-cyan-600/30 via-cyan-500/10 to-transparent animate-pulse" />
          </div>
        )}

        {/* ======================================================= */}
        {/* SCREEN OVERLAY EFFECT 2: 🔥 WILDFIRE HEAT HAZE & EMBERS */}
        {/* ======================================================= */}
        {activeDisaster === 'WILDFIRE' && (
          <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
            {/* Fiery Orange Shimmer Edge Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-orange-600/25 via-red-950/10 to-orange-950/20 shadow-inner" />
            <div className="absolute top-2 left-1/4 w-3 h-3 rounded-full bg-amber-400 animate-ping" />
            <div className="absolute top-1/2 right-1/3 w-2 h-2 rounded-full bg-orange-400 animate-ping" />
          </div>
        )}

        {/* ======================================================= */}
        {/* SCREEN OVERLAY EFFECT 3: 🌪️ CYCLONE WIND SHEAR STREAKS */}
        {/* ======================================================= */}
        {activeDisaster === 'CYCLONE' && (
          <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-teal-950/20 via-transparent to-cyan-900/20" />
            {/* Diagonal Rain Streaks */}
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100/20 via-transparent to-transparent animate-pulse" />
          </div>
        )}

        {/* ======================================================= */}
        {/* SCREEN OVERLAY EFFECT 4: ☣️ CHEMICAL HAZMAT GREEN VAPOR */}
        {/* ======================================================= */}
        {activeDisaster === 'CHEMICAL_HAZMAT' && (
          <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-600/20 via-lime-950/10 to-emerald-950/25" />
            {/* Gas Mask HUD Corners */}
            <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/60 text-[9px] font-mono text-emerald-400">
              ☣️ TOXIC VAPOR CONE: ACTIVE
            </div>
          </div>
        )}

        {/* ======================================================= */}
        {/* SCREEN OVERLAY EFFECT 5: 🏚️ EARTHQUAKE DUST SHAKE VIGNETTE */}
        {/* ======================================================= */}
        {activeDisaster === 'EARTHQUAKE' && (
          <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/30 via-transparent to-amber-950/20" />
            <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-stone-950/80 border border-amber-500/60 text-[9px] font-mono text-amber-400">
              ⚠️ SEISMIC AFTERSHOCK TREMOR ACTIVE
            </div>
          </div>
        )}

        {/* Minimal Action Status Ticker */}
        <div className="absolute top-2 left-2 right-2 z-20 pointer-events-none">
          <div className="mx-auto max-w-lg px-3 py-1.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-700/60 shadow-md text-center">
            <span className="text-[10px] font-mono font-bold text-amber-300 truncate block">
              {currentDisaster.screenEffectName} • {currentOption.actionStatus}
            </span>
          </div>
        </div>

        {/* Touch Gesture Hint */}
        <div className="absolute bottom-2 left-2 z-20 pointer-events-none">
          <span className="text-[9px] font-mono text-slate-500 bg-slate-950/70 px-2 py-0.5 rounded border border-slate-800">
            👆 Drag: Rotate City • Pinch: Zoom
          </span>
        </div>

      </div>

      {/* ======================================================== */}
      {/* 3. DOCKED BOTTOM COMMAND TRAY WITH RESCUE PLANS          */}
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
              <span>AI Rescue Plans ({currentDisaster.options.length})</span>
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
              <span>Threat Assessment</span>
            </button>
          </div>

          <span className="text-[10px] font-mono text-emerald-400 font-bold">
            {currentOption.feasibilityScore}% FEASIBILITY
          </span>

        </div>

        {/* Tab 1: AI Strategies (Swipeable Cards) */}
        {mobileBottomTab === 'STRATEGIES' && (
          <div className="p-2.5 space-y-2">
            
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

        {/* Tab 2: Threat Assessment */}
        {mobileBottomTab === 'THREAT_DETAILS' && (
          <div className="p-2.5 space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-red-400 font-black text-xs">
                <span>💥 {currentDisaster.scenarioTitle}</span>
                <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-[10px]">CRITICAL</span>
              </div>
              <p className="text-slate-300 text-[11px]">
                📍 <strong>Danger Landmark:</strong> {currentDisaster.incidentLandmark}
              </p>
              <p className="text-slate-300 text-[11px]">
                👥 <strong>Affected Victims:</strong> {currentDisaster.casualtySummary}
              </p>
              <p className="text-slate-300 text-[11px]">
                ⚠️ <strong>Threat Dynamics:</strong> {currentDisaster.hazardDescription}
              </p>
              <p className="text-slate-400 text-[10px] font-mono pt-0.5">
                🛡️ Safe Evacuation Shelter: 🏥 Govt General Hospital Safe Base
              </p>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
