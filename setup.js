const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://jiqzcpcesuorjzbrhema.supabase.co'
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppcXpjcGNlc3Vvcmp6YnJoZW1hIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzQxNjI2OCwiZXhwIjoyMDkyOTkyMjY4fQ.Yi8xUovVWvXQUu3YbEsCFSy7VBiazyK5CkKBPW6iTMo'

const supabase = createClient(supabaseUrl, serviceKey)

async function setup() {
  console.log('Criando tabelas...')

  // Users
  await supabase.rpc('exec_sql', { 
    sql: `CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL,
      nome TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )`
  })

  console.log('Tabela users criada!')
  console.log('Feito!')
}

setup().catch(console.error)