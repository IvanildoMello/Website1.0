
import React, { useState, useEffect, useRef } from 'react';
import { Project, Interest, BioInfo } from '../types';

interface AdminPanelProps {
  bio: BioInfo;
  setBio: React.Dispatch<React.SetStateAction<BioInfo>>;
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  interests: Interest[];
  setInterests: React.Dispatch<React.SetStateAction<Interest[]>>;
  isBeastMode: boolean;
  setIsBeastMode: (v: boolean) => void;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ bio, setBio, projects, setProjects, interests, setInterests, isBeastMode, setIsBeastMode, onClose }) => {
  const [isBooting, setIsBooting] = useState(true);
  const [activeTab, setActiveTab] = useState<'bio' | 'projects' | 'interests' | 'system'>('bio');
  const [logs, setLogs] = useState<string[]>(['INICIANDO PROTOCOLO DE ACESSO LIVRE...', 'SINC_BEAST_CORE ATIVO.']);
  
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editingInterestId, setEditingInterestId] = useState<string | null>(null);

  const [projectForm, setProjectForm] = useState<Partial<Project>>({ title: '', description: '', tech: [] });
  const [interestForm, setInterestForm] = useState<Partial<Interest>>({ title: '', category: 'Game', icon: '🎮', description: '' });

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

  const updateBio = (field: keyof BioInfo, value: string) => {
    setBio(prev => ({ ...prev, [field]: value }));
    addLog(`BIO ATUALIZADA: ${field.toUpperCase()}`);
  };

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
      <div className="min-h-screen flex flex-col items-center justify-center bg-black cyber-grid p-6">
        <div className="text-cyan-500 font-mono text-center animate-pulse flex flex-col items-center gap-6">
          <div className="w-12 h-12 border-t-2 border-cyan-500 rounded-full animate-spin"></div>
          <span className="tracking-[0.3em] md:tracking-[0.5em] uppercase text-xs md:text-sm font-black">AUTENTICANDO_ACESSO_LIVRE...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isBeastMode ? 'bg-[#0a0000]' : 'bg-[#010409]'} cyber-grid p-4 md:p-12 animate-beastly-bg transition-colors duration-500`}>
      <div className="max-w-7xl mx-auto flex flex-col gap-6 md:gap-8 relative z-10 pt-20 lg:pt-0">
        <header className={`glass p-5 md:p-8 rounded-2xl md:rounded-3xl border ${isBeastMode ? 'border-red-500/40' : 'border-cyan-500/20'} flex flex-col md:flex-row justify-between items-center gap-4`}>
          <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto">
            <span className={`text-2xl md:text-3xl ${isBeastMode ? 'beast-shake' : 'animate-soft-pulse'}`}>🐆</span>
            <div>
              <div className="flex items-center gap-2">
                 <h2 className={`text-lg md:text-2xl font-black text-white font-orbitron tracking-tighter uppercase ${isBeastMode ? 'beast-glitch' : ''}`}>CMS_BEAST</h2>
                 <span className={`px-2 py-0.5 ${isBeastMode ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'} text-[7px] md:text-[8px] font-bold rounded border uppercase whitespace-nowrap`}>
                    {isBeastMode ? 'BEAST_ACTIVE' : 'OPEN_ACCESS'}
                 </span>
              </div>
              <p className={`text-[8px] md:text-[10px] ${isBeastMode ? 'text-red-500' : 'text-cyan-500'} font-mono tracking-widest uppercase truncate max-w-[200px] md:max-w-none`}>Ivanildo Melo | Sincronizado</p>
            </div>
          </div>
          <button onClick={onClose} className="w-full md:w-auto px-6 py-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl font-bold uppercase text-[10px] hover:bg-red-500 hover:text-white transition-all">Sair do Painel</button>
        </header>

        <div className="grid lg:grid-cols-12 gap-6 md:gap-8">
          <aside className="lg:col-span-3 flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-2 md:gap-4 pb-4 lg:pb-0 custom-scrollbar">
            <TabBtn active={activeTab === 'bio'} onClick={() => setActiveTab('bio')} label="BIO" icon="🆔" isBeast={isBeastMode} />
            <TabBtn active={activeTab === 'projects'} onClick={() => setActiveTab('projects')} label="PROJETOS" icon="⚙️" isBeast={isBeastMode} />
            <TabBtn active={activeTab === 'interests'} onClick={() => setActiveTab('interests')} label="PAIXÕES" icon="❤️" isBeast={isBeastMode} />
            <TabBtn active={activeTab === 'system'} onClick={() => setActiveTab('system')} label="SISTEMA" icon="⚡" isBeast={isBeastMode} />
          </aside>

          <main className="lg:col-span-9 glass rounded-2xl md:rounded-3xl border border-white/5 p-5 md:p-10 relative min-h-[500px] shadow-2xl">
            {activeTab === 'system' && (
              <div className="space-y-8 md:space-y-12 animate-entry-beast">
                <h3 className={`text-lg md:text-xl font-black text-white font-orbitron flex items-center gap-4 ${isBeastMode ? 'beast-glitch' : ''}`}>
                  <span className={isBeastMode ? 'text-red-500' : 'text-cyan-500'}>⚡</span> CONFIG_SISTEMA
                </h3>
                <div className={`p-6 md:p-10 rounded-2xl md:rounded-3xl border transition-all duration-500 ${isBeastMode ? 'bg-red-500/10 border-red-500/40' : 'bg-white/5 border-white/10'}`}>
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                    <div className="max-w-md">
                      <h4 className="text-xl md:text-2xl font-black text-white font-orbitron mb-3 tracking-tight">MODO_FERA_ALPHA</h4>
                      <p className="text-slate-400 font-exo text-xs md:text-sm leading-relaxed">Injeção visual agressiva para sessões de alta performance.</p>
                    </div>
                    <button 
                      onClick={() => setIsBeastMode(!isBeastMode)}
                      className={`relative w-full md:w-48 h-16 md:h-20 rounded-xl md:rounded-2xl flex items-center justify-center font-black font-orbitron transition-all duration-500 ${isBeastMode ? 'bg-red-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}
                    >
                      <span className="text-xs md:text-sm">{isBeastMode ? 'DESATIVAR' : 'ATIVAR_BEAST'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'bio' && (
              <div className="space-y-6 md:space-y-8 animate-entry-beast">
                <h3 className="text-lg md:text-xl font-black text-white font-orbitron flex items-center gap-4">
                  <span className={isBeastMode ? 'text-red-500' : 'text-cyan-500'}>◆</span> IDENTIDADE
                </h3>
                <AdminInput label="Nome" value={bio.name} onChange={(v) => updateBio('name', v)} isBeast={isBeastMode} />
                <AdminInput label="Profissão" value={bio.profession} onChange={(v) => updateBio('profession', v)} isBeast={isBeastMode} />
                <div className="space-y-2">
                  <label className="text-[9px] md:text-[10px] font-black font-orbitron text-slate-500 uppercase tracking-widest ml-2">Bio</label>
                  <textarea 
                    value={bio.description} 
                    onChange={(e) => updateBio('description', e.target.value)}
                    className={`w-full ${isBeastMode ? 'bg-red-950/20 border-red-500/20 text-red-100' : 'bg-black/40 border-white/10 text-slate-200'} p-4 md:p-6 rounded-xl md:rounded-2xl font-exo text-xs md:text-sm h-40 focus:outline-none transition-all resize-none shadow-inner`}
                  />
                </div>
              </div>
            )}

            {activeTab === 'projects' && (
              <div className="space-y-8 md:space-y-10 animate-entry-beast">
                <h3 className="text-lg md:text-xl font-black text-white font-orbitron flex items-center gap-4">
                  <span className={isBeastMode ? 'text-red-500' : 'text-cyan-500'}>◆</span> BIO-MÓDULOS
                </h3>
                <div className={`p-6 md:p-10 ${isBeastMode ? 'bg-red-500/5 border-red-500/20' : 'bg-cyan-500/5 border-cyan-500/20'} border rounded-2xl md:rounded-3xl space-y-4 md:space-y-6`}>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input placeholder="TÍTULO" className="bg-black/60 border border-white/10 p-4 rounded-xl text-[10px] md:text-xs font-mono outline-none" value={projectForm.title} onChange={(e) => setProjectForm({...projectForm, title: e.target.value})}/>
                    <input placeholder="TECHS" className="bg-black/60 border border-white/10 p-4 rounded-xl text-[10px] md:text-xs font-mono outline-none" value={projectForm.tech?.join(', ')} onChange={(e) => setProjectForm({...projectForm, tech: e.target.value.split(',').map(s => s.trim())})}/>
                  </div>
                  <textarea placeholder="DESCRIÇÃO" className="w-full bg-black/60 border border-white/10 p-4 rounded-xl text-[10px] md:text-xs font-mono h-24 outline-none resize-none" value={projectForm.description} onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}/>
                  <button onClick={handleSaveProject} className={`w-full md:w-auto ${isBeastMode ? 'bg-red-500' : 'bg-cyan-500'} text-slate-950 font-black px-8 py-4 rounded-xl uppercase text-[9px] md:text-[10px] tracking-widest`}>
                    {editingProjectId ? 'Salvar Edição' : 'Injetar'}
                  </button>
                </div>
                <div className="space-y-3">
                  {projects.map(p => (
                    <div key={p.id} className="p-4 bg-black/40 border border-slate-800 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4 group transition-all">
                      <div className="w-full md:w-auto">
                        <div className="text-[10px] font-black text-white uppercase">{p.title}</div>
                        <div className="text-[8px] text-slate-600 font-mono mt-1 uppercase">HASH: {p.id}</div>
                      </div>
                      <div className="flex gap-4 w-full md:w-auto justify-end">
                        <button onClick={() => startEditProject(p)} className={`${isBeastMode ? 'text-red-500' : 'text-cyan-500'} text-[9px] font-bold uppercase`}>Editar</button>
                        <button onClick={() => deleteProject(p.id)} className="text-red-500 text-[9px] font-bold uppercase">X</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'interests' && (
              <div className="space-y-8 md:space-y-10 animate-entry-beast">
                <h3 className="text-lg md:text-xl font-black text-white font-orbitron flex items-center gap-4">
                  <span className={isBeastMode ? 'text-red-500' : 'text-cyan-500'}>◆</span> PAIXÕES
                </h3>
                <div className={`p-6 md:p-10 ${isBeastMode ? 'bg-orange-500/5 border-orange-500/20' : 'bg-purple-500/5 border-purple-500/20'} border rounded-2xl md:rounded-3xl space-y-4 md:space-y-6`}>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <input placeholder="NOME" className="bg-black/60 border border-white/10 p-4 rounded-xl text-[10px] md:text-xs font-mono outline-none" value={interestForm.title} onChange={(e) => setInterestForm({...interestForm, title: e.target.value})}/>
                      <select className="bg-black/60 border border-white/10 p-4 rounded-xl text-[10px] md:text-xs font-mono text-slate-400 outline-none" value={interestForm.category} onChange={(e) => setInterestForm({...interestForm, category: e.target.value as any})}>
                        <option value="Game">GAME</option><option value="Movie">MOVIE</option><option value="Music">MUSIC</option><option value="Serie">SERIE</option>
                      </select>
                      <input placeholder="ÍCONE" className="bg-black/60 border border-white/10 p-4 rounded-xl text-center outline-none" value={interestForm.icon} onChange={(e) => setInterestForm({...interestForm, icon: e.target.value})}/>
                   </div>
                   <button onClick={handleSaveInterest} className={`w-full md:w-auto ${isBeastMode ? 'bg-orange-500' : 'bg-purple-500'} text-white font-black px-8 py-4 rounded-xl uppercase text-[9px] md:text-[10px] tracking-widest`}>
                    {editingInterestId ? 'Salvar Edição' : 'Fixar'}
                   </button>
                </div>
                <div className="space-y-3">
                  {interests.map(i => (
                    <div key={i.id} className="p-4 bg-black/40 border border-slate-800 rounded-xl flex justify-between items-center transition-all">
                      <div className="flex items-center gap-4">
                        <span className="text-xl">{i.icon}</span>
                        <div>
                          <div className="text-[10px] font-black text-white uppercase">{i.title}</div>
                          <div className={`text-[8px] ${isBeastMode ? 'text-orange-500' : 'text-purple-500'} uppercase font-mono`}>{i.category}</div>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <button onClick={() => startEditInterest(i)} className={`${isBeastMode ? 'text-orange-400' : 'text-purple-400'} text-[9px] font-bold uppercase`}>Editar</button>
                        <button onClick={() => deleteInterest(i.id)} className="text-red-500 text-[9px] font-bold uppercase">X</button>
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

const TabBtn: React.FC<{ active: boolean; onClick: () => void; label: string; icon: string; isBeast: boolean }> = ({ active, onClick, label, icon, isBeast }) => (
  <button onClick={onClick} className={`flex-shrink-0 flex items-center gap-3 md:gap-4 p-4 md:p-5 rounded-xl md:rounded-2xl border transition-all duration-300 font-orbitron text-[8px] md:text-[9px] font-black uppercase tracking-widest ${active ? (isBeast ? 'bg-red-500 text-slate-950 border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]') : 'bg-black/60 text-slate-500 border-white/5'}`}>
    <span className="text-base md:text-xl">{icon}</span>
    <span className="whitespace-nowrap">{label}</span>
  </button>
);

const AdminInput: React.FC<{ label: string; value: string; onChange: (v: string) => void; isBeast: boolean }> = ({ label, value, onChange, isBeast }) => (
  <div className="space-y-1 md:space-y-2 group">
    <label className={`text-[8px] md:text-[9px] font-black font-orbitron ${isBeast ? 'text-red-800' : 'text-slate-500'} uppercase tracking-widest ml-2`}>{label}</label>
    <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className={`w-full ${isBeast ? 'bg-red-950/20 border-red-900/40 text-red-100 focus:border-red-500' : 'bg-black/40 border-white/10 text-slate-200 focus:border-cyan-500'} p-4 md:p-5 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-exo outline-none transition-all shadow-inner`} />
  </div>
);

export default AdminPanel;
