/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, X, Volume2, Shield, Eye, HelpCircle } from 'lucide-react';
import { audioEngine } from './AudioEngine';

interface TechfestTrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TechfestTrailerModal({ isOpen, onClose }: TechfestTrailerModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentCaption, setCurrentCaption] = useState<string>('INITIATING DIMENSIONAL TELEMETRY');
  const [timeProgress, setTimeProgress] = useState<number>(0); // 0 to 100
  const [activeFrame, setActiveFrame] = useState<string>('SYS_BOOT');

  useEffect(() => {
    if (!isOpen) return;

    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set dimensions
    canvas.width = 800;
    canvas.height = 450;

    let frameCount = 0;
    const scenes = [
      { start: 0, end: 15, caption: 'GATEWAY COMMENCEMENT // INJECTING BEAMS', frame: 'SYS_BOOT' },
      { start: 15, end: 40, caption: 'SECTOR AA_2050: THE COGNITIVE NEON AI CITY', frame: 'AI_CITY' },
      { start: 40, end: 65, caption: 'MECHATRONIC FAB: FLEXING BIO-SYNAPTIC FLEXORS', frame: 'ROBOTICS' },
      { start: 65, end: 85, caption: 'PLANETARY FRONTIER: ESCAPE ATMOSPHERE VECTOR', frame: 'SPACE' },
      { start: 85, end: 100, caption: 'QUANTUM REACH: THE MESH OF GENERAL COGNITION', frame: 'QUANTUM' }
    ];

    // Particles for cinematic effects
    const particles: Array<{ x: number; y: number; vx: number; vy: number; r: number; color: string; alpha: number }> = [];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3,
        r: 1 + Math.random() * 3,
        color: Math.random() > 0.4 ? '#00f5ff' : '#f43f5e',
        alpha: 0.3 + Math.random() * 0.7
      });
    }

    const drawSimulation = () => {
      if (isPlaying) {
        frameCount += 0.45;
        if (frameCount > 100) frameCount = 0; // loop
        setTimeProgress(frameCount);
      }

      // Identify active scene
      const activeScene = scenes.find(s => frameCount >= s.start && frameCount <= s.end) || scenes[0];
      setCurrentCaption(activeScene.caption);
      setActiveFrame(activeScene.frame);

      const w = canvas.width;
      const h = canvas.height;

      // Draw background
      ctx.fillStyle = '#020204';
      ctx.fillRect(0, 0, w, h);

      // Draw decorative camera grid/frame
      ctx.strokeStyle = 'rgba(0, 245, 255, 0.15)';
      ctx.lineWidth = 1;
      
      // Screen crosshair
      ctx.beginPath();
      ctx.moveTo(w / 2 - 15, h / 2);
      ctx.lineTo(w / 2 + 15, h / 2);
      ctx.moveTo(w / 2, h / 2 - 15);
      ctx.lineTo(w / 2, h / 2 + 15);
      ctx.stroke();

      // Top/bottom movie borders
      ctx.fillStyle = 'rgba(0, 0, 0, 0.95)';
      ctx.fillRect(0, 0, w, 40);
      ctx.fillRect(0, h - 45, w, 45);

      // Render drifting cinematic particles
      particles.forEach(p => {
        if (isPlaying) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 40 || p.y > h - 45) p.vy *= -1;
        }
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha * 0.45;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });

      // RENDER DETAILED SCENE WIREFRAMES
      if (activeScene.frame === 'SYS_BOOT') {
        // Draw rotating 3D looking geometric gate portal
        const t = frameCount * 0.15;
        ctx.strokeStyle = '#00f5ff';
        ctx.lineWidth = 1.5;
        
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, 70 + Math.sin(t) * 10, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = '#f43f5e';
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, 90 - Math.cos(t) * 15, 0, Math.PI * 2);
        ctx.stroke();

        // Radiating line bursts
        for (let j = 0; j < 8; j++) {
          const ang = (j / 8) * Math.PI * 2 + t * 0.5;
          ctx.beginPath();
          ctx.moveTo(w / 2 + Math.cos(ang) * 98, h / 2 + Math.sin(ang) * 98);
          ctx.lineTo(w / 2 + Math.cos(ang) * 130, h / 2 + Math.sin(ang) * 130);
          ctx.stroke();
        }
      } 
      else if (activeScene.frame === 'AI_CITY') {
        // Neon wireframe skyline skyscrapers scrolling
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 1.2;
        const scrollOffset = (frameCount - 15) * 6;

        for (let i = 0; i < 8; i++) {
          const xPos = ((i * 120 - scrollOffset) % (w + 120));
          const height = 110 + (Math.sin(i * 3) + 1.2) * 80;
          ctx.fillStyle = 'rgba(10, 20, 25, 0.7)';
          ctx.fillRect(xPos, h - 45 - height, 90, height);
          ctx.strokeRect(xPos, h - 45 - height, 90, height);

          // windows dots
          ctx.fillStyle = '#00f5ff';
          for (let r = 1; r < height / 25; r++) {
            ctx.fillRect(xPos + 25, h - 45 - height + r * 25, 5, 5);
            ctx.fillRect(xPos + 60, h - 45 - height + r * 25, 5, 5);
          }
        }
      }
      else if (activeScene.frame === 'ROBOTICS') {
        // Robotic mechanical gripper flex arm
        const t = frameCount * 0.2;
        const ax = w / 2 - 80;
        const ay = h / 2 + 50;

        const j1x = ax + Math.cos(t * 0.5) * 80;
        const j1y = ay - 50 + Math.sin(t * 0.5) * 40;

        const j2x = j1x + Math.sin(t) * 60;
        const j2y = j1y - 30 + Math.cos(t) * 30;

        ctx.strokeStyle = '#ff7171';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(j1x, j1y);
        ctx.lineTo(j2x, j2y);
        ctx.stroke();

        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(j2x, j2y, 8, 0, Math.PI * 2);
        ctx.fill();

        // laser scanner beam descending to base floor
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(j2x, j2y);
        ctx.lineTo(j2x + Math.sin(t) * 40, h - 45);
        ctx.stroke();
      }
      else if (activeScene.frame === 'SPACE') {
        // Starfield velocity lines rushing past + rocket outline
        const scrollOffset = (frameCount - 65) * 8;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.lineWidth = 1.2;

        for (let i = 0; i < 15; i++) {
          const lX = (i * 70) % w;
          const lY = 50 + ((i * 45 + scrollOffset * 2) % (h - 100));
          ctx.beginPath();
          ctx.moveTo(lX, lY);
          ctx.lineTo(lX, lY + 30);
          ctx.stroke();
        }

        // Draw center solid rocket ship blueprint
        ctx.strokeStyle = '#00f5ff';
        ctx.lineWidth = 2;
        const rx = w / 2;
        const ry = h / 2 - 20;

        // Nose
        ctx.beginPath();
        ctx.moveTo(rx, ry - 40);
        ctx.lineTo(rx - 15, ry - 10);
        ctx.lineTo(rx + 15, ry - 10);
        ctx.closePath();
        ctx.stroke();

        // Tank and exhaust fire
        ctx.strokeRect(rx - 15, ry - 10, 30, 60);

        ctx.fillStyle = '#f43f5e';
        ctx.beginPath();
        ctx.moveTo(rx - 10, ry + 50);
        ctx.lineTo(rx, ry + 75 + Math.sin(frameCount * 2) * 10);
        ctx.lineTo(rx + 10, ry + 50);
        ctx.closePath();
        ctx.fill();
      }
      else if (activeScene.frame === 'QUANTUM') {
        // Quantum pulsing network nodes
        const t = frameCount * 0.1;
        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 1.0;

        // concentric connections
        const nodes = [
          { x: w / 2 - 120, y: h / 2 - 40, color: '#c084fc' },
          { x: w / 2 + 120, y: h / 2 - 10, color: '#a855f7' },
          { x: w / 2 - 40, y: h / 2 + 60, color: '#e0f2fe' },
          { x: w / 2 + 50, y: h / 2 + 50, color: '#22c55e' }
        ];

        ctx.beginPath();
        ctx.moveTo(nodes[0].x, nodes[0].y);
        ctx.lineTo(nodes[1].x, nodes[1].y);
        ctx.lineTo(nodes[2].x, nodes[2].y);
        ctx.lineTo(nodes[3].x, nodes[3].y);
        ctx.lineTo(nodes[0].x, nodes[0].y);
        ctx.stroke();

        nodes.forEach(n => {
          ctx.fillStyle = n.color;
          ctx.beginPath();
          ctx.arc(n.x, n.y, 6 + Math.sin(t) * 3, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // HUD Overlay specifications
      ctx.font = '9.5px "JetBrains Mono"';
      ctx.fillStyle = '#f43f5e';
      ctx.fillText('REC ● PREVIEW_STREAM_PLAYING', 25, 25);

      ctx.fillStyle = 'rgba(0, 245, 255, 0.85)';
      ctx.fillText(`FRAME: ${activeFrame}`, w - 150, 25);
      
      // Bottom captions
      ctx.font = '13px "Space Grotesk"';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText(currentCaption, w / 2, h - 20);
      ctx.textAlign = 'left';

      // Telemetry statistics
      ctx.font = '8px "JetBrains Mono"';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.fillText('SECURE INTER interplanetary feed', 25, h - 20);
      ctx.fillText(`TRANS_PROGRESS: ${timeProgress.toFixed(1)}%`, w - 160, h - 20);

      animId = requestAnimationFrame(drawSimulation);
    };

    drawSimulation();
    return () => cancelAnimationFrame(animId);
  }, [isOpen, isPlaying]);

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 bg-[#020204]/96 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl border border-[#00f5ff]/25 bg-black/95 relative flex flex-col shadow-[0_0_55px_rgba(0,245,255,0.25)]">
        
        {/* Decorative laser top */}
        <div className="absolute inset-x-0 h-[2px] bg-[#00f5ff] top-0 pointer-events-none"></div>

        {/* Modal Header */}
        <div className="border-b border-slate-850 p-4 flex justify-between items-center bg-black/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border border-red-500/30 flex items-center justify-center text-red-500 font-bold font-mono text-xs animate-pulse">
              TF
            </div>
            <div>
              <span className="text-[9px] font-mono text-[#f43f5e] tracking-widest font-black block uppercase leading-none">
                TRAILER_FEED // COGNITIVE_MAIN
              </span>
              <h2 className="text-base md:text-lg font-display font-black tracking-wider text-white">
                CINEMATIC PREVIEW TRAILER
              </h2>
            </div>
          </div>

          <button
            onClick={() => { audioEngine.playClick(); onClose(); }}
            className="px-4 py-2 border border-[#00f5ff]/25 text-[#00f5ff] hover:text-white hover:border-[#00f5ff] font-mono text-[10.5px] tracking-wider uppercase flex items-center gap-2 cursor-pointer transition-colors"
          >
            Collapse Feed <X size={14} />
          </button>
        </div>

        {/* Cinematic Screen Canvas */}
        <div className="bg-[#020205] relative flex justify-center items-center overflow-hidden border-b border-slate-850 p-2 md:p-4">
          <canvas 
            ref={canvasRef} 
            className="w-full h-auto aspect-video max-w-3xl border border-slate-800 bg-[#020204]" 
          />
        </div>

        {/* Control Console */}
        <div className="p-4 md:p-6 bg-slate-950/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => { audioEngine.playClick(); setIsPlaying(!isPlaying); }}
              className="px-6 py-2.5 bg-[#00f5ff] text-black font-display font-black text-xs uppercase tracking-widest hover:bg-white transition-all cursor-pointer flex items-center gap-2"
            >
              {isPlaying ? (
                <>
                  <Pause size={12} fill="currentColor" /> Pause Link
                </>
              ) : (
                <>
                  <Play size={12} fill="currentColor" /> Play Link
                </>
              )}
            </button>

            <button
              onClick={() => { audioEngine.playSpace(); setTimeProgress(0); }}
              className="p-2.5 border border-slate-800 hover:border-slate-600 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Restart Feed"
            >
              <RotateCcw size={14} />
            </button>
          </div>

          <p className="text-[11px] font-mono text-slate-400 text-center md:text-right leading-tight max-w-md">
            This live WebGL telemetry loop translates the continuous neural frequencies generated by our active Bombay Grid.
          </p>
        </div>

      </div>
    </div>
  );
}
