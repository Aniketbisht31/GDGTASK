import React from 'react';
import { useCanvas } from '../context/CanvasContext';

export const PropertiesPanel: React.FC = () => {
    const { elements, selectedElementId, updateElement, deleteElement } = useCanvas();

    const selectedElement = elements.find((e) => e.id === selectedElementId);

    if (!selectedElement) {
        return (
            <aside className="properties-panel">
                <div className="panel-header">Properties</div>
                <div className="panel-content">
                    <p style={{ color: 'var(--text-secondary)', fontSize: '13px', textAlign: 'center', marginTop: '40px' }}>
                        Select an element to edit its properties.
                    </p>
                </div>
            </aside>
        );
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        let parsedValue: any = value;

        if (type === 'number') {
            parsedValue = Number(value);
        }

        if (['x', 'y', 'width', 'height', 'fontSize'].includes(name)) {
            parsedValue = Number(value);
            if (isNaN(parsedValue)) return;
        }

        updateElement(selectedElement.id, { [name]: parsedValue });
    };

    return (
        <aside className="properties-panel">
            <div className="panel-header">Properties - {selectedElement.type}</div>
            <div className="panel-content" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

                {/* Transform Properties */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Transform</div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>X</label>
                            <input
                                type="number"
                                name="x"
                                value={Math.round(selectedElement.x)}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '6px', background: 'var(--bg-app)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px' }}
                            />
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Y</label>
                            <input
                                type="number"
                                name="y"
                                value={Math.round(selectedElement.y)}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '6px', background: 'var(--bg-app)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px' }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Width</label>
                            <input
                                type="number"
                                name="width"
                                value={Math.round(selectedElement.width)}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '6px', background: 'var(--bg-app)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px' }}
                            />
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Height</label>
                            <input
                                type="number"
                                name="height"
                                value={Math.round(selectedElement.height)}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '6px', background: 'var(--bg-app)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px' }}
                            />
                        </div>
                    </div>
                </div>

                {/* Specific Properties */}
                {selectedElement.type === 'rectangle' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Appearance</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Fill Color</label>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <input
                                    type="color"
                                    name="fill"
                                    value={selectedElement.fill}
                                    onChange={handleChange}
                                    style={{ width: '30px', height: '30px', padding: '0', border: 'none', background: 'none', cursor: 'pointer' }}
                                />
                                <input
                                    type="text"
                                    name="fill"
                                    value={selectedElement.fill}
                                    onChange={handleChange}
                                    style={{ flex: 1, padding: '6px', background: 'var(--bg-app)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px' }}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {selectedElement.type === 'text' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Typography</div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Text</label>
                            <input
                                type="text"
                                name="text"
                                value={selectedElement.text}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '6px', background: 'var(--bg-app)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px' }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Font Size</label>
                                <input
                                    type="number"
                                    name="fontSize"
                                    value={selectedElement.fontSize}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '6px', background: 'var(--bg-app)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px' }}
                                />
                            </div>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Color</label>
                                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                                    <input
                                        type="color"
                                        name="color"
                                        value={selectedElement.color}
                                        onChange={handleChange}
                                        style={{ width: '24px', height: '24px', padding: '0', border: 'none', background: 'none', cursor: 'pointer' }}
                                    />
                                    <input
                                        type="text"
                                        name="color"
                                        value={selectedElement.color}
                                        onChange={handleChange}
                                        style={{ flex: 1, width: '100%', padding: '6px', background: 'var(--bg-app)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px' }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Font Family</label>
                            <select
                                name="fontFamily"
                                value={selectedElement.fontFamily}
                                onChange={(e) => updateElement(selectedElement.id, { fontFamily: e.target.value })}
                                style={{ width: '100%', padding: '6px', background: 'var(--bg-app)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px' }}
                            >
                                <option value="Inter, sans-serif">Inter</option>
                                <option value="Arial, sans-serif">Arial</option>
                                <option value="'Times New Roman', serif">Times New Roman</option>
                                <option value="'Courier New', monospace">Courier New</option>
                            </select>
                        </div>
                    </div>
                )}

                {selectedElement.type === 'image' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Image Source</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>URL</label>
                            <input
                                type="text"
                                name="src"
                                value={selectedElement.src}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '6px', background: 'var(--bg-app)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px' }}
                            />
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
                    <button
                        onClick={() => deleteElement(selectedElement.id)}
                        style={{ width: '100%', padding: '8px', background: 'rgba(229, 20, 0, 0.1)', color: 'var(--danger)', borderRadius: '4px', fontWeight: 500, border: '1px solid rgba(229, 20, 0, 0.3)' }}
                    >
                        Delete Element
                    </button>
                </div>
            </div>
        </aside>
    );
};
