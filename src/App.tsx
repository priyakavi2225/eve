/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, GraduationCap, Users, Clipboard, User, Sparkles, 
  Flame, Award, CheckCircle, ShieldAlert, Rocket, Star
} from 'lucide-react';
import { StudentProfile, LearningNode } from './types';
import { 
  saveProfileToDatabase, 
  fetchProfileFromDatabase, 
  saveActivityLog, 
  isFirebaseActive 
} from './firebase';

import WelcomeScreen from './components/WelcomeScreen';
import AuthScreens from './components/AuthScreens';
import Roadmap from './components/Roadmap';
import TutorAssistant from './components/TutorAssistant';
import QuizView from './components/QuizView';
import LeaderboardView from './components/LeaderboardView';
import ParentDashboard from './components/ParentDashboard';
import ProfileView from './components/ProfileView';

type AppScreen = 'welcome' | 'auth' | 'roadmap' | 'quiz' | 'tutor' | 'leaderboard' | 'parent' | 'profile_stats';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<AppScreen>('welcome');
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [selectedNode, setSelectedNode] = useState<LearningNode | null>(null);
  const [loading, setLoading] = useState(true);

  // Level Up popup celebration status
  const [celebrationDetails, setCelebrationDetails] = useState<{
    show: boolean;
    levelNum: number;
    title: string;
    xpBonus: number;
  } | null>(null);

  // Load registered session on mount
  useEffect(() => {
    const cachedUid = localStorage.getItem('stitch_active_uid');
    if (cachedUid) {
      fetchProfileFromDatabase(cachedUid).then((loadedProfile) => {
        if (loadedProfile) {
          setProfile(loadedProfile);
          setActiveScreen('roadmap');
        }
        setLoading(false);
      }).catch((err) => {
        console.error("Session restoration error:", err);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  // Update profile handler - syncs seamlessly across states
  const handleUpdateProfile = async (updated: StudentProfile) => {
    setProfile(updated);
    if (updated.uid) {
      localStorage.setItem('stitch_active_uid', updated.uid);
      await saveProfileToDatabase(updated);
    }
  };

  const handleStartAdventure = () => {
    if (profile) {
      setActiveScreen('roadmap');
    } else {
      setActiveScreen('auth');
    }
  };

  const handleOnboardingSuccess = (newProfile: StudentProfile) => {
    setProfile(newProfile);
    localStorage.setItem('stitch_active_uid', newProfile.uid);
    setActiveScreen('roadmap');
    
    // Save onboarding activity log
    saveActivityLog({
      id: 'log_' + Math.random().toString(36).substring(2, 9),
      title: "Onboarding Profile Created",
      type: "streak_gain",
      timestamp: new Date().toISOString(),
      xpAwarded: 150
    });
  };

  // Claim quiz victory rewards
  const handleQuizFinished = async (
    scorePercent: number, 
    coinsEarned: number, 
    gemsEarned: number, 
    xpEarned: number
  ) => {
    if (!profile || !selectedNode) return;

    let nextCompletedLevels = [...profile.completedLevels];
    let levelUnlockedNewly = false;

    // Student clears level on > 70%
    if (scorePercent >= 70) {
      if (!nextCompletedLevels.includes(selectedNode.id)) {
        nextCompletedLevels.push(selectedNode.id);
        levelUnlockedNewly = true;
      }
    }

    const nextLevelNum = nextCompletedLevels.length + 1;
    
    // Check if new badges are earned based on rules
    let nextUnlockedBadges = [...profile.unlockedBadges];
    if (nextCompletedLevels.length >= 3 && !nextUnlockedBadges.includes('quiz_master')) {
      nextUnlockedBadges.push('quiz_master');
    }
    if (scorePercent === 100 && !nextUnlockedBadges.includes('perfect_scorer')) {
      nextUnlockedBadges.push('perfect_scorer');
    }
    if (nextCompletedLevels.length >= 10 && !nextUnlockedBadges.includes('weekly_champion')) {
      nextUnlockedBadges.push('weekly_champion');
    }

    const updatedProfile: StudentProfile = {
      ...profile,
      xp: profile.xp + xpEarned,
      coins: profile.coins + coinsEarned,
      gems: profile.gems + gemsEarned,
      completedLevels: nextCompletedLevels,
      currentLevel: nextLevelNum > 10 ? 10 : nextLevelNum,
      unlockedBadges: nextUnlockedBadges
    };

    setProfile(updatedProfile);
    await saveProfileToDatabase(updatedProfile);
    
    // Log Activity registry entry
    await saveActivityLog({
      id: 'log_' + Math.random().toString(36).substring(2, 9),
      title: `Quiz Cleared: ${selectedNode.title} (${scorePercent}%)`,
      type: "quiz_complete",
      timestamp: new Date().toISOString(),
      xpAwarded: xpEarned
    });

    // If a level was newly unlocked, open the Golden Level Up popup
    if (levelUnlockedNewly) {
      setCelebrationDetails({
        show: true,
        levelNum: selectedNode.levelNum,
        title: selectedNode.title,
        xpBonus: xpEarned
      });
    }

    setSelectedNode(null);
    setActiveScreen('roadmap');
  };

  const handleAddXpCoinsFromTutor = async (xp: number, coins: number, gems: number) => {
    if (!profile) return;
    const updated = {
      ...profile,
      xp: profile.xp + xp,
      coins: profile.coins + coins,
      gems: profile.gems + gems
    };
    setProfile(updated);
    await saveProfileToDatabase(updated);
  };

  const handleResetProgress = async () => {
    if (!profile) return;
    const resetProf: StudentProfile = {
      ...profile,
      currentLevel: 1,
      xp: 150,
      coins: 100,
      gems: 10,
      completedLevels: [],
      unlockedBadges: ['fast_learner']
    };
    setProfile(resetProf);
    await saveProfileToDatabase(resetProf);
    await saveActivityLog({
      id: 'log_' + Math.random().toString(36).substring(2, 9),
      title: "Reset Student Journey",
      type: "lesson_finish",
      timestamp: new Date().toISOString(),
      xpAwarded: 0
    });
    setActiveScreen('roadmap');
  };

  const handleSignOut = () => {
    localStorage.removeItem('stitch_active_uid');
    setProfile(null);
    setActiveScreen('welcome');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-slate-100 select-none">
        <div className="animate-spin text-indigo-650 mb-3 text-2xl">⏳</div>
        <p className="text-sm font-bold text-slate-500">Decrypting student ledger keys...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex justify-center items-center p-0 md:p-4 text-slate-800">
      
      {/* Device wrapper to ensure a perfect mobile-first layout frame */}
      <div className="relative w-full max-w-[480px] min-h-screen md:min-h-[812px] md:rounded-[40px] md:border-[10px] md:border-slate-950 bg-slate-100 overflow-hidden shadow-2xl flex flex-col justify-between">
        
        {/* TOP LEVEL HUD BAR STATUS CONTAINER */}
        {profile && activeScreen !== 'welcome' && activeScreen !== 'auth' && activeScreen !== 'quiz' && (
          <div className="bg-gradient-to-r from-indigo-700 via-indigo-650 to-indigo-700 px-4 py-3 border-b-2 border-indigo-900/40 text-white flex items-center justify-between shadow z-30 select-none">
            {/* Student Mascot header and Level ID */}
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setActiveScreen('profile_stats')}>
              <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-sm shadow">🦊</div>
              <div className="flex flex-col text-left">
                <span className="font-extrabold text-2xs truncate max-w-[95px] leading-tight">{profile.fullName || 'Student'}</span>
                <span className="text-5xs bg-yellow-450 text-slate-900 font-extrabold rounded-full px-1.5 self-start">LVL {profile.currentLevel}</span>
              </div>
            </div>

            {/* Earned treasure status indicators */}
            <div className="flex items-center space-x-2 text-xs font-black">
              <div className="bg-slate-900/35 px-2.5 py-1 rounded-full flex items-center space-x-1 border border-white/5">
                <span className="text-yellow-405">⭐</span>
                <span>{profile.xp.toLocaleString()}</span>
              </div>
              <div className="bg-slate-900/35 px-2.5 py-1 rounded-full flex items-center space-x-1 border border-white/5">
                <span>🟡</span>
                <span>{profile.coins}</span>
              </div>
              <div className="bg-slate-900/35 px-2.5 py-1 rounded-full flex items-center space-x-1 border border-white/5">
                <span>💎</span>
                <span>{profile.gems}</span>
              </div>
              
              {/* Daily flame Streak */}
              <div className="flex items-center space-x-0.5 text-orange-400 font-black animate-pulse" title="Daily study streak active!">
                <Flame size={14} className="fill-orange-400" />
                <span className="text-3xs">{profile.streak}</span>
              </div>
            </div>
          </div>
        )}

        {/* ACTIVE SCREEN ROUTER */}
        <div className="flex-1 w-full bg-slate-50 relative">
          <AnimatePresence mode="wait">
            
            {activeScreen === 'welcome' && (
              <motion.div key="welcome" className="absolute inset-0">
                <WelcomeScreen onStart={handleStartAdventure} />
              </motion.div>
            )}

            {activeScreen === 'auth' && (
              <motion.div key="auth" className="absolute inset-0">
                <AuthScreens onSuccess={handleOnboardingSuccess} />
              </motion.div>
            )}

            {activeScreen === 'roadmap' && profile && (
              <motion.div key="roadmap" className="absolute inset-0">
                <Roadmap 
                  profile={profile} 
                  onSelectNode={(node) => {
                    setSelectedNode(node);
                    setActiveScreen('quiz');
                  }} 
                />
              </motion.div>
            )}

            {activeScreen === 'quiz' && profile && selectedNode && (
              <motion.div key="quiz" className="absolute inset-0">
                <QuizView 
                  node={selectedNode} 
                  onFinishQuiz={handleQuizFinished}
                  onCancel={() => {
                    setSelectedNode(null);
                    setActiveScreen('roadmap');
                  }}
                />
              </motion.div>
            )}

            {activeScreen === 'tutor' && profile && (
              <motion.div key="tutor" className="absolute inset-0">
                <TutorAssistant 
                  profile={profile} 
                  activeLevelTitle={profile.completedLevels[profile.completedLevels.length - 1] || 'Level 1'}
                  onAddXpCoins={handleAddXpCoinsFromTutor}
                  onBackToMap={() => setActiveScreen('roadmap')}
                />
              </motion.div>
            )}

            {activeScreen === 'leaderboard' && profile && (
              <motion.div key="leaderboard" className="absolute inset-0">
                <LeaderboardView profile={profile} />
              </motion.div>
            )}

            {activeScreen === 'parent' && profile && (
              <motion.div key="parent" className="absolute inset-0">
                <ParentDashboard profile={profile} />
              </motion.div>
            )}

            {activeScreen === 'profile_stats' && profile && (
              <motion.div key="profile_stats" className="absolute inset-0">
                <ProfileView 
                  profile={profile} 
                  onUpdateProfile={handleUpdateProfile}
                  onResetProgress={handleResetProgress}
                />
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* BOTTOM ACTIVE TAB NAVIGATION BAR SHELL */}
        {profile && activeScreen !== 'welcome' && activeScreen !== 'auth' && activeScreen !== 'quiz' && (
          <div className="bg-white border-t-2 border-slate-100 py-2.5 px-3 flex justify-between items-center shadow-lg z-30 select-none">
            
            {/* Nav Menu: Winding Roadmap */}
            <button
              onClick={() => setActiveScreen('roadmap')}
              className={`flex-1 flex flex-col items-center justify-center transition cursor-pointer ${
                activeScreen === 'roadmap' ? 'text-indigo-650 scale-102 font-black' : 'text-slate-400 font-bold'
              }`}
            >
              <Trophy size={18} fill={activeScreen === 'roadmap' ? 'currentColor' : 'none'} />
              <span className="text-[9px] mt-1 uppercase tracking-tighter">Level Map</span>
            </button>

            {/* Nav Menu: Personal AI Tutor Stitch */}
            <button
              onClick={() => setActiveScreen('tutor')}
              className={`flex-1 flex flex-col items-center justify-center transition cursor-pointer relative ${
                activeScreen === 'tutor' ? 'text-indigo-650 scale-102 font-black' : 'text-slate-400 font-bold'
              }`}
            >
              <GraduationCap size={19} />
              <span className="text-[9px] mt-1 uppercase tracking-tighter">Ask Stitch</span>
              {/* Pulse notification dot */}
              <span className="absolute top-0 right-7 w-2 h-2 bg-pink-500 rounded-full animate-ping" />
            </button>

            {/* Nav Menu: Social leaderboard rankings */}
            <button
              onClick={() => setActiveScreen('leaderboard')}
              className={`flex-1 flex flex-col items-center justify-center transition cursor-pointer ${
                activeScreen === 'leaderboard' ? 'text-indigo-650 scale-102 font-black' : 'text-slate-400 font-bold'
              }`}
            >
              <Users size={18} fill={activeScreen === 'leaderboard' ? 'currentColor' : 'none'} />
              <span className="text-[9px] mt-1 uppercase tracking-tighter">Toppers</span>
            </button>

            {/* Nav Menu: Parent dashboard metrics report */}
            <button
              onClick={() => setActiveScreen('parent')}
              className={`flex-1 flex flex-col items-center justify-center transition cursor-pointer ${
                activeScreen === 'parent' ? 'text-indigo-650 scale-102 font-black' : 'text-slate-400 font-bold'
              }`}
            >
              <Clipboard size={18} fill={activeScreen === 'parent' ? 'currentColor' : 'none'} />
              <span className="text-[9px] mt-1 uppercase tracking-tighter">Parent Hub</span>
            </button>

            {/* Nav Menu: Profile, Settings & log out */}
            <button
              onClick={() => setActiveScreen('profile_stats')}
              className={`flex-1 flex flex-col items-center justify-center transition cursor-pointer ${
                activeScreen === 'profile_stats' ? 'text-indigo-650 scale-102 font-black' : 'text-slate-400 font-bold'
              }`}
            >
              <User size={18} />
              <span className="text-[9px] mt-1 uppercase tracking-tighter">My Stats</span>
            </button>

          </div>
        )}

        {/* GRAND GOLD LEVEL-UP POPUP CELEBRATION MODAL */}
        <AnimatePresence>
          {celebrationDetails?.show && (
            <div className="absolute inset-0 bg-slate-950/50 z-50 flex items-center justify-center p-6 select-none">
              <motion.div
                initial={{ scale: 0.3, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.3, z: -50 }}
                className="bg-white rounded-[32px] p-6 border-4 border-amber-400 shadow-2xl text-center max-w-sm w-full space-y-4"
              >
                <div className="w-24 h-24 bg-amber-50 rounded-full border-4 border-amber-300 inline-flex items-center justify-center text-amber-500 animate-bounce">
                  <CheckCircle size={56} />
                </div>
                
                <h3 className="font-black text-3xl uppercase text-amber-600 tracking-tighter leading-none" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
                  LEVEL UP! 🎉
                </h3>
                
                <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
                  Stunning skill progression, student! You have successfully unlocked study roadmap **Level {celebrationDetails.levelNum + 1}** after conquering **"{celebrationDetails.title}"**!
                </p>

                {/* Star visual badge shelf */}
                <div className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl flex flex-col items-center">
                  <div className="flex space-x-1 mb-1.5">
                    <Star size={16} fill="currentColor" className="text-yellow-400" />
                    <Star size={18} fill="currentColor" className="text-yellow-400 animate-pulse" />
                    <Star size={16} fill="currentColor" className="text-yellow-400" />
                  </div>
                  <span className="text-3xs font-extrabold uppercase tracking-widest text-slate-600">
                    Onwards to become a Topper! ⭐
                  </span>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => setCelebrationDetails(null)}
                    className="w-full py-4.5 rounded-2xl bg-gradient-to-r from-yellow-300 to-orange-500 hover:brightness-105 border-b-4 border-amber-600 text-indigo-900 font-extrabold text-xs tracking-wider uppercase transition active:scale-98 cursor-pointer"
                  >
                    CONTINUE STUDY MAP
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
