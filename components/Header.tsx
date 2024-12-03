'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils'; // Assuming you have this utility for conditional class names
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Mail, Inbox } from 'react-feather';
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
        <header className="bg-purple-600 text-white p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                {/* Left Section: Logo and Write Now */}
                <div className="flex items-center space-x-4">
                    <Link href="/" className="text-2xl font-bold text-white">
                        Letter Writing
                    </Link>
                </div>

                {/* Center Section: My Letters and Received Letters */}
                <div className="flex space-x-4">
                    {user && (
                        <>
                            <Link
                                href="/received-letters"
                                className="flex items-center space-x-2 text-white group hover:text-purple-200 transition-all"
                            >
                                <Inbox className="w-5 h-5 group-hover:text-purple-200 transition-colors" />
                                <span className="font-medium text-lg group-hover:text-purple-200">Received Letters</span>
                            </Link>

                            <Link
                                href="/my-letters"
                                className="flex items-center space-x-2 text-white group hover:text-purple-200 transition-all"
                            >
                                <Mail className="w-5 h-5 group-hover:text-purple-200 transition-colors" />
                                <span className="font-medium text-lg group-hover:text-purple-200">My Letters</span>
                            </Link>
                        </>
                    )}
                </div>

                {/* Right Section: Sign In / Sign Out */}
                <div className="flex items-center">
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="bg-purple-500 text-white hover:bg-purple-700">
                                    {user.displayName || 'Account'}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-48">
                                <DropdownMenuItem onClick={handleSignOut} className="text-purple-600 hover:bg-purple-100">
                                    Sign Out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button
                            onClick={handleSignIn}
                            className="bg-white text-purple-600 hover:bg-purple-100 hover:text-purple-800 transition-colors"
                        >
                            Sign In with Google
                        </Button>
                    )}
                </div>
            </div>
        </header>
    );
}
