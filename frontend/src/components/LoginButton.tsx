import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { LogIn, LogOut, Loader2 } from 'lucide-react';

interface LoginButtonProps {
  className?: string;
  compact?: boolean;
}

export default function LoginButton({ className = '', compact = false }: LoginButtonProps) {
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
      } catch (error: unknown) {
        const err = error as Error;
        if (err?.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  if (compact) {
    return (
      <button
        onClick={handleAuth}
        disabled={isLoggingIn}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 ${
          isAuthenticated
            ? 'bg-surface-2 hover:bg-surface-3 text-text-muted hover:text-text border border-border'
            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-glow-sm'
        } ${className}`}
        title={isAuthenticated ? 'Logout' : 'Login'}
      >
        {isLoggingIn ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isAuthenticated ? (
          <LogOut className="w-4 h-4" />
        ) : (
          <LogIn className="w-4 h-4" />
        )}
        {!compact && (isLoggingIn ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login')}
      </button>
    );
  }

  return (
    <button
      onClick={handleAuth}
      disabled={isLoggingIn}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 disabled:opacity-50 ${
        isAuthenticated
          ? 'bg-surface-2 hover:bg-surface-3 text-text-muted hover:text-text border border-border'
          : 'btn-primary'
      } ${className}`}
    >
      {isLoggingIn ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Logging in...</span>
        </>
      ) : isAuthenticated ? (
        <>
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </>
      ) : (
        <>
          <LogIn className="w-4 h-4" />
          <span>Login</span>
        </>
      )}
    </button>
  );
}
