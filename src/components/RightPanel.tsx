import React, { useState } from 'react';
import { useCanvas } from '../context/CanvasContext';
import { LayersPanel } from './LayersPanel';
import { formatLabelValue } from '../utils/canvasUtils';

export const RightPanel: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'props' | 'layers'>('props');
    const { elements, selectedElementId, updateElement, deleteElement, duplicateElement, bringForward, sendBackward } = useCanvas();

    const sel = elements.find(e => e.id === selectedElementId);

    /** Handle numerical input changes with validation */
    const handleNum = (name: string, val: string) => {
        if (!sel) return;
        const n = parseFloat(val);
        if (!isNaN(n)) updateElement(sel.id, { [name]: n } as any);
    };

    /** Handle string/text input changes */
    const handleStr = (name: string, val: string) => {
        if (!sel) return;
        updateElement(sel.id, { [name]: val } as any);
    };

    return (
        <div className="right-panel-container">
            <div className="panel-tabs">
                <button className={`panel-tab ${activeTab === 'props' ? 'active' : ''}`} onClick={() => setActiveTab('props')}>Properties</button>
                <button className={`panel-tab ${activeTab === 'layers' ? 'active' : ''}`} onClick={() => setActiveTab('layers')}>Layers</button>
            </div>

            <div className="panel-body">
                {activeTab === 'layers' ? (
                    <LayersPanel />
                ) : !sel ? (
                    <div style={{ color: 'var(--text-secondary)', fontSize: '12px', textAlign: 'center', marginTop: '50px', lineHeight: 1.8, padding: '0 20px' }}>
                        <div style={{ fontSize: '28px', marginBottom: '10px' }}>🎯</div>
                        <div>Select an element on the canvas to edit its properties</div>
                    </div>
                ) : (
                    <div className="properties-panel">
                        {/* Transform */}
                        <div className="prop-section">
                            <div className="prop-section-title">Position & Size</div>
                            <div className="prop-row">
                                <div className="prop-field">
                                    <label className="prop-label">X</label>
                                    <input type="number" className="prop-input" value={formatLabelValue(sel.x)} onChange={e => handleNum('x', e.target.value)} />
                                </div>
                                <div className="prop-field">
                                    <label className="prop-label">Y</label>
                                    <input type="number" className="prop-input" value={formatLabelValue(sel.y)} onChange={e => handleNum('y', e.target.value)} />
                                </div>
                            </div>
                            <div className="prop-row">
                                <div className="prop-field">
                                    <label className="prop-label">Width</label>
                                    <input type="number" className="prop-input" value={formatLabelValue(sel.width)} onChange={e => handleNum('width', e.target.value)} />
                                </div>
                                <div className="prop-field">
                                    <label className="prop-label">Height</label>
                                    <input type="number" className="prop-input" value={formatLabelValue(sel.height)} onChange={e => handleNum('height', e.target.value)} />
                                </div>
                            </div>
                        </div>

                        {/* Rectangle specific */}
                        {sel.type === 'rectangle' && (
                            <div className="prop-section">
                                <div className="prop-section-title">Appearance</div>
                                <div className="prop-row">
                                    <div className="prop-field">
                                        <label className="prop-label">Fill Color</label>
                                        <div className="color-field">
                                            <input type="color" value={sel.fill} onChange={e => handleStr('fill', e.target.value)} />
                                            <input type="text" className="prop-input" value={sel.fill} onChange={e => handleStr('fill', e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                                <div className="prop-row">
                                    <div className="prop-field">
                                        <label className="prop-label">Border Radius</label>
                                        <input type="number" className="prop-input" value={sel.borderRadius} min={0} onChange={e => handleNum('borderRadius', e.target.value)} />
                                    </div>
                                    <div className="prop-field">
                                        <label className="prop-label">Opacity</label>
                                        <input type="number" className="prop-input" value={sel.opacity} min={0} max={1} step={0.1} onChange={e => handleNum('opacity', e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Text specific */}
                        {sel.type === 'text' && (
                            <div className="prop-section">
                                <div className="prop-section-title">Typography</div>
                                <div className="prop-row">
                                    <div className="prop-field">
                                        <label className="prop-label">Content</label>
                                        <input type="text" className="prop-input" value={sel.text} onChange={e => handleStr('text', e.target.value)} />
                                    </div>
                                </div>
                                <div className="prop-row">
                                    <div className="prop-field">
                                        <label className="prop-label">Font Size</label>
                                        <input type="number" className="prop-input" value={sel.fontSize} onChange={e => handleNum('fontSize', e.target.value)} />
                                    </div>
                                    <div className="prop-field">
                                        <label className="prop-label">Color</label>
                                        <div className="color-field">
                                            <input type="color" value={sel.color} onChange={e => handleStr('color', e.target.value)} />
                                            <input type="text" className="prop-input" value={sel.color} onChange={e => handleStr('color', e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                                <div className="prop-row">
                                    <div className="prop-field">
                                        <label className="prop-label">Font</label>
                                        <select className="prop-input" value={sel.fontFamily} onChange={e => handleStr('fontFamily', e.target.value)}>
                                            <option value="Inter, sans-serif">Inter</option>
                                            <option value="Arial, sans-serif">Arial</option>
                                            <option value="'Georgia', serif">Georgia</option>
                                            <option value="'Courier New', monospace">Courier New</option>
                                            <option value="'Trebuchet MS', sans-serif">Trebuchet</option>
                                        </select>
                                    </div>
                                    <div className="prop-field">
                                        <label className="prop-label">Align</label>
                                        <select className="prop-input" value={sel.align} onChange={e => handleStr('align', e.target.value)}>
                                            <option value="left">Left</option>
                                            <option value="center">Center</option>
                                            <option value="right">Right</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="prop-row">
                                    <div className="prop-field">
                                        <label className="prop-label">Style</label>
                                        <div style={{ display: 'flex', gap: '6px' }}>
                                            <button
                                                className="prop-btn secondary"
                                                style={{ flex: 1, fontWeight: 700, padding: '7px', background: sel.bold ? 'rgba(108,99,255,0.2)' : undefined, color: sel.bold ? 'var(--accent)' : undefined }}
                                                onClick={() => updateElement(sel.id, { bold: !sel.bold })}
                                            >B</button>
                                            <button
                                                className="prop-btn secondary"
                                                style={{ flex: 1, fontStyle: 'italic', padding: '7px', background: sel.italic ? 'rgba(108,99,255,0.2)' : undefined, color: sel.italic ? 'var(--accent)' : undefined }}
                                                onClick={() => updateElement(sel.id, { italic: !sel.italic })}
                                            >I</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Image specific */}
                        {sel.type === 'image' && (
                            <div className="prop-section">
                                <div className="prop-section-title">Image</div>
                                <div className="prop-row">
                                    <div className="prop-field">
                                        <label className="prop-label">URL</label>
                                        <input type="text" className="prop-input" value={sel.src} onChange={e => handleStr('src', e.target.value)} placeholder="https://..." />
                                    </div>
                                </div>
                                <div className="prop-row">
                                    <div className="prop-field">
                                        <label className="prop-label">Fit</label>
                                        <select className="prop-input" value={sel.objectFit} onChange={e => handleStr('objectFit', e.target.value)}>
                                            <option value="cover">Cover</option>
                                            <option value="contain">Contain</option>
                                            <option value="fill">Fill</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Layer ordering */}
                        <div className="prop-section">
                            <div className="prop-section-title">Layer Order</div>
                            <div className="prop-row">
                                <button className="prop-btn secondary" style={{ flex: 1, padding: '7px' }} onClick={() => bringForward(sel.id)}>↑ Forward</button>
                                <button className="prop-btn secondary" style={{ flex: 1, padding: '7px' }} onClick={() => sendBackward(sel.id)}>↓ Backward</button>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="prop-section">
                            <div className="prop-section-title">Actions</div>
                            <div className="prop-row">
                                <button className="prop-btn secondary" style={{ flex: 1 }} onClick={() => duplicateElement(sel.id)}>⊕ Duplicate</button>
                            </div>
                            <div className="prop-row">
                                <button className="prop-btn danger" style={{ flex: 1 }} onClick={() => deleteElement(sel.id)}>✕ Delete</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
