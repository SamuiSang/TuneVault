// ---> AXIOS VÀ AUTH CONTEXT  <---
import React, { createContext, useState, useEffect, useContext, type ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { type AppUser } from '../types';

interface AuthContextType {
  user: AppUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Giải mã Token để lấy thông tin User (dựa vào cấu trúc claims của JWT Backend)
  const decodeAndSetUser = (jwtToken: string) => {
    try {
      const decoded: any = jwtDecode(jwtToken);
      // Tên các trường này phụ thuộc vào cách bạn config JWT bên ASP.NET Core Identity
      const userInfo: AppUser = {
        id: decoded.sub || decoded.nameidentifier,
        email: decoded.email,
        userName: decoded.name || decoded.unique_name,
      };
      setUser(userInfo);
      setToken(jwtToken);
    } catch (error) {
      console.error("Token không hợp lệ", error);
      logout();
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      decodeAndSetUser(storedToken);
    }
  }, []);

  const login = (newToken: string) => {
    localStorage.setItem('token', newToken);
    decodeAndSetUser(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, logout }}>
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
