/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Award, Shield, Calendar, Sparkles, Settings, Globe, Bell, Trash2, 
  Volume2, VolumeX, ShieldCheck, Star, Users 
} from 'lucide-react';
import { StudentProfile, AchievementBadge, StudyLevel, KnowledgeLevel } from '../types';
import { ACHIEVEMENT_BADGES } from '../data';
import { saveProfileToDatabase, isFirebaseActive } from '../firebase';

interface ProfileViewProps {
  profile: StudentProfile;
  onUpdateProfile: (updated: StudentProfile) => void;
  onResetProgress: () => void;
}

export default function ProfileView({ profile, onUpdateProfile, onResetProgress }: ProfileViewProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>('profile');
  const [resetConfirm, setResetConfirm] = useState(false);

  // Settings states triggers
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);

  const handleUpdateLanguage = (lang: string) => {
    const updated = { ...profile, language: lang };
    onUpdateProfile(updated);
  };

  const handleUpdateFocus = (focus: StudyLevel) => {
    const updated = { ...profile, studyingFor: focus };
    onUpdateProfile(updated);
  };

  const handleUpdateKnowledge = (kl: KnowledgeLevel) => {
    const updated = { ...profile, knowledgeLevel: kl };
    onUpdateProfile(updated);
  };

  const languages = ['English', 'Tamil', 'Hindi', 'Telugu', 'Malayalam', 'Kannada'];
  const focusAreas: StudyLevel[] = ['School', 'Diploma', 'Undergraduate', 'Postgraduate', 'Competitive Exams', 'Coding', 'Skill Development'];

  return (
    <div className="w-full max-w-xl mx-auto h-[755px] bg-white border-4 border-white rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between select-none text-slate-800">
      
      {/* 1. Profile Banner Header */}
      <div className="bg-gradient-to-r from-violet-600 via-indigo-700 to-sky-650 text-white p-5 text-center relative border-b-2 border-indigo-200/20 shadow-md">
        
        {/* Tab triggers top right settings icon */}
        <button
          onClick={() => setActiveTab(activeTab === 'profile' ? 'settings' : 'profile')}
          className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition cursor-pointer"
        >
          <Settings size={18} />
        </button>

        {/* User Large Avatar circular wrapper */}
        <div className="flex justify-center mb-2 mt-2">
          <div className="w-20 h-20 bg-white rounded-full border-4 border-indigo-305 flex items-center justify-center text-4xl shadow-xl">
            🦊
          </div>
        </div>

        <h3 className="font-extrabold text-2xl tracking-tight" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
          {profile.fullName || 'Bright Topper'}
        </h3>
        <p className="text-3xs text-yellow-250 font-black uppercase tracking-widest mt-1">
          🟢 LEVEL {profile.currentLevel} SPECIALIST • ACCREDITED STUDENT
        </p>
      </div>

      {/* Tabs navigation */}
      <div className="bg-slate-50 border-b border-slate-150 p-2 flex space-x-1.5">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex-1 py-3 px-4 rounded-2xl text-xs font-black transition-all ${
            activeTab === 'profile' 
              ? 'bg-indigo-650 text-white shadow' 
              : 'text-slate-505 hover:bg-slate-100 hover:text-slate-700'
          } cursor-pointer`}
        >
          ACHIEVEMENT CENTER Shelf
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-3 px-4 rounded-2xl text-xs font-black transition-all ${
            activeTab === 'settings' 
              ? 'bg-indigo-650 text-white shadow' 
              : 'text-slate-550 hover:bg-slate-100 hover:text-slate-700'
          } cursor-pointer`}
        >
          APP PREFERENCES & RULES
        </button>
      </div>

      {/* Primary body fields */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[485px] bg-slate-50/50 text-left">
        <AnimatePresence mode="wait">
          
          {activeTab === 'profile' ? (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* User Stat Counters Grid */}
              <div className="grid grid-cols-4 gap-2.5">
                <div className="bg-white p-3 rounded-2xl border border-slate-150 shadow-2xs text-center flex flex-col justify-center">
                  <span className="text-base font-black text-indigo-650">{profile.xp.toLocaleString()}</span>
                  <span className="text-5xs text-gray-400 font-extrabold uppercase mt-1">Total XP ⭐</span>
                </div>
                <div className="bg-white p-3 rounded-2xl border border-slate-150 shadow-2xs text-center flex flex-col justify-center">
                  <span className="text-base font-black text-amber-550">{profile.coins}</span>
                  <span className="text-5xs text-gray-400 font-extrabold uppercase mt-1">Coins 🟡</span>
                </div>
                <div className="bg-white p-3 rounded-2xl border border-slate-150 shadow-2xs text-center flex flex-col justify-center">
                  <span className="text-base font-black text-violet-650">{profile.gems}</span>
                  <span className="text-5xs text-gray-400 font-extrabold uppercase mt-1">Gems 💎</span>
                </div>
                <div className="bg-white p-3 rounded-2xl border border-slate-150 shadow-2xs text-center flex flex-col justify-center">
                  <span className="text-base font-black text-emerald-650">{profile.streak} days</span>
                  <span className="text-5xs text-gray-400 font-extrabold uppercase mt-1">Streak 🔥</span>
                </div>
              </div>

              {/* Badges shelves display elements */}
              <div className="bg-white p-4.5 border border-slate-150 rounded-3xl space-y-3.5 shadow-2xs">
                <div className="flex items-center space-x-1.5 border-b border-slate-100 pb-2">
                  <Award size={18} className="text-amber-550" />
                  <h4 className="font-extrabold text-xs text-slate-950 uppercase">Achievement Badge Gallery</h4>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  {ACHIEVEMENT_BADGES.map((badge) => {
                    const isUnlocked = profile.unlockedBadges.includes(badge.id);

                    return (
                      <div
                        key={badge.id}
                        className={`p-3.5 rounded-2xl border-2 text-center transition-all flex flex-col items-center justify-center relative ${
                          isUnlocked 
                            ? `${badge.color} border-slate-105 shadow-2xs` 
                            : 'bg-slate-50/50 border-dashed border-slate-200 text-slate-350 select-none brightness-90 grayscale'
                        }`}
                      >
                        <Shield className="w-10 h-10 mb-2" fill={isUnlocked ? 'currentColor' : 'none'} />
                        <span className="text-2xs font-extrabold block leading-tight">{badge.name}</span>
                        <span className="text-4xs text-slate-450 mt-1 font-semibold leading-normal">{badge.description}</span>

                        {!isUnlocked && (
                          <span className="absolute top-1.5 right-1.5 text-slate-300">🔒</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          ) : (
            /* CONFIGURATIONS & APP RULES SETTINGS */
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 text-xs font-bold"
            >
              
              {/* Study focus settings */}
              <div className="bg-white p-4 rounded-2xl border border-slate-150 space-y-2">
                <span className="text-3xs uppercase text-gray-400 tracking-wider flex items-center">
                  <Globe className="mr-1 inline text-indigo-550" size={12} />
                  Choose target study standard
                </span>
                <div className="grid grid-cols-2 gap-1.5 max-h-28 overflow-y-auto pr-1">
                  {focusAreas.map((focus) => (
                    <button
                      key={focus}
                      onClick={() => handleUpdateFocus(focus)}
                      className={`p-2 rounded-xl text-left border text-3xs font-extrabold transition ${
                        profile.studyingFor === focus 
                          ? 'border-indigo-650 bg-indigo-50 text-indigo-900' 
                          : 'border-slate-100 bg-slate-50 text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      {focus}
                    </button>
                  ))}
                </div>
              </div>

              {/* Study language triggers */}
              <div className="bg-white p-4 rounded-2xl border border-slate-150 space-y-2">
                <span className="text-3xs uppercase text-gray-400 tracking-wider flex items-center animate-pulse">
                  🚩 Change studying language
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  {languages.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => handleUpdateLanguage(lang)}
                      className={`p-2 rounded-xl text-center border text-3xs font-extrabold transition ${
                        profile.language === lang 
                          ? 'bg-indigo-650 text-white' 
                          : 'border-slate-100 bg-slate-20/40 text-slate-500'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles volume trigger triggers */}
              <div className="bg-white p-4 rounded-2xl border border-slate-155 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-slate-805">
                    {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                    <span>Simulated Sounds & Speech Synthesis voice narration</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={soundEnabled}
                    onChange={() => setSoundEnabled(!soundEnabled)}
                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-slate-805">
                    <Bell size={16} />
                    <span>Push Daily study target notification reminders</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={pushNotifs}
                    onChange={() => setPushNotifs(!pushNotifs)}
                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                </div>
              </div>

              {/* Progress Reset button */}
              <div className="bg-white p-4 rounded-2xl border border-red-150 text-left space-y-3.5">
                <div className="text-red-700 font-extrabold uppercase tracking-wide flex items-center text-xs">
                  <Trash2 size={16} className="mr-1.5 animate-bounce" />
                  Danger Area: Reset data indexes
                </div>
                <p className="text-3xs text-gray-400 leading-normal font-semibold">
                  This will completely clear your local records, locks, and progress state, bringing you back to Level 1 "Work Hard" on Topper Road. This action is irreversible.
                </p>

                {!resetConfirm ? (
                  <button
                    onClick={() => setResetConfirm(true)}
                    className="p-2.5 rounded-xl border border-red-500 text-red-500 font-extrabold text-3xs hover:bg-red-50 transition cursor-pointer"
                  >
                    Reset Map & Clear Locks
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={onResetProgress}
                      className="p-2.5 rounded-xl bg-red-650 text-white font-extrabold text-3xs hover:bg-red-700 transition cursor-pointer"
                    >
                      Yes, completely wipe my progress
                    </button>
                    <button
                      onClick={() => setResetConfirm(false)}
                      className="p-2.5 rounded-xl border border-slate-205 text-slate-500 font-bold text-3xs"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Footer information block */}
      <div className="bg-slate-50 border-t border-slate-150 p-4 text-center">
        <p className="text-4xl text-slate-455 tracking-wider uppercase font-black">
          🛡️ Stitch AI v1.0.0 Stable On-Demand Build.
        </p>
      </div>

    </div>
  );
}
