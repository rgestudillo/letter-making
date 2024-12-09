'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { FaPaperPlane } from 'react-icons/fa';
import { Letter } from '@/lib/models/Letter';

export default function WriteLetter() {
  const [letter, setLetter] = useState<Partial<Letter>>({
    title: '',
    content: '',
    author: '',
    recipient_email: '',
    createdBy: 'Guest',
    image: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user)
        setLetter((prevLetter) => ({
          ...prevLetter,
          author: user.displayName || '',
          createdBy: user.uid,
        }))
      }
    })

    return () => unsubscribe()
  }, [router])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setLetter({ ...letter, image: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async () => {
    if (!letter.title?.trim() || !letter.content?.trim()) {
      alert('Title and content are required.')
      return
    }
    setIsLoading(true)
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(letter),
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
              value={letter.title}
              onChange={(e) => setLetter({ ...letter, title: e.target.value })}
              className="w-full border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400"
              required
            />
          </div>

          <div>
            <Label htmlFor="author" className="text-emerald-700 font-medium">Your Name (optional)</Label>
            <Input
              id="author"
              placeholder="Your name"
              value={letter.author}
              onChange={(e) => setLetter({ ...letter, author: e.target.value })}
              className="w-full border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400"
            />
          </div>

          <div>
            <Label htmlFor="recipientEmail" className="text-emerald-700 font-medium">Recipient's Email (optional)</Label>
            <Input
              id="recipientEmail"
              type="email"
              placeholder="Recipient's email address"
              value={letter.recipient_email}
              onChange={(e) => setLetter({ ...letter, recipient_email: e.target.value })}
              className="w-full border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400"
            />
          </div>

          <div>
            <Label htmlFor="letter" className="text-emerald-700 font-medium">Your Letter</Label>
            <Textarea
              id="letter"
              className="w-full h-64 p-4 rounded-lg border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400 resize-none"
              placeholder="Write your letter here..."
              value={letter.content}
              onChange={(e) => setLetter({ ...letter, content: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="image" className="text-emerald-700 font-medium">Attach Image (optional)</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400"
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

