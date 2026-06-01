/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Timer, CheckCircle2, XCircle, Award, Sparkles, BookOpen, 
  ChevronRight, ArrowRight, Star, HelpCircle, RefreshCw
} from 'lucide-react';
import { QuizQuestion, LearningNode } from '../types';
import { ALL_QUESTIONS } from '../data';

interface QuizViewProps {
  node: LearningNode;
  onFinishQuiz: (scorePercent: number, coinsEarned: number, gemsEarned: number, xpEarned: number) => void;
  onCancel: () => void;
}

export default function QuizView({ node, onFinishQuiz, onCancel }: QuizViewProps) {
  const quizSet = ALL_QUESTIONS[node.id] || ALL_QUESTIONS['lvl_1'];
  
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [trueFalseVal, setTrueFalseVal] = useState<boolean | null>(null);
  
  // Matching Game local state
  const [matchSelections, setMatchSelections] = useState<{ [left: string]: string }>({});
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);

  // Puzzle Game local state
  const [puzzleArray, setPuzzleArray] = useState<string[]>([]);

  const [committed, setCommitted] = useState(false);
  const [answeredCorrectly, setAnsweredCorrectly] = useState(false);
  const [scoreCount, setScoreCount] = useState(0);
  
  // Timer State
  const [timeLeft, setTimeLeft] = useState(60);
  const [isQuizComplete, setIsQuizComplete] = useState(false);

  const activeQuestion = quizSet[currentIdx];

  // Initialize Quiz Helpers
  useEffect(() => {
    // Reset inputs for active index
    setSelectedOpt(null);
    setTrueFalseVal(null);
    setMatchSelections({});
    setSelectedLeft(null);
    setCommitted(false);
    setTimeLeft(60);

    // Initialize puzzle shuffled array
    if (activeQuestion && activeQuestion.type === 'puzzle' && activeQuestion.puzzlePieces) {
      // shuffle them randomly
      setPuzzleArray([...activeQuestion.puzzlePieces].sort(() => Math.random() - 0.5));
    }
  }, [currentIdx, activeQuestion]);

  // Handle countdown ticks
  useEffect(() => {
    if (isQuizComplete || committed) return;
    if (timeLeft <= 0) {
      handleEvaluateAnswer(true); // force fail on timeout
      return;
    }

    const t = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(t);
  }, [timeLeft, committed, isQuizComplete]);

  // Match item click helper
  const handleMatchLeftClick = (left: string) => {
    if (committed) return;
    setSelectedLeft(left);
  };

  const handleMatchRightClick = (right: string) => {
    if (committed || !selectedLeft) return;
    setMatchSelections(prev => ({
      ...prev,
      [selectedLeft]: right
    }));
    setSelectedLeft(null); // clear
  };

  // Puzzle order movers
  const movePuzzleItem = (index: number, direction: 'up' | 'down') => {
    if (committed) return;
    const siblingIndex = direction === 'up' ? index - 1 : index + 1;
    if (siblingIndex < 0 || siblingIndex >= puzzleArray.length) return;

    const copy = [...puzzleArray];
    const temp = copy[index];
    copy[index] = copy[siblingIndex];
    copy[siblingIndex] = temp;
    setPuzzleArray(copy);
  };

  // Evaluate final inputs
  const handleEvaluateAnswer = (timeout: boolean = false) => {
    if (committed) return;
    setCommitted(true);

    let correct = false;

    if (timeout) {
      correct = false;
    } else if (activeQuestion.type === 'mcq') {
      correct = selectedOpt === activeQuestion.correctAnswer;
    } else if (activeQuestion.type === 'true_false') {
      correct = trueFalseVal === activeQuestion.correctAnswer;
    } else if (activeQuestion.type === 'match') {
      // Evaluate matching pairs
      const correctPairs = activeQuestion.correctAnswer as { [left: string]: string };
      correct = Object.keys(correctPairs).every(k => matchSelections[k] === correctPairs[k]);
    } else if (activeQuestion.type === 'puzzle') {
      // Compare arrays element by element
      const correctArr = activeQuestion.correctAnswer as string[];
      correct = correctArr.every((v, i) => puzzleArray[i] === v);
    }

    setAnsweredCorrectly(correct);
    if (correct) {
      setScoreCount(prev => prev + 1);
    }
  };

  const handleNextAction = () => {
    if (currentIdx < quizSet.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setIsQuizComplete(true);
    }
  };

  // Reward calculations based on score percent
  const scorePercent = Math.round((scoreCount / quizSet.length) * 100);
  const earnedStars = scorePercent === 100 ? 3 : scorePercent >= 70 ? 2 : scorePercent > 0 ? 1 : 0;
  
  // Scale rewards with final stars ratio
  const coinsEarned = Math.round(node.coinsReward * (scorePercent / 100));
  const gemsEarned = Math.round(node.gemsReward * (scorePercent === 101 ? 1 : scorePercent >= 70 ? 0.7 : 0.2));
  const xpEarned = Math.round(node.xpReward * (scorePercent / 100));

  return (
    <div className="min-h-screen py-6 px-4 flex flex-col justify-center items-center bg-gradient-to-br from-indigo-50 via-sky-50 to-violet-50 select-none text-slate-800">
      
      {!isQuizComplete ? (
        <div className="w-full max-w-md bg-white border border-gray-150 rounded-3xl shadow-xl flex flex-col justify-between overflow-hidden relative">
          
          {/* Header Progress Meter */}
          <div className="bg-slate-50 border-b border-slate-150 p-4 pb-3 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-extrabold text-3xs text-indigo-600 uppercase tracking-widest">{node.title} CHALLENGE</span>
              <div className="flex items-center space-x-1 mt-0.5">
                <span className="text-sm font-black text-slate-900">Question {currentIdx + 1} of {quizSet.length}</span>
              </div>
            </div>

            {/* Timers indicator */}
            <div className="flex items-center space-x-1.5 bg-yellow-50 text-amber-700 border border-yellow-200 py-1.5 px-3 rounded-full text-xs font-black">
              <Timer size={14} className="animate-spin text-amber-500" />
              <span>{timeLeft}s</span>
            </div>
          </div>

          {/* Progress bar visual */}
          <div className="h-2 bg-slate-100 w-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-550 to-violet-500 transition-all duration-300"
              style={{ width: `${((currentIdx + 1) / quizSet.length) * 100}%` }}
            />
          </div>

          {/* Question fields */}
          <div className="p-5 flex-1 min-h-[380px]">
            <span className="bg-indigo-50 text-indigo-750 text-4xs font-black uppercase tracking-wider px-2 py-1 rounded inline-block mb-3.5">
              💡 Concept Challenge
            </span>
            <h3 className="text-base font-extrabold text-slate-900 leading-snug">
              {activeQuestion.question}
            </h3>

            {/* QUESTION RENDERING BASED ON SPECIFIC TYPES */}
            <div className="mt-5 space-y-2.5">
              
              {/* Type 1: MCQ */}
              {activeQuestion.type === 'mcq' && activeQuestion.options && (
                <div className="space-y-2">
                  {activeQuestion.options.map((opt, i) => {
                    const stringIdx = String(i);
                    const isSelected = selectedOpt === stringIdx;
                    const isCorrectAnswer = stringIdx === activeQuestion.correctAnswer;
                    
                    let bgStyle = 'bg-slate-50 text-slate-705 border-slate-200 hover:bg-slate-100';
                    if (committed) {
                      if (isCorrectAnswer) bgStyle = 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-2 ring-emerald-350';
                      else if (isSelected) bgStyle = 'bg-rose-50 text-rose-700 border-rose-300 ring-2 ring-rose-250';
                    } else if (isSelected) {
                      bgStyle = 'bg-indigo-50 text-indigo-900 border-indigo-400 ring-2 ring-indigo-350';
                    }

                    return (
                      <button
                        key={i}
                        type="button"
                        disabled={committed}
                        onClick={() => setSelectedOpt(stringIdx)}
                        className={`w-full text-left p-3.5 px-4.5 rounded-2xl border-2 text-xs font-black leading-normal transition-all flex items-center justify-between ${bgStyle} cursor-pointer`}
                      >
                        <span className="flex-1 pr-2">{opt}</span>
                        {committed && isCorrectAnswer && <CheckCircle2 size={16} className="text-emerald-550 flex-shrink-0" />}
                        {committed && isSelected && !isCorrectAnswer && <XCircle size={16} className="text-rose-550 flex-shrink-0 animate-bounce" />}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Type 2: True/False */}
              {activeQuestion.type === 'true_false' && (
                <div className="grid grid-cols-2 gap-4 pt-4">
                  {[true, false].map((tf) => {
                    const isSelected = trueFalseVal === tf;
                    const isCorrectAnswer = tf === activeQuestion.correctAnswer;

                    let bgStyle = 'bg-slate-50 text-slate-705 border-slate-200 hover:bg-slate-100';
                    if (committed) {
                      if (isCorrectAnswer) bgStyle = 'bg-emerald-50 border-emerald-300 text-emerald-800 ring-2 ring-emerald-350';
                      else if (isSelected) bgStyle = 'bg-rose-50 border-rose-300 text-rose-700 ring-2 ring-rose-250';
                    } else if (isSelected) {
                      bgStyle = tf 
                        ? 'bg-emerald-50 border-emerald-450 text-emerald-700 ring-1 ring-emerald-250' 
                        : 'bg-rose-50 border-rose-450 text-rose-700 ring-1 ring-rose-250';
                    }

                    return (
                      <button
                        key={String(tf)}
                        type="button"
                        disabled={committed}
                        onClick={() => setTrueFalseVal(tf)}
                        className={`py-5 px-4 rounded-3xl border-3 text-center text-sm font-black transition-all ${bgStyle} cursor-pointer flex flex-col items-center justify-center`}
                      >
                        <span className="text-lg">{tf ? '🟢 TRUE' : '🔴 FALSE'}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Type 3: Match the Following */}
              {activeQuestion.type === 'match' && activeQuestion.pairs && (
                <div className="space-y-4 pt-2">
                  <p className="text-4xs text-gray-400 font-extrabold uppercase tracking-wide">💡 Tap a left cell, then touch its correct match item on the right:</p>
                  
                  <div className="grid grid-cols-2 gap-3.5">
                    {/* Left Items Column */}
                    <div className="space-y-2">
                      {activeQuestion.pairs.map((p, idx) => {
                        const isSelected = selectedLeft === p.left;
                        const matchAssigned = matchSelections[p.left];

                        return (
                          <div key={idx} className="flex flex-col">
                            <button
                              type="button"
                              disabled={committed}
                              onClick={() => handleMatchLeftClick(p.left)}
                              className={`p-2.5 rounded-xl border text-3xs font-extrabold text-left transition-all ${
                                isSelected 
                                  ? 'bg-indigo-600 text-white min-h-12' 
                                  : matchAssigned 
                                  ? 'bg-indigo-50 border-indigo-200 text-indigo-900 min-h-12' 
                                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 min-h-12'
                              }`}
                            >
                              <span>{p.left}</span>
                            </button>
                            {/* Matching connection feedback representation */}
                            {matchAssigned && (
                              <div className="text-4xs text-emerald-600 font-bold px-2 py-0.5 bg-emerald-50 rounded mt-0.5 self-start">
                                🔗 matched
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Right Items Column (Shuffled dynamically represented) */}
                    <div className="space-y-2">
                      {activeQuestion.pairs.map((p, idx) => {
                        // Display matching right item directly or check if mapped
                        const rightVal = p.right;
                        // Is this value matching anything?
                        const matchingLeftKey = Object.keys(matchSelections).find(k => matchSelections[k] === rightVal);

                        return (
                          <button
                            key={idx}
                            type="button"
                            disabled={committed || !selectedLeft}
                            onClick={() => handleMatchRightClick(rightVal)}
                            className={`p-2.5 rounded-xl border text-3xs font-medium text-left w-full min-h-12 transition-all ${
                              matchingLeftKey 
                                ? 'bg-indigo-50 border-indigo-200 text-indigo-900' 
                                : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <span>{rightVal}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Type 4: Puzzle Sorting */}
              {activeQuestion.type === 'puzzle' && (
                <div className="space-y-2 pt-2">
                  <p className="text-4xs text-gray-400 font-extrabold uppercase tracking-wide">💡 Use Up/Down buttons to organize items in correct educational cascade:</p>
                  
                  {puzzleArray.map((pzl, i) => (
                    <div 
                      key={i} 
                      className="bg-slate-50 border border-slate-205 rounded-xl p-2.5 flex items-center justify-between text-2xs font-extrabold"
                    >
                      <span className="flex-1 pr-2 text-slate-700">{i+1}. {pzl}</span>
                      <div className="flex space-x-1 flex-shrink-0">
                        <button
                          type="button"
                          disabled={committed || i === 0}
                          onClick={() => movePuzzleItem(i, 'up')}
                          className="p-1.5 rounded-lg bg-white border hover:bg-slate-100 disabled:opacity-40 text-slate-650"
                        >
                          ▲
                        </button>
                        <button
                          type="button"
                          disabled={committed || i === puzzleArray.length - 1}
                          onClick={() => movePuzzleItem(i, 'down')}
                          className="p-1.5 rounded-lg bg-white border hover:bg-slate-100 disabled:opacity-40 text-slate-650"
                        >
                          ▼
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>

            {/* Explanations block after user commits answer */}
            <AnimatePresence>
              {committed && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-5 p-4.5 bg-slate-50 border border-slate-200 rounded-2xl"
                >
                  <div className="flex items-center space-x-1.5 mb-1 text-slate-900">
                    <BookOpen size={14} className="text-indigo-600" />
                    <span className="text-2xs font-black uppercase tracking-wider">Concept Diagnosis:</span>
                    {answeredCorrectly ? (
                      <span className="text-3xs bg-emerald-105 border border-emerald-250 rounded px-1 text-emerald-800 font-extrabold">+1 SCORE</span>
                    ) : (
                      <span className="text-3xs bg-rose-105 border border-rose-250 rounded px-1 text-rose-800 font-extrabold">OVERFLOW TIMED</span>
                    )}
                  </div>
                  <p className="text-2xs text-slate-600 leading-relaxed font-semibold">
                    {activeQuestion.explanation}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* Action buttons footer */}
          <div className="bg-slate-50 border-t border-slate-150 p-4 flex items-center space-x-3.5">
            <button
              onClick={onCancel}
              className="py-3 px-4 rounded-xl border border-slate-205 text-slate-400 hover:text-slate-500 font-bold text-xs"
            >
              Quit Quiz
            </button>
            <div className="flex-1">
              {!committed ? (
                <button
                  type="button"
                  onClick={() => handleEvaluateAnswer()}
                  className="w-full py-3 rounded-2xl bg-indigo-650 hover:bg-indigo-700 text-white font-black text-xs tracking-wider transition shadow-md"
                >
                  COMMIT SCORE CARD
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNextAction}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-105 text-white font-black text-xs tracking-wider transition shadow-md flex items-center justify-center space-x-1.5"
                >
                  <span>NEXT QUESTION</span>
                  <ChevronRight size={14} />
                </button>
              )}
            </div>
          </div>

        </div>
      ) : (
        /* QUIZ COMPLETE STAGES - CELEBRATE REWARDS LEVEL UP */
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md bg-white border border-gray-150 rounded-3xl p-6 shadow-2xl text-center space-y-5 relative overflow-hidden"
        >
          {/* Background visuals confetti particles */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-yellow-400/5 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute top-2 left-2 text-yellow-300 pointer-events-none"><Sparkles size={24} /></div>
          <div className="absolute bottom-4 right-4 text-sky-400 pointer-events-none"><Star size={24} fill="currentColor" /></div>

          {/* Star icons earned render */}
          <div className="flex justify-center items-center space-x-2 pt-4">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1 }}>
              <Star 
                size={earnedStars >= 1 ? 42 : 28} 
                className={earnedStars >= 1 ? 'text-yellow-400 drop-shadow' : 'text-slate-200'} 
                fill={earnedStars >= 1 ? 'currentColor' : 'none'} 
              />
            </motion.div>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring' }}>
              <Star 
                size={earnedStars >= 2 ? 56 : 32} 
                className={earnedStars >= 2 ? 'text-yellow-400 drop-shadow' : 'text-slate-200'} 
                fill={earnedStars >= 2 ? 'currentColor' : 'none'} 
              />
            </motion.div>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 }}>
              <Star 
                size={earnedStars >= 3 ? 42 : 28} 
                className={earnedStars >= 3 ? 'text-yellow-400 drop-shadow' : 'text-slate-200'} 
                fill={earnedStars >= 3 ? 'currentColor' : 'none'} 
              />
            </motion.div>
          </div>

          <div className="space-y-1">
            <h3 className="font-extrabold text-3xl uppercase tracking-tighter text-indigo-950" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
              Level Unlocked! 👑
            </h3>
            <p className="text-2xs font-extrabold text-indigo-650 tracking-wider uppercase">
              Cleared Level: {node.title} ({scorePercent}% PERFECT)
            </p>
          </div>

          {/* Treasure metrics card */}
          <div className="bg-gradient-to-r from-amber-500/10 via-yellow-400/5 to-pink-500/10 border-2 border-amber-205 p-4 rounded-2xl space-y-3 shadow-inner">
            <div className="text-3xs font-extrabold uppercase tracking-widest text-amber-800">Your Academics Treasure Claimed:</div>
            
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white p-3 rounded-xl border border-amber-100 flex flex-col items-center shadow-sm">
                <span className="text-base font-extrabold text-indigo-650">+{xpEarned}</span>
                <span className="text-4xs text-gray-400 font-extrabold tracking-wider uppercase mt-1">⭐ XP Points</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-amber-100 flex flex-col items-center shadow-sm">
                <span className="text-base font-extrabold text-amber-550">+{coinsEarned}</span>
                <span className="text-4xs text-gray-400 font-extrabold tracking-wider uppercase mt-1">🟡 Coins</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-amber-100 flex flex-col items-center shadow-sm">
                <span className="text-base font-extrabold text-violet-650">+{gemsEarned}</span>
                <span className="text-4xs text-gray-400 font-extrabold tracking-wider uppercase mt-1">💎 Gems</span>
              </div>
            </div>

            <div className="bg-white/80 p-2 rounded-xl text-3xs font-medium text-slate-600">
              🍬 Stitch tips: Daily sessions secure active memory retention, preventing deep forgetting cascade gaps!
            </div>
          </div>

          {scorePercent < 70 && (
            <div className="text-3xs text-rose-600 font-bold bg-rose-50 p-2.5 rounded-xl border border-rose-100 leading-normal">
              ⚠️ Score reflects lower than 70%. Retake this node session anytime to increase stars ratio and claim locked coins!
            </div>
          )}

          <div className="space-y-2 pt-3">
            <button
              onClick={() => onFinishQuiz(scorePercent, coinsEarned, gemsEarned, xpEarned)}
              className="w-full py-4.5 px-6 rounded-2xl bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-505 hover:brightness-110 active:scale-98 border-b-4 border-amber-600 text-indigo-900 font-black text-sm tracking-wider uppercase flex items-center justify-center space-x-2 shadow-lg transition cursor-pointer"
            >
              <span>CLAIM REWARDS & CLIMB MAP</span>
              <ArrowRight size={16} />
            </button>

            {scorePercent < 100 && (
              <button
                type="button"
                onClick={() => {
                  setCurrentIdx(0);
                  setScoreCount(0);
                  setIsQuizComplete(false);
                }}
                className="w-full py-2.5 rounded-xl border border-slate-205 hover:bg-slate-50 text-slate-505 font-bold text-xs flex items-center justify-center space-x-1.5"
              >
                <RefreshCw size={12} />
                <span>Retake Quiz (Improve stars score)</span>
              </button>
            )}
          </div>

        </motion.div>
      )}

    </div>
  );
}
