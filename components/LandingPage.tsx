
import React from 'react';
import { Sparkles, Zap, Shield, BookOpen } from 'lucide-react';

interface LandingPageProps {
  onEnter: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  return (
    <div className="fixed inset-0 z-[500] bg-[#0A0A0B] flex flex-col items-center justify-center text-center p-6 overflow-y-auto">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#8B7355]/5 rounded-full blur-[120px] pointer-events-none" />

      <header className="relative z-10 mb-16">
        <h1 className="font-cormorant text-6xl md:text-8xl text-[#F5F2E8] mb-4 tracking-tight">Codex</h1>
        <p className="font-spectral italic text-xl md:text-2xl text-[#8B7355] max-w-2xl mx-auto leading-relaxed">
          A living surface for nonlinear thought. Capture fragments, discover semantic connections, and explore the architecture of your mind.
        </p>
      </header>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl w-full mb-16">
        <FeatureCard 
          icon={<Sparkles className="text-[#C9A962]" />}
          title="Semantic Weaving"
          desc="AI-driven analysis that automatically identifies thematic links between disparate thoughts."
        />
        <FeatureCard 
          icon={<Zap className="text-[#C9A962]" />}
          title="Instant Synthesis"
          desc="The Librarian helps you query your entire mental graph to generate new insights."
        />
        <FeatureCard 
          icon={<Shield className="text-[#C9A962]" />}
          title="Local-First"
          desc="No accounts, no trackers. Your data lives exclusively in your browser storage."
        />
        <FeatureCard 
          icon={<BookOpen className="text-[#C9A962]" />}
          title="Spatial Canvas"
          desc="Escape the constraints of folders and lists with a vast, associative void."
        />
      </div>

      <button 
        onClick={onEnter}
        className="relative z-10 bg-[#C9A962] text-[#0A0A0B] font-mono uppercase tracking-[0.3em] px-12 py-5 rounded-sm hover:bg-[#F5F2E8] transition-all transform hover:scale-105 shadow-[0_0_40px_rgba(201,169,98,0.3)]"
      >
        Enter the Void
      </button>

      <footer className="relative z-10 mt-20 text-[#8B7355]/50 font-mono text-[10px] uppercase tracking-widest flex gap-8">
        <span>v1.0.0 Ready</span>
        <span>Free & Open Source</span>
        <span>Local Persistence Enabled</span>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="bg-[#1A1A1C]/50 border border-[#3A3A3C]/50 p-8 rounded-lg text-left backdrop-blur-xl">
    <div className="mb-4">{icon}</div>
    <h3 className="font-cormorant text-xl text-[#F5F2E8] mb-2">{title}</h3>
    <p className="font-spectral text-sm text-[#8B7355] leading-relaxed">{desc}</p>
  </div>
);

export default LandingPage;
