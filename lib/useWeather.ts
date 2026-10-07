'use client'

import { useState, useEffect, useCallback } from 'react'
import { LocationWeather, WeatherApiResponse } from '@/types/weather'

interface UseWeatherReturn {
  locations: LocationWeather[]
  currentLocation: LocationWeather | null
  selectedLocationId: string
  setSelectedLocationId: (id: string) => void
  isLoading: boolean
  isRefreshing: boolean
  error: string | null
  lastUpdated: string | null
  refresh: () => Promise<void>
}

export function useWeather(): UseWeatherReturn {
  const [locations, setLocations] = useState<LocationWeather[]>([])
  const [selectedLocationId, setSelectedLocationId] = useState<string>('sede-ruitoque')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  const fetchWeather = useCallback(async (isBackground = false) => {
    try {
      if (isBackground) {
        setIsRefreshing(true)
      } else {
        setIsLoading(true)
      }
      setError(null)

      const res = await fetch('/api/weather', {
        next: { revalidate: 600 },
      })
      if (!res.ok) {
        throw new Error(`Error en servidor meteorológico (${res.status})`)
      }

      const data: WeatherApiResponse = await res.json()
      if (data.locations && data.locations.length > 0) {
        setLocations(data.locations)
        setLastUpdated(data.lastUpdated)
      } else {
        throw new Error('Respuesta meteorológica vacía')
      }
    } catch (err: any) {
      console.error('[useWeather]', err)
      setError(err.message || 'No se pudo cargar el clima')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchWeather()

    // Auto-refresh every 15 minutes
    const interval = setInterval(() => {
      fetchWeather(true)
    }, 15 * 60 * 1000)

    return () => clearInterval(interval)
  }, [fetchWeather])

  const currentLocation =
    locations.find((loc) => loc.id === selectedLocationId) || locations[0] || null

  return {
    locations,
    currentLocation,
    selectedLocationId,
    setSelectedLocationId,
    isLoading,
    isRefreshing,
    error,
    lastUpdated,
    refresh: () => fetchWeather(true),
  }
}
