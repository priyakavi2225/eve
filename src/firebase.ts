import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, User as FirebaseUser } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, updateDoc, collection, getDocs, limit, query, orderBy, onSnapshot } from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json';
import { StudentProfile, LeaderboardEntry, ActivityLog } from './types';
import { MOCK_LEADERBOARDS } from './data';

// Determine if Firebase has been fully provisioned or is still in placeholder state
export const isFirebaseActive = 
  firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== 'placeholder-api-key' && 
  !firebaseConfig.apiKey.includes('placeholder');

let app: any;
let dbInstance: any;
let authInstance: any;

if (isFirebaseActive) {
  try {
    app = initializeApp(firebaseConfig);
    dbInstance = getFirestore(app, firebaseConfig.firestoreDatabaseId);
    authInstance = getAuth(app);
    console.log("Stitch AI Firebase layer successfully initialized.");
  } catch (error) {
    console.error("Firebase initialization failed, falling back to offline mode:", error);
  }
} else {
  console.log("Stitch AI running in Local-First fallback storage mode.");
}

export const db = dbInstance;
export const auth = authInstance;

// Re-export mandatory error handling interfaces and types
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const currentAuthUser = authInstance?.currentUser;
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: currentAuthUser?.uid || null,
      email: currentAuthUser?.email || null,
      emailVerified: currentAuthUser?.emailVerified || null,
      isAnonymous: currentAuthUser?.isAnonymous || null,
      tenantId: currentAuthUser?.tenantId || null,
      providerInfo: currentAuthUser?.providerData?.map((provider: any) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Unified Active Storage System (Saves to Firebase database if active, else falls back to LocalStorage)
const LOCAL_PROFILE_KEY = 'stitch_ai_local_student_profile';
const LOCAL_LEADERBOARDS_KEY = 'stitch_ai_local_leaderboards';
const LOCAL_FEEDBACK_KEY = 'stitch_ai_local_suggestions';
const LOCAL_ACTIVITY_LOG_KEY = 'stitch_ai_local_activity_log';

export async function saveProfileToDatabase(profile: StudentProfile): Promise<void> {
  // Always save locally first for seamless user experience
  localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(profile));

  if (isFirebaseActive && authInstance?.currentUser) {
    const path = `students/${profile.uid}`;
    try {
      await setDoc(doc(dbInstance, 'students', profile.uid), profile);
      // Incrementally update public leaderboards in Firestore
      await setDoc(doc(dbInstance, 'leaderboard', profile.uid), {
        uid: profile.uid,
        fullName: profile.fullName,
        avatar: profile.fullName.trim() ? profile.fullName.charAt(0).toUpperCase() : '🦊',
        xp: profile.xp,
        level: profile.currentLevel,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  }
}

export async function fetchProfileFromDatabase(uid: string): Promise<StudentProfile | null> {
  if (isFirebaseActive) {
    const path = `students/${uid}`;
    try {
      const snap = await getDoc(doc(dbInstance, 'students', uid));
      if (snap.exists()) {
        const data = snap.data() as StudentProfile;
        localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(data));
        return data;
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
    }
  }

  // Local fallback lookup
  const local = localStorage.getItem(LOCAL_PROFILE_KEY);
  if (local) {
    try {
      const parsed = JSON.parse(local);
      if (parsed.uid === uid) return parsed;
    } catch (_) {}
  }
  return null;
}

export async function fetchLeaderboardFromDatabase(group: string): Promise<LeaderboardEntry[]> {
  if (isFirebaseActive) {
    const path = 'leaderboard';
    try {
      const q = query(collection(dbInstance, 'leaderboard'), orderBy('xp', 'desc'), limit(10));
      const snaps = await getDocs(q);
      if (!snaps.empty) {
        const entries: LeaderboardEntry[] = [];
        let r = 1;
        snaps.forEach((d) => {
          const val = d.data();
          entries.push({
            uid: d.id,
            fullName: val.fullName || 'Anonymous Topper',
            avatar: val.avatar || '🎓',
            xp: val.xp || 0,
            level: val.level || 1,
            rank: r++
          });
        });
        return entries;
      }
    } catch (error) {
      console.warn("Could not query live leaderboard collection:", error);
    }
  }

  // Dynamic fallback incorporating local achievements
  const localProfileStr = localStorage.getItem(LOCAL_PROFILE_KEY);
  let baseList = [...(MOCK_LEADERBOARDS[group] || MOCK_LEADERBOARDS['friends'])];

  if (localProfileStr) {
    try {
      const profile = JSON.parse(localProfileStr) as StudentProfile;
      // Remove any existing user reference to inject with fresh data
      baseList = baseList.filter(e => e.fullName !== 'You' && e.uid !== profile.uid);
      baseList.push({
        uid: profile.uid,
        fullName: profile.fullName || 'You',
        avatar: '🦊',
        xp: profile.xp,
        level: profile.currentLevel,
        rank: 0 // calculated below
      });
    } catch (_) {}
  }

  // Sort and assign descending ranks
  baseList.sort((a,b) => b.xp - a.xp);
  return baseList.map((item, idx) => ({ ...item, rank: idx + 1 }));
}

// Handle parent message logs or progress submissions
export async function saveActivityLog(log: ActivityLog): Promise<void> {
  const currentLogs = localStorage.getItem(LOCAL_ACTIVITY_LOG_KEY);
  let parsedLogs: ActivityLog[] = [];
  if (currentLogs) {
    try { parsedLogs = JSON.parse(currentLogs); } catch (_) {}
  }
  parsedLogs.unshift(log); // Add to top
  localStorage.setItem(LOCAL_ACTIVITY_LOG_KEY, JSON.stringify(parsedLogs.slice(0, 50)));

  if (isFirebaseActive && authInstance?.currentUser) {
    const p = `students/${authInstance.currentUser.uid}/logs/${log.id}`;
    try {
      await setDoc(doc(dbInstance, 'students', authInstance.currentUser.uid, 'logs', log.id), log);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, p);
    }
  }
}

export async function fetchActivityLogs(uid: string): Promise<ActivityLog[]> {
  if (isFirebaseActive) {
    const path = `students/${uid}/logs`;
    try {
      const snaps = await getDocs(query(collection(dbInstance, 'students', uid, 'logs'), orderBy('timestamp', 'desc'), limit(20)));
      const results: ActivityLog[] = [];
      snaps.forEach((d) => {
        results.push(d.data() as ActivityLog);
      });
      return results;
    } catch (_) {}
  }

  const local = localStorage.getItem(LOCAL_ACTIVITY_LOG_KEY);
  return local ? JSON.parse(local) : [
    {
      id: 'init_log',
      title: 'Created studying profile',
      type: 'streak_gain',
      timestamp: new Date().toISOString(),
      xpAwarded: 50
    }
  ];
}

// Perform Google Popup authentication or fall back to simulated credentials
export async function authenticateWithGoogle(): Promise<StudentProfile> {
  if (isFirebaseActive && authInstance) {
    try {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(authInstance, provider);
      const user = res.user;

      const existingProfile = await fetchProfileFromDatabase(user.uid);
      if (existingProfile) {
        return existingProfile;
      }

      // Create new responsive student profile
      const newProfile: StudentProfile = {
        uid: user.uid,
        fullName: user.displayName || 'Bright Topper',
        email: user.email || '',
        mobileNumber: '',
        language: 'English',
        studyingFor: 'Coding',
        knowledgeLevel: 'Beginner',
        currentLevel: 1,
        xp: 150,
        coins: 100,
        gems: 10,
        streak: 1,
        lastActiveDate: new Date().toISOString().split('T')[0],
        verified: true,
        unlockedBadges: ['fast_learner'],
        completedLevels: []
      };
      await saveProfileToDatabase(newProfile);
      return newProfile;
    } catch (error) {
      console.error("Google authenticated trigger error, trying simulated account:", error);
    }
  }

  // Offline / fallback signup process
  const local = localStorage.getItem(LOCAL_PROFILE_KEY);
  if (local) {
    try { return JSON.parse(local); } catch (_) {}
  }

  const dummyProfile: StudentProfile = {
    uid: 'local_topper_student',
    fullName: 'Bright Topper',
    email: 'topper@stitch.ai',
    mobileNumber: '9876543210',
    language: 'English',
    studyingFor: 'School',
    knowledgeLevel: 'Beginner',
    currentLevel: 1,
    xp: 150,
    coins: 100,
    gems: 10,
    streak: 1,
    lastActiveDate: new Date().toISOString().split('T')[0],
    verified: true,
    unlockedBadges: ['fast_learner'],
    completedLevels: []
  };
  localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(dummyProfile));
  return dummyProfile;
}
