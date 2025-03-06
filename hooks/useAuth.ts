// hooks/useAuth.ts
'use client';
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { useRouter } from 'next/navigation';

export function useAuth(redirectUrl = '/login') {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
                router.push(redirectUrl);
            }
        });

        return () => unsubscribe();
    }, [router, redirectUrl]);

    return user;
}