'use client'

import { useState } from 'react'
import Image from 'next/image'
import { SectionId } from '@/types'
import {
  Compass,
  Flag,
  Wind,
  Target,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Info
} from 'lucide-react'

interface CourseShowcaseProps {
  onBookTeeTime: () => void
}

interface HoleData {
  number: number
  name: string
  par: number
  handicap: number
  distanceWhite: number
  distanceYellow: number
  distanceRed: number
  description: string
  proTip: string
  hazard: string
  badge: string
}

const SIGNATURE_HOLES: HoleData[] = [
  {
    number: 4,
    name: 'El Roble Centenario',
    par: 4,
    handicap: 3,
    distanceWhite: 398,
    distanceYellow: 375,
    distanceRed: 335,
    description: 'Un par 4 señorial flanqueado por encinas y robles de más de dos siglos. La caída del drive exige temple para evitar los bunkers de arena de sílice a la derecha.',
    proTip: 'Apoya el drive por la izquierda del fairway. Aunque alarga el segundo tiro 10 metros, abre un ángulo franco hacia un green en dos plataformas.',
    hazard: 'Bunker de calle a 230m · Caída en pendiente pronunciada',
    badge: 'Hoyo Emblemático'
  },
  {
    number: 7,
    name: 'La Laguna de los Cisnes',
    par: 3,
    handicap: 9,
    distanceWhite: 184,
    distanceYellow: 168,
    distanceRed: 138,
    description: 'El hoyo más fotografiado de Monteverde. Un vuelo completo sobre lámina de agua cristalina hacia una península verde con pendiente natural hacia el lago.',
    proTip: 'El viento de la sierra suele soplar de cola aunque la bandera parezca inmóvil. Juega medio hierro menos y busca siempre el cuadrante derecho.',
    hazard: 'Obstáculo de agua frontal total · Viento racheado de cumbre',
    badge: 'Firma del Diseñador'
  },
  {
    number: 14,
    name: 'La Herradura',
    par: 4,
    handicap: 1,
    distanceWhite: 422,
    distanceYellow: 396,
    distanceRed: 350,
    description: 'El hándicap 1 del campo. Un dogleg suave hacia la izquierda con pendiente lateral donde solo un drive impecable permite aspirar a cazar el green en regulación.',
    proTip: 'Resiste la tentación de cortar por encima del pinar. El centro del fairway te dejará un hierro 5 o 6 con margen seguro de entrada.',
    hazard: 'Pinar cerrado a la izquierda · Falso frente de green',
    badge: 'Hándicap 1 del Campo'
  },
  {
    number: 18,
    name: 'El Retorno a la Encomienda',
    par: 5,
    handicap: 5,
    distanceWhite: 528,
    distanceYellow: 495,
    distanceRed: 442,
    description: 'Un cierre apoteósico que asciende suavemente hacia la silueta iluminada de la Casa Club. Una calle ancha y generosa que recompensa a los jugadores decididos.',
    proTip: 'Un segundo tiro colocado a 90 metros te asegura un wedge de control perfecto para buscar el birdie frente a los socios en la terraza.',
    hazard: 'Bunkers cruzados a 70m del green · Graderío natural',
    badge: 'Hoyo de Cierre'
  }
]

