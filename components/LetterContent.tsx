/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Envelope } from './Envelope';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FaEnvelope, FaCalendarAlt, FaUser, FaQuoteLeft, FaImage, FaTimes } from 'react-icons/fa';
import { Typewriter } from './Typewriter';
import { Letter } from '@/lib/models/Letter';
import Image from 'next/image';

export function LetterContent({ letter, formattedDate }: { letter: Letter, formattedDate: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [isTypingComplete, setIsTypingComplete] = useState(false);

    const handleTypingComplete = () => {
        setIsTypingComplete(true);
        if (letter.image) {
            setShowImageModal(true);
        }
    };

    const ImageModal = () => (
        <AnimatePresence>
            {showImageModal && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 1, duration: 0.5 }}
                    className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
                    onClick={() => setShowImageModal(false)}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.9, y: 20, opacity: 0 }}
                        transition={{
                            delay: 1.2,
                            duration: 0.5,
                            type: "spring",
                            bounce: 0.3
                        }}
                        className="relative max-w-4xl max-h-[90vh] bg-white rounded-lg p-2"
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setShowImageModal(false)}
                            className="absolute -top-4 -right-4 bg-emerald-500 text-white p-2 rounded-full hover:bg-emerald-600 transition-colors"
                        >
                            <FaTimes />
                        </button>
                        {letter.image && (
                            <img
                                src={letter.image}
                                alt="Letter attachment"
                                className="max-h-[85vh] object-contain rounded-lg"
                            />
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    return (
        <>
            <ImageModal />

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
                            <AnimatePresence>
                                {isTypingComplete && letter.image && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5 }}
                                        className="relative w-full aspect-video cursor-pointer overflow-hidden rounded-xl shadow-lg mb-4"
                                        onClick={() => setShowImageModal(true)}
                                    >
                                        <Image
                                            src={letter.image}
                                            alt="Letter attachment"
                                            layout="fill"
                                            objectFit="cover"
                                            className="hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <FaImage className="w-8 h-8 text-white" />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <ScrollArea className="h-[60vh] pr-4">
                                <div className="space-y-4">
                                    <div className="relative bg-gradient-to-br from-emerald-50 to-green-50 p-8 rounded-xl shadow-inner border border-emerald-100">
                                        <FaQuoteLeft className="absolute top-4 left-4 text-emerald-200 w-8 h-8 opacity-50" />
                                        <div className="pl-8 pt-4">
                                            <Typewriter
                                                text={letter.content}
                                                delay={30}
                                                className="text-emerald-800 leading-relaxed text-lg font-serif"
                                                onComplete={handleTypingComplete}
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
        </>
    );
}