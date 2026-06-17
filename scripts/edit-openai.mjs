// Edit/generate an image with OpenAI's image edit API (gpt-image-1), using one or
// more reference images. Usage:
//   node scripts/edit-openai.mjs <ref1,ref2,...> "<prompt>" <output-path> [size]
// Requires env var OPENAI_API_KEY.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, extname } from 'node:path'

const API_KEY = process.env.OPENAI_API_KEY
const bases = (process.argv[2] || '').split(',').map((s) => s.trim()).filter(Boolean)
const prompt = process.argv[3]
const outPath = process.argv[4]
const size = process.argv[5] || '1024x1024'

if (!API_KEY) { console.error('ERROR: OPENAI_API_KEY not set.'); process.exit(1) }
if (!bases.length || !prompt || !outPath) {
  console.error('Usage: node scripts/edit-openai.mjs <ref1,ref2,...> "<prompt>" <output-path> [size]')
  process.exit(1)
}

const mime = (p) => (extname(p).toLowerCase() === '.png' ? 'image/png' : extname(p).toLowerCase() === '.webp' ? 'image/webp' : 'image/jpeg')

const fd = new FormData()
fd.append('model', 'gpt-image-1')
fd.append('prompt', prompt)
fd.append('size', size)
for (const b of bases) {
  fd.append('image[]', new Blob([readFileSync(b)], { type: mime(b) }), 'ref' + extname(b))
}

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
