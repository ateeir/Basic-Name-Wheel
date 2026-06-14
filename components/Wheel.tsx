import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Participant } from '../types';
import { WHEEL_COLORS } from '../constants';
import { audioService } from '../services/audioService';

interface WheelProps {
  participants: Participant[];
  onSpinEnd: (winner: Participant) => void;
  isSpinning: boolean;
  setIsSpinning: (spinning: boolean) => void;
}

const Wheel: React.FC<WheelProps> = ({ participants, onSpinEnd, isSpinning, setIsSpinning }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState(0);
  const [velocity, setVelocity] = useState(0);
  
  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 10;
    const centerPinRadius = 15;
    
    ctx.clearRect(0, 0, size, size);

    if (participants.length === 0) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = '#1e293b';
      ctx.fill();
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Add names to start', centerX, centerY);
      return;
    }

    const sliceAngle = (Math.PI * 2) / participants.length;
    const textPositionRadius = (radius + centerPinRadius) / 2 + 10; 
    const availableArcWidth = textPositionRadius * sliceAngle;
    
    let fontSize = Math.floor(availableArcWidth * 0.7);
    fontSize = Math.min(fontSize, 28); 
    fontSize = Math.max(fontSize, 9);   

    participants.forEach((p, i) => {
      const angle = rotation + i * sliceAngle;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, angle, angle + sliceAngle);
      ctx.fillStyle = WHEEL_COLORS[i % WHEEL_COLORS.length];
      ctx.fill();
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = participants.length > 30 ? 1 : 2;
      ctx.stroke();

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle + sliceAngle / 2);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${fontSize}px "Plus Jakarta Sans", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      ctx.shadowColor = 'rgba(0,0,0,0.3)';
      ctx.shadowBlur = 4;

      const maxTextWidth = radius - centerPinRadius - 40;
      let text = p.name;
      let measured = ctx.measureText(text);
      
      if (measured.width > maxTextWidth) {
        while (text.length > 0 && ctx.measureText(text + '...').width > maxTextWidth) {
          text = text.substring(0, text.length - 1);
        }
        text = text + '...';
      }
      
      ctx.fillText(text, textPositionRadius, 0);
      ctx.restore();
    });

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 2, 0, Math.PI * 2);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(centerX, centerY, centerPinRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 4;
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(centerX - 4, centerY - 4, 3, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.fill();
  }, [participants, rotation]);

  useEffect(() => {
    drawWheel();
  }, [drawWheel]);

  const finalizeWinner = useCallback(() => {
    if (participants.length === 0) return;
    const sliceAngle = (Math.PI * 2) / participants.length;
    // Calculate which slice is at the top (3/2 PI position)
    const normalizedRotation = (Math.PI * 2 - (rotation % (Math.PI * 2))) % (Math.PI * 2);
    const winningIndex = Math.floor(normalizedRotation / sliceAngle) % participants.length;
    onSpinEnd(participants[winningIndex]);
    setIsSpinning(false);
  }, [participants, rotation, onSpinEnd, setIsSpinning]);

  useEffect(() => {
    let animationId: number;

    const animate = () => {
      if (velocity > 0.005) {
        setRotation(prev => (prev + velocity) % (Math.PI * 2));
        setVelocity(prev => prev * 0.96); 
        animationId = requestAnimationFrame(animate);
      } else if (isSpinning) {
        setVelocity(0);
        finalizeWinner();
      }
    };

    if (velocity > 0) {
      animationId = requestAnimationFrame(animate);
    }

    return () => cancelAnimationFrame(animationId);
  }, [velocity, isSpinning, finalizeWinner, participants.length]);

  const handleInteraction = () => {
    if (participants.length < 1) return;

    if (isSpinning) {
      // Allow stopping early with a small residual velocity
      setVelocity(0.01);
    } else {
      setIsSpinning(true);
      setRotation(prev => prev % (Math.PI * 2)); 
      setVelocity(0.8 + Math.random() * 0.5);
    }
  };

  return (
    <div className="relative flex flex-col items-center group">
      {/* Dynamic Animated Glow Ring */}
      <div className={`absolute inset-0 -m-4 rounded-full blur-2xl opacity-40 transition-all duration-1000 ${
        isSpinning 
        ? 'animate-wheel-pulse-fast scale-110' 
        : 'animate-wheel-pulse scale-100'
      }`}
      style={{
        background: 'conic-gradient(from 0deg, #3b82f6, #6366f1, #a855f7, #3b82f6)',
        animation: isSpinning ? 'wheel-spin-glow 1s linear infinite' : 'wheel-spin-glow 10s linear infinite'
      }}
      />
      
      {/* Pointer with glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 z-20">
        <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] border-t-white drop-shadow-[0_4px_10px_rgba(255,255,255,0.3)]"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/20 rounded-full blur-xl animate-pulse"></div>
      </div>
      
      <div className="relative z-10">
        <canvas 
          ref={canvasRef} 
          width={450} 
          height={450} 
          className={`rounded-full shadow-[0_0_50px_rgba(0,0,0,0.5)] border-4 border-slate-800 bg-slate-900 cursor-pointer transition-all duration-500 active:scale-95 w-full max-w-[450px] aspect-square ${isSpinning ? 'brightness-110' : ''}`}
          onClick={handleInteraction}
        />
      </div>

      <button
        onClick={handleInteraction}
        disabled={participants.length < 1}
        className={`mt-10 px-16 py-5 rounded-full text-2xl font-black tracking-wider transition-all transform hover:scale-105 active:scale-95 shadow-2xl z-20 ${
          participants.length < 1 
          ? 'bg-slate-700 cursor-not-allowed text-slate-500 opacity-50' 
          : isSpinning
            ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse ring-4 ring-rose-500/20'
            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white ring-4 ring-blue-500/20 shadow-blue-500/20'
        }`}
      >
        {isSpinning ? 'STOP NOW' : 'SPIN WHEEL'}
      </button>
    </div>
  );
};

export default Wheel;