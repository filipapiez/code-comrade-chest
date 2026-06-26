import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/unsubscribe')({
  component: UnsubscribePage,
  head: () => ({ meta: [{ title: 'Unsubscribe · Makibaki' }, { name: 'robots', content: 'noindex' }] }),
})

type State = 'loading' | 'ready' | 'already' | 'invalid' | 'success' | 'error'

function UnsubscribePage() {
  const [state, setState] = useState<State>('loading')
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get('token')
    if (!t) {
      setState('invalid')
      return
    }
    setToken(t)
    fetch(`/email/unsubscribe?token=${encodeURIComponent(t)}`)
      .then((r) => r.json().then((d) => ({ ok: r.ok, d })))
      .then(({ ok, d }) => {
        if (!ok) return setState('invalid')
        if (d.valid) setState('ready')
        else if (d.reason === 'already_unsubscribed') setState('already')
        else setState('invalid')
      })
      .catch(() => setState('error'))
  }, [])

  async function confirm() {
    if (!token) return
    setState('loading')
    try {
      const r = await fetch('/email/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
      const d = await r.json()
      if (d.success) setState('success')
      else if (d.reason === 'already_unsubscribed') setState('already')
      else setState('error')
    } catch {
      setState('error')
    }
  }

  return (
    <div style={wrap}>
      <div style={card}>
        <div style={brand}>MAKIBAKI</div>
        {state === 'loading' && <p style={muted}>Loading…</p>}
        {state === 'ready' && (
          <>
            <h1 style={h1}>Unsubscribe</h1>
            <p style={lede}>Stop receiving emails from Makibaki at this address?</p>
            <button onClick={confirm} style={btn}>Confirm Unsubscribe</button>
          </>
        )}
        {state === 'success' && (
          <>
            <h1 style={h1}>You're unsubscribed</h1>
            <p style={lede}>You won't receive further emails from us.</p>
          </>
        )}
        {state === 'already' && (
          <>
            <h1 style={h1}>Already unsubscribed</h1>
            <p style={lede}>This email is already on our suppression list.</p>
          </>
        )}
        {state === 'invalid' && (
          <>
            <h1 style={h1}>Invalid link</h1>
            <p style={lede}>This unsubscribe link is invalid or expired.</p>
          </>
        )}
        {state === 'error' && (
          <>
            <h1 style={h1}>Something went wrong</h1>
            <p style={lede}>Please try again later or call 224-427-9199.</p>
          </>
        )}
      </div>
    </div>
  )
}

const wrap: React.CSSProperties = {
  minHeight: '100vh', display: 'grid', placeItems: 'center',
  background: 'linear-gradient(135deg,#eef3f5,#fff)', fontFamily: 'system-ui, sans-serif', padding: '24px',
}
const card: React.CSSProperties = {
  background: '#fff', padding: '40px 32px', borderRadius: '16px',
  boxShadow: '0 12px 40px rgba(14,17,19,.08)', maxWidth: '440px', width: '100%', textAlign: 'center',
}
const brand: React.CSSProperties = { fontWeight: 800, letterSpacing: '.18em', color: '#0E1113', marginBottom: 24 }
const h1: React.CSSProperties = { fontSize: '22px', margin: '0 0 10px', color: '#0E1113' }
const lede: React.CSSProperties = { fontSize: '14px', color: '#6E767C', margin: '0 0 22px' }
const muted: React.CSSProperties = { fontSize: '14px', color: '#6E767C' }
const btn: React.CSSProperties = {
  background: '#0E1113', color: '#fff', border: 0, padding: '12px 22px',
  borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '14px',
}
