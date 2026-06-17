import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import './studio.css'

/* ------------------------------------------------------------------ */
/*  Tiny deterministic RNG so a given URL always yields the same page  */
/* ------------------------------------------------------------------ */

function makeRng(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return () => {
    h += 0x6d2b79f5
    let t = h
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const titleCase = (s) =>
  s.replace(/\w\S*/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase())

const GRADIENTS = [
  'linear-gradient(135deg, #8b5cff, #22d3ee)',
  'linear-gradient(135deg, #3b82f6, #8b5cff)',
  'linear-gradient(135deg, #22d3ee, #38e08a)',
  'linear-gradient(135deg, #f472b6, #8b5cff)',
  'linear-gradient(135deg, #fb923c, #f472b6)',
]

const REVIEW_POOL = [
  { name: 'Jordan M.', text: 'Exactly as described and shipped fast. Already ordered a second one.' },
  { name: 'Priya S.', text: 'Honestly didn’t expect this quality for the price. Worth every penny.' },
  { name: 'Marcus T.', text: 'Solved a problem I’ve had for years. Wish I’d bought it sooner.' },
  { name: 'Lena K.', text: 'Gifted one to my mum and now the whole family wants one.' },
  { name: 'Chris D.', text: 'Setup took two minutes. Works perfectly, looks great on the counter.' },
  { name: 'Amara O.', text: 'Five stars. Customer service was lovely when I had a question too.' },
]

/* Build a full product page object from a URL. */
function generateProduct(url) {
  const clean = url.split('?')[0].replace(/\/+$/, '')
  const slug = clean.split('/').pop() || 'product'
  const words = slug
    .replace(/\.(html?|php|aspx)$/i, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\d{4,}\b/g, '')
    .trim()
  const title = titleCase(words || 'Your New Product')

  const rng = makeRng(url || 'seed')
  const price = 19 + Math.floor(rng() * 9) * 5 // 19, 24, ... 59
  const compareAt = price + 20 + Math.floor(rng() * 8) * 5
  const rating = (4.5 + rng() * 0.4).toFixed(1)
  const reviewCount = 320 + Math.floor(rng() * 4200)
  const sold = 1200 + Math.floor(rng() * 28000)
  const gallery = [0, 1, 2, 3].map(
    (i) => GRADIENTS[Math.floor(rng() * GRADIENTS.length + i) % GRADIENTS.length]
  )
  const reviews = [...REVIEW_POOL]
    .sort(() => rng() - 0.5)
    .slice(0, 3)
    .map((r) => ({ ...r, stars: 5 - (rng() < 0.2 ? 1 : 0) }))

  return {
    title,
    slug: slug || 'product',
    headline: `${title} — the upgrade you didn’t know you needed`,
    subhead: `The ${title.toLowerCase()} thousands of happy customers swear by. Built to save you time, last for years, and impress everyone who sees it.`,
    price,
    compareAt,
    rating,
    reviewCount,
    sold,
    gallery,
    bullets: [
      'Solves a real, everyday frustration — fast',
      'Premium build quality designed to last for years',
      `Loved by ${reviewCount.toLocaleString()}+ verified buyers`,
      'Ships free with a 30-day money-back guarantee',
    ],
    reviews,
  }
}

const STEPS = [
  'Scraping product details…',
  'Writing high-converting copy…',
  'Enhancing & cleaning images…',
  'Assembling your page…',
]

/* ------------------------------------------------------------------ */
/*  Studio                                                             */
/* ------------------------------------------------------------------ */

export default function Studio() {
  const initialUrl = useMemo(() => {
    const q = window.location.hash.split('?')[1] || ''
    return new URLSearchParams(q).get('u') || ''
  }, [])

  const [url, setUrl] = useState(initialUrl)
  const [status, setStatus] = useState('idle') // idle | generating | done
  const [step, setStep] = useState(0)
  const [product, setProduct] = useState(null)
  const [device, setDevice] = useState('desktop')
  const [activeImg, setActiveImg] = useState(0)
  const [published, setPublished] = useState(false)
  const timers = useRef([])

  const clearTimers = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }

  const runGenerate = (target) => {
    const value = (target ?? url).trim()
    if (!value) return
    clearTimers()
    setPublished(false)
    setProduct(null)
    setActiveImg(0)
    setStatus('generating')
    setStep(0)
    STEPS.forEach((_, i) => {
      timers.current.push(setTimeout(() => setStep(i), i * 620))
    })
    timers.current.push(
      setTimeout(() => {
        setProduct(generateProduct(value))
        setStatus('done')
      }, STEPS.length * 620 + 350)
    )
  }

  // auto-generate if we arrived from the landing page with a URL
  useEffect(() => {
    // defer one tick so we don't setState synchronously inside the effect
    if (initialUrl) {
      const t = setTimeout(() => runGenerate(initialUrl), 0)
      timers.current.push(t)
    }
    return clearTimers
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const edit = (key, val) => setProduct((p) => ({ ...p, [key]: val }))
  const discount =
    product && product.compareAt > product.price
      ? Math.round((1 - product.price / product.compareAt) * 100)
      : 0

  return (
    <div className="studio">
      {/* top bar */}
      <header className="st-bar">
        <a href="#top" className="logo logo-sm" aria-label="Zooicha home">
          <svg width="26" height="26" viewBox="0 0 64 64" aria-hidden="true">
            <defs>
              <linearGradient id="sg" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
                <stop stopColor="#8b5cff" />
                <stop offset="0.5" stopColor="#3b82f6" />
                <stop offset="1" stopColor="#22d3ee" />
              </linearGradient>
            </defs>
            <rect x="4" y="4" width="56" height="56" rx="16" fill="url(#sg)" />
            <path d="M21 22h22l-22 20h22" stroke="#07070d" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
          <span>zooicha <em className="st-tag">studio</em></span>
        </a>
        <div className="st-bar-actions">
          {status === 'done' && (
            <div className="st-device" role="group" aria-label="Preview device">
              <button className={device === 'desktop' ? 'on' : ''} onClick={() => setDevice('desktop')}>
                Desktop
              </button>
              <button className={device === 'mobile' ? 'on' : ''} onClick={() => setDevice('mobile')}>
                Mobile
              </button>
            </div>
          )}
          <a href="#top" className="btn btn-ghost btn-sm">← Back to site</a>
        </div>
      </header>

      {/* URL bar */}
      <div className="st-input-row">
        <div className="st-input-wrap">
          <span aria-hidden="true">🔗</span>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && runGenerate()}
            placeholder="Paste a product URL — AliExpress, Amazon, TikTok Shop, Temu…"
            aria-label="Product URL"
          />
        </div>
        <button
          className="btn btn-primary"
          onClick={() => runGenerate()}
          disabled={status === 'generating' || !url.trim()}
        >
          {status === 'generating' ? 'Generating…' : product ? 'Regenerate ✦' : 'Generate ✦'}
        </button>
      </div>

      {/* stage */}
      <div className="st-stage">
        <AnimatePresence mode="wait">
          {status === 'idle' && (
            <motion.div
              key="empty"
              className="st-empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="st-empty-icon">✦</div>
              <h2>Paste a product link to begin</h2>
              <p>
                Zooicha will scrape the product, write conversion copy, polish the images and
                assemble a finished page — in seconds.
              </p>
              <div className="st-examples">
                <span>Try:</span>
                {[
                  'aliexpress.com/item/portable-blender',
                  'amazon.com/dp/posture-corrector-pro',
                  'tiktok.com/shop/galaxy-star-projector',
                ].map((ex) => (
                  <button key={ex} className="st-chip" onClick={() => { setUrl(ex); runGenerate(ex) }}>
                    {ex}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {status === 'generating' && (
            <motion.div
              key="gen"
              className="st-gen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="st-spinner" />
              <ul className="st-steps">
                {STEPS.map((s, i) => (
                  <li key={s} className={i < step ? 'done' : i === step ? 'active' : ''}>
                    <span className="st-step-mark">{i < step ? '✓' : i === step ? '◐' : '○'}</span>
                    {s}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {status === 'done' && product && (
            <motion.div
              key="done"
              className="st-editor"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* edit panel */}
              <aside className="st-panel">
                <h3>Edit your page</h3>
                <label>
                  Product title
                  <input value={product.title} onChange={(e) => edit('title', e.target.value)} />
                </label>
                <label>
                  Hero headline
                  <textarea
                    rows={2}
                    value={product.headline}
                    onChange={(e) => edit('headline', e.target.value)}
                  />
                </label>
                <div className="st-price-row">
                  <label>
                    Price ($)
                    <input
                      type="number"
                      value={product.price}
                      onChange={(e) => edit('price', Number(e.target.value) || 0)}
                    />
                  </label>
                  <label>
                    Compare at ($)
                    <input
                      type="number"
                      value={product.compareAt}
                      onChange={(e) => edit('compareAt', Number(e.target.value) || 0)}
                    />
                  </label>
                </div>
                <p className="st-hint">
                  ✦ Everything is editable — in the real app you’d also tweak copy, swap images and
                  reorder sections by clicking them or just asking.
                </p>
                <button className="btn btn-primary btn-block" onClick={() => setPublished(true)}>
                  Publish page →
                </button>
                {published && (
                  <motion.div
                    className="st-published"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    ✓ Published to <strong>zooicha.site/{product.slug}</strong>
                    <span>and pushed to your Shopify store.</span>
                  </motion.div>
                )}
              </aside>

              {/* live preview */}
              <div className={`st-preview ${device}`}>
                <div className="pp">
                  <div className="pp-top">
                    <div className="pp-gallery">
                      <div className="pp-main" style={{ background: product.gallery[activeImg] }} />
                      <div className="pp-thumbs">
                        {product.gallery.map((g, i) => (
                          <button
                            key={i}
                            className={i === activeImg ? 'on' : ''}
                            style={{ background: g }}
                            onClick={() => setActiveImg(i)}
                            aria-label={`Image ${i + 1}`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="pp-buy">
                      <h1>{product.title}</h1>
                      <div className="pp-rating">
                        <span className="stars">{'★'.repeat(5)}</span>
                        <span>{product.rating} · {product.reviewCount.toLocaleString()} reviews</span>
                      </div>
                      <div className="pp-price">
                        <strong>${product.price}</strong>
                        {discount > 0 && (
                          <>
                            <s>${product.compareAt}</s>
                            <span className="pp-save">{discount}% OFF</span>
                          </>
                        )}
                      </div>
                      <ul className="pp-bullets">
                        {product.bullets.map((b) => (
                          <li key={b}><span className="check">✓</span>{b}</li>
                        ))}
                      </ul>
                      <button className="pp-cart">Add to cart</button>
                      <div className="pp-trust">
                        <span>🔒 Secure checkout</span>
                        <span>🚚 Free shipping</span>
                        <span>↩ 30-day returns</span>
                      </div>
                      <p className="pp-stock">🔥 {product.sold.toLocaleString()} sold — selling fast</p>
                    </div>
                  </div>

                  <div className="pp-hero">
                    <h2>{product.headline}</h2>
                    <p>{product.subhead}</p>
                  </div>

                  <div className="pp-reviews">
                    <h3>What customers say</h3>
                    <div className="pp-review-grid">
                      {product.reviews.map((r) => (
                        <div key={r.name} className="pp-review">
                          <span className="stars">{'★'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}</span>
                          <p>“{r.text}”</p>
                          <strong>{r.name} · Verified buyer</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
