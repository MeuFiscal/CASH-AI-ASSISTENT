import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envContent = fs.readFileSync(path.join(process.cwd(), '.env.local'), 'utf-8');
const anonKeyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.+)/);
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.+)/);

if (anonKeyMatch && urlMatch) {
  const supabase = createClient(urlMatch[1].trim(), anonKeyMatch[1].trim());
  supabase.from('accounts').select('*').then(({data, error}) => {
    if (error) console.error(error);
    else console.log("ACCOUNTS IN DB:", JSON.stringify(data, null, 2));
  });
} else {
  console.log("Could not find env vars");
}
