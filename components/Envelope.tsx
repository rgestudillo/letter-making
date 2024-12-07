'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaHeart } from 'react-icons/fa';

interface EnvelopeProps {
    onOpen: () => void;
    title: string;
}

export function Envelope({ onOpen, title }: EnvelopeProps) {
    const [isOpening, setIsOpening] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const handleOpen = () => {
        setIsOpening(true);
        setTimeout(() => {
            onOpen();
        }, 1000);
    };

    return (
        <motion.div
            className="relative w-96 h-64 cursor-pointer perspective-1000"
            whileHover={{ scale: 1.05 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            onClick={handleOpen}
        >
            {/* Envelope flap (top) */}
            <motion.div
                className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-emerald-100 to-emerald-200 z-20 origin-bottom"
                style={{
                    clipPath: 'polygon(0 0, 50% 50%, 100% 0)',
                    transformOrigin: 'top',
                }}
                animate={isOpening ? { rotateX: 180 } : { rotateX: isHovered ? 30 : 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Inner pattern */}
                <div className="absolute inset-0 opacity-20">
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-full h-px bg-emerald-800"
                            style={{ top: `${i * 20}%` }}
                        />
                    ))}
                </div>
            </motion.div>

            {/* Envelope body */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg shadow-lg border-2 border-emerald-200/80 overflow-hidden"
                animate={isOpening ? { rotateX: 180, opacity: 0 } : {}}
                transition={{ duration: 1 }}
            >
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-full h-px bg-emerald-900"
                            style={{ top: `${i * 5}%` }}
                        />
                    ))}
                </div>

                {/* Content */}
                <div className="absolute inset-0 flex items-center justify-center flex-col gap-4">
                    <motion.div
                        animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
                        transition={{ duration: 0.2 }}
                        className="bg-emerald-50/50 p-4 rounded-full"
                    >
                        <FaEnvelope className="w-12 h-12 text-emerald-700" />
                    </motion.div>

                    <h2 className="text-xl font-semibold text-emerald-800 text-center px-4 drop-shadow-sm">{title}</h2>

                    <motion.button
                        className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-full group relative overflow-hidden shadow-md hover:shadow-lg"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            Open Me
                            <motion.span
                                animate={{ rotate: isHovered ? 360 : 0 }}
                                transition={{ duration: 0.5 }}
                                className="text-emerald-100"
                            >
                                <FaHeart className="w-4 h-4" />
                            </motion.span>
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-emerald-700 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                    </motion.button>
                </div>

                {/* Side shadows */}
                <div className="absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-emerald-200/20 to-transparent" />
                <div className="absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-emerald-200/20 to-transparent" />
            </motion.div>

            {/* Bottom shadows */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[90%] h-4 bg-emerald-900/10 blur-md rounded-full" />
        </motion.div>
    );
}