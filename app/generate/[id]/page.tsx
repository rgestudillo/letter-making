'use client'

import { useEffect, useState } from 'react'
import QRCode from "react-qr-code"
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { FaCopy, FaPencilAlt, FaCheck } from 'react-icons/fa'

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 via-green-100 to-teal-200 p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-800 mb-2">Your Letter Link</h1>
          <p className="text-emerald-600">Share this link or QR code with your recipient</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border-2 border-emerald-100 flex flex-col items-center space-y-6">
          {/* QR Code with decorative frame */}
          <div className="p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl shadow-inner border-2 border-emerald-100">
            <QRCode
              value={letterLink}
              size={200}
              className="transform hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Link and Copy Button */}
          <div className="w-full space-y-4">
            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200 break-all text-emerald-700 text-sm">
              {letterLink}
            </div>

            <div className="flex justify-center gap-4">
              <Button
                onClick={copyToClipboard}
                className="bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center gap-2 px-6"
              >
                {copied ? (
                  <>
                    <FaCheck className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <FaCopy className="w-4 h-4" />
                    Copy Link
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Button
            onClick={() => router.push("/")}
            className="bg-white text-emerald-600 hover:bg-emerald-50 transition-colors flex items-center gap-2 px-6 group"
          >
            <FaPencilAlt className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            Write Another Letter
          </Button>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-emerald-200/20 to-transparent rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-teal-200/20 to-transparent rounded-full blur-3xl -z-10" />
    </div>
  )
}
