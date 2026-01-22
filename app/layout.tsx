import './globals.css';
import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { Toaster } from '@/components/ui/toaster';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'La Cité Fleurie - Restaurant Pizzeria Lounge Bar à Onex, Genève',
    template: '%s | La Cité Fleurie',
  },
  description: 'Restaurant, Pizzeria et Lounge Bar à Onex, Genève. Savourez nos cuisines italienne et française, pizzas au feu de bois. Soirées musicales les vendredis et samedis. Réservation au 022 793 03 50.',
  keywords: [
    'restaurant Onex',
    'pizzeria Genève',
    'lounge bar Onex',
    'cuisine italienne Genève',
    'cuisine française Onex',
    'pizza feu de bois Genève',
    'restaurant Genève',
    'brunch Onex',
    'soirée musicale Genève',
    'La Cité Fleurie',
  ],
  authors: [{ name: 'La Cité Fleurie' }],
  creator: 'La Cité Fleurie',
  publisher: 'La Cité Fleurie',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://lacitefleurie.ch'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'La Cité Fleurie - Restaurant Pizzeria Lounge Bar à Onex',
    description: 'Restaurant, Pizzeria et Lounge Bar à Onex, Genève. Cuisines italienne et française, pizzas au feu de bois. Soirées musicales les vendredis et samedis.',
    url: 'https://lacitefleurie.ch',
    siteName: 'La Cité Fleurie',
    locale: 'fr_CH',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'La Cité Fleurie - Restaurant Pizzeria Lounge Bar',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'La Cité Fleurie - Restaurant Pizzeria Lounge Bar à Onex',
    description: 'Restaurant, Pizzeria et Lounge Bar à Onex, Genève. Cuisines italienne et française, pizzas au feu de bois.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  verification: {
    // google: 'votre-code-verification-google',
  },
  category: 'restaurant',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  name: 'La Cité Fleurie',
  image: 'https://lacitefleurie.ch/og-image.jpg',
  '@id': 'https://lacitefleurie.ch',
  url: 'https://lacitefleurie.ch',
  telephone: '+41227930350',
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Chemin de l\'Echo 3',
    addressLocality: 'Onex',
    postalCode: '1213',
    addressRegion: 'Genève',
    addressCountry: 'CH',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 46.1839,
    longitude: 6.1013,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Sunday'],
      opens: '12:00',
      closes: '22:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Friday', 'Saturday'],
      opens: '12:00',
      closes: '23:00',
    },
  ],
  servesCuisine: ['Italian', 'French', 'Pizza'],
  acceptsReservations: 'True',
  menu: 'https://lacitefleurie.ch/menu',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <Navigation />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
