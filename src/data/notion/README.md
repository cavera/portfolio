# Notion data layer

**Status: not wired up.** Nothing in `src/` imports from this folder yet. The
front-end currently reads hardcoded content from `src/data/portfolio.ts`.

This is kept deliberately, not by accident. It is the working reference for the
Notion REST shape — property names, block types, the auth header, the revalidate
window — and it is where the CMS re-attach gets built. See `docs/CMS.md` for the
target schema and the plan.

## What's here

| File | What it is |
| --- | --- |
| `client.ts` | Raw fetch wrappers: `getElements()`, `getPageInfo(id)`, `getPageContent(id)`. Falls back to the fixtures on any error. |
| `fixtures/mockList.json` | Real captured response of a `databases/{id}/query` call — 54 pages. |
| `fixtures/mockCard.json` | Real captured response of a single `pages/{id}` call. |
| `fixtures/mockCardContent.json` | Real captured response of a `blocks/{id}/children` call. |

The fixtures are captured from the live database in 2023, so the image URLs in
them are expired S3 links. They are useful for the *shape*, not the content.

## What was removed alongside this, and where to find it

The redesign deleted the code that consumed this client. When rebuilding, pull
these back out of git history rather than rewriting them:

```
git show 431569a^:src/data/mapData.ts                    # property -> UI mapper
git show 431569a^:src/app/portfolio/[id]/blockMap.tsx    # Notion blocks -> React
git show 431569a^:src/app/portfolio/[id]/page.tsx        # project detail route
```

`blockMap.tsx` in particular already handles paragraph, embed, image,
link_preview and video blocks — that is most of a case-study body renderer.

## Environment

```
NOTION_TOKEN=secret_...      # server-side only, never NEXT_PUBLIC_
NOTION_DATABASE_ID=...       # renamed from NEXT_PUBLIC_DATABASE_ID
```

The database id used to be `NEXT_PUBLIC_DATABASE_ID`, which shipped it to the
browser for no reason — the query only ever runs server-side. If the old name is
still set in the Vercel project, add the new one before wiring this up.
