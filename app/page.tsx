'use client'

import { Fragment, useState, useEffect, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Menu, X, ArrowRight, Check, Star, Shield, Globe, Zap, TrendingUp, Users, Award, BookOpen, Target, Briefcase, ChevronRight, ExternalLink, Clock, IndianRupee, FileCheck, Layers } from 'lucide-react'
import Hero from '@/components/Hero'
import {StatBar, About, Program, TechStack} from '@/components/SAPT'
import { Hiring, Pricing, Outcomes, CTA, Footer } from '@/components/HPOC'


const NAV_ITEMS = [
  { label: 'About', id: 'about' },
  { label: 'Program', id: 'program' },
  { label: 'Tech Stack', id: 'techstack' },
  { label: 'Hiring', id: 'hiring' },
  { label: 'Pricing', id: 'pricing' },
  { label: 'Outcomes', id: 'outcomes' },
]

function Logo() {
  return (
    <svg className="nav-logo-mark" viewBox="0 0 36 36" fill="none">
      <rect width="36" height="36" rx="8" fill="url(#lg1)"/>
      <path d="M10 22L18 10L26 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13 18H23" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="18" cy="26" r="2.5" fill="#06b6d4"/>
      <defs>
        <linearGradient id="lg1" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7c3aed"/>
          <stop offset="1" stopColor="#0891b2"/>
        </linearGradient>
      </defs>
    </svg>
  )
}

function Nav({ activeSection }: { activeSection: string }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])

  const scrollTo = (id: string) => {
    setOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-inner">
        <img src="/logo.png" alt="Career Lab Consulting" className="nav-logo w-42" onClick={() => scrollTo('hero')}/>
        <div className={`nav-links ${open ? 'open' : ''}`}>
          {NAV_ITEMS.map(n => (
            <button key={n.id} className={`nav-link ${activeSection === n.id ? 'active' : ''}`} onClick={() => scrollTo(n.id)}>{n.label}</button>
          ))}
          <button className="btn-primary nav-cta" onClick={() => scrollTo('pricing')} style={{fontSize:'13px',padding:'9px 20px'}}>
            Enroll Now <ArrowRight size={14}/>
          </button>
        </div>
        <button className="nav-mobile-btn" onClick={() => setOpen(o => !o)}>
          {open ? <X size={22}/> : <Menu size={22}/>}
        </button>
      </div>
    </nav>
  )
}

// function Footer() {
//   return (
//     <footer className="footer">
//       <div className="container">
//         <div className="footer-grid">
//           <div className="footer-brand">
//             <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'12px'}}>
//               <Logo/>
//               <div>
//                 <div style={{fontFamily:'var(--font-display)',fontWeight:800,fontSize:'16px'}}>Career Lab Consulting</div>
//                 <div style={{fontSize:'11px',color:'var(--purple-hi)',letterSpacing:'0.05em'}}>PRIVATE LIMITED</div>
//               </div>
//             </div>
//             <p>ISO 27001 Certified MNC · CIN: U80903HR2019PTC084310 · DLF Cyber City, Gurugram · 27 Countries</p>
//             <div style={{marginTop:'14px',display:'flex',gap:'8px',flexWrap:'wrap'}}>
//               <span className="badge">ISO 27001</span>
//               <span className="badge cyan">MNC</span>
//               <span className="badge gold">Since 2019</span>
//             </div>
//           </div>
//           <div>
//             <div className="footer-col-title">Program</div>
//             <ul className="footer-links">
//               {['InternX-AI Overview','Technical Track','No-Code Track','Curriculum','Capstone Project'].map(l=><li key={l}><a href="#">{l}</a></li>)}
//             </ul>
//           </div>
//           <div>
//             <div className="footer-col-title">Ecosystem</div>
//             <ul className="footer-links">
//               {['HireX Portal','FreelanceX','ResumeNFT','AigenX Coach','Enterprise Services'].map(l=><li key={l}><a href="#">{l}</a></li>)}
//             </ul>
//           </div>
//           <div>
//             <div className="footer-col-title">Contact</div>
//             <ul className="footer-links">
//               <li><a href="mailto:info@careerlabconsulting.com">info@careerlabconsulting.com</a></li>
//               <li><a href="tel:+918700236923">+91-8700236923</a></li>
//               <li><a href="https://careerlabconsulting.com" target="_blank" rel="noopener noreferrer">careerlabconsulting.com</a></li>
//               <li><a href="#">WhatsApp Community</a></li>
//             </ul>
//           </div>
//         </div>
//         <div className="footer-bottom">
//           <p>© 2025 Career Lab Consulting Pvt. Ltd. All rights reserved.</p>
//           <div style={{display:'flex',gap:'12px',alignItems:'center',flexWrap:'wrap'}}>
//             <span className="iso-badge">✓ ISO 27001 Certified</span>
//             <p style={{fontSize:'13px',color:'var(--text3)'}}>Privacy Policy · Terms · Refund Policy</p>
//           </div>
//         </div>
//       </div>
//     </footer>
//   )
// }

// ─── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id) })
      },
      { threshold: 0.3 }
    )
    NAV_ITEMS.forEach(n => {
      const el = document.getElementById(n.id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

  return (
    <>
      <div className="noise"/>
      <Nav activeSection={activeSection}/>
      <main>
        <Hero/>
        <StatBar/>
        <About/>
        <Program/>
        <TechStack/>
        <Hiring/>
        <Pricing/>
        <Outcomes/>
        <CTA/>
      </main>
      <Footer/>
    </>
  )
}