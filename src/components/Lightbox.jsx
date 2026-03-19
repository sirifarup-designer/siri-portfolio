import { useEffect } from 'react'
import styles from './Lightbox.module.css'

export default function Lightbox({ media, onClose }) {
  const isOpen = !!media

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose?.() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!isOpen) return null

  return (
    <div className={`${styles.lightbox} ${isOpen ? styles.open : ''}`}>
      <div className={styles.frame} onClick={onClose}>
        <div className={styles.media}>
          {media.kind === 'img'
            ? <img src={media.src} alt="" />
            : <video src={media.src} muted loop playsInline autoPlay />
          }
        </div>
      </div>
    </div>
  )
}
