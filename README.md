# 🌟 Elogiador de GitHub

**Elogiador de GitHub** é uma aplicação web moderna que utiliza inteligência artificial para analisar perfis do GitHub e fornecer feedback profissional, encorajador e construtivo focado em crescimento, comprometimento e desenvolvimento de carreira.

Ao contrário de ferramentas de análise tradicionais, o Elogiador atua como um **mentor técnico entusiasmado**, reconhecendo o esforço dos desenvolvedores, destacando projetos interessantes e incentivando o aprendizado contínuo.

## ✨ Características

- 🤖 **Análise por IA**: Feedback personalizado gerado por modelos de linguagem avançados (OpenAI, DeepSeek, OpenRouter)
- 🌐 **Internacionalização**: Suporte completo para Português e Inglês
- ⚡ **Streaming em Tempo Real**: Respostas da IA transmitidas em tempo real para melhor experiência do usuário
- 🎨 **Interface Moderna**: Design responsivo com Tailwind CSS 4.0, gradientes e animações suaves
- 📦 **Cache Inteligente**: Sistema opcional de cache com Upstash Redis (10 minutos)
- 🛡️ **Rate Limiting**: Proteção contra abuso com limite de 3 requisições por minuto (quando Redis está ativo)
- 🔒 **Validação Robusta**: Todas as entradas validadas com Zod para segurança
- 🎯 **Seleção Inteligente**: Algoritmo que garante análise dos projetos mais relevantes

## 🚀 Tecnologias

- **Framework**: [Next.js 16](https://nextjs.org/) com App Router e Turbopack
- **UI**: [React 19](https://react.dev/), [Tailwind CSS 4.0](https://tailwindcss.com/)
- **Linguagem**: [TypeScript 5](https://www.typescriptlang.org/)
- **IA**: API OpenAI-compatible (OpenAI, DeepSeek, OpenRouter)
- **Cache/Rate Limit**: [Upstash Redis](https://upstash.com/) (opcional)
- **Validação**: [Zod](https://zod.dev/)
- **i18n**: [react-i18next](https://react.i18next.com/)
- **Markdown**: [react-markdown](https://github.com/remarkjs/react-markdown)
- **Analytics**: [Vercel Analytics](https://vercel.com/analytics)

## 📦 Instalação

### Pré-requisitos

- Node.js 18+ instalado
- Conta em provedor de API de IA (OpenAI, DeepSeek ou OpenRouter)
- (Opcional) Conta no Upstash para Redis

### Passos

1. **Clone o repositório**

```bash
git clone https://github.com/gaelos7k/elogiador-de-github.git
cd elogiador-de-github
```

2. **Instale as dependências**

```bash
npm install
```

3. **Configure as variáveis de ambiente**

Copie o arquivo `.env.example` para `.env` e preencha:

```env
# OBRIGATÓRIO - Configuração da API de IA
BASE_URL=https://api.openai.com/v1
API_KEY=sua-chave-api-aqui
MODEL=gpt-4o-mini

# OPCIONAL - Redis para cache e rate-limiting
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

**Opções de API**:

- **OpenAI**: [platform.openai.com](https://platform.openai.com/) - Modelos recomendados: `gpt-4o-mini`, `gpt-4o`
- **DeepSeek**: [api-docs.deepseek.com](https://api-docs.deepseek.com/) - Modelo: `deepseek-chat`
- **OpenRouter** (GRÁTIS): [openrouter.ai](https://openrouter.ai/) - Modelo gratuito: `meta-llama/llama-3.2-3b-instruct:free`

**Redis** (opcional): [upstash.com](https://upstash.com/) - Ativa cache de análises e rate-limiting

4. **Execute o servidor de desenvolvimento**

```bash
npm run dev
```

5. **Acesse a aplicação**

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 🛠️ Scripts Disponíveis

```bash
npm run dev       # Inicia servidor de desenvolvimento (com Turbopack)
npm run build     # Cria build de produção
npm run start     # Inicia servidor de produção
npm run lint      # Executa ESLint
npm run format    # Formata código com Prettier
```

## 📁 Estrutura do Projeto

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
│   ├── redis.ts                  # Configuração Redis
│   └── i18n.ts                   # Configuração i18next
├── utils/
│   ├── truncateString.ts         # Truncamento de strings
│   └── shuffleArray.ts           # Embaralhamento de arrays
└── proxy.ts                      # Middleware de rate-limiting
```

## 🔒 Segurança

- ✅ **Validação de entrada**: Todos os dados são validados com Zod antes do processamento
- ✅ **Rate limiting**: Proteção contra abuso com limite de 3 requisições por minuto por IP
- ✅ **Sanitização**: Strings truncadas e validadas com regex para prevenir injeções
- ✅ **Variáveis de ambiente**: Validação de variáveis obrigatórias na inicialização
- ⚠️ **GitHub API**: Usa API pública sem autenticação (limite de 60 req/hora por IP)

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

**Atenção**: O projeto usa [ESLint](https://eslint.org/) e [Prettier](https://prettier.io/). Execute `npm run lint` e `npm run format` antes de commitar.

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🎯 Como Funciona

1. **Entrada**: Usuário informa username do GitHub
2. **Busca**: Sistema busca perfil e repositórios via GitHub API
3. **Seleção**: Algoritmo seleciona até 5 repositórios mais relevantes (priorizando não-forks, não-arquivados, e incluindo sempre o mais popular)
4. **Análise**: Dados são enviados para API de IA com prompt especializado
5. **Streaming**: Resposta é transmitida em tempo real para o usuário
6. **Cache**: Análise é armazenada no Redis por 10 minutos (se configurado)

## 💡 Prompt da IA

O sistema utiliza um prompt cuidadosamente elaborado que:

- Define a IA como um "mentor técnico empolgado"
- Instrui a focar em elogios e incentivos
- Estabelece estrutura clara de resposta com bullets
- Proíbe menções negativas ou sarcasmo
- Exige personalização baseada nas tecnologias do desenvolvedor

## 🌍 Deploy

Recomendado: [Vercel](https://vercel.com)

```bash
# Instale a CLI da Vercel
npm i -g vercel

# Deploy
vercel
```

Não esqueça de configurar as variáveis de ambiente no dashboard da Vercel!

## 📧 Contato

Criado por [gaelos7k](https://github.com/gaelos7k)

---

⭐ Se este projeto foi útil, considere dar uma estrela no GitHub!
