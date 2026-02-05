
import React from 'react';
import { Power } from 'lucide-react';

interface StudyButtonProps {
  isActive: boolean;
  onClick: () => void;
}

const StudyButton: React.FC<StudyButtonProps> = ({ isActive, onClick }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-12 py-8">
      <div className="relative">
        {/* Dynamic Glow Background */}
        <div className={`
          absolute inset-0 rounded-full blur-[60px] transition-all duration-1000 opacity-60
          ${isActive ? 'bg-green-500/40 scale-150' : 'bg-blue-600/10 scale-100'}
        `}></div>

        {/* Radar Ring (Visible when active) */}
        {isActive && (
          <div className="absolute inset-[-20px] rounded-full border border-green-500/20 radar-active pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-8 bg-gradient-to-t from-green-500 to-transparent blur-sm"></div>
          </div>
        )}

        {/* Active Session Rings */}
        {isActive && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 rounded-full border-2 border-green-500/30 animate-[ping_2.5s_infinite]"></div>
            <div className="absolute inset-[-15px] rounded-full border border-green-500/10 animate-[ping_2.5s_infinite_0.8s]"></div>
          </div>
        )}
        
        <button
          onClick={onClick}
          className={`
            relative w-64 h-64 rounded-full flex flex-col items-center justify-center 
            transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) border-[6px] tap-scale shadow-2xl
            ${isActive 
              ? 'bg-gradient-to-br from-[#1a2e21] to-[#050b18] border-green-400 text-green-400' 
              : 'bg-gradient-to-br from-[#0d172a] to-[#050b18] border-slate-800/80 text-slate-600 hover:border-blue-500/40 hover:text-blue-400'
            }
          `}
        >
          {/* Inner Shadow Effect for depth */}
          <div className={`
            absolute inset-2 rounded-full border border-white/5 pointer-events-none
            ${isActive ? 'bg-green-500/5' : ''}
          `}></div>

          <div className={`
            p-8 rounded-full transition-all duration-700 shadow-inner
            ${isActive ? 'bg-green-400/10 shadow-[0_0_30px_rgba(74,222,128,0.3)]' : 'bg-slate-900/40'}
          `}>
            <Power className={`w-16 h-16 transition-all duration-700 ${isActive ? 'rotate-0 scale-110' : 'rotate-12 opacity-30'}`} />
          </div>
          
          <div className="mt-6 flex flex-col items-center">
            <span className={`text-[10px] font-black tracking-[0.6em] transition-colors duration-700 ${isActive ? 'text-green-400' : 'text-slate-700'}`}>
              {isActive ? 'SECURED' : 'LOCKED'}
            </span>
            <span className={`text-xs font-black mt-1 transition-all duration-700 ${isActive ? 'text-green-500 opacity-100' : 'text-slate-800 opacity-50'}`}>
              ENCRYPTED SESSION
            </span>
          </div>
        </button>
      </div>

      <div className="flex flex-col items-center space-y-3">
        <div className={`
          px-8 py-3 rounded-2xl text-[10px] font-black tracking-widest transition-all duration-500 uppercase flex items-center space-x-2
          ${isActive 
            ? 'bg-green-500/10 text-green-400 border border-green-400/30' 
            : 'bg-slate-800/50 text-slate-500 border border-slate-700/50'
          }
        `}>
          <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-slate-600'}`}></div>
          <span>{isActive ? 'Session Active' : 'Initialize Focus'}</span>
        </div>
        {!isActive && <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">TAP TO CONNECT STUDY AI</p>}
      </div>
    </div>
  );
};

export default StudyButton;
