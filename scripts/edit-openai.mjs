// Recolor / edit an image with OpenAI's image edit API (gpt-image-1).
// Usage: node scripts/edit-openai.mjs <base-image> "<prompt>" <output-path> [size]
// Requires env var OPENAI_API_KEY.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'

const API_KEY = process.env.OPENAI_API_KEY
const base = process.argv[2]
const prompt = process.argv[3]
const outPath = process.argv[4]
const size = process.argv[5] || '1024x1024'

if (!API_KEY) { console.error('ERROR: OPENAI_API_KEY not set.'); process.exit(1) }
if (!base || !prompt || !outPath) {
  console.error('Usage: node scripts/edit-openai.mjs <base-image> "<prompt>" <output-path> [size]')
  process.exit(1)
}

const fd = new FormData()
fd.append('model', 'gpt-image-1')
fd.append('prompt', prompt)
fd.append('size', size)
fd.append('image', new Blob([readFileSync(base)], { type: 'image/png' }), 'base.png')

const res = await fetch('https://api.openai.com/v1/images/edits', {
  method: 'POST',
  headers: { Authorization: `Bearer ${API_KEY}` },
  body: fd,
})

if (!res.ok) { console.error(`API error ${res.status}:`, await res.text()); process.exit(1) }

const data = await res.json()
const b64 = data?.data?.[0]?.b64_json
if (!b64) { console.error('No image returned:', JSON.stringify(data).slice(0, 800)); process.exit(1) }

mkdirSync(dirname(outPath), { recursive: true })
writeFileSync(outPath, Buffer.from(b64, 'base64'))
console.log('✓ wrote', outPath)
