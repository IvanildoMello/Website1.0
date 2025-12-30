
import React, { useState, useEffect, useRef } from 'react';
import { Project, Interest, BioInfo, ContentBlock, BlockType, Post } from '../types';
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

type AdminTab = 'dashboard' | 'content_projects' | 'content_posts' | 'identity' | 'system' | 'media';

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  bio, setBio, projects, setProjects, interests, setInterests, 
  isBeastMode, setIsBeastMode, isAuthenticated, setIsAuthenticated, onClose 
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [logs, setLogs] = useState<string[]>(['SINC_BEAST_CORE ATIVO.']);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{msg: string, type: 'success' | 'error' | 'info'} | null>(null);
  
  // States para posts e editor de blocos
  const [posts, setPosts] = useState<Post[]>([]);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [postForm, setPostForm] = useState<Post>({
    id: '',
    title: '',
    slug: '',
    status: 'draft',
    blocks: [],
    updatedAt: new Date().toISOString()
  });

  const [draggedBlockIndex, setDraggedBlockIndex] = useState<number | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const addLog = (msg: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 10));
  };

  const handleGlobalSave = async () => {
    setIsSaving(true);
    addLog('INICIANDO PERSISTÊNCIA GLOBAL...');
    try {
      await supabaseService.updateBio(bio);
      await supabaseService.syncProjects(projects);
      showToast('Sincronização concluída!');
      addLog('DATABASE_SYNC_OK');
    } catch (err) {
      showToast('Erro na sincronização.', 'error');
      addLog('DATABASE_SYNC_FAIL');
    } finally {
      setIsSaving(false);
    }
  };

  // Funções do Editor de Blocos
  const addBlock = (type: BlockType) => {
    const defaultData: Record<BlockType, any> = {
      text: { text: '' },
      image: { url: '', caption: '' },
      gallery: { urls: [] },
      code: { code: '', language: 'javascript' },
      cta: { text: 'Clique aqui', link: '#', variant: 'primary' },
      embed: { url: '', provider: 'youtube' }
    };

    const newBlock: ContentBlock = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      data: defaultData[type]
    };
    setPostForm(prev => ({ ...prev, blocks: [...prev.blocks, newBlock] }));
    addLog(`BLOCO_${type.toUpperCase()}_ADICIONADO`);
    showToast(`Bloco de ${type} adicionado.`);
  };

  const updateBlockData = (id: string, newData: any) => {
    setPostForm(prev => ({
      ...prev,
      blocks: prev.blocks.map(b => b.id === id ? { ...b, data: { ...b.data, ...newData } } : b)
    }));
  };

  const removeBlock = (id: string) => {
    setPostForm(prev => ({ ...prev, blocks: prev.blocks.filter(b => b.id !== id) }));
    showToast('Bloco removido.', 'info');
  };

  const onDragStart = (index: number) => setDraggedBlockIndex(index);
  
  const onDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedBlockIndex === null || draggedBlockIndex === index) return;
    
    const newBlocks = [...postForm.blocks];
    const draggedItem = newBlocks[draggedBlockIndex];
    newBlocks.splice(draggedBlockIndex, 1);
    newBlocks.splice(index, 0, draggedItem);
    
    setPostForm(prev => ({ ...prev, blocks: newBlocks }));
    setDraggedBlockIndex(index);
  };

  const savePost = () => {
    if (!postForm.title) return showToast('Título é obrigatório para salvar.', 'error');
    const updatedPost = { 
      ...postForm, 
      id: postForm.id || `POST-${Date.now()}`, 
      updatedAt: new Date().toISOString() 
    };
    
    if (editingPostId && editingPostId !== 'new') {
      setPosts(prev => prev.map(p => p.id === editingPostId ? updatedPost : p));
    } else {
      setPosts(prev => [updatedPost, ...prev]);
    }
    
    setEditingPostId(null);
    setActiveTab('content_posts');
    showToast('Postagem salva com sucesso!');
    addLog(`POST_SAVED: ${updatedPost.title}`);
  };

  return (
    <div className={`fixed inset-0 ${isBeastMode ? 'bg-[#0a0000]' : 'bg-[#010409]'} flex text-slate-300 font-exo selection:bg-cyan-500/30 overflow-hidden`}>
      {/* Sidebar - Fixed Left */}
      <aside className={`w-64 border-r ${isBeastMode ? 'border-red-500/20 bg-red-950/5' : 'border-white/5 bg-black/40'} flex flex-col p-6 hidden lg:flex h-full shrink-0`}>
        <div className="mb-10">
          <h1 className={`text-xl font-black font-orbitron text-white tracking-tighter ${isBeastMode ? 'beast-glitch' : ''}`}>
            BEAST<span className={isBeastMode ? 'text-red-500' : 'text-cyan-500'}>.CMS</span>
          </h1>
          <p className="text-[9px] font-mono text-slate-600 uppercase tracking-widest mt-1">v3.5 Universal Core</p>
        </div>

        <nav className="flex-grow space-y-1 overflow-y-auto custom-scrollbar">
          <SidebarLink icon="📊" label="Dashboard" active={activeTab === 'dashboard'} onClick={() => {setActiveTab('dashboard'); setEditingPostId(null);}} />
          <div className="pt-4 pb-2">
            <span className="text-[10px] font-black font-orbitron text-slate-600 uppercase tracking-widest">Conteúdo</span>
          </div>
          <SidebarLink icon="📝" label="Postagens" active={activeTab === 'content_posts'} onClick={() => {setActiveTab('content_posts'); setEditingPostId(null);}} />
          <SidebarLink icon="⚙️" label="Projetos" active={activeTab === 'content_projects'} onClick={() => {setActiveTab('content_projects'); setEditingPostId(null);}} />
          <SidebarLink icon="🖼️" label="Mídia" active={activeTab === 'media'} onClick={() => {setActiveTab('media'); setEditingPostId(null);}} />
          
          <div className="pt-4 pb-2">
            <span className="text-[10px] font-black font-orbitron text-slate-600 uppercase tracking-widest">Sistema</span>
          </div>
          <SidebarLink icon="🆔" label="Identidade" active={activeTab === 'identity'} onClick={() => {setActiveTab('identity'); setEditingPostId(null);}} />
          <SidebarLink icon="⚡" label="Configuração" active={activeTab === 'system'} onClick={() => {setActiveTab('system'); setEditingPostId(null);}} />
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5">
          <button onClick={() => setIsAuthenticated(false)} className="w-full text-left p-3 rounded-xl hover:bg-red-500/10 text-red-500 text-xs font-black font-orbitron transition-all">
            LOGOUT_CORE
          </button>
        </div>
      </aside>

      {/* Main CMS Area - Header Fixed, Body Scrollable */}
      <div className="flex-grow flex flex-col h-full relative overflow-hidden">
        {/* Fixed Header */}
        <header className={`shrink-0 z-50 p-6 flex justify-between items-center backdrop-blur-xl border-b ${isBeastMode ? 'bg-red-950/20 border-red-500/20 shadow-lg' : 'bg-slate-950/50 border-white/5'} transition-all`}>
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-black font-orbitron text-white uppercase tracking-widest flex items-center gap-2">
              <span className={isBeastMode ? 'text-red-500' : 'text-cyan-500'}>//</span> {editingPostId ? 'CONTENT_EDITOR' : activeTab.replace('_', ' ')}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            {editingPostId ? (
              <div className="flex gap-2">
                <button onClick={() => {setEditingPostId(null); setActiveTab('content_posts');}} className="px-4 py-2 rounded-lg text-[10px] font-black font-orbitron uppercase text-slate-500 hover:text-white transition-all">Descartar</button>
                <button onClick={savePost} className={`px-6 py-2 rounded-xl font-black font-orbitron text-[10px] uppercase transition-all shadow-lg ${isBeastMode ? 'bg-red-500 text-slate-950' : 'bg-cyan-500 text-slate-950'}`}>Publicar Agora</button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                 <button onClick={onClose} className="px-4 py-2 rounded-lg text-[10px] font-black font-orbitron uppercase text-slate-500 hover:text-white transition-all">Voltar ao Site</button>
                 <button 
                  onClick={handleGlobalSave} 
                  disabled={isSaving}
                  className={`px-6 py-2 rounded-xl font-black font-orbitron text-[10px] uppercase transition-all shadow-lg active:scale-95 disabled:opacity-50 ${isBeastMode ? 'bg-red-500 text-slate-950' : 'bg-cyan-500 text-slate-950'}`}
                >
                  {isSaving ? 'Gravando...' : 'Sincronizar DB'}
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Scrollable Content Body */}
        <main className="flex-grow overflow-y-auto custom-scrollbar animate-entry-beast bg-black/20 p-6 lg:p-12">
          
          {activeTab === 'dashboard' && (
            <div className="max-w-6xl mx-auto space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard label="Postagens" value={posts.length} icon="📝" color="cyan" />
                <StatCard label="Projetos" value={projects.length} icon="⚙️" color="purple" />
                <StatCard label="Status IA" value="ESTÁVEL" icon="🧠" color="emerald" />
              </div>

              <div className="grid lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3 glass p-8 rounded-3xl border border-white/5 space-y-6">
                  <h3 className="text-white font-black font-orbitron text-xs uppercase tracking-widest">Atividade Recente do Núcleo</h3>
                  <div className="space-y-3 font-mono text-[9px]">
                    {logs.map((l, i) => (
                      <div key={i} className="flex gap-4 p-3 rounded-lg bg-black/20 border border-white/5">
                        <span className="text-slate-600 shrink-0">{l.split(']')[0]}]</span>
                        <span className="text-slate-400">{l.split(']')[1]}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="lg:col-span-2 glass p-8 rounded-3xl border border-white/5 flex flex-col justify-center items-center text-center">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4 ${isBeastMode ? 'bg-red-500/20' : 'bg-cyan-500/20'}`}>🚀</div>
                  <h4 className="text-white font-black font-orbitron text-sm mb-2 uppercase">Bem-vindo, Mestre</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Sua infraestrutura de conteúdo está pronta para expansão. Use o editor de blocos para criar experiências narrativas complexas.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'content_posts' && !editingPostId && (
            <div className="max-w-6xl mx-auto space-y-8">
              <div className="flex justify-between items-center bg-black/40 p-6 rounded-3xl border border-white/5">
                <div>
                  <h3 className="text-xl font-black font-orbitron text-white tracking-tight uppercase">Gerenciador de Conteúdo Universal</h3>
                  <p className="text-[10px] font-mono text-slate-600 mt-1 uppercase tracking-widest">Base de dados de postagens e páginas dinâmicas</p>
                </div>
                <button 
                  onClick={() => {
                    setEditingPostId('new');
                    setPostForm({ id: '', title: '', slug: '', status: 'draft', blocks: [], updatedAt: new Date().toISOString() });
                  }}
                  className={`px-8 py-4 rounded-xl font-black font-orbitron text-[10px] uppercase tracking-widest transition-all hover:scale-105 active:scale-95 ${isBeastMode ? 'bg-red-500 text-slate-950' : 'bg-cyan-500 text-slate-950'}`}
                >
                  + Nova Postagem
                </button>
              </div>

              <div className="grid gap-4">
                {posts.map(p => (
                  <div key={p.id} className="glass p-6 rounded-3xl border border-white/5 flex justify-between items-center group hover:bg-white/5 hover:border-cyan-500/20 transition-all">
                    <div className="flex items-center gap-8">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black font-orbitron text-lg ${p.status === 'published' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                        {p.title.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-black font-orbitron text-white uppercase tracking-tight group-hover:text-cyan-400 transition-colors">{p.title}</div>
                        <div className="text-[10px] font-mono text-slate-600 mt-1 flex items-center gap-3">
                          <span className="uppercase tracking-widest">{p.status}</span>
                          <span className="opacity-20">|</span>
                          <span>/{p.slug}</span>
                          <span className="opacity-20">|</span>
                          <span>Atualizado {new Date(p.updatedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                      <button onClick={() => {setEditingPostId(p.id); setPostForm(p);}} className="px-4 py-2 rounded-lg bg-white/5 text-cyan-500 text-[9px] font-black uppercase tracking-widest hover:bg-cyan-500 hover:text-slate-950 transition-all">Editar</button>
                      <button onClick={() => {setPosts(posts.filter(x => x.id !== p.id)); showToast('Postagem removida.', 'info');}} className="px-4 py-2 rounded-lg bg-red-500/5 text-red-500 text-[9px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">Excluir</button>
                    </div>
                  </div>
                ))}
                {posts.length === 0 && (
                  <div className="text-center py-32 glass rounded-3xl border border-white/5">
                    <div className="text-4xl mb-4 opacity-20">📭</div>
                    <p className="text-slate-600 font-orbitron text-[10px] uppercase tracking-[0.4em]">O Buffer de conteúdo está vazio</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {editingPostId && (
            <div className="max-w-4xl mx-auto space-y-12 pb-32">
              {/* Post Metadata Header */}
              <div className="space-y-8 animate-reveal-up">
                <input 
                  type="text" 
                  value={postForm.title} 
                  onChange={(e) => setPostForm({...postForm, title: e.target.value})}
                  placeholder="Título Épico da Postagem..." 
                  className="w-full bg-transparent border-none text-4xl md:text-6xl font-black font-orbitron text-white focus:outline-none placeholder:text-slate-900 selection:bg-cyan-500/30"
                />
                
                <div className="grid md:grid-cols-2 gap-6 p-6 glass rounded-3xl border border-white/5 bg-black/40">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black font-orbitron text-slate-600 uppercase tracking-widest ml-1">Slug da URL</label>
                    <div className="flex items-center bg-black/60 rounded-xl px-4 border border-white/10 focus-within:border-cyan-500 transition-all">
                      <span className="text-[10px] font-mono text-slate-700 mr-2">/</span>
                      <input 
                        type="text" 
                        value={postForm.slug} 
                        onChange={(e) => setPostForm({...postForm, slug: e.target.value.toLowerCase().replace(/ /g, '-')})}
                        className="bg-transparent border-none text-xs font-mono text-cyan-500 py-3 focus:outline-none w-full"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black font-orbitron text-slate-600 uppercase tracking-widest ml-1">Estado de Publicação</label>
                    <select 
                      value={postForm.status} 
                      onChange={(e) => setPostForm({...postForm, status: e.target.value as any})}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-[10px] font-black font-orbitron text-white uppercase focus:outline-none focus:border-cyan-500"
                    >
                      <option value="draft">📁 Rascunho Interno</option>
                      <option value="published">🌐 Publicado Globalmente</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Block Rendering Area */}
              <div className="space-y-6">
                {postForm.blocks.map((block, index) => (
                  <div 
                    key={block.id}
                    draggable
                    onDragStart={() => onDragStart(index)}
                    onDragOver={(e) => onDragOver(e, index)}
                    onDragEnd={() => setDraggedBlockIndex(null)}
                    className={`group relative p-8 rounded-3xl border transition-all duration-300 ${
                      draggedBlockIndex === index ? 'opacity-50 scale-95 border-cyan-500' : 
                      isBeastMode ? 'bg-red-950/5 border-red-500/10' : 'bg-black/40 border-white/5'
                    } hover:border-cyan-500/30 hover:shadow-2xl shadow-cyan-500/5`}
                  >
                    {/* Block Controls - Floating Side */}
                    <div className="absolute -left-14 top-1/2 -translate-y-1/2 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
                       <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-slate-500 cursor-grab active:cursor-grabbing shadow-lg" title="Mover bloco">⠿</div>
                       <button onClick={() => removeBlock(block.id)} className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 flex items-center justify-center text-xs hover:bg-red-500 hover:text-white transition-all shadow-lg" title="Remover bloco">✕</button>
                    </div>

                    <div className="flex justify-between items-center mb-6">
                      <div className={`px-3 py-1 rounded-full text-[8px] font-black font-orbitron uppercase tracking-[0.2em] ${isBeastMode ? 'bg-red-500/10 text-red-500' : 'bg-cyan-500/10 text-cyan-500'}`}>
                        {block.type} BLOCK
                      </div>
                    </div>

                    {/* Block Inputs */}
                    {block.type === 'text' && (
                      <textarea 
                        value={block.data.text} 
                        onChange={(e) => updateBlockData(block.id, { text: e.target.value })}
                        placeholder="Inicie sua narrativa aqui..."
                        className="w-full bg-transparent border-none text-slate-300 font-exo text-base md:text-lg leading-relaxed focus:outline-none min-h-[150px] resize-none selection:bg-cyan-500/30"
                      />
                    )}

                    {block.type === 'image' && (
                      <div className="space-y-6">
                        <div className="aspect-video bg-black/60 rounded-3xl flex flex-col items-center justify-center border-2 border-dashed border-white/5 overflow-hidden relative group/img">
                          {block.data.url ? (
                            <>
                              <img src={block.data.url} alt="Preview" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="text-[10px] font-black font-orbitron text-white">IMAGEM CARREGADA</span>
                              </div>
                            </>
                          ) : (
                            <div className="text-center space-y-4">
                              <span className="text-4xl opacity-20 block">🖼️</span>
                              <span className="text-[10px] font-mono text-slate-700 uppercase tracking-widest">Nenhuma mídia vinculada</span>
                            </div>
                          )}
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                           <CMSInput label="URL da Imagem" value={block.data.url} onChange={(v) => updateBlockData(block.id, { url: v })} isBeast={isBeastMode} />
                           <CMSInput label="Legenda / Alt Text" value={block.data.caption} onChange={(v) => updateBlockData(block.id, { caption: v })} isBeast={isBeastMode} />
                        </div>
                      </div>
                    )}

                    {block.type === 'gallery' && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                          {block.data.urls?.map((url: string, i: number) => (
                            <div key={i} className="aspect-square bg-black/40 rounded-xl overflow-hidden border border-white/5 relative group/gal">
                              <img src={url} className="w-full h-full object-cover" />
                              <button onClick={() => {
                                const newUrls = [...block.data.urls];
                                newUrls.splice(i, 1);
                                updateBlockData(block.id, { urls: newUrls });
                              }} className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-lg text-white opacity-0 group-hover/gal:opacity-100 transition-opacity flex items-center justify-center">✕</button>
                            </div>
                          ))}
                          <button onClick={() => {
                            const url = prompt('URL da nova imagem na galeria:');
                            if (url) updateBlockData(block.id, { urls: [...(block.data.urls || []), url] });
                          }} className="aspect-square bg-white/5 border border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center text-slate-600 hover:bg-white/10 hover:text-cyan-500 transition-all">
                             <span className="text-2xl mb-1">+</span>
                             <span className="text-[7px] font-black uppercase">Add Img</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {block.type === 'code' && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <input 
                             type="text" 
                             value={block.data.language} 
                             onChange={(e) => updateBlockData(block.id, { language: e.target.value })}
                             placeholder="Linguagem (ex: typescript)" 
                             className="bg-black/60 text-[9px] font-mono text-cyan-500 border border-white/10 px-3 py-1 rounded-full uppercase tracking-widest focus:outline-none focus:border-cyan-500"
                          />
                        </div>
                        <textarea 
                          value={block.data.code} 
                          onChange={(e) => updateBlockData(block.id, { code: e.target.value })}
                          className="w-full bg-slate-950 p-8 rounded-2xl text-[12px] font-mono text-emerald-400 focus:outline-none min-h-[250px] shadow-inner custom-scrollbar selection:bg-white/10"
                          placeholder="// Insira seu algoritmo de alta performance..."
                        />
                      </div>
                    )}

                    {block.type === 'cta' && (
                      <div className="grid md:grid-cols-3 gap-6">
                        <CMSInput label="Texto do Botão" value={block.data.text} onChange={(v) => updateBlockData(block.id, { text: v })} isBeast={isBeastMode} />
                        <CMSInput label="Link de Destino" value={block.data.link} onChange={(v) => updateBlockData(block.id, { link: v })} isBeast={isBeastMode} />
                        <div className="space-y-2">
                          <label className="text-[9px] font-black font-orbitron text-slate-600 uppercase tracking-widest ml-1">Variante Visual</label>
                          <select 
                            value={block.data.variant} 
                            onChange={(e) => updateBlockData(block.id, { variant: e.target.value })}
                            className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-[10px] font-black font-orbitron text-white uppercase focus:outline-none"
                          >
                            <option value="primary">Primário (Neon)</option>
                            <option value="secondary">Secundário (Glass)</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {block.type === 'embed' && (
                      <div className="space-y-6">
                        <div className="aspect-video bg-black/60 rounded-3xl flex items-center justify-center border border-white/5">
                           {block.data.url ? (
                             <iframe src={block.data.url} className="w-full h-full rounded-3xl" frameBorder="0" allowFullScreen></iframe>
                           ) : (
                             <span className="text-[10px] font-mono text-slate-700 uppercase tracking-widest">Aguardando URL de Incorporação</span>
                           )}
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                          <CMSInput label="URL do Iframe (Youtube/Vimeo/etc)" value={block.data.url} onChange={(v) => updateBlockData(block.id, { url: v })} isBeast={isBeastMode} />
                          <div className="space-y-2">
                            <label className="text-[9px] font-black font-orbitron text-slate-600 uppercase tracking-widest ml-1">Provedor</label>
                            <select className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-[10px] font-black font-orbitron text-white uppercase focus:outline-none">
                              <option value="youtube">YouTube</option>
                              <option value="vimeo">Vimeo</option>
                              <option value="iframe">Custom Iframe</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {postForm.blocks.length === 0 && (
                  <div className="text-center py-40 glass border-2 border-dashed border-white/5 rounded-3xl">
                    <div className="text-5xl mb-6 opacity-20">🏗️</div>
                    <p className="text-slate-600 font-orbitron text-xs uppercase tracking-[0.5em] mb-4">Arquitetura Vazia</p>
                    <p className="text-[9px] font-mono text-slate-800 uppercase">Utilize a barra de ferramentas abaixo para compor sua página</p>
                  </div>
                )}
              </div>

              {/* Bottom Fixed Add Block Toolbar */}
              <div className="fixed bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-2 p-4 glass rounded-3xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)] z-50 animate-reveal-up backdrop-blur-3xl">
                <div className="hidden md:flex items-center gap-2 mr-4 pr-4 border-r border-white/10">
                   <span className="text-[8px] font-black font-orbitron text-slate-600 uppercase tracking-widest">Add_Block:</span>
                </div>
                <BlockAddBtn icon="📝" label="Texto" onClick={() => addBlock('text')} />
                <BlockAddBtn icon="🖼️" label="Imagem" onClick={() => addBlock('image')} />
                <BlockAddBtn icon="🎞️" label="Galeria" onClick={() => addBlock('gallery')} />
                <BlockAddBtn icon="💻" label="Código" onClick={() => addBlock('code')} />
                <BlockAddBtn icon="🔗" label="CTA" onClick={() => addBlock('cta')} />
                <BlockAddBtn icon="📺" label="Embed" onClick={() => addBlock('embed')} />
              </div>
            </div>
          )}

          {activeTab === 'content_projects' && (
            <div className="max-w-6xl mx-auto space-y-12">
               <h3 className="text-xl font-black font-orbitron text-white uppercase tracking-tight">Gerenciador de Portfólio Técnico</h3>
               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {projects.map(p => (
                   <div key={p.id} className="glass p-8 rounded-3xl border border-white/5 hover:border-cyan-500/20 transition-all group">
                      <div className="text-[9px] font-mono text-slate-600 mb-4 uppercase tracking-widest">Módulo_{p.id}</div>
                      <h4 className="text-white font-black font-orbitron text-lg mb-4 group-hover:text-cyan-400 transition-colors">{p.title}</h4>
                      <p className="text-xs text-slate-500 mb-6 leading-relaxed line-clamp-3">{p.description}</p>
                      <div className="flex gap-2">
                         <button className="flex-grow py-3 rounded-xl bg-white/5 text-cyan-500 text-[9px] font-black uppercase tracking-widest hover:bg-cyan-500 hover:text-slate-950 transition-all">Configurar</button>
                      </div>
                   </div>
                 ))}
                 <button className="p-8 rounded-3xl border-2 border-dashed border-white/5 flex flex-col items-center justify-center gap-4 text-slate-600 hover:text-cyan-500 hover:border-cyan-500/20 transition-all bg-white/2">
                    <span className="text-4xl">+</span>
                    <span className="text-[10px] font-black font-orbitron uppercase tracking-widest">Novo Projeto</span>
                 </button>
               </div>
            </div>
          )}

          {activeTab === 'identity' && (
            <div className="max-w-4xl mx-auto space-y-10">
              <h3 className="text-xl font-black font-orbitron text-white uppercase tracking-widest">Manifesto de Identidade</h3>
              <div className="glass p-10 rounded-3xl border border-white/5 space-y-8 bg-black/40 shadow-inner">
                <div className="grid md:grid-cols-2 gap-8">
                  <CMSInput label="Nome Civil" value={bio.name} onChange={(v) => setBio({...bio, name: v})} isBeast={isBeastMode} />
                  <CMSInput label="Designação Profissional" value={bio.profession} onChange={(v) => setBio({...bio, profession: v})} isBeast={isBeastMode} />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black font-orbitron text-slate-600 uppercase tracking-widest ml-1">Biografía do Sistema (JSON_DESC)</label>
                  <textarea value={bio.description} onChange={(e) => setBio({...bio, description: e.target.value})} className="w-full bg-black/60 border border-white/10 p-8 rounded-2xl text-white text-base font-exo leading-relaxed outline-none focus:border-cyan-500 transition-all min-h-[300px] shadow-inner" />
                </div>
                <div className="grid md:grid-cols-3 gap-6 opacity-60">
                  <CMSInput label="Email" value={bio.email} onChange={(v) => setBio({...bio, email: v})} isBeast={isBeastMode} />
                  <CMSInput label="LinkedIn" value={bio.linkedin} onChange={(v) => setBio({...bio, linkedin: v})} isBeast={isBeastMode} />
                  <CMSInput label="Node" value={bio.location} onChange={(v) => setBio({...bio, location: v})} isBeast={isBeastMode} />
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Global Toast Component */}
      {toast && (
        <div className={`fixed bottom-12 right-12 px-8 py-5 rounded-2xl font-black font-orbitron text-[10px] uppercase shadow-2xl z-[100] animate-reveal-up border ${
          toast.type === 'success' ? 'bg-emerald-500/90 text-slate-950 border-emerald-400' : 
          toast.type === 'error' ? 'bg-red-500/90 text-white border-red-400' : 'bg-cyan-500/90 text-slate-950 border-cyan-400'
        }`}>
          <div className="flex items-center gap-3">
             <span>{toast.type === 'success' ? '✓' : toast.type === 'error' ? '!' : 'i'}</span>
             {toast.msg}
          </div>
        </div>
      )}
    </div>
  );
};

/* Components Internos Reutilizáveis */

const SidebarLink: React.FC<{ icon: string, label: string, active: boolean, onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${
      active ? 'bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)] translate-x-1' : 'text-slate-500 hover:text-white hover:bg-white/5'
    }`}
  >
    <span className="text-xl">{icon}</span>
    <span className="text-[10px] font-black font-orbitron uppercase tracking-widest">{label}</span>
  </button>
);

const StatCard: React.FC<{ label: string, value: string | number, icon: string, color: string }> = ({ label, value, icon, color }) => (
  <div className="glass p-8 rounded-3xl border border-white/5 flex flex-col hover:border-white/10 hover:-translate-y-1 transition-all shadow-xl">
    <div className="flex justify-between items-center mb-6">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-black/40 border border-white/5`}>{icon}</div>
      <span className={`text-[9px] font-black font-orbitron uppercase tracking-widest ${
        color === 'cyan' ? 'text-cyan-500' : color === 'red' ? 'text-red-500' : color === 'purple' ? 'text-purple-500' : 'text-emerald-500'
      }`}>{label}</span>
    </div>
    <div className="text-4xl font-black font-orbitron text-white tracking-tighter">{value}</div>
  </div>
);

const BlockAddBtn: React.FC<{ icon: string, label: string, onClick: () => void }> = ({ icon, label, onClick }) => (
  <button onClick={onClick} className="flex flex-col items-center gap-1.5 p-3 px-4 rounded-2xl hover:bg-white/5 transition-all group hover:scale-105 active:scale-95">
    <span className="text-2xl group-hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] transition-all">{icon}</span>
    <span className="text-[7px] font-black font-orbitron uppercase text-slate-500 group-hover:text-cyan-400">{label}</span>
  </button>
);

const CMSInput: React.FC<{ label: string, value: string, onChange: (v: string) => void, isBeast: boolean }> = ({ label, value, onChange, isBeast }) => (
  <div className="space-y-2 flex-grow group">
    <label className={`text-[9px] font-black font-orbitron ${isBeast ? 'text-red-900' : 'text-slate-600'} uppercase tracking-widest ml-1 group-focus-within:text-cyan-500 transition-colors`}>{label}</label>
    <input 
      type="text" 
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
      className={`w-full ${isBeast ? 'bg-red-950/20 text-red-100 border-red-500/20' : 'bg-black/40 text-slate-200 border-white/10'} p-4 rounded-xl text-xs font-exo outline-none focus:border-cyan-500 transition-all shadow-inner border`} 
    />
  </div>
);

export default AdminPanel;
