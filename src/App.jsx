import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useScroll, useSpring } from 'motion/react'
import {
  Link2,
  PenLine,
  Wand2,
  Zap,
  FlaskConical,
  TrendingUp,
  Sparkles,
  Check,
  ArrowRight,
  Menu,
  Star,
  AtSign,
  MessageCircle,
  Globe,
} from 'lucide-react'
import './App.css'
import Studio from './Studio.jsx'

/* ------------------------------------------------------------------ */
/*  Small helpers                                                      */
/* ------------------------------------------------------------------ */

function Reveal({ children, delay = 0, y = 18, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

/* A reading-progress bar pinned to the very top of the page. */
function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })
  return <motion.div className="scroll-bar" style={{ scaleX }} aria-hidden="true" />
}

/* Count a number up from 0 once it scrolls into view. */
function Stat({ value, suffix = '', label, decimals = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!inView) return
    let raf
    const start = performance.now()
    const dur = 1400
    const tick = (t) => {
      const p = Math.min(1, (t - start) / dur)
      setN(value * (1 - Math.pow(1 - p, 3))) // easeOutCubic
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, value])

  const shown = decimals ? n.toFixed(decimals) : Math.round(n).toLocaleString()
  return (
    <div ref={ref} className="stat">
      <span className="stat-num">{shown}{suffix}</span>
      <span className="stat-label">{label}</span>
    </div>
  )
}

const Logo = () => (
  <a href="#top" className="logo" aria-label="Zooicha home">
    <svg width="30" height="30" viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id="navg" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8b5cff" />
          <stop offset="0.5" stopColor="#3b82f6" />
          <stop offset="1" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="56" height="56" rx="16" fill="url(#navg)" />
      <path
        d="M21 22h22l-22 20h22"
        stroke="#07070d"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
    <span>zooicha</span>
  </a>
)

/* ------------------------------------------------------------------ */
/*  Animated hero demo — paste a product URL, get a page               */
/* ------------------------------------------------------------------ */

const URLS = [
  'aliexpress.com/item/portable-blender',
  'amazon.com/dp/posture-corrector-pro',
  'tiktok.com/shop/galaxy-star-projector',
  'temu.com/heated-eye-massager',
]

function useTypewriter(phrases, { typeMs = 46, holdMs = 1700, deleteMs = 20 } = {}) {
  const [text, setText] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    let idx = 0
    let char = 0
    let deleting = false
    let timer

    const tick = () => {
      const phrase = phrases[idx]
      if (!deleting) {
        char++
        setText(phrase.slice(0, char))
        setDone(char === phrase.length)
        if (char === phrase.length) {
          deleting = true
          timer = setTimeout(tick, holdMs)
          return
        }
        timer = setTimeout(tick, typeMs)
      } else {
        char--
        setText(phrase.slice(0, char))
        setDone(false)
        if (char === 0) {
          deleting = false
          idx = (idx + 1) % phrases.length
        }
        timer = setTimeout(tick, deleteMs)
      }
    }

    timer = setTimeout(tick, 600)
    return () => clearTimeout(timer)
  }, [phrases, typeMs, holdMs, deleteMs])

  return { text, done }
}

