# WoiceFlow — Website

The marketing and documentation site for [WoiceFlow](https://github.com/NoahMenezes/WoiceFlow), built with **Next.js 16**, **Tailwind CSS v4**, and **Bun**.

---

## Tech Stack

| Technology | Role |
|---|---|
| [Next.js 16](https://nextjs.org) (App Router) | React framework with server components |
| [Tailwind CSS v4](https://tailwindcss.com) | Utility-first styling |
| [Framer Motion](https://www.framer-motion.com) | Scroll & entrance animations |
| [Lucide React](https://lucide.dev) | Icon set |
| [Bun](https://bun.sh) | Package manager & build runtime |
| TypeScript | Type safety across all components |

---

## Project Structure

```
website/
│
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout (fonts, metadata)
│   │   ├── globals.css             # Global styles & Tailwind config
│   │   ├── page.tsx                # Homepage (hero, features, install, docs)
│   │   └── docs/
│   │       ├── layout.tsx          # Docs shared layout
│   │       ├── page.tsx            # Docs index
│   │       ├── linux/              # Linux setup guide
│   │       ├── macos/              # macOS setup guide
│   │       └── windows/            # Windows setup guide
│   │
│   └── components/
│       ├── BoomerangVideoBg.tsx    # Seamless looping hero video component
│       └── ui/
│           └── terminal.tsx        # Animated terminal component
│
├── public/                         # Static assets
├── package.json
├── next.config.ts
├── tsconfig.json
└── eslint.config.mjs
```

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) — install with:
  ```bash
  curl -fsSL https://bun.sh/install | bash
  ```
- Node.js 18+ (used by Next.js internally)

### Install Dependencies

```bash
bun install
```

### Run the Development Server

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
bun run build
bun run start
```

### Lint

```bash
bun run lint
```

---

## Page Sections

The homepage (`src/app/page.tsx`) is organized into the following sections:

| Section | Anchor | Description |
|---|---|---|
| Hero | — | Full-screen video background with headline |
| Why Offline? | `#why` | Privacy & performance argument with animated lamp graphic |
| Comparison | `#compare` | WoiceFlow vs. cloud dictation vs. manual typing |
| Installation | `#setup` | One-line install commands for Linux, macOS, and Windows |
| Configuration | — | Environment variables & key bindings guide |
| Architecture | — | Tech stack overview |
| Features | — | Bento-grid feature cards |

---

## Adding a New Docs Page

1. Create a folder under `src/app/docs/`:
   ```
   src/app/docs/my-topic/
   └── page.tsx
   ```

2. Export a default React component with your content.

3. Link to it from `src/app/docs/page.tsx` or from the homepage install section.

---

## Environment Variables

No environment variables are required to run the website locally. All content is statically rendered.

---

## Deployment

The site can be deployed on any platform that supports Next.js:

- **Vercel** (recommended): Connect your GitHub repo and deploy automatically.
- **Self-hosted**: Run `bun run build` then `bun run start` on your server.
- **Static export** (optional): Configure `output: 'export'` in `next.config.ts` for a fully static build.

---

## Contributing

See the [root README](../README.md) for contribution guidelines.