export function CourseShowcase({ onBookTeeTime }: CourseShowcaseProps) {
  const [selectedHoleIndex, setSelectedHoleIndex] = useState<number>(0)
  const hole = SIGNATURE_HOLES[selectedHoleIndex]

  return (
    <section id="el-campo" className="py-20 lg:py-28 px-4 sm:px-6 lg:px-10 dark:bg-[#071b16] bg-[#f8f6f0] border-t dark:border-white/10 border-stone-200 transition-colors duration-200">
      <div className="mx-auto max-w-7xl">
        {/* Section Editorial Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#8c6d2d] dark:text-[#d6b875] flex items-center gap-2 mb-3">
              <Compass size={14} />
              01 · Arquitectura & Recorrido
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light dark:text-[#f5f2e9] text-[#122a22] tracking-tight leading-[1.08]">
              Esculpido en la <br />
              <em className="italic font-normal text-[#8c6d2d] dark:text-[#d6b875]">dehesa centenaria.</em>
            </h2>
          </div>
          <p className="max-w-md text-sm sm:text-base font-light dark:text-[#aab8af] text-stone-600 leading-relaxed">
            Diseñado en 1987 por el maestro Javier Arana, cada uno de los 18 hoyos dialoga con la topografía natural madrileña, premiando la estrategia por encima de la fuerza bruta.
          </p>
        </div>

        {/* Course Specifications Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 sm:p-8 rounded-3xl dark:bg-[#0c2820]/60 bg-white border dark:border-white/10 border-stone-200 shadow-sm mb-16">
          <div className="border-r dark:border-white/10 border-stone-200/80 pr-4 last:border-none">
            <span className="block text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-[#8c6d2d] dark:text-[#d6b875] mb-1">
              Recorrido Oficial
            </span>
            <span className="font-serif text-2xl sm:text-3xl dark:text-[#f5f2e9] text-[#122a22] font-medium">
              18 Hoyos · Par 72
            </span>
            <p className="text-[11px] dark:text-stone-400 text-stone-500 mt-0.5">Championship Layout</p>
          </div>

          <div className="border-r dark:border-white/10 border-stone-200/80 pr-4 last:border-none">
            <span className="block text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-[#8c6d2d] dark:text-[#d6b875] mb-1">
              Distancia Total
            </span>
            <span className="font-serif text-2xl sm:text-3xl dark:text-[#f5f2e9] text-[#122a22] font-medium">
              6.540 m
            </span>
            <p className="text-[11px] dark:text-stone-400 text-stone-500 mt-0.5">Barras Blancas PGA</p>
          </div>

          <div className="border-r dark:border-white/10 border-stone-200/80 pr-4 last:border-none">
            <span className="block text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-[#8c6d2d] dark:text-[#d6b875] mb-1">
              Valor / Slope
            </span>
            <span className="font-serif text-2xl sm:text-3xl dark:text-[#f5f2e9] text-[#122a22] font-medium">
              73.4 / 136
            </span>
            <p className="text-[11px] dark:text-stone-400 text-stone-500 mt-0.5">Homologado RFEG & R&A</p>
          </div>

          <div>
            <span className="block text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-[#8c6d2d] dark:text-[#d6b875] mb-1">
              Variedad de Césped
            </span>
            <span className="font-serif text-2xl sm:text-3xl dark:text-[#f5f2e9] text-[#122a22] font-medium">
              Agrostis A-4
            </span>
            <p className="text-[11px] dark:text-stone-400 text-stone-500 mt-0.5">Greens de 11+ Stimpmeter</p>
          </div>
        </div>

        {/* Interactive Signature Holes Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Hole Selector Tabs */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] font-semibold text-[#8c6d2d] dark:text-[#d6b875] mb-4">
                Hoyos Emblemáticos
              </p>
              <div className="space-y-2.5">
                {SIGNATURE_HOLES.map((h, index) => {
                  const isActive = index === selectedHoleIndex
                  return (
                    <button
                      key={h.number}
                      onClick={() => setSelectedHoleIndex(index)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                        isActive
                          ? 'dark:bg-[#0c2820] bg-white border-[#8c6d2d] dark:border-[#d6b875] shadow-lg dark:shadow-black/40'
                          : 'dark:bg-white/3 bg-white/70 border-stone-200 dark:border-white/5 hover:border-stone-300 dark:hover:border-white/15'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <span
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-serif text-sm font-semibold transition-colors ${
                            isActive
                              ? 'bg-gradient-to-br from-[#d6b875] to-[#c2a159] text-[#071b16] font-bold shadow-sm'
                              : 'dark:bg-white/10 bg-stone-200 text-stone-700 dark:text-stone-300 group-hover:text-[#8c6d2d] dark:group-hover:text-[#d6b875]'
                          }`}
                        >
                          {h.number}
                        </span>
                        <div>
                          <h3
                            className={`text-sm font-semibold transition-colors ${
                              isActive
                                ? 'dark:text-[#f5f2e9] text-[#122a22]'
                                : 'dark:text-stone-300 text-stone-700'
                            }`}
                          >
                            {h.name}
                          </h3>
                          <p className="text-[11px] dark:text-stone-400 text-stone-500">
                            Par {h.par} · {h.distanceWhite}m · Hcp {h.handicap}
                          </p>
                        </div>
                      </div>
                      <ChevronRight
                        size={16}
                        className={`transition-transform duration-200 ${
                          isActive
                            ? 'text-[#8c6d2d] dark:text-[#d6b875] translate-x-1'
                            : 'text-stone-400 opacity-50 group-hover:opacity-100'
                        }`}
                      />
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Quick Tee Time Action Card */}
            <div className="p-5 rounded-2xl dark:bg-gradient-to-br dark:from-[#0c2820] dark:to-[#071b16] bg-gradient-to-br from-[#ede8dc] to-white border dark:border-[#d6b875]/20 border-stone-300 mt-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8c6d2d] dark:text-[#d6b875] flex items-center gap-1.5 mb-2">
                <Sparkles size={12} /> Salidas Disponibles
              </span>
              <p className="text-xs dark:text-stone-300 text-stone-700 font-medium mb-3">
                Consulta la disponibilidad del campo en tiempo real y reserva tu partido.
              </p>
              <button
                onClick={onBookTeeTime}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#d6b875] via-[#ebd49a] to-[#c2a159] text-[#071b16] font-bold text-xs uppercase tracking-wider hover:opacity-95 shadow-md transition-all cursor-pointer"
              >
                Reservar Tee Time
              </button>
            </div>
          </div>

          {/* Hole Details Editorial Card */}
          <div className="lg:col-span-8 flex flex-col rounded-3xl dark:bg-[#0c2820] bg-white border dark:border-white/10 border-stone-200 overflow-hidden shadow-xl">
            {/* Visual Header with Real Image */}
            <div className="relative h-64 sm:h-80 w-full overflow-hidden">
              <Image
                src="/championship-course.jpg"
                alt={`Hoyo ${hole.number} - ${hole.name}`}
                fill
                className="object-cover object-center transform hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t dark:from-[#0c2820] from-[#122a22]/85 via-transparent to-black/30" />

              {/* Badges on Top */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/60 text-white backdrop-blur-md border border-white/20">
                  {hole.badge}
                </span>
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#d6b875]/90 text-[#071b16] backdrop-blur-md shadow-sm">
                  Hoyo {hole.number}
                </span>
              </div>

              {/* Bottom Title on Image */}
              <div className="absolute bottom-4 left-4 sm:left-6 right-4 sm:right-6 flex items-end justify-between">
                <div>
                  <h3 className="font-serif text-2xl sm:text-4xl text-white font-light tracking-tight">
                    {hole.name}
                  </h3>
                  <p className="text-xs text-white/80 mt-1 flex items-center gap-3">
                    <span>Par {hole.par}</span>
                    <span>·</span>
                    <span>Hándicap de Juego: {hole.handicap}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Hole Specs & Strategy Body */}
            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
              {/* Tee Distances Strip */}
              <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl dark:bg-black/20 bg-stone-100 border dark:border-white/5 border-stone-200">
                <div className="text-center">
                  <span className="block text-[9px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                    Blancas (Competición)
                  </span>
                  <span className="font-serif text-lg sm:text-xl font-semibold dark:text-[#f5f2e9] text-[#122a22]">
                    {hole.distanceWhite} m
                  </span>
                </div>
                <div className="text-center border-x dark:border-white/10 border-stone-200">
                  <span className="block text-[9px] font-bold uppercase tracking-wider text-[#8c6d2d] dark:text-[#d6b875]">
                    Amarillas (Socios)
                  </span>
                  <span className="font-serif text-lg sm:text-xl font-semibold dark:text-[#d6b875] text-[#8c6d2d]">
                    {hole.distanceYellow} m
                  </span>
                </div>
                <div className="text-center">
                  <span className="block text-[9px] font-bold uppercase tracking-wider text-rose-500">
                    Rojas (Damas / Senior)
                  </span>
                  <span className="font-serif text-lg sm:text-xl font-semibold text-rose-600 dark:text-rose-400">
                    {hole.distanceRed} m
                  </span>
                </div>
              </div>

              {/* Description & Hazard */}
              <div className="space-y-4">
                <p className="text-sm dark:text-[#d9dfd6] text-stone-700 leading-relaxed font-light">
                  {hole.description}
                </p>

                {/* Pro Caddie Tip Box */}
                <div className="p-4 rounded-2xl dark:bg-[#071b16]/70 bg-[#f7f5ee] border-l-2 border-[#8c6d2d] dark:border-[#d6b875] space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8c6d2d] dark:text-[#d6b875]">
                    <Target size={13} />
                    <span>Consejo Estratégico del Head Pro</span>
                  </div>
                  <p className="text-xs dark:text-stone-300 text-stone-600 italic leading-relaxed">
                    &ldquo;{hole.proTip}&rdquo;
                  </p>
                </div>
              </div>

              {/* Hazard note */}
              <div className="pt-2 border-t dark:border-white/10 border-stone-200 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                <span className="flex items-center gap-1.5">
                  <Info size={13} className="text-[#8c6d2d] dark:text-[#d6b875]" />
                  <span>{hole.hazard}</span>
                </span>
                <span className="text-[11px] font-medium text-[#8c6d2d] dark:text-[#d6b875]">
                  Greenkeeper Status: Impecable
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
