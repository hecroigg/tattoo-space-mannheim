import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { ArrowDown, ArrowUpRight, Check, Instagram, Mail, MapPin, Menu, MessageCircle, X } from 'lucide-react'
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { business, equipment, images, rates, reviews, type RateGroup } from './data/business'
import { translations, type Language } from './i18n/translations'

const TattooMachine = lazy(() => import('./components/three/TattooMachine'))

const navIds = ['space', 'included', 'rates', 'artists', 'reviews', 'location']
const equipmentKeys = Object.keys(equipment) as Array<keyof typeof equipment>

function ExternalButton({ href, children, kind = 'primary', cursor = 'BOOK ↗' }: { href: string; children: React.ReactNode; kind?: 'primary' | 'ghost' | 'dark'; cursor?: string }) {
  return (
    <a className={`button button--${kind}`} href={href} target="_blank" rel="noreferrer" data-cursor={cursor}>
      <span>{children}</span><ArrowUpRight size={19} aria-hidden="true" />
    </a>
  )
}

function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 42 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-12%' }} transition={{ duration: 0.72, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  )
}

function BrandMark() {
  return <a href="#top" className="brand" aria-label="TattooSpace home"><span>TATTOO</span><strong>SPACE</strong><i>MA</i></a>
}

function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null)
  const [label, setLabel] = useState('')
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (matchMedia('(pointer: coarse)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    let x = -100
    let y = -100
    let tx = -100
    let ty = -100
    const move = (event: MouseEvent) => { tx = event.clientX; ty = event.clientY }
    const tick = () => {
      x += (tx - x) * 0.2
      y += (ty - y) * 0.2
      if (dot.current) dot.current.style.transform = `translate3d(${x}px,${y}px,0)`
      raf = requestAnimationFrame(tick)
    }
    const over = (event: MouseEvent) => {
      const target = (event.target as HTMLElement).closest<HTMLElement>('[data-cursor]')
      setActive(Boolean(target))
      setLabel(target?.dataset.cursor || '')
    }
    window.addEventListener('mousemove', move)
    document.addEventListener('mouseover', over)
    tick()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('mousemove', move); document.removeEventListener('mouseover', over) }
  }, [])

  return <div ref={dot} className={`custom-cursor ${active ? 'is-active' : ''}`}><span>{label}</span></div>
}

function ImageCard({ src, label, tall = false }: { src: string; label: string; tall?: boolean }) {
  return (
    <figure className={`image-card ${tall ? 'image-card--tall' : ''}`} data-cursor="VIEW">
      <img src={src} alt={label} loading="lazy" onError={(e) => e.currentTarget.classList.add('is-broken')} />
      <figcaption><span>{label}</span><ArrowUpRight size={18} /></figcaption>
    </figure>
  )
}

