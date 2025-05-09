'use client';

import { useSession } from 'next-auth/react';

const useAuth = () => {
  const { data: session, status, update } = useSession();

  const authenticated = status === 'authenticated';
  const loading = status === 'loading';
  const user = session?.user;

  const checkRole = (role) => {
    if (!authenticated) return false;
    if (Array.isArray(role)) {
      return role.includes(user?.role);
    }
    return user?.role === role;
  };

  const isAdmin = authenticated && user?.role === 'admin';
  
  return {
    authenticated,
    loading,
    user,
    session,
    checkRole,
    isAdmin,
    updateSession: update,
  };
}

export default useAuth;