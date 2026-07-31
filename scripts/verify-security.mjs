import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = new URL('../', import.meta.url).pathname;
const failures = [];

function read(path) {
  return readFileSync(join(root, path), 'utf8');
}

function assert(condition, message) {
  if (!condition) failures.push(message);
}

function filesBelow(path) {
  const result = [];
  for (const entry of readdirSync(path)) {
    const fullPath = join(path, entry);
    if (entry === 'node_modules' || entry === 'dist' || entry === '.git') continue;
    if (statSync(fullPath).isDirectory()) result.push(...filesBelow(fullPath));
    else result.push(fullPath);
  }
  return result;
}

const auth = read('src/contexts/AuthContext.tsx');
const registration = read('src/services/auth/registerUser.ts');
const membership = read('supabase/migrations/024_security_local_ai_cleanup.sql');
const aiEngine = read('supabase/functions/openai_core/AIEngine.ts');
const localAI = read('supabase/functions/openai_core/LocalAIService.ts');

assert(!registration.includes('CashAI123'), 'Cadastro ainda contém senha padrão.');
assert(!auth.includes('bootstrap_super_admin'), 'Frontend ainda chama bootstrap de superadministrador.');
assert(membership.includes('Owners can add themselves to owned workspaces'), 'Política segura de entrada no workspace ausente.');
assert(membership.includes('REVOKE ALL ON FUNCTION public.bootstrap_super_admin()'), 'Bootstrap público não foi revogado.');
assert(!aiEngine.includes('history ='), 'Núcleo da IA ainda confia em histórico enviado pelo cliente.');
assert(localAI.includes('LOCAL_AI_BASE_URL'), 'Servidor local de IA não está configurável.');
assert(!localAI.includes('generativelanguage.googleapis.com'), 'Dependência de IA externa encontrada.');

for (const file of filesBelow(join(root, 'src'))) {
  const content = readFileSync(file, 'utf8');
  assert(!/whatsapp/i.test(content), `Referência descontinuada encontrada em ${relative(root, file)}.`);
}

if (failures.length > 0) {
  console.error(failures.map((failure) => `- ${failure}`).join('\n'));
  process.exit(1);
}

console.log('Verificações de segurança passaram.');
