import { useEffect, useRef } from 'react'
import styles from './ProjectStrip.module.css'

const IMAGE_EXTS = ['webp', 'png', 'jpg', 'jpeg', 'gif', 'avif', 'svg']
const VIDEO_EXTS = ['mp4', 'mov', 'webm']
const ALL_EXTS   = [...IMAGE_EXTS, ...VIDEO_EXTS]
const SPEEDS     = { slow: 0.05, medium: 0.11, fast: 0.20 }

function mediaKind(ext) {
  if (IMAGE_EXTS.includes(ext)) return 'img'
  if (VIDEO_EXTS.includes(ext)) return 'video'
  return null
}

function MediaCell({ folder, index, maxHeight, isSmall, onOpen }) {
  const cellRef  = useRef(null)
  const srcRef   = useRef(null)
  const kindRef  = useRef(null)
  const triedRef = useRef(0)

  useEffect(() => {
    triedRef.current = 0
    tryNext()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folder, index])

  function applySize(el) {
    const h = maxHeight || 440
    el.style.height   = h + 'px'
    el.style.width    = 'auto'
    el.style.maxWidth = 'none'
    el.style.display  = 'block'
  }

  function tryNext() {
    if (triedRef.current >= ALL_EXTS.length) {
      if (cellRef.current) cellRef.current.style.display = 'none'
      return
    }
    const ext  = ALL_EXTS[triedRef.current++]
    const k    = mediaKind(ext)
    const path = `${folder}/${index}.${ext}`
    const cell = cellRef.current
    if (!cell) return

    if (k === 'img') {
      const img = new Image()
      let settled = false
      img.onload = () => {
        if (settled) return
        settled = true
        srcRef.current  = path
        kindRef.current = 'img'
        cell.innerHTML  = ''
        const el = document.createElement('img')
        el.src = path
        el.alt = ''
        applySize(el)
        cell.appendChild(el)
      }
      img.onerror = () => { if (!settled) { settled = true; tryNext() } }
      img.src = path
    } else if (k === 'video') {
      const v = document.createElement('video')
      let settled = false
      v.onloadedmetadata = () => {
        if (settled) return
        settled = true
        srcRef.current  = path
        kindRef.current = 'video'
        cell.innerHTML  = ''
        const el = document.createElement('video')
        el.src = path; el.muted = true; el.loop = true; el.playsInline = true; el.autoplay = true
        applySize(el)
        el.play().catch(() => {})
        cell.appendChild(el)
      }
      v.onerror = () => { if (!settled) { settled = true; tryNext() } }
      v.src = path
    } else {
      tryNext()
    }
  }

  return (
    <div
      ref={cellRef}
      className={`${styles.cell} ${isSmall ? styles.cellSmall : ''}`}
      onClick={(e) => {
        e.stopPropagation()
        if (srcRef.current) onOpen?.({ src: srcRef.current, kind: kindRef.current })
      }}
    />
  )
}

function Strip({ folder, from, to, gap, maxHeight, smallNums, smallNumsSize, posRef, isLeader, speed, onOpen }) {
  const rowRef = useRef(null)

  useEffect(() => {
    if (!isLeader) return
    let raf

    function tick() {
      const row = rowRef.current
      if (!row) { raf = requestAnimationFrame(tick); return }
      const wrap   = row.parentElement
      const maxPos = row.scrollWidth - (wrap ? wrap.offsetWidth : 0)

      if (maxPos > 0 && !posRef.current.paused) {
        posRef.current.pos += speed * posRef.current.dir
        if (posRef.current.pos >= maxPos) { posRef.current.pos = maxPos; posRef.current.dir = -1 }
        if (posRef.current.pos <= 0)      { posRef.current.pos = 0;      posRef.current.dir  =  1 }
      }

      const allRows = wrap?.parentElement?.querySelectorAll('.' + styles.strip)
      allRows?.forEach(r => { r.style.transform = `translateX(${-posRef.current.pos}px)` })

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [isLeader, speed, posRef])

  const cells = []
  for (let n = from; n <= to; n++) {
    const isSmall = smallNums?.has(String(n))
    const h = isSmall ? (smallNumsSize || 100) : maxHeight
    cells.push(
      <MediaCell
        key={n}
        folder={folder}
        index={n}
        maxHeight={h}
        isSmall={isSmall}
        onOpen={onOpen}
      />
    )
  }

  return (
    <div ref={rowRef} className={styles.strip} style={{ gap }}>
      {cells}
    </div>
  )
}

export default function ProjectStrip({ project, visible, onOpen }) {
  const wrapRef = useRef(null)
  const posRef  = useRef({ pos: 0, dir: 1, paused: false, resumeTimer: null })

  const {
    folder,
    count        = 30,
    columns      = 1,
    gap          = 3,
    maxHeight,
    smallNums,
    smallNumsSize,
    speed: speedKey = 'medium',
    color        = '#f0ede8',
    textColor    = '#111',
    title,
    description,
    date,
    tags,
  } = project

  const speed = SPEEDS[speedKey] ?? SPEEDS.medium

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    const handler = (e) => {
      if (Math.abs(e.deltaX) > 1) {
        e.preventDefault()
        const p = posRef.current
        p.paused = true
        clearTimeout(p.resumeTimer)
        p.resumeTimer = setTimeout(() => { p.paused = false }, 1000)
        const firstRow = wrap.querySelector('.' + styles.strip)
        if (!firstRow) return
        const maxPos = firstRow.scrollWidth - wrap.offsetWidth
        p.pos = Math.max(0, Math.min(maxPos, p.pos + e.deltaX))
      }
    }
    wrap.addEventListener('wheel', handler, { passive: false })
    return () => wrap.removeEventListener('wheel', handler)
  }, [])

  const half = Math.ceil(count / 2)
  const rows = columns > 1
    ? [{ from: 1, to: half, isLeader: true }, { from: half + 1, to: count, isLeader: false }]
    : [{ from: 1, to: count, isLeader: true }]

  return (
    <div
      className={styles.project}
      style={{ background: color, display: visible ? '' : 'none' }}
      data-tags={tags?.join(',').toLowerCase() ?? ''}
    >
      <div ref={wrapRef} className={styles.stripWrap} style={{ gap: gap + 'px' }}>
        {rows.map((row, ri) => (
          <Strip
            key={ri}
            folder={folder}
            from={row.from}
            to={row.to}
            gap={gap}
            maxHeight={maxHeight}
            smallNums={smallNums}
            smallNumsSize={smallNumsSize}
            posRef={posRef}
            isLeader={row.isLeader}
            speed={speed}
            onOpen={onOpen}
          />
        ))}
      </div>

      <div className={styles.info} style={{ color: textColor }}>
        <span className={styles.projTitle}>{title}</span>
        <span className={styles.projDesc}>{description || ''}</span>
        <span className={styles.projDate}>{date || ''}</span>
      </div>
    </div>
  )
}