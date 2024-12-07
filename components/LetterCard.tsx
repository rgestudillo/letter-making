'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { format } from 'date-fns'
import { Letter } from '@/lib/models/Letter'
import Link from 'next/link'
import { FaEnvelope } from 'react-icons/fa'

interface LetterCardProps {
    letter: Letter
}

export function LetterCard({ letter }: LetterCardProps) {
    const formattedDate = format(new Date(letter.timestamp), 'MMMM d, yyyy HH:mm')

    return (
        <Link href={`/letter/${letter.id}`}>
            <Card className="cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-100">
                <CardHeader className="relative pb-2">
                    <div className="absolute -right-2 -top-2 bg-emerald-500 p-2 rounded-full shadow-lg">
                        <FaEnvelope className="text-white w-4 h-4" />
                    </div>
                    <CardTitle className="text-xl font-semibold text-emerald-800 line-clamp-1">
                        {letter.title}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {letter.author && (
                            <p className="text-sm font-medium text-emerald-600">
                                From: {letter.author}
                            </p>
                        )}
                        <p className="text-xs text-gray-500">
                            {formattedDate}
                        </p>
                        {letter.content && (
                            <p className="text-sm text-gray-600 line-clamp-2 mt-2">
                                {letter.content}
                            </p>
                        )}
                        <div className="pt-2">
                            <span className="text-xs font-medium text-emerald-500 hover:text-emerald-700">
                                Read more →
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}