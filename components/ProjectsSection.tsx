
import React from 'react';
import { Project } from '../types';

interface ProjectsSectionProps {
  projects: Project[];
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects }) => {
  return (
    <section id="projects" className="py-32 bg-slate-950/40 relative">
      <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div>
            <h2 className="text-5xl font-black font-orbitron mb-4 text-white">
              PROJETOS<span className="text-cyan-500">.DATA</span>
            </h2>
            <p className="text-slate-500 font-exo max-w-md">Exploração técnica de soluções de software e arquiteturas robustas.</p>
          </div>
          <a href="#" className="font-orbitron text-xs text-cyan-500 tracking-widest hover:text-white transition-colors flex items-center gap-2 group">
            GITHUB_REPOSITORY 
            <span className="group-hover:translate-x-2 transition-transform">→</span>
          </a>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {projects.map((project, idx) => (
            <div 
              key={project.id} 
              className="group relative"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-3xl blur opacity-10 group-hover:opacity-30 transition duration-500"></div>
              <div className="relative glass p-10 rounded-3xl border border-white/5 flex flex-col h-full transition-all duration-500 group-hover:-translate-y-3 group-hover:border-cyan-500/30">
                <div className="flex justify-between items-start mb-6">
                  <span className="text-slate-700 font-mono text-[10px] tracking-widest">ID_MOD_{project.id}</span>
                  <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
                </div>
                
                <h3 className="text-2xl font-black font-orbitron mb-6 text-white group-hover:text-cyan-400 transition-colors uppercase tracking-tight">
                  {project.title}
                </h3>
                
                <p className="text-slate-500 mb-8 text-sm font-exo leading-relaxed flex-grow group-hover:text-slate-300 transition-colors">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.tech.map(t => (
                    <span key={t} className="px-3 py-1 bg-black/40 text-cyan-400 text-[9px] font-bold rounded-lg border border-cyan-500/20 uppercase tracking-tighter">
                      {t}
                    </span>
                  ))}
                </div>
                
                <div className="mt-8 pt-8 border-t border-white/5 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                  <button className="text-[10px] font-black font-orbitron text-white tracking-widest hover:text-cyan-400 transition-colors">
                    VIEW_CODE
                  </button>
                  <button className="text-[10px] font-black font-orbitron text-white tracking-widest hover:text-cyan-400 transition-colors">
                    LIVE_DEMO
                  </button>
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
