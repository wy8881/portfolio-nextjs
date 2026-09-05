// components/home/hero/ConfettiPanel.tsx
'use client'

import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ANIMATION_DURATION, ANIMATION_EASING } from '@/lib/animations'
import { heroQuestions, supportMessage, supportResources } from '@/data/home/questions'
import { useSeasonConfetti } from '@/components/home/hero/useSeasonConfetti'

const SWAP_TRANSITION = { duration: 0.25, ease: ANIMATION_EASING.standard }

export function ConfettiPanel() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { fire, reducedMotion } = useSeasonConfetti(canvasRef)

  const [step, setStep] = useState(0)
  const [celebrated, setCelebrated] = useState(false)

  const question = heroQuestions[step]

  // "Yes" celebrates and leaves the question up, so it can be pressed again.
  // "No" is the only thing that advances the ladder.
  function handleYes() {
    if (!question) return
    fire(question.effect)
    setCelebrated(true)
  }

  function handleNo() {
    setCelebrated(false)
    setStep(current => current + 1)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: ANIMATION_DURATION.hero.cell,
        delay: 0.3,
        ease: ANIMATION_EASING.easeOut,
      }}
      className="relative overflow-hidden rounded-lg p-6 border-l-[3px] h-full min-h-64 flex flex-col justify-center"
      style={{
        backgroundColor: 'var(--color-artifact)',
        borderColor: 'var(--color-accent)',
      }}
    >
      {!reducedMotion && (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full"
        />
      )}

      <div className="relative">
        <p
          className="text-xs uppercase tracking-widest mb-4"
          style={{ color: 'var(--color-secondary)' }}
        >
          <span className="mr-1.5">🎉</span>A quick check-in
        </p>

        <div aria-live="polite">
          {/* Keyed so React remounts on each swap and the entrance replays. */}
          <motion.div
            key={question ? question.id : 'support'}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={SWAP_TRANSITION}
          >
            {question ? (
              <>
                <p
                  className="font-medium leading-snug mb-5"
                  style={{
                    color: 'var(--color-primary)',
                    fontSize: 'clamp(1.05rem, 1.8vw, 1.35rem)',
                  }}
                >
                  {question.text}
                </p>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleYes}
                    className="
                      bg-primary text-background
                      border-2 border-transparent
                      px-7 py-2.5
                      font-medium rounded-sm
                      transition-all duration-200
                      hover:bg-background hover:text-primary hover:border-primary
                    "
                  >
                    Yes
                  </button>

                  <button
                    type="button"
                    onClick={handleNo}
                    className="
                      px-4 py-2.5
                      font-medium rounded-sm
                      underline underline-offset-4
                      transition-opacity duration-200
                      hover:opacity-70
                    "
                    style={{ color: 'var(--color-secondary)' }}
                  >
                    Not really
                  </button>
                </div>

                {celebrated && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={SWAP_TRANSITION}
                    className="text-sm leading-relaxed mt-5"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    {question.affirmation}
                  </motion.p>
                )}
              </>
            ) : (
              <>
                <p
                  className="text-sm leading-relaxed mb-4"
                  style={{ color: 'var(--color-primary)' }}
                >
                  {supportMessage}
                </p>

                <ul className="flex flex-col gap-2.5">
                  {supportResources.map(resource => (
                    <li key={resource.name} className="text-sm leading-snug">
                      <a
                        href={resource.href}
                        className="font-medium underline underline-offset-4 transition-opacity duration-200 hover:opacity-70"
                        style={{ color: 'var(--color-accent)' }}
                      >
                        {resource.name}
                      </a>
                      <span className="block" style={{ color: 'var(--color-secondary)' }}>
                        {resource.detail}
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
