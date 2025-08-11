# TV Shows App

A clean, modern Vue.js application for browsing and searching TV shows. I built this with a focus on clear design principles and excellent user experience - every component serves a purpose, every interaction feels natural, and the codebase is maintainable and well-tested.

## Quick Start

```sh
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## My Design Philosophy

### Clear & Purposeful Design

I believe great software starts with clear design decisions. This app follows a component-first approach where each piece has a single responsibility. The UI is clean and intuitive - users can immediately understand how to browse shows, search, and view details without any confusion.

### Why Vue 3?

I chose Vue 3 because it feels like the perfect balance of power and simplicity. The composition API makes complex logic readable, and Vue's reactive system just works intuitively. Plus, the TypeScript support is excellent - I can catch errors before they reach users.

### Why Vite?

Speed matters. Vite gives me instant feedback during development, which means I can iterate quickly and focus on what users actually care about. No more waiting for builds to complete!

### State Management: Pinia

I went with Pinia because it's straightforward and doesn't get in the way. State management should be simple, not a puzzle to solve. Pinia makes it easy to manage the app's data flow without over-engineering.

### Testing: Vitest

I believe in writing tests that actually help catch bugs, not just increase coverage numbers. Vitest runs fast and integrates seamlessly with Vue, so I can focus on testing the important behaviors that matter to users.

## Requirements

- Node.js: 20.19.x or 22.12.x and above
- npm: 10.x or 9.x compatible with the Node version above

## Getting Started

1. Install dependencies

```sh
npm install
```

2. Start the dev server

```sh
npm run dev
```

3. Run unit tests

```sh
npm run test:unit
```

4. Lint and auto-fix

```sh
npm run lint
```

5. Type-check, build, preview

```sh
npm run build
npm run preview
```

## Project Structure

- `src/services/tvMazeApi.ts`: API client with typed responses.
- `src/stores/shows.ts`: Pinia store for shows, loading/error, and derived genre maps.
- `src/router/index.ts`: Route definitions for dashboard and show details.
- `src/views/*`: Page-level components.
- `src/components/*`: Presentational and composable components.
- `src/types/*`: Shared TypeScript interfaces/enums for API models.
- `src/__tests__/*`: Unit tests for services, store, and key UI interactions.

## Notable Testing Choices

- Unit tests favor core logic (API client and store). UI tests focus on meaningful interactions, e.g., `AppHeader` search input v-model and reset behavior.
- Mocked `fetch` uses a typed `Mock` from Vitest to avoid `any` casts.

## Environment

- Framework: Vue 3.5 + Vite 7
- State: Pinia 3
- Router: Vue Router 4
- Testing: Vitest 3, Vue Test Utils 2, jsdom 26
