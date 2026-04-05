import React, { useState } from 'react';
import { Smartphone, Menu, X } from 'lucide-react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="relative mb-8 px-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">

          <span className="font-display text-2xl font-bold tracking-tight text-white italic">
            juzu
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden items-center gap-6 md:flex">
          <a href="#features" className="text-sm font-medium text-slate-400 transition hover:text-white">Features</a>
          <a href="#how-it-works" className="text-sm font-medium text-slate-400 transition hover:text-white">How it works</a>
          <a href="#vcf-tool" className="group rounded-full border border-slate-800 bg-slate-900/50 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 hover:border-slate-700">
            VCF Tool
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6 transition-all" /> : <Menu className="h-6 w-6 transition-all" />}
        </button>
      </div>

      {/* Mobile Menu Content */}
      {isOpen && (
        <div className="absolute top-14 right-0 left-0 z-50 rounded-[2rem] border border-slate-800 bg-slate-950/95 p-6 backdrop-blur-xl md:hidden shadow-2xl animate-in fade-in zoom-in duration-200">
          <div className="flex flex-col gap-5">
            <a
              href="#features"
              onClick={() => setIsOpen(false)}
              className="text-lg font-medium text-slate-300 hover:text-brand-400 transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={() => setIsOpen(false)}
              className="text-lg font-medium text-slate-300 hover:text-brand-400 transition-colors"
            >
              How it works
            </a>
            <a
              href="#vcf-tool"
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center justify-center rounded-2xl bg-brand-500 py-4 text-base font-bold text-slate-950 shadow-lg shadow-brand-500/20 active:scale-[0.98] transition"
            >
              Start Creating VCF
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
