'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { Button } from '@/components/ui/button';

export function Header() {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });
        return () => unsubscribe();
    }, [router]);

    const handleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const { uid, email } = result.user;

            // Call the Next.js API route to add/verify the user in Firestore
            const response = await fetch('/api/create-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: uid, userEmail: email }),
            });

            if (!response.ok) {
                throw new Error('Failed to add/verify user in Firestore');
            }

            router.push('/');
        } catch (error) {
            console.error('Error signing in or verifying user:', error);
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            router.push('/');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <header className="bg-purple-600 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold">
                    Letter Writing
                </Link>
                <nav className="flex items-center space-x-4">
                    {user && (
                        <Link href="/home" className="text-white hover:underline">
                            Dashboard
                        </Link>
                    )}
                    {user ? (
                        <Button onClick={handleSignOut} className="bg-white text-purple-600 hover:bg-purple-100">
                            Sign Out
                        </Button>
                    ) : (
                        <Button onClick={handleSignIn} className="bg-white text-purple-600 hover:bg-purple-100">
                            Sign In with Google
                        </Button>
                    )}
                </nav>
            </div>
        </header>
    );
}
