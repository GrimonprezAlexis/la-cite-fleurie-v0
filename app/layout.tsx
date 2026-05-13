import './globals.css';
import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { Toaster } from '@/components/ui/toaster';
import { AnnouncementBanner } from '@/components/announcement-banner';

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
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      { url: '/apple-touch-icon-180x180.png', sizes: '180x180', type: 'image/png' },
      { url: '/apple-touch-icon-167x167.png', sizes: '167x167', type: 'image/png' },
      { url: '/apple-touch-icon-152x152.png', sizes: '152x152', type: 'image/png' },
    ],
  },
  verification: {
    // google: 'votre-code-verification-google',
  },
  category: 'restaurant',
};

const restaurantSchema = {
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  '@id': 'https://lacitefleurie.ch/#restaurant',
  name: 'La Cité Fleurie',
  alternateName: 'La Cité Fleurie - Restaurant Pizzeria Lounge Bar',
  description:
    'Restaurant, Pizzeria et Lounge Bar à Onex, Genève. Cuisines italienne et française, pizzas au feu de bois. Soirées musicales les vendredis et samedis.',
  image: [
    'https://lacitefleurie.ch/og-image.jpg',
  ],
  url: 'https://lacitefleurie.ch',
  telephone: '+41227930350',
  email: 'info@lacitefleurie.ch',
  priceRange: 'CHF 15-50',
  currenciesAccepted: 'CHF',
  paymentAccepted: 'Cash, Credit Card, Debit Card, Twint',
  address: {
    '@type': 'PostalAddress',
    streetAddress: "Chemin de l'Echo 3",
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
  hasMap: 'https://www.google.com/maps?q=Chemin+de+l%27Echo+3,+1213+Onex',
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      opens: '07:30',
      closes: '00:00',
    },
  ],
  servesCuisine: ['Italian', 'French', 'Pizza', 'Mediterranean'],
  acceptsReservations: 'True',
  menu: 'https://lacitefleurie.ch/menu',
  hasMenu: 'https://lacitefleurie.ch/menu',
  sameAs: [
    'https://www.facebook.com/p/La-Cit%C3%A9-Fleurie-100063631886817/',
  ],
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://lacitefleurie.ch/#website',
  url: 'https://lacitefleurie.ch',
  name: 'La Cité Fleurie',
  inLanguage: 'fr-CH',
  publisher: {
    '@id': 'https://lacitefleurie.ch/#restaurant',
  },
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className={inter.className}>
        <AnnouncementBanner />
        <Navigation />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
