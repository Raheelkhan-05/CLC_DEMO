import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Globe, BookOpen, Zap, ShieldCheck, TrendingUp,
  Award, Briefcase, Link2, Bot,
  Building2, Calendar, CheckCircle2,
  ArrowRight, Code2, Server, Database,
  Cpu, Layers, Workflow, Sparkles,
  Lock, BarChart3, Rocket, Brain, Star,
  Users, MapPin, GitBranch, ChevronRight,
} from 'lucide-react'

/* ─── DESIGN TOKENS ─────────────────────────────────────────────────────────── */
const T = {
  void:    '#03040A',
  ink:     '#070B15',
  lift:    '#0C1120',
  glass:   'rgba(255,255,255,0.028)',
  glassHi: 'rgba(255,255,255,0.055)',
  line:    'rgba(255,255,255,0.055)',
  lineHi:  'rgba(255,255,255,0.11)',

  violet:  '#7C3AED',
  violetLo:'rgba(124,58,237,0.12)',
  violetB: 'rgba(124,58,237,0.30)',
  violetHi:'#A78BFA',
  mint:    '#10F5A0',
  mintLo:  'rgba(16,245,160,0.08)',
  mintB:   'rgba(16,245,160,0.22)',
  gold:    '#F0A500',
  goldLo:  'rgba(240,165,0,0.10)',
  goldB:   'rgba(240,165,0,0.25)',
  cyan:    '#06B6D4',
  cyanLo:  'rgba(6,182,212,0.10)',
  cyanB:   'rgba(6,182,212,0.25)',
  rose:    '#F43F5E',

  hi:      '#ECEEF8',
  mid:     '#A9AFCA',
  muted:   '#5E6580',
  ghost:   '#2E3348',

  display: "'Clash Display', 'Syne', 'Space Grotesk', sans-serif",
  body:    "'DM Sans', 'Plus Jakarta Sans', sans-serif",
  mono:    "'DM Mono', 'JetBrains Mono', monospace",
}

/* ─── FONT LOADER ────────────────────────────────────────────────────────────── */
if (typeof document !== 'undefined' && !document.getElementById('clc-fonts-p1')) {
  const link = document.createElement('link')
  link.id = 'clc-fonts-p1'
  link.rel = 'stylesheet'
  link.href = 'https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&f[]=dm-sans@300,400,500&f[]=dm-mono@400,500&display=swap'
  document.head.appendChild(link)
  const style = document.createElement('style')
  style.textContent = `
    *{box-sizing:border-box;margin:0;padding:0}
    @media(max-width:768px){
      .clc-grid-2{grid-template-columns:1fr!important}
      .clc-grid-3{grid-template-columns:1fr!important}
      .clc-hide-mob{display:none!important}
      .clc-stack{flex-direction:column!important}
    }
  `
  document.head.appendChild(style)
}

/* ─── SHARED PRIMITIVES ─────────────────────────────────────────────────────── */
function Noise() {
  return (
    <svg style={{ position:'absolute',inset:0,width:'100%',height:'100%',opacity:0.018,pointerEvents:'none',zIndex:0 }} aria-hidden>
      <filter id="noise1"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
      <rect width="100%" height="100%" filter="url(#noise1)"/>
    </svg>
  )
}

function GridLines() {
  return (
    <div style={{ position:'absolute',inset:0,pointerEvents:'none',zIndex:0,
      backgroundImage:`linear-gradient(${T.line} 1px,transparent 1px),linear-gradient(90deg,${T.line} 1px,transparent 1px)`,
      backgroundSize:'64px 64px',
      maskImage:'radial-gradient(ellipse 80% 60% at 50% 50%,black 40%,transparent 100%)',
    }}/>
  )
}

function Orb({ color, x, y, size=400, opacity=0.12 }: { color:string;x:string;y:string;size?:number;opacity?:number }) {
  return <div style={{ position:'absolute',left:x,top:y,width:size,height:size,background:`radial-gradient(circle,${color} 0%,transparent 70%)`,opacity,pointerEvents:'none',transform:'translate(-50%,-50%)',zIndex:0 }}/>
}

const FadeIn = ({ children, delay=0, y=28 }: { children:React.ReactNode;delay?:number;y?:number }) => (
  <motion.div initial={{ opacity:0,y }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true,margin:'-80px' }} transition={{ duration:0.7,delay,ease:[0.16,1,0.3,1] }}>
    {children}
  </motion.div>
)

function SectionLabel({ children }: { children:React.ReactNode }) {
  return (
    <div style={{ display:'inline-flex',alignItems:'center',gap:8,marginBottom:20,fontFamily:T.mono,fontSize:10,fontWeight:500,letterSpacing:'0.18em',textTransform:'uppercase',color:T.mint }}>
      <div style={{ width:20,height:1,background:T.mint,opacity:0.7 }}/>
      {children}
      <div style={{ width:20,height:1,background:T.mint,opacity:0.7 }}/>
    </div>
  )
}

function Display({ children }: { children:React.ReactNode }) {
  return <h2 style={{ fontFamily:T.display,fontSize:'clamp(34px,4.5vw,56px)',fontWeight:600,lineHeight:1.05,letterSpacing:'-0.025em',color:T.hi,margin:'0 0 6px' }}>{children}</h2>
}

