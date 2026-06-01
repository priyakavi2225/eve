/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, GraduationCap, Play, Trophy, Rocket, BookOpen } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-between p-6 bg-gradient-to-b from-sky-450 via-indigo-600 to-violet-800 text-white overflow-hidden select-none">
      
      {/* Whimsical Floating Background Confections */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <motion.div 
          animate={{ y: [0, -30, 0], rotate: [0, 18, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-12 left-8 text-yellow-300"
        >
          <Sparkles size={48} />
        </motion.div>
        
        <motion.div 
          animate={{ y: [0, 40, 0], rotate: [0, -24, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-1/4 right-12 text-pink-300"
        >
          <Trophy size={40} />
        </motion.div>

        <motion.div 
          animate={{ x: [-20, 20, -20] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/3 left-10 text-emerald-300"
        >
          <BookOpen size={42} />
        </motion.div>

        <motion.div 
          animate={{ y: [0, -50, 0], x: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-16 right-16 text-cyan-200"
        >
          <Rocket size={44} />
        </motion.div>
      </div>

      {/* Main Top Slogan / Logo */}
      <div className="w-full max-w-md text-center mt-8 z-10">
        <motion.div 
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="flex justify-center mb-2"
        >
          <div className="relative p-5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-3xl shadow-xl border-4 border-white inline-flex items-center justify-center">
            <GraduationCap size={56} className="text-white drop-shadow" />
            <div className="absolute -top-3 -right-3 bg-pink-500 text-xs px-2 py-1 rounded-full border border-white font-bold tracking-widest animate-pulse shadow-md">
              AI-POWERED
            </div>
          </div>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-350 to-orange-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]"
          style={{ fontFamily: '"Space Grotesk", sans-serif' }}
        >
          STITCH AI
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-yellow-250 font-bold tracking-wider text-sm uppercase mt-1"
        >
          Topper Roadmap & Gamified Study Assistant
        </motion.p>
      </div>

      {/* Meet Stitch - Whimsical Mascot Illustration */}
      <div className="flex flex-col items-center justify-center z-10 my-6">
        <motion.div
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative"
        >
          {/* Wise Fluffy Mascot Circle */}
          <div className="w-48 h-48 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-800 border-4 border-indigo-200 shadow-2xl flex items-center justify-center overflow-hidden relative">
            
            {/* Visual inner glow bubbles */}
            <div className="absolute -top-10 -left-10 w-28 h-28 bg-white/10 rounded-full blur-xl" />
            
            {/* Cute Cartoon Owl / Wizard CSS Mascot */}
            <div className="relative flex flex-col items-center">
              {/* Ears / Cap */}
              <div className="absolute -top-8 w-12 h-12 bg-indigo-300 rounded-lg rotate-45 transform border border-indigo-100" />
              {/* Base body */}
              <div className="w-28 h-28 bg-indigo-400 rounded-4xl border-2 border-white flex flex-col items-center justify-center z-10 shadow-lg p-2 relative">
                {/* Cheerful wide smart eyes */}
                <div className="flex space-x-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center relative">
                    <div className="w-3.5 h-3.5 rounded-full bg-slate-905 absolute top-1.5 right-1.5 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-white absolute top-0.5 right-0.5" />
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center relative">
                    <div className="w-3.5 h-3.5 rounded-full bg-slate-905 absolute top-1.5 left-1.5 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-white absolute top-0.5 left-0.5" />
                    </div>
                  </div>
                </div>
                {/* Yellow smiling Beak */}
                <div className="w-5 h-4 bg-amber-450 rounded-b-full border border-amber-550 -mt-1 shadow-sm" />
                {/* Wise Golden Sparkly spectacles link */}
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-14 h-4 border-t-2 border-dashed border-amber-300 z-20 pointer-events-none" />
              </div>
            </div>

            {/* Glowing magic wand */}
            <motion.div 
              animate={{ rotate: [-15, 25, -15] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-5 right-5 origin-bottom-left text-yellow-300 drop-shadow"
            >
              <Sparkles size={32} />
            </motion.div>
          </div>
        </motion.div>

        {/* Motivational Dialogue Bubble */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 bg-white text-slate-800 px-6 py-3.5 rounded-2xl shadow-xl font-medium text-center relative max-w-sm border-2 border-indigo-150"
        >
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-t-2 border-l-2 border-indigo-150 rotate-45" />
          <span className="text-indigo-650 font-bold block text-xs tracking-wider uppercase mb-0.5">Stitch says:</span>
          <span className="text-base text-slate-700">"Learn, Play, Grow, and Achieve!"</span>
        </motion.div>
      </div>

      {/* Button and footer action */}
      <div className="w-full max-w-xs flex flex-col items-center mb-8 z-10">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className="w-full py-4.5 px-6 rounded-2xl font-black text-lg tracking-wider text-indigo-900 bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-405 hover:brightness-110 active:brightness-95 transition shadow-[0_8px_0_rgba(180,83,9,1)] border-b-2 border-white flex items-center justify-center space-x-3 cursor-pointer"
        >
          <Play size={24} fill="currentColor" />
          <span>START THE ADVENTURE</span>
        </motion.button>
        
        <p className="text-indigo-200 text-xs text-center mt-5 tracking-wide">
          Unlock your brain's hidden level blocks today. Free & fully offline supported.
        </p>
      </div>
    </div>
  );
}
