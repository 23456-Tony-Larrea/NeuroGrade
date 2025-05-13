import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: string;
  username: string;
  role: 'admin' | 'teacher' | 'student' | 'parent';
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  setToken: (token: string) => void;
}

interface JWTPayload {
  sub: string;
  username: string;
  role: 'admin' | 'teacher' | 'student' | 'parent';
  email: string;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,

  setToken: (token: string) => {
    localStorage.setItem('token', token);
    const decoded = jwtDecode<JWTPayload>(token);
    set({
      token,
      user: {
        id: decoded.sub,
        username: decoded.username,
        role: decoded.role,
        email: decoded.email
      }
    });
  },

  login: async (username: string, password: string) => {
    set({ isLoading: true });
    
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (username === 'admin' && password === '123') {
        const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwidXNlcm5hbWUiOiJhZG1pbiIsInJvbGUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AZXhhbXBsZS5jb20ifQ.8aNd4YPXxzQh_ey4WxD9xQXz6YtWOxS4J6E3qHn1R1w';
        set({
          user: { id: '1', username: 'admin', role: 'admin', email: 'admin@example.com' },
          token: mockToken,
          isLoading: false
        });
        localStorage.setItem('token', mockToken);
        return true;
      } else if (username === 'teacher' && password === '123') {
        const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIiwidXNlcm5hbWUiOiJ0ZWFjaGVyIiwicm9sZSI6InRlYWNoZXIiLCJlbWFpbCI6InRlYWNoZXJAZXhhbXBsZS5jb20ifQ.8aNd4YPXxzQh_ey4WxD9xQXz6YtWOxS4J6E3qHn1R1w';
        set({
          user: { id: '2', username: 'teacher', role: 'teacher', email: 'teacher@example.com' },
          token: mockToken,
          isLoading: false
        });
        localStorage.setItem('token', mockToken);
        return true;
      } else if (username === 'student' && password === '123') {
        const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzIiwidXNlcm5hbWUiOiJzdHVkZW50Iiwicm9sZSI6InN0dWRlbnQiLCJlbWFpbCI6InN0dWRlbnRAZXhhbXBsZS5jb20ifQ.8aNd4YPXxzQh_ey4WxD9xQXz6YtWOxS4J6E3qHn1R1w';
        set({
          user: { id: '3', username: 'student', role: 'student', email: 'student@example.com' },
          token: mockToken,
          isLoading: false
        });
        localStorage.setItem('token', mockToken);
        return true;
      } else if (username === 'parent' && password === '123') {
        const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0IiwidXNlcm5hbWUiOiJwYXJlbnQiLCJyb2xlIjoicGFyZW50IiwiZW1haWwiOiJwYXJlbnRAZXhhbXBsZS5jb20ifQ.8aNd4YPXxzQh_ey4WxD9xQXz6YtWOxS4J6E3qHn1R1w';
        set({
          user: { id: '4', username: 'parent', role: 'parent', email: 'parent@example.com' },
          token: mockToken,
          isLoading: false
        });
        localStorage.setItem('token', mockToken);
        return true;
      }
      
      set({ isLoading: false });
      return false;
    } catch (error) {
      set({ isLoading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },
}));