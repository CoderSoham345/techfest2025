/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Compass, 
  Cpu, 
  Sliders, 
  Terminal, 
  Zap, 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight,
  Shield, 
  Activity,
  Play,
  RotateCcw,
  Sparkles,
  HelpCircle,
  X,
  Radio,
  Eye,
  Crosshair,
  Settings
} from 'lucide-react';
import { audioEngine } from './AudioEngine';

interface TechfestInteractiveLabProps {
  isOpen: boolean;
  onClose: () => void;
  initialSandbox?: 'drone' | 'robot' | 'rocket' | 'mars';
}

export default function TechfestInteractiveLab({ isOpen, onClose, initialSandbox = 'drone' }: TechfestInteractiveLabProps) {
  const [activeTab, setActiveTab] = useState<'drone' | 'robot' | 'rocket' | 'mars'>(initialSandbox);
  
  // Drone simulation state
  const [dronePos, setDronePos] = useState({ x: 0, y: 0, z: 120 });
  const [droneLaserActive, setDroneLaserActive] = useState(false);
  const [droneLogs, setDroneLogs] = useState<string[]>(['[00:00:00] UAV systems loaded', '[00:00:02] Camera linked at 1080p 60fps']);
  const [droneSpeed, setDroneSpeed] = useState(0);
  const [targetLocked, setTargetLocked] = useState(true);
  
  // Robot rotator state
  const [jointYaw, setJointYaw] = useState(45);
  const [jointPitch, setJointPitch] = useState(-15);
  const [jointRoll, setJointRoll] = useState(90);
  const [robotStress, setRobotStress] = useState(24); // % stress
  const [robotTemp, setRobotTemp] = useState(41); // °C
  const [isStressTesting, setIsStressTesting] = useState(false);
  const [robotStatus, setRobotStatus] = useState<'IDLE' | 'MOVE' | 'TESTING' | 'OVERHEAT'>('IDLE');

  // Rocket countdown & flight simulation
  const [countdown, setCountdown] = useState<number | null>(null);
  const [rocketAlt, setRocketAlt] = useState(0); // km
  const [rocketVel, setRocketVel] = useState(0); // km/h
  const [rocketStage, setRocketStage] = useState<'DOCK' | 'COUNTDOWN' | 'BOOSTERS_FIRED' | 'STAGE_DECOUPLED' | 'ORBITAL_STABLE'>('DOCK');
  const [rocketFuel, setRocketFuel] = useState(100); // %
  const [rocketLogs, setRocketLogs] = useState<string[]>(['[MAIN] Rocket awaiting injection sequence.']);
  
  // Mars Sector exploration
  const [selectedMarsSector, setSelectedMarsSector] = useState<'biosphere' | 'solar' | 'reactor' | 'hub'>('biosphere');
  const [oxygenLevel, setOxygenLevel] = useState(98.4);
  const [powerGrid, setPowerGrid] = useState(87);
  const [reactorFlux, setReactorFlux] = useState(64);
  const [reactorState, setReactorState] = useState<'STABLE' | 'OVERLOAD' | 'CRITICAL'>('STABLE');

  // Multi-refs for active canvas animations
  const droneCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const rocketCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sound triggering functions wrapped safely
  const triggerClickSound = () => audioEngine.playClick();
  const triggerSpaceSound = () => audioEngine.playSpace();
  const triggerRobotSound = () => audioEngine.playRobot();
  const triggerQuantumSound = () => audioEngine.playQuantum();

  // 1. Drone Cockpit visualizer looping background
  useEffect(() => {
    if (!isOpen || activeTab !== 'drone') return;
    const canvas = droneCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;
    // Generate static scan targets
    const scannerTargets = [
      { x: -80, y: -50, z: 120, label: 'IITB_MAIN_DOME' },
      { x: 90, y: 30, z: 180, label: 'COGNITIVE_GRID' },
      { x: -20, y: 80, z: 90, label: 'AERIAL_ROUTING_POD_04' }
    ];

    const drawDroneHUD = () => {
      time += 0.05;
      const w = canvas.width;
      const h = canvas.height;
      ctx.fillStyle = '#030307';
      ctx.fillRect(0, 0, w, h);

      // Draw vector circular radar matrix background
      ctx.strokeStyle = 'rgba(0, 245, 255, 0.1)';
      ctx.lineWidth = 1;
      
      const cx = w / 2;
      const cy = h / 2;
      const radarRadius = Math.min(w, h) * 0.42;

      ctx.beginPath();
      ctx.arc(cx, cy, radarRadius, 0, Math.PI * 2);
      ctx.arc(cx, cy, radarRadius * 0.7, 0, Math.PI * 2);
      ctx.arc(cx, cy, radarRadius * 0.4, 0, Math.PI * 2);
      ctx.stroke();

      // Horizontal crosshair bounds
      ctx.beginPath();
      ctx.moveTo(cx - radarRadius, cy);
      ctx.lineTo(cx + radarRadius, cy);
      ctx.moveTo(cx, cy - radarRadius);
      ctx.lineTo(cx, cy + radarRadius);
      ctx.stroke();

      // Sweeping radar scanning line
      const sweepAngle = time * 0.6;
      ctx.strokeStyle = 'rgba(0, 245, 255, 0.35)';
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(sweepAngle) * radarRadius, cy + Math.sin(sweepAngle) * radarRadius);
      ctx.stroke();

      // Draw tracked scan targets relative to drone position
      scannerTargets.forEach((tgt, idx) => {
        // compute relative screen offset
        const dx = (tgt.x - dronePos.x) * 1.5;
        const dy = (tgt.y - dronePos.y) * 1.5;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // if target falls inside radar scope limits
        if (dist < radarRadius) {
          const tx = cx + dx;
          const ty = cy - dy;

          // Draw neon flashing target indicators
          ctx.strokeStyle = '#f43f5e';
          ctx.beginPath();
          ctx.arc(tx, ty, 6 + Math.sin(time * 3 + idx) * 3, 0, Math.PI * 2);
          ctx.stroke();

          // Target reticle lock label text
          ctx.font = '9px monospace';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.fillText(`ID: ${tgt.label}`, tx + 10, ty - 2);
          ctx.fillStyle = '#00f5ff';
          ctx.fillText(`DST: ${(tgt.z - dronePos.z + dist).toFixed(1)}m`, tx + 10, ty + 8);
        }
      });

      // Overlay Drone laser gun animation when firing
      if (droneLaserActive) {
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 4;
        ctx.shadowColor = '#f43f5e';
        ctx.shadowBlur = 15;
        
        // draw laser lines emanating from cockpit left/right canons
        ctx.beginPath();
        ctx.moveTo(20, h - 20);
        ctx.lineTo(cx + (Math.sin(time * 50) * 15), cy + (Math.cos(time * 50) * 15));
        ctx.moveTo(w - 20, h - 20);
        ctx.lineTo(cx + (Math.sin(time * 50) * 15), cy + (Math.cos(time * 50) * 15));
        ctx.stroke();
        
        ctx.shadowBlur = 0; // reset glow
      }

      // Draw simulated tactical flight HUD brackets
      ctx.strokeStyle = '#00f5ff';
      ctx.lineWidth = 2;
      
      // Left bracket
      ctx.beginPath();
      ctx.moveTo(40, h / 2 - 40);
      ctx.lineTo(30, h / 2 - 40);
      ctx.lineTo(30, h / 2 + 40);
      ctx.lineTo(40, h / 2 + 40);
      ctx.stroke();

      // Right bracket
      ctx.beginPath();
      ctx.moveTo(w - 40, h / 2 - 40);
      ctx.lineTo(w - 30, h / 2 - 40);
      ctx.lineTo(w - 30, h / 2 + 40);
      ctx.lineTo(w - 40, h / 2 + 40);
      ctx.stroke();

      // Pitch altitude bars on HUD left
      ctx.font = '8px monospace';
      ctx.fillStyle = '#00f5ff';
      ctx.fillText(`ALT: ${dronePos.z}M`, 45, h / 2 - 25);
      ctx.fillText('STB: 100%', 45, h / 2 + 30);

      // Pitch angle meters on HUD right
      ctx.fillText(`LAT: ${dronePos.x.toFixed(0)}`, w - 95, h / 2 - 25);
      ctx.fillText(`LNG: ${dronePos.y.toFixed(0)}`, w - 95, h / 2 + 30);

      animId = requestAnimationFrame(drawDroneHUD);
    };

    drawDroneHUD();
    return () => cancelAnimationFrame(animId);
  }, [isOpen, activeTab, dronePos, droneLaserActive]);

  // 2. Drone Movement helpers
  const handleDroneMovement = (direction: 'up' | 'down' | 'left' | 'right' | 'forward' | 'backward') => {
    triggerClickSound();
    setDroneSpeed(32);
    setDronePos(prev => {
      let { x, y, z } = prev;
      let actionStr = '';
      switch (direction) {
        case 'up': z += 15; actionStr = `Elevating drone upwards. ZCoords: ${z}`; break;
        case 'down': z = Math.max(10, z - 15); actionStr = `Descending drone altitude. ZCoords: ${z}`; break;
        case 'left': x -= 10; actionStr = `Swaying drone leftwards. XCoords: ${x}`; break;
        case 'right': x += 10; actionStr = `Swaying drone rightwards. XCoords: ${x}`; break;
        case 'forward': y += 15; actionStr = `Navigating drone forwards. YCoords: ${y}`; break;
        case 'backward': y -= 15; actionStr = `Retracting drone backwards. YCoords: ${y}`; break;
      }
      setDroneLogs(logs => [
        `[${new Date().toLocaleTimeString()}] ${actionStr}`,
        ...logs.slice(0, 5)
      ]);
      return { x, y, z };
    });
    // scale down drone movement speed shortly after
    setTimeout(() => setDroneSpeed(12), 250);
  };

  const handleFireDroneLaser = () => {
    setDroneLaserActive(true);
    triggerQuantumSound();
    setDroneLogs(logs => [
      `[${new Date().toLocaleTimeString()}] TRIGGERED INTENSE QUANTUM PLASMA BURST // DEBRIS SCANNING`,
      ...logs.slice(0, 5)
    ]);
    setTimeout(() => {
      setDroneLaserActive(false);
    }, 450);
  };


  // 3. Robot stress testing handler loop
  useEffect(() => {
    if (!isStressTesting) return;
    const interval = setInterval(() => {
      setRobotTemp(t => {
        if (t >= 85) {
          setRobotStatus('OVERHEAT');
          setIsStressTesting(false);
          setRobotLogs(logs => [
            `[FATAL ALERT] CENTRAL PIVOT VALVE RE-ENTERED HIGH THERMAL ENVELOPE. ROTATION HALTED.`,
            ...logs
          ]);
          return 92;
        }
        return t + Math.floor(Math.random() * 8) + 4;
      });

      setRobotStress(s => {
        const nextStress = Math.min(100, s + Math.floor(Math.random() * 12) + 6);
        return nextStress;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [isStressTesting]);

  // Cool robot stress logs generator
  const [robotLogs, setRobotLogs] = useState<string[]>(['[00:00:00] Robotic Joint Controller ready.']);

  const runStressTest = () => {
    triggerRobotSound();
    setIsStressTesting(true);
    setRobotStatus('TESTING');
    setRobotLogs(logs => [
      `[STAGE INFO] Executing intense torque loading calibrations across secondary mechatronic cells. Check thermodynamic ratings...`,
      ...logs
    ]);
  };

  const resetCalibration = () => {
    triggerClickSound();
    setJointYaw(0);
    setJointPitch(0);
    setJointRoll(0);
    setRobotStress(5);
    setRobotTemp(32);
    setRobotStatus('IDLE');
    setIsStressTesting(false);
    setRobotLogs(logs => [
      `[STAGE SUCCESS] Refitted central magnetic servos. Calibration index realigned to standard default ground axes.`,
      ...logs
    ]);
  };


  // 4. Rocket Launch Simulation background Loop
  useEffect(() => {
    if (!isOpen || activeTab !== 'rocket') return;
    const canvas = rocketCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let particles: Array<{ x: number; y: number; size: number; vy: number; color: string; alpha: number }> = [];

    const drawRocketSimulation = () => {
      const w = canvas.width;
      const h = canvas.height;
      
      // Deep sky gradient depending on altitude
      const altitudeIndex = Math.min(1.0, rocketAlt / 150000); // map up to sky boundary
      ctx.fillStyle = `rgb(${Math.max(1, 3 - altitudeIndex * 3)}, ${Math.max(1, 4 - altitudeIndex * 4)}, ${Math.max(2, 12 - altitudeIndex * 12)})`;
      ctx.fillRect(0, 0, w, h);

      // Stars rushing downwards as rocket climbs
      if (rocketVel > 0) {
        const starSpeed = Math.min(25, rocketVel / 600);
        if (Math.random() < 0.3) {
          particles.push({
            x: Math.random() * w,
            y: 0,
            size: 0.5 + Math.random() * 2,
            vy: starSpeed + 2,
            color: 'rgba(255, 255, 255, 0.9)',
            alpha: 1.0
          });
        }
      }

      // Exhaust fire flame particles during boost
      if (rocketStage === 'BOOSTERS_FIRED' || rocketStage === 'STAGE_DECOUPLED') {
        const flameCount = Math.floor(rocketVel / 2000) + 3;
        for (let i = 0; i < flameCount; i++) {
          particles.push({
            x: w / 2 + (Math.random() - 0.5) * 16,
            y: h * 0.72 + (Math.random() - 0.5) * 8,
            size: 2 + Math.random() * 6,
            vy: 4 + Math.random() * 12,
            color: Math.random() > 0.4 ? '#f43f5e' : '#ea580c',
            alpha: 1.0
          });
        }
      }

      // Draw all background particle elements (stars + combustion flames)
      particles.forEach((p, idx) => {
        p.y += p.vy;
        if (p.color !== 'rgba(255, 255, 255, 0.9)') {
          p.alpha -= 0.03;
          p.x += (Math.random() - 0.5) * 5; // spread exhaust plume
        }

        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });

      // Filter dead elements
      particles = particles.filter(p => p.y < h && p.alpha > 0);

      // Draws actual 2D wireframe rocket blueprint layout at center
      ctx.strokeStyle = '#00f5ff';
      ctx.lineWidth = 1.5;
      
      const rx = w / 2;
      const ry = h * 0.55;

      // Rocket body geometry
      ctx.beginPath();
      // Nose cone
      ctx.moveTo(rx, ry - 60);
      ctx.lineTo(rx - 15, ry - 30);
      ctx.lineTo(rx + 15, ry - 30);
      ctx.closePath();
      ctx.stroke();

      // Core tank cylinder
      ctx.strokeRect(rx - 15, ry - 30, 30, 70);

      // Side truster fins
      ctx.beginPath();
      ctx.moveTo(rx - 15, ry + 20);
      ctx.lineTo(rx - 30, ry + 50);
      ctx.lineTo(rx - 15, ry + 40);
      ctx.moveTo(rx + 15, ry + 20);
      ctx.lineTo(rx + 30, ry + 50);
      ctx.lineTo(rx + 15, ry + 40);
      ctx.stroke();

      // Draw target launch deck vector platform
      if (rocketAlt < 10) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.beginPath();
        ctx.moveTo(rx - 80, ry + 42);
        ctx.lineTo(rx + 80, ry + 42);
        ctx.stroke();
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fillRect(rx - 50, ry + 42, 100, 4);
      }

      // Orbital flight telemetry drawing (Trajectory curve)
      ctx.strokeStyle = '#22c55e';
      ctx.setLineDash([2, 5]);
      ctx.beginPath();
      ctx.moveTo(25, h - 30);
      ctx.quadraticCurveTo(w / 2, h - 180, w - 25, 60);
      ctx.stroke();
      ctx.setLineDash([]);

      // Flight tracker dots on orbit line
      const progressRatio = Math.min(1, rocketAlt / 25000);
      const dotX = 25 + progressRatio * (w - 50);
      const dotY = h - 30 - Math.min(100, progressRatio * 150);
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.arc(dotX, dotY, 5, 0, Math.PI * 2);
      ctx.fill();

      animId = requestAnimationFrame(drawRocketSimulation);
    };

    drawRocketSimulation();
    return () => cancelAnimationFrame(animId);
  }, [isOpen, activeTab, rocketAlt, rocketVel, rocketStage]);

  // Rocket countdown countdown logic triggering launch
  useEffect(() => {
    if (countdown === null) return;
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
        triggerClickSound();
        setRocketLogs(logs => [
          `[COUNTDOWN] T-MINUS ${countdown - 1} SECONDS // ALL VALVES CHARGING`,
          ...logs
        ]);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Countdown complete - Launching!
      setCountdown(null);
      setRocketStage('BOOSTERS_FIRED');
      audioEngine.playSpace();
      setRocketLogs(logs => [
        `[SUCCESS ALERT] SOLID PROPULSION IGNITION INITIATED. LIFT-OFF DETECTED! ESCAPING ATMOSPHERE SYSTEM NOW.`,
        ...logs
      ]);
    }
  }, [countdown]);

  // Flight updates tick tracker
  useEffect(() => {
    if (rocketStage !== 'BOOSTERS_FIRED' && rocketStage !== 'STAGE_DECOUPLED' && rocketStage !== 'ORBITAL_STABLE') return;
    
    const interval = setInterval(() => {
      setRocketAlt(alt => {
        const nextAlt = alt + Math.floor(rocketVel / 600) + 2;
        if (nextAlt > 24000 && rocketStage === 'BOOSTERS_FIRED') {
          setRocketStage('STAGE_DECOUPLED');
          setRocketLogs(logs => [
            `[FLIGHT CONTROL INFO] SOLID FUEL CONTAINER EXHAUSTED. DECOUPLING BOOSTERS DECK #1. FIRING SECONDARY MERIDIAN ION DECK.`,
            ...logs
          ]);
        }
        if (nextAlt > 85000 && rocketStage === 'STAGE_DECOUPLED') {
          setRocketStage('ORBITAL_STABLE');
          setRocketVel(27500); // Stable low earth orbit speed
          setRocketLogs(logs => [
            `[TELEMETRY CORE] ROCKET CAPTURED IN STABLE POST-QUANTUM MERIDIAN LOW EARTH GEOSYNC ORBIT // SYSTEMS NOMINAL`,
            ...logs
          ]);
        }
        return nextAlt;
      });

      setRocketVel(vel => {
        if (rocketStage === 'ORBITAL_STABLE') return 27500;
        const nextVel = vel + Math.floor(Math.random() * 250) + 120;
        return nextVel;
      });

      setRocketFuel(f => Math.max(0, f - 1.2));
    }, 400);

    return () => clearInterval(interval);
  }, [rocketStage, rocketVel]);

  const initiateRocketLaunch = () => {
    triggerSpaceSound();
    setCountdown(5);
    setRocketStage('COUNTDOWN');
    setRocketAlt(0);
    setRocketVel(0);
    setRocketFuel(100);
    setRocketLogs([
      `[MAIN SEQUENCE] Initiating automated launch sequencing protocol T-1050-Giga`,
      `[MAIN SEQUENCE] Launch deck sensors aligned to escape trajectories. CODES OK.`
    ]);
  };

  const abortRocketLaunch = () => {
    triggerQuantumSound();
    setCountdown(null);
    setRocketStage('DOCK');
    setRocketAlt(0);
    setRocketVel(0);
    setRocketLogs(logs => [
      `[🚨 CRITICAL INTERRUPT] EMERGENCY INJECTION ABORT SEQUENCE EXECUTED by commander manually. VENTING PROPELLANT SAFELY.`,
      ...logs
    ]);
  };


  // 5. Mars Colony metrics
  const modulateMarsGrid = (sector: 'biosphere' | 'solar' | 'reactor' | 'hub') => {
    triggerClickSound();
    setSelectedMarsSector(sector);
    
    switch (sector) {
      case 'biosphere':
        setOxygenLevel(prev => Math.min(100, Math.max(70, prev + (Math.random() * 4 - 2))));
        break;
      case 'solar':
        setPowerGrid(prev => Math.min(100, Math.max(30, prev + (Math.random() * 10 - 5))));
        break;
      case 'reactor':
        setReactorFlux(prev => Math.min(100, Math.max(10, prev + (Math.random() * 14 - 7))));
        break;
    }
  };

  const executeColonyAction = (action: string) => {
    triggerClickSound();
    if (action === 'overload_reactor') {
      triggerQuantumSound();
      setReactorState('OVERLOAD');
      setReactorFlux(94);
      setPowerGrid(100);
      alert('WARNING: Deuterium Core grid modulated beyond recommended ratings! Unstable quantum field forming.');
    } else if (action === 'stabilize') {
      triggerRobotSound();
      setReactorState('STABLE');
      setReactorFlux(58);
      setOxygenLevel(99.1);
      setPowerGrid(82);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 bg-[#020204]/96 z-50 flex items-center justify-center p-3 select-none">
      <div className="w-full max-w-5xl h-[88vh] border border-[#00f5ff]/25 bg-black/95 relative flex flex-col overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.85)]">
        
        {/* Scanned Neon line top effect */}
        <div className="absolute inset-x-0 h-[2px] bg-[#00f5ff] top-0 anim-laser-sweep pointer-events-none"></div>

        {/* MODAL HEADER BLOCK */}
        <div className="border-b border-slate-850 p-4 flex justify-between items-center bg-black/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-none border border-[#00f5ff]/30 flex items-center justify-center bg-black/40">
              <Compass className="text-[#00f5ff] animate-spin" size={16} />
            </div>
            <div>
              <span className="text-[9px] font-mono text-[#f43f5e] tracking-widest font-black block uppercase leading-none">
                SIMULATION_LAB // METAVERSE_ACCESS
              </span>
              <h1 className="text-lg md:text-xl font-display font-black tracking-wider text-white">
                3D INTERACTIVE WORKSPACE
              </h1>
            </div>
          </div>

          <button
            onClick={() => { triggerClickSound(); onClose(); }}
            className="px-4 py-2 border border-[#00f5ff]/25 text-[#00f5ff] hover:text-white hover:border-[#00f5ff] font-mono text-[10.5px] tracking-wider uppercase flex items-center gap-2 cursor-pointer transition-colors"
          >
            Exit Workspace <X size={14} />
          </button>
        </div>

        {/* COMPREHENSIVE ZONE SELECTOR HORIZONTAL MENUS */}
        <div className="flex border-b border-slate-850 bg-black/20 overflow-x-auto scrollbar-none whitespace-nowrap">
          
          <button
            onClick={() => { triggerClickSound(); setActiveTab('drone'); }}
            className={`flex-1 min-w-[120px] py-3.5 px-4 font-display text-xs font-black uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2.5 border-r border-slate-850 ${
              activeTab === 'drone' ? 'bg-[#00f5ff]/10 text-[#00f5ff] border-b-2 border-b-[#00f5ff]' : 'text-slate-450 hover:text-slate-100 hover:bg-white/5'
            }`}
          >
            <Radio size={14} className={activeTab === 'drone' ? 'text-[#00f5ff] animate-pulse' : 'text-slate-500'} />
            AERIAL DRONE SIM
          </button>

          <button
            onClick={() => { triggerClickSound(); setActiveTab('robot'); }}
            className={`flex-1 min-w-[120px] py-3.5 px-4 font-display text-xs font-black uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2.5 border-r border-slate-850 ${
              activeTab === 'robot' ? 'bg-[#00f5ff]/10 text-[#00f5ff] border-b-2 border-b-[#00f5ff]' : 'text-slate-450 hover:text-slate-100 hover:bg-white/5'
            }`}
          >
            <Cpu size={14} className={activeTab === 'robot' ? 'text-[#00f5ff] animate-spin' : 'text-slate-500'} />
            ROBOT ASSEMBLY
          </button>

          <button
            onClick={() => { triggerClickSound(); setActiveTab('rocket'); }}
            className={`flex-1 min-w-[120px] py-3.5 px-4 font-display text-xs font-black uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2.5 border-r border-slate-850 ${
              activeTab === 'rocket' ? 'bg-[#00f5ff]/10 text-[#00f5ff] border-b-2 border-b-[#00f5ff]' : 'text-slate-450 hover:text-slate-100 hover:bg-white/5'
            }`}
          >
            <Sparkles size={14} className={activeTab === 'rocket' ? 'text-[#00f5ff] animate-bounce' : 'text-slate-500'} />
            ROCKET COCKPIT
          </button>

          <button
            onClick={() => { triggerClickSound(); setActiveTab('mars'); }}
            className={`flex-1 min-w-[120px] py-3.5 px-4 font-display text-xs font-black uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2.5 ${
              activeTab === 'mars' ? 'bg-[#00f5ff]/10 text-[#00f5ff] border-b-2 border-b-[#00f5ff]' : 'text-slate-450 hover:text-slate-100 hover:bg-white/5'
            }`}
          >
            <Settings size={14} className={activeTab === 'mars' ? 'text-[#00f5ff] animate-pulse' : 'text-slate-500'} />
            MARS BASE MAP
          </button>

        </div>

        {/* WORKSPACE DETAILED LAYOUT CORES */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#030307]">
          
          {/* ==========================================
              SUB-LAB 1: AERIAL UAV DRONE FLIGHT DECK
             ========================================== */}
          {activeTab === 'drone' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-full min-h-[380px]">
              
              {/* Drone visual telemetry feedback display */}
              <div className="lg:col-span-8 flex flex-col border border-slate-800 bg-black/60 relative">
                <canvas 
                  ref={droneCanvasRef}
                  width={600}
                  height={320}
                  className="w-full flex-1 min-h-[220px] bg-[#020205] block cursor-crosshair"
                />
                
                {/* HUD warning footer line overlay */}
                <div className="absolute top-4 left-4 bg-black/60 border border-[#00f5ff]/30 px-3 py-1 font-mono text-[9px] text-[#00f5ff] tracking-wide uppercase">
                  FEED: ENG_CONN // FPS_STABLE // SPEED: {droneSpeed} KT
                </div>

                <div className="absolute top-4 right-4 bg-black/80 border border-red-500/30 px-3 py-1 font-mono text-[9px] text-[#f43f5e] tracking-wide uppercase animate-pulse">
                  {droneLaserActive ? 'LASER CHARGING: ON' : 'ION_GUN: ARMED'}
                </div>
              </div>

              {/* Drone Controller hardware dials */}
              <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
                
                <div className="border border-slate-800 bg-black/40 p-4 space-y-3">
                  <span className="font-mono text-[9.5px] text-[#00f5ff] font-bold uppercase tracking-widest block">
                    UAV FLIGHT CONTROLS
                  </span>
                  
                  {/* Controller key layout buttons */}
                  <div className="flex flex-col items-center gap-2">
                    <button 
                      onClick={() => handleDroneMovement('up')}
                      className="px-4 py-2 border border-slate-700 bg-black/50 hover:border-[#00f5ff] text-white hover:text-[#00f5ff] transition-all cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <ArrowUp size={14} /> UP (ALTITUDE)
                    </button>

                    <div className="flex gap-2 w-full justify-center">
                      <button 
                        onClick={() => handleDroneMovement('left')}
                        className="px-4 py-2 border border-slate-700 bg-black/50 hover:border-[#00f5ff] text-white hover:text-[#00f5ff] transition-all cursor-pointer inline-flex items-center gap-1"
                      >
                        <ArrowLeft size={14} /> LEFT
                      </button>
                      <button 
                        onClick={() => handleDroneMovement('forward')}
                        className="px-4 py-2 border border-slate-700 bg-black/50 hover:border-[#00f5ff] text-white hover:text-[#00f5ff] transition-all cursor-pointer inline-flex items-center gap-1"
                      >
                        FWD
                      </button>
                      <button 
                        onClick={() => handleDroneMovement('right')}
                        className="px-4 py-2 border border-slate-700 bg-black/50 hover:border-[#00f5ff] text-white hover:text-[#00f5ff] transition-all cursor-pointer inline-flex items-center gap-1"
                      >
                        RIGHT <ArrowRight size={14} />
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleDroneMovement('down')}
                        className="px-4 py-2 border border-slate-700 bg-black/50 hover:border-[#00f5ff] text-white hover:text-[#00f5ff] transition-all cursor-pointer inline-flex items-center gap-1"
                      >
                        <ArrowDown size={14} /> DOWN
                      </button>
                      <button 
                        onClick={() => handleDroneMovement('backward')}
                        className="px-4 py-2 border border-slate-700 bg-black/50 hover:border-[#00f5ff] text-white hover:text-[#00f5ff] transition-all cursor-pointer inline-flex items-center gap-1"
                      >
                        BACK
                      </button>
                    </div>

                  </div>

                  {/* Plasma Action trigger trigger */}
                  <div className="pt-2 border-t border-slate-800">
                    <button
                      onClick={handleFireDroneLaser}
                      className="w-full py-2.5 bg-[#f43f5e] hover:bg-white text-black font-display font-bold text-xs uppercase tracking-widest transition-colors cursor-pointer text-center block shadow-[0_0_15px_rgba(244,63,94,0.3)]"
                    >
                      FIRE PLASMA INTENSITY GUN
                    </button>
                  </div>
                </div>

                {/* Live Console system streams output */}
                <div className="border border-slate-800 bg-black/80 p-4 font-mono text-[9px] text-[#00f5ff]/70 flex-1 overflow-y-auto space-y-1">
                  <span className="text-[#f43f5e] font-bold block mb-1">REAL-TIME UAV METRIC SYSTEMS OUT:</span>
                  {droneLogs.map((log, idx) => (
                    <div key={idx} className="truncate select-text leading-tight">{log}</div>
                  ))}
                </div>

              </div>

            </div>
          )}

          {/* ==========================================
              SUB-LAB 2: MECHATRONIC ROBOT ARM ROTATOR
             ========================================== */}
          {activeTab === 'robot' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-full min-h-[380px]">
              
              {/* Graphic Joint Articulator View */}
              <div className="lg:col-span-7 border border-slate-800 bg-slate-950/20 p-5 flex flex-col justify-center items-center relative">
                
                {/* SVG Visualizer Representation of Robot Segment Arm */}
                <div className="relative w-full h-[220px] flex justify-center items-center">
                  <svg viewBox="0 0 200 160" className="w-[85%] h-full">
                    {/* Grid patterns background */}
                    <defs>
                      <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(0,245,255,0.03)" strokeWidth="1"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)"/>

                    {/* Platform Base of Robot segment */}
                    <rect x="70" y="130" width="60" height="14" fill="#022a33" stroke="rgba(0, 245, 255, 0.4)" strokeWidth="1.5" />
                    <circle cx="100" cy="130" r="10" fill="#034d5d" />

                    {/* Lower Arm segment - Rotated by jointYaw */}
                    <g transform={`rotate(${jointYaw}, 100, 130)`}>
                      <line x1="100" y1="130" x2="100" y2="70" stroke="#00f5ff" strokeWidth="6" strokeLinecap="round" className="shadow-[0_0_10px_#00f5ff]" />
                      <circle cx="100" cy="70" r="8" fill="#f43f5e" />

                      {/* Upper arm segment - Rotated further at pivot Joint Joint 2 (Pitch) */}
                      <g transform={`translate(100, 70) rotate(${jointPitch}, 0, 0)`}>
                        <line x1="0" y1="0" x2="60" y2="0" stroke="#a855f7" strokeWidth="4" strokeLinecap="round" />
                        <circle cx="60" cy="0" r="5" fill="#eab308" />

                        {/* End Effector Claw gripper - Rotated with jointRoll */}
                        <g transform={`translate(60, 0) rotate(${jointRoll}, 0, 0)`}>
                          {/* Gripper jaws */}
                          <path d="M 0 -6 L 10 -12 L 14 -12 M 0 6 L 10 12 L 14 12" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" />
                          <line x1="0" y1="-8" x2="0" y2="8" stroke="#f43f5e" strokeWidth="1.5" />
                        </g>
                      </g>
                    </g>
                  </svg>
                  
                  {/* Overheating overlay box */}
                  {robotStatus === 'OVERHEAT' && (
                    <div className="absolute inset-0 bg-red-950/80 flex flex-col justify-center items-center text-center p-3 animate-[fade-in_0.3s_ease]">
                      <span className="text-[#f43f5e] font-mono text-2xl font-black block tracking-widest uppercase blink mb-1">OVERHEAT CRITICAL</span>
                      <span className="text-xs text-slate-300 font-mono">Thermals hit {robotTemp}°C limit. Re-engage cooling sub-modules manually.</span>
                      <button 
                        onClick={resetCalibration}
                        className="mt-3 px-5 py-2 bg-white text-black font-mono text-xs font-black uppercase tracking-wider"
                      >
                        Reset Cooling Grid
                      </button>
                    </div>
                  )}
                </div>

                <div className="w-full grid grid-cols-3 gap-2 font-mono text-[9px] text-slate-500 text-center border-t border-slate-900 pt-3 mt-3">
                  <div>YAW: <span className="text-[#00f5ff] font-bold">{jointYaw}°</span></div>
                  <div>PITCH: <span className="text-[#a855f7] font-bold">{jointPitch}°</span></div>
                  <div>ROLL: <span className="text-[#eab308] font-bold">{jointRoll}°</span></div>
                </div>

              </div>

              {/* Slider Inputs & Stress Testing dials */}
              <div className="lg:col-span-5 flex flex-col space-y-4">
                
                {/* Joints Slider Controls */}
                <div className="border border-slate-800 bg-black/40 p-4 space-y-3.5">
                  <span className="font-mono text-[9.5px] text-[#00f5ff] font-bold uppercase tracking-widest block">
                    SERVO ANGLE CONTROLLERS
                  </span>

                  {/* Slider 1: Yaw */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-400">Joint 1: Base Yaw Rotation</span>
                      <span className="text-[#00f5ff] font-bold">{jointYaw}°</span>
                    </div>
                    <input 
                      type="range"
                      min="-90"
                      max="90"
                      value={jointYaw}
                      onChange={(e) => { 
                        if (robotStatus === 'OVERHEAT') return;
                        setJointYaw(parseInt(e.target.value)); 
                        setRobotStatus('MOVE'); 
                        audioEngine.playHover();
                      }}
                      className="w-full accent-[#00f5ff] h-1.5 bg-slate-800 rounded"
                    />
                  </div>

                  {/* Slider 2: Pitch */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-400">Joint 2: Upper Elbow Pitch</span>
                      <span className="text-[#a855f7] font-bold">{jointPitch}°</span>
                    </div>
                    <input 
                      type="range"
                      min="-90"
                      max="45"
                      value={jointPitch}
                      onChange={(e) => {
                        if (robotStatus === 'OVERHEAT') return;
                        setJointPitch(parseInt(e.target.value));
                        setRobotStatus('MOVE');
                        audioEngine.playHover();
                      }}
                      className="w-full accent-[#a855f7] h-1.5 bg-slate-800 rounded"
                    />
                  </div>

                  {/* Slider 3: Roll */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-400">Joint 3: Claws Roll Rotation</span>
                      <span className="text-[#eab308] font-bold">{jointRoll}°</span>
                    </div>
                    <input 
                      type="range"
                      min="-180"
                      max="180"
                      value={jointRoll}
                      onChange={(e) => {
                        if (robotStatus === 'OVERHEAT') return;
                        setJointRoll(parseInt(e.target.value));
                        setRobotStatus('MOVE');
                        audioEngine.playHover();
                      }}
                      className="w-full accent-[#eab308] h-1.5 bg-slate-800 rounded"
                    />
                  </div>

                  {/* Multi buttons operations */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button
                      onClick={runStressTest}
                      disabled={isStressTesting || robotStatus === 'OVERHEAT'}
                      className="py-2.5 border border-[#f43f5e]/30 bg-black/40 hover:border-[#f43f5e] hover:text-[#f43f5e] text-white transition-colors font-mono text-[10px] uppercase cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
                    >
                      Torque Stress Test
                    </button>
                    <button
                      onClick={resetCalibration}
                      className="py-2.5 border border-slate-700 bg-black/40 hover:border-slate-500 hover:text-white text-[#00f5ff] transition-colors font-mono text-[10px] uppercase cursor-pointer"
                    >
                      Reset Calibration
                    </button>
                  </div>

                </div>

                {/* Thermodynamics & Torque display gages */}
                <div className="grid grid-cols-2 gap-3 font-mono text-center">
                  <div className="p-3 border border-slate-800 bg-black/40 flex flex-col justify-center items-center">
                    <span className="text-slate-500 text-[9px] block">FLUID PRESSURE STRESS</span>
                    <span className={`text-xl font-black mt-1 ${robotStress > 70 ? 'text-[#f43f5e] blink' : 'text-white'}`}>{robotStress}%</span>
                  </div>
                  <div className="p-3 border border-slate-800 bg-black/40 flex flex-col justify-center items-center">
                    <span className="text-slate-500 text-[9px] block">JOINTS TEMPERATURE</span>
                    <span className={`text-xl font-black mt-1 ${robotTemp > 75 ? 'text-[#f43f5e] blink' : 'text-white'}`}>{robotTemp}°C</span>
                  </div>
                </div>

                {/* Robotic operations logs block */}
                <div className="border border-slate-800 bg-black/80 font-mono text-[8.5px] p-3 text-slate-400 h-[100px] overflow-y-auto space-y-1">
                  <span className="text-slate-500 block uppercase font-bold">MECH_STREAM_OUT // STATUS: {robotStatus}</span>
                  {robotLogs.map((log, index) => (
                    <div key={index} className="leading-snug truncate text-xs font-sans text-slate-300">• {log}</div>
                  ))}
                </div>

              </div>

            </div>
          )}

          {/* ==========================================
              SUB-LAB 3: SPACE EXPLORATION ROCKET COCKPIT
             ========================================== */}
          {activeTab === 'rocket' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-full min-h-[380px]">
              
              {/* Rocket Flight visual simulation */}
              <div className="lg:col-span-7 flex flex-col border border-slate-800 bg-[#020205]/80 relative rounded-none overflow-hidden h-[330px]">
                <canvas 
                  ref={rocketCanvasRef}
                  width={520}
                  height={330}
                  className="w-full h-full block"
                />

                {/* Dynamic flight alerts overlays inside cockpit */}
                {rocketStage === 'COUNTDOWN' && (
                  <div className="absolute inset-0 bg-black/85 flex flex-col justify-center items-center text-center p-4">
                    <span className="text-red-500 font-mono text-6xl font-black block tracking-widest scale-105 transition-transform animate-ping mb-2">T-{countdown}</span>
                    <p className="text-xs text-slate-400 font-mono uppercase tracking-widest">PROPULSION CORES ALIGNING // AUTOFAMILIARIATION MATRIX ACTIVE</p>
                  </div>
                )}

                {rocketStage === 'ORBITAL_STABLE' && (
                  <div className="absolute top-4 left-4 bg-green-950/80 border border-green-500/50 px-3 py-1 font-mono text-[10px] text-[#22c55e] uppercase tracking-wide flex items-center gap-1.5 animate-pulse">
                    <Shield size={12} fill="currentColor" /> LOW EARTH ORBIT STABILIZATION ASSIGNED
                  </div>
                )}

                {/* Altitude indicators block */}
                <div className="absolute bottom-4 left-4 bg-black/80 border border-[#00f5ff]/35 px-3 py-1 font-mono text-[9px] text-[#00f5ff] uppercase tracking-wider">
                  ALTITUDE: {rocketAlt.toLocaleString()} KM // VELOCITY: {rocketVel.toLocaleString()} KM/H
                </div>
              </div>

              {/* Launcher Cockpit hardware console triggers */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                
                <div className="border border-slate-800 bg-black/40 p-4 space-y-3.5">
                  <span className="font-mono text-[9.5px] text-[#00f5ff] font-bold uppercase tracking-widest block">
                    ROCKET CRITICAL FLIGHT DECK
                  </span>

                  <p className="text-xs text-slate-400 leading-snug">
                    Coordinate the orbital ascent trajectory curves on our post-quantum launch grid. Watch escape metrics.
                  </p>

                  <div className="space-y-1 pt-1.5">
                    <div className="flex justify-between font-mono text-[10px]">
                      <span className="text-slate-400">REMAINING ESCAPE PROPULSIVE FUEL:</span>
                      <span className={rocketFuel < 25 ? 'text-red-500 font-bold animate-pulse' : 'text-white'}>{rocketFuel.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-slate-850 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${rocketFuel < 25 ? 'bg-red-500' : 'bg-orange-500'}`}
                        style={{ width: `${rocketFuel}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    {rocketStage === 'DOCK' ? (
                      <button
                        onClick={initiateRocketLaunch}
                        className="col-span-2 py-3 bg-[#00f5ff] text-black font-display font-black text-xs uppercase tracking-widest transition-transform hover:scale-[1.02] cursor-pointer text-center"
                      >
                        FIRE ESCAPE CORES SEQUENCE
                      </button>
                    ) : (
                      <button
                        onClick={abortRocketLaunch}
                        className="col-span-2 py-3 bg-red-650 hover:bg-red-500 text-white font-display font-black text-xs uppercase tracking-widest transition-colors cursor-pointer text-center"
                      >
                        🚨 EMERGENCY ABORT SYSTEM
                      </button>
                    )}
                  </div>
                </div>

                {/* Live stream timeline readouts of launcher metrics */}
                <div className="border border-slate-800 bg-black/80 font-mono text-[8px] p-3 text-[#00f5ff]/70 h-[105px] overflow-y-auto space-y-1">
                  <span className="text-[#f43f5e] font-bold block uppercase tracking-wider">FLIGHT ENGINE LOGGER:</span>
                  {rocketLogs.map((log, index) => (
                    <div key={index} className="leading-snug truncate text-slate-300">• {log}</div>
                  ))}
                </div>

              </div>

            </div>
          )}

          {/* ==========================================
              SUB-LAB 4: MARS EXPLORATION COLONY BLUEPRINTS
             ========================================== */}
          {activeTab === 'mars' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-full min-h-[380px]">
              
              {/* Grid bento layout blueprints of sections */}
              <div className="lg:col-span-7 grid grid-cols-2 gap-3 h-[320px]">
                
                {/* Sector A: Biosphere */}
                <div 
                  onClick={() => modulateMarsGrid('biosphere')}
                  className={`border p-4 flex flex-col justify-between cursor-pointer transition-all ${
                    selectedMarsSector === 'biosphere' 
                      ? 'border-[#00f5ff] bg-[#00f5ff]/5' 
                      : 'border-slate-800 hover:border-slate-500 bg-black/40'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-[9px] text-[#00f5ff] font-bold">SEC-ALPHA</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-ping" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-sm text-white">BIO-DOME CHAMBER</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">Maintains oxygen extraction systems.</p>
                  </div>
                </div>

                {/* Sector B: Solar Panels */}
                <div 
                  onClick={() => modulateMarsGrid('solar')}
                  className={`border p-4 flex flex-col justify-between cursor-pointer transition-all ${
                    selectedMarsSector === 'solar' 
                      ? 'border-[#eab308] bg-[#eab308]/5' 
                      : 'border-slate-800 hover:border-slate-500 bg-black/40'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-[9px] text-[#eab308] font-bold">SEC-BETA</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-sm text-white">SOLAR MATRIX FIELD</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">Captures light through diamond concentrators.</p>
                  </div>
                </div>

                {/* Sector C: Reactor */}
                <div 
                  onClick={() => modulateMarsGrid('reactor')}
                  className={`border p-4 flex flex-col justify-between cursor-pointer transition-all ${
                    selectedMarsSector === 'reactor' 
                      ? 'border-[#a855f7] bg-[#a855f7]/5' 
                      : 'border-slate-800 hover:border-slate-500 bg-black/40'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-[9px] text-[#a855f7] font-bold">SEC-GAMMA</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-sm text-white">DEUTERIUM CRITICAL REACTOR</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">Nuclear-fusion thermal power reserves.</p>
                  </div>
                </div>

                {/* Sector D: Holographic Hub */}
                <div 
                  onClick={() => modulateMarsGrid('hub')}
                  className={`border p-4 flex flex-col justify-between cursor-pointer transition-all ${
                    selectedMarsSector === 'hub' 
                      ? 'border-[#f43f5e] bg-[#f43f5e]/5' 
                      : 'border-slate-800 hover:border-slate-500 bg-black/40'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-[9px] text-[#f43f5e] font-bold">SEC-ZETA</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-sm text-white">QUANTUM TRANSIT HUB</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">Teleportation and mainframe portals linkage.</p>
                  </div>
                </div>

              </div>

              {/* Exploration specifications display parameters */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                
                <div className="border border-slate-800 bg-black/45 p-4 space-y-4">
                  <span className="font-mono text-[9.5px] text-[#00f5ff] font-bold uppercase tracking-widest block">
                    COLONY REGULATION INTERFACE
                  </span>

                  {/* Active Sector specification readout card */}
                  <div className="bg-black/40 p-3 border border-slate-850 font-mono text-[11px] space-y-2">
                    <span className="text-[#f43f5e] uppercase text-[9px] font-bold block">SELECTED GRID COORDINATES: {selectedMarsSector.toUpperCase()}</span>
                    
                    <div className="flex justify-between py-1 border-b border-slate-900">
                      <span>CHAMBER OXYGEN STABILIZATION:</span>
                      <span className="text-white font-bold">{oxygenLevel.toFixed(1)}%</span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-slate-900">
                      <span>POWER RESERVES CAPACITY:</span>
                      <span className="text-white font-bold">{powerGrid}%</span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-slate-900">
                      <span>REACTOR FLUX DECRYPTION:</span>
                      <span className={`font-bold ${reactorState === 'OVERLOAD' ? 'text-red-500 animate-pulse' : 'text-[#a855f7]'}`}>{reactorFlux} GigaFlux</span>
                    </div>

                    <div className="flex justify-between py-1">
                      <span>STABILITY STATE SUMMARY:</span>
                      <span className={`font-bold uppercase ${reactorState === 'OVERLOAD' ? 'text-red-500 animate-pulse' : 'text-[#10b981]'}`}>{reactorState}</span>
                    </div>
                  </div>

                  {/* Operational triggers */}
                  <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[10px]">
                    <button
                      onClick={() => executeColonyAction('overload_reactor')}
                      disabled={reactorState === 'OVERLOAD'}
                      className="py-2 px-3 bg-red-650 hover:bg-red-500 text-white font-bold uppercase text-center cursor-pointer transition-colors disabled:opacity-30 disabled:pointer-events-none"
                    >
                      Overload Deuterium
                    </button>
                    <button
                      onClick={() => executeColonyAction('stabilize')}
                      className="py-2 px-3 border border-slate-700 bg-black/40 text-[#10b981] hover:border-[#10b981] font-bold uppercase text-center cursor-pointer transition-colors"
                    >
                      Stabilize Colony Grid
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-black/50 border border-slate-850 text-[10px] text-slate-400 leading-relaxed font-sans font-light">
                  <span className="font-mono text-[9px] text-[#00f5ff] font-bold uppercase block mb-1">DOCKING SYSTEMS:</span>
                  Modulate core lifesupport coordinates inside sector cards to test structural margins of the Martian dome base. Keep power active above 35%.
                </div>

              </div>

            </div>
          )}

        </div>

        {/* BOTTOM METRIC RAIL FOOTER */}
        <div className="border-t border-slate-850 p-3 bg-black/40 flex justify-between items-center font-mono text-[9px] text-slate-500">
          <span>PORTAL_CONNECT: FULL_LATENCY // 14.05 GigaSwap</span>
          <span>CRAFTED FOR IIT BOMBAY METAVERSE DEPT</span>
        </div>

      </div>
    </div>
  );
}
