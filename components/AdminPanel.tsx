
import React, { useState, useEffect } from 'react';
import { Project, Interest, BioInfo } from '../types';
import { supabaseService } from '../services/supabase';

interface AdminPanelProps {
  bio: BioInfo;
  setBio: React.Dispatch<React.SetStateAction<BioInfo>>;
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  interests: Interest[];
  setInterests: React.Dispatch<React.SetStateAction<Interest[]>>;
  isBeastMode: boolean;
  setIsBeastMode: (v: boolean) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (v: boolean) => void;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  bio, setBio, projects, setProjects, interests, setInterests, 
  isBeastMode, setIsBeastMode, isAuthenticated, setIsAuthenticated, onClose 
}) => {
  const [isBooting, setIsBooting] = useState(true);
  const [activeTab, setActiveTab] = useState<'bio' | 'projects' | 'interests' | 'system'>('bio');
  const [logs, setLogs] = useState<string[]>(['SINC_BEAST_CORE ATIVO.']);
  const [isSaving, setIsSaving] = useState(false);
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');
  
  // States para formulários de edição
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectForm, setProjectForm] = useState<Partial<Project>>({ 
    title: '', description: '', tech: [], githubUrl: '', liveUrl: '' 
  });

  const [editingInterestId, setEditingInterestId] = useState<string | null>(null);
  const [interestForm, setInterestForm] = useState<Partial<Interest>>({ 
    title: '', category: 'Game', icon: '🎮', description: '' 
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsBooting(false);
      if (isAuthenticated) addLog('ACESSO AO NÚCLEO REESTABELECIDO.');
    }, 1200);
    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  const addLog = (msg: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 5));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginUser === 'Ivanildo Mello' && loginPass === 'Ivanildo2026') {
      setIsAuthenticated(true);
      setLoginError('');
      addLog('ACESSO_AUTORIZADO: NÍVEL_PROPRIETÁRIO');
    } else {
      setLoginError('CREDENCIAIS_INVÁLIDAS. ACESSO_NEGADO.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    onClose();
  };

  const handleGlobalSave = async () => {
    setIsSaving(true);
    addLog('SINCRONIZANDO COM SUPABASE_DB...');
    try {
      await supabaseService.updateBio(bio);
      await supabaseService.syncProjects(projects);
      await supabaseService.syncInterests(interests);
      addLog('BANCO DE DADOS ATUALIZADO COM SUCESSO.');
      alert('Sistema Sincronizado com Sucesso!');
    } catch (err) {
      console.error(err);
      addLog('ERRO NA SINCRONIZAÇÃO.');
    } finally {
      setIsSaving(false);
    }
  };

  const updateBio = (field: keyof BioInfo, value: string) => {
    setBio(prev => ({ ...prev, [field]: value }));
    addLog(`ALTERADO: ${field.toUpperCase()}`);
  };

  const handleSaveProject = () => {
    if (!projectForm.title) return;
    const project: Project = {
      id: editingProjectId || Math.random().toString(36).substr(2, 6).toUpperCase(),
      title: projectForm.title || '',
      description: projectForm.description || '',
      tech: projectForm.tech || [],
      githubUrl: projectForm.githubUrl,
      liveUrl: projectForm.liveUrl
    };

    if (editingProjectId) {
      setProjects(prev => prev.map(p => p.id === editingProjectId ? project : p));
      setEditingProjectId(null);
      addLog('PROJETO ATUALIZADO NO CACHE.');
    } else {
      setProjects([project, ...projects]);
      addLog('NOVO PROJETO ADICIONADO AO CACHE.');
    }
    setProjectForm({ title: '', description: '', tech: [], githubUrl: '', liveUrl: '' });
  };

  const handleEditProject = (p: Project) => {
    setEditingProjectId(p.id);
    setProjectForm(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveInterest = () => {
    if (!interestForm.title) return;
    const interest: Interest = {
      id: editingInterestId || Math.random().toString(36).substr(2, 6).toUpperCase(),
      title: interestForm.title || '',
      category: interestForm.category || 'Game',
      description: interestForm.description || '',
      icon: interestForm.icon || '🐾'
    };

    if (editingInterestId) {
      setInterests(prev => prev.map(i => i.id === editingInterestId ? interest : i));
      setEditingInterestId(null);
      addLog('INTERESSE ATUALIZADO NO CACHE.');
    } else {
      setInterests([interest, ...interests]);
      addLog('NOVA PAIXÃO ADICIONADA AO CACHE.');
    }
    setInterestForm({ title: '', category: 'Game', icon: '🎮', description: '' });
  };

  const handleEditInterest = (i: Interest) => {
    setEditingInterestId(i.id);
    setInterestForm(i);
  };

  if (isBooting) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black cyber-grid p-6">
        <div className="text-cyan-500 font-mono text-center animate-pulse flex flex-col items-center gap-6">
          <div className="w-12 h-12 border-t-2 border-cyan-500 rounded-full animate-spin"></div>
          <span className="tracking-[0.3em] uppercase text-xs font-black">VALIDANDO_ACESSO...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 cyber-grid p-6">
        <form onSubmit={handleLogin} className="glass p-8 md:p-12 rounded-3xl border border-cyan-500/20 w-full max-w-md space-y-8 animate-entry-beast">
          <div className="text-center">
            <h2 className="text-2xl font-black font-orbitron text-white mb-2 tracking-tighter">ADMIN_GATE</h2>
            <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest">Identificação do Proprietário Requerida</p>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[9px] font-black font-orbitron text-slate-500 uppercase tracking-widest ml-1">IDENTIFIER</label>
              <input type="text" value={loginUser} onChange={(e) => setLoginUser(e.target.value)} className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-white font-mono text-xs focus:border-cyan-500 outline-none" placeholder="USUÁRIO"/>
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black font-orbitron text-slate-500 uppercase tracking-widest ml-1">ACCESS_CODE</label>
              <input type="password" value={loginPass} onChange={(e) => setLoginPass(e.target.value)} className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-white font-mono text-xs focus:border-cyan-500 outline-none" placeholder="SENHA"/>
            </div>
          </div>
          {loginError && <div className="text-red-500 font-mono text-[9px] text-center animate-pulse uppercase">{loginError}</div>}
          <div className="flex flex-col gap-4">
            <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black font-orbitron py-4 rounded-xl transition-all active:scale-95 text-xs tracking-widest uppercase">DECRYPT_ACCESS</button>
            <button type="button" onClick={onClose} className="w-full bg-white/5 text-white font-black font-orbitron py-4 rounded-xl text-[10px] uppercase tracking-widest">ABORT_MISSION</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isBeastMode ? 'bg-[#0a0000]' : 'bg-[#010409]'} cyber-grid p-4 md:p-12 transition-colors duration-500`}>
      <div className="max-w-7xl mx-auto flex flex-col gap-6 md:gap-8 relative z-10 pt-20 lg:pt-0">
        <header className={`glass p-5 md:p-8 rounded-2xl md:rounded-3xl border ${isBeastMode ? 'border-red-500/40' : 'border-cyan-500/20'} flex flex-col md:flex-row justify-between items-center gap-4`}>
          <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto">
            <span className={`text-2xl md:text-3xl ${isBeastMode ? 'beast-shake' : 'animate-soft-pulse'}`}>🐆</span>
            <div>
              <h2 className="text-lg md:text-2xl font-black text-white font-orbitron tracking-tighter uppercase">CMS_BEAST_CORE</h2>
              <p className={`text-[8px] md:text-[10px] ${isBeastMode ? 'text-red-500' : 'text-cyan-500'} font-mono uppercase truncate`}>Sincronização Global Ativa</p>
            </div>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <button onClick={handleGlobalSave} disabled={isSaving} className={`flex-grow md:flex-grow-0 px-8 py-3 ${isBeastMode ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'bg-cyan-500 shadow-[0_0_20px_rgba(34,211,238,0.3)]'} text-slate-950 rounded-xl font-black uppercase text-[10px] transition-all active:scale-95 disabled:opacity-50`}>
              {isSaving ? 'SALVANDO...' : 'SINCRONIZAR_DATABASE'}
            </button>
            <button onClick={handleLogout} className="px-6 py-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl font-bold uppercase text-[10px] hover:bg-red-500 hover:text-white transition-all">Encerrar Sessão</button>
          </div>
        </header>

        <div className="grid lg:grid-cols-12 gap-6 md:gap-8">
          <aside className="lg:col-span-3 flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-2 md:gap-4 pb-4 lg:pb-0 custom-scrollbar">
            <TabBtn active={activeTab === 'bio'} onClick={() => setActiveTab('bio')} label="BIO" icon="🆔" isBeast={isBeastMode} />
            <TabBtn active={activeTab === 'projects'} onClick={() => setActiveTab('projects')} label="PROJETOS" icon="⚙️" isBeast={isBeastMode} />
            <TabBtn active={activeTab === 'interests'} onClick={() => setActiveTab('interests')} label="PAIXÕES" icon="❤️" isBeast={isBeastMode} />
            <TabBtn active={activeTab === 'system'} onClick={() => setActiveTab('system')} label="SISTEMA" icon="⚡" isBeast={isBeastMode} />
            
            <div className="mt-4 p-4 glass rounded-xl border border-white/5 hidden lg:block">
              <div className={`text-[8px] font-black font-mono mb-2 ${isBeastMode ? 'text-red-500' : 'text-cyan-500'}`}>DATABASE_LOGS:</div>
              {logs.map((log, i) => <div key={i} className="text-[7px] text-slate-500 font-mono leading-tight truncate">{log}</div>)}
            </div>
          </aside>

          <main className="lg:col-span-9 glass rounded-3xl border border-white/5 p-5 md:p-10 relative min-h-[500px] overflow-hidden">
            {activeTab === 'bio' && (
              <div className="space-y-6 md:space-y-8 animate-entry-beast">
                <h3 className="text-lg md:text-xl font-black text-white font-orbitron flex items-center gap-4">IDENTIDADE_DO_MESTRE</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <AdminInput label="Nome Completo" value={bio.name} onChange={(v) => updateBio('name', v)} isBeast={isBeastMode} />
                  <AdminInput label="Profissão / Título" value={bio.profession} onChange={(v) => updateBio('profession', v)} isBeast={isBeastMode} />
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <AdminInput label="Email de Contato" value={bio.email} onChange={(v) => updateBio('email', v)} isBeast={isBeastMode} />
                  <AdminInput label="LinkedIn (URL)" value={bio.linkedin} onChange={(v) => updateBio('linkedin', v)} isBeast={isBeastMode} />
                  <AdminInput label="Localização" value={bio.location} onChange={(v) => updateBio('location', v)} isBeast={isBeastMode} />
                </div>
                <div className="space-y-2">
                   <label className={`text-[8px] font-black font-orbitron ${isBeastMode ? 'text-red-800' : 'text-slate-500'} uppercase tracking-widest ml-1`}>BIOGRAFIA_COMPLETA</label>
                   <textarea value={bio.description} onChange={(e) => updateBio('description', e.target.value)} className={`w-full ${isBeastMode ? 'bg-red-950/20 border-red-900/40 text-red-100' : 'bg-black/40 border-white/10 text-slate-200'} p-5 rounded-2xl text-xs font-exo outline-none min-h-[200px] shadow-inner focus:border-cyan-500 transition-all`} />
                </div>
              </div>
            )}

            {activeTab === 'projects' && (
              <div className="space-y-8 animate-entry-beast">
                <h3 className="text-lg md:text-xl font-black text-white font-orbitron">MÓDULOS_DE_SOFTWARE</h3>
                <div className={`p-6 rounded-2xl border ${isBeastMode ? 'bg-red-500/5 border-red-500/20' : 'bg-cyan-500/5 border-cyan-500/20'} space-y-4`}>
                   <div className="grid md:grid-cols-2 gap-4">
                      <AdminInput label="Título do Projeto" value={projectForm.title || ''} onChange={(v) => setProjectForm({...projectForm, title: v})} isBeast={isBeastMode} />
                      <AdminInput label="Tecnologias (Separar por Vírgula)" value={projectForm.tech?.join(', ') || ''} onChange={(v) => setProjectForm({...projectForm, tech: v.split(',').map(s => s.trim())})} isBeast={isBeastMode} />
                   </div>
                   <div className="grid md:grid-cols-2 gap-4">
                      <AdminInput label="URL GitHub" value={projectForm.githubUrl || ''} onChange={(v) => setProjectForm({...projectForm, githubUrl: v})} isBeast={isBeastMode} />
                      <AdminInput label="URL Live Demo" value={projectForm.liveUrl || ''} onChange={(v) => setProjectForm({...projectForm, liveUrl: v})} isBeast={isBeastMode} />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[8px] font-black font-orbitron text-slate-500 uppercase tracking-widest ml-1">DESCRIÇÃO_TÉCNICA</label>
                      <textarea placeholder="Explique o projeto..." className="w-full bg-black/60 border border-white/10 p-4 rounded-xl text-white text-xs outline-none" rows={3} value={projectForm.description} onChange={(e) => setProjectForm({...projectForm, description: e.target.value})} />
                   </div>
                   <button onClick={handleSaveProject} className={`w-full ${isBeastMode ? 'bg-red-500 shadow-lg' : 'bg-cyan-500 shadow-lg'} text-slate-950 py-4 rounded-xl font-black uppercase text-[10px] transition-all hover:scale-[1.01] active:scale-95`}>
                     {editingProjectId ? 'CONSOLIDAR_ALTERAÇÕES' : 'DEPLOY_NOVO_PROJETO'}
                   </button>
                   {editingProjectId && <button onClick={() => {setEditingProjectId(null); setProjectForm({title: '', description: '', tech: []})}} className="w-full text-slate-500 text-[9px] uppercase font-bold">Cancelar Edição</button>}
                </div>

                <div className="grid gap-3">
                  {projects.map(p => (
                    <div key={p.id} className="p-4 bg-black/20 border border-white/5 rounded-2xl flex justify-between items-center group/item hover:bg-black/40 transition-all">
                      <div className="flex flex-col">
                        <span className="text-xs font-black font-orbitron text-white uppercase tracking-tight">{p.title}</span>
                        <span className="text-[9px] text-slate-500 font-mono">ID: {p.id}</span>
                      </div>
                      <div className="flex gap-4">
                        <button onClick={() => handleEditProject(p)} className="text-cyan-500 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">EDIT</button>
                        <button onClick={() => {setProjects(projects.filter(x => x.id !== p.id)); addLog('PROJETO REMOVIDO.');}} className="text-red-500 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">DEL</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'interests' && (
              <div className="space-y-8 animate-entry-beast">
                <h3 className="text-lg md:text-xl font-black text-white font-orbitron">INTERESSES_E_PAIXÕES</h3>
                <div className={`p-6 rounded-2xl border ${isBeastMode ? 'bg-orange-500/5 border-orange-500/20' : 'bg-purple-500/5 border-purple-500/20'} space-y-4`}>
                   <div className="grid md:grid-cols-3 gap-4">
                      <AdminInput label="Nome da Paixão" value={interestForm.title || ''} onChange={(v) => setInterestForm({...interestForm, title: v})} isBeast={isBeastMode} />
                      <div className="space-y-2">
                        <label className="text-[8px] font-black font-orbitron text-slate-500 uppercase tracking-widest ml-1">CATEGORIA</label>
                        <select className="w-full bg-black/60 border border-white/10 p-4 rounded-xl text-white text-xs outline-none h-[48px]" value={interestForm.category} onChange={(e) => setInterestForm({...interestForm, category: e.target.value as any})}>
                           <option value="Game">GAME</option><option value="Movie">MOVIE</option><option value="Music">MUSIC</option><option value="Serie">SERIE</option>
                        </select>
                      </div>
                      <AdminInput label="Emoji/Icon" value={interestForm.icon || ''} onChange={(v) => setInterestForm({...interestForm, icon: v})} isBeast={isBeastMode} />
                   </div>
                   <AdminInput label="Breve Descrição" value={interestForm.description || ''} onChange={(v) => setInterestForm({...interestForm, description: v})} isBeast={isBeastMode} />
                   <button onClick={handleSaveInterest} className={`w-full ${isBeastMode ? 'bg-orange-500' : 'bg-purple-500'} text-white py-4 rounded-xl font-black uppercase text-[10px] shadow-lg`}>
                     {editingInterestId ? 'ATUALIZAR_INTERESSE' : 'FIXAR_INTERESSE'}
                   </button>
                   {editingInterestId && <button onClick={() => {setEditingInterestId(null); setInterestForm({title: '', category: 'Game'})}} className="w-full text-slate-500 text-[9px] uppercase font-bold">Cancelar</button>}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {interests.map(i => (
                    <div key={i.id} className="p-4 bg-black/20 border border-white/5 rounded-2xl flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{i.icon}</span>
                        <div>
                          <div className="text-[10px] font-black font-orbitron text-white uppercase">{i.title}</div>
                          <div className="text-[8px] font-mono text-slate-500 uppercase">{i.category}</div>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <button onClick={() => handleEditInterest(i)} className="text-cyan-500 text-[9px] font-black uppercase">EDIT</button>
                        <button onClick={() => {setInterests(interests.filter(x => x.id !== i.id)); addLog('INTERESSE REMOVIDO.');}} className="text-red-500 text-[9px] font-black uppercase">DEL</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'system' && (
              <div className="space-y-8 animate-entry-beast">
                <h3 className="text-lg md:text-xl font-black text-white font-orbitron flex items-center gap-4">SISTEMA_CORE</h3>
                <div className={`p-10 rounded-3xl border transition-all ${isBeastMode ? 'bg-red-500/10 border-red-500/40 shadow-[0_0_40px_rgba(239,68,68,0.1)]' : 'bg-white/5 border-white/10 shadow-inner'}`}>
                   <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-xl font-black text-white font-orbitron mb-2">MODO_FERA_CORE</h4>
                        <p className="text-slate-500 text-xs font-exo">Altera instantaneamente o comportamento visual para o Protocolo Alpha.</p>
                      </div>
                      <button onClick={() => {setIsBeastMode(!isBeastMode); addLog(`MODO_FERA: ${!isBeastMode ? 'ON' : 'OFF'}`);}} className={`w-16 h-8 rounded-full relative transition-all duration-500 ${isBeastMode ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]' : 'bg-slate-700'}`}>
                        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-500 transform ${isBeastMode ? 'translate-x-9' : 'translate-x-1'}`}></div>
                      </button>
                   </div>
                </div>
                
                <div className="p-8 glass rounded-3xl border border-white/5 opacity-50">
                  <h4 className="text-white font-black font-orbitron text-xs mb-4 uppercase">Estatísticas de Sincronização</h4>
                  <div className="grid grid-cols-2 gap-4 font-mono text-[9px] text-slate-400">
                    <div>VERSÃO: 2.5.4-STABLE</div>
                    <div>LATÊNCIA_DB: 45ms</div>
                    <div>ESTRUTURAS_BIO: 1</div>
                    <div>MÓDULOS_PROJ: {projects.length}</div>
                    <div>PAIXÕES_SYNC: {interests.length}</div>
                    <div>UPTIME: 99.9%</div>
                  </div>
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
  <button onClick={onClick} className={`flex-shrink-0 flex items-center gap-3 md:gap-4 p-4 md:p-5 rounded-xl md:rounded-2xl border transition-all duration-500 font-orbitron text-[8px] md:text-[9px] font-black uppercase tracking-widest ${active ? (isBeast ? 'bg-red-500 text-slate-950 border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]') : 'bg-black/60 text-slate-500 border-white/5 hover:border-white/20'}`}>
    <span className="text-base md:text-xl">{icon}</span>
    <span className="whitespace-nowrap">{label}</span>
  </button>
);

const AdminInput: React.FC<{ label: string; value: string; onChange: (v: string) => void; isBeast: boolean }> = ({ label, value, onChange, isBeast }) => (
  <div className="space-y-2 flex-grow group">
    <label className={`text-[8px] font-black font-orbitron ${isBeast ? 'text-red-800 group-focus-within:text-red-500' : 'text-slate-500 group-focus-within:text-cyan-500'} uppercase tracking-widest ml-1 transition-colors`}>{label}</label>
    <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className={`w-full ${isBeast ? 'bg-red-950/20 border-red-900/40 text-red-100 focus:border-red-500 shadow-inner' : 'bg-black/40 border-white/10 text-slate-200 focus:border-cyan-500 shadow-inner'} p-4 rounded-xl text-xs font-exo outline-none transition-all`} />
  </div>
);

export default AdminPanel;
