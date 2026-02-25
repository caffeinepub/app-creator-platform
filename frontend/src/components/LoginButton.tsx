import React from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { LogIn, LogOut, Loader2 } from 'lucide-react';

export default function LoginButton() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <button
      onClick={handleAuth}
      disabled={isLoggingIn}
      className={`
        flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium
        transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
        ${isAuthenticated
          ? 'glass border border-border text-text-secondary hover:text-text-primary hover:border-brand/50 hover:shadow-brand-glow-sm'
          : 'btn-primary text-white'
        }
      `}
    >
      {isLoggingIn ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : isAuthenticated ? (
        <LogOut className="w-4 h-4" />
      ) : (
        <LogIn className="w-4 h-4" />
      )}
      <span>{isLoggingIn ? 'Connecting...' : isAuthenticated ? 'Logout' : 'Login'}</span>
    </button>
  );
}
