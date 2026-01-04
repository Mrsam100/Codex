# CODEX — A Living Surface for Thought

A production-ready, free, and open-source spatial thought-mapping application that visualizes and connects ideas using AI-powered semantic analysis.

![CODEX Banner](https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6)

## 🌟 Features

### Core Functionality
- **Fragment Capture**: Input thoughts, quotes, or observations as floating nodes on a spatial canvas
- **AI-Powered Semantic Analysis**: Automatic categorization, tag generation, and connection discovery using Google Gemini AI
- **Visual Graph Network**: Interactive visualization of thoughts with strength-based relationships
- **The Librarian**: AI-powered search and synthesis across your entire collection of thoughts
- **AI Image Generation**: Generate symbolic visualizations for thoughts
- **Multiple Themes**: Void (dark), Manuscript (light), and Eclipse (blue-dark) themes

### User Experience
- **No Login Required**: Completely free and open, no account creation needed
- **Local-First**: All data stored in browser localStorage - your thoughts stay private
- **Import/Export**: JSON-based backup and restore functionality
- **Temporal Filtering**: Filter fragments by time horizon (1-90 days)
- **Fully Responsive**: Optimized for mobile (320px+), tablets, and desktop
- **Touch Support**: Full touch gesture support for mobile devices
- **Keyboard Shortcuts**: `Cmd/Ctrl+K` for command palette, `Escape` to navigate back

### Production Ready
- **Comprehensive Error Handling**: User-friendly notifications for all errors
- **localStorage Quota Management**: Warnings and graceful handling of storage limits
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support
- **SEO Optimized**: Complete meta tags, Open Graph tags, and semantic HTML
- **Performance Optimized**: Efficient rendering and state management
- **Security Headers**: XSS protection, frame options, content security policies

## 🚀 Quick Start

### Development

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Add your Google Gemini API key to .env
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### Production Deployment

#### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variable in Vercel dashboard:
# GEMINI_API_KEY = your_api_key_here
```

#### Deploy to Netlify

1. Build: `npm run build`
2. Deploy the `dist` folder
3. Add `GEMINI_API_KEY` environment variable

## 🔑 API Key Setup

Get your free Google Gemini API key:

1. Visit [Google AI Studio](https://ai.google.dev/)
2. Click "Get API Key"
3. Create a new API key
4. Add to `.env`: `GEMINI_API_KEY=your_api_key_here`

**Note**: App works without API key, but AI features will be disabled.

## 📱 Mobile Experience

- Touch gestures (drag to pan, pinch to zoom)
- Responsive UI (44x44px minimum touch targets)
- Mobile-first design
- Optimized performance for mobile browsers

## ♿ Accessibility

- ARIA labels on all interactive elements
- Full keyboard navigation support
- Screen reader compatible
- WCAG AA compliant color contrast (4.5:1)
- Clear focus indicators
- Semantic HTML structure

## 🔒 Privacy & Security

- **No tracking or analytics**
- **All data stored locally in browser**
- **No backend or server storage**
- **Only text sent to Gemini API for analysis**
- **Security headers for XSS/clickjacking protection**
- **HTTPS enforced in production**

## 💾 Data Management

### Storage
- Browser localStorage (5-10MB typical limit)
- Storage usage warnings
- Graceful quota handling

### Export/Import
- Export as JSON file (with formatted output)
- Import previously exported data
- Automatic filename with date

## 🎨 Themes

- **Void**: Dark mode with warm gold accents (default)
- **Manuscript**: Light mode with sepia tones
- **Eclipse**: Blue-dark mode with cool tones

## ⌨️ Keyboard Shortcuts

- `Cmd/Ctrl + K` → Open command palette
- `Escape` → Close panels / return to void
- `Enter` → Submit fragment
- `Enter/Space` → Activate focused element

## 🛠️ Tech Stack

- React 19 + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- Google Gemini AI (semantic analysis)
- Lucide React (icons)
- localStorage (persistence)

## 🐛 Troubleshooting

### AI features not working
- Verify `GEMINI_API_KEY` is set correctly
- Check API key validity at [Google AI Studio](https://ai.google.dev/)
- Check browser console for errors

### Storage quota exceeded
- Export data regularly
- Delete old fragments
- Check browser storage settings

### Import failing
- Ensure valid JSON file
- Verify file exported from CODEX
- Re-export if corrupted

## 📊 Performance Features

- Core Web Vitals optimized
- Efficient React rendering with memoization
- Force-directed layout algorithm
- Debounced operations
- CDN asset delivery

## 📄 License

Open source and free for all use.

## 🤝 Contributing

Contributions welcome! Fork, create feature branch, submit PR.

---

**Built for nonlinear thinkers** • v1.0.0 • Production Ready • Free & Open Source

View in AI Studio: https://ai.studio/apps/drive/1N8iO6u0Xq5z6ZJTwnkbp7dtqBEzx9Qou