export default function App() {
  const [language, setLanguage] = useState<Language>('en')
  const [menuOpen, setMenuOpen] = useState(false)
  const [rateGroup, setRateGroup] = useState<RateGroup>('sessions')
  const [equipmentIndex, setEquipmentIndex] = useState(0)
  const reducedMotion = useReducedMotion()
  const t = translations[language]
  const { scrollYProgress } = useScroll()
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })
  const machineY = useTransform(smoothProgress, [0, 0.23], ['0%', '15%'])

  const structuredData = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: business.name,
    url: 'https://tattoo-space.de/',
    email: business.email,
    telephone: business.whatsappDisplay,
    address: { '@type': 'PostalAddress', streetAddress: 'Jungbuschstraße 8', addressLocality: 'Mannheim', postalCode: '68159', addressCountry: 'DE' },
    openingHours: 'Mo-Sa 11:00-20:00',
  }), [])

  useEffect(() => {
    document.documentElement.lang = language
    document.body.classList.toggle('menu-open', menuOpen)
  }, [language, menuOpen])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <CustomCursor />
      <motion.div className="scroll-progress" style={{ scaleX: smoothProgress }} />

      <header className="site-header">
        <BrandMark />
        <nav className="desktop-nav" aria-label="Primary navigation">
          {t.nav.map((item, index) => <a href={`#${navIds[index]}`} key={item}>{item}</a>)}
        </nav>
        <div className="header-actions">
          <div className="language-switch" aria-label="Language">
            {(['en', 'de'] as Language[]).map((lang) => <button key={lang} className={language === lang ? 'active' : ''} onClick={() => setLanguage(lang)} aria-pressed={language === lang}>{lang.toUpperCase()}</button>)}
          </div>
          <ExternalButton href={business.bookingUrl}>{t.book}</ExternalButton>
          <button className="menu-button" onClick={() => setMenuOpen(true)} aria-label={t.menu}><Menu /></button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div className="mobile-menu" initial={{ clipPath: 'inset(0 0 100% 0)' }} animate={{ clipPath: 'inset(0 0 0% 0)' }} exit={{ clipPath: 'inset(0 0 100% 0)' }} transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}>
            <div className="mobile-menu__top"><BrandMark /><button onClick={() => setMenuOpen(false)} aria-label={t.close}><X /></button></div>
            <nav aria-label="Mobile navigation">{t.nav.map((item, index) => <a href={`#${navIds[index]}`} key={item} onClick={() => setMenuOpen(false)}><span>0{index + 1}</span>{item}</a>)}</nav>
            <ExternalButton href={business.bookingUrl}>{t.book}</ExternalButton>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        <section className="hero" id="top">
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-copy">
            <motion.p className="eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>{t.heroEyebrow}</motion.p>
            <h1>{t.heroLines.map((line, index) => <motion.span key={line} className={index === 2 ? 'pink' : ''} initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 0.9, delay: 0.1 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}>{line}</motion.span>)}</h1>
            <motion.div className="hero-actions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
              <ExternalButton href={business.bookingUrl}>{t.book}</ExternalButton>
              <a className="text-link" href="#space" data-cursor="VIEW">{t.seeSpace}<ArrowDown size={17} /></a>
              <a className="text-link text-link--small" href="#rates">{t.viewRates}</a>
            </motion.div>
          </div>
          <motion.div className="hero-machine" style={{ y: reducedMotion ? 0 : machineY }}><Suspense fallback={<div className="machine-fallback">TS</div>}><TattooMachine /></Suspense></motion.div>
          <div className="hero-stamp"><span>PRO<br />ARTISTS<br />ONLY</span></div>
          <div className="marquee marquee--hero"><div>FULLY EQUIPPED ✦ FLEXIBLE RENTAL ✦ YOUR CLIENTS ✦ YOUR RULES ✦ MANNHEIM ✦ FULLY EQUIPPED ✦ FLEXIBLE RENTAL ✦ YOUR CLIENTS ✦ YOUR RULES ✦ MANNHEIM ✦</div></div>
        </section>

        <section className="intro section-black">
          <div className="container">
            <Reveal><p className="section-kicker">{t.introKicker}</p></Reveal>
            <div className="intro-grid">
              <Reveal><h2 className="display-title">{t.introTitle.map((line) => <span key={line}>{line}</span>)}</h2></Reveal>
              <Reveal delay={0.1}><div className="intro-copy"><p>{t.introBody}</p><ExternalButton href={business.bookingUrl}>{t.book}</ExternalButton></div></Reveal>
            </div>
            <div className="benefit-grid">{t.benefits.map(([title, body], index) => <Reveal key={title} delay={index * 0.06}><article className="benefit-card"><span>0{index + 1}</span><h3>{title}</h3><p>{body}</p></article></Reveal>)}</div>
          </div>
        </section>

        <section id="space" className="space-section section-paper">
          <div className="container">
            <div className="section-heading"><Reveal><p className="section-kicker">{t.spaceKicker}</p><h2 className="display-title">{t.spaceTitle.map((line) => <span key={line}>{line}</span>)}</h2></Reveal><Reveal delay={0.1}><p className="section-lead">{t.spaceBody}</p></Reveal></div>
            <div className="gallery-grid">
              <ImageCard src={images.studio} label={t.galleryLabels[0]} tall />
              <div className="gallery-stack"><ImageCard src={images.artist} label={t.galleryLabels[1]} /><ImageCard src={images.tattoo} label={t.galleryLabels[2]} /></div>
            </div>
            <div className="space-facts"><span>02 {language === 'de' ? 'ARBEITSPLÄTZE' : 'WORKSTATIONS'}</span><span>{business.openingHours}</span><span>68159 · JUNGBUSCH</span></div>
          </div>
        </section>

        <section id="included" className="included-section section-pink">
          <div className="container included-grid">
            <Reveal><div><p className="section-kicker">{t.includedKicker}</p><h2 className="display-title">{t.includedTitle.map((line) => <span key={line}>{line}</span>)}</h2><div className="bring-list">{t.bring.map((item) => <span key={item}>{item}</span>)}</div><p className="rest-line">{t.rest}</p></div></Reveal>
            <Reveal delay={0.1}><div className="equipment-panel"><div className="equipment-tabs" role="tablist">{t.categories.map((category, index) => <button role="tab" aria-selected={equipmentIndex === index} className={equipmentIndex === index ? 'active' : ''} onClick={() => setEquipmentIndex(index)} key={category}><span>0{index + 1}</span>{category}</button>)}</div><AnimatePresence mode="wait"><motion.ul key={equipmentIndex} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>{equipment[equipmentKeys[equipmentIndex]].map((item) => <li key={item}><Check size={18} />{item}</li>)}</motion.ul></AnimatePresence></div></Reveal>
          </div>
        </section>

        <section id="rates" className="rates-section section-black">
          <div className="container">
            <Reveal><p className="section-kicker">{t.ratesKicker}</p><h2 className="display-title">{t.ratesTitle.map((line) => <span key={line}>{line}</span>)}</h2></Reveal>
            <div className="rate-tabs" role="tablist">{(['sessions', 'days', 'stays'] as RateGroup[]).map((group, index) => <button role="tab" aria-selected={rateGroup === group} className={rateGroup === group ? 'active' : ''} onClick={() => setRateGroup(group)} key={group}>{t.ratesTabs[index]}</button>)}</div>
            <AnimatePresence mode="wait"><motion.div className="rate-grid" key={rateGroup} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.35 }}>{rates[rateGroup].map((rate) => <article className={`rate-card ${rate.featured ? 'featured' : ''}`} key={rate.duration}><div><span>{rate.featured ? (language === 'de' ? 'BELIEBT' : 'POPULAR') : 'TATTOOSPACE'}</span><h3>{language === 'de' && 'durationDe' in rate ? rate.durationDe : rate.duration}</h3></div><strong>{rate.price}</strong><ExternalButton href={business.bookingUrl} kind={rate.featured ? 'dark' : 'ghost'}>{t.slot}</ExternalButton></article>)}</motion.div></AnimatePresence>
            <p className="rate-note">{t.cancellation}</p>
          </div>
        </section>

        <section id="artists" className="artists-section section-paper">
          <div className="artists-image"><img src={images.artist} alt="Tattoo artist working at TattooSpace Mannheim" loading="lazy" onError={(e) => e.currentTarget.classList.add('is-broken')} /><div className="pink-slice" /></div>
          <div className="artists-copy"><Reveal><p className="section-kicker">{t.artistsKicker}</p><h2 className="display-title">{t.artistsTitle.map((line) => <span key={line}>{line}</span>)}</h2><p>{t.artistsBody}</p><a className="text-link" href={business.instagramUrl} target="_blank" rel="noreferrer" data-cursor="VIEW"><Instagram size={18} />{t.guest}</a></Reveal></div>
        </section>

        <section id="reviews" className="reviews-section section-black">
          <div className="container">
            <Reveal><p className="section-kicker">{t.reviewsKicker}</p><h2 className="display-title">{t.reviewsTitle.map((line) => <span key={line}>{line}</span>)}</h2></Reveal>
            <div className="review-grid">{reviews.map((review, index) => <Reveal key={review.author} delay={index * 0.08}><blockquote><div className="stars" aria-label="5 stars">★★★★★</div><p>“{review.quote}”</p><footer><span>{review.author}</span><small>GOOGLE REVIEW</small></footer></blockquote></Reveal>)}</div>
          </div>
        </section>

        <section id="location" className="location-section section-paper">
          <div className="container location-grid">
            <Reveal><div><p className="section-kicker">{t.locationKicker}</p><h2 className="display-title">{t.locationTitle.map((line) => <span key={line}>{line}</span>)}</h2><p className="section-lead">{t.locationBody}</p><ExternalButton href={business.mapsUrl}>{t.directions}</ExternalButton></div></Reveal>
            <Reveal delay={0.1}><a className="map-card" href={business.mapsUrl} target="_blank" rel="noreferrer" data-cursor="MAP ↗"><div className="map-gridlines" /><div className="map-river" /><div className="map-pin"><MapPin /><span>TATTOOSPACE</span></div><div className="map-address">{business.address.map((line) => <span key={line}>{line}</span>)}</div></a></Reveal>
          </div>
        </section>

        <section className="final-cta section-pink">
          <div className="container"><Reveal><p className="section-kicker">TATTOOSPACE · MANNHEIM</p><h2 className="display-title display-title--xl">{t.finalTitle.map((line) => <span key={line}>{line}</span>)}</h2><div className="final-actions"><ExternalButton href={business.bookingUrl} kind="dark">{t.book}</ExternalButton><ExternalButton href={business.whatsappUrl} kind="ghost" cursor="CHAT ↗"><MessageCircle size={18} />{t.ask}</ExternalButton></div></Reveal></div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-grid"><BrandMark /><div><span>{t.opening}</span><strong>{business.openingHours}</strong><p>{business.address.join(' · ')}</p></div><div><span>{t.contact}</span><a href={`mailto:${business.email}`}><Mail size={15} />{business.email}</a><a href={business.whatsappUrl} target="_blank" rel="noreferrer"><MessageCircle size={15} />{business.whatsappDisplay}</a></div><a className="instagram-link" href={business.instagramUrl} target="_blank" rel="noreferrer"><Instagram />{t.follow}</a></div>
        <div className="footer-bottom"><span>© 2026 TATTOOSPACE MANNHEIM</span><span>FOR PROFESSIONAL TATTOO ARTISTS</span></div>
      </footer>

      <a className="mobile-sticky" href={business.bookingUrl} target="_blank" rel="noreferrer"><span>{t.book}</span><ArrowUpRight size={20} /></a>
    </>
  )
}
