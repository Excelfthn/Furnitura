import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { getFurnitureIcon } from '../utils/furnitureIcons';


const FurnitureLibrary = ({ onSelectFurniture }) => {
    const [furniture, setFurniture] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [expandedCategories, setExpandedCategories] = useState(new Set(['ALL']));

    useEffect(() => {
        fetchFurniture();
    }, []);

    const fetchFurniture = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/furniture');
            if (!response.ok) throw new Error('Failed to fetch furniture');
            const data = await response.json();
            setFurniture(data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching furniture:', err);
            setError(err.message);
            setLoading(false);
        }
    };

    const categories = ['ALL', ...new Set(furniture.map(item => item.CATEGORY))];

    const filteredFurniture = furniture.filter(item => {
        const matchesSearch = item.NAME.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.DESCRIPTION?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'ALL' || item.CATEGORY === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const toggleCategory = (category) => {
        const newExpanded = new Set(expandedCategories);
        if (newExpanded.has(category)) {
            newExpanded.delete(category);
        } else {
            newExpanded.add(category);
        }
        setExpandedCategories(newExpanded);
    };

    if (loading) {
        return (
            <div className="w-80 bg-white border-r border-gray-200 p-4 flex items-center justify-center">
                <div className="text-muted">Loading furniture...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-80 bg-white border-r border-gray-200 p-4">
                <div className="text-red-600 text-sm">Error: {error}</div>
                <button onClick={fetchFurniture} className="mt-2 text-xs text-primary hover:underline">
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
            <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold mb-3">Furniture Library</h3>

                {/* Search */}
                <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search furniture..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none"
                    />
                </div>

                {/* Category Tabs */}
                <div className="flex flex-wrap gap-2">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-3 py-1 text-xs rounded-full transition-all ${selectedCategory === category
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* Furniture List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {filteredFurniture.length === 0 ? (
                    <div className="text-center text-muted text-sm mt-8">
                        No furniture found
                    </div>
                ) : (
                    filteredFurniture.map(item => (
                        <div
                            key={item.ID}
                            className="p-3 border border-gray-200 rounded-lg hover:border-accent hover:bg-accent/5 cursor-move transition-all group"
                            draggable
                            onDragStart={(e) => {
                                e.dataTransfer.setData('furniture', JSON.stringify(item));
                            }}
                        >
                            <div className="flex items-start gap-3">
                                <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                                    <span className="text-2xl">{getFurnitureIcon(item.CATEGORY)}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-sm text-gray-900 truncate">{item.NAME}</h4>
                                    <p className="text-xs text-muted mt-0.5 line-clamp-2">{item.DESCRIPTION}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{item.SIZE_CATEGORY}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default FurnitureLibrary;
