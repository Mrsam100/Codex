
import React from 'react';
import { X, Link as LinkIcon, Clock, Trash2, Sliders, Sparkles, Image as ImageIcon, Tag, Zap } from 'lucide-react';
import { Fragment, Connection } from '../types';

interface DetailPanelProps {
  fragment: Fragment | null;
  connections: Connection[];
  fragments: Fragment[];
  minStrength: number;
  onMinStrengthChange: (val: number) => void;
  onClose: () => void;
  onFragmentSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onVisualize: (id: string) => void;
  onImportanceChange: (id: string, importance: number) => void;
}

const DetailPanel: React.FC<DetailPanelProps> = ({ 
    fragment, 
    connections, 
    fragments, 
    minStrength,
    onMinStrengthChange,
    onClose,
    onFragmentSelect,
    onDelete,
    onVisualize,
    onImportanceChange
}) => {
  if (!fragment) return null;

  const visibleConnections = connections.filter(c => c.strength >= minStrength);

  return (
    <div className={`
        fixed top-0 right-0 h-full w-full md:max-w-[440px] bg-[#121214] border-l border-[#2A2A2C] z-[150] p-6 md:p-10 backdrop-blur-3xl overflow-y-auto shadow-[-50px_0_120px_rgba(0,0,0,0.8)]
        transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
    `}>
      <div className="flex justify-between items-start mb-6 md:mb-10">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-[#C9A962] uppercase tracking-widest">{fragment.category || 'Fragment'}</span>
          <div className="flex items-center gap-2 text-[9px] font-mono text-[#8B7355] uppercase tracking-[0.2em]">
            <Clock size={10} />
            <span>{fragment.timestamp}</span>
          </div>
        </div>
        <div className="flex gap-2 md:gap-3">
          {!fragment.imageUrl && (
            <button
              onClick={() => onVisualize(fragment.id)}
              className="w-10 h-10 md:w-8 md:h-8 rounded-full border border-[#3A3A3C] flex items-center justify-center text-[#C9A962] hover:border-[#C9A962] transition-all active:scale-95"
              title="Visualize with AI"
              aria-label="Visualize with AI"
            >
              <ImageIcon size={16} className="md:w-[14px] md:h-[14px]" />
            </button>
          )}
          <button onClick={() => { if(confirm("Erase this fragment?")) onDelete(fragment.id); }} className="w-10 h-10 md:w-8 md:h-8 rounded-full border border-[#3A3A3C] flex items-center justify-center text-[#8B7355] hover:text-red-400 transition-all active:scale-95" aria-label="Delete fragment"><Trash2 size={16} className="md:w-[14px] md:h-[14px]" /></button>
          <button onClick={onClose} className="w-10 h-10 md:w-8 md:h-8 rounded-full border border-[#3A3A3C] flex items-center justify-center text-[#8B7355] hover:text-[#F5F2E8] transition-all active:scale-95" aria-label="Close panel"><X size={18} className="md:w-[16px] md:h-[16px]" /></button>
        </div>
      </div>

      <div className="space-y-12">
        {fragment.imageUrl && (
          <div className="relative group rounded-lg overflow-hidden border border-[#3A3A3C]/50 shadow-2xl aspect-square">
            <img src={fragment.imageUrl} alt="AI Visualization" className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        )}

        <section>
          <h2 className="font-spectral text-xl md:text-2xl font-light leading-relaxed text-[#F5F2E8]">
            {fragment.text}
          </h2>
        </section>

        {fragment.tags && fragment.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {fragment.tags.map(tag => (
              <span key={tag} className="flex items-center gap-1.5 px-3 py-1 bg-[#1A1A1C] border border-[#3A3A3C]/30 rounded-full text-[9px] font-mono text-[#8B7355] uppercase tracking-widest">
                <Tag size={10} className="opacity-50" />
                {tag}
              </span>
            ))}
          </div>
        )}

        <section className="bg-[#1A1A1C]/30 p-6 rounded-lg border border-[#3A3A3C]/20 space-y-8">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-cormorant text-xs tracking-[0.3em] uppercase text-[#C9A962] flex items-center gap-2">
                <Zap size={12} />
                Importance
              </h3>
              <span className="font-mono text-[10px] text-[#C9A962]">{fragment.importance}</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="3" 
              step="1" 
              value={fragment.importance} 
              onChange={(e) => onImportanceChange(fragment.id, parseInt(e.target.value))} 
              className="w-full accent-[#C9A962] h-1 bg-[#2A2A2C] rounded-full appearance-none cursor-pointer" 
            />
            <div className="flex justify-between mt-2 font-mono text-[8px] text-[#8B7355] uppercase tracking-widest">
              <span>Minor</span>
              <span>Core</span>
              <span>Essential</span>
            </div>
          </div>

          <div className="pt-6 border-t border-[#2A2A2C]/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-cormorant text-xs tracking-[0.3em] uppercase text-[#C9A962] flex items-center gap-2">
                <Sliders size={12} />
                Global Resonance
              </h3>
              <span className="font-mono text-[10px] text-[#C9A962]">{Math.round(minStrength * 100)}%</span>
            </div>
            <input type="range" min="0" max="1" step="0.05" value={minStrength} onChange={(e) => onMinStrengthChange(parseFloat(e.target.value))} className="w-full accent-[#C9A962] h-1 bg-[#2A2A2C] rounded-full appearance-none cursor-pointer" />
          </div>
        </section>

        <section>
          <h3 className="font-cormorant text-xs tracking-[0.3em] uppercase text-[#8B7355] border-b border-[#2A2A2C] pb-4 mb-6 flex items-center justify-between">
            <span>Semantic Echoes</span>
            <LinkIcon size={12} className="opacity-50" />
          </h3>
          
          <div className="space-y-4">
            {visibleConnections.length > 0 ? visibleConnections.map(conn => {
              const targetId = conn.from === fragment.id ? conn.to : conn.from;
              const target = fragments.find(f => f.id === targetId);
              if (!target) return null;

              return (
                <div key={conn.id} onClick={() => onFragmentSelect(target.id)} className="p-5 border border-[#3A3A3C]/40 hover:border-[#C9A962]/40 rounded group cursor-pointer transition-all hover:bg-[#1A1A1C]/50">
                  <p className="font-spectral text-sm text-[#F5F2E8]/60 group-hover:text-[#F5F2E8] line-clamp-2 leading-relaxed mb-3 italic">"{target.text}"</p>
                  <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-widest">
                    <span className="text-[#8B7355]">{conn.label}</span>
                    <span className="text-[#C9A962]">{Math.round(conn.strength * 100)}% Match</span>
                  </div>
                </div>
              );
            }) : (
              <div className="py-10 text-center text-[#8B7355]/40 italic font-spectral text-sm">Silence in this frequency.</div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default DetailPanel;
