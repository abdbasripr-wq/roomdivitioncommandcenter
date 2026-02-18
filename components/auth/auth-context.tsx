'use client';

import { useFirebase } from '@/components/providers/firebase-provider';

/**
 * Role-based access control check
 */
export function hasRole(userRole: string | null, allowedRoles: string[]): boolean {
  if (!userRole) return false;
  return allowedRoles.includes(userRole);
}

/**
 * Export available roles
 */
export const USER_ROLES = {
  ADMIN: 'admin',
  RDM: 'rdm', // Room Division Manager
  FO: 'fo', // Front Office
  HK: 'hk', // Housekeeping
  GM: 'gm', // General Manager (read-only)
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

/**
 * Helper to check if user can access a module
 */
export function canAccessModule(
  userRole: string | null,
  module: 'front-office' | 'housekeeping' | 'room-divition' | 'ai-analysis' | 'admin'
): boolean {
  if (!userRole) return false;

  const moduleAccess: Record<string, string[]> = {
    'front-office': [USER_ROLES.ADMIN, USER_ROLES.FO, USER_ROLES.GM],
    housekeeping: [USER_ROLES.ADMIN, USER_ROLES.HK, USER_ROLES.GM],
    'room-divition': [USER_ROLES.ADMIN, USER_ROLES.RDM, USER_ROLES.GM],
    'ai-analysis': [USER_ROLES.ADMIN, USER_ROLES.GM],
    admin: [USER_ROLES.ADMIN],
  };

  return moduleAccess[module]?.includes(userRole) || false;
}

/**
 * Hook to access Firebase auth context
 */
export function useAuthContext() {
  return useFirebase();
}
