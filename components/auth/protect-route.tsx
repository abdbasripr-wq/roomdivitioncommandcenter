'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFirebase } from '@/components/providers/firebase-provider';
import { hasRole, UserRole } from './auth-context';

interface ProtectRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
}

/**
 * Client-side route protection component
 * Redirects to /login if not authenticated
 * Redirects to / if user lacks required role
 */
export function ProtectRoute({ children, requiredRoles }: ProtectRouteProps) {
  const { user, loading, role } = useFirebase();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // Wait for auth to load

    if (!user) {
      // Not authenticated, redirect to login
      router.replace('/login');
      return;
    }

    if (requiredRoles && !hasRole(role, requiredRoles)) {
      // Lacks required role, redirect to home
      router.replace('/');
      return;
    }
  }, [user, loading, role, requiredRoles, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  if (requiredRoles && !hasRole(role, requiredRoles)) {
    return null; // Will redirect to home
  }

  return <>{children}</>;
}
