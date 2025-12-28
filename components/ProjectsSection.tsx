
import React from 'react';
import { Project } from '../types';

interface ProjectsSectionProps {
  projects: Project[];
  isBeastMode?: boolean;
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects, isBeastMode }) => {
  return (
    <section id="projects" className="py-24 md:py-32 bg-slate-950/40 relative">
      <div className={`absolute inset-0 cyber-grid ${isBeastMode ? 'opacity-20' : 'opacity-10'} pointer-events-none`}></div>
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-20 gap-8">
          <div>
            <h2 className={`text-4xl md:text-5xl font-black font-orbitron mb-4 text-white ${isBeastMode ? 'beast-glitch' : ''}`}>
              PROJETOS<span className={isBeastMode ? 'text-red-500' : 'text-cyan-500'}>.DATA</span>
            </h2>
            <p className="text-slate-500 font-exo max-w-md text-sm md:text-base">Exploração técnica de soluções de software e arquiteturas robustas.</p>
          </div>
          <a href="https://github.com/ivanildomelo" target="_blank" rel="noopener noreferrer" className={`font-orbitron text-[10px] md:text-xs ${isBeastMode ? 'text-red-500' : 'text-cyan-500'} tracking-widest hover:text-white transition-colors flex items-center gap-2 group`}>
            GITHUB_REPOSITORY 
            <span className="group-hover:translate-x-2 transition-transform">→</span>
          </a>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {projects.map((project, idx) => (
            <div 
              key={project.id} 
              className="group relative flex flex-col h-full"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className={`absolute -inset-1 bg-gradient-to-r ${isBeastMode ? 'from-red-500 to-orange-500' : 'from-cyan-500 to-purple-500'} rounded-3xl blur opacity-10 group-hover:opacity-30 transition duration-500`}></div>
              <div className={`relative glass p-8 md:p-10 rounded-3xl border ${isBeastMode ? 'border-red-500/10 group-hover:border-red-500/30' : 'border-white/5 group-hover:border-cyan-500/30'} flex flex-col h-full transition-all duration-500 group-hover:-translate-y-3`}>
                <div className="flex justify-between items-start mb-6">
                  <span className="text-slate-700 font-mono text-[9px] md:text-[10px] tracking-widest uppercase">MÓDULO_{project.id}</span>
                  <div className={`w-2 h-2 rounded-full ${isBeastMode ? 'bg-red-500' : 'bg-cyan-500'} animate-pulse`}></div>
                </div>
                
                <h3 className={`text-xl md:text-2xl font-black font-orbitron mb-6 text-white group-hover:${isBeastMode ? 'text-red-400' : 'text-cyan-400'} transition-colors uppercase tracking-tight`}>
                  {project.title}
                </h3>
                
                <p className="text-slate-500 mb-8 text-xs md:text-sm font-exo leading-relaxed flex-grow group-hover:text-slate-300 transition-colors">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.tech.map(t => (
                    <span key={t} className={`px-2 py-1 bg-black/40 ${isBeastMode ? 'text-red-400 border-red-500/20' : 'text-cyan-400 border-cyan-500/20'} text-[8px] md:text-[9px] font-bold rounded-lg border uppercase tracking-tighter`}>
                      {t}
                    </span>
                  ))}
                </div>
                
                <div className="mt-8 pt-8 border-t border-white/5 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                  <a 
                    href={project.githubUrl || "https://github.com/ivanildomelo"} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`text-[9px] md:text-[10px] font-black font-orbitron text-white tracking-widest hover:${isBeastMode ? 'text-red-400' : 'text-cyan-400'} transition-colors`}
                  >
                    VIEW_CODE
                  </a>
                  <a 
                    href={project.liveUrl || "#"} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`text-[9px] md:text-[10px] font-black font-orbitron text-white tracking-widest hover:${isBeastMode ? 'text-red-400' : 'text-cyan-400'} transition-colors`}
                  >
                    LIVE_DEMO
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
