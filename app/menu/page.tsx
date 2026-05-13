import { getAdminDb } from '@/lib/firebase-admin';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Image as ImageIcon, ExternalLink, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const revalidate = 300;

type MenuItem = {
  id: string;
  title: string;
  description?: string;
  file_type: string;
  file_url: string;
  storage_path: string;
  display_order?: number;
};

async function getMenuItems(): Promise<MenuItem[]> {
  try {
    const db = getAdminDb();
    const snap = await db
      .collection('menu_items')
      .orderBy('display_order', 'asc')
      .get();
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<MenuItem, 'id'>) }));
  } catch (e) {
    console.error('menu fetch error:', e);
    return [];
  }
}

const isPDF = (t: string) => t === 'application/pdf';
const isImage = (t: string) => t.startsWith('image/');

export default async function MenuPage() {
  const menuItems = await getMenuItems();

  const menuSchema = {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    name: 'Menu La Cité Fleurie',
    inLanguage: 'fr-CH',
    url: 'https://lacitefleurie.ch/menu',
    provider: {
      '@id': 'https://lacitefleurie.ch/#restaurant',
    },
    hasMenuSection: menuItems.map((item) => ({
      '@type': 'MenuSection',
      name: item.title,
      ...(item.description ? { description: item.description } : {}),
    })),
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(menuSchema) }}
      />
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-block bg-[#d3cbc2]/10 px-6 py-2 rounded-full mb-6 animate-scale-in">
            <span className="text-[#b8af9f] font-semibold">Nos Spécialités</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 animate-slide-up">
            Notre Menu
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#d3cbc2] to-transparent mx-auto mb-6"></div>
          <p
            className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed animate-slide-up"
            style={{ animationDelay: '0.2s' }}
          >
            Découvrez notre sélection de plats italiens et français, ainsi que nos pizzas au feu de bois.
          </p>
        </div>

        {menuItems.length === 0 ? (
          <div className="text-center py-20 animate-scale-in">
            <div className="w-24 h-24 bg-gradient-to-br from-[#d3cbc2] to-[#b8af9f] rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl animate-float">
              <FileText className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Menu en préparation</h2>
            <p className="text-lg text-gray-600 mb-6">
              Notre menu sera bientôt disponible en ligne.
            </p>
            <p className="text-gray-600 mb-8">
              Pour plus d&apos;informations, contactez-nous au{' '}
              <a
                href="tel:+41227930350"
                className="text-[#d3cbc2] hover:text-[#b8af9f] font-semibold transition-colors"
              >
                022 793 03 50
              </a>
            </p>
            <a href="tel:+41227930350">
              <Button
                size="lg"
                className="bg-[#d3cbc2] hover:bg-[#b8af9f] text-gray-900 font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                Nous Contacter
              </Button>
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-animation">
            {menuItems.map((item, index) => (
              <Card
                key={item.id}
                className="overflow-hidden hover-lift border-none shadow-xl group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-0">
                  {isImage(item.file_type) ? (
                    <div className="relative h-72 w-full overflow-hidden">
                      <img
                        src={item.file_url}
                        alt={`${item.title} - Menu La Cité Fleurie`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  ) : isPDF(item.file_type) ? (
                    <div className="h-72 bg-gradient-to-br from-[#d3cbc2]/20 to-[#b8af9f]/20 flex items-center justify-center relative overflow-hidden">
                      <FileText
                        className="w-24 h-24 text-[#d3cbc2] relative z-10 group-hover:scale-110 transition-transform duration-300"
                        aria-hidden="true"
                      />
                    </div>
                  ) : (
                    <div className="h-72 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <ImageIcon className="w-24 h-24 text-gray-400" aria-hidden="true" />
                    </div>
                  )}

                  <div className="p-6 bg-white">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-[#d3cbc2] transition-colors">
                      {item.title}
                    </h2>
                    {item.description && (
                      <p className="text-gray-600 mb-4 leading-relaxed">{item.description}</p>
                    )}

                    <a
                      href={`/api/view-menu?key=${encodeURIComponent(item.storage_path)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Consulter ${item.title}`}
                    >
                      <Button className="w-full bg-gradient-to-r from-[#d3cbc2] to-[#b8af9f] hover:from-[#b8af9f] hover:to-[#d3cbc2] text-gray-900 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                        <ExternalLink className="w-5 h-5 mr-2" aria-hidden="true" />
                        {isPDF(item.file_type) ? 'Consulter le PDF' : 'Voir en grand'}
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-20 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-10 text-center border border-gray-100 animate-scale-in">
          <div className="w-16 h-16 bg-gradient-to-br from-[#d3cbc2] to-[#b8af9f] rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl animate-float">
            <Sparkles className="w-8 h-8 text-white" aria-hidden="true" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Vous avez des questions ?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Notre équipe se fera un plaisir de répondre à vos questions sur notre carte et nos spécialités.
          </p>
          <a href="tel:+41227930350">
            <Button
              size="lg"
              className="bg-[#d3cbc2] hover:bg-[#b8af9f] text-gray-900 font-semibold text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              Nous Appeler
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
