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
  Home,
  Globe,
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
  settingName: string;
  settingDescription: string;
  casualtySummary: string;
  hazardDescription: string;
  skyColor: number;
  fogColor: number;
  incidentPos: [number, number, number];
  safeZonePos: [number, number, number];
  safeZoneName: string;
  cameraInteriorPos: [number, number, number];
  cameraOverviewPos: [number, number, number];
  options: RescuePossibility[];
}

/**
 * 6 Disaster Configurations with Unique Realistic Interior & Outdoor Backgrounds
 */
const DISASTER_CONFIGS: Record<DisasterCategory, DisasterConfig> = {
  WILDFIRE: {
    id: 'WILDFIRE',
    name: 'Wildfire / Inferno',
    icon: '🔥',
    color: 'from-red-600 to-orange-500',
    scenarioTitle: 'Residential House Trapped by Flashover Fire',
    settingName: 'Inside Burning House (2nd Floor Balcony)',
    settingDescription: 'Charred living room walls, flaming furniture, collapsed ceiling beam, smoke ceiling layer',
    casualtySummary: '16 Trapped in Back Bedroom • 4 Smoke Inhalation',
    hazardDescription: '850°C radiant heat, zero-visibility toxic smoke, fire cutting off stairwell',
    skyColor: 0x270707,
    fogColor: 0x3d0c02,
    incidentPos: [0, 0, 0],
    safeZonePos: [-45, 2, -35],
    safeZoneName: '⚓ Upwind Marine Pier Shelter',
    cameraInteriorPos: [-8, 12, 18],
    cameraOverviewPos: [-25, 45, 65],
    options: [
      {
        id: 'AIR_BOMBER',
        name: 'Option A: Bambi Bucket Helo Water Drop + FLIR Corridor',
        vehicleName: 'Fire Bomber Helo AIR-01',
        feasibilityScore: 96,
        etaMins: 3,
        capacity: '16 Trapped Evacuees',
        riskLevel: 'LOW',
        routeDescription: 'Thermal FLIR Clear Skyway Approach',
        pros: ['Suppresses roof flames with 2,000L drop', 'Cools bedroom balcony escape route'],
        cons: ['Requires turnaround refill cycle'],
        actionStatus: '🛩️ 2000L Fire Drop on Roof ➔ Bedroom Balcony Cleared ➔ Safe Evacuation'
      },
      {
        id: 'FOAM_TENDER',
        name: 'Option B: Armored Foam Tender Unit',
        vehicleName: 'Industrial Foam Tender Squad',
        feasibilityScore: 74,
        etaMins: 7,
        capacity: '12 People',
        riskLevel: 'MEDIUM',
        routeDescription: 'Wetted Driveway Perimeter',
        pros: ['Positive-pressure cabin protects crew', 'High-volume chemical foam barrier'],
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
        routeDescription: 'Unpaved Yard Corridor',
        pros: ['No vehicle reliance'],
        cons: ['CRITICAL: Fire moving at 28 km/h will cut off yard in 4 mins!'],
        actionStatus: '🚨 HIGH HAZARD: Fire Flashover Threat! Yard engulfed.'
      }
    ]
  },

  FLOOD: {
    id: 'FLOOD',
    name: 'Flood / Tsunami',
    icon: '🌊',
    color: 'from-blue-600 to-cyan-500',
    scenarioTitle: 'Submerged 2-Story Residence (Water in Living Room)',
    settingName: 'Inside Flooded House & Attic Rooftop',
    settingDescription: '1st floor submerged in 4.2ft water, floating furniture, victims huddled on attic roof',
    casualtySummary: '14 Stranded on Attic Roof • 2 Leg Fractures',
    hazardDescription: 'Rising water currents, submerged 11kV lines, ground floor inaccessible',
    skyColor: 0x020617,
    fogColor: 0x031525,
    incidentPos: [0, 0, 0],
    safeZonePos: [50, 18, -45],
    safeZoneName: '🏥 Govt Hospital High-Ground Shelter',
    cameraInteriorPos: [-12, 14, 18],
    cameraOverviewPos: [-25, 45, 65],
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
        pros: ['Shallow 4.2ft draft optimal', 'Direct attic balcony high-line tethering', 'Low structural risk'],
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
    scenarioTitle: 'Crushed Building Basement & Life Triangle Void',
    settingName: 'Inside Shattered Basement Concrete Void',
    settingDescription: 'Tilted cracked ceiling slabs, exposed rebar beams, crushed pipes, trapped survivors in void',
    casualtySummary: '9 Trapped in Basement Rubble Void',
    hazardDescription: 'Aftershock collapse hazard, gas line rupture, unstable concrete slabs',
    skyColor: 0x0f172a,
    fogColor: 0x1c1917,
    incidentPos: [0, 0, 0],
    safeZonePos: [45, 2, 40],
    safeZoneName: '🏟️ City Stadium Seismic Relief Base',
    cameraInteriorPos: [-8, 8, 14],
    cameraOverviewPos: [-25, 45, 65],
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

  CHEMICAL_HAZMAT: {
    id: 'CHEMICAL_HAZMAT',
    name: 'Chemical / Hazmat Gas',
    icon: '☣️',
    color: 'from-emerald-600 to-lime-500',
    scenarioTitle: 'Chemical Plant Control Room & Ruptured Reactor Valve',
    settingName: 'Inside Factory Control Room (Toxic Vapor Leak)',
    settingDescription: 'Industrial pipes, leaking green chlorine gas vent, control monitors, sealed emergency chamber',
    casualtySummary: '8 Workers Trapped in Control Room',
    hazardDescription: 'Lethal LC50 gas plume, caustic vapor burns, air supply depleting',
    skyColor: 0x031c12,
    fogColor: 0x062d1d,
    incidentPos: [0, 0, 0],
    safeZonePos: [-35, 2, 45],
    safeZoneName: '☣️ Mobile Decontamination Base',
    cameraInteriorPos: [-10, 10, 16],
    cameraOverviewPos: [-25, 45, 65],
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

  CYCLONE: {
    id: 'CYCLONE',
    name: 'Cyclone / Hurricane',
    icon: '🌪️',
    color: 'from-teal-600 to-cyan-700',
    scenarioTitle: 'Coastal Community Hall with Ripped Roof',
    settingName: 'Inside Battered Community Hall',
    settingDescription: 'Torn corrugated roof sheets exposing squall sky, rain streaming down, barricaded doors',
    casualtySummary: '11 Stranded in Coastal Hall',
    hazardDescription: 'Airborne metal sheet debris, severed power grid, 140 km/h wind gusts',
    skyColor: 0x04131e,
    fogColor: 0x08253a,
    incidentPos: [0, 0, 0],
    safeZonePos: [40, 14, -20],
    safeZoneName: '🛡️ Reinforced Inland Cyclone Bunker',
    cameraInteriorPos: [-12, 10, 18],
    cameraOverviewPos: [-25, 45, 65],
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

  LANDSLIDE: {
    id: 'LANDSLIDE',
    name: 'Landslide / Avalanche',
    icon: '🏔️',
    color: 'from-amber-700 to-yellow-600',
    scenarioTitle: 'Mountain Bus Buried in Mudflow',
    settingName: 'Inside Mountain Bus Trapped in Mud',
    settingDescription: 'Tilted vehicle cabin, mud crushing windows, roof escape hatch open for rescue',
    casualtySummary: '12 Stranded in Mountain Bus',
    hazardDescription: 'Secondary slope failure risk, severed access road, mud burying vehicle',
    skyColor: 0x0a101d,
    fogColor: 0x141a29,
    incidentPos: [0, 0, 0],
    safeZonePos: [45, 22, 25],
    safeZoneName: '🚁 Alpine Heli-Plateau Safe Zone',
    cameraInteriorPos: [-10, 10, 16],
    cameraOverviewPos: [-25, 45, 65],
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
function createFacadeTexture(type: 'OFFICE' | 'WOOD_WALL' | 'CONCRETE_SLAB' | 'CONTROL_ROOM'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  if (type === 'WOOD_WALL') {
    // Charred Wood Planks
    ctx.fillStyle = '#29180c';
    ctx.fillRect(0, 0, 512, 512);
    ctx.strokeStyle = '#150a04';
    ctx.lineWidth = 6;
    for (let y = 0; y < 512; y += 64) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(512, y);
      ctx.stroke();
    }
  } else if (type === 'CONTROL_ROOM') {
    // Industrial Metal Paneling with Hazard Stripes
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, 512, 512);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(0, 480, 512, 32);
    ctx.fillStyle = '#0f172a';
    for (let x = 0; x < 512; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 480);
      ctx.lineTo(x + 20, 512);
      ctx.lineTo(x + 35, 512);
      ctx.lineTo(x + 15, 480);
      ctx.fill();
    }
  } else {
    // Concrete / Masonry
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, 512, 512);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
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
  const [activeDisaster, setActiveDisaster] = useState<DisasterCategory>('WILDFIRE');
  const currentDisaster = DISASTER_CONFIGS[activeDisaster];

  // View Mode: Inside Room vs Full City Overview
  const [viewPerspective, setViewPerspective] = useState<'INTERIOR' | 'OVERVIEW'>('INTERIOR');

  // Active Selected Rescue Strategy
  const [selectedPossibilityIndex, setSelectedPossibilityIndex] = useState<number>(0);
  const currentOption = currentDisaster.options[selectedPossibilityIndex] || currentDisaster.options[0];

  // Mobile Bottom Tab State
  const [mobileBottomTab, setMobileBottomTab] = useState<'STRATEGIES' | 'ROOM_ENVIRONMENT'>('STRATEGIES');

  // References for Three.js Scene Updates
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const dynamicRoomGroupRef = useRef<THREE.Group | null>(null);
  const fireFlickerLightRef = useRef<THREE.PointLight | null>(null);
  const particleSystemRef = useRef<THREE.Points | null>(null);
  const vehicleGroupRef = useRef<THREE.Group | null>(null);

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
    scene.fog = new THREE.FogExp2(currentDisaster.fogColor, 0.009);
    sceneRef.current = scene;

    // 2. Camera Setup based on View Mode
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    if (viewPerspective === 'INTERIOR') {
      const [ix, iy, iz] = currentDisaster.cameraInteriorPos;
      camera.position.set(ix, iy, iz);
      camera.lookAt(0, 3.5, 0);
    } else {
      const [ox, oy, oz] = currentDisaster.cameraOverviewPos;
      camera.position.set(ox, oy, oz);
      camera.lookAt(0, 5, 0);
    }
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Ambient & Directional Lighting
    const ambientLight = new THREE.AmbientLight(0x1e293b, 1.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x38bdf8, 1.5);
    dirLight.position.set(20, 40, 30);
    dirLight.castShadow = true;
    scene.add(dirLight);

    // Dynamic Flickering Disaster Accent Light (Flame / Hazard Glow)
    const fireLight = new THREE.PointLight(
      activeDisaster === 'WILDFIRE' ? 0xf97316 : activeDisaster === 'CHEMICAL_HAZMAT' ? 0x22c55e : activeDisaster === 'FLOOD' ? 0x0284c7 : 0xf59e0b, 
      6, 
      40
    );
    fireLight.position.set(-2, 3, 2);
    scene.add(fireLight);
    fireFlickerLightRef.current = fireLight;

    // Ground Plane
    const groundGeo = new THREE.PlaneGeometry(240, 240);
    const groundMat = new THREE.MeshStandardMaterial({ 
      color: activeDisaster === 'WILDFIRE' ? 0x140703 : activeDisaster === 'EARTHQUAKE' ? 0x18181b : 0x060913, 
      roughness: 0.9 
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const gridHelper = new THREE.GridHelper(240, 48, 0x1e293b, 0x0f172a);
    gridHelper.position.y = 0.05;
    scene.add(gridHelper);

    // -------------------------------------------------------------
    // 5. AUTHENTIC 3D ROOM INTERIOR & DISASTER BACKGROUND SETTING
    // -------------------------------------------------------------
    const roomGroup = new THREE.Group();
    scene.add(roomGroup);
    dynamicRoomGroupRef.current = roomGroup;

    // Shared Textures
    const woodTexture = createFacadeTexture('WOOD_WALL');
    const controlTexture = createFacadeTexture('CONTROL_ROOM');

    // =============================================================
    // SETTING 1: 🔥 BURNING HOUSE INTERIOR (LIVING ROOM & BALCONY)
    // =============================================================
    if (activeDisaster === 'WILDFIRE') {
      // 1. House Floor (Parquet Wood / Charred)
      const floor = new THREE.Mesh(
        new THREE.BoxGeometry(22, 0.4, 22),
        new THREE.MeshStandardMaterial({ map: woodTexture, roughness: 0.8 })
      );
      floor.position.y = 0.2;
      roomGroup.add(floor);

      // 2. Back & Side Interior House Walls (Dollhouse Cutaway)
      const wallMat = new THREE.MeshStandardMaterial({ color: 0x3e1d13, roughness: 0.9 });
      const backWall = new THREE.Mesh(new THREE.BoxGeometry(22, 8, 0.5), wallMat);
      backWall.position.set(0, 4.2, -11);
      roomGroup.add(backWall);

      const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.5, 8, 22), wallMat);
      leftWall.position.set(-11, 4.2, 0);
      roomGroup.add(leftWall);

      // 3. Interior Partition Doorway
      const partition = new THREE.Mesh(new THREE.BoxGeometry(0.4, 8, 8), wallMat);
      partition.position.set(0, 4.2, -7);
      roomGroup.add(partition);

      // 4. Burning Furniture (Flaming Sofa & Bookshelf in Left Living Room)
      const sofa = new THREE.Mesh(new THREE.BoxGeometry(5, 1.4, 2.4), new THREE.MeshStandardMaterial({ color: 0x7c2d12 }));
      sofa.position.set(-6, 0.9, -5);
      roomGroup.add(sofa);

      // Collapsed Burning Ceiling Rafter Beam
      const rafter = new THREE.Mesh(new THREE.BoxGeometry(14, 0.6, 0.6), new THREE.MeshStandardMaterial({ color: 0xd97706, emissive: 0xb45309, emissiveIntensity: 0.8 }));
      rafter.position.set(-3, 3.5, -2);
      rafter.rotation.z = Math.PI * 0.15;
      rafter.rotation.y = Math.PI * 0.25;
      roomGroup.add(rafter);

      // 5. Fire Volumetric Glow Column in Living Room
      const fireCone = new THREE.Mesh(
        new THREE.ConeGeometry(2.5, 5, 16),
        new THREE.MeshBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0.75 })
      );
      fireCone.position.set(-6, 2.7, -5);
      roomGroup.add(fireCone);

      // 6. Safe Bedroom Balcony (Where 14 Victims are huddled)
      const balconyRailing = new THREE.Mesh(new THREE.BoxGeometry(10, 1.1, 0.2), new THREE.MeshBasicMaterial({ color: 0xf59e0b }));
      balconyRailing.position.set(6, 0.95, 11);
      roomGroup.add(balconyRailing);
    }

    // =============================================================
    // SETTING 2: 🌊 SUBMERGED 2-STORY HOUSE & ATTIC ROOF
    // =============================================================
    else if (activeDisaster === 'FLOOD') {
      // 1. Flooded Ground Floor
      const waterFloor = new THREE.Mesh(
        new THREE.BoxGeometry(24, 3.8, 24),
        new THREE.MeshStandardMaterial({ color: 0x0284c7, transparent: true, opacity: 0.75, roughness: 0.1 })
      );
      waterFloor.position.set(0, 1.9, 0);
      roomGroup.add(waterFloor);

      // Floating living room table
      const floatTable = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.4, 2.5), new THREE.MeshStandardMaterial({ color: 0x78350f }));
      floatTable.position.set(-5, 4.0, -3);
      floatTable.rotation.z = 0.1;
      roomGroup.add(floatTable);

      // Staircase leading from water up to 2nd floor / attic
      for (let s = 0; s < 6; s++) {
        const step = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.5, 1.0), new THREE.MeshStandardMaterial({ color: 0x334155 }));
        step.position.set(0, 1.5 + s * 0.8, -8 + s * 1.4);
        roomGroup.add(step);
      }

      // Upper Attic Deck (Where victims stand safe above 4.2ft water)
      const atticDeck = new THREE.Mesh(new THREE.BoxGeometry(14, 0.5, 14), new THREE.MeshStandardMaterial({ color: 0x475569 }));
      atticDeck.position.set(3, 6.0, 3);
      roomGroup.add(atticDeck);

      const atticRail = new THREE.Mesh(new THREE.BoxGeometry(14.2, 1.0, 14.2), new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true }));
      atticRail.position.set(3, 6.7, 3);
      roomGroup.add(atticRail);
    }

    // =============================================================
    // SETTING 3: 🏚️ CRUSHED BASEMENT & CONCRETE RUBBLE VOID
    // =============================================================
    else if (activeDisaster === 'EARTHQUAKE') {
      // Fractured concrete floor
      const crackedFloor = new THREE.Mesh(new THREE.BoxGeometry(22, 0.4, 22), new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.9 }));
      crackedFloor.position.y = 0.2;
      roomGroup.add(crackedFloor);

      // Triangular "Life Triangle" Concrete Slabs
      const slab1 = new THREE.Mesh(new THREE.BoxGeometry(12, 0.8, 12), new THREE.MeshStandardMaterial({ color: 0x52525b, roughness: 0.7 }));
      slab1.position.set(-3, 3.5, 0);
      slab1.rotation.z = Math.PI * 0.2;
      roomGroup.add(slab1);

      // Crushed Pillar
      const crushedPillar = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 4.5, 8), new THREE.MeshStandardMaterial({ color: 0x71717a }));
      crushedPillar.position.set(4, 2.2, 2);
      crushedPillar.rotation.x = 0.3;
      roomGroup.add(crushedPillar);

      // Broken Industrial Pipe with water leak
      const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 8, 8), new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.8 }));
      pipe.position.set(-5, 4.5, -4);
      pipe.rotation.z = Math.PI / 2;
      roomGroup.add(pipe);
    }

    // =============================================================
    // SETTING 4: ☣️ CHEMICAL FACTORY CONTROL ROOM & TOXIC VENT
    // =============================================================
    else if (activeDisaster === 'CHEMICAL_HAZMAT') {
      // Industrial Control Room Floor
      const indFloor = new THREE.Mesh(new THREE.BoxGeometry(22, 0.4, 22), new THREE.MeshStandardMaterial({ map: controlTexture }));
      indFloor.position.y = 0.2;
      roomGroup.add(indFloor);

      // Chemical Reactor Tank
      const reactor = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.5, 7, 16), new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.7 }));
      reactor.position.set(-7, 3.7, -6);
      roomGroup.add(reactor);

      // Leaking Toxic Green Gas Plume
      const gasCloud = new THREE.Mesh(
        new THREE.SphereGeometry(3.5, 16, 16),
        new THREE.MeshStandardMaterial({ color: 0x22c55e, transparent: true, opacity: 0.6, emissive: 0x15803d, emissiveIntensity: 0.8 })
      );
      gasCloud.position.set(-7, 5.5, -4);
      roomGroup.add(gasCloud);

      // Sealed Control Room Console & Safety Glass
      const consoleDesk = new THREE.Mesh(new THREE.BoxGeometry(6, 1.4, 2), new THREE.MeshStandardMaterial({ color: 0x0f172a }));
      consoleDesk.position.set(4, 0.9, 3);
      roomGroup.add(consoleDesk);

      const glassWall = new THREE.Mesh(
        new THREE.BoxGeometry(14, 5, 0.2),
        new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.35, roughness: 0.1 })
      );
      glassWall.position.set(0, 2.8, -1);
      roomGroup.add(glassWall);
    }

    // =============================================================
    // SETTING 5: 🌪️ BATTERED COASTAL COMMUNITY HALL (TORN ROOF)
    // =============================================================
    else if (activeDisaster === 'CYCLONE') {
      const hallFloor = new THREE.Mesh(new THREE.BoxGeometry(24, 0.4, 24), new THREE.MeshStandardMaterial({ color: 0x1e293b }));
      hallFloor.position.y = 0.2;
      roomGroup.add(hallFloor);

      // Peeling Corrugated Metal Roof Sheets
      const sheet1 = new THREE.Mesh(new THREE.BoxGeometry(10, 0.1, 8), new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8 }));
      sheet1.position.set(-5, 6.5, -2);
      sheet1.rotation.z = Math.PI * 0.25;
      roomGroup.add(sheet1);

      // Barricaded Sandbags
      for (let b = 0; b < 6; b++) {
        const bag = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.6, 0.8), new THREE.MeshStandardMaterial({ color: 0xd97706 }));
        bag.position.set(-8 + b * 1.6, 0.5, 9);
        roomGroup.add(bag);
      }
    }

    // =============================================================
    // SETTING 6: 🏔️ MOUNTAIN PASS BUS BURIED IN MUD
    // =============================================================
    else if (activeDisaster === 'LANDSLIDE') {
      // Tilted Bus Body
      const busBody = new THREE.Mesh(new THREE.BoxGeometry(6, 3.5, 14), new THREE.MeshStandardMaterial({ color: 0x2563eb }));
      busBody.position.set(0, 2.2, 0);
      busBody.rotation.z = 0.2;
      roomGroup.add(busBody);

      // Mudflow volume burying left side
      const mudPile = new THREE.Mesh(new THREE.ConeGeometry(8, 5, 16), new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 }));
      mudPile.position.set(-3.5, 2.0, 0);
      roomGroup.add(mudPile);

      // Roof Escape Hatch open
      const hatch = new THREE.Mesh(new THREE.BoxGeometry(2, 0.2, 2), new THREE.MeshStandardMaterial({ color: 0xf59e0b }));
      hatch.position.set(0.5, 4.1, 2);
      roomGroup.add(hatch);
    }

    // -------------------------------------------------------------
    // 6. 3D HUMAN STRANDED VICTIMS IN THE SPECIFIC ROOM SETTING
    // -------------------------------------------------------------
    const peopleStuckGroup = new THREE.Group();
    scene.add(peopleStuckGroup);

    const shirtColors = [0xf59e0b, 0x38bdf8, 0xef4444, 0x10b981, 0xa855f7, 0xf97316, 0xec4899];

    // Victim positioning inside the room
    const victimBaseY = activeDisaster === 'FLOOD' ? 6.25 : activeDisaster === 'LANDSLIDE' ? 4.1 : 0.4;
    const victimBaseX = activeDisaster === 'WILDFIRE' ? 5 : activeDisaster === 'FLOOD' ? 3 : 0;
    const victimBaseZ = activeDisaster === 'WILDFIRE' ? 6 : activeDisaster === 'FLOOD' ? 3 : 0;

    for (let p = 0; p < 14; p++) {
      const px = victimBaseX + (p % 4) * 1.6 - 2.4;
      const pz = victimBaseZ + Math.floor(p / 4) * 1.6 - 2.4;
      const isInjured = p === 0 || p === 1;

      const humanFigure = createHumanFigure({
        isRescuer: false,
        isInjured,
        isWaving: true,
        shirtColor: shirtColors[p % shirtColors.length],
        scale: 0.9
      });

      humanFigure.position.set(px, victimBaseY, pz);
      peopleStuckGroup.add(humanFigure);
    }

    // Floating SOS Ring
    const sosRing = new THREE.Mesh(
      new THREE.RingGeometry(2.8, 3.4, 32),
      new THREE.MeshBasicMaterial({ color: 0xef4444, side: THREE.DoubleSide, transparent: true, opacity: 0.85 })
    );
    sosRing.rotation.x = -Math.PI / 2;
    sosRing.position.set(victimBaseX, victimBaseY + 3.2, victimBaseZ);
    peopleStuckGroup.add(sosRing);

    // -------------------------------------------------------------
    // 7. PARTICLES (Rain, Embers, Smoke Droplets)
    // -------------------------------------------------------------
    const particleCount = 280;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 40;
      particlePositions[i + 1] = Math.random() * 25;
      particlePositions[i + 2] = (Math.random() - 0.5) * 40;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: activeDisaster === 'WILDFIRE' ? 0xf59e0b : activeDisaster === 'CHEMICAL_HAZMAT' ? 0x22c55e : activeDisaster === 'CYCLONE' ? 0x38bdf8 : 0x94a3b8,
      size: 0.6,
      transparent: true,
      opacity: 0.85
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);
    particleSystemRef.current = particles;

    // -------------------------------------------------------------
    // 8. 3D RESCUE VEHICLE APPROACHING THE ROOM
    // -------------------------------------------------------------
    const vehicleGroup = new THREE.Group();
    vehicleGroupRef.current = vehicleGroup;
    scene.add(vehicleGroup);

    // Helicopter in Airspace
    const heloContainer = new THREE.Group();
    const heloBody = new THREE.Mesh(new THREE.BoxGeometry(4.5, 3.2, 9.5), new THREE.MeshStandardMaterial({ color: 0xf59e0b }));
    heloContainer.add(heloBody);

    const rotor = new THREE.Mesh(new THREE.BoxGeometry(16, 0.2, 1.4), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    rotor.position.set(0, 2.2, 0);
    heloContainer.add(rotor);

    const heloPilot = createHumanFigure({ isRescuer: true, scale: 0.95 });
    heloPilot.position.set(0, 0.3, 2.0);
    heloContainer.add(heloPilot);

    heloContainer.position.set(10, 18, 20);
    vehicleGroup.add(heloContainer);

    // 9. Touch & Mouse Orbit Controls
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

      cameraRef.current.position.x += deltaX * 0.15;
      cameraRef.current.position.y = Math.max(4, Math.min(80, cameraRef.current.position.y - deltaY * 0.15));
      cameraRef.current.lookAt(0, 3, 0);

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

      cameraRef.current.position.x += deltaX * 0.2;
      cameraRef.current.position.y = Math.max(4, Math.min(80, cameraRef.current.position.y - deltaY * 0.2));
      cameraRef.current.lookAt(0, 3, 0);

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

    // 10. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Flame / Light Flicker Animation inside room
      if (fireFlickerLightRef.current) {
        fireFlickerLightRef.current.intensity = 5 + Math.sin(elapsedTime * 15) * 1.5 + Math.cos(elapsedTime * 25) * 0.8;
      }

      // Particles Falling
      if (particleSystemRef.current) {
        const pos = particleSystemRef.current.geometry.attributes.position.array as Float32Array;
        for (let p = 1; p < pos.length; p += 3) {
          pos[p] -= activeDisaster === 'CYCLONE' ? 0.8 : 0.25;
          if (pos[p] < 0) pos[p] = 25;
        }
        particleSystemRef.current.geometry.attributes.position.needsUpdate = true;
      }

      // Helo Rotor Spin
      if (vehicleGroupRef.current && vehicleGroupRef.current.children[0]) {
        const heloMesh = vehicleGroupRef.current.children[0];
        if (heloMesh.children[1]) {
          heloMesh.children[1].rotation.y = elapsedTime * 30;
        }
        heloMesh.position.y = 16 + Math.sin(elapsedTime * 2) * 1.5;
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
  }, [activeDisaster, viewPerspective, selectedPossibilityIndex]);

  const handleSwitchDisaster = (disasterId: DisasterCategory) => {
    setActiveDisaster(disasterId);
    setSelectedPossibilityIndex(0);
  };

  const handleTogglePerspective = (mode: 'INTERIOR' | 'OVERVIEW') => {
    setViewPerspective(mode);
    if (!cameraRef.current) return;
    if (mode === 'INTERIOR') {
      const [ix, iy, iz] = currentDisaster.cameraInteriorPos;
      cameraRef.current.position.set(ix, iy, iz);
      cameraRef.current.lookAt(0, 3.5, 0);
    } else {
      const [ox, oy, oz] = currentDisaster.cameraOverviewPos;
      cameraRef.current.position.set(ox, oy, oz);
      cameraRef.current.lookAt(0, 5, 0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col text-slate-100 select-none overflow-hidden animate-in fade-in">
      
      {/* ======================================================== */}
      {/* 1. TOP DISASTER & SETTING BAR                            */}
      {/* ======================================================== */}
      <header className="p-2.5 bg-slate-900 border-b border-slate-800 shrink-0 z-30 space-y-2 shadow-lg">
        
        {/* Top Row: Back + Disaster Setting Info + View Mode Toggle */}
        <div className="flex items-center justify-between gap-2">
          
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center gap-1 text-xs font-bold shrink-0 active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-[11px]">Exit</span>
            </button>

            <div>
              <h1 className="text-xs font-black text-white flex items-center gap-1.5 leading-tight">
                <span>3D SCENE</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono font-bold">
                  {currentDisaster.icon} {currentDisaster.settingName}
                </span>
              </h1>
              <p className="text-[9px] text-slate-400 font-mono line-clamp-1">
                {currentDisaster.scenarioTitle}
              </p>
            </div>
          </div>

          {/* Perspective Mode Switcher: Room Interior vs City Overview */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
            <button
              onClick={() => handleTogglePerspective('INTERIOR')}
              className={`px-2 py-1 rounded-lg font-bold text-[10px] transition flex items-center gap-1 ${
                viewPerspective === 'INTERIOR'
                  ? 'bg-amber-500 text-slate-950 font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Home className="w-3 h-3" />
              <span>Inside House</span>
            </button>

            <button
              onClick={() => handleTogglePerspective('OVERVIEW')}
              className={`px-2 py-1 rounded-lg font-bold text-[10px] transition flex items-center gap-1 ${
                viewPerspective === 'OVERVIEW'
                  ? 'bg-amber-500 text-slate-950 font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Globe className="w-3 h-3" />
              <span>City View</span>
            </button>
          </div>

        </div>

        {/* Disaster Type Pills (Horizontal Scroll) */}
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
      {/* 2. FULL-VIEW UNOBSTRUCTED 3D ROOM CANVAS                 */}
      {/* ======================================================== */}
      <div className="relative flex-1 bg-slate-950 overflow-hidden w-full min-h-[40vh]">
        
        {/* Three.js DOM Injection Mount */}
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing touch-none" />

        {/* Minimal Action Status Ticker */}
        <div className="absolute top-2 left-2 right-2 z-10 pointer-events-none">
          <div className="mx-auto max-w-lg px-3 py-1.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-700/60 shadow-md text-center">
            <span className="text-[10px] font-mono font-bold text-amber-300 truncate block">
              {currentOption.actionStatus}
            </span>
          </div>
        </div>

        {/* Room Environment Tag at Bottom Right */}
        <div className="absolute bottom-2 right-2 z-10 pointer-events-none">
          <span className="text-[9px] font-mono text-amber-400 bg-slate-950/85 px-2 py-0.5 rounded border border-amber-500/40">
            🏠 {currentDisaster.settingName}
          </span>
        </div>

        {/* Touch Gesture Hint */}
        <div className="absolute bottom-2 left-2 z-10 pointer-events-none">
          <span className="text-[9px] font-mono text-slate-500 bg-slate-950/70 px-2 py-0.5 rounded border border-slate-800">
            👆 Drag: Rotate inside room • Pinch: Zoom
          </span>
        </div>

      </div>

      {/* ======================================================== */}
      {/* 3. DOCKED BOTTOM COMMAND TRAY                            */}
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
              onClick={() => setMobileBottomTab('ROOM_ENVIRONMENT')}
              className={`px-3 py-1 rounded-lg text-xs font-black transition flex items-center gap-1.5 ${
                mobileBottomTab === 'ROOM_ENVIRONMENT'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Room Setting Details</span>
            </button>
          </div>

          <span className="text-[10px] font-mono text-emerald-400 font-bold">
            {currentOption.feasibilityScore}% AI MATCH
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

        {/* Tab 2: Room Environment Details */}
        {mobileBottomTab === 'ROOM_ENVIRONMENT' && (
          <div className="p-2.5 space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-amber-400 font-black text-xs">
                <span>🏠 {currentDisaster.settingName}</span>
                <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 text-[10px]">THREAT ZONE</span>
              </div>
              <p className="text-slate-300 text-[11px]">
                🏗️ <strong>Interior Layout:</strong> {currentDisaster.settingDescription}
              </p>
              <p className="text-slate-300 text-[11px]">
                👥 <strong>Trapped Survivors:</strong> {currentDisaster.casualtySummary}
              </p>
              <p className="text-slate-300 text-[11px]">
                ⚠️ <strong>Immediate Threat:</strong> {currentDisaster.hazardDescription}
              </p>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
