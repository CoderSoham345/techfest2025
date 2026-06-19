/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, CheckCircle, Shield, Award, Terminal, Play, HelpCircle } from 'lucide-react';
import { audioEngine } from './AudioEngine';

interface TechfestPassesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TechfestPassesModal({ isOpen, onClose }: TechfestPassesModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    institute: '',
    passType: 'student' as 'student' | 'pro' | 'vip'
  });

  const [isBooked, setIsBooked] = useState<boolean>(false);
  const [ticketId, setTicketId] = useState<string>('');

  const passesMeta = {
    student: {
      name: 'GATEWAY STUDENT PASS',
      price: 'INR 499',
      clearance: 'Level 1 Decryption',
      privileges: [
        'Access to AI Zone and Robotics Lab on-campus',
        'Eligibility for standard Hackathons challenges',
        'Standard student certification'
      ],
      color: 'border-l-indigo-500 text-indigo-400 bg-indigo-950/10'
    },
    pro: {
      name: 'INTERSTELLAR PRO PASS',
      price: 'INR 1,299',
      clearance: 'Level 3 Quantum Shielding',
      privileges: [
        'All Student privileges included',
        'Priority seating inside Aerospace Node',
        'Reserved entrance for Gaming & esports finals',
        'Limited edition Holographic Badge'
      ],
      color: 'border-l-[#00f5ff] text-[#00f5ff] bg-cyan-950/10'
    },
    vip: {
      name: 'MAINFRAME COMMANDER VIP',
      price: 'INR 2,999',
      clearance: 'Level 5 General Overlord',
      privileges: [
        'Supreme priority entry to all 7 dimensions',
        'Exclusive access to VIP networking pods and speaker lounges',
        'Front row reservations on-stage',
        'Private drone swarms choreography control'
      ],
      color: 'border-l-fuchsia-500 text-fuchsia-400 bg-fuchsia-950/10'
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    audioEngine.playQuantum();

    if (!formData.name || !formData.email || !formData.institute) {
      alert("All fields are required to align gateway credentials.");
      return;
    }

    const randomId = `IITB-TF50-${Math.floor(1000 + Math.random() * 9000)}-${formData.passType.toUpperCase()}`;
    setTicketId(randomId);
    setIsBooked(true);
  };

  const resetBookingForm = () => {
    audioEngine.playClick();
    setIsBooked(false);
    setFormData({
      name: '',
      email: '',
      institute: '',
      passType: 'student'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 bg-[#020204]/96 z-50 flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="w-full max-w-3xl border border-[#00f5ff]/25 bg-black/95 relative flex flex-col overflow-hidden shadow-[0_0_50px_rgba(0,245,255,0.2)]">
        
        {/* Swiping laser cap */}
        <div className="absolute inset-x-0 h-[2px] bg-[#00f5ff] top-0 pointer-events-none anim-laser-sweep"></div>

        {/* Modal Header */}
        <div className="border-b border-slate-850 p-4 flex justify-between items-center bg-black/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded border border-[#00f5ff]/35 flex items-center justify-center font-bold text-[#00f5ff] text-xs">
              P
            </div>
            <div>
              <span className="text-[9px] font-mono text-[#f43f5e] tracking-widest block font-black uppercase leading-none">
                IITB_META_PASSES // GRID_LOCK_OFF
              </span>
              <h2 className="text-base md:text-xl font-display font-black tracking-wider text-white">
                BUY ENTRY PASSES & CERTIFICATION CORES
              </h2>
            </div>
          </div>

          <button
            onClick={() => { audioEngine.playClick(); onClose(); }}
            className="px-4 py-2 border border-[#00f5ff]/25 text-[#00f5ff] hover:text-white hover:border-[#00f5ff] font-mono text-[10.5px] tracking-wider uppercase flex items-center gap-2 cursor-pointer transition-colors"
          >
            Exit Terminal <X size={14} />
          </button>
        </div>

        {/* Booking State Controller */}
        {!isBooked ? (
          <div className="p-4 md:p-8 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#030307]">
            
            {/* Left: Input details */}
            <form onSubmit={handleFormSubmit} className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2 font-mono text-[10px] text-[#00f5ff] uppercase tracking-wider mb-2">
                <Terminal size={12} /> SECURE_CREDENTIALS_ENTRY
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="block font-mono text-[10px] text-slate-400 uppercase">Participant Decryption Name:</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter full name"
                    className="w-full bg-black/60 border border-slate-800 focus:border-[#00f5ff] px-3.5 py-2.5 font-sans text-xs text-white placeholder-slate-600 outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-mono text-[10px] text-slate-400 uppercase">Comm Link Address (Email):</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="e.g. recruit@cognition.net"
                    className="w-full bg-black/60 border border-slate-800 focus:border-[#00f5ff] px-3.5 py-2.5 font-sans text-xs text-white placeholder-slate-600 outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-mono text-[10px] text-slate-400 uppercase">Cognitive Mainframe (Institute/College):</label>
                  <input
                    type="text"
                    required
                    value={formData.institute}
                    onChange={(e) => setFormData({...formData, institute: e.target.value})}
                    placeholder="IIT Bombay, etc."
                    className="w-full bg-black/60 border border-slate-800 focus:border-[#00f5ff] px-3.5 py-2.5 font-sans text-xs text-white placeholder-slate-600 outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Pass Choices */}
              <div className="space-y-2 pt-2">
                <label className="block font-mono text-[10px] text-slate-400 uppercase">SELECT CLEARANCE ACCESS TIER:</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['student', 'pro', 'vip'] as const).map((tier) => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => { audioEngine.playClick(); setFormData({...formData, passType: tier}); }}
                      className={`p-3 border-l-2 text-left cursor-pointer transition-all ${
                        formData.passType === tier 
                          ? passesMeta[tier].color + ' border border-slate-600' 
                          : 'border-slate-850 border border-slate-900 bg-black/20 text-slate-400 hover:border-slate-800'
                      }`}
                    >
                      <span className="font-display font-black text-[10px] block leading-tight">{tier.toUpperCase()} LEVEL</span>
                      <span className="font-mono text-[11px] font-bold mt-1 block">{passesMeta[tier].price}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#00f5ff] text-black font-display font-black text-xs tracking-widest uppercase hover:bg-white transition-all cursor-pointer shadow-[0_0_15px_rgba(0,245,255,0.35)] block"
              >
                PROCEED TO GATEWAY DECRYPTION
              </button>
            </form>

            {/* Right: Selected Pass specs privileges */}
            <div className="lg:col-span-5 border border-slate-800 bg-black/40 p-4 font-mono flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-[10px] text-[#f43f5e] font-black tracking-widest uppercase block border-b border-slate-850 pb-2">
                  [ TIER SPECIFICATION SHEET ]
                </span>
                
                <h3 className="font-display font-black text-sm text-white uppercase leading-snug">
                  {passesMeta[formData.passType].name}
                </h3>

                <div className="text-[11px] space-y-1.5 text-slate-400">
                  <div className="flex justify-between">
                    <span>CLEARANCE LAYER:</span>
                    <span className="text-white font-bold">{passesMeta[formData.passType].clearance}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>PRICE RATINGS:</span>
                    <span className="text-[#00f5ff] font-bold">{passesMeta[formData.passType].price}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-850">
                  <span className="text-[9.5px] text-slate-500 font-bold block uppercase">PRIVILEGE VECTOR CORES:</span>
                  <ul className="space-y-1 text-xs text-slate-300 font-sans font-light list-disc pl-4 leading-relaxed">
                    {passesMeta[formData.passType].privileges.map((priv, idx) => (
                      <li key={idx}>{priv}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="text-[10px] text-slate-500 leading-snug pt-4 border-t border-slate-850 flex gap-2 items-start mt-4">
                <HelpCircle size={14} className="text-indigo-400 flex-shrink-0 mt-0.5" />
                <span>Standard passes do not override active on-stage drone control systems during grand finale unless VIP parameters are logged.</span>
              </div>
            </div>

          </div>
        ) : (
          <div className="p-4 md:p-8 flex flex-col justify-center items-center text-center bg-[#030307]">
            
            {/* Holographic glowing check icon */}
            <div className="w-16 h-16 rounded-full border border-[#10b981]/50 bg-[#10b981]/10 flex items-center justify-center text-[#10b981] animate-bounce mb-4">
              <CheckCircle size={32} />
            </div>

            <h3 className="font-display font-black text-xl md:text-2xl text-white uppercase tracking-wider mb-2">
              GATE CREATION NOMINAL! AUTHENTICATING ID
            </h3>
            
            <p className="font-mono text-xs text-slate-450 max-w-md leading-relaxed mb-6">
              Your dimensional pass has been integrated onto our secure Bombay Blockchain Node. Access is armed automatically.
            </p>

            {/* HIGH FIDELITY NEON DIGITAL PASS CARD (Mock ticket) */}
            <div className="w-full max-w-md border border-slate-800 bg-black/80 relative font-mono text-[10.5px] p-6 text-left shadow-[0_0_30px_rgba(0,245,255,0.15)] select-text mb-6">
              {/* Scanline top */}
              <div className="absolute top-0 inset-x-0 h-[1.5px] bg-[#00f5ff] pointer-events-none anim-laser-sweep"></div>

              {/* Header logo & ticket code */}
              <div className="flex justify-between items-center border-b border-slate-850 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="font-display font-black text-xs text-[#00f5ff]">TF 2050</span>
                  <span className="px-1.5 py-0.5 bg-green-950 text-[#10b981] text-[8px] font-bold">SECURE_VERIFIED</span>
                </div>
                <span className="text-[#f43f5e] font-bold">{ticketId}</span>
              </div>

              {/* Main parameters grids */}
              <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-4 text-xs">
                <div>
                  <span className="text-[8.5px] text-slate-500 uppercase block">COMMANDER NAME:</span>
                  <span className="text-white font-bold uppercase">{formData.name}</span>
                </div>
                <div>
                  <span className="text-[8.5px] text-slate-500 uppercase block">COGNITIVE HUB:</span>
                  <span className="text-slate-300 font-bold truncate block">{formData.institute}</span>
                </div>
                <div>
                  <span className="text-[8.5px] text-slate-500 uppercase block">CLEARANCE TIER:</span>
                  <span className="text-[#00f5ff] font-black uppercase">{passesMeta[formData.passType].name}</span>
                </div>
                <div>
                  <span className="text-[8.5px] text-slate-500 uppercase block">ACCESS STATUS:</span>
                  <span className="text-[#10b981] font-bold animate-pulse">● GATE_ARMED</span>
                </div>
              </div>

              {/* Holographic QR code mockup */}
              <div className="border border-slate-800 bg-black/50 p-4 rounded-none flex items-center justify-between">
                <div>
                  <span className="text-[8.5px] text-slate-500 uppercase block">GATEWAY GRID ENCRYPT_KEY:</span>
                  <span className="text-[8.2px] font-mono select-none block max-w-[210px] truncate text-slate-400">
                    {ticketId.repeat(2)}.COGNITIVE.BOMBAY_SYS_NODES_KEY_VALID_0F
                  </span>
                </div>

                {/* Simulated high-tech custom neon QR grid */}
                <div className="w-12 h-12 bg-black border border-[#00f5ff]/35 p-1 flex flex-col justify-between select-none">
                  <div className="flex justify-between">
                    <div className="w-3.5 h-3.5 bg-[#00f5ff]"></div>
                    <div className="w-3.5 h-3.5 bg-black border border-[#00f5ff]"></div>
                  </div>
                  <div className="flex justify-between">
                    <div className="w-2.5 h-2.5 bg-black border border-[#00f5ff]"></div>
                    <div className="w-3.5 h-3.5 bg-[#00f5ff]"></div>
                  </div>
                </div>
              </div>

              {/* Coupon watermarks */}
              <div className="absolute right-4 bottom-4 opacity-5 pointer-events-none font-display font-black text-6xl text-slate-500">
                TF50
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
              <button
                onClick={() => { audioEngine.playClick(); alert("Pass coordinates exported to terminal successfully! Recipient: " + formData.email); }}
                className="flex-1 py-2.5 border border-[#00f5ff]/40 text-[#00f5ff] font-mono text-xs uppercase hover:text-white hover:border-[#00f5ff] cursor-pointer transition-colors"
              >
                Sync with Terminal
              </button>
              <button
                onClick={resetBookingForm}
                className="flex-1 py-2.5 bg-slate-900 border border-slate-800 hover:border-slate-500 text-slate-200 font-mono text-xs uppercase cursor-pointer"
              >
                Register Other Pass
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
