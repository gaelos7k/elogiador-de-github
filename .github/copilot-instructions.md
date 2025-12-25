# Copilot Instructions for Elogiador de GitHub

## Project Overview

Next.js 16 app that fetches GitHub profiles via REST API and streams professional AI-powered career analysis using OpenAI-compatible APIs (OpenAI, DeepSeek, OpenRouter). The AI acts as an enthusiastic technical mentor ("Elite Mentor") providing encouraging feedback focused on recognizing effort, highlighting interesting projects, and motivating continued learning. Uses Upstash Redis for caching and rate-limiting (both optional), with client-side i18n (Portuguese/English).

## Architecture

- **API Routes**: Single endpoint at [src/app/api/analyze/route.ts](src/app/api/analyze/route.ts) handles POST requests, validates with Zod, builds AI prompt from GitHub data, and streams OpenAI response
- **Services Layer**:
  - [getGitHubProfile.ts](src/services/getGitHubProfile.ts) fetches user + repos (max 100) from GitHub API with string truncation, using unauthenticated requests
  - [redis.ts](src/services/redis.ts) conditionally initializes Upstash Redis (null if env vars missing), singleton pattern with `cache: "default"`
  - [i18n.ts](src/services/i18n.ts) configures client-side react-i18next with PT/EN translations inline, no external JSON files
- **Client Components**: All components in [src/app/components/](src/app/components/) use `"use client"` directive; [UserSection.tsx](src/app/components/UserSection.tsx) orchestrates form submission, profile fetching, streaming response via ReadableStream decoder, and error handling
- **Middleware**: [proxy.ts](src/proxy.ts) implements rate-limiting (3 req/min via sliding window) on `/api/analyze` using x-forwarded-for IP; gracefully disabled if Redis unavailable

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
      controller.enqueue(text); // Enqueue each chunk
    }
    // Cache complete analysis AFTER streaming finishes
    if (redis) {
      redis.set("analysis:" + data.username.toLowerCase(), content);
      redis.expire("analysis:" + data.username.toLowerCase(), 60 * 10);
    }
    controller.close();
  },
});
return new NextResponse(stream, { headers: { "Content-Type": "text/plain" } });
```

Client-side decoding in [UserSection.tsx](src/app/components/UserSection.tsx):

```typescript
const reader = res.body.getReader();
const decoder = new TextDecoder("utf-8");
let content = "";
while (!(chunk = await reader.read())?.done) {
  content += decoder.decode(chunk.value);
  setText(content); // Update UI with each chunk
}
```

### AI Prompt Architecture

The system uses a two-part prompt structure:

1. **System Prompt**: Defines the "Elite Mentor" persona with analysis guidelines, tone restrictions, and output format
2. **User Prompt**: Provides structured profile data (username, repos, stats, languages)

Key persona traits: Professional, encouraging, focused on growth potential. Avoids sarcasm, empty praise, or military metaphors.

### Optional Redis Pattern

Redis is always checked for null before use: `if (redis) { ... }`. Rate-limiting and caching are gracefully disabled when Redis env vars are missing.

### Repo Selection Logic

[UserSection.tsx](src/app/components/UserSection.tsx#L64-L77) implements smart repo selection:

1. Filters for active repos (not archived/forked) when possible
2. Shuffles remaining repos for variety
3. Takes first 5 repos
4. **ALWAYS ensures most-starred repo is included** - replaces first slot if not already present
5. Deduplicates by repo ID as safety measure

This ensures AI analyzes the developer's most impactful work while showing diverse projects.

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
- **Styling**: Tailwind CSS 4.0 with PostCSS; use utility classes (gradient patterns in [UserSection.tsx](src/app/components/UserSection.tsx) for avatar glow effects)
- **i18n**: Use `useTranslation()` hook or `i18n.t()` for all user-facing strings; keys defined in [src/services/i18n.ts](src/services/i18n.ts). Pass current language to API via body
- **Error handling**: Throw descriptive errors in services using `t()` for localized messages; catch and display in components via [ErrorMessage.tsx](src/app/components/ErrorMessage.tsx)
- **String truncation**: Always use [truncateString.ts](src/utils/truncateString.ts) for GitHub data (location: 48, description: 350, name: 48, bio: 160)
- **Type safety**: Zod schemas in route.ts define strict validation rules (e.g., username regex, max array lengths)

## Integration Points

- **GitHub API**: Unauthenticated requests to `api.github.com/users/{username}` and `/users/{username}/repos?per_page=100`
- **OpenAI API**: Configurable baseURL allows DeepSeek or other OpenAI-compatible APIs
- **Upstash Redis**: Cache key pattern `analysis:{username}` with 10min TTL; rate-limit by IP address
- **Vercel Analytics**: Integrated via `@vercel/analytics` package