function HeroDemo() {
  const { text, done } = useTypewriter(URLS)

  return (
    <div className="demo">
      <div className="demo-bar">
        <span className="dot" />
        <span className="dot" />
        <span className="dot" />
        <div className="demo-url">zooicha.ai/studio</div>
      </div>

      <div className="demo-body">
        <div className="prompt">
          <span className="prompt-spark" aria-hidden="true">🔗</span>
          <span className="prompt-text">
            {text}
            <span className="caret" />
          </span>
          <span className={`prompt-go ${done ? 'on' : ''}`}>Generate ✦</span>
        </div>

        <div className="build-row">
          <span className={`build-pill ${done ? 'on' : ''}`}>Scraping</span>
          <span className={`build-pill ${done ? 'on' : ''}`} style={{ transitionDelay: '.12s' }}>
            Copywriting
          </span>
          <span className={`build-pill ${done ? 'on' : ''}`} style={{ transitionDelay: '.24s' }}>
            Images
          </span>
          <span className={`build-pill ${done ? 'on' : ''}`} style={{ transitionDelay: '.36s' }}>
            Publishing
          </span>
        </div>

        {/* generated product page preview */}
        <div className={`canvas pdp ${done ? 'on' : ''}`}>
          <div className="pdp-media">
            <span className="pdp-img" />
            <div className="pdp-thumbs">
              <span /><span /><span />
            </div>
          </div>
          <div className="pdp-info">
            <span className="sk-line w80" />
            <div className="pdp-stars">
              <span className="stars">★★★★★</span>
              <em>1,204 reviews</em>
            </div>
            <div className="pdp-price">
              <strong>$39</strong>
              <s>$79</s>
              <span className="pdp-save">50% OFF</span>
            </div>
            <span className="sk-line w90" />
            <span className="sk-line w70" />
            <span className="pdp-cart">Add to cart</span>
            <div className="pdp-badges">
              <span>✓ Free shipping</span>
              <span>✓ 30-day returns</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Content data                                                       */
/* ------------------------------------------------------------------ */

const FEATURES = [
  {
    Icon: Link2,
    title: 'Paste any product URL',
    body: 'Drop a link from AliExpress, Amazon, TikTok Shop or Temu. Zooicha pulls specs, images and reviews and rebuilds them into a page engineered to convert.',
  },
  {
    Icon: PenLine,
    title: 'Copy that actually sells',
    body: 'Conversion-trained AI writes benefit-led headlines, bullets, FAQs and urgency — in 30+ languages, tuned to your product and niche.',
  },
  {
    Icon: Wand2,
    title: 'Built-in AI image studio',
    body: 'Auto-remove busy backgrounds, generate lifestyle shots, and assemble scroll-stopping galleries. No designer and no Photoshop required.',
  },
  {
    Icon: Zap,
    title: '1-click Shopify import',
    body: 'Push a finished page straight into your store as a product or landing page — your theme, fonts and tracking pixels stay intact.',
  },
  {
    Icon: FlaskConical,
    title: 'A/B testing on autopilot',
    body: 'Spin up page variants and let Zooicha route traffic to the winner automatically. Stop guessing which version converts.',
  },
  {
    Icon: TrendingUp,
    title: 'Live winning-product feed',
    body: 'A daily feed of trending, high-margin products with saturation and ad data — so you build pages for proven winners, not duds.',
  },
]

const STATS = [
  { value: 40000, suffix: '+', label: 'Pages built' },
  { value: 30, suffix: 's', label: 'Avg. build time' },
  { value: 32, suffix: '%', label: 'Avg. lift in conversion' },
  { value: 4.9, suffix: '/5', label: 'Average user rating', decimals: 1 },
]

const STEPS = [
  {
    n: '01',
    title: 'Paste a product link',
    body: 'Drop in a URL from any major marketplace — or pick a product straight from your Shopify catalog.',
  },
  {
    n: '02',
    title: 'Zooicha builds the page',
    body: 'In seconds you get a full product page: persuasive copy, clean images, reviews, offers and trust badges.',
  },
  {
    n: '03',
    title: 'Tweak & push live',
    body: 'Edit by clicking or chatting, then publish to Shopify or a hosted Zooicha page in one click.',
  },
]

const COMPARE = [
  { label: 'Time to first page', z: '~30 seconds', p: '~60 seconds', m: 'Hours of work' },
  { label: 'Import sources', z: 'AliExpress, Amazon, TikTok Shop, Temu + more', p: 'AliExpress & Amazon', m: 'Copy/paste by hand' },
  { label: 'AI image studio', z: true, p: 'Limited', m: false },
  { label: 'Built-in A/B testing', z: true, p: false, m: false },
  { label: 'Conversion analytics', z: true, p: false, m: 'Third-party add-ons' },
  { label: 'Free pages to start', z: '5', p: '3', m: '—' },
  { label: 'Starting price', z: '$0', p: '$39 / mo', m: '—' },
]

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    cadence: 'forever',
    tagline: 'For your first product tests.',
    features: ['5 product pages', 'All AI features', 'Hosted preview links', 'Community support'],
    cta: 'Start free',
    featured: false,
  },
  {
    name: 'Growth',
    price: '$29',
    cadence: 'per month',
    tagline: 'For sellers shipping real offers.',
    features: [
      'Unlimited product pages',
      '3 Shopify stores',
      'AI image studio',
      'A/B testing & analytics',
      'Winning-product feed',
    ],
    cta: 'Start 7-day trial',
    featured: true,
  },
  {
    name: 'Scale',
    price: '$79',
    cadence: 'per month',
    tagline: 'For agencies and big catalogs.',
    features: ['Everything in Growth', 'Unlimited stores', 'Team seats & roles', 'API access', 'Dedicated manager'],
    cta: 'Talk to us',
    featured: false,
  },
]

