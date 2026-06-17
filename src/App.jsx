import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'motion/react'
import './App.css'

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
/*  Animated hero prompt demo                                          */
/* ------------------------------------------------------------------ */

const PROMPTS = [
  'a minimalist portfolio for a film photographer',
  'a landing page for my plant-based protein brand',
  'an online store for handmade ceramic mugs',
  'a booking site for a downtown barbershop',
]

function useTypewriter(phrases, { typeMs = 42, holdMs = 1400, deleteMs = 18 } = {}) {
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
  const { text, done } = useTypewriter(PROMPTS)

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
          <span className="prompt-spark" aria-hidden="true">✦</span>
          <span className="prompt-text">
            {text}
            <span className="caret" />
          </span>
        </div>

        <div className="build-row">
          <span className={`build-pill ${done ? 'on' : ''}`}>Layout</span>
          <span className={`build-pill ${done ? 'on' : ''}`} style={{ transitionDelay: '.12s' }}>
            Copy
          </span>
          <span className={`build-pill ${done ? 'on' : ''}`} style={{ transitionDelay: '.24s' }}>
            Images
          </span>
          <span className={`build-pill ${done ? 'on' : ''}`} style={{ transitionDelay: '.36s' }}>
            Deploy
          </span>
        </div>

        <div className={`canvas ${done ? 'on' : ''}`}>
          <div className="sk sk-nav">
            <span className="sk-logo" />
            <span className="sk-links" />
          </div>
          <div className="sk-hero">
            <span className="sk-line w70" />
            <span className="sk-line w50" />
            <span className="sk-btn" />
          </div>
          <div className="sk-grid">
            <span className="sk-card" />
            <span className="sk-card" />
            <span className="sk-card" />
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
    icon: '✦',
    title: 'Prompt to website',
    body: 'Describe what you want in plain words. Zooicha generates layout, copy, imagery and theme — a complete site, not a blank canvas.',
  },
  {
    icon: '◳',
    title: 'Edit anything visually',
    body: 'Click any element and tweak it, or just ask. Drag, restyle, and rewrite with a live preview that updates instantly.',
  },
  {
    icon: '⚡',
    title: 'One-click publish',
    body: 'Ship to a free zooicha.site domain or connect your own. Global CDN, SSL and analytics are wired up automatically.',
  },
  {
    icon: '◑',
    title: 'Responsive by default',
    body: 'Every layout is crafted for phones, tablets and desktops out of the box. No breakpoints to babysit.',
  },
  {
    icon: '⌘',
    title: 'Clean, exportable code',
    body: 'Need to take it further? Export production-ready React and Tailwind, or sync straight to your GitHub repo.',
  },
  {
    icon: '◈',
    title: 'SEO & speed built in',
    body: 'Semantic markup, meta tags, OG images and 95+ Lighthouse scores come standard with every project.',
  },
]

const STEPS = [
  {
    n: '01',
    title: 'Describe your idea',
    body: 'Type a sentence about the site you want — your business, your style, your goal.',
  },
  {
    n: '02',
    title: 'Watch it build',
    body: 'Zooicha drafts a full multi-section site with real copy and curated imagery in seconds.',
  },
  {
    n: '03',
    title: 'Refine & publish',
    body: 'Polish it by clicking or chatting, then hit publish. Your site is live on the web.',
  },
]

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    cadence: 'forever',
    tagline: 'For trying ideas out.',
    features: ['3 published projects', 'zooicha.site subdomain', 'AI prompt builder', 'Community support'],
    cta: 'Start free',
    featured: false,
  },
  {
    name: 'Pro',
    price: '$19',
    cadence: 'per month',
    tagline: 'For makers shipping real sites.',
    features: [
      'Unlimited projects',
      'Custom domains',
      'Remove Zooicha badge',
      'Code export (React + Tailwind)',
      'Priority AI generations',
    ],
    cta: 'Go Pro',
    featured: true,
  },
  {
    name: 'Team',
    price: '$59',
    cadence: 'per month',
    tagline: 'For studios and agencies.',
    features: ['Everything in Pro', '5 team seats', 'Shared workspaces', 'Brand kits & templates', 'SSO & roles'],
    cta: 'Start a team',
    featured: false,
  },
]

const QUOTES = [
  {
    quote:
      'I described my bakery in one sentence and had a live site before my coffee went cold. Zooicha is genuinely unreal.',
    name: 'Mara Okafor',
    role: 'Owner, Crumb & Co.',
  },
  {
    quote:
      'We ship client landing pages 5x faster now. The exported code is clean enough that our devs actually keep it.',
    name: 'Devin Walsh',
    role: 'Founder, Northlight Studio',
  },
  {
    quote:
      'No templates that all look the same. Every site it builds feels designed for the brief. It just gets it.',
    name: 'Priya Raman',
    role: 'Indie maker',
  },
]

