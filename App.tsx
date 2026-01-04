
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Plus, Minimize, HelpCircle, Wind, Download, Upload, Clock, Moon, Sun, Filter, History } from 'lucide-react';
import VoidCanvas from './components/VoidCanvas';
import CommandPalette from './components/CommandPalette';
import DetailPanel from './components/DetailPanel';
import LandingPage from './components/LandingPage';
import InfoPage from './components/InfoPages';
import NotificationContainer, { Notification } from './components/Notification';
import { Fragment, Connection, View, Theme } from './types';
import { analyzeNewFragment, generateThoughtImage } from './services/geminiService';
import { storageService } from './services/storageService';

const App: React.FC = () => {
  const [fragments, setFragments] = useState<Fragment[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [activeFragmentId, setActiveFragmentId] = useState<string | null>(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [inputVal, setInputVal] = useState('');
  const [currentView, setCurrentView] = useState<View>('landing');
  const [hasInitialized, setHasInitialized] = useState(false);
  const [minStrength, setMinStrength] = useState(0.2);
  const [theme, setTheme] = useState<Theme>('void');
  const [timeFilterDays, setTimeFilterDays] = useState<number>(30);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((type: Notification['type'], message: string, duration = 5000) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { id, type, message, duration }]);
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Load state
  useEffect(() => {
    const result = storageService.load();
    if (result.error) {
      addNotification('error', result.error.message);
    } else if (result.data) {
      setFragments(result.data.fragments || []);
      setConnections(result.data.connections || []);
      if (result.data.minStrength !== undefined) setMinStrength(result.data.minStrength);
      if (result.data.theme !== undefined) setTheme(result.data.theme);
    }
    setHasInitialized(true);
  }, [addNotification]);

  // Save state
  useEffect(() => {
    if (hasInitialized) {
      const error = storageService.save({ fragments, connections, minStrength, theme });
      if (error) {
        addNotification('error', error.message, 10000);
      }
    }
  }, [fragments, connections, hasInitialized, minStrength, theme, addNotification]);

  // Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
        setActiveFragmentId(null);
        if (currentView !== 'void' && currentView !== 'landing') setCurrentView('void');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentView]);

  const addFragment = useCallback(async (text: string) => {
    if (!text.trim()) return;
    setIsProcessing(true);
    
    const angle = Math.random() * Math.PI * 2;
    const radius = 50 + Math.random() * 150;
    const now = Date.now();
    const newFragment: Fragment = {
      id: Math.random().toString(36).substr(2, 9),
      text,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      createdAt: now,
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      importance: 1,
      tags: [],
      category: 'Processing'
    };

    setFragments(prev => [...prev, newFragment]);
    setInputVal('');

    try {
      const results = await analyzeNewFragment(newFragment, fragments);
      setFragments(prev => prev.map(f =>
        f.id === newFragment.id
        ? { ...f, category: results.category, tags: results.tags }
        : f
      ));

      if (results.connections) {
        const newConnections: Connection[] = results.connections.map((c: any) => ({
          id: `conn-${Math.random().toString(36).substr(2, 5)}`,
          from: newFragment.id,
          to: c.targetId,
          strength: c.strength,
          label: c.label
        }));
        setConnections(prev => [...prev, ...newConnections]);
      }
    } catch (error: any) {
      console.warn("Analysis failed:", error);
      addNotification('warning', 'AI analysis unavailable. Fragment saved without semantic connections.');
    } finally {
      setIsProcessing(false);
    }
  }, [fragments, addNotification]);

  const visualizeThought = async (id: string) => {
    const target = fragments.find(f => f.id === id);
    if (!target || target.imageUrl) return;

    setIsProcessing(true);
    try {
      const url = await generateThoughtImage(target.text);
      if (url) {
        setFragments(prev => prev.map(f => f.id === id ? { ...f, imageUrl: url } : f));
        addNotification('success', 'Image generated successfully!');
      } else {
        addNotification('error', 'Failed to generate image. Please try again.');
      }
    } catch (error) {
      addNotification('error', 'Image generation failed. Please check your API key.');
    } finally {
      setIsProcessing(false);
    }
  };

  const deleteFragment = (id: string) => {
    setFragments(prev => prev.filter(f => f.id !== id));
    setConnections(prev => prev.filter(c => c.from !== id && c.to !== id));
    setActiveFragmentId(null);
  };

  const updateFragmentImportance = (id: string, importance: number) => {
    setFragments(prev => prev.map(f => f.id === id ? { ...f, importance } : f));
  };

  const relaxCanvas = () => {
    setFragments(prev => {
      const next = [...prev];
      for (let k = 0; k < 5; k++) { // Multi-pass for smoothness
        for (let i = 0; i < next.length; i++) {
          for (let j = i + 1; j < next.length; j++) {
            const dx = next[i].x - next[j].x;
            const dy = next[i].y - next[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            if (dist < 320) {
              const force = (320 - dist) * 0.05;
              next[i].x += (dx / dist) * force;
              next[i].y += (dy / dist) * force;
              next[j].x -= (dx / dist) * force;
              next[j].y -= (dy / dist) * force;
            }
          }
        }
      }
      return next;
    });
  };

  const filteredFragments = useMemo(() => {
    const cutoff = Date.now() - (timeFilterDays * 24 * 60 * 60 * 1000);
    return fragments.filter(f => f.createdAt > cutoff);
  }, [fragments, timeFilterDays]);

  const activeFragment = fragments.find(f => f.id === activeFragmentId) || null;

  const themeColors = {
    void: 'bg-[#0A0A0B] text-[#F5F2E8]',
    manuscript: 'bg-[#F2EFE4] text-[#2A2A2C]',
    eclipse: 'bg-[#0D1B2A] text-[#E0E1DD]'
  };

  if (currentView === 'landing' && fragments.length === 0) {
    return <LandingPage onEnter={() => setCurrentView('void')} onNavigate={setCurrentView} />;
  }

  return (
    <div className={`relative w-screen h-screen overflow-hidden font-spectral transition-colors duration-1000 ${themeColors[theme]}`}>
      {/* Background Micro-Interactions */}
      <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
        {[...Array(25)].map((_, i) => (
          <div 
            key={i}
            className={`absolute w-px h-px ${theme === 'manuscript' ? 'bg-[#2A2A2C]' : 'bg-[#8B7355]'} rounded-full animate-pulse`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${3 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      {currentView === 'void' ? (
        <>
          <header className="fixed top-10 left-1/2 -translate-x-1/2 z-50 text-center pointer-events-none flex flex-col items-center">
            <h1 className="font-cormorant text-sm tracking-[0.8em] uppercase opacity-80 cursor-pointer pointer-events-auto" style={{ color: theme === 'manuscript' ? '#2A2A2C' : '#8B7355' }} onClick={() => setCurrentView('landing')}>Codex</h1>
            <div className={`mt-2 w-12 h-px ${theme === 'manuscript' ? 'bg-[#2A2A2C]/20' : 'bg-[#8B7355]/30'}`} />
          </header>

          <VoidCanvas 
            fragments={filteredFragments} 
            connections={connections.filter(c => c.strength >= minStrength)} 
            activeFragmentId={activeFragmentId}
            zoom={zoom}
            theme={theme}
            onFragmentSelect={setActiveFragmentId}
            onZoomChange={setZoom}
          />

          {/* Temporal Filter Slider */}
          <div className="fixed bottom-36 left-4 md:left-8 flex flex-col gap-4 z-[60] bg-[#1A1A1C]/10 p-3 md:p-4 rounded-lg backdrop-blur-sm border border-white/5 group">
            <div className="flex items-center gap-2 md:gap-3 text-[#8B7355]">
              <History size={14} className="md:w-4 md:h-4" />
              <span className="font-mono text-[8px] md:text-[9px] uppercase tracking-widest">{timeFilterDays}d</span>
            </div>
            <input
              type="range" min="1" max="90" value={timeFilterDays}
              onChange={(e) => setTimeFilterDays(parseInt(e.target.value))}
              className="w-20 md:w-32 accent-[#C9A962] appearance-none h-1 bg-[#2A2A2C]/30 rounded-full"
            />
          </div>

          <div className="fixed bottom-6 md:bottom-14 left-1/2 -translate-x-1/2 w-[90%] max-w-[600px] z-[60] px-2 md:px-0">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addFragment(inputVal)}
              placeholder="Scribe a fragment..."
              className={`w-full ${theme === 'manuscript' ? 'bg-[#EAE7DC]/90 text-[#2A2A2C] border-[#D8D5C9]' : 'bg-[#1A1A1C]/90 text-[#F5F2E8] border-[#3A3A3C]/50'} border focus:border-[#C9A962] rounded-sm py-3 md:py-5 px-4 md:px-7 font-spectral text-base md:text-lg outline-none transition-all backdrop-blur-2xl shadow-2xl placeholder-[#8B7355]/30`}
            />
          </div>

          {/* Theme Selector */}
          <div className="fixed top-10 left-4 md:left-8 flex items-center gap-3 md:gap-4 z-[60]">
             <button onClick={() => setTheme('void')} aria-label="Void theme" className={`w-6 h-6 md:w-4 md:h-4 rounded-full border border-white/20 bg-[#0A0A0B] ${theme === 'void' ? 'ring-2 ring-[#C9A962]' : ''} transition-all`} />
             <button onClick={() => setTheme('manuscript')} aria-label="Manuscript theme" className={`w-6 h-6 md:w-4 md:h-4 rounded-full border border-black/20 bg-[#F2EFE4] ${theme === 'manuscript' ? 'ring-2 ring-[#C9A962]' : ''} transition-all`} />
             <button onClick={() => setTheme('eclipse')} aria-label="Eclipse theme" className={`w-6 h-6 md:w-4 md:h-4 rounded-full border border-white/20 bg-[#0D1B2A] ${theme === 'eclipse' ? 'ring-2 ring-[#C9A962]' : ''} transition-all`} />
          </div>

          {/* Action Bar */}
          <div className="fixed top-10 right-4 md:right-8 flex items-center gap-4 md:gap-6 z-[60]">
             <button onClick={relaxCanvas} title="Organize Gravity" aria-label="Organize fragments" className="text-[#8B7355] hover:text-[#C9A962] transition-colors p-2 md:p-0"><Wind size={16} className="md:w-[18px] md:h-[18px]" /></button>
             <button onClick={() => setCurrentView('guide')} aria-label="Open guide" className="text-[#8B7355] hover:text-[#C9A962] transition-colors p-2 md:p-0"><HelpCircle size={16} className="md:w-[18px] md:h-[18px]" /></button>
             <button onClick={() => {
               const error = storageService.exportJSON({ fragments, connections, minStrength, theme });
               if (error) {
                 addNotification('error', error);
               } else {
                 addNotification('success', 'Data exported successfully!', 3000);
               }
             }} aria-label="Export data" className="text-[#8B7355] hover:text-[#C9A962] transition-colors p-2 md:p-0"><Download size={16} className="md:w-[18px] md:h-[18px]" /></button>
             <label className="cursor-pointer text-[#8B7355] hover:text-[#C9A962] transition-colors p-2 md:p-0">
                <Upload size={16} className="md:w-[18px] md:h-[18px]" />
                <input type="file" className="hidden" accept=".json" aria-label="Import data" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      try {
                        const data = JSON.parse(ev.target?.result as string);
                        setFragments(data.fragments || []);
                        setConnections(data.connections || []);
                        if (data.minStrength !== undefined) setMinStrength(data.minStrength);
                        if (data.theme) setTheme(data.theme);
                        addNotification('success', 'Data imported successfully!', 3000);
                      } catch (err) {
                        addNotification('error', 'Failed to import file. Please ensure it is a valid CODEX export.');
                      }
                    };
                    reader.readAsText(file);
                  }
                  e.target.value = '';
                }} />
             </label>
          </div>

          <div className="fixed bottom-24 md:bottom-6 right-4 md:right-8 flex flex-col gap-2 z-[60]">
            <button onClick={() => setZoom(prev => Math.min(3, prev * 1.2))} aria-label="Zoom in" className="w-12 h-12 md:w-10 md:h-10 bg-[#2A2A2C]/40 border border-[#3A3A3C]/50 rounded flex items-center justify-center text-[#8B7355] hover:text-[#F5F2E8] transition-all backdrop-blur-md active:scale-95"><Plus size={20} className="md:w-[18px] md:h-[18px]" /></button>
            <button onClick={() => setZoom(prev => Math.max(0.1, prev / 1.2))} aria-label="Zoom out" className="w-12 h-12 md:w-10 md:h-10 bg-[#2A2A2C]/40 border border-[#3A3A3C]/50 rounded flex items-center justify-center text-[#8B7355] hover:text-[#F5F2E8] transition-all backdrop-blur-md active:scale-95"><Minimize size={20} className="md:w-[18px] md:h-[18px]" /></button>
          </div>
        </>
      ) : (
        <InfoPage view={currentView} onBack={() => setCurrentView('void')} />
      )}

      <CommandPalette 
        isOpen={isCommandPaletteOpen} 
        onClose={() => setIsCommandPaletteOpen(false)} 
        fragments={fragments}
        onSelect={(id) => { setActiveFragmentId(id); setIsCommandPaletteOpen(false); }}
      />

      <DetailPanel 
        fragment={activeFragment} 
        connections={connections.filter(c => c.from === activeFragmentId || c.to === activeFragmentId)}
        fragments={fragments}
        minStrength={minStrength}
        onMinStrengthChange={setMinStrength}
        onClose={() => setActiveFragmentId(null)}
        onFragmentSelect={setActiveFragmentId}
        onDelete={deleteFragment}
        onVisualize={visualizeThought}
        onImportanceChange={updateFragmentImportance}
      />

      {isProcessing && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 bg-[#1A1A1C]/80 px-5 py-3 rounded-full border border-[#C9A962]/20 backdrop-blur-md shadow-2xl">
          <div className="w-4 h-4 border-2 border-[#C9A962]/20 border-t-[#C9A962] rounded-full animate-spin" />
          <span className="font-mono text-[10px] text-[#C9A962] uppercase tracking-[0.3em]">Weaving Consciousness...</span>
        </div>
      )}

      <NotificationContainer notifications={notifications} onDismiss={dismissNotification} />
    </div>
  );
};

export default App;
