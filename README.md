# Minha Trajetória Profissional

Site estático com meu roadmap de carreira no modelo **carreira em Y**, em formato de fluxograma.

Stack: Vite, React, TypeScript, Tailwind CSS, React Flow (`@xyflow/react`).
Todos os textos ficam em `src/data/career.ts`.

## Rodar local

```bash
npm install
npm run dev
```

Outros comandos:

```bash
npm run build    # checagem de tipos + build de produção em dist/
npm run lint     # ESLint
npm run preview  # serve o build localmente
```

## Deploy na Vercel

1. Suba o projeto para um repositório no GitHub.
2. Na Vercel, clique em **Add New → Project** e importe o repositório.
3. Framework preset: **Vite** (detectado automaticamente). Build command `npm run build`, output `dist`.
4. Não precisa de variáveis de ambiente. Clique em **Deploy**.
