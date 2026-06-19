export type SectionId = 'gateway' | 'aicity' | 'robotics' | 'space' | 'quantum' | 'events' | 'finale';

export interface InteractiveItem {
  id: string;
  name: string;
  description: string;
  category: string;
  details: string[];
  specs?: Record<string, string>;
  x: number; // 3D coordinates
  y: number;
  z: number;
  size?: number;
  hue?: number;
}

export interface CyberRobot extends InteractiveItem {
  status: string;
  type: string;
  features: string[];
}

export interface SpaceObject extends InteractiveItem {
  orbitRadius: number;
  orbitSpeed: number;
  angle: number;
  type: 'planet' | 'colony' | 'rocket' | 'station';
}

export interface QuantumNode {
  id: string;
  name: string;
  description: string;
  details: string[];
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  connections: string[];
}

export interface TechfestEvent {
  id: string;
  title: string;
  category: string;
  description: string;
  prizePool: string;
  date: string;
  overview: string;
  rules: string[];
  timeline: string[];
}

export interface Sponsor {
  id: string;
  name: string;
  tier: 'Title' | 'Platinum' | 'Gold' | 'Strategic';
  role: string;
  angle: number;
  distance: number;
  speed: number;
}
