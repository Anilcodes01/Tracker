// app/component/Tracker.tsx

"use client";

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Calendar from 'react-calendar';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays } from 'lucide-react';
import { badgesData, BadgeInfo } from './badges';
import BadgeGallery from './BadgeGallery';

const STORAGE_KEY = 'nofapLoggedDates';

const getBadgeForStreak = (streak: number): BadgeInfo | null => {
    if (streak < 7) return null;
    const weeksCompleted = Math.floor(streak / 7);
    const badgeIndex = Math.min(weeksCompleted - 1, badgesData.length - 1);
    return badgesData[badgeIndex];
};

const calculateCurrentStreak = (dates: string[]): number => {
    if (dates.length === 0) return 0;
    const loggedDatesSet = new Set(dates);
    const sortedDates = [...dates].sort().reverse();
    const lastLoggedDateStr = sortedDates[0];
    let streak = 0;
    const currentDate = new Date(lastLoggedDateStr);
    while (true) {
        const dateString = currentDate.toISOString().split('T')[0];
        if (loggedDatesSet.has(dateString)) {
            streak++;
            currentDate.setUTCDate(currentDate.getUTCDate() - 1);
        } else {
            break;
        }
    }
    return streak;
};

export default function Tracker() {
  const [loggedDates, setLoggedDates] = useState<string[]>([]);

  useEffect(() => {
    try {
      const savedDates = localStorage.getItem(STORAGE_KEY);
      if (savedDates) setLoggedDates(JSON.parse(savedDates));
    } catch (error) {
      console.error("Failed to load dates from local storage", error);
    }
  }, []);

  useEffect(() => {
    if(loggedDates.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedDates));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [loggedDates]);

  const currentStreak = useMemo(() => calculateCurrentStreak(loggedDates), [loggedDates]);
  
  // ========================================================================
  // THIS IS THE CORRECTED LINE
  // ========================================================================
  const currentBadge = useMemo(() => getBadgeForStreak(currentStreak), [currentStreak]);
  // ========================================================================

  const handleDateClick = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    setLoggedDates(prev => 
      prev.includes(dateString) 
        ? prev.filter(d => d !== dateString) 
        : [...prev, dateString]
    );
  };

  return (
    <div className="w-full flex flex-col items-center gap-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8"
      >
        {/* Left Side: Results & Badge */}
        <div className="w-full max-w-sm bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-2xl flex flex-col items-center border border-gray-700/50">
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-400 uppercase tracking-wider">Current Streak</p>
            <div className="relative h-24 w-24 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.p key={currentStreak} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.3 }} className="text-7xl font-bold text-emerald-400 absolute">
                  {currentStreak}
                </motion.p>
              </AnimatePresence>
            </div>
            <p className="text-lg font-medium text-gray-400">DAYS</p>
          </div>
          <div className="mt-6 w-full min-h-[12rem] flex items-center justify-center border-t border-gray-700/50 pt-6">
            <AnimatePresence>
              {currentBadge ? (
                <motion.div key={currentBadge.name} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }} className="flex flex-col items-center gap-2 text-center">
                  <Image src={currentBadge.imageSrc} alt={currentBadge.name} width={100} height={100} />
                  <h3 className="text-2xl font-bold uppercase tracking-widest text-emerald-400">{currentBadge.name}</h3>
                  <p className="text-sm text-gray-300 italic px-4">{currentBadge.description}</p>
                </motion.div>
              ) : (
                <div className="text-center text-gray-400">
                  <p>Complete your first 7 days to earn a badge!</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Side: Calendar */}
        <div className="w-full max-w-md bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-700/50">
          <div className="flex items-center gap-2 mb-4">
              <CalendarDays className="text-gray-400" size={24}/>
              <h2 className="text-xl font-bold text-white">Log Your Days</h2>
          </div>
          <Calendar
            onClickDay={handleDateClick}
            className="w-full"
            tileClassName={({ date, view }) =>
              view === 'month' && loggedDates.includes(date.toISOString().split('T')[0])
                ? 'logged-day'
                : null
            }
            tileDisabled={({ date, view }) => {
              if (view === 'month') {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return date > today;
              }
              return false;
            }}
          />
        </div>
      </motion.div>

      {/* Badge Gallery Section */}
      <BadgeGallery currentStreak={currentStreak} />
    </div>
  );
}