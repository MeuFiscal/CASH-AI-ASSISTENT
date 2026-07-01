const fs = require('fs');
const path = require('path');

const files = [
  'analytics/index.tsx',
  'audit/index.tsx',
  'notifications/index.tsx',
  'subscriptions/index.tsx',
  'settings/index.tsx'
].map(f => path.join('src/features/admin/pages', f));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  if (content.includes('<AdminLayout>')) {
    console.log(`Skipping ${file} - already wrapped`);
    return;
  }

  // Insert import
  const importStatement = "import { AdminLayout } from '../../components/AdminLayout';\n";
  // find last import
  const lines = content.split('\n');
  let lastImportIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('import ')) lastImportIdx = i;
  }
  lines.splice(lastImportIdx + 1, 0, importStatement);
  content = lines.join('\n');

  // Wrap return
  content = content.replace(/return\s*\(\s*(<div[^>]*>)/g, 'return (\n    <AdminLayout>\n      $1');
  
  // Wrap end (replace last </div>\n  ); with </div>\n    </AdminLayout>\n  );
  content = content.replace(/<\/div>\n\s*\);\n}/g, '<\/div>\n    </AdminLayout>\n  );\n}');

  fs.writeFileSync(file, content, 'utf8');
  console.log(`Patched ${file}`);
});
