import { useEffect, useCallback } from 'react';
import { Toolbar } from './components/Toolbar';
import { CanvasArea } from './components/CanvasArea';
import { RightPanel } from './components/RightPanel';
import { useCanvas } from './context/CanvasContext';
import './index.css';

function App() {
  const {
    deleteElement,
    duplicateElement,
    selectedElementId,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useCanvas();

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const tag = (document.activeElement as HTMLElement)?.tagName?.toUpperCase();
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

    if ((e.key === 'Delete' || e.key === 'Backspace') && selectedElementId) {
      deleteElement(selectedElementId);
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
      e.preventDefault();
      if (selectedElementId) duplicateElement(selectedElementId);
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
      e.preventDefault();
      if (e.shiftKey) redo();
      else undo();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
      e.preventDefault();
      redo();
    }
  }, [deleteElement, duplicateElement, selectedElementId, undo, redo]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const exportPng = () => {
    const board = document.getElementById('canvas-board');
    if (!board) return;

    import('html2canvas').then(({ default: html2canvas }) => {
      html2canvas(board, { backgroundColor: '#ffffff', scale: 2 }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'canvas-design.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    }).catch(() => {
      alert('Export failed - html2canvas not available');
    });
  };

  return (
    <div className="app-container">
      <header className="topbar">
        <div className="topbar-left">
          <div className="topbar-brand">✦ Design Canvas</div>
          <div className="topbar-gdg-badge">
            <img src="/gdg-logo.png" alt="Google Developer Groups" className="gdg-logo" />
          </div>
        </div>

        <div className="topbar-actions">
          <button className="topbar-btn" onClick={undo} disabled={!canUndo} title="Undo (Ctrl+Z)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 14L4 9l5-5" /><path d="M4 9h11a4 4 0 0 1 0 8h-1" /></svg>
            Undo
          </button>
          <button className="topbar-btn" onClick={redo} disabled={!canRedo} title="Redo (Ctrl+Shift+Z)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 14l5-5-5-5" /><path d="M20 9H9a4 4 0 0 0 0 8h1" /></svg>
            Redo
          </button>

          <div className="topbar-separator" />

          <button className="topbar-btn primary" onClick={exportPng} title="Export as PNG">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
            Export PNG
          </button>
        </div>
      </header>

      <main className="main-content">
        <Toolbar />
        <CanvasArea />
        <RightPanel />
      </main>
    </div>
  );
}

export default App;
