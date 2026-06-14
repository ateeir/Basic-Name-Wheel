
import React, { useState, useEffect } from 'react';

const DEFAULT_PROMPTS = [
  'Name',
  'Location',
  'Role / Craft Team / Discipline',
  'Account / Clients',
  'How long you’ve been with the company?'
];

const DEFAULT_OPTIONAL = [
  'What do you hope to get out of these connects?',
  'What’s something cool you’re working on lately?',
  'How do you know the host / How did you find out about this?'
];

const IntroPrompts: React.FC = () => {
  const [prompts, setPrompts] = useState<string[]>([]);
  const [optionalPrompts, setOptionalPrompts] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const savedPrompts = localStorage.getItem('intro_wheel_prompts');
    const savedOptional = localStorage.getItem('intro_wheel_optional');
    
    setPrompts(savedPrompts ? JSON.parse(savedPrompts) : DEFAULT_PROMPTS);
    setOptionalPrompts(savedOptional ? JSON.parse(savedOptional) : DEFAULT_OPTIONAL);
  }, []);

  // Save to local storage when changed
  useEffect(() => {
    if (prompts.length > 0) {
      localStorage.setItem('intro_wheel_prompts', JSON.stringify(prompts));
    }
    if (optionalPrompts.length > 0) {
      localStorage.setItem('intro_wheel_optional', JSON.stringify(optionalPrompts));
    }
  }, [prompts, optionalPrompts]);

  const updatePrompt = (index: number, value: string, isOptional: boolean) => {
    if (isOptional) {
      const newOptional = [...optionalPrompts];
      newOptional[index] = value;
      setOptionalPrompts(newOptional);
    } else {
      const newPrompts = [...prompts];
      newPrompts[index] = value;
      setPrompts(newPrompts);
    }
  };

  const addItem = (isOptional: boolean) => {
    if (isOptional) {
      setOptionalPrompts([...optionalPrompts, '']);
    } else {
      setPrompts([...prompts, '']);
    }
  };

  const removeItem = (index: number, isOptional: boolean) => {
    if (isOptional) {
      setOptionalPrompts(optionalPrompts.filter((_, i) => i !== index));
    } else {
      setPrompts(prompts.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700/50 backdrop-blur-sm h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <span className="text-purple-400">Intro Guide</span>
        </h2>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className={`text-[10px] font-black px-3 py-1 rounded-full border transition-all ${
            isEditing 
            ? 'bg-purple-500/20 border-purple-500/40 text-purple-300' 
            : 'bg-slate-700/30 border-slate-700 text-slate-400 hover:text-slate-200'
          }`}
        >
          {isEditing ? 'DONE' : 'EDIT'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        {/* Main Prompts */}
        <div className="space-y-4">
          {prompts.map((text, i) => (
            <div key={i} className="flex gap-3 items-start group">
              <span className="text-[10px] font-black text-slate-500 mt-1.5 font-mono w-4">
                {(i + 1).toString().padStart(2, '0')}.
              </span>
              {isEditing ? (
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => updatePrompt(i, e.target.value, false)}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
                  />
                  <button onClick={() => removeItem(i, false)} className="text-slate-600 hover:text-rose-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ) : (
                <p className="text-sm font-semibold text-slate-200 leading-tight group-hover:text-white transition-colors">
                  {text}
                </p>
              )}
            </div>
          ))}
          {isEditing && (
            <button 
              onClick={() => addItem(false)}
              className="text-[10px] font-bold text-purple-400/70 hover:text-purple-400 flex items-center gap-1 pl-7 transition-colors"
            >
              + ADD ITEM
            </button>
          )}
        </div>

        {/* Optional Section */}
        <div className="pt-6 border-t border-slate-700/50">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Optional</h3>
          <div className="space-y-4">
            {optionalPrompts.map((text, i) => (
              <div key={i} className="flex gap-3 items-start group">
                <span className="text-[10px] font-black text-slate-600 mt-1.5 font-mono w-4">
                  {(prompts.length + i + 1).toString().padStart(2, '0')}.
                </span>
                {isEditing ? (
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      value={text}
                      onChange={(e) => updatePrompt(i, e.target.value, true)}
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1 text-sm text-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-500/50 italic"
                    />
                    <button onClick={() => removeItem(i, true)} className="text-slate-600 hover:text-rose-500 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <p className="text-sm font-medium text-slate-400 leading-tight group-hover:text-slate-300 transition-colors italic">
                    {text}
                  </p>
                )}
              </div>
            ))}
            {isEditing && (
              <button 
                onClick={() => addItem(true)}
                className="text-[10px] font-bold text-slate-500 hover:text-slate-300 flex items-center gap-1 pl-7 transition-colors"
              >
                + ADD OPTIONAL ITEM
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroPrompts;
