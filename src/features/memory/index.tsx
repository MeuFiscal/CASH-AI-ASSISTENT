import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { BrainCircuit, Search, Plus, Edit2, Trash2, Star, Clock } from 'lucide-react';
import { PageContainer } from '@/components/PageContainer';
import { PageHeader } from '@/components/PageHeader';
import { PageSection } from '@/components/PageSection';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

export function Memory() {
  const { user } = useAuth();
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  
  const [memories, setMemories] = useState<any[]>([]);
  const [learnings, setLearnings] = useState<any[]>([]);
  
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMemory, setCurrentMemory] = useState<any>(null);
  const [formData, setFormData] = useState({ fact: '', category: 'geral', importance: 1 });

  useEffect(() => {
    async function loadData() {
      if (!user?.id) return;
      const { data: ws } = await supabase
        .from('workspace_members')
        .select('workspace_id')
        .eq('user_id', user.id)
        .limit(1)
        .maybeSingle();

      if (!ws?.workspace_id) return;
      setWorkspaceId(ws.workspace_id);

      const { data: mems } = await supabase
        .from('workspace_memory')
        .select('*')
        .eq('workspace_id', ws.workspace_id)
        .order('created_at', { ascending: false });

      if (mems) setMemories(mems);

      const { data: lrns } = await supabase
        .from('workspace_learnings')
        .select('*')
        .eq('workspace_id', ws.workspace_id)
        .order('created_at', { ascending: false });

      if (lrns) setLearnings(lrns);
    }
    loadData();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspaceId) return;

    if (currentMemory) {
      const { data, error } = await supabase
        .from('workspace_memory')
        .update({ fact: formData.fact, category: formData.category, importance: formData.importance })
        .eq('id', currentMemory.id)
        .select();
        
      if (!error && data) {
        setMemories(memories.map(m => m.id === currentMemory.id ? data[0] : m));
        alert('Memória atualizada!');
      }
    } else {
      const { data, error } = await supabase
        .from('workspace_memory')
        .insert({ workspace_id: workspaceId, fact: formData.fact, category: formData.category, importance: formData.importance })
        .select();

      if (!error && data) {
        setMemories([data[0], ...memories]);
        alert('Memória adicionada!');
      }
    }
    setIsModalOpen(false);
    setCurrentMemory(null);
    setFormData({ fact: '', category: 'geral', importance: 1 });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir esta memória?')) return;
    const { error } = await supabase.from('workspace_memory').delete().eq('id', id);
    if (!error) {
      setMemories(memories.filter(m => m.id !== id));
      alert('Memória excluída!');
    }
  };

  const openEdit = (memory: any) => {
    setCurrentMemory(memory);
    setFormData({ fact: memory.fact, category: memory.category || 'geral', importance: memory.importance || 1 });
    setIsModalOpen(true);
  };

  const categories = Array.from(new Set(memories.map(m => m.category || 'geral')));

  const filteredMemories = memories.filter(m => {
    const matchesSearch = (m.fact || '').toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory ? (m.category || 'geral') === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <DashboardLayout>
      <PageContainer>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <PageHeader 
            icon={BrainCircuit}
            title="Memória"
            subtitle="Tudo o que aprendi sobre você e seu negócio."
          />
          <button 
            onClick={() => {
              setCurrentMemory(null);
              setFormData({ fact: '', category: 'geral', importance: 1 });
              setIsModalOpen(true);
            }}
            className="px-6 py-3 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-full font-medium shadow-[0_0_15px_rgba(139,92,246,0.5)] transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Adicionar Memória
          </button>
        </div>

        <PageSection>
          <div className="flex flex-col gap-2 p-6 rounded-3xl bg-[#181C28]/80 border border-white/5 backdrop-blur-xl mb-10">
            <div className="flex justify-between items-center text-[13px] font-medium text-[#A8B3CF]">
              <span>Mapeamento de Perfil (Capacidade Analítica)</span>
              <span className="text-[#8B5CF6]">{Math.min(100, Math.round((memories.length + learnings.length) * 2.5))}%</span>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] rounded-full transition-all" 
                style={{ width: `${Math.min(100, Math.round((memories.length + learnings.length) * 2.5))}%` }} 
              />
            </div>
          </div>
        </PageSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Fatos Memorizados (CRUD) */}
          <PageSection title="Fatos Memorizados">
            <div className="flex flex-col gap-6">
              
              {/* Filtros */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A8B3CF]" />
                  <input 
                    type="text"
                    placeholder="Buscar memórias..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/5 border border-white/5 text-white placeholder-[#A8B3CF] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/50 transition-all"
                  />
                </div>
                {categories.length > 0 && (
                  <select 
                    value={selectedCategory || ''}
                    onChange={(e) => setSelectedCategory(e.target.value || null)}
                    className="py-3 px-4 rounded-2xl bg-white/5 border border-white/5 text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/50 transition-all appearance-none"
                  >
                    <option value="">Todas as categorias</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                )}
              </div>

              {/* Lista */}
              <div className="flex flex-col gap-3">
                {filteredMemories.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                    <div className="w-16 h-16 rounded-full bg-[#3B82F6]/10 flex items-center justify-center mb-4 border border-[#3B82F6]/20">
                      <BrainCircuit className="w-8 h-8 text-[#3B82F6] opacity-80" />
                    </div>
                    <h2 className="text-[17px] font-bold text-white mb-2">Sua memória está vazia</h2>
                    <p className="text-[#A8B3CF] text-[14px] w-full max-w-md mx-auto min-w-[300px] mb-6">
                      Comece a adicionar fatos e informações importantes que você quer que o Cash AI lembre no futuro.
                    </p>
                    <button 
                      onClick={() => { setFormData({ fact: '', category: 'geral', importance: 1 }); setCurrentMemory(null); setIsModalOpen(true); }}
                      className="px-5 py-2 rounded-full bg-[#3B82F6] hover:bg-[#2563EB] text-white text-[13px] font-medium transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> Adicionar Primeiro Fato
                    </button>
                  </div>
                ) : (
                  filteredMemories.map(m => (
                    <div key={m.id} className="p-5 rounded-2xl bg-[#181C28]/60 border border-white/5 hover:bg-white/5 transition-colors group">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex flex-col gap-2">
                          <p className="text-white text-[15px] font-medium leading-relaxed">{m.fact}</p>
                          <div className="flex items-center gap-3">
                            <span className="text-[#3B82F6] text-[11px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#3B82F6]/10">
                              {m.category || 'geral'}
                            </span>
                            <span className="flex items-center gap-1 text-[#A8B3CF] text-[12px]">
                              <Clock className="w-3.5 h-3.5" />
                              {new Date(m.created_at).toLocaleDateString()}
                            </span>
                            {m.importance > 1 && (
                              <span className="flex items-center gap-1 text-[#F59E0B] text-[12px]">
                                <Star className="w-3.5 h-3.5 fill-[#F59E0B]" /> Prioridade
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          <button onClick={() => openEdit(m)} className="p-2 text-[#A8B3CF] hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(m.id)} className="p-2 text-[#ef4444] hover:bg-[#ef4444]/10 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </PageSection>

          {/* Aprendizados Contínuos (Apenas Leitura) */}
          <PageSection title="Padrões Mapeados pela IA">
            <div className="flex flex-col pl-4">
              <div className="relative flex flex-col gap-6">
                {learnings.length > 0 && <div className="absolute top-2 bottom-0 left-[11px] w-[2px] bg-gradient-to-b from-[#8B5CF6]/50 via-white/10 to-transparent" />}
                
                {learnings.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                    <p className="text-[#A8B3CF] text-[14px]">A IA ainda não possui interações suficientes para deduzir padrões complexos. Continue utilizando o assistente.</p>
                  </div>
                ) : (
                  learnings.map((learned, i) => (
                    <div key={learned.id} className="flex items-start gap-6 relative group animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both" style={{ animationDelay: `${i * 100}ms` }}>
                      <div className="relative z-10 p-1.5 rounded-full bg-[#181C28] border-2 border-[#8B5CF6] mt-1 group-hover:scale-125 group-hover:border-white transition-all">
                        <div className="w-1.5 h-1.5 bg-[#8B5CF6] rounded-full group-hover:bg-white" />
                      </div>
                      <div className="flex-1 p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                        <p className="text-[15px] font-medium text-[#E2E8F0] group-hover:text-white transition-colors leading-relaxed">
                          {learned.learning}
                        </p>
                        <span className="text-[#A8B3CF] text-[11px] mt-2 block">
                          Confiança: {Math.round(learned.confidence_score * 100)}%
                        </span>
                      </div>
                    </div>
                  ))
                )}
                
              </div>
            </div>
          </PageSection>

        </div>
      </PageContainer>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#181C28] border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-white/5">
              <h3 className="text-xl font-bold text-white">{currentMemory ? 'Editar Memória' : 'Nova Memória'}</h3>
            </div>
            <form onSubmit={handleSave} className="p-6 flex flex-col gap-5">
              
              <div>
                <label className="block text-[13px] font-bold text-[#A8B3CF] uppercase tracking-widest mb-2">Fato / Lembrete</label>
                <textarea 
                  required
                  value={formData.fact}
                  onChange={e => setFormData({ ...formData, fact: e.target.value })}
                  placeholder="Ex: O e-mail do contador é contato@empresa.com"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-[#A8B3CF]/50 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/50 min-h-[100px] resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-bold text-[#A8B3CF] uppercase tracking-widest mb-2">Categoria</label>
                  <input 
                    type="text"
                    required
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Ex: geral, financeiro"
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/50"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-[#A8B3CF] uppercase tracking-widest mb-2">Importância</label>
                  <select 
                    value={formData.importance}
                    onChange={e => setFormData({ ...formData, importance: Number(e.target.value) })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/50 appearance-none"
                  >
                    <option value={1}>Normal</option>
                    <option value={2}>Alta</option>
                    <option value={3}>Crítica</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl font-medium transition-colors"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}
