'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Envelope } from './Envelope';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FaEnvelope, FaCalendarAlt, FaUser, FaQuoteLeft } from 'react-icons/fa';
import { Typewriter } from './Typewriter';
import { Letter } from '@/lib/models/Letter';

export function LetterContent({ letter, formattedDate }: { letter: Letter, formattedDate: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <AnimatePresence mode="wait">
            {!isOpen ? (
                <Envelope key="envelope" onOpen={() => setIsOpen(true)} title={letter.title} />
            ) : (
                <motion.div
                    key="letter"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card className="w-full max-w-3xl shadow-2xl border-2 border-emerald-100 transform hover:scale-[1.02] transition-all duration-500">
                        <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 border-b-2 border-emerald-100">
                            <div className="flex items-center gap-3">
                                <div className="bg-emerald-500 p-2 rounded-full shadow-lg">
                                    <FaEnvelope className="w-5 h-5 text-white" />
                                </div>
                                <CardTitle className="text-3xl font-bold text-emerald-800">{letter.title}</CardTitle>
                            </div>
                        </CardHeader>

                        <CardContent className="p-8 bg-white">
                            <ScrollArea className="h-[60vh] pr-4">
                                <div className="space-y-4">
                                    <div className="relative bg-gradient-to-br from-emerald-50 to-green-50 p-8 rounded-xl shadow-inner border border-emerald-100">
                                        <FaQuoteLeft className="absolute top-4 left-4 text-emerald-200 w-8 h-8 opacity-50" />
                                        <div className="pl-8 pt-4">
                                            <Typewriter
                                                text={letter.content}
                                                delay={30}
                                                className="text-emerald-800 leading-relaxed text-lg font-serif"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </ScrollArea>

                            <Separator className="my-6 bg-emerald-100" />

                            <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100">
                                <div className="flex flex-col space-y-2 text-sm text-emerald-700">
                                    {letter.author && (
                                        <p className="flex items-center gap-2">
                                            <FaUser className="w-4 h-4 text-emerald-600" />
                                            <span className="font-semibold">From:</span> {letter.author}
                                        </p>
                                    )}
                                    <p className="flex items-center gap-2">
                                        <FaCalendarAlt className="w-4 h-4 text-emerald-600" />
                                        <span className="font-semibold">Written on:</span> {formattedDate}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
