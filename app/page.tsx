import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400">
      <h1 className="text-4xl font-bold text-white mb-8 text-center">
        Send Letters to Your Loved Ones
      </h1>
      <Link href="/write">
        <Button size="lg" className="bg-white text-purple-600 hover:bg-purple-100">
          Write Now
        </Button>
      </Link>
    </div>
  )
}

