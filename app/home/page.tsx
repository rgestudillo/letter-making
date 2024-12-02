'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                // Redirect to login if no user is authenticated
                router.push('/');
            } else {
                setUser(user); // Set user if authenticated
            }
        });

        return () => unsubscribe();
    }, [router]);

    if (!user) {
        return null; // Show nothing or a loading spinner while waiting for auth state
    }

    return (
        <div className="container mx-auto mt-8 p-4">
            <h1 className="text-3xl font-bold mb-4">Welcome, {user.displayName || "User"}!</h1>
            <p className="text-xl">You are signed in. Ready to send a letter?</p>
            {/* Link to the page where the user can write a letter */}
            <Link href="/write">
                <Button className="mt-4 bg-white text-purple-600 hover:bg-purple-100">
                    Write Now
                </Button>
            </Link>
        </div>
    );
}
