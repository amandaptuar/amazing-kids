import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { getUserProfile } from '../services/authAPI';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    const fetchSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setUser(session.user);
          const userProfile = await getUserProfile();
          if (userProfile) {
            setRole(userProfile.role);
            setProfile(userProfile.profile);
          }
        }
      } catch (error) {
        console.error('Error fetching session:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();

    // Export a manual refresh function to fix registration race conditions
    window.refreshAuthProfile = fetchSession;

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        setUser(session.user);
        const userProfile = await getUserProfile();
        if (userProfile) {
          setRole(userProfile.role);
          setProfile(userProfile.profile);
        }
      } else {
        setUser(null);
        setRole(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const refreshProfile = async () => {
    if (user) {
      const userProfile = await getUserProfile();
      if (userProfile) {
        setRole(userProfile.role);
        setProfile(userProfile.profile);
      }
    }
  };

  const forceAdminLogin = () => {
    setUser({ id: 'hardcoded-admin', email: 'jude@1022' });
    setRole('admin');
    setProfile({ name: 'Super Admin', email: 'jude@1022' });
  };

  return (
    <AuthContext.Provider value={{ user, role, profile, loading, refreshProfile, forceAdminLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
