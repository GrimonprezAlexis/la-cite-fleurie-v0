'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, Image as ImageIcon, Download, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState<{ url: string; type: string; name: string } | null>(null);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  async function fetchMenuItems() {
    try {
      const q = query(collection(db, 'menu_items'), orderBy('display_order', 'asc'));
      const querySnapshot = await getDocs(q);
      const items = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMenuItems(items);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    } finally {
      setLoading(false);
    }
  }

  const isPDF = (fileType: string) => fileType === 'application/pdf';
  const isImage = (fileType: string) => fileType.startsWith('image/');

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-block bg-[#d3cbc2]/10 px-6 py-2 rounded-full mb-6 animate-scale-in">
            <span className="text-[#b8af9f] font-semibold">Nos Spécialités</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 animate-slide-up">
            Notre Menu
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#d3cbc2] to-transparent mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{animationDelay: '0.2s'}}>
            Découvrez notre sélection de plats italiens et français, ainsi que nos pizzas au feu de bois.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-0">
                  <Skeleton className="h-64 w-full" />
                  <div className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-3" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : menuItems.length === 0 ? (
          <div className="text-center py-20 animate-scale-in">
            <div className="w-24 h-24 bg-gradient-to-br from-[#d3cbc2] to-[#b8af9f] rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl animate-float">
              <FileText className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Menu en préparation</h2>
            <p className="text-lg text-gray-600 mb-6">Notre menu sera bientôt disponible en ligne.</p>
            <p className="text-gray-600 mb-8">
              Pour plus d&apos;informations, contactez-nous au{' '}
              <a href="tel:+41227930350" className="text-[#d3cbc2] hover:text-[#b8af9f] font-semibold transition-colors">
                +41 22 793 03 50
              </a>
            </p>
            <a href="tel:+41227930350">
              <Button size="lg" className="bg-[#d3cbc2] hover:bg-[#b8af9f] text-gray-900 font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
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
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <CardContent className="p-0">
                  {isImage(item.file_type) ? (
                    <div className="relative h-72 w-full overflow-hidden">
                      <img
                        src={item.file_url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  ) : isPDF(item.file_type) ? (
                    <div className="h-72 bg-gradient-to-br from-[#d3cbc2]/20 to-[#b8af9f]/20 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2QzY2JjMiIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
                      <FileText className="w-24 h-24 text-[#d3cbc2] relative z-10 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  ) : (
                    <div className="h-72 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <ImageIcon className="w-24 h-24 text-gray-400 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  )}

                  <div className="p-6 bg-white">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-[#d3cbc2] transition-colors">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-gray-600 mb-4 leading-relaxed">{item.description}</p>
                    )}

                    <Button
                      className="w-full bg-gradient-to-r from-[#d3cbc2] to-[#b8af9f] hover:from-[#b8af9f] hover:to-[#d3cbc2] text-gray-900 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                      onClick={async () => {
                        try {
                          const res = await fetch(`/api/get-menu-url?key=${encodeURIComponent(item.storage_path)}`);
                          const data = await res.json();
                          if (data.url) {
                            setPreview({ url: data.url, type: item.file_type, name: item.file_name });
                          } else {
                            alert('Impossible de générer le lien sécurisé');
                          }
                        } catch (err) {
                          alert('Impossible de générer le lien sécurisé');
                        }
                      }}
                    >
                      <Download className="w-5 h-5 mr-2" />
                      {isPDF(item.file_type) ? 'Télécharger le PDF' : 'Voir en grand'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Modal de prévisualisation */}
        <Dialog open={!!preview} onOpenChange={(open) => !open && setPreview(null)}>
          <DialogContent className="max-w-2xl w-full">
            <DialogHeader>
              <DialogTitle>Prévisualisation du menu</DialogTitle>
              <DialogDescription>{preview?.name}</DialogDescription>
            </DialogHeader>
            {preview?.type?.startsWith('image/') ? (
              <img src={preview.url} alt={preview.name} className="w-full max-h-[70vh] object-contain rounded" />
            ) : preview?.type === 'application/pdf' ? (
              <iframe src={preview.url} title={preview.name} className="w-full min-h-[70vh] rounded" />
            ) : (
              <div className="text-center text-gray-500">Type de fichier non supporté</div>
            )}
          </DialogContent>
        </Dialog>

        <div className="mt-20 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-10 text-center border border-gray-100 animate-scale-in">
          <div className="w-16 h-16 bg-gradient-to-br from-[#d3cbc2] to-[#b8af9f] rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl animate-float">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Vous avez des questions ?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Notre équipe se fera un plaisir de répondre à vos questions sur notre carte et nos spécialités.
          </p>
          <a href="tel:+41227930350">
            <Button size="lg" className="bg-[#d3cbc2] hover:bg-[#b8af9f] text-gray-900 font-semibold text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              Nous Appeler
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
