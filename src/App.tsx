/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Shield, 
  Play, 
  ArrowRight, 
  ArrowUp, 
  ArrowDown, 
  Activity, 
  Radio, 
  Cpu, 
  RotateCcw, 
  Network, 
  Award, 
  Compass, 
  Disc, 
  X, 
  Terminal, 
  HelpCircle,
  Clock,
  Sparkles,
  Zap,
  CheckCircle,
  ChevronRight,
  Database
} from 'lucide-react';

import { SectionId, InteractiveItem, TechfestEvent } from './types';
import { EVENTS_DATA, ROBOTS_DATA, HOTSPOTS_DATA, SPACE_OBJECTS_DATA, QUANTUM_NODES_DATA, SPONSORS_DATA } from './data';
import { audioEngine } from './components/AudioEngine';
import Techfest3DEngine from './components/Techfest3DEngine';
import TechfestInteractiveLab from './components/TechfestInteractiveLab';
import TechfestTimeline from './components/TechfestTimeline';
import TechfestFuturisticStats from './components/TechfestFuturisticStats';
import TechfestTrailerModal from './components/TechfestTrailerModal';
import TechfestPassesModal from './components/TechfestPassesModal';
import TechfestCommunityPortal from './components/TechfestCommunityPortal';
import TechfestMerchStore from './components/TechfestMerchStore';

const SECTIONS_IDS: SectionId[] = ['gateway', 'aicity', 'robotics', 'space', 'quantum', 'events', 'finale'];

const SECTIONS_METADATA = [
  { id: 'gateway', title: 'Future Gateway', sub: 'Dimensional Terminal' },
  { id: 'aicity', title: 'AI Neon City', sub: 'Cybernetic Sector' },
  { id: 'robotics', title: 'Robotics Assembly', sub: 'Mechatronic Fab' },
  { id: 'space', title: 'Space Frontier', sub: 'Planetary Colonies' },
  { id: 'quantum', title: 'Quantum Core', sub: 'Neural Mesh Web' },
  { id: 'events', title: 'Events Portfolio', sub: 'Holographic Arena' },
  { id: 'finale', title: 'Grand Finale', sub: 'Infinite Spectacle' },
];

