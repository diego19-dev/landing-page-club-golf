'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import {
  CalendarDays,
  ShoppingBag,
  Crown,
  Sun,
  Moon,
  User as UserIcon,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  Flag,
  Plus,
  Minus,
  BookOpen,
  AlertTriangle,
  ChevronDown,
  Play,
  Pause,
  Wind,
  Gauge,
  Sparkles,
  Clock
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useTheme } from '@/lib/theme-context'
import { useWeather } from '@/lib/useWeather'
import { GolfWeatherModal } from '@/components/weather/GolfWeatherModal'
import { PRODUCTS, GOLF_RULE_GROUPS, GOLF_RULES } from '@/data/clubData'
import { MobileTabId } from './MobileBottomNav'

// ─────────────────────────────────────────────
// 1. MOBILE HEADER (h-14 shrink-0)
// ─────────────────────────────────────────────
interface MobileHeaderProps {
  onOpenLogin: () => void
  currentTab: MobileTabId
  onSelectTab: (tab: MobileTabId) => void
}

export function MobileHeader({ onOpenLogin }: MobileHeaderProps) {
  const { user, isAuthenticated } = useAuth()
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="shrink-0 px-4 pt-[env(safe-area-inset-top,0px)] h-[calc(3.5rem+env(safe-area-inset-top,0px))] flex items-center justify-between border-b dark:border-white/10 border-stone-200/80 dark:bg-[#071b16] bg-[#f8f6f0] z-40 transition-colors duration-200">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#d6b875] to-[#8c6d2d] flex items-center justify-center shadow-md shrink-0">
          <ShieldCheck size={18} className="text-[#071b16]" />
        </div>
        <div>
          <span className="font-serif tracking-widest text-[13px] font-bold dark:text-white text-[#071b16] block leading-none">MONTEVERDE</span>
          <span className="text-[9px] uppercase tracking-[0.2em] text-[#8c6d2d] dark:text-[#d6b875] block mt-0.5">Golf Club</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={toggleTheme} aria-label="Cambiar tema" className="p-2 rounded-xl dark:bg-white/5 bg-stone-200/70 dark:text-[#d6b875] text-[#8c6d2d] active:scale-95 transition-transform cursor-pointer">
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>
        <button onClick={onOpenLogin} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border dark:border-[#d6b875]/30 border-stone-300 dark:bg-[#0c2820] bg-white text-[11px] font-semibold dark:text-[#d6b875] text-[#8c6d2d] active:scale-95 transition-transform cursor-pointer">
          <UserIcon size={13} />
          <span>{isAuthenticated ? (user?.role === 'admin' ? 'Admin' : user?.role === 'starter' ? 'Starter' : 'Socio') : 'Entrar'}</span>
        </button>
      </div>
    </header>
  )
}

// ─────────────────────────────────────────────
// 2. MOBILE HOME VIEW
// ─────────────────────────────────────────────
interface MobileHomeViewProps {
  onGoToTab: (tab: MobileTabId) => void
  onOpenAdmission: () => void
}

