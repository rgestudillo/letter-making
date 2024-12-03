'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { format } from 'date-fns'
import { Letter } from '@/lib/models/Letter'

interface LetterCardProps {
    letter: Letter
}

export function LetterCard({ letter }: LetterCardProps) {
    const [isOpen, setIsOpen] = useState(false)

    const formattedDate = format(new Date(letter.timestamp), 'MMMM d, yyyy HH:mm')

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle>{letter.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-500">{formattedDate}</p>
                        <p className="mt-2 line-clamp-2">{letter.content}</p>
                    </CardContent>
                </Card>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{letter.title}</DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-2">
                        {letter.author ? `By ${letter.author} • ` : ''}{formattedDate}
                    </p>
                    <p className="whitespace-pre-wrap">{letter.content}</p>
                </div>
            </DialogContent>
        </Dialog>
    )
}

