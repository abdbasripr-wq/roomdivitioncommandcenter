import { initializeApp, cert, getApps, App } from 'firebase-admin/app';
import { Auth, getAuth } from 'firebase-admin/auth';
import { Database, getDatabase } from 'firebase-admin/database';
import { Storage, getStorage } from 'firebase-admin/storage';

// Initialize Firebase Admin SDK (only on server-side)
let adminApp: App | null = null;
let adminAuth: Auth | null = null;
let adminDatabase: Database | null = null;
let adminStorage: Storage | null = null;
let initializationError: Error | null = null;

function validateAdminCredentials() {
  const requiredEnvVars = [
    'FIREBASE_ADMIN_PROJECT_ID',
    'FIREBASE_ADMIN_CLIENT_EMAIL',
    'FIREBASE_ADMIN_PRIVATE_KEY',
  ];

  const missing = requiredEnvVars.filter((env) => !process.env[env]);

  if (missing.length > 0) {
    return {
      isValid: false,
      message: `Missing Firebase Admin credentials: ${missing.join(', ')}. Firebase Admin SDK will not be available during build time.`,
    };
  }

  return { isValid: true };
}

function initializeAdminApp() {
  // Already initialized or failed
  if (adminApp !== null || initializationError !== null) return;

  const validation = validateAdminCredentials();
  if (!validation.isValid) {
    console.warn('[Firebase Admin]', validation.message);
    initializationError = new Error(validation.message);
    return;
  }

  try {
    if (getApps().length === 0) {
      const serviceAccount = {
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      };

      adminApp = initializeApp({
        credential: cert(serviceAccount as any),
        databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      });

      adminAuth = getAuth(adminApp);
      adminDatabase = getDatabase(adminApp);
      adminStorage = getStorage(adminApp);
    } else {
      adminApp = getApps()[0];
      adminAuth = getAuth(adminApp);
      adminDatabase = getDatabase(adminApp);
      adminStorage = getStorage(adminApp);
    }
  } catch (error) {
    initializationError = error instanceof Error ? error : new Error('Unknown admin initialization error');
    console.error('[Firebase Admin] Initialization error:', initializationError);
  }
}

// Initialization is now completely lazy - happens only when functions are called
// This prevents errors during build when credentials are not available

function getAdminAppInstance(): App {
  if (adminApp) return adminApp;
  throw new Error('Firebase Admin app is not initialized. Ensure FIREBASE_ADMIN_* environment variables are set.');
}

export function getAdminAuth(): Auth {
  getAdminAppInstance(); // Ensure app is initialized
  if (!adminAuth) throw new Error('Firebase Admin Auth is not initialized');
  return adminAuth;
}

export function getAdminDatabase(): Database {
  getAdminAppInstance(); // Ensure app is initialized
  if (!adminDatabase) throw new Error('Firebase Admin Database is not initialized');
  return adminDatabase;
}

export function getAdminStorage(): Storage {
  getAdminAppInstance(); // Ensure app is initialized
  if (!adminStorage) throw new Error('Firebase Admin Storage is not initialized');
  return adminStorage;
}

/**
 * Verify ID token from client
 */
export async function verifyIdToken(token: string) {
  try {
    const auth = getAdminAuth();
    return await auth.verifyIdToken(token);
  } catch (error) {
    console.error('[Firebase Admin] Token verification error:', error);
    return null;
  }
}

/**
 * Get user claims (role)
 */
export async function getUserClaims(uid: string) {
  try {
    const auth = getAdminAuth();
    const user = await auth.getUser(uid);
    return user.customClaims || null;
  } catch (error) {
    console.error('[Firebase Admin] Get user claims error:', error);
    return null;
  }
}

/**
 * Write to Realtime DB
 */
export async function writeToDatabase(path: string, data: any) {
  try {
    const database = getAdminDatabase();
    await database.ref(path).set(data);
    return true;
  } catch (error) {
    console.error('[Firebase Admin] Database write error:', error);
    return false;
  }
}

/**
 * Read from Realtime DB
 */
export async function readFromDatabase(path: string) {
  try {
    const database = getAdminDatabase();
    const snapshot = await database.ref(path).get();
    return snapshot.val();
  } catch (error) {
    console.error('[Firebase Admin] Database read error:', error);
    return null;
  }
}

/**
 * Update Realtime DB
 */
export async function updateDatabase(path: string, updates: Record<string, any>) {
  try {
    const database = getAdminDatabase();
    await database.ref(path).update(updates);
    return true;
  } catch (error) {
    console.error('[Firebase Admin] Database update error:', error);
    return false;
  }
}

/**
 * Delete from Realtime DB
 */
export async function deleteFromDatabase(path: string) {
  try {
    const database = getAdminDatabase();
    await database.ref(path).remove();
    return true;
  } catch (error) {
    console.error('[Firebase Admin] Database delete error:', error);
    return false;
  }
}
