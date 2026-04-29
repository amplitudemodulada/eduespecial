# GUIA DE INSTALAÇÃO - EduEspecial

## PRÉ-REQUISITOS
- Node.js instalado (https://nodejs.org)
- Conta no Supabase (supabase.com)
- Conta na Vercel (vercel.com)

---

## PASSO 1: CONFIGURAR SUPABASE

1. Acesse https://supabase.com e faça login
2. Clique no seu projeto
3. No menu lateral, clique em **SQL Editor**
4. Copie todo o conteúdo do arquivo `supabase/schema.sql`
5. Cole no editor e clique em **Run**

---

## PASSO 2: COLETAR CREDENCIAIS

1. No Supabase, vá em **Project Settings** (ícone de engrenagem)
2. Clique em **API**
3. Copie:
   - **Project URL** → cole no arquivo `.env.local` em `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public (service_role)** → cole no arquivo `.env.local` em `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## PASSO 3: INSTALAR E RODAR

1. Abra o terminal na pasta do projeto
2. Execute:
   ```
   npm install
   npm run dev
   ```

3. Acesse http://localhost:3000

---

## PASSO 4: FAZER DEPLOY NA VERCEL

1. Acesse https://vercel.com e faça login
2. Clique em **New Project**
3. Importe o projeto do GitHub
4. Em **Environment Variables**, adicione:
   - `NEXT_PUBLIC_SUPABASE_URL` = sua URL do Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = sua chave do Supabase
5. Clique em **Deploy**

---

## CRIAR USUÁRIOS DE TESTE

No Supabase, SQL Editor, execute:

```sql
INSERT INTO users (email, password, role, nome) VALUES 
('admin@escola.com', '123456', 'admin', 'Administrador'),
('professor@escola.com', '123456', 'professor', 'Professor'),
('demo@escola.com', '123456', 'demo', 'Demo');
```

---

## ACESSAR O SISTEMA

- **Admin:** admin@escola.com / 123456
- **Professor:** professor@escola.com / 123456
- **Demo:** demo@escola.com / 123456