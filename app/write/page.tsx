'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'

export default function WriteLetter() {
  const [letter, setLetter] = useState('')
  const [author, setAuthor] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async () => {
    if (letter.trim() && author.trim()) {
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
    } else {
      alert('Both letter and author fields are required.')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 p-4">
      <h1 className="text-3xl font-bold text-white mb-8">Write Your Letter</h1>
      <Input
        className="w-full max-w-2xl mb-4 p-4 rounded-lg"
        placeholder="Author name..."
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />
      <Textarea
        className="w-full max-w-2xl h-64 mb-4 p-4 rounded-lg"
        placeholder="Write your letter here..."
        value={letter}
        onChange={(e) => setLetter(e.target.value)}
      />
      <Button
        onClick={handleSubmit}
        size="lg"
        className="bg-white text-purple-600 hover:bg-purple-100"
        disabled={isLoading}
      >
        {isLoading ? 'Generating...' : 'Generate Link'}
      </Button>
    </div>
  )
}
