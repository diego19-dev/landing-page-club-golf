'use client'

import React, { useState } from 'react'
import { RESERVATION_ANALYTICS } from '@/data/analyticsData'
import {
  TrendingUp,
  Calendar,
  Users,
  Car,
  Clock,
  DollarSign,
  UserCheck,
  AlertTriangle,
  Sparkles,
  ArrowUpRight,
  Sun,
  Moon
} from 'lucide-react'

export function AnalyticsReservas() {
  const data = RESERVATION_ANALYTICS
  const [selectedPeriod, setSelectedPeriod] = useState<'semana' | 'mes'>('semana')

  return (
    <div className="space-y-6">
      {/* Top Controls & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0c2820] p-4 rounded-xl border border-white/10">
        <div>
          <h3 className="font-serif text-lg font-bold text-[#efe9d8] flex items-center gap-2">
            <span>Analítica de Reservas & Ocupación del Campo</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#d6b875]/20 text-[#d6b875] border border-[#d6b875]/30">
              EN VIVO
            </span>
          </h3>
          <p className="text-xs text-stone-400">
            Comportamiento de la demanda, tasa de utilización del recorrido y métricas de facturación.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#051410] p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setSelectedPeriod('semana')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${selectedPeriod === 'semana'
                ? 'bg-[#d6b875] text-[#071b16]'
                : 'text-stone-400 hover:text-white'
              }`}
          >
            Últimos 7 Días
          </button>
          <button
            onClick={() => setSelectedPeriod('mes')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${selectedPeriod === 'mes'
                ? 'bg-[#d6b875] text-[#071b16]'
                : 'text-stone-400 hover:text-white'
              }`}
          >
            Mes Actual
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="p-4 rounded-2xl border border-white/10 bg-[#071d17] relative overflow-hidden">
          <div className="flex items-center justify-between text-stone-400 mb-1">
            <span className="text-[10px] uppercase font-semibold tracking-wider">Recaudación Reservas</span>
            <DollarSign size={16} className="text-[#d6b875]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#efe9d8]">
            €{data.totalRevenue.toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 mt-1">
            <TrendingUp size={13} />
            <span>+{data.growthPercentage}% vs semana anterior</span>
          </div>
          <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-stone-400">
            <span>Green Fees: €{data.revenueGreenFees.toLocaleString()}</span>
            <span>Buggies: €{data.revenueCarts.toLocaleString()}</span>
          </div>
        </div>

        {/* Average Occupancy */}
        <div className="p-4 rounded-2xl border border-white/10 bg-[#071d17] relative overflow-hidden">
          <div className="flex items-center justify-between text-stone-400 mb-1">
            <span className="text-[10px] uppercase font-semibold tracking-wider">Ocupación Media</span>
            <Clock size={16} className="text-[#d6b875]" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            {data.averageOccupancy}%
          </div>
          <div className="text-[11px] text-stone-400 mt-1">
            184 partidas ({data.totalPlayers} golfistas en campo)
          </div>
          <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-stone-400">
            <span>Sáb / Dom: 100%</span>
            <span>Lun a Vie: 82%</span>
          </div>
        </div>

        {/* Member vs Visitor Mix */}
        <div className="p-4 rounded-2xl border border-white/10 bg-[#071d17] relative overflow-hidden">
          <div className="flex items-center justify-between text-stone-400 mb-1">
            <span className="text-[10px] uppercase font-semibold tracking-wider">Mix de Jugadores</span>
            <Users size={16} className="text-[#d6b875]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#efe9d8]">
            {data.memberPercentage}% <span className="text-sm font-normal text-stone-400">Socios</span>
          </div>
          <div className="text-[11px] text-stone-400 mt-1">
            {data.visitorPercentage}% Green Fees Visitantes
          </div>
          {/* Ratio bar */}
          <div className="w-full h-1.5 rounded-full bg-white/10 mt-3 flex overflow-hidden">
            <div style={{ width: `${data.memberPercentage}%` }} className="bg-[#d6b875]" />
            <div style={{ width: `${data.visitorPercentage}%` }} className="bg-[#10b981]" />
          </div>
        </div>

        {/* Cancellation & No-Show */}
        <div className="p-4 rounded-2xl border border-white/10 bg-[#071d17] relative overflow-hidden">
          <div className="flex items-center justify-between text-stone-400 mb-1">
            <span className="text-[10px] uppercase font-semibold tracking-wider">Cancelaciones & No-Show</span>
            <AlertTriangle size={16} className="text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-300">
            {data.cancellationRate}%
          </div>
          <div className="text-[11px] text-stone-400 mt-1">
            No-Show controlado: {data.noShowRate}%
          </div>
          <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-emerald-400">
            <span>Política de cancelación: 24h</span>
            <span className="text-stone-400">Mínimo impacto</span>
          </div>
        </div>
      </div>

      {/* Two Column Section: Weekly Trend and Hourly Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Occupancy & Revenue Chart */}
        <div className="p-5 rounded-2xl border border-white/10 bg-[#071d17]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-semibold text-sm text-[#efe9d8]">
                Ocupación y Recaudación Diaria de la Semana
              </h4>
              <p className="text-[11px] text-stone-400">Porcentaje de slots ocupados por día</p>
            </div>
            <span className="text-xs font-mono text-[#d6b875]">Semana en Curso</span>
          </div>

          <div className="space-y-3 pt-2">
            {data.weeklyOccupancy.map((day) => (
              <div key={day.day} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[#efe9d8] w-20 flex items-center gap-1.5">
                    <span className="text-stone-400">{day.day}</span>
                    <span className="text-[10px] text-stone-500 font-mono">{day.date}</span>
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[11px] text-[#d6b875]">€{day.revenue}</span>
                    <span className="font-mono font-bold text-xs w-10 text-right text-emerald-400">
                      {day.occupancy}%
                    </span>
                  </div>
                </div>

                <div className="w-full h-2.5 rounded-full bg-white/5 overflow-hidden flex">
                  <div
                    style={{ width: `${day.occupancy}%` }}
                    className={`h-full rounded-full transition-all duration-500 ${day.occupancy >= 95
                        ? 'bg-gradient-to-r from-emerald-500 to-[#d6b875]'
                        : day.occupancy >= 80
                          ? 'bg-gradient-to-r from-emerald-600 to-emerald-400'
                          : 'bg-emerald-700'
                      }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hourly Distribution (Heatmap) */}
        <div className="p-5 rounded-2xl border border-white/10 bg-[#071d17]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-semibold text-sm text-[#efe9d8]">
                Curva de Demanda por Franja Horaria
              </h4>
              <p className="text-[11px] text-stone-400">Horas punta vs horas valle</p>
            </div>
            <div className="flex items-center gap-2 text-[10px]">
              <span className="flex items-center gap-1 text-[#d6b875]">
                <Sun size={12} /> Mañana
              </span>
              <span className="flex items-center gap-1 text-[#38bdf8]">
                <Moon size={12} /> Tarde
              </span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {data.hourlyDistribution.map((slot) => (
              <div key={slot.hour} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-stone-300 flex items-center gap-1.5">
                    {slot.period === 'mañana' ? (
                      <Sun size={11} className="text-[#d6b875]" />
                    ) : (
                      <Moon size={11} className="text-[#38bdf8]" />
                    )}
                    {slot.hour}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-stone-400">{slot.bookings} salidas</span>
                    <span
                      className={`font-mono font-bold text-xs w-10 text-right ${slot.percentage === 100
                          ? 'text-amber-400'
                          : slot.percentage >= 80
                            ? 'text-emerald-400'
                            : 'text-stone-400'
                        }`}
                    >
                      {slot.percentage}%
                    </span>
                  </div>
                </div>

                <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                  <div
                    style={{ width: `${slot.percentage}%` }}
                    className={`h-full rounded-full transition-all duration-500 ${slot.percentage === 100
                        ? 'bg-amber-400'
                        : slot.period === 'mañana'
                          ? 'bg-[#d6b875]'
                          : 'bg-[#38bdf8]'
                      }`}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Operational Insight Banner */}
          <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-start gap-2.5">
            <Sparkles size={14} className="text-amber-400 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              <strong>Oportunidad Operativa:</strong> La franja de 08:30 a 10:00 se encuentra al 100% de ocupación. Se sugiere habilitar salidas simultáneas por el Hoyo 10 para aumentar la capacidad matutina en un 25%.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
