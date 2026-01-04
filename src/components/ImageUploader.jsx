import React, { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';

const ImageUploader = ({ onImageSelect, selectedImage, onClear }) => {
    const fileInputRef = useRef(null);
    const [isDragOver, setIsDragOver] = useState(false);

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onImageSelect(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            onImageSelect(e.target.files[0]);
        }
    };

    if (selectedImage) {
        return (
            <div className="relative w-full h-full min-h-[400px] flex items-center justify-center bg-gray-50 rounded-3xl border border-gray-200 overflow-hidden shadow-inner group">
                <img
                    src={selectedImage}
                    alt="Original Room"
                    className="w-full h-full object-contain max-h-[600px]"
                />
                <button
                    onClick={onClear}
                    className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white rounded-full shadow-md backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
                >
                    <X className="w-5 h-5 text-gray-700" />
                </button>
            </div>
        );
    }

    return (
        <div
            className={`relative w-full h-full min-h-[400px] flex flex-col items-center justify-center rounded-3xl border-2 border-dashed transition-all cursor-pointer bg-white/50 backdrop-blur-sm
        ${isDragOver ? 'border-accent bg-accent/5' : 'border-gray-200 hover:border-gray-300 hover:bg-white/80'}
      `}
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
        >
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleChange}
                accept="image/*"
                className="hidden"
            />

            <div className="p-4 rounded-full bg-secondary mb-4">
                <Upload className="w-8 h-8 text-gray-500" />
            </div>

            <h3 className="text-xl font-medium text-gray-800 mb-2">Upload your room</h3>
            <p className="text-muted text-sm max-w-xs text-center">
                Drag & drop or click to browse. <br />
                Max 10MB (but we'll optimize it to 1MP).
            </p>
        </div>
    );
};

export default ImageUploader;
