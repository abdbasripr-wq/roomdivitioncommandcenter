'use client';

import React, { createContext, useContext } from 'react';
import { User } from 'firebase/auth';
import { useAuth as useFirebaseAuth, useUserRole } from '@/lib/firebase/hooks';

interface FirebaseContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
  signOut: () => Promise<void>;
  role: string | null;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const { user, loading, error, signOut } = useFirebaseAuth();
  const { role } = useUserRole(user?.uid);

  const value: FirebaseContextType = {
    user,
    loading,
    error,
    signOut,
    role,
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within FirebaseProvider');
  }
  return context;
}
