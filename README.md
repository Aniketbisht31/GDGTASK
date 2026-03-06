# ✦ Design Canvas Editor

A specialized visual design tool built with React and TypeScript, inspired by simplified design workspace workflows and a creative sense of coding

##  Key Features

- **Dynamic Element Creation**: Add rectangles, text blocks, and image placeholders.
- **Interactive Manipulation**: Drag to reposition and use 8-handle resizing for precise control.
- **Layer Management**: Control stacking order through the dedicated layers panel.
- **Advanced Properties**: Dedicated property editor for colors, border radius, opacity, and typography.
- **Native Undo/Redo**: Global state history management for seamless design iteration.
- **Export Capabilities**: High-fidelity PNG export for finalized designs.

##  Technology Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Styling**: Vanilla CSS (Modern Dark Theme)
- **Bundler**: Vite
- **Integrations**: html2canvas for PNG rendering

##  Project Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

##  Keyboard Shortcuts

- `Delete` / `Backspace`: Remove selected element
- `Ctrl + D`: Duplicate selected element
- `Ctrl + Z`: Undo
- `Ctrl + Shift + Z` or `Ctrl + Y`: Redo
