# SPEC.md - Sistema para Escola de Alunos Especiais

## 1. Visão Geral

**Nome:** EduEspecial -
**Tipo:** Sistema web para gestão de escola de alunos com necessidades especiais
**Stack:** Next.js (Vercel) + Supabase (banco + auth)
**Usuários:** Admin, Professor, Responsável, Demo

---

## 2. Usuários e Permissões

| Usuário | Acesso |
|--------|--------|
| Admin | Tudo |
| Professor | Frequência, Planos, Ver alunos |
| Responsável | Ver filho apenas |
| Demo | Somente leitura |

---

## 3. Dados dos Alunos

### Obrigatórios:
- Nome
- Data de nascimento
- CPF
- Responsável
- Contato responsável
- Email responsável
- Endereço
- Tipo de necessidade
- Emergência - contato
- Emergência - fone
- Data de entrada
- Status (ativo/inativo)

### Opcionais:
- RG
- Laudo médico
- Diagnóstico detalhado
- Observações médicas
- Medicamentos
- Foto

---

## 4. Funcionalidades

### 4.1 Cadastro de Alunos
- Formulário completo
- Listagem com filtros
- Editar/Deletar
- Ativar/Inativar

### 4.2 Frequência
- Lançamento diário por aluno
- Presente / Ausente / ATA
- Horário entrada/saída
- Justificativa
- Relatório mensal por aluno

### 4.3 Planos Individualizados
- Objetivo geral
- Habilidades
- Metas
- Estratégias
- Materiais
- Avaliação
- Data início/revisão
- Status

### 4.4 Relatórios
- Frequência mensal
- Presença por período
- Alunos inativos
- Evolução do plano
- Mapa de alunos
- Exportação Excel/PDF

### 4.5 Comunicados
- Título
- Mensagem
- Prioridade (Normal/Urgente)
- Destinatário (Todos/Por aluno/Por tipo)
- Data publicação
- Anexo
- Autor

### 4.6 Autenticação
- Login por email/senha
- Reset de senha
- Tipos de usuário via campo no banco