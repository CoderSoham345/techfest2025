/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Activity, Shield, Cpu, Zap, Globe, Award, Sparkles, Radio } from 'lucide-react';

export default function TechfestFuturisticStats() {
  const [participants, setParticipants] = useState(172400);
  const [countries, setCountries] = useState(10);
  const [competitions, setCompetitions] = useState(110);
  const [workshops, setWorkshops] = useState(80);
  const [isFullySynched, setIsFullySynched] = useState(false);

  // Animate counter values to simulate live futuristic ticking counters when loaded
  useEffect(() => {
    let tickCount = 0;
    const interval = setInterval(() => {
      tickCount++;

      setParticipants(prev => {
        if (prev >= 180000) return 180000;
        return prev + Math.floor(Math.random() * 850) + 400;
      });

      setCountries(prev => {
        if (prev >= 60) return 60;
        return prev + (Math.random() > 0.4 ? 2 : 1);
      });

      setCompetitions(prev => {
        if (prev >= 150) return 150;
        return prev + (Math.random() > 0.5 ? 2 : 1);
      });

      setWorkshops(prev => {
        if (prev >= 120) return 120;
        return prev + (Math.random() > 0.5 ? 2 : 1);
      });

      if (tickCount > 25) {
        setIsFullySynched(true);
        clearInterval(interval);
      }
    }, 120);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="border border-[#00f5ff]/15 bg-black/45 p-4 space-y-4">
      
      {/* HUD status line */}
      <div className="flex justify-between items-center border-b border-slate-850 pb-2">
        <span className="font-mono text-[9px] text-slate-500 flex items-center gap-1.5 uppercase font-bold">
          <Activity size={11} className="text-[#f43f5e] animate-pulse" /> CORE_LIVE_METRICS
        </span>
        <span className={`font-mono text-[8.5px] uppercase ${isFullySynched ? 'text-[#10b981]' : 'text-[#f43f5e] animate-pulse'}`}>
          {isFullySynched ? '● FULLY_SYNCHED' : '⟳ CODES_DECRYPTING'}
        </span>
      </div>

      {/* Grid counters blocks */}
      <div className="grid grid-cols-2 gap-3">
        
        {/* Metric 1: Participants */}
        <div className="border border-slate-850 bg-black/20 p-2.5 flex flex-col justify-between">
          <div className="flex justify-between items-center text-slate-500 font-mono text-[8.5px]">
            <span>PARTICIPANTS</span>
            <Radio size={10} className="text-[#00f5ff] animate-pulse" />
          </div>
          <div className="font-display font-black text-white text-base md:text-lg mt-1 tracking-wider leading-none">
            {participants.toLocaleString()}+
          </div>
          <span className="text-[7.5px] font-mono text-[#00f5ff] uppercase mt-1 leading-none">Global Swarm Coords</span>
        </div>

        {/* Metric 2: Countries */}
        <div className="border border-slate-850 bg-black/20 p-2.5 flex flex-col justify-between">
          <div className="flex justify-between items-center text-slate-500 font-mono text-[8.5px]">
            <span>COUNTRIES</span>
            <Globe size={10} className="text-[#a855f7]" />
          </div>
          <div className="font-display font-black text-white text-base md:text-lg mt-1 tracking-wider leading-none">
            {countries}+
          </div>
          <span className="text-[7.5px] font-mono text-[#a855f7] uppercase mt-1 leading-none">Sovereign Regions</span>
        </div>

        {/* Metric 3: Competitions */}
        <div className="border border-slate-850 bg-black/20 p-2.5 flex flex-col justify-between">
          <div className="flex justify-between items-center text-slate-500 font-mono text-[8.5px]">
            <span>COMPETITIONS</span>
            <Award size={10} className="text-[#ea580c]" />
          </div>
          <div className="font-display font-black text-white text-base md:text-lg mt-1 tracking-wider leading-none">
            {competitions}+
          </div>
          <span className="text-[7.5px] font-mono text-[#ea580c] uppercase mt-1 leading-none">Post-Quantum arenas</span>
        </div>

        {/* Metric 4: Workshops */}
        <div className="border border-slate-850 bg-black/20 p-2.5 flex flex-col justify-between">
          <div className="flex justify-between items-center text-slate-500 font-mono text-[8.5px]">
            <span>WORKSHOPS</span>
            <Sparkles size={10} className="text-[#22c55e]" />
          </div>
          <div className="font-display font-black text-white text-base md:text-lg mt-1 tracking-wider leading-none">
            {workshops}+
          </div>
          <span className="text-[7.5px] font-mono text-[#22c55e] uppercase mt-1 leading-none">Core lab certifications</span>
        </div>

      </div>

    </div>
  );
}
