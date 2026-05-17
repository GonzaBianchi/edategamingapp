# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Servidor de desarrollo en localhost:3000
npm run build    # Build de producción
npm run lint     # ESLint
```

## Stack

- **Next.js** (App Router) + TypeScript + Tailwind + shadcn/ui
- **NextAuth v4** con Discord provider — JWT strategy, sin adapter
- **MongoDB Atlas** + Mongoose — conexión cacheada en `src/lib/db.ts`
- **Cloudinary** — para fotos de perfil/usuario
- **framer-motion** — mecánica de swipe en Discover
- **Deploy**: Vercel (frontend + API routes), MongoDB Atlas (DB)

## Estructura de rutas

```
src/app/
├── page.tsx                  # Redirect → /login o /discover
├── (auth)/login/             # Login con Discord (pública)
├── (app)/layout.tsx          # Guard: requiere sesión + onboarding completo
│   ├── discover/             # Swipe de perfiles
│   ├── matches/              # Lista de matches
│   ├── chat/[matchId]/       # Chat (UI placeholder por ahora)
│   ├── groups/               # LFG board (placeholder, implementar después)
│   ├── onboarding/           # Setup inicial del perfil
│   └── profile/              # Perfil del usuario
└── api/
    ├── auth/[...nextauth]/   # NextAuth handler
    ├── swipe/                # POST: registra swipe, detecta match bidireccional
    ├── matches/              # GET: matches del usuario autenticado
    └── users/discover/       # GET: perfiles para swipe (excluye ya vistos)
```

## Modelos

- **User** (`src/lib/models/User.ts`): perfil principal, incluye `swipedRight/Left/matches`, `onboardingComplete`, `riotAccount`, `games[]`
- **Match** (`src/lib/models/Match.ts`): par de usuarios con match + `chatId` (null hasta implementar chat real)
- **GroupPost** (`src/lib/models/GroupPost.ts`): modelo listo para la feature de grupos, no implementado aún

## Patrones importantes

**Auth**: `getServerSession(authOptions)` en server components/routes. El JWT lleva `userId`, `discordId`, `onboardingComplete`. El guard en `(app)/layout.tsx` redirige al onboarding si `onboardingComplete === false`.

**DB**: Siempre llamar `await connectDB()` antes de cualquier operación con Mongoose. El helper cachea la conexión para evitar múltiples instancias en hot reload.

**Swipe**: `POST /api/swipe` recibe `{ targetUserId, direction, game }`. Si ambos hicieron swipe right mutuamente, crea un documento `Match` y actualiza `matches[]` en ambos usuarios.

**Discover feed**: `GET /api/users/discover` excluye automáticamente perfiles ya swipeados y matches existentes. Acepta `?game=League+of+Legends` para filtrar.

## Variables de entorno

Ver `.env.local` — necesitás completar: `DISCORD_CLIENT_ID/SECRET`, `MONGODB_URI`, `NEXTAUTH_SECRET`, `CLOUDINARY_*`, `RIOT_API_KEY`, `HENRIK_API_KEY`.

## Pendiente de implementar

1. **Onboarding** (`(app)/onboarding/`): formulario multi-step (edad, bio, fotos → Riot account → juegos/rangos → preferencias)
2. **Riot API integration** (`src/lib/riot/`): verificar cuenta y traer rangos de LoL (API oficial) y Valorant (Henrik Dev API)
3. **Subida de fotos** con Cloudinary (`next-cloudinary`)
4. **Chat real** con Pusher o Ably (cuando haya presupuesto/usuarios suficientes)
5. **Grupos/LFG** completo
6. **Edición de perfil** completa
