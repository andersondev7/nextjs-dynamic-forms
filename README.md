# Formulários Dinâmicos

Construa, visualize e colete respostas de formulários inteligentes com condicionalidades, múltiplos tipos de perguntas e interface moderna. Desenvolvido com Next.js, React, TypeScript, TailwindCSS e Shadcn/ui.

## Funcionalidades

- Criação e edição de formulários dinâmicos
- Diversos tipos de perguntas: texto livre, escolha única, múltipla escolha, sim/não, número inteiro e decimal
- Condicionalidade entre perguntas (exibição condicional baseada em respostas anteriores)
- Visualização e análise de respostas
- Interface responsiva e acessível
- Backend persistente via Next.js API Routes (JSON)

## Tecnologias Utilizadas

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI**: TailwindCSS, Shadcn/ui, Radix UI, Lucide React
- **Backend**: Next.js API Routes (ServerJS, persistência em arquivos JSON)

## Pré-requisitos

- Node.js 18+
- npm, yarn, pnpm ou bun

## Instalação e Configuração

### 1. Clone o repositório

```bash
git clone https://github.com/andersondev7/nextjs-dynamic-forms.git
cd nextjs-dynamic-forms
```

### 2. Instale as dependências

```bash
npm install
# ou
yarn install
# ou
pnpm install
```

### 3. Execute o projeto

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## Backend API (ServerJS)

O projeto utiliza **Next.js API Routes** como backend, oferecendo:

- **Dados persistentes** - Salvos em arquivos JSON no servidor
- **API REST completa** - Endpoints para formulários e respostas
- **TypeScript** - Tipagem completa e segura

## 📁 Estrutura do Projeto

```
tsconfig.json                # Configuração TypeScript
data/
├── forms.json               # Formulários criados
└── responses.json           # Respostas coletadas
src/
├── app/
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx           # Layout global
│   ├── page.tsx             # Página inicial
│   ├── api/
│   │   ├── forms/
│   │   │   ├── route.ts     # Listagem/criação de formulários
│   │   │   └── [id]/
│   │   │       └── route.ts # Detalhe/remoção de formulário
│   │   └── responses/
│   │       └── route.ts     # Listagem/criação de respostas
│   ├── forms/
│   │   ├── [id]/
│   │   │   ├── fill/
│   │   │   │   └── page.tsx # Preenchimento de formulário
│   │   │   └── results/
│   │   │       └── page.tsx # Visualização de respostas
│   │   ├── new/
│   │   │   └── page.tsx     # Criação de formulário
│   │   └── preview/
│   │       └── fill/
│   │           └── page.tsx # Preview de preenchimento
├── components/
│   ├── QuestionEditor/
│   │   └── index.tsx        # Editor visual de perguntas
│   ├── QuestionRenderer/
│   │   └── index.tsx        # Renderização dinâmica das perguntas
│   └── ui/
│       ├── badge.tsx
│       ├── breadcrumb.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── checkbox.tsx
│       ├── dropdown-menu.tsx
│       ├── header.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── progress.tsx
│       ├── radio-group.tsx
│       ├── select.tsx
│       ├── separator.tsx
│       ├── slider.tsx
│       ├── switch.tsx
│       └── textarea.tsx
│   └── context/
│           ├── theme-provider.tsx
│           └── theme-toggle.tsx
│   └── lib/
│       ├── api-storage.ts   # Persistência de dados (JSON)
│       ├── types.ts         # Tipos TypeScript
│       ├── utils.ts         # Utilitários gerais
│       ├── validations.ts   # Validações de campos

```

### Endpoints da API

**Formulários:**

- `GET /api/forms` - Listar todos os formulários
- `POST /api/forms` - Criar/atualizar formulário
- `GET /api/forms/[id]` - Buscar formulário específico
- `DELETE /api/forms/[id]` - Deletar formulário

**Respostas:**

- `GET /api/responses` - Listar todas as respostas
- `GET /api/responses?formId=123` - Listar respostas de um formulário
- `POST /api/responses` - Criar nova resposta

### Armazenamento de Dados

Os dados são salvos em arquivos JSON na pasta `data/`:

```
data/
├── forms.json      # Formulários criados
└── responses.json  # Respostas coletadas
```

## 🎯 Como Usar

### Criando um Formulário

1. Acesse a página inicial
2. Clique em "Criar Novo Formulário"
3. Preencha o título e descrição
4. Adicione perguntas usando os diferentes tipos disponíveis
5. Configure condicionalidades se necessário
6. Salve o formulário

### Tipos de Perguntas Disponíveis

- **Texto livre**: Campo aberto para resposta
- **Escolha única**: Seleção de uma opção (radio)
- **Múltipla escolha**: Seleção de várias opções (checkbox)
- **Sim/Não**: Pergunta booleana
- **Número inteiro**: Campo numérico
- **Número decimal**: Campo numérico com casas decimais

### Condicionalidades

Permite exibir perguntas apenas quando condições específicas são atendidas, com base em respostas anteriores. Suporta operadores:

- **é igual a**
- **é diferente de**
- **contém**

### Visualizando Respostas

1. Acesse a página de resultados do formulário
2. Veja todas as respostas coletadas de forma organizada
3. Analise os dados diretamente na interface

## 🔍 Debugging e Testes

### Verificar dados salvos

```bash
# Os dados ficam em:
cat data/forms.json
cat data/responses.json
```

### Testar APIs

```bash
# Listar formulários
curl http://localhost:3000/api/forms

# Criar formulário
curl -X POST http://localhost:3000/api/forms \
  -H "Content-Type: application/json" \
  -d '{"id":"123","title":"Teste"}'
```

---

- [Next.js](https://nextjs.org/) - Framework React
- [TailwindCSS](https://tailwindcss.com/) - Framework CSS
- [Shadcn/ui](https://ui.shadcn.com/) - Componentes UI
- [Radix UI](https://www.radix-ui.com/) - Componentes primitivos
