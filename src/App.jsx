import { useState, useRef } from 'react'
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
} from 'motion/react'
import './App.css'
import { cartUrl, VARIANTS, CARE_VARIANT, shopifyConfigured } from './lib/shopify'

/* ---------- product imagery (AliExpress CDN) ---------- */
const ae = (hash) => `https://ae01.alicdn.com/kf/${hash}.jpg`
const IMG = {
  gold: ae('Scad630702f354901808d834c71ea01a76'),   // gold set + lifestyle
  yellow: ae('Sa96c32b9b70b4de9bcbee9b6b802a8c5y'),  // yellow set
  purple: ae('S14b2b4287e9840488d031f1cd816e533J'),  // purple set
  gray: ae('S5ae9170a5c604eb2b5eebf6cc9d43872O'),    // gray detail
  detail: ae('S5c768bdf6b834df0b8187796701e4be10'),  // foam / construction detail
}

/* ---------- commerce config ---------- */
const BASE_PRICE = 60
const PROTECTION_PRICE = 5

const BUNDLES = [
  { qty: 1, price: 60, label: '1 Set', sub: 'Mat · Pillow · Bag' },
  { qty: 2, price: 105, label: '2 Sets', sub: 'One to share', tag: 'Most popular' },
  { qty: 3, price: 155, label: '3 Sets', sub: 'The whole house', tag: 'Best value' },
]
// each colour swaps the product photo
const COLORS = [
  { name: 'Gold', hex: '#c9a13b', img: IMG.gold },
  { name: 'Purple', hex: '#7c4dcf', img: IMG.purple },
  { name: 'Yellow', hex: '#f3c40f', img: IMG.yellow },
  { name: 'Gray', hex: '#9b9b9b', img: IMG.gray },
]
const money = (n) => `$${n}`

/* ---------- original copy ---------- */
const BENEFITS = [
  { n: '01', title: 'Wind down faster', img: IMG.purple, body: 'A few quiet minutes on the mat before bed helps your body shift out of go-mode. Many people find it the easiest way to signal "the day is done."' },
  { n: '02', title: 'Ease everyday tension', img: IMG.yellow, body: 'The thousands of contact points spread gentle pressure across your back and shoulders — a simple way to loosen the tightness that builds up from sitting all day.' },
  { n: '03', title: 'A pocket of calm', img: IMG.gray, body: 'No app, no appointment, no subscription. Roll it out, lie back, and give yourself ten unhurried minutes whenever you need to reset.' },
]
const FEATURES = [
  { title: 'Thoughtfully shaped points', img: IMG.detail, body: 'Each disc is moulded to spread pressure evenly, so the sensation is firm and grounding rather than sharp. It softens within a minute or two of lying down.' },
  { title: 'Made to last', img: IMG.gray, body: 'A dense foam core that keeps its shape and a removable cover you can refresh between uses. Built to be a fixture of your routine, not a one-week novelty.' },
  { title: 'Your pace, your pressure', img: IMG.gold, body: 'Start over a light layer, work up to skin contact, and choose how long you stay. The mat meets you wherever you are today.' },
]
const REVIEWS = [
  { t: 'My new evening ritual', b: 'I keep it next to the bed now. Ten minutes with the lights low and I actually feel my shoulders drop.', who: 'Maya R.' },
  { t: 'Better than I expected', b: 'The first minute is a surprise, then it just turns into warmth. I look forward to it after long days at the desk.', who: 'Daniel K.' },
  { t: 'Simple and it works', b: 'No gadgets, nothing to charge. I roll it out, breathe, and get off feeling lighter every time.', who: 'Priya S.' },
  { t: 'Great little reset', b: 'I use it before stretching in the morning. It wakes my back up without feeling harsh.', who: 'Tom A.' },
  { t: 'Calmer nights', b: 'I am not promising miracles, but I fall asleep faster on the days I use it. That is enough for me.', who: 'Leah M.' },
  { t: 'Lovely to come home to', b: 'It became the thing that tells my brain the workday is over. Quietly one of my favourite buys this year.', who: 'Chris D.' },
]
const FAQS = [
  { q: 'What comes in the box?', a: 'Every Acuroot order is an all-in-1 set: the acupressure mat, a matching neck pillow, and a carry bag to keep it tidy or take it with you.' },
  { q: 'Does it hurt?', a: 'The first moment can feel intense, but for most people it settles into a warm, tingling sensation within a minute or two. You are in full control of how long you stay and whether you use a layer of clothing.' },
  { q: 'How long should I use it?', a: 'Ten to twenty minutes is a comfortable starting point. Begin with a t-shirt between you and the mat, and move to direct contact as you get used to the feeling.' },
  { q: 'What does the protection plan cover?', a: 'Acuroot Care is an optional $5 add-on that covers accidental damage and manufacturing faults for the first 30 days, with a free replacement if anything goes wrong. Totally optional, and you can add it at checkout.' },
]

