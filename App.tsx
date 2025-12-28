
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import ProjectsSection from './components/ProjectsSection';
import InterestsSection from './components/InterestsSection';
import Contact from './components/Contact';
import AdminPanel from './components/AdminPanel';
import BeastAI from './components/BeastAI';
import { Section, Project, Interest, BioInfo } from './types';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<Section>(Section.Home);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Dynamic Content States
  const [bio, setBio] = useState<BioInfo>({
    name: 'Ivanildo Melo',
    profession: 'Analista de Sistemas',
    description: 'Sou formado em Análise e Desenvolvimento de Sistemas e apaixonado por tecnologia. No meu tempo livre, gosto de filmes, séries, jogos e música eletrônica. A curiosidade me motiva a aprender algo novo a cada dia.'
  });

  const [projects, setProjects] = useState<Project[]>([
    { id: '1', title: 'ERP Industrial', description: 'Sistema robusto para gestão de produção e estoque.', tech: ['React', 'Node.js', 'PostgreSQL'] },
    { id: '2', title: 'Dashboard de Vendas', description: 'Visualização de dados em tempo real para equipes comerciais.', tech: ['TypeScript', 'D3.js', 'Tailwind'] },
    { id: '3', title: 'App de Música Eletrônica', description: 'Um player social para descobrir novos DJs de techno.', tech: ['React Native', 'Firebase'] },
  ]);

  const [interests, setInterests] = useState<Interest[]>([
    { id: '1', category: 'Movie', title: 'Interstellar', description: 'Ficção científica que expande os horizontes da mente.', icon: '🎬' },
    { id: '2', category: 'Game', title: 'Cyberpunk 2077', description: 'Imersão total em um futuro distópico e tecnológico.', icon: '🎮' },
    { id: '3', category: 'Music', title: 'Techno / House', description: 'A batida sintética que move o mundo digital.', icon: '🎧' },
  ]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded) {
    return (
      <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center z-[9999]">
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-cyan-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-3xl animate-pulse">🐾</div>
        </div>
        <div className="text-cyan-500 font-orbitron tracking-[0.3em] text-sm animate-pulse">
          INITIALIZING_SYSTEM_CORE...
        </div>
        <div className="mt-4 w-48 h-1 bg-slate-900 rounded-full overflow-hidden">
          <div className="h-full bg-cyan-500 animate-[loading_2.5s_ease-in-out]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />
      
      <main className="flex-grow">
        {activeSection === Section.Home && (
          <div className="relative">
            <Hero 
              bio={bio}
              onExplore={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })} 
            />
            <div className="reveal">
              <About bio={bio} />
            </div>
            <div className="reveal">
              <ProjectsSection projects={projects} />
            </div>
            <div className="reveal">
              <InterestsSection interests={interests} />
            </div>
            <div className="reveal">
              <Contact />
            </div>
          </div>
        )}

        {activeSection === Section.Admin && (
          <div className="animate-[reveal-up_0.6s_ease-out]">
            <AdminPanel 
              bio={bio}
              setBio={setBio}
              projects={projects} 
              setProjects={setProjects}
              interests={interests}
              setInterests={setInterests}
              onClose={() => setActiveSection(Section.Home)}
            />
          </div>
        )}
      </main>

      <button 
        onClick={() => setIsAiOpen(!isAiOpen)}
        className="fixed bottom-8 right-8 z-[100] bg-cyan-500 hover:bg-cyan-400 text-slate-900 p-5 rounded-2xl shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all duration-300 hover:scale-110 hover:-rotate-6 group"
      >
        <span className="text-2xl group-hover:animate-bounce inline-block">🐾</span>
      </button>

      {isAiOpen && (
        <div className="fixed bottom-28 right-8 z-[101] w-[350px] md:w-[420px] transition-all animate-[reveal-up_0.4s_ease-out]">
          <BeastAI onClose={() => setIsAiOpen(false)} />
        </div>
      )}

      <footer className="bg-slate-950/80 backdrop-blur-xl border-t border-slate-800 py-12 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-2xl font-orbitron font-bold text-white mb-4 tracking-tighter">
            {bio.name.split(' ').map(n => n[0]).join('')}<span className="text-cyan-500">.CORE</span>
          </div>
          <p className="text-slate-500 text-[10px] uppercase font-mono">&copy; {new Date().getFullYear()} {bio.name} // All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
