import React, { useState } from 'react';
import NewsCard from './NewsCard';

const ClusterCard = ({ cluster, onCategoryClick, onToggleFavorite, onRead }) => {
    const articles = cluster.articles;
    const mainArticle = articles[0];
    const otherArticles = articles.slice(1);

    const [isExpanded, setIsExpanded] = useState(false);

    if (articles.length === 1) {
        return (
            <NewsCard 
                article={mainArticle} 
                onCategoryClick={onCategoryClick} 
                onToggleFavorite={onToggleFavorite} 
                onRead={onRead} 
            />
        );
    }

    return (
        <div className="relative group">
            <div className="absolute top-2 left-2 w-full h-full bg-gray-200 dark:bg-gray-700 rounded-xl transform rotate-1 transition-transform group-hover:rotate-2"></div>
            <div className="absolute top-1 left-1 w-full h-full bg-gray-300 dark:bg-gray-600 rounded-xl transform -rotate-1 transition-transform group-hover:-rotate-2"></div>

            <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg border-l-4 border-blue-500 overflow-hidden flex flex-col h-full">
                {cluster.aiSummary && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 border-b dark:border-gray-700">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl">✨</span>
                            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">AI Сводка</span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 italic leading-relaxed">
                            "{cluster.aiSummary.trim()}"
                        </p>
                    </div>
                )}
                <NewsCard 
                    article={mainArticle} 
                    onCategoryClick={onCategoryClick} 
                    onToggleFavorite={onToggleFavorite} 
                    onRead={onRead} 
                    isClusterMode={true}
                />

                <div className="bg-gray-50 dark:bg-gray-900 p-3 border-t dark:border-gray-700">
                    <button 
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="w-full flex justify-between items-center text-sm font-semibold text-blue-600 hover:text-blue-800 transition"
                    >
                        <span>
                            {isExpanded ? 'Свернуть источники' : `Еще об этом (${otherArticles.length})`}
                        </span>
                        <span>{isExpanded ? '▲' : '▼'}</span>
                    </button>

                    {isExpanded && (
                        <div className="mt-3 space-y-3 animate-fade-in-down">
                            {otherArticles.map(art => (
                                <div key={art.id} className="flex flex-col border-b border-gray-200 dark:border-gray-700 pb-2 last:border-0">
                                    <div className="flex justify-between items-start">
                                        <span className="text-xs text-gray-500 uppercase font-bold">{art.sourceName}</span>
                                        <span className="text-xs text-gray-400">
                                            {new Date(art.publishedDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </span>
                                    </div>
                                    <a 
                                        onClick={() => onRead(art)}
                                        className="text-sm font-medium text-gray-800 dark:text-gray-200 hover:text-blue-600 cursor-pointer truncate"
                                    >
                                        {art.title}
                                    </a>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClusterCard;