// app/component/BadgeItem.tsx

"use client";

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock } from 'lucide-react';
import { useState } from 'react';
import { BadgeInfo } from './badges';

interface BadgeItemProps {
  badge: BadgeInfo;
  isUnlocked: boolean;
  unlocksAt: number;
  progress: number; // New prop for progress (0 to 1)
}

export default function BadgeItem({ badge, isUnlocked, unlocksAt, progress }: BadgeItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-gray-900 rounded-lg shadow-xl z-10 border border-gray-700"
          >
            <h4 className={`font-bold text-sm ${isUnlocked ? 'text-emerald-400' : 'text-gray-400'}`}>{badge.name}</h4>
            <p className="text-xs text-gray-300 italic mt-1">{badge.description}</p>
            {!isUnlocked && (
              <p className="text-xs text-amber-400 mt-2">Unlocks at Day {unlocksAt}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Badge Visual */}
      <div className={`relative aspect-square p-2 rounded-xl overflow-hidden transition-all duration-300 ${isUnlocked ? 'bg-gray-700/50' : 'bg-gray-800/60'}`}>
        <div className="relative w-full h-full flex items-center justify-center">
          <Image
            src={badge.imageSrc}
            alt={badge.name}
            layout="fill"
            objectFit="contain"
            className={`transition-all duration-300 ${isUnlocked ? 'opacity-100' : 'opacity-40 filter grayscale blur-[2px]'}`}
          />
          {!isUnlocked && (
            <Lock className="absolute text-white/50 w-1/3 h-1/3" />
          )}
        </div>

        {/* NEW: Progress Bar */}
        {!isUnlocked && progress > 0 && (
          <div className="absolute bottom-2 left-2 right-2">
            <div className="h-1.5 w-full bg-gray-900/70 rounded-full">
              <motion.div
                className="h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.7)]"
                initial={{ width: 0 }}
                animate={{ width: `${progress * 100}%` }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}