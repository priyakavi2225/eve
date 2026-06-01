/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, Lock, User, Phone, CheckCircle, ArrowRight, Globe, Book, Sparkles, AlertCircle, ShieldAlert
} from 'lucide-react';
import { StudentProfile, StudyLevel, KnowledgeLevel } from '../types';
import { saveProfileToDatabase, isFirebaseActive } from '../firebase';

interface AuthScreensProps {
  onSuccess: (profile: StudentProfile) => void;
}

type ScreenMode = 'login' | 'signup' | 'profile_setup' | 'verification' | 'success';

export default function AuthScreens({ onSuccess }: AuthScreensProps) {
  const [mode, setMode] = useState<ScreenMode>('signup');
  const [error, setError] = useState<string | null>(null);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Profile Setup Fields
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [studyingFor, setStudyingFor] = useState<StudyLevel>('School');
  const [knowledgeLevel, setKnowledgeLevel] = useState<KnowledgeLevel>('Beginner');

  // Verification
  const [otpCode, setOtpCode] = useState(['', '', '', '']);

  // Built Profile Holder
  const [profile, setProfile] = useState<StudentProfile | null>(null);

  const handleNextMode = (next: ScreenMode) => {
    setError(null);
    setMode(next);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both Email and Password fields.');
      return;
    }

    // Authenticate / Load Profile (Simulated, offline sync default)
    const mockProfile: StudentProfile = {
      uid: 'student_' + Math.random().toString(36).substring(2, 9),
      fullName: email.split('@')[0].toUpperCase(),
      email: email,
      mobileNumber: '9988776655',
      language: 'English',
      studyingFor: 'Coding',
      knowledgeLevel: 'Beginner',
      currentLevel: 1,
      xp: 220,
      coins: 150,
      gems: 15,
      streak: 3,
      verified: true,
      unlockedBadges: ['fast_learner'],
      completedLevels: []
    };
    
    saveProfileToDatabase(mockProfile).then(() => {
      onSuccess(mockProfile);
    });
  };

  const handleSignUpAndNext = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName || !email || !mobileNumber || !password || !confirmPassword) {
      setError('A true Topper fills out all signup boxes! Please complete all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Make sure they are identical!');
      return;
    }

    if (password.length < 6) {
      setError('Your password shield needs to be at least 6 characters long.');
      return;
    }

    handleNextMode('profile_setup');
  };

  const handleProfileSetupSubmit = () => {
    // Generate new secure unique identifier
    const uid = 'student_' + Math.random().toString(36).substring(2, 9);
    
    const newProfile: StudentProfile = {
      uid,
      fullName,
      email,
      mobileNumber,
      language: selectedLanguage,
      studyingFor,
      knowledgeLevel,
      currentLevel: 1,
      xp: 150, // Initial onboarding reward
      coins: 100,
      gems: 10,
      streak: 1,
      verified: false,
      lastActiveDate: new Date().toISOString().split('T')[0],
      unlockedBadges: ['fast_learner'], // award first onboarding badge
      completedLevels: []
    };

    setProfile(newProfile);
    handleNextMode('verification');
  };

  const handleOtpInput = (val: string, index: number) => {
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otpCode];
    newOtp[index] = val;
    setOtpCode(newOtp);

    // Auto focus next box
    if (val && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const verifyOtpAndDone = () => {
    const fullOtp = otpCode.join('');
    if (fullOtp.length < 4) {
      setError('Please enter the entire 4-digit code sent to your device.');
      return;
    }

    if (profile) {
      const verifiedProfile = { ...profile, verified: true };
      setProfile(verifiedProfile);
      
      // Save to Firebase (or offline local storage index mapping)
      saveProfileToDatabase(verifiedProfile).then(() => {
        handleNextMode('success');
      });
    }
  };

  const languages = ['English', 'Tamil', 'Hindi', 'Telugu', 'Malayalam', 'Kannada', 'Spanish', 'French'];
  const studyLevels: StudyLevel[] = ['School', 'Diploma', 'Undergraduate', 'Postgraduate', 'Competitive Exams', 'Coding', 'Skill Development'];
  const knowledgeLevels: KnowledgeLevel[] = ['Beginner', 'Intermediate', 'Advanced'];

  return (
    <div className="min-h-screen py-8 px-4 flex flex-col justify-center items-center bg-gradient-to-br from-indigo-50 via-sky-50 to-violet-50 select-none">
      
      {/* Visual Header Banner */}
      <div className="w-full max-w-md text-center mb-6">
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 tracking-tight" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
          {mode === 'login' ? 'Welcome Back!' : mode === 'signup' ? 'Join Stitch AI' : mode === 'profile_setup' ? 'Your Learn Space' : 'Security Check'}
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          {mode === 'login' && 'Unlock your mountain map to resume earning XP coins.'}
          {mode === 'signup' && 'Create your Topper credential and access gamified courses.'}
          {mode === 'profile_setup' && 'Help Stitch prepare highly personalized material.'}
          {mode === 'verification' && 'Verify your student account to sync across devices.'}
        </p>
      </div>

      {/* Primary Container Card */}
      <div className="w-full max-w-md bg-white border border-gray-100 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        
        {/* Subtle decorative bubble gradient */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-500/5 rounded-full blur-2xl pointer-events-none" />

        {/* Warning Indicator when Firebase is offline / in fallback mode */}
        {!isFirebaseActive && (mode === 'signup' || mode === 'login') && (
          <div className="mb-4 text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 rounded-xl py-2 px-3 flex items-center space-x-2">
            <ShieldAlert size={14} className="flex-shrink-0" />
            <span>Local mode active. Start instantly, connection ready!</span>
          </div>
        )}

        {error && (
          <div className="mb-4 bg-rose-50 text-rose-700 border border-rose-200 text-sm rounded-2xl p-3 flex items-start space-x-2.5 animate-pulse">
            <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
            <span className="font-semibold leading-relaxed">{error}</span>
          </div>
        )}

        <AnimatePresence mode="wait">
          
          {/* LOGIN SCREEN */}
          {mode === 'login' && (
            <motion.form
              key="login"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              onSubmit={handleLogin}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 ml-1">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="topper@example.com"
                    className="w-full bg-slate-50 border border-slate-200 text-gray-800 rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 ml-1">Secret Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-200 text-gray-800 rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-4 rounded-2xl bg-indigo-650 hover:bg-indigo-700 active:indigo-800 text-white font-black text-sm tracking-wide transition-all shadow-md cursor-pointer"
              >
                UNLOCK ADVENTURE ROAD
              </button>

              <div className="text-center pt-2">
                <span className="text-xs text-gray-400">First time studying with Stitch? </span>
                <button
                  type="button"
                  onClick={() => handleNextMode('signup')}
                  className="text-xs font-bold text-indigo-600 hover:underline"
                >
                  Create an account
                </button>
              </div>
            </motion.form>
          )}

          {/* SIGN UP SCREEN */}
          {mode === 'signup' && (
            <motion.form
              key="signup"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              onSubmit={handleSignUpAndNext}
              className="space-y-3.5"
            >
              <div>
                <label className="block text-xs font-bold text-gray-750 uppercase tracking-widest mb-1 ml-1">Student Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Rohan Sharma"
                    className="w-full bg-slate-50 border border-slate-200 text-gray-800 rounded-2xl py-3 pl-10 pr-4 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-750 uppercase tracking-widest mb-1 ml-1">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@stitch.ai"
                    className="w-full bg-slate-50 border border-slate-200 text-gray-800 rounded-2xl py-3 pl-10 pr-4 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-750 uppercase tracking-widest mb-1 ml-1">Mobile Contact Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="tel"
                    required
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="9876543210"
                    className="w-full bg-slate-50 border border-slate-200 text-gray-800 rounded-2xl py-3 pl-10 pr-4 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-750 uppercase tracking-widest mb-1 ml-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border border-slate-200 text-gray-800 rounded-2xl py-3 pl-8.5 pr-3 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-750 uppercase tracking-widest mb-1 ml-1">Confirm</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border border-slate-200 text-gray-800 rounded-2xl py-3 pl-8.5 pr-3 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-3 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-650 to-violet-600 hover:brightness-105 active:scale-98 text-white font-black text-sm tracking-wide transition shadow-lg flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>SETUP STUDY PREFERENCES</span>
                <ArrowRight size={16} />
              </button>

              <div className="text-center pt-2">
                <span className="text-xs text-gray-400">Already registered? </span>
                <button
                  type="button"
                  onClick={() => handleNextMode('login')}
                  className="text-xs font-bold text-indigo-600 hover:underline"
                >
                  Sign in instead
                </button>
              </div>
            </motion.form>
          )}

          {/* STUDENT PROFILE SETUP */}
          {mode === 'profile_setup' && (
            <motion.div
              key="profile_setup"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-5"
            >
              {/* Option 1: Select Language */}
              <div>
                <span className="text-xs font-black uppercase text-gray-400 tracking-widest flex items-center mb-2.5">
                  <Globe className="text-indigo-500 mr-1.5" size={16} />
                  1. Prefer Studying In
                </span>
                <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
                  {languages.map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setSelectedLanguage(lang)}
                      className={`py-2 px-3.5 rounded-xl border-2 text-sm text-left transition font-bold ${
                        selectedLanguage === lang
                          ? 'border-indigo-650 bg-indigo-50 text-indigo-800'
                          : 'border-slate-100 bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              {/* Option 2: What are you studying? */}
              <div>
                <span className="text-xs font-black uppercase text-gray-400 tracking-widest flex items-center mb-2.5">
                  <Book className="text-pink-500 mr-1.5" size={16} />
                  2. Targeted Study Focus Area
                </span>
                <div className="grid grid-cols-1 gap-2 max-h-44 overflow-y-auto pr-1">
                  {studyLevels.map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setStudyingFor(lvl)}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${
                        studyingFor === lvl
                          ? 'border-indigo-650 bg-gradient-to-r from-indigo-50 to-sky-50 text-indigo-900 shadow-sm'
                          : 'border-slate-100 bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <div className="font-bold text-sm">{lvl}</div>
                      <div className="text-2xs text-gray-400 mt-0.5">Adapt Stitch to build dynamic learning maps for {lvl.toLowerCase()}.</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Option 3: Knowledge Level */}
              <div>
                <span className="text-xs font-black uppercase text-gray-400 tracking-widest flex items-center mb-2.5">
                  <Sparkles className="text-amber-500 mr-1.5" size={16} />
                  3. Active Knowledge Level
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {knowledgeLevels.map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setKnowledgeLevel(lvl)}
                      className={`py-3 px-2 rounded-xl border-2 text-center transition font-black text-xs ${
                        knowledgeLevel === lvl
                          ? 'border-indigo-600 bg-indigo-650 text-white shadow-md'
                          : 'border-slate-100 bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleNextMode('signup')}
                  className="w-1/3 py-3 rounded-2xl border-2 border-slate-200 text-gray-500 font-bold hover:bg-slate-50 transition"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleProfileSetupSubmit}
                  className="w-2/3 py-3 rounded-2xl bg-indigo-650 hover:bg-indigo-700 active:indigo-800 text-white font-extrabold text-sm tracking-wide transition shadow-md flex items-center justify-center space-x-2"
                >
                  <span>LOCK IN & REGISTER</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {/* VERIFICATION PAGE */}
          {mode === 'verification' && (
            <motion.div
              key="verification"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-4 text-center"
            >
              <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl inline-flex items-center justify-center text-indigo-650">
                <Phone size={36} />
              </div>
              <h3 className="font-extrabold text-lg text-gray-800">Phone & Email Verification Code</h3>
              <p className="text-xs text-gray-400">We sent a four-digit educational pass code to {mobileNumber || 'your phone'} & {email || 'your email'}. Enter it to unlock synchronization.</p>
              
              {/* OTP Digits */}
              <div className="flex justify-center space-x-3 pt-2">
                {otpCode.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpInput(e.target.value, index)}
                    className="w-14 h-14 bg-slate-50 border-2 border-slate-200 rounded-xl text-center text-xl font-bold text-indigo-600 focus:border-indigo-500 focus:bg-white focus:outline-none transition-all"
                  />
                ))}
              </div>

              <div className="text-xs text-indigo-600 font-bold pt-2 cursor-pointer hover:underline" onClick={() => setOtpCode(['5', '4', '8', '2'])}>
                💡 Hint: Click here to autofill verification code [5482]
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => handleNextMode('profile_setup')}
                  className="w-1/3 py-3 rounded-xl border-2 border-slate-200 text-gray-400 font-bold hover:bg-slate-50 transition"
                >
                  Edit profile
                </button>
                <button
                  type="button"
                  onClick={verifyOtpAndDone}
                  className="w-2/3 py-3 rounded-xl bg-emerald-580 hover:bg-emerald-600 text-white font-extrabold text-sm tracking-wide transition shadow-lg flex items-center justify-center space-x-2"
                  style={{ backgroundColor: '#10B981' }}
                >
                  <span>CONFIRM VERIFICATION</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* VERIFICATION SUCCESS CELEBRATION */}
          {mode === 'success' && (
            <motion.div
              key="success"
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-6 space-y-4"
            >
              <div className="w-24 h-24 bg-emerald-50 rounded-full border-4 border-emerald-300 inline-flex items-center justify-center text-emerald-500 animate-bounce">
                <CheckCircle size={56} />
              </div>
              <h3 className="font-extrabold text-2xl text-emerald-900 leading-tight">Verification Success!</h3>
              <p className="text-sm text-gray-500 max-w-xs mx-auto leading-relaxed">
                Congratulations, Topper **{fullName || 'Student'}**! You have successfully established secure cloud synchronization credentials. 
                Your initial profile setup has awarded you:
              </p>

              {/* Candy Crush Trophy Rewards Card */}
              <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-55 rounded-2xl border-2 border-amber-200 inline-flex flex-col space-y-3.5 shadow-sm max-w-xs w-full">
                <div className="text-center font-bold text-xs uppercase tracking-wider text-amber-700">Onboarding Treasures Claimed:</div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-white p-2.5 rounded-xl border border-amber-100 flex flex-col items-center">
                    <span className="text-lg font-extrabold text-indigo-650">150</span>
                    <span className="text-3xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">⭐ XP</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-amber-100 flex flex-col items-center">
                    <span className="text-lg font-extrabold text-amber-550">100</span>
                    <span className="text-3xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">🟡 Coins</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-amber-100 flex flex-col items-center">
                    <span className="text-lg font-extrabold text-violet-650">10</span>
                    <span className="text-3xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">💎 Gems</span>
                  </div>
                </div>
                <div className="text-2xs text-gray-500 font-bold bg-white px-2 py-1.5 rounded-lg border border-yellow-200">
                  🏆 Unlocked Badge: **"Fast Learner"** Added to achievements!
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (profile) onSuccess(profile);
                }}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-650 to-violet-600 hover:brightness-105 text-white text-base font-black tracking-wider transition shadow-md cursor-pointer"
              >
                ENTER ADVOCACY MAP
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
