import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Horaires d\'ouverture',
  description: 'Consultez nos horaires d\'ouverture. Restaurant La Cité Fleurie à Onex, Genève. Ouvert 7j/7 pour le déjeuner, dîner et brunch.',
  openGraph: {
    title: 'Horaires - La Cité Fleurie',
    description: 'Consultez nos horaires d\'ouverture. Ouvert 7j/7 pour le déjeuner, dîner et brunch.',
    url: 'https://lacitefleurie.ch/horaires',
  },
};

export default function HorairesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
