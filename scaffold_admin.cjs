const fs = require('fs');
const path = require('path');

const pages = [
  { dir: 'users', component: 'AdminUsers', title: 'Usuários' },
  { dir: 'workspaces', component: 'AdminWorkspaces', title: 'Workspaces' },
  { dir: 'whatsapp', component: 'AdminWhatsApp', title: 'WhatsApp' },
  { dir: 'openai', component: 'AdminOpenAI', title: 'OpenAI' },
  { dir: 'subscriptions', component: 'AdminSubscriptions', title: 'Assinaturas' },
  { dir: 'analytics', component: 'AdminAnalytics', title: 'Analytics' },
  { dir: 'notifications', component: 'AdminNotifications', title: 'Notificações' },
  { dir: 'audit', component: 'AdminAudit', title: 'Auditoria' },
  { dir: 'settings', component: 'AdminSettings', title: 'Configurações' },
];

pages.forEach(p => {
  const fileContent = `import { AdminLayout } from '../../components/AdminLayout';

export function ${p.component}() {
  return (
    <AdminLayout>
      <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500">
        <div>
          <h1 className="text-3xl font-semibold text-white tracking-tight">${p.title}</h1>
          <p className="text-[#A8B3CF] mt-1 text-sm">Gerenciamento de ${p.title.toLowerCase()}.</p>
        </div>
        
        <div className="w-full h-64 border border-white/5 bg-[#181C28]/60 backdrop-blur-md rounded-2xl flex items-center justify-center">
          <span className="text-[#A8B3CF] font-medium">Módulo em construção</span>
        </div>
      </div>
    </AdminLayout>
  );
}
`;
  const dirPath = path.join(__dirname, 'src', 'features', 'admin', 'pages', p.dir);
  fs.mkdirSync(dirPath, { recursive: true });
  fs.writeFileSync(path.join(dirPath, 'index.tsx'), fileContent);
});

console.log('Admin pages scaffolded successfully.');
