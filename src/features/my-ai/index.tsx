import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Brain, SlidersHorizontal, Save } from 'lucide-react';
import { cn } from '@/lib';
import { PageContainer } from '@/components/PageContainer';
import { PageHeader } from '@/components/PageHeader';
import { PageSection } from '@/components/PageSection';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export function MyAI() {
  const { user } = useAuth();
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  
  const [settings, setSettings] = useState({
    tone: 'Casual',
    model: 'gpt-4o',
    language: 'pt-BR',
    personality: 'Trabalho',
    shortAnswers: false,
    useEmojis: true
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadWorkspaceAndSettings() {
      if (user?.id) {
        const { data: ws } = await supabase
          .from('workspace_members')
          .select('workspace_id')
          .eq('user_id', user.id)
          .limit(1)
          .maybeSingle();

        if (ws?.workspace_id) {
          setWorkspaceId(ws.workspace_id);
          
          const { data: aiData } = await supabase
            .from('workspace_ai')
            .select('*')
            .eq('workspace_id', ws.workspace_id)
            .maybeSingle();
            
          if (aiData) {
            setSettings(prev => ({
              ...prev,
              tone: aiData.tone || 'Casual',
              model: aiData.model || 'gpt-4o',
              language: aiData.language || 'pt-BR',
              personality: aiData.personality || 'Trabalho'
            }));
          } else {
            // Create default
            await supabase.from('workspace_ai').insert({
              workspace_id: ws.workspace_id,
              tone: 'Casual',
              model: 'gpt-4o',
              language: 'pt-BR',
              personality: 'Assistente Executivo'
            });
          }
        }
      }
    }
    loadWorkspaceAndSettings();
  }, [user]);

  const handleSave = async () => {
    if (!workspaceId) return;
    setSaving(true);
    try {
      await supabase
        .from('workspace_ai')
        .update({
          tone: settings.tone,
          model: settings.model,
          language: settings.language,
          personality: settings.personality
        })
        .eq('workspace_id', workspaceId);
      
      // Salvar booleanos nas preferencias
      await supabase
        .from('workspace_preferences')
        .upsert({
          workspace_id: workspaceId,
          key: 'ai_advanced',
          value: { shortAnswers: settings.shortAnswers, useEmojis: settings.useEmojis }
        }, { onConflict: 'workspace_id,key' });

      alert('Configurações da IA salvas com sucesso!');
    } catch (err) {
      alert('Erro ao salvar configurações.');
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <DashboardLayout>
      <PageContainer>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <PageHeader 
            icon={Brain}
            title="Minha IA"
            subtitle="Configure a personalidade e comportamento do seu assistente."
          />
          <button 
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-full font-medium shadow-lg transition-all flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>

        <div className="flex flex-col gap-8 w-full">
          
          {/* Tom de Voz */}
          <PageSection title="Tom de Voz (Formalidade)">
          <div className="flex flex-col gap-5 p-6 sm:p-8 rounded-3xl bg-[#181C28]/60 border border-white/5 backdrop-blur-xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['Objetivo', 'Casual', 'Formal', 'Motivador'].map((option) => (
                <button 
                  key={option}
                  onClick={() => updateSetting('tone', option)}
                  className={cn(
                    "p-4 rounded-2xl border transition-all text-[14px] font-medium flex items-center justify-center",
                    settings.tone === option 
                      ? "bg-[#8B5CF6]/10 border-[#8B5CF6]/50 text-[#8B5CF6]" 
                      : "bg-white/5 border-white/5 text-[#A8B3CF] hover:bg-white/10"
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          </PageSection>

          {/* Especialização */}
          <PageSection title="Especialização (Foco)">
          <div className="flex flex-col gap-5 p-6 sm:p-8 rounded-3xl bg-[#181C28]/60 border border-white/5 backdrop-blur-xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['Trabalho', 'Finanças', 'Saúde', 'Família', 'Assistente Executivo'].map((option) => (
                <button 
                  key={option}
                  onClick={() => updateSetting('personality', option)}
                  className={cn(
                    "p-4 rounded-2xl border transition-all text-[14px] font-medium flex items-center justify-center",
                    settings.personality === option 
                      ? "bg-[#10B981]/10 border-[#10B981]/50 text-[#10B981]" 
                      : "bg-white/5 border-white/5 text-[#A8B3CF] hover:bg-white/10"
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          </PageSection>

          {/* Modelos */}
          <PageSection title="Modelo de Inteligência">
          <div className="flex flex-col gap-5 p-6 sm:p-8 rounded-3xl bg-[#181C28]/60 border border-white/5 backdrop-blur-xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {['gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo'].map((option) => (
                <button 
                  key={option}
                  onClick={() => updateSetting('model', option)}
                  className={cn(
                    "p-4 rounded-2xl border transition-all text-[14px] font-medium flex items-center justify-center",
                    settings.model === option 
                      ? "bg-[#F59E0B]/10 border-[#F59E0B]/50 text-[#F59E0B]" 
                      : "bg-white/5 border-white/5 text-[#A8B3CF] hover:bg-white/10"
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          </PageSection>

          {/* Configurações Avançadas */}
          <PageSection title="Avançado (Criatividade e Estilo)">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between p-6 sm:p-8 rounded-3xl bg-[#181C28]/60 border border-white/5 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <SlidersHorizontal className="w-5 h-5 text-[#A8B3CF]" />
                <div>
                  <h2 className="text-[15px] font-bold text-white tracking-wide">Respostas Curtas e Diretas</h2>
                  <p className="text-[13px] text-[#A8B3CF]">A IA evitará textos longos e irá direto ao ponto.</p>
                </div>
              </div>
              <button 
                onClick={() => updateSetting('shortAnswers', !settings.shortAnswers)}
                className={cn(
                  "w-12 h-6 rounded-full transition-colors relative",
                  settings.shortAnswers ? "bg-[#10B981]" : "bg-white/10"
                )}
              >
                <div className={cn(
                  "w-4 h-4 bg-white rounded-full absolute top-1 transition-all",
                  settings.shortAnswers ? "left-7" : "left-1"
                )} />
              </button>
            </div>

            <div className="flex items-center justify-between p-6 sm:p-8 rounded-3xl bg-[#181C28]/60 border border-white/5 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <Brain className="w-5 h-5 text-[#A8B3CF]" />
                <div>
                  <h2 className="text-[15px] font-bold text-white tracking-wide">Utilizar Emojis</h2>
                  <p className="text-[13px] text-[#A8B3CF]">Permitir que a IA se comunique de forma mais calorosa.</p>
                </div>
              </div>
              <button 
                onClick={() => updateSetting('useEmojis', !settings.useEmojis)}
                className={cn(
                  "w-12 h-6 rounded-full transition-colors relative",
                  settings.useEmojis ? "bg-[#3B82F6]" : "bg-white/10"
                )}
              >
                <div className={cn(
                  "w-4 h-4 bg-white rounded-full absolute top-1 transition-all",
                  settings.useEmojis ? "left-7" : "left-1"
                )} />
              </button>
            </div>
          </div>
          </PageSection>

        </div>
      </PageContainer>
    </DashboardLayout>
  );
}
