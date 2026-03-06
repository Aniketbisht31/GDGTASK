import React, { useRef, useState, useCallback } from 'react';
import { useCanvas } from '../context/CanvasContext';
import { CanvasElement, TextElement } from '../types';

interface Props {
    element: CanvasElement;
}

const handlePositions: { id: string; style: React.CSSProperties }[] = [
    { id: 'tl', style: { top: -5, left: -5, cursor: 'nwse-resize' } },
    { id: 't', style: { top: -5, left: 'calc(50% - 4px)', cursor: 'ns-resize' } },
    { id: 'tr', style: { top: -5, right: -5, cursor: 'nesw-resize' } },
    { id: 'r', style: { top: 'calc(50% - 4px)', right: -5, cursor: 'ew-resize' } },
    { id: 'br', style: { bottom: -5, right: -5, cursor: 'nwse-resize' } },
    { id: 'b', style: { bottom: -5, left: 'calc(50% - 4px)', cursor: 'ns-resize' } },
    { id: 'bl', style: { bottom: -5, left: -5, cursor: 'nesw-resize' } },
    { id: 'l', style: { top: 'calc(50% - 4px)', left: -5, cursor: 'ew-resize' } },
];

export const CanvasElementRender: React.FC<Props> = ({ element }) => {
    const { selectedElementId, setSelectedElementId, updateElement } = useCanvas();
    const isSelected = selectedElementId === element.id;

    const isDraggingRef = useRef(false);
    const isResizingRef = useRef<string | null>(null);
    const startRef = useRef({ x: 0, y: 0, ex: 0, ey: 0, ew: 0, eh: 0 });
    const [editingText, setEditingText] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        if ((e.target as HTMLElement).classList.contains('resize-handle')) return;
        e.stopPropagation();
        setSelectedElementId(element.id);
        isDraggingRef.current = true;
        setIsDragging(true);
        startRef.current = { x: e.clientX, y: e.clientY, ex: element.x, ey: element.y, ew: element.width, eh: element.height };
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    };

    const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        if (isDraggingRef.current) {
            const dx = e.clientX - startRef.current.x;
            const dy = e.clientY - startRef.current.y;
            updateElement(element.id, {
                x: startRef.current.ex + dx,
                y: startRef.current.ey + dy,
            });
        }
    }, [element.id, updateElement]);

    const handlePointerUp = useCallback(() => {
        isDraggingRef.current = false;
        isResizingRef.current = null;
        setIsDragging(false);
    }, []);

    const handleResizeDown = (e: React.PointerEvent<HTMLDivElement>, handleId: string) => {
        e.stopPropagation();
        setSelectedElementId(element.id);
        isResizingRef.current = handleId;
        startRef.current = { x: e.clientX, y: e.clientY, ex: element.x, ey: element.y, ew: element.width, eh: element.height };
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    };

    const handleResizeMove = useCallback((e: React.PointerEvent<HTMLDivElement>, handleId: string) => {
        if (isResizingRef.current !== handleId) return;
        const dx = e.clientX - startRef.current.x;
        const dy = e.clientY - startRef.current.y;
        let newW = startRef.current.ew;
        let newH = startRef.current.eh;
        let newX = startRef.current.ex;
        let newY = startRef.current.ey;

        if (handleId.includes('r')) newW = Math.max(20, startRef.current.ew + dx);
        if (handleId.includes('b')) newH = Math.max(20, startRef.current.eh + dy);
        if (handleId.includes('l')) {
            newW = Math.max(20, startRef.current.ew - dx);
            newX = startRef.current.ex + (startRef.current.ew - newW);
        }
        if (handleId.includes('t')) {
            newH = Math.max(20, startRef.current.eh - dy);
            newY = startRef.current.ey + (startRef.current.eh - newH);
        }
        updateElement(element.id, { x: newX, y: newY, width: newW, height: newH });
    }, [element.id, updateElement]);

    const handleDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        if (element.type === 'text') setEditingText(true);
    };

    const getOpacity = () => {
        return (element as any).opacity ?? 1;
    };

    const renderContent = () => {
        switch (element.type) {
            case 'rectangle':
                return (
                    <div
                        style={{
                            width: '100%',
                            height: '100%',
                            backgroundColor: element.fill,
                            borderRadius: `${element.borderRadius}px`,
                        }}
                    />
                );
            case 'text': {
                const el = element as TextElement;
                if (editingText) {
                    return (
                        <textarea
                            autoFocus
                            defaultValue={el.text}
                            onBlur={(e) => {
                                updateElement(element.id, { text: e.target.value });
                                setEditingText(false);
                            }}
                            style={{
                                width: '100%',
                                height: '100%',
                                background: 'transparent',
                                border: 'none',
                                outline: 'none',
                                resize: 'none',
                                fontSize: `${el.fontSize}px`,
                                fontFamily: el.fontFamily,
                                color: el.color,
                                fontWeight: el.bold ? 700 : 400,
                                fontStyle: el.italic ? 'italic' : 'normal',
                                textAlign: el.align,
                                padding: '4px',
                            }}
                            onClick={e => e.stopPropagation()}
                        />
                    );
                }
                return (
                    <div
                        style={{
                            width: '100%',
                            height: '100%',
                            color: el.color,
                            fontSize: `${el.fontSize}px`,
                            fontFamily: el.fontFamily,
                            fontWeight: el.bold ? 700 : 400,
                            fontStyle: el.italic ? 'italic' : 'normal',
                            textAlign: el.align,
                            display: 'flex',
                            alignItems: 'center',
                            overflow: 'hidden',
                            padding: '4px',
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                        }}
                    >
                        {el.text}
                    </div>
                );
            }
            case 'image':
                return (
                    <img
                        src={element.src}
                        alt="element"
                        draggable={false}
                        style={{ width: '100%', height: '100%', objectFit: element.objectFit, display: 'block' }}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onDoubleClick={handleDoubleClick}
            style={{
                position: 'absolute',
                left: element.x,
                top: element.y,
                width: element.width,
                height: element.height,
                zIndex: element.zIndex,
                outline: isSelected ? '2px solid #6c63ff' : 'none',
                outlineOffset: '1px',
                cursor: isDragging ? 'grabbing' : 'grab',
                userSelect: 'none',
                touchAction: 'none',
                opacity: getOpacity(),
            }}
        >
            {renderContent()}

            {isSelected && handlePositions.map(({ id, style }) => (
                <div
                    key={id}
                    className="resize-handle"
                    style={style}
                    onPointerDown={(e) => handleResizeDown(e, id)}
                    onPointerMove={(e) => handleResizeMove(e, id)}
                    onPointerUp={handlePointerUp}
                />
            ))}
        </div>
    );
};
