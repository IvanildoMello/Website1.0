
import React, { useState, useEffect, useRef } from 'react';
import { Project, Interest, BioInfo } from '../types';

interface AdminPanelProps {
  bio: BioInfo;
  setBio: React.Dispatch<React.SetStateAction<BioInfo>>;
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  interests: Interest[];
  setInterests: React.Dispatch<React.SetStateAction<Interest[]>>;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ bio, setBio, projects, setProjects, interests, setInterests, onClose }) => {
  const [isBooting, setIsBooting] = useState(true);
  const [activeTab, setActiveTab] = useState<'bio' | 'projects' | 'interests'>('bio');
  const [logs, setLogs] = useState<string[]>(['INICIANDO PROTOCOLO DE ACESSO LIVRE...', 'SINC_BEAST_CORE ATIVO.']);
  
  // State for editing existing items
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editingInterestId, setEditingInterestId] = useState<string | null>(null);

  const [projectForm, setProjectForm] = useState<Partial<Project>>({ title: '', description: '', tech: [] });
  const [interestForm, setInterestForm] = useState<Partial<Interest>>({ title: '', category: 'Game', icon: '🎮', description: '' });

  // Boot sequence effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsBooting(false);
      addLog('ACESSO AO NÚCLEO ESTABELECIDO.');
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const addLog = (msg: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 10));
  };

  // CRUD Bio
  const updateBio = (field: keyof BioInfo, value: string) => {
    setBio(prev => ({ ...prev, [field]: value }));
    addLog(`BIO ATUALIZADA: ${field.toUpperCase()}`);
  };

  // CRUD Projects
  const handleSaveProject = () => {
    if (!projectForm.title) return;

    if (editingProjectId) {
      setProjects(prev => prev.map(p => p.id === editingProjectId ? { ...p, ...projectForm } as Project : p));
      addLog(`PROJETO ATUALIZADO: ${editingProjectId}`);
      setEditingProjectId(null);
    } else {
      const project: Project = {
        id: Math.random().toString(36).substr(2, 6).toUpperCase(),
        title: projectForm.title || '',
        description: projectForm.description || '',
        tech: projectForm.tech || []
      };
      setProjects([project, ...projects]);
      addLog(`PROJETO INJETADO: ${project.id}`);
    }
    setProjectForm({ title: '', description: '', tech: [] });
  };

  const startEditProject = (p: Project) => {
    setProjectForm(p);
    setEditingProjectId(p.id);
    addLog(`EDITANDO MÓDULO: ${p.id}`);
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    addLog(`PROJETO REMOVIDO: ${id}`);
  };

  // CRUD Interests
  const handleSaveInterest = () => {
    if (!interestForm.title) return;

    if (editingInterestId) {
      setInterests(prev => prev.map(i => i.id === editingInterestId ? { ...i, ...interestForm } as Interest : i));
      addLog(`INTERESSE ATUALIZADO: ${interestForm.title}`);
      setEditingInterestId(null);
    } else {
      const interest: Interest = {
        id: Math.random().toString(36).substr(2, 6).toUpperCase(),
        title: interestForm.title || '',
        category: interestForm.category || 'Game',
        description: interestForm.description || '',
        icon: interestForm.icon || '🐾'
      };
      setInterests([interest, ...interests]);
      addLog(`INTERESSE ADICIONADO: ${interest.title}`);
    }
    setInterestForm({ title: '', category: 'Game', icon: '🎮', description: '' });
  };

  const startEditInterest = (i: Interest) => {
    setInterestForm(i);
    setEditingInterestId(i.id);
    addLog(`EDITANDO PAIXÃO: ${i.title}`);
  };

  const deleteInterest = (id: string) => {
    setInterests(prev => prev.filter(i => i.id !== id));
    addLog(`INTERESSE REMOVIDO: ${id}`);
  };

  if (isBooting) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black cyber-grid">
        <div className="scanline"></div>
        <div className="text-cyan-500 font-mono text-xl animate-pulse flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-t-2 border-cyan-500 rounded-full animate-spin"></div>
          <span className="tracking-[0.5em] uppercase text-sm font-black">AUTENTICANDO_ACESSO_LIVRE...</span>
          <div className="flex gap-1 text-xs opacity-50">
            <span className="animate-bounce">[</span>
            <span>BEAST_OS</span>
            <span className="animate-bounce">]</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#010409] cyber-grid p-6 md:p-12 animate-beastly-bg">
      <div className="scanline"></div>
      <div className="max-w-7xl mx-auto flex flex-col gap-8 relative z-10">
        <header className="glass p-8 rounded-3xl border border-cyan-500/20 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <span className="text-3xl animate-soft-pulse">🐆</span>
            <div>
              <div className="flex items-center gap-2">
                 <h2 className="text-2xl font-black text-white font-orbitron tracking-tighter uppercase">CMS_BEAST_SYSTEM</h2>
                 <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[8px] font-bold rounded border border-emerald-500/30">OPEN_ACCESS</span>
              </div>
              <p className="text-[10px] text-cyan-500 font-mono tracking-widest uppercase">Proprietário: Ivanildo Melo | Núcleo: Sincronizado</p>
            </div>
          </div>
          <button onClick={onClose} className="px-8 py-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl font-bold uppercase text-xs hover:bg-red-500 hover:text-white transition-all shadow-[0_0_15px_rgba(239,68,68,0.1)]">Sair do Painel</button>
        </header>

        <div className="grid lg:grid-cols-12 gap-8">
          <aside className="lg:col-span-3 space-y-4">
            <TabBtn active={activeTab === 'bio'} onClick={() => setActiveTab('bio')} label="IDENTIDADE" icon="🆔" />
            <TabBtn active={activeTab === 'projects'} onClick={() => setActiveTab('projects')} label="BIO-MÓDULOS" icon="⚙️" />
            <TabBtn active={activeTab === 'interests'} onClick={() => setActiveTab('interests')} label="PAIXÕES" icon="❤️" />
            
            <div className="mt-8 bg-black/40 p-6 rounded-2xl border border-slate-800 font-mono text-[9px] uppercase space-y-2 shadow-inner">
              <div className="text-cyan-500 mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-ping"></span>
                LIVE_FEED:
              </div>
              {logs.map((log, i) => <div key={i} className={`transition-all duration-500 ${i === 0 ? 'text-cyan-400 border-l border-cyan-500 pl-2' : 'opacity-40 pl-2'}`}>{log}</div>)}
            </div>
          </aside>

          <main className="lg:col-span-9 glass rounded-3xl border border-white/5 p-10 relative min-h-[600px] shadow-2xl">
            <div className="scanline opacity-10 pointer-events-none"></div>

            {/* TAB: BIO */}
            {activeTab === 'bio' && (
              <div className="space-y-8 animate-entry-beast">
                <h3 className="text-xl font-black text-white font-orbitron mb-6 flex items-center gap-4">
                  <span className="text-cyan-500 text-2xl">◆</span> EDITAR_IDENTIDADE
                </h3>
                <AdminInput label="Nome Completo" value={bio.name} onChange={(v) => updateBio('name', v)} />
                <AdminInput label="Profissão / Título" value={bio.profession} onChange={(v) => updateBio('profession', v)} />
                <div className="space-y-2">
                  <label className="text-[10px] font-black font-orbitron text-slate-500 uppercase tracking-widest ml-2">Bio Descrição</label>
                  <textarea 
                    value={bio.description} 
                    onChange={(e) => updateBio('description', e.target.value)}
                    className="w-full bg-black/40 border border-white/10 p-6 rounded-2xl text-slate-200 font-exo text-sm h-48 focus:border-cyan-500/50 outline-none transition-all resize-none shadow-inner focus:ring-1 focus:ring-cyan-500/20"
                    placeholder="Descreva sua jornada tecnológica..."
                  />
                </div>
              </div>
            )}

            {/* TAB: PROJECTS */}
            {activeTab === 'projects' && (
              <div className="space-y-10 animate-entry-beast">
                <h3 className="text-xl font-black text-white font-orbitron flex items-center gap-4">
                  <span className="text-cyan-500 text-2xl">◆</span> GERENCIAR_BIO_MÓDULOS
                </h3>
                
                <div className="p-10 bg-cyan-500/5 border border-cyan-500/20 rounded-3xl space-y-6 shadow-lg">
                  <h4 className="text-[10px] font-black text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                    {editingProjectId ? 'Atualizar Módulo' : 'Injeção de Novo Módulo'}
                  </h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <input 
                      placeholder="TÍTULO_PROJETO" 
                      className="bg-black/60 border border-white/10 p-5 rounded-xl text-xs font-mono outline-none focus:border-cyan-500/50 transition-all"
                      value={projectForm.title}
                      onChange={(e) => setProjectForm({...projectForm, title: e.target.value})}
                    />
                    <input 
                      placeholder="TECHS (Separadas por vírgula)" 
                      className="bg-black/60 border border-white/10 p-5 rounded-xl text-xs font-mono outline-none focus:border-cyan-500/50 transition-all"
                      value={projectForm.tech?.join(', ')}
                      onChange={(e) => setProjectForm({...projectForm, tech: e.target.value.split(',').map(s => s.trim())})}
                    />
                  </div>
                  <textarea 
                    placeholder="DESCRIÇÃO_FUNCIONAL" 
                    className="w-full bg-black/60 border border-white/10 p-5 rounded-xl text-xs font-mono h-24 outline-none focus:border-cyan-500/50 resize-none transition-all"
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                  />
                  <div className="flex gap-4">
                    <button onClick={handleSaveProject} className="bg-cyan-500 text-slate-950 font-black px-10 py-4 rounded-xl uppercase text-[10px] tracking-widest hover:bg-cyan-400 transition-all shadow-[0_5px_15px_rgba(34,211,238,0.2)] active:scale-95">
                      {editingProjectId ? 'Confirmar Edição' : 'Executar Injeção'}
                    </button>
                    {editingProjectId && (
                      <button onClick={() => { setEditingProjectId(null); setProjectForm({ title: '', description: '', tech: [] }); }} className="bg-slate-800 text-white px-6 py-4 rounded-xl uppercase text-[10px] tracking-widest hover:bg-slate-700 transition-all">
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-1 gap-4">
                  {projects.map(p => (
                    <div key={p.id} className="p-6 bg-black/40 border border-slate-800 rounded-2xl flex justify-between items-center group hover:border-cyan-500/30 transition-all shadow-sm">
                      <div>
                        <div className="text-xs font-black text-white uppercase tracking-tight">{p.title}</div>
                        <div className="text-[9px] text-slate-600 font-mono mt-1">HASH: {p.id} | Tech: {p.tech.join(', ')}</div>
                      </div>
                      <div className="flex gap-4">
                        <button onClick={() => startEditProject(p)} className="text-cyan-500 hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest hover:underline">Editar</button>
                        <button onClick={() => deleteProject(p.id)} className="text-red-500 hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest hover:underline">Deletar</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: INTERESTS */}
            {activeTab === 'interests' && (
              <div className="space-y-10 animate-entry-beast">
                <h3 className="text-xl font-black text-white font-orbitron flex items-center gap-4">
                  <span className="text-cyan-500 text-2xl">◆</span> GERENCIAR_PAIXÕES
                </h3>
                
                <div className="p-10 bg-purple-500/5 border border-purple-500/20 rounded-3xl space-y-6 shadow-lg">
                   <h4 className="text-[10px] font-black text-purple-400 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    {editingInterestId ? 'Atualizar Paixão' : 'Fixar Nova Paixão'}
                   </h4>
                   <div className="grid md:grid-cols-3 gap-6">
                      <input 
                        placeholder="IDENTIFICADOR" 
                        className="bg-black/60 border border-white/10 p-5 rounded-xl text-xs font-mono outline-none focus:border-purple-500/50 transition-all"
                        value={interestForm.title}
                        onChange={(e) => setInterestForm({...interestForm, title: e.target.value})}
                      />
                      <select 
                        className="bg-black/60 border border-white/10 p-5 rounded-xl text-xs font-mono text-slate-400 outline-none cursor-pointer focus:border-purple-500/50 transition-all"
                        value={interestForm.category}
                        onChange={(e) => setInterestForm({...interestForm, category: e.target.value as any})}
                      >
                        <option value="Game">GAME</option>
                        <option value="Movie">MOVIE</option>
                        <option value="Music">MUSIC</option>
                        <option value="Serie">SERIE</option>
                      </select>
                      <input 
                        placeholder="ÍCONE (Emoji)" 
                        className="bg-black/60 border border-white/10 p-5 rounded-xl text-xs font-mono text-center outline-none focus:border-purple-500/50 transition-all"
                        value={interestForm.icon}
                        onChange={(e) => setInterestForm({...interestForm, icon: e.target.value})}
                      />
                   </div>
                   <textarea 
                    placeholder="DESCRIÇÃO BREVE" 
                    className="w-full bg-black/60 border border-white/10 p-5 rounded-xl text-xs font-mono h-24 outline-none focus:border-purple-500/50 resize-none transition-all"
                    value={interestForm.description}
                    onChange={(e) => setInterestForm({...interestForm, description: e.target.value})}
                  />
                   <div className="flex gap-4">
                    <button onClick={handleSaveInterest} className="bg-purple-500 text-white font-black px-10 py-4 rounded-xl uppercase text-[10px] tracking-widest hover:bg-purple-400 transition-all shadow-[0_5px_15px_rgba(168,85,247,0.2)] active:scale-95">
                      {editingInterestId ? 'Salvar Edição' : 'Fixar em Core'}
                    </button>
                    {editingInterestId && (
                      <button onClick={() => { setEditingInterestId(null); setInterestForm({ title: '', category: 'Game', icon: '🎮', description: '' }); }} className="bg-slate-800 text-white px-6 py-4 rounded-xl uppercase text-[10px] tracking-widest hover:bg-slate-700 transition-all">
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-1 gap-4">
                  {interests.map(i => (
                    <div key={i.id} className="p-6 bg-black/40 border border-slate-800 rounded-2xl flex justify-between items-center hover:border-purple-500/30 transition-all shadow-sm">
                      <div className="flex items-center gap-6">
                        <span className="text-3xl filter drop-shadow-[0_0_10px_rgba(168,85,247,0.2)]">{i.icon}</span>
                        <div>
                          <div className="text-xs font-black text-white uppercase tracking-tight">{i.title}</div>
                          <div className="text-[9px] text-purple-500 mt-1 uppercase font-mono tracking-widest">{i.category}</div>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <button onClick={() => startEditInterest(i)} className="text-purple-400 hover:text-white text-[10px] font-bold uppercase tracking-widest hover:underline transition-all">Editar</button>
                        <button onClick={() => deleteInterest(i.id)} className="text-red-500 hover:text-white text-[10px] font-bold uppercase tracking-widest hover:underline transition-all">Deletar</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

const TabBtn: React.FC<{ active: boolean; onClick: () => void; label: string; icon: string }> = ({ active, onClick, label, icon }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-5 p-6 rounded-2xl border transition-all duration-500 font-orbitron text-[10px] font-black uppercase tracking-[0.2em] relative overflow-hidden group ${
      active 
        ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_25px_rgba(34,211,238,0.2)]' 
        : 'bg-black/60 text-slate-500 border-white/5 hover:border-cyan-500/20 hover:text-cyan-400'
    }`}
  >
    <div className={`absolute left-0 top-0 h-full w-1 bg-cyan-400 transition-all ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}></div>
    <span className="text-2xl transition-transform group-hover:scale-110 group-hover:rotate-6">{icon}</span>
    {label}
  </button>
);

const AdminInput: React.FC<{ label: string; value: string; onChange: (v: string) => void }> = ({ label, value, onChange }) => (
  <div className="space-y-2 group">
    <label className="text-[10px] font-black font-orbitron text-slate-500 uppercase tracking-widest ml-4 group-focus-within:text-cyan-500 transition-colors duration-300">{label}</label>
    <input 
      type="text" 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-black/40 border border-white/10 p-6 rounded-2xl text-slate-200 font-exo text-sm focus:outline-none focus:border-cyan-500/50 transition-all shadow-inner focus:ring-1 focus:ring-cyan-500/20"
      placeholder={`Insira ${label.toLowerCase()}...`}
    />
  </div>
);

export default AdminPanel;
