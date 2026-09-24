'use client'

import { useMemo, useState } from 'react'
import { SectionId } from '@/types'
import { GOLF_RULE_GROUPS, GOLF_RULES } from '@/data/clubData'
import { consultGolfReferee, RefereeVerdict } from '@/lib/rulesAiEngine'
import {
  AlertCircle,
  BookOpen,
  ChevronDown,
  Filter,
  Search,
  X,
  Sparkles,
  Gavel,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Bot,
  HelpCircle,
} from 'lucide-react'

interface ReglasSectionProps {
  activeSection: SectionId
}

const QUICK_PROMPTS = [
  { label: '💧 Bola al agua (estacas rojas)', query: 'Mi bola cayó al agua con estacas rojas, ¿cómo procedo?' },
  { label: '🏖️ Quitar hojas o rastrillo en búnker', query: '¿Puedo retirar una hoja o el rastrillo dentro del bunker?' },
  { label: '🛣️ Bola sobre camino de carritos', query: 'Mi bola quedó sobre el camino de asfalto de carritos' },
  { label: '🌳 Bola injugable en arbusto', query: '¿Cómo declaro mi bola injugable debajo de un arbusto?' },
  { label: '⏰ Llegada tarde al tee de salida', query: '¿Qué penalización hay si llego 3 minutos tarde al tee time?' },
  { label: '⛳ Patear con bandera en green', query: '¿Puedo patear en el green con la bandera colocada en el hoyo?' },
  { label: '🏌️ Llevar más de 14 palos', query: '¿Cuántos palos puedo llevar en la bolsa de golf?' },
  { label: '💥 Doble golpe involuntario', query: '¿Qué pasa si doy un doble toque sin querer en el swing?' },
]

