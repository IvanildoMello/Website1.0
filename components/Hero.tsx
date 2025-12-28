
import React from 'react';
import { BioInfo } from '../types';

interface HeroProps {
  bio: BioInfo;
  onExplore: () => void;
}

const Hero: React.FC<HeroProps> = ({ bio, onExplore }) => {
  return (
    <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden px-6 cyber-grid">
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] animate-float"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] animate-float" style={{ animationDelay: '-3s' }}></div>
      
      <div className="relative z-10 max-w-6xl w-full grid lg:grid-cols-2 gap-12 items-center">
        <div className="text-left animate-[reveal-up_1s_ease-out]">
          <div className="inline-flex items-center gap-3 mb-6 bg-cyan-500/10 border border-cyan-500/20 px-4 py-2 rounded-full">
            <span className="w-2 h-2 bg-cyan-500 rounded-full animate-ping"></span>
            <span className="text-cyan-400 font-mono text-[10px] tracking-[0.3em] uppercase">Status: Online</span>
          </div>
          
          <h2 className="text-slate-400 font-audiowide text-lg tracking-widest mb-2 opacity-80 uppercase">{bio.name}</h2>
          <h1 className="text-6xl md:text-8xl font-black font-orbitron mb-8 leading-none tracking-tighter text-white">
            {bio.profession.split(' ')[0]} <br />
            <span className="beast-gradient-text uppercase">{bio.profession.split(' ').slice(1).join(' ')}</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 font-light max-w-xl mb-12 leading-relaxed font-exo">
            {bio.description.substring(0, 150)}...
          </p>
          
          <div className="flex flex-wrap gap-6">
            <button 
              onClick={onExplore}
              className="relative group bg-cyan-500 text-slate-950 font-black font-orbitron px-10 py-5 rounded-xl transition-all shadow-[0_10px_30px_rgba(34,211,238,0.3)] active:scale-95"
            >
              EXPLORE_DATA
            </button>
          </div>
        </div>

        <div className="relative hidden lg:block animate-[reveal-up_1.2s_ease-out]">
          <div className="relative w-full aspect-square glass rounded-3xl overflow-hidden border border-white/10 group shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-transparent to-purple-500/20"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-[200px] opacity-10 filter blur-sm group-hover:blur-none transition-all duration-700">🐾</div>
              <div className="absolute inset-0 cyber-grid opacity-30"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
