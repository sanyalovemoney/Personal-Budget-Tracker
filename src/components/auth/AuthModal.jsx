import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { LogIn, UserPlus, ShieldAlert, CheckCircle } from 'lucide-react';

export const AuthModal = ({ isOpen, onClose }) => {
  const { loginWithGoogle, loginWithEmail, signupWithEmail, isFirebaseConfigured, isDemoMode } = useAuth();
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFirebaseConfigured) {
      alert('Увага: додаток працює у Демо-режимі з локальним збереженням (без підключених ключів Firebase .env).');
      onClose();
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        await signupWithEmail(email, password);
      } else {
        await loginWithEmail(email, password);
      }
      onClose();
    } catch (err) {
      console.error(err);
      setError('Помилка автентифікації: ' + (err.message || 'Перевірте логін та пароль'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!isFirebaseConfigured) {
      alert('Увага: додаток працює у Демо-режимі (без підключених ключів Firebase .env).');
      onClose();
      return;
    }
    try {
      await loginWithGoogle();
      onClose();
    } catch (err) {
      console.error(err);
      setError('Помилка входу через Google');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isSignUp ? 'Створення акаунту Firebase' : 'Вхід у Firebase'}
    >
      <div className="space-y-4">
        
        {!isFirebaseConfigured && (
          <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-xs text-amber-600 dark:text-amber-400">
            <div className="flex items-center gap-2 font-bold mb-1">
              <ShieldAlert className="w-4 h-4" /> Демо-режим без Firebase SDK
            </div>
            <p className="opacity-90">
              Наразі додаток працює локально (LocalStorage). Щоб підключити вашу базу даних Firebase Cloud Firestore, додайте параметри в `.env` (див. `.env.example`).
            </p>
          </div>
        )}

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-500 font-medium">
            {error}
          </div>
        )}

        {/* Google OAuth Button */}
        <Button
          variant="secondary"
          className="w-full justify-center gap-3 py-3"
          onClick={handleGoogleLogin}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          Увійти з Google
        </Button>

        <div className="flex items-center my-3">
          <div className="flex-1 border-t border-slate-200 dark:border-slate-800"></div>
          <span className="px-3 text-xs text-slate-400 font-semibold uppercase">або пошти</span>
          <div className="flex-1 border-t border-slate-200 dark:border-slate-800"></div>
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Пароль
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
            />
          </div>

          <Button
            variant="primary"
            type="submit"
            className="w-full justify-center mt-2 py-3"
            isLoading={loading}
            icon={isSignUp ? UserPlus : LogIn}
          >
            {isSignUp ? 'Зареєструватися' : 'Увійти'}
          </Button>
        </form>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            {isSignUp ? 'Вже є акаунт? Увійти' : 'Немає акаунту? Створити новий'}
          </button>
        </div>

      </div>
    </Modal>
  );
};