function Grad({ children }: { children:React.ReactNode }) {
  return <span style={{ backgroundImage:`linear-gradient(135deg,#7C3AED 0%,#A855F7 35%,#10F5A0 100%)`,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text' }}>{children}</span>
}

function Rule() {
  return <div style={{ width:40,height:2,background:`linear-gradient(90deg,${T.violet},${T.mint})`,borderRadius:2,margin:'18px 0 22px' }}/>
}

function Tag({ children, scheme='violet' }: { children:React.ReactNode;scheme?:'violet'|'mint'|'gold'|'cyan' }) {
  const s = { violet:[T.violetLo,'#A78BFA',T.violetB], mint:[T.mintLo,T.mint,T.mintB], gold:[T.goldLo,T.gold,T.goldB], cyan:[T.cyanLo,T.cyan,T.cyanB] }[scheme]
  return <span style={{ display:'inline-flex',alignItems:'center',gap:4,background:s[0],color:s[1],border:`0.5px solid ${s[2]}`,fontSize:10,fontWeight:500,fontFamily:T.mono,letterSpacing:'0.06em',padding:'4px 10px',borderRadius:100 }}>{children}</span>
}

/* ─── CLC LOGO ────────────────────────────────────────────────────────────────── */
export function CLCLogo({ size = 36 }: { size?: number }) {
  return (
    <div style={{ display:'flex',alignItems:'center',gap:10 }}>
      <div style={{ width:size,height:size,borderRadius:8,background:`linear-gradient(135deg,${T.violet},${T.mint})`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
        <svg width={size*0.6} height={size*0.6} viewBox="0 0 24 24" fill="none">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" fill="white" opacity="0.9"/>
          <circle cx="12" cy="12" r="3" fill="white" opacity="0.5"/>
        </svg>
      </div>
      <div>
        <div style={{ fontFamily:T.display,fontSize:14,fontWeight:700,color:T.hi,letterSpacing:'-0.01em',lineHeight:1.1 }}>CAREER LAB</div>
        <div style={{ fontFamily:T.mono,fontSize:9,color:T.mint,letterSpacing:'0.15em',textTransform:'uppercase' }}>CONSULTING</div>
      </div>
    </div>
  )
}

/* ─── NAVBAR ─────────────────────────────────────────────────────────────────── */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])
  const links = ['About','Program','Tech Stack','Hiring','Pricing','Outcomes']
  return (
    <motion.nav initial={{ y:-60,opacity:0 }} animate={{ y:0,opacity:1 }} transition={{ duration:0.6,ease:[0.16,1,0.3,1] }}
      style={{ position:'fixed',top:0,left:0,right:0,zIndex:100,
        background: scrolled ? 'rgba(3,4,10,0.88)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? `0.5px solid ${T.line}` : 'none',
        transition:'all 0.3s ease',
      }}
    >
      <div style={{ maxWidth:1200,margin:'0 auto',padding:'0 32px',display:'flex',alignItems:'center',justifyContent:'space-between',height:64 }}>
        <CLCLogo size={32}/>
        <div className="clc-hide-mob" style={{ display:'flex',gap:28 }}>
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(' ','-')}`}
              style={{ fontFamily:T.body,fontSize:13,color:T.muted,textDecoration:'none',fontWeight:500,letterSpacing:'0.01em',transition:'color 0.2s' }}
              onMouseEnter={e=>(e.currentTarget.style.color=T.hi)}
              onMouseLeave={e=>(e.currentTarget.style.color=T.muted)}
            >{l}</a>
          ))}
        </div>
        <motion.a href="#pricing" whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}
          style={{ display:'flex',alignItems:'center',gap:7,background:`linear-gradient(135deg,${T.violet},#6D28D9)`,border:'none',borderRadius:10,padding:'9px 20px',fontFamily:T.display,fontSize:13,fontWeight:600,color:'#fff',textDecoration:'none',letterSpacing:'-0.01em',cursor:'pointer' }}
        >
          Enrol Now <ArrowRight size={13}/>
        </motion.a>
      </div>
    </motion.nav>
  )
}

/* ─── HERO ───────────────────────────────────────────────────────────────────── */
export function Hero() {
  return (
    <section style={{ position:'relative',background:T.void,overflow:'hidden',minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'100px 32px 80px' }}>
      <Noise/>
      <GridLines/>
      <Orb color={T.violet} x="20%" y="30%" size={700} opacity={0.10}/>
      <Orb color={T.mint}   x="80%" y="60%" size={500} opacity={0.07}/>
      <Orb color={T.gold}   x="60%" y="20%" size={400} opacity={0.06}/>

      {/* Decorative watermark */}
      <div style={{ position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',fontFamily:T.display,fontSize:'clamp(80px,18vw,260px)',fontWeight:700,color:'rgba(255,255,255,0.012)',letterSpacing:'-0.04em',whiteSpace:'nowrap',userSelect:'none',pointerEvents:'none',zIndex:0 }}>
        INTERNX
      </div>

      <div style={{ position:'relative',zIndex:2,textAlign:'center',maxWidth:860 }}>
        {/* Company intro badge */}
        <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.7,ease:[0.16,1,0.3,1] }}>
          <div style={{ display:'flex',justifyContent:'center',marginBottom:32 }}>
            <CLCLogo size={48}/>
          </div>
          <div style={{ display:'inline-flex',alignItems:'center',gap:8,background:`linear-gradient(135deg,${T.violetLo},${T.mintLo})`,border:`0.5px solid ${T.violetB}`,borderRadius:100,padding:'7px 18px',marginBottom:28 }}>
            <div style={{ width:6,height:6,borderRadius:'50%',background:T.mint,boxShadow:`0 0 8px ${T.mint}` }}/>
            <span style={{ fontFamily:T.mono,fontSize:10,color:T.mint,letterSpacing:'0.14em',textTransform:'uppercase' }}>ISO 27001 Certified · 27 Countries · MNC Since 2019</span>
          </div>
        </motion.div>

        <motion.div initial={{ opacity:0,y:30 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.8,delay:0.1,ease:[0.16,1,0.3,1] }}>
          <h1 style={{ fontFamily:T.display,fontSize:'clamp(40px,6vw,82px)',fontWeight:700,lineHeight:1.02,letterSpacing:'-0.03em',color:T.hi,margin:'0 0 8px' }}>
            Build Projects.<br/>
            <Grad>Show Proof. Get Hired.</Grad>
          </h1>
          <div style={{ fontFamily:T.display,fontSize:'clamp(20px,3vw,32px)',fontWeight:500,color:T.mid,letterSpacing:'-0.02em',marginBottom:24 }}>
            Globally.
          </div>
        </motion.div>

        <motion.p initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.7,delay:0.2,ease:[0.16,1,0.3,1] }}
          style={{ fontFamily:T.body,fontSize:'clamp(14px,1.6vw,17px)',lineHeight:1.8,color:T.mid,fontWeight:300,maxWidth:580,margin:'0 auto 36px' }}
        >
          InternX–AI is a <strong style={{ color:T.hi,fontWeight:500 }}>6-month Real-World Agentic AI Internship Accelerator</strong> — not a course. Build verifiable proof-of-work that 120+ global employers trust. Legal job guarantee available.
        </motion.p>

        <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.7,delay:0.3,ease:[0.16,1,0.3,1] }}>
          {/* Tag row */}
          <div style={{ display:'flex',justifyContent:'center',flexWrap:'wrap',gap:8,marginBottom:36 }}>
            <Tag scheme="violet"><Award size={9}/>Job Guarantee (Elite)</Tag>
            <Tag scheme="mint"><GitBranch size={9}/>ResumeNFT · GitHub Verified</Tag>
            <Tag scheme="gold"><Zap size={9}/>88% Job Conversion</Tag>
            <Tag scheme="cyan"><Globe size={9}/>27 Countries Active</Tag>
          </div>

          {/* CTA buttons */}
          <div className="clc-stack" style={{ display:'flex',gap:14,justifyContent:'center',flexWrap:'wrap',marginBottom:48 }}>
            <motion.a href="#pricing" whileHover={{ scale:1.04,boxShadow:`0 0 40px ${T.violet}50` }} whileTap={{ scale:0.97 }}
              style={{ display:'flex',alignItems:'center',gap:10,background:`linear-gradient(135deg,${T.violet},#6D28D9)`,border:'none',borderRadius:14,padding:'16px 36px',fontFamily:T.display,fontSize:16,fontWeight:600,color:'#fff',textDecoration:'none',letterSpacing:'-0.01em',cursor:'pointer' }}
            >
              <Rocket size={16}/> Enrol Now — Secure Your Spot <ArrowRight size={16}/>
            </motion.a>
            <motion.a href="https://careerlabconsulting.com" target="_blank" rel="noopener noreferrer" whileHover={{ scale:1.02 }}
              style={{ display:'flex',alignItems:'center',gap:8,background:T.glass,border:`0.5px solid ${T.line}`,borderRadius:14,padding:'16px 28px',fontFamily:T.display,fontSize:15,fontWeight:500,color:T.mid,textDecoration:'none',letterSpacing:'-0.01em' }}
            >
              Book Free Career Call <ChevronRight size={14}/>
            </motion.a>
          </div>

          {/* Trust row */}
          <div style={{ display:'flex',justifyContent:'center',flexWrap:'wrap',gap:28 }}>
            {[
              { icon:<Lock size={12} color={T.mint}/>,  text:'100% Money Back if Not Placed' },
              { icon:<ShieldCheck size={12} color={T.gold}/>, text:'Legal Signed Agreement' },
              { icon:<Zap size={12} color={T.violet}/>,  text:'Start in 48 Hours' },
              { icon:<Globe size={12} color={T.cyan}/>,  text:'100% Remote · Global' },
            ].map(b => (
              <div key={b.text} style={{ display:'flex',alignItems:'center',gap:7 }}>
                <div style={{ width:24,height:24,borderRadius:6,background:T.glass,border:`0.5px solid ${T.line}`,display:'flex',alignItems:'center',justifyContent:'center' }}>{b.icon}</div>
                <span style={{ fontFamily:T.body,fontSize:12,color:T.muted }}>{b.text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Next batch badge */}
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.8,duration:0.6 }}
        style={{ position:'absolute',bottom:32,left:'50%',transform:'translateX(-50%)',
          display:'flex',alignItems:'center',gap:8,background:`rgba(240,165,0,0.10)`,border:`0.5px solid ${T.goldB}`,borderRadius:100,padding:'8px 20px',
        }}
      >
        <motion.div animate={{ opacity:[1,0.3,1] }} transition={{ duration:1.3,repeat:Infinity }}
          style={{ width:6,height:6,borderRadius:'50%',background:T.gold,boxShadow:`0 0 8px ${T.gold}` }}
        />
        <span style={{ fontFamily:T.mono,fontSize:10,color:T.gold,letterSpacing:'0.12em',textTransform:'uppercase' }}>Next Batch: Saturday &amp; Sunday @ 11:00 AM IST · Limited Seats</span>
      </motion.div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════
   STAT BAR
══════════════════════════════════════════════════════════════════════════════ */
function Counter({ end, suffix='' }: { end:number;suffix?:string }) {
  const [val, setVal] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true) },{ threshold:0.3 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  useEffect(() => {
    if (!started) return
    const dur = 2000; let start: number|null = null
    const tick = (ts: number) => {
      if (!start) start = ts
      const p = Math.min((ts-start)/dur,1)
      const ease = 1-Math.pow(1-p,4)
      setVal(Math.floor(ease*end))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  },[started,end])
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>
}

const STATS = [
  {
    n: 1200,
    s: '+',
    label: 'Students Trained',
    sub: 'Past 12 Months'
  },
  {
    n: 3500,
    s: '+',
    label: 'Projects Delivered',
    sub: 'Real Client Work'
  },
  {
    n: 120,
    s: '+',
    label: 'Hiring Companies',
    sub: 'Worldwide'
  },
  {
    n: 27,
    s: '+',
    label: 'Countries',
    sub: 'Global Presence'
  }
]

export function StatBar() {
  return (
    <div style={{ position:'relative',background:T.lift,overflow:'hidden',borderTop:`0.5px solid ${T.line}`,borderBottom:`0.5px solid ${T.line}` }}>
      <div style={{ maxWidth:1200,margin:'0 auto',padding:'0 32px' }}>
        <div className="clc-grid-3" style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)' }}>
          {STATS.map((s,i) => (
            <motion.div key={s.label} initial={{ opacity:0,y:16 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }} transition={{ delay:i*0.08,duration:0.6,ease:[0.16,1,0.3,1] }}
              style={{ position:'relative',padding:'32px 16px',textAlign:'center',borderRight:i<4?`0.5px solid ${T.line}`:'none' }}
            >
              <motion.div initial={{ scaleX:0 }} whileInView={{ scaleX:1 }} viewport={{ once:true }} transition={{ delay:0.3+i*0.08,duration:0.8 }}
                style={{ position:'absolute',top:0,left:'20%',right:'20%',height:1,background:`linear-gradient(90deg,transparent,${T.violet},transparent)`,transformOrigin:'left' }}
              />
              <div style={{ fontFamily:T.display,fontSize:40,fontWeight:600,letterSpacing:'-0.03em',lineHeight:1,color:T.hi,marginBottom:6 }}>
                <Counter end={s.n} suffix={s.s}/>
              </div>
              <div style={{ fontFamily:T.body,fontSize:12,color:T.hi,fontWeight:500,marginBottom:3 }}>{s.label}</div>
              <div style={{ fontFamily:T.mono,fontSize:9,color:T.muted,letterSpacing:'0.08em',textTransform:'uppercase' }}>{s.sub}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════
   ABOUT / ECOSYSTEM
══════════════════════════════════════════════════════════════════════════════ */
const ECO = [
  { icon:BookOpen,   title:'InternX–AI',        tag:'Core Accelerator', desc:'6-month real-world Agentic AI internship with live startup projects, ResumeNFT proof, and global hiring access.',        scheme:'violet' as const },
  { icon:Briefcase,  title:'HireX Portal',       tag:'Exclusive · CLC Only', desc:'120+ global companies actively sourcing from CLC graduates. AI-matched shortlisting based on real project output.',  scheme:'mint'   as const },
  { icon:TrendingUp, title:'FreelanceX',          tag:'Earn While Learning', desc:'Exclusively for CLC candidates. Fund your EMIs through real freelance AI projects — chatbots to enterprise RAG.', scheme:'gold'   as const },
  { icon:Link2,      title:'ResumeNFT',           tag:'Blockchain Verified', desc:'Tamper-proof credentials minted on-chain. GitHub + LinkedIn verified — 100% visible to global recruiters.',         scheme:'violet' as const },
  { icon:Brain,      title:'AigenX Coach',        tag:'24×7 AI Mentor',   desc:'Your personal AI mentor tracking progress, unblocking doubts, adapting to your pace — never alone.',                   scheme:'mint'   as const },
  { icon:Building2,  title:'Enterprise SaaS',     tag:'Real Client Work',  desc:'Your projects solve live client problems. Real companies, real stakes, real résumé impact globally.',                   scheme:'gold'   as const },
]

const BUSINESS_DIVS = [
  { label:'AI Learning Programs', color:T.violet },
  { label:'Internship Placements', color:T.mint },
  { label:'Enterprise AI Services', color:T.gold },
  { label:'SaaS Platforms', color:T.cyan },
  { label:'Hiring Infrastructure', color:'#F43F5E' },
  { label:'Industry Partnerships', color:'#8B5CF6' },
]

export function About() {
  return (
    <section id="about" style={{ position:'relative',background:T.void,overflow:'hidden',padding:'110px 0 120px' }}>
      <Noise/>
      <GridLines/>
      <Orb color={T.violet} x="80%" y="30%" size={600} opacity={0.07}/>
      <Orb color={T.mint}   x="10%" y="70%" size={400} opacity={0.05}/>

      <div style={{ maxWidth:1200,margin:'0 auto',padding:'0 32px',position:'relative',zIndex:2 }}>
        

        <FadeIn><SectionLabel>About Career Lab Consulting</SectionLabel></FadeIn>

        <div className="clc-grid-2" style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:72,alignItems:'start' }}>
          {/* LEFT */}
          <FadeIn delay={0.05}>
            <Display>India's Premier<br/><Grad>AI Career Engine</Grad></Display>
            <Rule/>
            <p style={{ fontFamily:T.body,fontSize:15.5,lineHeight:1.8,color:T.mid,fontWeight:300,maxWidth:480,margin:'0 0 20px' }}>
              Career Lab Consulting is an <strong style={{ color:T.hi,fontWeight:500 }}>ISO 27001 Certified MNC</strong> operating across <strong style={{ color:T.hi,fontWeight:500 }}>27 countries</strong> since 2019. We don't teach theory — we manufacture <strong style={{ color:T.hi,fontWeight:500 }}>verifiable proof-of-work</strong> that global employers trust when AI is doing everyone else's job.
            </p>
            <div style={{ display:'flex',flexWrap:'wrap',gap:8,marginBottom:24 }}>
              <Tag scheme="violet"><Award size={9}/>ISO 27001 Certified</Tag>
              <Tag scheme="mint"><Globe size={9}/>27 Countries</Tag>
              <Tag scheme="gold"><Zap size={9}/>MNC Since 2019</Tag>
            </div>

            {/* Quote */}
            <div style={{ position:'relative',padding:'22px 26px',borderLeft:`2px solid ${T.violet}`,background:'linear-gradient(135deg,rgba(124,58,237,0.06) 0%,transparent 100%)',borderRadius:'0 12px 12px 0',marginBottom:20 }}>
              <div style={{ position:'absolute',top:14,left:24,fontFamily:T.display,fontSize:56,lineHeight:1,color:T.violet,opacity:0.15,userSelect:'none' }}>"</div>
              <p style={{ fontFamily:T.display,fontSize:16,fontWeight:500,lineHeight:1.6,color:T.mid,margin:'0 0 12px',fontStyle:'italic',position:'relative',zIndex:1 }}>
                If AI can do the work, your proof of work must speak louder than your résumé.
              </p>
              <div style={{ fontFamily:T.mono,fontSize:11,color:'#A78BFA',letterSpacing:'0.08em' }}>— Career Lab Consulting</div>
            </div>

            {/* CIN */}
            <motion.div whileHover={{ borderColor:T.mintB }} transition={{ duration:0.2 }}
              style={{ padding:'13px 18px',background:T.glass,border:`0.5px solid ${T.line}`,borderRadius:12,display:'flex',alignItems:'center',justifyContent:'space-between',gap:16,marginBottom:20 }}
            >
              <div style={{ fontFamily:T.mono,fontSize:9,color:T.muted,letterSpacing:'0.1em',textTransform:'uppercase' }}>CIN No.</div>
              <div style={{ fontFamily:T.mono,fontSize:11,color:T.mint,letterSpacing:'0.08em',flex:1,textAlign:'center' }}>U80903HR2019PTC084310</div>
              <ShieldCheck size={13} color={T.mint}/>
            </motion.div>

            {/* Business Divisions */}
            <div style={{ background:T.glass,border:`0.5px solid ${T.line}`,borderRadius:14,padding:'18px 20px' }}>
              <div style={{ fontFamily:T.display,fontSize:12,fontWeight:600,color:T.hi,marginBottom:14,display:'flex',alignItems:'center',gap:6 }}>
                <Layers size={12} color={T.mint}/> Complete Business Ecosystem
              </div>
              <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:7 }}>
                {BUSINESS_DIVS.map(d => (
                  <div key={d.label} style={{ display:'flex',alignItems:'center',gap:6,fontFamily:T.body,fontSize:11.5,color:T.mid }}>
                    <div style={{ width:5,height:5,borderRadius:'50%',background:d.color,flexShrink:0,boxShadow:`0 0 5px ${d.color}` }}/>
                    {d.label}
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* RIGHT */}
          <FadeIn delay={0.15}>
            <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:12 }}>
              {ECO.map((b,i) => {
                const Icon = b.icon
                const accent = b.scheme==='violet'?T.violet:b.scheme==='mint'?T.mint:T.gold
                const accentLo = b.scheme==='violet'?T.violetLo:b.scheme==='mint'?T.mintLo:T.goldLo
                const accentB = b.scheme==='violet'?T.violetB:b.scheme==='mint'?T.mintB:T.goldB
                return (
                  <motion.div key={b.title} initial={{ opacity:0,y:20,scale:0.96 }} whileInView={{ opacity:1,y:0,scale:1 }} whileHover={{ y:-4,background:'rgba(255,255,255,0.046)' }} viewport={{ once:true }} transition={{ delay:0.05*i,duration:0.55,ease:[0.16,1,0.3,1] }}
                    style={{ background:T.glass,border:`0.5px solid ${T.line}`,borderRadius:14,padding:'18px 16px',cursor:'default',position:'relative',overflow:'hidden' }}
                  >
                    <div style={{ position:'absolute',bottom:-16,right:-16,width:70,height:70,background:`radial-gradient(circle,${accent} 0%,transparent 70%)`,opacity:0.14,pointerEvents:'none' }}/>
                    <div style={{ width:32,height:32,borderRadius:8,background:accentLo,border:`0.5px solid ${accentB}`,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:12 }}>
                      <Icon size={14} color={accent}/>
                    </div>
                    <div style={{ fontFamily:T.mono,fontSize:8,letterSpacing:'0.12em',textTransform:'uppercase',color:accent,opacity:0.85,marginBottom:5 }}>{b.tag}</div>
                    <div style={{ fontFamily:T.display,fontSize:13,fontWeight:600,color:T.hi,marginBottom:6 }}>{b.title}</div>
                    <div style={{ fontFamily:T.body,fontSize:11.5,color:T.muted,lineHeight:1.6 }}>{b.desc}</div>
                  </motion.div>
                )
              })}
            </div>
            {/* Stats strip */}
            <div style={{ marginTop:12,display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10 }}>
              {[['15K+','Students'],['88%','Hired'],['27','Countries']].map(([n,l]) => (
                <div key={l} style={{ background:T.glass,border:`0.5px solid ${T.line}`,borderRadius:11,padding:'14px',textAlign:'center' }}>
                  <div style={{ fontFamily:T.display,fontSize:22,fontWeight:600,color:T.hi,letterSpacing:'-0.02em',lineHeight:1,backgroundImage:`linear-gradient(135deg,${T.hi} 0%,${T.mid} 100%)`,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text' }}>{n}</div>
                  <div style={{ fontFamily:T.mono,fontSize:9,color:T.muted,letterSpacing:'0.10em',textTransform:'uppercase',marginTop:4 }}>{l}</div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════
   PROGRAM / CURRICULUM
══════════════════════════════════════════════════════════════════════════════ */
// const TECH_CUR = [
//   { period:'Month 1–3',  ext:false, title:'Python, OOP & NLP Foundations',   desc:'Python mastery, OOP, RESTful APIs, web scraping, Pandas/NumPy pipelines, NLP architectures, embeddings, TF-IDF, semantic search, NLTK, spaCy.', tags:['Python','FastAPI','Pandas','NLP','spaCy','REST APIs'] },
//   { period:'Month 4–6',  ext:false, title:'LLMs, Agents & Capstone Sprint',  desc:'OpenAI/Claude/Gemini APIs, RAG, ChromaDB/FAISS/Pinecone, LangChain, LangGraph, ReAct, Multi-Agent Systems. Capstone: Fully Autonomous SEO Agent on cloud.', tags:['LangChain','RAG','ChromaDB','Docker','CI/CD','LangGraph'] },
//   { period:'Month 7–9',  ext:true,  title:'Advanced ML Engineering',         desc:'Advanced Extension — sklearn, HuggingFace Transformers, LoRA fine-tuning, distributed system design, FastAPI agent APIs, cloud deployment on AWS/GCP.', tags:['HuggingFace','LoRA','Redis','Kafka','AWS','GCP'] },
//   { period:'Month 10–12',ext:true,  title:'MLOps, Product & Enterprise AI',  desc:'Advanced Extension — Kubernetes, Prometheus/Grafana, LangSmith observability, AI Ethics/GDPR, Startup Sprint: micro-SaaS MVP, Enterprise Multi-Agent Platform.', tags:['Kubernetes','MLOps','AI Ethics','LangSmith','SaaS'] },
// ]

const TECH_CUR = [
  {
    period: 'Months 1–3: Phase 1',
    ext: false,
    title: 'Python Engineering Foundations',
    desc: 'Python programming, OOP, data structures, JSON, APIs, web scraping, Pandas, NumPy, automation workflows and software engineering fundamentals.',
    tags: [
      'Python',
      'OOP',
      'REST APIs',
      'Web Scraping',
      'Pandas',
      'NumPy'
    ]
  },

  {
    period: 'Months 4–6: Phase 2',
    ext: false,
    title: 'NLP, RAG & Autonomous Agents',
    desc: 'NLP pipelines, embeddings, vector databases, semantic search, RAG systems, LangChain, LangGraph, agent memory, tool calling and autonomous SEO Agent Capstone.',
    tags: [
      'NLP',
      'RAG',
      'FAISS',
      'ChromaDB',
      'LangChain',
      'LangGraph'
    ]
  },

  {
    period: 'Months 7–9: Phase 3',
    ext: true,
    title: 'Advanced AI Engineering',
    desc: 'Transformers, HuggingFace ecosystem, LoRA fine-tuning, model serving, distributed architectures, FastAPI microservices and cloud-native deployment.',
    tags: [
      'Transformers',
      'HuggingFace',
      'LoRA',
      'FastAPI',
      'AWS',
      'GCP'
    ]
  },

  {
    period: 'Months 10–12: Phase 4',
    ext: true,
    title: 'Enterprise AI & MLOps',
    desc: 'Production AI systems, Kubernetes, observability, CI/CD, LangSmith, monitoring, governance, AI compliance and enterprise multi-agent platforms.',
    tags: [
      'Kubernetes',
      'MLOps',
      'LangSmith',
      'Docker',
      'CI/CD',
      'Enterprise AI'
    ]
  }
]

// const NOCODE_CUR = [
//   { period:'Week 1–5',   ext:false, title:'Digital Literacy & AI Basics',   desc:'ChatGPT, Claude, Perplexity mastery, Notion AI, Google Colab basics, prompt engineering fundamentals, digital workspace setup.', tags:['ChatGPT','Claude','Notion AI','Prompt Eng','Google Colab'] },
//   { period:'Week 6–14',  ext:false, title:'Automation & Agent Building',    desc:'n8n, Make.com, Zapier workflow automation, webhooks, Relevance AI visual agent construction, Voiceflow, Airtable, SerpAPI, SurferSEO, Ahrefs content automation.', tags:['n8n','Make.com','Zapier','Relevance AI','Voiceflow','Airtable'] },
//   { period:'Week 15–26', ext:false, title:'Full Agent System & Capstone',   desc:'Autonomous SEO Agency: keyword → content → publish → monitor. Looker Studio dashboards, Webflow deployment, Softr client portals, cloud delivery.', tags:['Looker Studio','Softr','Webflow','SurferSEO','Airtable'] },
//   { period:'Month 7–12', ext:true,  title:'Advanced No-Code & AI Agency',   desc:'Advanced Extension — Multi-client agent platform, AI Business Strategy, No-Code SaaS architecture, AI-powered SEO Agency Platform, global market expansion.', tags:['SaaS','No-Code','Strategy','Global Market','Stripe'] },
// ]

const NOCODE_CUR = [
  {
    period: 'Months 1–3: Phase 1',
    ext: false,
    title: 'AI Productivity & Prompt Engineering',
    desc: 'ChatGPT, Claude, Gemini, Perplexity, prompt engineering, knowledge management, AI-assisted research and digital workflow systems.',
    tags: [
      'ChatGPT',
      'Claude',
      'Gemini',
      'Perplexity',
      'Prompt Engineering'
    ]
  },

  {
    period: 'Months 4–6: Phase 2',
    ext: false,
    title: 'Automation & AI Agent Systems',
    desc: 'n8n, Make.com, Zapier, Voiceflow, Relevance AI, Airtable and complete SEO Automation Agency Capstone.',
    tags: [
      'n8n',
      'Make.com',
      'Zapier',
      'Voiceflow',
      'Relevance AI',
      'Airtable'
    ]
  },

  {
    period: 'Months 7–9: Phase 3',
    ext: true,
    title: 'No-Code SaaS & Client Delivery',
    desc: 'Webflow, Softr, client portals, analytics dashboards, Stripe integrations and scalable business workflows.',
    tags: [
      'Webflow',
      'Softr',
      'Stripe',
      'Looker Studio',
      'Automation'
    ]
  },

  {
    period: 'Months 10–12: Phase 4',
    ext: true,
    title: 'AI Agency & Business Scaling',
    desc: 'Multi-client systems, agency operations, AI consulting, productized services, SaaS monetization and international market expansion.',
    tags: [
      'Agency',
      'SaaS',
      'Strategy',
      'Growth',
      'Global Expansion'
    ]
  }
]

const SCH = [
  ['Sessions', '8:00 PM – 10:00 PM IST · Mon–Sat'],
  ['Format', 'Live Theory + Practical Training'],
  ['Mode', '100% Online · Remote-First'],
  ['Mentorship', 'Weekly 1:1 (Elite Plan)'],
  ['Assessment', '65–70% Minimum Pass Requirement'],
]

const DOMAINS = ['FinTech','EdTech','HealthTech','E-commerce','HRTech','Research AI','GovTech','D2C & SaaS','NLP / LLM Eng','Custom Pitch']

export function Program() {
  const [track, setTrack] = useState<'tech'|'nocode'>('tech')
  const items = track === 'tech' ? TECH_CUR : NOCODE_CUR

  return (
    <section id="program" style={{ position:'relative',background:T.ink,overflow:'hidden',padding:'110px 0 120px' }}>
      <Noise/>
      <GridLines/>
      <Orb color={T.mint}   x="90%" y="20%" size={500} opacity={0.06}/>
      <Orb color={T.violet} x="5%"  y="80%" size={500} opacity={0.06}/>

      <div style={{ maxWidth:1200,margin:'0 auto',padding:'0 32px',position:'relative',zIndex:2 }}>
      
        <FadeIn>
          <SectionLabel>Curriculum — 6 &amp; 12 Month Programs</SectionLabel>
          <Display>One Journey.<br/><Grad>Infinite Outcomes.</Grad></Display>
          <Rule/>
          <p style={{ fontFamily:T.body,fontSize:15.5,lineHeight:1.8,color:T.mid,fontWeight:300,maxWidth:560,margin:'0 0 16px' }}>
            The <strong style={{ color:T.hi,fontWeight:500 }}>6-month program</strong> is your foundation. Months 7–12 are the <strong style={{ color:T.gold,fontWeight:500 }}>Advanced Extension</strong> — a continuous journey, not a separate course. Theory &amp; practicals run <strong style={{ color:T.hi,fontWeight:500 }}>8–10 PM IST</strong>, Mon–Sat, with weekend demo batches at 11 AM IST.
          </p>
          {/* Advanced extension note */}
          <div style={{ display:'inline-flex',alignItems:'center',gap:8,background:T.goldLo,border:`0.5px solid ${T.goldB}`,borderRadius:10,padding:'10px 16px',marginBottom:28 }}>
            <Star size={12} color={T.gold}/>
            <span style={{ fontFamily:T.body,fontSize:12.5,color:T.gold }}>Months 7–12 begin right after 6-month completion — same program, advanced journey</span>
          </div>
        </FadeIn>

        {/* Toggle */}
        <FadeIn delay={0.1}>
          <div style={{ display:'flex',alignItems:'center',gap:16,marginBottom:44,flexWrap:'wrap' }}>
            <div style={{ position:'relative',display:'flex',background:T.glass,border:`0.5px solid ${T.line}`,borderRadius:12,padding:4,gap:2 }}>
              {(['tech','nocode'] as const).map(t => (
                <button key={t} onClick={() => setTrack(t)} style={{ position:'relative',padding:'9px 22px',borderRadius:9,border:'none',cursor:'pointer',fontFamily:T.body,fontSize:13,fontWeight:500,zIndex:1,background:track===t?T.violet:'transparent',color:track===t?'#fff':T.muted,transition:'all 0.25s cubic-bezier(0.16,1,0.3,1)' }}>
                  {t==='tech'?'⟨/⟩ Technical Track':'⬡ No-Code Track'}
                </button>
              ))}
            </div>
            <div style={{ display:'flex',gap:8,flexWrap:'wrap' }}>
              <Tag scheme="violet">234 hrs · 6 months</Tag>
              <Tag scheme="gold">468 hrs · 12 months</Tag>
              <Tag scheme="mint">8–10 PM IST · Flexible</Tag>
              <Tag scheme="cyan">Choice-Based Projects</Tag>
            </div>
          </div>
        </FadeIn>

        <div className="clc-grid-2" style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:48,alignItems:'start' }}>
          {/* TIMELINE */}
          <FadeIn delay={0.2}>
            <AnimatePresence mode="wait">
              <motion.div key={track} initial={{ opacity:0,x:-20 }} animate={{ opacity:1,x:0 }} exit={{ opacity:0,x:20 }} transition={{ duration:0.3 }}>
                {items.map((u,i) => (
                  <div key={i} style={{ display:'flex',gap:20,position:'relative',paddingBottom:i<items.length-1?36:0 }}>
                    {i < items.length-1 && (
                      <div style={{ position:'absolute',left:18,top:38,bottom:0,width:1,background:u.ext?`linear-gradient(${T.gold}80,transparent)`:`linear-gradient(${T.violet}80,transparent)` }}/>
                    )}
                    {/* Node */}
                    <div style={{ flexShrink:0,width:36,height:36,borderRadius:'50%',zIndex:1,background:u.ext?`linear-gradient(135deg,${T.gold},${T.violet})`:T.violetLo,border:u.ext?'none':`1px solid ${T.violetB}`,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:u.ext?`0 0 16px ${T.gold}40`:`0 0 12px ${T.violet}30` }}>
                      <span style={{ fontFamily:T.mono,fontSize:12,fontWeight:500,color:u.ext?'#fff':'#A78BFA' }}>{i+1}</span>
                    </div>
                    {/* Content */}
                    <div style={{ flex:1,paddingTop:2 }}>
                      <div style={{ display:'flex',alignItems:'center',gap:8,marginBottom:5,flexWrap:'wrap' }}>
                        <span style={{ fontFamily:T.mono,fontSize:10,letterSpacing:'0.10em',textTransform:'uppercase',color:u.ext?T.gold:T.muted }}>{u.period}</span>
                        {u.ext && <Tag scheme="gold">Advanced Extension</Tag>}
                      </div>
                      <div style={{ fontFamily:T.display,fontSize:14,fontWeight:600,color:T.hi,marginBottom:7,lineHeight:1.3 }}>{u.title}</div>
                      <div style={{ fontFamily:T.body,fontSize:12.5,color:T.muted,lineHeight:1.65,marginBottom:10 }}>{u.desc}</div>
                      <div style={{ display:'flex',flexWrap:'wrap',gap:5 }}>
                        {u.tags.map(t => (
                          <span key={t} style={{ fontFamily:T.mono,fontSize:9,padding:'3px 8px',borderRadius:100,background:'rgba(255,255,255,0.04)',border:`0.5px solid ${T.ghost}`,color:T.muted,letterSpacing:'0.05em' }}>{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </FadeIn>

          {/* RIGHT CARDS */}
          <FadeIn delay={0.3}>
            <div style={{ display:'flex',flexDirection:'column',gap:14 }}>
              {/* Capstone */}
              <div style={{ position:'relative',overflow:'hidden',borderRadius:16,border:`0.5px solid ${T.violetB}`,padding:'22px',background:`linear-gradient(135deg,rgba(124,58,237,0.10) 0%,rgba(255,255,255,0.02) 100%)` }}>
                <div style={{ position:'absolute',top:0,right:0,width:100,height:100,background:`radial-gradient(circle at top right,${T.violet}30,transparent 70%)`,pointerEvents:'none' }}/>
                <div style={{ display:'flex',alignItems:'center',gap:12,marginBottom:14 }}>
                  <div style={{ width:38,height:38,borderRadius:10,background:T.violetLo,border:`0.5px solid ${T.violetB}`,display:'flex',alignItems:'center',justifyContent:'center' }}>
                    <Rocket size={16} color="#A78BFA"/>
                  </div>
                  <div>
                    <div style={{ fontFamily:T.display,fontSize:14,fontWeight:600,color:T.hi }}>Capstone Project</div>
                    <div style={{ fontFamily:T.mono,fontSize:9,color:'#A78BFA',letterSpacing:'0.08em' }}>Fully Autonomous SEO Agent System</div>
                  </div>
                </div>
                <p style={{ fontFamily:T.body,fontSize:12.5,color:T.mid,lineHeight:1.7,margin:'0 0 14px' }}>
                  Build, deploy and present a production-ready autonomous AI agent: keyword research → content generation → CMS auto-publishing → rank monitoring. Dockerized, cloud-deployed, GitHub-verified, live demo to panel.
                </p>
                <div style={{ display:'flex',flexWrap:'wrap',gap:7 }}>
                  <Tag scheme="violet">Live Demo · 15 min</Tag>
                  <Tag scheme="mint">GitHub Verified</Tag>
                  <Tag scheme="gold">ResumeNFT Minted</Tag>
                </div>
              </div>

              {/* Domain choices */}
              <div style={{ background:T.glass,border:`0.5px solid ${T.line}`,borderRadius:14,padding:'18px 20px',borderLeft:`1.5px solid ${T.mint}` }}>
                <div style={{ fontFamily:T.display,fontSize:12,fontWeight:600,color:T.hi,marginBottom:13,display:'flex',alignItems:'center',gap:7 }}>
                  <Layers size={13} color={T.mint}/> Choice-Based Project Domains
                </div>
                <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:6 }}>
                  {DOMAINS.map(p => (
                    <div key={p} style={{ background:'rgba(16,245,160,0.04)',border:`0.5px solid ${T.line}`,borderRadius:7,padding:'7px 11px',fontSize:11.5,fontWeight:500,fontFamily:T.body,color:T.mid,display:'flex',alignItems:'center',gap:5 }}>
                      <div style={{ width:4,height:4,borderRadius:'50%',background:T.mint,flexShrink:0 }}/>{p}
                    </div>
                  ))}
                </div>
              </div>

              {/* Schedule */}
              <div style={{ background:T.glass,border:`0.5px solid ${T.line}`,borderRadius:14,padding:'18px 20px',borderLeft:`1.5px solid ${T.gold}` }}>
                <div style={{ fontFamily:T.display,fontSize:12,fontWeight:600,color:T.gold,marginBottom:13,display:'flex',alignItems:'center',gap:7 }}>
                  <Calendar size={13} color={T.gold}/> Schedule &amp; Format
                </div>
                {SCH.map(([k,v],i) => (
                  <div key={k} style={{ display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 0',borderBottom:i<SCH.length-1?`0.5px solid ${T.line}`:'none' }}>
                    <span style={{ fontFamily:T.body,fontSize:12,color:T.muted }}>{k}</span>
                    <span style={{ fontFamily:T.body,fontSize:12,fontWeight:500,color:T.mid }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════
   TECH STACK
══════════════════════════════════════════════════════════════════════════════ */

const TECH_TOOLS = [
  {
    name: 'Python',
    color: '#3572A5',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/250px-Python-logo-notext.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail&_=20250701090410'
  },
  {
    name: 'FastAPI',
    color: '#059669',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/FastAPI_logo.svg/1280px-FastAPI_logo.svg.png?_=20240902201856'
  },
  {
    name: 'OpenAI GPT',
    color: '#10A37F',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/OpenAI_Logo.svg/1280px-OpenAI_Logo.svg.png?_=20230731013808'
  },
  {
    name: 'LangChain',
    color: '#1C78E5',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/6/60/LangChain_Logo.svg'
  },
  {
    name: 'LangGraph',
    color: '#7C3AED',
    logo: 'https://raw.githubusercontent.com/lobehub/lobe-icons/refs/heads/master/packages/static-png/dark/langgraph-color.png'
  },
  {
    name: 'ChromaDB',
    color: '#F47B20',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Chroma-logo-bu.png'
  },
  {
    name: 'FAISS',
    color: '#0467DF',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/FIS_logo.svg/3840px-FIS_logo.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail'
  },
  {
    name: 'Pinecone',
    color: '#0ABAB5',
    logo: 'https://vectorseek.com/wp-content/uploads/2023/09/Pinecone-Icon-Logo-Vector.svg-.png'
  },
  {
    name: 'Hugging Face',
    color: '#FFD21E',
    logo: 'https://huggingface.co/datasets/huggingface/brand-assets/resolve/0fd14cd6eca1024a487427db8d52ce5d10b3a321/hg-logo.png'
  },
  {
    name: 'Docker',
    color: '#2496ED',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Docker-svgrepo-com.svg/1280px-Docker-svgrepo-com.svg.png'
  },
  {
    name: 'AWS',
    color: '#FF9900',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/960px-Amazon_Web_Services_Logo.svg.png?_=20170912170050'
  },
  {
    name: 'LangSmith',
    color: '#F97316',
    logo: 'https://vectorseek.com/wp-content/uploads/2026/01/LangSmith-Logo-PNG-SVG-Vector-01.png'
  },
  {
    name: 'CrewAI',
    color: '#FF4B4B',
    logo: 'https://images.seeklogo.com/logo-png/61/2/crew-ai-logo-png_seeklogo-619843.png'
  },
  {
    name: 'Scikit Learn',
    color: '#F89939',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Scikit_learn_logo_small.svg/3840px-Scikit_learn_logo_small.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail'
  },
  {
    name: 'GitHub Actions',
    color: '#00B4D8',
    logo: 'https://avatars.githubusercontent.com/u/44036562?s=280&v=4'
  },
  {
    name: 'Streamlit',
    color: '#FF4B4B',
    logo: 'https://images.seeklogo.com/logo-png/44/2/streamlit-logo-png_seeklogo-441815.png'
  }
]

interface Tool {
  name: string
  color: string
  logo: string
}

const NOCODE_TOOLS: Tool[] = [
  {
    name: "n8n",
    color: "#EA4B71",
    logo: "https://cdn.simpleicons.org/n8n"
  },
  {
    name: "Make",
    color: "#6D00CC",
    logo: "https://cdn.simpleicons.org/make"
  },
  {
    name: "Zapier",
    color: "#FF4A00",
    logo: "https://cdn.simpleicons.org/zapier"
  },
  {
    name: "Relevance AI",
    color: "#2563EB",
    logo: "https://cdn.simpleicons.org/openai"
  },
  {
    name: "Voiceflow",
    color: "#64FFDA",
    logo: "https://cdn.simpleicons.org/voiceflow"
  },
  {
    name: "Airtable",
    color: "#18BFFF",
    logo: "https://cdn.simpleicons.org/airtable"
  },
  {
    name: "Looker Studio",
    color: "#4285F4",
    logo: "https://cdn.simpleicons.org/google"
  },
  {
    name: "Surfer SEO",
    color: "#00D4AA",
    logo: "https://cdn.simpleicons.org/surfshark"
  },
  {
    name: "ChatGPT",
    color: "#19C37D",
    logo: "https://cdn.simpleicons.org/openai"
  },
  {
    name: "Webflow",
    color: "#4353FF",
    logo: "https://cdn.simpleicons.org/webflow"
  },
  {
    name: "Softr",
    color: "#FF6B6B",
    logo: "https://assets.softr-files.com/applications/brand/softr-logo.svg"
  },
  {
    name: "Gradio",
    color: "#F97316",
    logo: "https://cdn.simpleicons.org/gradio"
  }
]

const AGENT_STEPS = [
  { label:'SERP Research',  sub:'SerpAPI + scraper',   color:T.violet },
  { label:'NLP Analysis',   sub:'LLM + embeddings',    color:'#A855F7' },
  { label:'Content Gen',    sub:'GPT-4o + templates',  color:T.mint },
  { label:'Score & Rank',   sub:'vs competitors',      color:T.gold },
  { label:'Auto-Publish',   sub:'WordPress / Webflow', color:'#06B6D4' },
  { label:'Alert & Monitor',sub:'Slack + email alerts',color:'#F43F5E' },
]

export function TechStack() {
  const [tab, setTab] = useState<'tech'|'nocode'>('tech')
  const tools = tab === 'tech' ? TECH_TOOLS : NOCODE_TOOLS

  return (
    <section id="techstack" style={{ position:'relative',background:T.void,overflow:'hidden',padding:'110px 0 120px' }}>
      <Noise/>
      <GridLines/>
      <Orb color={T.gold}   x="85%" y="60%" size={500} opacity={0.06}/>
      <Orb color={T.violet} x="15%" y="30%" size={400} opacity={0.07}/>

      <div style={{ maxWidth:1200,margin:'0 auto',padding:'0 32px',position:'relative',zIndex:2 }}>

        <FadeIn>
          <SectionLabel>Tools &amp; Tech Stack</SectionLabel>
          <Display>Industry Tools,<br/><Grad>From Day One.</Grad></Display>
          <Rule/>
          <p style={{ fontFamily:T.body,fontSize:15.5,lineHeight:1.8,color:T.mid,fontWeight:300,maxWidth:520,margin:'0 0 32px' }}>
            Every tool you learn is in active use by enterprise AI teams. No toy datasets, no fake projects — real platforms, real pipelines, real résumé material that global employers recognise.
          </p>
        </FadeIn>

        {/* Tab */}
        <FadeIn delay={0.1}>
          <div style={{ display:'inline-flex',background:T.glass,border:`0.5px solid ${T.line}`,borderRadius:12,padding:4,gap:2,marginBottom:36 }}>
            {(['tech','nocode'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ padding:'9px 24px',borderRadius:9,border:'none',cursor:'pointer',fontFamily:T.body,fontSize:13,fontWeight:500,background:tab===t?T.violet:'transparent',color:tab===t?'#fff':T.muted,transition:'all 0.25s cubic-bezier(0.16,1,0.3,1)' }}>
                {t==='tech'?'⟨/⟩ Technical Track':'⬡ No-Code Track'}
              </button>
            ))}
          </div>
        </FadeIn>

        {/* Tool grid with icons */}
        <FadeIn delay={0.15}>
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.2 }}>
              <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(110px,1fr))',gap:10,marginBottom:48 }}>
                {tools.map((tool,i) => (
                  <motion.div key={tool.name} initial={{ opacity:0,scale:0.88,y:16 }} animate={{ opacity:1,scale:1,y:0 }} transition={{ delay:i*0.04,duration:0.45,ease:[0.16,1,0.3,1] }} whileHover={{ y:-5,scale:1.04,borderColor:T.violetB }}
                    style={{ background:T.glass,border:`0.5px solid ${T.line}`,borderRadius:14,padding:'16px 10px',display:'flex',flexDirection:'column',alignItems:'center',gap:8,cursor:'default',position:'relative',overflow:'hidden' }}
                  >
                    <div style={{ position:'absolute',bottom:-8,left:'50%',transform:'translateX(-50%)',width:50,height:25,background:`radial-gradient(${tool.color}50,transparent 70%)`,pointerEvents:'none' }}/>
                    {/* Tool icon */}
                    {/* <div style={{ width:40,height:40,borderRadius:10,background:`${tool.color}18`,border:`0.5px solid ${tool.color}40`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20 }}>
                      {tool.icon}
                    </div> */}
                    <div
                      style={{
                        width:48,
                        height:48,
                        borderRadius:12,
                        background:'rgba(255,255,255,0.8)',
                        border:`1px solid ${tool.color}25`,
                        display:'flex',
                        alignItems:'center',
                        justifyContent:'center',
                        backdropFilter:'blur(12px)'
                      }}
                    >
                      {('logo' in tool) ? (
                        <img
                          src={tool.logo}
                          alt={tool.name}
                          style={{
                            width:28,
                            height:28,
                            objectFit:'contain'
                          }}
                        />
                      ) : (<div style={{ width:40,height:40,borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20 }}>
                        
                      </div>
                      )}
                    </div>
                    <div style={{ fontFamily:T.mono,fontSize:9,fontWeight:500,color:T.muted,textAlign:'center',letterSpacing:'0.04em',lineHeight:1.3 }}>{tool.name}</div>
                    <div style={{ width:20,height:2,borderRadius:1,background:tool.color,opacity:0.6 }}/>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </FadeIn>

        {/* Multi-Agent Pipeline */}
        <FadeIn delay={0.3}>
          <div style={{ position:'relative',borderRadius:20,overflow:'hidden',border:`0.5px solid ${T.mintB}`,background:`linear-gradient(135deg,rgba(16,245,160,0.05) 0%,rgba(124,58,237,0.05) 100%)`,padding:'26px 22px' }}>
            <div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:22,flexWrap:'wrap' }}>
              <Workflow size={15} color={T.mint}/>
              <span style={{ fontFamily:T.display,fontSize:14,fontWeight:600,color:T.hi }}>Multi-Agent Architecture You'll Build</span>
              <div style={{ flex:1 }}/>
              <Tag scheme="mint">LangGraph Stateful</Tag>
              <Tag scheme="violet">ReAct Pattern</Tag>
              <Tag scheme="gold">Production Deployed</Tag>
            </div>
            <div style={{ display:'flex',alignItems:'stretch',gap:0,overflowX:'auto',paddingBottom:4 }}>
              {AGENT_STEPS.map((s,i) => (
                <div key={s.label} style={{ display:'flex',alignItems:'center',flexShrink:0 }}>
                  <motion.div whileHover={{ scale:1.04 }} style={{ position:'relative',background:T.glass,border:`0.5px solid ${T.line}`,borderRadius:12,padding:'13px 16px',textAlign:'center',minWidth:118 }}>
                    <div style={{ width:8,height:8,borderRadius:'50%',background:s.color,margin:'0 auto 9px',boxShadow:`0 0 8px ${s.color}` }}/>
                    <div style={{ fontFamily:T.display,fontSize:11,fontWeight:600,color:T.hi,marginBottom:4 }}>{s.label}</div>
                    <div style={{ fontFamily:T.mono,fontSize:8.5,color:T.muted,letterSpacing:'0.04em' }}>{s.sub}</div>
                    <div style={{ position:'absolute',top:7,right:9,fontFamily:T.mono,fontSize:8,color:T.ghost }}>0{i+1}</div>
                  </motion.div>
                  {i < AGENT_STEPS.length-1 && (
                    <div style={{ padding:'0 5px',opacity:0.5 }}>
                      <svg width="18" height="10" viewBox="0 0 18 10"><path d="M0 5h12M9 1l4 4-4 4" stroke={T.mint} strokeWidth="1.5" strokeLinecap="round" fill="none"/></svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <p style={{ marginTop:16,fontFamily:T.body,fontSize:12,color:T.muted,lineHeight:1.65 }}>
              Each agent is fully autonomous — no human intervention needed. Built with LangGraph stateful execution, deployed via Docker on cloud infrastructure. Every step is logged, monitored, observable, and GitHub-verified.
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}