import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Lopardo Servicios | Climatización, Aire Acondicionado y Calefacción en Neuquén',
  description:
    'Especialistas en instalación, reparación y mantenimiento preventivo de aires acondicionados, sistemas de calefacción central, VRF y rooftops para empresas en Neuquén y Alto Valle.',
  keywords: [
    'climatización neuquén',
    'aire acondicionado neuquén',
    'mantenimiento de aire acondicionado neuquén',
    'instalación aire acondicionado empresas',
    'calefacción central neuquén',
    'servicio técnico hvac neuquén',
    'mantenimiento preventivo climatización',
    'rooftop aire acondicionado alto valle',
    'sistemas vrf vrv neuquén',
    'lopardo servicios',
  ],
  metadataBase: new URL('https://lopardoservicios.com'),
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Lopardo Servicios | Climatización y Mantenimiento en Neuquén',
    description:
      'Soluciones integrales de climatización comercial e industrial en Neuquén y Alto Valle.',
    url: 'https://lopardoservicios.com',
    siteName: 'Lopardo Servicios',
    locale: 'es_AR',
    type: 'website',
  },
  icons: {
    icon: '/images/Circulo%20Logo.png',
    apple: '/images/Circulo%20Logo.png',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HVACBusiness',
  name: 'Lopardo Servicios Climatización',
  image: 'https://lopardoservicios.com/images/Circulo%20Logo.png',
  '@id': 'https://lopardoservicios.com',
  url: 'https://lopardoservicios.com',
  telephone: '+5492995177019',
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Taller Base',
    addressLocality: 'Neuquén',
    addressRegion: 'Neuquén',
    addressCountry: 'AR',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: -38.9516,
    longitude: -68.0591,
  },
  areaServed: [
    'Neuquén',
    'Cipolletti',
    'Plottier',
    'Centenario',
    'Añelo',
    'Alto Valle del Río Negro y Neuquén',
  ],
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '08:00',
    closes: '18:00',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} bg-surface`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
