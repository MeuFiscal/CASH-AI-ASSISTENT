import { useState, useEffect, useRef } from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Search, Folder, FileText, FileImage, Upload, Trash2, Edit2 } from 'lucide-react';
import { PageContainer } from '@/components/PageContainer';
import { PageHeader } from '@/components/PageHeader';
import { PageSection } from '@/components/PageSection';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

export function Documents() {
  const { user } = useAuth();
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  
  const [search, setSearch] = useState('');
  const [documents, setDocuments] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadDocuments() {
      if (!user?.id) return;
      const { data: ws } = await supabase
        .from('workspace_members')
        .select('workspace_id')
        .eq('user_id', user.id)
        .limit(1)
        .maybeSingle();

      if (!ws?.workspace_id) return;
      setWorkspaceId(ws.workspace_id);

      const { data: docs } = await supabase
        .from('documents')
        .select('*')
        .eq('workspace_id', ws.workspace_id)
        .order('created_at', { ascending: false });

      if (docs) setDocuments(docs);
    }
    loadDocuments();
  }, [user]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !workspaceId) return;

    setIsUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${workspaceId}/${Date.now()}.${fileExt}`;

    try {
      // Faz o upload pro storage "documents"
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName);

      // Persiste no BD
      const { data: docRecord, error: dbError } = await supabase
        .from('documents')
        .insert({
          workspace_id: workspaceId,
          title: file.name,
          file_url: publicUrlData.publicUrl,
          file_type: file.type || fileExt
        })
        .select();

      if (dbError) throw dbError;

      if (docRecord) {
        setDocuments([docRecord[0], ...documents]);
      }
      alert('Documento enviado com sucesso!');
    } catch (error: any) {
      alert('Erro ao enviar documento. ' + error.message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (id: string, fileUrl: string) => {
    if (!confirm('Excluir permanentemente este documento?')) return;
    
    // Tenta apagar do storage (A extração do path depende da URL)
    try {
      const urlObj = new URL(fileUrl);
      const pathParts = urlObj.pathname.split('/documents/');
      if (pathParts.length > 1) {
        const filePath = pathParts[1];
        await supabase.storage.from('documents').remove([decodeURIComponent(filePath)]);
      }
    } catch (err) {}

    const { error } = await supabase.from('documents').delete().eq('id', id);
    if (!error) {
      setDocuments(documents.filter(d => d.id !== id));
      alert('Documento excluído.');
    }
  };

  const handleRename = async (id: string, currentTitle: string) => {
    const newTitle = prompt('Novo nome do documento:', currentTitle);
    if (!newTitle || newTitle === currentTitle) return;

    const { error } = await supabase
      .from('documents')
      .update({ title: newTitle })
      .eq('id', id);

    if (!error) {
      setDocuments(documents.map(d => d.id === id ? { ...d, title: newTitle } : d));
      alert('Documento renomeado.');
    }
  };

  const filteredDocs = documents.filter(d => d.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <DashboardLayout>
      <PageContainer>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <PageHeader 
            icon={Folder}
            title="Documentos"
            subtitle="Acesse todos os seus arquivos de forma centralizada."
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-6 py-3 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-full font-medium shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all flex items-center gap-2"
          >
            <Upload className="w-5 h-5" />
            {isUploading ? 'Enviando...' : 'Fazer Upload'}
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleUpload} 
            className="hidden" 
          />
        </div>

        <PageSection>
          <div className="relative flex items-center bg-[#181C28]/80 border border-white/10 rounded-3xl p-2 shadow-2xl backdrop-blur-2xl">
            <Search className="w-6 h-6 text-[#A8B3CF] ml-4" />
            <input 
              value={search}
              onChange={e => setSearch(e.target.value)}
              type="text" 
              placeholder="Pesquisar documento pelo nome..."
              className="flex-1 bg-transparent border-none text-white text-[16px] placeholder:text-[#A8B3CF]/50 px-4 py-4 focus:ring-0 outline-none"
            />
          </div>
        </PageSection>

        <PageSection title="Todos os Documentos">
          <div className="flex flex-col gap-3">
            {filteredDocs.length === 0 ? (
              <div className="w-full flex flex-col items-center justify-center py-20 px-4 text-center">
                <div className="w-20 h-20 rounded-full bg-[#3B82F6]/10 flex items-center justify-center mb-6 border border-[#3B82F6]/20">
                  <Folder className="w-10 h-10 text-[#3B82F6] opacity-80" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Sua pasta de documentos está vazia.</h2>
                <p className="text-[#A8B3CF] w-full max-w-[500px] mx-auto min-w-[300px] mb-8">
                  Faça o upload de contratos, faturas ou relatórios. A IA lerá seus arquivos para ajudar a extrair informações automaticamente.
                </p>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-2.5 rounded-full bg-[#3B82F6] hover:bg-[#2563EB] text-white font-medium transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                >
                  Fazer Primeiro Upload
                </button>
              </div>
            ) : (
              filteredDocs.map((doc) => (
                <div key={doc.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-[#181C28]/60 border border-white/5 hover:bg-white/10 transition-colors group">
                  <div className="flex items-center gap-4 cursor-pointer" onClick={() => window.open(doc.file_url, '_blank')}>
                    {doc.file_type?.includes('pdf') ? (
                      <FileText className="w-6 h-6 text-[#ef4444]" />
                    ) : doc.file_type?.includes('image') ? (
                      <FileImage className="w-6 h-6 text-[#10B981]" />
                    ) : (
                      <FileText className="w-6 h-6 text-[#3B82F6]" />
                    )}
                    <div className="flex flex-col">
                      <span className="text-[15px] font-medium text-white group-hover:text-[#3B82F6] transition-colors">{doc.title}</span>
                      <span className="text-[12px] text-[#A8B3CF]">{new Date(doc.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4 sm:mt-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleRename(doc.id, doc.title)} className="p-2 text-[#A8B3CF] hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(doc.id, doc.file_url)} className="p-2 text-[#ef4444] hover:bg-[#ef4444]/10 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </PageSection>

      </PageContainer>
    </DashboardLayout>
  );
}
