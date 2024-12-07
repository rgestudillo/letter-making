'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FaPencilAlt } from 'react-icons/fa'
export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 via-green-100 to-teal-200 px-4">
      <div className="text-center space-y-8 max-w-2xl">
        <h1 className="text-5xl font-bold text-emerald-800 mb-4 text-center">
          Send Letters to Your Loved Ones
        </h1>
        <Link href="/write">
          <Button
            size="lg"
            className="bg-emerald-600 text-white hover:bg-emerald-700 transform hover:scale-105 transition-all duration-300 shadow-lg group"
          >
            <FaPencilAlt className="mr-2 group-hover:rotate-12 transition-transform" />
            Write Now
          </Button>
        </Link>
      </div>

      {/* Optional decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-emerald-200/20 to-transparent rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-teal-200/20 to-transparent rounded-full blur-3xl -z-10" />
    </div>
  )
}