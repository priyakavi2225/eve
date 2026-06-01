/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, Check, Star, Trophy, Rocket, BookOpen, AlertCircle, Play, 
  HelpCircle, Swords, Award, Dumbbell, Sparkles
} from 'lucide-react';
import { LearningNode, StudentProfile, NodeType } from '../types';
import { LEARNING_LEVELS } from '../data';

interface RoadmapProps {
  profile: StudentProfile;
  onSelectNode: (node: LearningNode) => void;
}

export default function Roadmap({ profile, onSelectNode }: RoadmapProps) {
  const [selectedNode, setSelectedNode] = useState<LearningNode | null>(null);
  const [lockedWarning, setLockedWarning] = useState<string | null>(null);

  // Derive dynamic level status from student profile completed list
  const getAugmentedLevels = (): LearningNode[] => {
    return LEARNING_LEVELS.map((node) => {
      const isCompleted = profile.completedLevels.includes(node.id);
      
      // Level 1 is always unlocked. Other levels are unlocked if the previous level is completed.
      let isUnlocked = node.levelNum === 1;
      if (node.levelNum > 1) {
        const prevLvlId = `lvl_${node.levelNum - 1}`;
        isUnlocked = profile.completedLevels.includes(prevLvlId);
      }

      return {
        ...node,
        status: isCompleted ? 'completed' : isUnlocked ? 'unlocked' : 'locked',
      };
    });
  };

  const augmentedLevels = getAugmentedLevels();

  const handleNodeClick = (node: LearningNode) => {
    if (node.status === 'locked') {
      setLockedWarning(`Oops! "${node.title}" is locked. Complete Level ${node.levelNum - 1} first to unlock this mountain trail step!`);
      setTimeout(() => setLockedWarning(null), 3500);
      return;
    }
    setSelectedNode(node);
  };

  const getNodeIcon = (type: NodeType, size: number = 18) => {
    switch (type) {
      case 'lesson': return <BookOpen size={size} />;
      case 'practice': return <Dumbbell size={size} />;
      case 'quiz': return <HelpCircle size={size} />;
      case 'challenge': return <Swords size={size} />;
      case 'boss': return <Trophy size={size} />;
    }
  };

  const getNodeColor = (type: NodeType, status: 'completed' | 'unlocked' | 'locked') => {
    if (status === 'locked') return 'bg-slate-300 border-slate-400 text-slate-500 shadow-none';
    if (status === 'completed') return 'bg-gradient-to-r from-amber-400 to-yellow-500 border-amber-300 text-white shadow-[0_5px_0_#D97706]';
    
    // Unlocked colors based on node type
    switch (type) {
      case 'lesson': return 'bg-gradient-to-r from-sky-400 to-sky-500 border-sky-305 text-white shadow-[0_5px_0_#0284C7]';
      case 'practice': return 'bg-gradient-to-r from-emerald-400 to-emerald-500 border-emerald-305 text-white shadow-[0_5px_0_#059669]';
      case 'quiz': return 'bg-gradient-to-r from-pink-400 to-pink-500 border-pink-305 text-white shadow-[0_5px_0_#DB2777]';
      case 'challenge': return 'bg-gradient-to-r from-purple-400 to-purple-500 border-purple-305 text-white shadow-[0_5px_0_#7C3AED]';
      case 'boss': return 'bg-gradient-to-r from-rose-500 to-red-600 border-red-400 text-white shadow-[0_5px_0_#991B1B]';
    }
  };

  const activeLevelNum = augmentedLevels.find(l => l.status === 'unlocked')?.levelNum || 10;

  return (
    <div className="relative w-full max-w-xl mx-auto h-[750px] bg-gradient-to-b from-sky-200 via-emerald-100 to-amber-200 rounded-3xl p-4 overflow-hidden border-4 border-white shadow-2xl select-none">
      
      {/* 1. Whimsical Sky decorations & peaks */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-sky-400/30 to-transparent pointer-events-none">
        {/* Cartoon Sun */}
        <div className="absolute top-6 left-6 w-16 h-16 bg-yellow-300 rounded-full blur-sm border-2 border-yellow-200 opacity-85" />
        {/* Clouds */}
        <div className="absolute top-12 right-12 w-20 h-6 bg-white/70 rounded-full" />
        <div className="absolute top-16 right-16 w-14 h-5 bg-white/60 rounded-full" />
      </div>

      {/* 2. visual mountain range background vector drawn with SVGs */}
      <svg className="absolute inset-x-0 bottom-0 w-full h-[600px] z-0 pointer-events-none opacity-40" viewBox="0 0 500 650" preserveAspectRatio="none">
        {/* Mountain Base Peaks */}
        <polygon points="50,650 250,150 450,650" fill="#059669" opacity="0.3" />
        <polygon points="-50,650 150,220 350,650" fill="#10B981" opacity="0.4" />
        <polygon points="150,650 350,250 550,650" fill="#047857" opacity="0.3" />

        {/* Winding Road Path connecting lines */}
        <path
          d="M 120,572 Q 220,540 210,540 T 125,481 Q 110,410 110,410 T 310,416 Q 340,344 340,344 T 175,286 Q 275,227 275,227 T 410,234 T 260,130"
          fill="none"
          stroke="#FCD34D"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray="4,8"
          opacity="0.8"
        />
        <path
          d="M 120,572 Q 220,540 210,540 T 125,481 Q 110,410 110,410 T 310,416 Q 340,344 340,344 T 175,286 Q 275,227 275,227 T 410,234 T 260,130"
          fill="none"
          stroke="#D97706"
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.9"
        />
      </svg>

      {/* Winding mountain landmarks exactly matches our image themes! */}
      <div className="absolute inset-0 z-1 pointer-events-none p-4">
        {/* Level 1 sign */}
        <div className="absolute bottom-[10%] left-[30%] bg-amber-100 text-amber-800 text-3xs font-extrabold px-2 py-0.5 rounded border border-amber-300 uppercase shadow">
          🚩 START: WORK HARD
        </div>
        {/* Goal arrow sign */}
        <div className="absolute top-[60%] left-[8%] bg-amber-800 text-white text-3xs font-extrabold p-1 rounded-sm border border-amber-950 uppercase -rotate-6 shadow">
          Set Your Goals 🎯
        </div>
        {/* Time Management Sign */}
        <div className="absolute top-[48%] right-[8%] bg-indigo-100 text-indigo-805 text-3xs font-extrabold p-1 rounded-sm border border-indigo-300 uppercase rotate-6 shadow">
          ⏰ Stay Focused
        </div>
        {/* Top Trophy sign */}
        <div className="absolute top-[10%] left-[33%] bg-emerald-700 text-white text-2xs font-extrabold p-1.5 rounded-xl border border-white uppercase flex items-center space-x-1 shadow-md bounce">
          <Trophy size={12} fill="currentColor" />
          <span>TOPPER SUCCESS PEAK 👑</span>
        </div>
      </div>

      {/* 3. Level node points placed precisely */}
      <div className="absolute inset-0 z-10 w-full h-full">
        {augmentedLevels.map((lvl) => {
          const isActive = lvl.levelNum === activeLevelNum;

          return (
            <div
              key={lvl.id}
              className="absolute group"
              style={{
                left: `${lvl.x}%`,
                bottom: `${lvl.y}%`,
                transform: 'translate(-50%, 50%)',
              }}
            >
              {/* If active node, render standard beacon ping */}
              {isActive && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="absolute w-12 h-12 bg-sky-400 rounded-full animate-ping opacity-60" />
                  <div className="absolute w-16 h-16 bg-yellow-400 rounded-full animate-pulse opacity-20" />
                </div>
              )}

              {/* Node Button Wrapper */}
              <motion.button
                whileHover={{ scale: 1.15, rotate: lvl.status === 'locked' ? [-4, 4, -4] : 0 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleNodeClick(lvl)}
                className={`w-14 h-14 rounded-full border-4 border-white flex flex-col items-center justify-center relative shadow-xl transition-all cursor-pointer ${getNodeColor(
                  lvl.type,
                  lvl.status
                )}`}
              >
                {/* Node Level Number Label */}
                <span className="absolute -top-3.5 bg-indigo-900 border border-white text-white font-black rounded-full w-5 h-5 flex items-center justify-center text-3xs shadow-sm">
                  {lvl.levelNum}
                </span>

                {/* Main center icon */}
                {lvl.status === 'locked' ? (
                  <Lock size={15} className="text-slate-400" />
                ) : lvl.status === 'completed' ? (
                  <div className="flex flex-col items-center">
                    <Check size={16} strokeWidth={4} />
                    <div className="flex space-x-0.5 -mt-0.5">
                      <Star size={7} fill="currentColor" className="text-yellow-200" />
                      <Star size={8} fill="currentColor" className="text-yellow-100" />
                      <Star size={7} fill="currentColor" className="text-yellow-200" />
                    </div>
                  </div>
                ) : (
                  getNodeIcon(lvl.type, 18)
                )}

                {/* Active climbing character character beacon (the rocket!) */}
                {isActive && (
                  <motion.div
                    animate={{ y: [-5, 5, -5] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute -bottom-8 bg-sky-600 text-white font-black text-3xs py-0.5 px-1.5 rounded-md border border-white uppercase flex items-center space-x-0.5 shadow-md z-30"
                  >
                    <Rocket size={8} fill="currentColor" />
                    <span>YOU</span>
                  </motion.div>
                )}
              </motion.button>

              {/* Tiny Hover/Tapped Tooltip detailing focus title */}
              <div className="absolute -top-11 left-1/2 -translate-x-1/2 bg-slate-900/90 text-white text-3xs font-extrabold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-shadow z-20">
                {lvl.title} ({lvl.type.toUpperCase()})
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Warnings */}
      <AnimatePresence>
        {lockedWarning && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="absolute bottom-6 inset-x-4 bg-slate-900/95 text-white py-3.5 px-4 rounded-2xl text-xs font-semibold flex items-center space-x-2.5 shadow-2xl border border-red-500 z-50 text-center justify-center"
          >
            <AlertCircle className="text-red-400 flex-shrink-0" size={18} />
            <span>{lockedWarning}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Node Description Level Modal Overlay is active on selection */}
      <AnimatePresence>
        {selectedNode && (
          <div className="absolute inset-0 bg-slate-950/40 z-40 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-sm p-5 border-4 border-sky-300 shadow-2xl text-slate-800 pointer-events-auto"
            >
              {/* Modal Banner Theme color matches type */}
              <div className="flex items-start justify-between">
                <span className="bg-sky-100 text-sky-800 text-3xs font-black tracking-widest px-2.5 py-1 rounded-full uppercase flex items-center space-x-1">
                  {getNodeIcon(selectedNode.type, 11)}
                  <span>Level {selectedNode.levelNum} : {selectedNode.type}</span>
                </span>
                <span className="text-xs font-bold text-indigo-650 flex items-center space-x-1 bg-yellow-50 px-2 py-0.5 rounded-lg border border-yellow-250">
                  <Sparkles size={11} className="text-amber-500" />
                  <span>+{selectedNode.xpReward} XP</span>
                </span>
              </div>

              <h3 className="text-2xl font-black text-slate-900 mt-2.5" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
                {selectedNode.title}
              </h3>
              <p className="text-slate-650 text-xs leading-relaxed mt-2.5">
                {selectedNode.description}
              </p>

              {/* Rewards Box */}
              <div className="mt-4 bg-slate-50 border border-slate-100 rounded-2xl p-3 flex space-x-3 text-center justify-center">
                <div className="bg-white px-3 py-1.5 rounded-xl border border-slate-150 flex flex-col items-center min-w-16">
                  <span className="text-sm font-black text-amber-550">+{selectedNode.coinsReward}</span>
                  <span className="text-4xs text-gray-400 font-bold tracking-widest uppercase">Coins 🟡</span>
                </div>
                <div className="bg-white px-3 py-1.5 rounded-xl border border-slate-150 flex flex-col items-center min-w-16">
                  <span className="text-sm font-black text-violet-650">+{selectedNode.gemsReward}</span>
                  <span className="text-4xs text-gray-400 font-bold tracking-widest uppercase">Gems 💎</span>
                </div>
                <div className="bg-white px-3 py-1.5 rounded-xl border border-slate-150 flex flex-col items-center min-w-16">
                  <span className="text-sm font-black text-sky-655">~{selectedNode.durationMinutes}m</span>
                  <span className="text-4xs text-gray-400 font-bold tracking-widest uppercase">Pacing ⌛</span>
                </div>
              </div>

              {/* Tips Section */}
              {selectedNode.tips && selectedNode.tips.length > 0 && (
                <div className="mt-4.5 bg-yellow-50/50 border border-yellow-150 rounded-2xl p-3">
                  <div className="text-2xs font-extrabold text-amber-800 uppercase tracking-wide flex items-center mb-1">
                    <Award size={12} className="mr-1 inline" />
                    Stitch Study Tip:
                  </div>
                  <ul className="list-disc pl-3.5 space-y-1 text-2xs font-medium text-slate-700 leading-normal">
                    {selectedNode.tips.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 mt-5">
                <button
                  type="button"
                  onClick={() => setSelectedNode(null)}
                  className="py-3 rounded-2xl border-2 border-slate-200 text-slate-500 font-bold text-xs hover:bg-slate-50 transition"
                >
                  Close Roadmap
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedNode(null);
                    onSelectNode(selectedNode);
                  }}
                  className="py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 hover:brightness-105 active:scale-98 border-b-2 border-yellow-600 text-indigo-900 font-black text-xs tracking-wider transition flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Play size={10} fill="currentColor" />
                  <span>START TASK NOW</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
