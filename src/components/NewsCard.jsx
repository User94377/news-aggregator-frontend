import React from 'react';
import axios from 'axios';

const NewsCard = ({ article, onCategoryClick, onToggleFavorite, onRead}) => {
  const image = article.imageUrl || "https://placehold.co/600x400?text=No+Image";
  
  const date = new Date(article.publishedDate).toLocaleDateString('ru-RU', {
    day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
  });

  const getCategoryColor = (cat) => {
    switch(cat) {
      case 'IT и Код': 
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 hover:bg-purple-200';
      case 'ИИ и Нейросети': 
        return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300 hover:bg-cyan-200';
      case 'Криптовалюта': 
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 hover:bg-amber-200';
      case 'Финансы': 
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 hover:bg-emerald-200';
      case 'Гаджеты': 
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 hover:bg-blue-200';
      case 'Наука': 
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300 hover:bg-indigo-200';
      case 'Политика': 
        return 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 hover:bg-rose-200';
      case 'Игры': 
        return 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/40 dark:text-fuchsia-300 hover:bg-fuchsia-200';
      case 'Кино и Шоу': 
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-300 hover:bg-pink-200';
      case 'Авто': 
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300 hover:bg-orange-200';
      case 'Спорт': 
        return 'bg-lime-100 text-lime-800 dark:bg-lime-900/40 dark:text-lime-300 hover:bg-lime-200';
      default: 
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200';
    }
  };

    const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
        await axios.patch(`http://localhost:8080/api/news/${article.id}/favorite`);
        onToggleFavorite(article.id);
    } catch (error) {
        console.error(error);
    }
  };
  

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full relative group dark:bg-gray-800 dark:border dark:border-gray-700">
    
    <button 
        onClick={handleLike}
        className={`absolute top-2 left-2 z-10 p-2 rounded-full shadow-md transition-all duration-300 transform active:scale-90
            ${article.favorite 
                ? 'bg-red-500 text-white opacity-100' 
                : 'bg-white text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-500'
            }`}
        title={article.favorite ? "Убрать из избранного" : "В избранное"}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={article.favorite ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>

        <div 
            className="h-48 overflow-hidden cursor-pointer" 
            onClick={() => onRead(article)}
        >
        <img 
          src={image} 
          alt={article.title} 
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="p-5 flex flex-col flex-grow">
        
        {/* --- НОВАЯ СТРОКА: ДАТА, ИСТОЧНИК И ТЕГ --- */}
        <div className="flex justify-between items-center mb-3">
            <span className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
                <span>{date}</span>
                {article.sourceName && (
                    <>
                        <span className="text-gray-300 dark:text-gray-600">•</span>
                        <span className="font-semibold text-gray-500 dark:text-gray-400 hover:underline">
                            {article.sourceName}
                        </span>
                    </>
                )}
            </span>
            
            {article.category && (
              <button 
                onClick={() => onCategoryClick(article.category)}
                className={`px-2 py-1 rounded-md text-[10px] uppercase tracking-wide font-bold transition-colors cursor-pointer ${getCategoryColor(article.category)}`}
              >
                {article.category}
              </button>
            )}
        </div>
        
        <h3 
            onClick={() => onRead(article)}
            className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2 leading-tight cursor-pointer hover:text-blue-600 transition-colors"
        >
            {article.title}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3 overflow-hidden dark:text-gray-300" 
           dangerouslySetInnerHTML={{ __html: article.description }} 
        />

        <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <button 
                onClick={() => onRead(article)}
                className="text-blue-600 font-semibold text-sm hover:underline"
            >
              Читать здесь
            </button>

            <a 
                href={article.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-white dark:bg-gray-700 text-gray-400 dark:text-gray-300 text-xs hover:text-gray-600"
                title="Открыть оригинал на сайте"
            >
                На сайт
            </a>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;