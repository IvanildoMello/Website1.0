
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
      // Aqui integraria a sincronização de posts se houver tabela no supabase
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
    const newBlock: ContentBlock = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      data: type === 'text' ? { text: '' } : type === 'image' ? { url: '', caption: '' } : type === 'code' ? { code: '', language: 'javascript' } : {}
    };
    setPostForm(prev => ({ ...prev, blocks: [...prev.blocks, newBlock] }));
    addLog(`BLOCO_${type.toUpperCase()}_ADICIONADO`);
  };

  const updateBlockData = (id: string, newData: any) => {
    setPostForm(prev => ({
      ...prev,
      blocks: prev.blocks.map(b => b.id === id ? { ...b, data: { ...b.data, ...newData } } : b)
    }));
  };

  const removeBlock = (id: string) => {
    setPostForm(prev => ({ ...prev, blocks: prev.blocks.filter(b => b.id !== id) }));
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
    if (!postForm.title) return showToast('Título obrigatório', 'error');
    const updatedPost = { ...postForm, id: postForm.id || `POST-${Date.now()}`, updatedAt: new Date().toISOString() };
    
    if (editingPostId) {
      setPosts(prev => prev.map(p => p.id === editingPostId ? updatedPost : p));
    } else {
      setPosts(prev => [updatedPost, ...prev]);
    }
    
    setEditingPostId(null);
    setActiveTab('content_posts');
    showToast('Postagem salva com sucesso!');
    addLog('POST_SAVED');
  };

  return (
    <div className={`min-h-screen ${isBeastMode ? 'bg-[#0a0000]' : 'bg-[#010409]'} flex text-slate-300 font-exo selection:bg-cyan-500/30`}>
      {/* Sidebar */}
      <aside className={`w-64 border-r ${isBeastMode ? 'border-red-500/20 bg-red-950/5' : 'border-white/5 bg-black/40'} flex flex-col p-6 hidden lg:flex fixed h-full`}>
        <div className="mb-10">
          <h1 className={`text-xl font-black font-orbitron text-white tracking-tighter ${isBeastMode ? 'beast-glitch' : ''}`}>
            BEAST<span className={isBeastMode ? 'text-red-500' : 'text-cyan-500'}>.CMS</span>
          </h1>
          <p className="text-[9px] font-mono text-slate-600 uppercase tracking-widest mt-1">v3.0 BlockEngine</p>
        </div>

        <nav className="flex-grow space-y-1">
          <SidebarLink icon="📊" label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <div className="pt-4 pb-2">
            <span className="text-[10px] font-black font-orbitron text-slate-600 uppercase tracking-widest">Conteúdo</span>
          </div>
          <SidebarLink icon="📝" label="Postagens" active={activeTab === 'content_posts'} onClick={() => {setActiveTab('content_posts'); setEditingPostId(null);}} />
          <SidebarLink icon="⚙️" label="Projetos" active={activeTab === 'content_projects'} onClick={() => setActiveTab('content_projects')} />
          <SidebarLink icon="🖼️" label="Mídia" active={activeTab === 'media'} onClick={() => setActiveTab('media')} />
          
          <div className="pt-4 pb-2">
            <span className="text-[10px] font-black font-orbitron text-slate-600 uppercase tracking-widest">Sistema</span>
          </div>
          <SidebarLink icon="🆔" label="Identidade" active={activeTab === 'identity'} onClick={() => setActiveTab('identity')} />
          <SidebarLink icon="⚡" label="Configuração" active={activeTab === 'system'} onClick={() => setActiveTab('system')} />
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5">
          <button onClick={() => setIsAuthenticated(false)} className="w-full text-left p-3 rounded-xl hover:bg-red-500/10 text-red-500 text-xs font-black font-orbitron transition-all">
            LOGOUT_CORE
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow lg:ml-64 flex flex-col min-h-screen">
        {/* Fixed Header */}
        <header className={`sticky top-0 z-50 p-6 flex justify-between items-center backdrop-blur-xl border-b ${isBeastMode ? 'bg-red-950/20 border-red-500/20 shadow-[0_4px_30px_rgba(239,68,68,0.1)]' : 'bg-slate-950/50 border-white/5'} transition-all`}>
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-black font-orbitron text-white uppercase tracking-widest flex items-center gap-2">
              <span className={isBeastMode ? 'text-red-500' : 'text-cyan-500'}>//</span> {editingPostId ? 'EDITOR_DE_BLOCOS' : activeTab.replace('_', ' ')}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            {editingPostId || activeTab === 'content_posts' && !posts.find(p => p.id === editingPostId) ? (
              <div className="flex gap-2">
                <button onClick={() => {setEditingPostId(null); setActiveTab('content_posts');}} className="px-4 py-2 rounded-lg text-[10px] font-black font-orbitron uppercase text-slate-500 hover:text-white transition-all">Cancelar</button>
                <button onClick={savePost} className={`px-6 py-2 rounded-xl font-black font-orbitron text-[10px] uppercase transition-all shadow-lg ${isBeastMode ? 'bg-red-500 text-slate-950' : 'bg-cyan-500 text-slate-950'}`}>Salvar Alterações</button>
              </div>
            ) : (
              <button 
                onClick={handleGlobalSave} 
                disabled={isSaving}
                className={`px-6 py-2 rounded-xl font-black font-orbitron text-[10px] uppercase transition-all shadow-lg active:scale-95 disabled:opacity-50 ${isBeastMode ? 'bg-red-500 text-slate-950' : 'bg-cyan-500 text-slate-950'}`}
              >
                {isSaving ? 'Sincronizando...' : 'Sincronizar Global'}
              </button>
            )}
          </div>
        </header>

        {/* Scrollable Body */}
        <div className="p-6 lg:p-10 flex-grow overflow-y-auto animate-entry-beast">
          
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard label="Posts" value={posts.length} icon="📝" color="cyan" />
              <StatCard label="Projetos" value={projects.length} icon="⚙️" color="purple" />
              <StatCard label="Protocolo" value={isBeastMode ? 'ALPHA' : 'STABLE'} icon="⚡" color={isBeastMode ? 'red' : 'emerald'} />
              <div className="md:col-span-3 glass p-8 rounded-3xl border border-white/5">
                <h3 className="text-white font-black font-orbitron mb-4 text-xs uppercase">Atividade do Núcleo</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                  {logs.map((l, i) => <div key={i} className="font-mono text-[9px] text-slate-500 border-l-2 border-white/5 pl-4">{l}</div>)}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'content_posts' && !editingPostId && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-black font-orbitron text-white">REPOSITÓRIO DE POSTAGENS</h3>
                <button 
                  onClick={() => {
                    setEditingPostId('new');
                    setPostForm({ id: '', title: '', slug: '', status: 'draft', blocks: [], updatedAt: new Date().toISOString() });
                  }}
                  className={`px-6 py-3 rounded-xl font-black font-orbitron text-[10px] uppercase tracking-widest ${isBeastMode ? 'bg-red-500 text-slate-950' : 'bg-cyan-500 text-slate-950'}`}
                >
                  + Criar Nova Entrada
                </button>
              </div>

              <div className="grid gap-4">
                {posts.map(p => (
                  <div key={p.id} className="glass p-6 rounded-2xl border border-white/5 flex justify-between items-center group hover:border-cyan-500/30 transition-all">
                    <div className="flex items-center gap-6">
                      <div className={`px-2 py-1 rounded text-[8px] font-black font-mono ${p.status === 'published' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                        {p.status.toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-black font-orbitron text-white uppercase tracking-tight">{p.title}</div>
                        <div className="text-[10px] font-mono text-slate-600 mt-1">/{p.slug} • Atualizado em {new Date(p.updatedAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <button onClick={() => {setEditingPostId(p.id); setPostForm(p);}} className="text-cyan-500 text-[10px] font-black uppercase tracking-widest">Editar</button>
                      <button onClick={() => setPosts(posts.filter(x => x.id !== p.id))} className="text-red-500 text-[10px] font-black uppercase tracking-widest">Remover</button>
                    </div>
                  </div>
                ))}
                {posts.length === 0 && <div className="text-center py-20 text-slate-600 font-mono text-xs italic">Nenhum dado encontrado no buffer de postagens.</div>}
              </div>
            </div>
          )}

          {(editingPostId) && (
            <div className="max-w-4xl mx-auto space-y-10 pb-20">
              {/* Header Editor */}
              <div className="space-y-6">
                <input 
                  type="text" 
                  value={postForm.title} 
                  onChange={(e) => setPostForm({...postForm, title: e.target.value})}
                  placeholder="Título da Postagem..." 
                  className="w-full bg-transparent border-none text-4xl md:text-5xl font-black font-orbitron text-white focus:outline-none placeholder:text-slate-800"
                />
                <div className="flex gap-4 items-center">
                  <div className="flex-grow flex items-center bg-black/40 rounded-xl px-4 border border-white/5">
                    <span className="text-[10px] font-mono text-slate-600 mr-2">SLUG: /</span>
                    <input 
                      type="text" 
                      value={postForm.slug} 
                      onChange={(e) => setPostForm({...postForm, slug: e.target.value.toLowerCase().replace(/ /g, '-')})}
                      placeholder="url-amigavel" 
                      className="bg-transparent border-none text-xs font-mono text-cyan-500 py-3 focus:outline-none w-full"
                    />
                  </div>
                  <select 
                    value={postForm.status} 
                    onChange={(e) => setPostForm({...postForm, status: e.target.value as any})}
                    className="bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-[10px] font-black font-orbitron text-white uppercase focus:outline-none"
                  >
                    <option value="draft">Rascunho</option>
                    <option value="published">Publicado</option>
                  </select>
                </div>
              </div>

              {/* Blocks Canvas */}
              <div className="space-y-4">
                {postForm.blocks.map((block, index) => (
                  <div 
                    key={block.id}
                    draggable
                    onDragStart={() => onDragStart(index)}
                    onDragOver={(e) => onDragOver(e, index)}
                    className={`group relative p-6 rounded-3xl border transition-all ${isBeastMode ? 'bg-red-950/5 border-red-500/10' : 'bg-white/5 border-white/5'} hover:border-cyan-500/20`}
                  >
                    {/* Block Toolbar */}
                    <div className="absolute -left-12 top-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button className="w-8 h-8 rounded-lg bg-black/60 flex items-center justify-center text-xs cursor-grab">⠿</button>
                       <button onClick={() => removeBlock(block.id)} className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center text-xs">✕</button>
                    </div>

                    <div className="text-[8px] font-black font-orbitron text-slate-600 mb-4 uppercase tracking-widest">{block.type}</div>

                    {block.type === 'text' && (
                      <textarea 
                        value={block.data.text} 
                        onChange={(e) => updateBlockData(block.id, { text: e.target.value })}
                        placeholder="Escreva algo épico..."
                        className="w-full bg-transparent border-none text-slate-300 font-exo text-sm leading-relaxed focus:outline-none min-h-[100px] resize-none"
                      />
                    )}

                    {block.type === 'image' && (
                      <div className="space-y-4">
                        <div className="aspect-video bg-black/40 rounded-xl flex flex-col items-center justify-center border border-dashed border-white/10 overflow-hidden relative">
                          {block.data.url ? (
                            <img src={block.data.url} alt="Preview" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[10px] font-mono text-slate-600">Arraste uma imagem ou insira a URL</span>
                          )}
                        </div>
                        <input 
                          type="text" 
                          value={block.data.url} 
                          onChange={(e) => updateBlockData(block.id, { url: e.target.value })}
                          placeholder="https://imagem.url" 
                          className="w-full bg-black/40 border border-white/5 p-3 rounded-lg text-xs font-mono text-cyan-500 focus:outline-none"
                        />
                      </div>
                    )}

                    {block.type === 'code' && (
                      <div className="space-y-2">
                        <input 
                           type="text" 
                           value={block.data.language} 
                           onChange={(e) => updateBlockData(block.id, { language: e.target.value })}
                           placeholder="Linguagem (ex: typescript)" 
                           className="bg-black/60 text-[8px] font-mono text-cyan-500 border border-white/5 px-2 py-1 rounded"
                        />
                        <textarea 
                          value={block.data.code} 
                          onChange={(e) => updateBlockData(block.id, { code: e.target.value })}
                          className="w-full bg-black/80 p-6 rounded-xl text-[11px] font-mono text-emerald-400 focus:outline-none min-h-[150px]"
                          placeholder="// Insira seu código aqui..."
                        />
                      </div>
                    )}
                  </div>
                ))}

                {postForm.blocks.length === 0 && (
                  <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-3xl text-slate-700 font-orbitron text-[10px] uppercase tracking-widest">
                    O Canvas está vazio. Adicione blocos abaixo.
                  </div>
                )}
              </div>

              {/* Add Block Toolbar */}
              <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex gap-3 p-3 glass rounded-2xl border border-white/10 shadow-2xl z-50">
                <BlockAddBtn icon="📝" label="Texto" onClick={() => addBlock('text')} />
                <BlockAddBtn icon="🖼️" label="Imagem" onClick={() => addBlock('image')} />
                <BlockAddBtn icon="💻" label="Código" onClick={() => addBlock('code')} />
                <BlockAddBtn icon="🔗" label="CTA" onClick={() => addBlock('cta')} />
                <BlockAddBtn icon="📺" label="Embed" onClick={() => addBlock('embed')} />
              </div>
            </div>
          )}

          {activeTab === 'identity' && (
            <div className="space-y-8 max-w-4xl mx-auto">
              <h3 className="text-lg font-black font-orbitron text-white uppercase">IDENTIDADE_DO_MESTRE</h3>
              <div className="glass p-8 rounded-3xl border border-white/5 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <CMSInput label="Nome Completo" value={bio.name} onChange={(v) => setBio({...bio, name: v})} isBeast={isBeastMode} />
                  <CMSInput label="Título Profissional" value={bio.profession} onChange={(v) => setBio({...bio, profession: v})} isBeast={isBeastMode} />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black font-orbitron text-slate-600 uppercase tracking-widest ml-1">Manifesto Bio</label>
                  <textarea value={bio.description} onChange={(e) => setBio({...bio, description: e.target.value})} className="w-full bg-black/40 border border-white/5 p-6 rounded-2xl text-white text-xs outline-none min-h-[200px] font-exo leading-relaxed" />
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 px-8 py-4 rounded-2xl font-black font-orbitron text-[10px] uppercase shadow-2xl z-[100] animate-reveal-up ${
          toast.type === 'success' ? 'bg-emerald-500 text-slate-950' : 
          toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-cyan-500 text-slate-950'
        }`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
};

/* Components Internos */

const SidebarLink: React.FC<{ icon: string, label: string, active: boolean, onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${
      active ? 'bg-white/10 text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'
    }`}
  >
    <span className="text-lg">{icon}</span>
    <span className="text-[10px] font-black font-orbitron uppercase tracking-widest">{label}</span>
  </button>
);

const StatCard: React.FC<{ label: string, value: string | number, icon: string, color: string }> = ({ label, value, icon, color }) => (
  <div className="glass p-6 rounded-3xl border border-white/5 flex flex-col hover:border-white/10 transition-all">
    <div className="flex justify-between items-center mb-4">
      <span className="text-2xl">{icon}</span>
      <span className={`text-[9px] font-black font-orbitron uppercase tracking-widest ${
        color === 'cyan' ? 'text-cyan-500' : color === 'red' ? 'text-red-500' : 'text-purple-500'
      }`}>{label}</span>
    </div>
    <div className="text-3xl font-black font-orbitron text-white">{value}</div>
  </div>
);

const BlockAddBtn: React.FC<{ icon: string, label: string, onClick: () => void }> = ({ icon, label, onClick }) => (
  <button onClick={onClick} className="flex flex-col items-center gap-1 p-3 rounded-xl hover:bg-white/5 transition-all group">
    <span className="text-xl group-hover:scale-125 transition-transform">{icon}</span>
    <span className="text-[7px] font-black font-orbitron uppercase text-slate-600 group-hover:text-cyan-500">{label}</span>
  </button>
);

const CMSInput: React.FC<{ label: string, value: string, onChange: (v: string) => void, isBeast: boolean }> = ({ label, value, onChange, isBeast }) => (
  <div className="space-y-2 flex-grow group">
    <label className={`text-[9px] font-black font-orbitron ${isBeast ? 'text-red-900' : 'text-slate-600'} uppercase tracking-widest ml-1 group-focus-within:text-cyan-500 transition-colors`}>{label}</label>
    <input 
      type="text" 
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
      className={`w-full ${isBeast ? 'bg-red-950/20 text-red-100 border-red-500/20' : 'bg-black/40 text-slate-200 border-white/5'} p-4 rounded-xl text-xs font-exo outline-none focus:border-cyan-500 transition-all shadow-inner`} 
    />
  </div>
);

export default AdminPanel;
