
import React from 'react';
import { Participant, GroupCategory } from '../types';

interface ResultModalProps {
  winner: Participant | null;
  question: string;
  category: GroupCategory;
  isLoading: boolean;
  onClose: () => void;
  onRemoveWinner: () => void;
}

const ResultModal: React.FC<ResultModalProps> = ({ 
  winner, 
  question, 
  category, 
  isLoading, 
  onClose,
  onRemoveWinner 
}) => {
  if (!winner) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Confetti-like decoration */}
        <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        
        <div className="p-8 text-center">
          <div className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 font-bold text-xs uppercase tracking-widest mb-6">
            It's your turn!
          </div>
          
          <h2 className="text-5xl font-black text-white mb-2 tracking-tight">
            {winner.name}
          </h2>
          
          <div className="w-16 h-1 bg-slate-800 mx-auto my-8"></div>
          
          <div className="min-h-[140px] flex flex-col justify-center bg-slate-950/50 rounded-2xl p-6 border border-slate-800">
            {isLoading ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-400 text-sm animate-pulse">Gemini is thinking of a {category.toLowerCase()} icebreaker...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xl text-slate-100 font-medium leading-relaxed italic">
                  "{question}"
                </p>
                <div className="flex justify-center gap-1">
                  <span className="text-xs text-slate-500">Powered by Gemini AI</span>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <button
              onClick={onRemoveWinner}
              className="w-full bg-slate-100 hover:bg-white text-slate-900 font-bold py-4 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-white/5"
            >
              DONE! REMOVE FROM WHEEL
            </button>
            <button
              onClick={onClose}
              className="w-full bg-transparent hover:bg-slate-800 text-slate-400 hover:text-slate-200 font-semibold py-3 rounded-xl transition-all text-sm"
            >
              KEEP ON WHEEL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultModal;
