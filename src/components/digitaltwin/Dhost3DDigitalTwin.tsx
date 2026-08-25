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
  Plus
} from 'lucide-react';
import { EmergencyPacket, IncidentPriority } from '../../types/dhostAuth';
import { DEPLOYED_RESCUE_TEAMS } from '../../services/aiTriageService';

interface Props {
  incidents: EmergencyPacket[];
  onSelectIncident?: (incident: EmergencyPacket) => void;
  onClose: () => void;
}

export const Dhost3DDigitalTwin: React.FC<Props> = ({
  incidents,
  onSelectIncident,
  onClose
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // UI States
  const [selectedIncident, setSelectedIncident] = useState<EmergencyPacket | null>(incidents[0] || null);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  
  // Timeline & Simulation
  const [timelineIndex, setTimelineIndex] = useState(2); // 0=22:00, 1=22:15, 2=22:30 (Live), 3=22:45, 4=+15m, 5=+30m
  const [isPlayingTimeline, setIsPlayingTimeline] = useState(false);
  const [isSimulatedRelayDead, setIsSimulatedRelayDead] = useState(false);
  const [meshStatusText, setMeshStatusText] = useState<'OPTIMAL' | 'LOST' | 'SEARCHING' | 'RECOVERED'>('OPTIMAL');

  // Layer Toggles
  const [layerBuildings, setLayerBuildings] = useState(true);
  const [layerFlood, setLayerFlood] = useState(true);
  const [layerIncidents, setLayerIncidents] = useState(true);
  const [layerTeams, setLayerTeams] = useState(true);
  const [layerMesh, setLayerMesh] = useState(true);
  const [layerRiskVolumes, setLayerRiskVolumes] = useState(true);

  // Focus View Mode
  const [focusMode, setFocusMode] = useState<'OVERVIEW' | 'INCIDENT' | 'TEAM' | 'MESH'>('OVERVIEW');

  // References for Three.js Scene Updates
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const waterMeshRef = useRef<THREE.Mesh | null>(null);
  const riskVolumeMeshRef = useRef<THREE.Mesh | null>(null);
  const particleGroupRef = useRef<THREE.Group | null>(null);
  const vehicleGroupRef = useRef<THREE.Group | null>(null);
  const buildingsGroupRef = useRef<THREE.Group | null>(null);
  const meshLinesGroupRef = useRef<THREE.Group | null>(null);

  // Timeline labels
  const timelineSteps = [
    { label: '22:00', desc: 'Pre-Disaster Storm Warning' },
    { label: '22:15', desc: 'River Flood Surge 2.5ft' },
    { label: '22:30', desc: '● LIVE: Peak Inundation (4ft)' },
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
    scene.fog = new THREE.FogExp2(0x020617, 0.008);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    camera.position.set(0, 60, 95);
    camera.lookAt(0, 5, 0);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0x1e293b, 1.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x38bdf8, 1.5);
    dirLight.position.set(40, 80, 50);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    // Subtle Tactical Amber Emergency Accent Light
    const amberLight = new THREE.PointLight(0xf59e0b, 3, 100);
    amberLight.position.set(-20, 25, -10);
    scene.add(amberLight);

    // 5. Tactical Ground Plane Grid
    const groundGeo = new THREE.PlaneGeometry(240, 240);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x090d16,
      roughness: 0.9,
      metalness: 0.1
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const gridHelper = new THREE.GridHelper(240, 48, 0x1e293b, 0x0f172a);
    gridHelper.position.y = 0.05;
    scene.add(gridHelper);

    // 6. River & 3D Bridge
    const riverGeo = new THREE.PlaneGeometry(40, 240);
    const riverMat = new THREE.MeshStandardMaterial({
      color: 0x0369a1,
      roughness: 0.1,
      metalness: 0.8,
      transparent: true,
      opacity: 0.85
    });
    const river = new THREE.Mesh(riverGeo, riverMat);
    river.rotation.x = -Math.PI / 2;
    river.position.set(0, 0.1, 0);
    scene.add(river);

    // 3D Bridge Arch
    const bridgeGeo = new THREE.BoxGeometry(16, 2, 60);
    const bridgeMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6 });
    const bridge = new THREE.Mesh(bridgeGeo, bridgeMat);
    bridge.position.set(0, 2, 0);
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
    for (let x = -70; x <= 70; x += 22) {
      for (let z = -70; z <= 70; z += 22) {
        if (Math.abs(x) < 22) continue; // Leave space for river corridor

        const bHeight = Math.random() * 12 + 6;
        const bGeo = new THREE.BoxGeometry(14, bHeight, 14);
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

    // Hospital High-Ground Landmark
    const hospGeo = new THREE.BoxGeometry(22, 16, 22);
    const hospMesh = new THREE.Mesh(hospGeo, hospitalMat);
    hospMesh.position.set(45, 8, -40);
    hospMesh.castShadow = true;
    buildingsGroup.add(hospMesh);

    // 8. 3D Water Flood Inundation Volume
    const waterGeo = new THREE.BoxGeometry(160, 4, 160);
    const waterVolumeMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      transparent: true,
      opacity: 0.45,
      roughness: 0.1,
      metalness: 0.9
    });
    const waterVolume = new THREE.Mesh(waterGeo, waterVolumeMat);
    waterVolume.position.set(-10, 2, 10);
    scene.add(waterVolume);
    waterMeshRef.current = waterVolume;

    // 9. 3D AI Risk Volumes
    const riskGeo = new THREE.CylinderGeometry(18, 24, 14, 32);
    const riskMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      transparent: true,
      opacity: 0.25,
      wireframe: false
    });
    const riskVolume = new THREE.Mesh(riskGeo, riskMat);
    riskVolume.position.set(-5, 7, 5);
    scene.add(riskVolume);
    riskVolumeMeshRef.current = riskVolume;

    // 10. 3D Beacons for Incidents
    const beaconsGroup = new THREE.Group();
    scene.add(beaconsGroup);

    incidents.slice(0, 6).forEach((inc, idx) => {
      const px = (idx % 2 === 0 ? -1 : 1) * (18 + idx * 10);
      const pz = (idx % 3 === 0 ? -1 : 1) * (12 + idx * 12);
      const color = inc.priority === 'CRITICAL' ? 0xef4444 : inc.priority === 'HIGH' ? 0xf59e0b : 0x10b981;

      // Vertical Light Beam
      const beamGeo = new THREE.CylinderGeometry(0.3, 0.3, 35, 16);
      const beamMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.8 });
      const beam = new THREE.Mesh(beamGeo, beamMat);
      beam.position.set(px, 17.5, pz);
      beaconsGroup.add(beam);

      // Glowing Pulse Sphere
      const sphereGeo = new THREE.SphereGeometry(1.6, 16, 16);
      const sphereMat = new THREE.MeshBasicMaterial({ color });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      sphere.position.set(px, 35, pz);
      beaconsGroup.add(sphere);

      // Ground Ring
      const ringGeo = new THREE.RingGeometry(2, 3.5, 32);
      const ringMat = new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide, transparent: true, opacity: 0.7 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(px, 0.2, pz);
      beaconsGroup.add(ring);
    });

    // 11. 3D Moving Rescue Vehicles
    const vehicleGroup = new THREE.Group();
    vehicleGroupRef.current = vehicleGroup;
    scene.add(vehicleGroup);

    // Team Bravo Rescue Boat
    const boatGeo = new THREE.BoxGeometry(4, 2, 7);
    const boatMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.3 });
    const boat = new THREE.Mesh(boatGeo, boatMat);
    boat.position.set(0, 3, -30);
    vehicleGroup.add(boat);

    // Rescue Alpha Truck
    const truckGeo = new THREE.BoxGeometry(4, 3, 6);
    const truckMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.4 });
    const truck = new THREE.Mesh(truckGeo, truckMat);
    truck.position.set(28, 1.5, 20);
    vehicleGroup.add(truck);

    // 12. 3D LoRa Mesh Network Lines & Data Particles
    const meshLinesGroup = new THREE.Group();
    meshLinesGroupRef.current = meshLinesGroup;
    scene.add(meshLinesGroup);

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

    // 13. Orbit / Interaction Mouse Controls
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
      cameraRef.current.lookAt(0, 5, 0);

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
      cameraRef.current.lookAt(0, 5, 0);

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

    // 14. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Animate Water subtle swell
      if (waterMeshRef.current) {
        waterMeshRef.current.position.y = 2 + Math.sin(elapsedTime * 1.5) * 0.25;
      }

      // Animate Data Packet Particle Flow
      if (particleGroupRef.current) {
        particleGroupRef.current.children.forEach((child, i) => {
          child.position.z = ((elapsedTime * 12 + i * 8) % 80) - 40;
          child.position.y = 12 + Math.sin(elapsedTime * 3 + i) * 1.2;
        });
      }

      // Animate Moving Vehicle (Team Bravo Boat)
      if (vehicleGroupRef.current && vehicleGroupRef.current.children[0]) {
        vehicleGroupRef.current.children[0].position.z = -30 + Math.sin(elapsedTime * 0.8) * 18;
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
  }, []);

  // -------------------------------------------------------------
  // TIMELINE & SIMULATION CONTROLS
  // -------------------------------------------------------------
  const handleScrubTimeline = (idx: number) => {
    setTimelineIndex(idx);
    if (!waterMeshRef.current || !riskVolumeMeshRef.current) return;

    // Adjust 3D Water Volume & Risk Heights dynamically
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
      // Predictive Model
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
  // SELF-HEALING NETWORK SIMULATION WOW DEMO
  // -------------------------------------------------------------
  const handleSimulateRelayKill = () => {
    setIsSimulatedRelayDead(true);
    setMeshStatusText('LOST');

    // Searching alternative path
    setTimeout(() => {
      setMeshStatusText('SEARCHING');
    }, 1000);

    // Path recovered via Drone Relay
    setTimeout(() => {
      setMeshStatusText('RECOVERED');
    }, 2400);
  };

  const handleResetRelay = () => {
    setIsSimulatedRelayDead(false);
    setMeshStatusText('OPTIMAL');
  };

  // -------------------------------------------------------------
  // CAMERA FOCUS CONTROLS
  // -------------------------------------------------------------
  const handleFocusIncident = (inc: EmergencyPacket) => {
    setSelectedIncident(inc);
    setFocusMode('INCIDENT');
    if (!cameraRef.current) return;
    cameraRef.current.position.set(-15, 30, 45);
    cameraRef.current.lookAt(-10, 5, 10);
  };

  const handleFocusTeam = (teamId: string) => {
    setSelectedTeamId(teamId);
    setFocusMode('TEAM');
    if (!cameraRef.current) return;
    cameraRef.current.position.set(10, 20, -10);
    cameraRef.current.lookAt(0, 3, -30);
  };

  const handleResetCamera = () => {
    setFocusMode('OVERVIEW');
    if (!cameraRef.current) return;
    cameraRef.current.position.set(0, 60, 95);
    cameraRef.current.lookAt(0, 5, 0);
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
              <span>DHOST 3D DIGITAL TWIN™</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
                OPERATIONAL TWIN
              </span>
            </h1>
            <p className="text-[10px] text-slate-400 font-mono hidden md:block">
              Sector: Salem Disaster Ground • 3D Terrain + LoRa Mesh + Real-Time Telemetry
            </p>
          </div>
        </div>

        {/* Center: Layer Filters */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 text-xs">
          <button
            onClick={() => {
              setLayerFlood(!layerFlood);
              if (waterMeshRef.current) waterMeshRef.current.visible = !layerFlood;
            }}
            className={`px-2.5 py-1 rounded-xl font-bold transition text-[11px] whitespace-nowrap ${
              layerFlood ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}
          >
            🌊 Flood Layer
          </button>

          <button
            onClick={() => {
              setLayerRiskVolumes(!layerRiskVolumes);
              if (riskVolumeMeshRef.current) riskVolumeMeshRef.current.visible = !layerRiskVolumes;
            }}
            className={`px-2.5 py-1 rounded-xl font-bold transition text-[11px] whitespace-nowrap ${
              layerRiskVolumes ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}
          >
            🧠 3D Risk Zones
          </button>

          <button
            onClick={handleResetCamera}
            className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[11px] whitespace-nowrap"
          >
            🔭 Reset Cam
          </button>
        </div>

        {/* Right: Self-Healing Demo Trigger */}
        <div className="flex items-center gap-1.5 shrink-0">
          {!isSimulatedRelayDead ? (
            <button
              onClick={handleSimulateRelayKill}
              className="px-3 py-1.5 rounded-xl bg-red-600/30 hover:bg-red-600/40 border border-red-500/50 text-red-300 font-black text-xs flex items-center gap-1.5 transition active:scale-95"
            >
              <Zap className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden sm:inline">⚡ Kill Relay (Self-Healing Demo)</span>
              <span className="sm:hidden">Kill Node</span>
            </button>
          ) : (
            <button
              onClick={handleResetRelay}
              className="px-3 py-1.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/40 border border-emerald-500/50 text-emerald-300 font-black text-xs flex items-center gap-1.5 transition"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Topology Restored</span>
            </button>
          )}
        </div>

      </div>

      {/* ======================================================== */}
      {/* 2. MAIN 3D THREE.JS CANVAS CONTAINER                     */}
      {/* ======================================================== */}
      <div className="relative flex-1 bg-slate-950 overflow-hidden w-full h-full">
        
        {/* Three.js DOM Injection Mount */}
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Tactical HUD Overlay: Self-Healing Network Toast */}
        {isSimulatedRelayDead && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-2xl bg-slate-900/90 border-2 border-amber-500 shadow-2xl font-mono text-xs text-white flex items-center gap-2.5 animate-in zoom-in-95">
            {meshStatusText === 'LOST' && (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                <span className="text-red-400 font-black">⚠ NETWORK PATH LOST (Relay DD-RL-102 Severed)</span>
              </>
            )}
            {meshStatusText === 'SEARCHING' && (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-spin" />
                <span className="text-amber-300 font-black">SEARCHING ALTERNATIVE MESH PATHWAY...</span>
              </>
            )}
            {meshStatusText === 'RECOVERED' && (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 font-black">🟢 PATH RECOVERED VIA ROOFTOP DRONE RELAY C</span>
              </>
            )}
          </div>
        )}

        {/* Floating Fast-Focus Sidebar */}
        <div className="absolute top-4 left-4 z-20 space-y-1.5 font-mono text-xs hidden sm:block">
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest block bg-slate-950/80 px-2 py-1 rounded">
            3D SPATIAL TARGETS:
          </span>
          {incidents.slice(0, 3).map(inc => (
            <button
              key={inc.incidentId}
              onClick={() => handleFocusIncident(inc)}
              className={`p-2 rounded-xl border text-left block w-44 backdrop-blur-md transition ${
                selectedIncident?.incidentId === inc.incidentId
                  ? 'bg-amber-950/80 border-amber-400 text-white'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-[11px]">{inc.incidentId}</span>
                <span className="text-[9px] text-red-400 font-bold">{inc.priority}</span>
              </div>
              <span className="text-[10px] block truncate">{inc.peopleCount} People • {inc.location?.address || 'Bridge'}</span>
            </button>
          ))}
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
                <h3 className="text-sm font-black text-white">{selectedIncident.incidentCategoryLabel} ({selectedIncident.peopleCount} Trapped)</h3>
              </div>
              <p className="text-xs text-slate-300 font-medium italic">"{selectedIncident.translatedText || selectedIncident.requestText}"</p>
              <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono">
                <span>📍 3D Landmark: {selectedIncident.location?.address || 'Old Bridge Pillar'}</span>
                <span>Assigned Unit: <strong className="text-emerald-400">{selectedIncident.assignedTeamName || 'Rescue Alpha'}</strong></span>
                <span>Mesh Hops: <strong className="text-blue-400">3 Hops (LoRa 868MHz)</strong></span>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  if (onSelectIncident) onSelectIncident(selectedIncident);
                  onClose();
                }}
                className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg active:scale-95 transition flex items-center gap-1.5"
              >
                <AlertOctagon className="w-4 h-4" />
                <span>ACT NOW ON 3D TARGET</span>
              </button>

              <button
                onClick={() => handleFocusTeam('TEAM-BRAVO')}
                className="px-4 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs flex items-center gap-1.5 transition"
              >
                <Navigation className="w-4 h-4" />
                <span>Follow 3D Team</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
