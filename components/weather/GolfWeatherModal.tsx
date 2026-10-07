'use client'

import React from 'react'
import {
  X,
  Wind,
  Compass,
  ArrowUp,
  RefreshCw,
  Gauge,
  Thermometer,
  Layers,
  MapPin,
  Sparkles,
  Info
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

  // Playability colors
  const getPlayabilityStyle = (status: string) => {
    switch (status) {
      case 'Óptimo':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
      case 'Moderado':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30'
      case 'Desafiante':
        return 'bg-orange-500/15 text-orange-400 border-orange-500/30'
      case 'Viento Severo':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30'
      default:
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl dark:bg-[#071b16] bg-white border dark:border-[#d6b875]/30 border-stone-300 shadow-2xl dark:shadow-black/80 overflow-hidden text-[#122a22] dark:text-[#f5f2e9]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b dark:border-white/10 border-stone-200 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl dark:bg-[#0c2820] bg-stone-100 text-[#8c6d2d] dark:text-[#d6b875]">
              <Wind size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg sm:text-xl font-bold dark:text-white text-stone-900 leading-tight">
                  Condiciones & Viento de Golf
                </h3>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[#d6b875]/20 text-[#8c6d2d] dark:text-[#d6b875]">
                  Open-Meteo Live
                </span>
              </div>
              <p className="text-xs dark:text-stone-400 text-stone-500">
                Balística de viento a 10m y 80m para precisión de tiro
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              title="Actualizar datos meteorológicos"
              className="p-2 rounded-xl dark:hover:bg-white/10 hover:bg-stone-100 text-stone-400 hover:text-stone-700 dark:hover:text-white transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw size={17} className={isRefreshing ? 'animate-spin text-[#d6b875]' : ''} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl dark:hover:bg-white/10 hover:bg-stone-100 text-stone-400 hover:text-stone-700 dark:hover:text-white transition-all cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Location Selector Tabs */}
        <div className="px-5 sm:px-6 pt-3 pb-2 flex items-center justify-between gap-2 border-b dark:border-white/5 border-stone-100 bg-stone-50/60 dark:bg-black/20 shrink-0 overflow-x-auto">
          <div className="flex items-center gap-1.5 p-1 rounded-2xl dark:bg-black/40 bg-stone-200/70">
            {locations.map((loc) => {
              const isSelected = loc.id === selectedLocationId
              return (
                <button
                  key={loc.id}
                  onClick={() => onSelectLocation(loc.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#d6b875] text-[#071b16] shadow-sm font-bold'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  <MapPin size={13} />
                  <span>{loc.shortName}</span>
                </button>
              )
            })}
          </div>

          <div className="text-[11px] font-mono text-stone-500 dark:text-stone-400 whitespace-nowrap">
            {elevation}m s.n.m. · {latitude}°N {longitude}°O
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Main Hero Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {/* 1. Compass / Wind Direction */}
            <div className="p-4 rounded-2xl dark:bg-[#0c2820] bg-stone-50 border dark:border-[#d6b875]/20 border-stone-200 flex flex-col items-center justify-center text-center relative overflow-hidden">
              <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 dark:text-stone-400 mb-2">
                Dirección del Viento
              </span>

              {/* Graphical Compass dial */}
              <div className="relative w-24 h-24 rounded-full border-2 border-dashed dark:border-white/20 border-stone-300 flex items-center justify-center my-1">
                <span className="absolute top-1 text-[9px] font-bold text-stone-400">N</span>
                <span className="absolute bottom-1 text-[9px] font-bold text-stone-400">S</span>
                <span className="absolute right-1.5 text-[9px] font-bold text-stone-400">E</span>
                <span className="absolute left-1.5 text-[9px] font-bold text-stone-400">O</span>

                {/* Compass Needle pointing to wind direction */}
                <div
                  className="w-1.5 h-16 rounded-full flex flex-col items-center justify-between transition-transform duration-700 ease-out"
                  style={{ transform: `rotate(${current.windDirection10m}deg)` }}
                >
                  <div className="w-0 h-0 border-x-4 border-x-transparent border-b-[18px] border-b-red-500" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#d6b875] shadow-xs" />
                  <div className="w-0 h-0 border-x-4 border-x-transparent border-t-[14px] border-t-stone-400" />
                </div>
              </div>

              <div className="mt-2">
                <div className="font-serif text-2xl font-bold dark:text-white text-stone-900 leading-none">
                  {current.windDirectionCardinal}
                </div>
                <span className="text-[11px] text-stone-500 dark:text-stone-400">
                  {current.windDirection10m}° Azimut
                </span>
              </div>
            </div>

            {/* 2. Ball Flight Aerodynamics (10m vs 80m) */}
            <div className="sm:col-span-2 p-4 rounded-2xl dark:bg-[#0c2820] bg-stone-50 border dark:border-[#d6b875]/20 border-stone-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <Layers size={15} className="text-[#8c6d2d] dark:text-[#d6b875]" />
                    <span className="text-[11px] uppercase font-bold tracking-wider text-stone-500 dark:text-stone-400">
                      Capas de Viento & Vuelo de Bola
                    </span>
                  </div>
                  <div className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getPlayabilityStyle(current.playability)}`}>
                    {current.playability}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Superficie 10m */}
                  <div className="p-3 rounded-xl dark:bg-black/30 bg-white border dark:border-white/5 border-stone-200/80">
                    <div className="flex items-center justify-between text-stone-400 text-[10px] font-semibold uppercase mb-1">
                      <span>Superficie (10m)</span>
                      <span className="text-emerald-500 dark:text-emerald-400">Putt & Hierros</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="font-serif text-2xl sm:text-3xl font-bold dark:text-white text-stone-900">
                        {current.windSpeed10m}
                      </span>
                      <span className="text-xs text-stone-500">km/h</span>
                    </div>
                    <p className="text-[10px] text-stone-400 mt-1">Impacto moderado en rodada de green</p>
                  </div>

                  {/* Altura 80m */}
                  <div className="p-3 rounded-xl dark:bg-black/30 bg-white border dark:border-white/5 border-stone-200/80">
                    <div className="flex items-center justify-between text-stone-400 text-[10px] font-semibold uppercase mb-1">
                      <span>Ápex Vuelo (80m)</span>
                      <span className="text-[#d6b875]">Driver & Madera</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="font-serif text-2xl sm:text-3xl font-bold dark:text-white text-stone-900">
                        {current.windSpeed80m}
                      </span>
                      <span className="text-xs text-stone-500">km/h</span>
                    </div>
                    <p className="text-[10px] text-stone-400 mt-1">Desviación en trayectoria máxima</p>
                  </div>
                </div>
              </div>

              {/* Ráfagas y Temperatura */}
              <div className="mt-3 pt-3 border-t dark:border-white/10 border-stone-200 flex items-center justify-between flex-wrap gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-stone-600 dark:text-stone-300">
                  <Thermometer size={14} className="text-[#8c6d2d] dark:text-[#d6b875]" />
                  <span>Temp actual:</span>
                  <span className="font-bold dark:text-white text-stone-900">{current.temperature}°C</span>
                </div>
                <div className="flex items-center gap-1.5 text-stone-600 dark:text-stone-300">
                  <Gauge size={14} className="text-[#8c6d2d] dark:text-[#d6b875]" />
                  <span>Ráfagas máx:</span>
                  <span className="font-bold text-amber-500 dark:text-amber-400">{current.windGusts10m} km/h</span>
                </div>
              </div>
            </div>
          </div>

          {/* Advice card for golfers */}
          <div className="p-4 rounded-2xl dark:bg-[#d6b875]/10 bg-[#d6b875]/15 border border-[#d6b875]/30 flex items-start gap-3">
            <Sparkles size={18} className="text-[#8c6d2d] dark:text-[#d6b875] shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold block dark:text-[#f5f2e9] text-stone-900 mb-0.5">
                Recomendación Técnica del Profesional
              </span>
              <p className="dark:text-stone-300 text-stone-700 leading-relaxed">
                {current.conditionLabel}
              </p>
            </div>
          </div>

          {/* Hourly Timeline */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Pronóstico Horario (Próximas Horas)
              </span>
              <span className="text-[11px] text-stone-400">Intervalo 1h</span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {nextHours.map((hour, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl dark:bg-[#0c2820] bg-stone-50 border dark:border-white/5 border-stone-200 text-center flex flex-col justify-between"
                >
                  <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 block mb-1">
                    {hour.hourLabel}
                  </span>
                  <div className="font-serif text-base font-bold dark:text-white text-stone-900 my-0.5">
                    {hour.temperature}°
                  </div>
                  <div className="text-[10px] space-y-0.5 pt-1 border-t dark:border-white/10 border-stone-200/80">
                    <div className="text-stone-500 dark:text-stone-300">
                      10m: <span className="font-semibold text-stone-800 dark:text-white">{hour.windSpeed10m}</span>
                    </div>
                    <div className="text-[#8c6d2d] dark:text-[#d6b875]">
                      80m: <span className="font-semibold">{hour.windSpeed80m}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 sm:px-6 py-3 border-t dark:border-white/10 border-stone-200 bg-stone-50/70 dark:bg-black/20 flex items-center justify-between text-[11px] text-stone-400 shrink-0">
          <div className="flex items-center gap-1.5">
            <Info size={13} />
            <span>Actualización automática cada 15 min vía Open-Meteo API</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#d6b875] text-[#071b16] font-bold uppercase text-[10px] tracking-wider hover:opacity-90 cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  )
}
