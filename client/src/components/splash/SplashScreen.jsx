import React, { useState, useEffect } from 'react';

export const SplashScreen = ({ onComplete }) => {
  const [stage, setStage] = useState(0); // 0: Logo, 1: Welcome text, 2: Creator credit, 3: Fade out

  useEffect(() => {
    // Stage 1: Reveal logo & title (0ms - 1000ms)
    const t1 = setTimeout(() => setStage(1), 700);

    // Stage 2: Reveal creator credit (1500ms - 2800ms)
    const t2 = setTimeout(() => setStage(2), 1600);

    // Stage 3: Begin fade out (2800ms - 3400ms)
    const t3 = setTimeout(() => setStage(3), 2800);

    // Stage 4: Unmount splash screen and hand over to app
    const t4 = setTimeout(() => {
      sessionStorage.setItem('artha_splash_seen', 'true');
      if (onComplete) onComplete();
    }, 3300);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  const handleSkip = () => {
    sessionStorage.setItem('artha_splash_seen', 'true');
    if (onComplete) onComplete();
  };

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-950 text-white transition-opacity duration-500 ${
        stage === 3 ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Subtle Background Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900/20 via-slate-950 to-slate-950 pointer-events-none" />

      {/* Skip Button */}
      <button
        onClick={handleSkip}
        className="absolute top-8 right-8 text-xs font-medium text-slate-400 hover:text-white px-3 py-1.5 rounded-full border border-slate-800 hover:border-slate-700 bg-slate-900/60 backdrop-blur-sm transition-all"
      >
        Skip intro
      </button>

      {/* Centered Brand Animation Container */}
      <div className="relative flex flex-col items-center text-center px-6">
        {/* Animated Geometric Logo Symbol */}
        <div
          className={`w-20 h-20 mb-8 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-[2px] shadow-[0_0_40px_rgba(16,185,129,0.3)] transition-all duration-700 transform ${
            stage >= 0 ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
          }`}
        >
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
            <svg
              className="w-10 h-10 text-emerald-400"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M24 8L36 30H28L24 20L20 30H12L24 8Z"
                fill="currentColor"
              />
              <circle cx="24" cy="37" r="3.5" fill="#10b981" />
            </svg>
          </div>
        </div>

        {/* Brand Welcome Statement */}
        <h1
          className={`text-2xl sm:text-3xl font-bold tracking-tight text-white transition-all duration-700 transform ${
            stage >= 1 ? 'translate-y-0 opacity-100 blur-0' : 'translate-y-3 opacity-0 blur-sm'
          }`}
        >
          Welcome to <span className="text-emerald-400">Artha Finance</span>
        </h1>

        <p
          className={`mt-2 text-sm text-slate-400 max-w-sm transition-all duration-700 transform ${
            stage >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
          }`}
        >
          Intelligent Personal Wealth & Cash Flow Architecture
        </p>

        {/* Creator Attribution */}
        <div
          className={`mt-10 flex items-center gap-2 text-xs uppercase tracking-widest text-slate-500 transition-all duration-700 transform ${
            stage >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          <span className="w-6 h-px bg-slate-800" />
          <span>Made by Krish Verma</span>
          <span className="w-6 h-px bg-slate-800" />
        </div>
      </div>
    </div>
  );
};
