import React, { useEffect, useRef, useState } from 'react';

interface Props {
  onComplete: () => void;
}

export const CinematicSplashScreen: React.FC<Props> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [phase, setPhase] = useState<'CRISIS' | 'SHIFT' | 'RELIEF'>('CRISIS');
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  // Camera Handheld Shake offsets
  const [cameraTransform, setCameraTransform] = useState({ x: 0, y: 0, rotate: 0, scale: 1 });

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

    // 1. Heavy rain streaks for Crisis phase
    const rainCount = 180;
    const rainStreaks: Array<{ x: number; y: number; length: number; speedX: number; speedY: number; opacity: number }> = [];
    for (let i = 0; i < rainCount; i++) {
      rainStreaks.push({
        x: Math.random() * width,
        y: Math.random() * height,
        length: Math.random() * 35 + 20,
        speedX: -6 - Math.random() * 4,
        speedY: 24 + Math.random() * 15,
        opacity: Math.random() * 0.5 + 0.3
      });
    }

    // 2. Realistic Lens Droplets
    const dropletCount = 20;
    const lensDroplets: Array<{ x: number; y: number; radius: number; trailLength: number; dripSpeed: number; opacity: number }> = [];
    for (let i = 0; i < dropletCount; i++) {
      lensDroplets.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 4 + 2,
        trailLength: Math.random() * 25 + 10,
        dripSpeed: Math.random() * 3 + 1,
        opacity: Math.random() * 0.6 + 0.3
      });
    }

    // 3. Floating debris in floodwater
    const debris = [
      { x: width * 0.2, y: height * 0.75, width: 45, height: 14, speed: 1.2, bob: 0 },
      { x: width * 0.6, y: height * 0.82, width: 70, height: 18, speed: 1.5, bob: 1.5 },
      { x: width * 0.85, y: height * 0.78, width: 35, height: 12, speed: 1.0, bob: 3.0 }
    ];

    // 4. Golden hour morning light motes for Relief phase
    const lightMotesCount = 35;
    const lightMotes: Array<{ x: number; y: number; radius: number; speedY: number; opacity: number; pulse: number }> = [];
    for (let i = 0; i < lightMotesCount; i++) {
      lightMotes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 3 + 1,
        speedY: -(Math.random() * 1.2 + 0.5),
        opacity: Math.random() * 0.6 + 0.3,
        pulse: Math.random() * Math.PI
      });
    }

    // Lightning & flare state
    let lightningFlash = 0;
    let lastLightningTime = 0;

    const startTime = performance.now();
    const duration = 1400; // Ultra-quick 1.4 seconds cinematic sequence

    const render = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      setProgress(Math.round(t * 100));

      // Quick snappy camera physics
      if (elapsed < 450) {
        const shakeX = (Math.sin(elapsed * 0.03) * 5) * (1 - elapsed / 600);
        const shakeY = (Math.cos(elapsed * 0.025) * 6) * (1 - elapsed / 600);
        const rotate = (Math.sin(elapsed * 0.02) * 0.8) * (1 - elapsed / 600);
        setCameraTransform({ x: shakeX, y: shakeY, rotate, scale: 1.02 });
      } else {
        const dollyProgress = (elapsed - 450) / 950;
        setCameraTransform({ x: 0, y: 0, rotate: 0, scale: 1 + dollyProgress * 0.03 });
      }

      // Phase identification
      if (elapsed < 450) {
        setPhase('CRISIS');
      } else if (elapsed < 900) {
        setPhase('SHIFT');
      } else {
        setPhase('RELIEF');
      }

      ctx.clearRect(0, 0, width, height);

      // ========================================================
      // 0.0s – 0.45s (THE REALITY OF CRISIS: STORM & RAIN)
      // ========================================================
      if (elapsed < 450) {
        const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
        bgGrad.addColorStop(0, '#090d16');
        bgGrad.addColorStop(0.55, '#0b1322');
        bgGrad.addColorStop(0.65, '#0d1d33');
        bgGrad.addColorStop(1, '#050c18');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        const waterY = height * 0.65;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
        ctx.fillRect(0, waterY, width, height - waterY);

        // Lightning Flash
        if (now - lastLightningTime > 200 && Math.random() < 0.35) {
          lightningFlash = 0.9;
          lastLightningTime = now;
        }
        if (lightningFlash > 0) {
          ctx.fillStyle = `rgba(224, 242, 254, ${lightningFlash * 0.4})`;
          ctx.fillRect(0, 0, width, height);
          lightningFlash *= 0.75;
        }

        // Heavy Rain streaks
        ctx.strokeStyle = 'rgba(186, 230, 253, 0.4)';
        ctx.lineWidth = 1.6;
        for (let r of rainStreaks) {
          ctx.beginPath();
          ctx.moveTo(r.x, r.y);
          ctx.lineTo(r.x + r.speedX, r.y + r.length);
          ctx.stroke();
          r.x += r.speedX;
          r.y += r.speedY;
          if (r.y > height) {
            r.y = -30;
            r.x = Math.random() * width;
          }
        }

        // Water Droplets dripping on Camera Lens
        for (let d of lensDroplets) {
          ctx.beginPath();
          ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${d.opacity * 0.3})`;
          ctx.fill();
          ctx.strokeStyle = `rgba(186, 230, 253, ${d.opacity * 0.6})`;
          ctx.lineWidth = 1;
          ctx.stroke();

          d.y += d.dripSpeed;
          if (d.y > height + 20) {
            d.y = -10;
            d.x = Math.random() * width;
          }
        }
      }
      // ========================================================
      // 0.45s – 0.9s (THE NATURAL SHIFT: LENS FLARE DISPERSION)
      // ========================================================
      else if (elapsed < 900) {
        const shiftProgress = (elapsed - 450) / 450;

        const bgGrad = ctx.createRadialGradient(
          width * 0.5, height * 0.35, 10,
          width / 2, height / 2, width * 0.9
        );
        bgGrad.addColorStop(0, `rgba(251, 146, 60, ${0.45 * shiftProgress})`);
        bgGrad.addColorStop(0.35, `rgba(30, 58, 138, ${0.8 - shiftProgress * 0.3})`);
        bgGrad.addColorStop(1, '#020617');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // Anamorphic Golden Lens Flare Streak
        const flareY = height * 0.38;
        const flareGrad = ctx.createLinearGradient(0, flareY, width, flareY);
        flareGrad.addColorStop(0, 'rgba(251, 146, 60, 0)');
        flareGrad.addColorStop(0.4, `rgba(253, 224, 71, ${0.8 * shiftProgress})`);
        flareGrad.addColorStop(0.5, `rgba(255, 255, 255, ${0.95 * shiftProgress})`);
        flareGrad.addColorStop(0.6, `rgba(56, 189, 248, ${0.8 * shiftProgress})`);
        flareGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');

        ctx.save();
        ctx.translate(width / 2, flareY);
        ctx.rotate(-0.06);
        ctx.fillStyle = flareGrad;
        ctx.fillRect(-width, -10 * shiftProgress, width * 2, 20 * shiftProgress);
        ctx.restore();

        // Expanding Light Bloom
        const bloomGrad = ctx.createRadialGradient(width * 0.5, flareY, 0, width * 0.5, flareY, 200 * shiftProgress);
        bloomGrad.addColorStop(0, `rgba(255, 255, 255, ${0.85 * shiftProgress})`);
        bloomGrad.addColorStop(0.4, `rgba(251, 146, 60, ${0.45 * shiftProgress})`);
        bloomGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = bloomGrad;
        ctx.beginPath();
        ctx.arc(width * 0.5, flareY, 200 * shiftProgress, 0, Math.PI * 2);
        ctx.fill();
      }
      // ========================================================
      // 0.9s – 1.4s (THE POINT OF RELIEF: BRUSHED METAL EMBLEM)
      // ========================================================
      else {
        const bgGrad = ctx.createRadialGradient(width * 0.5, height * 0.35, 50, width / 2, height / 2, width * 0.85);
        bgGrad.addColorStop(0, '#111827');
        bgGrad.addColorStop(0.5, '#090d16');
        bgGrad.addColorStop(1, '#020617');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        const sunbeam = ctx.createRadialGradient(width * 0.3, height * 0.1, 20, width * 0.5, height * 0.5, width * 0.6);
        sunbeam.addColorStop(0, 'rgba(251, 146, 60, 0.28)');
        sunbeam.addColorStop(0.6, 'rgba(245, 158, 11, 0.06)');
        sunbeam.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = sunbeam;
        ctx.fillRect(0, 0, width, height);

        // Floating morning dust particles
        for (let m of lightMotes) {
          m.pulse += 0.08;
          const alpha = m.opacity * (0.6 + 0.4 * Math.sin(m.pulse));
          ctx.beginPath();
          ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(253, 224, 71, ${alpha})`;
          ctx.shadowColor = '#f59e0b';
          ctx.shadowBlur = 6;
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
    }, 200);
  };

  return (
    <div
      onClick={handleEnd}
      className={`fixed inset-0 z-50 overflow-hidden select-none bg-slate-950 flex flex-col items-center justify-center transition-opacity duration-300 cursor-pointer ${
        isFadingOut ? 'opacity-0 pointer-events-none scale-105' : 'opacity-100'
      }`}
    >
      {/* Background Interactive Documentary Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* Top Right Skip Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleEnd();
        }}
        className="absolute top-5 right-5 z-30 px-3.5 py-1 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white text-xs font-bold tracking-wide backdrop-blur-md transition active:scale-95 flex items-center gap-1.5 shadow-lg"
      >
        <span>Skip</span>
        <span>→</span>
      </button>

      {/* Centerpiece 3D Brushed Metal Emblem & Typography */}
      <div
        className="relative z-20 flex flex-col items-center justify-center text-center p-6 space-y-4 max-w-lg mx-auto transition-transform duration-75"
        style={{
          transform: `translate(${cameraTransform.x}px, ${cameraTransform.y}px) rotate(${cameraTransform.rotate}deg) scale(${cameraTransform.scale})`
        }}
      >
        {/* Dynamic Halo Glow behind Physical Emblem */}
        <div
          className={`absolute -inset-10 rounded-full blur-3xl transition-all duration-500 ${
            phase === 'CRISIS'
              ? 'bg-red-600/20 animate-pulse'
              : phase === 'SHIFT'
              ? 'bg-gradient-to-tr from-amber-500/50 via-cyan-400/40 to-orange-500/60 scale-125'
              : 'bg-gradient-to-tr from-amber-500/30 via-slate-700/20 to-blue-500/30 scale-110'
          }`}
        />

        {/* Photorealistic 3D Metallic Emblem Card */}
        <div
          className={`relative transition-all duration-500 transform ${
            phase === 'CRISIS'
              ? 'scale-90 brightness-75 contrast-125 filter drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)]'
              : phase === 'SHIFT'
              ? 'scale-105 brightness-125 contrast-110 filter drop-shadow-[0_15px_35px_rgba(245,158,11,0.6)]'
              : 'scale-100 brightness-105 contrast-105 filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)]'
          }`}
        >
          <img
            src="/disaster-dhost-hero-logo.png"
            alt="DISASTER DHOST - RESPONSE. RESILIENCE. RECOVERY."
            className="w-52 sm:w-64 h-auto object-contain mx-auto select-none pointer-events-none rounded-2xl"
            onError={(e) => {
              e.currentTarget.src = '/disaster-dhost-logo.png';
            }}
          />
        </div>

        {/* Phase Status Subtitle */}
        <div className="space-y-1 pt-1">
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-slate-900/90 border border-slate-700/80 backdrop-blur-md shadow-xl">
            <span
              className={`w-2 h-2 rounded-full ${
                phase === 'CRISIS'
                  ? 'bg-red-500 animate-ping'
                  : phase === 'SHIFT'
                  ? 'bg-amber-400 animate-pulse'
                  : 'bg-emerald-400'
              }`}
            />
            <span className="text-[10px] font-mono font-black uppercase tracking-widest text-slate-200">
              {phase === 'CRISIS' && 'CRISIS DETECTED • ROOFTOP SURVEILLANCE'}
              {phase === 'SHIFT' && 'WEATHER SHIFT • LENS FLARE DISPERSION'}
              {phase === 'RELIEF' && 'RESPONSE • RESILIENCE • RECOVERY'}
            </span>
          </div>
        </div>

        {/* Cinematic Progress Bar */}
        <div className="w-48 h-1 rounded-full bg-slate-900/90 border border-slate-800 overflow-hidden relative shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-400 transition-all duration-75 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Bottom Mission Tagline */}
      <div className="absolute bottom-4 text-center text-slate-500 text-[10px] font-mono tracking-wider">
        NO LOGIN BETWEEN A PERSON AND HELP • ZERO AUTH PROTOCOL
      </div>
    </div>
  );
};
