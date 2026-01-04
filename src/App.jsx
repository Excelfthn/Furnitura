import React, { useState } from 'react';
import ImageUploader from './components/ImageUploader';
import PromptInterface from './components/PromptInterface';
import FurnitureLibrary from './components/FurnitureLibrary';
import FurnitureCanvas from './components/FurnitureCanvas';
import { resizeImage } from './utils/imageUtils';
import { generateInterior } from './services/aiService';
import { Settings, Image as ImageIcon, Download, Sparkles, Check } from 'lucide-react';

function App() {
    const [originalImage, setOriginalImage] = useState(null);
    const [optimizedImage, setOptimizedImage] = useState(null);
    const [placedFurniture, setPlacedFurniture] = useState([]);
    const [resultImage, setResultImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingText, setLoadingText] = useState('');
    const [apiKey, setApiKey] = useState(localStorage.getItem('openrouter_key') || '');
    const [showSettings, setShowSettings] = useState(false);
    const [error, setError] = useState(null);

    const handleImageSelect = async (file) => {
        try {
            setLoadingText("Optimizing image...");
            setResultImage(null);
            setPlacedFurniture([]);
            setError(null);

            const resizedBase64 = await resizeImage(file);
            setOptimizedImage(resizedBase64);
            setOriginalImage(URL.createObjectURL(file));

        } catch (err) {
            setError("Failed to process image. Please try another one.");
        }
    };

    const buildFurniturePrompt = () => {
        if (placedFurniture.length === 0) return '';

        // Get canvas dimensions (assuming 1024x1024 from resize)
        const canvasWidth = 1024;
        const canvasHeight = 1024;

        const furnitureInstructions = placedFurniture.map(item => {
            const xPercent = Math.round((item.x / canvasWidth) * 100);
            const yPercent = Math.round((item.y / canvasHeight) * 100);
            const widthPercent = Math.round((item.width / canvasWidth) * 100);

            return `- ${item.name}: Position at ${xPercent}% from left, ${yPercent}% from top, occupying ${widthPercent}% width${item.rotation ? `, rotated ${item.rotation}°` : ''}`;
        }).join('\n');

        return `\n\nFURNITURE PLACEMENT (follow exactly):\n${furnitureInstructions}\n`;
    };

    const handleGenerate = async () => {
        if (!apiKey) {
            setShowSettings(true);
            setError("Please enter your OpenRouter API Key first.");
            return;
        }

        if (placedFurniture.length === 0) {
            setError("Please drag some furniture onto the canvas first.");
            return;
        }

        setIsLoading(true);
        setLoadingText("Rendering furniture in place...");
        setError(null);

        try {
            const startTime = Date.now();

            const furniturePrompt = buildFurniturePrompt();
            const fullPrompt = `Add the following furniture to this room:${furniturePrompt}`;

            const data = await generateInterior(optimizedImage, fullPrompt, apiKey);

            const elapsed = Date.now() - startTime;
            if (elapsed < 2000) await new Promise(r => setTimeout(r, 2000 - elapsed));

            if (data.imageUrl) {
                setResultImage(data.imageUrl);
            } else {
                throw new Error("No image URL in response");
            }

        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const removeFurniture = (id) => {
        setPlacedFurniture(placedFurniture.filter(item => item.id !== id));
    };

    const saveKey = (e) => {
        setApiKey(e.target.value);
        localStorage.setItem('openrouter_key', e.target.value);
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <header className="w-full bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                        <ImageIcon size={18} />
                    </div>
                    <h1 className="text-2xl font-semibold tracking-tight">Furnitura</h1>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className="p-2 rounded-full hover:bg-black/5 text-muted transition-colors"
                        title="Settings"
                    >
                        <Settings className="w-5 h-5" />
                    </button>
                </div>
            </header>

            {showSettings && (
                <div className="w-full bg-yellow-50 border-b border-yellow-200 px-6 py-4">
                    <div className="max-w-xl">
                        <label className="block text-sm font-medium text-gray-700 mb-1">OpenRouter API Key</label>
                        <input
                            type="password"
                            value={apiKey}
                            onChange={saveKey}
                            placeholder="sk-or-..."
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                        />
                        <p className="text-xs text-muted mt-1">Stored locally in your browser.</p>
                    </div>
                </div>
            )}

            <main className="flex-1 flex">
                {optimizedImage && <FurnitureLibrary />}

                <div className="flex-1 p-6 overflow-auto">
                    {!optimizedImage ? (
                        <div className="max-w-2xl mx-auto text-center space-y-8 mt-12">
                            <div className="space-y-4">
                                <h2 className="text-4xl md:text-5xl font-light text-foreground leading-tight">
                                    Design your space with <br />
                                    <span className="font-medium italic">intention</span>.
                                </h2>
                                <p className="text-muted text-lg">
                                    Upload a photo, drag furniture, and let AI transform your room.
                                </p>
                            </div>
                            <div className="h-64">
                                <ImageUploader onImageSelect={handleImageSelect} />
                            </div>
                        </div>
                    ) : (
                        <div className="max-w-6xl mx-auto space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px]">
                                {/* Canvas with Furniture */}
                                <div className="relative">
                                    <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-medium z-10">
                                        Design Canvas ({placedFurniture.length} items)
                                    </div>
                                    <FurnitureCanvas
                                        imageUrl={originalImage}
                                        placedFurniture={placedFurniture}
                                        onUpdateFurniture={setPlacedFurniture}
                                        onRemoveFurniture={removeFurniture}
                                    />
                                    <button
                                        onClick={() => { setOptimizedImage(null); setOriginalImage(null); setResultImage(null); setPlacedFurniture([]); }}
                                        className="absolute bottom-4 left-4 text-xs bg-white/90 px-3 py-1 rounded-lg shadow-sm hover:bg-white transition-colors"
                                    >
                                        Change Photo
                                    </button>
                                </div>

                                {/* Result */}
                                <div className="relative rounded-2xl overflow-hidden border-2 border-gray-200 bg-gray-50 flex items-center justify-center">
                                    <div className="absolute top-4 left-4 bg-accent/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-medium z-10 flex items-center gap-1">
                                        <Sparkles className="w-3 h-3" /> Result
                                    </div>

                                    {isLoading ? (
                                        <div className="text-center space-y-4 p-6">
                                            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                                            <p className="text-sm font-medium text-gray-600 animate-pulse">{loadingText}</p>
                                        </div>
                                    ) : resultImage ? (
                                        <>
                                            <img src={resultImage} className="w-full h-full object-contain" alt="Generated Result" />
                                            <a
                                                href={resultImage}
                                                download="furnitura-design.jpg"
                                                target="_blank"
                                                rel="noreferrer"
                                                className="absolute bottom-4 right-4 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white hover:scale-105 transition-all text-primary"
                                                title="Download"
                                            >
                                                <Download className="w-5 h-5" />
                                            </a>
                                        </>
                                    ) : (
                                        <div className="text-center px-6">
                                            <p className="text-muted text-sm">Place furniture on the canvas</p>
                                            <p className="text-xs text-gray-400 mt-1">Then click "Done" to generate</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {error && (
                                <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 flex items-center gap-2">
                                    <span className="font-bold">Error:</span> {error}
                                </div>
                            )}

                            {/* Done Button */}
                            <div className="flex justify-center">
                                <button
                                    onClick={handleGenerate}
                                    disabled={isLoading || placedFurniture.length === 0}
                                    className={`px-8 py-4 rounded-xl flex items-center gap-3 font-medium text-lg shadow-lg transition-all ${isLoading || placedFurniture.length === 0
                                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            : 'bg-primary text-white hover:bg-gray-800 active:scale-95 hover:shadow-xl'
                                        }`}
                                >
                                    <Check className="w-6 h-6" />
                                    <span>Done - Generate Final Image</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default App;
