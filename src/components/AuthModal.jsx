import React, { useState } from 'react';
import axios from 'axios';

const AuthModal = ({ isOpen, onClose }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
        try {
            const res = await axios.post(`http://localhost:8080${endpoint}`, { username, password });
            if (isLogin) {
                alert("Успешный вход! Токен: " + res.data.token.substring(0, 10) + "...");
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('username', username);
                onClose();
            } else {
                alert("Регистрация успешна! Теперь войдите.");
                setIsLogin(true);
            }
        } catch (e) {
            alert("Ошибка: " + (e.response?.data || e.message));
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-xl w-80 shadow-2xl transition-colors">
                <h2 className="text-xl font-bold mb-4">{isLogin ? "Вход" : "Регистрация"}</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <input 
                        className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:border-blue-500" 
                        placeholder="Логин" 
                        value={username} onChange={e=>setUsername(e.target.value)} 
                    />
                    <input 
                        className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:border-blue-500" 
                        type="password" 
                        placeholder="Пароль" 
                        value={password} onChange={e=>setPassword(e.target.value)} 
                    />
                    <button className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                        {isLogin ? "Войти" : "Создать аккаунт"}
                    </button>
                </form>
                <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-blue-500 mt-2 underline w-full text-center hover:text-blue-400">
                    {isLogin ? "Зарегистрироваться" : "Войти"}
                </button>
                <button onClick={onClose} className="mt-2 w-full text-gray-400 text-sm hover:text-gray-600 dark:hover:text-gray-300">
                    Закрыть
                </button>
            </div>
        </div>
    );
};
export default AuthModal;