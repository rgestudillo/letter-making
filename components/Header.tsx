'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Mail, Inbox, Menu } from 'react-feather';

export function Header() {
    const [user, setUser] = useState<User | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
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
            const response = await fetch('/api/create-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: uid, userEmail: email }),
            });
            if (!response.ok) throw new Error('Failed to add/verify user in Firestore');
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
        <header className="bg-emerald-600 text-white p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                {/* Left Section: Logo */}
                <div className="flex items-center">
                    <Link href="/" className="text-xl md:text-2xl font-bold text-white hover:text-emerald-100 transition-colors">
                        Letter Writing
                    </Link>
                </div>

                {/* Center Section: Navigation Links (Hidden on Mobile) */}
                <div className="hidden md:flex space-x-4">
                    {user && (
                        <>
                            <Link
                                href="/received-letters"
                                className="flex items-center space-x-2 text-white group hover:text-emerald-200 transition-all"
                            >
                                <Inbox className="w-5 h-5 group-hover:text-emerald-200 transition-colors" />
                                <span className="font-medium text-lg group-hover:text-emerald-200">Received Letters</span>
                            </Link>

                            <Link
                                href="/my-letters"
                                className="flex items-center space-x-2 text-white group hover:text-emerald-200 transition-all"
                            >
                                <Mail className="w-5 h-5 group-hover:text-emerald-200 transition-colors" />
                                <span className="font-medium text-lg group-hover:text-emerald-200">My Letters</span>
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Navigation */}
                <div className="md:hidden flex items-center space-x-4">
                    {user && (
                        <>
                            <Link
                                href="/received-letters"
                                className="text-white hover:text-emerald-200 transition-colors"
                                title="Received Letters"
                            >
                                <Inbox className="w-6 h-6" />
                            </Link>
                            <Link
                                href="/my-letters"
                                className="text-white hover:text-emerald-200 transition-colors"
                                title="My Letters"
                            >
                                <Mail className="w-6 h-6" />
                            </Link>
                        </>
                    )}
                </div>

                {/* Right Section: Account */}
                <div className="flex items-center">
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="bg-emerald-500 text-white hover:bg-emerald-700 transition-colors">
                                    <span className="hidden md:inline">{user.displayName || 'Account'}</span>
                                    <Menu className="w-5 h-5 md:hidden" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-48">
                                <DropdownMenuItem
                                    onClick={handleSignOut}
                                    className="text-emerald-600 hover:bg-emerald-100 cursor-pointer"
                                >
                                    Sign Out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button
                            onClick={handleSignIn}
                            className="bg-white text-emerald-600 hover:bg-emerald-100 hover:text-emerald-800 transition-colors"
                        >
                            <span className="hidden md:inline">Sign In with Google</span>
                            <span className="md:hidden">Sign In</span>
                        </Button>
                    )}
                </div>
            </div>
        </header>
    );
}
