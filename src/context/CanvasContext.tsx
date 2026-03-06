import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CanvasElement, ElementType } from '../types';
import { generateId, getDefaultName } from '../utils/canvasUtils';

// Distributive Omit properly handles discriminated unions
type DistributiveOmit<T, K extends keyof any> = T extends any ? Omit<T, K> : never;
type NewElement = DistributiveOmit<CanvasElement, 'id' | 'zIndex'>;

interface CanvasContextType {
    /** Currently rendered elements on the canvas */
    elements: CanvasElement[];
    /** ID of the element being edited */
    selectedElementId: string | null;
    /** Current tool (select, rectangle, text, image) */
    activeTool: ElementType | 'select';
    zoom: number;
    setZoom: (zoom: number) => void;
    canUndo: boolean;
    canRedo: boolean;
    /** Add a new element to the state */
    addElement: (element: NewElement) => void;
    /** Update specific properties of an existing element */
    updateElement: (id: string, updates: Partial<CanvasElement>) => void;
    /** Remove an element from the canvas */
    deleteElement: (id: string) => void;
    /** Create a copy of an existing element with offset */
    duplicateElement: (id: string) => void;
    setSelectedElementId: (id: string | null) => void;
    setActiveTool: (tool: ElementType | 'select') => void;
    /** Move an element forward by one level */
    bringForward: (id: string) => void;
    /** Move an element backward by one level */
    sendBackward: (id: string) => void;
    /** Bring an element to the topmost layer */
    bringToFront: (id: string) => void;
    /** Move an element to the bottom layer */
    sendToBack: (id: string) => void;
    /** Reorder an element to a specific index */
    reorder: (id: string, newIndex: number) => void;
    /** Undo last action */
    undo: () => void;
    /** Redo last undone action */
    redo: () => void;
}

const CanvasContext = createContext<CanvasContextType | undefined>(undefined);

const MAX_HISTORY = 50;

export const CanvasProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [history, setHistory] = useState<CanvasElement[][]>([[]]);
    const [historyIndex, setHistoryIndex] = useState(0);
    const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
    const [activeTool, setActiveTool] = useState<ElementType | 'select'>('select');
    const [zoom, setZoom] = useState(1);

    const elements = history[historyIndex];

    const pushHistory = useCallback((newElements: CanvasElement[]) => {
        setHistory(prev => {
            const newHistory = prev.slice(0, historyIndex + 1);
            newHistory.push(newElements);
            if (newHistory.length > MAX_HISTORY) newHistory.shift();
            return newHistory;
        });
        setHistoryIndex(prev => Math.min(prev + 1, MAX_HISTORY - 1));
    }, [historyIndex]);

    const addElement = useCallback((baseElement: NewElement) => {
        const newElement: CanvasElement = {
            ...baseElement,
            id: generateId(),
            zIndex: elements.length,
            name: baseElement.name || getDefaultName(baseElement.type, elements.length + 1),
            rotation: 0,
            isVisible: true,
        } as CanvasElement;
        const newElements = [...elements, newElement];
        pushHistory(newElements);
        setSelectedElementId(newElement.id);
        setActiveTool('select');
    }, [elements, pushHistory]);

    const updateElement = useCallback((id: string, updates: Partial<CanvasElement>) => {
        const newElements = elements.map(el => el.id === id ? { ...el, ...updates } as CanvasElement : el);
        pushHistory(newElements);
    }, [elements, pushHistory]);

    const deleteElement = useCallback((id: string) => {
        const newElements = elements.filter(el => el.id !== id);
        pushHistory(newElements);
        if (selectedElementId === id) setSelectedElementId(null);
    }, [elements, pushHistory, selectedElementId]);

    const duplicateElement = useCallback((id: string) => {
        const el = elements.find(e => e.id === id);
        if (!el) return;
        const newEl: CanvasElement = {
            ...el,
            id: generateId(),
            x: el.x + 20,
            y: el.y + 20,
            zIndex: elements.length,
            name: `${el.name || el.type} copy`,
            rotation: el.rotation ?? 0,
            isVisible: true,
        };
        const newElements = [...elements, newEl];
        pushHistory(newElements);
        setSelectedElementId(newEl.id);
    }, [elements, pushHistory]);

    const reorder = useCallback((id: string, newIndex: number) => {
        const idx = elements.findIndex(e => e.id === id);
        if (idx === -1 || newIndex < 0 || newIndex >= elements.length) return;
        const next = [...elements];
        const [moved] = next.splice(idx, 1);
        next.splice(newIndex, 0, moved);
        next.forEach((el, i) => (el.zIndex = i));
        pushHistory(next);
    }, [elements, pushHistory]);

    const bringForward = useCallback((id: string) => {
        const idx = elements.findIndex(e => e.id === id);
        reorder(id, idx + 1);
    }, [elements, reorder]);

    const sendBackward = useCallback((id: string) => {
        const idx = elements.findIndex(e => e.id === id);
        reorder(id, idx - 1);
    }, [elements, reorder]);

    const bringToFront = useCallback((id: string) => {
        reorder(id, elements.length - 1);
    }, [elements, reorder]);

    const sendToBack = useCallback((id: string) => {
        reorder(id, 0);
    }, [reorder]);

    const undo = useCallback(() => {
        if (historyIndex > 0) {
            setHistoryIndex(prev => prev - 1);
            setSelectedElementId(null);
        }
    }, [historyIndex]);

    const redo = useCallback(() => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex(prev => prev + 1);
        }
    }, [historyIndex, history.length]);

    return (
        <CanvasContext.Provider
            value={{
                elements,
                selectedElementId,
                activeTool,
                zoom,
                setZoom,
                canUndo: historyIndex > 0,
                canRedo: historyIndex < history.length - 1,
                addElement,
                updateElement,
                deleteElement,
                duplicateElement,
                setSelectedElementId,
                setActiveTool,
                bringForward,
                sendBackward,
                bringToFront,
                sendToBack,
                reorder,
                undo,
                redo,
            }}
        >
            {children}
        </CanvasContext.Provider>
    );
};

export const useCanvas = () => {
    const context = useContext(CanvasContext);
    if (context === undefined) {
        throw new Error('useCanvas must be used within a CanvasProvider');
    }
    return context;
};
