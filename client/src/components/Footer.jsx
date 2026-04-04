import React from 'react';
import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-12 border-t border-slate-800/80 bg-slate-950/20 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-4 text-center md:flex-row md:justify-between md:text-left">
          <p className="text-sm text-slate-400">
            &copy; {new Date().getFullYear()} Bulk WhatsApp Contact Generator. All rights reserved.
          </p>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-800/80 bg-slate-900/50 px-4 py-2 text-sm text-slate-300 shadow-sm backdrop-blur-sm">
            <span>Developed by</span>
            <span className="font-bold text-white hover:text-brand-400 transition-colors pointer-events-none">
              Jayshiva Tiwari
            </span>
            <Heart className="h-4 w-4 text-rose-500 fill-rose-500 animate-pulse" />
          </div>
        </div>
      </div>
    </footer>
  );
}
