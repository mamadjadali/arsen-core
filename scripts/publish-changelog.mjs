#!/usr/bin/env node
/**
 * Publish a bilingual changelog to doc.m140.ir, then bump package.json patch.
 *
 * Usage:
 *   node scripts/publish-changelog.mjs \
 *     --title-fa "..." --title-en "..." \
 *     --desc-fa "..." --desc-en "..." \
 *     --labels api,improve,prod
 *
 * Env:
 *   CHANGELOG_PUBLISH_API_KEY (required; from .env)
 *
 * Version bumping is done by the agent BEFORE push (see Cursor rule).
 * Pass --bump-after only if you want this script to patch-bump after a successful publish.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

function loadDotEnv() {
  const envPath = resolve(root, '.env')
  if (!existsSync(envPath)) return
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq <= 0) continue
    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (!(key in process.env)) process.env[key] = value
  }
}

function parseArgs(argv) {
  const out = { labels: [] }
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    const next = argv[i + 1]
    const take = () => {
      i++
      return next
    }
    if (arg === '--title-fa') out.titleFa = take()
    else if (arg === '--title-en') out.titleEn = take()
    else if (arg === '--desc-fa') out.descFa = take()
    else if (arg === '--desc-en') out.descEn = take()
    else if (arg === '--labels') {
      out.labels = String(take() || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    } else if (arg === '--version') out.version = take()
    else if (arg === '--dry-run') out.dryRun = true
    else if (arg === '--bump-after') out.bumpAfter = true
  }
  return out
}

function bumpPatch(version) {
  const parts = String(version).trim().split('.').map((n) => Number(n))
  if (parts.length !== 3 || parts.some((n) => !Number.isFinite(n))) {
    throw new Error(`Invalid semver in package.json: ${version}`)
  }
  parts[2] += 1
  return parts.join('.')
}

loadDotEnv()
const args = parseArgs(process.argv.slice(2))
const config = JSON.parse(readFileSync(resolve(root, '.cursor/changelog-config.json'), 'utf8'))
const pkgPath = resolve(root, 'package.json')
const statePath = resolve(root, '.cursor/changelog-state.json')
const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
const apiKey = process.env.CHANGELOG_PUBLISH_API_KEY

if (!apiKey) {
  console.error('Missing CHANGELOG_PUBLISH_API_KEY in env / .env')
  process.exit(1)
}
if (!args.titleFa?.trim() || !args.descFa?.trim()) {
  console.error('Required: --title-fa and --desc-fa')
  process.exit(1)
}
if (!args.titleEn?.trim() || !args.descEn?.trim()) {
  console.error('Required for this project: --title-en and --desc-en')
  process.exit(1)
}

const version = (args.version || pkg.version || '').trim()
if (!version) {
  console.error('No version in package.json')
  process.exit(1)
}

const labelIds = []
for (const key of args.labels) {
  const entry = config.labels[key]
  if (!entry?.id) {
    console.error(`Unknown label slug: ${key}`)
    console.error(`Known: ${Object.keys(config.labels).join(', ')}`)
    process.exit(1)
  }
  labelIds.push(entry.id)
}

const body = {
  projectId: config.projectId,
  version,
  title: { fa: args.titleFa.trim(), en: args.titleEn.trim() },
  description: { fa: args.descFa.trim(), en: args.descEn.trim() },
  publishedAt: new Date().toISOString(),
}
if (labelIds.length) body.labelIds = labelIds

if (args.dryRun) {
  console.log(JSON.stringify({ endpoint: config.endpoint, body }, null, 2))
  process.exit(0)
}

const res = await fetch(config.endpoint, {
  method: 'POST',
  headers: {
    'content-type': 'application/json',
    'x-api-key': apiKey,
  },
  body: JSON.stringify(body),
})

const text = await res.text()
let json
try {
  json = JSON.parse(text)
} catch {
  json = { ok: false, message: text }
}

if (!res.ok || json?.ok === false) {
  console.error('Changelog publish failed:', res.status, json?.message || text)
  process.exit(1)
}

console.log('Changelog published:', JSON.stringify(json, null, 2))

let nextVersion = version
if (args.bumpAfter) {
  nextVersion = bumpPatch(version)
  pkg.version = nextVersion
  writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`)
  console.log(`Bumped package.json version ${version} → ${nextVersion}`)
}

writeFileSync(
  statePath,
  `${JSON.stringify(
    {
      lastPublishedVersion: version,
      lastPublishedAt: body.publishedAt,
      nextVersion,
    },
    null,
    2,
  )}\n`,
)
