// Utility function to get emoji for furniture category
export const getFurnitureIcon = (category) => {
    const icons = {
        'SOFA': '🛋️',
        'CHAIR': '🪑',
        'TABLE': '🪵',
        'STORAGE': '📚',
        'LIGHTING': '💡',
        'DECOR': '🌿',
        'BED': '🛏️',
        'DESK': '🖥️'
    };
    return icons[category?.toUpperCase()] || '🪑';
};
