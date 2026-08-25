import { MeshNode } from '../types/dhostAuth';

const SEED_NODES: MeshNode[] = [
  {
    id: 'NODE-BASE-01',
    name: 'District EOC Central Command Base',
    type: 'BASE_STATION',
    lat: 11.6643,
    lng: 78.1460,
    status: 'ACTIVE',
    battery: 100,
    activeHops: 4,
    queuedPacketsCount: 0,
    signalDbm: -45
  },
  {
    id: 'NODE-RELAY-01',
    name: 'Fairlands High-Mast Relay Alpha',
    type: 'MOBILE_RELAY',
    lat: 11.6670,
    lng: 78.1435,
    status: 'RELAYING',
    battery: 88,
    activeHops: 3,
    queuedPacketsCount: 4,
    signalDbm: -62
  },
  {
    id: 'NODE-DRONE-02',
    name: 'AeroMesh Drone 02 (Hover Alt: 120m)',
    type: 'DRONE_NODE',
    lat: 11.6700,
    lng: 78.1380,
    status: 'RELAYING',
    battery: 74,
    activeHops: 2,
    queuedPacketsCount: 7,
    signalDbm: -55
  },
  {
    id: 'NODE-VEHICLE-04',
    name: 'NDRF Rescue Truck Alpha (RSC-1042)',
    type: 'RESCUE_VEHICLE',
    lat: 11.6630,
    lng: 78.1480,
    status: 'RELAYING',
    battery: 95,
    activeHops: 2,
    queuedPacketsCount: 2,
    signalDbm: -58
  },
  {
    id: 'NODE-COMMUNITY-07',
    name: 'Sarada College Shelter Beacon',
    type: 'COMMUNITY_BEACON',
    lat: 11.6780,
    lng: 78.1480,
    status: 'ACTIVE',
    battery: 92,
    activeHops: 1,
    queuedPacketsCount: 1,
    signalDbm: -72
  }
];

class MeshNetworkService {
  private nodes: MeshNode[] = [...SEED_NODES];
  private subscribers: Array<() => void> = [];

  public subscribe(fn: () => void): () => void {
    this.subscribers.push(fn);
    return () => {
      this.subscribers = this.subscribers.filter(s => s !== fn);
    };
  }


  private notify(): void {
    this.subscribers.forEach(s => s());
  }

  public getNodes(): MeshNode[] {
    return [...this.nodes];
  }

  public simulateNodeFailure(nodeId: string): void {
    const node = this.nodes.find(n => n.id === nodeId);
    if (node) {
      node.status = 'OFFLINE';
      node.signalDbm = -120;
      this.notify();
    }
  }


  public simulateNodeRecovery(nodeId: string): void {
    const node = this.nodes.find(n => n.id === nodeId);
    if (node) {
      node.status = 'ACTIVE';
      node.signalDbm = -60;
      this.notify();
    }
  }

  public resetNodes(): void {
    this.nodes = JSON.parse(JSON.stringify(SEED_NODES));
    this.notify();
  }

  public getNetworkMetrics() {
    const total = this.nodes.length;
    const active = this.nodes.filter(n => n.status !== 'OFFLINE').length;
    const queuedTotal = this.nodes.reduce((acc, n) => acc + n.queuedPacketsCount, 0);
    const avgBattery = Math.round(this.nodes.reduce((acc, n) => acc + n.battery, 0) / total);


    return {
      totalNodes: total,
      activeNodes: active,
      meshCoveragePercent: Math.round((active / total) * 100),
      queuedPacketsTotal: queuedTotal,
      averageBattery: avgBattery,
      routingEfficiency: active === total ? 'OPTIMAL (98.4%)' : 'DEGRADED / REROUTING (76.2%)'
    };
  }
}

export const meshNetworkService = new MeshNetworkService();