export default function App() {
  const [introActive, setIntroActive] = useState<boolean>(true);
  const [activeSection, setActiveSection] = useState<SectionId>('gateway');
  const [scrollProgress, setScrollProgress] = useState<number>(0.1);
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  
  // Audio state
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [audioWaves, setAudioWaves] = useState<number[]>([15, 30, 10, 25, 12, 28, 8, 16]);

  // Selected item modal state
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  // Events Hub UI states
  const [showEventsModal, setShowEventsModal] = useState<boolean>(false);
  const [activeEventCategory, setActiveEventCategory] = useState<string>('All');
  const [selectedEvent, setSelectedEvent] = useState<TechfestEvent | null>(null);

  // Drone choreography states inside Grand Finale
  const [droneFormation, setDroneFormation] = useState<string>('Orbits');

  // Custom simulation modals states
  const [showTimelineModal, setShowTimelineModal] = useState<boolean>(false);
  const [showLabModal, setShowLabModal] = useState<boolean>(false);
  const [labInitialTab, setLabInitialTab] = useState<'drone' | 'robot' | 'rocket' | 'mars'>('drone');

  // Interactive features modals states
  const [showTrailerModal, setShowTrailerModal] = useState<boolean>(false);
  const [showPassesModal, setShowPassesModal] = useState<boolean>(false);
  const [showCommunityModal, setShowCommunityModal] = useState<boolean>(false);
  const [showMerchModal, setShowMerchModal] = useState<boolean>(false);
  const [bookmarkedEvents, setBookmarkedEvents] = useState<string[]>(['mesh_synapse']);

  // Secret Easter Egg states
  const [secretPortalActive, setSecretPortalActive] = useState<boolean>(false);
  const [konamiSequence, setKonamiSequence] = useState<string[]>([]);
  const [mumbaiClockClicks, setMumbaiClockClicks] = useState<number>(0);

  // Sync clock time (Bombay context)
  const [mumbaiTime, setMumbaiTime] = useState<string>('');

  // Auto modulate audio visualizer nodes in UI when not muted
  useEffect(() => {
    let interval: any;
    if (!isMuted) {
      interval = setInterval(() => {
        setAudioWaves(prev => prev.map(() => 8 + Math.floor(Math.random() * 28)));
      }, 100);
    } else {
      setAudioWaves([2, 2, 2, 2, 2, 2, 2, 2]);
    }
    return () => clearInterval(interval);
  }, [isMuted]);

  // Real-time Mumbai Time simulation
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Adjust to IST (+5:30)
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const istTime = new Date(utc + (3600000 * 5.5));
      
      const timeStr = istTime.toLocaleTimeString('en-US', {
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit', 
        hour12: false
      });
      setMumbaiTime(timeStr);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Konami Code sequence detector hook
  useEffect(() => {
    const expected = [
      'arrowup', 'arrowup', 
      'arrowdown', 'arrowdown', 
      'arrowleft', 'arrowright', 
      'arrowleft', 'arrowright', 
      'b', 'a'
    ];

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      setKonamiSequence(prev => {
        const next = [...prev, key].slice(-10);
        const isMatch = next.length === 10 && expected.every((val, idx) => next[idx] === val);
        if (isMatch) {
          audioEngine.playQuantum();
          setSecretPortalActive(true);
        }
        return next;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Smooth wheel delta handler
  useEffect(() => {
    if (introActive || showEventsModal || selectedItem) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY * 0.0018;
      
      setScrollProgress(prev => {
        let next = prev + delta;
        if (next > 1.0) {
          // Travel forwards to next segment
          setScrollProgress(0.02);
          const currIdx = SECTIONS_IDS.indexOf(activeSection);
          const nextIdx = (currIdx + 1) % SECTIONS_IDS.length;
          setActiveSection(SECTIONS_IDS[nextIdx]);
          audioEngine.playSpace();
          return 0.05;
        } else if (next < 0.0) {
          // Travel backward to previous segment
          setScrollProgress(0.98);
          const currIdx = SECTIONS_IDS.indexOf(activeSection);
          const prevIdx = (currIdx - 1 + SECTIONS_IDS.length) % SECTIONS_IDS.length;
          setActiveSection(SECTIONS_IDS[prevIdx]);
          audioEngine.playSpace();
          return 0.95;
        }
        return next;
      });
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [introActive, activeSection, showEventsModal, selectedItem]);

  const handleMuteBtn = () => {
    const muted = audioEngine.toggleMute();
    setIsMuted(muted);
  };

  const handleActivateSystem = () => {
    setIntroActive(false);
    audioEngine.init();
    audioEngine.toggleMute();
    setIsMuted(false);
    audioEngine.playPortal();
  };

  // Skip dimensions smoothly via HUD navbar clicks
  const navigateToSection = (secId: SectionId) => {
    audioEngine.playPortal();
    setActiveSection(secId);
    setScrollProgress(0.12);
    setSelectedItem(null);
  };

  // Helper selectors
  const sectionIndex = SECTIONS_IDS.indexOf(activeSection);

  // Categories list
  const categories = ['All', 'Robotics', 'AI & ML', 'Coding', 'Aerospace', 'Gaming'];
  const filteredEvents = activeEventCategory === 'All' 
    ? EVENTS_DATA 
    : EVENTS_DATA.filter(ev => ev.category === activeEventCategory);

  return (
    <div className="relative w-full h-full text-[#f8fafc] font-sans antialiased overflow-hidden selection:bg-[#00f5ff]/30">
      
      {/* 3D WEBGL GRAPHICS CONTEXT PORT */}
      <div className="absolute inset-0 w-full h-full bg-[#020205] z-0">
        <Techfest3DEngine
          activeSection={activeSection}
          scrollProgress={scrollProgress}
          hoveredItemId={hoveredItemId}
          setHoveredItemId={setHoveredItemId}
          onItemSelect={(item) => {
            setSelectedItem(item);
            if (item.type) {
              audioEngine.playRobot();
            } else if (item.orbitRadius) {
              audioEngine.playSpace();
            } else {
              audioEngine.playQuantum();
            }
          }}
          isMuted={isMuted}
        />
      </div>

      {/* MATRIX NEON LINES DECORATIONS (Iron Man HUD) */}
      <div className="absolute pointer-events-none top-0 bottom-0 left-0 w-[1px] bg-[#00f5ff]/10 z-10 hidden lg:block"></div>
      <div className="absolute pointer-events-none top-0 bottom-0 right-0 w-[1px] bg-[#00f5ff]/10 z-10 hidden lg:block"></div>
      <div className="absolute pointer-events-none left-0 right-0 top-0 h-[1px] bg-[#00f5ff]/10 z-10 hidden lg:block"></div>

      {/* INTRO LOAD SCREEN OVERLAY */}
      {introActive && (
        <div className="absolute inset-0 z-50 flex flex-col justify-between items-center p-8 bg-[#020204]/95 select-none transition-all duration-700">
          
          {/* TOP TAGS */}
          <div className="w-full max-w-7xl flex justify-between items-center border-b border-[#00f5ff]/10 pb-4 font-mono text-[10px] text-[#00f5ff]/60 tracking-[0.2em] uppercase">
            <span>SYS_LOC: BOMBAY_REG_ION_INDIA</span>
            <span>CHIP_TIME: 2050.12.14</span>
            <span className="text-[#f43f5e] blink">GRID: RED_COGNITION</span>
          </div>

          {/* MAIN MASSIVE PORTAL GATEWAY EMBLEM */}
          <div className="text-center flex flex-col items-center">
            {/* Spinning decorative geometric HUD circular frame */}
            <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center mb-8">
              <div className="absolute inset-0 rounded-full border border-dashed border-[#00f5ff]/30 animate-[spin_50s_linear_infinite]"></div>
              <div className="absolute inset-3 rounded-full border border-[#f43f5e]/20 animate-[spin_25s_linear_infinite_reverse]"></div>
              <div className="absolute inset-8 rounded-full border border-double border-[#00f5ff]/40 animate-[spin_12s_linear_infinite]"></div>
              
              <div className="absolute w-20 h-20 bg-gradient-to-tr from-[#00f5ff] to-[#f43f5e] opacity-15 rounded-full blur-xl"></div>
              
              {/* Central glowing logotype element */}
              <div className="z-10 text-center tracking-widest font-display">
                <span className="text-[28px] md:text-[36px] font-black glow-text-blue block leading-none">TF</span>
                <span className="text-[10px] uppercase font-bold text-[#f43f5e]/90 tracking-[0.4em] block mt-1">2050</span>
              </div>
            </div>

            {/* Voice style text animation */}
            <h1 className="text-4xl md:text-6xl font-black font-display tracking-[0.25em] md:tracking-[0.4em] uppercase text-slate-150 leading-tight mb-4">
              WELCOME TO THE <span className="text-[#00f5ff] glow-text-blue">FUTURE</span>
            </h1>
            
            <p className="font-mono text-xs md:text-sm text-slate-400 max-w-2xl leading-relaxed tracking-wider px-4">
              Step into Techfest IIT Bombay 2050. Prepare to travel through five futuristic dimensions. Complete interactive WebGL simulations crafted on the frontiers of general quantum intelligence.
            </p>
          </div>

          {/* PORTAL SYSTEM TRIGGER ACTIVATOR BUTTON */}
          <div className="flex flex-col items-center gap-4 w-full">
            <button
              id="activate-system-btn"
              onClick={handleActivateSystem}
              className="px-10 py-5 rounded-none font-display font-bold text-sm tracking-[0.25em] uppercase text-[#030307] bg-[#00f5ff] hover:bg-[#fff] transition-all hover:scale-105 duration-300 shadow-[0_0_35px_rgba(0,245,255,0.45)] cursor-pointer relative overflow-hidden group border border-[#00f5ff]"
            >
              <span className="relative z-10 flex items-center gap-3">
                ACTIVATE PORTAL ENGINE <Play size={16} fill="currentColor" />
              </span>
              <div className="absolute inset-0 w-full h-full bg-[#f43f5e] -translate-x-full group-hover:translate-x-0 transition-transform duration-300 z-0"></div>
            </button>

            <span className="font-sans text-[11px] text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping"></span>
              HEADPHONES RECOMMENDED // PRESS TO START AUDIO SYNTHESIZER
            </span>
            
            {/* Decentered IIT disclaimer tag */}
            <span className="text-[9px] font-mono text-slate-600 tracking-wider mt-12">
              IIT BOMBAY METAVERSE GRID DIVISION // SECURE WEB ENGINE R-2050
            </span>
          </div>

        </div>
      )}

      {/* FLOATING GLASSMORPHISM INTERSTELLAR CONTROLS & SIDEBARS */}
      {!introActive && (
        <>
          {/* FLOATING TOP HUD NAVBAR (Iron Man Inspired Glass UI) */}
          <header className="absolute top-4 left-4 right-4 z-40 max-w-7xl mx-auto flex items-center justify-between pointer-events-auto h-16 px-4 md:px-8 rounded-none border border-[#00f5ff]/15 glass-hud">
            
            {/* LOGO */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigateToSection('gateway')}>
              <div className="w-9 h-9 rounded-none border border-[#00f5ff]/30 flex items-center justify-center bg-black/40 text-xs font-bold font-display text-[#00f5ff]">
                TF
              </div>
              <div className="flex flex-col hidden sm:block">
                <span className="font-display font-black text-xs tracking-widest text-[#f8fafc]">TECHFEST IIT BOMBAY</span>
                <span className="font-mono text-[9px] text-[#f43f5e]/90 tracking-widest block leading-none">SECTOR 2050 // Giga-Net</span>
              </div>
            </div>

            {/* FLOATING HUD DOCK NAVIDATIONS */}
            <nav className="hidden lg:flex items-center gap-1 font-mono text-[10px] tracking-widest">
              {SECTIONS_METADATA.map((sec, idx) => {
                const isActive = activeSection === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => navigateToSection(sec.id as SectionId)}
                    className={`px-4 py-2 uppercase font-medium transition-all duration-300 border-b flex flex-col items-center ${
                      isActive 
                        ? 'border-[#00f5ff] text-[#00f5ff] font-bold tracking-wider' 
                        : 'border-transparent text-slate-400 hover:text-slate-100 hover:border-slate-500'
                    }`}
                  >
                    <span>0{idx + 1}_ {sec.title}</span>
                  </button>
                );
              })}
            </nav>

            {/* BUTTONS CONTROLS CORES (Audio + Portfolio Trigger) */}
            <div className="flex items-center gap-3">
              {/* Timeline Portal trigger */}
              <button
                id="timeline-portal-btn"
                onClick={() => {
                  audioEngine.playPortal();
                  setShowTimelineModal(true);
                }}
                className="hidden md:block px-4 py-2 border border-[#00f5ff]/25 text-[#00f5ff] hover:text-white hover:border-[#00f5ff] font-display text-[10px] tracking-widest uppercase transition-colors cursor-pointer"
              >
                CHRONOS TIMELINE
              </button>

              {/* Simulation Lab trigger */}
              <button
                id="sim-lab-btn"
                onClick={() => {
                  audioEngine.playRobot();
                  setShowLabModal(true);
                  setLabInitialTab('drone');
                }}
                className="hidden sm:block px-4 py-2 border border-orange-500/35 hover:border-orange-500 text-orange-400 hover:text-orange-200 font-display text-[10px] tracking-widest uppercase transition-colors cursor-pointer"
              >
                SIMULATION LAB
              </button>

              {/* Event Hub Action button */}
              <button
                id="events-arena-tab"
                onClick={() => {
                  audioEngine.playClick();
                  setShowEventsModal(true);
                }}
                className="px-5 py-2 font-display text-[10px] tracking-widest uppercase text-black font-bold bg-[#00f5ff] hover:bg-white transition-all cursor-pointer shadow-[0_0_15px_rgba(0,245,255,0.3)]"
              >
                EVENTS ARENA
              </button>

              {/* Community Portal trigger */}
              <button
                id="community-portal-btn"
                onClick={() => {
                  audioEngine.playQuantum();
                  setShowCommunityModal(true);
                }}
                className="hidden xl:block px-4 py-2 border border-purple-500/35 hover:border-purple-500 text-purple-450 hover:text-white font-display text-[10px] tracking-widest uppercase transition-colors cursor-pointer"
              >
                COMMUNITY PORTAL
              </button>

              {/* Merch Store trigger */}
              <button
                id="merch-store-btn"
                onClick={() => {
                  audioEngine.playClick();
                  setShowMerchModal(true);
                }}
                className="hidden xl:block px-4 py-2 border border-orange-500/35 hover:border-orange-500 text-orange-450 hover:text-white font-display text-[10px] tracking-widest uppercase transition-colors cursor-pointer"
              >
                VIRTUAL MERCH
              </button>

              {/* Mute toggle with visualizer overlay */}
              <button
                id="mute-sys-toggle-btn"
                onClick={handleMuteBtn}
                className="w-10 h-10 border border-[#00f5ff]/20 flex items-center justify-center bg-black/30 hover:border-[#00f5ff]/50 transition-colors text-[#00f5ff] cursor-pointer"
                title={isMuted ? "Unmute Ambient Drone Synthesizers" : "Mute Sound Synthesizers"}
              >
                {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
              </button>
            </div>

          </header>

          {/* TELEMETRY READOUTS - HUD TIMELINE SIDEBAR (Right edge) */}
          <div className="absolute right-6 top-24 bottom-20 z-30 w-12 hidden md:flex flex-col justify-between items-center py-6 border-l border-[#00f5ff]/10">
            <span className="font-mono text-[9px] text-[#00f5ff]/35 tracking-widest uppercase rotate-90 my-2">CERR_NODE_YAW</span>
            
            <div className="flex flex-col gap-5 items-center">
              {SECTIONS_METADATA.map((sec, idx) => {
                const isActive = activeSection === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => navigateToSection(sec.id as SectionId)}
                    className="relative group flex items-center justify-center w-6 h-6 cursor-pointer"
                  >
                    <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      isActive 
                        ? 'bg-[#00f5ff] scale-150 shadow-[0_0_10px_#00f5ff]' 
                        : 'bg-slate-700 group-hover:bg-[#f43f5e]'
                    }`}></div>
                    
                    {/* Tooltip on left hover */}
                    <span className="absolute right-8 top-1 bg-black/90 text-[10px] font-mono border border-[#00f5ff]/30 text-[#00f5ff] px-2 py-1 select-none pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 tracking-wider whitespace-nowrap">
                      {sec.title}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col items-center gap-1">
              <span className="font-mono text-[10px] text-slate-500 font-bold">A_X</span>
              <span className="font-mono text-[9px] text-[#00f5ff] font-bold">0{sectionIndex + 1}</span>
            </div>
          </div>

          {/* BOTTOM TELEMETRY FOOTER RAILS */}
          <footer className="absolute bottom-4 left-4 right-4 z-30 max-w-7xl mx-auto flex items-center justify-between py-2 border-t border-[#00f5ff]/10 text-slate-500 text-[10px] tracking-wider font-mono">
            <div className="flex items-center gap-4">
              <span 
                className="pointer-events-auto cursor-pointer text-slate-400 hover:text-[#00f5ff] transition-colors select-none font-bold"
                onClick={() => {
                  audioEngine.playHover();
                  setMumbaiClockClicks(c => {
                    const next = c + 1;
                    if (next >= 5) {
                      audioEngine.playQuantum();
                      setSecretPortalActive(true);
                      return 0;
                    }
                    return next;
                  });
                }}
                title="Secret Key Trigger // Click 5 times to bypass Konami"
              >
                IITB_MUM_GRID: {mumbaiTime}
              </span>
              <span className="hidden md:inline text-slate-700">|</span>
              <span className="hidden md:inline select-none">THRUSTER_VECTOR_ACCEL: {(scrollProgress * 100).toFixed(1)}%</span>
            </div>

            <div className="flex items-center gap-3">
              <span>AUDIO VIZ:</span>
              <div className="flex items-end gap-[2px] h-3">
                {audioWaves.map((h, i) => (
                  <div 
                    key={i} 
                    className="w-[2px] bg-[#00f5ff]/80 transition-all duration-100" 
                    style={{ height: `${h}%` }}
                  ></div>
                ))}
              </div>
            </div>
          </footer>

          {/* MAIN INTERACTIVE CONFLICT AREA: OVERLAY DESK / MANUAL TIMELINE */}
          {/* LEFT TELEMETRY CONSOLE overlay (Beautiful detailed section telemetry card) */}
          <div className="absolute left-4 bottom-20 top-24 z-30 w-[310px] md:w-[380px] pointer-events-auto flex flex-col justify-between select-none">
            
            {/* STAGE METERS PANEL (Glassmorphism overlay of high-end details content) */}
            <div className="glass-hud p-6 flex flex-col h-[52%] overflow-y-auto mb-4 border border-[#00f5ff]/15 relative">
              
              {/* Scan laser line animation decorator effect */}
              <div className="absolute inset-x-0 h-[1.5px] bg-[#00f5ff]/35 top-0 anim-laser-sweep pointer-events-none"></div>

              <div className="flex justify-between items-start border-b border-[#00f5ff]/10 pb-3 mb-4">
                <div>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-[#f43f5e] font-bold block mb-1">
                    DIMENSION_SECTOR: 0{sectionIndex + 1}
                  </span>
                  <h2 className="font-display font-black text-2xl tracking-wider text-[#00f5ff] uppercase leading-none glow-text-blue">
                    {SECTIONS_METADATA[sectionIndex].title}
                  </h2>
                </div>
                <div className="rounded border border-[#00f5ff]/20 bg-black/40 px-2 py-1">
                  <span className="font-mono text-[10px] text-slate-300">W_IDX: {(scrollProgress).toFixed(3)}</span>
                </div>
              </div>

              {/* CORE DYNAMIC SECTION OVERLAYS */}
              <div className="flex-1 flex flex-col justify-between font-sans pr-1">
                
                {activeSection === 'gateway' && (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-300 leading-relaxed font-light">
                      The portal to Techfest 2050 is activated. Gravitational lenses are aligned to Bombay coords. The camera floats over standard space-time matrices.
                    </p>
                    <div className="space-y-2 border border-[#00f5ff]/10 p-3 bg-black/30">
                      <span className="font-mono text-[9px] uppercase font-bold text-[#00f5ff] block">COGNITIVE METRICS:</span>
                      <ul className="space-y-1 font-mono text-[10px] text-slate-400">
                        <li className="flex justify-between"><span>SINGULARITY STATE:</span> <span className="text-[#10b981]">STABLE</span></li>
                        <li className="flex justify-between"><span>ENTANGLED_KEYS:</span> <span className="text-[#00f5ff]">12,854 / SEC</span></li>
                        <li className="flex justify-between"><span>ION DISPERSAL:</span> <span>0.048%</span></li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <button
                        onClick={() => { audioEngine.playClick(); navigateToSection('aicity'); }}
                        className="w-full py-2 font-display text-[11.5px] font-black text-black bg-[#00f5ff] hover:bg-white transition-all tracking-widest uppercase flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(0,245,255,0.35)]"
                      >
                        EXPLORE ZONES <ArrowRight size={13} />
                      </button>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => { audioEngine.playSpace(); setShowTrailerModal(true); }}
                          className="py-2 px-3 border border-[#00f5ff]/35 hover:border-[#00f5ff] bg-black/40 text-center font-mono text-[10px] text-[#00f5ff] font-bold uppercase cursor-pointer tracking-wider hover:bg-[#00f5ff]/10"
                        >
                          WATCH TRAILER
                        </button>
                        <button
                          onClick={() => { audioEngine.playQuantum(); setShowPassesModal(true); }}
                          className="py-2 px-3 border border-orange-500/35 hover:border-orange-500 bg-black/40 text-center font-mono text-[10px] text-orange-400 font-bold uppercase cursor-pointer tracking-wider hover:bg-orange-500/10"
                        >
                          BUY PASSES
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === 'aicity' && (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-300 leading-relaxed font-light">
                      Welcome to the AI Cyber metropolis. Autonomous transportation pods drift seamlessly without decelerating at intersections. 
                    </p>
                    <button
                      onClick={() => { audioEngine.playRobot(); setShowLabModal(true); setLabInitialTab('drone'); }}
                      className="w-full py-2 border-l-2 border-l-cyan-400 bg-cyan-950/25 border border-cyan-900 font-display text-[10.5px] font-bold text-cyan-300 text-center uppercase tracking-widest cursor-pointer hover:bg-cyan-900/40 hover:text-white transition-all block font-bold"
                    >
                      OPEN INTEL METROPOLIS
                    </button>
                    <div className="p-3 border border-[#00f5ff]/15 bg-black/40 space-y-1 border-l-2 border-l-[#00f5ff]">
                      <span className="font-mono text-[10px] text-sm tracking-wide text-slate-300 font-bold block">PLAYABLE DIGITAL WORLD:</span>
                      <span className="text-[11px] text-[#00f5ff] block font-mono">Hover & Click high-lighted nodes on the 3D canvas map to execute autonomous telemetry readouts.</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 pt-1">
                      {ROBOTS_DATA.map(bot => (
                        <button
                          key={bot.id}
                          onClick={() => { setSelectedItem(bot); audioEngine.playRobot(); }}
                          className="p-2 border border-slate-800 hover:border-[#00f5ff]/40 bg-black/40 text-left cursor-pointer transition-colors"
                        >
                          <span className="font-mono text-[8px] text-[#00f5ff] block">COORDINATOR</span>
                          <span className="font-display font-medium text-[11px] leading-tight truncate block text-slate-200">{bot.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {activeSection === 'robotics' && (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-300 leading-relaxed font-light">
                      Inside the Mechatronic Fab cells, carbon-synthesized artificial muscles flex to perform cellular surgery operations with micron precision.
                    </p>
                    <button
                      onClick={() => { audioEngine.playRobot(); setShowLabModal(true); setLabInitialTab('robot'); }}
                      className="w-full py-2 border-l-2 border-l-red-550 bg-red-950/25 border border-red-900 font-display text-[10.5px] font-bold text-red-300 text-center uppercase tracking-widest cursor-pointer hover:bg-red-900/40 hover:text-white transition-all block font-bold"
                    >
                      OPEN ROBOTIC SIMULATOR
                    </button>
                    <div className="space-y-2 font-mono text-[10px] text-slate-300">
                      <div className="flex justify-between items-center py-1 border-b border-slate-800">
                        <span>ASSEMBLY_SPEED:</span> <span className="text-[#00f5ff] font-bold">140 cycles/min</span>
                      </div>
                      <div className="flex justify-between items-center py-1 border-b border-slate-800">
                        <span>LIDAR SCANNER MATRIX:</span> <span className="text-[#10b981] font-bold">ACTIVE</span>
                      </div>
                      <div className="flex justify-between items-center py-1 border-b border-slate-800">
                        <span>HYDRAULIC CRYO_CONVERSION:</span> <span>340 Kelvin</span>
                      </div>
                    </div>
                    <div className="p-2.5 bg-red-950/20 border border-red-500/20 text-[10px] font-mono text-red-200">
                      <span className="font-bold text-red-400 block mb-0.5">TAP MECHANICAL HOTSPOTS:</span>
                      Locate structural spinal flexors and scanning LIDAR laser cores rotating at the core.
                    </div>
                  </div>
                )}

                {activeSection === 'space' && (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-300 leading-relaxed font-light">
                      The Olympus Sector dome, built inside Martian coordinates, hosts 250,000 residents beneath deep diamond energy canopies.
                    </p>
                    <button
                      onClick={() => { audioEngine.playSpace(); setShowLabModal(true); setLabInitialTab('rocket'); }}
                      className="w-full py-2 border-l-2 border-l-orange-550 bg-orange-950/25 border border-orange-900 font-display text-[10.5px] font-bold text-orange-300 text-center uppercase tracking-widest cursor-pointer hover:bg-orange-500/40 hover:text-white transition-all block"
                    >
                      ENTER SPACE SHIP COCKPIT
                    </button>
                    <div className="space-y-2">
                      <span className="font-mono text-[9px] uppercase text-slate-400 block font-bold">TERRAFORMING STATUS METRIC:</span>
                      <div className="relative w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 bg-orange-500 w-[64%]"></div>
                      </div>
                      <div className="flex justify-between font-mono text-[9px] text-slate-400">
                        <span>ATMOSPHERE MATRIX: 64%</span>
                        <span>TARGET: 100% (2080)</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5 pt-1">
                      {SPACE_OBJECTS_DATA.map(obj => (
                        <button
                          key={obj.id}
                          onClick={() => { setSelectedItem(obj); audioEngine.playSpace(); }}
                          className="p-1.5 border border-slate-850 hover:border-orange-500/40 bg-black/40 text-center cursor-pointer transition-colors"
                        >
                          <span className="font-display font-medium text-[10px] text-slate-300 truncate block">{obj.name.split(' ')[0]}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {activeSection === 'quantum' && (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-300 leading-relaxed font-light">
                      Quantum-coherent processors execute active entanglement swaps across micro-networks, providing unbreakable post-quantum cryptography.
                    </p>
                    <div className="space-y-2 border border-purple-500/10 bg-purple-950/15 p-3 font-mono text-[10px]">
                      <span className="font-bold text-[#c084fc] block">ENTANGLED CORE FLUX:</span>
                      <div className="flex justify-between"><span>SWAP LATENCY:</span> <span className="text-[#a855f7]">0.00 ns</span></div>
                      <div className="flex justify-between"><span>BRAINWAVE BAND:</span> <span>45 GigaHz</span></div>
                    </div>
                    <div className="p-2 border border-[#a855f7]/20 bg-black/50 text-[10.5px] font-mono text-purple-200">
                      Hover and expand nodes on the canvas. Neural frequencies bend based on your cursor coordinates dynamically.
                    </div>
                  </div>
                )}

                {activeSection === 'events' && (
                  <div className="space-y-4 text-center">
                    <p className="text-xs text-slate-300 text-left leading-relaxed font-light">
                      Explore the premier interactive Events Hub. Floating holographic challenge dossiers orbit around a central core space.
                    </p>
                    <button
                      id="launch-overlay-hub-btn"
                      onClick={() => { audioEngine.playClick(); setShowEventsModal(true); }}
                      className="w-full py-3 font-display font-black text-xs tracking-widest uppercase text-[#030307] bg-[#00f5ff] hover:bg-white transition-all shadow-[0_0_20px_rgba(0,245,255,0.4)] cursor-pointer"
                    >
                      OPEN HOLOGRAPHIC EVENTS ARENA
                    </button>
                    <span className="font-mono text-[9px] text-slate-500 uppercase block tracking-wider mt-1">
                      Sponsor orbits bypass outer limits
                    </span>
                  </div>
                )}

                {activeSection === 'finale' && (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-300 leading-relaxed font-light">
                      Shape the tomorrow. Innovate, Create, and Inspire. Trigger dynamic choreography arrays across our hovering UAV drone swarms.
                    </p>
                    
                    <div className="space-y-2.5">
                      <span className="font-mono text-[10px] text-slate-400 block font-bold">DRONE FLIGHT FORMATION:</span>
                      <div className="grid grid-cols-3 gap-1.5 font-mono text-[9px]">
                        {['Orbits', 'Shield', 'Cosm_Core'].map(form => (
                          <button
                            key={form}
                            onClick={() => { audioEngine.playClick(); setDroneFormation(form); }}
                            className={`p-1 border transition-colors cursor-pointer ${
                              droneFormation === form 
                                ? 'bg-fuchsia-500/20 text-fuchsia-350 border-fuchsia-400' 
                                : 'bg-black/40 text-slate-400 border-slate-800 hover:border-slate-600'
                            }`}
                          >
                            {form}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-fuchsia-950/20 border border-fuchsia-500/20 p-2.5">
                      <span className="font-mono font-bold text-xs text-fuchsia-400 block mb-1">PROMPT FIREWORKS:</span>
                      <span className="text-[10px] font-mono text-slate-400 block">Tap directly on the empty background of the 3D grid stage to shoot laser fireworks!</span>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 pt-1">
                      <button 
                        onClick={() => { audioEngine.playClick(); alert("Registered for Techfest 2050 on Blockchain Node #149!"); }}
                        className="py-2 px-3 border border-fuchsia-500/30 hover:border-fuchsia-500 bg-black/40 font-display font-medium text-[11px] text-fuchsia-300 uppercase tracking-wider text-center cursor-pointer transition-colors"
                      >
                        Join Techfest
                      </button>
                      <button 
                        onClick={() => { audioEngine.playClick(); setShowEventsModal(true); }}
                        className="py-2 px-3 border border-[#00f5ff]/30 hover:border-[#00f5ff] bg-black/40 font-display font-medium text-[11px] text-[#00f5ff] uppercase tracking-wider text-center cursor-pointer transition-colors"
                      >
                        Explore Events
                      </button>
                    </div>
                  </div>
                )}

              </div>

              {/* LIVE FUTURISTIC COUNTERS DETAILED VIEW */}
              <div className="mt-4 border-t border-[#00f5ff]/10 pt-3">
                <TechfestFuturisticStats />
              </div>

            </div>

            {/* MANUAL THRUST PANEL - Timelines scroll triggers (Bottom-Left edge console) */}
            <div className="glass-hud p-4 flex flex-col h-[45%] justify-between relative border border-slate-800 bg-black/25">
              
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="font-mono text-[10px] text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
                  <Compass size={11} className="text-[#00f5ff] animate-spin" /> MANUAL_THRUSTERS_CON
                </span>
                <span className="font-mono text-[9px] text-[#05e6ff] animate-pulse">● AUTOYAW_HEALTHY</span>
              </div>

              {/* Grid map timelines coordinates layout */}
              <div className="space-y-2.5 font-mono text-[10px] text-slate-400 my-2">
                
                <div className="flex items-center justify-between text-[#00f5ff] font-bold bg-[#00f5ff]/5 px-2 py-1">
                  <span>METAVERSE STAGE:</span>
                  <span>{activeSection.toUpperCase()}</span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[9px]">
                    <span>DIM_ZOOM_PROGRESS</span>
                    <span>{(scrollProgress * 100).toFixed(0)}%</span>
                  </div>
                  {/* Custom draggable timeline slider */}
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={(scrollProgress * 100).toFixed(0)} 
                    onChange={(e) => setScrollProgress(parseFloat(e.target.value) / 100)}
                    className="w-full h-1 bg-slate-800 accent-[#00f5ff] rounded-lg cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <button
                    disabled={sectionIndex === 0}
                    onClick={() => {
                      audioEngine.playSpace();
                      const prevIdx = sectionIndex - 1;
                      if (prevIdx >= 0) {
                        setActiveSection(SECTIONS_IDS[prevIdx]);
                        setScrollProgress(0.9);
                      }
                    }}
                    className="py-1 px-2 border border-slate-800 hover:border-[#00f5ff]/30 text-center cursor-pointer transition-colors flex items-center justify-center gap-1.5 disabled:opacity-30 disabled:border-slate-900"
                  >
                    <ArrowUp size={11} /> PREV_DIM
                  </button>
                  
                  <button
                    disabled={sectionIndex === SECTIONS_IDS.length - 1}
                    onClick={() => {
                      audioEngine.playSpace();
                      const nextIdx = sectionIndex + 1;
                      if (nextIdx < SECTIONS_IDS.length) {
                        setActiveSection(SECTIONS_IDS[nextIdx]);
                        setScrollProgress(0.1);
                      }
                    }}
                    className="py-1 px-2 border border-slate-800 hover:border-[#00f5ff]/30 text-center cursor-pointer transition-colors flex items-center justify-center gap-1.5 disabled:opacity-30 disabled:border-slate-900"
                  >
                    NEXT_DIM <ArrowDown size={11} />
                  </button>
                </div>

              </div>

              {/* Mini visual help indicator */}
              <div className="text-[10px] font-mono text-slate-500 leading-tight pt-2 border-t border-slate-800 flex items-center gap-2">
                <HelpCircle size={12} className="text-[#05e6ff]" />
                <span>SCROLL MOUSE WHEEL DIRECTLY TO INTERPOLATE BETWEEN WORLDS</span>
              </div>

            </div>

          </div>

          {/* ACTIVE HOVER HUD CARD (Flashes on screen when cursor drifts of 3D entities) */}
          {hoveredItemId && !selectedItem && (
            <div className="absolute top-[85px] left-[340px] md:left-[410px] z-30 font-mono scale-[0.9] origin-left transition-all duration-300 pointer-events-none">
              <div className="border border-[#00f5ff]/50 bg-black/90 p-4 w-[280px] shadow-[0_0_20px_rgba(0,245,255,0.2)]">
                <div className="flex justify-between items-center border-b border-[#00f5ff]/20 pb-1 mb-2">
                  <span className="text-[9px] text-[#00f5ff] font-bold tracking-widest">TACTICAL_SYS_LOCKED</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-ping"></span>
                </div>
                
                {(() => {
                  const r = ROBOTS_DATA.find(x => x.id === hoveredItemId);
                  const h = HOTSPOTS_DATA.find(x => x.id === hoveredItemId);
                  const s = SPACE_OBJECTS_DATA.find(x => x.id === hoveredItemId);
                  const q = QUANTUM_NODES_DATA.find(x => x.id === hoveredItemId);
                  const sp = SPONSORS_DATA.find(x => x.id === hoveredItemId);
                  
                  const target = r || h || s || q || sp;
                  if (!target) return null;

                  const category = ('category' in target) ? (target as any).category : 'Sponsor Galaxy Partner';
                  const description = ('description' in target) ? (target as any).description : ((target as any).role || 'IIT Bombay Strategic Co-sponsor');

                  return (
                    <div>
                      <h4 className="font-display font-extrabold text-base text-white leading-tight uppercase mb-0.5">{target.name}</h4>
                      <span className="text-[9.5px] text-[#f43f5e] font-bold uppercase tracking-wider block mb-1.5">{category}</span>
                      <p className="text-[10px] text-slate-400 font-sans leading-relaxed tracking-wide limit-lines">{description}</p>
                      
                      <div className="mt-2 text-[8px] text-[#00f5ff]/60 border-t border-slate-850 pt-2 flex justify-between uppercase">
                        <span>TAP SCREEN TO EXPAND</span>
                        <span>DEPTH: STABLE</span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* HOLOGRAPHIC SPECIFICATION CONSOLE MODAL (Floating overlaid card on clicked 3D items) */}
          {selectedItem && (
            <div className="absolute inset-0 bg-[#020204]/70 z-40 flex items-center justify-center p-4">
              <div className="w-full max-w-lg glass-hud-active p-6 relative flex flex-col md:p-8 animate-[zoom-in_0.3s_ease]">
                
                {/* Visual Scanner laser beam decoration */}
                <div className="absolute inset-x-0 h-[2px] bg-[#f43f5e] top-0 anim-laser-sweep pointer-events-none"></div>

                {/* Close Button */}
                <button
                  onClick={() => { audioEngine.playClick(); setSelectedItem(null); }}
                  className="absolute top-4 right-4 text-[#00f5ff] hover:text-[#fff] transition-colors p-2 cursor-pointer border border-[#00f5ff]/20 bg-black/40"
                >
                  <X size={16} />
                </button>

                <div className="flex gap-2.5 items-center font-mono text-[9.5px] text-[#f43f5e] uppercase tracking-[0.2em] font-bold mb-2">
                  <Terminal size={12} /> TELEMETRY_DECRYPTED // NODE_ACCESS
                </div>

                <div className="border-b border-[#00f5ff]/25 pb-3 mb-4">
                  <h3 className="font-display font-black text-2xl md:text-3xl text-white uppercase tracking-wider leading-none">
                    {selectedItem.name}
                  </h3>
                  <span className="text-xs text-[#00f5ff] font-mono uppercase tracking-widest block mt-1">
                    {selectedItem.category}
                  </span>
                </div>

                <div className="space-y-4 flex-1">
                  
                  {/* Status meters */}
                  {selectedItem.status && (
                    <div className="flex justify-between items-center bg-black/40 border border-slate-800 px-3 py-1.5 font-mono text-[11px]">
                      <span className="text-slate-400">CORE STATUS:</span>
                      <span className="text-[#10b981] font-bold">{selectedItem.status}</span>
                    </div>
                  )}

                  <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-light">
                    {selectedItem.description}
                  </p>

                  {/* Bullet points specifics */}
                  {selectedItem.details && (
                    <div className="space-y-2 border-t border-slate-800 pt-3">
                      <span className="font-mono text-[10px] text-[#f43f5e] font-bold uppercase block">INTELLIGENCE SPECIFICATIONS:</span>
                      <ul className="space-y-1 text-xs text-slate-300 pl-4 list-disc">
                        {selectedItem.details.map((detail: string, index: number) => (
                          <li key={index} className="leading-snug">{detail}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Specs matrix logs block */}
                  {selectedItem.specs && (
                    <div className="space-y-2 border-t border-slate-800 pt-3">
                      <span className="font-mono text-[10px] text-slate-400 uppercase font-bold block">MECHANICAL METRIC CORES:</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[11.5px]">
                        {Object.entries(selectedItem.specs).map(([key, value]) => (
                          <div key={key} className="flex justify-between p-2 border border-slate-850 bg-black/30">
                            <span className="text-slate-500 uppercase">{key}:</span>
                            <span className="text-white font-bold">{value as string}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

                <div className="border-t border-[#00f5ff]/15 pt-4 mt-6 flex justify-end gap-3 font-mono text-[10px]">
                  <button
                    onClick={() => { audioEngine.playClick(); setSelectedItem(null); }}
                    className="px-5 py-2.5 border border-slate-800 hover:border-slate-500 text-slate-330 transition-colors uppercase cursor-pointer"
                  >
                    Close telemetry
                  </button>
                  <button
                    onClick={() => { audioEngine.playClick(); alert("Syncing mainframe metrics with node..."); }}
                    className="px-5 py-2.5 bg-[#00f5ff] text-black font-bold uppercase transition-colors hover:bg-white cursor-pointer"
                  >
                    SYNC METRICS
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* DEDICATED HOLOGRAPHIC EVENTS ARENA ARENA MODAL */}
          {showEventsModal && (
            <div className="absolute inset-0 bg-black/85 z-50 flex flex-col justify-between p-4 md:p-8 select-none">
              
              {/* Top bar header */}
              <div className="w-full max-w-7xl mx-auto flex justify-between items-center border-b border-[#00f5ff]/20 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded border border-[#00f5ff]/35 flex items-center justify-center font-display font-black text-xs text-[#00f5ff]">
                    E
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-[#f43f5e] tracking-widest font-black block uppercase leading-none">
                      CHALLENGE_ARENA // PORTFOLIOMODE
                    </span>
                    <h1 className="text-xl md:text-2xl font-display font-black tracking-wider text-white">
                      TECHFEST EVENTS MATRIX 2050
                    </h1>
                  </div>
                </div>

                <button
                  onClick={() => { audioEngine.playClick(); setShowEventsModal(false); }}
                  className="px-4 py-2 border border-[#00f5ff]/30 text-[#00f5ff] hover:text-white hover:border-[#00f5ff] font-mono text-[11px] tracking-wider uppercase flex items-center gap-2 cursor-pointer"
                >
                  Close view <X size={14} />
                </button>
              </div>

              {/* Main inner body: Filters + Cards selection */}
              <div className="flex-1 w-full max-w-7xl mx-auto flex flex-col mt-4 md:mt-6 overflow-hidden">
                
                {/* Horizontal Category Pill Filter Menu */}
                <div className="flex gap-2 pb-3 mb-5 overflow-x-auto whitespace-nowrap scrollbar-thin">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => { audioEngine.playClick(); setActiveEventCategory(cat); }}
                      className={`px-5 py-2 font-mono text-[10.5px] uppercase tracking-widest transition-all cursor-pointer ${
                        activeEventCategory === cat 
                          ? 'bg-[#00f5ff] text-black font-black' 
                          : 'border border-slate-800 text-slate-400 hover:text-slate-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Left/Right grid panels layout (1. Cards roster, 2. Dynamic specs) */}
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden pb-4">
                  
                  {/* Holographic Events Roster Panel (list of cards) */}
                  <div className="col-span-1 lg:col-span-8 overflow-y-auto pr-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredEvents.map(ev => {
                      return (
                        <div
                          key={ev.id}
                          className="group relative border border-[#00f5ff]/15 bg-black/40 hover:border-[#00f5ff]/60 p-5 cursor-pointer transition-all hover:translate-y-[-2px] flex flex-col justify-between"
                          onClick={() => { audioEngine.playClick(); setSelectedEvent(ev); }}
                        >
                          {/* Top Tag category */}
                          <div className="flex justify-between items-center mb-4">
                            <span className="font-mono text-[8.5px] uppercase text-[#f43f5e] font-bold border-l-2 border-l-[#f43f5e] pl-1.5 leading-none">
                              {ev.category}
                            </span>
                            <span className="font-mono text-[10.5px] text-[#00f5ff] font-bold">{ev.prizePool}</span>
                          </div>

                          <div className="mb-4">
                            <h3 className="font-display font-black text-lg md:text-xl text-white uppercase leading-snug group-hover:text-[#00f5ff] group-hover:glow-text-blue transition-colors">
                              {ev.title}
                            </h3>
                            <p className="text-xs text-slate-400 leading-relaxed font-sans font-light mt-1.5 limit-lines-2">{ev.description}</p>
                          </div>

                          <div className="flex justify-between items-center pt-3 border-t border-slate-850">
                            <span className="font-mono text-[9px] text-slate-500">{ev.date}</span>
                            <span className="font-mono text-[9px] text-[#00f5ff] font-bold flex items-center gap-1 group-hover:underline">
                              Telemet_ Access <ChevronRight size={10} />
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Sidebar stats panel on click */}
                  <div className="col-span-1 lg:col-span-4 border border-slate-800 bg-black/45 p-5 md:p-6 overflow-y-auto flex flex-col justify-between">
                    {selectedEvent ? (
                      <div className="space-y-4 animate-[fade-in_0.3s_ease]">
                        <div className="border-b border-slate-850 pb-3 mb-4">
                          <span className="text-[9px] font-mono text-[#f43f5e] uppercase tracking-widest font-black block">
                            DOCK_ACTIVE_ID: {selectedEvent.id.toUpperCase()}
                          </span>
                          <h2 className="text-xl md:text-2xl font-display font-black text-[#00f5ff] uppercase mt-1">
                            {selectedEvent.title}
                          </h2>
                          <div className="flex justify-between text-xs font-mono text-slate-400 mt-2">
                            <span>PRIZES: {selectedEvent.prizePool}</span>
                            <span>DATE: {selectedEvent.date}</span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <span className="font-mono text-[9.5px] text-slate-400 font-bold uppercase block">OVERVIEW:</span>
                          <p className="text-xs text-slate-300 leading-relaxed">{selectedEvent.overview}</p>
                        </div>

                        <div className="space-y-2 pt-2 border-t border-slate-850">
                          <span className="font-mono text-[9.5px] text-[#f43f5e] font-bold uppercase block">CRITICAL REGULATION MATRIX:</span>
                          <ul className="space-y-1.5 font-sans text-xs text-slate-450 list-disc pl-4 font-light">
                            {selectedEvent.rules.map((rule, ri) => (
                              <li key={ri}>{rule}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="space-y-2 pt-2 border-t border-slate-850">
                          <span className="font-mono text-[9.5px] text-slate-400 font-bold uppercase block">TRANSIT_TIMELINE:</span>
                          <ul className="space-y-1 font-mono text-[10px] text-slate-400">
                            {selectedEvent.timeline.map((line, li) => (
                              <li key={li} className="flex gap-2 items-start text-xs font-sans">
                                <span className="text-[#00f5ff] font-bold">•</span> <span>{line}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 mt-4 font-mono text-xs">
                          <button
                            onClick={() => { audioEngine.playClick(); alert(`Registered successfully for ${selectedEvent.title} on Dec 2050 timeline!`); }}
                            className="flex-1 py-3 bg-[#030307] hover:bg-[#00f5ff] text-white hover:text-black border border-[#00f5ff] font-display font-bold text-xs uppercase tracking-widest transition-all cursor-pointer"
                          >
                            SOLVE & REGISTER NOW
                          </button>
                          <button
                            onClick={() => { 
                              audioEngine.playQuantum();
                              const isBookmarked = bookmarkedEvents.includes(selectedEvent.id);
                              if (isBookmarked) {
                                setBookmarkedEvents(bookmarkedEvents.filter(id => id !== selectedEvent.id));
                              } else {
                                setBookmarkedEvents([...bookmarkedEvents, selectedEvent.id]);
                              }
                            }}
                            className="py-3 px-4 border border-[#00f5ff]/35 text-[#00f5ff] hover:text-white hover:bg-[#00f5ff]/10 font-display text-xs uppercase tracking-widest cursor-pointer"
                          >
                            {bookmarkedEvents.includes(selectedEvent.id) ? 'Dossier Saved ✓' : 'Save Dossier'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col justify-center items-center text-center text-slate-500 py-12 p-3 font-mono space-y-3">
                        <Award size={40} className="text-slate-700 animate-pulse" />
                        <span className="text-xs leading-relaxed uppercase tracking-wider block">
                          TAP ANY FLOATING ARENA DOSSIER CARD AT THE LEFT TO INJECT DIRECT CONTEXT TELEMETRY RULES
                        </span>
                      </div>
                    )}
                  </div>

                </div>

              </div>
              
              {/* Bottom footer disclaimer */}
              <div className="w-full max-w-7xl mx-auto border-t border-slate-850 pt-3 text-center text-[10px] font-mono text-slate-600 uppercase tracking-widest">
                IITB_META_ENGINE_SEC_VERSION_3.09_POST_QUANTUM
              </div>

            </div>
          )}

          {/* Futuristic Timeline Modal */}
          {showTimelineModal && (
            <TechfestTimeline 
              isOpen={showTimelineModal} 
              onClose={() => setShowTimelineModal(false)} 
            />
          )}

          {/* Mechatronics and drone interactive simulator sandbox */}
          {showLabModal && (
            <TechfestInteractiveLab 
              isOpen={showLabModal} 
              initialSandbox={labInitialTab} 
              onClose={() => setShowLabModal(false)} 
            />
          )}

          {/* Hacker Matrix portal Easter Egg */}
          {secretPortalActive && (
            <SecretQuantumPortal 
              onClose={() => setSecretPortalActive(false)} 
            />
          )}

          {/* Simulated Futuristic Cinema Trailer Modal */}
          {showTrailerModal && (
            <TechfestTrailerModal 
              isOpen={showTrailerModal} 
              onClose={() => setShowTrailerModal(false)} 
            />
          )}

          {/* Ticket passes Booking modal */}
          {showPassesModal && (
            <TechfestPassesModal 
              isOpen={showPassesModal} 
              onClose={() => setShowPassesModal(false)} 
            />
          )}

          {/* Community cyber security portal and dashboards */}
          {showCommunityModal && (
            <TechfestCommunityPortal 
              isOpen={showCommunityModal} 
              onClose={() => setShowCommunityModal(false)} 
              bookmarkedEvents={bookmarkedEvents}
              toggleBookmark={(id) => {
                if (bookmarkedEvents.includes(id)) {
                  setBookmarkedEvents(bookmarkedEvents.filter(x => x !== id));
                } else {
                  setBookmarkedEvents([...bookmarkedEvents, id]);
                }
              }}
              onAdminAction={(actionId, val) => {
                if (actionId === 'grid_overload') {
                  setScrollProgress(0.99);
                }
              }}
            />
          )}

          {/* Virtual merchandising store lockers */}
          {showMerchModal && (
            <TechfestMerchStore 
              isOpen={showMerchModal} 
              onClose={() => setShowMerchModal(false)} 
            />
          )}
        </>
      )}

    </div>
  );
}

// Hacker terminal with ASCII schematic matrix
function SecretQuantumPortal({ onClose }: { onClose: () => void }) {
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'SYSTEM BREACH DETECTED // KONAMI CODES ENTERED',
    'DECRYPTING PORT 2050 CORRIDORS...',
    'CONNECTED: IND_MUMB_BOMBAY_MAINFRAME',
    'Type "help" to list secure decrypted access cores.'
  ]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = terminalInput.trim().toLowerCase();
    setTerminalInput('');
    if (!cmd) return;

    let reply = `Command "${cmd}" not recognized. Type "help" for mainframe access codes.`;
    if (cmd === 'help') {
      reply = 'AVAILABLE COMMANDS:\n  > mascot   - Render Techfest Cyber Mascot artwork.\n  > portal   - Load mainframe post-quantum portal parameters.\n  > clear    - Clear screen logs.\n  > exit     - Lock portal & restore standard system coordinates.';
    } else if (cmd === 'clear') {
      setTerminalLogs([]);
      return;
    } else if (cmd === 'exit') {
      audioEngine.playPortal();
      onClose();
      return;
    } else if (cmd === 'portal') {
      reply = 'MAINFRAME PORTAL STATUS:\n  - Sync status: ENTANGLED\n  - Clock variance: 0.00ms\n  - Quantum Swap volume: 6.45 TeraFlops.\n  - Target destination: IIT BOMBAY 2050 PORTAL SECTOR.';
    } else if (cmd === 'mascot') {
      reply = 'TECHIE: THE CYBER-PHOENIX\n-------------------------\nBuilt from pure carbon-nanotube logic processors and entangled crystal arrays. Techie represents the undying spirit of innovation, soaring above space-time limitations to guide Techfest IIT Bombay into Sector 2050!';
    }

    setTerminalLogs(prev => [...prev, `> ${cmd}`, reply]);
  };

  return (
    <div className="absolute inset-0 bg-[#010602]/98 z-[100] flex flex-col justify-between p-6 overflow-hidden select-text text-[#22c55e] font-mono">
      {/* Falling Matrix green rain canvas effect */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="grid grid-cols-12 gap-2 text-[10px] uppercase leading-none truncate">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="flex flex-col scroll-py-1">
              {Array.from({ length: 30 }).map((_, j) => (
                <span key={j} className="opacity-40">{Math.random() > 0.5 ? '1' : '0'}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="border-b border-[#22c55e]/35 pb-3 z-10 flex justify-between items-center bg-black/60 p-2">
        <div className="flex items-center gap-3">
          <Terminal size={18} className="animate-pulse" />
          <div>
            <span className="text-[10px] block font-bold tracking-widest animate-pulse">SYS_STABLE_BREACH OVERRIDE</span>
            <span className="text-xs text-white uppercase tracking-wider font-display font-black">SECURE QUANTUM PORTAL CORE</span>
          </div>
        </div>
        <button 
          onClick={() => { audioEngine.playClick(); onClose(); }}
          className="px-4 py-1.5 border border-[#22c55e] hover:bg-[#22c55e] hover:text-black text-xs font-bold uppercase transition-colors cursor-pointer"
        >
          Close Core Override
        </button>
      </div>

      {/* Content wrapper */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 my-4 overflow-hidden z-10">
        
        {/* Terminal logs list */}
        <div className="md:col-span-7 border border-[#22c55e]/30 bg-black/85 p-4 flex flex-col justify-between overflow-hidden">
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-[11px] font-mono leading-relaxed select-text">
            {terminalLogs.map((log, index) => (
              <div key={index} className="whitespace-pre-wrap">{log}</div>
            ))}
          </div>

          <form onSubmit={handleCommand} className="flex border-t border-[#22c55e]/20 pt-3 mt-3">
            <span className="mr-2 text-white font-bold">&gt;</span>
            <input 
              type="text" 
              value={terminalInput}
              onChange={(e) => setTerminalInput(e.target.value)}
              placeholder="Type command ('help', 'mascot', 'exit')..."
              className="flex-1 bg-transparent border-none outline-none text-[#22c55e] placeholder-[#22c55e]/40 font-mono text-[11px]"
              autoFocus
            />
          </form>
        </div>

        {/* Mascot Mascot & Schematic displays */}
        <div className="md:col-span-5 border border-[#22c55e]/30 bg-black/85 p-5 flex flex-col justify-between items-center text-center">
          
          <div className="space-y-4 w-full">
            <span className="text-[10px] border border-[#22c55e]/40 px-2 py-1 bg-[#22c55e]/5 tracking-widest font-bold uppercase block">
              IITB Mascot Vector Schematic
            </span>
            
            {/* SVG of Techie: The Cyber-Phoenix */}
            <svg viewBox="0 0 100 80" className="w-[75%] max-w-[180px] h-auto mx-auto animate-pulse">
              {/* Phoenix geometric wings */}
              <path d="M 50 45 L 20 20 L 35 48 L 10 38 L 40 55 L 5 55 L 45 60 L 50 45 Z" fill="none" stroke="#22c55e" strokeWidth="1" />
              <path d="M 50 45 L 80 20 L 65 48 L 90 38 L 60 55 L 95 55 L 55 60 L 50 45 Z" fill="none" stroke="#22c55e" strokeWidth="1" />
              {/* Crest Head */}
              <polygon points="50,15 47,30 53,30" fill="none" stroke="#22c55e" strokeWidth="1" />
              {/* Body spike */}
              <line x1="50" y1="30" x2="50" y2="65" stroke="#22c55e" strokeWidth="1.5" />
              {/* Tail accents */}
              <path d="M 50 65 L 45 78 M 50 65 L 50 80 M 50 65 L 55 78" stroke="#22c55e" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            
            <div className="text-[10.5px] leading-relaxed font-sans text-slate-350">
              <span className="text-white font-mono font-bold block mb-1 uppercase text-xs">SPECIFICATION CORE:</span>
              Techie - Cybernetic Phoenix representing Techfest IIT Bombay. Aligned seamlessly to modern mechatronics and quantum computing logic.
            </div>
          </div>

          <div className="w-full border-t border-[#22c55e]/20 pt-3 text-[9px] text-[#22c55e]/60 font-mono uppercase tracking-widest">
            OVERRIDING STATUS NOMINAL // CORE_SECGRP_VER_1.8
          </div>

        </div>

      </div>

      {/* Footer disclaimer */}
      <div className="border-t border-[#22c55e]/30 pt-3 text-center text-[9px] text-[#22c55e]/40 uppercase tracking-widest">
        SYSTEM QUANTUM MAINFRAME ENCLAVE // ALL PORTALS INJECTED OK
      </div>

    </div>
  );
}
