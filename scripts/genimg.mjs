// Generate an image with Google's Gemini image model ("Nano Banana").
// Usage: node scripts/genimg.mjs "<prompt>" <output-path> [aspectRatio]
// Requires env var GEMINI_API_KEY.

import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'

const API_KEY = process.env.GEMINI_API_KEY
const prompt = process.argv[2]
const outPath = process.argv[3]
const aspect = process.argv[4] || '16:9'

if (!API_KEY) {
  console.error('ERROR: GEMINI_API_KEY env var is not set.')
  process.exit(1)
}
if (!prompt || !outPath) {
  console.error('Usage: node scripts/genimg.mjs "<prompt>" <output-path> [aspectRatio]')
  process.exit(1)
}

const model = 'gemini-2.5-flash-image'
const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`

const body = {
  contents: [{ parts: [{ text: prompt }] }],
  generationConfig: { imageConfig: { aspectRatio: aspect } },
}

const res = await fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
})

if (!res.ok) {
  console.error(`API error ${res.status}:`, await res.text())
  process.exit(1)
}

const data = await res.json()
const parts = data?.candidates?.[0]?.content?.parts || []
const inline = parts.find((p) => p.inlineData)?.inlineData?.data
if (!inline) {
  console.error('No image returned. Response:', JSON.stringify(data).slice(0, 800))
  process.exit(1)
}

mkdirSync(dirname(outPath), { recursive: true })
writeFileSync(outPath, Buffer.from(inline, 'base64'))
console.log('✓ wrote', outPath)
