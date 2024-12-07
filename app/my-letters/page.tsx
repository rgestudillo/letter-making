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
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 via-green-100 to-teal-200">
                <div className="bg-white/80 backdrop-blur-sm px-8 py-4 rounded-xl shadow-xl border-2 border-emerald-100">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce"></div>
                        <span className="text-emerald-800 text-xl font-medium ml-2">Loading</span>
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-emerald-200/20 to-transparent rounded-full blur-3xl -z-10" />
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-teal-200/20 to-transparent rounded-full blur-3xl -z-10" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 via-green-100 to-teal-200">
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

