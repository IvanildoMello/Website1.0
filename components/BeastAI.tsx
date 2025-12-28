
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { getBeastResponse } from '../services/geminiService';

interface BeastAIProps {
  onClose: () => void;
}

const BeastAI: React.FC<BeastAIProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'PROTOCOLO INICIADO. Sou o Beast AI, núcleo de consciência digital de Ivanildo. Como posso otimizar sua busca por dados hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const responseText = await getBeastResponse(messages, input);
    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setIsLoading(false);
  };

  return (
    <div className="bg-slate-950 border border-cyan-500/30 rounded-3xl shadow-[0_20px_80px_rgba(0,0,0,0.8)] flex flex-col h-[550px] overflow-hidden animate-beast-pulse">
      {/* HUD Header */}
      <div className="bg-cyan-500 p-5 flex justify-between items-center relative overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-20"></div>
        <h3 className="text-slate-950 font-black font-orbitron flex items-center gap-3 relative z-10 tracking-widest text-xs animate-soft-pulse">
          <span className="text-xl animate-pulse">🐾</span> BEAST AI ASSISTANT
        </h3>
        <button 
          onClick={onClose} 
          className="relative z-10 text-slate-950 hover:bg-black/10 rounded-xl w-10 h-10 flex items-center justify-center transition-all font-black text-lg active:scale-90"
        >
          ✕
        </button>
      </div>

      {/* Terminal Feed */}
      <div 
        ref={scrollRef} 
        className="flex-grow p-6 overflow-y-auto space-y-6 bg-[#020617] custom-scrollbar font-mono"
      >
        {messages.map((msg, i) => (
          <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`text-[9px] mb-2 uppercase tracking-widest opacity-30 ${msg.role === 'user' ? 'mr-2' : 'ml-2'}`}>
              {msg.role === 'user' ? 'Local_User' : 'Beast_System'}
            </div>
            <div className={`max-w-[85%] p-5 rounded-2xl text-[13px] leading-relaxed relative ${
              msg.role === 'user' 
                ? 'bg-cyan-900/40 text-cyan-100 rounded-tr-none border border-cyan-500/20' 
                : 'bg-slate-900/60 text-slate-200 rounded-tl-none border border-white/5'
            }`}>
              {msg.text}
              <div className={`absolute top-0 ${msg.role === 'user' ? 'right-0' : 'left-0'} w-1 h-4 bg-cyan-500/40`}></div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex flex-col items-start animate-pulse">
            <div className="text-[9px] mb-2 uppercase tracking-widest opacity-30 ml-2">Beast_System</div>
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-white/5 flex gap-2">
              <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
      </div>

      {/* Input Module */}
      <div className="p-6 bg-slate-950 border-t border-white/5 flex gap-3">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Comando de entrada..."
          className="flex-grow bg-slate-900/50 border border-white/10 p-4 rounded-2xl text-sm text-cyan-100 font-mono focus:outline-none focus:border-cyan-500/50 placeholder:text-slate-800 transition-all"
        />
        <button 
          onClick={handleSend}
          className="bg-cyan-500 text-slate-950 w-14 h-14 rounded-2xl font-black hover:bg-cyan-400 transition-all shadow-lg active:scale-95 flex items-center justify-center text-xl"
        >
          🚀
        </button>
      </div>
    </div>
  );
};

export default BeastAI;