const QUOTES = [
  {
    quote:
      'Paste, generate, publish. I launched 12 product tests in an afternoon and two are already profitable.',
    name: 'Marco Reyes',
    role: 'Dropshipper, 6-figure store',
  },
  {
    quote:
      'Switched from PagePilot — the pages convert better and it’s literally half the price. The A/B testing sealed it.',
    name: 'Hannah Lowe',
    role: 'Founder, Vela Goods',
  },
  {
    quote:
      'The image studio alone replaced our designer for product tests. It just picks the winning page for me.',
    name: 'Daniel Kim',
    role: 'Media buyer',
  },
]

const FAQS = [
  {
    q: 'Where can I import products from?',
    a: 'Any product URL — AliExpress, Amazon, TikTok Shop, Temu — or pick a product straight from your connected Shopify catalog. Zooicha pulls images, specs and reviews automatically.',
  },
  {
    q: 'How is Zooicha better than PagePilot?',
    a: 'Faster generation, a full AI image studio, built-in A/B testing and conversion analytics, and more import sources — all at a lower price with a more generous free plan.',
  },
  {
    q: 'Do I need to know how to design or code?',
    a: 'No. Paste a link and you get a finished, conversion-ready page. Everything is editable by clicking on it or just asking in plain language.',
  },
  {
    q: 'Which stores does it publish to?',
    a: 'One-click import to Shopify (as a product or landing page), or publish to a fast hosted Zooicha page. WooCommerce export is on the way.',
  },
  {
    q: 'Is there really a free plan?',
    a: 'Yes — build and publish up to 5 product pages for free, forever, with no credit card required.',
  },
]

/* ------------------------------------------------------------------ */
/*  Router — toggle between the landing page and the studio            */
/* ------------------------------------------------------------------ */

