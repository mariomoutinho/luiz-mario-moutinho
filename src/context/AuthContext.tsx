import type { Session } from '@supabase/supabase-js';
import { useEffect, useMemo, useState } from 'react';
import { friendlyError } from '../lib/errors';
import { requireSupabase, supabase, supabaseConfigured } from '../lib/supabase';
import { AuthContext, type AuthContextValue } from './auth-context';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(supabaseConfigured);

  useEffect(() => {
    if (!supabase) return;

    let mounted = true;
    void supabase.auth.getSession().then(({ data }) => {
      if (mounted) {
        setSession(data.session);
        setLoading(false);
      }
    });

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      session,
      loading,
      configured: supabaseConfigured,
      async signIn(email, password) {
        const { error } = await requireSupabase().auth.signInWithPassword({ email, password });
        if (error) throw new Error(friendlyError(error));
      },
      async signUp(name, email, password) {
        const { data, error } = await requireSupabase().auth.signUp({
          email,
          password,
          options: { data: { full_name: name.trim() } },
        });
        if (error) throw new Error(friendlyError(error));
        return Boolean(data.session);
      },
      async requestPasswordReset(email) {
        const redirectTo = `${window.location.origin}/atualizar-senha`;
        const { error } = await requireSupabase().auth.resetPasswordForEmail(email, { redirectTo });
        if (error) throw new Error(friendlyError(error));
      },
      async updatePassword(password) {
        const { error } = await requireSupabase().auth.updateUser({ password });
        if (error) throw new Error(friendlyError(error));
      },
      async signOut() {
        const { error } = await requireSupabase().auth.signOut();
        if (error) throw new Error(friendlyError(error));
      },
    }),
    [loading, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
