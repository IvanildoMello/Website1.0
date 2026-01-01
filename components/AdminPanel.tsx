
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

type AdminTab = 'dashboard' | 'contents' | 'identity' | 'media' | 'system';

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  bio, setBio, projects, setProjects, interests, setInterests, 
  isBeastMode, setIsBeastMode, isAuthenticated, setIsAuthenticated, onClose 
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [logs, setLogs] = useState<string[]>(['SINC_BEAST_CORE ATIVO.']);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{msg: string, type: 'success' | 'error' | 'info'} | null>(null);
  
  // CMS Universal States
  const [universalPosts, setUniversalPosts] = useState<Post[]>([]);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  useEffect(() => {
    loadUniversalData();
  }, []);

  const loadUniversalData = async () => {
    const data = await supabaseService.getUniversalContents();
    setUniversalPosts(data);
  };

  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const addLog = (msg: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 10));
  };

  const handleGlobalSync = async () => {
    setIsSaving(true);
    addLog('INICIANDO PERSISTÊNCIA GLOBAL...');
    try {
      await supabaseService.updateBio(bio);
      await supabaseService.syncProjects(projects);
      await supabaseService.syncInterests(interests);
      showToast('Núcleo de dados sincronizado.');
      addLog('DATABASE_SYNC_OK');
    } catch (err) {
      showToast('Erro na sincronização.', 'error');
      addLog('DATABASE_SYNC_FAIL');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveUniversalPost = async () => {
    if (!editingPost) return;
    setIsSaving(true);
    addLog(`GRAVANDO_CONTEUDO: ${editingPost.title}`);
    try {
      const { error } = await supabaseService.saveUniversalContent(editingPost);
      if (error) throw error;
      showToast('Conteúdo publicado com sucesso!');
      await loadUniversalData();
      setEditingPost(null);
    } catch (err) {
      showToast('Falha ao salvar conteúdo.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Editor de Blocos
  const addBlock = (type: BlockType) => {
    if (!editingPost) return;
    const defaultData: Record<BlockType, any> = {
      text: { text: '' },
      image: { url: '', caption: '' },
      gallery: { urls: [] },
      code: { code: '', language: 'javascript' },
      cta: { text: 'Botão de Ação', link: '#', variant: 'primary' },
      embed: { url: '', provider: 'youtube' }
    };

    const newBlock: ContentBlock = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      data: defaultData[type]
    };
    setEditingPost({ ...editingPost, blocks: [...editingPost.blocks, newBlock] });
    showToast(`Bloco ${type} adicionado.`);
  };

  const updateBlock = (id: string, newData: any) => {
    if (!editingPost) return;
    setEditingPost({
      ...editingPost,
      blocks: editingPost.blocks.map(b => b.id === id ? { ...b, data: { ...b.data, ...newData } } : b)
    });
  };

  const handleImageUpload = async (blockId: string, file: File) => {
    setIsSaving(true);
    addLog(`UPLOADING_IMAGE: ${file.name}`);
    try {
      const publicUrl = await supabaseService.uploadImage(file);
      if (publicUrl) {
        updateBlock(blockId, { url: publicUrl });
        showToast('Upload concluído.');
      } else {
        showToast('Erro no upload.', 'error');
      }
    } catch (err) {
      showToast('Erro ao processar imagem.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleGalleryUpload = async (blockId: string, files: File[]) => {
    setIsSaving(true);
    addLog(`UPLOADING_GALLERY: ${files.length} arquivos`);
    try {
      const uploadPromises = files.map(file => supabaseService.uploadImage(file));
      const urls = await Promise.all(uploadPromises);
      const validUrls = urls.filter(url => url !== null) as string[];
      
      const currentBlock = editingPost?.blocks.find(b => b.id === blockId);
      const currentUrls = currentBlock?.data.urls || [];
      
      updateBlock(blockId, { urls: [...currentUrls, ...validUrls] });
      showToast(`Upload de ${validUrls.length} imagens concluído.`);
    } catch (err) {
      showToast('Erro no upload da galeria.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={`fixed inset-0 ${isBeastMode ? 'bg-[#0a0000]' : 'bg-[#010409]'} flex flex-col lg:flex-row text-slate-300 font-exo overflow-hidden z-[200]`}>
      {/* Sidebar - Task-Oriented Menu */}
      <aside className={`w-full lg:w-64 border-r ${isBeastMode ? 'border-red-500/20 bg-red-950/5' : 'border-white/5 bg-black/40'} flex flex-col p-6 h-full shrink-0`}>
        <div className="mb-10 flex justify-between items-center">
          <div>
            <h1 className={`text-xl font-black font-orbitron text-white tracking-tighter ${isBeastMode ? 'beast-glitch' : ''}`}>
              BEAST<span className={isBeastMode ? 'text-red-500' : 'text-cyan-500'}>.CMS</span>
            </h1>
            <p className="text-[9px] font-mono text-slate-600 uppercase tracking-widest mt-1">v4.0 Headless Core</p>
          </div>
          <button onClick={onClose} className="lg:hidden text-slate-500">✕</button>
        </div>

        <nav className="flex-grow space-y-1">
          <SidebarLink icon="📊" label="Dashboard" active={activeTab === 'dashboard' && !editingPost} onClick={() => {setActiveTab('dashboard'); setEditingPost(null);}} />
          <div className="pt-4 pb-2"><span className="text-[10px] font-black font-orbitron text-slate-600 uppercase tracking-widest">Gestão</span></div>
          <SidebarLink icon="📝" label="Conteúdos" active={activeTab === 'contents' || editingPost !== null} onClick={() => {setActiveTab('contents'); setEditingPost(null);}} />
          <SidebarLink icon="🖼️" label="Arquivos" active={activeTab === 'media'} onClick={() => setActiveTab('media')} />
          <div className="pt-4 pb-2"><span className="text-[10px] font-black font-orbitron text-slate-600 uppercase tracking-widest">Sistema</span></div>
          <SidebarLink icon="🆔" label="Identidade" active={activeTab === 'identity'} onClick={() => setActiveTab('identity')} />
          <SidebarLink icon="⚡" label="Config" active={activeTab === 'system'} onClick={() => setActiveTab('system')} />
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5">
          <button onClick={() => setIsAuthenticated(false)} className="w-full text-left p-3 rounded-xl hover:bg-red-500/10 text-red-500 text-[10px] font-black font-orbitron transition-all">TERMINATE_SESSION</button>
        </div>
      </aside>

      {/* Main CMS Area */}
      <div className="flex-grow flex flex-col h-full overflow-hidden relative">
        {/* Fixed Topbar */}
        <header className={`shrink-0 z-50 p-6 flex justify-between items-center backdrop-blur-xl border-b ${isBeastMode ? 'bg-red-950/20 border-red-500/20' : 'bg-slate-950/50 border-white/5'}`}>
          <div className="flex items-center gap-4">
             <span className={`w-2 h-2 rounded-full ${isSaving ? 'bg-yellow-500 animate-pulse' : 'bg-emerald-500'}`}></span>
             <h2 className="text-xs font-black font-orbitron text-white uppercase tracking-widest">
               {editingPost ? `EDITOR: ${editingPost.title}` : activeTab.replace('_', ' ')}
             </h2>
          </div>
          <div className="flex gap-4">
            {editingPost ? (
              <div className="flex gap-3">
                 <button onClick={() => setEditingPost(null)} className="px-4 py-2 text-[10px] font-black uppercase text-slate-500 hover:text-white transition-all">Cancelar</button>
                 <button onClick={handleSaveUniversalPost} disabled={isSaving} className={`px-6 py-2 rounded-xl font-black text-[10px] uppercase shadow-lg transition-all active:scale-95 ${isBeastMode ? 'bg-red-500 text-slate-950' : 'bg-cyan-500 text-slate-950'}`}>
                   {isSaving ? 'Sincronizando...' : 'Publicar Alterações'}
                 </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <button onClick={onClose} className="px-4 py-2 text-[10px] font-black uppercase text-slate-500 hover:text-white transition-all">Sair do Admin</button>
                <button onClick={handleGlobalSync} disabled={isSaving} className={`px-6 py-2 rounded-xl font-black text-[10px] uppercase shadow-lg transition-all active:scale-95 ${isBeastMode ? 'bg-red-500 text-slate-950' : 'bg-cyan-500 text-slate-950'}`}>
                   {isSaving ? 'Sincronizando...' : 'Sincronizar Database'}
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Scrollable Content Body */}
        <main className="flex-grow overflow-y-auto custom-scrollbar p-6 lg:p-12 animate-entry-beast">
          
          {editingPost ? (
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 pb-32">
               {/* Primary Editor Canvas */}
               <div className="flex-grow space-y-10">
                  <input 
                    type="text" value={editingPost.title} 
                    onChange={(e) => setEditingPost({...editingPost, title: e.target.value})}
                    placeholder="Título da Página/Post..."
                    className="w-full bg-transparent border-none text-4xl lg:text-6xl font-black font-orbitron text-white focus:outline-none placeholder:text-slate-900"
                  />

                  <div className="space-y-6">
                    {editingPost.blocks.map((block, idx) => (
                      <div 
                        key={block.id}
                        draggable
                        onDragStart={() => setDraggedIdx(idx)}
                        onDragOver={(e) => {
                          e.preventDefault();
                          if (draggedIdx === null || draggedIdx === idx) return;
                          const newBlocks = [...editingPost.blocks];
                          const item = newBlocks.splice(draggedIdx, 1)[0];
                          newBlocks.splice(idx, 0, item);
                          setEditingPost({...editingPost, blocks: newBlocks});
                          setDraggedIdx(idx);
                        }}
                        className={`group relative p-8 rounded-3xl border transition-all duration-300 ${isBeastMode ? 'bg-red-950/5 border-red-500/10' : 'bg-white/5 border-white/5'} hover:border-cyan-500/30`}
                      >
                        <div className="absolute -left-12 top-1/2 -translate-y-1/2 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                          <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-slate-500 cursor-grab">⠿</div>
                          <button onClick={() => setEditingPost({...editingPost, blocks: editingPost.blocks.filter(b => b.id !== block.id)})} className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center">✕</button>
                        </div>

                        <div className={`px-3 py-1 rounded-full text-[8px] font-black font-orbitron uppercase tracking-widest inline-block mb-6 ${isBeastMode ? 'bg-red-500/10 text-red-500' : 'bg-cyan-500/10 text-cyan-500'}`}>
                          {block.type} BLOCK
                        </div>

                        {block.type === 'text' && (
                          <textarea 
                            value={block.data.text} 
                            onChange={(e) => updateBlock(block.id, { text: e.target.value })}
                            className="w-full bg-transparent border-none text-slate-300 font-exo text-lg leading-relaxed focus:outline-none min-h-[150px] resize-none"
                            placeholder="Inicie a transmissão de dados aqui..."
                          />
                        )}

                        {block.type === 'image' && (
                          <div className="space-y-4">
                             <div className="aspect-video bg-black/40 rounded-2xl flex items-center justify-center border-2 border-dashed border-white/5 overflow-hidden">
                                {block.data.url ? <img src={block.data.url} className="w-full h-full object-cover" /> : <span className="text-[10px] font-mono opacity-20 uppercase">Aguardando Imagem</span>}
                             </div>
                             <div className="flex gap-2">
                               <CMSInput label="URL da Imagem" value={block.data.url} onChange={(v) => updateBlock(block.id, { url: v })} isBeast={isBeastMode} />
                               <div className="flex items-end pb-1">
                                 <label className={`cursor-pointer px-4 py-3 rounded-xl font-black text-[10px] uppercase transition-all whitespace-nowrap ${isBeastMode ? 'bg-red-500/20 text-red-500 border border-red-500/30' : 'bg-cyan-500/20 text-cyan-500 border border-cyan-500/30'}`}>
                                   Upload
                                   <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                                     const file = e.target.files?.[0];
                                     if (file) handleImageUpload(block.id, file);
                                   }} />
                                 </label>
                               </div>
                             </div>
                             <CMSInput label="Legenda / Alt Text" value={block.data.caption} onChange={(v) => updateBlock(block.id, { caption: v })} isBeast={isBeastMode} />
                          </div>
                        )}

                        {block.type === 'gallery' && (
                          <div className="space-y-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                              {block.data.urls?.map((url: string, i: number) => (
                                <div key={i} className="aspect-square bg-black/40 rounded-2xl overflow-hidden border border-white/5 relative group/gal">
                                  <img src={url} className="w-full h-full object-cover" />
                                  <button onClick={() => {
                                    const newUrls = [...block.data.urls];
                                    newUrls.splice(i, 1);
                                    updateBlock(block.id, { urls: newUrls });
                                  }} className="absolute top-2 right-2 w-7 h-7 bg-red-500 rounded-lg text-white opacity-0 group-hover/gal:opacity-100 transition-opacity flex items-center justify-center">✕</button>
                                </div>
                              ))}
                              <label className="aspect-square bg-white/5 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-slate-600 hover:bg-white/10 hover:text-cyan-500 transition-all cursor-pointer group/up">
                                 <span className="text-2xl mb-1 transition-transform group-hover/up:scale-125">+</span>
                                 <span className="text-[8px] font-black font-orbitron uppercase tracking-widest">Upload Img</span>
                                 <input type="file" className="hidden" accept="image/*" multiple onChange={(e) => {
                                   const files = e.target.files;
                                   if (files) handleGalleryUpload(block.id, Array.from(files));
                                 }} />
                              </label>
                            </div>
                          </div>
                        )}

                        {block.type === 'code' && (
                          <textarea 
                            value={block.data.code} 
                            onChange={(e) => updateBlock(block.id, { code: e.target.value })}
                            className="w-full bg-slate-950 p-6 rounded-2xl text-xs font-mono text-emerald-400 focus:outline-none min-h-[200px]"
                            placeholder="// Insira seu algoritmo..."
                          />
                        )}

                        {block.type === 'cta' && (
                          <div className="grid md:grid-cols-2 gap-6">
                             <CMSInput label="Texto do Botão" value={block.data.text} onChange={(v) => updateBlock(block.id, { text: v })} isBeast={isBeastMode} />
                             <CMSInput label="URL de Destino" value={block.data.link} onChange={(v) => updateBlock(block.id, { link: v })} isBeast={isBeastMode} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {/* Floating Block Adder */}
                  <div className="fixed bottom-12 left-1/2 -translate-x-1/2 flex gap-3 p-4 glass rounded-3xl border border-white/10 shadow-2xl z-50">
                    <BlockAddBtn icon="📝" onClick={() => addBlock('text')} label="Texto" />
                    <BlockAddBtn icon="🖼️" onClick={() => addBlock('image')} label="Imagem" />
                    <BlockAddBtn icon="🎞️" onClick={() => addBlock('gallery')} label="Galeria" />
                    <BlockAddBtn icon="💻" onClick={() => addBlock('code')} label="Código" />
                    <BlockAddBtn icon="🔗" onClick={() => addBlock('cta')} label="CTA" />
                  </div>
               </div>

               {/* Right Sidebar - Meta / SEO */}
               <aside className="w-full lg:w-80 shrink-0 space-y-6">
                  <div className="glass p-8 rounded-3xl border border-white/5 space-y-8">
                    <h3 className="text-[10px] font-black font-orbitron text-white uppercase tracking-widest">Atributos do Módulo</h3>
                    <div className="space-y-4">
                      <CMSInput label="URL Slug" value={editingPost.slug} onChange={(v) => setEditingPost({...editingPost, slug: v})} isBeast={isBeastMode} />
                      <div className="space-y-2">
                        <label className="text-[9px] font-black font-orbitron text-slate-600 uppercase">Tipo de Conteúdo</label>
                        <select 
                          value={editingPost.type} 
                          onChange={(e) => setEditingPost({...editingPost, type: e.target.value as any})}
                          className="w-full bg-black/60 border border-white/10 p-3 rounded-xl text-[10px] font-black text-white focus:outline-none focus:border-cyan-500"
                        >
                          <option value="post">Postagem de Blog</option>
                          <option value="page">Página Estática</option>
                          <option value="banner">Banner/Poster</option>
                          <option value="profile">Perfil de Mestre</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black font-orbitron text-slate-600 uppercase">Visibilidade</label>
                        <select 
                          value={editingPost.status} 
                          onChange={(e) => setEditingPost({...editingPost, status: e.target.value as any})}
                          className="w-full bg-black/60 border border-white/10 p-3 rounded-xl text-[10px] font-black text-white focus:outline-none focus:border-cyan-500"
                        >
                          <option value="draft">📁 Rascunho</option>
                          <option value="published">🌐 Publicado</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="glass p-8 rounded-3xl border border-white/5 space-y-4 opacity-50">
                    <h3 className="text-[10px] font-black font-orbitron text-white uppercase tracking-widest">Otimização SEO</h3>
                    <p className="text-[9px] text-slate-600 font-mono">Indexação automática ativa pelo Core do Sistema.</p>
                  </div>
               </aside>
            </div>
          ) : (
            <div className="max-w-6xl mx-auto space-y-12">
              {activeTab === 'dashboard' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <StatCard label="Total Blocos" value={universalPosts.length} icon="🧩" color="cyan" />
                  <StatCard label="Projetos Sync" value={projects.length} icon="⚙️" color="purple" />
                  <StatCard label="System Status" value="OPT_OK" icon="⚡" color="emerald" />
                  
                  <div className="md:col-span-3 glass p-10 rounded-[40px] border border-white/5 space-y-6">
                    <h3 className="text-white font-black font-orbitron text-xs uppercase tracking-widest mb-4">Monitoramento do Sistema (Core_Logs)</h3>
                    <div className="space-y-3">
                      {logs.map((log, i) => (
                        <div key={i} className="flex gap-6 font-mono text-[9px] text-slate-500 border-b border-white/5 pb-3">
                          <span className={isBeastMode ? 'text-red-900' : 'text-cyan-950'}>{log.split(']')[0]}]</span>
                          <span className="text-slate-400">{log.split(']')[1]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'contents' && (
                <div className="space-y-8">
                  <div className="flex justify-between items-center bg-black/40 p-8 rounded-[32px] border border-white/5">
                    <div>
                      <h3 className="text-xl font-black font-orbitron text-white tracking-tighter uppercase">Arquivos Universais</h3>
                      <p className="text-[10px] font-mono text-slate-600 mt-1 uppercase">Repositório Headless de alta performance</p>
                    </div>
                    <button 
                      onClick={() => setEditingPost({id: '', title: 'Nova Entrada', slug: '', type: 'post', status: 'draft', blocks: [], updatedAt: new Date().toISOString()})}
                      className={`px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all hover:scale-105 active:scale-95 ${isBeastMode ? 'bg-red-500 text-slate-950' : 'bg-cyan-500 text-slate-950'}`}
                    >+ Gerar Conteúdo</button>
                  </div>

                  <div className="grid gap-4">
                    {universalPosts.map(p => (
                      <div key={p.id} className="glass p-6 rounded-3xl border border-white/5 flex justify-between items-center group hover:bg-white/5 transition-all">
                        <div className="flex items-center gap-8">
                           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black font-orbitron text-xl ${p.status === 'published' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                             {p.title[0].toUpperCase()}
                           </div>
                           <div>
                              <div className="text-sm font-black font-orbitron text-white uppercase tracking-tight group-hover:text-cyan-400 transition-colors">{p.title}</div>
                              <div className="text-[10px] font-mono text-slate-600 mt-1 flex gap-4 uppercase tracking-widest">
                                <span>{p.type}</span>
                                <span className="opacity-20">|</span>
                                <span>/{p.slug}</span>
                                <span className="opacity-20">|</span>
                                <span>{p.status}</span>
                              </div>
                           </div>
                        </div>
                        <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                          <button onClick={() => setEditingPost(p)} className="px-5 py-2 rounded-xl bg-white/5 text-cyan-500 text-[10px] font-black uppercase hover:bg-cyan-500 hover:text-slate-950 transition-all">Editar</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'identity' && (
                <div className="max-w-4xl mx-auto space-y-10">
                   <h3 className="text-xl font-black font-orbitron text-white uppercase tracking-widest">Identidade do Mestre</h3>
                   <div className="glass p-10 rounded-[40px] border border-white/5 space-y-8 bg-black/40">
                      <div className="grid md:grid-cols-2 gap-8">
                        <CMSInput label="Nome Civil" value={bio.name} onChange={(v) => setBio({...bio, name: v})} isBeast={isBeastMode} />
                        <CMSInput label="Especialidade" value={bio.profession} onChange={(v) => setBio({...bio, profession: v})} isBeast={isBeastMode} />
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] font-black font-orbitron text-slate-600 uppercase tracking-widest ml-1">Manifesto (Bio Descritiva)</label>
                        <textarea 
                          value={bio.description} 
                          onChange={(e) => setBio({...bio, description: e.target.value})}
                          className="w-full bg-black/60 border border-white/10 p-8 rounded-3xl text-white font-exo leading-relaxed outline-none focus:border-cyan-500 transition-all min-h-[250px] shadow-inner"
                        />
                      </div>
                   </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {toast && (
        <div className={`fixed bottom-12 right-12 px-8 py-5 rounded-2xl font-black font-orbitron text-[10px] uppercase shadow-2xl z-[100] animate-reveal-up border ${
          toast.type === 'success' ? 'bg-emerald-500/90 text-slate-950 border-emerald-400' : 
          toast.type === 'error' ? 'bg-red-500/90 text-white border-red-400' : 'bg-cyan-500/90 text-slate-950 border-cyan-400'
        }`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
};

const SidebarLink: React.FC<{ icon: string, label: string, active: boolean, onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${active ? 'bg-white/10 text-white shadow-lg translate-x-1' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
    <span className="text-xl">{icon}</span>
    <span className="text-[10px] font-black font-orbitron uppercase tracking-widest">{label}</span>
  </button>
);

const StatCard: React.FC<{ label: string, value: string | number, icon: string, color: string }> = ({ label, value, icon, color }) => (
  <div className="glass p-10 rounded-[40px] border border-white/5 flex flex-col hover:-translate-y-2 transition-all shadow-xl">
    <div className="flex justify-between items-center mb-8">
      <div className="w-14 h-14 rounded-2xl bg-black/60 border border-white/5 flex items-center justify-center text-2xl">{icon}</div>
      <span className={`text-[9px] font-black font-orbitron uppercase tracking-widest ${color === 'cyan' ? 'text-cyan-500' : color === 'red' ? 'text-red-500' : 'text-purple-500'}`}>{label}</span>
    </div>
    <div className="text-4xl font-black font-orbitron text-white tracking-tighter">{value}</div>
  </div>
);

const BlockAddBtn: React.FC<{ icon: string, onClick: () => void, label: string }> = ({ icon, onClick, label }) => (
  <button onClick={onClick} className="flex flex-col items-center gap-2 p-3 px-5 rounded-2xl hover:bg-white/5 transition-all group hover:scale-105 active:scale-95">
    <span className="text-2xl group-hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] transition-all">{icon}</span>
    <span className="text-[8px] font-black font-orbitron uppercase text-slate-600 group-hover:text-cyan-400 transition-colors">{label}</span>
  </button>
);

const CMSInput: React.FC<{ label: string, value: string, onChange: (v: string) => void, isBeast: boolean }> = ({ label, value, onChange, isBeast }) => (
  <div className="space-y-2 group">
    <label className={`text-[9px] font-black font-orbitron ${isBeast ? 'text-red-900' : 'text-slate-600'} uppercase ml-1 tracking-widest group-focus-within:text-cyan-500 transition-colors`}>{label}</label>
    <input 
      type="text" value={value} onChange={(e) => onChange(e.target.value)} 
      className={`w-full ${isBeast ? 'bg-red-950/20 text-red-100 border-red-500/20' : 'bg-black/40 text-slate-200 border-white/10'} p-4 rounded-xl text-xs font-exo outline-none focus:border-cyan-500 transition-all shadow-inner border`} 
    />
  </div>
);

export default AdminPanel;
