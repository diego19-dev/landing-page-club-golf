import { StarterGroup } from '@/types'
import { DaySchedule } from '@/types/analytics'

// Helper to format Date to YYYY-MM-DD
export function toDateString(d: Date): string {
  return d.toISOString().split('T')[0]
}

// Generate the 7 days window (Today up to Today + 7 days)
export function getSevenDaysWindow(): DaySchedule[] {
  const days: DaySchedule[] = []
  const today = new Date()
  const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
  const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

  for (let i = 0; i <= 7; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)

    const isToday = i === 0
    const dayOfWeek = d.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

    // Weekend has higher occupancy
    const totalSlots = 24
    const occupiedSlots = isWeekend ? Math.min(24, 18 + (i % 5)) : Math.min(24, 12 + (i % 6))
    const occupancyRate = Math.round((occupiedSlots / totalSlots) * 100)

    days.push({
      date: toDateString(d),
      dayName: dayNames[dayOfWeek],
      dayNumber: d.getDate(),
      monthName: monthNames[d.getMonth()],
      isToday,
      totalSlots,
      occupiedSlots,
      occupancyRate,
    })
  }

  return days
}

// Base mock groups for date template
export function getInitialGroupsForDate(dateStr: string): StarterGroup[] {
  const seed = dateStr.split('-').reduce((acc, part) => acc + parseInt(part, 10), 0)

  return [
    {
      id: `${dateStr}-grp-1`,
      time: '07:30',
      tee: '1',
      players: [
        { id: `${dateStr}-p1`, name: 'Carlos Villamil', handicap: 5.2, isCheckedIn: true, caddie: 'Pedro R.' },
        { id: `${dateStr}-p2`, name: 'Alfonso Gómez', handicap: 11.4, isCheckedIn: true, caddie: 'Manuel S.' },
        { id: `${dateStr}-p3`, name: 'Eduardo Morales', handicap: 8.0, isCheckedIn: true },
        { id: `${dateStr}-p4`, name: 'Santiago Bernal', handicap: 14.2, isCheckedIn: true },
      ],
      carts: 2,
      status: 'en_juego',
      notes: 'Paso por Hoyo 9 estimado 09:40',
      delayMinutes: 0,
    },
    {
      id: `${dateStr}-grp-2`,
      time: '07:45',
      tee: '1',
      players: [
        { id: `${dateStr}-p5`, name: 'Fernando Ruiz', handicap: 7.6, isCheckedIn: true, caddie: 'Jorge L.' },
        { id: `${dateStr}-p6`, name: 'Gabriel Torres', handicap: 12.1, isCheckedIn: true },
        { id: `${dateStr}-p7`, name: 'Nicolás De La Torre', handicap: 16.5, isCheckedIn: true },
      ],
      carts: 2,
      status: 'en_juego',
      notes: 'Ritmo normal de juego',
      delayMinutes: 0,
    },
    {
      id: `${dateStr}-grp-3`,
      time: '08:00',
      tee: '1',
      players: [
        { id: `${dateStr}-p8`, name: 'Ricardo Echeverri', handicap: 4.8, isCheckedIn: true, caddie: 'Álvaro T.' },
        { id: `${dateStr}-p9`, name: 'Ignacio Silva', handicap: 9.3, isCheckedIn: true, caddie: 'Andrés G.' },
        { id: `${dateStr}-p10`, name: 'Marcos Benítez', handicap: 13.0, isCheckedIn: false },
        { id: `${dateStr}-p11`, name: 'David Quintana', handicap: 15.8, isCheckedIn: false },
      ],
      carts: 2,
      status: 'llamado',
      notes: '1 jugador en putting green',
      delayMinutes: 0,
    },
    {
      id: `${dateStr}-grp-4`,
      time: '08:15',
      tee: '1',
      players: [
        { id: `${dateStr}-p12`, name: 'Rodrigo Santoro', handicap: 6.2, isCheckedIn: false },
        { id: `${dateStr}-p13`, name: 'Mauricio Obregón', handicap: 10.4, isCheckedIn: false },
        { id: `${dateStr}-p14`, name: 'Camilo Restrepo', handicap: 18.0, isCheckedIn: false },
      ],
      carts: 1,
      status: 'espera',
      notes: 'Solicitaron caddie adicional',
      delayMinutes: 0,
    },
    {
      id: `${dateStr}-grp-5`,
      time: '08:30',
      tee: '1',
      players: [
        { id: `${dateStr}-p15`, name: 'Alejandro Vargas', handicap: 3.1, isCheckedIn: false },
        { id: `${dateStr}-p16`, name: 'Tomás Uribe', handicap: 7.9, isCheckedIn: false },
        { id: `${dateStr}-p17`, name: 'Guillermo Londoño', handicap: 12.5, isCheckedIn: false },
        { id: `${dateStr}-p18`, name: 'Pablo Restrepo', handicap: 14.0, isCheckedIn: false },
      ],
      carts: 2,
      status: 'espera',
      delayMinutes: 0,
    },
    {
      id: `${dateStr}-grp-6`,
      time: '08:45',
      tee: '10',
      players: [
        { id: `${dateStr}-p19`, name: 'Federico Díaz', handicap: 10.8, isCheckedIn: true },
        { id: `${dateStr}-p20`, name: 'Enrique Palacios', handicap: 14.2, isCheckedIn: true },
      ],
      carts: 1,
      status: 'espera',
      delayMinutes: 0,
    },
    {
      id: `${dateStr}-grp-7`,
      time: '09:00',
      tee: '1',
      players: [
        { id: `${dateStr}-p21`, name: 'Beatriz Salazar', handicap: 15.0, isCheckedIn: false },
        { id: `${dateStr}-p22`, name: 'Catalina Vega', handicap: 18.2, isCheckedIn: false },
        { id: `${dateStr}-p23`, name: 'Camila Ospina', handicap: 22.0, isCheckedIn: false },
      ],
      carts: 2,
      status: 'espera',
      delayMinutes: 0,
    },
    {
      id: `${dateStr}-grp-8`,
      time: '09:15',
      tee: '10',
      players: [
        { id: `${dateStr}-p24`, name: 'Gustavo Arbeláez', handicap: 6.8, isCheckedIn: false },
        { id: `${dateStr}-p25`, name: 'Felipe Jaramillo', handicap: 8.5, isCheckedIn: false },
      ],
      carts: 1,
      status: 'espera',
      delayMinutes: 0,
    },
  ]
}
