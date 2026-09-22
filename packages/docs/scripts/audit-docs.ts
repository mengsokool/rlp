import { promises as fs } from 'node:fs'
import path from 'node:path'

import { PageRoutes } from '../lib/pageroutes'

const root = process.cwd()
const englishRoot = path.join(root, 'contents/docs')
const thaiRoot = path.join(root, 'contents/i18n/th/docs')
const publicRoot = path.join(root, 'public')

async function walk(directory: string, suffix?: string): Promise<string[]> {
  const entries = await fs.readdir(directory, { withFileTypes: true })
  const files = await Promise.all(
    entries.map(async (entry) => {
      const absolute = path.join(directory, entry.name)
      if (entry.isDirectory()) return walk(absolute, suffix)
      return !suffix || entry.name.endsWith(suffix) ? [absolute] : []
    })
  )
  return files.flat()
}

function routeFromFile(file: string, contentRoot: string) {
  const relative = path.relative(contentRoot, file).replaceAll(path.sep, '/')
  return relative === 'index.mdx' ? '/' : `/${relative.replace(/\/index\.mdx$/, '')}`
}

function fail(messages: string[]): never {
  for (const message of messages) console.error(`- ${message}`)
  process.exit(1)
}

const englishFiles = await walk(englishRoot, '.mdx')
const thaiFiles = await walk(thaiRoot, '.mdx')
const englishRoutes = new Map(englishFiles.map((file) => [routeFromFile(file, englishRoot), file]))
const thaiRoutes = new Map(thaiFiles.map((file) => [routeFromFile(file, thaiRoot), file]))
const navigationRoutes = new Set(PageRoutes.map((route) => route.href))
const errors: string[] = []

for (const route of navigationRoutes) {
  if (!englishRoutes.has(route)) errors.push(`TOC route has no English page: ${route}`)
  if (!thaiRoutes.has(route)) errors.push(`TOC route has no Thai page: ${route}`)
}

for (const route of englishRoutes.keys()) {
  if (route !== '/' && !navigationRoutes.has(route))
    errors.push(`English page is orphaned: ${route}`)
  if (!thaiRoutes.has(route)) errors.push(`English page has no Thai peer: ${route}`)
}

for (const route of thaiRoutes.keys()) {
  if (route !== '/' && !navigationRoutes.has(route)) errors.push(`Thai page is orphaned: ${route}`)
  if (!englishRoutes.has(route)) errors.push(`Thai page has no English peer: ${route}`)
}

const allFiles = [
  ...englishFiles.map((file) => ({ file, locale: 'en' as const })),
  ...thaiFiles.map((file) => ({ file, locale: 'th' as const })),
]
const referencedImages = new Set<string>()

for (const { file, locale } of allFiles) {
  const source = await fs.readFile(file, 'utf8')
  const relative = path.relative(root, file)
  const frontmatter = source.match(/^---\n([\s\S]*?)\n---/)?.[1]
  if (
    !frontmatter ||
    !/^title:\s*.+$/m.test(frontmatter) ||
    !/^description:\s*.+$/m.test(frontmatter)
  ) {
    errors.push(`Missing title or description frontmatter: ${relative}`)
  }

  for (const match of source.matchAll(/\]\((\/(?:th\/)?docs(?:\/[^)#\s]*)?)(?:#[^)\s]+)?\)/g)) {
    const href = match[1]
    const normalized = href.replace(/^\/th\/docs/, '').replace(/^\/docs/, '') || '/'
    if (!englishRoutes.has(normalized)) errors.push(`Broken local link in ${relative}: ${href}`)
  }

  for (const match of source.matchAll(/(?:src=["']|!\[[^\]]*\]\()(\/images\/[^"')\s]+)/g)) {
    const imageHref = match[1]
    referencedImages.add(imageHref)
    try {
      await fs.access(path.join(publicRoot, imageHref.replace(/^\//, '')))
    } catch {
      errors.push(`Missing image in ${relative}: ${imageHref}`)
    }
  }

  const expectedScreenshotLocale = `/images/v0.2/${locale}/`
  const wrongScreenshotLocale = locale === 'en' ? '/images/v0.2/th/' : '/images/v0.2/en/'
  if (source.includes(wrongScreenshotLocale)) {
    errors.push(`Wrong-locale screenshot in ${relative}; expected ${expectedScreenshotLocale}`)
  }
}

const screenshots = await walk(path.join(publicRoot, 'images/v0.2'))
for (const screenshot of screenshots) {
  const href = `/${path.relative(publicRoot, screenshot).replaceAll(path.sep, '/')}`
  if (!referencedImages.has(href)) errors.push(`Unreferenced v0.2 screenshot: ${href}`)
}

if (errors.length > 0) fail(errors)

console.log(
  `Documentation audit passed: ` +
    navigationRoutes.size +
    ` routes, ` +
    englishFiles.length +
    ` English files, ` +
    thaiFiles.length +
    ` Thai files, ` +
    screenshots.length +
    ` screenshots.`
)
