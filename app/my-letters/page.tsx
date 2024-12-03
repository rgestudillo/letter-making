'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { Letter } from '@/lib/models/Letter'
import { LetterCard } from '@/components/LetterCard'

export default function MyLetters() {
    const [user, setUser] = useState<User | null>(null)
    const [letters, setLetters] = useState<Letter[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user)
                fetchLetters(user)
            } else {
                router.push('/login')
            }
        })

        return () => unsubscribe()
    }, [router])

    const fetchLetters = async (user: User) => {
        setLoading(true)
        setError(null)
        try {
            const idToken = await user.getIdToken()
            const response = await fetch('/api/my-letters', {
                headers: {
                    'Authorization': `Bearer ${idToken}`
                }
            })
            if (!response.ok) {
                throw new Error('Failed to fetch letters')
            }
            const fetchedLetters = await response.json()
            setLetters(fetchedLetters)
        } catch (err) {
            console.error('Error fetching letters:', err)
            setError('Failed to fetch letters. Please try again later.')
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400">
                <p className="text-white text-2xl">Loading...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400">
                <p className="text-white text-2xl">{error}</p>
            </div>
        )
    }

    return (
        <div className="container mx-auto mt-8 p-4">
            <h1 className="text-3xl font-bold mb-4">My Letters</h1>
            {letters.length === 0 ? (
                <p className="text-gray-600">You haven't written any letters yet.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {letters.map((letter) => (
                        <LetterCard key={letter.id} letter={letter} />
                    ))}
                </div>
            )}
        </div>
    )
}

