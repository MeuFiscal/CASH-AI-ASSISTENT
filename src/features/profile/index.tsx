import { DashboardLayout } from '@/layouts/DashboardLayout';
import { User as UserIcon, Mail, Phone, MapPin, Key, Loader2, Upload } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { PageContainer } from '@/components/PageContainer';
import { PageHeader } from '@/components/PageHeader';
import { PageSection } from '@/components/PageSection';
import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export function Profile() {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone);
      setAddress(user.address || '');
      setAvatarUrl(user.avatarUrl || '');
    }
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        email: email !== user?.email ? email : undefined,
        data: {
          name,
          phone,
          address,
          avatar_url: avatarUrl
        }
      });
      if (error) throw error;
      alert('Perfil atualizado com sucesso!');
    } catch (err: any) {
      alert('Erro ao atualizar perfil: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        if (uploadError.message.includes('The resource was not found')) {
            alert('Bucket de avatares não encontrado. Por favor, execute as migrações do banco de dados (013_avatars).');
            return;
        }
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      setAvatarUrl(data.publicUrl);
      
      // Update immediately
      await supabase.auth.updateUser({
        data: { avatar_url: data.publicUrl }
      });
      
    } catch (err: any) {
      alert('Erro ao fazer upload da imagem: ' + err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleChangePassword = async () => {
    const newPassword = prompt('Digite sua nova senha:');
    if (!newPassword) return;
    if (newPassword.length < 6) {
      return alert('A senha deve ter no mínimo 6 caracteres.');
    }
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      if (error) throw error;
      alert('Senha atualizada com sucesso!');
    } catch (err: any) {
      alert('Erro ao atualizar senha: ' + err.message);
    }
  };

  return (
    <DashboardLayout>
      <PageContainer>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <PageHeader 
            icon={UserIcon}
            title="Perfil"
            subtitle="Gerencie suas informações pessoais."
          />
          <button 
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 rounded-full bg-[#3B82F6] hover:bg-[#2563EB] text-white font-medium transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] flex items-center gap-2"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Salvar Alterações'}
          </button>
        </div>

        <div className="flex flex-col gap-6 w-full">
          <PageSection>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center text-3xl font-bold text-white shadow-lg shrink-0 overflow-hidden relative">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  user?.name?.charAt(0) || 'U'
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-white" />
                  </div>
                )}
              </div>
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <h2 className="text-2xl font-bold text-white mb-1">{name || 'Usuário'}</h2>
                <p className="text-[#A8B3CF] text-[15px] mb-4">{email}</p>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleAvatarUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="px-5 py-2 rounded-full bg-white/5 border border-white/10 text-white text-[13px] font-medium hover:bg-white/10 transition-colors flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  {uploading ? 'Enviando...' : 'Alterar Foto'}
                </button>
              </div>
            </div>
          </PageSection>

          <PageSection title="Dados Pessoais">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="flex flex-col gap-2">
                <label className="text-[12px] text-[#A8B3CF] uppercase tracking-wide font-medium flex items-center gap-2">
                  <UserIcon className="w-4 h-4" /> Nome Completo
                </label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value)}
                  placeholder="Seu nome completo"
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-[#A8B3CF] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50 transition-all"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[12px] text-[#A8B3CF] uppercase tracking-wide font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4" /> Email
                </label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-[#A8B3CF] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50 transition-all"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[12px] text-[#A8B3CF] uppercase tracking-wide font-medium flex items-center gap-2">
                  <Phone className="w-4 h-4" /> Telefone
                </label>
                <input 
                  type="tel" 
                  value={phone} 
                  onChange={e => setPhone(e.target.value)}
                  placeholder="(11) 90000-0000"
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-[#A8B3CF] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50 transition-all"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[12px] text-[#A8B3CF] uppercase tracking-wide font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Endereço Principal
                </label>
                <input 
                  type="text" 
                  value={address} 
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Seu endereço completo"
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-[#A8B3CF] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50 transition-all"
                />
              </div>
            </div>
          </PageSection>

          <PageSection title="Segurança">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-3">
                <Key className="w-5 h-5 text-[#A8B3CF]" />
                <div>
                  <p className="text-white font-medium text-[15px]">Senha de Acesso</p>
                  <p className="text-[#A8B3CF] text-[13px]">Clique em alterar para definir uma nova senha</p>
                </div>
              </div>
              <button 
                onClick={handleChangePassword}
                className="px-4 py-2 rounded-full bg-white/10 text-white text-[13px] font-medium hover:bg-white/20 transition-colors"
              >
                Alterar
              </button>
            </div>
          </PageSection>

        </div>
      </PageContainer>
    </DashboardLayout>
  );
}
