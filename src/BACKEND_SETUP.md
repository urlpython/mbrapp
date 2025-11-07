# Backend Setup - MeuBolsoRápido

Este guia explica como configurar o backend completo usando Supabase.

## 🚀 Configuração Inicial

### 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie uma nova organização e projeto
3. Anote sua `SUPABASE_URL` e `SUPABASE_ANON_KEY`

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=sua_url_aqui
VITE_SUPABASE_ANON_KEY=sua_chave_aqui
```

## 📊 Schema do Banco de Dados

Execute os seguintes comandos SQL no Supabase SQL Editor:

### Tabela: user_profiles

```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  salary DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);
```

### Tabela: fixed_expenses

```sql
CREATE TABLE fixed_expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE fixed_expenses ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own fixed expenses"
  ON fixed_expenses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own fixed expenses"
  ON fixed_expenses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own fixed expenses"
  ON fixed_expenses FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own fixed expenses"
  ON fixed_expenses FOR DELETE
  USING (auth.uid() = user_id);
```

### Tabela: expenses

```sql
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  category TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX expenses_user_id_date_idx ON expenses(user_id, date DESC);

-- Enable RLS
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own expenses"
  ON expenses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own expenses"
  ON expenses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own expenses"
  ON expenses FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own expenses"
  ON expenses FOR DELETE
  USING (auth.uid() = user_id);
```

### Tabela: goals

```sql
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  target_amount DECIMAL(10, 2) NOT NULL,
  current_amount DECIMAL(10, 2) DEFAULT 0,
  deadline DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own goals"
  ON goals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own goals"
  ON goals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals"
  ON goals FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals"
  ON goals FOR DELETE
  USING (auth.uid() = user_id);
```

## 🔐 Configurar Autenticação

No painel do Supabase:

1. Vá em **Authentication** → **Providers**
2. Habilite **Email** provider
3. Configure email templates (opcional)
4. Desabilite confirmação de email para MVP (opcional)

## 📱 Usando as APIs

### Exemplo: Criar Despesa

```typescript
import { createExpense } from './lib/supabase';

const newExpense = await createExpense({
  user_id: userId,
  description: 'Almoço',
  amount: 35.00,
  category: 'Alimentação',
  date: new Date().toISOString(),
});
```

### Exemplo: Buscar Despesas do Mês

```typescript
import { getExpenses } from './lib/supabase';

const startDate = new Date(2024, 0, 1).toISOString();
const endDate = new Date(2024, 0, 31).toISOString();

const expenses = await getExpenses(userId, startDate, endDate);
```

### Exemplo: Criar Meta

```typescript
import { createGoal } from './lib/supabase';

const newGoal = await createGoal({
  user_id: userId,
  name: 'Comprar notebook',
  target_amount: 3000.00,
  current_amount: 0,
  deadline: '2024-12-31',
});
```

## 🔄 Sincronização em Tempo Real

Para receber atualizações em tempo real:

```typescript
import { supabase } from './lib/supabase';

// Ouvir mudanças em expenses
const subscription = supabase
  .channel('expenses_changes')
  .on('postgres_changes', 
    { 
      event: '*', 
      schema: 'public', 
      table: 'expenses',
      filter: `user_id=eq.${userId}`
    }, 
    (payload) => {
      console.log('Mudança detectada:', payload);
      // Atualizar estado do app
    }
  )
  .subscribe();

// Limpar quando desmontar
subscription.unsubscribe();
```

## 📊 Funções Serverless (Edge Functions)

### Criar função para insights automáticos

```sql
CREATE OR REPLACE FUNCTION get_user_insights(user_id_param UUID, month_param INTEGER)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_spent', (
      SELECT COALESCE(SUM(amount), 0)
      FROM expenses
      WHERE user_id = user_id_param
        AND EXTRACT(MONTH FROM date) = month_param
    ),
    'top_category', (
      SELECT category
      FROM expenses
      WHERE user_id = user_id_param
        AND EXTRACT(MONTH FROM date) = month_param
      GROUP BY category
      ORDER BY SUM(amount) DESC
      LIMIT 1
    ),
    'daily_average', (
      SELECT COALESCE(AVG(daily_total), 0)
      FROM (
        SELECT DATE(date) as expense_date, SUM(amount) as daily_total
        FROM expenses
        WHERE user_id = user_id_param
          AND EXTRACT(MONTH FROM date) = month_param
        GROUP BY DATE(date)
      ) daily_sums
    )
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## 🔒 Segurança

- ✅ Row Level Security (RLS) ativado em todas as tabelas
- ✅ Apenas usuários autenticados podem acessar seus dados
- ✅ Policies impedem acesso a dados de outros usuários
- ✅ Chaves da API armazenadas em variáveis de ambiente

## 📈 Monitoramento

No painel do Supabase você pode monitorar:

- Número de requisições
- Tempo de resposta
- Erros
- Uso de armazenamento
- Usuários ativos

## 🚀 Próximos Passos

1. [ ] Implementar autenticação social (Google, Facebook)
2. [ ] Adicionar exportação de dados em PDF
3. [ ] Criar notificações push
4. [ ] Implementar backup automático
5. [ ] Adicionar IA para análise preditiva de gastos

## 📝 Notas

- O plano gratuito do Supabase suporta até 50.000 usuários mensais ativos
- 500MB de armazenamento no banco de dados
- 1GB de armazenamento de arquivos
- 2GB de transferência de dados

Para produção, considere upgrade para plano Pro.
