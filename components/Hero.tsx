
import React from 'react';
import { BioInfo } from '../types';

interface HeroProps {
  bio: BioInfo;
  onExplore: () => void;
  isBeastMode?: boolean;
}

const Hero: React.FC<HeroProps> = ({ bio, onExplore, isBeastMode }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 md:px-12 py-20 cyber-grid transition-colors duration-700">
      <div className={`absolute top-1/4 left-1/4 w-[200px] md:w-[400px] h-[200px] md:h-[400px] ${isBeastMode ? 'bg-red-500/10' : 'bg-cyan-500/10'} rounded-full blur-[60px] md:blur-[100px] animate-float transition-all duration-700`}></div>
      <div className={`absolute bottom-1/4 right-1/4 w-[250px] md:w-[500px] h-[250px] md:h-[500px] ${isBeastMode ? 'bg-orange-500/10' : 'bg-purple-500/10'} rounded-full blur-[80px] md:blur-[120px] animate-float transition-all duration-700`} style={{ animationDelay: '-3s' }}></div>
      
      <div className="relative z-10 max-w-6xl w-full grid lg:grid-cols-2 gap-12 items-center">
        <div className="text-center lg:text-left animate-[reveal-up_1s_ease-out]">
          <div className={`inline-flex items-center gap-3 mb-6 ${isBeastMode ? 'bg-red-500/10 border-red-500/20' : 'bg-cyan-500/10 border-cyan-500/20'} border px-4 py-2 rounded-full transition-all duration-500`}>
            <span className={`w-2 h-2 ${isBeastMode ? 'bg-red-500' : 'bg-cyan-500'} rounded-full animate-ping`}></span>
            <span className={`${isBeastMode ? 'text-red-400' : 'text-cyan-400'} font-mono text-[9px] md:text-[10px] tracking-[0.2em] md:tracking-[0.3em] uppercase`}>
              Status: {isBeastMode ? 'BEAST_PROTOCOL_ACTIVE' : 'Online'}
            </span>
          </div>
          
          <h2 className={`text-slate-400 font-audiowide text-sm md:text-lg tracking-widest mb-2 opacity-80 uppercase transition-all ${isBeastMode ? 'beast-glitch text-red-100' : ''}`}>{bio.name}</h2>
          <h1 className={`text-4xl sm:text-6xl md:text-8xl font-black font-orbitron mb-6 md:mb-8 leading-tight md:leading-none tracking-tighter text-white transition-all duration-500 ${isBeastMode ? 'beast-shake' : ''}`}>
            {bio.profession.split(' ')[0]} <br />
            <span className="beast-gradient-text uppercase">{bio.profession.split(' ').slice(1).join(' ')}</span>
          </h1>
          
          <p className="text-base md:text-xl text-slate-400 font-light max-w-xl mx-auto lg:mx-0 mb-10 md:mb-12 leading-relaxed font-exo transition-all">
            {isBeastMode ? `MODO_FERA_ATIVADO: ${bio.description.substring(0, 120)}...` : `${bio.description.substring(0, 150)}...`}
          </p>
          
          <div className="flex flex-wrap justify-center lg:justify-start gap-4 md:gap-6">
            <button 
              onClick={onExplore}
              className={`relative group w-full sm:w-auto ${isBeastMode ? 'bg-red-500 shadow-[0_10px_30px_rgba(239,68,68,0.4)]' : 'bg-cyan-500 shadow-[0_10px_30px_rgba(34,211,238,0.3)]'} text-slate-950 font-black font-orbitron px-8 md:px-10 py-4 md:py-5 rounded-xl transition-all active:scale-95`}
            >
              <span className={isBeastMode ? 'beast-glitch' : ''}>{isBeastMode ? 'ACCESS_WAR_ROOM' : 'EXPLORE_DATA'}</span>
            </button>
          </div>
        </div>

        <div className="relative hidden lg:block animate-[reveal-up_1.2s_ease-out]">
          <div className={`relative w-full aspect-square glass rounded-3xl overflow-hidden border ${isBeastMode ? 'border-red-500/40' : 'border-white/10'} group shadow-2xl transition-all duration-700`}>
            <div className={`absolute inset-0 bg-gradient-to-br ${isBeastMode ? 'from-red-500/30 via-transparent to-orange-500/30' : 'from-cyan-500/20 via-transparent to-purple-500/20'} transition-all duration-700`}></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`text-[150px] md:text-[200px] ${isBeastMode ? 'opacity-30 scale-110 rotate-12' : 'opacity-10 filter blur-sm group-hover:blur-none'} transition-all duration-700 select-none`}>
                {isBeastMode ? '🔥' : '🐾'}
              </div>
              <div className="absolute inset-0 cyber-grid opacity-30"></div>
              {isBeastMode && <div className="scan-bar"></div>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