export function MobileHomeView({ onGoToTab, onOpenAdmission }: MobileHomeViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [weatherModalOpen, setWeatherModalOpen] = useState(false)

  const {
    locations,
    currentLocation,
    selectedLocationId,
    setSelectedLocationId,
    refresh,
    isRefreshing
  } = useWeather()

  const toggleVideoPlayback = () => {
    if (!videoRef.current) return
    if (videoRef.current.paused) {
      videoRef.current.play()
      setIsPlaying(true)
    } else {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }

  const currentTemp = currentLocation?.current?.temperature
    ? `${Math.round(currentLocation.current.temperature)}°C`
    : '21°C'
  const windSpeed = currentLocation?.current?.windSpeed10m
    ? `${Math.round(currentLocation.current.windSpeed10m)} km/h`
    : '8 km/h'

  return (
    <div className="relative min-h-full flex flex-col p-4 pb-4 gap-3.5">
      {/* Full-bleed cinematic video background */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster="/championship-course.jpg"
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none transform scale-102"
      >
        <source src="/Golfer_swinging_on_golf_course_20261006235341.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-t from-[#071b16]/98 via-[#071b16]/65 to-black/45 pointer-events-none" />

      {/* Top badges: Club status & Live Weather Pill */}
      <div className="relative z-10 flex items-center justify-between gap-2 shrink-0">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 border border-white/15 backdrop-blur-md text-[10px] font-semibold uppercase tracking-[0.2em] text-[#d6b875]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
          <span>Club Privado · 1987</span>
        </div>

        {/* Live Weather pill triggering full weather modal */}
        <button
          type="button"
          onClick={() => setWeatherModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 border border-white/20 backdrop-blur-md text-[10px] text-white/95 cursor-pointer active:scale-95 transition-transform"
        >
          <Sun size={11} className="text-[#d6b875]" />
          <span>{currentTemp} · Greens 10.5</span>
        </button>
      </div>

      {/* Hero central editorial content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center text-center py-1">
        <div className="inline-flex items-center justify-center gap-1.5 mb-2 mx-auto">
          <Sparkles size={11} className="text-[#d6b875]" />
          <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#d6b875]">
            Campo de Campeonato · 18 Hoyos
          </span>
        </div>

        <h1 className="font-serif text-[1.85rem] font-light text-white leading-tight tracking-tight">
          El arte del golf <br />
          <em className="italic font-normal text-[#d6b875]">en su máxima expresión.</em>
        </h1>

        <p className="mt-2 text-xs text-stone-200/90 font-light max-w-xs mx-auto leading-relaxed">
          Diseño Javier Arana. Dehesa de encinas centenarias. Greens de campeonato a 20 min de Madrid.
        </p>

        {/* Stats card */}
        <div className="mt-3.5 grid grid-cols-3 gap-2 px-3 py-2.5 rounded-2xl bg-black/60 border border-white/15 backdrop-blur-md text-white text-[10px] max-w-xs mx-auto w-full shadow-lg">
          <div>
            <span className="text-[#d6b875] font-bold block">PAR 72</span>
            <span className="text-stone-300 text-[9px]">6.420m</span>
          </div>
          <div className="border-x border-white/15">
            <span className="text-[#d6b875] font-bold block">SLOPE 138</span>
            <span className="text-stone-300 text-[9px]">Valor 73.4</span>
          </div>
          <div>
            <span className="text-[#d6b875] font-bold block">{windSpeed}</span>
            <span className="text-stone-300 text-[9px]">Viento Óptimo</span>
          </div>
        </div>

        {/* Next Tee Time Pill */}
        <div className="mt-2.5 inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[10px] text-emerald-300 backdrop-blur-xs mx-auto">
          <Clock size={11} className="text-[#10b981]" />
          <span>Próxima salida disponible: <strong>Hoy 08:30h · Tee 1</strong></span>
        </div>
      </div>

      {/* CTA buttons row */}
      <div className="relative z-10 flex flex-col gap-2 max-w-xs mx-auto w-full shrink-0">
        <button
          type="button"
          onClick={() => onGoToTab('reservas')}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#d6b875] via-[#edd8a4] to-[#d6b875] text-[#071b16] font-bold text-xs uppercase tracking-wider shadow-xl flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
        >
          <CalendarDays size={16} />
          <span>Reservar Tee Time</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onGoToTab('reglas')}
            className="py-2.5 px-3 rounded-xl bg-black/60 border border-white/20 text-white font-medium text-xs flex items-center justify-center gap-1.5 backdrop-blur-md active:scale-[0.98] cursor-pointer"
          >
            <BookOpen size={14} className="text-[#d6b875]" />
            <span>Ver Reglas</span>
          </button>
          <button
            type="button"
            onClick={() => onGoToTab('tienda')}
            className="py-2.5 px-3 rounded-xl bg-black/60 border border-white/20 text-white font-medium text-xs flex items-center justify-center gap-1.5 backdrop-blur-md active:scale-[0.98] cursor-pointer"
          >
            <ShoppingBag size={14} className="text-[#d6b875]" />
            <span>Pro Shop</span>
          </button>
        </div>

        <div className="flex items-center justify-between px-1 pt-0.5">
          <button
            type="button"
            onClick={onOpenAdmission}
            className="text-[11px] text-[#d6b875] font-medium flex items-center gap-1 cursor-pointer"
          >
            <Crown size={12} />
            <span>Solicitar Membresía &rarr;</span>
          </button>

          {/* Video pause/play micro-button */}
          <button
            type="button"
            onClick={toggleVideoPlayback}
            className="text-[10px] text-stone-400 hover:text-white flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/40 border border-white/10"
          >
            {isPlaying ? <Pause size={10} /> : <Play size={10} />}
            <span>{isPlaying ? 'Pausar' : 'Reproducir'}</span>
          </button>
        </div>
      </div>

      {/* Golf Weather Modal */}
      <GolfWeatherModal
        isOpen={weatherModalOpen}
        onClose={() => setWeatherModalOpen(false)}
        locations={locations}
        currentLocation={currentLocation}
        selectedLocationId={selectedLocationId}
        onSelectLocation={setSelectedLocationId}
        onRefresh={refresh}
        isRefreshing={isRefreshing}
      />
    </div>
  )
}



import { MobileReservasFlow } from './MobileReservasFlow'

// ─────────────────────────────────────────────
// 4. MOBILE RESERVAS VIEW (Tee Time Flow)
// ─────────────────────────────────────────────
interface MobileReservasViewProps {
  onGoToTab?: (tab: MobileTabId) => void
}

export function MobileReservasView({ onGoToTab }: MobileReservasViewProps) {
  return <MobileReservasFlow onGoToTab={onGoToTab} />
}

import { MobileProShopFlow } from './MobileProShopFlow'

// ─────────────────────────────────────────────
// 5. MOBILE PRO SHOP VIEW
// ─────────────────────────────────────────────
interface MobileProShopViewProps {
  onAddToCart: (name: string) => void
  cartCount?: number
}

export function MobileProShopView({ onAddToCart, cartCount = 0 }: MobileProShopViewProps) {
  return <MobileProShopFlow onAddToCart={onAddToCart} cartCount={cartCount} />
}

// ─────────────────────────────────────────────
// 6. MOBILE CLUB VIEW
// ─────────────────────────────────────────────
interface MobileClubViewProps {
  onOpenAdmission: () => void
}

export function MobileClubView({ onOpenAdmission }: MobileClubViewProps) {
  const [subTab, setSubTab] = useState<'club' | 'restaurante' | 'etiqueta'>('club')

  const content = {
    club: {
      label: 'Club Privado Exclusivo',
      title: 'El Privilegio de Pertenecer',
      image: '/championship-course.jpg',
      desc: 'Acceso irrestricto a los 18 hoyos de campeonato, taquilla privada y correspondencia con más de 40 clubes internacionales.',
      bullets: ['Comité de admisión con aval de 2 socios', 'Invitaciones exclusivas a torneos Majors']
    },
    restaurante: {
      label: 'Gastronomía & Cava',
      title: 'Restaurante La Encomienda',
      image: '/clubhouse-twilight.jpg',
      desc: 'Cocina de autor con vistas al green del 18. Más de 400 referencias en nuestra cava de colección.',
      bullets: ['Terraza panorámica privada para socios', 'Reserva preferente para eventos sociales']
    },
    etiqueta: {
      label: 'Código de Honor R&A',
      title: 'Etiqueta en el Campo',
      image: '/championship-course.jpg',
      desc: 'El golf es un deporte gobernado por el respeto absoluto al campo, al ritmo de juego y a los compañeros.',
      bullets: ['Polo con cuello y softspikes obligatorios', 'Reparar piques y rastrillar bunkers siempre']
    }
  }

  const c = content[subTab]

  return (
    <div className="min-h-full flex flex-col p-3.5 gap-3 dark:bg-[#071b16] bg-[#f8f6f0]">
      {/* Header */}
      <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#8c6d2d] dark:text-[#d6b875] flex items-center gap-1.5 shrink-0"><Crown size={12} />Tradición & Distinción</span>

      {/* Sub-tab buttons */}
      <div className="grid grid-cols-3 gap-1.5 shrink-0">
        {([['club','Membresía'],['restaurante','Casa Club'],['etiqueta','Etiqueta']] as const).map(([id, label]) => (
          <button key={id} onClick={() => setSubTab(id)} className={`py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${subTab === id ? 'bg-[#d6b875] text-[#071b16]' : 'dark:bg-white/5 bg-stone-200 dark:text-stone-300 text-stone-700'}`}>{label}</button>
        ))}
      </div>

      {/* Content card */}
      <div className="rounded-2xl overflow-hidden border dark:border-white/10 border-stone-300 dark:bg-[#0c2820] bg-white shadow-xl flex flex-col flex-1">
        <div className="relative h-44 w-full shrink-0">
          <Image src={c.image} alt={c.title} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
          <div className="absolute bottom-2.5 left-3 right-3 text-white">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#d6b875] block">{c.label}</span>
            <h3 className="font-serif text-lg font-light leading-snug">{c.title}</h3>
          </div>
        </div>
        <div className="p-3 flex flex-col gap-2 flex-1 text-xs">
          <p className="dark:text-stone-300 text-stone-700 text-[11px] leading-relaxed">{c.desc}</p>
          <div className="p-2 rounded-xl dark:bg-[#071b16] bg-stone-100 text-[10px] space-y-1">
            {c.bullets.map((b) => <div key={b}>✓ {b}</div>)}
          </div>
          <button onClick={onOpenAdmission} className="w-full mt-auto py-2.5 rounded-xl bg-[#d6b875] text-[#071b16] font-bold text-xs uppercase flex items-center justify-center gap-1.5 active:scale-[0.98] cursor-pointer">
            <Crown size={14} /><span>Solicitar Admisión como Socio</span>
          </button>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// 7. MOBILE REGLAS VIEW (Acordeón R&A)
// ─────────────────────────────────────────────
export function MobileReglasView() {
  const [activeGroup, setActiveGroup] = useState<number | null>(null)
  const [activeRule, setActiveRule] = useState<number | null>(null)
  const [search, setSearch] = useState('')

  const filtered = search.trim().length > 1
    ? GOLF_RULES.filter((r) =>
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.summary.toLowerCase().includes(search.toLowerCase()) ||
        r.keywords?.some((k) => k.toLowerCase().includes(search.toLowerCase()))
      )
    : null

  const toggleGroup = (id: number) => {
    setActiveGroup(activeGroup === id ? null : id)
    setActiveRule(null)
  }

  const toggleRule = (id: number) => {
    setActiveRule(activeRule === id ? null : id)
  }

  return (
    <div className="min-h-full flex flex-col p-3.5 gap-3 dark:bg-[#071b16] bg-[#f8f6f0]">
      {/* Header */}
      <div className="shrink-0">
        <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#8c6d2d] dark:text-[#d6b875] flex items-center gap-1.5 mb-0.5">
          <BookOpen size={12} />Reglamento R&amp;A Oficial
        </span>
        <h2 className="font-serif text-base font-light dark:text-white text-[#071b16]">25 Reglas · Código de Honor</h2>
      </div>

      {/* Buscador */}
      <div className="relative shrink-0">
        <BookOpen size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar regla, término o situación…"
          className="w-full pl-9 pr-3 py-2.5 rounded-xl border dark:border-white/10 border-stone-300 dark:bg-[#0c2820] bg-white text-xs dark:text-stone-200 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#d6b875]/60"
        />
      </div>

      {/* Resultados de búsqueda */}
      {filtered !== null ? (
        <div className="flex-1 min-h-0 space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-stone-400 text-xs">
              <AlertTriangle size={24} className="mx-auto mb-2 opacity-50" />
              <p>Sin resultados para &ldquo;{search}&rdquo;</p>
            </div>
          ) : (
            filtered.map((rule) => (
              <div key={rule.id} className="rounded-xl border dark:border-white/10 border-stone-300 dark:bg-[#0c2820] bg-white overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleRule(rule.id)}
                  className="w-full p-3 flex items-center justify-between gap-2 cursor-pointer"
                >
                  <div className="text-left flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-[#8c6d2d] dark:text-[#d6b875] uppercase tracking-wider block">{rule.number}</span>
                    <span className="text-xs font-semibold dark:text-white text-stone-900 truncate block">{rule.title}</span>
                  </div>
                  <ChevronDown size={14} className={`shrink-0 text-stone-400 transition-transform ${activeRule === rule.id ? 'rotate-180' : ''}`} />
                </button>
                {activeRule === rule.id && (
                  <div className="px-3 pb-3 text-[11px] space-y-2 border-t dark:border-white/5 border-stone-100 pt-2">
                    <p className="dark:text-stone-300 text-stone-700 leading-relaxed">{rule.summary}</p>
                    {rule.procedure && (
                      <div className="p-2 rounded-lg dark:bg-[#071b16] bg-stone-50 border dark:border-white/5 border-stone-200">
                        <span className="text-[10px] font-bold text-[#8c6d2d] dark:text-[#d6b875] uppercase block mb-0.5">Procedimiento:</span>
                        <p className="dark:text-stone-300 text-stone-600">{rule.procedure}</p>
                      </div>
                    )}
                    {rule.penalties && (
                      <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/30">
                        <span className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase block mb-0.5">Penalización:</span>
                        <p className="text-red-700 dark:text-red-300">{rule.penalties}</p>
                      </div>
                    )}
                    {rule.keywords && (
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {rule.keywords.map((kw) => (
                          <span key={kw} className="px-2 py-0.5 rounded-full dark:bg-white/5 bg-stone-100 text-[10px] dark:text-stone-400 text-stone-500">{kw}</span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      ) : (
        /* Acordeón de grupos */
        <div className="flex-1 min-h-0 space-y-2">
          {GOLF_RULE_GROUPS.map((group) => {
            const groupRules = GOLF_RULES.filter((r) => r.groupId === group.id)
            const isGroupOpen = activeGroup === group.id

            return (
              <div key={group.id} className="rounded-xl border dark:border-white/10 border-stone-300 dark:bg-[#0c2820] bg-white overflow-hidden shadow-sm">
                {/* Group header */}
                <button
                  onClick={() => toggleGroup(group.id)}
                  className="w-full p-3 flex items-center justify-between gap-2 cursor-pointer"
                >
                  <div className="text-left flex-1 min-w-0">
                    <span className="text-xs font-bold dark:text-white text-stone-900 block">{group.name}</span>
                    <span className="text-[10px] dark:text-stone-400 text-stone-500 leading-tight block mt-0.5">{group.description}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] font-bold text-[#8c6d2d] dark:text-[#d6b875]">{groupRules.length} reg.</span>
                    <ChevronDown size={14} className={`text-stone-400 transition-transform ${isGroupOpen ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {/* Rules list */}
                {isGroupOpen && (
                  <div className="border-t dark:border-white/5 border-stone-100">
                    {groupRules.map((rule, idx) => (
                      <div key={rule.id} className={`${idx > 0 ? 'border-t dark:border-white/5 border-stone-100' : ''}`}>
                        <button
                          onClick={() => toggleRule(rule.id)}
                          className="w-full px-3 py-2.5 flex items-center justify-between gap-2 cursor-pointer dark:hover:bg-white/5 hover:bg-stone-50 transition-colors"
                        >
                          <div className="text-left flex-1 min-w-0">
                            <span className="text-[10px] font-bold text-[#8c6d2d] dark:text-[#d6b875] uppercase tracking-wide">{rule.number}</span>
                            <span className="text-xs dark:text-stone-200 text-stone-800 block truncate">{rule.title}</span>
                          </div>
                          <ChevronDown size={12} className={`shrink-0 text-stone-400 transition-transform ${activeRule === rule.id ? 'rotate-180' : ''}`} />
                        </button>

                        {activeRule === rule.id && (
                          <div className="px-3 pb-3 text-[11px] space-y-2 dark:bg-[#071b16]/40 bg-stone-50">
                            <p className="dark:text-stone-300 text-stone-700 leading-relaxed">{rule.summary}</p>
                            {rule.procedure && (
                              <div className="p-2 rounded-lg dark:bg-[#0c2820] bg-white border dark:border-white/5 border-stone-200">
                                <span className="text-[10px] font-bold text-[#8c6d2d] dark:text-[#d6b875] uppercase block mb-0.5">Procedimiento:</span>
                                <p className="dark:text-stone-300 text-stone-600">{rule.procedure}</p>
                              </div>
                            )}
                            {rule.penalties && (
                              <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/30">
                                <span className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase block mb-0.5">Penalización:</span>
                                <p className="text-red-700 dark:text-red-300">{rule.penalties}</p>
                              </div>
                            )}
                            {rule.keywords && (
                              <div className="flex flex-wrap gap-1">
                                {rule.keywords.map((kw) => (
                                  <span key={kw} className="px-2 py-0.5 rounded-full dark:bg-white/5 bg-stone-200 text-[10px] dark:text-stone-400 text-stone-500">{kw}</span>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
