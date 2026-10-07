'use client'

import React from 'react'
import {
  X,
  Wind,
  Compass,
  RefreshCw,
  Gauge,
  Thermometer,
  Layers,
  MapPin,
  Sparkles,
  Info,
  Navigation,
  Mountain,
  Crosshair
} from 'lucide-react'
import { LocationWeather } from '@/types/weather'

interface GolfWeatherModalProps {
  isOpen: boolean
  onClose: () => void
  locations: LocationWeather[]
  currentLocation: LocationWeather | null
  selectedLocationId: string
  onSelectLocation: (id: string) => void
  onRefresh: () => void
  isRefreshing: boolean
}

// Utility to round and format any number to at most 1 decimal place
const round1 = (val: number | string | undefined | null): string => {
  if (val === undefined || val === null || val === '') return '0'
  const n = typeof val === 'number' ? val : parseFloat(String(val))
  if (isNaN(n)) return '0'
  const rounded = Math.round(n * 10) / 10
  return rounded.toString()
}

export function GolfWeatherModal({
  isOpen,
  onClose,
  locations,
  currentLocation,
  selectedLocationId,
  onSelectLocation,
  onRefresh,
  isRefreshing,
}: GolfWeatherModalProps) {
  if (!isOpen || !currentLocation) return null

  const { current, elevation, latitude, longitude, hourly } = currentLocation

  // Next 12 hours of forecast for the card
  const nextHours = hourly?.slice(0, 12) || []

  // Playability styles and labels
  const getPlayabilityBadge = (status: string) => {
    switch (status) {
      case 'Óptimo':
        return {
          wrapper: 'bg-emerald-500/15 border-emerald-500/35 text-emerald-400',
          dot: 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]',
          label: 'Óptimo',
        }
      case 'Moderado':
        return {
          wrapper: 'bg-amber-500/15 border-amber-500/35 text-amber-300',
          dot: 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]',
          label: 'Moderado',
        }
      case 'Desafiante':
        return {
          wrapper: 'bg-orange-500/15 border-orange-500/35 text-orange-400',
          dot: 'bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.8)]',
          label: 'Desafiante',
        }
      case 'Viento Severo':
        return {
          wrapper: 'bg-rose-500/15 border-rose-500/35 text-rose-400',
          dot: 'bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.8)]',
          label: 'Viento Severo',
        }
      default:
        return {
          wrapper: 'bg-emerald-500/15 border-emerald-500/35 text-emerald-400',
          dot: 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]',
          label: 'Óptimo',
        }
    }
  }

  const playabilityStyle = getPlayabilityBadge(current.playability)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl dark:bg-[#061914] bg-white border border-[#d6b875]/30 shadow-[0_25px_60px_rgba(0,0,0,0.6),0_0_35px_rgba(214,184,117,0.1)] overflow-hidden text-[#122a22] dark:text-[#f5f2e9]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle decorative glowing background accents */}
        <div className="pointer-events-none absolute -top-24 -left-24 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-[#d6b875]/10 blur-3xl" />

        {/* Top Header */}
        <div className="relative z-10 flex items-center justify-between px-5 sm:px-6 py-4 border-b dark:border-white/10 border-stone-200 dark:bg-black/20 bg-stone-50/70 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl dark:bg-gradient-to-br dark:from-[#0f3429] dark:to-[#081e18] bg-[#d6b875]/20 border border-[#d6b875]/40 text-[#8c6d2d] dark:text-[#d6b875] shadow-xs">
              <Wind size={22} className="stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-serif text-lg sm:text-xl font-bold dark:text-white text-stone-900 leading-tight tracking-tight">
                  Condiciones & Viento de Golf
                </h3>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[#d6b875]/20 text-[#8c6d2d] dark:text-[#e4caa0] border border-[#d6b875]/30">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                  </span>
                  Open-Meteo Live
                </span>
              </div>
              <p className="text-xs dark:text-stone-400 text-stone-600 mt-0.5 font-light">
                Balística y estratificación de viento a 10m y 80m para precisión de tiro
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              title="Actualizar datos meteorológicos"
              className="p-2.5 rounded-xl border border-transparent dark:hover:border-white/10 hover:border-stone-200 dark:hover:bg-white/5 hover:bg-stone-100 text-stone-400 hover:text-stone-700 dark:hover:text-white transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw size={17} className={isRefreshing ? 'animate-spin text-[#d6b875]' : ''} />
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl border border-transparent dark:hover:border-white/10 hover:border-stone-200 dark:hover:bg-white/5 hover:bg-stone-100 text-stone-400 hover:text-stone-700 dark:hover:text-white transition-all cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Location Selector Tabs & Coordinates Bar */}
        <div className="relative z-10 px-5 sm:px-6 py-2.5 flex items-center justify-between gap-3 border-b dark:border-white/5 border-stone-200/80 bg-stone-100/60 dark:bg-black/30 shrink-0 overflow-x-auto">
          {/* Location pill switcher */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl dark:bg-black/50 bg-stone-200/80 border dark:border-white/5 border-stone-300/50">
            {locations.map((loc) => {
              const isSelected = loc.id === selectedLocationId
              return (
                <button
                  key={loc.id}
                  onClick={() => onSelectLocation(loc.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#d6b875] to-[#c7a760] text-[#071b16] font-bold shadow-sm shadow-[#d6b875]/30'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  <MapPin size={13} className={isSelected ? 'text-[#071b16]' : 'text-stone-400'} />
                  <span>{loc.shortName}</span>
                </button>
              )
            })}
          </div>

          {/* Clean Rounded Altitude & Coordinates */}
          <div className="flex items-center gap-2 text-[11px] font-mono text-stone-500 dark:text-stone-400 whitespace-nowrap">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg dark:bg-white/5 bg-stone-200/60">
              <Mountain size={11} className="text-[#8c6d2d] dark:text-[#d6b875]" />
              {round1(elevation)}m s.n.m.
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-lg dark:bg-white/5 bg-stone-200/60">
              <Crosshair size={11} className="text-[#8c6d2d] dark:text-[#d6b875]" />
              {round1(Math.abs(latitude))}°N · {round1(Math.abs(longitude))}°O
            </span>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="relative z-10 flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {/* Main Hero Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {/* 1. Compass / Wind Direction Gauge */}
            <div className="p-4 rounded-2xl dark:bg-gradient-to-b dark:from-[#0b2820] dark:to-[#071e18] bg-stone-50 border border-stone-200 dark:border-[#d6b875]/25 flex flex-col items-center justify-between text-center relative overflow-hidden shadow-xs">
              <div className="flex items-center justify-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-stone-500 dark:text-stone-400">
                <Compass size={13} className="text-[#8c6d2d] dark:text-[#d6b875]" />
                <span>Dirección del Viento</span>
              </div>

              {/* Graphical Compass dial with premium nautical/flight style */}
              <div className="relative w-28 h-28 my-2 rounded-full border-2 border-stone-300 dark:border-white/15 dark:bg-black/30 bg-white/70 flex items-center justify-center shadow-inner">
                {/* 12 Degree tick marks around the compass ring */}
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className={`absolute w-0.5 ${i % 3 === 0 ? 'h-2 bg-[#d6b875]' : 'h-1 bg-stone-400/40 dark:bg-white/20'}`}
                    style={{
                      transform: `rotate(${i * 30}deg) translateY(-50px)`,
                    }}
                  />
                ))}

                {/* Cardinal markers */}
                <span className="absolute top-1 text-[10px] font-bold text-red-500 dark:text-red-400">N</span>
                <span className="absolute bottom-1 text-[10px] font-bold text-stone-400">S</span>
                <span className="absolute right-1.5 text-[10px] font-bold text-stone-400">E</span>
                <span className="absolute left-1.5 text-[10px] font-bold text-stone-400">O</span>

                {/* Wind Compass Needle pointing to wind azimuth */}
                <div
                  className="relative w-2 h-20 flex flex-col items-center justify-between transition-transform duration-700 ease-out z-10"
                  style={{ transform: `rotate(${current.windDirection10m}deg)` }}
                >
                  {/* North pointer (crimson red) */}
                  <div className="w-0 h-0 border-x-5 border-x-transparent border-b-[24px] border-b-red-500 drop-shadow-[0_2px_4px_rgba(239,68,68,0.5)]" />
                  
                  {/* Pivot center brass ring */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#d6b875] border-2 border-[#071b16] shadow-sm flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#071b16]" />
                  </div>

                  {/* South pointer (muted silver) */}
                  <div className="w-0 h-0 border-x-5 border-x-transparent border-t-[18px] border-t-stone-400/80 dark:border-t-stone-400" />
                </div>
              </div>

              <div>
                <div className="font-serif text-3xl font-bold dark:text-white text-stone-900 leading-none">
                  {current.windDirectionCardinal}
                </div>
                <div className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium dark:bg-white/5 bg-stone-200/70 text-stone-600 dark:text-stone-300">
                  {Math.round(current.windDirection10m)}° Azimut
                </div>
              </div>
            </div>

            {/* 2. Ball Flight Aerodynamics (10m vs 80m layers) */}
            <div className="sm:col-span-2 p-4 rounded-2xl dark:bg-gradient-to-b dark:from-[#0b2820] dark:to-[#071e18] bg-stone-50 border border-stone-200 dark:border-[#d6b875]/25 flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded-lg bg-[#d6b875]/20 text-[#8c6d2d] dark:text-[#d6b875]">
                      <Layers size={14} />
                    </div>
                    <span className="text-[11px] uppercase font-bold tracking-wider text-stone-600 dark:text-stone-300">
                      Capas de Viento & Vuelo de Bola
                    </span>
                  </div>
                  
                  {/* Playability badge with glowing status dot */}
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border ${playabilityStyle.wrapper}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${playabilityStyle.dot}`} />
                    <span>{playabilityStyle.label}</span>
                  </div>
                </div>

                {/* Comparative Strata Cards */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Superficie 10m */}
                  <div className="p-3.5 rounded-xl dark:bg-gradient-to-br dark:from-[#08221a] dark:to-[#051711] bg-white border border-emerald-500/25 dark:border-emerald-500/20 shadow-xs relative overflow-hidden">
                    <div className="flex items-center justify-between text-[10px] font-semibold uppercase mb-1.5">
                      <span className="text-stone-500 dark:text-stone-400">Superficie (10m)</span>
                      <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold">
                        Putt & Hierros
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1.5 my-1">
                      <span className="font-serif text-3xl sm:text-4xl font-bold dark:text-white text-stone-900 tracking-tight">
                        {round1(current.windSpeed10m)}
                      </span>
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">km/h</span>
                    </div>
                    <p className="text-[10px] text-stone-500 dark:text-stone-400 leading-tight">
                      Impacto moderado en rodada de green
                    </p>
                  </div>

                  {/* Ápex 80m (Driver & Madera) */}
                  <div className="p-3.5 rounded-xl dark:bg-gradient-to-br dark:from-[#1b2315] dark:to-[#0c1a13] bg-white border border-[#d6b875]/35 dark:border-[#d6b875]/25 shadow-xs relative overflow-hidden">
                    <div className="flex items-center justify-between text-[10px] font-semibold uppercase mb-1.5">
                      <span className="text-stone-500 dark:text-stone-400">Ápex Vuelo (80m)</span>
                      <span className="px-1.5 py-0.5 rounded-md bg-[#d6b875]/20 text-[#8c6d2d] dark:text-[#ebd49a] font-bold">
                        Driver & Madera
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1.5 my-1">
                      <span className="font-serif text-3xl sm:text-4xl font-bold dark:text-[#f7eed8] text-stone-900 tracking-tight">
                        {round1(current.windSpeed80m)}
                      </span>
                      <span className="text-xs font-semibold text-[#8c6d2d] dark:text-[#d6b875]">km/h</span>
                    </div>
                    <p className="text-[10px] text-stone-500 dark:text-stone-400 leading-tight">
                      Desviación en trayectoria y carry
                    </p>
                  </div>
                </div>
              </div>

              {/* Ráfagas y Temperatura sub-bar */}
              <div className="mt-3.5 pt-3 border-t dark:border-white/10 border-stone-200/80 flex items-center justify-between flex-wrap gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-stone-600 dark:text-stone-300">
                  <div className="p-1 rounded-md bg-stone-200/60 dark:bg-white/5 text-[#8c6d2d] dark:text-[#d6b875]">
                    <Thermometer size={13} />
                  </div>
                  <span className="text-stone-500 dark:text-stone-400">Temp actual:</span>
                  <span className="font-bold font-mono dark:text-white text-stone-900">
                    {round1(current.temperature)}°C
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-stone-600 dark:text-stone-300">
                  <div className="p-1 rounded-md bg-stone-200/60 dark:bg-white/5 text-amber-500 dark:text-amber-400">
                    <Gauge size={13} />
                  </div>
                  <span className="text-stone-500 dark:text-stone-400">Ráfagas máx:</span>
                  <span className="font-bold font-mono text-amber-600 dark:text-amber-400">
                    {round1(current.windGusts10m)} km/h
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Advice card for golfers (Pro Strategy) */}
          <div className="p-4 rounded-2xl dark:bg-gradient-to-r dark:from-[#d6b875]/15 dark:via-[#d6b875]/08 dark:to-[#0b2820]/40 bg-amber-50/80 border border-[#d6b875]/35 flex items-start gap-3 shadow-xs">
            <div className="p-2 rounded-xl bg-[#d6b875]/25 text-[#8c6d2d] dark:text-[#d6b875] shrink-0 mt-0.5">
              <Sparkles size={16} />
            </div>
            <div className="text-xs">
              <span className="font-bold block dark:text-[#f7eed8] text-stone-900 mb-0.5 tracking-wide">
                Recomendación Técnica del Profesional
              </span>
              <p className="dark:text-stone-300 text-stone-700 leading-relaxed font-light">
                {current.conditionLabel}
              </p>
            </div>
          </div>

          {/* Hourly Forecast Timeline */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Pronóstico Horario (Próximas Horas)
              </span>
              <span className="text-[11px] font-mono text-stone-400">Intervalo 1h</span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {nextHours.map((hour, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl dark:bg-gradient-to-b dark:from-[#0b2820] dark:to-[#071e18] bg-stone-50 border border-stone-200 dark:border-white/5 text-center flex flex-col justify-between hover:border-[#d6b875]/40 transition-colors shadow-2xs"
                >
                  <span className="text-[11px] font-semibold font-mono text-stone-500 dark:text-stone-400 block mb-0.5">
                    {hour.hourLabel}
                  </span>
                  <div className="font-serif text-base font-bold dark:text-white text-stone-900 my-0.5">
                    {round1(hour.temperature)}°
                  </div>
                  <div className="text-[10px] space-y-0.5 pt-1 border-t dark:border-white/10 border-stone-200/80">
                    <div className="text-stone-500 dark:text-stone-400 flex items-center justify-between">
                      <span className="text-[9px]">10m</span>
                      <span className="font-mono font-semibold text-stone-800 dark:text-white">
                        {round1(hour.windSpeed10m)}
                      </span>
                    </div>
                    <div className="text-[#8c6d2d] dark:text-[#d6b875] flex items-center justify-between">
                      <span className="text-[9px]">80m</span>
                      <span className="font-mono font-semibold">
                        {round1(hour.windSpeed80m)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="relative z-10 px-5 sm:px-6 py-3.5 border-t dark:border-white/10 border-stone-200 dark:bg-black/40 bg-stone-100/80 flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 shrink-0">
          <div className="flex items-center gap-1.5">
            <Info size={13} className="text-[#8c6d2d] dark:text-[#d6b875] shrink-0" />
            <span className="text-[11px]">Actualización automática cada 15 min vía Open-Meteo API</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#d6b875] to-[#c7a760] hover:from-[#dfc488] hover:to-[#ceaf6b] text-[#071b16] font-bold uppercase text-[10px] tracking-wider transition-all shadow-md shadow-[#d6b875]/20 cursor-pointer active:scale-95"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  )
}
