export interface ReservationAnalytics {
  totalRevenue: number
  previousRevenue: number
  growthPercentage: number
  totalBookings: number
  totalPlayers: number
  averageOccupancy: number
  revenueGreenFees: number
  revenueCarts: number
  revenueCaddies: number
  memberPercentage: number
  visitorPercentage: number
  cancellationRate: number
  noShowRate: number
  hourlyDistribution: {
    hour: string
    bookings: number
    percentage: number
    period: 'mañana' | 'tarde'
  }[]
  weeklyOccupancy: {
    day: string
    date: string
    occupancy: number
    revenue: number
  }[]
}

export interface ProShopProductStat {
  id: string
  name: string
  category: 'Palos' | 'Ropa' | 'Accesorios' | 'Bolas'
  price: number
  unitsSold: number
  totalRevenue: number
  currentStock: number
  stockStatus: 'optimo' | 'bajo' | 'critico'
  image: string
}

export interface ProShopAnalytics {
  totalRevenue: number
  previousRevenue: number
  growthPercentage: number
  totalUnitsSold: number
  averageTicket: number
  estimatedMargin: number
  topProducts: ProShopProductStat[]
  salesByCategory: {
    category: string
    revenue: number
    percentage: number
    units: number
    color: string
  }[]
  recentTransactions: {
    id: string
    date: string
    customerName: string
    isMember: boolean
    items: string
    total: number
  }[]
}

export interface DaySchedule {
  date: string // YYYY-MM-DD
  dayName: string // e.g. "Jueves"
  dayNumber: number // e.g. 24
  monthName: string // e.g. "Sept"
  isToday: boolean
  totalSlots: number
  occupiedSlots: number
  occupancyRate: number
}
