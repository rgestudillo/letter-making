'use client';

import React, { useState, useEffect } from 'react';

interface TypewriterProps {
    text: string;
    delay?: number;
    className?: string;
    onComplete?: () => void;
}

export function Typewriter({ text, delay = 50, className = '', onComplete }: TypewriterProps) {
    const [currentText, setCurrentText] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTypingComplete, setIsTypingComplete] = useState(false);

    useEffect(() => {
        if (currentIndex < text.length) {
            const timeout = setTimeout(() => {
                const char = text[currentIndex];
                setCurrentText((prevText) => [...prevText, char]);
                setCurrentIndex((prevIndex) => prevIndex + 1);
            }, delay);

            return () => clearTimeout(timeout);
        } else if (!isTypingComplete) {
            setIsTypingComplete(true);
            if (onComplete) {
                onComplete();
            }
        }
    }, [currentIndex, delay, text, isTypingComplete, onComplete]);

    return (
        <span className={className}>
            {currentText.map((char, index) =>
                char === '\n' ? (
                    <br key={index} />
                ) : (
                    <span
                        key={index}
                        className="transition-opacity duration-200"
                    >
                        {char}
                    </span>
                )
            )}
            <span
                className={`inline-block w-0.5 h-5 ml-0.5 -mb-0.5 bg-emerald-600 ${isTypingComplete ? 'animate-pulse' : 'animate-blink'
                    }`}
            />
        </span>
    );
}
