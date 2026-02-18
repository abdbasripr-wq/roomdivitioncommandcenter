'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  User,
  onAuthStateChanged,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import {
  ref,
  onValue,
  off,
  get,
} from 'firebase/database';
import { auth, database } from './client';

/**
 * Hook to monitor auth state across the app
 */
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    try {
      const unsubscribe = onAuthStateChanged(
        auth,
        (currentUser) => {
          setUser(currentUser);
          setLoading(false);
        },
        (err) => {
          setError(err as Error);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      setError(err as Error);
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, []);

  return { user, loading, error, signOut };
}

/**
 * Hook to get user role from Realtime DB
 */
export function useUserRole(uid: string | null | undefined) {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      setRole(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const userRef = ref(database, `users/${uid}`);

      const unsubscribe = onValue(
        userRef,
        (snapshot) => {
          const data = snapshot.val();
          setRole(data?.role || null);
          setLoading(false);
        },
        () => {
          setLoading(false);
        }
      );

      return () => off(userRef);
    } catch (err) {
      console.error('[Firebase] useUserRole error:', err);
      setLoading(false);
      return;
    }
  }, [uid]);

  return { role, loading };
}

/**
 * Hook for real-time listener on any Realtime DB path
 */
export function useRealtimeData<T = any>(path: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!path) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const dataRef = ref(database, path);

      const unsubscribe = onValue(
        dataRef,
        (snapshot) => {
          setData(snapshot.val());
          setError(null);
          setLoading(false);
        },
        (err) => {
          setError(err as Error);
          setLoading(false);
        }
      );

      return () => off(dataRef);
    } catch (err) {
      setError(err as Error);
      setLoading(false);
      return;
    }
  }, [path]);

  return { data, loading, error };
}

/**
 * Function for one-time fetch from Realtime DB
 */
export async function fetchFirebaseData<T = any>(path: string): Promise<T | null> {
  try {
    const dataRef = ref(database, path);
    const snapshot = await get(dataRef);
    return snapshot.val();
  } catch (err) {
    console.error('[Firebase] Fetch error:', err);
    return null;
  }
}
