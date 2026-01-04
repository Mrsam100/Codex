
import React from 'react';
import { ArrowLeft, Book, Shield, ScrollText, HelpCircle, Info } from 'lucide-react';
import { View } from '../types';

interface InfoPageProps {
  view: View;
  onBack: () => void;
}

const InfoPage: React.FC<InfoPageProps> = ({ view, onBack }) => {
  const content = {
    about: {
      title: "About Codex",
      icon: <Info className="text-[#C9A962]" size={24} />,
      body: (
        <div className="space-y-4 sm:space-y-6">
          <p>Codex is an experimental spatial interface designed for nonlinear thinking. Unlike traditional note-taking apps that force thoughts into folders or linear lists, Codex treats thoughts as "fragments" in a vast, associative void.</p>
          <p>Using the Gemini 3 Flash model, Codex analyzes the semantic meaning of your entries and suggests connections between them, helping you discover patterns in your own thinking that you might have otherwise missed.</p>
          <p>It is built on the philosophy that human intelligence is associative, not hierarchical. By visualizing the "gravity" between ideas, we can better understand the complex web of our own knowledge.</p>
        </div>
      )
    },
    privacy: {
      title: "Privacy & Security",
      icon: <Shield className="text-[#C9A962]" size={24} />,
      body: (
        <div className="space-y-4 sm:space-y-6">
          <p>Your thoughts are yours alone. Codex operates on a "Local-First" principle:</p>
          <ul className="list-disc pl-4 sm:pl-5 space-y-2">
            <li><strong>No Accounts:</strong> We do not collect names, emails, or passwords.</li>
            <li><strong>Local Storage:</strong> All data is stored directly in your browser's LocalStorage. If you clear your browser cache, your fragments will be deleted unless exported.</li>
            <li><strong>AI Processing:</strong> Your text is sent to Google Gemini for semantic analysis only. We do not store this data on our servers.</li>
          </ul>
        </div>
      )
    },
    terms: {
      title: "Terms of Service",
      icon: <ScrollText className="text-[#C9A962]" size={24} />,
      body: (
        <div className="space-y-4 sm:space-y-6">
          <p>Codex is provided as-is, as a free tool for personal thought exploration. By using this tool, you acknowledge that:</p>
          <ul className="list-disc pl-4 sm:pl-5 space-y-2">
            <li>We are not responsible for any data loss resulting from browser updates or clearing local storage.</li>
            <li>The tool is currently in a "preview" state and features may change or be removed at any time.</li>
            <li>Users are encouraged to use the "Export" feature frequently to back up critical thinking work.</li>
          </ul>
        </div>
      )
    },
    faq: {
      title: "Frequently Asked Questions",
      icon: <HelpCircle className="text-[#C9A962]" size={24} />,
      body: (
        <div className="space-y-6 sm:space-y-8">
          <div>
            <h4 className="text-[#F5F2E8] font-medium mb-2 text-base sm:text-lg">How are connections made?</h4>
            <p>We use Gemini's Large Language Model to calculate semantic similarity. It looks for shared concepts, metaphors, or logical relationships between your fragments.</p>
          </div>
          <div>
            <h4 className="text-[#F5F2E8] font-medium mb-2 text-base sm:text-lg">Can I use this offline?</h4>
            <p>The interface works offline, but connecting new thoughts and using the "Librarian" search requires an active internet connection to reach the Gemini API.</p>
          </div>
          <div>
            <h4 className="text-[#F5F2E8] font-medium mb-2 text-base sm:text-lg">How many fragments can I add?</h4>
            <p>There is no hard limit, but browser LocalStorage typically handles up to 5MB of data—thousands of fragments.</p>
          </div>
        </div>
      )
    },
    guide: {
        title: "How It Works",
        icon: <Book className="text-[#C9A962]" size={24} />,
        body: (
          <div className="space-y-4 sm:space-y-6">
            <p><span className="inline-block w-6 sm:w-8 text-[#C9A962] font-bold">1.</span> <strong>Capture:</strong> Use the input bar at the bottom to record a single thought, quote, or observation.</p>
            <p><span className="inline-block w-6 sm:w-8 text-[#C9A962] font-bold">2.</span> <strong>Connect:</strong> As you add more, the AI will weave lines between them based on thematic similarity.</p>
            <p><span className="inline-block w-6 sm:w-8 text-[#C9A962] font-bold">3.</span> <strong>Synthesize:</strong> Press <kbd className="bg-[#2A2A2C] px-2 py-0.5 rounded text-xs sm:text-sm">⌘K</kbd> to open the Command Palette. Type a question like "What are my thoughts on simplicity?" and the "Librarian" will synthesize an answer from your combined fragments.</p>
            <p><span className="inline-block w-6 sm:w-8 text-[#C9A962] font-bold">4.</span> <strong>Explore:</strong> Click and drag the void to move around. Use scroll or the plus/minus buttons to zoom.</p>
          </div>
        )
      }
  };

  const activeContent = content[view as keyof typeof content];

  return (
    <div className="fixed inset-0 z-[1000] bg-[#0A0A0B] overflow-y-auto">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#8B7355] hover:text-[#F5F2E8] transition-colors mb-8 sm:mb-12 font-mono text-xs uppercase tracking-widest active:scale-95"
          aria-label="Back to void"
        >
          <ArrowLeft size={14} /> Back to the Void
        </button>

        <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          {activeContent?.icon}
          <h1 className="font-cormorant text-3xl sm:text-4xl md:text-5xl text-[#F5F2E8] tracking-tight">{activeContent?.title}</h1>
        </div>

        <div className="font-spectral text-base sm:text-lg leading-relaxed text-[#8B7355] border-t border-[#2A2A2C] pt-8 sm:pt-12">
          {activeContent?.body}
        </div>
      </div>
    </div>
  );
};

export default InfoPage;
