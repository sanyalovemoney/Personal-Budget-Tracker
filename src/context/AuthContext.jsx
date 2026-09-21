import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  firebaseSignOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  isFirebaseConfigured
} from '../config/firebase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(!isFirebaseConfigured);

  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          setCurrentUser(user);
          setIsDemoMode(false);
        } else {
          // Default guest demo user if not logged in
          const guestUser = JSON.parse(localStorage.getItem('pbt_guest_user')) || {
            uid: 'demo-user-123',
            displayName: 'Демо Користувач',
            email: 'demo@budget.app',
            photoURL: null
          };
          setCurrentUser(guestUser);
          setIsDemoMode(true);
        }
        setLoading(false);
      });
      return unsubscribe;
    } else {
      // Fallback Demo Mode
      const guestUser = JSON.parse(localStorage.getItem('pbt_guest_user')) || {
        uid: 'demo-user-123',
        displayName: 'Демо Користувач',
        email: 'demo@budget.app',
        photoURL: null
      };
      setCurrentUser(guestUser);
      setIsDemoMode(true);
      setLoading(false);
    }
  }, []);

  const loginWithGoogle = async () => {
    if (!isFirebaseConfigured) {
      alert('Firebase API ключі не знайдено у .env. Працює у Демо-режимі.');
      return;
    }
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const loginWithEmail = async (email, password) => {
    if (!isFirebaseConfigured) return;
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signupWithEmail = async (email, password) => {
    if (!isFirebaseConfigured) return;
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      await firebaseSignOut(auth);
    }
    const guestUser = {
      uid: 'demo-user-123',
      displayName: 'Демо Користувач',
      email: 'demo@budget.app',
      photoURL: null
    };
    setCurrentUser(guestUser);
    setIsDemoMode(true);
  };

  const value = {
    currentUser,
    loading,
    isDemoMode,
    loginWithGoogle,
    loginWithEmail,
    signupWithEmail,
    logout,
    isFirebaseConfigured
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
