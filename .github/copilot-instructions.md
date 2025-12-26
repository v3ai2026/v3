# Copilot Instructions — IntelliBuild Studio (v3)

These rules make AI coding agents immediately productive in this repo.

## Big Picture
- React + Vite app focused on AI-assisted generation and orchestration.
- `App.tsx` is the hub: manages tabs, state, and calls services (`geminiService`, `figmaService`, `vercelService`, `gcsService`, ads services).
- UI runs in browser (Tailwind via CDN). Vite injects env and serves on port 3000.
- AI generation returns a `GenerationResult` object of files + logs, then optional deploy/sync to Vercel/GCS.

## Key Files
- Core UI: [App.tsx](../App.tsx), [index.tsx](../index.tsx), [index.html](../index.html)
- Types: [types.ts](../types.ts) — `GeneratedFile`, `GenerationResult`, `TabType`, Ads types.
- Build config: [vite.config.ts](../vite.config.ts), [package.json](../package.json)
- AI service: [services/geminiService.ts](../services/geminiService.ts)
- Integrations: [services/figmaService.ts](../services/figmaService.ts), [services/gcsService.ts](../services/gcsService.ts), [services/vercelService.ts](../services/vercelService.ts), [services/githubService.ts](../services/githubService.ts)
- Ads UI: [components/ads/AdsDashboard.tsx](../components/ads/AdsDashboard.tsx), [components/ads/AIAdCreator.tsx](../components/ads/AIAdCreator.tsx)

## Dev Workflow
- Install and run:
  - `npm install`
  - `npm run dev` (Vite dev server, port 3000, host 0.0.0.0)
- Preview/build:
  - `npm run preview` (after build)
  - `npm run build`
- Tests: only `services/githubService.test.ts` exists; no test runner is configured in `package.json`. Avoid adding Jest/Vitest unless requested.

## Env & Secrets
- Set `GEMINI_API_KEY` in `.env.local`. Vite maps it to `process.env.API_KEY` and `process.env.GEMINI_API_KEY` (see [vite.config.ts](../vite.config.ts)).
- Do not render API key prompts in UI (see comment in [index.tsx](../index.tsx)).
- Figma/GCS/Vercel/GitHub tokens are captured via UI state and passed to service constructors/methods — keep them client-side only.

## AI Patterns
- Use `@google/genai`. Instantiate with `new GoogleGenAI({ apiKey: process.env.API_KEY })`.
- Prefer structured outputs: set `responseMimeType: "application/json"` and a `responseSchema` (examples in `geminiService.ts`, `aiCopywritingService.ts`).
- Multimodal: pass images via `inlineData` (base64 + mimeType) alongside text parts.
- Deep reasoning toggle adjusts `thinkingBudget` and picks model `gemini-3-pro-preview` vs `gemini-3-flash-preview`.

## Ads System
- State-backed in-memory orchestration via `UnifiedAdsService`: create/update campaigns, creatives, metrics, insights.
- `AdsDashboard.tsx` loads campaigns, metrics, AI insights; offers auto-optimization actions.
- `AIAdCreator.tsx` generates copy with `AICopywritingService` and creates an active campaign.

## External Integrations
- Figma: `FigmaService` reads file and exports node images by ID (`X-Figma-Token`).
- GCS: `GCSService` lists/creates buckets and uploads project files via JSON API (Bearer token).
- Vercel: `deployToVercel()` posts files to deployments API; optional `checkDeploymentStatus()`. Assumes Next.js when generating projects.
- GitHub: `GitHubService` uses PAT for repo provisioning and atomic updates; includes CI workflow injection helper.

## Conventions
- A11y-first + semantic HTML in generated code (enforced by `DEFAULT_SYSTEM_INSTRUCTION` in `geminiService.ts`).
- Styling: Luxury Dark (#020420) + Nuxt Green (#00DC82) via Tailwind (CDN in `index.html`).
- Aliases: `@` resolves to repo root (see `resolve.alias` in `vite.config.ts`).
- Tabs (`TabType`) define major app sectors and drive UI routing logic.

## Do / Don’t
- Do: use typed interfaces from `types.ts` when adding files/results/services.
- Do: keep secrets in `.env.local` + runtime state; access via `process.env.*` as configured.
- Do: follow structured JSON responses for AI calls; avoid freeform text.
- Don’t: introduce server-only libs or Node APIs into browser paths.
- Don’t: add test frameworks or CI without explicit request.

## Examples
- Env injection: read API key via `process.env.API_KEY` inside `geminiService.ts`.
- Image export: `FigmaService.getImages(fileKey, ids)` then fetch blob → base64 for multimodal prompts.
- Deployment: `deployToVercel(files, vercelToken, projectName)` returns `{ id, url, state }` and can be polled.

Feedback: If any workflow (tests, deploy, tokens) is unclear, point to the file and I’ll refine this doc.

## Debugging & Gotchas
- Network calls run client-side (`fetch` in services). Verify tokens exist in UI state before calling Figma/GCS/Vercel/GitHub.
- Import maps/CDN: dependencies (React, `@google/genai`, Monaco) load via CDN in [index.html](../index.html); avoid Node-only APIs in UI code.
- Generated output: `generateFullStackProject()` returns a Next.js project as files, previewed in the in-app editor; deployment assumes Next.js on Vercel.
- GCS uploads use `text/plain` and path normalization (no leading `/`); large projects may need rate limiting.
- Ads mock data seeds on first open of the Ads tab (`seedMockData()` in `UnifiedAdsService`); metrics/insights are synthetic.
- A11y is enforced in generated code via system instruction; keep semantic tags and ARIA when adding UI.