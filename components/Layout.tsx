
import React from 'react';
import { Home, Sparkles, Layers, HelpCircle, History, LogIn, User as UserIcon } from 'lucide-react';
import { AppTab, User } from '../types';

interface LayoutProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  user: User | null;
  onLogout: () => void;
  onLogin: () => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ activeTab, setActiveTab, user, onLogout, onLogin, children }) => {
  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto relative overflow-hidden bg-[#050b18]">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-blue-600/5 to-transparent pointer-events-none"></div>

      {/* Header */}
      <header className="p-6 flex items-center justify-between z-10 animate-fade-in">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20 hover:rotate-6 transition-transform cursor-pointer">
            <Layers className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tighter">Studiq <span className="text-blue-500">AI</span></h1>
            <p className="text-[10px] text-slate-500 font-bold tracking-[0.2em] uppercase">Enterprise</p>
          </div>
        </div>
        
        {user?.isLoggedIn ? (
          <button 
            onClick={onLogout}
            className="flex items-center space-x-2 bg-slate-800/40 hover:bg-slate-700/60 p-2.5 rounded-2xl transition-all tap-scale border border-slate-700/50"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white">
              <UserIcon className="w-4 h-4" />
            </div>
          </button>
        ) : (
          <button 
            onClick={onLogin}
            className="bg-blue-600 hover:bg-blue-500 px-6 py-2.5 rounded-2xl transition-all shadow-lg shadow-blue-600/20 font-black text-[10px] uppercase tracking-widest text-white tap-scale"
          >
            Authorize
          </button>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto px-6 pb-28 z-0 scrollbar-hide">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-6 left-6 right-6 max-w-[calc(theme(maxWidth.md)-3rem)] mx-auto bg-[#0a1221]/80 backdrop-blur-2xl border border-white/5 px-4 py-3 rounded-[2rem] z-50 shadow-2xl animate-slide-up">
        <div className="flex items-center justify-around">
          <NavButton active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={<Home />} label="Home" />
          <NavButton active={activeTab === 'ai'} onClick={() => setActiveTab('ai')} icon={<Sparkles />} label="AI" />
          <NavButton active={activeTab === 'cards'} onClick={() => setActiveTab('cards')} icon={<Layers />} label="Cards" />
          <NavButton active={activeTab === 'quiz'} onClick={() => setActiveTab('quiz')} icon={<HelpCircle />} label="Quiz" />
          <NavButton active={activeTab === 'log'} onClick={() => setActiveTab('log')} icon={<History />} label="Logs" />
        </div>
      </nav>
      
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

const NavButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center space-y-1.5 transition-all duration-500 tap-scale relative px-3 py-1`}
  >
    <div className={`p-2 rounded-xl transition-all duration-500 ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-500 hover:text-slate-400'}`}>
      {React.cloneElement(icon as React.ReactElement, { size: 20, strokeWidth: active ? 2.5 : 2 })}
    </div>
    <span className={`text-[8px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${active ? 'text-blue-500 opacity-100' : 'text-slate-600 opacity-0'}`}>{label}</span>
    {active && <div className="absolute -bottom-1 w-1 h-1 bg-blue-500 rounded-full animate-fade-in"></div>}
  </button>
);

export default Layout;
