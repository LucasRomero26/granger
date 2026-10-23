import { existsSync } from 'node:fs'
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import type { Plugin, ResolvedConfig } from 'vite'
import {
  DEFAULT_SITE_URL,
  FEATURES,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_PATH,
  OG_IMAGE_WIDTH,
  PAGES,
  SITE_NAME,
  absoluteUrl,
  alternateOgLocale,
  buildJsonLd,
  ogLocale,
  type PageKey,
  type PageMeta,
} from '../src/seo/pages.ts'

/**
 * SEO for a client-rendered SPA:
 *
 * - `vite build`: writes one HTML file per route (dist/auth/login/index.html,
 *   dist/404.html, ...) with its own <title>, meta description, canonical,
 *   Open Graph/Twitter tags, JSON-LD and a static <h1> + intro inside #root,
 *   so view-source shows real content. React replaces #root when it mounts.
 *   Also emits robots.txt, sitemap.xml and llms.txt, and fails the build if
 *   any source map ends up in dist.
 * - `vite` (dev): renders the same head/body for the requested URL and serves
 *   the generated text files from memory.
 */

const LANG = 'en'
const HEAD_START = '<!-- seo:start -->'
const HEAD_END = '<!-- seo:end -->'
const ROOT_EMPTY = '<div id="root"></div>'

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const outputFile = (page: PageMeta) =>
  page.file ?? (page.path === '/' ? 'index.html' : `${page.path.slice(1)}/index.html`)

