import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

const AuthContext = createContext();

const UNIVERSAL_DUMMY_PASS = 'KpAuth#2026!ComplexPwd';
const ADMIN_EMAIL = 'admin@hotelkrishnapalace.com';

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const determineRoleAndSet = useCallback((authuser) => {
    if (!authuser) {
      setCurrentUser(null);
      setCurrentAdmin(null);
      setLoading(false);
      return;
    }

    if (authuser.email === ADMIN_EMAIL) {
      setCurrentAdmin({
        ...authuser,
        name: 'Administrator',
        collectionName: 'admin_users'
      });
      setCurrentUser(null);
    } else {
      setCurrentUser({
        ...authuser,
        name: authuser.user_metadata?.name || authuser.email.split('@')[0],
        phone: authuser.user_metadata?.phone || '',
        collectionName: 'users'
      });
      setCurrentAdmin(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      determineRoleAndSet(session?.user || null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      determineRoleAndSet(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [determineRoleAndSet]);

  const loginWithPhone = useCallback(async (phone) => {
    const safePhone = phone.replace(/\D/g, '');
    const email = `u${safePhone}@guest.krishnapalace.com`;
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: UNIVERSAL_DUMMY_PASS,
      });

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    }
  }, []);

  const signupWithPhone = useCallback(async (phone, name) => {
    const safePhone = phone.replace(/\D/g, '');
    const email = `u${safePhone}@guest.krishnapalace.com`;
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: UNIVERSAL_DUMMY_PASS,
        options: {
          data: {
            name: name,
            phone: phone,
          }
        }
      });

      if (error) {
        if (error.message.includes('already registered') || error.message.includes('already exists')) {
          return await loginWithPhone(phone);
        }
        throw error;
      }
      
      return data;
    } catch (err) {
      console.error('Signup error detail:', err);
      throw err;
    }
  }, [loginWithPhone]);

  const loginAdmin = useCallback(async (email, password) => {
    if (email !== ADMIN_EMAIL) {
      throw new Error("Unauthorized: Access denied for non-admin users");
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    toast.success('Logged out successfully');
  }, []);

  const value = useMemo(() => ({
    currentUser,
    currentAdmin,
    loginWithPhone,
    signupWithPhone,
    loginAdmin,
    logout,
    isAuthenticated: !!currentUser || !!currentAdmin,
    isCustomer: !!currentUser,
    isAdmin: !!currentAdmin,
    loading
  }), [currentUser, currentAdmin, loginWithPhone, signupWithPhone, loginAdmin, logout, loading]);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
