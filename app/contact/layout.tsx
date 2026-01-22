import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact & Réservation',
  description: 'Contactez-nous ou réservez une table au 022 793 03 50. Restaurant La Cité Fleurie, Chemin de l\'Echo 3, 1213 Onex, Genève.',
  openGraph: {
    title: 'Contact - La Cité Fleurie',
    description: 'Contactez-nous ou réservez une table. Restaurant La Cité Fleurie à Onex, Genève.',
    url: 'https://lacitefleurie.ch/contact',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
