import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  ResponderUser, 
  AuthStatus, 
  NetworkMode, 
  UserRole, 
  EmergencyPacket, 
  MeshNode, 
  CreateSosRequest, 
  LocationData, 
  IncidentPriority, 
  IncidentStatus 
} from '../types/dhostAuth';
import { dhostAuthService } from '../services/dhostAuthService';
import { incidentService } from '../services/incidentService';
import { meshNetworkService } from '../services/meshNetworkService';
import { hardwareService } from '../services/hardwareService';
import { DEMO_RESPONDER_ACCOUNTS } from '../services/dhostAuthService';

interface DhostAuthContextType {
  // Authentication
  currentUser: ResponderUser | null;
  authStatus: AuthStatus;
  isAuthenticated: boolean;
  networkMode: NetworkMode;
  setNetworkMode: (mode: NetworkMode) => void;
  login: (organization: string, responderId: string, pin: string, trustDevice?: boolean) => Promise<ResponderUser>;
  logout: (confirmed?: boolean) => void;
  quickSwitchDemo: (role: UserRole) => ResponderUser;
  demoAccounts: typeof DEMO_RESPONDER_ACCOUNTS;

  // Mesh & Devices
  meshNodes: MeshNode[];
  simulateMeshFailover: () => void;

  // Incidents Store
  incidents: EmergencyPacket[];
  addIncident: (req: CreateSosRequest) => EmergencyPacket;
  createCommunityReport: (params: {
    title: string;
    description: string;
    hazardType: string;
    location: LocationData;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  }) => EmergencyPacket;
  createSafeCheckIn: (params: {
    name?: string;
    message?: string;
    location: LocationData;
  }) => EmergencyPacket;
  assignTeam: (incidentId: string, teamId: string, teamName: string) => EmergencyPacket | null;
  updateIncidentStatus: (incidentId: string, status: IncidentStatus, note?: string) => EmergencyPacket | null;
  updateIncidentPriority: (incidentId: string, priority: IncidentPriority) => EmergencyPacket | null;
  resetIncidents: () => void;
  resetData: () => void;

  // Hardware & Acoustic Beacons
  getLiveCoordinates: () => Promise<LocationData>;
  getBatteryLevel: () => number;
  playRescueSiren: () => boolean;
  stopRescueSiren: () => void;
  playDispatchChime: () => void;
  startVoiceSos: (onTranscript: (text: string, isFinal: boolean) => void, onError: (err: string) => void) => () => void;
  generateSmsDistressUri: (packet: EmergencyPacket) => string;
  generateWhatsAppDistressUri: (packet: EmergencyPacket) => string;
  triggerNativeShare: (packet: EmergencyPacket) => Promise<boolean>;

  // Inspector & Modals
  selectedIncident: EmergencyPacket | null;
  setSelectedIncident: (inc: EmergencyPacket | null) => void;
  isPacketInspectorOpen: boolean;
  openPacketInspector: (inc: EmergencyPacket) => void;
  closePacketInspector: () => void;
  isOfflineLogoutModalOpen: boolean;
  setIsOfflineLogoutModalOpen: (open: boolean) => void;
  isDemoSwitcherOpen: boolean;
  setIsDemoSwitcherOpen: (open: boolean) => void;
}

const DhostAuthContext = createContext<DhostAuthContextType | null>(null);

