import { NextResponse } from 'next/server'
import { fetchWeatherApi } from 'openmeteo'
import { LocationWeather, WeatherApiResponse, GolfPlayability } from '@/types/weather'

export const revalidate = 600 // Cache for 10 minutes (600s)

function getCardinalDirection(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSO', 'SO', 'OSO', 'O', 'ONO', 'NO', 'NNO']
  const index = Math.round((degrees % 360) / 22.5) % 16
  return directions[index]
}

function assessGolfPlayability(windSpeed10m: number, windGusts10m: number): { playability: GolfPlayability; conditionLabel: string } {
  if (windGusts10m > 40 || windSpeed10m > 32) {
    return {
      playability: 'Viento Severo',
      conditionLabel: 'Viento fuerte en altura. Requiere tiros bajos (punch shots) y control de spin.',
    }
  }
  if (windSpeed10m > 20 || windGusts10m > 28) {
    return {
      playability: 'Desafiante',
      conditionLabel: 'Brisa marcada. Considera sumar 1 a 2 palos en tiros contra viento.',
    }
  }
  if (windSpeed10m > 10) {
    return {
      playability: 'Moderado',
      conditionLabel: 'Condiciones de juego muy favorables con brisa suave de campo.',
    }
  }
  return {
    playability: 'Óptimo',
    conditionLabel: 'Condiciones idílicas de calma absoluta para banderas al ataque.',
  }
}

const LOCATION_METADATA = [
  {
    id: 'sede-ruitoque',
    name: 'Sede Principal · Ruitoque (Bucaramanga)',
    shortName: 'Ruitoque',
    zone: 'Valle de Menzuly / Bucaramanga',
  },
  {
    id: 'sede-santos',
    name: 'Sede Campestre · Mesa de los Santos',
    shortName: 'Mesa de los Santos',
    zone: 'Altiplano de Santander',
  },
]

export async function GET() {
  try {
    const params = {
      latitude: [7.125, 6.7534],
      longitude: [-73.1189, -73.1047],
      current: ['temperature_2m', 'wind_direction_10m', 'wind_gusts_10m', 'wind_speed_10m'],
      hourly: ['temperature_2m', 'wind_speed_10m', 'wind_speed_80m'],
      forecast_days: 1,
    }
    const url = 'https://api.open-meteo.com/v1/forecast'
    const responses = await fetchWeatherApi(url, params)

    const locations: LocationWeather[] = responses.map((response, idx) => {
      const meta = LOCATION_METADATA[idx] || {
        id: `sede-${idx + 1}`,
        name: `Campo ${idx + 1}`,
        shortName: `Sede ${idx + 1}`,
        zone: 'Santander',
      }

      const latitude = response.latitude()
      const longitude = response.longitude()
      const elevation = Math.round(response.elevation())
      const utcOffsetSeconds = response.utcOffsetSeconds()

      const current = response.current()!
      const hourly = response.hourly()!

      const tempVal = Number(current.variables(0)!.value().toFixed(1))
      const windDirVal = Math.round(current.variables(1)!.value())
      const windGustsVal = Number(current.variables(2)!.value().toFixed(1))
      const windSpeedVal = Number(current.variables(3)!.value().toFixed(1))

      const { playability, conditionLabel } = assessGolfPlayability(windSpeedVal, windGustsVal)

      // Calculate hourly arrays
      const hourlyTimesCount = (Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval()
      const hourlyTemps = hourly.variables(0)!.valuesArray() || []
      const hourlyWinds10m = hourly.variables(1)!.valuesArray() || []
      const hourlyWinds80m = hourly.variables(2)!.valuesArray() || []

      const currentSecs = Number(current.time())
      // Current hour estimate to extract 80m wind
      let currentWind80m = Number((windSpeedVal * 1.35).toFixed(1))

      const hourlyPoints = []
      for (let i = 0; i < hourlyTimesCount; i++) {
        const pointTimeSecs = Number(hourly.time()) + i * hourly.interval()
        const pointDate = new Date((pointTimeSecs + utcOffsetSeconds) * 1000)
        const hourLabel = pointDate.toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'UTC',
        })

        const tVal = Number((hourlyTemps[i] ?? tempVal).toFixed(1))
        const w10Val = Number((hourlyWinds10m[i] ?? windSpeedVal).toFixed(1))
        const w80Val = Number((hourlyWinds80m[i] ?? (w10Val * 1.35)).toFixed(1))

        if (Math.abs(pointTimeSecs - currentSecs) < hourly.interval()) {
          currentWind80m = w80Val
        }

        hourlyPoints.push({
          time: pointDate.toISOString(),
          hourLabel,
          temperature: tVal,
          windSpeed10m: w10Val,
          windSpeed80m: w80Val,
        })
      }

      return {
        id: meta.id,
        name: meta.name,
        shortName: meta.shortName,
        zone: meta.zone,
        latitude: Number(latitude.toFixed(1)),
        longitude: Number(longitude.toFixed(1)),
        elevation,
        current: {
          time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000).toISOString(),
          temperature: tempVal,
          windSpeed10m: windSpeedVal,
          windDirection10m: windDirVal,
          windDirectionCardinal: getCardinalDirection(windDirVal),
          windGusts10m: windGustsVal,
          windSpeed80m: Number(currentWind80m.toFixed(1)),
          playability,
          conditionLabel,
        },
        hourly: hourlyPoints,
      }
    })

    const payload: WeatherApiResponse = {
      success: true,
      locations,
      lastUpdated: new Date().toISOString(),
    }

    return NextResponse.json(payload, {
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200',
      },
    })
  } catch (error) {
    console.error('[Open-Meteo API Error]', error)

    // Robust Fallback in case of network unavailability
    const fallbackLocations: LocationWeather[] = LOCATION_METADATA.map((meta, idx) => {
      const baseTemp = idx === 0 ? 21.5 : 18.2
      const baseWind = idx === 0 ? 8.5 : 5.4
      const windDir = idx === 0 ? 45 : 120
      return {
        id: meta.id,
        name: meta.name,
        shortName: meta.shortName,
        zone: meta.zone,
        latitude: idx === 0 ? 7.1 : 6.8,
        longitude: idx === 0 ? -73.1 : -73.1,
        elevation: idx === 0 ? 980 : 1650,
        current: {
          time: new Date().toISOString(),
          temperature: Number(baseTemp.toFixed(1)),
          windSpeed10m: Number(baseWind.toFixed(1)),
          windDirection10m: windDir,
          windDirectionCardinal: getCardinalDirection(windDir),
          windGusts10m: Number((baseWind * 1.6).toFixed(1)),
          windSpeed80m: Number((baseWind * 1.35).toFixed(1)),
          playability: 'Óptimo',
          conditionLabel: 'Condiciones excelentes para recorrido.',
        },
        hourly: Array.from({ length: 24 }, (_, i) => ({
          time: new Date(Date.now() + i * 3600000).toISOString(),
          hourLabel: `${String(i).padStart(2, '0')}:00`,
          temperature: Number((baseTemp + Math.sin(i / 3) * 3).toFixed(1)),
          windSpeed10m: Number((baseWind + Math.sin(i / 2) * 2).toFixed(1)),
          windSpeed80m: Number(((baseWind + Math.sin(i / 2) * 2) * 1.35).toFixed(1)),
        })),
      }
    })

    return NextResponse.json(
      {
        success: false,
        locations: fallbackLocations,
        lastUpdated: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 200 } // Return 200 with fallback so UI keeps working smoothly
    )
  }
}
