import React, { useState, useRef } from 'react';
import { Rnd } from 'react-rnd';
import { Trash2, RotateCw } from 'lucide-react';
import { getFurnitureIcon } from '../utils/furnitureIcons';


const FurnitureCanvas = ({ imageUrl, placedFurniture, onUpdateFurniture, onRemoveFurniture }) => {
    const canvasRef = useRef(null);
    const [isDragOver, setIsDragOver] = useState(false);

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);

        const furnitureData = e.dataTransfer.getData('furniture');
        if (!furnitureData) return;

        const furniture = JSON.parse(furnitureData);
        const rect = canvasRef.current.getBoundingClientRect();

        // Calculate drop position relative to canvas
        const x = e.clientX - rect.left - 50; // Center furniture on cursor
        const y = e.clientY - rect.top - 50;

        const newItem = {
            id: `placed-${Date.now()}`,
            furnitureId: furniture.ID,
            name: furniture.NAME,
            description: furniture.DESCRIPTION,
            category: furniture.CATEGORY,
            x,
            y,
            width: furniture.WIDTH_CM || 100,
            height: furniture.HEIGHT_CM || 100,
            rotation: 0
        };

        onUpdateFurniture([...placedFurniture, newItem]);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const updateItemPosition = (id, d) => {
        const updated = placedFurniture.map(item =>
            item.id === id ? { ...item, x: d.x, y: d.y } : item
        );
        onUpdateFurniture(updated);
    };

    const updateItemSize = (id, ref, position) => {
        const updated = placedFurniture.map(item =>
            item.id === id
                ? {
                    ...item,
                    width: ref.offsetWidth,
                    height: ref.offsetHeight,
                    x: position.x,
                    y: position.y
                }
                : item
        );
        onUpdateFurniture(updated);
    };

    const rotateItem = (id) => {
        const updated = placedFurniture.map(item =>
            item.id === id ? { ...item, rotation: (item.rotation + 45) % 360 } : item
        );
        onUpdateFurniture(updated);
    };

    return (
        <div
            ref={canvasRef}
            className={`relative w-full h-full bg-gray-50 rounded-2xl overflow-hidden border-2 transition-all ${isDragOver ? 'border-accent border-dashed bg-accent/5' : 'border-gray-200'
                }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
        >
            {/* Background Image */}
            {imageUrl && (
                <img
                    src={imageUrl}
                    alt="Room"
                    className="w-full h-full object-contain pointer-events-none"
                />
            )}

            {/* Placed Furniture Items */}
            {placedFurniture.map(item => (
                <Rnd
                    key={item.id}
                    size={{ width: item.width, height: item.height }}
                    position={{ x: item.x, y: item.y }}
                    onDragStop={(e, d) => updateItemPosition(item.id, d)}
                    onResizeStop={(e, direction, ref, delta, position) => {
                        updateItemSize(item.id, ref, position);
                    }}
                    bounds="parent"
                    className="group"
                >
                    <div
                        className="w-full h-full border-2 border-accent bg-accent/10 rounded-lg flex items-center justify-center relative backdrop-blur-sm"
                        style={{ transform: `rotate(${item.rotation}deg)` }}
                    >
                        {/* Furniture Label */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
                            <span className="text-3xl mb-1">{getFurnitureIcon(item.category)}</span>
                            <span className="text-xs font-medium text-gray-800 line-clamp-2">{item.name}</span>
                        </div>

                        {/* Control Buttons */}
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => rotateItem(item.id)}
                                className="p-1.5 bg-white rounded shadow-md hover:bg-gray-50 transition-colors"
                                title="Rotate"
                            >
                                <RotateCw className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => onRemoveFurniture(item.id)}
                                className="p-1.5 bg-white rounded shadow-md hover:bg-red-50 hover:text-red-600 transition-colors"
                                title="Remove"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Size Indicator */}
                        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 bg-white px-2 py-0.5 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                            {Math.round(item.width)} × {Math.round(item.height)}
                        </div>
                    </div>
                </Rnd>
            ))}

            {/* Drop Hint */}
            {placedFurniture.length === 0 && !isDragOver && imageUrl && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-sm">
                        <p className="text-gray-600 font-medium">Drag furniture from the library</p>
                        <p className="text-xs text-muted mt-1">Position and resize as needed</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FurnitureCanvas;
