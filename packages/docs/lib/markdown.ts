import { promises as fs } from 'node:fs'
import path from 'node:path'
import GithubSlugger from 'github-slugger'
import { type Element, type Text } from 'hast'
import { compileMDX } from 'next-mdx-remote/rsc'
import { cache } from 'react'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeCodeTitles from 'rehype-code-titles'
import rehypeKatex from 'rehype-katex'
import rehypePrism from 'rehype-prism-plus'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import { type Node } from 'unist'
import { visit } from 'unist-util-visit'

import { components } from '@/lib/components'
import { defaultLocale, type Locale } from '@/lib/i18n'
import { PageRoutes } from '@/lib/pageroutes'
import { GitHubLink } from '@/settings/navigation'
import { Settings } from '@/types/settings'

declare module 'hast' {
  interface Element {
    raw?: string
  }
}

interface MdxHeaders {
  title: string
  description: string
  keywords: string
}

async function parseMdx<Frontmatter>(rawMdx: string) {
  return await compileMDX<Frontmatter>({
    source: rawMdx,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        rehypePlugins: [
          preCopy,
          rehypeCodeTitles,
          rehypeKatex,
          rehypePrism,
          rehypeSlug,
          rehypeAutolinkHeadings,
          postCopy,
        ],
        remarkPlugins: [remarkGfm],
      },
    },
    components,
  })
}

const documentPath = (slug: string) => {
  return Settings.gitload
    ? `${GitHubLink.href}/raw/main/contents/docs/${slug}/index.mdx`
    : path.join(process.cwd(), '/contents/docs/', `${slug}/index.mdx`)
}

const localizedDocumentPath = (slug: string, locale: Locale) => {
  if (locale === defaultLocale) return documentPath(slug)

  return Settings.gitload
    ? `${GitHubLink.href}/raw/main/contents/i18n/${locale}/docs/${slug}/index.mdx`
    : path.join(process.cwd(), '/contents/i18n/', locale, '/docs/', `${slug}/index.mdx`)
}

const getDocumentPath = (() => {
  const cache = new Map<string, string>()

  return (slug: string) => {
    if (!cache.has(slug)) {
      cache.set(slug, documentPath(slug))
    }
    return cache.get(slug)!
  }
})()

async function readDocumentFile(slug: string, locale: Locale) {
  const localizedPath = localizedDocumentPath(slug, locale)

  if (Settings.gitload) {
    if (locale !== defaultLocale) {
      const localizedResponse = await fetch(localizedPath)
      if (localizedResponse.ok) {
        return {
          mdx: await localizedResponse.text(),
          lastUpdated: localizedResponse.headers.get('Last-Modified') ?? null,
        }
      }
    }

    const response = await fetch(documentPath(slug))

    if (!response.ok) {
      throw new Error(`Failed to fetch content`)
    }

    return {
      mdx: await response.text(),
      lastUpdated: response.headers.get('Last-Modified') ?? null,
    }
  }

  if (locale !== defaultLocale) {
    try {
      const mdx = await fs.readFile(localizedPath, 'utf-8')
      const stats = await fs.stat(localizedPath)
      return { mdx, lastUpdated: stats.mtime.toISOString() }
    } catch {}
  }

  const contentPath = documentPath(slug)
  const mdx = await fs.readFile(contentPath, 'utf-8')
  const stats = await fs.stat(contentPath)
  return { mdx, lastUpdated: stats.mtime.toISOString() }
}

export const getDocument = cache(async (slug: string, locale: Locale = defaultLocale) => {
  try {
    const { mdx, lastUpdated } = await readDocumentFile(slug, locale)

    const parsedMdx = await parseMdx<MdxHeaders>(mdx)
    const tocs = await getTable(slug, locale)

    return {
      frontmatter: parsedMdx.frontmatter,
      content: parsedMdx.content,
      tocs,
      lastUpdated,
    }
  } catch (err) {
    console.error(err)
    return null
  }
})

const headingsRegex = /^(#{2,4})\s(.+)$/gm

export async function getTable(
  slug: string,
  locale: Locale = defaultLocale
): Promise<{ level: number; text: string; href: string }[]> {
  const extractedHeadings: {
    level: number
    text: string
    href: string
  }[] = []

  let mdx = ''
  try {
    mdx = (await readDocumentFile(slug, locale)).mdx
  } catch (error) {
    console.error('Error reading document headings:', error)
    return []
  }

  headingsRegex.lastIndex = 0
  const slugger = new GithubSlugger()

  let match = headingsRegex.exec(mdx)

  while (match !== null) {
    const level = match[1].length
    const text = match[2].trim()

    extractedHeadings.push({
      level,
      text,
      href: `#${slugger.slug(text)}`,
    })

    match = headingsRegex.exec(mdx)
  }

  return extractedHeadings
}

const pathIndexMap = new Map(PageRoutes.map((route, index) => [route.href, index]))

export function getPreviousNext(path: string) {
  const index = pathIndexMap.get(`/${path}`)

  if (index === undefined || index === -1) {
    return { prev: null, next: null }
  }

  const prev = index > 0 ? PageRoutes[index - 1] : null
  const next = index < PageRoutes.length - 1 ? PageRoutes[index + 1] : null

  return { prev, next }
}

const preCopy = () => (tree: Node) => {
  visit(tree, 'element', (node: Element) => {
    if (node.tagName === 'pre') {
      const [codeEl] = node.children as Element[]
      if (codeEl?.tagName === 'code') {
        const textNode = codeEl.children?.[0] as Text
        node.raw = textNode?.value || ''
      }
    }
  })
}

const postCopy = () => (tree: Node) => {
  visit(tree, 'element', (node: Element) => {
    if (node.tagName === 'pre' && node.raw) {
      node.properties = node.properties || {}
      node.properties.raw = node.raw
    }
  })
}
