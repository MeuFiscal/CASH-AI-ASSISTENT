import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envContent = fs.readFileSync(path.join(process.cwd(), '.env.local'), 'utf-8');
const keyMatch = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/);
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.+)/);

if (keyMatch && urlMatch) {
  const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());
  supabase.from('transactions').select('*').then(({data, error}) => {
    if (error) console.error(error);
    else console.log("TRANSACTIONS (SERVICE ROLE):", JSON.stringify(data, null, 2));
  });
} else {
  console.log("Could not find service role key");
}