export function ReglasSection({ activeSection }: ReglasSectionProps) {
  const [activeTab, setActiveTab] = useState<'ai' | 'compendio'>('ai')

  // AI Referee State
  const [aiQuery, setAiQuery] = useState('')
  const [verdict, setVerdict] = useState<RefereeVerdict | null>(() =>
    consultGolfReferee('Mi bola cayó al agua con estacas rojas, ¿cómo procedo?')
  )
  const [isThinking, setIsThinking] = useState(false)

  // Compendio State
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGroup, setSelectedGroup] = useState<number>(0)
  const [openRule, setOpenRule] = useState<number | null>(1)

  const handleConsult = (text: string) => {
    if (!text.trim()) return
    setIsThinking(true)
    setTimeout(() => {
      const result = consultGolfReferee(text)
      setVerdict(result)
      setIsThinking(false)
    }, 200)
  }

  const handlePromptClick = (prompt: { label: string; query: string }) => {
    setAiQuery(prompt.query)
    handleConsult(prompt.query)
  }

  const filteredRules = useMemo(() => {
    return GOLF_RULES.filter((rule) => {
      const matchesGroup = selectedGroup === 0 || rule.groupId === selectedGroup
      if (!searchQuery.trim()) return matchesGroup

      const query = searchQuery.toLowerCase().trim()
      const matchesTitle = rule.title.toLowerCase().includes(query)
      const matchesNumber = rule.number.toLowerCase().includes(query)
      const matchesSummary = rule.summary.toLowerCase().includes(query)
      const matchesProcedure = rule.procedure.toLowerCase().includes(query)
      const matchesPenalties = rule.penalties.toLowerCase().includes(query)
      const matchesKeywords = rule.keywords.some((kw) => kw.toLowerCase().includes(query))

      return matchesGroup && (matchesTitle || matchesNumber || matchesSummary || matchesProcedure || matchesPenalties || matchesKeywords)
    })
  }, [searchQuery, selectedGroup])

  return (
    <section
      id="reglas"
      className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-14 animate-in fade-in duration-300 overflow-x-hidden"
    >
      {/* Header */}
      <div className="mb-6 sm:mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="eyebrow flex items-center gap-2 text-[#d6b875]">
            <Gavel size={14} /> Asistente Oficial R&A / USGA
          </p>
          <h2 className="section-title">
            Árbitro Virtual &<br />
            <em>Reglas de Golf.</em>
          </h2>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center rounded-full border dark:border-white/15 border-stone-300 dark:bg-[#0c2820] bg-white p-1 shadow-sm shrink-0 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('ai')}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'ai'
                ? 'bg-[#d6b875] text-[#071b16] shadow-sm'
                : 'dark:text-[#aab8af] text-stone-600 dark:hover:text-white hover:text-stone-900'
            }`}
          >
            <Sparkles size={14} />
            <span>Árbitro Virtual IA</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('compendio')}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'compendio'
                ? 'bg-[#d6b875] text-[#071b16] shadow-sm'
                : 'dark:text-[#aab8af] text-stone-600 dark:hover:text-white hover:text-stone-900'
            }`}
          >
            <BookOpen size={14} />
            <span>Compendio (25 Reglas)</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: ÁRBITRO VIRTUAL IA */}
      {activeTab === 'ai' && (
        <div className="space-y-6">
          {/* Query Box */}
          <div className="relative rounded-2xl border dark:border-[#d6b875]/30 border-stone-200 dark:bg-gradient-to-b dark:from-[#0c2820] dark:to-[#071b16] bg-white p-5 sm:p-7 shadow-lg dark:shadow-2xl overflow-hidden transition-colors duration-200">
            {/* Ambient golden glow */}
            <div className="absolute top-0 right-0 -mt-8 -mr-8 h-44 w-44 rounded-full bg-[#d6b875]/10 blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg dark:bg-[#d6b875]/20 bg-amber-100 border dark:border-[#d6b875]/40 border-amber-300 text-[#8c6d2d] dark:text-[#d6b875]">
                    <Bot size={16} />
                  </span>
                  <span className="text-xs sm:text-sm font-semibold dark:text-white text-[#122a22] tracking-wide">
                    Consulta en lenguaje natural a tu juez de torneo
                  </span>
                </div>
                <span className="text-[11px] dark:text-[#8e9f94] text-stone-500 font-medium hidden sm:inline">
                  Reglamento oficial R&A 2024–2027
                </span>
              </div>

              {/* Consultation Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleConsult(aiQuery)
                }}
                className="flex flex-col sm:flex-row gap-2.5"
              >
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                    placeholder="Ej: Mi bola cayó al agua con estacas rojas, ¿cómo procedo?"
                    className="w-full rounded-xl border dark:border-white/15 border-stone-300 dark:bg-[#071b16]/90 bg-stone-50 px-4 py-3.5 text-sm sm:text-base dark:text-white text-[#122a22] dark:placeholder:text-[#64746a] placeholder:text-stone-400 outline-none focus:border-[#8c6d2d] dark:focus:border-[#d6b875] focus:ring-2 focus:ring-[#d6b875]/30 transition-all shadow-inner"
                  />
                  {aiQuery && (
                    <button
                      type="button"
                      onClick={() => setAiQuery('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 dark:text-[#8e9f94] text-stone-400 hover:text-stone-800 dark:hover:text-white"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isThinking || !aiQuery.trim()}
                  className="rounded-xl bg-gradient-to-r from-[#d6b875] via-[#e5c98d] to-[#c7a054] px-6 py-3.5 text-sm font-bold text-[#071b16] transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-[#d6b875]/20 focus:outline-none focus:ring-2 focus:ring-[#d6b875]/50 disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex items-center justify-center gap-2 shrink-0 shadow-md"
                >
                  <Sparkles size={16} />
                  <span>{isThinking ? 'Dictaminando...' : 'Obtener Dictamen'}</span>
                </button>
              </form>

              {/* Quick Prompt Pills */}
              <div className="mt-4 pt-4 border-t dark:border-white/10 border-stone-200">
                <p className="text-[11px] uppercase tracking-wider font-semibold dark:text-[#8e9f94] text-stone-500 mb-2 flex items-center gap-1.5">
                  <HelpCircle size={13} />
                  <span>Situaciones comunes en el campo (1 clic):</span>
                </p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {QUICK_PROMPTS.map((prompt) => (
                    <button
                      key={prompt.label}
                      type="button"
                      onClick={() => handlePromptClick(prompt)}
                      className="rounded-full border dark:border-white/10 border-stone-200 dark:bg-white/5 bg-stone-100 px-3 py-1.5 text-xs dark:text-[#c2ccbf] text-stone-700 transition-all hover:border-[#bfa056] dark:hover:border-[#d6b875]/60 hover:bg-amber-50 dark:hover:bg-[#d6b875]/10 hover:text-[#122a22] dark:hover:text-white cursor-pointer flex items-center gap-1"
                    >
                      <span>{prompt.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* VERDICT CARD */}
          {verdict && (
            <div className="relative rounded-2xl border dark:border-white/15 border-stone-200 dark:bg-gradient-to-b dark:from-[#0c2820] dark:to-[#081f18] bg-white p-5 sm:p-7 shadow-lg dark:shadow-2xl overflow-hidden animate-in fade-in duration-300">
              {/* Gold border accent line */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#d6b875]/20 via-[#d6b875] to-[#d6b875]/20" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b dark:border-white/10 border-stone-200 pb-4 mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full dark:bg-[#d6b875]/15 bg-amber-100 border dark:border-[#d6b875]/30 border-amber-300 text-[#8c6d2d] dark:text-[#d6b875] shrink-0">
                    <Gavel size={18} />
                  </span>
                  <div>
                    <span className="text-[10px] dark:text-[#8e9f94] text-stone-500 uppercase tracking-wider block font-semibold">
                      Dictamen del Árbitro Virtual
                    </span>
                    <h3 className="font-serif text-lg sm:text-xl font-semibold dark:text-white text-[#122a22]">
                      {verdict.title}
                    </h3>
                  </div>
                </div>

                {/* Penalty Badge */}
                <div>
                  {verdict.penaltyLevel === 'none' && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 shadow-sm">
                      <CheckCircle2 size={14} /> Sin Penalización (Alivio Gratuito)
                    </span>
                  )}
                  {verdict.penaltyLevel === 'one_stroke' && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d6b875]/50 bg-[#d6b875]/15 px-3 py-1 text-xs font-semibold text-[#8c6d2d] dark:text-[#d6b875] shadow-sm">
                      <AlertTriangle size={14} /> 1 Golpe de Penalización
                    </span>
                  )}
                  {verdict.penaltyLevel === 'two_strokes' && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-800 dark:text-amber-300 shadow-sm">
                      <AlertCircle size={14} /> 2 Golpes / Penalización General
                    </span>
                  )}
                  {verdict.penaltyLevel === 'disqualification' && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/40 bg-red-500/20 px-3 py-1 text-xs font-semibold text-red-600 dark:text-red-400 shadow-sm">
                      <AlertCircle size={14} /> Descalificación
                    </span>
                  )}
                </div>
              </div>

              {/* Verdict Text */}
              <div className="rounded-xl border dark:border-white/10 border-stone-200 dark:bg-[#071b16]/75 bg-stone-50 p-4 sm:p-5 shadow-inner mb-4">
                <h4 className="text-[11px] font-bold text-[#8c6d2d] dark:text-[#d6b875] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <ShieldCheck size={14} /> Veredicto Arbitral Oficial
                </h4>
                <p className="text-sm sm:text-base dark:text-[#f5f2e9] text-[#122a22] leading-relaxed">
                  {verdict.verdict}
                </p>
              </div>

              {/* Procedure Step-by-Step */}
              <div className="space-y-3 mb-4">
                <h4 className="text-[11px] font-semibold dark:text-[#8e9f94] text-stone-600 uppercase tracking-wider">
                  Procedimiento de Campo Paso a Paso
                </h4>
                <div className="grid gap-2">
                  {verdict.procedureSteps.map((step, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 rounded-xl border dark:border-white/5 border-stone-200 dark:bg-white/[0.02] bg-stone-50 p-3 text-xs sm:text-sm dark:text-[#d9dfd6] text-stone-800"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full dark:bg-[#d6b875]/20 bg-amber-100 border dark:border-[#d6b875]/40 border-amber-300 text-[11px] font-bold text-[#8c6d2d] dark:text-[#d6b875]">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips */}
              {verdict.tips && (
                <div className="rounded-xl border dark:border-[#d6b875]/20 border-amber-200 dark:bg-[#d6b875]/5 bg-amber-50 p-3.5 text-xs dark:text-[#efe9d8] text-amber-950 flex items-start gap-2.5 mb-4">
                  <Sparkles size={16} className="text-[#8c6d2d] dark:text-[#d6b875] shrink-0 mt-0.5" />
                  <span>{verdict.tips}</span>
                </div>
              )}

              {/* Official Rule Reference */}
              <div className="border-t dark:border-white/10 border-stone-200 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="rounded-md dark:bg-[#d6b875]/20 bg-amber-100 px-2 py-0.5 text-xs font-bold text-[#8c6d2d] dark:text-[#d6b875]">
                    {verdict.rule.number}
                  </span>
                  <span className="text-xs sm:text-sm dark:text-white text-[#122a22] font-semibold">
                    {verdict.rule.title}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('compendio')
                    setSelectedGroup(0)
                    setSearchQuery(verdict.rule.number)
                    setOpenRule(verdict.rule.id)
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8c6d2d] dark:text-[#d6b875] hover:text-[#5a4313] dark:hover:text-white transition-colors cursor-pointer"
                >
                  <span>Ver artículo completo en el compendio</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: COMPENDIO OFICIAL (25 REGLAS) */}
      {activeTab === 'compendio' && (
        <div>
          {/* Control Panel: Search & Filters */}
          <div className="mb-5 sm:mb-8 space-y-3 sm:space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 dark:text-[#aab8af]" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por regla o término, ej: bunker, dropar, agua..."
                aria-label="Buscar regla de golf"
                className="w-full rounded-2xl border dark:border-white/15 border-stone-300 dark:bg-[#0c2820] bg-white py-3 sm:py-3.5 pl-10 sm:pl-12 pr-10 text-sm dark:text-[#f5f2e9] text-[#122a22] placeholder-stone-400 dark:placeholder-[#64746a] outline-none transition-all focus:border-[#bfa056] dark:focus:border-[#d6b875] focus:ring-1 focus:ring-[#d6b875] shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-800 dark:hover:text-[#f5f2e9]"
                  aria-label="Limpiar búsqueda"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Group Filter Pills */}
            <div className="relative">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 scrollbar-none pr-8">
                <button
                  onClick={() => setSelectedGroup(0)}
                  className={`shrink-0 rounded-full border px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-semibold transition-all cursor-pointer ${
                    selectedGroup === 0
                      ? 'border-[#d6b875] bg-[#d6b875] text-[#13251d] font-bold shadow-sm'
                      : 'dark:border-white/10 dark:text-[#d9dfd6] border-stone-200 bg-white text-stone-700 hover:border-[#bfa056]'
                  }`}
                >
                  Todos ({GOLF_RULES.length})
                </button>
                {GOLF_RULE_GROUPS.map((group) => {
                  const count = GOLF_RULES.filter((r) => r.groupId === group.id).length
                  return (
                    <button
                      key={group.id}
                      onClick={() => setSelectedGroup(group.id)}
                      className={`shrink-0 rounded-full border px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-semibold transition-all cursor-pointer ${
                        selectedGroup === group.id
                          ? 'border-[#d6b875] bg-[#d6b875] text-[#13251d] font-bold shadow-sm'
                          : 'dark:border-white/10 dark:text-[#d9dfd6] border-stone-200 bg-white text-stone-700 hover:border-[#bfa056]'
                      }`}
                    >
                      {group.name} ({count})
                    </button>
                  )
                })}
              </div>
              <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l dark:from-[#071b16] from-[#f8f6f0] to-transparent sm:hidden" />
            </div>
          </div>

          {/* Results Counter */}
          <div className="mb-4 flex items-center justify-between text-xs dark:text-[#aab8af] text-stone-600 font-medium">
            <span>
              Mostrando <strong className="text-[#8c6d2d] dark:text-[#d6b875]">{filteredRules.length}</strong> de {GOLF_RULES.length} reglas oficiales
            </span>
            {selectedGroup > 0 && (
              <button
                onClick={() => setSelectedGroup(0)}
                className="flex items-center gap-1 text-[#8c6d2d] dark:text-[#d6b875] hover:underline font-bold"
              >
                <Filter size={13} /> Limpiar filtro
              </button>
            )}
          </div>

          {/* Rules Accordion List */}
          {filteredRules.length > 0 ? (
            <div className="space-y-3">
              {filteredRules.map((rule) => {
                const groupInfo = GOLF_RULE_GROUPS.find((g) => g.id === rule.groupId)
                const isOpen = openRule === rule.id

                return (
                  <article
                    key={rule.id}
                    className="rounded-2xl border dark:border-white/10 border-stone-200 dark:bg-[#0c2820] bg-white overflow-hidden transition-all shadow-xs"
                  >
                    <button
                      aria-expanded={isOpen}
                      aria-controls={`rule-content-${rule.id}`}
                      onClick={() => setOpenRule(isOpen ? null : rule.id)}
                      className="flex w-full items-center justify-between p-4 sm:p-5 text-left transition-colors dark:hover:bg-white/5 hover:bg-stone-50 cursor-pointer"
                    >
                      <div className="flex items-start gap-3 sm:gap-4 pr-2 sm:pr-4 min-w-0 flex-1">
                        <span className="shrink-0 rounded-lg dark:bg-[#d6b875]/15 bg-amber-100 border dark:border-[#d6b875]/30 border-amber-300 px-2 py-1 text-[10px] sm:text-xs font-bold text-[#8c6d2d] dark:text-[#d6b875] mt-0.5 leading-none">
                          {rule.number}
                        </span>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-serif text-sm sm:text-base lg:text-lg font-medium dark:text-[#f5f2e9] text-[#122a22] leading-snug break-words">
                            {rule.title}
                          </h3>
                          <p className="mt-0.5 text-[11px] sm:text-xs dark:text-[#aab8af] text-stone-500">{groupInfo?.name}</p>
                        </div>
                      </div>
                      <ChevronDown
                        size={18}
                        className={`shrink-0 text-[#8c6d2d] dark:text-[#d6b875] transition-transform duration-300 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div
                        id={`rule-content-${rule.id}`}
                        className="border-t dark:border-white/10 border-stone-200 dark:bg-[#071b16]/60 bg-stone-50 p-4 sm:p-5 lg:p-6 space-y-3 sm:space-y-4 animate-in fade-in duration-200"
                      >
                        <div>
                          <h4 className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#8c6d2d] dark:text-[#d6b875]">
                            Resumen Oficial R&A
                          </h4>
                          <p className="mt-1.5 text-xs sm:text-sm leading-relaxed dark:text-[#f5f2e9] text-[#122a22] break-words">
                            {rule.summary}
                          </p>
                        </div>

                        <div className="rounded-xl border dark:border-white/10 border-stone-200 dark:bg-[#0c2820] bg-white p-3 sm:p-4 shadow-xs">
                          <h4 className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#8c6d2d] dark:text-[#d6b875]">
                            Procedimiento en el Campo
                          </h4>
                          <p className="mt-1 text-xs sm:text-sm leading-relaxed dark:text-[#d9dfd6] text-stone-800 break-words">
                            {rule.procedure}
                          </p>
                        </div>

                        <div className="rounded-xl border dark:border-[#d6b875]/20 border-amber-200 dark:bg-[#d6b875]/5 bg-amber-50 p-3 sm:p-4">
                          <h4 className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#8c6d2d] dark:text-[#d6b875]">
                            <AlertCircle size={13} /> Penalización Aplicable
                          </h4>
                          <p className="mt-1 text-xs leading-relaxed dark:text-[#efe9d8] text-amber-950 break-words font-medium">
                            {rule.penalties}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {rule.keywords.map((kw) => (
                            <span
                              key={kw}
                              className="rounded-full dark:bg-white/5 bg-stone-200/80 border dark:border-white/10 border-stone-300 px-2 py-0.5 text-[10px] dark:text-[#aab8af] text-stone-600 break-words font-medium"
                            >
                              #{kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </article>
                )
              })}
            </div>
          ) : (
            <div className="rounded-2xl border dark:border-white/10 border-stone-200 dark:bg-[#0c2820] bg-white p-10 text-center shadow-sm">
              <p className="text-base dark:text-[#d9dfd6] text-stone-700">No se encontraron reglas coincidentes con "{searchQuery}"</p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedGroup(0)
                }}
                className="mt-4 rounded-full bg-[#d6b875] px-5 py-2 text-xs font-bold text-[#13251d] hover:bg-[#ead49a]"
              >
                Ver todas las 25 Reglas
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
