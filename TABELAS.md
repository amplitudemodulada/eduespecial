# GUIA PARA CRIAÇÃO DAS TABELAS NO SUPABASE

## TABELA 1: users

1. Clique em **New Table**
2. Nome: `users`
3. Adicione as colunas:

| Nome | Tipo | Padrão | Obrigatório |
|------|------|--------|------------|
| id | uuid | gen_random_uuid() | ✓ |
| email | text | - | ✓ |
| password | text | - | ✓ |
| role | text | - | ✓ |
| nome | text | - | - |
| created_at | timestamp with time zone | now() | - |
| updated_at | timestamp with time zone | now() | - |

4. Clique em **Save**

---

## TABELA 2: alunos

1. Clique em **New Table**
2. Nome: `alunos`
3. Adicione as colunas:

| Nome | Tipo | Padrão | Obrigatório |
|------|------|--------|------------|
| id | uuid | gen_random_uuid() | ✓ |
| nome | text | - | ✓ |
| data_nascimento | date | - | ✓ |
| cpf | text | - | ✓ |
| rg | text | - | - |
| responsavel | text | - | ✓ |
| contato_responsavel | text | - | ✓ |
| email_responsavel | text | - | ✓ |
| endereco | text | - | ✓ |
| tipo_necessidade | text | - | ✓ |
| laudo_medico | text | - | - |
| diagnostico_detalhado | text | - | - |
| observacoes_medicas | text | - | - |
| medicamentos | text | - | - |
| foto | text | - | - |
| emergencia_contato | text | - | ✓ |
| emergencia_fone | text | - | ✓ |
| data_entrada | date | - | ✓ |
| status | text | 'ativo' | - |
| created_at | timestamp with time zone | now() | - |
| updated_at | timestamp with time zone | now() | - |

4. Clique em **Save**

---

## TABELA 3: frequencia

1. Clique em **New Table**
2. Nome: `frequencia`
3. Adicione as colunas:

| Nome | Tipo | Padrão | Obrigatório |
|------|------|--------|------------|
| id | uuid | gen_random_uuid() | ✓ |
| aluno_id | uuid | - | ✓ |
| data | date | - | ✓ |
| status | text | - | ✓ |
| horario_entrada | time | - | - |
| justificativa | text | - | - |
| professor_id | uuid | - | - |
| observacoes | text | - | - |
| created_at | timestamp with time zone | now() | - |

4. Clique em **Save**

5. Vá em **Indexes** > **New Index**
6. Nome: `idx_frequencia_aluno_data`
7. Columns: `aluno_id, data`
8. Unique: ✓
9. Clique em **Save**

---

## TABELA 4: planos

1. Clique em **New Table**
2. Nome: `planos`
3. Adicione as colunas:

| Nome | Tipo | Padrão | Obrigatório |
|------|------|--------|------------|
| id | uuid | gen_random_uuid() | ✓ |
| aluno_id | uuid | - | ✓ |
| objetivo_geral | text | - | ✓ |
| habilidades | text | - | ✓ |
| metas | text | - | ✓ |
| estrategias | text | - | ✓ |
| materiais | text | - | - |
| avaliacao | text | - | - |
| data_inicio | date | - | ✓ |
| data_revisao | date | - | - |
| professor_id | uuid | - | - |
| status | text | 'andamento' | - |
| created_at | timestamp with time zone | now() | - |
| updated_at | timestamp with time zone | now() | - |

4. Clique em **Save**

---

## TABELA 5: comunicados

1. Clique em **New Table**
2. Nome: `comunicados`
3. Adicione as colunas:

| Nome | Tipo | Padrão | Obrigatório |
|------|------|--------|------------|
| id | uuid | gen_random_uuid() | ✓ |
| titulo | text | - | ✓ |
| mensagem | text | - | ✓ |
| prioridade | text | 'normal' | - |
| destinatario_tipo | text | 'todos' | - |
| destinatario_aluno_id | uuid | - | - |
| destinatario_tipo_necessidade | text | - | - |
| data_publicacao | date | - | - |
| anexo | text | - | - |
| autor_id | uuid | - | - |
| created_at | timestamp with time zone | now() | - |

4. Clique em **Save**

---

## CRIAR USUÁRIOS DE TESTE

Após criar as tabelas:

1. Vá em **Table Editor**
2. Selecione a tabela **users**
3. Clique em **Insert row**
4. Adicione:

| email | password | role | nome |
|------|----------|------|------|
| admin@escola.com | 123456 | admin | Administrador |
| professor@escola.com | 123456 | professor | Professor |
| demo@escola.com | 123456 | demo | Demo |

---

## PRÓXIMO PASSO

Após criar todas as tabelas, me avise para:
1. Atualizar o arquivo `.env.local` com suas credenciais
2. Fazer deploy na Vercel