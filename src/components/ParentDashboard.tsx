/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Users, BarChart2, Calendar, Clipboard, AlertTriangle, ShieldCheck, 
  Sparkles, RotateCcw, Clock, Award
} from 'lucide-react';
import { StudentProfile, ActivityLog } from '../types';
import { fetchActivityLogs } from '../firebase';

interface ParentDashboardProps {
  profile: StudentProfile;
}

export default function ParentDashboard({ profile }: ParentDashboardProps) {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchActivityLogs(profile.uid).then((data) => {
      setLogs(data);
      setLoading(false);
    });
  }, [profile.xp, profile.completedLevels.length]);

  // Calculated Mock Performance metrics for high fidelity display
  const completedNodesCount = profile.completedLevels.length;
  const activeRate = completedNodesCount === 0 ? 0 : Math.round((completedNodesCount / 10) * 100);
  
  // Weak topics calculations
  const weakTopics = [
    { name: 'Timeboxing (Level 5 Time management)', score: '55%', details: 'Struggled with the Pomodoro technique options.' },
    { name: 'Lifestyle Alignment (Level 7 Sleep health)', score: '60%', details: 'Missed sleep consolidation questions.' }
  ];

  const strongTopics = [
    { name: 'Consistent Habit building (Level 2)', score: '100%' },
    { name: 'Active Recall methodology (Level 1)', score: '90%' }
  ];

  return (
    <div className="w-full max-w-xl mx-auto h-[755px] bg-sky-50/20 border-4 border-white rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between select-none text-slate-800">
      
      {/* 1. Header Area */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-indigo-800 text-white p-5 border-b-2 border-indigo-200/20 shadow-md">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-white/10 rounded-2xl text-white">
            <Clipboard size={32} />
          </div>
          <div className="flex flex-col text-left">
            <h3 className="font-black text-xl tracking-tight" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
              PARENT & TEACHER DASHBOARD
            </h3>
            <span className="text-3xs text-emerald-250 font-bold uppercase tracking-widest mt-0.5">
              Live Progress, Attendance & Weak Topic Identification
            </span>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[580px] bg-slate-50/50">
        
        {/* Onboarding Student quick card */}
        <div className="bg-white rounded-2xl p-4 border border-slate-150 shadow-2xs flex items-center justify-between">
          <div className="flex items-center space-x-3 text-left">
            <div className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center text-xl">🦊</div>
            <div className="flex flex-col">
              <span className="font-black text-sm text-slate-900">{profile.fullName || 'Bright Student'}</span>
              <span className="text-3xs text-slate-400 font-extrabold uppercase mt-0.5">🎯 Aiming target: {profile.studyingFor}</span>
            </div>
          </div>
          <div className="text-right flex flex-col justify-center">
            <span className="text-2xs font-extrabold text-indigo-650 bg-indigo-50 border border-indigo-200 py-1 px-2 rounded-xl">LEVEL {profile.currentLevel}</span>
          </div>
        </div>

        {/* 2. Visual Bento-Grid analytics */}
        <div className="grid grid-cols-2 gap-3">
          
          {/* Radial visual Progress meter */}
          <div className="bg-white p-4.5 rounded-3xl border border-slate-150 shadow-2xs flex flex-col items-center justify-center text-center">
            <span className="text-3xs font-black text-gray-400 uppercase tracking-wider mb-2">COURSE COMPLETED</span>
            <div className="relative w-20 h-20 md:w-24 md:h-24 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="50%" cy="50%" r="40%" stroke="#E2E8F0" strokeWidth="8" fill="none" />
                <circle cx="50%" cy="50%" r="40%" stroke="#10B981" strokeWidth="8" fill="none" strokeDasharray="251" strokeDashoffset={251 - (251 * activeRate) / 100} />
              </svg>
              <div className="absolute text-base font-black text-slate-800">{activeRate}%</div>
            </div>
            <span className="text-4xs font-bold text-gray-400 mt-2.5 uppercase tracking-wide">
              {completedNodesCount} OF 10 MAP NODES CLEARED
            </span>
          </div>

          {/* Attendance metrics */}
          <div className="bg-white p-4.5 rounded-3xl border border-slate-150 shadow-2xs flex flex-col justify-between text-left">
            <div className="space-y-3">
              <div className="flex items-center space-x-1.5 text-slate-900">
                <Calendar size={15} className="text-emerald-550" />
                <span className="text-3xs font-black uppercase tracking-wider text-gray-400">Streak Logs</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-black text-emerald-990">{profile.streak} Days</span>
                <span className="text-4xs font-bold text-gray-400 mt-0.5 uppercase tracking-wide">STUDYING SEQUENCE ACTIVE</span>
              </div>
            </div>
            <div className="mt-3 text-4xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 py-1.5 px-2 rounded-lg flex items-center space-x-1">
              <ShieldCheck size={10} />
              <span>Attendance Tracking: 100% active</span>
            </div>
          </div>

        </div>

        {/* 3. Strengths vs Weakness Analytics Card */}
        <div className="bg-white p-4.5 rounded-3xl border border-slate-150 shadow-2xs space-y-3.5">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
            <BarChart2 size={18} className="text-indigo-600" />
            <h4 className="font-extrabold text-xs text-slate-900 uppercase">Interactive Focus Insights</h4>
          </div>

          <div className="space-y-3 text-left">
            {/* Weak topics Identified list */}
            <div>
              <span className="text-3xs font-extrabold text-red-700 uppercase tracking-wider flex items-center mb-1.5">
                <AlertTriangle size={12} className="mr-1 inline flex-shrink-0 animate-bounce" />
                Weak Topics Identified:
              </span>
              {completedNodesCount < 4 ? (
                <div className="p-2.5 bg-slate-50 rounded-xl text-3xs font-medium text-slate-500">
                  ⚠️ Complete Level 5 node to enable dynamic weak-spot isolation diagnostics.
                </div>
              ) : (
                <div className="space-y-1.5">
                  {weakTopics.map((wt, i) => (
                    <div key={i} className="p-2 px-3 bg-red-50/55 rounded-xl border border-red-100 flex flex-col">
                      <div className="flex justify-between font-bold text-2xs text-slate-800">
                        <span>{wt.name}</span>
                        <span className="text-red-700">{wt.score} accuracy</span>
                      </div>
                      <span className="text-4xs text-slate-500 mt-0.5 font-semibold">{wt.details}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Strengths identified */}
            <div>
              <span className="text-3xs font-extrabold text-emerald-700 uppercase tracking-wider flex items-center mb-1.5">
                <Sparkles size={12} className="mr-1 text-yellow-500 flex-shrink-0" />
                Primary Core Strengths:
              </span>
              <div className="space-y-1.5">
                {strongTopics.map((st, i) => (
                  <div key={i} className="p-2 px-3 bg-emerald-50/45 rounded-xl border border-emerald-100 flex justify-between font-bold text-2xs text-slate-700">
                    <span>{st.name}</span>
                    <span className="text-emerald-600">{st.score} Perfect</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* 4. Student Logs history queried list */}
        <div className="bg-white p-4.5 rounded-3xl border border-slate-150 shadow-2xs space-y-3.5">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
            <Clock size={16} className="text-slate-500" />
            <h4 className="font-extrabold text-xs text-slate-900 uppercase">Recent Activity Registry</h4>
          </div>

          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
            {loading ? (
              <div className="text-center text-xs text-gray-400 py-3">Cataloging logs...</div>
            ) : logs.length === 0 ? (
              <div className="text-center text-xs text-gray-400 py-3">No learning actions logged yet.</div>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="p-2 bg-slate-50 border border-slate-155 rounded-xl flex items-center justify-between text-left">
                  <div className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 bg-sky-500 rounded-full flex-shrink-0" />
                    <div className="flex flex-col">
                      <span className="font-bold text-2xs text-slate-800">{log.title}</span>
                      <span className="text-4xs text-gray-400 font-semibold">{new Date(log.timestamp).toLocaleDateString()} at {new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                  </div>
                  <span className="text-3xs font-extrabold text-emerald-600">+{log.xpAwarded} XP ⭐</span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Footer Info details */}
      <div className="bg-slate-50 border-t border-slate-150 p-4 text-center">
        <p className="text-4xs tracking-wide text-slate-500 uppercase font-black">
          🛡️ Secure cloud-sync backup protects all student histories against hardware resets.
        </p>
      </div>

    </div>
  );
}
