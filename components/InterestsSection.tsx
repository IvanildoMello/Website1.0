
import React from 'react';
import { Interest } from '../types';

interface InterestsSectionProps {
  interests: Interest[];
}

const InterestsSection: React.FC<InterestsSectionProps> = ({ interests }) => {
  return (
    <section id="interests" className="py-32 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <h2 className="text-5xl font-black font-orbitron mb-6 text-white tracking-tighter">
            PAIXÕES<span className="text-cyan-500">.CORE</span>
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-transparent via-cyan-500 to-transparent mx-auto"></div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-10">
          {interests.map((interest, idx) => (
            <div 
              key={interest.id} 
              className="group relative h-[450px] perspective-1000"
              style={{ animationDelay: `${idx * 0.2}s` }}
            >
              <div className="absolute -inset-1 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-700"></div>
              
              <div className="relative h-full w-full glass rounded-3xl overflow-hidden border border-white/5 transition-all duration-700 group-hover:-translate-y-4 group-hover:border-cyan-500/40">
                {/* Dynamic Icon Background */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
                  <span className="text-[180px] opacity-5 group-hover:opacity-20 transform group-hover:scale-125 transition-all duration-1000 grayscale group-hover:grayscale-0">
                    {interest.icon}
                  </span>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-10"></div>

                <div className="absolute bottom-0 left-0 p-10 z-20 w-full transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 text-[9px] font-bold font-mono tracking-widest rounded uppercase">
                      {interest.category}
                    </span>
                    <div className="h-px flex-grow bg-white/10"></div>
                  </div>
                  
                  <h3 className="text-3xl font-black font-orbitron text-white mb-4 group-hover:text-cyan-400 transition-colors uppercase tracking-tight">
                    {interest.title}
                  </h3>
                  
                  <p className="text-slate-400 text-sm font-exo leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                    {interest.description}
                  </p>
                  
                  <div className="mt-8 flex items-center gap-2 text-cyan-500 text-[10px] font-bold font-orbitron opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                    ACCESS_DETAILS <span className="animate-pulse">_</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Special Feature Card: EDM Vibe */}
        <div className="mt-20 group relative overflow-hidden reveal">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/30 to-cyan-500/30 blur opacity-30 group-hover:opacity-60 transition duration-700"></div>
          <div className="relative glass p-10 rounded-3xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8 hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-8">
              <div className="w-20 h-20 bg-slate-950 rounded-2xl flex items-center justify-center text-4xl shadow-inner border border-white/5 group-hover:rotate-12 transition-transform">
                🎧
              </div>
              <div>
                <h4 className="text-white font-black font-orbitron text-xl mb-2 tracking-tight">CURRENT_VIBE: EDM_MATRIX</h4>
                <p className="text-slate-400 font-exo">Techno, Melodic House & Synthwave. Sincronizando ondas cerebrais.</p>
              </div>
            </div>
            <button className="relative overflow-hidden px-10 py-4 bg-cyan-500 text-slate-950 font-black font-orbitron rounded-xl hover:bg-cyan-400 transition-all shadow-lg active:scale-95 group/btn">
              <span className="relative z-10">OPEN_PLAYLIST</span>
              <div className="absolute inset-0 bg-white/30 transform -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500"></div>
            </button>
          </div>
        </div>
      </div>
      
      {/* Decorative background elements */}
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px] pointer-events-none"></div>
    </section>
  );
};

export default InterestsSection;
