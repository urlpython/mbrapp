# 💰 MeuBolsoRápido (MBR)

> **Termômetro do bolso** - Clareza financeira instantânea, sem complicação.

Um app financeiro minimalista que funciona como "termômetro do bolso" para dar clareza instantânea sobre quanto você pode gastar hoje sem comprometer o mês.

![Version](https://img.shields.io/badge/version-2.0.0-purple)
![React](https://img.shields.io/badge/React-18+-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Funcionalidades

### 🎯 Core Features

- **💵 Cálculo Instantâneo**: Descubra quanto pode gastar hoje
- **📊 Dashboard Visual**: Interface moderna com gradientes roxos/magenta
- **📝 Registro Rápido**: Adicione gastos em segundos
- **📈 Gráficos Dinâmicos**: Visualize sua evolução financeira
- **🎯 Metas Financeiras**: Defina e acompanhe objetivos
- **💡 Insights Inteligentes**: Análises automáticas do seu comportamento

### 🆕 Novidades v2.0

- **🌓 Modo Claro/Escuro**: Alterne entre temas com um clique
- **📄 Relatórios em PDF**: Exporte análises completas
- **📊 Estatísticas Avançadas**: Filtros por mês, trimestre ou ano
- **📉 Gráficos Comparativos**: Compare períodos diferentes
- **🎨 Design Renovado**: Interface mais moderna e profissional

## 🎨 Preview

### Tela Inicial (Dark Mode)
- Card com valor disponível para gastar hoje
- Status financeiro visual
- Ações rápidas (Registrar, Exportar)
- Insights personalizados
- Lista de transações recentes

### Estatísticas
- Filtros de período (Mês/Trimestre/Ano)
- Gráfico de evolução acumulada
- Comparativo entre períodos
- Análise por categorias
- Exportação de relatório PDF

### Metas
- Criação de objetivos financeiros
- Acompanhamento de progresso
- Adicionar valores incrementalmente
- Visualização de prazos

## 🚀 Começando

### Pré-requisitos

```bash
Node.js 18+
npm ou yarn
```

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/meubolsorapido.git

# Entre na pasta
cd meubolsorapido

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

### Variáveis de Ambiente (Opcional)

Para usar o backend Supabase:

```env
VITE_SUPABASE_URL=sua_url_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_supabase
```

Veja [BACKEND_SETUP.md](./BACKEND_SETUP.md) para mais detalhes.

## 📱 Como Usar

### 1. Onboarding (Primeira vez)

1. **Tela Splash**: Apresentação visual com card 3D
2. **Nome**: Digite seu nome ou apelido
3. **Salário**: Informe sua renda mensal
4. **Contas Fixas**: Liste suas despesas recorrentes (aluguel, internet, etc.)

### 2. Dashboard Principal

#### Início
- Veja quanto pode gastar **hoje**
- Visualize seu saldo disponível
- Registre gastos rapidamente
- Receba insights personalizados
- Exporte relatório em PDF

#### Estatísticas
- Selecione o período desejado
- Analise gráficos de evolução
- Compare com períodos anteriores
- Veja gastos por categoria
- Exporte relatório detalhado

#### Metas
- Crie novos objetivos financeiros
- Acompanhe o progresso
- Adicione valores conforme economiza
- Visualize dias restantes

### 3. Registrar Gastos

1. Clique no botão **"Registrar"** ou **"+"**
2. Digite o valor
3. Selecione a categoria (visual com ícones)
4. Adicione descrição (opcional)
5. Confirme

### 4. Exportar Relatório

1. Vá em **Estatísticas**
2. Selecione o período desejado
3. Clique em **"Exportar Relatório Completo em PDF"**
4. O arquivo será baixado automaticamente

O relatório inclui:
- Resumo financeiro visual
- Detalhamento de gastos
- Análise por categoria
- Metas e progresso
- Insights e recomendações
- Histórico completo de transações

## 🏗️ Arquitetura

### Estrutura de Pastas

```
/
├── components/          # Componentes React
│   ├── Dashboard.tsx   # Tela principal
│   ├── Onboarding.tsx  # Fluxo inicial
│   ├── ExpenseModal.tsx
│   ├── GoalsSection.tsx
│   ├── InsightsCard.tsx
│   ├── MonthlyChart.tsx
│   ├── ComparativeChart.tsx
│   └── ui/             # Componentes shadcn/ui
├── contexts/           # React Context (Theme)
├── lib/               # Bibliotecas e utils
│   ├── supabase.ts    # Cliente e APIs Supabase
│   └── pdfGenerator.ts # Geração de PDFs
├── styles/            # CSS global
└── App.tsx            # Componente raiz
```

### Tecnologias

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **PDF**: jsPDF
- **Notifications**: Sonner
- **Animations**: Motion (Framer Motion)
- **Backend**: Supabase (PostgreSQL + Auth)

## 🎨 Design System

### Cores

```css
/* Tema Escuro (Padrão) */
--background: #000000
--foreground: #FFFFFF
--purple: #7c3aed → #a855f7 → #d946ef
--card: rgba(255,255,255,0.05)

/* Tema Claro */
--background: #FFFFFF
--foreground: #000000
--purple: #7c3aed → #a855f7 → #d946ef
--card: rgba(0,0,0,0.05)
```

### Tipografia

- **Headers**: Helvetica/System Font
- **Body**: Default system font
- **Numbers**: Tabular nums para alinhamento

### Componentes

- **Cards**: Rounded-3xl com glassmorphism
- **Buttons**: Gradiente purple-pink
- **Inputs**: Minimal com border-bottom
- **Charts**: Área gradiente + linha purple

## 🔒 Segurança & Privacidade

### Armazenamento Local (Padrão)
- ✅ Dados salvos no localStorage do navegador
- ✅ 100% privado e offline
- ✅ Nenhum dado enviado para servidores
- ✅ Você controla seus dados

### Backend Supabase (Opcional)
- ✅ Row Level Security (RLS) ativado
- ✅ Cada usuário acessa apenas seus dados
- ✅ Criptografia em trânsito (HTTPS)
- ✅ Backup automático na nuvem

## 📊 Recursos Avançados

### Filtros de Período

- **Mês**: Dados diários do mês atual
- **Trimestre**: Dados semanais dos últimos 3 meses
- **Ano**: Dados mensais do ano atual

### Insights Automáticos

O app analisa automaticamente:
- Taxa de utilização do orçamento
- Categorias com gastos elevados
- Projeção de economia no mês
- Oportunidades de redução de custos

### Categorias

- 🛍️ Compras
- 🍔 Alimentação
- 🚗 Transporte
- 🏠 Casa
- 🎮 Lazer
- 💊 Saúde
- 💰 Outro

## 🛠️ Desenvolvimento

### Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview

# Lint
npm run lint
```

### Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Roadmap

### ✅ Concluído (v2.0)
- [x] Modo claro/escuro
- [x] Estatísticas avançadas com filtros
- [x] Exportação de relatório PDF
- [x] Sistema de metas
- [x] Insights inteligentes
- [x] Gráficos comparativos

### 🚧 Em Desenvolvimento
- [ ] Integração Supabase completa
- [ ] Autenticação de usuários
- [ ] Sincronização em tempo real
- [ ] Notificações push

### 🎯 Futuro
- [ ] Orçamento por categoria
- [ ] Receitas e transferências
- [ ] Modo offline completo
- [ ] Integração bancária
- [ ] App mobile nativo

## 📖 Documentação

- [BACKEND_SETUP.md](./BACKEND_SETUP.md) - Setup do Supabase
- [PDF_EXPORT_GUIDE.md](./PDF_EXPORT_GUIDE.md) - Guia de exportação PDF
- [CHANGELOG.md](./CHANGELOG.md) - Histórico de versões

## 🎯 Público-Alvo

- **Idade**: 18-45 anos
- **Renda**: R$ 1.200 - R$ 6.000
- **Perfil**: Pessoas que querem controle financeiro sem complicação
- **Necessidade**: Clareza instantânea sobre gastos

## 💡 Diferenciais

1. **Simplicidade**: Sem conectar conta bancária ou planilhas complexas
2. **Visual**: Interface moderna e intuitiva
3. **Direto ao ponto**: Resposta imediata: "quanto posso gastar hoje?"
4. **Linguagem popular**: Tom amigável e descontraído
5. **Mobile-first**: Otimizado para smartphones

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](./LICENSE) para mais detalhes.

## 👥 Time

Desenvolvido com ❤️ pela equipe MeuBolsoRápido

## 🆘 Suporte

- 📧 Email: suporte@meubolsorapido.com
- 💬 Issues: [GitHub Issues](https://github.com/seu-usuario/meubolsorapido/issues)
- 📱 Twitter: [@meubolsorapido](https://twitter.com/meubolsorapido)

## ⭐ Mostre seu apoio

Se este projeto te ajudou, dê uma ⭐️!

---

**MeuBolsoRápido** - Clareza financeira instantânea 💜
