'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function WriteLetter() {
  const [letter, setLetter] = useState('')
  const [author, setAuthor] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async () => {
    if (letter.trim()) {
      setIsLoading(true)
      try {
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: letter, author }),
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
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 p-4">
      <h1 className="text-3xl font-bold text-white mb-8">Write Your Letter</h1>
      <div className="w-full max-w-2xl space-y-4">
        <div>
          <Label htmlFor="author" className="text-white">Your Name (optional)</Label>
          <Input
            id="author"
            placeholder="Your name"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full"
          />
        </div>
        <div>
          <Label htmlFor="letter" className="text-white">Your Letter</Label>
          <Textarea
            id="letter"
            className="w-full h-64 p-4 rounded-lg"
            placeholder="Write your letter here..."
            value={letter}
            onChange={(e) => setLetter(e.target.value)}
          />
        </div>
        <Button
          onClick={handleSubmit}
          size="lg"
          className="w-full bg-white text-purple-600 hover:bg-purple-100"
          disabled={isLoading}
        >
          {isLoading ? 'Generating...' : 'Generate Link'}
        </Button>
      </div>
    </div>
  )
}
