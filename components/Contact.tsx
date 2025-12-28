
import React, { useState } from 'react';
import { BioInfo } from '../types';

interface ContactProps {
  bio: BioInfo;
  isBeastMode?: boolean;
}

const Contact: React.FC<ContactProps> = ({ bio, isBeastMode }) => {
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('COMUNICAÇÃO_ESTABELECIDA. TRANSMITINDO DADOS...');
    setTimeout(() => setStatus(null), 5000);
  };

  return (
    <section id="contact" className="py-32 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="text-center mb-24 reveal">
          <h2 className={`text-4xl md:text-5xl font-black font-orbitron mb-6 text-white ${isBeastMode ? 'beast-glitch' : ''}`}>
            LINK_UP<span className={isBeastMode ? 'text-red-500' : 'text-cyan-500'}>.COMM</span>
          </h2>
          <p className="text-slate-500 font-exo max-w-xl mx-auto text-sm md:text-base">
            Interessado em colaborações de alta performance ou apenas quer trocar pacotes de dados sobre games e EDM?
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 md:gap-16">
          <div className="lg:col-span-2 space-y-8 md:space-y-10 reveal">
            <ContactLink label="Neural_Mail" value={bio.email} icon="✉️" color={isBeastMode ? 'red' : 'cyan'} />
            <ContactLink label="Data_Network" value={bio.linkedin} icon="🔗" color={isBeastMode ? 'orange' : 'purple'} />
            <ContactLink label="Geographic_Node" value={bio.location} icon="📍" color={isBeastMode ? 'red' : 'emerald'} />
            
            <div className={`p-8 glass rounded-3xl border ${isBeastMode ? 'border-red-500/10' : 'border-white/5'} opacity-50 font-mono text-[9px] uppercase tracking-[0.3em] hidden md:block`}>
              <div className={`mb-2 ${isBeastMode ? 'text-red-500' : 'text-cyan-500'}`}>SYSTEM_INFO:</div>
              <div>ENCRYPTED: YES</div>
              <div>PROTO: HTTPS/P2P</div>
              <div>LATENCY: 12ms</div>
              <div>BEAST_MODE: {isBeastMode ? 'ON' : 'OFF'}</div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6 md:space-y-8 reveal">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="group">
                <label className="block text-[10px] font-black font-orbitron text-slate-500 mb-2 ml-2 tracking-widest">IDENTIFIER</label>
                <input 
                  type="text" 
                  placeholder="Seu Nome" 
                  className={`w-full ${isBeastMode ? 'bg-red-950/20 border-red-500/20 focus:border-red-500/50 focus:ring-red-500/30' : 'bg-slate-900/40 border-white/10 focus:border-cyan-500/50 focus:ring-cyan-500/30'} border p-5 rounded-2xl focus:outline-none focus:ring-1 text-white font-exo transition-all placeholder:text-slate-700`} 
                  required
                />
              </div>
              <div className="group">
                <label className="block text-[10px] font-black font-orbitron text-slate-500 mb-2 ml-2 tracking-widest">TRANSMISSION_ADDR</label>
                <input 
                  type="email" 
                  placeholder="Seu Email" 
                  className={`w-full ${isBeastMode ? 'bg-red-950/20 border-red-500/20 focus:border-red-500/50 focus:ring-red-500/30' : 'bg-slate-900/40 border-white/10 focus:border-cyan-500/50 focus:ring-cyan-500/30'} border p-5 rounded-2xl focus:outline-none focus:ring-1 text-white font-exo transition-all placeholder:text-slate-700`} 
                  required
                />
              </div>
            </div>
            
            <div className="group">
              <label className="block text-[10px] font-black font-orbitron text-slate-500 mb-2 ml-2 tracking-widest">DATA_PACKET</label>
              <textarea 
                placeholder="Sua Mensagem..." 
                rows={5} 
                className={`w-full ${isBeastMode ? 'bg-red-950/20 border-red-500/20 focus:border-red-500/50 focus:ring-red-500/30' : 'bg-slate-900/40 border-white/10 focus:border-cyan-500/50 focus:ring-cyan-500/30'} border p-5 rounded-3xl focus:outline-none focus:ring-1 text-white font-exo transition-all placeholder:text-slate-700 resize-none`}
                required
              ></textarea>
            </div>

            <button 
              type="submit" 
              className={`group relative w-full overflow-hidden ${isBeastMode ? 'bg-red-500 hover:bg-red-400 shadow-[0_20px_40px_rgba(239,68,68,0.2)]' : 'bg-cyan-500 hover:bg-cyan-400 shadow-[0_20px_40px_rgba(34,211,238,0.2)]'} text-slate-950 font-black font-orbitron py-5 md:py-6 rounded-2xl transition-all active:scale-[0.98]`}
            >
              <span className="relative z-10 tracking-[0.2em] md:tracking-[0.3em]">{isBeastMode ? 'EXECUTE_BEAST_LINK' : 'EXECUTE_TRANSMISSION'}</span>
              <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
            </button>
            
            {status && (
              <div className={`p-4 ${isBeastMode ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'} border rounded-xl text-center font-mono text-[10px] animate-pulse`}>
                {status}
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

const ContactLink: React.FC<{ label: string; value: string; icon: string; color: string }> = ({ label, value, icon, color }) => {
  const colors: Record<string, string> = {
    cyan: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
    purple: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    red: 'bg-red-500/10 text-red-500 border-red-500/20',
    orange: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  };

  return (
    <div className="flex items-center gap-4 md:gap-6 group cursor-pointer">
      <div className={`w-14 h-14 md:w-16 md:h-16 ${colors[color]} border flex items-center justify-center rounded-2xl text-xl md:text-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6`}>
        {icon}
      </div>
      <div className="overflow-hidden">
        <div className="text-[9px] md:text-[10px] text-slate-600 uppercase font-black font-orbitron tracking-widest mb-1">{label}</div>
        <div className="text-slate-200 font-bold font-mono text-xs md:text-sm group-hover:text-cyan-400 transition-colors truncate">{value}</div>
      </div>
    </div>
  );
};

export default Contact;
