'use client';

import React, { useState, useEffect } from 'react';

interface TypewriterProps {
    text: string;
    delay?: number;
}

export function Typewriter({ text, delay = 50 }: TypewriterProps) {
    const [currentText, setCurrentText] = useState<string[]>([]); // Store each part of the text
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (currentIndex < text.length) {
            const timeout = setTimeout(() => {
                const char = text[currentIndex];
                setCurrentText((prevText) => [...prevText, char]); // Append the character
                setCurrentIndex((prevIndex) => prevIndex + 1);
            }, delay);

            return () => clearTimeout(timeout);
        }
    }, [currentIndex, delay, text]);

    return (
        <span>
            {currentText.map((char, index) =>
                char === '\n' ? <br key={index} /> : <span key={index}>{char}</span>
            )}
        </span>
    );
}
