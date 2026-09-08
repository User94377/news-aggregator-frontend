import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProfileModal = ({ isOpen, onClose, onLogout }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            loadProfile();
        }
    }, [isOpen]);

    const loadProfile = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:8080/api/user/me');
            setProfile(res.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 dark:text-white rounded-xl p-8 w-full max-w-sm shadow-2xl relative transition-colors">
                
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white">
                    ✕
                </button>

                <h2 className="text-2xl font-bold mb-6 text-center">Личный кабинет</h2>

                {loading ? (
                    <div className="text-center py-10">Загрузка...</div>
                ) : profile ? (
                    <div className="flex flex-col items-center">
                        <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg">
                            {profile.username.charAt(0).toUpperCase()}
                        </div>
                        
                        <h3 className="text-xl font-semibold mb-1">@{profile.username}</h3>
                        <p className="text-gray-500 text-sm mb-6">Пользователь</p>

                        <div className="w-full grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
                                <div className="text-2xl font-bold text-blue-600">{profile.favoritesCount}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-300">Избранных статей</div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
                                <div className="text-lg font-bold text-purple-600 truncate">{profile.favoriteCategory}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-300">Любимая тема</div>
                            </div>
                        </div>

                        <button 
                            onClick={onLogout}
                            className="w-full border border-red-500 text-red-500 py-2 rounded-lg hover:bg-red-50 transition"
                        >
                            Выйти из аккаунта
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center">
                        <div className="text-center text-red-500 mb-4">
                            Не удалось загрузить данные.<br/>
                            Возможно, сессия истекла.
                        </div>
                        
                        <button 
                            onClick={onLogout}
                            className="w-full border border-red-500 text-red-500 py-2 rounded-lg hover:bg-red-50 transition"
                        >
                            Выйти из аккаунта
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileModal;