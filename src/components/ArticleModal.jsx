import React from 'react';

const ArticleModal = ({ isOpen, onClose, article }) => {
    if (!isOpen || !article) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-900 w-full max-w-3xl h-[90vh] rounded-xl shadow-2xl flex flex-col relative overflow-hidden animate-fade-in-up">
                
                <div className="flex justify-between items-center p-4 border-b bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">
                            {article.sourceName || "Источник"}
                        </span>
                        <h2 className="text-lg font-bold leading-tight truncate w-64 md:w-96">
                            {article.title}
                        </h2>
                    </div>
                    
                    <div className="flex gap-2">
                         <a 
                            href={article.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 text-sm hover:underline flex items-center"
                        >
                            Открыть в браузере
                        </a>
                        <button 
                            onClick={onClose} 
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full w-8 h-8 flex items-center justify-center transition"
                        >
                            ✕
                        </button>
                    </div>
                </div>

               <div className="overflow-y-auto p-8 md:p-12 leading-relaxed text-gray-800 text-lg dark:text-gray-200 custom-scrollbar">
                    {article.content ? (
                        <div 
                            className="prose prose-lg max-w-none prose-img:rounded-xl prose-a:text-blue-600 dark:prose-invert"
                            dangerouslySetInnerHTML={{ __html: article.content }} 
                        />
                    ) : (
                        <div>
                            <p className="text-gray-500 italic mb-4">Не удалось загрузить полный текст. Краткое содержание:</p>
                            <div dangerouslySetInnerHTML={{ __html: article.description }} />
                            <div className="mt-8 text-center">
                                <a href={article.url} target="_blank" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700">
                                    Читать на сайте источника
                                </a>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default ArticleModal;