function renderHead(page: PageMeta, siteUrl: string): string {
  const meta = page[LANG]
  const url = absoluteUrl(siteUrl, page.path)
  const image = absoluteUrl(siteUrl, OG_IMAGE_PATH)
  const imageAlt = `${SITE_NAME}: plan projects, ship on time`
  const jsonLd = JSON.stringify(buildJsonLd(page, LANG, siteUrl)).replace(/</g, '\\u003c')
  const lines = [
    `<title>${escapeHtml(meta.title)}</title>`,
    `<meta name="description" content="${escapeHtml(meta.description)}" />`,
    `<meta name="robots" content="${page.indexable ? 'index, follow' : 'noindex, nofollow'}" />`,
    page.canonical === false ? '' : `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:title" content="${escapeHtml(meta.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(meta.description)}" />`,
    page.canonical === false ? '' : `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:type" content="image/png" />`,
    `<meta property="og:image:width" content="${OG_IMAGE_WIDTH}" />`,
    `<meta property="og:image:height" content="${OG_IMAGE_HEIGHT}" />`,
    `<meta property="og:image:alt" content="${escapeHtml(imageAlt)}" />`,
    `<meta property="og:locale" content="${ogLocale(LANG)}" />`,
    `<meta property="og:locale:alternate" content="${alternateOgLocale(LANG)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(meta.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(meta.description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    `<meta name="twitter:image:alt" content="${escapeHtml(imageAlt)}" />`,
    `<script type="application/ld+json" id="structured-data">${jsonLd}</script>`,
  ]
  return lines.filter(Boolean).join('\n    ')
}

function renderBody(key: PageKey, page: PageMeta): string {
  const meta = page[LANG]
  const link = (href: string, label: string, className: string) =>
    `<a href="${href}" class="${className}">${escapeHtml(label)}</a>`
  const button =
    'inline-flex rounded-xl bg-navy px-5 py-2.5 text-sm font-semibold text-navy-fg shadow-soft transition hover:bg-navy-soft'
  const secondary =
    'inline-flex rounded-xl border border-glass-border bg-frost px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-glass'

  let extra = ''
  if (key === 'home') {
    extra = `
        <h2 class="mt-12 font-display text-xl font-semibold text-ink">Features</h2>
        <ul class="mt-4 grid gap-3 sm:grid-cols-2">
          ${FEATURES[LANG].map((f) => `<li class="rounded-xl border border-glass-border bg-frost px-4 py-3 text-ink shadow-soft">${escapeHtml(f)}</li>`).join('\n          ')}
        </ul>`
  }
  const actions =
    key === 'notFound'
      ? [link('/', 'Back to my projects', button), link('/auth/login', 'Sign in', secondary)]
      : [link('/auth/register', 'Create a free account', button), link('/auth/login', 'Sign in', secondary)]

  return `<div id="root">
      <div class="flex min-h-dvh flex-col bg-mist text-ink">
        <header class="border-b border-glass-border bg-frost">
          <div class="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
            <a href="/" class="flex items-center gap-2.5 font-display text-xl font-bold tracking-[-0.02em] text-ink">
              <img src="/logo-dark-64.webp" alt="Granger logo" width="36" height="36" />
              ${SITE_NAME}
            </a>
            <nav aria-label="Main">
              <ul class="flex items-center gap-5 text-sm font-semibold">
                <li><a href="/auth/login" class="text-ink hover:text-accent">${escapeHtml(PAGES.login[LANG].label)}</a></li>
                <li><a href="/auth/register" class="text-accent hover:underline">${escapeHtml(PAGES.register[LANG].label)}</a></li>
              </ul>
            </nav>
          </div>
        </header>
        <main class="mx-auto w-full max-w-5xl flex-1 px-6 py-16">
          ${key === 'notFound' ? '<p class="font-display text-6xl font-bold text-accent">404</p>' : ''}
          <h1 class="page-title">${escapeHtml(meta.heading)}</h1>
          <p class="page-subtitle">${escapeHtml(meta.intro)}</p>
          <div class="mt-8 flex flex-wrap gap-3">${actions.join('')}</div>${extra}
        </main>
        <footer class="py-6 text-center text-sm text-muted">&copy; ${new Date().getFullYear()} ${SITE_NAME}</footer>
      </div>
    </div>
    <noscript>${SITE_NAME} needs JavaScript enabled to run.</noscript>`
}

function renderPage(template: string, key: PageKey, siteUrl: string): string {
  const page: PageMeta = PAGES[key]
  const start = template.indexOf(HEAD_START)
  const end = template.indexOf(HEAD_END)
  if (start === -1 || end === -1 || !template.includes(ROOT_EMPTY)) {
    throw new Error(`[seo] index.html must contain "${HEAD_START}", "${HEAD_END}" and "${ROOT_EMPTY}"`)
  }
  return (
    template.slice(0, start) +
    renderHead(page, siteUrl) +
    template.slice(end + HEAD_END.length)
  )
    .replace(/<html lang="[^"]*">/, `<html lang="${LANG}">`)
    .replace(ROOT_EMPTY, renderBody(key, page))
}

const indexablePages = () =>
  (Object.values(PAGES) as PageMeta[]).filter((page) => page.indexable)

function robotsTxt(siteUrl: string): string {
  return [
    'User-agent: *',
    'Allow: /',
    'Disallow: /projects/',
    'Disallow: /profile',
    'Disallow: /auth/oauth-success',
    'Disallow: /app-shell.html',
    '',
    `Sitemap: ${absoluteUrl(siteUrl, '/sitemap.xml')}`,
    '',
  ].join('\n')
}

function sitemapXml(siteUrl: string): string {
  const lastmod = new Date().toISOString().slice(0, 10)
  const urls = indexablePages().map(
    (page) => `  <url>
    <loc>${absoluteUrl(siteUrl, page.path)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.path === '/' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${page.path === '/' ? '1.0' : '0.6'}</priority>
  </url>`,
  )
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`
}

function llmsTxt(siteUrl: string): string {
  const pages = indexablePages().map(
    (page) => `- [${page[LANG].label}](${absoluteUrl(siteUrl, page.path)}): ${page[LANG].description}`,
  )
  return `# ${SITE_NAME}

> ${PAGES.home[LANG].description}

${SITE_NAME} is a web application for project management. Teams create projects, break them into tasks, move tasks across a Kanban board (Pending, On Hold, In Progress, Under Review, Completed), attach notes to tasks and invite collaborators. The project manager can edit the project and its team; collaborators can work on tasks. The interface is available in English and Spanish.

## Features

${FEATURES[LANG].map((f) => `- ${f}`).join('\n')}

## Public pages

${pages.join('\n')}

## Notes for AI agents

- Project boards, tasks, notes and profiles are private and require signing in; they are not publicly crawlable.

## Optional

- [Sitemap](${absoluteUrl(siteUrl, '/sitemap.xml')})
- [Source code](https://github.com/LucasRomero26/granger)
`
}

/** Files emitted at the site root, by name. */
const textFiles = (siteUrl: string): Record<string, string> => ({
  'robots.txt': robotsTxt(siteUrl),
  'sitemap.xml': sitemapXml(siteUrl),
  'llms.txt': llmsTxt(siteUrl),
  'llm.txt': llmsTxt(siteUrl),
})

/** Page served for a request path in dev; mirrors the vercel.json/nginx routing. */
function pageForPath(pathname: string): PageKey {
  const clean = pathname.replace(/\/+$/, '') || '/'
  const entry = (Object.entries(PAGES) as [PageKey, PageMeta][]).find(
    ([, page]) => page.prerender && !page.file && page.path === clean,
  )
  if (entry) return entry[0]
  if (/^\/projects\/[^/]+(\/(edit|team))?$/.test(clean)) return 'project'
  return 'notFound'
}

async function findSourceMaps(dir: string): Promise<string[]> {
  const found: string[] = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) found.push(...(await findSourceMaps(full)))
    else if (entry.name.endsWith('.map')) found.push(full)
    else if (/\.(js|css)$/.test(entry.name) && /\/[/*][#@] sourceMappingURL=/.test(await readFile(full, 'utf8'))) {
      found.push(full)
    }
  }
  return found
}

export default function seo(): Plugin {
  let config: ResolvedConfig
  let siteUrl = DEFAULT_SITE_URL

  return {
    name: 'granger-seo',

    configResolved(resolved) {
      config = resolved
      siteUrl = (resolved.env.VITE_SITE_URL as string | undefined) || DEFAULT_SITE_URL
    },

    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const name = req.url?.split('?')[0].slice(1) ?? ''
        const body = textFiles(siteUrl)[name]
        if (!body) return next()
        res.setHeader('Content-Type', name.endsWith('.xml') ? 'application/xml' : 'text/plain; charset=utf-8')
        res.end(body)
      })
    },

    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        if (config.command !== 'serve') return html
        const pathname = (ctx.originalUrl ?? ctx.path).split('?')[0]
        return renderPage(html, pageForPath(pathname), siteUrl)
      },
    },

    async closeBundle() {
      if (config.command !== 'build' || config.build.ssr) return
      const outDir = path.resolve(config.root, config.build.outDir)
      const templatePath = path.join(outDir, 'index.html')
      if (!existsSync(templatePath)) return

      const maps = await findSourceMaps(outDir)
      if (maps.length) {
        throw new Error(`[seo] Source maps must not be published:\n${maps.join('\n')}`)
      }

      const template = await readFile(templatePath, 'utf8')
      for (const [key, page] of Object.entries(PAGES) as [PageKey, PageMeta][]) {
        if (!page.prerender) continue
        const file = path.join(outDir, outputFile(page))
        await mkdir(path.dirname(file), { recursive: true })
        await writeFile(file, renderPage(template, key, siteUrl))
      }
      for (const [name, body] of Object.entries(textFiles(siteUrl))) {
        await writeFile(path.join(outDir, name), body)
      }
    },
  }
}
