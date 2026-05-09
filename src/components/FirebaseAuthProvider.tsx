import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { useStore } from '../store/useStore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const useAuth = () => useContext(AuthContext);

export const FirebaseAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { setCurrentUser, setIsAdmin } = useStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Sync to firestore if not exists, or get role
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          const isFirstAdmin = firebaseUser.email === 'andresorozco199417@gmail.com';
          if (!userDoc.exists()) {
            await setDoc(userDocRef, {
              email: firebaseUser.email,
              role: isFirstAdmin ? 'admin' : 'client',
              createdAt: serverTimestamp(),
            });
            setIsAdmin(isFirstAdmin);
          } else {
            const userData = userDoc.data();
            setIsAdmin(userData.role === 'admin' || firebaseUser.email === 'andresorozco199417@gmail.com');
            
            // Auto upgrade just in case
            if (userData.role !== 'admin' && firebaseUser.email === 'andresorozco199417@gmail.com') {
               await setDoc(userDocRef, { role: 'admin' }, { merge: true });
               setIsAdmin(true);
            }
          }
          setCurrentUser({
            id: firebaseUser.uid,
            username: firebaseUser.email?.split('@')[0] || 'user',
            fullName: firebaseUser.displayName || 'Usuario',
            email: firebaseUser.email || '',
            phone: firebaseUser.phoneNumber || '',
            createdAt: new Date().toISOString(),
            role: isFirstAdmin ? 'admin' : (userDoc.exists() ? userDoc.data().role : 'client'),
          });
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        const currentId = useStore.getState().currentUser?.id;
        if (currentId !== 'local-admin') {
          setCurrentUser(null);
          setIsAdmin(false);
        }
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [setCurrentUser, setIsAdmin]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
