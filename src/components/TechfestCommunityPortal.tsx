/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Shield, Terminal, Database, Activity, CheckCircle, Sliders, ChevronRight } from 'lucide-react';
import { audioEngine } from './AudioEngine';

interface TechfestCommunityPortalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdminAction?: (actionId: string, value: any) => void;
  bookmarkedEvents?: string[];
  toggleBookmark?: (eventId: string) => void;
}

export default function TechfestCommunityPortal({ 
  isOpen, 
  onClose, 
  onAdminAction, 
  bookmarkedEvents = [], 
  toggleBookmark 
}: TechfestCommunityPortalProps) {
  // Login credentials state
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<{
    email: string;
    role: string;
    tier: string;
    clearance: string;
    registrations: string[];
  } | null>(null);

  // Sign up fields
  const [isSignup, setIsSignup] = useState<boolean>(false);
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '', role: 'Student' });

  // Admin interface settings
  const [gridEnergy, setGridEnergy] = useState<number>(85);
  const [coolingSystemActive, setCoolingSystemActive] = useState<boolean>(true);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    audioEngine.playQuantum();

    const em = credentials.email.trim().toLowerCase();
    const pw = credentials.password;

    if (em === 'student@techfest.com' && pw === 'Student123') {
      setCurrentUser({
        email: em,
        role: 'Student / Participant',
        tier: 'Gold Core',
        clearance: 'Level 2 Authorization',
        registrations: ['meshmesh', 'ai_synapse']
      });
      setIsLoggedIn(true);
    } else if (em === 'admin@techfest.com' && pw === 'Admin123') {
      setCurrentUser({
        email: em,
        role: 'Organizer / Commander',
        tier: 'Platinum Overload',
        clearance: 'Level 5 Full Ingress',
        registrations: ['ai_synapse', 'deep_mind', 'quantum_crypto']
      });
      setIsLoggedIn(true);
    } else {
      // Default auto guest profile creation to maintain a flawless user flow!
      setCurrentUser({
        email: em || 'guest_telemetry@crypt.io',
        role: 'System Explorer',
        tier: 'Standard Bronze Access',
        clearance: 'Level 1 Gate Ingress',
        registrations: []
      });
      setIsLoggedIn(true);
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    audioEngine.playQuantum();
    
    // Auto-create newly registered node
    setCurrentUser({
      email: signupData.email || 'new_node@crypt.net',
      role: signupData.role + ' / Recruit',
      tier: 'Standard Bronze Access',
      clearance: 'Level 1 Gate Ingress',
      registrations: []
    });
    setIsLoggedIn(true);
  };

  const executeLogout = () => {
    audioEngine.playClick();
    setIsLoggedIn(false);
    setCurrentUser(null);
    setCredentials({ email: '', password: '' });
  };

  const triggerAdminEvent = (action: string, value: any) => {
    audioEngine.playQuantum();
    if (onAdminAction) {
      onAdminAction(action, value);
    }
    alert(`COMMAND BROADCAST: ${action.toUpperCase()} set to ${value === true ? 'ACTIVE' : value === false ? 'DISABLED' : value}`);
  };

  return (
    <div className="absolute inset-0 bg-[#020204]/96 z-50 flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="w-full max-w-4xl h-[85vh] border border-[#00f5ff]/25 bg-black/95 relative flex flex-col overflow-hidden shadow-[0_0_55px_rgba(0,245,255,0.15)]">
        
        {/* Scanned Neon line top effect */}
        <div className="absolute inset-x-0 h-[2px] bg-[#00f5ff] top-0 pointer-events-none anim-laser-sweep"></div>

        {/* Modal Header */}
        <div className="border-b border-slate-850 p-4 flex justify-between items-center bg-black/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded border border-purple-500/35 flex items-center justify-center text-purple-400 font-bold font-mono text-xs">
              C
            </div>
            <div>
              <span className="text-[9px] font-mono text-[#f43f5e] tracking-widest font-black block uppercase leading-none">
                IITB_SECURITY_NODES // CENTRAL_CRYPTON
              </span>
              <h2 className="text-base md:text-xl font-display font-black tracking-wider text-white">
                TECHFEST COMMUNITY GENERAL PORTAL
              </h2>
            </div>
          </div>

          <button
            onClick={() => { audioEngine.playClick(); onClose(); }}
            className="px-4 py-2 border border-[#00f5ff]/25 text-[#00f5ff] hover:text-white hover:border-[#00f5ff] font-mono text-[10.5px] tracking-wider uppercase flex items-center gap-2 cursor-pointer transition-colors"
          >
            Collapse Hub <X size={14} />
          </button>
        </div>

        {/* Inner Content Block */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#030307]">
          
          {!isLoggedIn ? (
            <div className="h-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column: Cyberpunk Welcome info */}
              <div className="lg:col-span-5 space-y-4 font-mono text-left">
                <span className="text-[10px] text-[#00f5ff] font-bold block uppercase tracking-widest">
                  [ CENTRAL GATEWAY LINK ]
                </span>
                <h3 className="font-display font-black text-2xl md:text-3xl text-white uppercase tracking-wider leading-none">
                  AUTHENTICATED INTERACTION
                </h3>
                <p className="font-sans text-xs text-slate-450 leading-relaxed font-light">
                  Align and login with your secure node signature parameters to track registered competitions, save event parameters, and check security clearance indexes.
                </p>

                <div className="bg-slate-950/40 border border-slate-850 p-4 space-y-2 text-[10.5px]">
                  <span className="text-slate-400 font-bold block">[ PUBLIC PROTOCOL CREDENTIALS ]</span>
                  <div className="flex justify-between">
                    <span>Student Node signature:</span>
                    <span className="text-[#00f5ff]">student@techfest.com / Student123</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Commander Command:</span>
                    <span className="text-[#f43f5e]">admin@techfest.com / Admin123</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Portal form inputs */}
              <div className="lg:col-span-7 border border-slate-850 bg-black/40 p-5 md:p-8 relative">
                
                {/* Visual laser scanner bar */}
                <div className="absolute inset-x-0 h-[1.5px] bg-[#a855f7]/30 top-0 anim-laser-sweep pointer-events-none"></div>

                {!isSignup ? (
                  // Login Screen
                  <form onSubmit={handleLoginSubmit} className="space-y-4 font-mono text-[11px]">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-slate-400 uppercase font-black">LOGIN RECIPIENT MAIN</span>
                      <button 
                        type="button" 
                        onClick={() => { audioEngine.playClick(); setIsSignup(true); }}
                        className="text-purple-400 font-bold hover:underline"
                      >
                        Request New Node (Signup)
                      </button>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-slate-400 uppercase">Comm ID (Email Address):</label>
                      <input 
                        type="email"
                        required
                        value={credentials.email}
                        onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                        className="w-full bg-black border border-slate-800 px-3 py-2 text-white placeholder-slate-700 font-sans text-xs outline-none focus:border-purple-500"
                        placeholder="yourname@node.com"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-slate-400 uppercase">Pass phrase Key:</label>
                      <input 
                        type="password"
                        required
                        value={credentials.password}
                        onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                        className="w-full bg-black border border-slate-800 px-3 py-2 text-white placeholder-slate-700 font-sans text-xs outline-none focus:border-purple-500"
                        placeholder="••••••••••••"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-[#a855f7] text-white font-display font-black text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-colors cursor-pointer"
                    >
                      Authenticate Signature Core
                    </button>
                  </form>
                ) : (
                  // Signup Screen
                  <form onSubmit={handleSignupSubmit} className="space-y-4 font-mono text-[11px]">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-slate-400 uppercase font-bold">CONFIGURE COGNITIVE SIGNATURE (SIGN UP)</span>
                      <button 
                        type="button" 
                        onClick={() => { audioEngine.playClick(); setIsSignup(false); }}
                        className="text-purple-400 font-bold hover:underline"
                      >
                        Bypass to Log In
                      </button>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-slate-400 uppercase">Participant Identity Name:</label>
                      <input 
                        type="text"
                        required
                        value={signupData.name}
                        onChange={(e) => setSignupData({...signupData, name: e.target.value})}
                        className="w-full bg-black border border-slate-800 px-3 py-2 text-white placeholder-slate-700 font-sans text-xs outline-none focus:border-purple-500"
                        placeholder="e.g. Athena Croft"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-slate-400 uppercase">Interface Email:</label>
                      <input 
                        type="email"
                        required
                        value={signupData.email}
                        onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                        className="w-full bg-black border border-slate-800 px-3 py-2 text-white placeholder-slate-700 font-sans text-xs outline-none focus:border-purple-500"
                        placeholder="athena@decrypted.net"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-slate-400">Mainframe role clearings:</label>
                      <select 
                        value={signupData.role}
                        onChange={(e) => setSignupData({...signupData, role: e.target.value})}
                        className="w-full bg-black border border-slate-800 px-3 py-2 text-slate-300 font-sans text-xs outline-none focus:border-purple-500"
                      >
                        <option>Student</option>
                        <option>Participant</option>
                        <option>Visitor</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-purple-650 text-white font-display font-black text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-colors cursor-pointer"
                    >
                      Initialize Node Token Link
                    </button>
                  </form>
                )}

              </div>

            </div>
          ) : (
            // User Dashboard and Admin Command Core
            <div className="h-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-mono text-[11px]">
              
              {/* Left Details Panel */}
              <div className="lg:col-span-5 space-y-4">
                <div className="border border-slate-800 bg-black/40 p-5 space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-850 pb-2">
                    <span className="text-[#00f5ff] font-bold">USER_PROFILE_CARD</span>
                    <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping"></span>
                  </div>

                  <div className="space-y-2 text-slate-300">
                    <div>
                      <span className="text-[8.5px] text-slate-500 block uppercase font-bold">COMM_NODE_ADDRESS:</span>
                      <span className="text-white text-xs">{currentUser?.email}</span>
                    </div>

                    <div>
                      <span className="text-[8.5px] text-slate-500 block uppercase font-bold">COOPERATIVE ACCESS LEVEL:</span>
                      <span className="text-purple-400 font-bold">{currentUser?.role}</span>
                    </div>

                    <div>
                      <span className="text-[8.5px] text-slate-500 block uppercase font-bold">CLEARANCE THRESHOLD:</span>
                      <span className="text-slate-100 font-bold">{currentUser?.clearance}</span>
                    </div>
                  </div>

                  <button
                    onClick={executeLogout}
                    className="w-full mt-4 py-2 border border-slate-850 hover:bg-red-500/20 hover:text-red-300 text-slate-400 transition-colors cursor-pointer"
                  >
                    Bypass / Logout Node
                  </button>
                </div>

                {/* Saved Bookmarks events lists */}
                <div className="border border-slate-850 bg-black/20 p-4 space-y-3">
                  <span className="text-slate-400 font-black block border-b border-slate-850 pb-1 uppercase">
                    Saved Events Bookmarks ({bookmarkedEvents.length})
                  </span>
                  {bookmarkedEvents.length === 0 ? (
                    <span className="text-slate-500 text-[10px] block leading-relaxed uppercase">
                      Open the Events Arena page on the top bar and bookmark dossiers to save here.
                    </span>
                  ) : (
                    <ul className="space-y-1.5 text-xs text-slate-300 max-h-[140px] overflow-y-auto">
                      {bookmarkedEvents.map(evId => (
                        <li key={evId} className="flex justify-between items-center p-1.5 bg-black/40 border border-slate-900">
                          <span>{evId.toUpperCase()}</span>
                          <button
                            onClick={() => { audioEngine.playClick(); if (toggleBookmark) toggleBookmark(evId); }}
                            className="text-[#f43f5e] font-bold hover:underline"
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Right: Interface specific blocks depending on Role */}
              <div className="lg:col-span-7 space-y-4">
                
                {/* Admin/Commander Panel */}
                {currentUser?.email === 'admin@techfest.com' ? (
                  <div className="border border-red-500/30 bg-red-950/5 p-6 relative space-y-4">
                    <div className="absolute top-0 right-0 p-1 px-2.5 bg-red-500 text-black text-[8px] font-black uppercase">
                      CMDER_ACCESS_ENABLED
                    </div>
                    
                    <div className="flex items-center gap-2 text-red-400 uppercase font-black">
                      <Sliders size={14} className="text-red-500" /> Command General Mainframe Orbits
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed font-sans">
                      Logged in as chief general commander of the Techfest 2050 framework. You can trigger physical parameter changes on the main live canvas grids.
                    </p>

                    <div className="space-y-3 pt-2">
                      <div className="p-3 bg-black/40 border border-slate-850 flex items-center justify-between">
                        <div>
                          <span className="font-bold text-slate-200 block">DENSE GRID POWER OVERLOAD</span>
                          <span className="text-[9px] text-slate-505 block leading-tight">Artificially double energy parameters in the Cyber Metropolis.</span>
                        </div>
                        <button
                          onClick={() => triggerAdminEvent('grid_overload', true)}
                          className="px-4 py-1.5 bg-red-650 hover:bg-red-500 text-white text-[10px] uppercase cursor-pointer"
                        >
                          Trigger Overload
                        </button>
                      </div>

                      <div className="p-3 bg-black/40 border border-slate-850 flex items-center justify-between">
                        <div>
                          <span className="font-bold text-slate-200 block">COOLING CONDUITS COOLER</span>
                          <span className="text-[9px] text-slate-505 block leading-tight">Force stabilization over high joints temperature in Robotics Lab.</span>
                        </div>
                        <button
                          onClick={() => triggerAdminEvent('force_stabilize', true)}
                          className="px-4 py-1.5 bg-[#00f5ff] text-black text-[10px] uppercase font-bold cursor-pointer"
                        >
                          Cool Matrix
                        </button>
                      </div>
                    </div>

                    <div className="p-3.5 bg-slate-950/60 border border-slate-850 text-[10.5px] leading-snug">
                      <span className="text-slate-450 block uppercase font-bold mb-1">COMMAND PROTOCOL LOG:</span>
                      <div className="text-[9px] text-green-400 font-mono tracking-wider">• [AUGHT_22] GigaNet nodes verified standard.</div>
                      <div className="text-[9px] text-green-400 font-mono tracking-wider">• [AUGHT_30] Aerial Drone formation streams in synch.</div>
                    </div>
                  </div>
                ) : (
                  // Student/Participant dashboard view
                  <div className="border border-slate-800 bg-black/45 p-6 relative space-y-4">
                    <div className="absolute top-0 right-0 p-1 px-2.5 bg-purple-500 text-black text-[8px] font-black uppercase">
                      STUDENT_NODE
                    </div>

                    <div className="flex gap-2 items-center text-purple-400 font-bold uppercase mb-2">
                      <Database size={14} /> Registered Competitions Arena dossier
                    </div>

                    <p className="text-xs text-slate-450 leading-relaxed font-sans font-light">
                      Track the dynamic qualifiers phases of registered events below. Check timeline logs on chronos system.
                    </p>

                    <div className="space-y-3.5 text-xs font-sans">
                      <div className="p-3 border border-[#00f5ff]/20 bg-[#00f5ff]/5 flex justify-between items-center">
                        <div className="font-mono text-[11px]">
                          <span className="text-[#00f5ff] font-bold uppercase block leading-none mb-1">MESH-MADNESS 3.0 // AUTONOMOUS_UAV</span>
                          <span className="text-[9px] text-slate-400 uppercase tracking-widest block font-sans">Qualifiers phase is: DEC 14, 2050</span>
                        </div>
                        <span className="px-2 py-1 bg-yellow-950 text-yellow-400 font-mono text-[10px] rounded uppercase">CALIBRATING</span>
                      </div>

                      <div className="p-3 border border-purple-500/20 bg-purple-950/5 flex justify-between items-center">
                        <div className="font-mono text-[11px]">
                          <span className="text-[#c084fc] font-bold uppercase block leading-none mb-1">SYNAPSE NET HACKATHON // CHIP_INTELLIGENCE</span>
                          <span className="text-[9px] text-slate-400 uppercase tracking-widest block font-sans">Qualifiers phase is: DEC 14-16, 2050</span>
                        </div>
                        <span className="px-2 py-1 bg-green-950 text-green-400 font-mono text-[10px] rounded uppercase">NOMINAL_ARMED</span>
                      </div>
                    </div>

                    <div className="bg-slate-950/40 p-4 border border-slate-850 font-mono text-[10px] leading-snug">
                      <span className="font-bold text-slate-400 uppercase block mb-1">AUTOMATED MAIN DECRYPTER SUGGESTION:</span>
                      To register for additional competitive arenas, enter the <span className="text-[#00f5ff]">Events Arena</span>, read parameters specifications, and select "Register".
                    </div>
                  </div>
                )}

              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
