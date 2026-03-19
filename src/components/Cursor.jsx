import { useEffect, useRef } from 'react'

export default function Cursor() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const move = (e) => {
      el.style.left = e.clientX + 'px'
      el.style.top  = e.clientY + 'px'
    }

    window.addEventListener('mousemove', move, { passive: true })
    return () => window.removeEventListener('mousemove', move)
  }, [])

  return (
    <div ref={ref} style={{
      position: 'fixed',
      top: 0,
      left: 0,
      pointerEvents: 'none',
      zIndex: 9999,
      width: 28,
      height: 36,
      willChange: 'transform',
    }}>
      <svg
        viewBox="0 0 28 36"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <polygon
          points="2,2 2,30 9,23 14,34 18,32 13,21 22,21"
          fill="#111"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}
