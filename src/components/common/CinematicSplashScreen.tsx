import React, { useEffect, useRef, useState } from 'react';

interface Props {
  onComplete: () => void;
}

export const CinematicSplashScreen: React.FC<Props> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [phase, setPhase] = useState<'CRISIS' | 'TRANSITION' | 'RECOVERY'>('CRISIS');
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Rain particles for Phase 1
    const rainCount = 180;
    const rainDrops: Array<{ x: number; y: number; l: number; xs: number; ys: number; opacity: number }> = [];
    for (let i = 0; i < rainCount; i++) {
      rainDrops.push({
        x: Math.random() * width,
        y: Math.random() * height,
        l: Math.random() * 25 + 15,
        xs: -3 - Math.random() * 2,
        ys: 12 + Math.random() * 10,
        opacity: Math.random() * 0.4 + 0.3
      });
    }

    // Floating recovery light particles for Phase 3
    const lightMotesCount = 45;
    const lightMotes: Array<{ x: number; y: number; radius: number; speedY: number; opacity: number; pulse: number }> = [];
    for (let i = 0; i < lightMotesCount; i++) {
      lightMotes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 3 + 1,
        speedY: -(Math.random() * 0.8 + 0.3),
        opacity: Math.random() * 0.6 + 0.2,
        pulse: Math.random() * Math.PI
      });
    }

    // Shockwave rings for Phase 2
    let shockwaveRadius = 0;
    let shockwaveOpacity = 1;

    // Lightning parameters
    let lightningIntensity = 0;
    let lastLightning = 0;

    const startTime = performance.now();
    const duration = 4200; // 4.2 seconds cinematic duration

    const render = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      setProgress(Math.round(t * 100));

      // Phase calculation
      if (elapsed < 1200) {
        setPhase('CRISIS');
      } else if (elapsed < 2800) {
        setPhase('TRANSITION');
      } else {
        setPhase('RECOVERY');
      }

      ctx.clearRect(0, 0, width, height);

      // ========================================================
      // 1. DYNAMIC BACKGROUND COLOR INTERPOLATION
      // ========================================================
      if (elapsed < 1200) {
        // CRISIS: Dark Dystopian Storm (Black to deep navy / stormy crimson)
        const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, width * 0.8);
        bgGrad.addColorStop(0, '#0f172a');
        bgGrad.addColorStop(0.6, '#050914');
        bgGrad.addColorStop(1, '#020408');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // Periodic Lightning flash
        if (now - lastLightning > 450 && Math.random() < 0.15) {
          lightningIntensity = 0.85;
          lastLightning = now;
        }
        if (lightningIntensity > 0) {
          ctx.fillStyle = `rgba(224, 242, 254, ${lightningIntensity * 0.4})`;
          ctx.fillRect(0, 0, width, height);
          lightningIntensity *= 0.82;
        }

        // Heavy Rain streaks
        ctx.strokeStyle = 'rgba(186, 230, 253, 0.4)';
        ctx.lineWidth = 1.5;
        for (let i = 0; i < rainDrops.length; i++) {
          const r = rainDrops[i];
          ctx.beginPath();
          ctx.moveTo(r.x, r.y);
          ctx.lineTo(r.x + r.xs, r.y + r.l);
          ctx.stroke();
          r.x += r.xs;
          r.y += r.ys;
          if (r.y > height) {
            r.y = -20;
            r.x = Math.random() * width;
          }
        }
      } else if (elapsed < 2800) {
        // TRANSITION: Storm clearing, intense cyan & orange radiant light burst
        const transitionProgress = (elapsed - 1200) / 1600;
        const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 20, width / 2, height / 2, width * 0.9);
        
        const centerR = Math.round(15 + transitionProgress * 30);
        const centerG = Math.round(23 + transitionProgress * 65);
        const centerB = Math.round(42 + transitionProgress * 110);
        
        bgGrad.addColorStop(0, `rgb(${centerR + 60}, ${centerG + 80}, ${centerB + 100})`);
        bgGrad.addColorStop(0.4, `rgb(${centerR}, ${centerG}, ${centerB})`);
        bgGrad.addColorStop(1, '#020617');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // Radiant Light Rays
        const rayCount = 12;
        ctx.save();
        ctx.translate(width / 2, height / 2);
        ctx.rotate(elapsed * 0.0008);
        for (let r = 0; r < rayCount; r++) {
          ctx.beginPath();
          ctx.moveTo(0, 0);
          const angle1 = (r * 2 * Math.PI) / rayCount;
          const angle2 = angle1 + 0.18;
          ctx.arc(0, 0, width, angle1, angle2);
          ctx.closePath();
          ctx.fillStyle = `rgba(249, 115, 22, ${0.08 * (1 - transitionProgress) + 0.05})`;
          ctx.fill();
        }
        ctx.restore();

        // Expanding Energy Shockwave Rings
        shockwaveRadius += 9;
        shockwaveOpacity = Math.max(0, 1 - (shockwaveRadius / (width * 0.75)));
        if (shockwaveOpacity > 0) {
          ctx.beginPath();
          ctx.arc(width / 2, height / 2, shockwaveRadius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(56, 189, 248, ${shockwaveOpacity * 0.8})`;
          ctx.lineWidth = 4;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(width / 2, height / 2, Math.max(0, shockwaveRadius - 40), 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(251, 146, 60, ${shockwaveOpacity * 0.6})`;
          ctx.lineWidth = 3;
          ctx.stroke();
        }

        // Dissolving Rain
        const fadeRain = 1 - transitionProgress;
        ctx.strokeStyle = `rgba(186, 230, 253, ${0.3 * fadeRain})`;
        ctx.lineWidth = 1;
        for (let i = 0; i < rainDrops.length; i++) {
          const r = rainDrops[i];
          ctx.beginPath();
          ctx.moveTo(r.x, r.y);
          ctx.lineTo(r.x + r.xs, r.y + r.l * fadeRain);
          ctx.stroke();
          r.x += r.xs;
          r.y += r.ys;
        }
      } else {
        // RECOVERY: Serene, bright hopeful blue sky with warm golden sunlight
        const recProgress = (elapsed - 2800) / 1400;
        const bgGrad = ctx.createRadialGradient(width / 2, height * 0.35, 80, width / 2, height / 2, width * 0.8);
        bgGrad.addColorStop(0, '#0c192e');
        bgGrad.addColorStop(0.5, '#070f1e');
        bgGrad.addColorStop(1, '#020617');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // Golden Sun Glow in Top-Right
        const sunGrad = ctx.createRadialGradient(width * 0.65, height * 0.3, 10, width * 0.65, height * 0.3, width * 0.5);
        sunGrad.addColorStop(0, 'rgba(251, 146, 60, 0.25)');
        sunGrad.addColorStop(0.5, 'rgba(245, 158, 11, 0.08)');
        sunGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = sunGrad;
        ctx.fillRect(0, 0, width, height);

        // Floating Golden Motes
        for (let i = 0; i < lightMotes.length; i++) {
          const m = lightMotes[i];
          m.pulse += 0.05;
          const currentAlpha = m.opacity * (0.6 + 0.4 * Math.sin(m.pulse));
          ctx.beginPath();
          ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(253, 224, 71, ${currentAlpha})`;
          ctx.shadowColor = '#facc15';
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;

          m.y += m.speedY;
          if (m.y < -10) {
            m.y = height + 10;
            m.x = Math.random() * width;
          }
        }
      }

      if (elapsed < duration) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        handleEnd();
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleEnd = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onComplete();
    }, 450);
  };

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden select-none bg-slate-950 flex flex-col items-center justify-center transition-opacity duration-500 ${
        isFadingOut ? 'opacity-0 pointer-events-none scale-105' : 'opacity-100'
      }`}
    >
      {/* Background Interactive Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* Top Right Skip Button */}
      <button
        onClick={handleEnd}
        className="absolute top-5 right-5 z-20 px-3.5 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white text-xs font-bold tracking-wide backdrop-blur-md transition active:scale-95 flex items-center gap-1.5 shadow-lg"
      >
        <span>Skip Intro</span>
        <span>→</span>
      </button>

      {/* Center Cinematic Emblem & Typography */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center p-6 space-y-6 max-w-lg mx-auto">
        
        {/* Glowing 3D Shield Logo Centerpiece */}
        <div className="relative group">
          
          {/* Animated Shockwave Pulse Glow */}
          <div
            className={`absolute -inset-6 rounded-full blur-2xl transition-all duration-700 ${
              phase === 'CRISIS'
                ? 'bg-red-600/30 animate-pulse'
                : phase === 'TRANSITION'
                ? 'bg-gradient-to-tr from-amber-500/50 via-cyan-400/50 to-orange-500/60 scale-125'
                : 'bg-gradient-to-tr from-amber-500/30 to-blue-500/30 scale-105'
            }`}
          />

          {/* Logo Container with 3D Depth & Camera Zoom */}
          <div
            className={`relative transition-all duration-1000 transform ${
              phase === 'CRISIS'
                ? 'scale-90 brightness-90 filter drop-shadow-[0_0_20px_rgba(239,68,68,0.4)]'
                : phase === 'TRANSITION'
                ? 'scale-110 brightness-125 filter drop-shadow-[0_0_40px_rgba(249,115,22,0.8)]'
                : 'scale-100 brightness-110 filter drop-shadow-[0_0_30px_rgba(56,189,248,0.5)]'
            }`}
          >
            <img
              src="/disaster-dhost-logo.png"
              alt="DISASTER DHOST Emergency Response & Recovery"
              className="w-48 sm:w-60 h-auto object-contain mx-auto drop-shadow-2xl select-none pointer-events-none"
              onError={(e) => {
                // Fallback SVG if image not found
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        </div>

        {/* Phase Status Sub-ticker */}
        <div className="space-y-1.5 pt-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700/80 backdrop-blur-md shadow-xl">
            <span
              className={`w-2 h-2 rounded-full ${
                phase === 'CRISIS'
                  ? 'bg-red-500 animate-ping'
                  : phase === 'TRANSITION'
                  ? 'bg-amber-400 animate-pulse'
                  : 'bg-emerald-400'
              }`}
            />
            <span className="text-[11px] font-mono font-black uppercase tracking-widest text-slate-200">
              {phase === 'CRISIS' && 'CRISIS DETECTED • INITIALIZING MESH'}
              {phase === 'TRANSITION' && 'RESCUE SHOCKWAVE • DEPLOYING NODES'}
              {phase === 'RECOVERY' && 'RESILIENCE ESTABLISHED • LIFELINE READY'}
            </span>
          </div>
        </div>

        {/* Cinematic Progress Bar */}
        <div className="w-56 h-1.5 rounded-full bg-slate-900/90 border border-slate-800 overflow-hidden relative shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-400 transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

      </div>

      {/* Bottom Emergency Readiness Tagline */}
      <div className="absolute bottom-6 text-center text-slate-500 text-[10px] font-mono tracking-wider">
        NO LOGIN BETWEEN A PERSON AND HELP • ZERO AUTH RESCUE PROTOCOL
      </div>
    </div>
  );
};
