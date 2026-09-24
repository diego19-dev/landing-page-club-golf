'use client'

import { useState, useMemo } from 'react'
import { SectionId } from '@/types'
import { TIMES } from '@/data/clubData'
import { CalendarDays, Check, Minus, Plus, Sparkles, User, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { es } from 'date-fns/locale'
import { format, addDays, isSameDay } from 'date-fns'

interface ReservasSectionProps {
  activeSection: SectionId
}

export function ReservasSection({ activeSection }: ReservasSectionProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(() => new Date())
  const [selectedTime, setSelectedTime] = useState('05:30')
  const [timeFilter, setTimeFilter] = useState<'all' | 'morning' | 'afternoon'>('all')
  const [players, setPlayers] = useState(2)
  const [cart, setCart] = useState(false)
  const [fullName, setFullName] = useState('')
  const [booked, setBooked] = useState(false)

  const greenFeePerPlayer = 95
  const cartPrice = 35
  const totalPrice = players * greenFeePerPlayer + (cart ? cartPrice : 0)

  const formattedDate = selectedDate
    ? format(selectedDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })
    : ''

  // Filter times by morning / afternoon shift
  const filteredTimes = useMemo(() => {
    if (timeFilter === 'morning') {
      return TIMES.filter((t) => t < '12:00')
    }
    if (timeFilter === 'afternoon') {
      return TIMES.filter((t) => t >= '12:00')
    }
    return TIMES
  }, [timeFilter])

  // Quick date options calculation
  const quickDates = useMemo(() => {
    const today = new Date()
    const tomorrow = addDays(today, 1)
    const dayOfWeek = today.getDay()
    const daysUntilSaturday = (6 - dayOfWeek + 7) % 7 || 7
    const daysUntilSunday = (7 - dayOfWeek + 7) % 7 || 7
    const saturday = addDays(today, daysUntilSaturday)
    const sunday = addDays(today, daysUntilSunday)

    return [
      { label: 'Hoy', date: today },
      { label: 'Mañana', date: tomorrow },
      { label: 'Sábado', date: saturday },
      { label: 'Domingo', date: sunday },
    ]
  }, [])

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDate) return
    setBooked(true)
  }

  return (
    <section
      id="reservas"
      className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-14 animate-in fade-in duration-300 overflow-x-hidden"
    >
      <div className="mb-6 sm:mb-8 flex items-end justify-between">
        <div>
          <p className="eyebrow">01 · Tu ronda</p>
          <h2 className="section-title">
            Reserva tu<br />
            <em>tee time.</em>
          </h2>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#d6b875]/30 bg-[#d6b875]/10 text-[#d6b875] text-xs font-medium">
          <Sparkles size={14} />
          <span>Disponibilidad en tiempo real</span>
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-[1.1fr_.9fr]">
        {/* Left: Calendar + Times */}
        <div className="rounded-2xl border dark:border-white/10 border-stone-200/90 dark:bg-[#0c2820] bg-white p-4 sm:p-6 lg:p-7 shadow-lg dark:shadow-xl flex flex-col justify-between transition-colors duration-200">
          <div>
            {/* Header with Date status */}
            <div className="mb-3 flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between border-b dark:border-white/10 border-stone-200 pb-3">
              <div className="flex items-center gap-2">
                <CalendarDays size={16} className="text-[#8c6d2d] dark:text-[#d6b875]" />
                <span className="eyebrow">Selecciona fecha</span>
              </div>
              {selectedDate && (
                <div className="flex items-center gap-1.5">
                  <span className="inline-block h-2 w-2 rounded-full bg-[#d6b875] animate-pulse" />
                  <span className="text-xs sm:text-xs font-semibold text-[#8c6d2d] dark:text-[#d6b875] capitalize truncate">
                    {formattedDate}
                  </span>
                </div>
              )}
            </div>

            {/* Quick date selector pills */}
            <div className="mb-3 flex flex-wrap gap-1.5 sm:gap-2">
              {quickDates.map((item) => {
                const isSelected = selectedDate && isSameDay(selectedDate, item.date)
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      setSelectedDate(item.date)
                      setBooked(false)
                    }}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'border border-[#d6b875] bg-[#d6b875] text-[#071b16] font-bold shadow-sm'
                        : 'dark:border-white/10 dark:bg-white/5 dark:text-[#c2ccbf] dark:hover:border-[#d6b875]/50 dark:hover:text-white border-stone-200 bg-stone-100 text-stone-700 hover:border-[#bfa056] hover:text-[#122a22]'
                    }`}
                  >
                    {item.label}
                  </button>
                )
              })}
            </div>

            {/* Calendar Container */}
            <div className="p-2 sm:p-3 rounded-xl dark:bg-[#071b16]/75 bg-stone-50 border dark:border-white/10 border-stone-200 shadow-inner">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  if (date) {
                    setSelectedDate(date)
                    setBooked(false)
                  }
                }}
                disabled={{ before: new Date(new Date().setHours(0, 0, 0, 0)) }}
              />

              {/* Availability Legend */}
              <div className="mt-3 pt-2.5 border-t dark:border-white/5 border-stone-200 flex items-center justify-center gap-4 text-[11px] dark:text-[#8e9f94] text-stone-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#d6b875] inline-block shadow-sm" />
                  <span>Seleccionado</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#167052] inline-block" />
                  <span>Disponible</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full border border-[#d6b875]/70 bg-transparent inline-block" />
                  <span>Hoy</span>
                </div>
              </div>
            </div>

            {/* Time slots */}
            <div className="mt-5 sm:mt-6">
              <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between mb-2 sm:mb-2.5">
                <label className="eyebrow block">Horarios disponibles</label>
                <span className="text-[11px] dark:text-[#8e9f94] text-stone-500">05:30 a 18:00 · Tee cada 30 min</span>
              </div>

              {/* Shift Filter Pills */}
              <div className="flex items-center gap-1.5 mb-2.5">
                <button
                  type="button"
                  onClick={() => setTimeFilter('all')}
                  className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-all cursor-pointer ${
                    timeFilter === 'all'
                      ? 'dark:bg-[#d6b875]/20 dark:text-[#d6b875] dark:border-[#d6b875]/40 bg-amber-100 text-amber-900 border border-amber-300 font-bold'
                      : 'dark:bg-white/5 dark:text-[#aab8af] dark:border-transparent dark:hover:text-white bg-stone-100 text-stone-600 border border-stone-200 hover:text-stone-900'
                  }`}
                >
                  Todos ({TIMES.length})
                </button>
                <button
                  type="button"
                  onClick={() => setTimeFilter('morning')}
                  className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-all cursor-pointer ${
                    timeFilter === 'morning'
                      ? 'dark:bg-[#d6b875]/20 dark:text-[#d6b875] dark:border-[#d6b875]/40 bg-amber-100 text-amber-900 border border-amber-300 font-bold'
                      : 'dark:bg-white/5 dark:text-[#aab8af] dark:border-transparent dark:hover:text-white bg-stone-100 text-stone-600 border border-stone-200 hover:text-stone-900'
                  }`}
                >
                  Mañana (05:30 - 11:30)
                </button>
                <button
                  type="button"
                  onClick={() => setTimeFilter('afternoon')}
                  className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-all cursor-pointer ${
                    timeFilter === 'afternoon'
                      ? 'dark:bg-[#d6b875]/20 dark:text-[#d6b875] dark:border-[#d6b875]/40 bg-amber-100 text-amber-900 border border-amber-300 font-bold'
                      : 'dark:bg-white/5 dark:text-[#aab8af] dark:border-transparent dark:hover:text-white bg-stone-100 text-stone-600 border border-stone-200 hover:text-stone-900'
                  }`}
                >
                  Tarde (12:00 - 18:00)
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 min-[360px]:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 max-h-[170px] overflow-y-auto pr-1">
                {filteredTimes.map((time) => (
                  <button
                    key={time}
                    onClick={() => {
                      setSelectedTime(time)
                      setBooked(false)
                    }}
                    className={`rounded-lg border px-2 py-2 text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                      selectedTime === time
                        ? 'border-[#d6b875] bg-[#d6b875] text-[#071b16] font-bold shadow-md scale-[1.02]'
                        : 'dark:border-white/10 dark:bg-white/[0.02] dark:text-[#d9dfd6] dark:hover:border-[#d6b875]/60 dark:hover:text-white border-stone-200 bg-white text-stone-700 hover:border-[#bfa056] hover:text-[#122a22] shadow-xs'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Luxury Booking Card */}
        <div className="relative rounded-2xl border dark:border-white/15 border-stone-200/90 dark:bg-gradient-to-b dark:from-[#0e2c23] dark:to-[#071c16] bg-white p-5 sm:p-6 lg:p-7 dark:text-[#f5f2e9] text-[#122a22] shadow-lg dark:shadow-2xl flex flex-col justify-between overflow-hidden transition-colors duration-200">
          {/* Top golden accent line */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#d6b875]/50 to-transparent" />

          <div>
            {/* Header */}
            <div className="flex items-center justify-between border-b dark:border-white/10 border-stone-200 pb-3">
              <div>
                <p className="eyebrow text-[#8c6d2d] dark:text-[#d6b875]">Confirmar Reserva</p>
                <h3 className="font-serif text-lg sm:text-xl font-medium dark:text-white text-[#122a22] tracking-wide">
                  Pase de Campo · 18 Hoyos
                </h3>
              </div>
              <div className="h-10 w-10 rounded-full dark:bg-[#d6b875]/10 bg-amber-50 border dark:border-[#d6b875]/30 border-amber-200 flex items-center justify-center text-[#8c6d2d] dark:text-[#d6b875] shrink-0 shadow-inner">
                <ShieldCheck size={20} />
              </div>
            </div>

            {/* Selected Date & Time Glass Card */}
            {selectedDate && (
              <div className="mt-3.5 p-3 rounded-xl dark:bg-[#071b16]/75 bg-stone-50 border dark:border-white/10 border-stone-200 flex items-center justify-between gap-3 shadow-inner">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="h-8 w-8 rounded-lg dark:bg-[#d6b875]/15 bg-amber-100 border dark:border-[#d6b875]/30 border-amber-300 flex items-center justify-center text-[#8c6d2d] dark:text-[#d6b875] shrink-0">
                    <CalendarDays size={16} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] dark:text-[#8e9f94] text-stone-500 uppercase tracking-wider block font-semibold">Fecha de salida</span>
                    <span className="text-xs sm:text-sm font-semibold dark:text-[#f5f2e9] text-[#122a22] capitalize truncate block">
                      {formattedDate}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0 border-l dark:border-white/10 border-stone-200 pl-3">
                  <span className="text-[10px] dark:text-[#8e9f94] text-stone-500 uppercase tracking-wider block font-semibold">Tee Time</span>
                  <span className="text-xs sm:text-sm font-bold text-[#8c6d2d] dark:text-[#d6b875] flex items-center gap-1 justify-end">
                    <Clock size={13} /> {selectedTime}
                  </span>
                </div>
              </div>
            )}

            <form onSubmit={handleBookingSubmit} className="mt-4 space-y-4">
              {/* Titular Input */}
              <div>
                <label className="text-[11px] font-semibold dark:text-[#c2ccbf] text-stone-700 mb-1.5 block uppercase tracking-wider">
                  Titular de la reserva
                </label>
                <div className="relative flex items-center rounded-xl border dark:border-white/10 border-stone-300 dark:bg-[#071b16]/80 bg-stone-50 px-3.5 py-2.5 focus-within:border-[#8c6d2d] dark:focus-within:border-[#d6b875] focus-within:ring-1 focus-within:ring-[#d6b875]/40 transition-all">
                  <User size={16} className="text-[#8c6d2d] dark:text-[#d6b875] mr-2.5 shrink-0" />
                  <input
                    type="text"
                    placeholder="Nombre y apellidos completos"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full bg-transparent text-sm dark:text-white text-[#122a22] dark:placeholder:text-[#64746a] placeholder:text-stone-400 outline-none"
                  />
                </div>
              </div>

              {/* Jugadores Party Selector */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-semibold dark:text-[#c2ccbf] text-stone-700 uppercase tracking-wider">
                    Número de jugadores
                  </label>
                  <span className="text-[11px] font-bold text-[#8c6d2d] dark:text-[#d6b875]">€{greenFeePerPlayer} / jugador</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => {
                        setPlayers(num)
                        setBooked(false)
                      }}
                      className={`py-2 rounded-xl border text-xs font-semibold transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                        players === num
                          ? 'border-[#d6b875] bg-[#d6b875] text-[#071b16] font-bold shadow-md shadow-[#d6b875]/25 scale-[1.02]'
                          : 'dark:border-white/10 dark:bg-[#071b16]/60 dark:text-[#c2ccbf] border-stone-200 bg-stone-50 text-stone-700 hover:border-stone-400'
                      }`}
                    >
                      <span className="text-sm font-bold leading-none">{num}</span>
                      <span className="text-[9px] opacity-75 font-normal">
                        {num === 1 ? 'Jugador' : 'Jugadores'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Carrito de Golf / Buggy Option */}
              <div
                onClick={() => {
                  setCart(!cart)
                  setBooked(false)
                }}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between select-none ${
                  cart
                    ? 'dark:border-[#d6b875]/60 dark:bg-[#d6b875]/10 border-amber-300 bg-amber-50/90'
                    : 'dark:border-white/10 dark:bg-[#071b16]/60 border-stone-200 bg-stone-50 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`h-8 w-8 rounded-lg flex items-center justify-center transition-colors ${
                      cart ? 'bg-[#d6b875] text-[#071b16]' : 'dark:bg-white/5 bg-stone-200 dark:text-[#8e9f94] text-stone-600'
                    }`}
                  >
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold dark:text-white text-[#122a22] leading-tight">
                      Carrito de golf eléctrico (Buggy)
                    </p>
                    <p className="text-[11px] dark:text-[#8e9f94] text-stone-500 font-medium">GPS de campo · Autonomía 36 hoyos</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#8c6d2d] dark:text-[#d6b875]">+€35</span>
                  {/* Custom Toggle Switch */}
                  <div
                    className={`w-9 h-5 rounded-full transition-colors relative flex items-center px-0.5 ${
                      cart ? 'bg-[#d6b875]' : 'dark:bg-white/20 bg-stone-300'
                    }`}
                  >
                    <div
                      className={`h-4 w-4 rounded-full bg-[#071b16] transition-transform ${
                        cart ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="rounded-xl dark:bg-[#071b16]/70 bg-stone-50 border dark:border-white/5 border-stone-200 p-3 space-y-1.5 text-xs dark:text-[#aab8af] text-stone-600">
                <div className="flex justify-between">
                  <span>Green Fee ({players} {players === 1 ? 'jugador' : 'jugadores'})</span>
                  <span className="dark:text-white text-stone-900 font-bold">€{players * greenFeePerPlayer}</span>
                </div>
                {cart && (
                  <div className="flex justify-between text-[#8c6d2d] dark:text-[#d6b875] font-semibold">
                    <span>Carrito de golf</span>
                    <span className="font-bold">+€{cartPrice}</span>
                  </div>
                )}
                <div className="border-t dark:border-white/10 border-stone-200 pt-1.5 mt-1 flex justify-between text-sm font-bold dark:text-white text-stone-900">
                  <span>Total estimado</span>
                  <span className="text-base text-[#8c6d2d] dark:text-[#d6b875]">€{totalPrice}</span>
                </div>
              </div>

              {/* Confirmation Status */}
              {booked ? (
                <div className="rounded-xl dark:bg-[#167052]/25 dark:border-[#167052]/60 bg-emerald-50 border border-emerald-300 p-3.5 text-sm animate-in fade-in">
                  <p className="flex items-center gap-2 font-bold dark:text-[#68d391] text-emerald-800">
                    <CheckCircle2 size={18} /> ¡Solicitud confirmada con éxito!
                  </p>
                  <p className="mt-1 text-xs dark:text-[#c2ccbf] text-stone-600 leading-relaxed">
                    Reserva registrada para <strong className="dark:text-white text-stone-900">{fullName}</strong> el <span className="capitalize dark:text-white text-stone-900 font-medium">{formattedDate}</span> a las <strong className="text-[#8c6d2d] dark:text-[#d6b875]">{selectedTime}</strong> ({players} {players === 1 ? 'jugador' : 'jugadores'}).
                  </p>
                </div>
              ) : null}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-[#d6b875] via-[#e5c98d] to-[#c7a054] py-3.5 px-4 text-sm font-bold text-[#071b16] transition-all hover:scale-[1.01] hover:shadow-lg hover:shadow-[#d6b875]/25 focus:outline-none focus:ring-2 focus:ring-[#d6b875]/50 cursor-pointer flex items-center justify-center gap-2"
              >
                {booked ? (
                  <>
                    <Check size={18} /> Reserva Enviada ✓
                  </>
                ) : (
                  <>
                    <span>Confirmar Reserva · €{totalPrice}</span>
                  </>
                )}
              </button>

              {/* Trust Indicators */}
              <p className="text-[10px] text-center dark:text-[#8e9f94] text-stone-500 font-medium flex items-center justify-center gap-2 pt-1">
                <span>🔒 Reserva segura</span>
                <span>·</span>
                <span>Cancelación gratuita 24h</span>
                <span>·</span>
                <span>Pago en club</span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

