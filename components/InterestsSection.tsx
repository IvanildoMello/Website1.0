
import React from 'react';
import { Interest } from '../types';

interface InterestsSectionProps {
  interests: Interest[];
  isBeastMode?: boolean;
}

const InterestsSection: React.FC<InterestsSectionProps> = ({ interests, isBeastMode }) => {
  return (
    <section id="interests" className="py-24 md:py-32 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20 md:mb-24">
          <h2 className={`text-4xl md:text-5xl font-black font-orbitron mb-6 text-white tracking-tighter ${isBeastMode ? 'beast-glitch' : ''}`}>
            PAIXÕES<span className={isBeastMode ? 'text-red-500' : 'text-cyan-500'}>.CORE</span>
          </h2>
          <div className={`h-1 w-24 bg-gradient-to-r from-transparent via-${isBeastMode ? 'red-500' : 'cyan-500'} to-transparent mx-auto`}></div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {interests.map((interest, idx) => (
            <div 
              key={interest.id} 
              className="group relative h-[400px] md:h-[450px] perspective-1000"
              style={{ animationDelay: `${idx * 0.2}s` }}
            >
              <div className={`absolute -inset-1 bg-gradient-to-br ${isBeastMode ? 'from-red-500/20 to-orange-500/20' : 'from-cyan-500/20 to-purple-500/20'} rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-700`}></div>
              
              <div className={`relative h-full w-full glass rounded-3xl overflow-hidden border ${isBeastMode ? 'border-red-500/10 hover:border-red-500/40' : 'border-white/5 hover:border-cyan-500/40'} transition-all duration-700 group-hover:-translate-y-4`}>
                {/* Dynamic Icon Background */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
                  <span className={`text-[150px] md:text-[180px] opacity-5 group-hover:opacity-20 transform group-hover:scale-125 transition-all duration-1000 grayscale group-hover:grayscale-0`}>
                    {interest.icon}
                  </span>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-10"></div>

                <div className="absolute bottom-0 left-0 p-8 md:p-10 z-20 w-full transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`px-2 py-0.5 ${isBeastMode ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-500'} border text-[8px] md:text-[9px] font-bold font-mono tracking-widest rounded uppercase`}>
                      {interest.category}
                    </span>
                    <div className="h-px flex-grow bg-white/10"></div>
                  </div>
                  
                  <h3 className={`text-2xl md:text-3xl font-black font-orbitron text-white mb-4 group-hover:${isBeastMode ? 'text-red-400' : 'text-cyan-400'} transition-colors uppercase tracking-tight`}>
                    {interest.title}
                  </h3>
                  
                  <p className="text-slate-400 text-xs md:text-sm font-exo leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                    {interest.description}
                  </p>
                  
                  <div className={`mt-8 flex items-center gap-2 ${isBeastMode ? 'text-red-500' : 'text-cyan-500'} text-[9px] md:text-[10px] font-bold font-orbitron opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 uppercase`}>
                    EXPLORAR_DADOS <span className="animate-pulse">_</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Special Feature Card: EDM Vibe */}
        <div className="mt-16 md:mt-20 group relative overflow-hidden reveal">
          <div className={`absolute -inset-1 bg-gradient-to-r ${isBeastMode ? 'from-red-500/30 to-orange-500/30' : 'from-purple-500/30 to-cyan-500/30'} blur opacity-30 group-hover:opacity-60 transition duration-700`}></div>
          <div className={`relative glass p-8 md:p-10 rounded-3xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8 hover:bg-white/5 transition-colors`}>
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 text-center md:text-left">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-950 rounded-2xl flex items-center justify-center text-3xl md:text-4xl shadow-inner border border-white/5 group-hover:rotate-12 transition-transform">
                🎧
              </div>
              <div>
                <h4 className="text-white font-black font-orbitron text-lg md:text-xl mb-2 tracking-tight uppercase">CURRENT_VIBE: {isBeastMode ? 'BEAST_CORE_PHONK' : 'EDM_MATRIX'}</h4>
                <p className="text-slate-400 font-exo text-sm md:text-base">Techno, Melodic House & Synthwave. Sincronizando frequências.</p>
              </div>
            </div>
            <button className={`relative overflow-hidden w-full md:w-auto px-8 md:px-10 py-4 ${isBeastMode ? 'bg-red-500' : 'bg-cyan-500'} text-slate-950 font-black font-orbitron rounded-xl hover:${isBeastMode ? 'bg-red-400' : 'bg-cyan-400'} transition-all shadow-lg active:scale-95 group/btn uppercase text-xs md:text-sm`}>
              <span className="relative z-10">OPEN_PLAYLIST</span>
              <div className="absolute inset-0 bg-white/30 transform -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500"></div>
            </button>
          </div>
        </div>
      </div>
      
      {/* Decorative background elements */}
      <div className={`absolute top-1/2 left-0 w-64 h-64 ${isBeastMode ? 'bg-red-500/5' : 'bg-cyan-500/5'} rounded-full blur-[100px] pointer-events-none`}></div>
      <div className={`absolute bottom-0 right-0 w-96 h-96 ${isBeastMode ? 'bg-orange-500/5' : 'bg-purple-500/5'} rounded-full blur-[120px] pointer-events-none`}></div>
    </section>
  );
};

export default InterestsSection;
