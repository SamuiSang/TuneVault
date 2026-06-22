// ---> AXIOS VÀ AUTH CONTEXT  <---
import React, { createContext, useState, useEffect, useContext, type ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';
import { type AppUser } from '../types';

interface AuthContextType {
  user: AppUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<AppUser>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Giải mã Token để lấy thông tin User (dựa vào cấu trúc claims của JWT Backend)
  const decodeAndSetUser = (jwtToken: string) => {
    try {
      const decoded: any = jwtDecode(jwtToken);
      const userInfo: AppUser = {
        id: decoded.sub || decoded.nameidentifier || decoded.nameid || decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
        email: decoded.email || decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
        userName: decoded.name || decoded.unique_name || decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
        avatarUrl: decoded.avatarUrl || decoded.avatar_url || decoded.picture || undefined,
        isArtist: false,
      };
      setUser(userInfo);
      setToken(jwtToken);
    } catch (error) {
      console.error("Token không hợp lệ", error);
      logout();
    }
  };

  const fetchProfile = async (jwtToken: string) => {
    try {
      const response = await api.get('/auth/profile');
      const profile = response.data;
      if (profile?.id) {
        setUser({
          id: profile.id,
          userName: profile.userName || profile.userName || '',
          email: profile.email || '',
          bio: profile.bio || undefined,
          avatarUrl: profile.avatarUrl || undefined,
          isArtist: profile.isArtist ?? false,
        });
        setToken(jwtToken);
      } else {
        decodeAndSetUser(jwtToken);
      }
    } catch (error) {
      console.warn('Không lấy được profile từ backend, fallback sang giải mã token.', error);
      decodeAndSetUser(jwtToken);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      void fetchProfile(storedToken);
    }
  }, []);

  const login = async (newToken: string) => {
    localStorage.setItem('token', newToken);
    await fetchProfile(newToken);
  };

  const updateUser = (updates: Partial<AppUser>) => {
    setUser((prevUser) => (prevUser ? { ...prevUser, ...updates } : prevUser));
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};  
// ---> END: AXIOS VÀ AUTH CONTEXT  <---
