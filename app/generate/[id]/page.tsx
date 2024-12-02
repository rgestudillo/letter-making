'use client'

import { useEffect, useState } from 'react'
import QRCode from "react-qr-code"
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
export default function GenerateLink({ params }: { params: { id: string } }) {
  const [copied, setCopied] = useState(false)
  const letterLink = `${process.env.NEXT_PUBLIC_BASE_URL}/letter/${params.id}`
  const router = useRouter()
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [copied])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(letterLink)
    setCopied(true)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 p-4">
      <h1 className="text-3xl font-bold text-white mb-8">Your Letter Link</h1>
      <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center">
        <QRCode value={letterLink} size={200} />
        <div className="mt-4 flex items-center gap-4">
          <p className="text-purple-600 break-all">{letterLink}</p>
          <Button
            onClick={copyToClipboard}
            className="bg-white text-purple-600 hover:bg-purple-100"
          >
            {copied ? 'Copied!' : 'Copy Link'}
          </Button>
        </div>
      </div>
      <Button
        onClick={() => router.push("/")}
        className="mt-8 bg-white text-purple-600 hover:bg-purple-100"
      >
        Generate Again
      </Button>
    </div>
  )
}
