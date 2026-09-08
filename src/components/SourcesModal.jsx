import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SourcesModal = ({ isOpen, onClose }) => {
    const [sources, setSources] = useState([]);
    const [newUrl, setNewUrl] = useState('');
    const [newName, setNewName] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadSources();
        }
    }, [isOpen]);

    const loadSources = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/sources');
            setSources(res.data);
        } catch (e) {
            console.error(e);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newUrl || !newName) return;
        setLoading(true);
        try {
            await axios.post('http://localhost:8080/api/sources', {
                url: newUrl,
                name: newName
            });
            setNewUrl('');
            setNewName('');
            loadSources();
            alert("Источник добавлен! Новости скоро появятся.");
        } catch (e) {
            alert("Ошибка добавления");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if(!confirm("Удалить источник?")) return;
        try {
            await axios.delete(`http://localhost:8080/api/sources/${id}`);
            loadSources();
        } catch (e) {
            alert("Ошибка удаления");
        }
    };

    const handleToggle = async (source) => {
        try {
            await axios.patch(`http://localhost:8080/api/sources/${source.id}`);
            setSources(sources.map(s => 
                s.id === source.id ? { ...s, enabled: !s.enabled } : s
            ));
        } catch (e) {
            alert("Ошибка переключения статуса");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 dark:text-white rounded-xl p-6 w-full max-w-md shadow-2xl relative transition-colors">
                
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-black dark:hover:text-white">
                    ✕
                </button>

                <h2 className="text-xl font-bold mb-4">Управление источниками</h2>

                <form onSubmit={handleAdd} className="mb-6 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="mb-2">
                        <input 
                            type="text" placeholder="Название" 
                            className="w-full border p-2 rounded dark:bg-gray-600 dark:border-gray-500 dark:text-white dark:placeholder-gray-300"
                            value={newName} onChange={e => setNewName(e.target.value)}
                        />
                    </div>
                    <div className="mb-2">
                        <input 
                            type="text" placeholder="Ссылка на RSS" 
                            className="w-full border p-2 rounded dark:bg-gray-600 dark:border-gray-500 dark:text-white dark:placeholder-gray-300"
                            value={newUrl} onChange={e => setNewUrl(e.target.value)}
                        />
                    </div>
                    <button 
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? 'Добавляем...' : 'Добавить источник'}
                    </button>
                </form>

                <div className="max-h-60 overflow-y-auto custom-scrollbar pr-2">
                    {sources.length === 0 && <p className="text-gray-500 text-center">Нет источников</p>}
                    
                    {sources.map(src => (
                        <div key={src.id} className="flex justify-between items-center border-b dark:border-gray-700 py-3 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700 px-2 transition rounded">
                            <div className={`flex-1 ${!src.enabled ? 'opacity-50' : ''}`}>
                                <div className="font-bold text-sm flex items-center gap-2">
                                    {src.name}
                                    {!src.enabled && <span className="text-[10px] bg-gray-200 dark:bg-gray-600 dark:text-gray-300 text-gray-500 px-1 rounded">PAUSED</span>}
                                </div>
                                <div className="text-xs text-gray-400 truncate w-48">{src.url}</div>
                            </div>

                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={() => handleToggle(src)}
                                    className={`w-10 h-5 flex items-center rounded-full p-1 transition-colors duration-300 ${src.enabled ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                                >
                                    <div className={`bg-white w-3 h-3 rounded-full shadow-md transform duration-300 ease-in-out ${src.enabled ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                </button>

                                <button 
                                    onClick={() => handleDelete(src.id)}
                                    className="text-red-400 hover:text-red-600 transition"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default SourcesModal;