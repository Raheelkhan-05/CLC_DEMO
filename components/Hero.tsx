'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Bolt, LayoutList, Cpu, TrendingUp, ShieldCheck } from 'lucide-react'

/* ─── design tokens ─── */
const C = {
  bg:       '#080B12',
  surface:  'rgba(255,255,255,0.03)',
  border:   'rgba(255,255,255,0.07)',
  indigo:   '#6366f1',
  indigoHi: '#818cf8',
  teal:     '#34d399',
  tealMid:  '#6ee7b7',
  amber:    '#f59e0b',
  amberHi:  '#fcd34d',
  textPri:  '#F0F2FA',
  textMid:  '#C8CEDF',
  textMut:  '#8E95AA',
  textDim:  '#5A6070',
}

const STACK_NODES: { label: string; color: string; border: string; icon: 'Code' | 'Brain' | 'Database' | 'Bot' | 'Server' }[] = [
  { label: 'Python', color: C.indigoHi, border: C.indigo,  icon: 'Code'    },
  { label: 'LLMs',   color: C.indigoHi, border: C.indigo,  icon: 'Brain'   },
  { label: 'RAG',    color: C.tealMid,  border: C.teal,    icon: 'Database'},
  { label: 'Agents', color: C.tealMid,  border: C.teal,    icon: 'Bot'     },
  { label: 'Deploy', color: C.amberHi,  border: C.amber,   icon: 'Server'  },
]

const PILLS: { label: string; scheme: PillSchemeName }[] = [
  { label: 'No-code path',   scheme: 'indigo' },
  { label: 'Low-code path',  scheme: 'teal'   },
  { label: 'Full-stack AI',  scheme: 'amber'  },
]

const STATS = [
  { num: '₹11.8L', label: 'Avg India CTC' },
  { num: '₹19.2L', label: 'Avg Global CTC' },
  { num: '88%', label: 'Offer Conversion' },
  { num: '120+', label: 'Hiring Startups' },
]
/* ─── sub-components ─── */
function NodeIcon({ name, color, size = 12 }: { name: 'Code' | 'Brain' | 'Database' | 'Bot' | 'Server'; color?: string; size?: number }) {
  const icons = {
    Code:     <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3" />,
    Brain:    <><path strokeLinecap="round" strokeLinejoin="round" d="M9.5 2a2.5 2.5 0 1 1 0 5H9a.5.5 0 0 0-.5.5V9h1a2.5 2.5 0 1 1 0 5h-1v1.5a.5.5 0 0 0 .5.5h.5a2.5 2.5 0 1 1 0 5"/></>,
    Database: <><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.66 3.58 3 8 3s8-1.34 8-3V5"/><path d="M4 11v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6"/></>,
    Bot:      <><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="7" r="4"/><path d="M12 11v0"/><line x1="8" y1="15" x2="8" y2="15"/><line x1="16" y1="15" x2="16" y2="15"/></>,
    Server:   <><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><circle cx="6" cy="6" r="1"/><circle cx="6" cy="18" r="1"/></>,
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" aria-hidden="true">
      {icons[name]}
    </svg>
  )
}

type PillSchemeName = 'indigo' | 'teal' | 'amber'

function PillScheme({ scheme }: { scheme: PillSchemeName }) {
  const map: Record<PillSchemeName, { bg: string; color: string; border: string }> = {
    indigo: { bg: 'rgba(99,102,241,0.15)', color: C.indigoHi, border: 'rgba(99,102,241,0.25)' },
    teal:   { bg: 'rgba(16,185,129,0.12)', color: C.tealMid,  border: 'rgba(16,185,129,0.2)'  },
    amber:  { bg: 'rgba(245,158,11,0.12)', color: C.amberHi,  border: 'rgba(245,158,11,0.2)'  },
  }
  return map[scheme]
}

function AnimatedBar({ fillPercent, gradient, delay = 0 }: { fillPercent: number; gradient: string; delay?: number }) {
  const barRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const t = setTimeout(() => {
      if (barRef.current) barRef.current.style.width = `${fillPercent}%`
    }, delay)
    return () => clearTimeout(t)
  }, [fillPercent, delay])
  return (
    <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 10, overflow: 'hidden' }}>
      <div
        ref={barRef}
        style={{
          height: '100%', width: '0%', borderRadius: 10,
          background: gradient,
          transition: 'width 1.6s cubic-bezier(0.22,1,0.36,1)',
        }}
      />
    </div>
  )
}

