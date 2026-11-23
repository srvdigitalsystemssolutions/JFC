'use client';

import React, { useState, useEffect } from 'react';

interface TypewriterEffectProps {
  words?: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseTime?: number;
  className?: string;
}

export default function TypewriterEffect({
  words = [
    'Freshly Cooked Every Day',
    'Perfect for Family Meals',
    'Authentic Dum Pukht Flavors',
    'Fast Delivery & Royal Feasts',
    'Slow Simmered Heritage Spices',
  ],
  typingSpeed = 80,
  deletingSpeed = 40,
  pauseTime = 1800,
  className = '',
}: TypewriterEffectProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fullWord = words[currentWordIndex % words.length];

    let timer: NodeJS.Timeout;

    if (!isDeleting) {
      // Typing phase
      if (currentText.length < fullWord.length) {
        timer = setTimeout(() => {
          setCurrentText(fullWord.slice(0, currentText.length + 1));
        }, typingSpeed);
      } else {
        // Word complete -> pause before deleting
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, pauseTime);
      }
    } else {
      // Deleting phase
      if (currentText.length > 0) {
        timer = setTimeout(() => {
          setCurrentText(fullWord.slice(0, currentText.length - 1));
        }, deletingSpeed);
      } else {
        // Finished deleting -> move to next word
        setIsDeleting(false);
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
      }
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIndex, words, typingSpeed, deletingSpeed, pauseTime]);

  return (
    <span className={`inline-flex items-center ${className}`}>
      <span>{currentText || '\u00A0'}</span>
      <span
        aria-hidden="true"
        className="inline-block w-[3px] h-[0.85em] bg-[#f2be54] ml-1.5 align-middle animate-pulse shadow-[0_0_8px_#f2be54]"
      />
    </span>
  );
}