const FAQS = [
  {
    q: 'Do I need to know how to code?',
    a: 'Not at all. Zooicha builds and edits everything from natural language. Developers can export clean React + Tailwind if they want to go deeper.',
  },
  {
    q: 'Can I use my own domain?',
    a: 'Yes. Free sites get a zooicha.site subdomain, and Pro plans let you connect any custom domain with automatic SSL.',
  },
  {
    q: 'Who owns the sites I create?',
    a: 'You do — fully. Your content, your code, your brand. Export or take it anywhere, anytime.',
  },
  {
    q: 'Is there really a free plan?',
    a: 'Yep. You can build and publish up to three projects for free, forever, no credit card required.',
  },
]

/* ------------------------------------------------------------------ */
/*  App                                                                */
/* ------------------------------------------------------------------ */

export default function App() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div id="top">
      {/* ---------------- Nav ---------------- */}
      <header className={`nav ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="wrap nav-inner">
          <Logo />
          <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
            <a href="#features" onClick={() => setMenuOpen(false)}>Features</a>
            <a href="#how" onClick={() => setMenuOpen(false)}>How it works</a>
            <a href="#pricing" onClick={() => setMenuOpen(false)}>Pricing</a>
            <a href="#faq" onClick={() => setMenuOpen(false)}>FAQ</a>
          </nav>
          <div className="nav-cta">
            <a href="#" className="btn btn-ghost">Sign in</a>
            <a href="#start" className="btn btn-primary">Start building</a>
          </div>
          <button
            className="nav-burger"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span /><span /><span />
          </button>
        </div>
      </header>

      {/* ---------------- Hero ---------------- */}
      <section className="hero">
        <div className="wrap hero-inner">
          <Reveal>
            <a href="#start" className="badge">
              <span className="badge-dot" /> Now in public beta — build for free
            </a>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="hero-title">
              Describe it.
              <br />
              <span className="grad-text">Zooicha builds it.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="hero-sub">
              The AI website builder that turns a single sentence into a complete, responsive,
              ready-to-publish website — copy, design and all. No templates. No code required.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="hero-actions">
              <a href="#start" className="btn btn-primary btn-lg">Start building free →</a>
              <a href="#how" className="btn btn-ghost btn-lg">See how it works</a>
            </div>
          </Reveal>
          <Reveal delay={0.24} className="hero-note">
            <span>No credit card</span><span className="sep">•</span>
            <span>Live in under a minute</span><span className="sep">•</span>
            <span>Export anytime</span>
          </Reveal>

          <Reveal delay={0.3} className="hero-demo-wrap">
            <HeroDemo />
          </Reveal>
        </div>
      </section>

      {/* ---------------- Trust strip ---------------- */}
      <section className="trust">
        <div className="wrap">
          <p className="trust-label">Trusted by 40,000+ founders, freelancers and teams</p>
          <div className="trust-row">
            {['Northwind', 'Loomly', 'Brightseed', 'Pagecraft', 'Vela', 'Studio Mono'].map((n) => (
              <span key={n} className="trust-logo">{n}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Features ---------------- */}
      <section id="features" className="section">
        <div className="wrap">
          <Reveal className="section-head">
            <span className="eyebrow">Everything you need</span>
            <h2 className="section-title">A whole web studio, driven by a sentence</h2>
            <p className="section-sub">
              From first prompt to published site, Zooicha handles the parts that usually take days.
            </p>
          </Reveal>
          <div className="feat-grid">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.05}>
                <div className="feat-card">
                  <span className="feat-icon" aria-hidden="true">{f.icon}</span>
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
            <h2 className="section-title">Three steps from idea to live</h2>
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

      {/* ---------------- Pricing ---------------- */}
      <section id="pricing" className="section">
        <div className="wrap">
          <Reveal className="section-head">
            <span className="eyebrow">Pricing</span>
            <h2 className="section-title">Start free. Upgrade when you ship.</h2>
            <p className="section-sub">Simple plans that scale with you. Cancel anytime.</p>
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
                      <li key={feat}><span className="check">✓</span>{feat}</li>
                    ))}
                  </ul>
                  <a
                    href="#start"
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
      <section className="section section-alt">
        <div className="wrap">
          <Reveal className="section-head">
            <span className="eyebrow">Loved by builders</span>
            <h2 className="section-title">People ship things with Zooicha</h2>
          </Reveal>
          <div className="quotes">
            {QUOTES.map((q, i) => (
              <Reveal key={q.name} delay={i * 0.07}>
                <figure className="quote">
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
      <section id="faq" className="section">
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
            <h2 className="cta-title">Your next website is one sentence away</h2>
            <p className="cta-sub">
              Join 40,000+ people building faster with Zooicha. Free to start — live in a minute.
            </p>
            <form className="cta-form" onSubmit={(e) => e.preventDefault()}>
              <input
                type="text"
                className="cta-input"
                placeholder="Describe the site you want to build…"
                aria-label="Describe your website"
              />
              <button type="submit" className="btn btn-primary btn-lg">Build it ✦</button>
            </form>
          </Reveal>
        </div>
      </section>

      {/* ---------------- Footer ---------------- */}
      <footer className="footer">
        <div className="wrap footer-inner">
          <div className="footer-brand">
            <Logo />
            <p>The AI website builder. Describe it, and we build it.</p>
          </div>
          <div className="footer-cols">
            <div>
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
              <a href="#how">How it works</a>
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