/* ---------- motion helpers ---------- */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } }

function Section({ children, id, className = '' }) {
  return (
    <motion.section id={id} className={`section ${className}`} variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
      {children}
    </motion.section>
  )
}
function Stars({ n = 5 }) {
  return <span className="stars" aria-label={`${n} stars`}>{'★★★★★'.slice(0, n)}</span>
}

/* ---------- shared store ---------- */
function useStore() {
  const [qty, setQty] = useState(1)
  const [color, setColor] = useState(COLORS[0])
  const [protect, setProtect] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const bundle = BUNDLES.find((b) => b.qty === qty)
  const fullPrice = BASE_PRICE * qty
  const saving = fullPrice - bundle.price
  const total = bundle.price + (protect ? PROTECTION_PRICE : 0)

  const checkout = () => {
    const variantId = VARIANTS[`${color.name}-${qty}`]
    if (!variantId) {
      alert('Sorry — that option is unavailable. Please pick another.')
      return
    }
    const lines = [{ variantId, quantity: 1 }]
    if (protect) lines.push({ variantId: CARE_VARIANT, quantity: 1 })
    setLoading(true)
    window.location.href = cartUrl(lines)
  }

  return { qty, setQty, color, setColor, protect, setProtect, modalOpen, setModalOpen, loading, bundle, fullPrice, saving, total, checkout }
}

