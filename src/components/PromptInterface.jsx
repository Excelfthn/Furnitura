import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

const PromptInterface = ({ onGenerate, isLoading, loadingText }) => {
    const [prompt, setPrompt] = useState('');
    const MAX_CHARS = 200;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (prompt.trim() && !isLoading) {
            onGenerate(prompt);
        }
    };

    return (
        <div className="w-full max-w-2xl mt-8 fade-in" style={{ animationDelay: '0.2s' }}>
            <form onSubmit={handleSubmit} className="relative group">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    maxLength={MAX_CHARS}
                    placeholder="Describe what you want to add (e.g., 'A modern beige sectional sofa with throw pillows')"
                    className="w-full bg-white/80 backdrop-blur-md rounded-2xl p-6 pr-32 pb-12 shadow-sm border border-white/50 focus:ring-2 focus:ring-accent/20 focus:border-accent resize-none outline-none text-lg text-gray-800 placeholder:text-gray-400 min-h-[140px] transition-all"
                    disabled={isLoading}
                />

                <div className="absolute bottom-4 left-6 text-xs text-gray-400 font-medium">
                    {prompt.length}/{MAX_CHARS}
                </div>

                <button
                    type="submit"
                    disabled={!prompt.trim() || isLoading}
                    className={`absolute bottom-4 right-4 py-3 px-6 rounded-xl flex items-center gap-2 font-medium transition-all shadow-md
            ${!prompt.trim() || isLoading
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-primary text-white hover:bg-gray-800 active:scale-95 hover:shadow-lg'}
          `}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Generating...</span>
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-4 h-4" />
                            <span>Generate</span>
                        </>
                    )}
                </button>
            </form>

            {isLoading && (
                <div className="mt-4 flex flex-col items-center justify-center text-muted animate-pulse">
                    <p className="text-sm font-medium">{loadingText || "Initializing..."}</p>
                </div>
            )}
        </div>
    );
};

export default PromptInterface;
