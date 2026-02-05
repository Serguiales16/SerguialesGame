import React, { useState } from 'react';
import { LogIn, UserPlus, Lock, User, Gamepad2 } from 'lucide-react';
import { login, register } from '../services/authService';

interface LoginScreenProps {
    onLoginSuccess: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (isLogin) {
            const result = login(username, password);
            if (result.success) {
                setSuccess(result.message);
                setTimeout(() => {
                    onLoginSuccess();
                }, 500);
            } else {
                setError(result.message);
            }
        } else {
            const result = register(username, password);
            if (result.success) {
                setSuccess(result.message);
                setTimeout(() => {
                    setIsLogin(true);
                    setPassword('');
                    setError('');
                }, 1500);
            } else {
                setError(result.message);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                {/* Logo and Title */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-900/30 rounded-2xl border-2 border-primary-500 mb-4 shadow-[0_0_20px_rgba(220,38,38,0.3)]">
                        <Gamepad2 size={40} className="text-primary-500" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Serguiales<span className="text-primary-500">Game</span>
                    </h1>
                    <p className="text-gray-400 text-sm">Tu hub personal de gaming y desarrollo</p>
                </div>

                {/* Login/Register Card */}
                <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8 shadow-2xl">
                    {/* Toggle Tabs */}
                    <div className="flex bg-gray-900 rounded-lg p-1 mb-6">
                        <button
                            onClick={() => { setIsLogin(true); setError(''); setSuccess(''); }}
                            className={`flex-1 py-2 rounded-md text-sm font-bold transition-all flex items-center justify-center gap-2 ${isLogin
                                    ? 'bg-primary-600 text-white shadow-lg'
                                    : 'text-gray-400 hover:text-gray-200'
                                }`}
                        >
                            <LogIn size={16} /> Iniciar Sesión
                        </button>
                        <button
                            onClick={() => { setIsLogin(false); setError(''); setSuccess(''); }}
                            className={`flex-1 py-2 rounded-md text-sm font-bold transition-all flex items-center justify-center gap-2 ${!isLogin
                                    ? 'bg-primary-600 text-white shadow-lg'
                                    : 'text-gray-400 hover:text-gray-200'
                                }`}
                        >
                            <UserPlus size={16} /> Registrarse
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Username */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Usuario
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all"
                                    placeholder="Tu nombre de usuario"
                                    autoFocus
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Contraseña
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all"
                                    placeholder="Tu contraseña"
                                />
                            </div>
                        </div>

                        {/* Error/Success Messages */}
                        {error && (
                            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="bg-green-900/20 border border-green-500/50 rounded-lg p-3 text-green-400 text-sm">
                                {success}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-primary-600 hover:bg-primary-500 text-white py-3 rounded-lg font-bold transition-all shadow-[0_4px_14px_0_rgba(220,38,38,0.39)] hover:shadow-[0_6px_20px_rgba(220,38,38,0.23)] active:scale-95 flex items-center justify-center gap-2"
                        >
                            {isLogin ? (
                                <>
                                    <LogIn size={18} /> Iniciar Sesión
                                </>
                            ) : (
                                <>
                                    <UserPlus size={18} /> Crear Cuenta
                                </>
                            )}
                        </button>
                    </form>

                    {/* Info Text */}
                    <p className="text-center text-gray-500 text-xs mt-6">
                        {isLogin ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
                        <button
                            onClick={() => { setIsLogin(!isLogin); setError(''); setSuccess(''); }}
                            className="text-primary-500 hover:text-primary-400 font-medium"
                        >
                            {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
                        </button>
                    </p>
                </div>

                {/* Footer Note */}
                <p className="text-center text-gray-600 text-xs mt-6">
                    Los datos se almacenan localmente en tu navegador
                </p>
            </div>
        </div>
    );
};
