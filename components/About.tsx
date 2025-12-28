
import React from 'react';
import { BioInfo } from '../types';

interface AboutProps {
  bio: BioInfo;
}

const About: React.FC<AboutProps> = ({ bio }) => {
  return (
    <section id="about" className="py-32 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <h2 className="text-5xl font-black font-orbitron mb-12 text-white flex items-center gap-6">
              <span className="text-cyan-500">01.</span> SOBRE_MIM
            </h2>
            <div className="space-y-8 text-slate-400 leading-relaxed font-exo text-xl">
              <p className="reveal">
                {bio.description}
              </p>
              <div className="p-6 glass rounded-2xl border-l-4 border-cyan-500 reveal">
                <p className="text-slate-200 font-medium italic">
                  Pronto para novos desafios técnicos e evolução constante.
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 reveal">
            <SkillCard title="Frontend" skills={['React', 'TypeScript', 'Tailwind']} icon="💻" color="cyan" />
            <SkillCard title="Backend" skills={['Node.js', 'PostgreSQL', 'Python']} icon="⚙️" color="purple" />
            <SkillCard title="Analysis" skills={['Lógica', 'UX/UI', 'UML']} icon="📊" color="emerald" />
            <SkillCard title="Soft" skills={['Curiosidade', 'Foco', 'Resiliência']} icon="🧠" color="pink" />
          </div>
        </div>
      </div>
    </section>
  );
};

const SkillCard: React.FC<{ title: string; skills: string[]; icon: string; color: string }> = ({ title, skills, icon, color }) => {
  const colorMap: Record<string, string> = {
    cyan: 'border-cyan-500/20 group-hover:border-cyan-500 text-cyan-400',
    purple: 'border-purple-500/20 group-hover:border-purple-500 text-purple-400',
    emerald: 'border-emerald-500/20 group-hover:border-emerald-500 text-emerald-400',
    pink: 'border-pink-500/20 group-hover:border-pink-500 text-pink-400',
  };

  return (
    <div className={`p-8 glass rounded-3xl border transition-all duration-500 group hover:-translate-y-2 hover:shadow-2xl ${colorMap[color] || ''}`}>
      <div className="text-4xl mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-transform">{icon}</div>
      <h3 className="text-white font-black font-orbitron text-sm mb-4 tracking-wider uppercase">{title}</h3>
      <ul className="text-slate-500 text-xs space-y-2 font-mono">
        {skills.map(s => <li key={s} className="group-hover:text-slate-300 transition-colors">>> {s}</li>)}
      </ul>
    </div>
  );
};

export default About;
