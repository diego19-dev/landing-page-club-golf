export interface HourlyWeatherPoint {
  time: string
  hourLabel: string
  temperature: number
  windSpeed10m: number
  windSpeed80m: number
}

export type GolfPlayability = 'Óptimo' | 'Moderado' | 'Desafiante' | 'Viento Severo'

export interface CurrentWeather {
  time: string
  temperature: number
  windSpeed10m: number
  windDirection10m: number
  windDirectionCardinal: string
  windGusts10m: number
  windSpeed80m: number
  playability: GolfPlayability
  conditionLabel: string
}

export interface LocationWeather {
  id: string
  name: string
  shortName: string
  zone: string
  latitude: number
  longitude: number
  elevation: number
  current: CurrentWeather
  hourly: HourlyWeatherPoint[]
}

export interface WeatherApiResponse {
  success: boolean
  locations: LocationWeather[]
  lastUpdated: string
  error?: string
}
