
import React from 'react';
import { Sparkles, Zap, Shield, BookOpen } from 'lucide-react';
import { View } from '../types';

interface LandingPageProps {
  onEnter: () => void;
  onNavigate: (view: View) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter, onNavigate }) => {
  return (
    <div className="fixed inset-0 z-[500] bg-[#0A0A0B] overflow-y-auto">
      <div className="min-h-screen flex items-center justify-center text-center px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-24">
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] md:w-[800px] h-[400px] sm:h-[600px] md:h-[800px] bg-[#8B7355]/5 rounded-full blur-[80px] sm:blur-[100px] md:blur-[120px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center">
          {/* Header */}
          <header className="mb-8 sm:mb-12 md:mb-16 w-full">
            <h1 className="font-cormorant text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-[#F5F2E8] mb-3 sm:mb-4 tracking-tight">
              Codex
            </h1>
            <p className="font-spectral italic text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-[#8B7355] max-w-xs sm:max-w-xl md:max-w-2xl mx-auto leading-relaxed px-2 sm:px-4">
              A living surface for nonlinear thought. Capture fragments, discover semantic connections, and explore the architecture of your mind.
            </p>
          </header>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 w-full max-w-6xl mb-8 sm:mb-12 md:mb-16">
          <FeatureCard
            icon={<Sparkles className="text-[#C9A962]" size={24} />}
            title="Semantic Weaving"
            desc="AI-driven analysis that automatically identifies thematic links between disparate thoughts."
          />
          <FeatureCard
            icon={<Zap className="text-[#C9A962]" size={24} />}
            title="Instant Synthesis"
            desc="The Librarian helps you query your entire mental graph to generate new insights."
          />
          <FeatureCard
            icon={<Shield className="text-[#C9A962]" size={24} />}
            title="Local-First"
            desc="No accounts, no trackers. Your data lives exclusively in your browser storage."
          />
          <FeatureCard
            icon={<BookOpen className="text-[#C9A962]" size={24} />}
            title="Spatial Canvas"
            desc="Escape the constraints of folders and lists with a vast, associative void."
          />
        </div>

        {/* CTA Button */}
        <button
          onClick={onEnter}
          className="bg-[#C9A962] text-[#0A0A0B] font-mono uppercase tracking-[0.2em] sm:tracking-[0.3em] px-8 sm:px-10 md:px-12 py-4 sm:py-5 rounded-sm hover:bg-[#F5F2E8] transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(201,169,98,0.3)] text-xs sm:text-sm w-full sm:w-auto max-w-xs"
          aria-label="Enter the application"
        >
          Enter the Void
        </button>

          {/* Footer */}
          <footer className="mt-12 sm:mt-16 md:mt-20 flex flex-col items-center gap-4 sm:gap-6 w-full pb-8 sm:pb-0">
            <nav className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 text-[#8B7355] font-mono text-[10px] sm:text-[11px] uppercase tracking-wider sm:tracking-widest px-4">
              <button onClick={() => onNavigate('about')} className="hover:text-[#C9A962] transition-colors whitespace-nowrap">About</button>
              <button onClick={() => onNavigate('guide')} className="hover:text-[#C9A962] transition-colors whitespace-nowrap">How It Works</button>
              <button onClick={() => onNavigate('faq')} className="hover:text-[#C9A962] transition-colors whitespace-nowrap">FAQ</button>
              <button onClick={() => onNavigate('privacy')} className="hover:text-[#C9A962] transition-colors whitespace-nowrap">Privacy</button>
              <button onClick={() => onNavigate('terms')} className="hover:text-[#C9A962] transition-colors whitespace-nowrap">Terms</button>
            </nav>
            <div className="text-[#8B7355]/50 font-mono text-[9px] sm:text-[10px] uppercase tracking-wider sm:tracking-widest flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-8 px-4">
              <span className="whitespace-nowrap">v1.0.0</span>
              <span className="whitespace-nowrap">Free & Open Source</span>
              <span className="whitespace-nowrap">Local Persistence</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="bg-[#1A1A1C]/50 border border-[#3A3A3C]/50 p-5 sm:p-6 md:p-8 rounded-lg text-left backdrop-blur-xl hover:border-[#3A3A3C]/80 transition-all hover:shadow-[0_0_20px_rgba(201,169,98,0.1)]">
    <div className="mb-3 sm:mb-4">{icon}</div>
    <h3 className="font-cormorant text-lg sm:text-xl text-[#F5F2E8] mb-1.5 sm:mb-2">{title}</h3>
    <p className="font-spectral text-xs sm:text-sm text-[#8B7355] leading-relaxed">{desc}</p>
  </div>
);

export default LandingPage;
