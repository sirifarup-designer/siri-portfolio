import { useState, useMemo, useEffect } from 'react'
import About from '../components/About'
import ProjectStrip from '../components/ProjectStrip'
import Lightbox from '../components/Lightbox'
import styles from './Home.module.css'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function parseInfo(text) {
  const info = {}
  if (!text) return info
  for (const line of text.split('\n')) {
    if (line.trim().toLowerCase().startsWith('tags available')) break
    const colon = line.indexOf(':')
    if (colon < 0) continue
    const key = line.slice(0, colon).trim().toLowerCase()
    const val = line.slice(colon + 1).trim()
    if (key) info[key] = val
  }
  return info
}

async function loadProjectInfo(project) {
  try {
    const res = await fetch(`${project.folder}/info.txt`)
    if (!res.ok) return project
    const text = await res.text()
    const info = parseInfo(text)
    return {
      ...project,
      title:       info.title       || project.title,
      tags:        info.tags        ? info.tags.split(',').map(t => t.trim().toLowerCase()) : project.tags,
      description: info.describtion || info.description || project.description,
      date:        info.date        || project.date,
      color:       info.color       || project.color,
      textColor:   info.text        ? (info.text.trim().toLowerCase() === 'white' ? 'rgba(255,255,255,0.8)' : '#111') : project.textColor,
      columns:     info.columns     ? parseInt(info.columns) : project.columns,
      maxHeight:   info.height      ? parseInt(info.height)  : project.maxHeight,
smallNums:     info.smallnums      ? new Set(info.smallnums.split(',').map(s => s.trim())) : project.smallNums,
smallNumsSize: info['smallnums size'] ? parseInt(info['smallnums size']) : project.smallNumsSize,
      gap:         info.gap         ? parseInt(info.gap)     : project.gap,
      speed:       info.speed       || project.speed,
    }
  } catch {
    return project
  }
}

export default function Home({ content }) {
  const [aboutOpen, setAboutOpen]       = useState(false)
  const [activeTag, setActiveTag]       = useState(null)
  const [lightboxMedia, setLightboxMedia] = useState(null)
  const [projects, setProjects]         = useState([])
  const [allTags, setAllTags]           = useState([])

 useEffect(() => {
    const loaded = content.projects.map(p => ({
      ...p,
      smallNums: p.smallNums ? new Set(p.smallNums) : undefined,
    }))
    setProjects(loaded)
    const tagSet = new Set()
    loaded.forEach(p => p.tags?.forEach(t => tagSet.add(t)))
    setAllTags([...tagSet].sort())
  }, [content.projects])

  function handleTagClick(tag) {
    setActiveTag(prev => prev === tag ? null : tag)
  }

  function isVisible(project) {
    if (!activeTag) return true
    return project.tags?.map(t => t.toLowerCase()).includes(activeTag)
  }

  return (
    <>
      <button
        className={styles.aboutBtn}
        onClick={() => setAboutOpen(o => !o)}
        aria-expanded={aboutOpen}
      >
        {aboutOpen ? 'CLOSE' : 'ABOUT'}
      </button>

      <About
        data={content.about}
        isOpen={aboutOpen}
        activeTag={activeTag}
        onTagClick={handleTagClick}
        allTags={allTags}
      />

      <main className={styles.projects}>
        {projects.map(project => (
          <ProjectStrip
            key={project.id}
            project={project}
            visible={isVisible(project)}
            onOpen={setLightboxMedia}
          />
        ))}
      </main>

      <Lightbox media={lightboxMedia} onClose={() => setLightboxMedia(null)} />
    </>
  )
}