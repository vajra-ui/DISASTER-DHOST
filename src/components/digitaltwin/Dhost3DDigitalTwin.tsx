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
  Building2
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
  actionStatus: string;
}

/**
 * Generates Procedural Realistic Building Facade Textures
 */
function createFacadeTexture(type: 'OFFICE' | 'APARTMENT' | 'HOSPITAL'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Facade Concrete/Steel Background
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

      // Window Frame Mullion
      ctx.fillStyle = '#334155';
      ctx.fillRect(x - 2, y - 2, w + 4, h + 4);

      // Window Glass with Illumination
      const isLit = (r + c * 3) % 3 !== 0;
      if (isLit) {
        ctx.fillStyle = type === 'HOSPITAL' ? '#38bdf8' : (r % 2 === 0 ? '#fef08a' : '#93c5fd');
      } else {
        ctx.fillStyle = '#020617';
      }
      ctx.fillRect(x, y, w, h);

      // Glass Reflection Streak
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
 * Generates Procedural Hospital Helipad Texture
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

  // UI States
  const [selectedIncident, setSelectedIncident] = useState<EmergencyPacket | null>(incidents[0] || null);
  
  // AI Rescue Possibilities Engine State
  const [selectedPossibility, setSelectedPossibility] = useState<'ZODIAC_BOAT' | 'HELO_WINCH' | 'TACTICAL_TRUCK'>('ZODIAC_BOAT');
  const [isAiPossibilitiesOpen, setIsAiPossibilitiesOpen] = useState(true);

  // Action Status
  const [actionNarrative, setActionNarrative] = useState('Demonstrating Zodiac Boat Deep Channel Extraction (94% Feasibility)...');

  // Focus View Mode
  const [focusMode, setFocusMode] = useState<'OVERVIEW' | 'STRANDED_PEOPLE' | 'HOSPITAL'>('OVERVIEW');

  // References for Three.js Scene Updates
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const waterMeshRef = useRef<THREE.Mesh | null>(null);
  const vehicleGroupRef = useRef<THREE.Group | null>(null);
  const peopleStuckGroupRef = useRef<THREE.Group | null>(null);
  const rescueBeamRef = useRef<THREE.Mesh | null>(null);
  const boatSplineRef = useRef<THREE.Line | null>(null);
  const heloSplineRef = useRef<THREE.Line | null>(null);
  const truckSplineRef = useRef<THREE.Line | null>(null);

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
      cons: ['Slightly slower than helicopter'],
      actionStatus: '🚤 Cruising River Channel ➔ Winch Extrication ➔ Hospital Shelter Safe'
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
      actionStatus: '🚁 Aerial Flight ➔ Rooftop Hover ➔ Winch Basket Hoist ➔ Helipad'
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
  ];

  const currentOption = rescueOptions.find(o => o.id === selectedPossibility) || rescueOptions[0];

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
    scene.background = new THREE.Color(0x020617);
    scene.fog = new THREE.FogExp2(0x020617, 0.006);
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
    amberLight.position.set(-18, 25, 10);
    scene.add(amberLight);

    const victimRedLight = new THREE.PointLight(0xef4444, 6, 50);
    victimRedLight.position.set(-18, 16, 12);
    scene.add(victimRedLight);

    // 5. Tactical Ground Plane Grid
    const groundGeo = new THREE.PlaneGeometry(280, 280);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x070b14, roughness: 0.9, metalness: 0.1 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const gridHelper = new THREE.GridHelper(280, 56, 0x1e293b, 0x0f172a);
    gridHelper.position.y = 0.05;
    scene.add(gridHelper);

    // 6. River & 3D Bridge with Pylons
    const riverGeo = new THREE.PlaneGeometry(45, 280);
    const riverMat = new THREE.MeshStandardMaterial({ color: 0x0369a1, roughness: 0.1, metalness: 0.85, transparent: true, opacity: 0.88 });
    const river = new THREE.Mesh(riverGeo, riverMat);
    river.rotation.x = -Math.PI / 2;
    river.position.set(0, 0.1, 0);
    scene.add(river);

    // 3D Bridge Arch with Guard Rails
    const bridgeGeo = new THREE.BoxGeometry(18, 2.5, 75);
    const bridgeMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5 });
    const bridge = new THREE.Mesh(bridgeGeo, bridgeMat);
    bridge.position.set(0, 2.5, 0);
    bridge.castShadow = true;
    scene.add(bridge);

    // Bridge Guardrails
    const railMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
    const railL = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.8, 75), railMat);
    const railR = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.8, 75), railMat);
    railL.position.set(-8.8, 4.0, 0);
    railR.position.set(8.8, 4.0, 0);
    scene.add(railL);
    scene.add(railR);

    // -------------------------------------------------------------
    // 7. HIGH-REALISM PROCEDURAL 3D BUILDINGS WITH TEXTURES & DETAILS
    // -------------------------------------------------------------
    const buildingsGroup = new THREE.Group();
    scene.add(buildingsGroup);

    const officeTexture = createFacadeTexture('OFFICE');
    const aptTexture = createFacadeTexture('APARTMENT');
    const hospTexture = createFacadeTexture('HOSPITAL');
    const helipadTexture = createHelipadTexture();

    const officeMat = new THREE.MeshStandardMaterial({ map: officeTexture, roughness: 0.4, metalness: 0.3 });
    const aptMat = new THREE.MeshStandardMaterial({ map: aptTexture, roughness: 0.6, metalness: 0.2 });
    const concreteMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
    const hvacMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.3, metalness: 0.6 });

    // Procedural City Skyline
    for (let x = -90; x <= 90; x += 26) {
      for (let z = -90; z <= 90; z += 26) {
        if (Math.abs(x) < 24) continue; // River corridor
        if (x >= 35 && z <= -30) continue; // Hospital reserve
        if (x <= -10 && x >= -28 && z >= 0 && z <= 24) continue; // Stranded Bldg reserve

        const bHeight = Math.floor(Math.random() * 16) + 8;
        const bWidth = Math.floor(Math.random() * 4) + 14;
        const bDepth = Math.floor(Math.random() * 4) + 14;
        const bMat = (x + z) % 2 === 0 ? officeMat : aptMat;

        // Main Tower Structure
        const bGeo = new THREE.BoxGeometry(bWidth, bHeight, bDepth);
        const bMesh = new THREE.Mesh(bGeo, bMat);
        bMesh.position.set(x, bHeight / 2, z);
        bMesh.castShadow = true;
        bMesh.receiveShadow = true;
        buildingsGroup.add(bMesh);

        // Rooftop Parapet Perimeter Safety Wall
        const parapetMat = new THREE.MeshStandardMaterial({ color: 0x334155 });
        const parapet = new THREE.Mesh(new THREE.BoxGeometry(bWidth + 0.3, 0.8, bDepth + 0.3), parapetMat);
        parapet.position.set(x, bHeight + 0.4, z);
        buildingsGroup.add(parapet);

        // Rooftop HVAC Equipment Box
        const hvac = new THREE.Mesh(new THREE.BoxGeometry(3.5, 1.8, 3.5), hvacMat);
        hvac.position.set(x + (Math.random() * 3 - 1.5), bHeight + 1.2, z + (Math.random() * 3 - 1.5));
        buildingsGroup.add(hvac);

        // Rooftop Elevator Penthouse Bulkhead
        const bulkhead = new THREE.Mesh(new THREE.BoxGeometry(4.5, 2.5, 4.5), concreteMat);
        bulkhead.position.set(x - 2, bHeight + 1.5, z - 2);
        buildingsGroup.add(bulkhead);

        // Tall Antenna Mast with Blinking Red Light on High-Rises
        if (bHeight > 18) {
          const mastGeo = new THREE.CylinderGeometry(0.15, 0.25, 8, 8);
          const mastMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.8 });
          const mast = new THREE.Mesh(mastGeo, mastMat);
          mast.position.set(x, bHeight + 5.5, z);
          buildingsGroup.add(mast);

          const redBeacon = new THREE.Mesh(new THREE.SphereGeometry(0.35, 8, 8), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
          redBeacon.position.set(x, bHeight + 9.5, z);
          buildingsGroup.add(redBeacon);
        }
      }
    }

    // -------------------------------------------------------------
    // 8. REALISTIC DETAILED FLOODED COMMERCIAL COMPLEX (STRANDED VICTIMS)
    // -------------------------------------------------------------
    const strandedBldgGroup = new THREE.Group();
    strandedBldgGroup.position.set(-18, 0, 12);

    // 4-Story Commercial Facade Tower
    const strandedGeo = new THREE.BoxGeometry(20, 12, 20);
    const strandedMat = new THREE.MeshStandardMaterial({ map: officeTexture, roughness: 0.4, metalness: 0.3 });
    const strandedMesh = new THREE.Mesh(strandedGeo, strandedMat);
    strandedMesh.position.y = 6;
    strandedMesh.castShadow = true;
    strandedMesh.receiveShadow = true;
    strandedBldgGroup.add(strandedMesh);

    // Rooftop Safety Parapet Wall (Hollow Roof Area for Victims)
    const roofParapetMat = new THREE.MeshStandardMaterial({ color: 0x475569 });
    const roofParapet = new THREE.Mesh(new THREE.BoxGeometry(20.4, 0.9, 20.4), roofParapetMat);
    roofParapet.position.y = 12.45;
    strandedBldgGroup.add(roofParapet);

    // Rooftop HVAC Chillers & Industrial Fan Vent
    const chiller1 = new THREE.Mesh(new THREE.BoxGeometry(4.2, 2.0, 3.2), hvacMat);
    chiller1.position.set(-5, 13.0, -5);
    strandedBldgGroup.add(chiller1);

    const chiller2 = new THREE.Mesh(new THREE.BoxGeometry(3.5, 1.8, 3.0), hvacMat);
    chiller2.position.set(5, 12.9, -5);
    strandedBldgGroup.add(chiller2);

    // Rooftop Access Door Penthouse
    const roofDoorPenthouse = new THREE.Mesh(new THREE.BoxGeometry(4.5, 2.8, 4.5), concreteMat);
    roofDoorPenthouse.position.set(-5, 13.4, 4);
    strandedBldgGroup.add(roofDoorPenthouse);

    // Water Storage Tank on Roof Stilts
    const tankGeo = new THREE.CylinderGeometry(1.8, 1.8, 2.5, 16);
    const tankMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.4 });
    const tank = new THREE.Mesh(tankGeo, tankMat);
    tank.position.set(5.5, 14.0, 4);
    strandedBldgGroup.add(tank);

    buildingsGroup.add(strandedBldgGroup);

    // -------------------------------------------------------------
    // 9. REALISTIC GOVT HOSPITAL & RELIEF SHELTER (SAFE ZONE)
    // -------------------------------------------------------------
    const hospGroup = new THREE.Group();
    hospGroup.position.set(50, 0, -45);

    // Main Hospital Glass Facade Block
    const hospGeo = new THREE.BoxGeometry(30, 18, 30);
    const hospMesh = new THREE.Mesh(hospGeo, new THREE.MeshStandardMaterial({ map: hospTexture, roughness: 0.3, metalness: 0.4 }));
    hospMesh.position.y = 9;
    hospMesh.castShadow = true;
    hospGroup.add(hospMesh);

    // Hospital Helipad on Roof (with Authentic 'H' and lights)
    const helipadGeo = new THREE.BoxGeometry(16, 0.4, 16);
    const helipadMat = new THREE.MeshStandardMaterial({ map: helipadTexture, roughness: 0.7 });
    const helipad = new THREE.Mesh(helipadGeo, helipadMat);
    helipad.position.set(0, 18.2, 0);
    hospGroup.add(helipad);

    // Glowing Green Medical Cross on Roof
    const crossGeoH = new THREE.BoxGeometry(12, 0.6, 3.5);
    const crossGeoV = new THREE.BoxGeometry(3.5, 0.6, 12);
    const crossMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const crossH = new THREE.Mesh(crossGeoH, crossMat);
    const crossV = new THREE.Mesh(crossGeoV, crossMat);
    crossH.position.set(-6, 18.6, -6);
    crossV.position.set(-6, 18.6, -6);
    hospGroup.add(crossH);
    hospGroup.add(crossV);

    // Hospital Ground-Level Ambulance & Triage Bay Canopy
    const canopy = new THREE.Mesh(new THREE.BoxGeometry(14, 1.0, 8), new THREE.MeshStandardMaterial({ color: 0x38bdf8 }));
    canopy.position.set(0, 4.5, 17);
    hospGroup.add(canopy);

    buildingsGroup.add(hospGroup);

    // 10. 3D Water Flood Inundation Volume
    const waterGeo = new THREE.BoxGeometry(190, 4.5, 190);
    const waterVolumeMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, transparent: true, opacity: 0.55, roughness: 0.1, metalness: 0.9 });
    const waterVolume = new THREE.Mesh(waterGeo, waterVolumeMat);
    waterVolume.position.set(-10, 2.25, 10);
    scene.add(waterVolume);
    waterMeshRef.current = waterVolume;

    // -------------------------------------------------------------
    // 11. 3D VISIBLE HUMAN STRANDED PEOPLE ON ROOFTOP
    // -------------------------------------------------------------
    const peopleStuckGroup = new THREE.Group();
    peopleStuckGroupRef.current = peopleStuckGroup;
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

    // Floating SOS Beacon Ring
    const sosRingGeo = new THREE.RingGeometry(3.8, 4.6, 32);
    const sosRingMat = new THREE.MeshBasicMaterial({ color: 0xef4444, side: THREE.DoubleSide, transparent: true, opacity: 0.85 });
    const sosRing = new THREE.Mesh(sosRingGeo, sosRingMat);
    sosRing.rotation.x = -Math.PI / 2;
    sosRing.position.set(-18, 15.5, 12);
    peopleStuckGroup.add(sosRing);

    // Vertical Beam
    const beamGeo = new THREE.CylinderGeometry(0.35, 0.35, 45, 16);
    const beamMat = new THREE.MeshBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0.85 });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.position.set(-18, 34, 12);
    peopleStuckGroup.add(beam);

    // -------------------------------------------------------------
    // 12. MULTI-MODAL 3D RESCUE TRAJECTORY SPLINES
    // -------------------------------------------------------------
    const boatCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 3, -40),
      new THREE.Vector3(0, 3, -15),
      new THREE.Vector3(-10, 3.5, 0),
      new THREE.Vector3(-18, 4, 8),
      new THREE.Vector3(-18, 12, 12),
      new THREE.Vector3(15, 6, -10),
      new THREE.Vector3(50, 10, -45)
    ]);
    const boatPoints = boatCurve.getPoints(80);
    const boatSplineGeo = new THREE.BufferGeometry().setFromPoints(boatPoints);
    const boatSplineMat = new THREE.LineDashedMaterial({ color: 0x10b981, dashSize: 3, gapSize: 1.5, linewidth: 4 });
    const boatSpline = new THREE.Line(boatSplineGeo, boatSplineMat);
    boatSpline.computeLineDistances();
    scene.add(boatSpline);
    boatSplineRef.current = boatSpline;

    const heloCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(20, 35, -40),
      new THREE.Vector3(5, 38, -15),
      new THREE.Vector3(-18, 30, 12),
      new THREE.Vector3(-18, 24, 12),
      new THREE.Vector3(20, 35, -20),
      new THREE.Vector3(50, 22, -45)
    ]);
    const heloPoints = heloCurve.getPoints(80);
    const heloSplineGeo = new THREE.BufferGeometry().setFromPoints(heloPoints);
    const heloSplineMat = new THREE.LineDashedMaterial({ color: 0xf59e0b, dashSize: 3, gapSize: 1.5, linewidth: 4 });
    const heloSpline = new THREE.Line(heloSplineGeo, heloSplineMat);
    heloSpline.computeLineDistances();
    scene.add(heloSpline);
    heloSplineRef.current = heloSpline;

    const truckCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(28, 1.5, 20),
      new THREE.Vector3(14, 1.8, 10),
      new THREE.Vector3(0, 2.5, 0),
      new THREE.Vector3(-8, 3.2, 4)
    ]);
    const truckPoints = truckCurve.getPoints(40);
    const truckSplineGeo = new THREE.BufferGeometry().setFromPoints(truckPoints);
    const truckSplineMat = new THREE.LineDashedMaterial({ color: 0xef4444, dashSize: 2, gapSize: 2, linewidth: 3 });
    const truckSpline = new THREE.Line(truckSplineGeo, truckSplineMat);
    truckSpline.computeLineDistances();
    scene.add(truckSpline);
    truckSplineRef.current = truckSpline;

    // Winch Beam
    const winchGeo = new THREE.CylinderGeometry(0.25, 0.25, 12, 16);
    const winchMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.85 });
    const winchBeam = new THREE.Mesh(winchGeo, winchMat);
    winchBeam.position.set(-18, 18, 12);
    scene.add(winchBeam);
    rescueBeamRef.current = winchBeam;

    // -------------------------------------------------------------
    // 13. 3D RESCUE VEHICLES WITH VISIBLE RESCUER SQUADS
    // -------------------------------------------------------------
    const vehicleGroup = new THREE.Group();
    vehicleGroupRef.current = vehicleGroup;
    scene.add(vehicleGroup);

    // Zodiac Boat
    const boatContainer = new THREE.Group();
    const boatGeo = new THREE.BoxGeometry(4.8, 1.8, 8.5);
    const boatMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.3 });
    const boatHull = new THREE.Mesh(boatGeo, boatMat);
    boatContainer.add(boatHull);

    const rescuer1 = createHumanFigure({ isRescuer: true, isInjured: false, isWaving: false, shirtColor: 0xf97316, scale: 1.1 });
    rescuer1.position.set(0.8, 0.9, 1.5);
    boatContainer.add(rescuer1);

    const rescuer2 = createHumanFigure({ isRescuer: true, isInjured: false, isWaving: false, shirtColor: 0xf97316, scale: 1.1 });
    rescuer2.position.set(-0.8, 0.9, -1.8);
    boatContainer.add(rescuer2);

    boatContainer.position.set(0, 3, -40);
    vehicleGroup.add(boatContainer);

    // Helicopter
    const heloContainer = new THREE.Group();
    const heloGeo = new THREE.BoxGeometry(4.5, 3.2, 9.5);
    const heloMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.2 });
    const helo = new THREE.Mesh(heloGeo, heloMat);
    heloContainer.add(helo);

    const rotorGeo = new THREE.BoxGeometry(16, 0.2, 1.4);
    const rotorMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const rotor = new THREE.Mesh(rotorGeo, rotorMat);
    rotor.position.set(0, 2.2, 0);
    helo.add(rotor);

    const heloPilot = createHumanFigure({ isRescuer: true, isInjured: false, isWaving: false, shirtColor: 0xf97316, scale: 0.95 });
    heloPilot.position.set(0, 0.3, 2.0);
    heloContainer.add(heloPilot);

    heloContainer.position.set(20, 35, -40);
    vehicleGroup.add(heloContainer);

    // 4x4 Truck
    const truckContainer = new THREE.Group();
    const truckGeo = new THREE.BoxGeometry(4.5, 3.5, 7.5);
    const truckMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.4 });
    const truckCab = new THREE.Mesh(truckGeo, truckMat);
    truckContainer.add(truckCab);

    const truckDriver = createHumanFigure({ isRescuer: true, isInjured: false, isWaving: false, shirtColor: 0xf97316, scale: 1.0 });
    truckDriver.position.set(0, 1.2, 1.0);
    truckContainer.add(truckDriver);

    truckContainer.position.set(28, 1.5, 20);
    vehicleGroup.add(truckContainer);

    // 14. Orbit Controls
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

      // Water Swell
      if (waterMeshRef.current) {
        waterMeshRef.current.position.y = 2.25 + Math.sin(elapsedTime * 1.5) * 0.25;
      }

      // Helo Rotor Spin
      if (vehicleGroupRef.current && vehicleGroupRef.current.children[1]) {
        const heloMesh = vehicleGroupRef.current.children[1];
        if (heloMesh.children[0] && heloMesh.children[0].children[0]) {
          heloMesh.children[0].children[0].rotation.y = elapsedTime * 30;
        }
      }

      // Stranded SOS Halo rotation
      if (peopleStuckGroupRef.current && peopleStuckGroupRef.current.children[14]) {
        peopleStuckGroupRef.current.children[14].rotation.z = elapsedTime * 1.5;
      }

      // Action Motion based on currently selected AI Possibility
      if (vehicleGroupRef.current) {
        const boatMesh = vehicleGroupRef.current.children[0];
        const heloMesh = vehicleGroupRef.current.children[1];
        const truckMesh = vehicleGroupRef.current.children[2];

        if (selectedPossibility === 'ZODIAC_BOAT') {
          const t = (Math.sin(elapsedTime * 0.45) + 1) / 2;
          const pos = boatCurve.getPoint(t);
          boatMesh.position.copy(pos);
          heloMesh.position.set(20, 35, -40);
          truckMesh.position.set(28, 1.5, 20);

        } else if (selectedPossibility === 'HELO_WINCH') {
          const t = (Math.sin(elapsedTime * 0.6) + 1) / 2;
          const pos = heloCurve.getPoint(t);
          heloMesh.position.copy(pos);
          boatMesh.position.set(0, 3, -40);
          truckMesh.position.set(28, 1.5, 20);

        } else if (selectedPossibility === 'TACTICAL_TRUCK') {
          const t = Math.min(0.85, (Math.sin(elapsedTime * 0.4) + 1) / 2);
          const pos = truckCurve.getPoint(t);
          truckMesh.position.copy(pos);
          if (t >= 0.7) {
            truckMesh.position.x += Math.sin(elapsedTime * 40) * 0.15;
          }
          boatMesh.position.set(0, 3, -40);
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
  }, [selectedPossibility]);

  // Possibility Switcher
  const handleSelectPossibility = (optId: 'ZODIAC_BOAT' | 'HELO_WINCH' | 'TACTICAL_TRUCK') => {
    setSelectedPossibility(optId);

    if (boatSplineRef.current && heloSplineRef.current && truckSplineRef.current) {
      boatSplineRef.current.visible = (optId === 'ZODIAC_BOAT');
      heloSplineRef.current.visible = (optId === 'HELO_WINCH');
      truckSplineRef.current.visible = (optId === 'TACTICAL_TRUCK');
    }

    if (optId === 'ZODIAC_BOAT') {
      setActionNarrative('Demonstrating Option A: Zodiac Boat Deep Channel Approach (94% Match)');
      if (cameraRef.current) {
        cameraRef.current.position.set(-25, 26, 32);
        cameraRef.current.lookAt(-18, 12, 12);
      }
      if (rescueBeamRef.current) {
        (rescueBeamRef.current.material as THREE.MeshBasicMaterial).opacity = 0.85;
      }
    } else if (optId === 'HELO_WINCH') {
      setActionNarrative('Demonstrating Option B: Coast Guard Helo Air-1 High-Line Winch (78% Match)');
      if (cameraRef.current) {
        cameraRef.current.position.set(-5, 45, 35);
        cameraRef.current.lookAt(-18, 20, 12);
      }
      if (rescueBeamRef.current) {
        (rescueBeamRef.current.material as THREE.MeshBasicMaterial).opacity = 0.95;
      }
    } else if (optId === 'TACTICAL_TRUCK') {
      setActionNarrative('⚠️ Option C Action: 4x4 Truck attempts road crossing ➔ Stalls in 4.2ft water on bridge! AI warns high risk.');
      if (cameraRef.current) {
        cameraRef.current.position.set(15, 18, 25);
        cameraRef.current.lookAt(0, 2.5, 0);
      }
      if (rescueBeamRef.current) {
        (rescueBeamRef.current.material as THREE.MeshBasicMaterial).opacity = 0;
      }
    }
  };

  const handleFocusStrandedPeople = () => {
    setFocusMode('STRANDED_PEOPLE');
    if (!cameraRef.current) return;
    cameraRef.current.position.set(-28, 22, 28);
    cameraRef.current.lookAt(-18, 12, 12);
  };

  const handleFocusHospital = () => {
    setFocusMode('HOSPITAL');
    if (!cameraRef.current) return;
    cameraRef.current.position.set(35, 30, -25);
    cameraRef.current.lookAt(50, 12, -45);
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
                REALISTIC CITY + AI ACTION
              </span>
            </h1>
            <p className="text-[10px] text-slate-400 font-mono hidden md:block">
              Realistic Facades • Rooftop Parapets & HVAC • Illuminated Helipad • 14 Human Victims
            </p>
          </div>
        </div>

        {/* Center: 3 AI Possibility Action Switchers */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
          
          <button
            onClick={() => handleSelectPossibility('ZODIAC_BOAT')}
            className={`px-3 py-1.5 rounded-xl font-black transition text-xs whitespace-nowrap flex items-center gap-1.5 shadow-md ${
              selectedPossibility === 'ZODIAC_BOAT' 
                ? 'bg-blue-600 text-white ring-2 ring-blue-400 scale-105' 
                : 'bg-blue-950/80 border border-blue-500/50 text-blue-300 hover:bg-blue-900'
            }`}
          >
            <Anchor className="w-3.5 h-3.5" />
            <span>🚤 Option A: Boat (94%)</span>
          </button>

          <button
            onClick={() => handleSelectPossibility('HELO_WINCH')}
            className={`px-3 py-1.5 rounded-xl font-black transition text-xs whitespace-nowrap flex items-center gap-1.5 shadow-md ${
              selectedPossibility === 'HELO_WINCH' 
                ? 'bg-amber-600 text-white ring-2 ring-amber-400 scale-105' 
                : 'bg-amber-950/80 border border-amber-500/50 text-amber-300 hover:bg-amber-900'
            }`}
          >
            <Plane className="w-3.5 h-3.5" />
            <span>🚁 Option B: Helo (78%)</span>
          </button>

          <button
            onClick={() => handleSelectPossibility('TACTICAL_TRUCK')}
            className={`px-3 py-1.5 rounded-xl font-black transition text-xs whitespace-nowrap flex items-center gap-1.5 shadow-md ${
              selectedPossibility === 'TACTICAL_TRUCK' 
                ? 'bg-red-600 text-white ring-2 ring-red-400 scale-105' 
                : 'bg-red-950/80 border border-red-500/50 text-red-300 hover:bg-red-900'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>🚒 Option C: 4x4 Truck (42%)</span>
          </button>

          <button
            onClick={handleFocusHospital}
            className="px-2.5 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 font-bold text-xs whitespace-nowrap"
          >
            🏥 Hospital Safe Zone
          </button>

          <button
            onClick={handleResetCamera}
            className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs whitespace-nowrap"
          >
            🔭 Overview
          </button>

        </div>

        {/* Right: Realistic Render Badge */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold border border-emerald-500/40 hidden sm:inline">
            ● 60 FPS REALISTIC 3D
          </span>
        </div>

      </div>

      {/* ======================================================== */}
      {/* 2. MAIN 3D THREE.JS CANVAS CONTAINER                     */}
      {/* ======================================================== */}
      <div className="relative flex-1 bg-slate-950 overflow-hidden w-full h-full">
        
        {/* Three.js DOM Injection Mount */}
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Floating Top Action Banner */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 px-5 py-2.5 rounded-2xl bg-slate-900/95 border-2 border-amber-500 shadow-2xl font-mono text-xs text-white max-w-xl w-full text-center animate-in zoom-in-95">
          <div className="flex items-center justify-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            <span className="font-black text-amber-300">{currentOption.actionStatus}</span>
          </div>
        </div>

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
                  onClick={() => handleSelectPossibility(opt.id)}
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
      {/* 3. MOBILE SLIDE-UP BOTTOM SHEET: INCIDENT INTELLIGENCE   */}
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
                  {selectedIncident.incidentCategoryLabel} (14 Human Victims Trapped on Rooftop)
                </h3>
              </div>
              <p className="text-xs text-slate-300 font-medium italic">
                "{selectedIncident.translatedText || selectedIncident.requestText}"
              </p>
              <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono">
                <span>📍 3D Landmark: Commercial Complex Rooftop</span>
                <span>Active 3D Action: <strong className="text-emerald-400">{currentOption.vehicleName} ({currentOption.feasibilityScore}%)</strong></span>
                <span>Mesh Route: <strong className="text-blue-400">3 Hops (LoRa 868MHz)</strong></span>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleSelectPossibility('ZODIAC_BOAT')}
                className="px-4 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-lg active:scale-95 transition flex items-center gap-1.5"
              >
                <Anchor className="w-4 h-4" />
                <span>Run Boat Demo (94%)</span>
              </button>

              <button
                onClick={() => handleSelectPossibility('HELO_WINCH')}
                className="px-4 py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-black text-xs shadow-lg active:scale-95 transition flex items-center gap-1.5"
              >
                <Plane className="w-4 h-4" />
                <span>Run Helo Demo (78%)</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
