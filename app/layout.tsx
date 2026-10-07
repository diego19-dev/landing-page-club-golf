import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Roboto } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/lib/auth-context'
import { ThemeProvider } from '@/lib/theme-context'

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700', '900'],
  variable: '--font-roboto',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Monteverde Golf Club · Campo Privado & Recorrido de Campeonato (1987)',
  description: '18 hoyos de campeonato diseñados por Javier Arana en plena dehesa madrileña. Reserva exclusiva de tee times, boutique Pro Shop y tradición.',
}

export const viewport: Viewport = {
  colorScheme: 'dark light',
  themeColor: '#071b16',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${roboto.variable} dark`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const storedTheme = localStorage.getItem('monteverde-theme');
                if (storedTheme === 'light') {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.classList.add('light');
                  document.documentElement.style.colorScheme = 'light';
                } else {
                  document.documentElement.classList.add('dark');
                  document.documentElement.classList.remove('light');
                  document.documentElement.style.colorScheme = 'dark';
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body
        className="font-sans antialiased bg-[#f8f6f0] text-[#122a22] dark:bg-[#071b16] dark:text-[#f5f2e9] selection:bg-[#d6b875] selection:text-[#071b16] transition-colors duration-200"
        suppressHydrationWarning
      >
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}