export default function App() {
  const [route, setRoute] = useState(() => window.location.hash)

  useEffect(() => {
    const onHash = () => {
      setRoute(window.location.hash)
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  return route.startsWith('#/studio') ? <Studio /> : <Landing />
}

/* ------------------------------------------------------------------ */
/*  Landing page                                                       */
/* ------------------------------------------------------------------ */

function Landing() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const ctaInput = useRef(null)

  const goToStudio = (e) => {
    e.preventDefault()
    const v = ctaInput.current?.value.trim()
    window.location.hash = '#/studio' + (v ? `?u=${encodeURIComponent(v)}` : '')
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div id="top">
      <ScrollProgress />

      {/* ---------------- Nav ---------------- */}
      <header className={`nav ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="wrap nav-inner">
          <Logo />
          <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
            <a href="#features" onClick={() => setMenuOpen(false)}>Features</a>
            <a href="#how" onClick={() => setMenuOpen(false)}>How it works</a>
            <a href="#compare" onClick={() => setMenuOpen(false)}>Compare</a>
            <a href="#pricing" onClick={() => setMenuOpen(false)}>Pricing</a>
            <a href="#faq" onClick={() => setMenuOpen(false)}>FAQ</a>
          </nav>
          <div className="nav-cta">
            <a href="#" className="btn btn-ghost">Sign in</a>
            <a href="#/studio" className="btn btn-primary">Build a page free</a>
          </div>
          <button
            className="nav-burger"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      {/* ---------------- Hero ---------------- */}
      <section className="hero">
        <motion.span
          className="blob blob-1"
          aria-hidden="true"
          animate={{ x: [0, 30, 0], y: [0, -24, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.span
          className="blob blob-2"
          aria-hidden="true"
          animate={{ x: [0, -28, 0], y: [0, 20, 0], scale: [1, 1.12, 1] }}
          transition={{ duration: 17, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="wrap hero-inner">
          <Reveal>
            <a href="#/studio" className="badge">
              <Sparkles size={14} /> Built for Shopify &amp; dropshipping — try it free
            </a>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="hero-title">
              Paste a product link.
              <br />
              <span className="grad-text">Get a page that sells.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="hero-sub">
              Zooicha turns any product URL into a high-converting store page — AI copy, polished
              images, reviews and offers — in seconds. Then ships it straight to Shopify in one click.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="hero-actions">
              <a href="#/studio" className="btn btn-primary btn-lg">
                Build my first page free <ArrowRight size={18} />
              </a>
              <a href="#how" className="btn btn-ghost btn-lg">See it in action</a>
            </div>
          </Reveal>
          <Reveal delay={0.24} className="hero-note">
            <span>No credit card</span><span className="sep">•</span>
            <span>Live in ~30 seconds</span><span className="sep">•</span>
            <span>1-click Shopify import</span>
          </Reveal>

          <Reveal delay={0.3} className="hero-demo-wrap">
            <HeroDemo />
          </Reveal>
        </div>
      </section>

      {/* ---------------- Trust strip (marquee) ---------------- */}
      <section className="trust">
        <div className="wrap">
          <p className="trust-label">Powering 40,000+ pages for stores selling on</p>
        </div>
        <div className="marquee" aria-hidden="true">
          <div className="marquee-track">
            {['Shopify', 'AliExpress', 'Amazon', 'TikTok Shop', 'Temu', 'WooCommerce', 'Etsy', 'eBay']
              .concat(['Shopify', 'AliExpress', 'Amazon', 'TikTok Shop', 'Temu', 'WooCommerce', 'Etsy', 'eBay'])
              .map((n, i) => (
                <span key={n + i} className="trust-logo">{n}</span>
              ))}
          </div>
        </div>
      </section>

      {/* ---------------- Stats ---------------- */}
      <section className="stats">
        <div className="wrap stats-grid">
          {STATS.map((s) => (
            <Stat key={s.label} {...s} />
          ))}
        </div>
      </section>

      {/* ---------------- Features ---------------- */}
      <section id="features" className="section">
        <div className="wrap">
          <Reveal className="section-head">
            <span className="eyebrow">Everything you need</span>
            <h2 className="section-title">From product link to a page that converts</h2>
            <p className="section-sub">
              Zooicha handles the scraping, the copywriting, the images and the publishing — the parts
              that usually eat your whole afternoon.
            </p>
          </Reveal>
          <div className="feat-grid">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.05}>
                <div className="feat-card">
                  <span className="feat-icon" aria-hidden="true">
                    <f.Icon size={21} strokeWidth={2} />
                  </span>
                  <h3>{f.title}</h3>
                  <p>{f.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- How it works ---------------- */}
      <section id="how" className="section section-alt">
        <div className="wrap">
          <Reveal className="section-head">
            <span className="eyebrow">How it works</span>
            <h2 className="section-title">Three steps from link to live</h2>
          </Reveal>
          <div className="steps">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.08}>
                <div className="step">
                  <span className="step-n">{s.n}</span>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Comparison ---------------- */}
      <section id="compare" className="section">
        <div className="wrap">
          <Reveal className="section-head">
            <span className="eyebrow">Why Zooicha</span>
            <h2 className="section-title">A better build than PagePilot</h2>
            <p className="section-sub">
              Same paste-a-link magic — plus the image studio, testing and analytics they make you
              go elsewhere for. For less.
            </p>
          </Reveal>
          <Reveal className="compare-wrap">
            <table className="compare">
              <thead>
                <tr>
                  <th className="c-label" />
                  <th className="c-z">Zooicha</th>
                  <th>PagePilot</th>
                  <th>Doing it manually</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((row) => (
                  <tr key={row.label}>
                    <td className="c-label">{row.label}</td>
                    <td className="c-z">{renderCell(row.z)}</td>
                    <td>{renderCell(row.p)}</td>
                    <td>{renderCell(row.m)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        </div>
      </section>

      {/* ---------------- Pricing ---------------- */}
      <section id="pricing" className="section section-alt">
        <div className="wrap">
          <Reveal className="section-head">
            <span className="eyebrow">Pricing</span>
            <h2 className="section-title">Start free. Pay less than the rest.</h2>
            <p className="section-sub">Simple plans that scale with your stores. Cancel anytime.</p>
          </Reveal>
          <div className="plans">
            {PLANS.map((p, i) => (
              <Reveal key={p.name} delay={i * 0.06}>
                <div className={`plan ${p.featured ? 'plan-featured' : ''}`}>
                  {p.featured && <span className="plan-tag">Most popular</span>}
                  <h3 className="plan-name">{p.name}</h3>
                  <p className="plan-tagline">{p.tagline}</p>
                  <div className="plan-price">
                    <span className="plan-amount">{p.price}</span>
                    <span className="plan-cadence">/ {p.cadence}</span>
                  </div>
                  <ul className="plan-feats">
                    {p.features.map((feat) => (
                      <li key={feat}>
                        <span className="check"><Check size={15} strokeWidth={3} /></span>
                        {feat}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#/studio"
                    className={`btn ${p.featured ? 'btn-primary' : 'btn-outline'} btn-block`}
                  >
                    {p.cta}
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Testimonials ---------------- */}
      <section className="section">
        <div className="wrap">
          <Reveal className="section-head">
            <span className="eyebrow">Loved by sellers</span>
            <h2 className="section-title">Stores ship faster with Zooicha</h2>
          </Reveal>
          <div className="quotes">
            {QUOTES.map((q, i) => (
              <Reveal key={q.name} delay={i * 0.07}>
                <figure className="quote">
                  <div className="quote-stars" aria-label="5 out of 5 stars">
                    {[0, 1, 2, 3, 4].map((s) => (
                      <Star key={s} size={15} fill="currentColor" strokeWidth={0} />
                    ))}
                  </div>
                  <blockquote>“{q.quote}”</blockquote>
                  <figcaption>
                    <span className="avatar" aria-hidden="true">{q.name[0]}</span>
                    <span>
                      <strong>{q.name}</strong>
                      <em>{q.role}</em>
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section id="faq" className="section section-alt">
        <div className="wrap faq-wrap">
          <Reveal className="section-head">
            <span className="eyebrow">FAQ</span>
            <h2 className="section-title">Questions, answered</h2>
          </Reveal>
          <div className="faq">
            {FAQS.map((item, i) => (
              <Reveal key={item.q} delay={i * 0.04}>
                <details className="faq-item">
                  <summary>{item.q}<span className="faq-plus" aria-hidden="true">+</span></summary>
                  <p>{item.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Final CTA ---------------- */}
      <section id="start" className="cta">
        <div className="wrap">
          <Reveal className="cta-card">
            <h2 className="cta-title">Turn your next product link into sales</h2>
            <p className="cta-sub">
              Join 40,000+ sellers building higher-converting pages with Zooicha. Free to start —
              live in about 30 seconds.
            </p>
            <form className="cta-form" onSubmit={goToStudio}>
              <input
                ref={ctaInput}
                type="text"
                className="cta-input"
                placeholder="Paste a product URL (AliExpress, Amazon, TikTok Shop…)"
                aria-label="Paste a product URL"
              />
              <button type="submit" className="btn btn-primary btn-lg">Generate my page ✦</button>
            </form>
          </Reveal>
        </div>
      </section>

      {/* ---------------- Footer ---------------- */}
      <footer className="footer">
        <div className="wrap footer-inner">
          <div className="footer-brand">
            <Logo />
            <p>The AI product-page builder for Shopify. Paste a link — get a page that sells.</p>
            <div className="footer-social">
              <a href="#" aria-label="X / Twitter"><AtSign size={18} /></a>
              <a href="#" aria-label="Community"><MessageCircle size={18} /></a>
              <a href="#" aria-label="Website"><Globe size={18} /></a>
            </div>
          </div>
          <div className="footer-cols">
            <div>
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
              <a href="#compare">vs PagePilot</a>
            </div>
            <div>
              <h4>Company</h4>
              <a href="#">About</a>
              <a href="#">Blog</a>
              <a href="#">Careers</a>
            </div>
            <div>
              <h4>Legal</h4>
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">Security</a>
            </div>
          </div>
        </div>
        <div className="wrap footer-bottom">
          <span>© {new Date().getFullYear()} Zooicha. All rights reserved.</span>
          <span className="footer-made">Built with Zooicha ✦</span>
        </div>
      </footer>
    </div>
  )
}

/* Render a comparison-table cell: booleans become ✓ / —, strings pass through. */
function renderCell(value) {
  if (value === true) return <span className="cell-yes">✓</span>
  if (value === false) return <span className="cell-no">—</span>
  return value
}
