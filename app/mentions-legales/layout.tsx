import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mentions légales',
  description:
    "Mentions légales et politique de confidentialité de La Cité Fleurie, Restaurant Pizzeria Lounge Bar à Onex, Genève.",
  alternates: {
    canonical: '/mentions-legales',
  },
  openGraph: {
    title: 'Mentions légales - La Cité Fleurie',
    description: 'Mentions légales et politique de confidentialité.',
    url: 'https://lacitefleurie.ch/mentions-legales',
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function MentionsLegalesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
