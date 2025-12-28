
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { getBeastResponse } from '../services/geminiService';

interface BeastAIProps {
  onClose: () => void;
  isBeastMode?: boolean;
}

const BeastAI: React.FC<BeastAIProps> = ({ onClose, isBeastMode }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: isBeastMode ? 'ALERTA: PROTOCOLO DE COMBATE DIGITAL ATIVO. Núcleo Beast AI em overclock.' : 'PROTOCOLO INICIADO. Sou o Beast AI, assistente de Ivanildo. Como posso ajudar?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
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
    <div className={`${isBeastMode ? 'bg-[#100000] border-red-500/50 shadow-2xl' : 'bg-slate-950 border-cyan-500/30 shadow-2xl'} border rounded-3xl flex flex-col h-[500px] md:h-[550px] w-full max-w-[90vw] md:max-w-none overflow-hidden transition-all duration-500 animate-entry-beast`}>
      <div className={`${isBeastMode ? 'bg-red-500' : 'bg-cyan-500'} p-4 md:p-5 flex justify-between items-center relative z-10`}>
        <h3 className="text-slate-950 font-black font-orbitron flex items-center gap-2 tracking-widest text-[10px] md:text-xs">
          <span>{isBeastMode ? '🔥' : '🐾'}</span> {isBeastMode ? 'BEAST_COMBAT' : 'BEAST_AI'}
        </h3>
        <button onClick={onClose} className="text-slate-950 hover:bg-black/10 rounded-lg w-8 h-8 flex items-center justify-center transition-all font-black">✕</button>
      </div>

      <div ref={scrollRef} className={`flex-grow p-4 md:p-6 overflow-y-auto space-y-4 md:space-y-6 ${isBeastMode ? 'bg-[#050000]' : 'bg-[#020617]'} custom-scrollbar font-mono`}>
        {messages.map((msg, i) => (
          <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`text-[8px] md:text-[9px] mb-1 uppercase tracking-widest opacity-30`}>{msg.role === 'user' ? 'User' : 'Beast'}</div>
            <div className={`max-w-[90%] p-4 rounded-2xl text-[11px] md:text-[13px] leading-relaxed relative ${msg.role === 'user' ? (isBeastMode ? 'bg-red-900/40 text-red-100 border-red-500/20' : 'bg-cyan-900/40 text-cyan-100 border-cyan-500/20') : (isBeastMode ? 'bg-orange-950/40 text-orange-100' : 'bg-slate-900/60 text-slate-200')} ${msg.role === 'user' ? 'rounded-tr-none' : 'rounded-tl-none'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && <div className="animate-pulse text-[8px] text-cyan-500 font-mono ml-2">Analisando dados...</div>}
      </div>

      <div className={`p-4 md:p-6 ${isBeastMode ? 'bg-[#100000]' : 'bg-slate-950'} border-t border-white/5 flex gap-2`}>
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} placeholder="..." className={`flex-grow ${isBeastMode ? 'bg-red-900/10 border-red-500/20 text-red-100' : 'bg-slate-900/50 border-white/10 text-cyan-100'} p-3 md:p-4 rounded-xl text-xs md:text-sm font-mono outline-none`}/>
        <button onClick={handleSend} className={`${isBeastMode ? 'bg-red-500' : 'bg-cyan-500'} text-slate-950 w-12 h-12 md:w-14 md:h-14 rounded-xl font-black shadow-lg flex items-center justify-center text-lg`}>{isBeastMode ? '💥' : '🚀'}</button>
      </div>
    </div>
  );
};

export default BeastAI;
