
import React, { useState, useEffect, useRef } from 'react';
import { Participant } from '../types';

interface NameInputProps {
  participants: Participant[];
  onUpdate: (names: string[]) => void;
}

const NameInput: React.FC<NameInputProps> = ({ participants, onUpdate }) => {
  // Local state for the text being typed to allow fluid typing (commas, spaces, etc.)
  const [localText, setLocalText] = useState('');
  const isInternalUpdate = useRef(false);

  // Synchronize local text with participants when they change externally (e.g. removal)
  useEffect(() => {
    const currentTextFromProps = participants.map(p => p.name).join(', ');
    
    // We only update the local text if the change came from outside (like removing a winner)
    // or if the local text is currently empty (initial load).
    // This prevents the "snap-back" while typing.
    const parsedNames = localText
      .split(',')
      .map(n => n.trim())
      .filter(n => n !== '');
    
    const propNames = participants.map(p => p.name);
    
    // If the list of names differs, update local text
    if (JSON.stringify(parsedNames) !== JSON.stringify(propNames)) {
      setLocalText(currentTextFromProps);
    }
  }, [participants]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setLocalText(newValue);

    // Parse the value and notify parent
    const nameList = newValue
      .split(',')
      .map(name => name.trim())
      .filter(name => name.length > 0);
    
    onUpdate(nameList);
  };

  return (
    <div className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700/50 backdrop-blur-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <span className="text-blue-400">Participants</span>
        </h2>
        <span className="bg-blue-500/20 text-blue-400 text-xs font-bold px-3 py-1 rounded-full border border-blue-500/20">
          {participants.length} TOTAL
        </span>
      </div>
      
      <p className="text-xs text-slate-400 mb-4 leading-relaxed">
        Paste names here, separated by <span className="text-slate-200 font-mono font-bold">commas</span>. The wheel updates instantly.
      </p>

      <div className="flex-1 relative group">
        <textarea
          value={localText}
          onChange={handleChange}
          placeholder="Enter names... e.g. Alex, Jamie, Jordan, Taylor"
          className="w-full h-full bg-slate-900 border border-slate-700 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-slate-200 placeholder:text-slate-600 resize-none font-medium leading-relaxed scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent"
        />
        <div className="absolute bottom-4 right-4 pointer-events-none opacity-20">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-700/50">
        <p className="text-xs text-slate-500 italic">
          Tip: Each name will get its own slice on the wheel. Once someone is picked, you can remove them from the list.
        </p>
      </div>
    </div>
  );
};

export default NameInput;