/* ---------- brand / logo ---------- */
function LogoMark({ size = 32, idle = true }) {
  const uid = 'acuroot-logo'
  return (
    <motion.svg
      className="logo-mark"
      width={size}
      height={size}
      viewBox="0 0 100 100"
      whileHover={{ rotate: -6, scale: 1.06 }}
      transition={{ type: 'spring', stiffness: 320, damping: 14 }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={uid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#c98c5d" />
          <stop offset="0.5" stopColor="#b06a40" />
          <stop offset="1" stopColor="#8c4e2c" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="92" height="92" rx="27" fill={`url(#${uid})`} />
      <g fill="none" stroke="#fdf7f0" strokeWidth="8.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M33 75 50 30 67 75" />
        <path d="M40 58h20" />
      </g>
      <motion.path
        d="M50 31c5-7 13-8 18.5-5.2-2.2 7-10 10.2-16 7.4"
        fill="#e7d4a0"
        style={{ originX: '50px', originY: '31px' }}
        animate={idle ? { rotate: [0, -7, 0] } : undefined}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.svg>
  )
}

function Logo({ size = 32 }) {
  return (
    <span className="brand">
      <LogoMark size={size} />
      <span className="logo-word">Acuroot<sup className="tm">™</sup></span>
    </span>
  )
}

/* ---------- sections ---------- */
const NAV_LINKS = [
  ['#benefits', 'Benefits'],
  ['#story', 'Our story'],
  ['#reviews', 'Loved by'],
  ['#faq', 'FAQ'],
]

function Nav() {
  const [open, setOpen] = useState(false)
  return (
    <motion.header className="nav" initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, ease: 'easeOut' }}>
      <div className="wrap nav-inner">
        <a href="#top" className="logo" aria-label="Acuroot home"><Logo /></a>
        <nav className="nav-links">
          {NAV_LINKS.map(([href, label]) => (
            <a key={href} href={href} className="nav-link">{label}</a>
          ))}
        </nav>
        <div className="nav-right">
          <motion.a href="#buy" className="btn btn-sm shop-now" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Shop now</motion.a>
          <button
            className={`nav-toggle ${open ? 'open' : ''}`}
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            className="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="wrap mobile-menu-inner">
              {NAV_LINKS.map(([href, label], i) => (
                <motion.a
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.05 }}
                >
                  {label}
                </motion.a>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

function Hero({ store }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const artY = useTransform(scrollYProgress, [0, 1], [0, -60])
  const artScale = useTransform(scrollYProgress, [0, 1], [1, 1.04])

  // pointer-driven 3D tilt on the product card
  const tiltX = useMotionValue(0)
  const tiltY = useMotionValue(0)
  const rotX = useSpring(tiltX, { stiffness: 160, damping: 18 })
  const rotY = useSpring(tiltY, { stiffness: 160, damping: 18 })
  const onArtMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    tiltY.set(px * 16)
    tiltX.set(-py * 16)
  }
  const onArtLeave = () => {
    tiltX.set(0)
    tiltY.set(0)
  }

  return (
    <section className="hero" id="top" ref={ref}>
      <div className="hero-aura" aria-hidden="true" />
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <motion.span className="eyebrow" variants={fadeUp} initial="hidden" animate="show">The all-in-1 calm kit</motion.span>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
            Rest your back into <span className="grad-text">stillness</span>
          </motion.h1>
          <motion.p className="lead" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25, duration: 0.6 }}>
            One set, three pieces — <b>mat, pillow and carry bag</b>. A simple way to unwind,
            soften tension and feel grounded again in ten unhurried minutes.
          </motion.p>
          <motion.div className="hero-cta" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }}>
            <motion.a href="#buy" className="btn btn-lg hero-shop" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>Shop the set — from {money(BASE_PRICE)}</motion.a>
            <motion.a href="#benefits" className="btn btn-ghost" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>How it feels →</motion.a>
          </motion.div>
          <div className="hero-trust"><Stars /> <span>Rated 4.9 / 5 by our early customers</span></div>
        </div>

        <motion.div
          className="hero-art"
          style={{ y: artY, scale: artScale }}
          initial={{ opacity: 0, rotate: -3 }}
          animate={{ opacity: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 120, damping: 16 }}
          onMouseMove={onArtMove}
          onMouseLeave={onArtLeave}
        >
          <motion.div
            className="hero-art-inner"
            style={{ rotateX: rotX, rotateY: rotY, transformPerspective: 1000 }}
            animate={{ y: [0, -16, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <AnimatePresence initial={false}>
              <motion.img
                key={store.color.img}
                src={store.color.img}
                alt={`Acuroot set in ${store.color.name}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              />
            </AnimatePresence>
          </motion.div>
          <motion.div className="float-badge badge-1" animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>🌙 Easier evenings</motion.div>
          <motion.div className="float-badge badge-2" animate={{ y: [0, 12, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}>🍃 {store.color.name}</motion.div>
        </motion.div>
      </div>
    </section>
  )
}

function Marquee() {
  const items = ['ROLL IT OUT', 'BREATHE', 'TEN QUIET MINUTES', 'SOFTEN TENSION', 'NO APPS · NO BATTERIES', 'COME BACK TO CALM']
  const row = [...items, ...items]
  return (
    <div className="marquee">
      <motion.div className="marquee-track" animate={{ x: ['0%', '-50%'] }} transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}>
        {row.map((t, i) => <span key={i} className="marquee-item">{t}<i>✦</i></span>)}
      </motion.div>
    </div>
  )
}

function Benefits() {
  return (
    <Section id="benefits">
      <div className="wrap">
        <motion.div className="section-head" variants={fadeUp}><span className="eyebrow">Why people keep coming back</span><h2>Ten minutes. One calmer you.</h2></motion.div>
        <div className="cards">
          {BENEFITS.map((b) => (
            <motion.article key={b.n} className="card" variants={fadeUp} whileHover={{ y: -10 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
              <div className="card-img"><img src={b.img} alt={b.title} loading="lazy" /><span className="card-n">{b.n}</span></div>
              <h3>{b.title}</h3><p>{b.body}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </Section>
  )
}

function Story() {
  return (
    <Section id="story" className="story">
      <div className="wrap story-grid">
        <motion.div className="story-img" variants={fadeUp}><img src={IMG.gold} alt="The Acuroot set" loading="lazy" /></motion.div>
        <motion.div className="story-copy" variants={fadeUp}>
          <span className="eyebrow">Our story</span>
          <h2>Made for the moment you finally slow down</h2>
          <p>We started Acuroot around one small idea: that resting should be easy to reach for.<b className="grad-text"> No screens, no steps — just a mat and a breath.</b></p>
          <p className="muted">Every order is an all-in-1 set — mat, pillow and bag — designed to live somewhere you will actually use it. Roll it out and the rest takes care of itself.</p>
          <motion.a href="#buy" className="btn" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Bring one home</motion.a>
        </motion.div>
      </div>
    </Section>
  )
}

function Reviews() {
  return (
    <Section id="reviews">
      <div className="wrap">
        <motion.div className="section-head" variants={fadeUp}><span className="eyebrow">Loved by early customers</span><h2>Quiet moments, in their <span className="grad-text">own words</span></h2></motion.div>
        <div className="reviews">
          {REVIEWS.map((r, i) => (
            <motion.blockquote key={i} className="review" variants={fadeUp} whileHover={{ y: -6, scale: 1.01 }}>
              <Stars /><strong>{r.t}</strong><p>{r.b}</p><cite>— {r.who}</cite>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </Section>
  )
}

function Features() {
  return (
    <Section id="features">
      <div className="wrap">
        <motion.div className="section-head" variants={fadeUp}><span className="eyebrow">What is in the set</span><h2>Considered, where it counts</h2></motion.div>
        <div className="features">
          {FEATURES.map((f, i) => (
            <motion.div key={f.title} className={`feature ${i % 2 ? 'reverse' : ''}`} variants={fadeUp}>
              <motion.div className="feature-img" whileHover={{ scale: 1.03 }}><img src={f.img} alt={f.title} loading="lazy" /></motion.div>
              <div className="feature-copy"><span className="feature-n grad-text">{i + 1}</span><h3>{f.title}</h3><p>{f.body}</p></div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  )
}

/* ---------- buy ---------- */
function Buy({ store }) {
  const { qty, setQty, color, setColor, bundle, fullPrice, saving, setModalOpen } = store
  return (
    <Section id="buy" className="buy">
      <div className="wrap buy-grid">
        <motion.div className="buy-media" variants={fadeUp}>
          <div className="buy-art">
            <AnimatePresence initial={false}>
              <motion.img
                key={color.img}
                src={color.img}
                alt={`Acuroot set in ${color.name}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            </AnimatePresence>
            <span className="buy-art-tag">{color.name}</span>
          </div>
          <div className="thumbs">
            {COLORS.map((c) => (
              <button
                key={c.name}
                className={`thumb ${color.name === c.name ? 'selected' : ''}`}
                onClick={() => setColor(c)}
                aria-label={c.name}
                title={c.name}
              >
                <img src={c.img} alt={c.name} loading="lazy" />
                <span className="thumb-dot" style={{ background: c.hex }} />
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div className="buy-copy" variants={fadeUp}>
          <span className="eyebrow">All-in-1 bundle · mat + pillow + bag</span>
          <h2>The Acuroot Set</h2>
          <div className="price-row">
            <span className="price">{money(bundle.price)}</span>
            {saving > 0 && <span className="was">{money(fullPrice)}</span>}
            {saving > 0 && <span className="save-pill">Save {money(saving)}</span>}
          </div>

          <div className="opt-label">Choose your bundle</div>
          <div className="bundles">
            {BUNDLES.map((b) => (
              <button key={b.qty} className={`bundle ${qty === b.qty ? 'selected' : ''}`} onClick={() => setQty(b.qty)}>
                {b.tag && <span className="bundle-tag">{b.tag}</span>}
                <strong>{b.label}</strong>
                <span className="bundle-price">{money(b.price)}</span>
                <span className="bundle-sub">{b.sub}</span>
              </button>
            ))}
          </div>

          <div className="opt-label">Colour — <b>{color.name}</b></div>
          <div className="swatches">
            {COLORS.map((c) => (
              <button key={c.name} className={`swatch ${color.name === c.name ? 'selected' : ''}`} style={{ background: c.hex }} onClick={() => setColor(c)} title={c.name} aria-label={c.name} />
            ))}
          </div>

          <ul className="perks">
            <li>✔ Mat, pillow &amp; carry bag</li>
            <li>✔ 4 colourways</li>
            <li>✔ Free shipping over $60</li>
            <li>✔ 30-day happiness guarantee</li>
          </ul>

          <motion.button className="btn btn-lg" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => setModalOpen(true)}>
            Add to cart — {money(bundle.price)}
          </motion.button>
          {!shopifyConfigured && <p className="demo-note">Demo mode · connect Shopify in <code>.env</code> to enable real checkout</p>}
        </motion.div>
      </div>
    </Section>
  )
}

/* ---------- checkout modal ---------- */
function CheckoutModal({ store }) {
  const { modalOpen, setModalOpen, bundle, color, saving, protect, setProtect, total, loading, checkout } = store
  return (
    <AnimatePresence>
      {modalOpen && (
        <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModalOpen(false)}>
          <motion.div className="modal" initial={{ opacity: 0, y: 40, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 30, scale: 0.97 }} transition={{ type: 'spring', stiffness: 260, damping: 24 }} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModalOpen(false)} aria-label="Close">×</button>
            <span className="eyebrow">One last thing</span>
            <h3 className="modal-title">Protect your calm for just $5?</h3>
            <p className="modal-sub">Add <b>Acuroot Care</b> and we’ll cover accidental damage or faults for your first <b>30 days</b> — a free replacement, no questions asked.</p>

            <button className={`care ${protect ? 'on' : ''}`} onClick={() => setProtect(!protect)}>
              <span className={`care-check ${protect ? 'on' : ''}`}>{protect ? '✓' : ''}</span>
              <span className="care-text"><strong>Acuroot Care — 30-day protection</strong><small>Accidental damage + warranty · free replacement</small></span>
              <span className="care-price">+${PROTECTION_PRICE}</span>
            </button>

            <div className="summary">
              <div className="summary-row"><span>{bundle.label} · {color.name}</span><span>{money(bundle.price)}</span></div>
              {saving > 0 && <div className="summary-row muted"><span>Bundle saving</span><span>−{money(saving)}</span></div>}
              {protect && <div className="summary-row"><span>Acuroot Care (30-day)</span><span>+{money(PROTECTION_PRICE)}</span></div>}
              <div className="summary-row total"><span>Total</span><span>{money(total)}</span></div>
            </div>

            <motion.button className="btn btn-lg modal-cta" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={checkout} disabled={loading}>
              {loading ? 'Opening checkout…' : `Continue to checkout — ${money(total)}`}
            </motion.button>
            <button className="modal-skip" onClick={checkout} disabled={loading}>No thanks, continue without protection</button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Faq() {
  const [open, setOpen] = useState(0)
  return (
    <Section id="faq" className="faq">
      <div className="wrap faq-wrap">
        <motion.div className="section-head" variants={fadeUp}><span className="eyebrow">Good to know</span><h2>Questions, answered</h2></motion.div>
        <div className="faq-list">
          {FAQS.map((f, i) => {
            const isOpen = open === i
            return (
              <motion.div key={i} className="faq-item" variants={fadeUp}>
                <button className="faq-q" onClick={() => setOpen(isOpen ? -1 : i)}><span>{f.q}</span><motion.span className="faq-icon" animate={{ rotate: isOpen ? 45 : 0 }}>+</motion.span></button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div className="faq-a" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
                      <p>{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </Section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <a href="#top" className="logo"><Logo size={34} /></a>
        <p className="muted">A calmer ten minutes a day.</p>
        <div className="footer-links"><a href="#benefits">Benefits</a><a href="#story">Our story</a><a href="#reviews">Loved by</a><a href="#faq">FAQ</a></div>
        <small className="muted">© {new Date().getFullYear()} Acuroot. This product is a wellness aid and is not intended to diagnose or treat any condition.</small>
      </div>
    </footer>
  )
}

export default function App() {
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  const store = useStore()
  return (
    <>
      <motion.div className="scroll-bar" style={{ scaleX: progress }} />
      <Nav />
      <Hero store={store} />
      <Marquee />
      <Benefits />
      <Story />
      <Reviews />
      <Features />
      <Buy store={store} />
      <Faq />
      <Footer />
      <CheckoutModal store={store} />
    </>
  )
}
