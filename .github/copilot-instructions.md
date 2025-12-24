# Copilot Instructions for Elogiador de GitHub

## Project Overview

Next.js 16 app that fetches GitHub profiles via REST API and streams professional AI-powered career analysis using OpenAI-compatible APIs (OpenAI, DeepSeek). The AI acts as a technical mentor, providing constructive feedback focused on commitment, discipline, and professional growth. Uses Upstash Redis for caching and rate-limiting, with client-side i18n (Portuguese/English).

## Architecture

- **API Routes**: Single endpoint at [src/app/api/analyze/route.ts](src/app/api/analyze/route.ts) handles POST requests, validates with Zod, builds AI prompt from GitHub data, and streams OpenAI response
- **Services Layer**:
  - [getGitHubProfile.ts](src/services/getGitHubProfile.ts) fetches user + repos from GitHub API with string truncation
  - [redis.ts](src/services/redis.ts) conditionally initializes Upstash Redis (null if env vars missing)
  - [i18n.ts](src/services/i18n.ts) configures client-side react-i18next with PT/EN translations
- **Client Components**: All components in [src/app/components/](src/app/components/) use `"use client"` directive; [UserSection.tsx](src/app/components/UserSection.tsx) orchestrates form submission, profile fetching, and streaming response
- **Middleware**: [proxy.ts](src/proxy.ts) implements rate-limiting (3 req/min via sliding window) on `/api/analyze` using x-forwarded-for IP

## Critical Patterns

### Streaming AI Responses

```typescript
// In route.ts - Always stream OpenAI responses with ReadableStream
// Uses dual-message pattern: system prompt (mentor persona) + user prompt (profile data)
const stream = new ReadableStream({
  async pull(controller) {
    for await (const event of completion) {
      const text = choice.delta.content;
      content += text;
      controller.enqueue(text);
    }
    controller.close();
  },
});
return new NextResponse(stream, { headers: { "Content-Type": "text/plain" } });
```

### AI Prompt Architecture

The system uses a two-part prompt structure:

1. **System Prompt**: Defines the "Elite Mentor" persona with analysis guidelines, tone restrictions, and output format
2. **User Prompt**: Provides structured profile data (username, repos, stats, languages)

Key persona traits: Professional, encouraging, focused on growth potential. Avoids sarcasm, empty praise, or military metaphors.

### Optional Redis Pattern

Redis is always checked for null before use: `if (redis) { ... }`. Rate-limiting and caching are gracefully disabled when Redis env vars are missing.

### Repo Selection Logic

[UserSection.tsx](src/app/components/UserSection.tsx#L64-L77) shuffles repos but ALWAYS ensures the most-starred repo is included in the 5 sent to AI.

### Environment Variables

- `BASE_URL`, `API_KEY`, `MODEL` - Required for OpenAI-compatible API
- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` - Optional for caching/rate-limiting
- See [.env.example](.env.example) for reference

## Development Workflow

```bash
npm install           # Install dependencies
npm run dev           # Start dev server with Turbopack (--turbopack flag in package.json)
npm run build         # Production build
npm run lint          # ESLint check
```

## Code Conventions

- **All components are client components** - Use `"use client"` directive at top of component files
- **Import aliases**: Use `@/` for src/ directory (configured in [tsconfig.json](tsconfig.json))
- **Styling**: Tailwind CSS 4.0 with PostCSS; use utility classes
- **i18n**: Use `useTranslation()` hook or `i18n.t()` for all user-facing strings; keys defined in [src/services/i18n.ts](src/services/i18n.ts)
- **Error handling**: Throw descriptive errors in services; catch and display in components via [ErrorMessage.tsx](src/app/components/ErrorMessage.tsx)
- **String truncation**: Always use [truncateString.ts](src/utils/truncateString.ts) for GitHub data (location: 48, description: 350, name: 48, bio: 160)

## Integration Points

- **GitHub API**: Unauthenticated requests to `api.github.com/users/{username}` and `/users/{username}/repos?per_page=100`
- **OpenAI API**: Configurable baseURL allows DeepSeek or other OpenAI-compatible APIs
- **Upstash Redis**: Cache key pattern `analysis:{username}` with 10min TTL; rate-limit by IP address
- **Vercel Analytics**: Integrated via `@vercel/analytics` package
