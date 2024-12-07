'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { FaPaperPlane } from 'react-icons/fa';

export default function WriteLetter() {
  const [title, setTitle] = useState('')
  const [letter, setLetter] = useState('')
  const [author, setAuthor] = useState('')
  const [recipientEmail, setRecipientEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user)
        setAuthor(user.displayName || '')
      } else {
        router.push('/login')
      }
    })

    // Check for query parameters
    const replyTo = searchParams.get('replyTo')
    const subject = searchParams.get('subject')
    const recipientEmailParam = searchParams.get('recipientEmail')

    if (replyTo) setAuthor(replyTo)
    if (subject) setTitle(subject)
    if (recipientEmailParam) setRecipientEmail(recipientEmailParam)

    return () => unsubscribe()
  }, [router, searchParams])

  const handleSubmit = async () => {
    if (!title.trim() || !letter.trim() || !recipientEmail.trim()) {
      alert('Title, content, and recipient email are required.')
      return
    }
    setIsLoading(true)
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content: letter,
          author,
          createdBy: user ? user.uid : 'Guest',
          recipient_email: recipientEmail,
        }),
      })
      const data = await response.json()
      if (data.id) {
        router.push(`/generate/${data.id}`)
      } else {
        throw new Error('Failed to generate link')
      }
    } catch (error) {
      console.error('Error generating link:', error)
      alert('Failed to generate link. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 via-green-100 to-teal-200 p-4">
      <div className="w-full max-w-2xl space-y-6 relative">
        <div className="text-center mb-2">
          <h1 className="text-3xl font-bold text-emerald-800 mb-2">Write Your Letter</h1>
          <p className="text-emerald-600">Share your thoughts with someone special</p>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border-2 border-emerald-100 space-y-6">
          <div>
            <Label htmlFor="title" className="text-emerald-700 font-medium">Title</Label>
            <Input
              id="title"
              placeholder="Title of your letter"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400"
              required
            />
          </div>

          <div>
            <Label htmlFor="author" className="text-emerald-700 font-medium">Your Name (optional)</Label>
            <Input
              id="author"
              placeholder="Your name"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400"
            />
          </div>

          <div>
            <Label htmlFor="recipientEmail" className="text-emerald-700 font-medium">Recipient's Email</Label>
            <Input
              id="recipientEmail"
              type="email"
              placeholder="Recipient's email address"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              className="w-full border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400"
              required
            />
          </div>

          <div>
            <Label htmlFor="letter" className="text-emerald-700 font-medium">Your Letter</Label>
            <Textarea
              id="letter"
              className="w-full h-64 p-4 rounded-lg border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400 resize-none"
              placeholder="Write your letter here..."
              value={letter}
              onChange={(e) => setLetter(e.target.value)}
              required
            />
          </div>

          <Button
            onClick={handleSubmit}
            size="lg"
            className="w-full bg-emerald-600 text-white hover:bg-emerald-700 transition-colors duration-300 flex items-center justify-center gap-2 group"
            disabled={isLoading}
          >
            <FaPaperPlane className="group-hover:translate-x-1 transition-transform duration-300" />
            {isLoading ? 'Generating...' : 'Generate Link'}
          </Button>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-emerald-200/20 to-transparent rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-teal-200/20 to-transparent rounded-full blur-3xl -z-10" />
    </div>
  )
}

