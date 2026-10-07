'use client'

import Image from 'next/image'
import { Crown, ArrowRight } from 'lucide-react'

interface ClubLifeSectionProps {
  onOpenAdmission: () => void
}

export function ClubLifeSection({ onOpenAdmission }: ClubLifeSectionProps) {
  return (
    <section id="el-club" className="py-20 lg:py-28 px-4 sm:px-6 lg:px-10 dark:bg-[#051410] bg-[#f2ede4] border-t dark:border-white/10 border-stone-200 transition-colors duration-200">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#8c6d2d] dark:text-[#d6b875] flex items-center gap-2 mb-3">
              <Crown size={14} />
              02 · Tradición & Exclusividad
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light dark:text-[#f5f2e9] text-[#122a22] tracking-tight leading-[1.08]">
              El privilegio <br />
              <em className="italic font-normal text-[#8c6d2d] dark:text-[#d6b875]">de pertenecer.</em>
            </h2>
          </div>
          <p className="max-w-md text-sm sm:text-base font-light dark:text-[#aab8af] text-stone-600 leading-relaxed">
            Monteverde es más que un campo de golf; es un enclave social privado donde la discreción, el legado deportivo y la hospitalidad de alta escuela definen el estilo de vida de nuestros socios.
          </p>
        </div>

        {/* Feature Hero Card with Clubhouse Image */}
        <div className="relative rounded-3xl overflow-hidden border dark:border-white/10 border-stone-300 shadow-xl group">
          <div className="relative h-96 sm:h-[460px] w-full">
            <Image
              src="/clubhouse-twilight.jpg"
              alt="Casa Club Monteverde al atardecer"
              fill
              className="object-cover object-center group-hover:scale-102 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t dark:from-[#051410] from-[#122a22]/90 via-[#122a22]/40 to-transparent" />

            <div className="absolute bottom-6 sm:bottom-10 left-6 sm:left-10 right-6 sm:right-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="max-w-xl">
                <span className="px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#d6b875] text-[#071b16] mb-3 inline-block shadow-sm">
                  Casa Club Señorial
                </span>
                <h3 className="font-serif text-2xl sm:text-4xl text-white font-light tracking-tight leading-tight">
                  Restaurante & Bodega &ldquo;La Encomienda&rdquo;
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-stone-200/90 font-light leading-relaxed">
                  Gastronomía de autor con vistas panorámicas al green del hoyo 18. Una cava privada con más de 400 referencias seleccionadas para deleite de nuestros socios e invitados.
                </p>
              </div>

              <button
                onClick={onOpenAdmission}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-white text-[#122a22] hover:bg-[#d6b875] hover:text-[#071b16] font-semibold text-xs uppercase tracking-wider shadow-xl transition-all cursor-pointer whitespace-nowrap self-start md:self-auto"
              >
                <span>Solicitar Admisión</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
