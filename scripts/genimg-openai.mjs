// Generate an image with OpenAI's image API (gpt-image-1, falls back to dall-e-3).
// Usage: node scripts/genimg-openai.mjs "<prompt>" <output-path> [size]
// Requires env var OPENAI_API_KEY.

import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'

const API_KEY = process.env.OPENAI_API_KEY
const prompt = process.argv[2]
const outPath = process.argv[3]
const size = process.argv[4] || '1536x1024' // landscape

if (!API_KEY) {
  console.error('ERROR: OPENAI_API_KEY env var is not set.')
  process.exit(1)
}
if (!prompt || !outPath) {
  console.error('Usage: node scripts/genimg-openai.mjs "<prompt>" <output-path> [size]')
  process.exit(1)
}

async function generate(model, sizeArg) {
  const body = { model, prompt, size: sizeArg, n: 1 }
  if (model === 'dall-e-3') body.response_format = 'b64_json'
  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${API_KEY}` },
    body: JSON.stringify(body),
  })
  return res
}

let res = await generate('gpt-image-1', size)

// Fall back to dall-e-3 if gpt-image-1 is unavailable (e.g. org not verified).
if (!res.ok) {
  const errText = await res.text()
  if (res.status === 403 || res.status === 404 || /verif|not have access|must be verified/i.test(errText)) {
    console.error('gpt-image-1 unavailable, falling back to dall-e-3…')
    const dalleSize = size === '1536x1024' ? '1792x1024' : size === '1024x1536' ? '1024x1792' : '1024x1024'
    res = await generate('dall-e-3', dalleSize)
  } else {
    console.error(`API error ${res.status}:`, errText)
    process.exit(1)
  }
}

if (!res.ok) {
  console.error(`API error ${res.status}:`, await res.text())
  process.exit(1)
}

const data = await res.json()
const b64 = data?.data?.[0]?.b64_json
if (!b64) {
  console.error('No image returned. Response:', JSON.stringify(data).slice(0, 800))
  process.exit(1)
}

mkdirSync(dirname(outPath), { recursive: true })
writeFileSync(outPath, Buffer.from(b64, 'base64'))
console.log('✓ wrote', outPath)
