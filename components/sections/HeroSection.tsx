'use client'

import Image from 'next/image'
import { SectionId } from '@/types'
import { CalendarDays, ShoppingBag, BookOpen } from 'lucide-react'

interface HeroSectionProps {
  activeSection: SectionId
  setActiveSection: (section: SectionId) => void
}

export function HeroSection({ setActiveSection }: HeroSectionProps) {
  const handleRedirect = (section: SectionId) => {
    setActiveSection(section)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  return (
    <section
      id="inicio"
      className="relative flex-1 w-full min-h-[90svh] sm:min-h-[85vh] flex flex-col justify-end px-4 pb-20 pt-8 sm:px-6 sm:pb-20 lg:px-10 lg:pb-24 animate-in fade-in duration-300 overflow-hidden"
    >
      <Image
        src="/golf-hero.png"
        alt="Campo de golf Monteverde al amanecer"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t dark:from-[#071b16] from-black/75 dark:via-[#071b16]/60 via-black/40 via-35% to-transparent" />
      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <p className="mb-2 sm:mb-3 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.3em] text-[#d6b875]">
          Club Privado · Desde 1987
        </p>
        <h1 className="max-w-xs sm:max-w-2xl font-serif text-[clamp(2.2rem,8vw,4.5rem)] font-light text-white leading-[1.05] tracking-tight">
          Juega a tu <br className="hidden sm:inline" />
          <em className="font-normal italic text-[#d6b875]">manera.</em>
        </h1>
        <p className="mt-3 sm:mt-4 max-w-sm sm:max-w-lg text-sm sm:text-base font-light leading-relaxed text-[#f0f4f1]/90">
          Un campo diseñado para quedarse en la memoria. Tu próxima ronda comienza aquí.
        </p>

        {/* Botones de redirección con iconos en el body */}
        <div className="mt-8 flex flex-wrap gap-3 sm:gap-4 items-center">
          <button
            onClick={() => handleRedirect('reservas')}
            className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#d6b875] via-[#ebd49a] to-[#c2a159] hover:from-[#dfc68b] hover:via-[#f0dda9] hover:to-[#cca960] px-6 py-3.5 text-sm font-bold text-[#071b16] shadow-xl shadow-[#d6b875]/25 border border-[#fff2cb]/60 transition-all hover:scale-[1.03] active:scale-[0.98] cursor-pointer group"
          >
            <CalendarDays size={18} strokeWidth={2.4} className="group-hover:rotate-[-6deg] transition-transform duration-200" />
            <span>Tee Time</span>
            <span className="text-xs font-bold opacity-75 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200">↗</span>
          </button>

          <button
            onClick={() => handleRedirect('tienda')}
            className="inline-flex items-center gap-2.5 rounded-full dark:bg-[#071b16]/75 bg-white/90 dark:border-white/20 border-white/60 hover:border-[#d6b875] dark:hover:bg-[#0c2820]/90 hover:bg-white px-6 py-3.5 text-sm font-semibold dark:text-[#f5f2e9] text-[#122a22] backdrop-blur-md shadow-lg shadow-black/30 transition-all hover:scale-[1.03] active:scale-[0.98] cursor-pointer group"
          >
            <ShoppingBag size={18} strokeWidth={2} className="text-[#8c6d2d] dark:text-[#d6b875] group-hover:scale-110 transition-transform duration-200" />
            <span>Pro Shop</span>
            <span className="text-xs text-[#8c6d2d] dark:text-[#d6b875] opacity-80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200">↗</span>
          </button>

          <button
            onClick={() => handleRedirect('reglas')}
            className="inline-flex items-center gap-2.5 rounded-full dark:bg-[#071b16]/75 bg-white/90 dark:border-white/20 border-white/60 hover:border-[#d6b875] dark:hover:bg-[#0c2820]/90 hover:bg-white px-6 py-3.5 text-sm font-semibold dark:text-[#f5f2e9] text-[#122a22] backdrop-blur-md shadow-lg shadow-black/30 transition-all hover:scale-[1.03] active:scale-[0.98] cursor-pointer group"
          >
            <BookOpen size={18} strokeWidth={2} className="text-[#8c6d2d] dark:text-[#d6b875] group-hover:scale-110 transition-transform duration-200" />
            <span>Reglas</span>
            <span className="text-xs text-[#8c6d2d] dark:text-[#d6b875] opacity-80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200">↗</span>
          </button>
        </div>
      </div>
    </section>
  )
}

