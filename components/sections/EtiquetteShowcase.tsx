'use client'

import {
  Clock,
  Sparkles,
  Shield,
  HeartHandshake,
  CheckCircle,
  ArrowRight,
  BookOpen
} from 'lucide-react'

interface EtiquetteShowcaseProps {
  onGoToRules: () => void
}

export function EtiquetteShowcase({ onGoToRules }: EtiquetteShowcaseProps) {
  const rulesPillars = [
    {
      icon: Clock,
      number: '01',
      title: 'Ritmo de Juego Sagrado',
      standard: '4h 10m máximo para 18 hoyos',
      description: 'El tiempo en el campo es patrimonio de todos los socios. Mantén siempre el contacto visual con la partida que te precede y concede el paso sin demora si buscas bola.',
      tag: 'Cortesía Fundamental'
    },
    {
      icon: Sparkles,
      number: '02',
      title: 'Cuidado & Respeto del Green',
      standard: 'Repara tu pique y dos adicionales',
      description: 'Los greens de Agrostis A-4 exigen veneración. Rastrilla hacia el centro los bunkers y coloca con esmero las chuletas en fairways o rellena con mezcla de semilla.',
      tag: 'Legado del Campo'
    },
    {
      icon: Shield,
      number: '03',
      title: 'Etiqueta de Vestimenta',
      standard: 'Polo con cuello y soft-spikes',
      description: 'Elegancia sobria y tradicional en campo y casa club. Se requiere polo abotonado con cuello, pantalón de corte sastre o bermudas a la rodilla y calzado específico de golf.',
      tag: 'Tradición Señorial'
    },
    {
      icon: HeartHandshake,
      number: '04',
      title: 'Integridad & Honestidad',
      standard: 'El espíritu intrínseco del Golf',
      description: 'El golf es el único deporte donde el jugador es su propio árbitro. La honestidad en la anotación, el silencio durante el golpe ajeno y el respeto al caddie son innegociables.',
      tag: 'Espíritu R&A'
    }
  ]

  return (
    <section id="reglas-preview" className="py-20 lg:py-28 px-4 sm:px-6 lg:px-10 dark:bg-[#051410] bg-[#f2ede4] border-t dark:border-white/10 border-stone-200 transition-colors duration-200">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#8c6d2d] dark:text-[#d6b875] flex items-center gap-2 mb-3">
              <BookOpen size={14} />
              04 · Código de Honor & Etiqueta
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light dark:text-[#f5f2e9] text-[#122a22] tracking-tight leading-[1.08]">
              Las normas que <br />
              <em className="italic font-normal text-[#8c6d2d] dark:text-[#d6b875]">preservan el juego.</em>
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <p className="max-w-md text-sm sm:text-base font-light dark:text-[#aab8af] text-stone-600 leading-relaxed">
              En Monteverde, la tradición no es una imposición, sino un pacto silencioso de respeto mutuo entre caballeros y damas del deporte.
            </p>
            <button
              onClick={onGoToRules}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full dark:bg-[#0c2820] bg-white border dark:border-[#d6b875]/30 border-stone-300 text-xs font-bold uppercase tracking-wider text-[#8c6d2d] dark:text-[#d6b875] hover:border-[#8c6d2d] transition-all cursor-pointer shadow-sm shrink-0"
            >
              <span>Reglamento Completo</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {rulesPillars.map((pillar) => {
            const Icon = pillar.icon
            return (
              <div
                key={pillar.number}
                className="p-6 sm:p-7 rounded-3xl dark:bg-[#0c2820] bg-white border dark:border-white/10 border-stone-200 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-serif text-xs font-bold text-[#8c6d2d] dark:text-[#d6b875]">
                      {pillar.number}
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider dark:text-stone-400 text-stone-500 bg-stone-100 dark:bg-white/5 px-2.5 py-0.5 rounded-full">
                      {pillar.tag}
                    </span>
                  </div>

                  <div className="w-10 h-10 rounded-2xl dark:bg-[#d6b875]/15 bg-amber-100 text-[#8c6d2d] dark:text-[#d6b875] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <Icon size={18} />
                  </div>

                  <h3 className="font-serif text-lg font-medium dark:text-[#f5f2e9] text-[#122a22] mb-1">
                    {pillar.title}
                  </h3>

                  <div className="inline-block text-[11px] font-semibold text-[#8c6d2d] dark:text-[#d6b875] mb-3">
                    {pillar.standard}
                  </div>

                  <p className="text-xs dark:text-[#aab8af] text-stone-600 leading-relaxed font-light">
                    {pillar.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t dark:border-white/5 border-stone-100 flex items-center justify-between text-[11px] dark:text-stone-400 text-stone-500">
                  <span>Normativa Oficial R&A</span>
                  <span className="text-[#8c6d2d] dark:text-[#d6b875]">✓ Obligatorio</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
