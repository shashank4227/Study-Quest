import { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import api from '../lib/api';
import { Loader2 } from 'lucide-react';

const AuthInitializer = ({ children }) => {
  const { token, isLoading, setUser, setLoading, logout } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      if (!token) { setLoading(false); return; }
      try {
        const { data } = await api.get('/users/profile');
        setUser(data);
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, [token, setUser, setLoading, logout]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-8 h-8 text-brand animate-spin" />
        <p className="text-brand-muted text-sm font-medium">Loading StudyQuest...</p>
      </div>
    );
  }

  return children;
};

export default AuthInitializer;
