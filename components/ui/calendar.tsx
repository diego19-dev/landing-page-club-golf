'use client'

import * as React from 'react'
import { DayPicker, type DayPickerProps } from 'react-day-picker'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { es } from 'date-fns/locale'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

export type CalendarProps = DayPickerProps

export function Calendar({
  className,
  classNames,
  showOutsideDays = false,
  locale = es,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      locale={locale}
      showOutsideDays={showOutsideDays}
      className={cn('p-1 select-none', className)}
      components={{
        Chevron: ({ orientation, className: chevronClassName, ...chevronProps }) => {
          if (orientation === 'left') {
            return (
              <ChevronLeft
                className={cn('h-4 w-4 stroke-[2.2]', chevronClassName)}
                {...chevronProps}
              />
            )
          }
          return (
            <ChevronRight
              className={cn('h-4 w-4 stroke-[2.2]', chevronClassName)}
              {...chevronProps}
            />
          )
        },
      }}
      formatters={{
        formatCaption: (date) => {
          const formatted = format(date, 'MMMM yyyy', { locale: (locale as any) || es })
          return formatted.charAt(0).toUpperCase() + formatted.slice(1)
        },
        formatWeekdayName: (date) => {
          const day = format(date, 'EEEEEE', { locale: (locale as any) || es })
          return day.toUpperCase()
        },
      }}
      {...props}
    />
  )
}

Calendar.displayName = 'Calendar'
