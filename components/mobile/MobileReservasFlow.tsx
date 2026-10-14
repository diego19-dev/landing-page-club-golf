'use client'

import React, { useState, useMemo } from 'react'
import {
  CalendarDays,
  Clock,
  Users,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  ShieldCheck,
  Flag,
  Share2,
  CalendarPlus,
  UtensilsCrossed,
  Plus,
  Minus,
  Check
} from 'lucide-react'
import { format, addDays } from 'date-fns'
import { es } from 'date-fns/locale'

interface MobileReservasFlowProps {
  onGoToTab?: (tab: any) => void
}

export function MobileReservasFlow({ onGoToTab }: MobileReservasFlowProps) {
  // Step navigation: 1: Course & Time, 2: Players & Extras, 3: Review & Summary, 4: Confirmed Pass
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)

  // 1. Course Selection
  const [courseType, setCourseType] = useState<'18' | '9'>('18')

  // 2. Dynamic 7-day window
  const dateOptions = useMemo(() => {
    const today = new Date()
    return Array.from({ length: 7 }).map((_, i) => {
      const d = addDays(today, i)
      const isToday = i === 0
      const isTomorrow = i === 1
      const label = isToday ? 'Hoy' : isTomorrow ? 'Mañana' : format(d, 'EEE d', { locale: es })
      const fullLabel = format(d, "EEEE, d 'de' MMMM", { locale: es })
      return {
        date: d,
        label,
        subLabel: format(d, 'MMM', { locale: es }),
        fullLabel,
        isoString: d.toISOString().split('T')[0]
      }
    })
  }, [])

  const [selectedDateIndex, setSelectedDateIndex] = useState<number>(0)
  const selectedDateObj = dateOptions[selectedDateIndex]

  // 3. Shift and Time Slots
  const [timeShift, setTimeShift] = useState<'morning' | 'noon' | 'twilight'>('morning')

  const timeSlotsByShift = {
    morning: [
      { time: '07:30', slotsLeft: 4, tag: 'Fresco' },
      { time: '08:00', slotsLeft: 2, tag: 'Popular' },
      { time: '08:30', slotsLeft: 4, tag: 'Recomendado' },
      { time: '09:00', slotsLeft: 1, tag: 'Casi lleno' },
      { time: '09:30', slotsLeft: 3, tag: 'Óptimo' },
      { time: '10:00', slotsLeft: 4, tag: '' },
      { time: '10:30', slotsLeft: 2, tag: '' },
      { time: '11:00', slotsLeft: 4, tag: '' }
    ],
    noon: [
      { time: '12:00', slotsLeft: 4, tag: 'Ritmo rápido' },
      { time: '12:30', slotsLeft: 3, tag: '' },
      { time: '13:00', slotsLeft: 4, tag: 'Sol alto' },
      { time: '13:30', slotsLeft: 2, tag: '' },
      { time: '14:00', slotsLeft: 4, tag: '' },
      { time: '14:30', slotsLeft: 4, tag: '' }
    ],
    twilight: [
      { time: '15:00', slotsLeft: 4, tag: 'Luz dorada' },
      { time: '15:30', slotsLeft: 3, tag: '-15% Tarifa' },
      { time: '16:00', slotsLeft: 2, tag: 'Atardecer' },
      { time: '16:30', slotsLeft: 1, tag: 'Último slot' }
    ]
  }

  const [selectedTime, setSelectedTime] = useState('08:30')

  // 4. Players & Details
  const [players, setPlayers] = useState<number>(2)
  const [leadPlayerName, setLeadPlayerName] = useState('')
  const [handicap, setHandicap] = useState('14.2')

  // Extras
  const [hasCart, setHasCart] = useState<boolean>(true)
  const [hasRentalClubs, setHasRentalClubs] = useState<boolean>(false)
  const [hasCaddie, setHasCaddie] = useState<boolean>(false)

  // Calculations
  const baseGreenFee = courseType === '18' ? (timeShift === 'twilight' ? 80 : 95) : 55
  const cartPrice = hasCart ? (players > 2 ? 70 : 35) : 0
  const rentalPrice = hasRentalClubs ? 25 : 0
  const caddiePrice = hasCaddie ? 40 : 0
  const totalAmount = players * baseGreenFee + cartPrice + rentalPrice + caddiePrice

  // Booking result code
  const [bookingCode, setBookingCode] = useState('MV-2026-T92')
  const [copiedCode, setCopiedCode] = useState(false)
  const [calendarAdded, setCalendarAdded] = useState(false)

  const handleConfirmBooking = () => {
    const randomSuffix = Math.floor(100 + Math.random() * 900)
    setBookingCode(`MV-2026-T${randomSuffix}`)
    setStep(4)
  }

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(bookingCode)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  return (
    <div className="min-h-full flex flex-col p-3.5 gap-3 dark:bg-[#071b16] bg-[#f8f6f0]">
      {/* Header bar */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#8c6d2d] dark:text-[#d6b875]">
              Monteverde Golf Club
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
          </div>
          <h2 className="text-base font-serif font-light dark:text-white text-[#071b16]">
            {step === 4
              ? 'Pase Oficial de Salida'
              : step === 1
              ? 'Recorrido, Fecha & Hora'
              : step === 2
              ? 'Jugadores & Servicios'
              : 'Resumen & Confirmación'}
          </h2>
        </div>

        {/* Step dots */}
        {step < 4 && (
          <div className="flex items-center gap-1.5 bg-stone-200/80 dark:bg-white/5 px-2.5 py-1 rounded-full">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`transition-all duration-300 rounded-full ${
                  step === s
                    ? 'w-5 h-1.5 bg-[#8c6d2d] dark:bg-[#d6b875]'
                    : step > s
                    ? 'w-1.5 h-1.5 bg-[#10b981]'
                    : 'w-1.5 h-1.5 bg-stone-300 dark:bg-white/20'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Main interactive card */}
      <div className="rounded-2xl border dark:border-white/10 border-stone-300/80 dark:bg-[#0c2820] bg-white p-3.5 shadow-xl flex flex-col flex-1 gap-3 overflow-y-auto">
        {/* =========================================================================
            PASO 1: RECORRIDO, FECHA DINÁMICA & HORARIO
            ========================================================================= */}
        {step === 1 && (
          <div className="flex flex-col gap-3.5 flex-1">
            {/* 1. Selector de Recorrido */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider dark:text-stone-300 text-stone-600 block mb-1.5">
                1. Selección de Recorrido:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCourseType('18')}
                  className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                    courseType === '18'
                      ? 'border-[#8c6d2d] dark:border-[#d6b875] bg-[#d6b875]/15 dark:bg-[#d6b875]/10 shadow-xs'
                      : 'border-stone-200 dark:border-white/10 dark:bg-[#071b16] bg-stone-50 text-stone-600 dark:text-stone-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-xs font-bold dark:text-white text-stone-900">18 Hoyos</span>
                    <span className="text-[10px] font-bold text-[#8c6d2d] dark:text-[#d6b875]">€95</span>
                  </div>
                  <span className="text-[9px] text-stone-500 dark:text-stone-400 block mt-0.5">
                    Campeonato Javier Arana · Par 72
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setCourseType('9')}
                  className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                    courseType === '9'
                      ? 'border-[#8c6d2d] dark:border-[#d6b875] bg-[#d6b875]/15 dark:bg-[#d6b875]/10 shadow-xs'
                      : 'border-stone-200 dark:border-white/10 dark:bg-[#071b16] bg-stone-50 text-stone-600 dark:text-stone-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-xs font-bold dark:text-white text-stone-900">9 Hoyos</span>
                    <span className="text-[10px] font-bold text-[#8c6d2d] dark:text-[#d6b875]">€55</span>
                  </div>
                  <span className="text-[9px] text-stone-500 dark:text-stone-400 block mt-0.5">
                    Vuelta Rápida · 2h aprox.
                  </span>
                </button>
              </div>
            </div>

            {/* 2. Selector de Fecha Dinámico */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider dark:text-stone-300 text-stone-600">
                  2. Día de Juego:
                </span>
                <span className="text-[10px] font-semibold text-[#8c6d2d] dark:text-[#d6b875] capitalize">
                  {selectedDateObj.fullLabel}
                </span>
              </div>
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {dateOptions.map((item, idx) => {
                  const isSelected = selectedDateIndex === idx
                  return (
                    <button
                      key={item.isoString}
                      type="button"
                      onClick={() => setSelectedDateIndex(idx)}
                      className={`min-w-[62px] py-2 px-1 rounded-xl text-center cursor-pointer transition-all shrink-0 ${
                        isSelected
                          ? 'bg-[#8c6d2d] dark:bg-[#d6b875] text-white dark:text-[#071b16] font-bold shadow-md'
                          : 'dark:bg-white/5 bg-stone-100 dark:text-stone-300 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      <span className="block text-[11px] font-bold capitalize leading-none">{item.label}</span>
                      <span className="block text-[9px] opacity-80 mt-1 uppercase tracking-tighter">
                        {format(item.date, 'dd/MM')}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 3. Franja Horaria (Tabs) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider dark:text-stone-300 text-stone-600">
                  3. Turno & Salidas:
                </span>
                <span className="text-[9px] text-stone-500 dark:text-stone-400">Intervalos de 10 min</span>
              </div>
              <div className="grid grid-cols-3 gap-1 bg-stone-100 dark:bg-[#071b16] p-1 rounded-xl border border-stone-200 dark:border-white/10 mb-2">
                {(
                  [
                    { id: 'morning', label: 'Mañana', hours: '07-11h' },
                    { id: 'noon', label: 'Mediodía', hours: '12-14h' },
                    { id: 'twilight', label: 'Twilight', hours: '15-17h' }
                  ] as const
                ).map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setTimeShift(s.id)
                      const firstInShift = timeSlotsByShift[s.id][0]?.time
                      if (firstInShift) setSelectedTime(firstInShift)
                    }}
                    className={`py-1.5 px-2 rounded-lg text-center cursor-pointer transition-all ${
                      timeShift === s.id
                        ? 'bg-white dark:bg-[#0c2820] text-[#8c6d2d] dark:text-[#d6b875] font-bold shadow-xs border border-stone-200 dark:border-[#d6b875]/30'
                        : 'text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    <span className="block text-[10px] font-bold">{s.label}</span>
                    <span className="block text-[8px] opacity-75">{s.hours}</span>
                  </button>
                ))}
              </div>

              {/* Grid de Horarios con estado */}
              <div className="grid grid-cols-4 gap-1.5 max-h-[140px] overflow-y-auto pr-0.5">
                {timeSlotsByShift[timeShift].map((t) => {
                  const isSelected = selectedTime === t.time
                  return (
                    <button
                      key={t.time}
                      type="button"
                      onClick={() => setSelectedTime(t.time)}
                      className={`p-2 rounded-xl text-center cursor-pointer relative transition-all ${
                        isSelected
                          ? 'bg-[#8c6d2d] dark:bg-[#d6b875] text-white dark:text-[#071b16] font-bold shadow-sm'
                          : 'dark:bg-[#071b16] bg-stone-100 dark:text-stone-200 text-stone-800 border border-stone-200/80 dark:border-white/5'
                      }`}
                    >
                      <span className="font-mono text-xs font-bold block">{t.time}</span>
                      <span
                        className={`text-[8px] block truncate mt-0.5 ${
                          isSelected
                            ? 'text-white/90 dark:text-[#071b16]'
                            : t.slotsLeft <= 1
                            ? 'text-rose-500 font-semibold'
                            : 'text-stone-500 dark:text-stone-400'
                        }`}
                      >
                        {t.slotsLeft} cupos
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Botón avanzar paso 1 */}
            <button
              type="button"
              onClick={() => setStep(2)}
              className="mt-auto w-full py-3 rounded-xl bg-gradient-to-r from-[#8c6d2d] via-[#d6b875] to-[#8c6d2d] text-[#071b16] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg active:scale-[0.98] cursor-pointer"
            >
              <span>Continuar a Jugadores</span>
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* =========================================================================
            PASO 2: JUGADORES, HÁNDICAP & SERVICIOS EXTRA
            ========================================================================= */}
        {step === 2 && (
          <div className="flex flex-col gap-3.5 flex-1">
            {/* Jugadores */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider dark:text-stone-300 text-stone-600 block mb-1.5">
                Número de Jugadores (Max 4 por grupo):
              </span>
              <div className="flex items-center justify-between p-3 rounded-xl dark:bg-[#071b16] bg-stone-100 border dark:border-white/10 border-stone-200">
                <div>
                  <span className="text-xs font-bold dark:text-white text-stone-900 block">
                    {players} Jugador{players > 1 ? 'es' : ''}
                  </span>
                  <span className="text-[10px] text-[#8c6d2d] dark:text-[#d6b875]">
                    €{baseGreenFee} por green fee
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPlayers((p) => Math.max(1, p - 1))}
                    disabled={players <= 1}
                    className="w-8 h-8 rounded-lg dark:bg-white/10 bg-white border border-stone-300 dark:border-white/10 flex items-center justify-center cursor-pointer disabled:opacity-40"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="font-bold text-base w-4 text-center">{players}</span>
                  <button
                    type="button"
                    onClick={() => setPlayers((p) => Math.min(4, p + 1))}
                    disabled={players >= 4}
                    className="w-8 h-8 rounded-lg dark:bg-white/10 bg-white border border-stone-300 dark:border-white/10 flex items-center justify-center cursor-pointer disabled:opacity-40"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Titular y Hándicap */}
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-wider dark:text-stone-300 text-stone-600 block mb-1">
                  Titular de la reserva:
                </label>
                <input
                  type="text"
                  placeholder="Ej: Alejandro Morales"
                  value={leadPlayerName}
                  onChange={(e) => setLeadPlayerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs border dark:border-white/10 border-stone-300 dark:bg-[#071b16] bg-white dark:text-white text-stone-900 focus:outline-none focus:border-[#d6b875]"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider dark:text-stone-300 text-stone-600 block mb-1">
                  Hándicap:
                </label>
                <input
                  type="text"
                  placeholder="14.2"
                  value={handicap}
                  onChange={(e) => setHandicap(e.target.value)}
                  className="w-full px-2.5 py-2 text-center rounded-xl text-xs border dark:border-white/10 border-stone-300 dark:bg-[#071b16] bg-white dark:text-white text-stone-900 focus:outline-none focus:border-[#d6b875]"
                />
              </div>
            </div>

            {/* Servicios adicionales */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider dark:text-stone-300 text-stone-600 block mb-1.5">
                Servicios & Equipamiento:
              </span>
              <div className="space-y-1.5">
                {/* Buggy */}
                <button
                  type="button"
                  onClick={() => setHasCart(!hasCart)}
                  className={`w-full p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    hasCart
                      ? 'border-[#8c6d2d] dark:border-[#d6b875] bg-[#d6b875]/10 dark:text-[#d6b875] text-[#8c6d2d]'
                      : 'border-stone-200 dark:border-white/10 dark:bg-[#071b16] bg-stone-50 text-stone-600 dark:text-stone-400'
                  }`}
                >
                  <div className="text-left">
                    <span className="text-xs font-semibold block">Buggy Eléctrico con GPS Garmin</span>
                    <span className="text-[9px] opacity-75">Pantalla táctil con distancias al green (+€35)</span>
                  </div>
                  <span className="text-xs font-bold">{hasCart ? '✓ Incluido' : '+ Añadir'}</span>
                </button>

                {/* Palos */}
                <button
                  type="button"
                  onClick={() => setHasRentalClubs(!hasRentalClubs)}
                  className={`w-full p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    hasRentalClubs
                      ? 'border-[#8c6d2d] dark:border-[#d6b875] bg-[#d6b875]/10 dark:text-[#d6b875] text-[#8c6d2d]'
                      : 'border-stone-200 dark:border-white/10 dark:bg-[#071b16] bg-stone-50 text-stone-600 dark:text-stone-400'
                  }`}
                >
                  <div className="text-left">
                    <span className="text-xs font-semibold block">Set Palos Callaway Apex Pro</span>
                    <span className="text-[9px] opacity-75">Bolsa completa de grafito o acero (+€25)</span>
                  </div>
                  <span className="text-xs font-bold">{hasRentalClubs ? '✓ Incluido' : '+ Añadir'}</span>
                </button>

                {/* Caddie */}
                <button
                  type="button"
                  onClick={() => setHasCaddie(!hasCaddie)}
                  className={`w-full p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    hasCaddie
                      ? 'border-[#8c6d2d] dark:border-[#d6b875] bg-[#d6b875]/10 dark:text-[#d6b875] text-[#8c6d2d]'
                      : 'border-stone-200 dark:border-white/10 dark:bg-[#071b16] bg-stone-50 text-stone-600 dark:text-stone-400'
                  }`}
                >
                  <div className="text-left">
                    <span className="text-xs font-semibold block">Caddie de Campo Titulado</span>
                    <span className="text-[9px] opacity-75">Lectura de caídas y asesoría de palo (+€40)</span>
                  </div>
                  <span className="text-xs font-bold">{hasCaddie ? '✓ Incluido' : '+ Añadir'}</span>
                </button>
              </div>
            </div>

            {/* Botones de navegación paso 2 */}
            <div className="flex gap-2 mt-auto pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="py-3 px-4 rounded-xl dark:bg-white/5 bg-stone-200 text-xs font-bold dark:text-white text-stone-800 cursor-pointer flex items-center gap-1"
              >
                <ChevronLeft size={16} />
                Atrás
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#8c6d2d] via-[#d6b875] to-[#8c6d2d] text-[#071b16] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg active:scale-[0.98] cursor-pointer"
              >
                <span>Revisar Resumen (€{totalAmount})</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            PASO 3: RESUMEN DETALLADO Y CONFIRMACIÓN
            ========================================================================= */}
        {step === 3 && (
          <div className="flex flex-col gap-3 flex-1">
            <span className="text-[10px] font-bold uppercase tracking-wider dark:text-stone-300 text-stone-600 block">
              Desglose de la Ronda:
            </span>

            <div className="p-3.5 rounded-xl dark:bg-[#071b16] bg-stone-100 border dark:border-white/10 border-stone-200/80 space-y-2 text-xs">
              <div className="flex justify-between items-center pb-2 border-b dark:border-white/10 border-stone-200">
                <span className="text-stone-500 dark:text-stone-400">Recorrido:</span>
                <span className="font-bold dark:text-white text-stone-900">
                  {courseType === '18' ? '18 Hoyos Championship' : '9 Hoyos Rápido'}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-stone-500 dark:text-stone-400">Fecha & Hora:</span>
                <span className="font-bold dark:text-white text-stone-900">
                  {selectedDateObj.label} · {selectedTime}h
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-stone-500 dark:text-stone-400">
                  Green Fees ({players} × €{baseGreenFee}):
                </span>
                <span className="font-mono font-semibold dark:text-white text-stone-900">
                  €{players * baseGreenFee}
                </span>
              </div>

              {hasCart && (
                <div className="flex justify-between items-center">
                  <span className="text-stone-500 dark:text-stone-400">Buggy GPS:</span>
                  <span className="font-mono font-semibold dark:text-white text-stone-900">€{cartPrice}</span>
                </div>
              )}

              {hasRentalClubs && (
                <div className="flex justify-between items-center">
                  <span className="text-stone-500 dark:text-stone-400">Palos Callaway Apex:</span>
                  <span className="font-mono font-semibold dark:text-white text-stone-900">€{rentalPrice}</span>
                </div>
              )}

              {hasCaddie && (
                <div className="flex justify-between items-center">
                  <span className="text-stone-500 dark:text-stone-400">Caddie de Campo:</span>
                  <span className="font-mono font-semibold dark:text-white text-stone-900">€{caddiePrice}</span>
                </div>
              )}

              <div className="border-t dark:border-white/15 border-stone-300 pt-2.5 flex justify-between items-baseline">
                <div>
                  <span className="font-serif font-bold text-sm text-[#8c6d2d] dark:text-[#d6b875]">Total Reserva</span>
                  <span className="text-[9px] text-stone-400 block">IVA incluido · Pago en Casa Club</span>
                </div>
                <span className="font-serif font-bold text-xl text-[#8c6d2d] dark:text-[#d6b875]">
                  €{totalAmount}
                </span>
              </div>
            </div>

            {/* Política de cancelación y código de honor */}
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[10px] text-stone-600 dark:text-stone-300 leading-relaxed">
              <span className="font-bold block text-amber-700 dark:text-amber-400 mb-0.5">
                Código de Honor & Presentación:
              </span>
              Presentarse en el Puesto de Starter 15 minutos antes de la hora. Calzado con softspikes y vestimenta reglamentaria R&amp;A. Cancelación sin coste hasta 24h previas.
            </div>

            {/* Botones confirmación */}
            <div className="flex gap-2 mt-auto pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="py-3 px-4 rounded-xl dark:bg-white/5 bg-stone-200 text-xs font-bold dark:text-white text-stone-800 cursor-pointer flex items-center gap-1"
              >
                <ChevronLeft size={16} />
                Editar
              </button>
              <button
                type="button"
                onClick={handleConfirmBooking}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#10b981] via-[#059669] to-[#10b981] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] cursor-pointer"
              >
                <CheckCircle2 size={16} />
                <span>Confirmar Reserva</span>
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            PASO 4: PASE OFICIAL DE SALIDA CONFIRMADO (BOARDING PASS DIGITAL)
            ========================================================================= */}
        {step === 4 && (
          <div className="my-auto py-2 text-center flex flex-col items-center">
            {/* Success icon badge */}
            <div className="w-14 h-14 rounded-full bg-[#10b981]/20 border-2 border-[#10b981] text-[#10b981] flex items-center justify-center mx-auto mb-2 animate-in zoom-in duration-300">
              <CheckCircle2 size={32} />
            </div>

            <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#8c6d2d] dark:text-[#d6b875]">
              Salida Registrada
            </span>
            <h3 className="font-serif text-xl font-bold dark:text-white text-stone-900 mt-0.5">
              ¡Buen Juego en Monteverde!
            </h3>

            {/* Digital Boarding Pass Ticket */}
            <div className="w-full mt-3 p-3.5 rounded-2xl dark:bg-[#071b16] bg-stone-100 border dark:border-[#d6b875]/30 border-stone-300 shadow-md text-left relative overflow-hidden">
              <div className="flex justify-between items-start border-b dark:border-white/10 border-stone-200 pb-2.5">
                <div>
                  <span className="text-[9px] uppercase font-bold tracking-wider text-stone-400 block">
                    Pase Oficial de Salida
                  </span>
                  <span className="font-mono text-base font-bold text-[#8c6d2d] dark:text-[#d6b875]">
                    {bookingCode}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="px-2 py-1 rounded-lg dark:bg-white/10 bg-white border border-stone-300 dark:border-white/10 text-[10px] font-semibold text-stone-600 dark:text-stone-300 flex items-center gap-1 cursor-pointer"
                >
                  {copiedCode ? <Check size={11} className="text-[#10b981]" /> : <Share2 size={11} />}
                  <span>{copiedCode ? 'Copiado' : 'Copiar'}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-2.5 text-xs">
                <div>
                  <span className="text-[9px] text-stone-400 block">Fecha & Tee:</span>
                  <span className="font-bold dark:text-white text-stone-800">
                    {selectedDateObj.label} · {selectedTime}h (Tee 1)
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-stone-400 block">Recorrido:</span>
                  <span className="font-bold dark:text-white text-stone-800">
                    {courseType === '18' ? '18 Hoyos Arana' : '9 Hoyos Rápido'}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-stone-400 block">Jugadores:</span>
                  <span className="font-bold dark:text-white text-stone-800">
                    {players} pax {leadPlayerName ? `(${leadPlayerName})` : ''}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-stone-400 block">Importe a pagar:</span>
                  <span className="font-bold text-[#8c6d2d] dark:text-[#d6b875]">€{totalAmount}</span>
                </div>
              </div>

              {hasCart && (
                <div className="mt-2 text-[10px] text-[#10b981] flex items-center gap-1 font-semibold">
                  <Check size={12} /> Buggy con GPS asignado y cargado
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2 w-full mt-3">
              <button
                type="button"
                onClick={() => {
                  setCalendarAdded(true)
                  setTimeout(() => setCalendarAdded(false), 3000)
                }}
                className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                  calendarAdded
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 font-bold'
                    : 'dark:border-white/15 border-stone-300 dark:bg-white/5 bg-white text-stone-700 dark:text-stone-200'
                }`}
              >
                {calendarAdded ? (
                  <>
                    <Check size={14} className="text-[#10b981]" />
                    <span>¡Añadido!</span>
                  </>
                ) : (
                  <>
                    <CalendarPlus size={14} className="text-[#8c6d2d] dark:text-[#d6b875]" />
                    <span>Añadir a Calendario</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => onGoToTab?.('club')}
                className="py-2.5 px-3 rounded-xl border dark:border-white/15 border-stone-300 dark:bg-white/5 bg-white text-stone-700 dark:text-stone-200 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <UtensilsCrossed size={14} className="text-[#8c6d2d] dark:text-[#d6b875]" />
                <span>Reservar Restaurante</span>
              </button>
            </div>

            {/* Reset button */}
            <button
              type="button"
              onClick={() => {
                setStep(1)
              }}
              className="mt-3 w-full py-2.5 rounded-xl bg-stone-200 dark:bg-white/10 text-stone-800 dark:text-white font-bold text-xs uppercase tracking-wider cursor-pointer active:scale-[0.98]"
            >
              Realizar Otra Reserva
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
