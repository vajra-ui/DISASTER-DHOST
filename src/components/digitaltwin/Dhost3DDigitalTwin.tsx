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
  AlertTriangle 
} from 'lucide-react';
import { EmergencyPacket, IncidentPriority } from '../../types/dhostAuth';
import { DEPLOYED_RESCUE_TEAMS } from '../../services/aiTriageService';

interface Props {
  incidents: EmergencyPacket[];
  onSelectIncident?: (incident: EmergencyPacket) => void;
  onClose: () => void;
}

export interface RescuePossibility {
  id: 'ZODIAC_BOAT' | 'HELO_WINCH' | 'TACTICAL_TRUCK';
  name: string;
  vehicleName: string;
  feasibilityScore: number;
  etaMins: number;
  capacity: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  routeDescription: string;
  pros: string[];
  cons: string[];
}

/**
 * Procedural 3D Human Figure Generator
 * Creates articulated human figures (Head, Helmet/Cap, Torso, Reflective Vest, Arms, Legs)
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

  // 1. Head
  const headGeo = new THREE.SphereGeometry(0.32 * scale, 12, 12);
  const skinMat = new THREE.MeshStandardMaterial({ color: 0xe0ac69, roughness: 0.6 });
  const head = new THREE.Mesh(headGeo, skinMat);
  head.position.y = 1.65 * scale;
  head.castShadow = true;
  group.add(head);

  // 2. Helmet / Headgear
  if (isRescuer) {
    const helmetGeo = new THREE.SphereGeometry(0.36 * scale, 12, 12, 0, Math.PI * 2, 0, Math.PI * 0.65);
    const helmetMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, metalness: 0.3 }); // White NDRF Rescue Helmet
    const helmet = new THREE.Mesh(helmetGeo, helmetMat);
    helmet.position.y = 1.72 * scale;
    group.add(helmet);
  } else {
    // Hair
    const hairGeo = new THREE.SphereGeometry(0.34 * scale, 10, 10, 0, Math.PI * 2, 0, Math.PI * 0.5);
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9 });
    const hair = new THREE.Mesh(hairGeo, hairMat);
    hair.position.y = 1.7 * scale;
    group.add(hair);
  }

  // 3. Torso / Tactical Safety Jacket
  const torsoGeo = new THREE.BoxGeometry(0.65 * scale, 0.8 * scale, 0.38 * scale);
  const torsoMat = new THREE.MeshStandardMaterial({ 
    color: isRescuer ? 0xf97316 : isInjured ? 0xef4444 : shirtColor, // High-vis orange for rescuer
    roughness: 0.7 
  });
  const torso = new THREE.Mesh(torsoGeo, torsoMat);
  torso.position.y = 1.08 * scale;
  torso.castShadow = true;
  group.add(torso);

  // Reflective Silver Strips on Rescuer Vest
  if (isRescuer) {
    const stripGeo = new THREE.BoxGeometry(0.68 * scale, 0.14 * scale, 0.4 * scale);
    const stripMat = new THREE.MeshBasicMaterial({ color: 0xf1f5f9 });
    const strip = new THREE.Mesh(stripGeo, stripMat);
    strip.position.y = 1.08 * scale;
    group.add(strip);
  }

  // 4. Arms
  const armGeo = new THREE.CylinderGeometry(0.1 * scale, 0.1 * scale, 0.7 * scale, 8);
  const armMat = new THREE.MeshStandardMaterial({ 
    color: isRescuer ? 0xf97316 : isInjured ? 0xef4444 : shirtColor, 
    roughness: 0.7 
  });

  // Left Arm
  const leftArm = new THREE.Mesh(armGeo, armMat);
  if (isWaving && !isInjured) {
    leftArm.position.set(-0.42 * scale, 1.45 * scale, 0);
    leftArm.rotation.z = Math.PI * 0.75; // Raised waving arm
  } else {
    leftArm.position.set(-0.42 * scale, 0.95 * scale, 0.05 * scale);
    leftArm.rotation.x = Math.PI * 0.15;
  }
  leftArm.castShadow = true;
  group.add(leftArm);

  // Right Arm
  const rightArm = new THREE.Mesh(armGeo, armMat);
  if (isWaving && !isInjured) {
    rightArm.position.set(0.42 * scale, 1.45 * scale, 0);
    rightArm.rotation.z = -Math.PI * 0.75; // Raised waving arm
  } else {
    rightArm.position.set(0.42 * scale, 0.95 * scale, 0.05 * scale);
    rightArm.rotation.x = Math.PI * 0.15;
  }
  rightArm.castShadow = true;
  group.add(rightArm);

  // 5. Legs
  const legGeo = new THREE.CylinderGeometry(0.12 * scale, 0.12 * scale, 0.75 * scale, 8);
  const pantsMat = new THREE.MeshStandardMaterial({ 
    color: isRescuer ? 0x0f172a : 0x1e293b, // Navy tactical trousers
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

  // UI States
  const [selectedIncident, setSelectedIncident] = useState<EmergencyPacket | null>(incidents[0] || null);
  
  // AI Rescue Possibilities Engine State
  const [selectedPossibility, setSelectedPossibility] = useState<'ZODIAC_BOAT' | 'HELO_WINCH' | 'TACTICAL_TRUCK'>('ZODIAC_BOAT');
  const [isAiPossibilitiesOpen, setIsAiPossibilitiesOpen] = useState(true);

  // Rescue Extraction Simulation State
  const [isRescueSimulating, setIsRescueSimulating] = useState(false);
  const [rescueStep, setRescueStep] = useState(1); // 1: APPROACH, 2: WINCH/EXTRACTION, 3: STABILIZE, 4: SAFE EVACUATION
  const [rescueCompleted, setRescueCompleted] = useState(false);

  // Timeline & Simulation
  const [timelineIndex, setTimelineIndex] = useState(2); // 0=22:00, 1=22:15, 2=22:30 (Live), 3=22:45, 4=+15m, 5=+30m
  const [isPlayingTimeline, setIsPlayingTimeline] = useState(false);
  const [isSimulatedRelayDead, setIsSimulatedRelayDead] = useState(false);
  const [meshStatusText, setMeshStatusText] = useState<'OPTIMAL' | 'LOST' | 'SEARCHING' | 'RECOVERED'>('OPTIMAL');

  // Layer Toggles
  const [layerBuildings, setLayerBuildings] = useState(true);
  const [layerFlood, setLayerFlood] = useState(true);
  const [layerPeopleStuck, setLayerPeopleStuck] = useState(true);
  const [layerRescueRoute, setLayerRescueRoute] = useState(true);

  // Focus View Mode
  const [focusMode, setFocusMode] = useState<'OVERVIEW' | 'STRANDED_PEOPLE' | 'RESCUE_ROUTE' | 'TEAM' | 'MESH'>('OVERVIEW');

  // References for Three.js Scene Updates
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const waterMeshRef = useRef<THREE.Mesh | null>(null);
  const riskVolumeMeshRef = useRef<THREE.Mesh | null>(null);
  const particleGroupRef = useRef<THREE.Group | null>(null);
  const vehicleGroupRef = useRef<THREE.Group | null>(null);
  const buildingsGroupRef = useRef<THREE.Group | null>(null);
  const peopleStuckGroupRef = useRef<THREE.Group | null>(null);
  const rescueSplineRef = useRef<THREE.Line | null>(null);
  const rescueBeamRef = useRef<THREE.Mesh | null>(null);

  // AI Rescue Options Definition
  const rescueOptions: RescuePossibility[] = [
    {
      id: 'ZODIAC_BOAT',
      name: 'Option A: Zodiac Inflatable Rescue Raft (Boat Unit #02)',
      vehicleName: 'Team Bravo Zodiac Raft',
      feasibilityScore: 94,
      etaMins: 8,
      capacity: '14+ People (100% Single Sortie)',
      riskLevel: 'LOW',
      routeDescription: 'Deep River Channel (4.8km Safe Waterway Approach)',
      pros: ['Shallow 4.2ft water draft optimal', 'Direct rooftop high-line tethering', 'Low structural impact'],
      cons: ['Slightly slower than helicopter']
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
      cons: ['45 km/h high-altitude wind gusts', 'Rotor downwash on flooded structures']
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
      cons: ['Water level (4.2ft) exceeds 3.5ft air-intake', 'Downed 11kV lines on roadway']
    }
  ];

  const currentOption = rescueOptions.find(o => o.id === selectedPossibility) || rescueOptions[0];

  // Timeline labels
  const timelineSteps = [
    { label: '22:00', desc: 'Pre-Disaster Storm Warning' },
    { label: '22:15', desc: 'River Flood Surge 2.5ft' },
    { label: '22:30', desc: '● LIVE: Peak Inundation (4.2ft)' },
    { label: '22:45', desc: 'Rescue Deployments En Route' },
    { label: '+15m PREDICT', desc: 'Model: Flood Creep to East' },
    { label: '+30m PREDICT', desc: 'Model: Peak Water Level Drop' }
  ];

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
    scene.background = new THREE.Color(0x020617); // Dark Slate 950
    scene.fog = new THREE.FogExp2(0x020617, 0.007);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    camera.position.set(-25, 55, 85);
    camera.lookAt(-5, 8, 0);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0x1e293b, 2.0);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x38bdf8, 1.6);
    dirLight.position.set(40, 80, 50);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    // Subtle Tactical Amber Emergency Accent Light
    const amberLight = new THREE.PointLight(0xf59e0b, 4, 120);
    amberLight.position.set(-18, 25, 10);
    scene.add(amberLight);

    // Emergency Red Beacon Point Light at Stranded Rooftop
    const victimRedLight = new THREE.PointLight(0xef4444, 5, 40);
    victimRedLight.position.set(-18, 16, 12);
    scene.add(victimRedLight);

    // 5. Tactical Ground Plane Grid
    const groundGeo = new THREE.PlaneGeometry(260, 260);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x090d16,
      roughness: 0.9,
      metalness: 0.1
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const gridHelper = new THREE.GridHelper(260, 52, 0x1e293b, 0x0f172a);
    gridHelper.position.y = 0.05;
    scene.add(gridHelper);

    // 6. River & 3D Bridge
    const riverGeo = new THREE.PlaneGeometry(45, 260);
    const riverMat = new THREE.MeshStandardMaterial({
      color: 0x0369a1,
      roughness: 0.1,
      metalness: 0.85,
      transparent: true,
      opacity: 0.85
    });
    const river = new THREE.Mesh(riverGeo, riverMat);
    river.rotation.x = -Math.PI / 2;
    river.position.set(0, 0.1, 0);
    scene.add(river);

    // 3D Bridge Arch
    const bridgeGeo = new THREE.BoxGeometry(18, 2.5, 70);
    const bridgeMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6 });
    const bridge = new THREE.Mesh(bridgeGeo, bridgeMat);
    bridge.position.set(0, 2.5, 0);
    scene.add(bridge);

    // 7. Procedural 3D Buildings
    const buildingsGroup = new THREE.Group();
    buildingsGroupRef.current = buildingsGroup;
    scene.add(buildingsGroup);

    const buildingMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.8,
      metalness: 0.2
    });

    const hospitalMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.5,
      metalness: 0.3
    });

    // Generate City Grid Blocks
    for (let x = -80; x <= 80; x += 24) {
      for (let z = -80; z <= 80; z += 24) {
        if (Math.abs(x) < 24) continue; // River Corridor

        const bHeight = Math.random() * 14 + 6;
        const bGeo = new THREE.BoxGeometry(15, bHeight, 15);
        const bMesh = new THREE.Mesh(bGeo, buildingMat);
        bMesh.position.set(x + (Math.random() * 4 - 2), bHeight / 2, z + (Math.random() * 4 - 2));
        bMesh.castShadow = true;
        bMesh.receiveShadow = true;
        buildingsGroup.add(bMesh);

        // Window edge lines
        const edges = new THREE.EdgesGeometry(bGeo);
        const lineMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.15 });
        const wireframe = new THREE.LineSegments(edges, lineMat);
        wireframe.position.copy(bMesh.position);
        buildingsGroup.add(wireframe);
      }
    }

    // Stranded Building (Old Bridge Sector Rooftop - Height 12)
    const strandedBldgGeo = new THREE.BoxGeometry(18, 12, 18);
    const strandedBldgMat = new THREE.MeshStandardMaterial({ color: 0x273549, roughness: 0.7 });
    const strandedBldg = new THREE.Mesh(strandedBldgGeo, strandedBldgMat);
    strandedBldg.position.set(-18, 6, 12);
    strandedBldg.castShadow = true;
    buildingsGroup.add(strandedBldg);

    // Safe Hospital Landmark (Safe Evacuation Shelter)
    const hospGeo = new THREE.BoxGeometry(26, 18, 26);
    const hospMesh = new THREE.Mesh(hospGeo, hospitalMat);
    hospMesh.position.set(50, 9, -45);
    hospMesh.castShadow = true;
    buildingsGroup.add(hospMesh);

    // Hospital Green Cross Marker on Roof
    const crossGeoH = new THREE.BoxGeometry(10, 0.5, 3);
    const crossGeoV = new THREE.BoxGeometry(3, 0.5, 10);
    const crossMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const crossH = new THREE.Mesh(crossGeoH, crossMat);
    const crossV = new THREE.Mesh(crossGeoV, crossMat);
    crossH.position.set(50, 18.3, -45);
    crossV.position.set(50, 18.3, -45);
    buildingsGroup.add(crossH);
    buildingsGroup.add(crossV);

    // 8. 3D Water Flood Inundation Volume
    const waterGeo = new THREE.BoxGeometry(180, 4.5, 180);
    const waterVolumeMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      transparent: true,
      opacity: 0.5,
      roughness: 0.1,
      metalness: 0.9
    });
    const waterVolume = new THREE.Mesh(waterGeo, waterVolumeMat);
    waterVolume.position.set(-10, 2.25, 10);
    scene.add(waterVolume);
    waterMeshRef.current = waterVolume;

    // 9. 3D AI Risk Volumes
    const riskGeo = new THREE.CylinderGeometry(20, 28, 16, 32);
    const riskMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      transparent: true,
      opacity: 0.22,
      wireframe: false
    });
    const riskVolume = new THREE.Mesh(riskGeo, riskMat);
    riskVolume.position.set(-18, 8, 12);
    scene.add(riskVolume);
    riskVolumeMeshRef.current = riskVolume;

    // -------------------------------------------------------------
    // 10. 3D VISIBLE HUMAN STRANDED PEOPLE CLUSTERS ON ROOFTOP
    // -------------------------------------------------------------
    const peopleStuckGroup = new THREE.Group();
    peopleStuckGroupRef.current = peopleStuckGroup;
    scene.add(peopleStuckGroup);

    // 14 Full 3D Human Figures (Head, Torso, Arms Waving, Legs)
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

    // Floating SOS Beacon Ring Above Trapped Rooftop
    const sosRingGeo = new THREE.RingGeometry(3.8, 4.6, 32);
    const sosRingMat = new THREE.MeshBasicMaterial({ color: 0xef4444, side: THREE.DoubleSide, transparent: true, opacity: 0.85 });
    const sosRing = new THREE.Mesh(sosRingGeo, sosRingMat);
    sosRing.rotation.x = -Math.PI / 2;
    sosRing.position.set(-18, 15.5, 12);
    peopleStuckGroup.add(sosRing);

    // Vertical Light Beam from Rooftop
    const beamGeo = new THREE.CylinderGeometry(0.35, 0.35, 45, 16);
    const beamMat = new THREE.MeshBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0.85 });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.position.set(-18, 34, 12);
    peopleStuckGroup.add(beam);

    // -------------------------------------------------------------
    // 11. 3D RESCUE ROUTE SPLINE (HOW RESCUERS RESCUE THEM)
    // -------------------------------------------------------------
    const routeCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 3, -40),    // Rescuer Starting Base
      new THREE.Vector3(0, 3, -15),    // River Channel High-Ground Approach
      new THREE.Vector3(-10, 3.5, 0),  // Deep Waterway Navigation (Avoids collapsed bridge)
      new THREE.Vector3(-18, 4, 8),    // Approach Under Trapped Rooftop
      new THREE.Vector3(-18, 12, 12),  // Winch / Inflatable Raft Extraction Point
      new THREE.Vector3(15, 6, -10),   // High-Ground Safe Evacuation Channel
      new THREE.Vector3(50, 10, -45)   // Safe Hospital & Relief Shelter
    ]);

    const routePoints = routeCurve.getPoints(80);
    const routeGeo = new THREE.BufferGeometry().setFromPoints(routePoints);
    const routeMat = new THREE.LineDashedMaterial({
      color: 0x10b981,
      dashSize: 3,
      gapSize: 1.5,
      linewidth: 4
    });
    const routeLine = new THREE.Line(routeGeo, routeMat);
    routeLine.computeLineDistances();
    scene.add(routeLine);
    rescueSplineRef.current = routeLine;

    // Extraction Winch Laser Beam
    const winchGeo = new THREE.CylinderGeometry(0.2, 0.2, 8, 16);
    const winchMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0 });
    const winchBeam = new THREE.Mesh(winchGeo, winchMat);
    winchBeam.position.set(-18, 8, 12);
    scene.add(winchBeam);
    rescueBeamRef.current = winchBeam;

    // -------------------------------------------------------------
    // 12. 3D RESCUE VEHICLES WITH VISIBLE HUMAN RESCUE CREW
    // -------------------------------------------------------------
    const vehicleGroup = new THREE.Group();
    vehicleGroupRef.current = vehicleGroup;
    scene.add(vehicleGroup);

    // Team Bravo Rescue Boat with 2 Visible Human Rescuers on Deck!
    const boatContainer = new THREE.Group();
    const boatGeo = new THREE.BoxGeometry(4.8, 1.8, 8.5);
    const boatMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.3 });
    const boatHull = new THREE.Mesh(boatGeo, boatMat);
    boatHull.castShadow = true;
    boatContainer.add(boatHull);

    // Human Rescuer 1 (Sgt. Ananya Sen / Squad Captain) standing at the steering helm!
    const rescuer1 = createHumanFigure({
      isRescuer: true,
      isInjured: false,
      isWaving: false,
      shirtColor: 0xf97316,
      scale: 1.1
    });
    rescuer1.position.set(0.8, 0.9, 1.5);
    boatContainer.add(rescuer1);

    // Human Rescuer 2 (Paramedic with High-Vis Jacket) standing at the bow!
    const rescuer2 = createHumanFigure({
      isRescuer: true,
      isInjured: false,
      isWaving: false,
      shirtColor: 0xf97316,
      scale: 1.1
    });
    rescuer2.position.set(-0.8, 0.9, -1.8);
    boatContainer.add(rescuer2);

    boatContainer.position.set(0, 3, -40);
    vehicleGroup.add(boatContainer);

    // Helicopter Helo AIR-01 with Human Crew
    const heloContainer = new THREE.Group();
    const heloGeo = new THREE.BoxGeometry(4, 3, 9);
    const heloMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.2 });
    const helo = new THREE.Mesh(heloGeo, heloMat);
    heloContainer.add(helo);

    // Helo Rotor Blade
    const rotorGeo = new THREE.BoxGeometry(15, 0.2, 1.4);
    const rotorMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const rotor = new THREE.Mesh(rotorGeo, rotorMat);
    rotor.position.set(0, 2, 0);
    helo.add(rotor);

    // Human Pilot visible in Helo
    const heloPilot = createHumanFigure({
      isRescuer: true,
      isInjured: false,
      isWaving: false,
      shirtColor: 0xf97316,
      scale: 0.9
    });
    heloPilot.position.set(0, 0.2, 1.8);
    heloContainer.add(heloPilot);

    heloContainer.position.set(20, 35, -40);
    vehicleGroup.add(heloContainer);

    // 13. 3D LoRa Mesh Network Lines & Data Particles
    const particleGroup = new THREE.Group();
    particleGroupRef.current = particleGroup;
    scene.add(particleGroup);

    // Data Particles (Moving along LoRa hops)
    const particleGeo = new THREE.SphereGeometry(0.7, 8, 8);
    const particleMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    for (let p = 0; p < 8; p++) {
      const particle = new THREE.Mesh(particleGeo, particleMat);
      particle.position.set(-20 + p * 6, 12, 10 - p * 4);
      particleGroup.add(particle);
    }

    // 14. Orbit / Interaction Mouse Controls
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
      cameraRef.current.lookAt(-5, 8, 0);

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => { isDragging = false; };

    // Touch Support for Mobile
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
      cameraRef.current.lookAt(-5, 8, 0);

      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onTouchEnd = () => { isDragging = false; };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    domElement.addEventListener('touchstart', onTouchStart);
    domElement.addEventListener('touchmove', onTouchMove);
    domElement.addEventListener('touchend', onTouchEnd);

    // 15. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Animate Water subtle swell
      if (waterMeshRef.current) {
        waterMeshRef.current.position.y = 2.25 + Math.sin(elapsedTime * 1.5) * 0.25;
      }

      // Animate Helo Rotor Spin
      if (vehicleGroupRef.current && vehicleGroupRef.current.children[1]) {
        const heloMesh = vehicleGroupRef.current.children[1];
        if (heloMesh.children[0] && heloMesh.children[0].children[0]) {
          heloMesh.children[0].children[0].rotation.y = elapsedTime * 28;
        }
      }

      // Animate Stranded SOS Halo rotation
      if (peopleStuckGroupRef.current && peopleStuckGroupRef.current.children[14]) {
        peopleStuckGroupRef.current.children[14].rotation.z = elapsedTime * 1.5;
      }

      // Animate Data Packet Particle Flow
      if (particleGroupRef.current) {
        particleGroupRef.current.children.forEach((child, i) => {
          child.position.z = ((elapsedTime * 12 + i * 8) % 80) - 40;
          child.position.y = 12 + Math.sin(elapsedTime * 3 + i) * 1.2;
        });
      }

      // Animate Moving Vehicle based on selected AI mode
      if (vehicleGroupRef.current && vehicleGroupRef.current.children[0]) {
        const boatMesh = vehicleGroupRef.current.children[0];
        const heloMesh = vehicleGroupRef.current.children[1];

        if (isRescueSimulating) {
          const t = (Math.sin(elapsedTime * 0.45) + 1) / 2;
          const pos = routeCurve.getPoint(t);
          
          if (selectedPossibility === 'HELO_WINCH') {
            heloMesh.position.set(pos.x, 32 + Math.sin(elapsedTime * 2) * 1.5, pos.z);
            boatMesh.position.set(0, 3, -40); // Base
          } else {
            boatMesh.position.copy(pos);
            heloMesh.position.set(20, 35, -40); // Base
          }
        } else {
          boatMesh.position.z = -40 + Math.sin(elapsedTime * 0.8) * 15;
          heloMesh.position.y = 35 + Math.sin(elapsedTime * 1.5) * 2;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
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
  }, [isRescueSimulating, selectedPossibility]);

  // -------------------------------------------------------------
  // RESCUE EXTRACTION SIMULATION CONTROLLER
  // -------------------------------------------------------------
  const handleStartRescueSimulation = () => {
    setIsRescueSimulating(true);
    setRescueStep(1);
    setRescueCompleted(false);

    // Smooth Camera glide to Stranded People
    if (cameraRef.current) {
      cameraRef.current.position.set(-25, 24, 30);
      cameraRef.current.lookAt(-18, 12, 12);
    }

    // Step 1 -> Step 2: Approach & Winch (at 2.5s)
    setTimeout(() => {
      setRescueStep(2);
      if (rescueBeamRef.current) {
        (rescueBeamRef.current.material as THREE.MeshBasicMaterial).opacity = 0.85;
      }
    }, 2500);

    // Step 2 -> Step 3: Trauma Stabilization & Boarding (at 5.0s)
    setTimeout(() => {
      setRescueStep(3);
    }, 5000);

    // Step 3 -> Step 4: Evacuation to Hospital Safe Shelter (at 7.5s)
    setTimeout(() => {
      setRescueStep(4);
      setRescueCompleted(true);
      if (rescueBeamRef.current) {
        (rescueBeamRef.current.material as THREE.MeshBasicMaterial).opacity = 0;
      }
      if (cameraRef.current) {
        cameraRef.current.position.set(30, 35, -20);
        cameraRef.current.lookAt(50, 10, -45);
      }
    }, 7500);
  };

  // -------------------------------------------------------------
  // TIMELINE & SIMULATION CONTROLS
  // -------------------------------------------------------------
  const handleScrubTimeline = (idx: number) => {
    setTimelineIndex(idx);
    if (!waterMeshRef.current || !riskVolumeMeshRef.current) return;

    if (idx === 0) {
      waterMeshRef.current.scale.set(0.6, 0.4, 0.6);
      riskVolumeMeshRef.current.scale.set(0.5, 0.5, 0.5);
    } else if (idx === 1) {
      waterMeshRef.current.scale.set(0.8, 0.7, 0.8);
      riskVolumeMeshRef.current.scale.set(0.8, 0.8, 0.8);
    } else if (idx === 2) {
      waterMeshRef.current.scale.set(1.0, 1.0, 1.0);
      riskVolumeMeshRef.current.scale.set(1.0, 1.0, 1.0);
    } else if (idx === 3) {
      waterMeshRef.current.scale.set(1.1, 1.2, 1.1);
      riskVolumeMeshRef.current.scale.set(1.1, 1.1, 1.1);
    } else if (idx >= 4) {
      waterMeshRef.current.scale.set(1.25, 1.4, 1.25);
      riskVolumeMeshRef.current.scale.set(1.3, 1.3, 1.3);
    }
  };

  // Timeline Auto-Player
  useEffect(() => {
    let interval: any;
    if (isPlayingTimeline) {
      interval = setInterval(() => {
        setTimelineIndex(prev => {
          const next = (prev + 1) % timelineSteps.length;
          handleScrubTimeline(next);
          return next;
        });
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [isPlayingTimeline]);

  // -------------------------------------------------------------
  // CAMERA FOCUS CONTROLS
  // -------------------------------------------------------------
  const handleFocusStrandedPeople = () => {
    setFocusMode('STRANDED_PEOPLE');
    if (!cameraRef.current) return;
    cameraRef.current.position.set(-28, 22, 28);
    cameraRef.current.lookAt(-18, 12, 12);
  };

  const handleFocusRescueRoute = () => {
    setFocusMode('RESCUE_ROUTE');
    if (!cameraRef.current) return;
    cameraRef.current.position.set(0, 50, 40);
    cameraRef.current.lookAt(0, 5, -10);
  };

  const handleResetCamera = () => {
    setFocusMode('OVERVIEW');
    if (!cameraRef.current) return;
    cameraRef.current.position.set(-25, 55, 85);
    cameraRef.current.lookAt(-5, 8, 0);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col justify-between text-slate-100 select-none animate-in fade-in">
      
      {/* ======================================================== */}
      {/* 1. TOP TACTICAL HUD CONTROL BAR                          */}
      {/* ======================================================== */}
      <div className="p-3 sm:p-4 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 flex items-center justify-between z-30 gap-2">
        
        {/* Left: Title & Exit */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center gap-1.5 text-xs font-bold shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Exit 3D Twin</span>
          </button>

          <div>
            <h1 className="text-xs sm:text-sm font-black text-white flex items-center gap-2">
              <span>DHOST 3D OPERATIONAL TWIN™</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
                HUMAN PERSONNEL + AI TRAJECTORY
              </span>
            </h1>
            <p className="text-[10px] text-slate-400 font-mono hidden md:block">
              14 Human Stranded Victims • Uniformed Rescuer Squad • Zodiac Raft Approach
            </p>
          </div>
        </div>

        {/* Center: Layer Filters & Quick Focus */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 text-xs">
          
          <button
            onClick={() => setIsAiPossibilitiesOpen(!isAiPossibilitiesOpen)}
            className={`px-3 py-1.5 rounded-xl font-black transition text-xs whitespace-nowrap flex items-center gap-1.5 shadow-md ${
              isAiPossibilitiesOpen 
                ? 'bg-purple-600 text-white ring-2 ring-purple-400' 
                : 'bg-purple-950/80 border border-purple-500/50 text-purple-300 hover:bg-purple-900'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>🧠 AI Possibilities ({rescueOptions.length})</span>
          </button>

          <button
            onClick={handleFocusStrandedPeople}
            className={`px-3 py-1.5 rounded-xl font-black transition text-xs whitespace-nowrap flex items-center gap-1.5 shadow-md ${
              focusMode === 'STRANDED_PEOPLE' 
                ? 'bg-red-600 text-white ring-2 ring-red-400' 
                : 'bg-red-950/80 border border-red-500/50 text-red-300 hover:bg-red-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>👥 14 Human Victims</span>
          </button>

          <button
            onClick={handleResetCamera}
            className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs whitespace-nowrap"
          >
            🔭 Overview
          </button>

        </div>

        {/* Right: Live Rescue Extraction Trigger */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleStartRescueSimulation}
            disabled={isRescueSimulating}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg shadow-amber-950/50 active:scale-95 transition"
          >
            <LifeBuoy className="w-4 h-4 animate-spin" />
            <span>🚀 {isRescueSimulating ? 'Rescue in Progress...' : 'RUN AI RESCUE DEMO'}</span>
          </button>
        </div>

      </div>

      {/* ======================================================== */}
      {/* 2. MAIN 3D THREE.JS CANVAS CONTAINER                     */}
      {/* ======================================================== */}
      <div className="relative flex-1 bg-slate-950 overflow-hidden w-full h-full">
        
        {/* Three.js DOM Injection Mount */}
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* AI RESCUE POSSIBILITIES FLOATING TACTICAL PANEL */}
        {isAiPossibilitiesOpen && (
          <div className="absolute top-4 left-4 z-20 p-4 rounded-3xl bg-slate-900/95 border-2 border-purple-500/80 backdrop-blur-md space-y-3 text-xs font-mono max-w-sm shadow-2xl animate-in slide-in-from-left-4 max-h-[80vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-black text-white flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-400" />
                <span>AI RESCUE POSSIBILITIES</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-bold">
                FEASIBILITY ENGINE
              </span>
            </div>

            {/* Possibility Choice Buttons */}
            <div className="space-y-1.5">
              {rescueOptions.map(opt => (
                <div
                  key={opt.id}
                  onClick={() => setSelectedPossibility(opt.id)}
                  className={`p-2.5 rounded-2xl border cursor-pointer transition space-y-1 ${
                    selectedPossibility === opt.id
                      ? 'bg-purple-950/70 border-purple-400 ring-2 ring-purple-500/40 text-white'
                      : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">{opt.vehicleName}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-black ${
                      opt.feasibilityScore >= 90 ? 'bg-emerald-500/20 text-emerald-400' :
                      opt.feasibilityScore >= 70 ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {opt.feasibilityScore}% Match
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>ETA: <strong className="text-white">~{opt.etaMins} mins</strong></span>
                    <span>Risk: <strong className={opt.riskLevel === 'LOW' ? 'text-emerald-400' : opt.riskLevel === 'MEDIUM' ? 'text-amber-400' : 'text-red-400'}>{opt.riskLevel}</strong></span>
                  </div>
                </div>
              ))}
            </div>

            {/* Active Selected Strategy Breakdown */}
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-[11px]">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                AI TACTICAL ANALYSIS:
              </span>
              <p className="text-white font-bold">{currentOption.routeDescription}</p>
              
              <div className="space-y-1 text-[10px]">
                {currentOption.pros.map((pro, i) => (
                  <p key={i} className="text-emerald-400 flex items-center gap-1 font-sans">
                    ✓ {pro}
                  </p>
                ))}
                {currentOption.cons.map((con, i) => (
                  <p key={i} className="text-amber-400 flex items-center gap-1 font-sans">
                    ⚠️ {con}
                  </p>
                ))}
              </div>
            </div>

            <button
              onClick={handleStartRescueSimulation}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg active:scale-95 transition flex items-center justify-center gap-1.5"
            >
              <LifeBuoy className="w-4 h-4" />
              <span>EXECUTE {currentOption.vehicleName.toUpperCase()} DEMO</span>
            </button>

          </div>
        )}

        {/* Live Rescue Step HUD Overlay during Simulation */}
        {isRescueSimulating && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 px-5 py-3 rounded-2xl bg-slate-900/95 border-2 border-emerald-500 shadow-2xl font-mono text-xs text-white max-w-lg w-full space-y-2 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <span className="font-black text-emerald-400 flex items-center gap-1.5">
                <LifeBuoy className="w-4 h-4 animate-spin" />
                <span>3D TACTICAL RESCUE EXTRACTION SEQUENCE ({currentOption.vehicleName})</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                STEP {rescueStep} OF 4
              </span>
            </div>

            <div className="space-y-1">
              {rescueStep === 1 && (
                <p className="text-white font-bold text-xs">
                  {selectedPossibility === 'HELO_WINCH' ? '🚁 1. Coast Guard Helo Air-1 flying aerial ingress at altitude 35m (ETA 4 mins)...' : '🚤 1. Team Bravo Zodiac Boat with 2 Uniformed Rescuers navigating river channel...'}
                </p>
              )}
              {rescueStep === 2 && (
                <p className="text-amber-300 font-bold text-xs">
                  ⚓ 2. Rescuer crew locked position at stranded rooftop. Deploying high-line winch lines and inflatable safety rafts...
                </p>
              )}
              {rescueStep === 3 && (
                <p className="text-blue-300 font-bold text-xs">
                  🩺 3. 14 Stranded human victims extricated into rescue unit. Rescuers stabilizing 2 trauma fracture casualties...
                </p>
              )}
              {rescueStep === 4 && (
                <p className="text-emerald-400 font-black text-xs">
                  🏥 4. SAFE EVACUATION COMPLETE! All 14 individuals transported safely to Govt Hospital Shelter (Safe Zone).
                </p>
              )}
            </div>

            {/* Step Progress Bar */}
            <div className="w-full h-1.5 rounded-full bg-slate-950 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 via-blue-500 to-emerald-400 transition-all duration-700 ease-out"
                style={{ width: `${(rescueStep / 4) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Floating Stranded People Manifest Card */}
        <div className="absolute top-4 right-4 z-20 p-3.5 rounded-2xl bg-slate-900/90 border border-red-500/60 backdrop-blur-md space-y-2 text-xs font-mono max-w-xs shadow-2xl hidden md:block">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span className="font-black text-red-400 flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              <span>14 HUMAN VICTIMS</span>
            </span>
            <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 text-[10px] font-bold">
              CRITICAL
            </span>
          </div>

          <div className="space-y-1 text-[11px] text-slate-300">
            <p>📍 <strong>Location:</strong> Rooftop of Bridge Pillar Bld</p>
            <p>🌊 <strong>Surge Depth:</strong> 4.2ft Rapid Flow</p>
            <p>🩺 <strong>Injuries:</strong> 2 Casualties (1 Leg Fracture)</p>
            <p>🔋 <strong>Phone Battery:</strong> 8% (Survival Mode)</p>
          </div>

          <button
            onClick={handleFocusStrandedPeople}
            className="w-full py-1.5 rounded-xl bg-red-600/30 hover:bg-red-600/40 border border-red-500/50 text-red-200 font-bold text-[10px] transition"
          >
            Zoom Camera to Human Victims ➔
          </button>
        </div>

        {/* 3D Gesture Guide Hint */}
        <div className="absolute bottom-28 left-4 z-20 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[10px] font-mono text-slate-400 pointer-events-none hidden md:block">
          🖱️ Drag: Rotate 3D View • Pinch/Scroll: Zoom • Tap: Focus Object
        </div>

      </div>

      {/* ======================================================== */}
      {/* 3. 3D TIME MACHINE & DISASTER SIMULATOR SLIDER           */}
      {/* ======================================================== */}
      <div className="p-3 bg-slate-900/90 backdrop-blur-md border-t border-slate-800 z-30 font-mono text-xs space-y-2">
        
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlayingTimeline(!isPlayingTimeline)}
              className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black transition"
            >
              {isPlayingTimeline ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-slate-950" />}
            </button>

            <span className="text-[11px] font-bold text-amber-400">
              3D TIME MACHINE:
            </span>
          </div>

          {/* Timeline Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {timelineSteps.map((step, idx) => (
              <button
                key={idx}
                onClick={() => handleScrubTimeline(idx)}
                className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition whitespace-nowrap ${
                  timelineIndex === idx
                    ? 'bg-amber-500 text-slate-950 font-black'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {step.label}
              </button>
            ))}
          </div>

          <span className="text-[10px] text-slate-400 hidden sm:inline">
            {timelineSteps[timelineIndex].desc}
          </span>

        </div>

      </div>

      {/* ======================================================== */}
      {/* 4. MOBILE SLIDE-UP BOTTOM SHEET: INCIDENT INTELLIGENCE   */}
      {/* ======================================================== */}
      {selectedIncident && (
        <div className="p-4 bg-slate-900 border-t-2 border-amber-500/70 z-30 shadow-2xl space-y-3 animate-in slide-in-from-bottom-5">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3 font-sans">
            
            {/* Left: Incident Details */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                  {selectedIncident.incidentId}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-red-500/20 text-red-400 border border-red-500/50">
                  {selectedIncident.priority}
                </span>
                <h3 className="text-sm font-black text-white">
                  {selectedIncident.incidentCategoryLabel} ({rescueCompleted ? '14 Rescued Safe' : '14 Human Victims Trapped on Rooftop'})
                </h3>
              </div>
              <p className="text-xs text-slate-300 font-medium italic">
                "{selectedIncident.translatedText || selectedIncident.requestText}"
              </p>
              <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono">
                <span>📍 3D Landmark: Rooftop Pillar (Old Bridge Sector)</span>
                <span>AI Recommended: <strong className="text-emerald-400">{currentOption.vehicleName} ({currentOption.feasibilityScore}%)</strong></span>
                <span>Mesh Route: <strong className="text-blue-400">3 Hops (LoRa 868MHz)</strong></span>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleStartRescueSimulation}
                className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg active:scale-95 transition flex items-center gap-1.5"
              >
                <LifeBuoy className="w-4 h-4" />
                <span>{rescueCompleted ? 'RE-RUN AI EXTRACTION DEMO' : 'EXECUTE AI RESCUE DEMO'}</span>
              </button>

              <button
                onClick={handleFocusStrandedPeople}
                className="px-4 py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-xs flex items-center gap-1.5 transition"
              >
                <Users className="w-4 h-4" />
                <span>Focus Human Victims</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
