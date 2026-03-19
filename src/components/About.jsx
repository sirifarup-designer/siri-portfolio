import { useEffect, useRef } from 'react'
import styles from './About.module.css'

export default function About({ data, isOpen, activeTag, onTagClick, allTags }) {
  const photoRef    = useRef(null)
  const colBioRef   = useRef(null)
  const colCvRef    = useRef(null)
  const colCliRef   = useRef(null)

  /* Sync column heights to photo height */
  useEffect(() => {
    const sync = () => {
      const photo = photoRef.current
      if (!photo) return
      const img = photo.querySelector('img')
      if (!img) return
      const h = img.getBoundingClientRect().height
      if (h <= 0) return
      ;[colBioRef, colCvRef, colCliRef].forEach(r => {
        if (r.current) {
          r.current.style.maxHeight = h + 'px'
          r.current.style.height    = h + 'px'
        }
      })
    }

    const img = photoRef.current?.querySelector('img')
    if (img?.complete) sync()
    else img?.addEventListener('load', sync)
    window.addEventListener('resize', sync)
    return () => {
      img?.removeEventListener('load', sync)
      window.removeEventListener('resize', sync)
    }
  }, [isOpen])

  if (!data) return null

  return (
    <div className={`${styles.wrap} ${isOpen ? styles.open : ''}`}>
      <section className={styles.hero}>

        {/* ── PHOTO ── */}
        <div className={styles.colPhoto} ref={photoRef}>
          <img src={data.photo} alt="Siri Farup" />
        </div>

        {/* ── BIO ── */}
        <div className={`${styles.col} ${styles.colBio} no-scrollbar`} ref={colBioRef}>
          {data.bio.map((para, i) => (
            <p key={i} className={`${styles.body} ${styles.bodyLarge}`}>{para}</p>
          ))}
          {data.email && (
            <p className={`${styles.body} ${styles.bodyLarge}`} style={{ marginTop: '1em' }}>
              <a href={`mailto:${data.email}`} className={styles.heroLink}>
                {data.email}
              </a>
            </p>
          )}
        </div>

        {/* ── CLIENTS + TAGS ── */}
        <div className={`${styles.col} ${styles.colClients} no-scrollbar`} ref={colCliRef}>
          <p className={styles.cvText} style={{ marginBottom: 10 }}>
            Clients and collaborators:
          </p>
          <p className={styles.cvText} style={{ lineHeight: 1.8 }}>
            {data.clients.map((c, i) => {
              const comma = i < data.clients.length - 1 ? ', ' : '.'
              return c.url
                ? <span key={i}><a href={c.url} target="_blank" rel="noreferrer" className={styles.clientLink}>{c.name}</a>{comma}</span>
                : <span key={i}>{c.name}{comma}</span>
            })}
          </p>

          {/* Tags */}
          {allTags.length > 0 && (
            <div className={styles.tagFilter}>
              <p className={styles.cvText} style={{ marginBottom: 6 }}>Tags:</p>
              <div className={styles.tagList}>
                {allTags.map(tag => (
                  <button
                    key={tag}
                    className={`${styles.tagBtn} ${activeTag === tag ? styles.tagActive : ''}`}
                    onClick={() => onTagClick(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── CV ── */}
        <div className={`${styles.col} ${styles.colCv} no-scrollbar`} ref={colCvRef}>
          {data.cv.map((entry, i) => (
            <div key={i} className={styles.cvBlock}>
              <p className={styles.cvYear}>{entry.year}</p>
              <p className={styles.cvCompany}>{entry.company}</p>
              <p className={styles.cvRole}>{entry.role}</p>
            </div>
          ))}
        </div>

      </section>
    </div>
  )
}
