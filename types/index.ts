export type SectionId = 'inicio' | 'reservas' | 'tienda' | 'reglas' | 'admin' | 'starter'

export type UserRole = 'admin' | 'starter' | 'socio'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  title: string
  handicap?: number
  avatar?: string
}

export interface StarterPlayer {
  id: string
  name: string
  handicap: number
  isCheckedIn: boolean
  caddie?: string
}

export interface StarterGroup {
  id: string
  time: string
  tee: '1' | '10'
  players: StarterPlayer[]
  carts: number
  status: 'espera' | 'llamado' | 'en_juego' | 'finalizado'
  notes?: string
  delayMinutes: number
}

export interface Product {
  id?: string
  name: string
  category: string
  price: string
  image: string
  tag?: string
  description?: string
  inStock?: boolean
}

export interface GolfRuleGroup {
  id: number
  name: string
  description: string
}

export interface GolfRule {
  id: number
  groupId: number
  number: string
  title: string
  summary: string
  procedure: string
  penalties: string
  keywords: string[]
}

