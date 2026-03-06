import React, { useRef } from 'react';
import { useCanvas } from '../context/CanvasContext';
import { CanvasElementRender } from './CanvasElementRender';
import { generateRandomColor } from '../utils/canvasUtils';

const DEFAULT_TEXT = {
    fontSize: 16,
    fontFamily: 'Inter, sans-serif',
    color: '#000000',
    text: 'Double-click to edit',
};

export const CanvasArea: React.FC = () => {
    const { elements, activeTool, addElement, setSelectedElementId } = useCanvas();
    const boardRef = useRef<HTMLDivElement>(null);

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        if (e.target !== boardRef.current) return;

        if (activeTool === 'select') {
            setSelectedElementId(null);
            return;
        }

        const rect = boardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (activeTool === 'rectangle') {
            addElement({
                type: 'rectangle' as const,
                x, y,
                width: 120, height: 80,
                fill: generateRandomColor(),
                borderRadius: 0,
                opacity: 1,
            });
        } else if (activeTool === 'text') {
            addElement({
                type: 'text' as const,
                x, y,
                width: 160, height: 44,
                ...DEFAULT_TEXT,
                bold: false,
                italic: false,
                align: 'left' as const,
            });
        } else if (activeTool === 'image') {
            addElement({
                type: 'image' as const,
                x, y,
                width: 200, height: 150,
                src: `https://picsum.photos/seed/${Date.now()}/400/300`,
                objectFit: 'cover' as const,
            });
        }
    };

    return (
        <section
            className="canvas-area"
            onPointerDown={() => setSelectedElementId(null)}
        >
            <div
                className="canvas-board"
                id="canvas-board"
                ref={boardRef}
                onPointerDown={handlePointerDown}
                style={{ cursor: activeTool === 'select' ? 'default' : 'crosshair' }}
            >
                {elements.length === 0 && (
                    <div className="empty-canvas-hint">
                        <p>😊 Start designing</p>
                        <small>Select a tool from the toolbar</small>
                    </div>
                )}
                {[...elements]
                    .sort((a, b) => a.zIndex - b.zIndex)
                    .map(el => (
                        <CanvasElementRender key={el.id} element={el} />
                    ))}
            </div>
        </section>
    );
};
