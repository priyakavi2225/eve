/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, Sparkles, Volume2, VolumeX, Cpu, GraduationCap, CornerDownLeft, ArrowLeft 
} from 'lucide-react';
import { StudentProfile } from '../types';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface TutorAssistantProps {
  profile: StudentProfile;
  activeLevelTitle?: string;
  onBackToMap?: () => void;
  onAddXpCoins: (xp: number, coins: number, gems: number) => void;
}

export default function TutorAssistant({ profile, activeLevelTitle, onBackToMap, onAddXpCoins }: TutorAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      sender: 'assistant',
      text: `Hello there, adventurer **${profile.fullName}**! 🍬 Stitch is here and fully powered to demystify complex questions! \n\nWe are currently climbing the study mountains under your **"${profile.studyingFor}"** focus map. Ask me a complex question about science, coding, math, or time management—I'll simplify it instantly!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [ttsSpeechEnabled, setTtsSpeechEnabled] = useState(true);
  const [stitchEmotion, setStitchEmotion] = useState<'smiling' | 'thinking' | 'speaking'>('smiling');
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const speakTextWithVoice = (text: string) => {
    if (!ttsSpeechEnabled || !('speechSynthesis' in window)) return;
    
    // Stop any existing spoken voices to avoid overlapping overlaps
    window.speechSynthesis.cancel();
    
    // Strip markdown formatting characters to keep narration output clear
    const sanitizedText = text
      .replace(/[\*\#\`\_]/g, '')
      .replace(/💎|🟡|🍭|🍬|✨|🚀/g, '')
      .substring(0, 220); // truncate long statements to avoid audio fatigue
    
    const utterance = new SpeechSynthesisUtterance(sanitizedText);
    utterance.rate = 1.05; // slightly swift and energetic
    utterance.pitch = 1.15; // friendly cute higher pitch
    
    utterance.onstart = () => setStitchEmotion('speaking');
    utterance.onend = () => setStitchEmotion('smiling');
    utterance.onerror = () => setStitchEmotion('smiling');
    
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const rawVal = textToSend || inputText;
    if (!rawVal.trim()) return;

    if (!textToSend) setInputText('');

    const userMsg: Message = {
      id: 'user_' + Math.random().toString(36).substring(2, 9),
      sender: 'user',
      text: rawVal,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    setStitchEmotion('thinking');

    try {
      const response = await fetch('/api/tutor/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: rawVal,
          history: messages.slice(-6).map(m => ({ sender: m.sender, text: m.text })),
          levelTitle: activeLevelTitle || 'Introduction',
          studyingFor: profile.studyingFor,
          knowledgeLevel: profile.knowledgeLevel
        })
      });

      const data = await response.json();
      
      const botMsg: Message = {
        id: 'bot_' + Math.random().toString(36).substring(2, 9),
        sender: 'assistant',
        text: data.text || "Oops! Stitch is having a small candy-chewing delay. Ask again, please!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
      speakTextWithVoice(botMsg.text);
      setStitchEmotion('smiling');

      // Award small reward for consulting AI Tutor (limit-controlled on parent state)
      onAddXpCoins(10, 5, 0);

    } catch (e) {
      console.error(e);
      setStitchEmotion('smiling');
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    { label: 'Explain Active Recall 🧪', prompt: 'Stitch, how do I apply Active Recall in my study sessions, and why is it better than reviewing highlighted pages?' },
    { label: 'Build a Pomodoro Plan ⌛', prompt: 'Design a quick study schedule template combining the Pomodoro Technique with sleep hygiene.' },
    { label: 'Examine The Forgetting Curve 📅', prompt: 'Tell me about Hermann Ebbinghaus forgetting curve, and how do I schedule spaced repetitions to bypass it?' }
  ];

  return (
    <div className="relative w-full max-w-xl mx-auto h-[755px] bg-slate-50 border-4 border-white rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between select-none">
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-indigo-650 via-indigo-700 to-violet-750 text-white p-4.5 flex items-center justify-between border-b-2 border-indigo-200/20 shadow-md">
        <div className="flex items-center space-x-3.5">
          {onBackToMap && (
            <button 
              onClick={() => {
                if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                onBackToMap();
              }}
              className="p-1 px-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-indigo-100 transition cursor-pointer flex items-center justify-center"
            >
              <ArrowLeft size={18} />
            </button>
          )}
          <div className="flex flex-col">
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-base tracking-tight" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>PERSONALIZED AI TUTOR</span>
              <span className="bg-amber-450 text-slate-900 text-3xs font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-tighter">Stitch</span>
            </div>
            <span className="text-3xs text-indigo-200 font-bold uppercase tracking-wider">
              🟢 Ready: {profile.studyingFor || 'School'} • {profile.knowledgeLevel || 'Beginner'} map
            </span>
          </div>
        </div>

        {/* Narrate Voice Toggler */}
        <button
          onClick={() => {
            const next = !ttsSpeechEnabled;
            setTtsSpeechEnabled(next);
            if (!next && 'speechSynthesis' in window) window.speechSynthesis.cancel();
          }}
          className={`p-2 rounded-2xl border-b-2 transition ${
            ttsSpeechEnabled 
              ? 'bg-amber-400 text-indigo-900 border-amber-600' 
              : 'bg-white/10 text-indigo-250 border-transparent hover:bg-white/15'
          } cursor-pointer flex items-center justify-center`}
          title={ttsSpeechEnabled ? "Click to mute Stitch's Voice" : "Click to unmute Stitch's Voice"}
        >
          {ttsSpeechEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>
      </div>

      {/* 2. Interactive Speaking Cartoon Mascot "Stitch" Wrapper */}
      <div className="bg-indigo-50 border-b border-indigo-100 p-3 flex items-center justify-between px-5">
        <div className="flex items-center space-x-3">
          {/* Circular mascot bubble */}
          <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-indigo-500 to-indigo-700 p-0.5 border-2 border-white shadow flex-shrink-0 flex items-center justify-center overflow-hidden relative">
            <div className="absolute top-0 left-0 w-8 h-8 rounded-full bg-white/10 blur-md" />
            
            {/* Mascot Face visual state */}
            <div className="flex flex-col items-center justify-center -mt-1 relative scale-90">
              <div className="flex space-x-1.5">
                <motion.div 
                  animate={{ scaleY: stitchEmotion === 'thinking' ? [0.1, 1, 0.1] : 1 }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="w-2.5 h-2.5 bg-white rounded-full flex items-center justify-center"
                >
                  <div className="w-1.5 h-1.5 bg-indigo-900 rounded-full" />
                </motion.div>
                <motion.div 
                  animate={{ scaleY: stitchEmotion === 'thinking' ? [0.1, 1, 0.1] : 1 }}
                  transition={{ repeat: Infinity, duration: 1.5, delay: 0.1 }}
                  className="w-2.5 h-2.5 bg-white rounded-full flex items-center justify-center"
                >
                  <div className="w-1.5 h-1.5 bg-indigo-900 rounded-full" />
                </motion.div>
              </div>

              {/* Speech Beak mouth animation */}
              <motion.div 
                animate={stitchEmotion === 'speaking' ? { scaleY: [1, 1.6, 1], scaleX: [1, 1.2, 1] } : {}}
                transition={{ repeat: Infinity, duration: 0.25 }}
                className="w-3.5 h-2.5 bg-amber-450 rounded-b-lg border border-amber-550 min-h-2 shadow-sm mt-0.5" 
              />
            </div>
          </div>

          <div className="flex flex-col text-left">
            <span className="font-extrabold text-xs text-indigo-950 uppercase tracking-wide">
              {stitchEmotion === 'thinking' ? 'Stitch is assembling sweet facts...' : stitchEmotion === 'speaking' ? 'Stitch is narrating...' : 'Consult Stitch'}
            </span>
            <span className="text-3xs text-gray-400 font-bold">Consubstantiating doubts earns you +10 XP! ⭐</span>
          </div>
        </div>

        {/* Loading Bubble */}
        {loading && (
          <div className="flex space-x-1 bg-white border border-indigo-100 py-1.5 px-3 rounded-xl shadow-sm items-center">
            <Cpu size={12} className="text-indigo-650 animate-spin" />
            <span className="text-3xs font-extrabold text-indigo-950 uppercase animate-pulse">Thinking</span>
          </div>
        )}
      </div>

      {/* 3. Conversations Field */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[465px]">
        {messages.map((m) => {
          const isMe = m.sender === 'user';
          return (
            <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} items-start space-x-2`}>
              
              {/* Bot Icons */}
              {!isMe && (
                <div className="w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center text-white border border-white shadow flex-shrink-0 mt-0.5">
                  <GraduationCap size={14} />
                </div>
              )}

              {/* Text Bubble */}
              <div className={`max-w-[82%] p-3 px-4.5 rounded-2xl text-xs font-semibold leading-relaxed shadow-sm ${
                isMe 
                  ? 'bg-indigo-650 text-white rounded-tr-none border-b-2 border-indigo-805' 
                  : 'bg-white text-slate-800 border border-slate-150 rounded-tl-none border-b-2 border-slate-205'
              }`}>
                {/* Visual support for formatted custom blocks */}
                <div className="whitespace-pre-line">
                  {m.text}
                </div>
                <div className={`text-4xs mt-1.5 flex items-center ${isMe ? 'text-indigo-250 justify-end' : 'text-slate-400 justify-start'}`}>
                  <span>{m.timestamp}</span>
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex justify-start items-center space-x-2">
            <div className="w-7 h-7 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 border border-white shadow flex-shrink-0 animate-pulse" />
            <div className="bg-slate-200 text-slate-500 p-2.5 px-4 rounded-2xl text-2xs animate-pulse max-w-xs font-extrabold flex items-center space-x-1">
              <span>🍭 Stitch is chewing concept recipes</span>
              <span className="animate-bounce">.</span>
              <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
              <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>.</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* 4. Study doubts catalysts / suggestion pills */}
      <div className="px-4 py-2 flex space-x-2 overflow-x-auto bg-slate-100/50 border-t border-slate-200 whitespace-nowrap scrollbar-none">
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(p.prompt)}
            disabled={loading}
            className="bg-white hover:bg-slate-50 disabled:opacity-50 text-indigo-700 hover:text-indigo-800 border border-slate-200 rounded-full py-1.5 px-3 text-3xs font-extrabold shadow-sm transition-all focus:outline-none cursor-pointer flex items-center space-x-1"
          >
            <Sparkles size={10} className="text-amber-500" />
            <span>{p.label}</span>
          </button>
        ))}
      </div>

      {/* 5. Inputs Field */}
      <div className="p-3.5 bg-white border-t border-slate-150 flex items-center space-x-2 z-10">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
          className="w-full flex items-center bg-slate-5 w-full bg-slate-50 rounded-2xl border border-slate-200 px-3 py-1 text-sm focus-within:ring-2 focus-within:ring-indigo-400 focus-within:bg-white transition-all pr-1"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={loading}
            placeholder={loading ? "Cheathing formulas..." : "Ask doubt (e.g., 'How do I bypass forgetting?')"}
            className="w-full bg-transparent py-3 px-1.5 focus:outline-none text-slate-805 disabled:opacity-50 font-bold"
          />
          <button
            type="submit"
            disabled={loading || !inputText.trim()}
            className="p-2.5 rounded-xl bg-indigo-650 hover:bg-indigo-700 disabled:opacity-40 text-white shadow-md flex items-center justify-center transition cursor-pointer"
          >
            <Send size={15} />
          </button>
        </form>
      </div>
    </div>
  );
}
