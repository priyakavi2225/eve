/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, Medal, Globe, GraduationCap, Users, Sparkles, MapPin, Search 
} from 'lucide-react';
import { LeaderboardEntry, StudentProfile } from '../types';
import { fetchLeaderboardFromDatabase } from '../firebase';

interface LeaderboardViewProps {
  profile: StudentProfile;
}

export default function LeaderboardView({ profile }: LeaderboardViewProps) {
  const [activeTab, setActiveTab] = useState<'friends' | 'school' | 'state' | 'national'>('friends');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchLeaderboardFromDatabase(activeTab).then((data) => {
      setEntries(data);
      setLoading(false);
    });
  }, [activeTab, profile.xp, profile.currentLevel]);

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Trophy className="text-yellow-500 fill-yellow-400 drop-shadow" size={24} />;
    if (rank === 2) return <Medal className="text-slate-400 fill-slate-300 drop-shadow" size={22} />;
    if (rank === 3) return <Medal className="text-amber-600 fill-amber-500 drop-shadow" size={20} />;
    return <span className="font-bold text-xs text-slate-400">#{rank}</span>;
  };

  const tabs = [
    { id: 'friends', label: 'Friends', icon: <Users size={14} /> },
    { id: 'school', label: 'School', icon: <GraduationCap size={14} /> },
    { id: 'state', label: 'State', icon: <MapPin size={14} /> },
    { id: 'national', label: 'National', icon: <Globe size={14} /> }
  ] as const;

  return (
    <div className="w-full max-w-xl mx-auto h-[755px] bg-white border-4 border-white rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between select-none text-slate-800">
      
      {/* Header section with Trophy icon banner */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-700 text-white p-5 text-center relative border-b-2 border-indigo-200/20 shadow-md">
        <div className="absolute top-2 right-2 text-yellow-300 animate-pulse"><Sparkles size={20} /></div>
        <div className="flex justify-center mb-1">
          <Trophy size={42} className="text-yellow-300 drop-shadow" fill="currentColor" />
        </div>
        <h3 className="font-black text-2xl tracking-tight" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
          SOCIAL LEADERBOARDS
        </h3>
        <p className="text-indigo-200 text-3xs font-bold uppercase tracking-widest mt-1">
          Climb levels sequentially to challenge state-wide academic toppers!
        </p>
      </div>

      {/* Tabs navigation */}
      <div className="bg-slate-50 border-b border-gray-150 p-2 flex space-x-1.5 scrollbar-none overflow-x-auto">
        {tabs.map((tab) => {
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-3 rounded-2xl text-xs font-black transition-all flex items-center justify-center space-x-1 border-b-2 cursor-pointer ${
                isSelected 
                  ? 'bg-indigo-650 text-white border-indigo-900 shadow-md' 
                  : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-100 hover:text-slate-700'
              }`}
            >
              {tab.icon}
              <span className="text-2xs">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Ranks list elements */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2.5 max-h-[485px] bg-slate-50/50">
        <AnimatePresence mode="wait">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="bg-white border rounded-2xl h-14 w-full animate-pulse flex items-center justify-between px-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200" />
                    <div className="space-y-1.5">
                      <div className="h-3 w-28 bg-slate-200 rounded" />
                      <div className="h-2 w-16 bg-slate-150 rounded" />
                    </div>
                  </div>
                  <div className="h-4 w-12 bg-slate-200 rounded-lg" />
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-2"
            >
              {entries.map((entry) => {
                const isMe = entry.fullName.toLowerCase().includes('you') || entry.uid === profile.uid;
                
                return (
                  <div
                    key={entry.uid}
                    className={`flex items-center justify-between p-3.5 px-4 rounded-2xl border transition-all ${
                      isMe 
                        ? 'bg-indigo-50 border-indigo-250 ring-2 ring-indigo-350 shadow-sm' 
                        : 'bg-white border-slate-150 shadow-2xs hover:border-slate-205'
                    }`}
                  >
                    <div className="flex items-center space-x-3.5">
                      {/* Rank numeric index or Trophy Badge */}
                      <div className="w-8 flex justify-center items-center flex-shrink-0">
                        {getRankBadge(entry.rank)}
                      </div>

                      {/* Mascot Avatar */}
                      <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xl shadow-inner flex-shrink-0">
                        {entry.avatar}
                      </div>

                      {/* Name Details */}
                      <div className="flex flex-col text-left">
                        <span className={`text-xs font-black leading-tight ${isMe ? 'text-indigo-900' : 'text-slate-800'}`}>
                          {isMe ? `${profile.fullName || 'You'} (Me)` : entry.fullName}
                        </span>
                        <span className="text-4xs text-gray-400 font-extrabold uppercase mt-1">
                          🟢 LEVEL {entry.level} STUDIER
                        </span>
                      </div>
                    </div>

                    {/* XP details */}
                    <div className="text-right flex flex-col justify-center">
                      <span className="text-xs font-black tracking-tight text-indigo-650">
                        {entry.xp.toLocaleString()} <span className="text-3xs text-slate-400 font-bold uppercase tracking-widest pl-0.5">XP</span>
                      </span>
                    </div>

                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom promotional details layout */}
      <div className="bg-slate-50 border-t border-slate-150 p-4.5 text-center flex flex-col items-center justify-center">
        <p className="text-3xs text-slate-505 font-extrabold uppercase tracking-wide leading-relaxed">
          🏆 Challenge: Clearing daily quiz map nodes raises your score multiplier by 1.5x!
        </p>
      </div>

    </div>
  );
}
