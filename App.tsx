
import React, { useState, useEffect, useRef } from 'react';
import Layout from './components/Layout';
import StudyButton from './components/StudyButton';
import AuthPage from './components/AuthPage';
import { User, AppTab, StudySession, Flashcard, QuizQuestion } from './types';
import { Sparkles, MessageSquare, BookOpen, Brain, CreditCard, Clock, History, HelpCircle, ChevronRight, Upload, X, Globe, Send, Image as ImageIcon } from 'lucide-react';
import { aiService } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [user, setUser] = useState<User | null>(null);
  const [isStudyActive, setIsStudyActive] = useState(false);
  const [studyTime, setStudyTime] = useState(0); 
  const [totalStudyTime, setTotalStudyTime] = useState(0);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  
  const [aiContext, setAiContext] = useState('');
  const [aiImage, setAiImage] = useState<string | null>(null);
  const [aiLanguage, setAiLanguage] = useState('English');
  const [aiMode, setAiMode] = useState<'chat' | 'summarize'>('chat');
  const [messages, setMessages] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    let interval: any;
    if (isStudyActive) {
      interval = setInterval(() => {
        setStudyTime(prev => prev + 1);
      }, 1000);
    } else {
      if (studyTime > 0) {
        setTotalStudyTime(prev => prev + studyTime);
        setSessions(prev => [{ startTime: Date.now() - (studyTime * 1000), duration: studyTime, active: false }, ...prev]);
        setStudyTime(0);
      }
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isStudyActive]);

  const handleToggleStudy = () => setIsStudyActive(!isStudyActive);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAiImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const generateAIResponse = async (text: string) => {
    if (!text && !aiImage) return;
    setIsTyping(true);
    const newMsg = { role: 'user', content: text, image: aiImage, timestamp: Date.now() };
    setMessages(prev => [...prev, newMsg]);
    setAiImage(null);
    
    try {
      const response = await aiService.getModelResponse(text || "Please analyze this context.", aiImage || undefined, aiLanguage);
      setMessages(prev => [...prev, { role: 'assistant', content: response, timestamp: Date.now() }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error. Please try again.", timestamp: Date.now() }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleGenerateSummary = async () => {
    if (!aiContext && !aiImage) return;
    setIsGenerating(true);
    try {
      const summary = await aiService.generateSummary(aiContext, aiImage || undefined);
      setMessages(prev => [...prev, { role: 'assistant', content: `**ENGINE SUMMARY:**\n\n${summary}`, timestamp: Date.now() }]);
      setAiMode('chat');
    } catch (e) {
      alert("Analysis Failed");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateFlashcards = async () => {
    if (!aiContext && !aiImage) {
      alert("Please provide engine context first.");
      return;
    }
    setIsGenerating(true);
    try {
      const cards = await aiService.generateFlashcards(aiContext || "Study content.");
      setFlashcards(cards.map((c, i) => ({ id: `card-${i}-${Date.now()}`, ...c })));
      setActiveTab('cards');
    } catch (e) {
      alert("Failed to build cards");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!aiContext && !aiImage) {
      alert("Please provide engine context first.");
      return;
    }
    setIsGenerating(true);
    try {
      const questions = await aiService.generateQuiz(aiContext || "Study content.");
      setQuizQuestions(questions.map((q, i) => ({ id: `q-${i}-${Date.now()}`, ...q })));
      setActiveTab('quiz');
    } catch (e) {
      alert("Failed to build quiz");
    } finally {
      setIsGenerating(false);
    }
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  };

  if (!user) return <AuthPage onLogin={(u) => setUser(u)} />;

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} user={user} onLogout={() => setUser(null)} onLogin={() => {}}>
      <div className="mt-4 animate-fade-in key={activeTab}">
        
        {activeTab === 'home' && (
          <div className="flex flex-col space-y-8 stagger-in">
            <div className="text-center space-y-1">
              <span className="inline-block px-4 py-1.5 bg-blue-500/10 text-blue-500 text-[10px] font-black rounded-full border border-blue-500/20 tracking-[0.2em] uppercase mb-1">
                SECURE FOCUS ENVIRONMENT
              </span>
              <h2 className="text-4xl font-black text-white tracking-tighter">Command Center</h2>
            </div>

            <StudyButton isActive={isStudyActive} onClick={handleToggleStudy} />

            <div className="grid grid-cols-2 gap-5">
              <div className="glass-card p-6 rounded-[2.5rem] flex flex-col items-center justify-center hover-lift">
                <div className="p-3 bg-blue-600/10 rounded-2xl mb-3"><Clock className="text-blue-500 w-6 h-6" /></div>
                <span className="text-[10px] text-slate-600 uppercase font-black tracking-widest">Active Focus</span>
                <span className="text-2xl font-black text-white mt-1 tabular-nums">{formatTime(studyTime)}</span>
              </div>
              <div className="glass-card p-6 rounded-[2.5rem] flex flex-col items-center justify-center hover-lift">
                <div className="p-3 bg-green-500/10 rounded-2xl mb-3"><History className="text-green-500 w-6 h-6" /></div>
                <span className="text-[10px] text-slate-600 uppercase font-black tracking-widest">Global Log</span>
                <span className="text-2xl font-black text-white mt-1 tabular-nums">{formatTime(totalStudyTime)}</span>
              </div>
            </div>

            <div className="glass-card p-8 rounded-[3rem] relative overflow-hidden group hover-lift border-white/5">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-600/5 rounded-full blur-[80px] group-hover:bg-blue-600/15 transition-all duration-1000"></div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-black text-xl tracking-tight">Focus Mastery</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">3 Day Consecutive Streak</p>
                </div>
                <div className="bg-blue-600/20 px-3 py-1.5 rounded-xl text-blue-400 text-[10px] font-black uppercase">Elite</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex space-x-2.5">
                  {[1, 1, 1, 0, 0, 0, 0].map((v, i) => (
                    <div key={i} className={`w-9 h-9 rounded-2xl flex items-center justify-center text-[10px] font-black transition-all duration-500 ${v ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-800/50 text-slate-600'}`}>
                      {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="flex flex-col h-[calc(100vh-190px)] stagger-in">
            <div className="flex items-center justify-between mb-5">
              <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-slate-800">
                <button 
                  onClick={() => setAiMode('chat')}
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all tap-scale ${aiMode === 'chat' ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  Neural Chat
                </button>
                <button 
                  onClick={() => setAiMode('summarize')}
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all tap-scale ${aiMode === 'summarize' ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  Logic Engine
                </button>
              </div>
              
              <div className="flex items-center space-x-2 text-slate-500 glass-card px-4 py-2.5 rounded-2xl hover:border-slate-600 transition-colors">
                <Globe className="w-4 h-4" />
                <select 
                  value={aiLanguage} 
                  onChange={(e) => setAiLanguage(e.target.value)}
                  className="bg-transparent text-[10px] font-black uppercase tracking-[0.1em] outline-none border-none cursor-pointer text-blue-500"
                >
                  <option value="English">EN</option>
                  <option value="Spanish">ES</option>
                  <option value="French">FR</option>
                  <option value="German">DE</option>
                </select>
              </div>
            </div>

            {aiMode === 'chat' ? (
              <div className="flex-1 flex flex-col glass-card rounded-[3rem] overflow-hidden relative border-white/5">
                <div className="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-hide">
                  {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-6">
                      <div className="w-24 h-24 bg-blue-600/10 rounded-[2.5rem] flex items-center justify-center text-blue-500">
                        <MessageSquare className="w-12 h-12" />
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-black text-white text-xl tracking-tight">Initialize Neural Link</h4>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-[220px] mx-auto">Upload diagrams or paste notes for real-time cognitive assistance.</p>
                      </div>
                    </div>
                  )}
                  {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up-fade`} style={{ animationDelay: `${i * 0.05}s` }}>
                      <div className={`max-w-[88%] p-5 rounded-[1.8rem] text-sm leading-relaxed ${m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none shadow-xl shadow-blue-600/20' : 'bg-slate-800/80 text-slate-100 rounded-tl-none border border-slate-700/50 shadow-lg'}`}>
                        {m.image && <img src={m.image} alt="uploaded" className="mb-4 rounded-2xl w-full max-h-56 object-cover shadow-inner" />}
                        <p className="whitespace-pre-wrap font-medium">{m.content}</p>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-slate-800/80 p-5 rounded-[1.8rem] rounded-tl-none flex space-x-2 items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-5 border-t border-slate-800/50 bg-[#0d172a]/60 backdrop-blur-md">
                  {aiImage && (
                    <div className="mb-4 relative inline-block">
                      <img src={aiImage} alt="preview" className="w-20 h-20 rounded-2xl object-cover border-2 border-blue-500 shadow-2xl" />
                      <button onClick={() => setAiImage(null)} className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1.5 shadow-xl hover:scale-110 transition-transform"><X size={14}/></button>
                    </div>
                  )}
                  <div className="flex items-center space-x-3">
                    <button onClick={() => fileInputRef.current?.click()} className="p-4 text-slate-500 hover:text-white transition-all bg-slate-800/40 rounded-2xl tap-scale border border-slate-700/30">
                      <ImageIcon className="w-5 h-5" />
                    </button>
                    <input 
                      type="text"
                      placeholder="Input neural query..."
                      className="flex-1 bg-slate-800/40 border border-slate-700/30 rounded-2xl px-6 py-4 text-sm outline-none focus:border-blue-500 focus:bg-slate-800 transition-all text-white font-bold"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const val = e.currentTarget.value;
                          if (val || aiImage) {
                            e.currentTarget.value = '';
                            generateAIResponse(val);
                          }
                        }
                      }}
                    />
                    <button 
                      onClick={() => {
                        const input = document.querySelector('input[type="text"]') as HTMLInputElement;
                        if (input.value || aiImage) {
                          generateAIResponse(input.value);
                          input.value = '';
                        }
                      }}
                      className="bg-blue-600 p-4.5 rounded-2xl hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/30 text-white tap-scale"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 glass-card rounded-[3rem] p-10 flex flex-col space-y-6 shadow-2xl relative overflow-hidden">
                <div className="flex-1 flex flex-col space-y-5">
                  <div className="flex items-center space-x-5">
                    <div className="w-14 h-14 bg-blue-600/10 rounded-[1.5rem] flex items-center justify-center text-blue-500 shadow-inner">
                      <Brain className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="font-black text-2xl tracking-tight">Analysis Hub</h3>
                      <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.3em]">Processing Protocol 04-A</p>
                    </div>
                  </div>
                  
                  <div className={`relative flex-1 ${isGenerating ? 'scanning-effect' : ''}`}>
                    <textarea 
                      value={aiContext}
                      onChange={(e) => setAiContext(e.target.value)}
                      placeholder="Paste research data or lectures for cognitive mapping..."
                      className="w-full h-full bg-slate-900/40 border border-slate-800 rounded-[2rem] p-8 text-sm text-slate-300 outline-none focus:border-blue-500 transition-all resize-none font-bold leading-relaxed shadow-inner"
                    />
                  </div>
                  
                  {aiImage && (
                    <div className="relative w-28 h-28">
                      <img src={aiImage} alt="upload" className="w-full h-full object-cover rounded-[1.5rem] border-2 border-blue-500 shadow-2xl" />
                      <button onClick={() => setAiImage(null)} className="absolute -top-3 -right-3 bg-slate-800 rounded-full p-2 shadow-xl"><X size={14}/></button>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-5 pt-3">
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center justify-center space-x-3 bg-slate-800 hover:bg-slate-700 py-5 rounded-[1.5rem] text-[10px] font-black tracking-widest uppercase transition-all border border-slate-700 tap-scale"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Context</span>
                    </button>
                    <button 
                      disabled={isGenerating || (!aiContext && !aiImage)}
                      onClick={handleGenerateSummary}
                      className="flex items-center justify-center space-x-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 py-5 rounded-[1.5rem] text-[10px] font-black tracking-widest uppercase transition-all shadow-xl shadow-blue-600/30 text-white tap-scale"
                    >
                      {isGenerating ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Sparkles className="w-4 h-4" />}
                      <span>Sync Link</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
          </div>
        )}

        {activeTab === 'cards' && (
          <div className="flex flex-col space-y-8 stagger-in">
            <div className="flex items-center justify-between">
              <h2 className="text-4xl font-black tracking-tighter">Memory Deck</h2>
              <button 
                onClick={handleGenerateFlashcards}
                className="bg-blue-600/10 text-blue-500 border border-blue-500/30 px-5 py-2.5 rounded-2xl text-[10px] font-black tracking-widest uppercase hover:bg-blue-600 hover:text-white transition-all tap-scale"
              >
                <span>Synchronize</span>
              </button>
            </div>

            {flashcards.length === 0 ? (
              <div className="glass-card rounded-[3rem] p-20 text-center flex flex-col items-center space-y-8">
                <div className="w-24 h-24 bg-blue-600/10 rounded-[2.5rem] flex items-center justify-center text-blue-500">
                  <CreditCard className="w-12 h-12" />
                </div>
                <p className="text-slate-600 text-xs font-black uppercase tracking-widest leading-relaxed max-w-[180px]">No Active Flashcards. Use Logic Engine.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-8 pb-32 px-1">
                {flashcards.map((card, idx) => (
                  <FlipCard key={card.id} front={card.front} back={card.back} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'quiz' && (
          <div className="flex flex-col space-y-8 stagger-in">
            <div className="flex items-center justify-between">
              <h2 className="text-4xl font-black tracking-tighter">Stress Test</h2>
              <button 
                onClick={handleGenerateQuiz}
                className="bg-blue-600/10 text-blue-500 border border-blue-500/30 px-5 py-2.5 rounded-2xl text-[10px] font-black tracking-widest uppercase hover:bg-blue-600 hover:text-white transition-all tap-scale"
              >
                <span>Run Protocol</span>
              </button>
            </div>

            {quizQuestions.length === 0 ? (
              <div className="glass-card rounded-[3rem] p-20 text-center flex flex-col items-center space-y-8">
                <div className="w-24 h-24 bg-blue-600/10 rounded-[2.5rem] flex items-center justify-center text-blue-500">
                  <HelpCircle className="w-12 h-12" />
                </div>
                <p className="text-slate-600 text-xs font-black uppercase tracking-widest leading-relaxed max-w-[180px]">Evaluation Pending. Inject Context.</p>
              </div>
            ) : (
              <div className="space-y-8 pb-32 px-1">
                {quizQuestions.map((q, qIdx) => (
                  <div key={q.id} className="glass-card p-10 rounded-[2.5rem] space-y-8 shadow-2xl border-white/5">
                    <div className="space-y-3">
                      <span className="text-blue-500 text-[10px] font-black tracking-[0.4em] uppercase">Examination {qIdx + 1}</span>
                      <p className="font-black text-white text-xl leading-tight tracking-tight">{q.question}</p>
                    </div>
                    <div className="space-y-4">
                      {q.options.map((opt, oIdx) => (
                        <button 
                          key={oIdx}
                          onClick={() => {
                            if (oIdx === q.correctAnswer) alert("Correct! 🎉");
                            else alert(`Incorrect. Correct Answer: ${q.options[q.correctAnswer]}`);
                          }}
                          className="w-full text-left bg-slate-900/40 hover:bg-blue-600/10 p-5 rounded-2xl text-sm font-bold transition-all border border-slate-800/80 flex items-center justify-between group tap-scale"
                        >
                          <span className="text-slate-400 group-hover:text-blue-400">{opt}</span>
                          <ChevronRight className="w-5 h-5 text-slate-700 group-hover:text-blue-500 transition-all" />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'log' && (
          <div className="flex flex-col space-y-8 stagger-in">
            <h2 className="text-4xl font-black tracking-tighter">Registry</h2>
            {sessions.length === 0 ? (
              <div className="glass-card rounded-[3rem] p-20 text-center flex flex-col items-center space-y-8">
                <div className="w-24 h-24 bg-blue-600/10 rounded-[2.5rem] flex items-center justify-center text-blue-500">
                  <History className="w-12 h-12" />
                </div>
                <p className="text-slate-600 text-xs font-black uppercase tracking-widest leading-relaxed max-w-[180px]">Secure Log Clear. Engage System.</p>
              </div>
            ) : (
              <div className="space-y-5 pb-32">
                {sessions.map((s, i) => (
                  <div key={i} className="glass-card p-7 rounded-[2.5rem] flex items-center justify-between shadow-xl border-white/5 hover-lift">
                    <div className="flex items-center space-x-6">
                      <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500 shadow-inner">
                        <Clock className="w-7 h-7" />
                      </div>
                      <div>
                        <p className="text-lg font-black text-white tracking-tight">{new Date(s.startTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p>
                        <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">{new Date(s.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-white tabular-nums">{formatTime(s.duration)}</span>
                      <p className="text-[10px] text-green-500 font-black tracking-widest uppercase mt-1">Validated</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

const FlipCard: React.FC<{ front: string; back: string }> = ({ front, back }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  return (
    <div className="h-56 perspective-1000 cursor-pointer tap-scale" onClick={() => setIsFlipped(!isFlipped)}>
      <div className={`relative w-full h-full transition-all duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
        <div className="absolute inset-0 glass-card rounded-[3rem] p-10 flex items-center justify-center text-center backface-hidden shadow-2xl">
          <p className="font-black text-slate-100 text-xl leading-tight tracking-tight">{front}</p>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-700 to-blue-900 rounded-[3rem] p-10 flex items-center justify-center text-center backface-hidden rotate-y-180 shadow-2xl">
          <p className="font-bold text-white text-xl italic leading-relaxed">"{back}"</p>
        </div>
      </div>
    </div>
  );
};

export default App;
