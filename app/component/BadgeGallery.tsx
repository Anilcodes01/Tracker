// app/component/BadgeGallery.tsx

"use client";

import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { badgesData } from './badges';
import BadgeItem from './BadgeItem';

interface BadgeGalleryProps {
  currentStreak: number;
}

export default function BadgeGallery({ currentStreak }: BadgeGalleryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full max-w-5xl bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-700/50"
    >
      <div className="flex items-center gap-3 mb-4">
        <Trophy className="text-amber-400" size={28} />
        <h2 className="text-2xl font-bold text-white">Badge Collection</h2>
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-8 gap-4">
        {badgesData.map((badge, index) => {
          const unlocksAtDay = (index + 1) * 7;
          const isUnlocked = currentStreak >= unlocksAtDay;
          
          // --- NEW PROGRESS CALCULATION LOGIC ---
          const previousUnlockDay = index * 7;
          let progress = 0;

          // Only calculate progress for the current, not-yet-unlocked badge
          if (!isUnlocked && currentStreak > previousUnlockDay) {
            // This is the number of days of progress into the current 7-day week
            const daysIntoWeek = currentStreak - previousUnlockDay;
            progress = daysIntoWeek / 7;
          }
          // --- END OF NEW LOGIC ---

          return (
            <BadgeItem
              key={badge.name}
              badge={badge}
              isUnlocked={isUnlocked}
              unlocksAt={unlocksAtDay}
              progress={progress} // Pass the calculated progress down
            />
          );
        })}
      </div>
    </motion.div>
  );
}