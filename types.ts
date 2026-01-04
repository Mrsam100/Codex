
export interface Fragment {
  id: string;
  text: string;
  timestamp: string; // Display string
  createdAt: number; // For temporal filtering
  x: number;
  y: number;
  importance: number; // 1-3
  tags?: string[];
  category?: string;
  imageUrl?: string;
}

export interface Connection {
  id: string;
  from: string;
  to: string;
  strength: number; // 0-1
  label?: string;
}

export type Theme = 'void' | 'manuscript' | 'eclipse';

export interface CodexState {
  fragments: Fragment[];
  connections: Connection[];
  minStrength?: number;
  theme?: Theme;
}

export type View = 'void' | 'landing' | 'about' | 'privacy' | 'terms' | 'faq' | 'guide';

export interface PanOffset {
  x: number;
  y: number;
}
