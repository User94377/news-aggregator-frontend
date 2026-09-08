import { useEffect, useState } from 'react'
import axios from 'axios'
import NewsCard from './components/NewsCard'
import SourcesModal from './components/SourcesModal';
import AuthModal from './components/AuthModal';
import ArticleModal from './components/ArticleModal';
import ProfileModal from './components/ProfileModal';
import ClusterCard from './components/ClusterCard';

function App() {
  const [news, setNews] = useState([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false); 
  const [currentUser, setCurrentUser] = useState(localStorage.getItem('username')); 
  const [readingArticle, setReadingArticle] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [viewMode, setViewMode] = useState('clusters');
  const [goodNewsOnly, setGoodNewsOnly] = useState(false);
  const [clusterSort, setClusterSort] = useState('latest');

  const [searchQuery, setSearchQuery] = useState('') 
  const [activeSearch, setActiveSearch] = useState('') 
  const [selectedCategory, setSelectedCategory] = useState(null) 

  const fetchNews = async (pageNum, search = '', category = null, favoriteFilter = false) => {
    setLoading(true)
    try {
      let endpoint;
      if (search || category || favoriteFilter) {
          endpoint = '/api/news';
      } else {
          endpoint = viewMode === 'clusters' ? '/api/news/clusters' : '/api/news';
      }

      const response = await axios.get(endpoint, {
        params: {
          page: pageNum,
          size: 12,
          search: search,
          category: category,
          favorite: favoriteFilter,
          goodNewsOnly: goodNewsOnly,
          sort: clusterSort
        }
      })
      
      console.log("2. Ответ сервера (raw):", response.data);

      const data = response.data;
      const newItems = data.content ? data.content : (Array.isArray(data) ? data : []);

      console.log(`3. Нашли новостей: ${newItems.length}`);

      const totalPages = data.page ? data.page.totalPages : data.totalPages;
      const safeTotalPages = totalPages || 0;

      if (pageNum === 0) {
        setNews(newItems)
      } else {
        setNews(prev => {
            const existingIds = new Set(prev.map(item => item.id));
            const uniqueNew = newItems.filter(item => !existingIds.has(item.id));
            return [...prev, ...uniqueNew];
        })
      }

      if (pageNum >= safeTotalPages - 1 || newItems.length === 0) {
        setHasMore(false)
      } else {
        setHasMore(true)
      }

    } catch (error) {
      console.error("4. ОШИБКА ЗАПРОСА:", error);
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleToggleFavorite = (id) => {
    setNews(prevNews => prevNews.map(article => 
        article.id === id ? { ...article, favorite: !article.favorite } : article
    ));
  };

  const handleFavoritesClick = () => {
    const newState = !showFavorites;
    setShowFavorites(newState);
    setSearchQuery('');
    setActiveSearch('');
    setSelectedCategory(null);
    setPage(0);
    fetchNews(0, '', null, newState);
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setCurrentUser(null);
    window.location.reload(); 
  }

  useEffect(() => {
    setPage(0);
    setHasMore(true);
    setNews([]);
    fetchNews(0, searchQuery, selectedCategory, showFavorites);
  }, [viewMode, goodNewsOnly, clusterSort]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    setActiveSearch(searchQuery);
    setSelectedCategory(null);
    fetchNews(0, searchQuery, null);
  }

  const handleCategoryClick = (category) => {
    setSearchQuery(''); 
    setActiveSearch('');
    setSelectedCategory(category); 
    setPage(0);
    fetchNews(0, '', category); 
  }

  const handleReset = () => {
    setShowFavorites(false); 
    setSearchQuery(''); 
    setActiveSearch(''); 
    setSelectedCategory(null); 
    setPage(0); 
    fetchNews(0, '', null, false);
  }

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchNews(nextPage, activeSearch, selectedCategory); 
  }

  return (
    <div className="min-h-screen pb-10 bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
      
      <SourcesModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <ArticleModal 
         isOpen={!!readingArticle} 
         article={readingArticle} 
         onClose={() => setReadingArticle(null)} 
      />
      <ProfileModal 
         isOpen={isProfileOpen} 
         onClose={() => setIsProfileOpen(false)} 
         onLogout={() => {
             handleLogout();
             setIsProfileOpen(false);
         }}
      />
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => {
            setIsAuthOpen(false);
            setCurrentUser(localStorage.getItem('username')); 
        }} 
      />
        
      <header className="bg-white shadow-sm sticky top-0 z-10 dark:bg-gray-800 dark:border-b dark:border-gray-700 transition-colors duration-300">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-row justify-between items-center gap-4 flex-wrap md:flex-nowrap">
            
            <div className="flex items-center gap-3 md:gap-4 flex-wrap">
                <h1 
                  className="text-2xl font-black text-blue-600 tracking-tighter cursor-pointer"
                  onClick={handleReset}
                >
                  MY<span className="text-gray-800 dark:text-gray-200">NEWS</span>
                </h1>

                {!searchQuery && !selectedCategory && !showFavorites && (
                    <div className="bg-gray-100 dark:bg-gray-750 p-0.5 rounded-full flex border border-gray-200 dark:border-gray-700">
                        <button
                            onClick={() => setViewMode('clusters')}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                                viewMode === 'clusters'
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                            }`}
                        >
                            Сюжеты
                        </button>
                        <button
                            onClick={() => setViewMode('feed')}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                                viewMode === 'feed'
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                            }`}
                        >
                            Лента
                        </button>
                    </div>
                )}

                <div className="h-5 w-px bg-gray-200 dark:bg-gray-700 hidden md:block"></div>
                
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 border border-gray-200 dark:border-gray-700 px-3 py-1 rounded-full transition"
                >
                    Источники
                </button>

                <button 
                    onClick={handleFavoritesClick}
                    className={`text-sm px-3 py-1 rounded-full transition border ${
                        showFavorites 
                        ? 'bg-red-500 text-white border-red-500 hover:bg-red-600' 
                        : 'text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:text-red-500 hover:border-red-300'
                    }`}
                >
                    Избранное
                </button>

                <button 
                    onClick={() => setGoodNewsOnly(!goodNewsOnly)}
                    className={`text-sm px-3 py-1 rounded-full transition border flex items-center gap-1 ${
                        goodNewsOnly 
                        ? 'bg-green-500 text-white border-green-500 hover:bg-green-600' 
                        : 'text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:text-green-500 hover:border-green-300'
                    }`}
                    title="Скрыть негативные новости"
                >
                    {goodNewsOnly ? 'Позитив' : 'Всё подряд'}
                </button>
            </div>

            <div className="flex items-center gap-4 ml-auto">
                {currentUser ? (
                    <div 
                        className="flex items-center gap-2 cursor-pointer hover:opacity-80"
                        onClick={() => setIsProfileOpen(true)} 
                    >
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {currentUser.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-200 hidden md:block">
                            {currentUser}
                        </span>
                    </div>
                ) : (
                    <button 
                        onClick={() => setIsAuthOpen(true)}
                        className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-blue-700 transition shadow-sm"
                    >
                        Войти
                    </button>
                )}

                <button 
                    onClick={toggleTheme}
                    className="text-xl p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    title="Переключить тему"
                >
                    {theme === 'dark' ? '☀️' : '🌙'}
                </button>
            </div>

          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        
        <div className="mb-6 flex items-center gap-2">
            {activeSearch && (
               <div className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                    Поиск: <span className="text-blue-600">"{activeSearch}"</span>
               </div>
            )}
            {selectedCategory && (
                <div className="flex items-center gap-3">
                     <span className="text-xl font-semibold text-gray-700 dark:text-gray-200">Категория:</span>
                     <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-bold text-sm">
                        {selectedCategory}
                     </span>
                     <button onClick={handleReset} className="text-sm text-gray-400 hover:text-red-500 underline">
                        Сбросить
                     </button>
                </div>
            )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item) => {
             if (item.articles) {
                 return <ClusterCard 
                           key={item.id} 
                           cluster={item} 
                           onCategoryClick={handleCategoryClick}
                           onToggleFavorite={handleToggleFavorite}
                           onRead={setReadingArticle}
                        />
             } else {
                 return <NewsCard 
                    key={item.id}
                    article={item}
                    onCategoryClick={handleCategoryClick} 
                    onToggleFavorite={handleToggleFavorite}
                    onRead={setReadingArticle}
                />
             }
          })}
        </div>

        {!loading && news.length === 0 && (
            <div className="text-center py-20 text-gray-500 dark:text-gray-400">
                Новостей пока нет или ничего не найдено.
            </div>
        )}

        {hasMore && news.length > 0 && (
            <div className="mt-10 text-center">
                <button 
                    onClick={loadMore}
                    disabled={loading}
                    className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 px-8 py-3 rounded-full font-semibold shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition disabled:opacity-50"
                >
                    {loading ? 'Загружаем...' : 'Показать еще'}
                </button>
            </div>
        )}

      </main>
    </div>
  )
}

export default App;