import React, { useState, useCallback, useMemo, useEffect } from 'react';
import Wheel from './components/Wheel';
import NameInput from './components/NameInput';
import IntroPrompts from './components/IntroPrompts';
import { Participant } from './types';
import { audioService } from './services/audioService';

const App: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([
    { id: '1', name: 'Alex' },
    { id: '2', name: 'Jamie' },
    { id: '3', name: 'Jordan' },
    { id: '4', name: 'Taylor' },
  ]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<Participant | null>(null);
  const [isMuted, setIsMuted] = useState(() => audioService.getMuted());

  const handleUpdateNames = (names: string[]) => {
    const newParticipants = names.map(name => {
      const existing = participants.find(p => p.name === name);
      return {
        id: existing ? existing.id : Math.random().toString(36).substr(2, 9),
        name
      };
    });
    setParticipants(newParticipants);
  };

  const handleSpinEnd = useCallback((selected: Participant) => {
    setWinner(selected);
    
    // Play celebratory sounds
    audioService.playWin();
    audioService.playPop(); // Shimmering sparkles
    
    // Auto-remove the winner from the list immediately after selection
    setParticipants(prev => prev.filter(p => p.id !== selected.id));
  }, []);

  const handleCloseWinner = () => {
    setWinner(null);
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    audioService.setMuted(nextMuted);
  };

  // Generate random confetti and sparkle properties
  const confettiParticles = useMemo(() => 
    Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 3}s`,
      color: ['#F43F5E', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'][Math.floor(Math.random() * 5)],
      size: `${Math.random() * 8 + 4}px`
    })), []);

  const sparkles = useMemo(() => 
    Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 2}s`,
      size: `${Math.random() * 15 + 10}px`
    })), []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-500/30">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600 rounded-full blur-[120px]"></div>
      </div>

      <header className="relative z-10 py-8 px-6 container mx-auto flex flex-col items-center">
        <div className="w-full flex justify-end absolute top-8 right-6">
          <button 
            onClick={toggleMute}
            className={`p-3 rounded-2xl transition-all duration-300 border ${
              isMuted 
              ? 'bg-slate-900/50 border-slate-700 text-slate-500 hover:text-slate-300' 
              : 'bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
            }`}
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 14.828a1 1 0 01-1.414-1.414 5 5 0 000-7.072 1 1 0 011.414-1.414 7 7 0 010 9.9 1 1 0 01-1.414 0z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M11.293 12.707a1 1 0 01-1.414-1.414 1 1 0 000-1.414 1 1 0 011.414-1.414 3 3 0 010 4.242 1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>

        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            INTRO WHEEL <span className="text-blue-500">PRO</span>
          </h1>
        </div>
        <p className="text-slate-500 text-sm font-medium">Let's spin the wheel!</p>
      </header>

      <main className="relative z-10 container mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch min-h-[600px]">
          
          {/* Column 1: Participants */}
          <div className="lg:col-span-3 order-2 lg:order-1 h-full">
            <NameInput 
              participants={participants}
              onUpdate={handleUpdateNames} 
            />
          </div>

          {/* Column 2: The Wheel */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center py-4 order-1 lg:order-2 relative">
            <div className={`relative transition-all duration-700 ${winner && !isSpinning ? 'opacity-30 scale-90 blur-sm' : ''}`}>
              <Wheel 
                participants={participants} 
                onSpinEnd={handleSpinEnd} 
                isSpinning={isSpinning}
                setIsSpinning={setIsSpinning}
              />
            </div>
            
            {/* Winner Highlight Overlay */}
            {winner && !isSpinning && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 animate-in zoom-in-110 fade-in duration-500 pointer-events-none w-full max-w-4xl h-full flex items-center justify-center">
                
                {/* Confetti Rain */}
                {confettiParticles.map((p) => (
                  <div
                    key={p.id}
                    className="animate-confetti"
                    style={{
                      left: p.left,
                      backgroundColor: p.color,
                      width: p.size,
                      height: p.size,
                      animationDelay: p.delay,
                      borderRadius: Math.random() > 0.5 ? '50%' : '2px'
                    }}
                  />
                ))}

                <div className="bg-slate-900/90 border-2 border-blue-500/30 p-10 rounded-[3rem] shadow-[0_0_100px_rgba(59,130,246,0.5)] backdrop-blur-3xl text-center w-[420px] pointer-events-auto ring-1 ring-white/10 relative overflow-hidden">
                  
                  {/* Sparkles inside card */}
                  {sparkles.map((s) => (
                    <div
                      key={s.id}
                      className="absolute animate-sparkle text-yellow-400 opacity-0 pointer-events-none"
                      style={{
                        top: s.top,
                        left: s.left,
                        width: s.size,
                        height: s.size,
                        animationDelay: s.delay
                      }}
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                      </svg>
                    </div>
                  ))}

                  <div className="relative z-10">
                    <div className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em] mb-4 opacity-80">Presenting</div>
                    
                    <div className="relative mb-8">
                      <h2 className="text-6xl font-black text-white truncate px-4 animate-glow-pulse tracking-tight drop-shadow-lg">
                        {winner.name}
                      </h2>
                      {/* Floating accents */}
                      <div className="absolute -top-4 -right-2 w-4 h-4 bg-blue-500 rounded-full blur-[2px] animate-ping opacity-70"></div>
                      <div className="absolute -bottom-2 -left-4 w-3 h-3 bg-indigo-500 rounded-full blur-[2px] animate-pulse opacity-70"></div>
                    </div>

                    <p className="text-slate-400 text-sm mb-8 px-6 leading-relaxed">
                      Introduction complete! {winner.name} is now ready to join the group.
                    </p>

                    <div className="flex flex-col gap-3">
                      <button
                        onClick={handleCloseWinner}
                        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-black py-4 rounded-2xl hover:brightness-110 transition-all active:scale-95 text-base tracking-wider shadow-lg shadow-blue-900/30 flex items-center justify-center gap-2"
                      >
                        <span>DONE! REMOVE FROM WHEEL</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 flex items-center gap-12 text-slate-500 bg-slate-900/20 px-8 py-4 rounded-full border border-slate-800/50 backdrop-blur-sm">
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-slate-200">{participants.length}</span>
                <span className="text-[10px] uppercase tracking-widest font-semibold">Remaining</span>
              </div>
              <div className="w-px h-8 bg-slate-800"></div>
              <div className="flex flex-col items-center">
                <span className={`text-xs font-bold transition-colors duration-300 ${isSpinning ? 'text-blue-400' : 'text-slate-400'}`}>
                  {isSpinning ? 'SPINNING...' : 'READY'}
                </span>
                <span className="text-[10px] uppercase tracking-widest font-semibold">Status</span>
              </div>
            </div>
          </div>

          {/* Column 3: Intro Guide */}
          <div className="lg:col-span-3 order-3 h-full">
            <IntroPrompts />
          </div>

        </div>
      </main>
      
      <footer className="relative z-10 py-8 border-t border-slate-900 mt-auto">
        <div className="container mx-auto px-6 text-center">
          <p className="text-slate-600 text-xs">
            Intro Wheel Pro • Optimized for Speed & Focus
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;