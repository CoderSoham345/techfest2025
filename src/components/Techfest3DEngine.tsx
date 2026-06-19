/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { InteractiveItem, SectionId, SpaceObject, QuantumNode, Sponsor } from '../types';
import { ROBOTS_DATA, HOTSPOTS_DATA, SPACE_OBJECTS_DATA, QUANTUM_NODES_DATA, SPONSORS_DATA } from '../data';
import { audioEngine } from './AudioEngine';

interface Techfest3DEngineProps {
  activeSection: SectionId;
  scrollProgress: number; // 0 to 1 within current section or global smooth factor
  hoveredItemId: string | null;
  setHoveredItemId: (id: string | null) => void;
  onItemSelect: (item: any) => void;
  isMuted: boolean;
}

// 3D Point structure
interface Point3D {
  x: number;
  y: number;
  z: number;
  color?: string;
  size?: number;
  label?: string;
}

export default function Techfest3DEngine({
  activeSection,
  scrollProgress,
  hoveredItemId,
  setHoveredItemId,
  onItemSelect,
  isMuted
}: Techfest3DEngineProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Mouse positions for parallax
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const dimensionsRef = useRef({ width: 800, height: 600 });

  // Keep track of active interactive items in projection for click detection
  const projectedItemsRef = useRef<Array<{ id: string; screenX: number; screenY: number; radius: number; item: any }>>([]);

  // Firework system elements
  const fireworksRef = useRef<Array<{ x: number; y: number; z: number; vx: number; vy: number; vz: number; color: string; alpha: number; age: number; life: number }>>([]);
  // Drone particles swarm positions
  const dronesRef = useRef<Array<{ x: number; y: number; z: number; tx: number; ty: number; tz: number; color: string }>>([]);
  // Starfield stars
  const starsRef = useRef<Array<{ x: number; y: number; z: number; speed: number; size: number }>>([]);
  // Cyberpunk city skyscrapers
  const cityBuildingRef = useRef<Array<{ x: number; z: number; w: number; h: number; d: number; windows: Array<{ x: number; y: number; on: boolean }> }>>([]);

  const isFirstRender = useRef(true);

  // Initialize environment elements once
  useEffect(() => {
    // 1. Generate starfield
    const stars = [];
    for (let i = 0; i < 400; i++) {
      stars.push({
        x: (Math.random() - 0.5) * 2000,
        y: (Math.random() - 0.5) * 2000,
        z: (Math.random() - 0.5) * 2000,
        speed: 0.1 + Math.random() * 0.4,
        size: 0.5 + Math.random() * 2
      });
    }
    starsRef.current = stars;

    // 2. Generate Cyberpunk skyscrapers
    const buildings = [];
    for (let i = 0; i < 60; i++) {
      const x = (Math.random() - 0.5) * 1200;
      const z = (Math.random() - 0.5) * 1200;
      // Keep away from direct central gateway
      if (Math.abs(x) < 150 && Math.abs(z) < 150) continue;

      const w = 40 + Math.random() * 80;
      const h = 150 + Math.random() * 250;
      const d = w;

      // windows
      const windows = [];
      const cols = Math.floor(w / 15);
      const rows = Math.floor(h / 20);
      for (let r = 1; r < rows - 1; r++) {
        for (let c = 1; c < cols - 1; c++) {
          windows.push({
            x: -w / 2 + c * 15,
            y: r * 20,
            on: Math.random() > 0.4
          });
        }
      }

      buildings.push({ x, z, w, h, d, windows });
    }
    cityBuildingRef.current = buildings;

    // 3. Generate Drone swarm
    const drones = [];
    for (let i = 0; i < 150; i++) {
      drones.push({
        x: (Math.random() - 0.5) * 600,
        y: 100 + Math.random() * 200,
        z: (Math.random() - 0.5) * 600,
        tx: 0,
        ty: 0,
        tz: 0,
        color: `hsl(${180 + Math.random() * 60}, 100%, 75%)`
      });
    }
    dronesRef.current = drones;
  }, []);

  // Resize boundaries
  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      canvasRef.current.width = w * window.devicePixelRatio;
      canvasRef.current.height = h * window.devicePixelRatio;
      canvasRef.current.style.width = `${w}px`;
      canvasRef.current.style.height = `${h}px`;
      dimensionsRef.current = { width: w, height: h };
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mouse Move listener
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      // Normalized coordinates -0.5 to 0.5
      mouseRef.current.targetX = (e.clientX - rect.left) / rect.width - 0.5;
      mouseRef.current.targetY = (e.clientY - rect.top) / rect.height - 0.5;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Frame Loop
  useEffect(() => {
    let animFrameId: number;
    const ctx2d = canvasRef.current?.getContext('2d');
    if (!ctx2d) return;

    // Camera values
    const cam = { x: 0, y: 0, z: 800, yaw: 0, pitch: 0 };
    const targetCam = { x: 0, y: 0, z: 800, yaw: 0, pitch: 0 };

    let globalTime = 0;

    const render = () => {
      globalTime += 0.012;
      const { width, height } = dimensionsRef.current;
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Clean drawing stage
      ctx2d.resetTransform();
      ctx2d.scale(window.devicePixelRatio, window.devicePixelRatio);
      ctx2d.fillStyle = 'rgba(3, 3, 7, 0.25)'; // trail blur for neon glow + motion feeling
      ctx2d.fillRect(0, 0, width, height);

      // Interpolate mouse coordinates smoothly
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;

      // Define transition configurations based on scroll progression and active sections
      let camX = 0, camY = 0, camZ = 800, camYaw = 0, camPitch = 0;

      // Track scroll transition between segments
      switch (activeSection) {
        case 'gateway':
          // Start out deep space and slowly fly inwards
          camZ = 800 - scrollProgress * 400;
          camY = Math.sin(globalTime * 0.5) * 15;
          camYaw = mouseRef.current.x * 0.25;
          camPitch = mouseRef.current.y * 0.2;
          break;

        case 'aicity':
          // Hover over neon skyline
          camX = -100 + Math.sin(globalTime * 0.2) * 40 + scrollProgress * 150;
          camY = 120 + mouseRef.current.y * 40;
          camZ = 420 - scrollProgress * 120;
          camYaw = -0.3 + mouseRef.current.x * 0.35;
          camPitch = -0.15 + mouseRef.current.y * 0.15;
          break;

        case 'robotics':
          // Focus at robotic assembly desk
          camX = Math.cos(globalTime * 0.25) * 80;
          camY = 40 + Math.sin(globalTime * 0.3) * 30;
          camZ = 380 - scrollProgress * 100;
          camYaw = -camX / 300 + mouseRef.current.x * 0.4;
          camPitch = -camY / 300 + mouseRef.current.y * 0.3;
          break;

        case 'space':
          // Floating in solar base
          const radius = 450 - scrollProgress * 100;
          const theta = globalTime * 0.12 + scrollProgress * Math.PI * 0.5;
          camX = Math.cos(theta) * radius;
          camZ = Math.sin(theta) * radius;
          camY = 80 + Math.cos(globalTime * 0.3) * 60;
          // Look at center planet
          camYaw = -theta - Math.PI / 2 + mouseRef.current.x * 0.5;
          camPitch = -0.15 + mouseRef.current.y * 0.3;
          break;

        case 'quantum':
          // Sinking through quantum network core
          camX = Math.sin(globalTime * 0.4) * 40;
          camY = Math.cos(globalTime * 0.3) * 40;
          camZ = 300 - scrollProgress * 150;
          camYaw = globalTime * 0.05 + mouseRef.current.x * 0.6;
          camPitch = mouseRef.current.y * 0.5;
          break;

        case 'events':
          // Viewing floating 3D matrix elements
          camX = 0;
          camY = Math.sin(globalTime * 0.4) * 30;
          camZ = 450 - scrollProgress * 150;
          camYaw = mouseRef.current.x * 0.5;
          camPitch = mouseRef.current.y * 0.4;
          break;

        case 'finale':
          // Panoramic pullback of grand stage
          camX = Math.sin(globalTime * 0.15) * 150;
          camY = 140 + Math.sin(globalTime * 0.2) * 50;
          camZ = 500 + scrollProgress * 200;
          camYaw = -camY / 450 + mouseRef.current.x * 0.6;
          camPitch = -0.22 + mouseRef.current.y * 0.4;
          break;
      }

      // Smooth camera interpolation
      cam.x += (camX - cam.x) * 0.1;
      cam.y += (camY - cam.y) * 0.1;
      cam.z += (camZ - cam.z) * 0.1;
      cam.yaw += (camYaw - cam.yaw) * 0.15;
      cam.pitch += (camPitch - cam.pitch) * 0.15;

      // 3D projection mathematical system
      const project = (x: number, y: number, z: number) => {
        // Translate relative to camera
        const cx = x - cam.x;
        const cy = y - cam.y;
        const cz = z - cam.z;

        // Yaw rotation around Y axis
        const cosYaw = Math.cos(cam.yaw);
        const sinYaw = Math.sin(cam.yaw);
        const rX1 = cx * cosYaw - cz * sinYaw;
        const rZ1 = cx * sinYaw + cz * cosYaw;

        // Pitch rotation around X axis
        const cosPt = Math.cos(cam.pitch);
        const sinPt = Math.sin(cam.pitch);
        const rY2 = cy * cosPt - rZ1 * sinPt;
        const rZ2 = cy * sinPt + rZ1 * cosPt;

        // Behind camera check
        if (rZ2 <= 15) return null;

        // Focal zoom perspective
        const focal = 380;
        const scale = focal / rZ2;
        const sX = width / 2 + rX1 * scale;
        const sY = height / 2 - rY2 * scale; // invert Y for screen space coordinates

        return { x: sX, y: sY, scale, zDepth: rZ2 };
      };

      // Draw Starfield (drifting backdrop)
      starsRef.current.forEach(star => {
        // add drift speed
        star.z -= star.speed;
        if (star.z < -1000) star.z = 1000;

        const proj = project(star.x, star.y, star.z);
        if (!proj) return;

        // stars size based on scale
        const size = star.size * proj.scale * 0.7;
        if (size <= 0) return;

        const maxOpacity = Math.min(1, 400 / proj.zDepth);
        ctx2d.fillStyle = `rgba(255, 255, 255, ${maxOpacity * 0.85})`;
        ctx2d.fillRect(proj.x, proj.y, size, size);
      });

      // Clear layout projectable interactives
      projectedItemsRef.current = [];

      // ==========================================
      // SECTION 1: FUTURE GATEWAY DRAW LOOPS
      // ==========================================
      if (activeSection === 'gateway' || activeSection === 'aicity') {
        const portalOpacity = activeSection === 'gateway' ? 1.0 : Math.max(0, 1.0 - scrollProgress * 1.5);
        if (portalOpacity > 0.05) {
          const centerX = 0, centerY = 0, centerZ = 0;

          // Draw concentric portal circles rotating
          for (let r = 0; r < 6; r++) {
            const radius = 120 + r * 45;
            const spinAngle = globalTime * (1.5 / (r + 1)) * (r % 2 === 0 ? 1 : -1);
            const ringPoints = 32;

            ctx2d.beginPath();
            let firstPoint = true;
            for (let p = 0; p <= ringPoints; p++) {
              const theta = (p / ringPoints) * Math.PI * 2 + spinAngle;
              // Add concentric volumetric wave modulation
              const modRadius = radius + Math.sin(theta * 6 + globalTime * 3) * 6;
              const x = centerX + Math.cos(theta) * modRadius;
              const y = centerY + Math.sin(theta) * modRadius;
              const z = centerZ + Math.cos(theta * 3 + globalTime) * 30;

              const proj = project(x, y, z);
              if (proj) {
                if (firstPoint) {
                  ctx2d.moveTo(proj.x, proj.y);
                  firstPoint = false;
                } else {
                  ctx2d.lineTo(proj.x, proj.y);
                }
              }
            }
            ctx2d.lineWidth = (3.5 - r * 0.5) * portalOpacity;
            ctx2d.strokeStyle = `hsla(${185 + r * 15}, 100%, 70%, ${portalOpacity * 0.6})`;
            ctx2d.stroke();
          }

          // Swirling energy beams inside gateway
          const helixCount = 40;
          for (let i = 0; i < helixCount; i++) {
            const theta = (i / helixCount) * Math.PI * 2 + globalTime * 0.5;
            const rVal = 50 + Math.sin(globalTime + i) * 15;
            const px = centerX + Math.cos(theta) * rVal;
            const py = centerY + Math.sin(theta) * rVal;
            // Extending tunnel back in Z
            const pz = centerZ - i * 15;

            const proj = project(px, py, pz);
            if (proj) {
              const coreHue = (180 + i * 3) % 360;
              ctx2d.fillStyle = `hsla(${coreHue}, 100%, 80%, ${portalOpacity})`;
              ctx2d.beginPath();
              ctx2d.arc(proj.x, proj.y, 2.5 * proj.scale, 0, Math.PI * 2);
              ctx2d.fill();
            }
          }

          // Giant Techfest floating gate plate
          const gatewayNode = project(0, 0, 150);
          if (gatewayNode) {
            ctx2d.strokeStyle = `rgba(0, 245, 255, ${portalOpacity * 0.4})`;
            ctx2d.lineWidth = 1.0;
            ctx2d.beginPath();
            ctx2d.arc(gatewayNode.x, gatewayNode.y, 45 * gatewayNode.scale, 0, Math.PI * 2);
            ctx2d.stroke();

            // Tactical lock rings
            ctx2d.setLineDash([5, 10]);
            ctx2d.strokeStyle = `rgba(0, 245, 255, ${portalOpacity * 0.65})`;
            ctx2d.beginPath();
            ctx2d.arc(gatewayNode.x, gatewayNode.y, 55 * gatewayNode.scale, globalTime, globalTime + Math.PI * 2);
            ctx2d.stroke();
            ctx2d.setLineDash([]);
          }
        }
      }

      // ==========================================
      // SECTION 2: AI CITY SKYSCRAPERS AND VEHICLES
      // ==========================================
      if (activeSection === 'aicity' || activeSection === 'gateway' || activeSection === 'robotics') {
        const cityOpacity = activeSection === 'aicity' 
          ? 1.0 
          : activeSection === 'gateway' 
            ? scrollProgress 
            : Math.max(0, 1.0 - scrollProgress * 1.5);

        if (cityOpacity > 0.05) {
          // Draw Skyscrapers
          cityBuildingRef.current.forEach((b) => {
            const projBase = project(b.x, -120, b.z);
            const projTop = project(b.x, b.h - 120, b.z);
            if (!projBase || !projTop) return;

            const halfW = (b.w / 2) * projBase.scale;
            const botY = projBase.y;
            const topY = projTop.y;
            const widthProj = b.w * projBase.scale;

            // Render structured wireframe towers
            ctx2d.strokeStyle = `rgba(16, 185, 129, ${cityOpacity * 0.15})`;
            ctx2d.lineWidth = 1.0;
            ctx2d.strokeRect(projBase.x - halfW, topY, widthProj, botY - topY);

            // Shading fill for volume representation
            ctx2d.fillStyle = `rgba(10, 20, 30, ${cityOpacity * 0.45})`;
            ctx2d.fillRect(projBase.x - halfW, topY, widthProj, botY - topY);

            // Tech highlight neon cap lines
            ctx2d.strokeStyle = `rgba(5, 230, 255, ${cityOpacity * 0.75})`;
            ctx2d.lineWidth = 2.0;
            ctx2d.beginPath();
            ctx2d.moveTo(projTop.x - halfW, topY);
            ctx2d.lineTo(projTop.x + halfW, topY);
            ctx2d.stroke();

            // Windows glowing inside blocks
            b.windows.forEach(w => {
              if (!w.on) return;
              const winProj = project(b.x + w.x, w.y - 120, b.z);
              if (winProj && winProj.zDepth < 650) {
                const wSize = 1.8 * winProj.scale;
                ctx2d.fillStyle = `hsla(220, 100%, 75%, ${cityOpacity * 0.7})`;
                ctx2d.fillRect(winProj.x, winProj.y, wSize, wSize);
              }
            });
          });

          // Moving grid vector floor
          const gridZLines = 25;
          const gridXLines = 25;
          ctx2d.strokeStyle = `rgba(0, 220, 255, ${cityOpacity * 0.18})`;
          ctx2d.lineWidth = 1.0;

          for (let zIdx = 0; zIdx < gridZLines; zIdx++) {
            const zVal = -300 + zIdx * 60;
            const p1 = project(-600, -120, zVal);
            const p2 = project(600, -120, zVal);
            if (p1 && p2) {
              ctx2d.beginPath();
              ctx2d.moveTo(p1.x, p1.y);
              ctx2d.lineTo(p2.x, p2.y);
              ctx2d.stroke();
            }
          }

          // Flying neon vehicles streams (traffic)
          for (let stream = 0; stream < 6; stream++) {
            const rate = 0.05 + stream * 0.02;
            const side = stream % 2 === 0 ? 1 : -1;
            const pathZ = -400 + ((globalTime * 300 * rate) % 1200);
            const pathX = side * 180 + Math.sin(pathZ * 0.005) * 80;
            const pathY = -50 + Math.sin(pathZ * 0.01) * 30;

            const proj = project(pathX, pathY, pathZ);
            if (proj) {
              const widthSize = 6 * proj.scale;
              const color = stream % 2 === 0 ? 'rgba(255, 0, 128, 0.95)' : 'rgba(0, 255, 220, 0.95)';
              ctx2d.shadowBlur = 10;
              ctx2d.shadowColor = color;
              ctx2d.fillStyle = color;
              ctx2d.fillRect(proj.x - widthSize / 2, proj.y, widthSize, 2);
              ctx2d.shadowBlur = 0;
            }
          }

          // Load AI District interactive robots nodes
          ROBOTS_DATA.forEach(robot => {
            const proj = project(robot.x, robot.y, robot.z);
            if (!proj) return;

            const radius = 18 * proj.scale;
            const isHovered = hoveredItemId === robot.id;

            // Store screen boundary coordinates for canvas item interaction
            projectedItemsRef.current.push({
              id: robot.id,
              screenX: proj.x,
              screenY: proj.y,
              radius: Math.max(30, radius),
              item: robot
            });

            // Pulse glowing sphere ring base
            const pulse = 1.0 + Math.sin(globalTime * 3 + robot.x) * 0.15;
            ctx2d.strokeStyle = isHovered 
              ? `rgba(255, 30, 110, ${cityOpacity})` 
              : `hsla(${robot.hue}, 100%, 65%, ${cityOpacity * 0.8})`;

            ctx2d.lineWidth = isHovered ? 2.5 : 1.5;

            // Draw holographic drone shape
            ctx2d.beginPath();
            ctx2d.arc(proj.x, proj.y, radius * pulse, 0, Math.PI * 2);
            ctx2d.stroke();

            // Inner core
            ctx2d.fillStyle = isHovered 
              ? `rgba(255, 30, 110, ${cityOpacity * 0.75})` 
              : `hsla(${robot.hue}, 100%, 70%, ${cityOpacity * 0.4})`;
            ctx2d.beginPath();
            ctx2d.arc(proj.x, proj.y, radius * 0.5, 0, Math.PI * 2);
            ctx2d.fill();

            // Draw target bracket if hovered
            if (isHovered) {
              drawHUDTarget(ctx2d, proj.x, proj.y, radius * 2);
            }

            // Core tags text labels
            ctx2d.font = `${Math.max(10, 11 * proj.scale)}px "JetBrains Mono"`;
            ctx2d.fillStyle = isHovered ? '#fff' : 'rgba(255, 255, 255, 0.7)';
            ctx2d.fillText(robot.name, proj.x + radius + 8, proj.y + 4);
          });
        }
      }

      // ==========================================
      // SECTION 3: ROBOTICS ASSEMBLY CELL
      // ==========================================
      if (activeSection === 'robotics' || activeSection === 'aicity' || activeSection === 'space') {
        const robOpacity = activeSection === 'robotics' 
          ? 1.0 
          : activeSection === 'aicity' 
            ? scrollProgress 
            : Math.max(0, 1.0 - scrollProgress * 1.5);

        if (robOpacity > 0.05) {
          // Centrally rotating massive Robot machine scaffold
          const robotCenterY = -50;
          const spinSpeed = globalTime * 0.4;

          const baseRot = project(0, robotCenterY - 40, 0);
          const joint1Rot = project(Math.sin(spinSpeed) * 35, robotCenterY + 30, Math.cos(spinSpeed) * 35);
          const joint2Rot = project(Math.sin(spinSpeed + 1.2) * 45, robotCenterY + 110, Math.cos(spinSpeed + 1.2) * 45);
          const toolRot = project(Math.sin(spinSpeed + 2.0) * 20, robotCenterY + 150, Math.cos(spinSpeed + 2.0) * 20);

          ctx2d.strokeStyle = `rgba(239, 68, 68, ${robOpacity * 0.85})`; // Red Industrial lasers
          ctx2d.lineWidth = 3.5;

          if (baseRot && joint1Rot && joint2Rot && toolRot) {
            // Draw industrial hydraulic skeletal arm connections
            ctx2d.beginPath();
            ctx2d.moveTo(baseRot.x, baseRot.y);
            ctx2d.lineTo(joint1Rot.x, joint1Rot.y);
            ctx2d.lineTo(joint2Rot.x, joint2Rot.y);
            ctx2d.lineTo(toolRot.x, toolRot.y);
            ctx2d.stroke();

            // Joints disks
            ctx2d.fillStyle = 'rgba(15, 23, 42, 0.9)';
            [baseRot, joint1Rot, joint2Rot, toolRot].forEach((jt, index) => {
              ctx2d.strokeStyle = 'rgba(224, 242, 254, 0.9)';
              ctx2d.lineWidth = 1.0;
              ctx2d.beginPath();
              ctx2d.arc(jt.x, jt.y, (12 - index * 2) * jt.scale, 0, Math.PI * 2);
              ctx2d.fill();
              ctx2d.stroke();
            });

            // Industrial laser sweeps
            const laserDist = 180;
            const laserTargetX = Math.cos(globalTime * 3) * laserDist;
            const laserTargetZ = Math.sin(globalTime * 3.5) * laserDist;
            const laserTargetY = -120;

            const projTarget = project(laserTargetX, laserTargetY, laserTargetZ);
            if (projTarget) {
              ctx2d.strokeStyle = 'rgba(239, 68, 68, 0.85)';
              ctx2d.shadowBlur = 10;
              ctx2d.shadowColor = '#f43f5e';
              ctx2d.lineWidth = 1.5 * robOpacity;
              ctx2d.beginPath();
              ctx2d.moveTo(toolRot.x, toolRot.y);
              ctx2d.lineTo(projTarget.x, projTarget.y);
              ctx2d.stroke();
              ctx2d.shadowBlur = 0;

              // Sweep sparks circular dot
              ctx2d.fillStyle = '#ff7171';
              ctx2d.beginPath();
              ctx2d.arc(projTarget.x, projTarget.y, 4 * projTarget.scale, 0, Math.PI * 2);
              ctx2d.fill();
            }
          }

          // Hotspots hotspots rendering in lab
          HOTSPOTS_DATA.forEach(spot => {
            const proj = project(spot.x, spot.y, spot.z);
            if (!proj) return;

            const radius = 16 * proj.scale;
            const isHovered = hoveredItemId === spot.id;

            projectedItemsRef.current.push({
              id: spot.id,
              screenX: proj.x,
              screenY: proj.y,
              radius: Math.max(30, radius),
              item: spot
            });

            // Circular interactive grid ring
            const rotCircle = globalTime * 2 + spot.y;
            ctx2d.strokeStyle = isHovered 
              ? 'rgba(239, 68, 68, 1.0)' 
              : `hsla(${spot.hue}, 100%, 60%, ${robOpacity * 0.75})`;
            ctx2d.lineWidth = isHovered ? 2.0 : 1.0;

            ctx2d.beginPath();
            ctx2d.arc(proj.x, proj.y, radius, 0, Math.PI * 2);
            ctx2d.stroke();

            // Core lock node dot
            ctx2d.fillStyle = isHovered ? '#ef4444' : `hsla(${spot.hue || 0}, 100%, 70%, ${robOpacity * 0.4})`;
            ctx2d.beginPath();
            ctx2d.arc(proj.x, proj.y, radius * 0.3, 0, Math.PI * 2);
            ctx2d.fill();

            if (isHovered) {
              drawHUDTarget(ctx2d, proj.x, proj.y, radius * 2.5);
            }

            // Specs read tags
            ctx2d.font = `${Math.max(10, 11 * proj.scale)}px "Space Grotesk"`;
            ctx2d.fillStyle = isHovered ? '#fff' : 'rgba(255, 255, 255, 0.7)';
            ctx2d.fillText(spot.name, proj.x + radius + 10, proj.y + 4);
          });
        }
      }

      // ==========================================
      // SECTION 4: SPACE COLONY SPHERE
      // ==========================================
      if (activeSection === 'space' || activeSection === 'robotics' || activeSection === 'quantum') {
        const spaceOpacity = activeSection === 'space' 
          ? 1.0 
          : activeSection === 'robotics' 
            ? scrollProgress 
            : Math.max(0, 1.0 - scrollProgress * 1.5);

        if (spaceOpacity > 0.05) {
          // Central huge glowing planet (Mars colony base environment)
          const planetProj = project(0, -30, 0);
          if (planetProj) {
            const size = 70 * planetProj.scale;
            // Draw Mars spherical shading gradient
            const grad = ctx2d.createRadialGradient(
              planetProj.x - size * 0.2, planetProj.y - size * 0.2, size * 0.1,
              planetProj.x, planetProj.y, size
            );
            grad.addColorStop(0, '#f97316'); // Bright desert orange
            grad.addColorStop(0.6, '#ea580c'); // Deep martian red
            grad.addColorStop(1, '#1e1b4b'); // Cosmic dark terminator

            ctx2d.fillStyle = grad;
            ctx2d.shadowColor = 'rgba(234, 88, 12, 0.4)';
            ctx2d.shadowBlur = 25;
            ctx2d.beginPath();
            ctx2d.arc(planetProj.x, planetProj.y, size, 0, Math.PI * 2);
            ctx2d.fill();
            ctx2d.shadowBlur = 0;

            // Draw planetary thin orbital lines
            ctx2d.strokeStyle = 'rgba(224, 242, 254, 0.12)';
            ctx2d.lineWidth = 1.0;
            ctx2d.beginPath();
            ctx2d.ellipse(planetProj.x, planetProj.y, 180 * planetProj.scale, 40 * planetProj.scale, Math.PI/12, 0, Math.PI*2);
            ctx2d.stroke();
          }

          // Render orbiting satellites / colonies / transports
          SPACE_OBJECTS_DATA.forEach(obj => {
            // Compute real orbiting position
            const angleVal = obj.angle + globalTime * obj.orbitSpeed * 13;
            const x = Math.cos(angleVal) * obj.orbitRadius;
            const z = Math.sin(angleVal) * obj.orbitRadius;
            const y = Math.sin(angleVal * 1.5) * 40 - 20;

            const proj = project(x, y, z);
            if (!proj) return;

            const radius = (obj.type === 'colony' ? 14 : 9) * proj.scale;
            const isHovered = hoveredItemId === obj.id;

            projectedItemsRef.current.push({
              id: obj.id,
              screenX: proj.x,
              screenY: proj.y,
              radius: Math.max(30, radius),
              item: obj
            });

            // Glowing orbiting body markers
            ctx2d.strokeStyle = isHovered 
              ? 'rgba(251, 146, 60, 1.0)' 
              : `hsla(${obj.hue}, 100%, 65%, ${spaceOpacity})`;
            ctx2d.lineWidth = isHovered ? 2.5 : 1.5;

            ctx2d.beginPath();
            ctx2d.arc(proj.x, proj.y, radius, 0, Math.PI * 2);
            ctx2d.stroke();

            // Draw directional pointer tag
            ctx2d.fillStyle = isHovered ? '#fff' : 'rgba(255, 255, 255, 0.75)';
            ctx2d.font = `${Math.max(10, 11 * proj.scale)}px "Space Grotesk"`;
            ctx2d.fillText(obj.name, proj.x + radius + 8, proj.y + 4);

            if (isHovered) {
              drawHUDTarget(ctx2d, proj.x, proj.y, radius * 2.8);
            }
          });
        }
      }

      // ==========================================
      // SECTION 5: QUANTUM NEURAL WEB
      // ==========================================
      if (activeSection === 'quantum' || activeSection === 'space' || activeSection === 'events') {
        const qOpacity = activeSection === 'quantum' 
          ? 1.0 
          : activeSection === 'space' 
            ? scrollProgress 
            : Math.max(0, 1.0 - scrollProgress * 1.5);

        if (qOpacity > 0.05) {
          // Dynamic nodes motion update
          QUANTUM_NODES_DATA.forEach(node => {
            node.x += node.vx * 1.5;
            node.y += node.vy * 1.5;
            node.z += node.vz * 1.5;

            // Restrain boxes boundaries
            if (Math.abs(node.x) > 220) node.vx *= -1;
            if (Math.abs(node.y) > 220) node.vy *= -1;
            if (Math.abs(node.z) > 220) node.vz *= -1;
          });

          // Draw connection links lines
          ctx2d.lineWidth = 1.0;
          QUANTUM_NODES_DATA.forEach(node => {
            const projStart = project(node.x, node.y, node.z);
            if (!projStart) return;

            node.connections.forEach(connId => {
              const otherNode = QUANTUM_NODES_DATA.find(n => n.id === connId);
              if (!otherNode) return;

              const projEnd = project(otherNode.x, otherNode.y, otherNode.z);
              if (!projEnd) return;

              // Grid connection line pulsing light
              ctx2d.strokeStyle = `rgba(168, 85, 247, ${qOpacity * 0.25})`; // Purple matrix grid connection
              ctx2d.beginPath();
              ctx2d.moveTo(projStart.x, projStart.y);
              ctx2d.lineTo(projEnd.x, projEnd.y);
              ctx2d.stroke();
            });
          });

          // Draw clickable quantum core nodes spheres
          QUANTUM_NODES_DATA.forEach(node => {
            const proj = project(node.x, node.y, node.z);
            if (!proj) return;

            const radius = 12 * proj.scale;
            const isHovered = hoveredItemId === node.id;

            projectedItemsRef.current.push({
              id: node.id,
              screenX: proj.x,
              screenY: proj.y,
              radius: Math.max(30, radius),
              item: node
            });

            // Glowing circles
            ctx2d.strokeStyle = isHovered 
              ? 'rgba(192, 132, 252, 1.0)' 
              : `rgba(168, 85, 247, ${qOpacity * 0.95})`; // purple
            ctx2d.lineWidth = isHovered ? 2.5 : 1.5;

            ctx2d.beginPath();
            ctx2d.arc(proj.x, proj.y, radius, 0, Math.PI * 2);
            ctx2d.stroke();

            // Inner core
            ctx2d.fillStyle = isHovered ? '#c084fc' : `rgba(168, 85, 247, ${qOpacity * 0.5})`;
            ctx2d.beginPath();
            ctx2d.arc(proj.x, proj.y, radius * 0.4, 0, Math.PI * 2);
            ctx2d.fill();

            if (isHovered) {
              drawHUDTarget(ctx2d, proj.x, proj.y, radius * 2.8);
            }

            ctx2d.fillStyle = isHovered ? '#fff' : 'rgba(255, 255, 255, 0.7)';
            ctx2d.font = `${Math.max(10, 11 * proj.scale)}px "JetBrains Mono"`;
            ctx2d.fillText(node.name, proj.x + radius + 8, proj.y + 4);
          });
        }
      }

      // ==========================================
      // SECTION 6: EVENTS MATRIX VIEW
      // ==========================================
      if (activeSection === 'events' || activeSection === 'quantum' || activeSection === 'finale') {
        const evOpacity = activeSection === 'events' 
          ? 1.0 
          : activeSection === 'quantum' 
            ? scrollProgress 
            : Math.max(0, 1.0 - scrollProgress * 1.5);

        if (evOpacity > 0.05) {
          // Render a surrounding sponsor/logo cosmic cloud layer
          // Rotating central matrix core ring
          const coreProj = project(0, 0, 0);
          if (coreProj) {
            ctx2d.strokeStyle = `rgba(14, 116, 144, ${evOpacity * 0.3})`;
            ctx2d.lineWidth = 1.5;
            ctx2d.beginPath();
            ctx2d.arc(coreProj.x, coreProj.y, 40 * coreProj.scale, 0, Math.PI * 2);
            ctx2d.stroke();
          }

          SPONSORS_DATA.forEach((spons) => {
            const angleVal = spons.angle + globalTime * spons.speed * 8;
            const x = Math.cos(angleVal) * spons.distance;
            const z = Math.sin(angleVal) * spons.distance;
            const y = Math.sin(angleVal * 2.0) * 30;

            const proj = project(x, y, z);
            if (!proj) return;

            const rSize = 10 * proj.scale;
            const isHovered = hoveredItemId === spons.id;

            projectedItemsRef.current.push({
              id: spons.id,
              screenX: proj.x,
              screenY: proj.y,
              radius: Math.max(30, rSize * 1.5),
              item: spons
            });

            // Render sponsor orbit point
            ctx2d.strokeStyle = isHovered 
              ? 'rgba(6, 182, 212, 1.0)' 
              : `rgba(6, 182, 212, ${evOpacity * 0.7})`; // cyan
            ctx2d.lineWidth = isHovered ? 2.0 : 1.0;

            ctx2d.beginPath();
            ctx2d.rect(proj.x - rSize/2, proj.y - rSize/2, rSize, rSize);
            ctx2d.stroke();

            // Info tags
            ctx2d.font = `${Math.max(9, 10 * proj.scale)}px "JetBrains Mono"`;
            ctx2d.fillStyle = isHovered ? '#fff' : 'rgba(255,255,255,0.6)';
            ctx2d.fillText(spons.name, proj.x + rSize + 6, proj.y + 3);

            if (isHovered) {
              drawHUDTarget(ctx2d, proj.x, proj.y, rSize * 3);
            }
          });
        }
      }

      // ==========================================
      // SECTION 7: STAGE FINALE / LASERS SHOW
      // ==========================================
      if (activeSection === 'finale' || activeSection === 'events') {
        const finOpacity = activeSection === 'finale' 
          ? 1.0 
          : scrollProgress;

        if (finOpacity > 0.05) {
          // Draw structural 3D platform Stage
          const stageTop = project(0, -110, -50);
          const stageL = project(-180, -120, -100);
          const stageR = project(180, -120, -100);
          const stageBack = project(0, -120, -250);

          if (stageTop && stageL && stageR && stageBack) {
            ctx2d.fillStyle = `rgba(15, 23, 42, ${finOpacity * 0.55})`;
            ctx2d.strokeStyle = `rgba(217, 70, 239, ${finOpacity * 0.45})`; // Pink/Fuchsia Stage Line
            ctx2d.lineWidth = 1.5;

            // Draw physical polygon surface
            ctx2d.beginPath();
            ctx2d.moveTo(stageL.x, stageL.y);
            ctx2d.lineTo(stageR.x, stageR.y);
            ctx2d.lineTo(stageBack.x, stageBack.y);
            ctx2d.closePath();
            ctx2d.fill();
            ctx2d.stroke();

            // Volumetric stage searchlight sweeps
            const laserNum = 5;
            for (let l = 0; l < laserNum; l++) {
              const originX = -120 + l * 60;
              const laserAngle = Math.sin(globalTime * 1.5 + l * 0.5) * 0.45;
              const reachX = originX + Math.sin(laserAngle) * 280;
              const reachY = -120 + Math.cos(laserAngle) * 280;

              const projOrig = project(originX, -120, -100);
              const projReach = project(reachX, reachY, -100);

              if (projOrig && projReach) {
                const laserHue = (300 + l * 15) % 360;
                ctx2d.strokeStyle = `hsla(${laserHue}, 100%, 65%, ${finOpacity * 0.25})`;
                ctx2d.lineWidth = 4.0;
                ctx2d.beginPath();
                ctx2d.moveTo(projOrig.x, projOrig.y);
                ctx2d.lineTo(projReach.x, projReach.y);
                ctx2d.stroke();
              }
            }
          }

          // Swarms Drone particles formation animation
          dronesRef.current.forEach((dr, idx) => {
            // Target coordinates representing orbits or IIT structures
            const orbitRad = 150 + Math.sin(idx) * 30;
            const angleSpeed = globalTime * 0.8 + idx * 0.2;
            dr.tx = Math.cos(angleSpeed) * orbitRad;
            dr.tz = Math.sin(angleSpeed) * orbitRad;
            dr.ty = 80 + Math.cos(angleSpeed * 1.5) * 50;

            // Shift coordinate values close towards targets
            dr.x += (dr.tx - dr.x) * 0.05;
            dr.y += (dr.ty - dr.y) * 0.05;
            dr.z += (dr.tz - dr.z) * 0.05;

            const proj = project(dr.x, dr.y, dr.z);
            if (proj) {
              const dSize = 1.5 * proj.scale;
              ctx2d.fillStyle = dr.color;
              ctx2d.beginPath();
              ctx2d.arc(proj.x, proj.y, dSize, 0, Math.PI * 2);
              ctx2d.fill();
            }
          });
        }
      }

      // ==========================================
      // ACTIVE FIREWORK EXPLOSIONS ACCUMULATOR
      // ==========================================
      const fireworks = fireworksRef.current;
      for (let i = fireworks.length - 1; i >= 0; i--) {
        const fw = fireworks[i];
        fw.x += fw.vx;
        fw.y += fw.vy;
        fw.z += fw.vz;
        // Gravity pulled down slightly
        fw.vy -= 0.04;
        fw.age++;

        const proj = project(fw.x, fw.y, fw.z);
        if (proj && fw.age < fw.life) {
          const size = 2 * proj.scale;
          const alphaFade = 1.0 - fw.age / fw.life;
          ctx2d.fillStyle = fw.color.replace('ALPHA', alphaFade.toString());
          ctx2d.beginPath();
          ctx2d.arc(proj.x, proj.y, size, 0, Math.PI * 2);
          ctx2d.fill();
        } else {
          // terminate expired
          fireworks.splice(i, 1);
        }
      }

      // Automatically focus high-lighted lock rings to detect hover
      let bestHoverItem: InteractiveItem | null = null;
      let minDistance = 28; // hover window scale threshold

      // Check hover item on center
      const mouseXReal = (mouseRef.current.targetX + 0.5) * width;
      const mouseYReal = -(mouseRef.current.targetY - 0.5) * height; // matching coordinate orientation

      if (projectedItemsRef.current.length > 0) {
        projectedItemsRef.current.forEach(itemInfo => {
          const dx = itemInfo.screenX - mouseXReal;
          const dy = itemInfo.screenY - mouseYReal;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < minDistance && dist < itemInfo.radius) {
            minDistance = dist;
            bestHoverItem = itemInfo.item;
          }
        });
      }

      if (bestHoverItem) {
        const item: InteractiveItem = bestHoverItem;
        if (hoveredItemId !== item.id) {
          setHoveredItemId(item.id);
          audioEngine.playHover();
        }
      } else {
        if (hoveredItemId !== null) {
          setHoveredItemId(null);
        }
      }

      // Loop frame recall
      animFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, [activeSection, scrollProgress, hoveredItemId, setHoveredItemId]);

  // Click handler directly on stage coordinates
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    // Sound interaction initiation
    audioEngine.init();

    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Detect if we clicked any active interactive 3D item
    let clickedItemInfo = null;
    let minDistance = 35;

    projectedItemsRef.current.forEach(item => {
      const dx = item.screenX - clickX;
      const dy = item.screenY - clickY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < minDistance && dist < item.radius) {
        minDistance = dist;
        clickedItemInfo = item;
      }
    });

    if (clickedItemInfo) {
      const info: any = clickedItemInfo;
      audioEngine.playClick();
      onItemSelect(info.item);
    } else {
      // General click: trigger gorgeous firework explosion at click vector!
      audioEngine.playClick();

      // Convert 2D click back arbitrarily to mock coordinates
      const targetXNorm = (clickX / rect.width) - 0.5;
      const targetYNorm = -((clickY / rect.height) - 0.5);

      const fX = targetXNorm * 380;
      const fY = targetYNorm * 280;
      const fZ = 100; // mid depth focal

      const colors = [
        'rgba(244, 63, 94, ALPHA)', // rose
        'rgba(0, 245, 255, ALPHA)', // cyan
        'rgba(168, 85, 247, ALPHA)', // purple
        'rgba(34, 197, 94, ALPHA)', // green
        'rgba(234, 88, 12, ALPHA)'  // orange
      ];
      const fireworkColor = colors[Math.floor(Math.random() * colors.length)];

      // spawn particles array
      for (let p = 0; p < 35; p++) {
        const phi = Math.random() * Math.PI * 2;
        const theta = Math.acos(Math.random() * 2 - 1);
        const speed = 1.5 + Math.random() * 3.5;

        fireworksRef.current.push({
          x: fX,
          y: fY,
          z: fZ,
          vx: Math.sin(theta) * Math.cos(phi) * speed,
          vy: Math.sin(theta) * Math.sin(phi) * speed,
          vz: Math.cos(theta) * speed,
          color: fireworkColor,
          alpha: 1.0,
          age: 0,
          life: 40 + Math.floor(Math.random() * 25)
        });
      }
    }
  };

  // Helper renderer: Tactical visors / HUD Target frame
  const drawHUDTarget = (ctx: CanvasRenderingContext2D, x: number, y: number, r: number) => {
    ctx.strokeStyle = 'rgba(0, 245, 255, 0.85)';
    ctx.lineWidth = 1.0;

    // Corner brackets
    const size = r * 0.4;
    // Top-Left
    ctx.beginPath();
    ctx.moveTo(x - r, y - r + size);
    ctx.lineTo(x - r, y - r);
    ctx.lineTo(x - r + size, y - r);
    ctx.stroke();

    // Top-Right
    ctx.beginPath();
    ctx.moveTo(x + r - size, y - r);
    ctx.lineTo(x + r, y - r);
    ctx.lineTo(x + r, y - r + size);
    ctx.stroke();

    // Bottom-Left
    ctx.beginPath();
    ctx.moveTo(x - r, y + r - size);
    ctx.lineTo(x - r, y + r);
    ctx.lineTo(x - r + size, y + r);
    ctx.stroke();

    // Bottom-Right
    ctx.beginPath();
    ctx.moveTo(x + r - size, y + r);
    ctx.lineTo(x + r, y + r);
    ctx.lineTo(x + r, y + r - size);
    ctx.stroke();
  };

  return (
    <div ref={containerRef} className="relative w-full h-full select-none overflow-hidden bg-[#030307]">
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="absolute inset-0 cursor-crosshair z-10 block"
      />
      {/* Iron Man HUD Tech ambient decoration elements */}
      <div className="absolute inset-0 pointer-events-none border border-[#00f5ff]/10 m-4 z-20">
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#00f5ff]/30"></div>
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#00f5ff]/30"></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#00f5ff]/30"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#00f5ff]/30"></div>

        {/* Ambient coordinate values indicators */}
        <div className="absolute bottom-6 left-6 font-mono text-[9px] text-[#00f5ff]/40 tracking-widest hidden md:block">
          SEC_GRID: 50.192.1 // TRACER_ACTIVE // CHIP_Z: {scrollProgress.toFixed(4)}
        </div>
        <div className="absolute top-6 right-6 font-mono text-[9px] text-[#00f5ff]/40 tracking-widest hidden md:block">
          FPS: 60 // PENDING: OPTIMAL // INT_SYS_v2.05
        </div>
      </div>
    </div>
  );
}
