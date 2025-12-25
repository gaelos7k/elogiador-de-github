# Elogiador de GitHub

Aplicação Next.js que analisa perfis do GitHub e gera feedback profissional encorajador via inteligência artificial. A IA atua como mentor técnico, destacando esforços, projetos relevantes e incentivando crescimento.

## Características

- Análise personalizada via modelos OpenAI-compatible (OpenAI, DeepSeek, OpenRouter)
- Interface bilíngue (Português/Inglês) com i18n client-side
- Streaming de respostas em tempo real
- Seleção inteligente de repositórios (até 5, priorizando não-forks e garantindo inclusão do mais popular)
- Validação de entrada com Zod
- Design responsivo com Tailwind CSS 4.0

## Tecnologias

- Next.js 16 com App Router e Turbopack
- React 19, TypeScript 5, Tailwind CSS 4.0
- Zod (validação), react-i18next (i18n), react-markdown
- API OpenAI-compatible
- Vercel Analytics

## Instalação

**Pré-requisitos**: Node.js 18+ e chave de API de IA (OpenAI, DeepSeek ou OpenRouter)

1. Clone o repositório

```bash
git clone https://github.com/gaelos7k/elogiador-de-github.git
cd elogiador-de-github
```

2. Instale as dependências

```bash
npm install
```

3. Configure variáveis de ambiente

Copie `.env.example` para `.env` e configure:

```env
BASE_URL=https://api.openai.com/v1
API_KEY=sua-chave-api-aqui
MODEL=gpt-4o-mini
```

Provedores compatíveis:

- OpenAI: `gpt-4o-mini`, `gpt-4o`
- DeepSeek: `deepseek-chat`
- OpenRouter: `meta-llama/llama-3.2-3b-instruct:free` (gratuito)

4. Execute o servidor de desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## Scripts Disponíveis

```bash
npm run dev       # Inicia servidor de desenvolvimento (com Turbopack)
npm run build     # Cria build de produção
npm run start     # Inicia servidor de produção
npm run lint      # Executa ESLint
npm run format    # Formata código com Prettier
```

## Estrutura do Projeto

```
src/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts          # Endpoint principal da API
│   ├── components/
│   │   ├── UserSection.tsx       # Componente principal com form
│   │   ├── UserInput.tsx         # Input de username
│   │   ├── ErrorMessage.tsx      # Exibição de erros
│   │   ├── LanguageSelector.tsx  # Seletor PT/EN
│   │   ├── Navbar.tsx            # Barra de navegação
│   │   └── DonationMessage.tsx   # Mensagem de apoio
│   ├── layout.tsx                # Layout raiz
│   ├── page.tsx                  # Página principal
│   └── globals.css               # Estilos globais
├── services/
│   ├── getGitHubProfile.ts       # Busca dados do GitHub
│   └── i18n.ts                   # Configuração i18next
├── utils/
    ├── shuffleArray.ts           # Randomização de arrays
    └── truncateString.ts         # Truncamento de strings
```

## Funcionamento

1. Usuário informa username do GitHub
2. Sistema busca perfil e até 100 repositórios via GitHub REST API
3. Algoritmo seleciona 5 repositórios relevantes:
   - Prioriza repositórios ativos (não-fork, não-arquivados)
   - Randomiza seleção para variedade
   - Garante inclusão do repositório com mais estrelas
4. Dados formatados são enviados para API de IA com prompt dual (system + user)
5. Resposta streaming é exibida em tempo real com Markdown

## Segurança

- Validação de entrada com Zod em todas as requisições
- Strings truncadas e sanitizadas (regex validação)
- Variáveis de ambiente validadas na inicialização
- GitHub API pública sem autenticação (limite: 60 req/hora por IP)

## Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças
4. Push e abra um Pull Request

Execute `npm run lint` e `npm run format` antes de commitar.

## Licença

MIT License - veja [LICENSE](LICENSE) para detalhes.

## Deploy

Recomendado: Vercel

```bash
npm i -g vercel
vercel
```

Configure as variáveis de ambiente no dashboard após deploy.

## Autor

[gaelos7k](https://github.com/gaelos7k)
