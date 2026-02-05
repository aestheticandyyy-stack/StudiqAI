
import React, { useState } from 'react';
import { Layers, Mail, Lock, Github, ArrowRight } from 'lucide-react';
import { User } from '../types';

interface AuthPageProps {
  onLogin: (user: User) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);

  const handleMockLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      isLoggedIn: true
    });
  };

  return (
    <div className="min-h-screen bg-[#050b18] flex flex-col max-w-md mx-auto relative overflow-hidden px-6 pt-20">
      {/* Background decoration */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-900/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>

      <div className="flex flex-col items-center space-y-6 mb-12 z-10 stagger-in">
        <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-blue-600/30 hover:rotate-6 transition-transform cursor-pointer">
          <Layers className="text-white w-10 h-10" />
        </div>
        <div className="text-center">
          <h1 className="text-4xl font-black text-white tracking-tighter mb-1">Studiq <span className="text-blue-500">AI</span></h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">Neural Study Accelerator</p>
        </div>
      </div>

      <div className="glass-card rounded-[3rem] p-10 shadow-2xl z-10 stagger-in">
        <h2 className="text-2xl font-black text-white mb-8 tracking-tight">
          {isSignUp ? 'Create Vault' : 'Welcome Back'}
        </h2>

        <form onSubmit={handleMockLogin} className="space-y-5">
          {isSignUp && (
            <div className="space-y-1.5 group">
              <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest pl-1 group-focus-within:text-blue-500 transition-colors">Identification</label>
              <input 
                type="text" 
                placeholder="Full name" 
                className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 px-5 text-sm text-white outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                required 
              />
            </div>
          )}
          
          <div className="space-y-1.5 group">
            <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest pl-1 group-focus-within:text-blue-500 transition-colors">Access Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="email" 
                placeholder="user@network.com" 
                className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-5 text-sm text-white outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                required 
              />
            </div>
          </div>

          <div className="space-y-1.5 group">
            <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest pl-1 group-focus-within:text-blue-500 transition-colors">Private Key</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-5 text-sm text-white outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                required 
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="group w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-blue-600/20 active:scale-[0.97] mt-4 flex items-center justify-center space-x-2"
          >
            <span>{isSignUp ? 'INITIALIZE ACCOUNT' : 'SECURE SIGN IN'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="relative my-10">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
          <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
            <span className="bg-[#0d172a] px-4 text-slate-600">Protocol Access</span>
          </div>
        </div>

        <button 
          onClick={handleMockLogin}
          className="w-full flex items-center justify-center space-x-3 bg-slate-800 hover:bg-slate-700 text-white py-4 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest border border-slate-700 active:scale-[0.97]"
        >
          <Github className="w-5 h-5" />
          <span>Connect Github</span>
        </button>

        <p className="mt-10 text-center text-xs text-slate-600 font-bold uppercase tracking-wider">
          {isSignUp ? 'Joined the network?' : 'Need an identification?'}{' '}
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-500 hover:underline transition-all"
          >
            {isSignUp ? 'Sign In' : 'Register'}
          </button>
        </p>
      </div>
      
      <p className="mt-auto pb-8 text-center text-[10px] text-slate-600 font-black uppercase tracking-[0.4em] animate-pulse">
        STQD-256 Protocol Secured
      </p>
    </div>
  );
};

export default AuthPage;
