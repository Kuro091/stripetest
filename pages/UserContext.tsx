import { supabase } from '@/utils/supabase';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/router';
import { ReactNode, createContext, Context, useState, useEffect, useContext } from 'react';

type AppUser =
  | (User & { is_subscribed: boolean; stripe_customer: string; interval: string })
  | undefined;

const UserContext = createContext<{
  user: AppUser;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}>({
  user: undefined,
  login: () => new Promise(() => {}),
  logout: () => new Promise(() => {}),
  isLoading: true,
});

const Provider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  const login = async () => {
    supabase.auth.signInWithOAuth({
      provider: 'google',
    });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(undefined);
    router.push('/');
  };

  const [user, setUser] = useState<AppUser>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const subscription = supabase
        .channel('table-filter-changes')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'profile',
            filter: `id = '${user.id}'`,
          },

          (payload) => {
            setUser({ ...user, ...payload.new });
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user]);

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        // delete cookies on sign out
        const expires = new Date(0).toUTCString();
        document.cookie = `my-access-token=; path=/; expires=${expires}; SameSite=Lax; secure`;
        document.cookie = `my-refresh-token=; path=/; expires=${expires}; SameSite=Lax; secure`;
        setUser(undefined);
        setIsLoading(false);

        return;
      }

      if (session?.user) {
        const { data: profile } = await supabase
          .from('profile')
          .select('*')
          .eq('id', session?.user.id)
          .single();
        setUser({ ...profile, ...session?.user });
        setIsLoading(false);

        const maxAge = 100 * 365 * 24 * 60 * 60; // 100 years, never expires
        document.cookie = `my-access-token=${session?.access_token}; path=/; max-age=${maxAge}; SameSite=Lax; secure`;
        document.cookie = `my-refresh-token=${session?.refresh_token}; path=/; max-age=${maxAge}; SameSite=Lax; secure`;
        return;
      }

      setUser(undefined);
      setIsLoading(false);
    });
  }, []);

  const exposed = {
    user,
    login,
    logout,
    isLoading,
  };

  return <UserContext.Provider value={exposed}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);

export default Provider;
