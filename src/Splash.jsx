import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import './splash.css'

/*
 * Intro splash. Shows a single animated square (logo placeholder).
 * Click it -> it "blasts off" upward, then onEnter() reveals the site.
 */
export default function Splash({ onEnter }) {
  const reduce = useReducedMotion()
  const [launching, setLaunching] = useState(false)

  // lock background scroll while the splash is up
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  const launch = () => {
    if (launching) return
    if (reduce) {
      onEnter()
      return
    }
    setLaunching(true)
  }

  return (
    <motion.div
      className="splash"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="splash-stars" aria-hidden="true" />

      {/* speed streaks that fire during launch */}
      {launching &&
        [0, 1, 2, 3, 4].map((i) => (
          <motion.span
            key={i}
            className="splash-streak"
            style={{ left: `${12 + i * 18}%` }}
            initial={{ y: '120vh', opacity: 0 }}
            animate={{ y: '-120vh', opacity: [0, 1, 0] }}
            transition={{ duration: 0.7, delay: i * 0.04, ease: 'easeIn' }}
          />
        ))}

      <div className="splash-stage">
        <motion.button
          type="button"
          className="splash-square"
          aria-label="Enter Zooicha"
          onClick={launch}
          animate={
            launching
              ? { y: [0, 26, '-160vh'], scale: [1, 1.12, 0.18], rotate: [0, 0, -8] }
              : { y: [0, -14, 0] }
          }
          transition={
            launching
              ? { duration: 1, ease: 'easeIn', times: [0, 0.22, 1] }
              : { duration: 4.5, repeat: Infinity, ease: 'easeInOut' }
          }
          whileHover={!launching ? { scale: 1.05 } : undefined}
          whileTap={!launching ? { scale: 0.95 } : undefined}
          onAnimationComplete={() => {
            if (launching) onEnter()
          }}
        >
          <motion.span
            className="splash-flame"
            animate={launching ? { opacity: 1, scaleY: 1 } : { opacity: 0, scaleY: 0.2 }}
            transition={{ duration: 0.22 }}
            aria-hidden="true"
          />
        </motion.button>
      </div>

      {!launching && (
        <motion.p
          className="splash-hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, -6, 0] }}
          transition={{ opacity: { delay: 0.6, duration: 0.6 }, y: { duration: 2, repeat: Infinity, ease: 'easeInOut' } }}
        >
          Tap to launch ↑
        </motion.p>
      )}
    </motion.div>
  )
}
