/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Envelope } from './Envelope';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FaEnvelope, FaCalendarAlt, FaUser, FaQuoteLeft, FaImage, FaTimes, FaReply } from 'react-icons/fa';
import { Typewriter } from './Typewriter';
import { Letter } from '@/lib/models/Letter';
import Image from 'next/image';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export function LetterContent({ letter, formattedDate }: { letter: Letter, formattedDate: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [isTypingComplete, setIsTypingComplete] = useState(false);
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [replyTitle, setReplyTitle] = useState(`Re: ${letter.title}`);
    const [user, setUser] = useState<User | null>(null);
    const [replies, setReplies] = useState<Letter[]>([]);
    const [isLoadingReplies, setIsLoadingReplies] = useState(false);
    const [isSubmittingReply, setIsSubmittingReply] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (isOpen && letter.id) {
            fetchReplies();
        }
    }, [isOpen, letter.id]);

    const fetchReplies = async () => {
        if (!letter.id) return;

        setIsLoadingReplies(true);
        try {
            const response = await fetch(`/api/replies?letterId=${letter.id}`);
            const data = await response.json();
            if (data.replies) {
                setReplies(data.replies);
            }
        } catch (error) {
            console.error('Error fetching replies:', error);
        } finally {
            setIsLoadingReplies(false);
        }
    };

    const handleTypingComplete = () => {
        setIsTypingComplete(true);
        if (letter.image) {
            setShowImageModal(true);
        }
    };

    const handleReplySubmit = async () => {
        if (!replyContent.trim()) {
            alert('Reply content is required.');
            return;
        }

        setIsSubmittingReply(true);
        try {
            const replyData = {
                title: replyTitle,
                content: replyContent,
                author: user?.displayName || undefined,
                createdBy: user?.uid || 'Guest',
                recipient_email: letter.author ? undefined : letter.recipient_email,
                parentId: letter.id
            };

            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(replyData),
            });

            const data = await response.json();
            if (data.id) {
                setShowReplyForm(false);
                setReplyContent('');
                fetchReplies();
            } else {
                throw new Error('Failed to submit reply');
            }
        } catch (error) {
            console.error('Error submitting reply:', error);
            alert('Failed to submit reply. Please try again.');
        } finally {
            setIsSubmittingReply(false);
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
                    className="w-full max-w-3xl"
                >
                    <Card className="w-full shadow-2xl border-2 border-emerald-100 transform hover:scale-[1.02] transition-all duration-500">
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

                        <CardFooter className="bg-gradient-to-r from-emerald-50 to-green-50 p-4 border-t-2 border-emerald-100 flex justify-between items-center">
                            <Button
                                onClick={() => setShowReplyForm(!showReplyForm)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2"
                            >
                                <FaReply />
                                {showReplyForm ? 'Cancel Reply' : 'Reply'}
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* Reply Form */}
                    <AnimatePresence>
                        {showReplyForm && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="mt-4"
                            >
                                <Card className="border-2 border-emerald-100 shadow-lg">
                                    <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 border-b border-emerald-100">
                                        <CardTitle className="text-xl font-bold text-emerald-800">Write Your Reply</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6 space-y-4">
                                        <div>
                                            <Label htmlFor="replyTitle" className="text-emerald-700 font-medium">Title</Label>
                                            <Input
                                                id="replyTitle"
                                                value={replyTitle}
                                                onChange={(e) => setReplyTitle(e.target.value)}
                                                className="border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="replyContent" className="text-emerald-700 font-medium">Your Reply</Label>
                                            <Textarea
                                                id="replyContent"
                                                value={replyContent}
                                                onChange={(e) => setReplyContent(e.target.value)}
                                                className="min-h-[150px] border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400"
                                                placeholder="Write your reply here..."
                                                required
                                            />
                                        </div>
                                        <Button
                                            onClick={handleReplySubmit}
                                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                                            disabled={isSubmittingReply}
                                        >
                                            {isSubmittingReply ? 'Sending...' : 'Send Reply'}
                                        </Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Replies Section */}
                    {replies.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="mt-6"
                        >
                            <h3 className="text-xl font-bold text-emerald-800 mb-4">Replies</h3>
                            <div className="space-y-4">
                                {replies.map((reply) => (
                                    <Card key={reply.id} className="border-2 border-emerald-100 shadow-md">
                                        <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 border-b border-emerald-100 py-3">
                                            <CardTitle className="text-lg font-bold text-emerald-800">{reply.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-4">
                                            <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-4 rounded-lg shadow-inner border border-emerald-100">
                                                <p className="text-emerald-800 leading-relaxed font-serif">{reply.content}</p>
                                            </div>
                                            <div className="mt-3 text-sm text-emerald-700">
                                                {reply.author && (
                                                    <p className="flex items-center gap-1">
                                                        <FaUser className="w-3 h-3 text-emerald-600" />
                                                        <span className="font-semibold">From:</span> {reply.author}
                                                    </p>
                                                )}
                                                <p className="flex items-center gap-1">
                                                    <FaCalendarAlt className="w-3 h-3 text-emerald-600" />
                                                    <span className="font-semibold">On:</span> {new Date(reply.timestamp).toLocaleString()}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {isLoadingReplies && (
                        <div className="mt-4 text-center text-emerald-600">
                            Loading replies...
                        </div>
                    )}
                </motion.div>
            )}
        </>
    );
}