/* ─── main component ─── */
export default function Hero() {
  return (
    <section
      id="hero"
      style={{
        paddingTop: 90,
        background: C.bg,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Google Fonts */}
      <style>{`
        
        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.7)} }
        @keyframes orbit-1 { from{transform:rotate(0deg) translateX(82px) rotate(0deg)} to{transform:rotate(360deg) translateX(82px) rotate(-360deg)} }
      `}</style>

      {/* grid background */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage:
          'linear-gradient(rgba(100,120,200,0.05) 1px,transparent 1px),' +
          'linear-gradient(90deg,rgba(100,120,200,0.05) 1px,transparent 1px)',
        backgroundSize: '40px 40px',
      }} />

      {/* glow blobs */}
      <div style={{ position:'absolute', width:520, height:340, right:-80, top:20, background:'radial-gradient(ellipse,rgba(99,102,241,0.16) 0%,transparent 70%)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', width:300, height:240, left:-60, bottom:0,  background:'radial-gradient(ellipse,rgba(16,185,129,0.10) 0%,transparent 70%)',  pointerEvents:'none' }} />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', minHeight: 520 }}>

          {/* ── LEFT COLUMN ── */}
          <div style={{ padding: '52px 40px 52px 0', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

            {/* eyebrow badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(99,102,241,0.12)', border: '0.5px solid rgba(99,102,241,0.35)',
                padding: '6px 14px', borderRadius: 100, fontSize: 11, fontWeight: 500,
                color: C.indigoHi, letterSpacing: '0.06em', textTransform: 'uppercase',
                marginBottom: 24, width: 'fit-content',
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.indigo, animation: 'pulse-dot 2s infinite', display: 'inline-block' }} />
              InternX · AI Program 2025–26
            </motion.div>

            {/* headline */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
              style={{ fontFamily: 'sans-serif', fontSize: 64, fontWeight: 800,
                lineHeight: 1.08, letterSpacing: '0.02em', color: C.textPri, margin: '0 0 8px',
              }}
            >
              Don't just learn AI.<br />
              <span style={{
                background: 'linear-gradient(90deg,#818cf8 0%,#34d399 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>
                Build. Prove.<br/> Get Hired.
              </span>
            </motion.h1>

            {/* sub */}
            <motion.p
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
              style={{ fontSize: 15, lineHeight: 1.65, color: C.textMut, maxWidth: 460, margin: '16px 0 32px', fontWeight: 300 }}
            >
              India's only <strong style={{ color: C.textMid, fontWeight: 500 }}>6+12 month Agentic AI accelerator</strong> with a legal job guarantee,
              ResumeNFT credentials, and exclusive access to HireX &amp; FreelanceX — for both tech and non-tech learners.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
              style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 40 }}
            >
              <button
                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: C.indigo, color: '#fff', fontFamily: "'DM Sans',sans-serif",
                  fontSize: 14, fontWeight: 500, padding: '12px 22px', borderRadius: 8, border: 'none', cursor: 'pointer',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#4f46e5'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                onMouseLeave={e => { e.currentTarget.style.background = C.indigo;  e.currentTarget.style.transform = 'translateY(0)' }}
              >
                <Bolt size={14} />
                Secure Your Seat
                <ArrowRight size={14} />
              </button>

              <button
                onClick={() => document.getElementById('program')?.scrollIntoView({ behavior: 'smooth' })}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: 'transparent', color: C.textMut, fontFamily: "'DM Sans',sans-serif",
                  fontSize: 14, padding: '12px 20px', borderRadius: 8,
                  border: '0.5px solid rgba(255,255,255,0.1)', cursor: 'pointer',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = C.textMid; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)' }}
                onMouseLeave={e => { e.currentTarget.style.color = C.textMut; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
              >
                <LayoutList size={14} />
                View Curriculum
              </button>
            </motion.div>

            {/* stats strip */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.45 }}
              style={{
                display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
                border: '0.5px solid rgba(255,255,255,0.07)', borderRadius: 12, overflow: 'hidden', maxWidth: 480,
              }}
            >
              {STATS.map((s, i) => (
                <div key={s.label} style={{ padding: '14px 16px', borderRight: i < 3 ? '0.5px solid rgba(255,255,255,0.07)' : 'none' }}>
                  <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 22, fontWeight: 700, lineHeight: 1, marginBottom: 4 }}>
                    <span style={{ background: 'linear-gradient(90deg,#818cf8,#34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                      {s.num}
                    </span>
                  </div>
                  <div style={{ fontSize: 10, color: C.textDim, textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 500 }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </motion.div>

          </div>

          {/* ── RIGHT COLUMN ── */}
          <div style={{
            background: 'rgba(15,18,28,0.8)', borderLeft: '0.5px solid rgba(255,255,255,0.06)',
            padding: '32px 28px', display: 'flex', flexDirection: 'column', gap: 14, justifyContent: 'center',
          }}>

            {/* card 1 — stack */}
            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
              style={{ background: C.surface, border: `0.5px solid ${C.border}`, borderRadius: 12, padding: '16px 18px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Cpu size={16} color={C.indigoHi} />
                </div>
                <span style={{ fontFamily: 'Syne,sans-serif', fontSize: 13, fontWeight: 700, color: '#D0D5E8', letterSpacing: '0.01em' }}>
                  Agentic AI Stack
                </span>
              </div>

              {/* node chain */}
              <div style={{ position: 'relative', height: 52, margin: '4px 0 12px' }}>
                <div style={{ position: 'absolute', top: '50%', left: 24, right: 24, height: '0.5px', background: 'linear-gradient(90deg,rgba(99,102,241,0.4),rgba(16,185,129,0.4))', transform: 'translateY(-50%)' }} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  {STACK_NODES.map(n => (
                    <div key={n.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, zIndex: 1 }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', border: `1.5px solid ${n.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.bg }}>
                        <NodeIcon name={n.icon} color={n.color} size={12} />
                      </div>
                      <span style={{ fontSize: 9, color: C.textDim, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                        {n.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {PILLS.map(p => {
                  const s = PillScheme({ scheme: p.scheme })
                  return (
                    <span key={p.label} style={{ fontSize: 10, fontWeight: 500, padding: '3px 9px', borderRadius: 100, letterSpacing: '0.04em', textTransform: 'uppercase', background: s.bg, color: s.color, border: `0.5px solid ${s.border}` }}>
                      {p.label}
                    </span>
                  )
                })}
              </div>
            </motion.div>

            {/* card 2 — salary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
              style={{ background: C.surface, border: `0.5px solid ${C.border}`, borderRadius: 12, padding: '16px 18px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <TrendingUp size={16} color={C.teal} />
                </div>
                <span style={{ fontFamily: 'Syne,sans-serif', fontSize: 13, fontWeight: 700, color: '#D0D5E8' }}>
                  Salary Range After Placement
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: C.textDim, marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                <span>₹6 LPA</span>
                <span style={{ color: C.indigo }}>avg. ₹14 LPA</span>
                <span>₹35 LPA</span>
              </div>
              <AnimatedBar fillPercent={88} gradient="linear-gradient(90deg,#6366f1,#34d399)" delay={800} />
              <div style={{ fontSize: 12, color: C.textDim, marginTop: 8 }}>
                Verified across 120+ hiring partners · 2024 cohort data
              </div>
            </motion.div>

            {/* card 3 — live seats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
              style={{ background: C.surface, border: `0.5px solid ${C.border}`, borderRadius: 12, padding: '16px 18px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, color: C.teal, fontWeight: 500 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: C.teal, display: 'inline-block', animation: 'pulse-dot 1.5s infinite' }} />
                  Live Batch Open
                </div>
                <span style={{ fontSize: 11, color: C.textDim }}>Sat &amp; Sun · 11AM IST</span>
              </div>
              <div style={{ height: '0.5px', background: 'rgba(255,255,255,0.05)', margin: '10px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: C.textDim, marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                <span>Seats Filled</span>
                <span style={{ color: C.amber }}>73 / 100</span>
              </div>
              <AnimatedBar fillPercent={73} gradient="linear-gradient(90deg,#f59e0b,#ef4444)" delay={1000} />
            </motion.div>

            {/* guarantee strip */}
            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.5 }}
              style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(16,185,129,0.06)', border: '0.5px solid rgba(16,185,129,0.2)', borderRadius: 8, padding: '10px 14px' }}
            >
              <ShieldCheck size={22} color={C.teal} style={{ flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 12, color: C.tealMid, fontWeight: 500 }}>Legal Job Guarantee</div>
                <div style={{ fontSize: 10, color: '#2d8b62', marginTop: 1 }}>Backed by contractual agreement · or full refund</div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  )
}