import React from 'react';
import { ShieldCheck, Lock, Globe } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800/80 bg-white/50 dark:bg-slate-950/50 py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <svg className="w-4 h-4" viewBox="0 0 48 48" fill="none">
                <path d="M24 8L36 30H28L24 20L20 30H12L24 8Z" fill="currentColor" />
                <circle cx="24" cy="37" r="3.5" fill="#ffffff" />
              </svg>
            </div>
            <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
              Artha Finance
            </span>
            <span className="text-xs text-slate-400">|</span>
            <span className="text-xs text-slate-500">
              International Fintech Architecture
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              256-bit Encryption
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-emerald-500" />
              HTTP-Only Cookies
            </span>
            <span className="flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-emerald-500" />
              5 Indian Languages
            </span>
          </div>

          <div className="text-xs text-slate-400 dark:text-slate-500">
            © {new Date().getFullYear()} Artha Finance. Made by{' '}
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Krish Verma
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
