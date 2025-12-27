## Keyword Research & SERP Explorer

React Native (Expo) app with web support for keyword research, SERP discovery, and trend exploration. The codebase is organized for shared mobile/web components so you can expand to a full web client easily.

### Getting started

```bash
npm install
# Mobile (Expo Go or emulator)
npm run android
# Web preview
npm run web
```

### Features in this starter
- Keyword analysis screen with suggestions, long-tail ideas, and question-based prompts
- SERP snapshot list with ranking, snippets, and SERP feature tags
- Trend sparkline showing month-over-month interest
- Local caching (history + favorites) via AsyncStorage
- Rate-limited, cached mock API provider with a single swap point for real APIs (`src/services/keywordService.ts`)
- Export actions (JSON/CSV) copied to clipboard for quick sharing
- Navigation scaffold with dedicated Favorites screen

### Swapping in real APIs
Update `src/services/keywordService.ts` to call your keyword, SERP, or trend providers (SEMrush, Ahrefs, Google Keyword Planner, Google Trends, etc.). Keep the rate limit helper and cache map to avoid throttling.

### Notes
- Tests are not included yet; add lightweight unit tests around the service layer when wiring real APIs.
- For CI/CD, run `npm run web` for a quick web build smoke test. Use `expo export` for production bundles.
