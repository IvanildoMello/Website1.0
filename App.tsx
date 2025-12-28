
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
import { supabaseService } from './services/supabase';

const STORAGE_KEYS = {
  BIO: 'beast_portfolio_bio',
  PROJECTS: 'beast_portfolio_projects',
  INTERESTS: 'beast_portfolio_interests',
  BEAST_MODE: 'beast_portfolio_mode',
  AUTH: 'beast_portfolio_auth'
};

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<Section>(Section.Home);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
  });

  const [bio, setBio] = useState<BioInfo>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BIO);
    return saved ? JSON.parse(saved) : {
      name: 'Ivanildo Melo',
      profession: 'Analista de Sistemas',
      description: 'Sou formado em Análise e Desenvolvimento de Sistemas e apaixonado por tecnologia. No meu tempo livre, gosto de filmes, séries, jogos e música eletrônica. A curiosidade me motiva a aprender algo novo a cada dia.',
      email: 'ivanildo.melo@dev.com',
      linkedin: 'linkedin.com/in/ivanildo',
      location: 'Brasil, Terra'
    };
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    return saved ? JSON.parse(saved) : [
      { 
        id: '1', 
        title: 'ERP Industrial', 
        description: 'Sistema robusto para gestão de produção e estoque.', 
        tech: ['React', 'Node.js', 'PostgreSQL'],
        githubUrl: 'https://github.com/ivanildomelo/erp',
        liveUrl: 'https://erp-demo.ivanildomelo.dev'
      },
      { 
        id: '2', 
        title: 'Dashboard de Vendas', 
        description: 'Visualização de dados em tempo real para equipes comerciais.', 
        tech: ['TypeScript', 'D3.js', 'Tailwind'],
        githubUrl: 'https://github.com/ivanildomelo/dashboard',
        liveUrl: 'https://dashboard-demo.ivanildomelo.dev'
      },
    ];
  });

  const [interests, setInterests] = useState<Interest[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INTERESTS);
    return saved ? JSON.parse(saved) : [
      { id: '1', category: 'Movie', title: 'Interstellar', description: 'Ficção científica que expande os horizontes da mente.', icon: '🎬' },
      { id: '2', category: 'Game', title: 'Cyberpunk 2077', description: 'Imersão total em um futuro distópico e tecnológico.', icon: '🎮' },
    ];
  });

  const [isBeastMode, setIsBeastMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BEAST_MODE);
    return saved === 'true';
  });

  useEffect(() => {
    const loadSupabaseData = async () => {
      try {
        const [remoteBio, remoteProjects, remoteInterests] = await Promise.all([
          supabaseService.getBio(),
          supabaseService.getProjects(),
          supabaseService.getInterests()
        ]);

        if (remoteBio) setBio(remoteBio);
        if (remoteProjects && remoteProjects.length > 0) setProjects(remoteProjects);
        if (remoteInterests && remoteInterests.length > 0) setInterests(remoteInterests);
      } catch (err) {
        console.warn("Supabase offline.");
      }
    };
    loadSupabaseData();
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BIO, JSON.stringify(bio));
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    localStorage.setItem(STORAGE_KEYS.INTERESTS, JSON.stringify(interests));
    localStorage.setItem(STORAGE_KEYS.BEAST_MODE, String(isBeastMode));
    localStorage.setItem(STORAGE_KEYS.AUTH, String(isAuthenticated));
    
    if (isBeastMode) {
      document.body.classList.add('beast-active');
    } else {
      document.body.classList.remove('beast-active');
    }
  }, [bio, projects, interests, isBeastMode, isAuthenticated]);

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
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col selection:bg-cyan-500 selection:text-slate-950 transition-colors duration-700 ${isBeastMode ? 'beast-theme' : ''}`}>
      <Navbar activeSection={activeSection} setActiveSection={setActiveSection} isBeastMode={isBeastMode} />
      
      <main className="flex-grow">
        {activeSection === Section.Home && (
          <div className="relative">
            <Hero bio={bio} onExplore={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })} isBeastMode={isBeastMode} />
            <div className="reveal"><About bio={bio} /></div>
            <div className="reveal"><ProjectsSection projects={projects} isBeastMode={isBeastMode} /></div>
            <div className="reveal"><InterestsSection interests={interests} isBeastMode={isBeastMode} /></div>
            <div className="reveal"><Contact bio={bio} isBeastMode={isBeastMode} /></div>
          </div>
        )}

        {activeSection === Section.Admin && (
          <div className="animate-[reveal-up_0.6s_ease-out]">
            <AdminPanel 
              bio={bio} setBio={setBio}
              projects={projects} setProjects={setProjects}
              interests={interests} setInterests={setInterests}
              isBeastMode={isBeastMode} setIsBeastMode={setIsBeastMode}
              isAuthenticated={isAuthenticated}
              setIsAuthenticated={setIsAuthenticated}
              onClose={() => setActiveSection(Section.Home)}
            />
          </div>
        )}
      </main>

      <button 
        onClick={() => setIsAiOpen(!isAiOpen)}
        className={`fixed bottom-8 right-8 z-[100] ${isBeastMode ? 'bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.5)]' : 'bg-cyan-500 shadow-[0_0_20px_rgba(34,211,238,0.4)]'} text-slate-950 p-5 rounded-2xl transition-all duration-300 hover:scale-110 hover:-rotate-6 group`}
      >
        <span className="text-2xl group-hover:animate-bounce inline-block">🐾</span>
      </button>

      {isAiOpen && (
        <div className="fixed bottom-28 right-8 z-[101] w-[350px] md:w-[420px] transition-all animate-[reveal-up_0.4s_ease-out]">
          <BeastAI onClose={() => setIsAiOpen(false)} isBeastMode={isBeastMode} />
        </div>
      )}

      <footer className="bg-slate-950/80 backdrop-blur-xl border-t border-slate-800 py-12 text-center transition-all duration-500">
        <div className="max-w-4xl mx-auto px-6">
          <div className={`text-2xl font-orbitron font-bold text-white mb-4 tracking-tighter ${isBeastMode ? 'beast-glitch' : ''}`}>
            {bio.name.split(' ').map(n => n[0]).join('')}<span className={isBeastMode ? 'text-red-500' : 'text-cyan-500'}>.CORE</span>
          </div>
          <p className="text-slate-500 text-[10px] uppercase font-mono tracking-[0.2em]">&copy; {new Date().getFullYear()} {bio.name} // BEAST_SYSTEM_DEPLOYED.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
