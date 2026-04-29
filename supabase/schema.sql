-- Schema do Banco de Dados - EduEspecial

-- Tabela de usuários
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT CHECK (role IN ('admin', 'professor', 'responsavel', 'demo')) NOT NULL,
  nome TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de alunos
CREATE TABLE alunos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  data_nascimento DATE NOT NULL,
  cpf TEXT UNIQUE NOT NULL,
  rg TEXT,
  responsavel TEXT NOT NULL,
  contato_responsavel TEXT NOT NULL,
  email_responsavel TEXT NOT NULL,
  endereco TEXT NOT NULL,
  tipo_necessidade TEXT NOT NULL,
  laudo_medico TEXT,
  diagnostico_detalhado TEXT,
  observacoes_medicas TEXT,
  medicamentos TEXT,
  foto TEXT,
  emergencia_contato TEXT NOT NULL,
  emergencia_fone TEXT NOT NULL,
  data_entrada DATE NOT NULL,
  status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de frequência
CREATE TABLE frequencia (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aluno_id UUID REFERENCES alunos(id) ON DELETE CASCADE,
  data DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('presente', 'ausente', 'ata')),
  horario_entrada TIME,
  horario_saida TIME,
  justificativa TEXT,
  professor_id UUID REFERENCES users(id),
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(aluno_id, data)
);

-- Tabela de planos individualizados
CREATE TABLE planos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aluno_id UUID REFERENCES alunos(id) ON DELETE CASCADE,
  objetivo_geral TEXT NOT NULL,
  habilidades TEXT NOT NULL,
  metas TEXT NOT NULL,
  estrategias TEXT NOT NULL,
  materiais TEXT,
  avaliacao TEXT,
  data_inicio DATE NOT NULL,
  data_revisao DATE,
  professor_id UUID REFERENCES users(id),
  status TEXT DEFAULT 'andamento' CHECK (status IN ('andamento', 'concluido', 'arquivado')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de comunicados
CREATE TABLE comunicados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  prioridade TEXT DEFAULT 'normal' CHECK (prioridade IN ('normal', 'urgente')),
  destinatario_tipo TEXT DEFAULT 'todos' CHECK (destinatario_tipo IN ('todos', 'por_aluno', 'por_tipo')),
  destinatario_aluno_id UUID REFERENCES alunos(id),
  destinatario_tipo_necessidade TEXT,
  data_publicacao DATE,
  anexo TEXT,
  autor_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE alunos ENABLE ROW LEVEL SECURITY;
ALTER TABLE frequencia ENABLE ROW LEVEL SECURITY;
ALTER TABLE planos ENABLE ROW LEVEL SECURITY;
ALTER TABLE comunicados ENABLE ROW LEVEL SECURITY;

-- Políticas RLS (simplificadas para desenvolvimento)
CREATE POLICY "Allow all for auth users" ON users FOR ALL USING (true);
CREATE POLICY "Allow all for alunos" ON alunos FOR ALL USING (true);
CREATE POLICY "Allow all for frequencia" ON frequencia FOR ALL USING (true);
CREATE POLICY "Allow all for planos" ON planos FOR ALL USING (true);
CREATE POLICY "Allow all for comunicados" ON comunicados FOR ALL USING (true);

-- Criar índices
CREATE INDEX idx_alunos_status ON alunos(status);
CREATE INDEX idx_alunos_tipo_necessidade ON alunos(tipo_necessidade);
CREATE INDEX idx_frequencia_data ON frequencia(data);
CREATE INDEX idx_frequencia_aluno ON frequencia(aluno_id);
CREATE INDEX idx_planos_aluno ON planos(aluno_id);
CREATE INDEX idx_comunicados_data ON comunicados(data_publicacao);