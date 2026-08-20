type LexicalNode = {
  type?: string
  tag?: string
  text?: string
  children?: LexicalNode[]
  [key: string]: unknown
}

type LexicalState = {
  root?: LexicalNode
  [key: string]: unknown
}

function walkText(node: LexicalNode | undefined, parts: string[]): void {
  if (!node) return

  if (node.type === 'text' && typeof node.text === 'string') {
    parts.push(node.text)
    return
  }

  if (node.type === 'linebreak') {
    parts.push('\n')
    return
  }

  if (node.fields && typeof node.fields === 'object') {
    walkUnknown(node.fields, parts)
  }

  if (Array.isArray(node.children)) {
    const blockTypes = new Set([
      'paragraph',
      'heading',
      'quote',
      'list',
      'listitem',
      'blockquote',
    ])
    for (const child of node.children) {
      walkText(child, parts)
    }
    if (node.type && blockTypes.has(node.type)) {
      parts.push('\n\n')
    }
  }
}

function walkUnknown(value: unknown, parts: string[]): void {
  if (value == null) return
  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (trimmed) parts.push(trimmed)
    return
  }
  if (typeof value !== 'object') return
  const maybeRoot = (value as LexicalState).root
  if (maybeRoot && typeof maybeRoot === 'object' && Array.isArray(maybeRoot.children)) {
    walkText(maybeRoot, parts)
    return
  }
  if (Array.isArray(value)) {
    for (const item of value) walkUnknown(item, parts)
    return
  }
  for (const child of Object.values(value as Record<string, unknown>)) {
    walkUnknown(child, parts)
  }
}

/** Extract readable plain text from Lexical SerializedEditorState. */
export function lexicalToPlainText(value: unknown): string {
  if (!value || typeof value !== 'object') return ''
  const state = value as LexicalState
  const parts: string[] = []
  walkText(state.root, parts)
  return parts.join('').replace(/\n{3,}/g, '\n\n').trim()
}

function textNode(text: string): LexicalNode {
  return {
    type: 'text',
    detail: 0,
    format: 0,
    mode: 'normal',
    style: '',
    text,
    version: 1,
  }
}

function paragraphNode(text: string): LexicalNode {
  return {
    type: 'paragraph',
    format: '',
    indent: 0,
    version: 1,
    children: text ? [textNode(text)] : [],
    direction: null,
    textFormat: 0,
    textStyle: '',
  }
}

function headingNode(tag: 'h1' | 'h2' | 'h3' | 'h4', text: string): LexicalNode {
  return {
    type: 'heading',
    tag,
    format: '',
    indent: 0,
    version: 1,
    children: text ? [textNode(text)] : [],
    direction: null,
  }
}

/**
 * Convert markdown/plain AI output into a minimal Lexical document
 * (paragraphs + h1–h4 headings).
 */
export function plainTextToLexical(markdown: string): LexicalState {
  const lines = markdown.replace(/\r\n/g, '\n').trim().split('\n')
  const children: LexicalNode[] = []
  let paragraphBuf: string[] = []

  const flushParagraph = () => {
    const text = paragraphBuf.join('\n').trim()
    paragraphBuf = []
    if (text) children.push(paragraphNode(text))
  }

  for (const raw of lines) {
    const line = raw.trimEnd()
    const headingMatch = /^(#{1,4})\s+(.*)$/.exec(line.trim())

    if (headingMatch) {
      flushParagraph()
      const level = headingMatch[1].length as 1 | 2 | 3 | 4
      const tag = (`h${level}` as 'h1' | 'h2' | 'h3' | 'h4')
      children.push(headingNode(tag, headingMatch[2].trim()))
      continue
    }

    if (line.trim() === '') {
      flushParagraph()
      continue
    }

    paragraphBuf.push(line)
  }

  flushParagraph()

  if (children.length === 0) {
    children.push(paragraphNode(''))
  }

  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      children,
      direction: null,
    },
  }
}
