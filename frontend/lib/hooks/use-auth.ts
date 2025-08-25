'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/store/auth-store';
// Call the Next.js API route to get the authenticated user using the JWT cookie

export function useAuth() {
  const { user, isLoading, isAuthenticated, setUser, setLoading, clearAuth } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/auth', { cache: 'no-store' });
        const result = await res.json();
        if (res.ok && result?.ok && result.data) {
          setUser(result.data);
        } else {
          clearAuth();
        }
      } catch (error) {
        console.error('Auth check error:', error);
        clearAuth();
      } finally {
        setLoading(false);
      }
    };

    // Only check auth if we don't have user data yet
    if (!user && isLoading) {
      checkAuth();
    }
  }, [user, isLoading, setUser, setLoading, clearAuth]);

  return {
    user,
    isLoading,
    isAuthenticated,
    clearAuth,
  };
}
