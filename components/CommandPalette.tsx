
import React, { useState, useEffect } from 'react';
import { Search, X, Sparkles, Wand2 } from 'lucide-react';
import { Fragment } from '../types';
import { searchCodex } from '../services/geminiService';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  fragments: Fragment[];
  onSelect: (id: string) => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, fragments, onSelect }) => {
  const [query, setQuery] = useState('');
  const [synthesis, setSynthesis] = useState<string | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  
  const filtered = fragments.filter(f => 
    f.text.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);

  const handleSynthesize = async () => {
    if (!query || fragments.length === 0) return;
    setIsSynthesizing(true);
    try {
      const result = await searchCodex(query, fragments);
      setSynthesis(result);
    } catch (err) {
      setSynthesis("The Librarian encountered an error while synthesizing your thoughts.");
    } finally {
      setIsSynthesizing(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setSynthesis(null);
      setIsSynthesizing(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[#050506]/90 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-[650px] bg-[#141416]/98 border border-[#8B7355]/30 rounded-lg shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden transform animate-[scale_0.2s_ease]">
        <div className="flex items-center px-6 py-5 border-b border-[#2A2A2C]">
          <Search size={20} className="text-[#8B7355] mr-4" />
          <input 
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && query && !synthesis && handleSynthesize()}
            placeholder="Search thoughts or ask the Librarian..."
            className="flex-1 bg-transparent border-none outline-none text-[#F5F2E8] font-spectral text-xl placeholder-[#8B7355]/30"
          />
          {query && !synthesis && (
            <button 
              onClick={handleSynthesize}
              disabled={isSynthesizing}
              className="flex items-center gap-2 text-[#C9A962] hover:text-[#F5F2E8] transition-colors text-xs font-mono uppercase tracking-widest disabled:opacity-50"
            >
              <Wand2 size={14} /> {isSynthesizing ? 'Working...' : 'Synthesize'}
            </button>
          )}
          <button onClick={onClose} className="ml-4 text-[#8B7355] hover:text-[#F5F2E8]">
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[450px] overflow-y-auto">
          {synthesis ? (
            <div className="p-8">
              <div className="flex items-center gap-2 mb-6 text-[10px] font-mono text-[#C9A962] uppercase tracking-[0.2em]">
                <Sparkles size={12} /> <span>Librarian Synthesis</span>
              </div>
              <div className="font-spectral text-lg italic text-[#F5F2E8]/90 leading-relaxed border-l-2 border-[#C9A962]/30 pl-6">
                {synthesis}
              </div>
              <button 
                onClick={() => setSynthesis(null)}
                className="mt-8 text-[10px] font-mono text-[#8B7355] uppercase tracking-widest hover:text-[#F5F2E8] transition-colors"
              >
                ← Back to Search
              </button>
            </div>
          ) : filtered.length > 0 ? (
            <div className="p-2">
              <div className="px-4 py-3 text-[10px] font-mono text-[#8B7355] uppercase tracking-widest opacity-50 border-b border-[#2A2A2C] mb-2">Direct Matches</div>
              {filtered.map(f => (
                <button
                  key={f.id}
                  onClick={() => onSelect(f.id)}
                  className="w-full text-left px-5 py-4 hover:bg-[#2A2A2C]/40 rounded group transition-all flex flex-col gap-2 border border-transparent hover:border-[#8B7355]/20"
                >
                  <span className="text-base font-spectral text-[#F5F2E8]/80 group-hover:text-[#F5F2E8] line-clamp-2 leading-relaxed">{f.text}</span>
                  <span className="text-[9px] font-mono text-[#8B7355] uppercase tracking-widest">{f.timestamp}</span>
                </button>
              ))}
            </div>
          ) : query ? (
            <div className="p-16 text-center flex flex-col items-center">
              <Sparkles size={32} className="text-[#8B7355] mb-4 opacity-30" />
              <p className="text-[#8B7355] font-spectral italic text-lg">No direct match found. Try 'Synthesize' to ask across the void.</p>
            </div>
          ) : (
             <div className="p-10 text-[#8B7355]/40 font-spectral italic text-center leading-relaxed">
                "We find our way not through directions, but through associations."<br/>
                <span className="text-[10px] font-mono uppercase tracking-widest mt-4 block">Begin typing to explore</span>
             </div>
          )}
        </div>

        <div className="px-6 py-4 bg-[#0A0A0B] border-t border-[#2A2A2C] flex justify-between items-center text-[9px] font-mono text-[#8B7355] uppercase tracking-widest">
          <div className="flex gap-4">
            <span><kbd className="bg-[#2A2A2C] px-1 rounded text-[#F5F2E8]">ENTER</kbd> TO NAVIGATE</span>
            <span><kbd className="bg-[#2A2A2C] px-1 rounded text-[#F5F2E8]">ESC</kbd> TO CLOSE</span>
          </div>
          <span className="text-[#C9A962]/50 italic">AI Powered Synthesis</span>
        </div>
      </div>
      <style>{`
        @keyframes scale {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default CommandPalette;
