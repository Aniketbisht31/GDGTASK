export type ElementType = 'rectangle' | 'text' | 'image';

export interface BaseElement {
    id: string;
    type: ElementType;
    x: number;
    y: number;
    width: number;
    height: number;
    zIndex: number;
    name?: string;
    rotation?: number;
    isVisible?: boolean;
}

export interface RectangleElement extends BaseElement {
    type: 'rectangle';
    fill: string;
    borderRadius: number;
    opacity: number;
}

export interface TextElement extends BaseElement {
    type: 'text';
    text: string;
    fontSize: number;
    fontFamily: string;
    color: string;
    bold: boolean;
    italic: boolean;
    align: 'left' | 'center' | 'right';
}

export interface ImageElement extends BaseElement {
    type: 'image';
    src: string;
    objectFit: 'cover' | 'contain' | 'fill';
}

export type CanvasElement = RectangleElement | TextElement | ImageElement;
