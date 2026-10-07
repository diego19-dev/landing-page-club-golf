'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { SectionId } from '@/types'
import {
  CalendarDays,
  ShoppingBag,
  BookOpen,
  ArrowDown,
  Sparkles,
  Users,
  Clock,
  Compass,
  ChevronRight,
  Sun,
  Wind,
  Gauge,
  Play,
  Pause
} from 'lucide-react'
import { useWeather } from '@/lib/useWeather'
import { GolfWeatherModal } from '@/components/weather/GolfWeatherModal'

interface HeroSectionProps {
  activeSection: SectionId
  setActiveSection: (section: SectionId) => void
  onExploreCourse?: () => void
}

export function HeroSection({ setActiveSection, onExploreCourse }: HeroSectionProps) {
  // Quick booking state in hero
  const [selectedDate, setSelectedDate] = useState<'hoy' | 'manana' | 'sabado'>('hoy')
  const [players, setPlayers] = useState<number>(2)
  const [roundType, setRoundType] = useState<'18' | '9'>('18')
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'noon' | 'twilight'>('morning')
  const [weatherModalOpen, setWeatherModalOpen] = useState<boolean>(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(true)

  const toggleVideoPlayback = () => {
    if (!videoRef.current) return
    if (videoRef.current.paused) {
      videoRef.current.play()
      setIsVideoPlaying(true)
    } else {
      videoRef.current.pause()
      setIsVideoPlaying(false)
    }
  }

  const {
    locations,
    currentLocation,
    selectedLocationId,
    setSelectedLocationId,
    refresh,
    isRefreshing,
  } = useWeather()

  const handleQuickBook = () => {
    setActiveSection('reservas')
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  const handleRedirect = (section: SectionId) => {
    setActiveSection(section)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div id="inicio" className="relative w-full flex flex-col overflow-hidden">
      {/* Hero Visual Full-Viewport Stage */}
      <section className="relative w-full min-h-[92svh] flex flex-col justify-between px-4 pt-12 pb-16 sm:px-6 sm:pb-20 lg:px-10 lg:pb-24">
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

        {/* Sophisticated Editorial Vignette & Gradients */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t dark:from-[#071b16] from-[#071b16]/95 via-[#071b16]/50 via-45% to-black/40" />
        <div className="absolute inset-0 pointer-events-none bg-radial-gradient from-transparent to-black/40" />

        {/* Top Floating Heritage Badge */}
        <div className="relative z-10 mx-auto w-full max-w-7xl flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 border border-white/15 backdrop-blur-md text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-[#d6b875]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
            <span>Club Privado · Fundado en 1987 · Madrid</span>
          </div>

          {/* Live Open-Meteo weather conditions ticker on desktop */}
          <button
            onClick={() => setWeatherModalOpen(true)}
            className="hidden md:flex items-center gap-3 px-4 py-1.5 rounded-full bg-black/50 hover:bg-black/70 border border-white/15 hover:border-[#d6b875]/60 backdrop-blur-md text-xs text-white/90 transition-all cursor-pointer group shadow-lg"
            title="Ver balística de viento y condiciones de juego"
          >
            <span className="flex items-center gap-1.5 text-stone-300 group-hover:text-white transition-colors">
              <Sun size={13} className="text-[#d6b875]" />
              <span>{currentLocation ? `${currentLocation.current.temperature}°C` : '20.3°C'}</span>
            </span>
            <span className="text-white/20">|</span>
            <span className="flex items-center gap-1.5 text-stone-300 group-hover:text-white transition-colors">
              <Wind size={13} className="text-[#d6b875] group-hover:rotate-45 transition-transform" />
              <span>
                {currentLocation
                  ? `${currentLocation.current.windSpeed10m} km/h ${currentLocation.current.windDirectionCardinal}`
                  : '6.4 km/h SE'}
              </span>
            </span>
            <span className="text-white/20">|</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#d6b875]/20 text-[#ebd49a] text-[10px] font-semibold uppercase tracking-wider group-hover:bg-[#d6b875] group-hover:text-[#071b16] transition-colors">
              {currentLocation?.shortName || 'Viento'} · Ver Balística
            </span>
          </button>
        </div>

        {/* Main Editorial Hero Typography */}
        <div className="relative z-10 mx-auto w-full max-w-7xl my-auto pt-10 sm:pt-14 pb-8">
          <div className="max-w-3xl">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.35em] text-[#d6b875] mb-3 sm:mb-4">
              Javier Arana Master Design
            </p>

            <h1 className="font-serif text-[clamp(2.5rem,7.5vw,5.5rem)] font-light text-white leading-[1.02] tracking-tight">
              El arte y la cadencia <br />
              <span className="font-light italic text-[#ebd49a]">del golf clásico.</span>
            </h1>

            <p className="mt-4 sm:mt-6 max-w-xl text-sm sm:text-base lg:text-lg font-light leading-relaxed text-[#f0f4f1]/90">
              18 hoyos de campeonato integrados en la dehesa centenaria. Un recorrido concebido para la tradición, la estrategia pura y la calma absoluta del jugador.
            </p>
          </div>

          {/* Integrated Editorial Quick Booking Bar */}
          <div className="mt-10 max-w-4xl rounded-3xl dark:bg-[#071b16]/85 bg-white/95 border dark:border-[#d6b875]/30 border-white/40 backdrop-blur-xl p-4 sm:p-5 shadow-2xl dark:shadow-black/70">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 items-center">
              {/* Field 1: Día */}
              <div className="p-3 rounded-2xl dark:bg-white/5 bg-stone-100/90 border dark:border-white/5 border-stone-200">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1">
                  Fecha de Juego
                </span>
                <select
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value as any)}
                  className="w-full bg-transparent font-serif text-xs sm:text-sm font-semibold dark:text-white text-[#122a22] focus:outline-none cursor-pointer"
                >
                  <option value="hoy" className="dark:bg-[#071b16] text-[#122a22] dark:text-white">Hoy · Salidas Tardías</option>
                  <option value="manana" className="dark:bg-[#071b16] text-[#122a22] dark:text-white">Mañana · Preferente</option>
                  <option value="sabado" className="dark:bg-[#071b16] text-[#122a22] dark:text-white">Este Sábado · Torneo/Social</option>
                </select>
              </div>

              {/* Field 2: Jugadores */}
              <div className="p-3 rounded-2xl dark:bg-white/5 bg-stone-100/90 border dark:border-white/5 border-stone-200">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1">
                  Jugadores
                </span>
                <div className="flex items-center gap-1.5 font-serif text-xs sm:text-sm font-semibold dark:text-white text-[#122a22]">
                  <Users size={14} className="text-[#8c6d2d] dark:text-[#d6b875]" />
                  <select
                    value={players}
                    onChange={(e) => setPlayers(Number(e.target.value))}
                    className="w-full bg-transparent focus:outline-none cursor-pointer font-serif"
                  >
                    <option value={1} className="dark:bg-[#071b16] text-[#122a22] dark:text-white">1 Jugador (Single)</option>
                    <option value={2} className="dark:bg-[#071b16] text-[#122a22] dark:text-white">2 Jugadores (Pareja)</option>
                    <option value={3} className="dark:bg-[#071b16] text-[#122a22] dark:text-white">3 Jugadores</option>
                    <option value={4} className="dark:bg-[#071b16] text-[#122a22] dark:text-white">4 Jugadores (Partida Completa)</option>
                  </select>
                </div>
              </div>

              {/* Field 3: Recorrido / Franja */}
              <div className="p-3 rounded-2xl dark:bg-white/5 bg-stone-100/90 border dark:border-white/5 border-stone-200">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1">
                  Recorrido & Franja
                </span>
                <div className="flex items-center gap-1.5 font-serif text-xs sm:text-sm font-semibold dark:text-white text-[#122a22]">
                  <Clock size={14} className="text-[#8c6d2d] dark:text-[#d6b875]" />
                  <select
                    value={timeOfDay}
                    onChange={(e) => setTimeOfDay(e.target.value as any)}
                    className="w-full bg-transparent focus:outline-none cursor-pointer font-serif"
                  >
                    <option value="morning" className="dark:bg-[#071b16] text-[#122a22] dark:text-white">18 Hoyos · Mañana (08:00 - 11:30)</option>
                    <option value="noon" className="dark:bg-[#071b16] text-[#122a22] dark:text-white">18 Hoyos · Mediodía (12:00 - 14:30)</option>
                    <option value="twilight" className="dark:bg-[#071b16] text-[#122a22] dark:text-white">9 Hoyos · Crepúsculo (15:00 - 18:00)</option>
                  </select>
                </div>
              </div>

              {/* Field 4: CTA Button */}
              <div>
                <button
                  onClick={handleQuickBook}
                  className="w-full h-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#d6b875] via-[#ebd49a] to-[#c2a159] hover:from-[#dfc68b] hover:via-[#f0dda9] hover:to-[#cca960] text-[#071b16] font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#d6b875]/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 group"
                >
                  <CalendarDays size={16} />
                  <span>Reservar Salida</span>
                  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar in Hero: Quick Jump Pills & Scroll Prompt */}
        <div className="relative z-10 mx-auto w-full max-w-7xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-white/15">
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => scrollToSection('el-campo')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium bg-black/40 hover:bg-black/60 text-white/90 border border-white/15 backdrop-blur-md transition-all cursor-pointer"
            >
              <Compass size={14} className="text-[#d6b875]" />
              <span>El Recorrido</span>
            </button>

            <button
              onClick={() => handleRedirect('tienda')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium bg-black/40 hover:bg-black/60 text-white/90 border border-white/15 backdrop-blur-md transition-all cursor-pointer"
            >
              <ShoppingBag size={14} className="text-[#d6b875]" />
              <span>Boutique Pro Shop</span>
            </button>

            <button
              onClick={() => handleRedirect('reglas')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium bg-black/40 hover:bg-black/60 text-white/90 border border-white/15 backdrop-blur-md transition-all cursor-pointer"
            >
              <BookOpen size={14} className="text-[#d6b875]" />
              <span>Código & Reglas</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleVideoPlayback}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium bg-black/40 hover:bg-black/60 text-stone-300 hover:text-white border border-white/15 backdrop-blur-md transition-all cursor-pointer"
              title={isVideoPlaying ? 'Pausar video' : 'Reproducir video'}
              aria-label={isVideoPlaying ? 'Pausar video' : 'Reproducir video'}
            >
              {isVideoPlaying ? <Pause size={12} className="text-[#d6b875]" /> : <Play size={12} className="text-[#d6b875]" />}
              <span className="hidden sm:inline">{isVideoPlaying ? 'Pausar' : 'Reproducir'}</span>
            </button>

            <button
              onClick={() => scrollToSection('el-campo')}
              className="hidden sm:inline-flex items-center gap-2 text-xs font-medium text-stone-300 hover:text-white transition-colors cursor-pointer"
            >
              <span>Explorar el Club</span>
              <ArrowDown size={14} className="animate-bounce text-[#d6b875]" />
            </button>
          </div>
        </div>
      </section>

      {/* Interactive Golf Weather & Wind Modal */}
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
