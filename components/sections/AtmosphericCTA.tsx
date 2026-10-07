'use client'

import Image from 'next/image'
import { CalendarDays, Mail, Phone, ArrowUpRight } from 'lucide-react'

interface AtmosphericCTAProps {
  onBookTeeTime: () => void
  onOpenAdmission: () => void
}

export function AtmosphericCTA({ onBookTeeTime, onOpenAdmission }: AtmosphericCTAProps) {
  return (
    <section className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-10 overflow-hidden border-t dark:border-white/10 border-stone-200">
      {/* Background with Dark Vignette */}
      <Image
        src="/championship-course.jpg"
        alt="Panorámica del campo Monteverde al atardecer"
        fill
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-t dark:from-[#061510] from-[#0b1f18] via-[#0b1f18]/80 to-[#0b1f18]/90" />

      <div className="relative z-10 mx-auto max-w-5xl text-center">
        <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#d6b875] mb-4 inline-block">
          Monteverde Golf Club · Desde 1987
        </span>

        <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light text-white tracking-tight leading-[1.08] mb-6">
          Tu próxima ronda memorable <br />
          <em className="italic font-normal text-[#d6b875]">comienza en el Tee del 1.</em>
        </h2>

        <p className="max-w-xl mx-auto text-sm sm:text-base font-light text-stone-200/90 leading-relaxed mb-10">
          Descubre el silencio de la dehesa, el sonido inconfundible de un impacto sólido y la serenidad que solo un club privado histórico puede ofrecer.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onBookTeeTime}
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-gradient-to-r from-[#d6b875] via-[#ebd49a] to-[#c2a159] hover:from-[#dfc68b] hover:via-[#f0dda9] hover:to-[#cca960] text-[#071b16] font-bold text-xs sm:text-sm uppercase tracking-wider shadow-2xl shadow-[#d6b875]/30 hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer group"
          >
            <CalendarDays size={18} />
            <span>Reservar Salida Ahora</span>
            <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>

          <button
            onClick={onOpenAdmission}
            className="inline-flex items-center gap-2.5 px-7 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/25 hover:border-[#d6b875] backdrop-blur-md text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all cursor-pointer"
          >
            <Mail size={16} className="text-[#d6b875]" />
            <span>Solicitar Dossier de Socio</span>
          </button>
        </div>

        {/* Club Master Data Contact Strip */}
        <div className="mt-16 pt-10 border-t border-white/15 flex flex-wrap items-center justify-center gap-8 text-xs text-stone-300">
          <div className="flex items-center gap-2">
            <Phone size={14} className="text-[#d6b875]" />
            <span>Secretaría: +34 91 845 22 00</span>
          </div>
          <span className="text-white/20 hidden sm:inline">|</span>
          <div className="flex items-center gap-2">
            <Mail size={14} className="text-[#d6b875]" />
            <span>info@monteverdegolf.es</span>
          </div>
          <span className="text-white/20 hidden sm:inline">|</span>
          <div>
            <span>Camino del Roble 18, 28260 Madrid</span>
          </div>
        </div>
      </div>
    </section>
  )
}
