import React from 'react';
import { useCanvas } from '../context/CanvasContext';

const typeIcon: Record<string, string> = {
    rectangle: '▬',
    text: 'T',
    image: '🖼',
};

export const LayersPanel: React.FC = () => {
    const { elements, selectedElementId, setSelectedElementId, deleteElement } = useCanvas();

    const sorted = [...elements].sort((a, b) => b.zIndex - a.zIndex);

    if (sorted.length === 0) {
        return (
            <div className="layer-empty">
                <div style={{ fontSize: '24px', marginBottom: '10px' }}>📋</div>
                <div>No elements yet.</div>
                <div>Add shapes, text or images to the canvas.</div>
            </div>
        );
    }

    return (
        <div className="layers-panel">
            {sorted.map(el => (
                <div
                    key={el.id}
                    className={`layer-item ${el.id === selectedElementId ? 'selected' : ''}`}
                    onClick={() => setSelectedElementId(el.id)}
                >
                    <div className="layer-icon">{typeIcon[el.type] || '?'}</div>
                    <span className="layer-name">{el.name || el.type}</span>
                    <div className="layer-actions">
                        <button className="layer-action-btn" title="Delete" onClick={e => { e.stopPropagation(); deleteElement(el.id); }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                            </svg>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};
