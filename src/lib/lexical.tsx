import React from 'react'

/**
 * Minimaler, defensiver Renderer für Payload-Lexical-richText.
 * Deckt die im Redaktionsalltag genutzten Knoten ab: Absätze, Überschriften,
 * Listen, Zitate, Links, Zeilenumbrüche und Text-Formatierung (fett/kursiv).
 * Unbekannte Knoten werden übersprungen, nie geworfen.
 */

interface LexicalNode {
  type?: string
  tag?: string
  text?: string
  format?: number | string
  listType?: string
  url?: string
  fields?: { url?: string; newTab?: boolean }
  children?: LexicalNode[]
}

interface LexicalRoot {
  root?: { children?: LexicalNode[] }
}

const FORMAT_BOLD = 1
const FORMAT_ITALIC = 2

/** Prüft, ob ein richText-Feld echten Textinhalt hat (für „Sektion nur zeigen wenn befüllt"). */
export function hasLexicalContent(value: unknown): boolean {
  return lexicalToPlainText(value).trim().length > 0
}

/** Extrahiert reinen Text (z.B. für Meta-Descriptions). */
export function lexicalToPlainText(value: unknown): string {
  const data = value as LexicalRoot | null
  const children = data?.root?.children
  if (!Array.isArray(children)) return ''
  const walk = (nodes: LexicalNode[]): string =>
    nodes
      .map((n) => (n.text ?? '') + (n.children ? walk(n.children) : ''))
      .join(' ')
  return walk(children).replace(/\s+/g, ' ').trim()
}

function renderText(node: LexicalNode, key: number): React.ReactNode {
  let el: React.ReactNode = node.text ?? ''
  const fmt = typeof node.format === 'number' ? node.format : 0
  if (fmt & FORMAT_BOLD) el = <strong key={`b${key}`}>{el}</strong>
  if (fmt & FORMAT_ITALIC) el = <em key={`i${key}`}>{el}</em>
  return <React.Fragment key={key}>{el}</React.Fragment>
}

function renderChildren(nodes: LexicalNode[] | undefined): React.ReactNode {
  if (!nodes) return null
  return nodes.map((n, i) => renderNode(n, i))
}

function renderNode(node: LexicalNode, key: number): React.ReactNode {
  switch (node.type) {
    case 'text':
      return renderText(node, key)
    case 'linebreak':
      return <br key={key} />
    case 'paragraph':
      return <p key={key} className="mb-3 leading-relaxed">{renderChildren(node.children)}</p>
    case 'heading': {
      const cls = 'font-semibold text-[var(--color-medizin-navy)] mt-4 mb-2'
      if (node.tag === 'h3') return <h3 key={key} className={`text-base ${cls}`}>{renderChildren(node.children)}</h3>
      return <h3 key={key} className={`text-lg ${cls}`}>{renderChildren(node.children)}</h3>
    }
    case 'list': {
      const cls = 'mb-3 pl-5 space-y-1'
      return node.listType === 'number'
        ? <ol key={key} className={`list-decimal ${cls}`}>{renderChildren(node.children)}</ol>
        : <ul key={key} className={`list-disc ${cls}`}>{renderChildren(node.children)}</ul>
    }
    case 'listitem':
      return <li key={key} className="leading-relaxed">{renderChildren(node.children)}</li>
    case 'quote':
      return <blockquote key={key} className="border-l-2 border-[var(--color-border)] pl-4 italic text-[var(--color-muted)] mb-3">{renderChildren(node.children)}</blockquote>
    case 'link': {
      const raw = node.fields?.url ?? node.url ?? '#'
      // Nur sichere Protokolle zulassen (kein javascript:/data: — XSS-Schutz)
      const safe = /^(https?:\/\/|mailto:|tel:|\/|#)/i.test(raw)
      const href = safe ? raw : '#'
      const external = /^https?:\/\//.test(href)
      return (
        <a key={key} href={href} className="text-[var(--color-donau-blau)] underline"
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
          {renderChildren(node.children)}
        </a>
      )
    }
    default:
      // Unbekannter Knoten — Kinder dennoch rendern, falls vorhanden
      return node.children ? <React.Fragment key={key}>{renderChildren(node.children)}</React.Fragment> : null
  }
}

/** Server-Component-tauglicher richText-Renderer. */
export function RichText({ value, className }: { value: unknown; className?: string }) {
  const data = value as LexicalRoot | null
  const children = data?.root?.children
  if (!Array.isArray(children) || children.length === 0) return null
  return <div className={`text-sm text-[var(--color-muted)] ${className ?? ''}`}>{renderChildren(children)}</div>
}
