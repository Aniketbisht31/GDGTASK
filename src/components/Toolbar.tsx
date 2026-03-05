import React from 'react';
import { useCanvas } from '../context/CanvasContext';
import { ElementType } from '../types';

const SelectIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 3l14 9-7 1-4 7z" />
    </svg>
);

const RectIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="18" height="14" rx="2" />
    </svg>
);

const TextIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 7V4h16v3M9 20h6M12 4v16" />
    </svg>
);

const ImageIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="M21 15l-5-5L5 21" />
    </svg>
);

const tools: { id: ElementType | 'select'; label: string; Icon: React.ComponentType }[] = [
    { id: 'select', label: 'Select (V)', Icon: SelectIcon },
    { id: 'rectangle', label: 'Rectangle (R)', Icon: RectIcon },
    { id: 'text', label: 'Text (T)', Icon: TextIcon },
    { id: 'image', label: 'Image (I)', Icon: ImageIcon },
];

export const Toolbar: React.FC = () => {
    const { activeTool, setActiveTool } = useCanvas();

    return (
        <aside className="toolbar">
            <div className="toolbar-group">
                {tools.map((tool) => (
                    <button
                        key={tool.id}
                        className={`tool-button ${activeTool === tool.id ? 'active' : ''}`}
                        title={tool.label}
                        onClick={() => setActiveTool(tool.id)}
                    >
                        <tool.Icon />
                    </button>
                ))}
            </div>
        </aside>
    );
};
