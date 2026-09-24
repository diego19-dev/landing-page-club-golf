'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { StarterGroup } from '@/types'
import { DaySchedule } from '@/types/analytics'
import { useAuth } from '@/lib/auth-context'
import { getSevenDaysWindow, getInitialGroupsForDate } from '@/data/starterScheduleData'
import {
  Flag,
  Clock,
  Users,
  CheckCircle,
  Plus,
  Play,
  RotateCcw,
  Search,
  BellRing,
  Check,
  Car,
  Radio,
  Calendar,
  Sparkles,
  Info,
  TrendingUp,
  X,
  Filter
} from 'lucide-react'

export function StarterSection() {
  const { user } = useAuth()

  // 7 days window (Hoy hasta Hoy + 7 días)
  const daysWindow: DaySchedule[] = useMemo(() => getSevenDaysWindow(), [])
  const [selectedDateStr, setSelectedDateStr] = useState<string>(daysWindow[0]?.date || '')

  // State of groups indexed by date YYYY-MM-DD
  const [groupsByDate, setGroupsByDate] = useState<Record<string, StarterGroup[]>>(() => {
    const initialMap: Record<string, StarterGroup[]> = {}
    daysWindow.forEach((day) => {
      initialMap[day.date] = getInitialGroupsForDate(day.date)
    })
    return initialMap
  })

  const [selectedTee, setSelectedTee] = useState<'all' | '1' | '10'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'espera' | 'llamado' | 'en_juego' | 'finalizado'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentTime, setCurrentTime] = useState<string>('')

  // Walk-in modal
  const [showAddModal, setShowAddModal] = useState(false)
  const [newPlayerName, setNewPlayerName] = useState('')
  const [newPlayerHcp, setNewPlayerHcp] = useState('12.0')
  const [newGroupTime, setNewGroupTime] = useState('09:30')
  const [newGroupTee, setNewGroupTee] = useState<'1' | '10'>('1')

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setCurrentTime(
        now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      )
    }
    update()
    const timer = setInterval(update, 1000)
    return () => clearInterval(timer)
  }, [])

  const currentGroups = groupsByDate[selectedDateStr] || []
  const activeDayInfo = daysWindow.find((d) => d.date === selectedDateStr) || daysWindow[0]

  const updateCurrentGroups = (updater: (prev: StarterGroup[]) => StarterGroup[]) => {
    setGroupsByDate((prev) => ({
      ...prev,
      [selectedDateStr]: updater(prev[selectedDateStr] || []),
    }))
  }

  const togglePlayerCheckin = (groupId: string, playerId: string) => {
    updateCurrentGroups((prev) =>
      prev.map((grp) => {
        if (grp.id !== groupId) return grp
        return {
          ...grp,
          players: grp.players.map((p) =>
            p.id === playerId ? { ...p, isCheckedIn: !p.isCheckedIn } : p
          ),
        }
      })
    )
  }

  const updateGroupStatus = (groupId: string, newStatus: StarterGroup['status']) => {
    updateCurrentGroups((prev) =>
      prev.map((grp) => {
        if (grp.id !== groupId) return grp
        return { ...grp, status: newStatus }
      })
    )
  }

  const adjustDelay = (groupId: string, deltaMinutes: number) => {
    updateCurrentGroups((prev) =>
      prev.map((grp) => {
        if (grp.id !== groupId) return grp
        const delayMinutes = Math.max(0, grp.delayMinutes + deltaMinutes)
        return { ...grp, delayMinutes }
      })
    )
  }

  const adjustCarts = (groupId: string, delta: number) => {
    updateCurrentGroups((prev) =>
      prev.map((grp) => {
        if (grp.id !== groupId) return grp
        return { ...grp, carts: Math.max(0, Math.min(4, grp.carts + delta)) }
      })
    )
  }

  const handleAddWalkIn = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPlayerName.trim()) return

    const newGroup: StarterGroup = {
      id: `${selectedDateStr}-grp-${Date.now()}`,
      time: newGroupTime,
      tee: newGroupTee,
      players: [
        {
          id: `${selectedDateStr}-p-${Date.now()}`,
          name: newPlayerName,
          handicap: parseFloat(newPlayerHcp) || 15.0,
          isCheckedIn: true,
        },
      ],
      carts: 1,
      status: 'espera',
      notes: `Walk-in registrado para el ${selectedDateStr}`,
      delayMinutes: 0,
    }

    updateCurrentGroups((prev) => [...prev, newGroup].sort((a, b) => a.time.localeCompare(b.time)))
    setNewPlayerName('')
    setShowAddModal(false)
  }

  // Live status counts for the selected day
  const statusCounts = useMemo(() => {
    const counts = {
      all: currentGroups.length,
      espera: 0,
      llamado: 0,
      en_juego: 0,
      finalizado: 0,
    }
    currentGroups.forEach((g) => {
      if (counts[g.status] !== undefined) {
        counts[g.status]++
      }
    })
    return counts
  }, [currentGroups])

  const filteredGroups = currentGroups.filter((g) => {
    if (selectedTee !== 'all' && g.tee !== selectedTee) return false
    if (statusFilter !== 'all' && g.status !== statusFilter) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      const matchPlayer = g.players.some((p) => p.name.toLowerCase().includes(q))
      const matchTime = g.time.includes(q)
      if (!matchPlayer && !matchTime) return false
    }
    return true
  })

  // Metrics for current day
  const totalPlayersInPlay = currentGroups
    .filter((g) => g.status === 'en_juego')
    .reduce((acc, g) => acc + g.players.length, 0)
  const totalCartsInUse = currentGroups
    .filter((g) => g.status === 'en_juego' || g.status === 'llamado')
    .reduce((acc, g) => acc + g.carts, 0)
  const waitingGroups = currentGroups.filter((g) => g.status === 'espera' || g.status === 'llamado').length

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-10 animate-in fade-in duration-300">
      {/* Top Banner with Starter Identity */}
      <div className="rounded-3xl border dark:border-[#10b981]/30 border-emerald-300 dark:bg-gradient-to-r dark:from-[#0c2820] dark:via-[#071b16] dark:to-[#0c2820] bg-white p-6 sm:p-7 mb-6 relative overflow-hidden shadow-lg dark:shadow-2xl dark:shadow-black/60 transition-colors duration-200">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#10b981]/15 via-transparent to-transparent pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider dark:bg-[#10b981]/20 dark:text-[#6ee7b7] bg-emerald-100 text-emerald-800 border dark:border-[#10b981]/30 border-emerald-300">
                <Radio size={12} className="animate-pulse text-[#10b981]" />
                Puesto Oficial de Control
              </span>
              <span className="text-xs dark:text-stone-400 text-stone-500 font-medium">Monteverde Championship Course</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl dark:text-[#efe9d8] text-[#122a22] font-bold tracking-tight">
              Control de Salidas & Tee Times
            </h1>
            <p className="text-xs sm:text-sm dark:text-[#aab8af] text-stone-600 mt-1.5">
              Starter a cargo:{' '}
              <strong className="dark:text-[#efe9d8] text-[#122a22]">{user?.name || 'Mateo Valenzuela'}</strong> ·{' '}
              <span className="text-[#8c6d2d] dark:text-[#d6b875] font-semibold">{user?.title || 'Starter Jefe Hoyos 1 y 10'}</span>
            </p>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <div className="rounded-2xl border dark:border-white/10 border-stone-200 dark:bg-[#051410]/90 bg-stone-50 backdrop-blur-md px-4 py-2.5 text-center min-w-[130px] shadow-inner">
              <div className="text-[10px] uppercase font-semibold tracking-wider dark:text-stone-400 text-stone-500 flex items-center justify-center gap-1">
                <Clock size={12} className="text-[#8c6d2d] dark:text-[#d6b875]" /> Hora Oficial
              </div>
              <div className="font-mono text-xl sm:text-2xl font-bold dark:text-[#efe9d8] text-[#122a22] mt-0.5">
                {currentTime || '08:00:00'}
              </div>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-3 rounded-2xl bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#34d399] hover:to-[#10b981] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-[#10b981]/20 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus size={16} strokeWidth={2.5} />
              <span>Salida Rápida (Walk-in)</span>
            </button>
          </div>
        </div>

        {/* Operational Stats Row for Selected Date */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t dark:border-white/10 border-stone-200">
          <div className="p-3.5 rounded-2xl dark:bg-white/5 bg-stone-50 border dark:border-white/5 border-stone-200">
            <div className="text-[10px] uppercase font-semibold dark:text-stone-400 text-stone-500 flex items-center justify-between">
              <span>Grupos en Espera</span>
              <Users size={13} className="text-[#8c6d2d] dark:text-[#d6b875]" />
            </div>
            <div className="text-2xl font-bold dark:text-[#efe9d8] text-[#122a22] mt-1 font-mono">{waitingGroups}</div>
            <div className="text-[10px] dark:text-[#6ee7b7] text-emerald-700 font-medium mt-0.5">En putting green / range</div>
          </div>

          <div className="p-3.5 rounded-2xl dark:bg-white/5 bg-stone-50 border dark:border-white/5 border-stone-200">
            <div className="text-[10px] uppercase font-semibold dark:text-stone-400 text-stone-500 flex items-center justify-between">
              <span>Jugadores en Campo</span>
              <Play size={13} className="text-emerald-500" />
            </div>
            <div className="text-2xl font-bold text-emerald-600 dark:text-[#6ee7b7] mt-1 font-mono">{totalPlayersInPlay}</div>
            <div className="text-[10px] dark:text-stone-400 text-stone-500 mt-0.5">Distribuidos en hoyos 1-18</div>
          </div>

          <div className="p-3.5 rounded-2xl dark:bg-white/5 bg-stone-50 border dark:border-white/5 border-stone-200">
            <div className="text-[10px] uppercase font-semibold dark:text-stone-400 text-stone-500 flex items-center justify-between">
              <span>Buggies en Salida</span>
              <Car size={13} className="text-[#8c6d2d] dark:text-[#d6b875]" />
            </div>
            <div className="text-2xl font-bold text-[#8c6d2d] dark:text-[#d6b875] mt-1 font-mono">
              {totalCartsInUse} <span className="text-xs dark:text-stone-400 text-stone-500 font-normal">/ 24</span>
            </div>
            <div className="text-[10px] dark:text-stone-400 text-stone-500 mt-0.5">Disponibilidad en caseta</div>
          </div>

          <div className="p-3.5 rounded-2xl dark:bg-white/5 bg-stone-50 border dark:border-white/5 border-stone-200">
            <div className="text-[10px] uppercase font-semibold dark:text-stone-400 text-stone-500 flex items-center justify-between">
              <span>Ocupación del Día</span>
              <TrendingUp size={13} className="text-emerald-500" />
            </div>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 font-mono flex items-center gap-1.5">
              <span>{activeDayInfo?.occupancyRate || 85}%</span>
            </div>
            <div className="text-[10px] dark:text-emerald-300 text-emerald-700 font-medium mt-0.5">
              {currentGroups.length} partidas programadas
            </div>
          </div>
        </div>
      </div>

      {/* 7-DAY WEEKLY AGENDA SELECTOR (Vigencia máxima 1 semana) */}
      <div className="mb-6 rounded-3xl border dark:border-white/10 border-stone-200/90 dark:bg-[#071d17]/80 bg-white backdrop-blur-md p-5 shadow-sm dark:shadow-xl transition-colors duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3.5">
          <div className="flex items-center gap-2">
            <Calendar size={15} className="text-[#8c6d2d] dark:text-[#d6b875]" />
            <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider dark:text-[#efe9d8] text-[#122a22]">
              Agenda Semanal (Ventana Operativa de 7 Días)
            </h2>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] dark:text-stone-400 text-stone-500 dark:bg-black/40 bg-stone-100 px-3 py-1 rounded-full border dark:border-white/10 border-stone-200">
            <Info size={12} className="text-[#8c6d2d] dark:text-[#d6b875]" />
            <span>Vigencia máxima: Hoy hasta +7 días</span>
          </div>
        </div>

        {/* Carousel / Tab List of 7 Days */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {daysWindow.map((day) => {
            const isSelected = day.date === selectedDateStr
            return (
              <button
                key={day.date}
                type="button"
                onClick={() => setSelectedDateStr(day.date)}
                className={`flex flex-col items-center justify-between p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#d6b875] dark:bg-gradient-to-b dark:from-[#d6b875]/25 dark:via-[#0c2820] dark:to-[#071b16] bg-amber-50/90 shadow-md ring-2 ring-[#d6b875]/80 scale-[1.02]'
                    : 'dark:border-white/10 border-stone-200 dark:bg-[#051410]/70 bg-stone-50 hover:bg-stone-100 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold dark:text-stone-400 text-stone-500 mb-1">
                  <span>{day.dayName.slice(0, 3)}</span>
                  {day.isToday && (
                    <span className="px-1.5 py-0.2 rounded bg-emerald-500/25 text-emerald-700 dark:text-emerald-300 text-[9px] font-bold border border-emerald-500/30">
                      HOY
                    </span>
                  )}
                </div>

                <div className="font-mono text-xl font-bold dark:text-[#efe9d8] text-[#122a22] my-0.5">
                  {day.dayNumber}
                </div>

                <div className="text-[10px] dark:text-stone-400 text-stone-500 mb-2">{day.monthName}</div>

                <div
                  className={`w-full py-0.5 px-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                    day.occupancyRate >= 90
                      ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                      : day.occupancyRate >= 70
                      ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                      : 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30'
                  }`}
                >
                  {day.occupancyRate}% Ocup.
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* REDESIGNED LUXURY CONTROL & FILTER BAR */}
      <div className="mb-6 rounded-3xl border dark:border-white/10 border-stone-200/90 dark:bg-gradient-to-b dark:from-[#09221b] dark:to-[#061914] bg-white p-4 sm:p-5 shadow-sm dark:shadow-2xl space-y-4 transition-colors duration-200">
        {/* Tier 1: Segmented Tee Selector & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Segmented Tee Selector */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-xs uppercase font-semibold tracking-wider dark:text-stone-400 text-stone-600 shrink-0 flex items-center gap-1.5">
              <Flag size={13} className="text-[#8c6d2d] dark:text-[#d6b875]" />
              Salida:
            </span>
            <div className="inline-flex items-center p-1 rounded-2xl dark:bg-[#04100d] bg-stone-100 border dark:border-white/10 border-stone-200 shadow-inner">
              {[
                { id: 'all', label: 'Todos los Hoyos' },
                { id: '1', label: 'Tee Hoyo 1' },
                { id: '10', label: 'Tee Hoyo 10' },
              ].map((tee) => {
                const isActive = selectedTee === tee.id
                return (
                  <button
                    key={tee.id}
                    onClick={() => setSelectedTee(tee.id as any)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-[#d6b875] to-[#c2a159] text-[#071b16] font-bold shadow-md shadow-[#d6b875]/20'
                        : 'dark:text-stone-300 text-stone-700 hover:text-[#122a22] dark:hover:text-white hover:bg-white/40'
                    }`}
                  >
                    {tee.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 md:max-w-xs">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar jugador o tee..."
              className="w-full pl-9 pr-8 py-2 rounded-xl dark:bg-[#04100d] bg-stone-50 border dark:border-white/10 border-stone-300 text-xs dark:text-[#efe9d8] text-[#122a22] placeholder-stone-400 focus:outline-none focus:border-[#8c6d2d] dark:focus:border-[#d6b875] focus:ring-1 focus:ring-[#d6b875]/50 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-800 dark:hover:text-white p-1 rounded-full cursor-pointer"
                title="Limpiar búsqueda"
              >
                <X size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Tier 2: Interactive Status Pills with Live Counts */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3.5 border-t dark:border-white/5 border-stone-200">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs uppercase font-semibold tracking-wider dark:text-stone-400 text-stone-600 mr-1 flex items-center gap-1">
              <Filter size={11} className="text-[#8c6d2d] dark:text-[#d6b875]" />
              Estado:
            </span>

            {[
              { id: 'all', label: 'Todos', count: statusCounts.all, dot: 'bg-stone-400' },
              { id: 'espera', label: 'En Espera', count: statusCounts.espera, dot: 'bg-blue-400' },
              { id: 'llamado', label: 'Llamados al Tee', count: statusCounts.llamado, dot: 'bg-amber-400 animate-pulse' },
              { id: 'en_juego', label: 'En Campo', count: statusCounts.en_juego, dot: 'bg-emerald-400' },
              { id: 'finalizado', label: 'Finalizados', count: statusCounts.finalizado, dot: 'bg-stone-500' },
            ].map((st) => {
              const isActive = statusFilter === st.id
              return (
                <button
                  key={st.id}
                  onClick={() => setStatusFilter(st.id as any)}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'dark:bg-gradient-to-r dark:from-[#10b981]/30 dark:to-[#0c3c2e] bg-emerald-50 text-emerald-800 dark:text-[#6ee7b7] border dark:border-[#10b981]/60 border-emerald-300 shadow-sm font-bold'
                      : 'dark:bg-[#04100d] bg-stone-50 dark:text-stone-400 text-stone-600 hover:text-stone-900 dark:hover:text-stone-200 border dark:border-white/5 border-stone-200'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                  <span>{st.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                      isActive ? 'bg-[#10b981]/40 text-emerald-950 dark:text-white' : 'dark:bg-white/5 bg-stone-200/80 dark:text-stone-400 text-stone-600'
                    }`}
                  >
                    {st.count}
                  </span>
                </button>
              )
            })}
          </div>

          {(selectedTee !== 'all' || statusFilter !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedTee('all')
                setStatusFilter('all')
                setSearchQuery('')
              }}
              className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold underline cursor-pointer"
            >
              Restablecer filtros
            </button>
          )}
        </div>
      </div>

      {/* Date Header for Tee Sheet */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2.5">
          <Calendar size={15} className="text-[#8c6d2d] dark:text-[#d6b875]" />
          <span className="font-serif text-base sm:text-lg dark:text-[#efe9d8] text-[#122a22] font-bold">
            Salidas para el {activeDayInfo?.dayName} {activeDayInfo?.dayNumber} de {activeDayInfo?.monthName}
          </span>
          <span className="text-xs font-mono font-bold text-[#8c6d2d] dark:text-[#d6b875] dark:bg-[#d6b875]/10 bg-amber-50 border dark:border-[#d6b875]/25 border-amber-200 px-2.5 py-0.5 rounded-full">
            {filteredGroups.length} {filteredGroups.length === 1 ? 'partida' : 'partidas'}
          </span>
        </div>
      </div>

      {/* Tee Sheet Cards List */}
      <div className="space-y-4">
        {filteredGroups.length === 0 ? (
          <div className="text-center py-14 rounded-3xl border border-dashed dark:border-white/15 border-stone-300 dark:bg-[#051410]/50 bg-white p-8 text-stone-500 shadow-sm">
            <Clock size={32} className="mx-auto text-stone-400 mb-2" />
            <p className="font-semibold text-sm dark:text-stone-300 text-stone-700">
              No se encontraron partidas para este filtro
            </p>
            <p className="text-xs text-stone-500 mt-1">
              Prueba cambiando el Tee o restableciendo los filtros de búsqueda.
            </p>
          </div>
        ) : (
          filteredGroups.map((group) => {
            const allCheckedIn = group.players.every((p) => p.isCheckedIn)
            const checkedInCount = group.players.filter((p) => p.isCheckedIn).length

            return (
              <div
                key={group.id}
                className={`rounded-3xl border transition-all p-5 sm:p-6 shadow-xs ${
                  group.status === 'llamado'
                    ? 'border-[#d6b875] dark:bg-gradient-to-r dark:from-[#0c2820] dark:to-[#071d17] bg-amber-50/70 shadow-md ring-1 ring-[#d6b875]/50'
                    : group.status === 'en_juego'
                    ? 'dark:border-[#10b981]/40 border-emerald-300 dark:bg-gradient-to-r dark:from-[#08221b] dark:to-[#071b16] bg-emerald-50/60 shadow-sm'
                    : group.status === 'finalizado'
                    ? 'dark:border-white/5 border-stone-200 dark:bg-[#051410] bg-stone-100 opacity-60'
                    : 'dark:border-white/10 border-stone-200/90 dark:bg-[#071d17]/90 bg-white'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b dark:border-white/10 border-stone-200">
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="px-3.5 py-1.5 rounded-2xl dark:bg-black/60 bg-stone-100 border dark:border-[#d6b875]/30 border-stone-300 font-mono text-base font-bold dark:text-[#efe9d8] text-[#122a22] shadow-inner">
                      {group.time}
                    </div>

                    <span className="px-3 py-1 rounded-xl text-xs font-bold dark:bg-[#d6b875]/15 bg-amber-100 text-[#8c6d2d] dark:text-[#d6b875] border dark:border-[#d6b875]/30 border-amber-300">
                      Tee Hoyo {group.tee}
                    </span>

                    {/* Status Badge */}
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        group.status === 'llamado'
                          ? 'bg-amber-400/20 text-amber-800 dark:text-amber-300 border border-amber-400/40 animate-pulse'
                          : group.status === 'en_juego'
                          ? 'bg-emerald-100 dark:bg-[#10b981]/20 text-emerald-800 dark:text-[#6ee7b7] border border-emerald-300 dark:border-[#10b981]/30'
                          : group.status === 'finalizado'
                          ? 'bg-stone-200 dark:bg-stone-700/40 text-stone-600 dark:text-stone-400'
                          : 'bg-blue-100 dark:bg-blue-400/15 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-400/30'
                      }`}
                    >
                      {group.status === 'llamado' && <BellRing size={12} />}
                      {group.status === 'en_juego' && <Play size={12} />}
                      {group.status === 'finalizado' && <Check size={12} />}
                      {group.status === 'espera' && <Clock size={12} />}
                      <span>
                        {group.status === 'espera' && 'En Espera (Putting Green)'}
                        {group.status === 'llamado' && 'Llamado a Tee'}
                        {group.status === 'en_juego' && 'En Campo (En Juego)'}
                        {group.status === 'finalizado' && 'Ronda Finalizada'}
                      </span>
                    </span>

                    {group.delayMinutes > 0 && (
                      <span className="text-xs text-amber-700 dark:text-amber-400 font-semibold">
                        Retraso: +{group.delayMinutes}m
                      </span>
                    )}
                  </div>

                  {/* Starter Quick Actions for this Group */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {group.status === 'espera' && (
                      <button
                        onClick={() => updateGroupStatus(group.id, 'llamado')}
                        className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#d6b875] to-[#c2a159] hover:from-[#e4c98a] hover:to-[#cca960] text-[#071b16] font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-[#d6b875]/15"
                      >
                        <BellRing size={14} />
                        <span>Llamar al Tee</span>
                      </button>
                    )}

                    {group.status === 'llamado' && (
                      <button
                        onClick={() => updateGroupStatus(group.id, 'en_juego')}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-emerald-500/25"
                      >
                        <Play size={14} fill="currentColor" />
                        <span>Dar Salida (Tee Off)</span>
                      </button>
                    )}

                    {group.status === 'en_juego' && (
                      <button
                        onClick={() => updateGroupStatus(group.id, 'finalizado')}
                        className="px-3.5 py-2 rounded-xl dark:bg-stone-700 bg-stone-200 hover:bg-stone-300 dark:hover:bg-stone-600 dark:text-stone-200 text-stone-800 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Check size={14} />
                        <span>Finalizar Ronda</span>
                      </button>
                    )}

                    {group.status === 'finalizado' && (
                      <button
                        onClick={() => updateGroupStatus(group.id, 'espera')}
                        className="px-3.5 py-2 rounded-xl dark:bg-stone-800 bg-stone-200 hover:bg-stone-300 dark:hover:bg-stone-700 dark:text-stone-400 text-stone-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw size={12} />
                        <span>Reabrir</span>
                      </button>
                    )}

                    <button
                      onClick={() => adjustDelay(group.id, 5)}
                      title="Añadir 5 min por retraso de grupo"
                      className="px-2.5 py-2 rounded-xl dark:bg-white/5 bg-stone-100 hover:bg-amber-100 dark:hover:bg-amber-400/20 text-stone-700 dark:text-stone-300 hover:text-amber-800 dark:hover:text-amber-300 border dark:border-white/10 border-stone-300 text-xs transition-colors cursor-pointer font-bold"
                    >
                      +5m
                    </button>
                  </div>
                </div>

                {/* Players & Cart Assignment Details */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-4">
                  {/* Players check-in checklist */}
                  <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] uppercase tracking-wider dark:text-stone-400 text-stone-600 font-semibold flex items-center gap-1.5">
                        <Users size={13} className="text-[#8c6d2d] dark:text-[#d6b875]" />
                        Jugadores del Grupo ({checkedInCount}/{group.players.length} Check-in)
                      </span>
                      {allCheckedIn ? (
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle size={11} /> Grupo Completo
                        </span>
                      ) : (
                        <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold">
                          Pendiente de llegada
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {group.players.map((player) => (
                        <div
                          key={player.id}
                          onClick={() => togglePlayerCheckin(group.id, player.id)}
                          className={`flex items-center justify-between p-2.5 rounded-2xl border transition-all cursor-pointer select-none ${
                            player.isCheckedIn
                              ? 'dark:bg-emerald-950/25 bg-emerald-50 dark:border-emerald-500/40 border-emerald-300 dark:text-white text-emerald-950 shadow-sm'
                              : 'dark:bg-black/40 bg-stone-50 dark:border-white/10 border-stone-200 dark:text-stone-400 text-stone-600 hover:border-stone-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                                player.isCheckedIn
                                  ? 'bg-emerald-500 border-emerald-400 text-white'
                                  : 'border-stone-400 bg-transparent'
                              }`}
                            >
                              {player.isCheckedIn && <Check size={11} strokeWidth={3} />}
                            </div>
                            <div className="truncate">
                              <span className="text-xs font-semibold dark:text-[#efe9d8] text-[#122a22] block truncate">
                                {player.name}
                              </span>
                              {player.caddie && (
                                <span className="text-[10px] text-[#8c6d2d] dark:text-[#d6b875] block font-medium">
                                  Caddie: {player.caddie}
                                </span>
                              )}
                            </div>
                          </div>

                          <span className="text-[11px] font-mono px-2 py-0.5 rounded-lg dark:bg-white/5 bg-stone-200/80 dark:border-white/10 border-stone-300 dark:text-stone-300 text-stone-700 font-semibold shrink-0 ml-2">
                            Hcp {player.handicap}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Buggies & Notes */}
                  <div className="flex flex-col justify-between border-t lg:border-t-0 lg:border-l dark:border-white/10 border-stone-200 pt-3 lg:pt-0 lg:pl-5">
                    <div>
                      <div className="text-[11px] uppercase tracking-wider dark:text-stone-400 text-stone-600 font-semibold mb-2 flex items-center gap-1.5">
                        <Car size={13} className="text-[#8c6d2d] dark:text-[#d6b875]" /> Asignación de Buggies
                      </div>

                      <div className="flex items-center gap-3 dark:bg-black/40 bg-stone-100 p-2 rounded-2xl border dark:border-white/10 border-stone-200 w-fit">
                        <button
                          type="button"
                          onClick={() => adjustCarts(group.id, -1)}
                          className="w-8 h-8 rounded-xl dark:bg-white/10 bg-stone-200 hover:bg-stone-300 dark:hover:bg-white/20 dark:text-white text-stone-800 flex items-center justify-center cursor-pointer transition-colors font-bold"
                        >
                          -
                        </button>
                        <span className="font-mono text-sm font-bold dark:text-[#efe9d8] text-[#122a22] px-2">
                          {group.carts} {group.carts === 1 ? 'Buggy' : 'Buggies'}
                        </span>
                        <button
                          type="button"
                          onClick={() => adjustCarts(group.id, 1)}
                          className="w-8 h-8 rounded-xl dark:bg-white/10 bg-stone-200 hover:bg-stone-300 dark:hover:bg-white/20 dark:text-white text-stone-800 flex items-center justify-center cursor-pointer transition-colors font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {group.notes && (
                      <div className="mt-3 text-[11px] dark:text-stone-400 text-stone-600 dark:bg-black/30 bg-stone-50 p-2.5 rounded-xl border dark:border-white/5 border-stone-200">
                        <strong className="dark:text-stone-300 text-stone-700">Nota de campo:</strong> {group.notes}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Modal for Walk-in registration */}
      {showAddModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAddModal(false)
          }}
        >
          <div className="w-full max-w-md rounded-3xl border dark:border-[#10b981]/40 border-emerald-300 dark:bg-[#071b16] bg-white p-6 sm:p-7 shadow-2xl dark:shadow-black/80">
            <h3 className="font-serif text-xl font-bold dark:text-[#efe9d8] text-[#122a22] mb-1">
              Nueva Salida Rápida (Walk-in)
            </h3>
            <p className="text-xs dark:text-stone-400 text-stone-600 mb-5">
              Registra una partida en la agenda para el <strong className="dark:text-stone-200 text-stone-800">{activeDayInfo?.dayName} {activeDayInfo?.dayNumber}</strong>.
            </p>

            <form onSubmit={handleAddWalkIn} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold dark:text-stone-300 text-stone-700 mb-1">
                  Nombre del Golfista
                </label>
                <input
                  type="text"
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  placeholder="Ej: Marcelo Quiroga"
                  required
                  autoFocus
                  className="w-full px-3.5 py-2.5 rounded-xl dark:bg-[#051410] bg-stone-50 border dark:border-white/15 border-stone-300 text-sm dark:text-[#efe9d8] text-[#122a22] placeholder-stone-400 focus:outline-none focus:border-[#10b981]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold dark:text-stone-300 text-stone-700 mb-1">
                    Hándicap
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={newPlayerHcp}
                    onChange={(e) => setNewPlayerHcp(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl dark:bg-[#051410] bg-stone-50 border dark:border-white/15 border-stone-300 text-sm dark:text-[#efe9d8] text-[#122a22] focus:outline-none focus:border-[#10b981]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold dark:text-stone-300 text-stone-700 mb-1">
                    Hora
                  </label>
                  <input
                    type="time"
                    value={newGroupTime}
                    onChange={(e) => setNewGroupTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl dark:bg-[#051410] bg-stone-50 border dark:border-white/15 border-stone-300 text-sm dark:text-[#efe9d8] text-[#122a22] focus:outline-none focus:border-[#10b981]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold dark:text-stone-300 text-stone-700 mb-1">
                    Tee Salida
                  </label>
                  <select
                    value={newGroupTee}
                    onChange={(e) => setNewGroupTee(e.target.value as '1' | '10')}
                    className="w-full px-3 py-2 rounded-xl dark:bg-[#051410] bg-stone-50 border dark:border-white/15 border-stone-300 text-sm dark:text-[#efe9d8] text-[#122a22] focus:outline-none focus:border-[#10b981]"
                  >
                    <option value="1">Hoyo 1</option>
                    <option value="10">Hoyo 10</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl border dark:border-white/15 border-stone-300 dark:text-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-100 dark:hover:bg-white/5 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#34d399] hover:to-[#10b981] text-white text-xs font-bold transition-all cursor-pointer shadow-md"
                >
                  Registrar Salida
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
