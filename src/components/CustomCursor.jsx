import { useEffect, useRef } from 'react'

export default function CustomCursor({ color = '#6366f1' }) {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  useEffect(() => {
    if (window.matchMedia?.('(pointer: coarse)').matches || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined
    let frame = null
    let x = -100
    let y = -100
    let hovering = false
    const paint = () => {
      frame = null
      if (dotRef.current) dotRef.current.style.transform = `translate3d(${x - 4}px, ${y - 4}px, 0)`
      if (ringRef.current) ringRef.current.style.transform = `translate3d(${x - 16}px, ${y - 16}px, 0) scale(${hovering ? 1.45 : 1})`
    }
    const schedule = () => { if (frame === null) frame = window.requestAnimationFrame(paint) }
    const move = (event) => { x = event.clientX; y = event.clientY; schedule() }
    const over = (event) => { hovering = Boolean(event.target?.closest?.("a, button, [role='button'], [data-cursor='interactive']")); schedule() }
    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerover', over, { passive: true })
    return () => {
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerover', over)
      if (frame !== null) window.cancelAnimationFrame(frame)
    }
  }, [])
  return (
    <>
      <div ref={dotRef} aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[9999] h-2 w-2 rounded-full mix-blend-difference" style={{ backgroundColor: color, transform: 'translate3d(-100px, -100px, 0)' }} />
      <div ref={ringRef} aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[9998] h-8 w-8 rounded-full border border-opacity-70 mix-blend-difference transition-transform duration-150" style={{ borderColor: color, transform: 'translate3d(-100px, -100px, 0)' }} />
    </>
  )
}
