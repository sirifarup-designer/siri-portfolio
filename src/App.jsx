import Cursor from './components/Cursor'
import Home from './pages/Home'
import { useContent } from './hooks/useContent'
import './styles/global.css'

export default function App() {
  const { data, loading, error } = useContent()

  return (
    <>
      <Cursor />

      {loading && (
        <div style={{
          position: 'fixed', inset: 0, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--sans)', fontSize: 11,
          letterSpacing: '0.12em', textTransform: 'uppercase',
          color: 'var(--ink-faint)',
        }}>
          Loading
        </div>
      )}

      {error && (
        <div style={{
          position: 'fixed', inset: 0, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--sans)', fontSize: 11,
          color: 'red',
        }}>
          Error: {error}
        </div>
      )}

      {data && <Home content={data} />}
    </>
  )
}