export const DhostAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Auth State
  const [currentUser, setCurrentUser] = useState<ResponderUser | null>(() => dhostAuthService.getCurrentUser());
  const [authStatus, setAuthStatus] = useState<AuthStatus>(() => dhostAuthService.getAuthStatus());
  const [networkMode, setNetworkModeState] = useState<NetworkMode>(() => dhostAuthService.getNetworkMode());

  // Incidents State
  const [incidents, setIncidents] = useState<EmergencyPacket[]>(() => incidentService.getAllIncidents());
  const [selectedIncident, setSelectedIncident] = useState<EmergencyPacket | null>(null);

  // Mesh Nodes
  const [meshNodes, setMeshNodes] = useState<MeshNode[]>(() => meshNetworkService.getAllNodes());

  // Modals
  const [isPacketInspectorOpen, setIsPacketInspectorOpen] = useState(false);
  const [isOfflineLogoutModalOpen, setIsOfflineLogoutModalOpen] = useState(false);
  const [isDemoSwitcherOpen, setIsDemoSwitcherOpen] = useState(false);

  // Subscribe to Auth Service updates
  useEffect(() => {
    const unsub = dhostAuthService.subscribe(() => {
      setCurrentUser(dhostAuthService.getCurrentUser());
      setAuthStatus(dhostAuthService.getAuthStatus());
      setNetworkModeState(dhostAuthService.getNetworkMode());
    });
    return unsub;
  }, []);

  // Subscribe to Incident Service updates
  useEffect(() => {
    const unsub = incidentService.subscribe(() => {
      setIncidents(incidentService.getAllIncidents());
    });
    return unsub;
  }, []);

  // Subscribe to Mesh Network updates
  useEffect(() => {
    const unsub = meshNetworkService.subscribe(() => {
      setMeshNodes(meshNetworkService.getAllNodes());
    });
    return unsub;
  }, []);

  const setNetworkMode = (mode: NetworkMode) => {
    dhostAuthService.setNetworkMode(mode);
  };

  const login = async (org: string, respId: string, pin: string, trust?: boolean) => {
    return dhostAuthService.login(org, respId, pin, trust);
  };

  const logout = (confirmed?: boolean) => {
    if (!confirmed && networkMode !== 'ONLINE') {
      setIsOfflineLogoutModalOpen(true);
      return;
    }
    dhostAuthService.logout();
  };

  const quickSwitchDemo = (role: UserRole) => {
    return dhostAuthService.quickSwitchDemo(role);
  };

  const addIncident = (req: CreateSosRequest) => {
    return incidentService.createVictimSos(req);
  };

  const createCommunityReport = (params: any) => {
    return incidentService.createCommunityReport(params);
  };

  const createSafeCheckIn = (params: any) => {
    return incidentService.createSafeCheckIn(params);
  };

  const assignTeam = (incidentId: string, teamId: string, teamName: string) => {
    return incidentService.assignTeam(incidentId, teamId, teamName);
  };

  const updateIncidentStatus = (incidentId: string, status: IncidentStatus, note?: string) => {
    const actor = currentUser ? `${currentUser.responderId} (${currentUser.name})` : 'System';
    return incidentService.updateStatus(incidentId, status, actor, note);
  };

  const updateIncidentPriority = (incidentId: string, priority: IncidentPriority) => {
    const actor = currentUser ? `${currentUser.responderId} (${currentUser.name})` : 'Commander';
    return incidentService.updatePriority(incidentId, priority, actor);
  };

  const resetIncidents = () => {
    incidentService.resetToDefaults();
  };

  const resetData = () => {
    incidentService.resetToDefaults();
    meshNetworkService.resetNodes();
  };

  const simulateMeshFailover = () => {
    meshNetworkService.simulateFailover();
  };

  const openPacketInspector = (inc: EmergencyPacket) => {
    setSelectedIncident(inc);
    setIsPacketInspectorOpen(true);
  };

  const closePacketInspector = () => {
    setIsPacketInspectorOpen(false);
  };

  return (
    <DhostAuthContext.Provider
      value={{
        currentUser,
        authStatus,
        isAuthenticated: currentUser !== null && (authStatus === 'AUTHENTICATED' || authStatus === 'OFFLINE_AUTHENTICATED'),
        networkMode,
        setNetworkMode,
        login,
        logout,
        quickSwitchDemo,
        demoAccounts: DEMO_RESPONDER_ACCOUNTS,
        meshNodes,
        simulateMeshFailover,
        incidents,
        addIncident,
        createCommunityReport,
        createSafeCheckIn,
        assignTeam,
        updateIncidentStatus,
        updateIncidentPriority,
        resetIncidents,
        resetData,
        // Hardware & Acoustic Beacons
        getLiveCoordinates: () => hardwareService.getLiveCoordinates(),
        getBatteryLevel: () => hardwareService.getBatteryLevel(),
        playRescueSiren: () => hardwareService.playRescueSiren(),
        stopRescueSiren: () => hardwareService.stopRescueSiren(),
        playDispatchChime: () => hardwareService.playDispatchChime(),
        startVoiceSos: (onTranscript, onError) => hardwareService.startVoiceSos(onTranscript, onError),
        generateSmsDistressUri: (packet) => hardwareService.generateSmsDistressUri(packet),
        generateWhatsAppDistressUri: (packet) => hardwareService.generateWhatsAppDistressUri(packet),
        triggerNativeShare: (packet) => hardwareService.triggerNativeShare(packet),
        selectedIncident,
        setSelectedIncident,
        isPacketInspectorOpen,
        openPacketInspector,
        closePacketInspector,
        isOfflineLogoutModalOpen,
        setIsOfflineLogoutModalOpen,
        isDemoSwitcherOpen,
        setIsDemoSwitcherOpen,
      }}
    >
      {children}
    </DhostAuthContext.Provider>
  );
};

export const useDhostAuth = () => {
  const context = useContext(DhostAuthContext);
  if (!context) {
    throw new Error('useDhostAuth must be used within a DhostAuthProvider');
  }
  return context;
};

