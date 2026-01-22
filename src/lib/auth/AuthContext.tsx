'use client';

import { createContext, useContext, useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';

export type UserRole = 'super_admin' | 'admin' | 'kontributor';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  hasPermission: (requiredRoles: UserRole[]) => boolean;
  canManageUsers: () => boolean;
  canManageMembers: () => boolean;
  canManageLeadership: () => boolean;
  canPublishArticles: () => boolean;
  canEditOwnContent: (authorId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Track if we're currently fetching to prevent race conditions
  const isFetchingRef = useRef(false);
  const initializedRef = useRef(false);

  useEffect(() => {
    let mounted = true;

    // Safety timeout: force loading to false after 10 seconds
    const safetyTimeout = setTimeout(() => {
      if (mounted && loading) {
        console.warn('[AuthContext] Loading timeout - forcing loading to false');
        setLoading(false);
        initializedRef.current = true;
      }
    }, 10000);

    async function initAuth() {
      // Prevent multiple initializations
      if (initializedRef.current) {
        if (process.env.NODE_ENV === 'development') {
          console.log('[AuthContext] Already initialized, skipping');
        }
        return;
      }

      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          if (process.env.NODE_ENV === 'development') {
            console.error('[AuthContext] Error getting session:', error);
          }
          if (mounted) {
            setLoading(false);
            initializedRef.current = true;
          }
          return;
        }

        if (!mounted) return;

        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setLoading(false);
          initializedRef.current = true;
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('[AuthContext] Auth initialization error:', error);
        }
        if (mounted) {
          setLoading(false);
          initializedRef.current = true;
        }
      }
    }

    initAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (process.env.NODE_ENV === 'development') {
        console.log('[AuthContext] Auth state change event:', event, 'session:', !!session);
      }

      // Don't process events during initial load - let initAuth handle it
      if (!initializedRef.current && event === 'INITIAL_SESSION') {
        if (process.env.NODE_ENV === 'development') {
          console.log('[AuthContext] Skipping INITIAL_SESSION - handled by initAuth');
        }
        return;
      }

      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        // Only fetch profile on SIGNED_IN event, not on TOKEN_REFRESHED during initial load
        // TOKEN_REFRESHED happens automatically on page load and causes double fetch
        if (event === 'SIGNED_IN') {
          await fetchProfile(session.user.id);
        } else if (event === 'TOKEN_REFRESHED' && initializedRef.current) {
          // Only refetch on token refresh if we're already initialized (not initial load)
          await fetchProfile(session.user.id, true);
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
          if (mounted) {
            setLoading(false);
            initializedRef.current = false;
          }
        }
      } else {
        setProfile(null);
        if (mounted && initializedRef.current) {
          // Only set loading false if we're already initialized
          setLoading(false);
        }
      }
    });

    return () => {
      mounted = false;
      clearTimeout(safetyTimeout);
      subscription.unsubscribe();
    };
  }, []); // Empty dependency array - only run once on mount

  async function fetchProfile(userId: string, silent = false) {
    // Prevent concurrent fetches
    if (isFetchingRef.current) {
      if (process.env.NODE_ENV === 'development') {
        console.log('[AuthContext] Fetch already in progress, skipping');
      }
      return;
    }

    // Skip if already fetched for this user AND we're doing a silent refresh
    if (silent && profile?.id === userId) {
      if (process.env.NODE_ENV === 'development') {
        console.log('[AuthContext] Profile already loaded, skipping silent refresh');
      }
      return;
    }

    isFetchingRef.current = true;

    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('[AuthContext] Fetching profile for user:', userId);
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('[AuthContext] Error fetching profile:', {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint,
          });
        }

        // If profile not found (PGRST116), try to create one
        if (error.code === 'PGRST116') {
          if (process.env.NODE_ENV === 'development') {
            console.log('[AuthContext] Profile not found (PGRST116), creating new profile...');
          }
          // Don't use finally here - createProfileForUser handles loading state
          return await createProfileForUser(userId);
        }

        // For other errors, log and continue
        console.error('[AuthContext] Profile fetch failed with error:', error);
        throw error;
      }

      if (process.env.NODE_ENV === 'development') {
        console.log('[AuthContext] Profile fetched successfully:', {
          id: data.id,
          email: data.email,
          role: data.role,
        });
      }

      setProfile(data);
    } catch (error: any) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[AuthContext] Error in fetchProfile:', error);
      }
      setProfile(null);

      // Don't throw - we want to complete initialization even if profile fetch fails
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
      initializedRef.current = true;
    }
  }

  async function createProfileForUser(userId: string) {
    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('[AuthContext] Starting profile creation for user:', userId);
      }

      // Get user email from auth
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

      if (authError) {
        console.error('[AuthContext] Error getting auth user:', authError);
        throw authError;
      }

      if (!authUser) {
        throw new Error('User not found in auth');
      }

      if (process.env.NODE_ENV === 'development') {
        console.log('[AuthContext] Auth user found:', {
          id: authUser.id,
          email: authUser.email,
          metadata: authUser.user_metadata,
        });
      }

      // Create profile with default role
      const newProfile = {
        id: userId,
        email: authUser.email || '',
        full_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || '',
        role: 'kontributor' as const, // Default role
      };

      if (process.env.NODE_ENV === 'development') {
        console.log('[AuthContext] Attempting to insert profile:', newProfile);
      }

      const { data, error } = await supabase
        .from('profiles')
        .insert(newProfile as any) // Type assertion to bypass Supabase type inference issue
        .select()
        .single();

      if (error) {
        console.error('[AuthContext] Profile creation failed:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
        });
        throw error;
      }

      if (process.env.NODE_ENV === 'development') {
        console.log('[AuthContext] Profile created successfully:', data);
      }

      setProfile(data);
    } catch (error: any) {
      console.error('[AuthContext] Error creating profile:', error);
      setProfile(null);

      // Show user-friendly error
      if (error.code === '42501') {
        console.error('[AuthContext] Permission denied - RLS policy issue or missing table permissions');
      } else if (error.code === '23505') {
        console.error('[AuthContext] Profile already exists - possible race condition');
      }
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
      initializedRef.current = true;
    }
  }

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    // Reset all state on sign out
    setUser(null);
    setProfile(null);
    setSession(null);
    isFetchingRef.current = false;
    initializedRef.current = false;
  }, []);

  // Permission helpers - memoized with useCallback to prevent re-renders
  const hasPermission = useCallback((requiredRoles: UserRole[]): boolean => {
    if (!profile) return false;
    return requiredRoles.includes(profile.role);
  }, [profile]);

  const canManageUsers = useCallback((): boolean => {
    return hasPermission(['super_admin']);
  }, [hasPermission]);

  const canManageMembers = useCallback((): boolean => {
    return hasPermission(['super_admin', 'admin']);
  }, [hasPermission]);

  const canManageLeadership = useCallback((): boolean => {
    return hasPermission(['super_admin', 'admin']);
  }, [hasPermission]);

  const canPublishArticles = useCallback((): boolean => {
    return hasPermission(['super_admin', 'admin']);
  }, [hasPermission]);

  const canEditOwnContent = useCallback((authorId: string): boolean => {
    if (!user) return false;
    return user.id === authorId;
  }, [user]);

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    user,
    profile,
    session,
    loading,
    signIn,
    signOut,
    hasPermission,
    canManageUsers,
    canManageMembers,
    canManageLeadership,
    canPublishArticles,
    canEditOwnContent,
  }), [
    user,
    profile,
    session,
    loading,
    signIn,
    signOut,
    hasPermission,
    canManageUsers,
    canManageMembers,
    canManageLeadership,
    canPublishArticles,
    canEditOwnContent,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
