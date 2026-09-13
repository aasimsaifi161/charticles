"use client";

import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  alpha: number;
  color: string;
}

interface ParticleBackgroundProps {
  className?: string;
  particleCount?: number;
}

export function ParticleBackground({
  className = "fixed inset-0 pointer-events-none z-0",
  particleCount = 125,
}: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;

    // Mouse tracker across entire viewport
    const mouse = {
      x: -9999,
      y: -9999,
      radius: 160,
      active: false,
    };

    const colors = [
      "#2ff0d6", // Luminous Cyan
      "#2ff0d6", // Luminous Cyan (weighted)
      "#5cf7e4", // Electric Mint
      "#a78bfa", // Soft Purple
      "#7c4dff", // Violet
      "#ffffff", // Star White
    ];

    let particles: Particle[] = [];

    const initOrResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      const count = width < 768 ? Math.round(particleCount * 0.45) : particleCount;

      if (particles.length === 0) {
        particles = Array.from({ length: count }, () => {
          const color = colors[Math.floor(Math.random() * colors.length)];
          const baseAlpha = 0.35 + Math.random() * 0.45;
          return {
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.55,
            vy: (Math.random() - 0.5) * 0.55,
            radius: 1.6 + Math.random() * 2.2, // Clearly visible 1.6px - 3.8px
            baseAlpha,
            alpha: baseAlpha,
            color,
          };
        });
      } else {
        // Adjust existing particles inside updated window bounds
        particles.forEach((p) => {
          if (p.x > width) p.x = Math.random() * width;
          if (p.y > height) p.y = Math.random() * height;
        });
      }
    };

    initOrResize();
    window.addEventListener("resize", initOrResize);

    // Global mouse movement listener across the entire screen
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave);

    // Pause animation when tab is inactive to save battery/GPU
    let isVisible = !document.hidden;
    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
      if (isVisible && !animId) {
        animId = requestAnimationFrame(render);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const connectionDist = 125;
    const connectionDistSq = connectionDist * connectionDist;
    const mouseRadiusSq = mouse.radius * mouse.radius;

    const render = () => {
      if (!isVisible) return;

      ctx.clearRect(0, 0, width, height);

      const pLen = particles.length;

      // 1. Update and draw particles
      for (let i = 0; i < pLen; i++) {
        const p = particles[i];

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Gentle bounce on edges
        if (p.x < 0) {
          p.x = 0;
          p.vx = Math.abs(p.vx);
        } else if (p.x > width) {
          p.x = width;
          p.vx = -Math.abs(p.vx);
        }

        if (p.y < 0) {
          p.y = 0;
          p.vy = Math.abs(p.vy);
        } else if (p.y > height) {
          p.y = height;
          p.vy = -Math.abs(p.vy);
        }

        // Interactive mouse reaction
        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < mouseRadiusSq && distSq > 0) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / mouse.radius);
            const angle = Math.atan2(dy, dx);

            // Subtle push away from cursor
            p.x -= Math.cos(angle) * force * 1.6;
            p.y -= Math.sin(angle) * force * 1.6;

            // Illuminate particle near cursor
            p.alpha = Math.min(1.0, p.baseAlpha + force * 0.5);

            // Draw interactive luminous filament to cursor
            const beamAlpha = force * 0.35;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(47, 240, 214, ${beamAlpha})`;
            ctx.lineWidth = 0.9;
            ctx.stroke();
          } else {
            p.alpha += (p.baseAlpha - p.alpha) * 0.05;
          }
        } else {
          p.alpha += (p.baseAlpha - p.alpha) * 0.05;
        }

        // Draw glowing particle node
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
      }

      // 2. Draw connecting filament lines between nearby particles
      for (let i = 0; i < pLen; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < pLen; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < connectionDistSq) {
            const dist = Math.sqrt(distSq);
            const lineAlpha = (1 - dist / connectionDist) * 0.22;

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(47, 240, 214, ${lineAlpha})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", initOrResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [particleCount]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
      style={{
        display: "block",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}
