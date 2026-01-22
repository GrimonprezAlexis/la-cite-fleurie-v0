import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Notre Menu',
  description: 'Découvrez notre carte : pizzas au feu de bois, plats italiens et français, desserts maison. Restaurant La Cité Fleurie à Onex, Genève.',
  openGraph: {
    title: 'Menu - La Cité Fleurie',
    description: 'Découvrez notre carte : pizzas au feu de bois, plats italiens et français, desserts maison.',
    url: 'https://lacitefleurie.ch/menu',
  },
};

export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
