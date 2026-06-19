/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, 
  HelpCircle, 
  Clock, 
  Sparkles, 
  Activity, 
  Zap, 
  ChevronRight, 
  Shield, 
  CheckCircle,
  Terminal,
  Volume2
} from 'lucide-react';
import { audioEngine } from './AudioEngine';

interface TechfestTimelineProps {
  isOpen: boolean;
  onClose: () => void;
}

type EraId = 'past' | 'present' | 'future';

export default function TechfestTimeline({ isOpen, onClose }: TechfestTimelineProps) {
  const [activeEra, setActiveEra] = useState<EraId>('future');
  const [decryptProgress, setDecryptProgress] = useState(0);
  const [neuralQuantumSwaps, setNeuralQuantumSwaps] = useState(4810);
  const [isPlayingSynth, setIsPlayingSynth] = useState(false);

  // Era Metadata specifications
  const eras = [
    {
      id: 'past' as EraId,
      year: '1998',
      title: 'THE GENESIS',
      audience: '2,000+',
      theme: 'AMBER / RETRO CRT',
      borderClass: 'border-yellow-600/40 bg-yellow-950/10',
      tagColor: 'text-amber-500',
      description: 'The foundation stones of Techfest are laid inside the IIT Bombay campus grounds. In an era before broadband, students gather with floppy disks and bulky Cathode-Ray screens to test basic electrical circuits and robotic line-followers.',
      highlights: [
        'First-ever national robotic line-follower challenges.',
        'Total CAD modeling designs drafted using vintage hardware.',
        'CRT displays showing basic mainframe telemetry scripts.'
      ],
      systemMetrics: {
        'Processor Speed': '133 MegaHz',
        'Storage System': '1.44 MB Floppy',
        'Net Connectivity': '56kbps Dial-up'
      }
    },
    {
      id: 'present' as EraId,
      year: '2026',
      title: 'ASIA`S LARGEST CARNIVAL',
      audience: '1,00,000+',
      theme: 'NEON BLUE / CLOUD',
      borderClass: 'border-blue-600/40 bg-blue-950/10',
      tagColor: 'text-blue-400',
      description: 'Techfest climbs to spectacular summits, securing its position as Asia’s premier science & tech festival. Featuring massive drone swarm formations, planetary rovers, autonomous systems, and strategic international research summits.',
      highlights: [
        'Massive multi-UAV light-show choreographies.',
        'Deep-tech workshops on generative models and AI agents.',
        'High-altitude drone racing and rover navigation tests.'
      ],
      systemMetrics: {
        'Processor Speed': '5.2 GigaHz OctaCore',
        'Storage System': 'Cloud Serverless Grid',
        'Net Connectivity': '5G Multi-Gigabit'
      }
    },
    {
      id: 'future' as EraId,
      year: '2050',
      title: 'METAVERSE QUANTUM CORE',
      audience: '1,80,000+',
      theme: 'COSMIC CYAN & ROSE',
      borderClass: 'border-[#00f5ff]/40 bg-cyan-950/10',
      tagColor: 'text-[#00f5ff]',
      description: 'The spatial physical limits of IIT Bombay collapse entirely. Global participants connect through fully synchronized mental linkages to shape Mars terraforming operations, control fusion reactors, and articulate quantum neural communication meshes.',
      highlights: [
        'Autonomous mechatronic fables working with micron scale.',
        'Virtual low earth orbit space rocket launch coordination decks.',
        'Entangled quantum mainframe swapping vectors in zero-latency.'
      ],
      systemMetrics: {
        'Processor Speed': 'Quantum Coherent Swaps',
        'Storage System': 'Entangled Coral Matrix',
        'Net Connectivity': 'Tachyon Grid Zero-Latency'
      }
    }
  ];

  const currentEra = eras.find(e => e.id === activeEra)!;

  // Sound triggering functions wrapped safely
  const triggerClickSound = () => audioEngine.playClick();
  const triggerSpaceSound = () => audioEngine.playSpace();
  const triggerRobotSound = () => audioEngine.playRobot();
  const triggerQuantumSound = () => audioEngine.playQuantum();

  const handleEraClick = (id: EraId) => {
    triggerClickSound();
    setActiveEra(id);
    if (id === 'past') {
      setDecryptProgress(0);
    } else if (id === 'present') {
      setIsPlayingSynth(false);
    } else if (id === 'future') {
      triggerQuantumSound();
    }
  };

  const handleDecryptClick = () => {
    triggerRobotSound();
    if (decryptProgress < 100) {
      setDecryptProgress(prev => Math.min(100, prev + 25));
    }
  };

  const handleQuantumEntangleClick = () => {
    triggerQuantumSound();
    setNeuralQuantumSwaps(prev => prev + 152);
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 bg-[#020204]/94 z-50 flex items-center justify-center p-3">
      <div className="w-full max-w-4xl h-[86vh] border border-[#00f5ff]/25 bg-[#030307] flex flex-col justify-between overflow-hidden relative shadow-[0_0_40px_rgba(0,245,255,0.15)]">
        
        {/* Scanned Neon line top effect */}
        <div className="absolute inset-x-0 h-[1.5px] bg-[#00f5ff]/35 top-0 anim-laser-sweep pointer-events-none"></div>

        {/* MODAL HEADER BLOCK */}
        <div className="border-b border-slate-850 p-4 flex justify-between items-center bg-black/40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-none border border-[#00f5ff]/30 flex items-center justify-center bg-black/40">
              <Clock className="text-[#00f5ff] animate-pulse" size={16} />
            </div>
            <div>
              <span className="text-[9px] font-mono text-[#f43f5e] tracking-widest font-black block uppercase leading-none">
                CHRONOS_VECT // TIMELINE_DEPT
              </span>
              <h1 className="text-lg md:text-xl font-display font-black tracking-wider text-white">
                TECHFEST HISTORICAL PORTAL
              </h1>
            </div>
          </div>

          <button
            onClick={() => { triggerClickSound(); onClose(); }}
            className="px-4 py-2 border border-[#00f5ff]/25 text-[#00f5ff] hover:text-white hover:border-[#00f5ff] font-mono text-[10.5px] tracking-wider uppercase flex items-center gap-2 cursor-pointer transition-colors"
          >
            Close Portal <X size={14} />
          </button>
        </div>

        {/* ACTIVE ERA DOCK DOCK TABS MENUS */}
        <div className="flex flex-col justify-center bg-black/60 p-4 border-b border-slate-850">
          
          <div className="text-center mb-3">
            <span className="font-mono text-[9.5px] text-slate-500 uppercase tracking-widest font-bold">
              TAP OR TOGGLE TIMELINE LANDMARK POINTS:
            </span>
          </div>

          {/* Interactive slider line with nodes */}
          <div className="relative w-full max-w-xl mx-auto flex justify-between items-center h-12">
            
            {/* Horizontal line backdrop */}
            <div className="absolute inset-x-0 h-[1px] bg-slate-850 z-0"></div>
            <div 
              className="absolute left-0 h-[1.5px] bg-[#00f5ff] z-0 transition-all duration-500"
              style={{
                width: activeEra === 'past' ? '0%' : activeEra === 'present' ? '50%' : '100%'
              }}
            ></div>

            {/* Past Node 1998 */}
            <button 
              onClick={() => handleEraClick('past')}
              className="relative z-10 flex flex-col items-center group cursor-pointer"
            >
              <div 
                className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-300 ${
                  activeEra === 'past' 
                    ? 'bg-amber-500/10 border-amber-500 text-amber-500 shadow-[0_0_15px_#f59e0b]' 
                    : 'bg-[#030307] border-slate-800 text-slate-500 group-hover:border-slate-500 group-hover:text-amber-500'
                }`}
              >
                19
              </div>
              <span className={`text-[10px] font-mono mt-1 font-bold ${activeEra === 'past' ? 'text-amber-500' : 'text-slate-500'}`}>1998</span>
            </button>

            {/* Present Node 2026 */}
            <button 
              onClick={() => handleEraClick('present')}
              className="relative z-10 flex flex-col items-center group cursor-pointer"
            >
              <div 
                className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-300 ${
                  activeEra === 'present' 
                    ? 'bg-blue-500/10 border-blue-500 text-blue-400 shadow-[0_0_15px_#3b82f6]' 
                    : 'bg-[#030307] border-slate-800 text-slate-500 group-hover:border-slate-500 group-hover:text-blue-400'
                }`}
              >
                20
              </div>
              <span className={`text-[10px] font-mono mt-1 font-bold ${activeEra === 'present' ? 'text-blue-400' : 'text-slate-500'}`}>2026</span>
            </button>

            {/* Future Node 2050 */}
            <button 
              onClick={() => handleEraClick('future')}
              className="relative z-10 flex flex-col items-center group cursor-pointer"
            >
              <div 
                className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-300 ${
                  activeEra === 'future' 
                    ? 'bg-[#00f5ff]/10 border-[#00f5ff] text-[#00f5ff] shadow-[0_0_15px_#00f5ff]' 
                    : 'bg-[#030307] border-slate-800 text-slate-500 group-hover:border-slate-500 group-hover:text-[#00f5ff]'
                }`}
              >
                50
              </div>
              <span className={`text-[10px] font-mono mt-1 font-bold ${activeEra === 'future' ? 'text-[#00f5ff]' : 'text-slate-500'}`}>2050</span>
            </button>

          </div>

        </div>

        {/* ERA DETAILS CONTENT VIEW */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#030307]">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Primary Era data panel */}
            <div className="md:col-span-8 space-y-4">
              
              <div className="flex items-baseline gap-3">
                <h2 className="font-display font-black text-4xl text-white tracking-wider uppercase leading-none">
                  {currentEra.year}
                </h2>
                <span className={`font-mono text-sm uppercase tracking-widest font-black ${currentEra.tagColor}`}>
                  // {currentEra.title}
                </span>
              </div>

              <div className={`p-4 border ${currentEra.borderClass} tracking-wide leading-relaxed text-slate-300 text-xs md:text-sm font-light`}>
                {currentEra.description}
              </div>

              {/* Highlights bento bullets */}
              <div className="space-y-2 pt-1">
                <span className={`font-mono text-[9.5px] uppercase tracking-wider font-bold block ${currentEra.tagColor}`}>
                  CHRONOS KEY PERFORMANCE MILESTONES:
                </span>
                
                <ul className="space-y-2 text-xs text-slate-300 pl-4 list-disc font-light font-sans">
                  {currentEra.highlights.map((hlt, hi) => (
                    <li key={hi} className="leading-relaxed">{hlt}</li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Sidebar metrics list & custom interactive widget */}
            <div className="md:col-span-4 space-y-4">
              
              {/* Telemetry specs card */}
              <div className="border border-slate-850 p-4 bg-black/40 space-y-3 font-mono text-[10.5px]">
                <span className="text-slate-500 uppercase text-[9px] font-bold block">SYS_SPEC_READOUTS:</span>

                {Object.entries(currentEra.systemMetrics).map(([k, v]) => (
                  <div key={k} className="flex justify-between py-1 border-b border-slate-900 leading-snug">
                    <span className="text-slate-400">{k}:</span>
                    <span className="text-white font-bold">{v}</span>
                  </div>
                ))}

                <div className="flex justify-between pt-1">
                  <span className="text-slate-400">AUDIENCE LOGS:</span>
                  <span className="text-[#f43f5e] font-bold">{currentEra.audience}</span>
                </div>
              </div>

              {/* INTERACTIVE COMPONENT PLAYGROUND SPECIFIC FOR EACH ERA */}
              {activeEra === 'past' && (
                <div className="p-4 border border-amber-500/20 bg-amber-950/5 space-y-3 text-center">
                  <span className="font-mono text-[9px] text-amber-500 uppercase block font-bold">1998_ROBOT_DECRYPTOR:</span>
                  <p className="text-[10px] text-slate-400 leading-snug">Tap core keys to fire mainframe bypass decoders to load old databases files.</p>
                  
                  <div className="flex gap-2 justify-center items-center py-1">
                    <button
                      onClick={handleDecryptClick}
                      disabled={decryptProgress >= 100}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-black font-mono font-black text-[10.5px] uppercase cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
                    >
                      Fire Decryptor
                    </button>
                    <span className="font-mono text-xs text-amber-500">{decryptProgress}%</span>
                  </div>

                  <div className="w-full bg-slate-900 h-1.5 rounded overflow-hidden">
                    <div className="bg-amber-500 h-full transition-all duration-300" style={{ width: `${decryptProgress}%` }}></div>
                  </div>
                  
                  {decryptProgress >= 100 && (
                    <span className="font-mono text-[8px] text-[#22c55e] block blink uppercase">SUCCESS: Old Core DB linked successfully!</span>
                  )}
                </div>
              )}

              {activeEra === 'present' && (
                <div className="p-4 border border-blue-500/20 bg-blue-950/5 space-y-3 text-center">
                  <span className="font-mono text-[9px] text-blue-400 uppercase block font-bold">2026_DRONE_AUDIO_GRID:</span>
                  <p className="text-[10px] text-slate-400 leading-snug">Fire standard 5G mechatronic audio synthesizers to hear real-time flight frequencies.</p>
                  
                  <button
                    onClick={() => { triggerRobotSound(); setIsPlayingSynth(!isPlayingSynth); }}
                    className={`w-full py-2 font-mono text-[10px] uppercase font-black cursor-pointer flex items-center justify-center gap-1.5 ${
                      isPlayingSynth ? 'bg-blue-500 text-black shadow-[0_0_10px_rgba(59,130,246,0.3)]' : 'border border-blue-500/35 text-blue-400'
                    }`}
                  >
                    <Volume2 size={12} className={isPlayingSynth ? 'animate-bounce' : ''} />
                    {isPlayingSynth ? 'DISCONNECT GRID SYNC' : 'SYNC AUDIO STREAMS'}
                  </button>

                  {isPlayingSynth && (
                    <div className="flex gap-[2px] justify-center items-end h-4 mt-2">
                      {[12, 28, 8, 22, 16, 32, 6, 18].map((h, i) => (
                        <div 
                          key={i} 
                          className="w-[2px] bg-blue-400 transition-all duration-200 animate-pulse" 
                          style={{ height: `${h}%`, animationDelay: `${i * 120}ms` }}
                        ></div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeEra === 'future' && (
                <div className="p-4 border border-[#00f5ff]/25 bg-cyan-950/5 space-y-3 text-center">
                  <span className="font-mono text-[9px] text-[#00f5ff] uppercase block font-bold">2050_NEURAL_MESH_ENTANGLER:</span>
                  <p className="text-[10px] text-slate-400 leading-snug">Perform quick neural quantum entanglement swaps across cyber platforms limits.</p>
                  
                  <button
                    onClick={handleQuantumEntangleClick}
                    className="w-full py-2 bg-[#00f5ff] hover:bg-white text-black font-mono text-[10px] uppercase font-black tracking-wider cursor-pointer"
                  >
                    Entangle Mainframe Swap
                  </button>
                  <div className="flex justify-between font-mono text-[8px] text-slate-500 pt-1">
                    <span>SWAP POOLS: COHERE</span>
                    <span>FLUX: {neuralQuantumSwaps} HZ</span>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>

        {/* BOTTOM METRIC RAIL FOOTER */}
        <div className="border-t border-slate-850 p-3 bg-black/40 flex justify-between items-center font-mono text-[9px] text-slate-500">
          <span>PORTAL_TIME: 2050.12.14 // REGION_INDIA // PORTALS_HEALTHY</span>
          <span>CRAFTED FOR IIT BOMBAY CERTIFICATIONS</span>
        </div>

      </div>
    </div>
  );
}
