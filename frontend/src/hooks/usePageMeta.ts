import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useLanguage } from '@/hooks/useLanguage'
import {
  DEFAULT_SITE_URL,
  PAGES,
  SITE_NAME,
  absoluteUrl,
  alternateOgLocale,
  buildJsonLd,
  ogLocale,
  type PageKey,
  type PageMeta,
} from '@/seo/pages'

const SITE_URL = import.meta.env.VITE_SITE_URL || DEFAULT_SITE_URL

type PageMetaOptions = {
  /** Record shown on the page (e.g. the project name) to make the title unique. */
  subject?: string
  description?: string
}

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.content = content
}

function setCanonical(href: string | null) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!href) {
    el?.remove()
    return
  }
  if (!el) {
    el = document.createElement('link')
    el.rel = 'canonical'
    document.head.appendChild(el)
  }
  el.href = href
}

function setJsonLd(data: Record<string, unknown>) {
  let el = document.getElementById('structured-data') as HTMLScriptElement | null
  if (!el) {
    el = document.createElement('script')
    el.type = 'application/ld+json'
    el.id = 'structured-data'
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(data)
}

/**
 * Keeps the document head (title, description, canonical, Open Graph, robots
 * and JSON-LD) in sync with the current page and language. The build writes
 * the same tags into each prerendered HTML file (see plugins/seo.ts).
 */
export function usePageMeta(key: PageKey, { subject, description }: PageMetaOptions = {}) {
  const { lang } = useLanguage()
  const { pathname } = useLocation()

  useEffect(() => {
    const page: PageMeta = PAGES[key]
    const meta = page[lang]
    const title = !subject
      ? meta.title
      : key === 'project'
        ? `${subject} | ${SITE_NAME}`
        : `${meta.label}: ${subject} | ${SITE_NAME}`
    const desc = description?.trim() || meta.description
    const dynamic = page.path.includes(':')
    const url = absoluteUrl(SITE_URL, dynamic ? pathname : page.path)
    const canonical = dynamic || page.canonical !== false ? url : null

    document.title = title
    setMeta('name', 'description', desc)
    setMeta('name', 'robots', page.indexable ? 'index, follow' : 'noindex, nofollow')
    setCanonical(canonical)
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', desc)
    setMeta('property', 'og:url', url)
    setMeta('property', 'og:locale', ogLocale(lang))
    setMeta('property', 'og:locale:alternate', alternateOgLocale(lang))
    setMeta('name', 'twitter:title', title)
    setMeta('name', 'twitter:description', desc)
    setJsonLd(buildJsonLd(page, lang, SITE_URL, { title, description: desc, url }))
  }, [key, subject, description, lang, pathname])
}
